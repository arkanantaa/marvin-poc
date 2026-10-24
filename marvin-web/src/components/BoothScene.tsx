import { useEffect, useRef, type RefObject } from "react";
import { asset, boothPoster } from "../lib/assets";
import type { SceneProgress } from "../lib/timeline";

export function BoothScene({ surfaceRef, progress, enabled }: {
  surfaceRef: RefObject<HTMLDivElement | null>;
  progress: SceneProgress;
  enabled: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (!container || !enabled) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let unsubscribe: (() => void) | undefined;
    container.dataset.renderer = "loading";
    // Keep Three.js off direct-entry and reduced-motion routes altogether.
    void import("../scene/createBoothScene").then(({ createBoothScene }) => {
      if (cancelled) return;
      const scene = createBoothScene(container, progress.get());
      dispose = scene.dispose;
      unsubscribe = progress.subscribe(scene.setProgress);
    }).catch(() => {
      if (!cancelled) container.dataset.renderer = "fallback";
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
      dispose?.();
      container.dataset.renderer = "fallback";
    };
  }, [enabled, progress]);
  return (
    <div className="media-surface booth-surface" ref={surfaceRef}>
      <div className="booth-renderer" ref={host} data-renderer="fallback" role="img"
        aria-label="Three-dimensional Marvin photobooth with the supplied studio logo, recessed stainless printer, portrait display, and soft olive velvet curtain on the right">
        <img className="booth-poster" src={asset(boothPoster.src)}
          width={boothPoster.width} height={boothPoster.height} alt="" fetchPriority="high" />
      </div>
    </div>
  );
}
