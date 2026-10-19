# Marvin Studio portfolio — Implementation and deployment plan

Date: 2026-10-15; updated 2026-10-19
Status: Implementation executed for the foundation preview. See [QA acceptance](docs/qa/acceptance.md) and [deployment record](docs/deployment.md). Detailed checkboxes now record verified work; unchecked items remain blocked or unverified. The execution tracker and 2026-10-19 review record explain the remaining gates.
Product source of truth: [prd.md](prd.md)

## 1. Execution rules and completion standard

Build the clean React/Vite experience specified in the PRD, progressing from a working static fallback to version 1 using one combined curtain-opening and booth-entry video. Use one MP4 file, one HTML video element, and scroll-controlled seeking on desktop and mobile. Preserve the existing PoC as a reference. Finish each phase with its verification gate and record actual results, not planned results presented as facts.

**Scope decision: video first; extracted-frame animation later.** Do not implement a canvas image sequence, runtime frame extraction, frame preloading/cache infrastructure, multi-video switching, or a renderer comparison experiment in this iteration. Those are deferred until this version succeeds and the user starts a follow-up task. Keep the static opening poster and reduced-motion/error fallback; they are separate from the deferred frame animation.

The original document was planning-only. Implementation began on 2026-10-15 following the subsequent implementation request. Current evidence and limitations are recorded in docs/qa/acceptance.md; video-specific requirements are not passed by the foundation preview.

Execution order:

1. Audit source and assets; establish baseline and release inputs.
2. Scaffold the React/Vite/TypeScript application and checks.
3. Build the clean responsive hero and persistent navbar.
4. Port the portfolio into accessible HTML components.
5. Implement timeline, white transition, shortcut, and fallback without requiring final footage.
6. Review/optimize one complete entrance video and prove seek performance.
7. Integrate that video and tune scroll, stop-and-hold, and reverse interaction.
8. Complete accessibility, failure, responsive, performance, and AI visual review.
9. Build and verify the production artifact; configure GitHub Actions.
10. Deploy, inspect the live Pages site, and prepare rollback/handoff.

Steps 3–5 above enable Milestone A while the complete entrance video remains unverified. Milestone B is the completed single-video version and cannot pass until media, integration, QA, and deployment meet its requirements. A foundation preview may use the same deployment pipeline, clearly identified as a preview in release notes. Extracted-frame animation is outside both milestones and must not delay completion of this version.

## 2. Proposed repository structure

Use a new `marvin-web/` application directory inside the current repository, keeping the legacy `marvin-poc/dist/` intact. This avoids accidentally treating the legacy editable source as disposable build output.

```text
Website Mario/
  prd.md
  implementation-plan.md
  marvin_main.png                 # preserved source reference
  marvin-poc/                     # legacy reference, not new build output
  marvin-web/
    package.json
    package-lock.json
    vite.config.ts
    tsconfig*.json
    index.html
    public/
      media/                     # approved poster and one combined entrance.mp4
      portfolio/                 # approved portfolio images
    src/
      App.tsx
      components/
        SiteHeader.tsx
        EntranceJourney.tsx
        MediaSurface.tsx
        WhiteTransition.tsx
        PortfolioMonitor.tsx
        PortfolioTabs.tsx
        PortfolioGallery.tsx
        ContactPanel.tsx
      hooks/
        useJourneyProgress.ts
        useEntranceMedia.ts
        useReducedMotion.ts
      lib/
        timeline.ts
        navigation.ts
        mediaManifest.ts
      data/portfolio.ts
      styles/
    tests/
      unit/
      e2e/
    dist/                        # generated production output
  .github/workflows/
    ci.yml
    deploy.yml
  docs/
    media-manifest.md
    qa/                          # reports; keep large videos out of Git
    deployment.md
```

File names are proposed defaults. Keep component boundaries where they make state, media, and portfolio behavior testable; avoid unnecessary abstraction.

**Checklist convention:** checked items include retained evidence from the original implementation and the new [2026-10-19 review](docs/qa/review-2026-10-19/acceptance.md). Checks in phases 4?6 validate the controller using a rejected development fixture; they do not approve that footage. Phase 3 uses local CSS feedback and selects zero React Bits effects. Phase 5 cannot pass without a compliant supplied video. Physical devices, native zoom/screen-reader review and final-media performance remain unverified.

## 3. Phase 0 — Baseline, assets, and release inputs

### Execute

- [x] Read applicable repository instructions; inspect Git status, branch, remotes, and existing files before changing anything. Preserve unrelated/untracked work.
- [x] Review legacy HTML, CSS, JavaScript, README, and any illustrated plan. Inventory reusable content and interactions separately from obsolete animation.
- [x] Run the existing PoC locally and capture desktop/mobile reference screenshots. View them to identify actual layout behavior, not only source structure.
- [x] Inspect `marvin_main.png` at full resolution, verify dimensions, record a checksum, and preserve it unchanged as the source reference.
- [x] Inventory the combined entrance video, photos, copy, contact destination, and repository/Pages access. Mark unavailable inputs explicitly; a separate second clip and exported open-curtain frame are not required deliverables.
- [x] Review the existing local `curtain-open.mp4` candidate (881,291 bytes at initial documentation time). Its filename does not establish whether it includes entry; preserve it, inspect its entire duration, and qualify both actions against MOTION-02–08 before reuse. If it only opens the curtain, record the need for one complete combined video.
- [x] Create `docs/qa/baseline.md` with current implementation, known demo content, missing inputs, and requirement IDs.
- [x] Choose the release target: foundation preview while footage is missing, final release only when its prerequisites exist.

### Verify and exit

- [x] Existing PoC remains intact and runnable.
- [x] Baseline screenshots have been viewed, and differences from HERO-01 and MOTION-02–08 are documented.
- [x] No final footage, genuine portfolio collection, or working booking service is assumed to exist without evidence.

## 4. Phase 1 — React/Vite/TypeScript foundation

### Execute

- [x] Create `marvin-web/` with a current compatible React/TypeScript Vite template. Inspect the generated files before modifying them.
- [x] Use an actively supported Node LTS version compatible with selected tooling; pin it for local development and CI. Commit the dependency lockfile.
- [x] Configure strict TypeScript, linting, build, development, and production-preview scripts.
- [x] Establish CSS tokens for pure white, dark text, muted neutral surfaces, curtain-yellow accents, spacing, navbar height, focus, and layer order.
- [x] Create the application shell and component/data directories. Keep the application static and single-page.
- [x] Add meaningful unit/integration tests for timeline/navigation state and browser tests for the real flows. Proposed tooling: Vitest, React Testing Library, Playwright, and axe integration; use current compatible releases.
- [x] Define scripts: `dev`, `lint`, `typecheck`, `test:unit`, `test:e2e`, `build`, and `preview`. Make unit tests non-watch in CI.
- [x] Document setup commands and ignore only the new generated output, dependencies, and temporary test artifacts. Do not broadly delete or ignore the legacy source directory.

### Verify and exit

- [x] Clean dependency installation succeeds; lint, typecheck, and build pass.
- [x] The production preview renders the React shell, with no application console errors.
- [x] Content and media configuration can be changed independently of timeline code.

## 5. Phase 2 — Clean opening and navbar

Requirements: HERO-01–03, NAV-01–03, RES-01.

### Execute

- [x] Place the preserved/approved opening asset in the new app's media directory. Give it explicit intrinsic dimensions, meaningful alt text, and reserved layout space.
- [x] Use a viewport-aware stage beneath the persistent navbar. Account for mobile safe areas and dynamic browser chrome; avoid hard-coded heights that crop short screens.
- [x] Fit the whole 16:9 composition using contain behavior; retain full booth sign/base and generous white space. Do not stretch or crop merely to fill the viewport.
- [x] Remove legacy intro copy, hero buttons, captions, scroll hints, chapter controls, progress, and overlay curtains from the new opening.
- [x] Keep navbar above scene/white layers. Implement brand/home and semantic “Our work” navigation; keep concept links out of public navigation.
- [x] Use exactly the same media rectangle, object position, aspect ratio, and responsive rules for poster and video.
- [x] Compare the image boundary against pure white. If normalization is necessary, retain the original and produce matching poster/video source derivatives without changing booth detail.

### Verify and exit

- [x] AI views screenshots at 1440×900, 1920×1080, 390×844, 360×800, and a short landscape viewport.
- [x] Check complete booth visibility, centering, navbar clearance, empty hero, absence of horizontal overflow, and any off-white rectangle around the image.
- [x] Confirm navbar controls work by mouse, touch, and keyboard. HERO-03 remains pending until an actual video first frame is available.

## 6. Phase 3 — Interactive HTML portfolio

Requirements: WORK-01–06, A11Y-02–04.

### Execute

- [x] Port the decorative camera and monitor into React components; do not request camera/microphone permission.
- [x] Create typed local data for collections, image sources, alt text, captions, and experience/contact copy. Distinguish demo fixtures from launch-ready content.
- [x] Implement “The portraits,” “The experience,” and “Say hello” tabs with tablist/tab/tabpanel relationships, roving tabindex, selected state, and keyboard navigation.
- [x] Implement collection previous/next controls and a current-collection announcement. Define wraparound behavior and test both ends.
- [x] Optimize portfolio images and reserve their dimensions. Show a useful alternative if an image fails without collapsing the monitor layout.
- [x] Make mobile content readable at normal font sizes; let the monitor grow rather than scaling down its whole desktop UI. Avoid nested scroll traps.
- [x] Add only confirmed contact destinations. If none exists, omit the action or use honest unavailable/demo text within the monitor.
- [x] Select at most a small number of suitable React Bits effects after checking their current documentation, dependencies, and license. Use them for portfolio feedback only, with a reduced-motion equivalent.
- [x] Remove the legacy flash effect by default and remove any implication of a completed booking or sent message.

### Verify and exit

- [x] Exercise every tab, collection, and available link in the browser; select rendered text and confirm controls are DOM elements independent of video.
- [x] Complete the full portfolio with keyboard only; check ArrowLeft/Right, Home, End, Tab, Shift+Tab, and focus visibility.
- [ ] Inspect long copy, narrow screen, 200% zoom, and broken-image cases. Confirm no unreadably tiny monitor UI or missing content.
- [x] Check accurate demo/contact labels and verify external destination URLs without sending messages.

## 7. Phase 4 — Timeline, white transition, and media-independent routes

Requirements: MOTION-01, MOTION-09–10, TRANS-01–03, NAV-02–03, A11Y-01/03, RES-01–02.

### Execute

- [x] Build a pure timeline mapper returning scene state, a timestamp in the single video, white opacity, monitor opacity, and interaction eligibility from clamped progress. No clip index, source switching, or frame-index renderer is needed.
- [x] Keep scene state separate from loading capability: `loading`, `ready`, `fallback`, and `reducedMotion` must not compete with visual timeline phases.
- [x] Start with the provisional timing below; store breakpoints in configuration and tune against actual footage.
- [x] Render white as a full-scene `#FFFFFF` layer below navbar. Use an opaque interval to separate footage from the monitor reveal.
- [x] Keep hidden monitor content inert/hidden to assistive technology until reveal completes. Remove transition input interception once the monitor is active.
- [x] Implement native scroll measurement, passive listeners, animation-frame coalescing, and cleanup. Do not hijack wheel/touch events or continuously rerender React for every scroll tick.
- [x] Implement “Our work” to bypass media immediately and synchronize scroll, route, reveal, and focus state. Use `#work` for refreshable direct entry; account for navbar offset.
- [x] Handle brand/home, history traversal, restored scroll, resize, and orientation without stale target progress or unexpected replay.
- [x] Ensure monitor browsing scroll does not unexpectedly re-enter the entrance; reverse only when scrolling back across the actual journey boundary.
- [x] Implement reduced-motion immediate/brief-white entry, including changes to the preference during a visit. Avoid downloading entrance media when it is not needed.
- [x] Implement static-to-white-to-monitor fallback for missing/error/stalled media. Proposed timeout: 5 seconds without useful progress after entrance intent, not simply 5 seconds from page load.
- [x] Prevent late video readiness from yanking someone out of the monitor or replaying an animation already skipped.
- [x] Preserve focus on passive scroll; safely relocate it only if its focused subtree is about to become hidden/inert.

### Provisional normalized timeline

| Progress | Scene | Expected behavior |
| --- | --- | --- |
| 0.00–0.08 | Static booth / first frame | Composition stable; poster retained until matching frame is renderable |
| 0.08–0.78 | Single entrance video | Scroll maps continuously through stationary curtain opening, open-door pause, and physical forward/rightward entry, all within the same file |
| 0.78–0.86 | White fade | Warm-white final frame fades fully to `#FFFFFF` |
| 0.86–0.90 | White hold | Opaque white; no monitor or footage visible |
| 0.90–1.00 | Monitor reveal | White recedes/monitor appears; enable controls when fully revealed |

These ranges are tuning defaults, not final artistic timing. A scroll-driven white hold is a progress interval: stopping there may hold white indefinitely. Direct navigation and fallback use a short bounded transition instead, proposed 120 ms fade + 80 ms white + 180 ms reveal; reduced motion may be instant. Never force a long animation before portfolio access.

Within the video range, start with `videoProgress = clamp((progress - 0.08) / 0.70, 0, 1)` and `targetTime = videoProgress * lastUsableTime`. Determine `lastUsableTime` from the real file and avoid seeking past the final decodable frame. The footage provides the opening/hold/entry timing; record their timestamps for QA rather than splitting the runtime into separate videos. Keep the video paused, seek toward the newest target, and retain the selected frame when scrolling stops. Do not call `play()` simply because the visitor entered the section.

### Verify and exit

- [x] Unit-test exact boundaries, negative/overshoot progress, non-finite media duration, forward/reverse mapping, and fallback transitions.
- [x] Verify stop-and-hold after a seek settles and a rapid forward/backward change while a seek is pending; only the latest target should win, with no autonomous playback.
- [x] Browser-test direct shortcut before metadata loads, at mid-entrance, at white, and at monitor; refresh `#work` and use browser Back/Forward.
- [x] Block media requests and confirm a usable monitor. Toggle reduced motion during entry and confirm no stuck state or unnecessary replay.
- [x] AI views white coverage, fade midpoint, full monitor, focus visibility, and short-screen/mobile layouts.
- [x] Milestone A works without final video; video-specific criteria remain explicitly pending.

## 8. Phase 5 — Qualify and optimize one combined video

Requirements: HERO-03, MOTION-02–08, RES-03, PERF-01/03.

### Execute

- [ ] Inspect the supplied candidate end-to-end. Accept one video containing the complete closed-booth opening, curtain movement, doorway entry, and warm-white final view. If entry is absent, obtain a complete combined video before claiming animation completion.
- [ ] Verify its initial composition matches `marvin_main.png` or the documented visually equivalent approved derivative. During opening, enforce a fixed camera, one curtain, right-to-left free-edge motion, top-rail attachment, and empty warm-white interior.
- [x] Inspect beginning, intermediate moments, and ending for stable MARVIN lettering, photographs, chrome edges, and lighting. Reject split curtains, moving surroundings during opening, added objects, or geometry changes.
- [ ] Verify that the same video continues from the open doorway into level human-eye perspective, gentle rightward alignment and forward doorway passage, left-gathered curtain, and warm-white final surface. No return to a closed curtain or visible transition jump is allowed.
- [ ] Review motion for digital zoom, clipping through geometry, roll/tilt/bounce, wrong doorway, or left turn. Correct noncompliant footage before integration; do not synthesize missing entry through CSS scaling or extracted frames.
- [ ] Prepare one optimized MP4 with a broadly compatible codec, no audio, sensible resolution, browser-friendly metadata placement, and seek-friendly keyframe intervals. Tune encoding on the actual desktop/mobile test devices; target a shared asset of at most 4 MB while retaining acceptable image quality.
- [ ] Preserve the source file; publish only the selected combined delivery asset as `public/media/entrance.mp4`. Do not require two source clips, perform runtime clip switching, or create playback image assets.
- [ ] Record duration, frame rate, codec, dimensions, byte size, first/last usable timestamps, curtain-open/entry landmarks, and content hash in `docs/media-manifest.md`.
- [ ] Use the same file on desktop/mobile and verify responsive fitting preserves the booth and doorway trajectory. Keep poster and first-frame framing matched.
- [x] Build a minimal single-video seek spike before polishing the controller. Measure ordinary, rapid, stop-and-hold, and reverse seeking on desktop/mobile; optimize video encoding and scheduling rather than comparing against a canvas renderer.

### Verify and exit

- [x] AI actually views the video and browser evidence and records a verdict for every choreography requirement; filenames or generation prompts are not evidence of compliance. QA screenshots do not become runtime frame assets.
- [ ] The opening-to-entry transition within the single video is visually continuous; inspect moments on either side for geometry, lighting, and perspective consistency.
- [ ] Browser seeking has no recurrent black frames or unacceptable stalls on supported reference devices; size budgets are met or the encoding is revised.
- [x] If usable final media cannot be obtained, stop claiming Milestone B readiness and continue only the foundation/fallback milestone.

## 9. Phase 6 — Media integration and reverse behavior

### Execute

- [ ] Connect one combined MP4 through the media manifest and base-aware asset helper, using a single video element on every viewport. Keep the element and source stable across the opening and entry segments.
- [x] Keep the static poster visible until the required decoded frame is ready. Set appropriate muted/inline media attributes and avoid dependence on autoplay permission.
- [x] Keep the video paused and map scroll progress to valid `currentTime` targets after metadata arrives. Account for duration boundaries, avoid seeking beyond the last usable frame, and wait for a renderable target instead of assuming the time assignment displays a frame immediately.
- [x] Coalesce seeks: retain only the newest target while a seek is in flight; do not accumulate a seek promise/task for every scroll event. Confirm presented frames before swapping visible layers where supported.
- [x] Preserve the last presented video frame while the next seek resolves; prevent black flashes. Use seek/render readiness events where available and a bounded stall deadline. Do not introduce a second video or canvas frame cache.
- [x] Use the same mapper for reverse travel; do not rely on negative playback speed. On unsupported seeking paths, use the documented fallback and disclose that limitation in QA.
- [ ] Recompute layout on resize/orientation without changing the video source, restarting the download, or resetting the visitor unexpectedly.
- [x] Pause unnecessary work offscreen and clean up media/event resources on unmount. Handle tab background/resume coherently.
- [ ] Integrate the final warm-white frame with CSS white fade, white hold, and live monitor reveal. Tune scroll distance against real wheel, trackpad, and touch use.

### Verify and exit

- [ ] Run cold-load and cached-load forward/reverse passes; inspect all timeline boundaries and intermediate states.
- [x] Confirm there is one entrance video element and one media URL in the browser; HTTP range requests to that URL are expected, but there must be no second segment source or image-sequence downloads.
- [ ] Scroll rapidly to end and back, stop mid-curtain and mid-doorway, rotate/resize mid-sequence, background/resume the tab, and repeat after direct navigation.
- [ ] Confirm accurate doorway parallax and stable booth geometry in the rendered browser, not only in the source video player.
- [x] Confirm no navbar occlusion, input-blocking overlay, unexpected focus loss, giant blank scroll region, or inaccessible portfolio.

## 10. Phase 7 — Automated and manual quality checks

### Test layers

| Layer | Meaningful coverage | Evidence |
| --- | --- | --- |
| Static | Type correctness, lint, production build, accidental secrets/local paths | Command output and exit status |
| Unit/integration | Timeline boundaries/reversal, invalid metadata, fallback timeout, skip/loading race, reduced-motion switch, tab/collection behavior | Test results with behavior-focused assertions |
| Browser E2E | Navigation, direct hash, scroll entry/reversal, keyboard focus, collection browsing, white/monitor interaction boundary | Browser reports, trace on failure |
| Accessibility | Automated violations plus manual keyboard, screen-reader landmarks/tab announcements, contrast, zoom, reflow | Automated report and manual notes |
| Performance | Transfer sizes, cold load, layout shift, scroll/seek trace, repeated journeys/memory behavior | Named device/profile, trace and measurements |
| Visual | Composition, curtain, camera, continuous opening-to-entry motion, white, monitor appearance and end-to-end flow | AI-viewed screenshots/recordings and written verdict |

Use actual media in final animation tests; mocks are useful for failure-state logic but cannot validate choreography or decode performance. Do not rely on fixed sleeps when a stable render/seek condition can be observed. Do not add tests that merely repeat implementation constants without validating behavior.

### Browser/device matrix

| Profile | Minimum coverage |
| --- | --- |
| Desktop Chromium | 1440×900 and 1920×1080; wheel, keyboard, forward/reverse, normal/reduced motion |
| Desktop Firefox | Complete flow, seeking, tabs/focus, fallback |
| Safari on macOS where available | Inline media/seek behavior and complete flow; Playwright WebKit is additional coverage, not proof of real Safari behavior |
| Android Chrome | Real device where available; 360×800 or comparable, touch scroll, address-bar resizing, orientation |
| iPhone Safari | Real device where available; 390×844 or comparable, touch scrolling, inline seeking, safe areas, orientation |
| Tablet | 768×1024 plus landscape; composition and readable monitor |
| Narrow/reflow | 320 CSS px and 200% text zoom; no clipped controls or lost content |
| Adverse network | Cold cache, throttled slow connection, video 404/corrupt/stalled request, unsupported format, portrait image failure |

Record exact browser versions and devices. Device emulation checks layout and touch event behavior; it does not establish hardware decoder performance. Mark unavailable real-device coverage unverified, and document fallback coverage before selecting the release claim.

### Performance procedure

- [x] Use a documented mobile lab profile, proposed 4× CPU slowdown, 1.6 Mbps downstream, 750 Kbps upstream, 150 ms RTT, cold cache; record tool version and actual settings.
- [x] Run three cold-load measurements and report median plus worst result for LCP/CLS and transfer size. Separate initial page cost from entrance video requested later.
- [x] Measure interactions locally and report them as lab evidence; reserve field INP claims for real-user measurements.
- [ ] Profile at least three repeated forward/reverse journeys on a named reference device; look for recurrent >200 ms seek stalls, long tasks, increasing memory, and duplicate downloads.
- [ ] If budgets fail, reduce unnecessary effects, optimize the single video's resolution/bitrate, adjust keyframes or seek scheduling, or route affected configurations to fallback; repeat affected measurements. Keep extracted-frame rendering deferred.

## 11. Mandatory AI visual browser inspection protocol

This is a release gate, not optional polish. **The AI implementing the website must see the rendered images and inspect the actual interaction flow, then judge whether they fulfill the PRD.** Code review, DOM checks, automated accessibility scans, screenshot capture alone, and a clean console do not satisfy this gate.

### Review loop

1. Start the app and open its actual local URL in an available browser-control tool. Use the production preview for the release candidate.
2. Set the declared viewport, device-pixel ratio, motion preference, and network state. Begin from a fresh load unless testing restoration.
3. Capture the initial scene. Open/view the screenshot using a tool that exposes its pixels to the AI; compare with `marvin_main.png` and HERO-01–03.
4. Drive the flow with real scroll, keyboard, and touch controls. Observe live browser renders; capture checkpoints below. Use test-only timeline controls for repeatable diagnostic frames, then validate with real scrolling too.
5. View a recorded sequence if supported. Otherwise step through closely spaced rendered frames and interactively inspect movement; a single still cannot establish camera path or motion continuity.
6. Inspect all portfolio interactions, focus positions, responsive states, and fallback paths. Confirm rendered appearance and functional behavior agree.
7. Write a requirement-linked verdict with evidence and concrete defects. Never mark pass if footage is missing, a tool could not expose images, or a required interaction was not exercised.
8. Repair defects, rebuild as necessary, and repeat failed checks plus surrounding transitions. Run the full critical journey again after changes to layout, timeline, media, or input layering.
9. Repeat the critical review at the deployed Pages URL, including cold-cache asset loading and direct `#work` entry.

### Required checkpoint evidence

| Checkpoint | What the AI must judge | PRD IDs |
| --- | --- | --- |
| Initial hero, desktop/mobile | Only booth and navbar; centered full sign/base, pure-white surround, no old overlays | HERO-01/02, NAV-01 |
| Poster → first video frame | Matching scale, position, background, no jump/black flash | HERO-03 |
| Curtain half-open | One panel, free edge moving right-to-left, booth/camera fixed | MOTION-02–04 |
| Open doorway and start of entry | Gathered curtain left; empty interior; brief hold; continuous motion within the same video | MOTION-03/05 |
| Alignment and doorway passage | Forward/right alignment, real perspective/parallax, level horizon, no collision or left turn | MOTION-06/07 |
| Final interior | Plain warm-white surface; no generated monitor or changed booth elements | MOTION-08 |
| Fade and pure-white hold | Solid white covers scene, navbar remains legible, no borders/residual video | TRANS-01/02 |
| Monitor halfway and fully revealed | Smooth reveal; hidden controls unavailable; visible controls usable | TRANS-03, WORK-01 |
| Every tab and collection | Readable text, correct content, working feedback, no distorted or tiny mobile UI | WORK-02–05 |
| Stop, reverse, and rapid scroll | Settles at requested time when scroll stops; coherent reverse order; no flash, autonomous playback, trapped scroll, or stale state | MOTION-09/10 |
| Shortcut, deep link, home | Immediate correct destination, suitable focus, history behavior | NAV-02/03, A11Y-03 |
| Reduced motion and video failure | Usable monitor without forced animation; poster while loading; no dead end | A11Y-01, RES-01/02 |
| Touch/orientation/zoom | Stable framing, natural scroll, reachable controls and readable content | HERO-02, WORK-04, A11Y-04 |
| Live Pages deployment | Same appearance/flows with real base path, assets, and network behavior | VIS-04 |

### Evidence record template

```text
Review ID / date:
Milestone / build or commit / local or deployed URL:
Browser version / device / viewport / DPR:
Motion preference / network profile / cache state:
Requirement IDs and checkpoint:
Steps actually performed:
Expected visual and functional outcome:
Observed outcome after viewing images and exercising flow:
Screenshot / frame sequence / recording paths:
Verdict: PASS | FAIL | BLOCKED | UNVERIFIED
Defect severity, reproduction steps, fix reference:
Retest evidence and final verdict:
```

Use filenames such as `desktop-1440x900-hero.png`, `mobile-390x844-curtain-half.png`, `desktop-doorway-open.png`, `desktop-entry-start.png`, `mobile-white-hold.png`, and `production-work-keyboard.png`. Store actual output paths in the report. Keep recordings and sampled screenshots as QA evidence rather than shipping a runtime image sequence.

Critical failures: inaccessible portfolio, broken deployment, blank/stuck journey. High failures: wrong curtain direction, split curtain, digital-zoom entry, changed lettering/geometry, first-frame jump, missing white handoff, obscured navbar, keyboard trap, reduced-motion failure, or unusable mobile layout. These block the applicable release.

## 12. Phase 8 — Production artifact and GitHub Actions

Requirements: platform constraints, VIS-03; all applicable preceding gates.

### Execute

- [x] Resolve actual repository owner/name, hosting type, default branch, and Pages availability. Do not assume a private repository implies a private Pages site; verify deployment visibility before publishing business/demo content.
- [x] Configure Vite `base`: `/REPOSITORY/` for project Pages; `/` for account-root or applicable custom-domain hosting. Use imported asset URLs or `import.meta.env.BASE_URL` for public assets and avoid hard-coded root-relative media paths. [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages)
- [x] Use fragment navigation so `#work` remains reloadable without server rewrites. Test the final base path locally.
- [ ] Add title, description, favicon, and approved social-preview assets; set canonical/preview URLs only after the actual deployment URL is known.
- [x] Audit `marvin-web/dist/`: only runtime assets, no private notes, credentials, unused clips, legacy source, or QA recordings.
- [x] Create CI for pull requests: dependency installation, lint, typecheck, unit tests, build, and relevant browser tests against production preview. Keep publishing separate from PR validation.
- [x] Configure Pages source as GitHub Actions. Use build/upload/deploy stages with an explicit dependency so deployment cannot race the artifact build. Use `contents: read`, and grant the deployment job `pages: write` and `id-token: write`; attach the `github-pages` environment and deployment URL. [GitHub custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [x] Read current official action examples when implementing and pin reviewed action revisions. Set the Node version and lockfile cache path for `marvin-web/`.
- [x] Build from `marvin-web/`, but upload the repository-relative artifact path `marvin-web/dist`; a shell working-directory setting does not automatically change action input paths.
- [x] Trigger deployment on the verified default branch and manual dispatch. Use a Pages concurrency group to avoid overlapping deployments. Never deploy PR previews over production automatically.
- [x] Retain test reports and visual evidence associated with the exact candidate commit. Document manual visual acceptance in the release record; automated CI success cannot provide that judgment.

### Planned command contract

Run these from `marvin-web/` after the scripts exist. They are sequential steps, not commands that have already been run:

```powershell
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:e2e
npm run preview -- --host 127.0.0.1
```

Configure E2E to start a production-preview server and visit the configured base path; install required browser runtimes in CI. `vite preview` is for local artifact inspection, while Pages serves the deployed static files. [Vite production preview](https://vite.dev/guide/static-deploy.html#testing-the-app-locally)

### Verify and exit

- [ ] A clean checkout reproduces the build with the committed lockfile and pinned runtime.
- [x] Production preview passes the applicable automated tests and AI visual gate at desktop/mobile sizes.
- [x] All image/video/script/font paths work under the real repository subpath; direct `#work` refresh works.
- [x] Release record clearly states foundation preview or version 1 single-video release, known gaps, and verified/unverified environments.

## 13. Phase 9 — Deploy and inspect the live website

### Execute

- [ ] Publish the verified candidate through the configured GitHub Actions workflow as part of an authorized implementation/deployment task.
- [ ] Confirm the Pages job succeeded and record exact commit, workflow run, artifact, timestamp, and deployed URL in `docs/deployment.md`.
- [ ] Open that exact URL in the browser with cold cache. Verify the document and all required assets load without 404, mixed-content, decoding, or application errors.
- [ ] Perform the complete entrance → white → monitor journey at desktop and mobile sizes; reverse it, use “Our work,” refresh `#work`, and return home.
- [ ] Repeat reduced-motion and blocked-video cases on the deployed site. Inspect tabs, gallery, configured contact destinations, and keyboard focus.
- [ ] Capture and actually view production screenshots and motion evidence. Compare against the accepted local production preview and the PRD.
- [ ] Verify post-deployment transfer/seek behavior and confirm one combined entrance media URL, no runtime source swapping, and no extracted-frame downloads.
- [ ] If verification fails, diagnose and redeploy a tested fix or use rollback; a green deployment job alone does not mean the site is complete.

### Final release checklist

- [x] The entire opening is clean and matches the approved booth reference.
- [x] One combined video passes every required curtain/camera criterion and scroll/stop/reverse tests, or the release is explicitly limited to the Milestone A foundation preview.
- [x] White transition and real HTML monitor work forward, backward, via shortcut, and via reduced-motion/failure routes.
- [x] Required browsers/devices have actual results, with any gaps marked unverified rather than silently passed.
- [ ] Applicable automation, accessibility, performance, and AI visual review pass; no critical/high defect remains.
- [ ] The deployed URL has been inspected visually and functionally, with evidence linked to its exact commit.
- [x] Handoff includes run/build instructions, asset replacement instructions, Pages settings, known limitations, and rollback steps.
- [x] Record whether version 1 succeeded against the PRD. Keep extracted-frame animation listed as deferred future work, not as an unfinished requirement or an automatic next implementation step.

## 14. Rollback and maintenance

- Before replacing a working Pages deployment, record its known-good commit, workflow, and artifact if retained.
- If the new release is unusable, redeploy the known-good artifact or rebuild its exact commit with the recorded runtime/lockfile. Keep unrelated repository changes intact; avoid destructive resets.
- For the first deployment with no prior Pages release, use the last verified foundation fallback candidate if available; otherwise fix/rebuild before claiming a working site.
- Recheck the live URL, asset loading, direct portfolio access, and visual evidence after rollback. Record the incident and affected requirements.
- Future video replacements must repeat poster/first-frame continuity, continuous opening-to-entry motion, doorway choreography, seek performance, and white-transition tests. Future gallery/content changes must repeat layout, image loading, keyboard, and mobile checks.
- After the single-video version succeeds, a separate user-requested task may update the PRD and plan for extracted-frame/canvas animation. Do not build or deploy that renderer as part of this iteration.
- Keep the PRD and QA matrix aligned when product decisions change. Never silently weaken a requirement to turn a failed test into a pass.

## 15. Execution tracker

| Phase | Deliverable | Gate | Status |
| --- | --- | --- | --- |
| 0 | Baseline and asset inventory | Known inputs and gaps documented | Complete; legacy preserved, screenshots viewed; candidate rejected |
| 1 | React/Vite/TS foundation | Clean install, lint, types, build | Complete; Node 24.18.0, lockfile, strict TS, clean lint |
| 2 | Clean hero/navbar | AI-viewed desktop/mobile opening | Complete for foundation; HERO-03 pending compliant footage |
| 3 | HTML monitor | Functional and keyboard portfolio | Complete with labeled reference fixtures; contact unavailable |
| 4 | Timeline, white, skip, fallback | Milestone A local acceptance | Complete foundation: repaired mobile page overflow, resize reading position, reduced-motion focus and Firefox deep links; bounded white failure route |
| 5 | Qualified combined MP4 | Both actions and single-video seek spike | Candidate reviewed: both actions present, stationary opening and first-frame fail; delivery blocked. Controller spike passes |
| 6 | Integrated single-video entrance | Scroll/stop/reverse browser review | Controller implemented and tested with development fixture; compliant production integration blocked |
| 7 | Full QA evidence | Applicable PRD requirements pass | Chromium desktop/mobile, Firefox and WebKit foundation checks; eight viewport visual review. Physical devices, native zoom/screen reader and final-footage qualification remain open |
| 8 | Production build/workflow | Artifact and base-path acceptance | Production artifact and pinned workflows implemented; project-path checks run |
| 9 | Live deployment and handoff | Production visual/functional acceptance | Previous foundation live. New fixes pushed as 1c249c9; Actions run 39280365944 still queued after ten minutes without a runner. New live acceptance remains pending; see docs/deployment.md |
| Future | Extracted-frame/canvas animation | Separate follow-up after version 1 succeeds | Deferred; outside current scope |

Official deployment references were consulted on 2026-10-15. Recheck them when implementing because supported runtimes and action revisions can change.
