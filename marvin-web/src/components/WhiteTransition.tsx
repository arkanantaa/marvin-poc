import type { RefObject } from "react";

export function WhiteTransition({ layerRef }: { layerRef: RefObject<HTMLDivElement | null> }) {
  return <div className="white-transition" ref={layerRef} aria-hidden="true" />;
}
