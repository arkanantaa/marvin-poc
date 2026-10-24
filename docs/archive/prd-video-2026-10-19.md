# Marvin Studio portfolio — Product requirements

Date: 2026-10-15  
Status: Foundation preview implemented, tested and deployed on 2026-10-15; single-video version 1 remains blocked by compliant footage and final-release gates. See [QA acceptance](docs/qa/acceptance.md).  
Execution companion: [implementation-plan.md](implementation-plan.md)

## 1. Purpose and desired outcome

Build an interactive portfolio for Marvin Studio, a photobooth business. Visitors first see the complete booth in a quiet, uncluttered composition. Scrolling opens its curtain and takes them physically through the right-hand doorway, ending in a white transition that reveals an interactive HTML camera and portfolio monitor.

**Current implementation decision: use one continuous video containing both curtain opening and entry into the photobooth.** Scroll position controls the time of one HTML video element. The extracted-still-frame/canvas approach discussed later in the conversation is deferred until this video version succeeds; it is not part of the current build or its acceptance criteria. The static opening poster and accessibility/error fallback remain required and are not the deferred animation technique.

The experience should make the booth memorable while keeping the work easy to reach. A visitor who skips animation, prefers reduced motion, or cannot load video must still be able to explore the portfolio.

Success means the implemented website satisfies the requirements below in a rendered browser, including visual continuity and usability. A successful build, passing DOM assertions, or attractive individual screenshots alone do not establish success.

## 2. Source of truth and current state

The user's supplied brief and subsequent decision to use one video first are the primary product direction. The single-video decision supersedes the original two-clip delivery workflow and the proposed image-sequence renderer. This PRD records that direction and identifies proposed implementation defaults separately. The existing PoC is a reusable reference, not the final visual specification.

| Resource | Location / status |
| --- | --- |
| Workspace | `C:\Users\LENOVO\Documents\ChatGPT\Website Mario` |
| Existing PoC | `marvin-poc/` |
| Editable legacy implementation | `marvin-poc/dist/index.html`, `styles.css`, and `app.js`; despite its name, this directory currently contains source files |
| Authoritative opening image | `marvin_main.png`, 1920 × 1080, 16:9 |
| Existing private preview | https://marvin-booth-poc.boldmoose64.chatgpt.site — provided by the user; not independently browser-tested during this documentation task |
| Existing approach | HTML, CSS, vanilla JavaScript; simulated curtains/interior, portfolio tabs, collection controls, keyboard handling, and demo contact dialog |
| Entrance media status | `curtain-open.mp4` was present at the initial inventory (881,291 bytes), but its content/compliance has not been reviewed. Verify whether it includes both opening and entry; no complete combined entrance video has been approved or integrated |

Local source inspection confirmed that the old opening includes copy, a hero button, captions, scroll instructions, chapters, progress, split curtains, and a simulated left turn. These are not valid substitutes for the final direction. Existing portraits and contact behavior are demonstration content.

Visual inspection of the supplied image shows a complete frontal booth with the golden curtain on its right. Its surrounding pixels appear slightly off-white; inspect the rendered boundary against `#FFFFFF` before release. Preserve the original asset. Any necessary background-normalized derivative must preserve booth details and become the shared reference for both the opening image and animation first frame.

## 3. Audience and core journeys

- Prospective clients exploring the booth, sample photography, and event experience on desktop or mobile.
- Returning visitors who want immediate access to the work through the navbar.
- Visitors using keyboards, assistive technology, reduced motion, or constrained connections.

| Journey | Required outcome |
| --- | --- |
| First visit | Complete booth beneath navbar, then curtain opening, doorway entry, white, and usable monitor |
| Direct access | “Our work” bypasses the entrance and reaches the portfolio without waiting for video |
| Reverse scroll | Supported animation reverses coherently through white, interior, open curtain, and opening composition |
| Reduced motion | Bypass camera movement and curtain animation; reach the monitor through an immediate or very brief white transition |
| Video unavailable | Static image remains while loading; failure leads to a usable static-to-white-to-monitor experience |
| Explore portfolio | Browse real HTML tabs, gallery controls, readable content, and any configured contact link |

## 4. Scope and release milestones

### Milestone A — foundation preview

Convert to React, Vite, and TypeScript; deliver the clean opening, live HTML monitor, direct navigation, responsive layouts, accessibility, media interface, fallback, tests, and deployment pipeline. Missing final footage is allowed for this milestone, with a static-to-white-to-monitor fallback. Record this limitation in project documentation and preview handoff, without adding captions to the hero.

### Milestone B — version 1: single-video release

Integrate one continuous video that passes the opening and entry requirements, tune scroll seeking and reverse behavior, and pass visual, functional, accessibility, performance, and deployed-site gates. Stopping scrolling holds the selected moment; scrolling backward seeks backward. This is scroll scrubbing, not scroll-triggered automatic playback. Milestone A must never be described as the completed video version.

### Deferred — extracted-frame animation

Only after version 1 has passed the applicable PRD requirements and deployed browser inspection should an image-sequence/canvas implementation be considered in a separate future task. Do not extract a runtime frame sequence, build a frame loader/cache, or compare alternative renderers in this iteration. Success of version 1 does not depend on delivering that later enhancement.

### Included

- Navbar, clean hero, scroll journey, white transition, decorative HTML camera, and interactive portfolio monitor.
- One combined entrance video file, one HTML video element, and one scroll-to-time controller; use the same video on desktop and mobile with responsive layout.
- Editable local portfolio data and images; responsive and keyboard-accessible controls.
- Sparse portfolio effects, using selected React Bits components only when they fit the requirements.
- Static GitHub Pages hosting and GitHub Actions deployment.
- AI visual browser inspection, evidence capture, defect repair, and post-deployment verification.

### Excluded unless separately requested

- Backend, CMS, accounts, payments, booking engine, image uploads, live webcam capture, or database.
- Extracted-image playback, canvas frame rendering, frame-cache infrastructure, multi-video switching, and renderer comparison experiments in version 1.
- Collecting or sending contact data without a configured service.
- Hero text, hero buttons, scroll instructions, chapters, visible progress, simulated split curtains, or the old left-turn sequence.
- Baked-in portfolio UI inside generated footage; wholesale animation libraries or decorative hero effects.
- Publicly exposing the old implementation-plan page as part of the customer navigation by default.

## 5. Functional and visual requirements

### Opening and navigation

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| HERO-01 | Clean initial composition | Hero contains only the supplied booth composition on a page background of `#FFFFFF`; no visible headline, introductory paragraph, hero buttons, captions, scroll instruction, chapters, or progress indicator |
| HERO-02 | Complete responsive booth | Entire booth, including sign and base, fits comfortably below the navbar at desktop and mobile test sizes without clipping or distortion; preserve aspect ratio |
| HERO-03 | Matching first frame | Poster-to-video handoff has matching position, scale, framing, and background; no visible jump, black flash, or duplicate booth |
| NAV-01 | Persistent navbar | Navbar stays visible, legible, and operable throughout entrance, white transition, and monitor use; media layers cannot cover or intercept it |
| NAV-02 | Direct “Our work” | A semantic navbar link targets `#work`, bypasses video loading and animation, exposes the monitor, and puts keyboard focus in a meaningful visible location |
| NAV-03 | Return and deep link | Brand/home control returns coherently to the opening; loading or refreshing `#work` reaches the monitor directly without a hero flash or full entrance replay |

No visible hero heading is required. A visually hidden page heading may provide semantic structure. Proposed navbar default: brand/home plus “Our work”; retain a contact action only when its destination is configured. The old “The concept” link is development material, not a required public navigation item.

### Entrance choreography

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| MOTION-01 | Three-stage journey | Complete booth on white → approach and enter the right doorway → white transition and HTML monitor |
| MOTION-02 | Opening segment: stationary camera | Camera remains completely fixed. Only the existing single golden-yellow curtain panel moves; its free edge travels from screen-right to screen-left, gathering naturally on the doorway's left side while attached to its existing top rail |
| MOTION-03 | Opening segment: invariant scene | Booth, MARVIN lettering, framed photographs, chrome, lighting, and background stay stable; reveal only the empty warm-white interior and hold briefly fully open |
| MOTION-04 | Footage exclusions | No split curtain, movement of the free edge toward screen-right during opening, people, hands, animated photographs, changed lettering, warped geometry, extra furniture/equipment, or camera movement during the curtain-opening segment |
| MOTION-05 | Continuous opening-to-entry motion | The same video proceeds from the fully open doorway into camera entry, with no reset to the closed curtain or visible lighting, crop, geometry, or perspective jump; no runtime source swap |
| MOTION-06 | Entry segment: physical entry | Camera advances smoothly at human eye level, translates slightly screen-right to align with the actual doorway, and physically passes through it with perspective and parallax |
| MOTION-07 | Entry segment: stable framing | Level horizon; no roll, tilt, walking bounce, left turn, flat digital enlargement, intersection with curtain/frame, or mutation of rigid booth details. Gathered curtain remains on the doorway's left |
| MOTION-08 | Video end: final view | End facing a plain, softly illuminated warm-white interior surface; the footage contains no monitor UI |
| MOTION-09 | Scroll and reverse | Native wheel, trackpad, and touch scrolling drive bounded progress. Pause holds the scene; supported reverse scrolling reverses it without replay jumps. Unsupported devices use the documented fallback |
| MOTION-10 | Seeking robustness | Rapid scroll, direction changes, resize, orientation change, and restored scroll position cannot leave a blank frame, trapped viewport, inaccessible monitor, or stuck loading state |

Opening and entry are segments within one delivered video, not separate runtime assets. The website accepts a single complete MP4; it does not require a separate second clip or exported open-curtain starting image. Exact duration, segment timestamps, encoding, and scroll distance are implementation defaults to tune against the supplied video in browser tests. A candidate that contains only curtain opening is incomplete for this version; do not replace missing entry footage with a CSS zoom or frame animation.

### White transition and interactive monitor

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| TRANS-01 | Controlled pure white | Website/editor fades the final warm-white surface to a solid `#FFFFFF` scene, holds white briefly, and then fades in the HTML camera and monitor; generated footage is not responsible for exact white |
| TRANS-02 | Complete coverage | White covers the scene without gray borders, residual footage, seams, or black gaps; navbar remains above it |
| TRANS-03 | Correct interaction boundary | Hidden monitor controls cannot receive pointer or keyboard input; visible monitor becomes interactive at the defined reveal boundary; transition layers stop intercepting input |
| WORK-01 | Real HTML portfolio | Text, images, tabs, buttons, and navigation are semantic DOM elements and editable independently of video; selection, focus, and interaction can be verified in the browser |
| WORK-02 | Browse collections | Provide portrait/work collection navigation with current collection label and previous/next controls; images and descriptions come from structured local data; handle image failure gracefully |
| WORK-03 | Content sections | Starting information architecture: “The portraits,” “The experience,” and “Say hello,” adapted from the PoC. Tabs show their associated content and retain appropriate focus behavior |
| WORK-04 | Responsive usability | Monitor styling must not reduce text and hit targets to unreadable sizes; on narrow screens allow content to expand and the page to scroll naturally |
| WORK-05 | Restrained effects | Subtle image reveals, gallery transitions, and button feedback may use selected React Bits components; effects cannot delay navigation, obscure content, or override reduced motion |
| WORK-06 | Honest contact behavior | Use only confirmed email, WhatsApp, or provider destinations. Until supplied, omit the action or present accurate unavailable/demo messaging inside the monitor; never imply a booking or message was sent |

The HTML camera is decorative; it must not request device permissions. The legacy “Smile!” flash is optional and excluded by default to avoid adding unnecessary motion. A demo event-brief download may be retained only if clearly labeled as a local download that sends nothing.

### Accessibility, resilience, and performance

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| A11Y-01 | Reduced-motion route | With `prefers-reduced-motion: reduce`, skip camera travel, curtain animation, animated scrolling, and nonessential effects; show the monitor through immediate/brief white; do not eagerly download entrance video |
| A11Y-02 | Keyboard and semantics | Landmarks, meaningful labels, image alternatives, visible focus, logical tab order, tab/tabpanel relationships, arrow/Home/End tab controls, and correct hidden/inert states; no keyboard traps |
| A11Y-03 | Focus continuity | Passive scroll does not steal focus. Explicit navigation moves focus appropriately. If reversal would hide a focused monitor control, relocate focus to a stable visible navigation control first |
| A11Y-04 | Readability | Target WCAG 2.2 AA; normal text contrast at least 4.5:1, large text 3:1, relevant UI boundaries/focus 3:1; support 200% text zoom and reflow at 320 CSS px. Target 44 × 44 CSS px touch controls |
| RES-01 | Loading poster | Show static booth immediately while media metadata/frames load; keep layout reserved and no visible hero loading copy; pending media cannot block “Our work” |
| RES-02 | Bounded failure | Missing, corrupt, unsupported, stalled, or unseekable media leads to a static-to-white-to-monitor route; no infinite loader, retry loop, or fabricated CSS entrance |
| RES-03 | Responsive single video | Use the same optimized video file on desktop and mobile; preserve the full opening booth and doorway trajectory through responsive layout; no duplicate video elements or alternate-rendition downloads |
| PERF-01 | Efficient video seeking | Use one native HTML video decoder with bounded latest-target seeking; no extracted-image sequence, canvas frame renderer, or decoded-frame cache in this version |
| PERF-02 | Efficient UI | Coalesce scroll work into animation frames; prevent unbounded seek queues and React rerenders per scroll tick; release listeners, decoders, and caches appropriately |
| PERF-03 | Measured quality | Record loading, layout stability, responsiveness, transfer size, and animation smoothness on a named desktop and mobile profile; meet proposed budgets below or document and resolve exceptions before release |

Proposed engineering budgets, to validate during the media spike:

- First-load JS + CSS: at most 250 KB gzip, excluding deferred media and images.
- Initial poster: at most 700 KB; optimize derivatives only if the approved appearance is preserved.
- Single entrance video: target at most 4 MB for the shared desktop/mobile asset; no audio track. Validate this proposed budget against actual footage quality and seeking behavior.
- Lab proxy targets: LCP ≤ 2.5 seconds, CLS ≤ 0.1 under the documented mobile profile; target field INP ≤ 200 ms when sufficient real-user data exists. Do not invent field results from lab runs.
- On the named reference device, aim for responsive UI updates near the display refresh rate and no recurring visible seek freezes over 200 ms during ordinary scrolling. Video detail is limited by the source frame rate; do not require 60 distinct video frames per second from lower-frame-rate footage. If seeking remains unsuitable, select the fallback for affected configurations.
- Proposed media-stall deadline: 5 seconds without useful progress once entrance is requested; “Our work” stays available throughout. Tune using measured network tests.

## 6. Platform and architecture constraints

- React + Vite + TypeScript, CSS as the primary visual system, no backend required.
- Static portfolio data; store content separately from rendering and timeline configuration.
- One MP4 source and one paused HTML video element; map normalized entrance progress to `currentTime`, coalesce pending seek requests, and hold the last usable frame at the white transition. No automatic timed playback or image-sequence renderer.
- Prefer one page with fragment navigation; no server-dependent client routes for the initial release.
- Deploy Vite output through GitHub Actions to GitHub Pages. Set `base` from the actual hosting path: `/REPOSITORY/` for project Pages, `/` for account-root or applicable custom-domain hosting. [Vite deployment documentation](https://vite.dev/guide/static-deploy.html#github-pages)
- Keep media paths compatible with that base; verify the actual deployed URL, not just localhost.
- No credentials, local absolute paths, private documents, or unused legacy assets in the public bundle.

## 7. Required AI visual browser acceptance

**VIS-01 — The implementing AI must open the running website in a real browser, capture rendered screenshots, actually view those images, exercise the flows, and judge the result against this PRD.** Screenshot generation without viewing, source inspection, DOM assertions, and automated image differences cannot substitute for this review.

**VIS-02 — Review motion as motion.** Run the forward and reverse sequence at normal and rapid scroll speeds; view a recording where supported, or inspect closely spaced frames while interacting with the browser. Compare the first frame to the supplied image and inspect the opening-to-entry transition within the same video. Stop scrolling and confirm the scene settles at its requested time without continuing playback. Evaluate curtain direction, camera movement, perspective, geometry, timing, and the monitor handoff. QA screenshots/frame samples are evidence only, not runtime image-sequence assets.

**VIS-03 — Record evidence and repair defects.** For each checkpoint, record requirement IDs, build/commit, browser, viewport, device-pixel ratio, motion setting, network condition, screenshot/recording paths, expected result, observed result, and pass/fail/blocker. Fix failures and repeat the affected sequence plus adjacent transitions.

**VIS-04 — Repeat on production.** After deployment, inspect the actual Pages URL at desktop and mobile sizes, repeat the complete flow and shortcut, and confirm production asset loading. If browser access, final footage, or required devices are unavailable, label the relevant checks blocked or unverified; do not mark the release fully validated.

Required visual checkpoints: initial hero; poster/first-frame handoff; curtain half-open; curtain fully open; continuous opening-to-entry transition; doorway alignment; passage through doorway; warm-white end frame; pure-white hold; monitor mid-fade; fully interactive monitor; every tab/collection; stop-and-hold; reverse travel; direct shortcut; reduced-motion route; loading/error fallback; resize/orientation; final deployed page.

## 8. Release criteria and unresolved inputs

Milestone A acceptance requires all applicable foundation requirements to pass, with video-specific checks explicitly pending. Milestone B establishes whether version 1 succeeds: the single video contains both actions, scroll/stop/reverse behavior and the HTML handoff work, applicable accessibility/performance/fallback requirements pass, no critical/high-severity defect remains, and production visual evidence is complete. Extracted-frame animation is not a release dependency. Low-severity residual issues need a named follow-up and cannot contradict mandatory requirements.

| Input / decision | Default or handling |
| --- | --- |
| Combined entrance video | Review local `curtain-open.mp4` as a candidate for both opening and entry. If incomplete, obtain one complete combined video; implement the single-video controller and fallback independently |
| Exact repo, owner, default branch, Pages URL | Inspect configured repository at deployment time; do not invent these values |
| Portfolio photographs, collection names, copy | Use explicit development fixtures until business content is supplied; identify demo content before any public preview |
| Contact destination | Omit active contact action until a confirmed destination exists |
| Mobile video framing | Begin with matching 16:9 composition using contain behavior; create an approved derivative only if necessary, keeping poster and first frame matched |
| Background normalization | Evaluate boundary in browser; preserve source and use matching derivatives if required |
| Final release content | Approved business assets/copy required for business launch; footage and content gaps prevent claiming final completion |

The implementation plan defines execution order, tests, evidence, deployment, and rollback. This documentation task does not itself modify the PoC or deploy a site.
