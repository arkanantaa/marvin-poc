# Foundation review — 2026-10-19

Release scope: Milestone A foundation preview. Milestone B remains blocked by the supplied video's choreography and first-frame failures. No replacement footage or approved business photographs/contact destination exists in this checkout. The PRD explicitly prohibits synthesizing the missing stationary opening using CSS zoom or extracted frames.

The review applies to the commit containing this report; production commit and Actions evidence are recorded in [deployment](../../deployment.md). Original source hashes remain unchanged. Legacy/unrelated untracked files were preserved.

## Milestone gates

| Milestone / phases | Actual work and verification | Result |
| --- | --- | --- |
| Baseline and foundation / 0–1 | Reviewed PRD, implementation, original source and media qualification; clean `npm ci` on Node 24.18.0; strict typecheck, lint, eleven unit tests and production build | PASS |
| Clean hero / 2 | Viewed browser renders at 1440×900, 1920×1080, 390×844, 360×800, 844×390, 768×1024, 1024×768 and 320×800; entire sign/base visible; pure white, no unwanted copy; navbar clear | PASS HERO-01/02, NAV-01; HERO-03 blocked |
| HTML portfolio / 3 | Viewed all three collections and all tabs; exercised keyboard arrows, Home/End, Tab/Shift+Tab and touch shortcut; broken image route; normal font size and no horizontal overflow | PASS WORK-01–06 for labeled demo content |
| Navigation/fallback / 4 | Repaired mobile portfolio page height, resize reading offset, reduced-motion focus, Firefox fragment focus/offset, decoder rejection and deep-link-to-home media activation; white/monitor boundary, history, refresh and reversal tested | PASS foundation; eleven unit tests and twenty browser tests across four profiles |
| Media qualification / 5 | Viewed source contact sheet and actual browser frames during forward/reverse fixture seeking. Camera advances before opening ends; no stationary open hold; initial booth differs from poster. Clip has visible AI watermark | FAIL HERO-03, MOTION-02/03/04; no delivery video approved |
| Single decoder / 6 | Real local MP4 fixture exercises hold, reverse, newest target, deep-link/home, shortcut unloading, reduced-motion focus, aborted request and five-second stall recovery; fixture created exclusively and removed in `finally` | PASS controller mechanism, not final choreography |
| QA / 7 | Chromium 156.0.8078.4 desktop + Pixel 7 emulation; Firefox 157.0; Playwright WebKit 27.2. Automated axe checks pass. Windows, AMD Ryzen 7 6800HS; visual screenshots DPR 1, normal motion, unthrottled localhost | PASS applicable foundation checks; physical devices, actual Safari, screen reader/native zoom remain UNVERIFIED |
| Production / 8–9 | Project-base build, artifact audit, Actions and live verification | See [deployment record](../../deployment.md) for exact results |

## Defects repaired

1. **High — mobile content was unreachable:** a fixed-height sticky stage painted a monitor taller than the viewport without extending document scroll height. A separate measured spacer now exposes the complete monitor while preserving the entrance boundary. At 390×600, native wheel scrolling advances past the boundary; resizing preserves the reading offset.
2. **High — Firefox deep link could hide the monitor:** mobile `scroll-margin-top` fought the component's explicit scroll position. Removed the redundant margin. Firefox also applied native fragment focus after mount; `pageshow` now finishes explicit deep-link focus after that browser operation.
3. **Medium — preference change stole focus:** effect reinitialization reran initial navigation. Initial navigation now runs once; changing reduced motion preserves the selected tab and focus. Reduced-motion entrance intent moves immediately to the portfolio boundary.
4. **Medium — direct-entry visit disabled footage permanently:** media eligibility now follows explicit navigation and reversal, so home can enable the decoder after a `#work` load. Shortcut navigation releases the decoder; resize does not replace its source.
5. **Medium — decoder rejection could escape the scroll callback:** invalid target/throwing `currentTime` becomes failure state. Recovery uses a bounded 120 ms fade, 80 ms white hold and 180 ms monitor reveal; navigation can bypass it.
6. **Accessibility — text-only tab panels lacked a keyboard stop:** visible panels now accept focus, with a visible outline. Hidden panels remain excluded. Header height/padding includes top safe-area inset.

Firefox wheel automation sends native increments of at most 180 px because that browser caps oversized wheel events. Assertions allow one CSS pixel of scroll rounding. This changes test input, not product scroll behavior. Browser workers are capped at two to avoid local Firefox session instability observed with eight simultaneous workers.

## Visual evidence actually viewed

- Hero: `1440x900-hero.png`, `390x844-hero.png`, `844x390-hero.png`; whole booth centered with matching white surround.
- Monitor: `1920x1080-portraits.png`, `390x844-portraits.png`, `320x800-portraits.png`, `768x1024-portraits.png`; text readable and controls reachable through page scrolling.
- Every collection: `1440x900-collection-0.png` through `collection-2.png`; fixture labels/copy update. Some captures show the intentional 220 ms image reveal midpoint; the fully revealed initial collection is also captured.
- Tabs: `390x844-experience.png`, `390x844-hello.png`; accurate disconnected-contact text, no fabricated submission.
- Transition: `white.png`, `reveal.png`, reverse checkpoints; white covers scene below persistent navbar, monitor controls inert until reveal completes.
- Video as sequential browser renders: `fixture-1440-1.png`, `fixture-1440-3.png`, `fixture-1440-5.png`, `fixture-1440-7.png`, `fixture-1440-8.png`; opening and entry continuous, but camera movement during opening fails the PRD. Forward/reverse samples and held timestamps are in `media-controller.json`.
- `zoom-200.png` is a 200% CSS zoom diagnostic, not proof of native browser zoom or assistive-technology acceptance. 320 px reflow is separately covered.

`results.json` records all eight viewport conditions, errors and axe results. Video screenshots are QA evidence only and are absent from runtime output. No extracted-frame renderer, alternate video source or camera permission is introduced.

## Performance and remaining gates

`performance.json` records three cold browser contexts at 390×844 DPR 1 with touch emulation, 4× CPU slowdown, 1.6 Mbps down / 750 Kbps up / 150 ms latency, cache disabled. Reported event timing is a lab diagnostic and is not field INP. Final measurements and remaining exceptions are summarized in the main [acceptance record](../acceptance.md).

Physical Android/iPhone decoding, actual macOS Safari, native 200% zoom, screen-reader announcements, repeated final-video/memory traces and final business content remain open. Pure unit tests cover timed fallback boundaries, white hold and interaction eligibility; aborted/stalled decoder recovery is additionally exercised in the real browser. Native zoom and physical-device gates remain unchecked. Expanded heading/body copy at 320 px passed in `edge/results.json`; the AI viewed `edge/long-copy-320.png` and `edge/monitor-bottom-320.png`.

Milestone A is the supported release claim. Milestone B cannot be marked done from this footage. Extracted-frame animation remains deferred to a separate task.

Publication status: candidate `1c249c9` pushed; Actions queued without a runner at 22:55 Asia/Jakarta. New live acceptance is PENDING, not passed. Existing public preview remains the prior verified deployment. See the deployment record before claiming phase 9 complete.
