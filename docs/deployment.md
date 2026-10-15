# Deployment and rollback

Status: prepared, not deployed. User supplied the blank public repository `arkanantaa/marvin-poc`; origin is configured to `https://github.com/arkanantaa/marvin-poc.git`, with default branch `main`. Git Credential Manager access to this repository was verified. Push/publication and live acceptance are recorded below when completed. Foundation preview only; this is not the approved single-video release.

Use Node 24.18.0 (pinned in `.nvmrc`) and the committed `marvin-web/package-lock.json`. In `marvin-web/`, run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npx playwright install chromium`, `npm run test:e2e`.

CI validates pull requests and pushes, including a `/marvin-validation/` project-path build. Deployment only proceeds on the repository's actual default branch, after reusable validation succeeds. Build/upload and deployment are separate dependent jobs. Action revisions follow the official Vite Pages example consulted 2026-10-15. Permissions are scoped to read contents, with Pages write and OIDC only in the deploy job.

Once the intended GitHub remote is supplied, review demo publication visibility, push the implementation to that repository, and set Settings → Pages → Source to GitHub Actions. The workflow derives `/REPOSITORY/` for project Pages and `/` for account-root Pages. For a custom domain, set repository variable `PAGES_BASE_PATH` to `/`. Local builds accept the same environment variable. No canonical or social URL is invented.

Record the actual commit, Actions run, artifact, UTC timestamp and returned Pages URL here after publication. Open that exact URL on desktop/mobile, repeat scroll/white/portfolio, keyboard, direct `#work`, home, reverse and reduced-motion checks, and capture/view production screenshots. A successful Actions job alone does not satisfy VIS-04.

Rollback: record a known-good commit and deployment before replacing a live release. Rebuild that commit with its lockfile and pinned runtime, redeploy through Actions, and repeat live visual and asset checks. Avoid destructive local resets. For a first deployment without a previous release, use the last verified foundation candidate or repair before claiming success.

Official references: [Vite static deployment](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
