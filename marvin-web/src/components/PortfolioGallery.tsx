import { useState } from "react";
import { collections, portfolioLabels, type Portrait as PortraitData } from "../data/portfolio";
import { asset } from "../lib/assets";
import { wrap } from "../lib/timeline";

function Portrait({ portrait }: { portrait: PortraitData }) {
  const [broken, setBroken] = useState(false);
  return (
    <figure className="print">
      {broken ? (
        <div className="image-fallback" role="img" aria-label={`${portrait.alt}. Image unavailable.`}>
          <span aria-hidden="true">✳</span>
          Portrait unavailable
        </div>
      ) : (
        <img src={asset(portrait.src)} alt={portrait.alt}
          width={portrait.width} height={portrait.height}
          loading="lazy" decoding="async" onError={() => setBroken(true)} />
      )}
      <figcaption>{portfolioLabels.printSignature}<span aria-hidden="true">✳</span></figcaption>
    </figure>
  );
}
export function PortfolioGallery() {
  const [index, setIndex] = useState(0);
  const current = collections[index];
  return (
    <>
      <div className="portfolio-copy">
        <p className="eyebrow">THE MOMENTS IN BETWEEN</p>
        <h2>{current.caption}</h2>
        <p>{current.description}</p>
        <div className="collection-control" role="group" aria-label="Portrait collections">
          <button type="button" aria-label="Previous collection"
            onClick={() => setIndex((value) => wrap(value - 1, collections.length))}>←</button>
          <span aria-live="polite" aria-atomic="true">
            {current.name}
            <small>{String(index + 1).padStart(2, "0")} / {String(collections.length).padStart(2, "0")}</small>
          </span>
          <button type="button" aria-label="Next collection"
            onClick={() => setIndex((value) => wrap(value + 1, collections.length))}>→</button>
        </div>
      </div>
      <div className="gallery">
        <div className="prints" key={current.id}>
          {current.images.map((portrait) => <Portrait key={portrait.src} portrait={portrait} />)}
        </div>
        <p className="gallery-note">Little prints. Lasting feelings.</p>
      </div>
    </>
  );
}
