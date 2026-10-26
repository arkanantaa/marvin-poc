# Supplied assets and modeling decisions

The three JPEGs supplied on 2026-10-22 are copied byte-for-byte into `marvin-web/public/textures/`. The original attachments remain unchanged.

| User file | Runtime copy | Use |
| --- | --- | --- |
| `1000130537.jpg` | `printer-reference.jpg` | Brushed steel and beveled surround finish on the compact recessed printer tray |
| `1000130539.jpg` | `marvin-logo.jpg` | Archived original logo; superseded on the model by the transparent wordmark below |
| `1000130535.jpg` | `olive-velvet.jpg` | Color texture on a deformable, irregularly folded curtain |
| Transparent Marvin PNG supplied 2026-10-24 | `marvin-wordmark.png` | Original black wordmark on the warm yellow top sign and below the printer; no Studio text |
| `ape.pdf`, pages 1-6 | `portfolio/ape-portrait-1.webp` through `ape-portrait-6.webp` | Original embedded photos extracted at native resolution, encoded losslessly, shared by the booth display and portfolio |

The PDF photos replace the old 300 x 360 reference thumbnails. Native sizes in page order are 584 x 440, 330 x 585, 465 x 499, 479 x 364, 401 x 413 and 800 x 601. Both displays preserve aspect ratios and full framing. `scripts/extract-portfolio.py` regenerates the photos from the original PDF; `output/pdf/ape-photos/manifest.json` records page mapping and the source hash. `output/pdf/ape-images.zip` contains six full-page 200 dpi PNG renders and six original-photo PNG exports. Website WebP pixel data was checked against the extracted originals. The interior chair and its pedestal are removed.

The booth's photo display and all six print cards are enlarged by 30%, with the display raised slightly to preserve space above the outbox. The frame is 1.131 x 1.378 modeling units; image proportions and the two-column arrangement remain intact. Visual evidence for this size revision is in `docs/qa/larger-display-2026-10-24/`.

The display is now centered between the left surround's inner edge and the curtain surround's outer edge. Its center is x = -0.5875, giving equal clear gaps of 0.387 modeling units on both sides. All six photos move with the frame. Measured mesh bounds and visual evidence are in `docs/qa/balanced-display-2026-10-24/`.

The recessed printer, its wall opening and the lower Marvin wordmark share the display's x = -0.5875 centerline. The compact outbox dimensions are unchanged. Bounds verification and rendered evidence are in `docs/qa/aligned-outbox-2026-10-24/`.

UV crop rectangles are explicit in `src/scene/buildBooth.ts`; no source image is overwritten. The printer housing has a real opening, sloping surround, sides, tray and a narrow black upper print slot. The 2026-10-24 revision matches the main booth reference's empty outbox at .56 × .36 modeling units (previously 1.10 × .72), removes the oversized label and product insert, and moves the wordmark directly below it. The curtain's photo supplies color; independent fine grain supplies surface relief so photographed shadows are not mistaken for geometric depth.

The main reference's cream facade and composition remain. The final correction uses reflective champagne metal with mitered bevels, subtle polishing ripples in its normal map and studio reflection cards. The metal has no emissive light strips or glow overlay. Only the top sign diffuser has the warm yellow backlit appearance, behind the untouched black wordmark. The camera begins on the facade centerline, looking straight ahead, then follows a continuous lateral/forward approach toward the door. Forward distance is logarithmically interpolated to reduce sudden enlargement near the doorway. `scrollMotion.ts` eases wheel/touch input with a 75 ms response; the camera stops at rest while the curtain breeze continues.

The entrance runs as one gesture-driven transition lasting 3.6 seconds, half the original gesture animation's speed. Curtain opening and camera movement begin together, with the curtain clear before the camera crosses the doorway. The portfolio fades directly over the still-visible booth using a smooth opacity curve; there is no full-screen white layer, white hold or empty gap. Wheel, touch swipe and keyboard input are supported; reverse wheel input returns home at the same pace, portfolio reading scroll remains native, and reduced motion skips the sequence. Gesture evidence for the original sequence is in `docs/qa/one-scroll-2026-10-24/`; the slower dissolve is recorded in `docs/qa/soft-transition-2026-10-24/`.

`curtainMotion.ts` anchors the rail, varies fold shapes down the fabric and gives the free hem a bounded damped response to scroll input. Two slow wind waves add a soft billow at rest, strongest at the hem and attenuated when gathered. This is procedural soft-cloth animation, not a collision-based cloth solver. The final gathered width remains clear of the camera. Idle wind renders at 30 fps; rendering pauses while the document is hidden or the 3D entrance is no longer visible, and the reduced-motion route uses the static poster.

`public/media/booth-realistic.jpg` is a 1920×980 browser capture of the revised model, generated by `tests/capture-model-details.mjs`. It keeps loading/GPU/reduced-motion fallbacks consistent with the current model. Current visual evidence is in `docs/qa/pdf-breeze-2026-10-24/`; the other dated QA folders record earlier iterations.

## Codex skill adaptation

The supplied `https://github.com/pinkforest/threejs-playground` URL returned 404 through both the browser lookup and GitHub tree API. No original skill files or license were fetched. A focused skill was independently written from the user's pasted topic outline and verified Three.js documentation at `~/.codex/skills/threejs-realism/SKILL.md`. It uses Codex's skill format and local tools, covers reference geometry, textures/materials, fabric response and verification, and passed the bundled skill validator. It does not claim to install or reproduce the ten unavailable upstream skills.

API references: [physical materials](https://threejs.org/docs/pages/MeshPhysicalMaterial.html), [texture color space and UV transforms](https://threejs.org/docs/pages/Texture.html), [buffer geometry updates](https://threejs.org/docs/pages/BufferGeometry.html). Installed Three.js version: 0.186.1.
