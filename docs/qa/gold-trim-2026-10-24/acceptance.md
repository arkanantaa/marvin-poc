# Gold-trim photobox revision — 2026-10-24

Implemented the four requested reference changes: illuminated gold facade/door surrounds, the supplied transparent Marvin wordmark in yellow without Studio text, a compact .56 × .36 recessed stainless outbox with a narrow black print slot, and a centered front-facing camera. The cream facade, supplied olive velvet and six portrait assets remain in use. A bronze sign backing gives the yellow top wordmark contrast.

Validation: production build, lint and all 10 unit tests passed. All 24 Playwright tests passed in desktop and mobile Chromium profiles, covering scroll/reverse travel, cloth settling, supplied assets, context loss, reduced motion and portfolio access. Inspected the desktop/mobile closed/open screenshots, frontal model render and printer/logo details. The exported GLB was reimported successfully: 90 meshes, 22,168 triangles, 4,784,652 bytes. This is local validation; the revision has not been published.

Evidence: `1440-hero.png`, `1440-open.png`, `390-hero.png`, `390-open.png`, `front-model.png`, `printer-detail.png`, `logo-detail.png` and curtain detail images in this directory. `marvin-web/public/media/booth-realistic.jpg` is the matching 1920 × 980 fallback image. Capture with `PLAYWRIGHT_CHROMIUM_CHANNEL=chromium` on this machine.
