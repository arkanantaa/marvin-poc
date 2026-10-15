import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useEntranceMedia } from "../hooks/useEntranceMedia";
import { asset, mediaManifest } from "../lib/mediaManifest";
import { timeline } from "../lib/timeline";
import { PortfolioMonitor } from "./PortfolioMonitor";
export function EntranceJourney({
  homeRef,
}: {
  homeRef: RefObject<HTMLAnchorElement | null>;
}) {
  const journey = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null),
    surface = useRef<HTMLDivElement>(null),
    white = useRef<HTMLDivElement>(null),
    work = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [initialDirect] = useState(() => location.hash === "#work");
  const direct = useRef(initialDirect);
  const media = useEntranceMedia(
    mediaManifest.approved && !reduced && !initialDirect,
  );
  const { video } = media;
  useEffect(() => {
    let raf = 0,
      timer = 0,
      active = false;
    const range = () =>
      Math.max(1, (journey.current?.offsetHeight ?? 0) - innerHeight);
    const render = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, scrollY / range()));
      const state = timeline(
        direct.current || (reduced && p > 0) ? 1 : p,
        media.video.current?.duration,
      );
      media.seek(
        state.time,
        p > 0.08 && p < 0.86 && !direct.current && !reduced,
      );
      if (
        mediaManifest.approved &&
        media.hasFailed() &&
        p > 0.08 &&
        !direct.current
      ) {
        direct.current = true;
        window.scrollTo({ top: range(), behavior: "instant" });
        schedule();
        return;
      }
      if (surface.current)
        surface.current.style.opacity = String(1 - state.white);
      if (white.current)
        white.current.style.opacity = String(state.white * (1 - state.monitor));
      if (work.current) {
        work.current.style.opacity = String(state.monitor);
        if (!state.interactive && work.current.contains(document.activeElement))
          homeRef.current?.focus({ preventScroll: true });
        work.current.inert = !state.interactive;
        work.current.setAttribute("aria-hidden", String(!state.interactive));
        active = state.interactive;
      }
      if (stage.current) stage.current.dataset.active = String(active);
      if (
        mediaManifest.approved &&
        p > 0.08 &&
        p < 0.86 &&
        !media.hasFailed() &&
        !direct.current
      )
        timer = window.setTimeout(schedule, 100);
    };
    function schedule() {
      clearTimeout(timer);
      if (!raf) raf = requestAnimationFrame(render);
    }
    const navigate = () => {
      direct.current = location.hash === "#work";
      window.scrollTo({
        top: direct.current ? range() : 0,
        behavior: "instant",
      });
      render();
      if (direct.current)
        work.current
          ?.querySelector<HTMLButtonElement>("[role=tab]")
          ?.focus({ preventScroll: true });
      else homeRef.current?.focus({ preventScroll: true });
    };
    const onScroll = () => {
      if (direct.current && scrollY < range() - 2) direct.current = false;
      schedule();
    };
    const onResize = () => {
      if (direct.current)
        window.scrollTo({ top: range(), behavior: "instant" });
      schedule();
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        ".site-header a",
      );
      if (
        !link ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      navigate();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("hashchange", navigate);
    addEventListener("pageshow", schedule);
    addEventListener("click", onClick);
    if (direct.current) navigate();
    else if (reduced && scrollY > 0) {
      direct.current = true;
      window.scrollTo({ top: range(), behavior: "instant" });
      render();
    } else render();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("hashchange", navigate);
      removeEventListener("pageshow", schedule);
      removeEventListener("click", onClick);
    };
  }, [reduced, homeRef, media]);
  return (
    <section
      className="journey"
      ref={journey}
      aria-label="Marvin photobooth entrance"
    >
      <div className="stage" ref={stage} data-active={initialDirect}>
        <div className="media-surface" ref={surface}>
          <img
            src={asset(mediaManifest.poster)}
            width={1920}
            height={1080}
            alt="Marvin cream and chrome photobooth with portrait prints and one golden-yellow curtain"
            fetchPriority="high"
          />
          <video
            ref={video}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <div className="white-transition" ref={white} aria-hidden="true" />
        <section
          id="work"
          className="work-scene"
          ref={work}
          inert={!initialDirect}
          aria-hidden={!initialDirect}
          aria-label="Portfolio monitor"
        >
          <PortfolioMonitor />
        </section>
      </div>
    </section>
  );
}
