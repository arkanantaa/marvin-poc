# Single-gesture entrance - 2026-10-24

One downward wheel gesture, upward touch swipe or PageDown plays the complete 1.8-second entrance. Curtain opening and camera movement start together; the curtain clears the doorway before crossing. The separate open-curtain pause is removed. An upward wheel gesture at the portfolio's top reverses home, while portfolio reading scroll remains native. The entrance occupies one viewport of scroll, retains scrollbar scrubbing and the immediate Our work shortcut, and skips animation with reduced motion.

Validation: production build, lint and all 15 unit tests passed. Browser results: 29 passed and one intentionally skipped desktop-only touch case; actual swipe input passed in mobile Chromium. Checks cover simultaneous opening/zoom, single-wheel completion, keyboard entry, swipe completion, reverse motion, portfolio reading offsets, reduced motion, unavailable WebGL and GPU context loss.

Inspected desktop/mobile screenshots of opening-and-zoom and the resulting portfolio. `gesture-results.json` records a single wheel event at each viewport, partial curtain opening with a changed camera position, and completion without a second scroll. The closed model and fallback artwork are unchanged. This revision is local and has not been published.
