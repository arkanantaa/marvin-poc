# Supplied-asset model refinement — 2026-10-22

Local working-tree revision; no push or deployment. This supersedes the earlier gold-curtain model report.

## Result

All three supplied JPEGs are used in the live model. The logo is preserved on the illuminated sign and lower plaque. The LOVE CAPTURE printer has an actual cavity, metal sidewalls, tray and sloping surround, with the supplied photo mapped to the label, interior insert and metal finish. The olive velvet photo is mapped to an irregularly folded mesh with fabric sheen and fine surface relief. The free cloth bends and lags below its anchored rail, sways after scroll input and settles to rest. The camera and rail remain tied to scroll, and the gathered fabric stays clear of the doorway. An interior seat, revised lighting and soft contact shadow add depth and scale.

Source JPEGs and runtime copies have matching SHA-256 values in `asset-integrity.json`. See [asset/model decisions](../../models/assets.md), including the photographic nature of the printer insert and the procedural nature of the cloth response.

## Verification

- TypeScript, lint and production build passed. Ten unit tests cover timeline behavior plus rail anchoring, free-hem movement, reversal, exact rest, doorway clearance, frame-rate consistency and suspension bounds.
- Browser suites passed 33 tests at both root and `/marvin-poc/` paths. Three GPU-specific WebKit tests are intentionally skipped. Chrome desktop/mobile exercise actual GPU rendering, supplied texture requests, cloth settling, fixed camera during opening, rapid reversal, idle frame cessation, disposal and context loss. WebKit covers accessible navigation and fallback routes.
- Production captures cover 1440×900, 1920×1080, 390×844, 360×800, 320×800 and 844×390. `browser-results.json` records Chrome 155.0.8059.85, asset hashes, zero page/HTTP errors and zero axe violations across all six sizes.
- The agent viewed desktop/mobile/320 px/landscape opening, partly gathered and fully gathered curtain, printer/logo/fabric close-ups, and moving-versus-resting cloth. The sign/base fit the opening frame; the supplied label/artwork are visible, and the lower curtain edge has a nonuniform silhouette. Portfolio, focus, reflow, enlarged text and image failures remain covered by the existing browser suite.
- The revised fallback poster is rendered from the same model at 1920×980. Reduced motion does not import Three.js or run fabric animation.
- Export and reimport passed with Three.js GLTFExporter/GLTFLoader. The static GLB is 5,471,884 bytes, with 76 meshes and 19,756 triangles. Named logo, printer and olive velvet meshes survive reimport. Detailed bounds and names are recorded in `../../models/validation.json`. The GLB is a handoff artifact, not a visitor download; web cloth animation remains in TypeScript.

## Loading evidence

The final root build emits `index-B2q4SrxW.js` (73.61 KB gzip), `createBoothScene-DrdPPDvR.js` (140.56 KB gzip, lazy) and `index-DzwYAj7A.css` (3.42 KB gzip): approximately 217.59 KB combined. Vite's raw-chunk warning remains for the lazy Three.js module; direct portfolio and reduced-motion entry skip that module.

Three serial cold-cache local-preview measurements are in `performance.json`: 390×844 DPR 1 touch emulation, 4× CPU throttling, 1.6 Mbps download, 750 Kbps upload, 150 ms latency. LCP was 2088/2088/2080 ms, CLS was zero throughout, first 3D frame was 4074.3/2793.7/2811.5 ms, transferred resources totaled 565,539 bytes, and longest observed event duration was 136/40/48 ms. These are lab measurements, not field INP or physical-device results.

## Limits

The source photos constrain texture resolution and contain baked lighting. Hidden geometry and physical dimensions are inferred. Fabric uses bounded procedural deformation rather than a full collision solver; the exported GLB is static. Firefox, native Safari GPU behavior, physical devices, native browser zoom and screen-reader review remain unverified. Business content and contact setup remain as before. The upstream skill repository returned 404; a focused Codex skill was independently adapted from the pasted outline and official API references and passed skill validation.
