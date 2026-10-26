# Balanced photo display - 2026-10-24

Moved the enlarged display, backing and six photos right together. Its center is calculated from the inner edge of the booth's left trim and the left outer edge of the curtain surround, preserving the existing display size and height.

Actual mesh bounds give left and right clear gaps of 0.386999958 and 0.386999991 modeling units, equal within floating-point precision. See `display-spacing.json`. Inspected `front-model.png`; the display has balanced spacing without touching the curtain. Build and lint passed. The matching fallback poster and GLB were regenerated. This revision is local and has not been published.
