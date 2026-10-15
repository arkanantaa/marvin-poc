# Marvin Studio — foundation preview

React + Vite + strict TypeScript. Original PoC and supplied source assets remain intact in the parent folder. This implements Milestone A; the supplied video fails the stationary-opening/first-frame gates and is intentionally excluded from the public build. Final footage, business photographs/copy and contact destination are still needed for version 1.

Use Node **24.18.0** (`../.nvmrc`).

```powershell
cd marvin-web
npm ci
npm run dev
```

Validation:

```powershell
npm run lint
npm run typecheck
npm run test:unit
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview -- --host 127.0.0.1
```

The development server defaults to port 5173; the production preview uses 4173. Browser tests start the production preview automatically. `tests/capture-evidence.mjs` captures visual evidence with preview on 4173 and the repository served on 4174 (`python -m http.server 4174` from repository root). Screenshots require AI/manual viewing; capture alone does not imply acceptance.

Edit collections, captions and alternatives in `src/data/portfolio.ts`. The demo photos are tiny crops from the supplied reference, upscaled for layout; replace these with approved high-resolution photographs before launch. Contact has no active link because no destination was supplied. Portfolio effects are restrained local CSS; no React Bits dependency is needed.

Timeline is independent of loading state. One native paused video element uses coalesced latest-target seeks; no canvas, extracted frames, timed autoplay or alternate sources. See `src/lib/timeline.ts`, `src/hooks/useEntranceMedia.ts` and [media qualification](../docs/media-manifest.md) before enabling footage. An unapproved file is not downloaded. `Our work` immediately bypasses entrance; `#work` refresh, history, home and same-fragment shortcuts work. Native scrolling reverses across the journey boundary. Mobile monitor content grows naturally and remains scrollable.

GitHub Pages workflows are in `../.github/workflows/`. Public asset paths use Vite's base. For a local project-path test:

```powershell
$env:PAGES_BASE_PATH='/marvin-validation/'
npm run build
npm run test:e2e
Remove-Item Env:PAGES_BASE_PATH
```

Live foundation preview: [arkanantaa.github.io/marvin-poc](https://arkanantaa.github.io/marvin-poc/). See [deployment and rollback](../docs/deployment.md), [baseline](../docs/qa/baseline.md), and [acceptance evidence](../docs/qa/acceptance.md). Re-run live checks with `node tests/inspect-production.mjs https://arkanantaa.github.io/marvin-poc/`, then view the resulting screenshots.
