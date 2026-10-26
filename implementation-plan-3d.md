# Marvin Studio — 3D implementation plan

Date: 2026-10-21

Status: Planning only. No 3D milestone is complete yet.

Requirements: [prd.md](prd.md). This replaces the [old video plan](implementation-plan.md).

## Steps in a nutshell

- [ ] **1. Set up the scene:** add Three.js to the existing app and frame the reference view.
- [ ] **2. Build the booth:** simple geometry, recognizable details, realistic materials and lighting.
- [ ] **3. Open the curtain:** one pleated panel gathers left while the camera stays still.
- [ ] **4. Enter the doorway:** scroll moves a real camera right and forward; hold and reverse work.
- [ ] **5. Reveal the portfolio:** brief white transition, existing HTML monitor and immediate navigation.
- [ ] **6. Make it resilient:** responsive sizing, reduced motion, WebGL fallback and lightweight rendering.
- [ ] **7. Check in browsers:** view the result, exercise each flow and repair defects.
- [ ] **8. Release:** make 3D the default, remove video dependencies and verify GitHub Pages.

Check a step only after its work and browser check pass. Old video test results do not count as 3D evidence.

## Approach at a glance

Use the existing React/Vite/TypeScript app with **Three.js WebGLRenderer**, one scene and one perspective camera. Build the model in code from boxes, planes and a small curtain mesh. No external modeling application or AI reconstruction service is required.

The reference supplies the visible design; unseen depth/interior can be approximated. The finished opening should look convincingly like Marvin without needing a highly detailed model. Reuse the navbar, portfolio, gallery data, static booth fallback and deployment pipeline.

### Suggested scroll timing

| Progress | Scene |
| --- | --- |
| 0–10% | Full booth, curtain closed |
| 10–40% | Curtain opens; camera remains fixed |
| 40–50% | Fully open doorway, brief scroll-controlled pause |
| 50–100% | Camera aligns slightly right and enters |
| At 100% | Finish with a white-to-portfolio handoff lasting at most 400 ms |

These are tuning defaults. Curtain/camera poses depend on progress, not elapsed playback time. The final timed handoff is the explicit exception that prevents an indefinitely blank white viewport. Reversing cancels a pending handoff and restores the correct 3D pose.

## Details

### 1. Set up the scene and reference

- [ ] Inspect current changes and record a rollback point; preserve uncommitted work, source images and the legacy PoC.
- [ ] Add Three.js and its compatible TypeScript types; retain the current app and lockfile.
- [ ] Create a lazy-loaded scene component with one renderer/camera, white background and static loading image. No orbit/drag controls.
- [ ] Set an initial front view matching the reference's proportions. Reserve space below the navbar and fit the complete booth on narrow and short screens.

**Check:** compare the first rendered scene with `marvin_main.png` on desktop and phone. The sign/base fit, the navbar stays clear, and the poster-to-scene switch has no black flash or large framing jump. Covers R1, R7, R12.

### 2. Build the booth and its appearance

- [ ] Make cream wall segments, silver frame, roof, floor and base. Leave an actual hole for the right doorway; do not cover it with a solid front plane.
- [ ] Add the MARVIN sign, portrait frame, print slot and plain interior. Keep dimensions/material settings together so proportions are easy to adjust.
- [ ] Use small crops or clean textures for signs/photos only. The complete booth must have geometry, rather than being a reference picture on a plane.
- [ ] Add soft lighting, rough cream surfaces, restrained metal reflections and a simple contact shadow. Prefer a small procedural environment; skip large HDR downloads and post-processing.

**Check:** inspect the normal front view and an internal diagnostic side view. The booth looks believable, lettering stays readable, and the doorway/interior have depth. Check the PRD geometry/download targets before adding more detail. Covers R1, R2, R11.

### 3. Build the single curtain

- [ ] Create one yellow folded mesh with enough segments for visible pleats, a soft-looking lower edge and modest fabric depth.
- [ ] Animate its vertices/width toward the doorway's left, keeping its top on the rail and visible folds in the gathered panel. Use a deterministic shape change, not cloth physics.
- [ ] Drive closed/half/open states from the timeline. Keep the booth, photographs, lights and camera fixed during opening.

**Check:** scroll forward, stop halfway, fully open, then reverse to closed. One panel moves right-to-left and never becomes a split curtain, vanishes or blocks the open doorway. Covers R3, R5.

### 4. Add camera entry and native scroll

- [ ] Define a short camera path from the front view to the doorway center and into the interior. Keep eye height and horizon level; keep field of view stable during travel.
- [ ] Check the path against the doorway, walls and gathered curtain. End before the interior wall, facing its warm-white surface.
- [ ] Map clamped scroll progress to curtain shape and camera pose. Coalesce native scroll work into animation frames; update scene objects without React state updates on every tick.
- [ ] Preserve progress through resize, orientation and restored scroll. Do not hijack wheel/touch input or use CSS scaling as the entry effect.

**Check:** normal and rapid forward/reverse passes show real perspective changes. Stopping holds the pose. There is no frame/wall intersection, replay, left turn or input trap. Covers R2, R4, R5.

### 5. Connect white transition, portfolio and navigation

- [ ] At entry completion, finish the white fade and HTML monitor reveal within 400 ms. Keep the navbar above both layers; avoid a long empty white scroll region.
- [ ] Reuse the existing HTML camera, tabs, collection controls and contact notice. Hidden monitor controls stay inert until reveal completes.
- [ ] Make “Our work” and refreshed #work open the portfolio immediately, without importing/initializing 3D. Home must still initialize the scene when returning from a direct-entry visit.
- [ ] Cancel pending transitions on home, skip or reversal. Preserve focus on passive scroll; move it meaningfully on explicit navigation. Allow natural page scroll through a tall mobile monitor.

**Check:** enter normally, stop during the white handoff, reverse, skip mid-entry, refresh #work, return home and use Back/Forward. Every route reaches usable content without a blank trap or stale transition. Covers R6, R7, R8.

### 6. Add fallback and keep the scene lightweight

- [ ] Skip 3D loading for reduced-motion entry and respond to preference changes during a visit. Keep the static reference available while loading.
- [ ] Handle unsupported WebGL2, asset errors, context loss and initialization timeout. After entrance intent, recover within five seconds plus the brief handoff. Ignore late loads after a skip/fallback.
- [ ] Render only when progress, size or assets change. Stop while idle, in a hidden tab or behind the active portfolio. Release geometries, materials, textures, listeners and the renderer when no longer needed.
- [ ] Apply the PRD triangle/draw-call, payload, texture and pixel-density caps. Reduce optional effects before increasing complexity. Retain keyboard access, readable text and a DOM description of the decorative scene.

**Check:** block scene/texture requests, disable WebGL, simulate context loss and toggle reduced motion mid-entry. The portfolio remains reachable. Inspect network/render statistics and repeat entry/home three times for growing resource use. Covers R9, R10, R11.

### 7. Run the full browser review

- [ ] Update unit tests for the new progress/camera/curtain mapping and transition cancellation. Retain portfolio/navigation regression coverage; replace video-seek assertions.
- [ ] Run real WebGL browser tests for default activation, forward/hold/reverse, resize, skip-before-ready, deep links, context loss and fallback. A mocked renderer cannot prove the scene works.
- [ ] Capture AND view the opening, half/open curtain, doorway alignment, inside view, white handoff and every portfolio tab/collection. Repair failures and repeat neighboring transitions.
- [ ] Test Chromium, Firefox and WebKit at 1440×900, 390×844, 320×800 and 844×390; check tablet layout once. Cover keyboard, touch, 200% zoom and real phones/Safari where available.

**Check:** record browser/device, GPU or software rendering, viewport, motion preference, network, screenshots and pass/fail per requirement. Measure the PRD budgets on a named desktop/phone; label unavailable physical-device checks unverified. Covers R1–R12.

### 8. Make 3D the default and release

- [ ] Confirm normal npm run dev and production preview run the 3D entrance with no environment flags or missing local assets.
- [ ] Remove the old video controller from the active entrance and unused video delivery files from the public build. Preserve original supplied files and rollback history.
- [ ] Run lint, typecheck, unit tests, build and browser tests at both root and the actual Pages base path. Audit the bundle and network: no entrance MP4 or animation image sequence.
- [ ] Publish through the existing GitHub Actions workflow, inspect the actual live desktop/mobile site and update setup, QA and deployment notes.

**Check:** the deployed opening, full journey, reverse, shortcut and fallback match the accepted local build. Record the exact commit, deployment run, URL and remaining limitations. Covers R12 and the PRD definition of done.

## Keep implementation organization simple

- **Scene component:** renderer lifecycle, loading/fallback and render scheduling.
- **Booth/curtain builders:** geometry, materials, textures and tunable dimensions.
- **Timeline configuration:** progress ranges, curtain openness and camera path.
- **Existing HTML components:** portfolio, navbar, focus and page layout.

No new backend or required model file is needed. Add extra modules or libraries only when they remove a clear problem.

## Technical references

Three.js WebGLRenderer requires WebGL2, so unsupported devices need the static route: [renderer documentation](https://threejs.org/docs/pages/WebGLRenderer).

Use [rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html) to avoid an idle animation loop, and follow [resource cleanup](https://threejs.org/manual/pages/cleanup.html) when releasing the scene. Recheck compatible package versions during implementation.
