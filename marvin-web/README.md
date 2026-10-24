# Marvin Studio — 3D edition

Three.js geometry replaces the previous MP4 entrance. The model uses the original booth composition plus the supplied Marvin logo, recessed LOVE CAPTURE printer image, and olive velvet fabric. It has metal trim, an upholstered interior seat, actual printer cavity and irregular soft folds. Depth is inferred from the references.

Use the Node 24 release pinned in `../.nvmrc` (validated locally with 24.19.0).

```sh
npm ci
npm run dev
```

Vite serves the website on port 5173. Native scroll controls the rail and camera; a damped response lets the lower fabric lag and sway before settling. “Our work” skips directly to the portfolio. No video is requested. The renderer is dynamically imported only when needed and draws until the cloth settles, with a capped pixel ratio and resource cleanup. Reduced motion, missing WebGL and context loss use a matching render of the revised model as the poster fallback.

Edit geometry and supplied texture crops in `src/scene/buildBooth.ts`, cloth response in `src/scene/curtainMotion.ts`, lighting/framing in `src/scene/createBoothScene.ts`, and choreography in `src/lib/timeline.ts`. Portfolio content and confirmed contact configuration live in `src/data/portfolio.ts`. The charcoal/ivory/gold theme is in `src/styles/site.css`. Asset provenance and the Codex skill adaptation are recorded in `../docs/models/assets.md`.

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e
```

On Windows machines where installed Chrome works but downloaded Chromium does not, set `$env:PLAYWRIGHT_CHROMIUM_CHANNEL='chrome'`. To run the locally reviewed engines: `npx playwright test --project=desktop --project=mobile --project=webkit`. Actual Firefox, Safari, physical devices and screen readers require their own checks.

For visual evidence, start `npm run preview -- --host 127.0.0.1 --port 4176`, then run `node tests/capture-threejs.mjs`. View the images in `../docs/qa/realism-2026-10-22/`; capturing them alone does not establish acceptance. `node tests/measure-performance.mjs http://127.0.0.1:4176/` records lab loading and 3D-ready timings separately. With the dev server on 5173, `node tests/capture-model-details.mjs` also renders close-ups and regenerates the matching fallback poster.

With the dev server running, `npm run export:model` writes `../docs/models/marvin-booth.glb`. This GLB contains the same closed-booth geometry and embedded textures for reuse in 3D tools. The website uses the procedural source so the curtain can deform and camera travel can follow scroll directly; the exported static GLB is not downloaded by visitors.

GitHub Pages remains the hosting target. Set `PAGES_BASE_PATH=/marvin-poc/` when testing its project path. Existing Actions validate/build/deploy on a pushed default-branch commit. This working-tree revision has not been published. See [QA](../docs/qa/realism-2026-10-22/acceptance.md) and [deployment history](../docs/deployment.md).

The six portraits are small reference crops, not approved launch photography. Contact remains disabled until a real destination is supplied. The old video-specific PRD/plan are archived and no longer govern the renderer.
