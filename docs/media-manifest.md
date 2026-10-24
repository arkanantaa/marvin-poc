# Renderer change — 2026-10-22

The active website uses procedural Three.js geometry. No entrance video is loaded or shipped. The video qualification below is historical and is not a current release gate. Model source: `marvin-web/src/scene/buildBooth.ts`. Reusable export: `docs/models/marvin-booth.glb`. Original reference assets are preserved.

# Historical media qualification

## Opening poster

`marvin_main.png` remains unchanged: 1920 × 1080; 629,947 bytes; SHA-256 `025A7DC40948A5DE5B93D874FC814708D6C997D88019C4B9BFCF84835B0D2EB2`. Delivery derivative `marvin-web/public/media/booth.webp`: 1920 × 1080, quality 92, 61,406 bytes, SHA-256 `6549ADE2D5BB58F618F54F4F13BC50348B41B7929CF0B176EB132306B0FE020B`. Viewed at all acceptance viewport sizes. Mild shared CSS normalization is applied to the media rectangle; object-fit contain preserves the sign/base and aspect ratio. Poster-matched footage remains a release prerequisite.

## Candidate — not published

`curtain-open.mp4`: 881,291 bytes; 1280 × 720; 24 fps; 97 frames; duration 4.0417 seconds; OpenCV reports fourcc `avc1` (H.264); SHA-256 `6C3E5D672A48791812694264400BB96EF68EE286610DC6E2E4B829CE6500C386`.

Inspected samples across the entire duration, including beginning, intermediate opening/entry and final frame: `qa/candidate-contact-sheet.jpg`. Camera approach occurs immediately, concurrently with the opening; fully open doorway appears around 2 s, followed by entry around 2.5–3.5 s and warm-white end at 4 s. These are approximate observed landmarks, not approved timing.

| Requirement | Verdict | Evidence |
| --- | --- | --- |
| HERO-03 | FAIL | Initial camera scale/framing differs from the supplied poster |
| MOTION-02 | FAIL | Camera advances while curtain is opening; stationary opening is absent |
| MOTION-03 | FAIL | No stationary fully-open hold before travel |
| MOTION-04 | FAIL | Camera movement during opening violates the exclusion |
| MOTION-05 | Observed, pending motion qualification | Opening and entry occur in the same file without a closed-curtain reset |
| MOTION-06/07 | Unverified | Samples suggest forward/right entry; continuous motion and rigid geometry require compliant-source review |
| MOTION-08 | Observed in final sample | Plain warm-white final view, no monitor UI |

Because mandatory opening and first-frame requirements fail, no delivery `entrance.mp4` is placed in public assets. Source preserved unchanged. Audio/keyframe/seek optimization of this rejected candidate is not a release activity.

## Replacing footage

Supply one complete continuous MP4 with a poster-matched stationary curtain opening, fully-open hold, physical right-doorway entry and warm-white ending. Inspect all PRD choreography checkpoints before approval. Optimize H.264 MP4, no audio, fast-start metadata, short keyframe intervals, target ≤4 MB; document actual encoding and first/last decodable time. Put only the qualified delivery file at `marvin-web/public/media/entrance.mp4`, set `approved: true` in `src/lib/mediaManifest.ts`, and repeat media, seeking, first-frame, fallback and production checks.

One video element is present; it stays paused and receives latest-target seeks. No frame-sequence assets, CSS entrance imitation or source switching exist. The foundation build requests no video. `VITE_REVIEW_MEDIA=true` enables a temporary candidate only in a development server; production ignores this flag. A temporary local copy was used for the controller spike and removed before build/publication. See `qa/media-controller.json`: desktop and mobile emulation passed paused hold, reverse, newest-target, blocked-request and 5-second stall fallback checks. These validate the mechanism, not choreography approval.
