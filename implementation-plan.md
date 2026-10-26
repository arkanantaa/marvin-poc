# Marvin Studio — Three.js implementation

Updated 2026-10-22 following the user's renderer/theme change. Product source: [prd.md](prd.md). The superseded video plan and assets were removed from the workspace on 2026-10-26.

## Implemented structure

```text
marvin-web/src/
  scene/buildBooth.ts          Model, supplied texture UVs, recessed printer, curtain mesh
  scene/curtainMotion.ts       Irregular drape and damped free-cloth response
  scene/createBoothScene.ts    Renderer, environment, lighting, camera, GPU lifecycle
  lib/timeline.ts             Pure scroll poses and progress subscription
  lib/assets.ts               Base-aware local assets and fallback poster
  hooks/useJourneyProgress.ts Scroll, history, focus, reveal and reading position
  hooks/useReducedMotion.ts   Live accessibility preference
  components/BoothScene.tsx   Lazy 3D initialization and poster fallback
  components/WhiteTransition.tsx
  components/SiteHeader.tsx
  components/PortfolioMonitor.tsx
  components/PortfolioTabs.tsx
  components/PortfolioGallery.tsx
  components/ContactPanel.tsx
  data/portfolio.ts           Typed copy, collections, alternatives, contact configuration
  styles/site.css            Charcoal/ivory/gold theme and responsive layout
```

## Execution and checks

1. Preserve `marvin_main.png` as the booth source reference. The old MP4, video posters, CSS zoom prototype, video specifications and obsolete media tests were removed from the workspace. The active implementation uses no video element, decoder/seeking hook or approval manifest.
2. Build a genuinely volumetric booth from the image: front panel around an actual doorway, side/back/ceiling/floor surfaces, bevelled chrome, sign, portrait cards, print slot, rail/rings, and folded fabric.
3. Map scroll to deterministic rail and camera targets. Finish gathering before aligning and entering. Let the lower fabric lag and settle with a bounded damped response; stop rendering when settled. Texture updates, resize and restored visibility also invalidate the scene.
4. Keep the monitor in normal page flow. Translate only its inactive reveal phase; explicit navigation focuses the selected tab, while passive scroll preserves focus or safely moves it before hiding.
5. Apply the replacement charcoal theme and test the complete portfolio at narrow widths and enlarged text.
6. Retain the poster for reduced motion, WebGL absence, and context loss. Skip the renderer import on direct entry/reduced motion. Dispose resources when navigating directly to work.
7. Run typecheck, lint, timeline and cloth tests, real browser tests, visual capture, production base-path checks, and measured performance. Record limitations in [the current QA report](docs/qa/realism-2026-10-22/acceptance.md).
8. Export the same model to [GLB](docs/models/marvin-booth.glb). It contains the closed booth, embedded textures and named meshes; web choreography remains controlled by `timeline.ts`.
9. Retain the existing GitHub Pages workflow. Publishing requires pushing the reviewed changes and checking the resulting site; no new deployment is claimed by local implementation.

## Validation commands

From `marvin-web/`, with Node 24 LTS and locked dependencies:

```sh
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:e2e
```

`test:e2e` includes all configured engines. Set `PLAYWRIGHT_CHROMIUM_CHANNEL=chrome` to use installed Chrome locally. Current Windows validation uses Chrome desktop/mobile and WebKit; explicit 3D/context-loss checks run in Chromium. Keep untested engines/devices marked unverified.

With a production preview on 4176, run `node tests/capture-threejs.mjs` and view the images (set `QA_REVIEW_DIR=../../docs/qa/realism-2026-10-22/` for the current capture folder). Run `node tests/measure-performance.mjs http://127.0.0.1:4176/` with `QA_REVIEW_DIR=realism-2026-10-22` for lab timings. With Vite dev on 5173, run `node tests/capture-model-details.mjs` to regenerate the matching fallback poster and inspect detail captures, then `npm run export:model` to regenerate/reimport the GLB. Repeat production tests with `PAGES_BASE_PATH=/marvin-poc/` before publication.

## Remaining launch inputs

Approved business portraits/copy, a confirmed contact destination, physical-device and assistive-technology review, and deployment of this revision. A video is no longer required. Do not apply the archived video choreography/encoding gates to this renderer.
