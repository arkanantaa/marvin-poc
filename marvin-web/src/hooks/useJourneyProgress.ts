import { useEffect, useRef, useState, type RefObject } from "react";
import { clamp, createSceneProgress, timeline } from "../lib/timeline";
import { useReducedMotion } from "./useReducedMotion";

export function useJourneyProgress(home: RefObject<HTMLAnchorElement | null>) {
  const journey = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const white = useRef<HTMLDivElement>(null);
  const work = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [initialDirect] = useState(() => location.hash === "#work");
  const [sceneAllowed, setSceneAllowed] = useState(!initialDirect);
  const [sceneProgress] = useState(createSceneProgress);
  const direct = useRef(initialDirect);
  const initialized = useRef(false);

  useEffect(() => {
    let frame = 0;
    const range = () => Math.max(1, (journey.current?.offsetHeight ?? 0) - (stage.current?.offsetHeight ?? innerHeight));
    let previousRange = range();
    function schedule() {
      if (!frame) frame = requestAnimationFrame(render);
    }
    function render() {
      frame = 0;
      const progress = clamp(scrollY / range());
      const state = timeline(direct.current || (reduced && progress > 0) ? 1 : progress);
      sceneProgress.set(state.progress);
      if (surface.current) surface.current.style.opacity = String(1 - state.white);
      if (white.current) white.current.style.opacity = String(state.white * (1 - state.monitor));
      if (work.current) {
        if (!state.interactive && work.current.contains(document.activeElement))
          home.current?.focus({ preventScroll: true });
        work.current.style.opacity = String(state.monitor);
        work.current.style.transform = state.interactive ? "none" : `translateY(${Math.min(0, scrollY - range())}px)`;
        work.current.dataset.active = String(state.interactive);
        work.current.inert = !state.interactive;
        work.current.setAttribute("aria-hidden", String(!state.interactive));
      }
      if (stage.current) {
        stage.current.dataset.active = String(state.interactive);
        stage.current.dataset.phase = state.phase;
      }
    }
    const navigate = () => {
      direct.current = location.hash === "#work";
      setSceneAllowed(!direct.current);
      window.scrollTo({ top: direct.current ? range() : 0, behavior: "instant" });
      render();
      if (direct.current)
        work.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')?.focus({ preventScroll: true });
      else home.current?.focus({ preventScroll: true });
    };
    const onScroll = () => {
      if (direct.current && scrollY < range() - 2) {
        direct.current = false;
        setSceneAllowed(true);
      }
      if (reduced && !direct.current && scrollY > 0) {
        direct.current = true;
        setSceneAllowed(false);
        window.scrollTo({ top: range(), behavior: "instant" });
      }
      schedule();
    };
    const onResize = () => {
      const nextRange = range();
      const nextTop = direct.current || scrollY >= previousRange
        ? nextRange + Math.max(0, scrollY - previousRange) : scrollY / previousRange * nextRange;
      previousRange = nextRange;
      window.scrollTo({ top: nextTop, behavior: "instant" });
      schedule();
    };
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>(".site-header a") : null;
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      navigate();
    };
    const onPageShow = () => {
      if (initialDirect && location.hash === "#work") {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(navigate);
      } else schedule();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("hashchange", navigate);
    addEventListener("pageshow", onPageShow);
    addEventListener("click", onClick);
    if (!initialized.current && direct.current) navigate();
    else if (reduced && scrollY > 0 && !direct.current) {
      direct.current = true;
      setSceneAllowed(false);
      window.scrollTo({ top: range(), behavior: "instant" });
      render();
    } else render();
    initialized.current = true;
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("hashchange", navigate);
      removeEventListener("pageshow", onPageShow);
      removeEventListener("click", onClick);
    };
  }, [home, reduced, initialDirect, sceneProgress]);
  return { journey, stage, surface, white, work, initialDirect, sceneProgress, sceneEnabled: sceneAllowed && !reduced };
}
