# Marvin Studio — interactive 3D portfolio

Updated 2026-10-22. The user's request to replace video with Three.js and overwrite the theme supersedes the previous video-first specification. Superseded video specifications and assets were removed from the workspace on 2026-10-26. A compliant MP4 is no longer a release dependency.

## Product direction

Reconstruct the photobooth in `marvin_main.png` as a real, procedural Three.js model. The latest supplied assets replace the generic lettering, printer and gold fabric: use the exact Marvin studio logo, recessed LOVE CAPTURE printer reference, and olive velvet curtain photograph. Keep the cream body, metallic surrounds and six portrait prints. Infer depth and hidden surfaces; this is an authored reconstruction, not a photogrammetric scan. See [asset mapping](docs/models/assets.md).

Native scrolling opens the curtain, pauses at the open doorway, aligns the camera with that doorway, and moves inside. A white transition reveals the accessible HTML portfolio. Replace the previous pale monitor theme with charcoal, ivory, muted chrome, and golden accents, with editorial serif headings and legible sans-serif controls.

## Requirements

| ID | Requirement | Acceptance |
| --- | --- | --- |
| HERO-01 | Clean booth presentation | Full model, sign, and base visible below a persistent navbar on white; no hero copy or scroll instructions |
| MODEL-01 | Real 3D geometry | Actual body, interior, frame, canopy, sign, display, slot, rail, curtain folds, and rings; no video or flat-image zoom substitute |
| MODEL-02 | Reference fidelity | Supplied logo on sign and lower plaque; supplied printer textures on recessed housing and beveled frame; supplied olive velvet on a folded curtain |
| MODEL-03 | Editable model | Dimensions/materials in source; an exportable GLB of the same model for reuse |
| MOTION-01 | Stationary opening | Only the curtain and its rings move while opening; free edge gathers toward the doorway's left |
| MOTION-02 | Physical entry | Camera aligns with the right doorway before crossing its front plane; level eye line and genuine perspective change |
| MOTION-03 | Soft fabric and reverse | Scroll determines rail/camera targets. Cloth below the anchored rail bends, lags and briefly sways after input, then returns to the same rest pose. Reverse input reverses gathering; no perpetual idle animation |
| TRANS-01 | White handoff | Warm interior fades to pure white, holds, then reveals live HTML; navbar stays operable |
| NAV-01 | Direct portfolio access | “Our work” and `#work` bypass 3D loading, expose the monitor, and focus the selected tab |
| NAV-02 | Home and history | Brand/home, Back/Forward, refresh, resize, and reverse scrolling remain coherent |
| WORK-01 | Accessible HTML | Portrait collections, experience, contact, arrow/Home/End tab controls, focus, and live collection announcement |
| WORK-02 | Responsive content | Natural document scrolling, 320px reflow, 200% text enlargement, readable labels, and 44px targets |
| WORK-03 | Honest content | Reference portraits labeled demo; no active booking/contact action without a confirmed destination |
| A11Y-01 | Reduced motion | Keep reference poster, skip 3D import/initialization and camera travel; immediate portfolio route |
| RES-01 | GPU/loading fallback | Missing WebGL, import failure, or context loss retains the poster and usable navigation; no blocking loader |
| PERF-01 | Demand rendering | One WebGL canvas, coalesced scroll updates, bounded pixel ratio, no per-frame React state updates; stop rendering when cloth has settled or the scene is hidden |
| PERF-02 | Cleanup | Dispose GPU resources, environment, geometry, materials, textures, observers and listeners on exit/unmount |
| VIS-01 | Real browser review | View rendered desktop/mobile images, curtain poses, entry, reverse, white handoff, all portfolio panels, fallback and enlarged text |

## Timeline

| Normalized scroll | Action |
| --- | --- |
| 0–0.08 | Complete closed booth |
| 0.08–0.36 | Curtain opens with fixed camera |
| 0.36–0.43 | Open-door hold |
| 0.43–0.58 | Camera alignment with the right doorway |
| 0.48–0.78 | Forward travel through the doorway |
| 0.78–0.86 | Interior fades to white |
| 0.86–0.90 | Opaque white hold |
| 0.90–1 | HTML monitor reveal; interaction at 1 |

## Architecture and release boundaries

React + Vite + TypeScript, Three.js WebGLRenderer, native fragment navigation, local assets, GitHub Pages base paths. Lazy-load the 3D module only for the animated opening. Canvas is used for real 3D rendering, surface microstructure and contact shadows. The supplied logo is UV-mapped directly; no font reconstruction, extracted-video frames or image-sequence renderer is involved.

Target combined compressed JS/CSS under 250 KB; cap rendering at DPR 1.5 desktop / 1.25 narrow screens. Track poster LCP and 3D-ready time separately: canvas readiness is not an LCP metric. Field INP and physical-device performance require separate evidence.

No backend, camera permission, accounts, booking service, or message sending. Genuine business photographs and confirmed contact details remain launch inputs. Local browser acceptance does not establish a live deployment or physical-device/Safari/Firefox acceptance.
