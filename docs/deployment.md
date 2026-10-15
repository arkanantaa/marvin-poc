# Deployment and rollback

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
