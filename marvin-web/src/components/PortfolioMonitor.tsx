import { useEffect, useRef } from "react";
import { closing, social, whatsappLink } from "../data/portfolio";
import { useSelfie } from "../hooks/useSelfie";
import { asset } from "../lib/assets";
import { leaveEvent } from "../lib/sections";
import { PortfolioGallery } from "./PortfolioGallery";
import { PrintSlot, SelfieButton } from "./SelfiePrinter";

// Inside the booth. You first face the back wall, then turn left to the wall where
// the monitor hangs, with the camera above it and the console (selfie button and
// print slot) below.
// Scrolling further leads to the closing section.
export function PortfolioMonitor() {
  const { prints, flash, snap } = useSelfie();
  // Marks which way the room ends up facing once the turn has finished
  // ("monitor" or "door"), so anything that needs the settled view can wait for it.
  const room = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = room.current;
    if (!element) return;
    const turning = (event: TransitionEvent) => { if (event.target === element) element.dataset.facing = "turning"; };
    const settled = (event: TransitionEvent) => {
      if (event.target !== element) return;
      element.dataset.facing = element.closest<HTMLElement>(".work-scene")?.dataset.turned === "true" ? "monitor" : "door";
    };
    element.addEventListener("transitionrun", turning);
    element.addEventListener("transitionend", settled);
    return () => { element.removeEventListener("transitionrun", turning); element.removeEventListener("transitionend", settled); };
  }, []);
  return (
    <>
      <div className="interior">
        <div className="room-view">
          <div className="room" ref={room}>
            <div className="room-face room-ceiling" aria-hidden="true" />
            <div className="room-face room-floor" aria-hidden="true" />
            <div className="room-face room-back" aria-hidden="true" />
            <div className="room-face room-left">
              <div className="monitor-mount">
                {/* A slim, modern display: thin aluminium edge, black glass bezel with the
                    camera set into it, and the portfolio on the screen. */}
                <div className="monitor-shell">
                  <div className="monitor-bezel">
                    <div className="camera" aria-hidden="true" data-snap={flash}>
                      <span className="camera-dot" />
                      <span className="lens" />
                    </div>
                    <div className="monitor-screen">
                      <div className="screen-header">
                        <img className="screen-logo" src={asset("textures/marvin-wordmark.png")} alt="Marvin" width={1098} height={227} />
                      </div>
                      <PortfolioGallery />
                    </div>
                  </div>
                </div>
                <div className="console">
                  <SelfieButton onSnap={snap} />
                  <PrintSlot prints={prints} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* A backlit EXIT sign mounted on the wall, made like the monitor and the
            console (black glass, thin aluminium edge, the yellow of the shutter key).
            It appears once you have turned to the monitor, and leads back out. */}
        <button type="button" className="exit-sign" onClick={() => window.dispatchEvent(new Event(leaveEvent))}
          aria-label="Exit the booth">
          <span className="exit-door" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M14 4h4v16h-4" /><path d="M10 12H3" /><path d="M6 8.5 2.5 12 6 15.5" /></svg>
          </span>
          <span className="exit-word" aria-hidden="true">Exit</span>
        </button>
        {flash > 0 && <div className="camera-flash" key={flash} aria-hidden="true" />}
        <p className="sr-only" role="status">{prints.some(print => !print.closing) ? "Your photo is printing." : ""}</p>
      </div>
      <div className="after">
        <section id="hello" className="closing" aria-labelledby="closing-title">
          <h2 id="closing-title" tabIndex={-1}>
            <a className="closing-book" href={whatsappLink ?? undefined} target="_blank" rel="noopener noreferrer">
              <span className="stack-main"><span className="closing-mark">{closing.book}</span> <span aria-hidden="true">↗</span></span>{" "}
              <span className="stack-sub">{closing.bookNote}</span>
            </a>
          </h2>
          <ul className="closing-social">
            <li>
              <a href={social.instagram}
                target="_blank" rel="noopener noreferrer" aria-label="Marvin on Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" className="fill" /></svg>
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href={social.tiktok}
                target="_blank" rel="noopener noreferrer" aria-label="Marvin on TikTok">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a3.8 3.8 0 1 1-3.8-3.8" /><path d="M14 3c.6 2.8 2.6 4.6 5.5 4.8" /></svg>
                <span>TikTok</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
