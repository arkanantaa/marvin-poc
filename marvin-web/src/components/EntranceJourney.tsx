import type { RefObject } from "react";
import { useJourneyProgress } from "../hooks/useJourneyProgress";
import { BoothScene } from "./BoothScene";
import { PortfolioMonitor } from "./PortfolioMonitor";

export function EntranceJourney({ homeRef }: {
  homeRef: RefObject<HTMLAnchorElement | null>;
}) {
  const { journey, stage, surface, work, initialDirect, sceneProgress, sceneEnabled } = useJourneyProgress(homeRef);
  return (
    <>
      <section id="home" className="journey" ref={journey} aria-label="Marvin photobooth entrance">
        <div className="stage" ref={stage} data-active={initialDirect}>
          <BoothScene surfaceRef={surface} progress={sceneProgress} enabled={sceneEnabled} />
        </div>
      </section>
      <section id="work" className="work-scene" ref={work} data-active={initialDirect}
        inert={!initialDirect} aria-hidden={!initialDirect} aria-label="Portfolio monitor">
        <PortfolioMonitor />
      </section>
    </>
  );
}
