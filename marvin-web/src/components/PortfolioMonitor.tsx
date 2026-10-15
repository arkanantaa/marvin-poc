import { useRef, useState, type KeyboardEvent } from "react";
import { collections, imageAlts, tabs } from "../data/portfolio";
import { asset } from "../lib/mediaManifest";
import { wrap } from "../lib/timeline";
function Portrait({ index }: { index: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <figure className="print">
      {broken ? (
        <div
          className="image-fallback"
          role="img"
          aria-label={imageAlts[index - 1]}
        >
          Portrait unavailable
        </div>
      ) : (
        <img
          src={asset(`portfolio/portrait-${index}.webp`)}
          alt={imageAlts[index - 1]}
          width={300}
          height={360}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      )}
      <figcaption>
        marvin studio <span aria-hidden="true">✳</span>
      </figcaption>
    </figure>
  );
}
export function PortfolioMonitor() {
  const [tab, setTab] = useState(0),
    [collection, setCollection] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const current = collections[collection];
  function keydown(event: KeyboardEvent, index: number) {
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 2
          : event.key === "ArrowRight"
            ? wrap(index + 1, 3)
            : event.key === "ArrowLeft"
              ? wrap(index - 1, 3)
              : null;
    if (next === null) return;
    event.preventDefault();
    setTab(next);
    buttons.current[next]?.focus();
  }
  return (
    <div className="camera-wall">
      <div className="camera" aria-hidden="true">
        <span className="camera-dot" />
        <div className="lens">
          <i />
        </div>
        <span>LOOK HERE</span>
      </div>
      <div className="monitor-shell">
        <div className="monitor-screen">
          <div className="screen-header">
            <span className="screen-wordmark">
              marvin<span aria-hidden="true">✳</span>
            </span>
            <span className="screen-tag">A LITTLE SPACE FOR YOU</span>
          </div>
          <div className="tabs" role="tablist" aria-label="Portfolio sections">
            {tabs.map((name, i) => (
              <button
                key={name}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={`tab-${i}`}
                role="tab"
                aria-selected={tab === i}
                aria-controls={`panel-${i}`}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
                onKeyDown={(event) => keydown(event, i)}
              >
                {name}
                {i === 2 && <span aria-hidden="true"> ↗</span>}
              </button>
            ))}
          </div>
          <div
            id="panel-0"
            role="tabpanel"
            aria-labelledby="tab-0"
            hidden={tab !== 0}
            className="panel portraits-panel"
          >
            <div className="portfolio-copy">
              <p className="eyebrow">01 / THE PORTRAITS</p>
              <h2>{current.caption}</h2>
              <p>{current.description}</p>
              <div className="collection-control">
                <button
                  aria-label="Previous collection"
                  onClick={() =>
                    setCollection(wrap(collection - 1, collections.length))
                  }
                >
                  ←
                </button>
                <span aria-live="polite">
                  {current.name}
                  <small>{String(collection + 1).padStart(2, "0")} / 03</small>
                </span>
                <button
                  aria-label="Next collection"
                  onClick={() =>
                    setCollection(wrap(collection + 1, collections.length))
                  }
                >
                  →
                </button>
              </div>
            </div>
            <div className="prints" key={collection}>
              {current.images.map((index) => (
                <Portrait index={index} key={index} />
              ))}
            </div>
          </div>
          <div
            id="panel-1"
            role="tabpanel"
            aria-labelledby="tab-1"
            hidden={tab !== 1}
            className="panel text-panel"
          >
            <p className="eyebrow">02 / THE EXPERIENCE</p>
            <h2>
              Close the curtain.
              <br />
              Open up a little.
            </h2>
            <p>
              A concept for a small, private space where the best photo is the
              one that feels like you.
            </p>
            <ol className="experience-steps">
              <li>Step inside</li>
              <li>Find your face</li>
              <li>Keep a moment</li>
            </ol>
          </div>
          <div
            id="panel-2"
            role="tabpanel"
            aria-labelledby="tab-2"
            hidden={tab !== 2}
            className="panel text-panel"
          >
            <p className="eyebrow">03 / SAY HELLO</p>
            <h2>
              Your people.
              <br />
              Our little booth.
            </h2>
            <p>
              A wedding, a celebration, or just because. Imagine Marvin in your
              next memory.
            </p>
            <p className="contact-note">
              This is a concept preview. Contact and bookings are not connected
              yet.
            </p>
          </div>
          <footer className="screen-footer">
            <span>REFERENCE PORTRAITS · DEMO CONTENT</span>
            <span>0{tab + 1} — 03</span>
          </footer>
        </div>
        <div className="monitor-base">
          <span>MARVIN STUDIO / MEMORY MAKER</span>
          <i aria-hidden="true" />
        </div>
      </div>
      <div className="console" aria-hidden="true">
        <span>GOOD TIMES, ON REPEAT.</span>
        <div />
      </div>
    </div>
  );
}
