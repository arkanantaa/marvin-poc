# Three.js implementation acceptance — 2026-10-22

This initial 3D version predates the supplied logo/printer/velvet revision. See [current model QA](../realism-2026-10-22/acceptance.md).

This report covers the local working-tree implementation, not a deployed release. The latest user instruction replaces the video entrance and previous theme. The original image and MP4 are preserved; no MP4 is included in the website build.

## Implementation and visual review

The reference image is reconstructed as real geometry: cream shell, chrome surrounds, illuminated MARVIN sign, six portrait cards, print slot/tray, doorway, interior surfaces, folded gold curtain and rings. Native scroll gathers the curtain left while the camera remains stationary, holds, then translates the camera through the right doorway. White hold and the HTML portfolio follow. Reverse scrolling reconstructs the same poses. The new theme uses charcoal, ivory and gold with serif headings.

Production screenshots were captured in Chrome 155.0.8059.85 on Windows, DPR 1, at 1440×900, 1920×1080, 390×844, 360×800, 320×800 and 844×390. `browser-results.json` records zero page/HTTP errors and zero axe violations for all six profiles. The agent viewed desktop and mobile opening, curtain opening/hold, camera entry, white hold, portfolio, experience/contact, short landscape, 320 px enlarged text and failed-image captures. The full sign and base remain visible at the opening, tabs wrap at narrow widths, and long portfolio content scrolls naturally. Inside the narrow doorway the plain interior wall fills the mobile viewport before the white fade.

## Verification

- TypeScript, lint and production build passed.
- Six unit tests passed for timeline ordering, camera alignment, level horizon, reversible poses, clamping, progress subscriptions and collection wrapping.
- Root-path and `/marvin-poc/` production browser suites each passed 31 tests, with two intentional WebKit GPU-specific skips. Chrome desktop/mobile cover actual WebGL, stationary opening, camera travel, reverse, idle rendering, renderer disposal/recreation and context loss. WebKit covers navigation, responsive layout, accessibility and fallback.
- Direct `#work`, reduced motion, history, same-fragment shortcuts, keyboard tabs, preserved collection selection, reverse focus, resize/reading position, missing WebGL, failed images and 200% root text size are covered.
- The static GLB was exported and reimported with Three.js GLTFLoader: 62 meshes, 12,892 triangles, curtain present, 1,632,232 bytes. See `model-validation.json` and `../../models/README.md`. Runtime curtain animation remains in TypeScript; the exported GLB is a closed-booth handoff.

## Build and performance evidence

The root build matches the SHA-256 values in `browser-results.json`:

| Asset | Gzip size | SHA-256 |
| --- | ---: | --- |
| `index-CLgo2ZQn.js` | 73.58 KB | `151fcd7de4eaffe9b2c8418cc7401bf68fa597dab4e84bc8d4ede478dd76597f` |
| `createBoothScene-9YuVhnJm.js` | 138.95 KB | `c2db06ace5a77bc6d4d77ed6fe476aa0f5228ed0a0d6a475ef494a42b4a97526` |
| `index-DzwYAj7A.css` | 3.42 KB | `9b7c900916bcbca3bd688fafd5a33ec07b203c4250170a76278b332318199d73` |

Combined JS/CSS gzip is approximately 215.95 KB, within the 250 KB budget. Vite reports that the raw lazy Three.js chunk exceeds 500 KB; it is loaded only when the entrance renderer is enabled. Initial direct portfolio navigation and reduced motion skip that chunk. The renderer draws on demand and releases GPU resources when disposed.

`performance.json` contains three serial cold-cache runs against the local production preview: 390×844, DPR 1, touch emulation, 4× CPU throttling, 1.6 Mbps download, 750 Kbps upload and 150 ms latency. LCP was 1584/1592/1588 ms; CLS was zero in every run; first rendered 3D frame was 3337.9/2567.4/2582.1 ms. Longest observed event durations were 144/48/48 ms. These are lab measurements, not field INP or physical-device results.

## Limits and handoff

Firefox could not launch in this environment and is unverified. WebKit GPU rendering, physical iOS/Android, native browser zoom and screen-reader review remain unverified. Browser text-size tests do not substitute for native zoom. Depth and unseen booth surfaces are inferred from one frontal image. Portraits remain labeled demo content and contact/booking details are unconfigured. No push, deployment or live-site verification was performed for this revision.
