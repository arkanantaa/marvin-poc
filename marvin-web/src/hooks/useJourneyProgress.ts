import { useEffect, useRef, useState, type RefObject } from "react";
import { clamp, createSceneProgress, timeline } from "../lib/timeline";
import { useReducedMotion } from "./useReducedMotion";

export function useJourneyProgress(home: RefObject<HTMLAnchorElement | null>) {
  const journey = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const work = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [initialDirect] = useState(() => location.hash === "#work");
  const [sceneAllowed, setSceneAllowed] = useState(!initialDirect);
  const [sceneProgress] = useState(createSceneProgress);
  const direct = useRef(initialDirect);
  const initialized = useRef(false);

  useEffect(() => {
    let frame = 0;
    let transition = 0;
    let transitionTarget = -1;
    let wheelIntent = 0;
    let lastWheel = 0;
    let ignoreWheelUntil = 0;
    let touchStart: { x: number; y: number } | null = null;
    const range = () => Math.max(1, (journey.current?.offsetHeight ?? 0) - (stage.current?.offsetHeight ?? innerHeight));
    let previousRange = range();
    function schedule() {
      if (!frame) frame = requestAnimationFrame(render);
    }
    function render() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      const progress = clamp(scrollY / range());
      const state = timeline(direct.current || (reduced && progress > 0) ? 1 : progress);
      sceneProgress.set(state.progress);
      // Keep the booth beneath the incoming portfolio throughout the dissolve;
      // fading both layers out would expose a bright, empty background.
      if (surface.current) surface.current.style.opacity = "1";
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
    function cancelTransition() {
      cancelAnimationFrame(transition);
      transition = 0;
      transitionTarget = -1;
    }
    function playTransition(forward: boolean) {
      const destination = forward ? 1 : 0;
      if (transition && transitionTarget === destination) return;
      cancelTransition();
      direct.current = false;
      setSceneAllowed(true);
      const start = clamp(scrollY / range());
      const started = performance.now();
      const duration = reduced ? 0 : Math.max(700, 3600 * Math.abs(destination - start));
      transitionTarget = destination;
      function step(now: number) {
        const elapsed = duration === 0 ? 1 : clamp((now - started) / duration);
        const eased = elapsed * elapsed * (3 - 2 * elapsed);
        window.scrollTo({ top: (start + (destination - start) * eased) * range(), behavior: "instant" });
        render();
        if (elapsed < 1) transition = requestAnimationFrame(step);
        else {
          transition = 0;
          transitionTarget = -1;
          ignoreWheelUntil = now + 220;
          if (forward) work.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')?.focus({ preventScroll: true });
          else home.current?.focus({ preventScroll: true });
        }
      }
      transition = requestAnimationFrame(step);
    }
    const handlesDirection = (down: boolean) => down ? scrollY < range() - 2 : scrollY <= range() + 2 && scrollY > 0;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return;
      const now = performance.now();
      if (now < ignoreWheelUntil) { event.preventDefault(); return; }
      const down = event.deltaY > 0;
      if (!transition && !handlesDirection(down)) return;
      event.preventDefault();
      if (transition) { playTransition(down); return; }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (now - lastWheel > 180 || Math.sign(delta) !== Math.sign(wheelIntent)) wheelIntent = 0;
      lastWheel = now;
      wheelIntent += delta;
      if (Math.abs(wheelIntent) >= 10) { wheelIntent = 0; playTransition(down); }
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touchStart || event.touches.length !== 1) return;
      const dx = touchStart.x - event.touches[0].clientX;
      const dy = touchStart.y - event.touches[0].clientY;
      if (Math.abs(dy) < 12 || Math.abs(dx) > Math.abs(dy)) return;
      if (!transition && !handlesDirection(dy > 0)) return;
      event.preventDefault();
      playTransition(dy > 0);
    };
    const onTouchEnd = () => { touchStart = null; };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || target?.isContentEditable
        || target?.matches("input, textarea, select, [role='tab']")) return;
      const down = event.key === "PageDown" || event.key === "ArrowDown" || event.key === " " && !event.shiftKey;
      const up = event.key === "PageUp" || event.key === "ArrowUp" || event.key === " " && event.shiftKey;
      if (!(down || up) || !transition && !handlesDirection(down)) return;
      event.preventDefault();
      playTransition(down);
    };
    const navigate = () => {
      cancelTransition();
      ignoreWheelUntil = 0;
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
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("touchend", onTouchEnd);
    addEventListener("touchcancel", onTouchEnd);
    addEventListener("keydown", onKeyDown);
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
      cancelTransition();
      removeEventListener("scroll", onScroll);
      removeEventListener("wheel", onWheel);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("touchend", onTouchEnd);
      removeEventListener("touchcancel", onTouchEnd);
      removeEventListener("keydown", onKeyDown);
      removeEventListener("resize", onResize);
      removeEventListener("hashchange", navigate);
      removeEventListener("pageshow", onPageShow);
      removeEventListener("click", onClick);
    };
  }, [home, reduced, initialDirect, sceneProgress]);
  return { journey, stage, surface, work, initialDirect, sceneProgress, sceneEnabled: sceneAllowed && !reduced };
}
