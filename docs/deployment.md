# Deployment and rollback

## 2026-10-22 local 3D revision

The current working tree uses a procedural Three.js model, the supplied logo/printer/olive velvet assets, soft curtain motion and a charcoal/ivory/gold theme. It has not been pushed or deployed in this task. The historical release records below describe earlier video/fallback versions and do not validate this revision. See [current model QA](qa/realism-2026-10-22/acceptance.md); rerun the existing Pages workflow and inspect the resulting URL after publication.

Status: **deployed and visually inspected**. Public foundation preview: [arkanantaa.github.io/marvin-poc](https://arkanantaa.github.io/marvin-poc/). User supplied the blank public repository `arkanantaa/marvin-poc`; origin is configured to `https://github.com/arkanantaa/marvin-poc.git`, default branch `main`. Pages is configured for GitHub Actions. This is not the approved single-video release.

## Verified deployment

- Runtime commit: `f5ac43883fec2bb3b97d83dd1045afaa1b66a81b`.
- [Deployment run 38756754934](https://github.com/arkanantaa/marvin-poc/actions/runs/38756754934): validation, build, upload and deployment succeeded; completed 2026-10-15 15:03:59 UTC (22:03:59 Asia/Jakarta).
- [CI run 38756754386](https://github.com/arkanantaa/marvin-poc/actions/runs/38756754386): succeeded, including root and project-subpath browser tests.
- Pages deployment ID: `7096261192`; artifact `github-pages`, ID `11982879696`, 174,280 bytes. Browser evidence artifact ID `11983243656`.
- Live browser inspection began 2026-10-15 15:04:44 UTC (22:04:44 Asia/Jakarta). Chromium 156.0.8078.4, 1440×900 and 390×844, DPR 1, new browser contexts, live HTTPS. Hero, white hold, monitor, all tabs/collections, shortcut/focus, home/history, deep-link refresh, reverse and reduced motion passed. No failed HTTP responses, application errors or axe violations in tested flows.
- The AI actually viewed production desktop/mobile hero and monitor, mobile white hold, experience/contact tabs with visible keyboard focus, and reduced-motion monitor. Evidence: `docs/qa/production-*.png`, conditions/results `docs/qa/production.json`.
- Production has no entrance source/download because the supplied candidate fails required choreography. Error and stalled-video routes were additionally exercised with the local development-only candidate; source fixture removed before production build.
- Follow-up evidence commit changes documentation and the standalone inspection script only; it retains this verified runtime deployment.

Use Node 24.18.0 (pinned in `.nvmrc`) and the committed `marvin-web/package-lock.json`. In `marvin-web/`, run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npx playwright install chromium`, `npm run test:e2e`.

CI validates pull requests and pushes, including a `/marvin-validation/` project-path build. Deployment only proceeds on the repository's actual default branch, after reusable validation succeeds. Build/upload and deployment are separate dependent jobs. Action revisions follow the official Vite Pages example consulted 2026-10-15. Permissions are scoped to read contents, with Pages write and OIDC only in the deploy job.

For future deployments, push runtime changes to `main`; the validated Actions workflow publishes them. The workflow derives `/REPOSITORY/` for project Pages and `/` for account-root Pages. For a custom domain, set repository variable `PAGES_BASE_PATH` to `/`. Local builds accept the same environment variable. No canonical or social-preview URL is invented.

Record the actual commit, Actions run, artifact, UTC timestamp and returned Pages URL here after publication. Open that exact URL on desktop/mobile, repeat scroll/white/portfolio, keyboard, direct `#work`, home, reverse and reduced-motion checks, and capture/view production screenshots. A successful Actions job alone does not satisfy VIS-04.

Rollback: record a known-good commit and deployment before replacing a live release. Rebuild that commit with its lockfile and pinned runtime, redeploy through Actions, and repeat live visual and asset checks. Avoid destructive local resets. For a first deployment without a previous release, use the last verified foundation candidate or repair before claiming success.

Official references: [Vite static deployment](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 2026-10-19 candidate ? publication pending

- Candidate source commit: `1c249c9852f5b53869c93213755d603c9b98fc0a`, pushed to `main`. The first push received HTTP 408; retry using HTTP/1.1 succeeded.
- [Deployment run 39280365944](https://github.com/arkanantaa/marvin-poc/actions/runs/39280365944) and [CI run 39280365933](https://github.com/arkanantaa/marvin-poc/actions/runs/39280365933) were triggered at 2026-10-19 22:45:18 Asia/Jakarta.
- Last API check at approximately 22:55 Asia/Jakarta: deployment still `queued`, no conclusion; validation/build jobs had no assigned runner. One monitoring request failed DNS resolution; a retry succeeded and still reported queued. No new successful deployment/artifact ID or completion timestamp is available.
- The live document still served `/marvin-poc/assets/index-CY-CCmn0.js` at the last successful asset check. The candidate's project-path build emits `index-BUxdsv54.js`. The new runtime is **not confirmed published**; no new live visual pass is claimed. Previous verified foundation deployment remains the known-good release above.
- Locally: clean installation, lint, strict typecheck, eleven unit tests, twenty browser tests at both root and `/marvin-poc/` paths; Chromium desktop/mobile, Firefox and WebKit. Exact candidate project-path production build was additionally opened in Chromium at `http://127.0.0.1:4177/marvin-poc/` and checked at eight sizes, with axe and screenshots. Artifact audit confirms no rejected MP4, QA files, private notes or legacy assets ship.
- After GitHub supplies a runner, inspect the existing run rather than starting a second deployment. On success, record the artifact and completion timestamp, then run `tests/inspect-production.mjs` with `QA_REVIEW_DIR=review-2026-10-19/`, `BUILD_COMMIT=1c249c9852f5b53869c93213755d603c9b98fc0a`, and `EXPECTED_ASSET=index-BUxdsv54.js` against the exact public URL. View the captured images, including the new mobile `work-bottom` checkpoint, and update the phase 9 checks only after it passes.
- Rollback reference remains runtime commit `f5ac43883fec2bb3b97d83dd1045afaa1b66a81b` / deployment run `38756754934`. There is no confirmed new release to roll back at this time.

This is still a foundation preview. Compliant video, approved business content, physical-device/native zoom/screen-reader review and PERF-F01 remain required for the final release. Evidence-only follow-up commits do not alter candidate runtime assets.
