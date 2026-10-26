# Slower entrance and direct dissolve - 2026-10-24

Doubled the full gesture animation from 1.8 to 3.6 seconds, including reverse motion and proportional partial transitions. Removed the full-screen white transition component, its CSS and the white hold. The portfolio now fades directly over the opaque booth using a smooth opacity curve from progress .56 to 1; there is no empty frame between scenes. The renderer remains active until the dissolve completes. Single-gesture wheel/swipe/keyboard entry and reduced-motion bypass remain in place.

Validation: production build, lint and all 15 unit tests passed. Browser results: 29 passed and one desktop touch case intentionally skipped; actual touch input passed on mobile Chromium. Checks include the slower duration, simultaneous curtain/camera motion, direct dissolve with the booth underneath, reverse navigation, portfolio reading, reduced motion and GPU fallback.

Inspected desktop and mobile midpoint-dissolve screenshots. `transition-results.json` records approximately 50% portfolio opacity over a fully opaque underlying scene, zero white overlay elements, and completion from one wheel gesture. Browser observations include automation polling overhead; configured full animation time is 3600 ms. No model geometry, photographs or GLB content changed. This revision is local and has not been published.
