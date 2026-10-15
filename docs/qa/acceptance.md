# Acceptance — foundation preview, 2026-10-15

Local production preview reviewed at `http://127.0.0.1:4173/`. Source build is identified by the commit containing this report; compiled JS/CSS sizes below. Chromium 156.0.8078.4, Windows host, AMD Ryzen 7 6800HS; DPR 1 for screenshots; no-preference motion; local unthrottled network unless noted. Pixel 7 mobile emulation is browser coverage, not a physical Android-device result. No Safari/iOS/physical-device result is claimed.

The AI actually viewed the supplied source, candidate contact sheet, legacy desktop/mobile screenshots, new desktop/mobile/short-landscape opening, desktop and 320/390 px monitor, white hold, mid-reveal, experience and contact. Native scroll and keyboard interactions were exercised with real Chromium browser automation. Capture paths are relative to this directory; machine-readable conditions are in `browser-metadata.json`.

| Requirements / checkpoint | Observed result | Verdict / evidence |
| --- | --- | --- |
| HERO-01/02, NAV-01 | Whole sign/base, centered below persistent navbar; white surround; no copy/buttons/chapters/progress. Mobile retains the complete 16:9 composition with generous whitespace | PASS: `1440x900-hero.png`, `1920x1080-hero.png`, `390x844-hero.png`, `360x800-hero.png`, `844x390-hero.png` |
| HERO-03, MOTION-02–08 | Supplied clip's framing differs; camera moves while curtain opens | BLOCKED for final release: `candidate-contact-sheet.jpg`, `../media-manifest.md` |
| TRANS-01–03 | Poster fades to white, opaque hold, monitor reveal; navbar operable; hidden controls inert/aria-hidden until complete | PASS foundation: `fade-midpoint.png`, `white-hold.png`, `monitor-midpoint.png`, `monitor-full.png`; E2E native scroll assertions |
| NAV-02/03, A11Y-03 | Shortcut focuses first tab; home, Back, refresh, same-fragment shortcut and reverse focus relocation work | PASS: desktop/mobile E2E; `reduced-motion-work.png` |
| WORK-01–06 | Real HTML portfolio; collections wrap both ends; every tab works; readable mobile layout with natural page scroll; honest unavailable contact | PASS demo: `1440x900-monitor.png`, `390x844-monitor.png`, `320x800-monitor.png`, `tab-The-experience.png`, `tab-Say-hello.png`, `collection-0.png` through `collection-2.png` |
| A11Y-01/02/04 | ArrowLeft/Right, Home/End, focus and tab relationships; reduced motion and image errors; no axe violations in tested portfolio; no horizontal overflow at 320 px | PASS automation; full assistive-technology audit and browser 200% zoom UNVERIFIED |
| RES-01/02, PERF-01/02, MOTION-09/10 | Production has no video source/download; poster-to-white fallback usable. Development-only rejected clip used to exercise real single-decoder seeking, hold, reverse, newest target, blocked request and bounded stalled request | PASS mechanism: `media-controller.json`, six unit tests. Compliant-footage motion qualification remains BLOCKED |
| PERF-03 | Throttled mobile cold loads measured below; no field INP data | Lab evidence only; see limitations below |
| VIS-04 | Production deployment inspection pending at time of local acceptance | Pending; update deployment record after live review |

Automation: clean lint (no warnings), strict typecheck, six unit tests, six desktop/mobile production browser tests passed. Axe initially found the wordmark's concatenated visible label mismatch; adding a real space fixed it, and both profiles passed on retest. No application console errors in the main browser flow. Required local project-path build is also exercised before publication and in CI.

Budgets: production JS gzip ≈72.2 KB + CSS gzip ≈2.53 KB, well below 250 KB. Poster 61,406 bytes. Six demo WebPs total 36,614 bytes. No entrance video, source notes, QA files or legacy files ship in dist.

Three serial cold-load mobile lab runs: 390×844, DPR 1, touch emulation, 4× CPU slowdown, 1.6 Mbps downstream, 750 Kbps upstream, 150 ms latency, disabled cache. HTTP localhost preview with actual resource transfer reported by Chromium. LCP 1544 / 1540 / 1584 ms: median 1544 ms, worst 1584 ms. CLS 0 in all runs. Initial resource transfer 153,278 bytes. Lab event durations after shortcut/gallery: 320 / 88 / 104 ms, median 104 ms, worst 320 ms. This occasional cold interaction exceeds 200 ms and remains a performance follow-up for the preview; it is not a field INP measurement. See `performance.json`; final-release performance approval is not claimed.

Release decision: foundation preview with explicit demo content and rejected-video limitation. Single-video version 1 is not complete. Final business assets, compliant footage, supported physical-device checks, full accessibility/zoom audit and final performance acceptance remain required before a business launch. Extracted-frame animation remains deferred, not an unfinished requirement.
