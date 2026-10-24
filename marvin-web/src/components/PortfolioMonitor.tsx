import { useState } from "react";
import { experience, portfolioLabels, tabs, type PortfolioTab } from "../data/portfolio";
import { ContactPanel } from "./ContactPanel";
import { PortfolioGallery } from "./PortfolioGallery";
import { PortfolioTabs } from "./PortfolioTabs";

export function PortfolioMonitor() {
  const [tab, setTab] = useState<PortfolioTab>("portraits");
  return (
    <div className="camera-wall">
      <div className="camera" aria-hidden="true">
        <span className="camera-dot" />
        <div className="lens"><i /></div>
        <span>LOOK HERE</span>
      </div>
      <div className="monitor-shell">
        <div className="monitor-screen">
          <div className="screen-header">
            <span className="screen-wordmark">marvin<span aria-hidden="true">✳</span></span>
            <span className="screen-tag">{portfolioLabels.tagline}</span>
          </div>
          <PortfolioTabs selected={tab} onSelect={setTab} />
          <div id="panel-portraits" role="tabpanel" tabIndex={0}
            aria-labelledby="tab-portraits" hidden={tab !== "portraits"} className="panel portraits-panel">
            <PortfolioGallery />
          </div>
          <div id="panel-experience" role="tabpanel" tabIndex={0}
            aria-labelledby="tab-experience" hidden={tab !== "experience"} className="panel experience-panel">
            <div>
              <p className="eyebrow">A MOMENT, JUST FOR YOU</p>
              <h2>{experience.heading}</h2>
              <p>{experience.description}</p>
            </div>
            <ol className="experience-steps">
              {experience.steps.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div id="panel-hello" role="tabpanel" tabIndex={0}
            aria-labelledby="tab-hello" hidden={tab !== "hello"} className="panel contact-panel">
            <ContactPanel />
          </div>
          <footer className="screen-footer">
            <span>{portfolioLabels.contentNotice}</span>
            <span aria-hidden="true">0{tabs.findIndex((item) => item.id === tab) + 1} — 0{tabs.length}</span>
          </footer>
        </div>
        <div className="monitor-base">
          <span>MARVIN STUDIO / MEMORY MAKER</span><i aria-hidden="true" />
        </div>
      </div>
      <div className="console" aria-hidden="true">
        <span>GOOD TIMES, ON REPEAT.</span><div />
      </div>
    </div>
  );
}
