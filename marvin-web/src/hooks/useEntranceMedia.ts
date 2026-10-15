import { useEffect, useRef, useMemo } from "react";
import { asset, mediaManifest } from "../lib/mediaManifest";
import { seekLatest } from "../lib/seekController";
export function useEntranceMedia(enabled: boolean) {
  const video = useRef<HTMLVideoElement>(null);
  const state = useRef({
    target: 0,
    ready: false,
    failed: false,
    frame: false,
    intentAt: 0,
    usefulAt: 0,
  });
  useEffect(() => {
    const el = video.current;
    const currentState = state.current;
    if (!el || !enabled) return;
    Object.assign(state.current, {
      ready: false,
      failed: false,
      frame: false,
      intentAt: 0,
      usefulAt: 0,
    });
    const seek = () => {
      const s = state.current;
      s.ready = true;
      s.usefulAt = performance.now();
      s.frame = el.readyState >= 2;
      seekLatest(el, s);
    };
    const fail = () => {
      state.current.failed = true;
      state.current.frame = false;
    };
    el.addEventListener("loadeddata", seek);
    el.addEventListener("seeked", seek);
    el.addEventListener("error", fail);
    el.src = asset(mediaManifest.source);
    el.load();
    return () => {
      el.removeEventListener("loadeddata", seek);
      el.removeEventListener("seeked", seek);
      el.removeEventListener("error", fail);
      el.pause();
      el.removeAttribute("src");
      el.load();
      currentState.ready = false;
      currentState.frame = false;
    };
  }, [enabled]);
  return useMemo(
    () => ({
      video,
      hasFailed: () => state.current.failed,
      seek(time: number, intent: boolean) {
        const el = video.current,
          s = state.current,
          now = performance.now();
        if (intent && !s.intentAt) s.intentAt = now;
        if (
          intent &&
          now - Math.max(s.intentAt, s.usefulAt) >
            mediaManifest.stallDeadline &&
          (!s.ready || el?.seeking)
        ) {
          s.failed = true;
          s.frame = false;
        }
        s.target = time;
        if (el) el.style.opacity = s.frame && !s.failed ? "1" : "0";
        if (el) seekLatest(el, s);
      },
    }),
    [],
  );
}
