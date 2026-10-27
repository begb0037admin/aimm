# Non-production web preview hosting gate — 2026-10-27

## Approved isolated preview project

Kevin approved a separate Cloudflare Pages project connected to `begb0037admin/aimm`, with preview builds restricted to `codex/pluginhub-foundation` and production deployments disabled.

- Project: `aimm-pluginhub-foundation-dev` (ID `3db2e4e5-2501-4710-88b1-d049bc909512`)
- Account: `Kevin@lelitte.com's Account` (ID `f1896a0ef4e88f1f90abcc2cbbdd87f1`)
- Production branch: `main`; production deployments disabled.
- Preview builds: only `codex/pluginhub-foundation`.
- No custom domains.
- Stable branch preview: https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/

## Verified hosting and runtime

Cloudflare previously confirmed a successful static branch deployment at `d817bf82-7808-4aa3-b3cc-f30fccf8dbbb`; the stable preview alias loaded the AIMM homepage in Chrome.

The development Worker `aimm-library-api-dev` has since been deployed with the exact-origin CORS/session/CSRF branch code using Cloudflare's authenticated API. Worker deployment ID `9d4c716e171144579cced05668e16298`, tag `2d5de43fe57449e49f85f7ddf353abc3`. The D1 binding, public OIDC config, preview allowlist, existing secret binding name, and daily cron were retained. The Worker health route returned OK in Chrome. No secret value was read or transmitted.

The Auth0 development SPA now allows the exact Pages branch origin for callback, logout, and web origin; Auth0 confirmed that the settings were saved. A browser sign-in returned to the preview callback and the Worker responded to the cross-origin session request, confirming allowed-origin CORS. The Worker rejected the access token with 401 before account lookup/session creation. Auth0 API settings show per-app authorization enabled with no application listed; this is the likely missing grant. Add only the dev SPA's read:library permission after approval. Check the latest Pages build status; later record commits are queued.

## Limits and next work

Allowed-origin preflight and the live Worker JSON response are verified by the browser flow. Denied-origin preflight and cookie-session CSRF remain unverified. The Auth0 callback works; API session creation awaits approval of the narrowly scoped per-app grant.

Next: grant the development SPA only read:library access to the development API after user approval, verify a browser session and account snapshot, then continue synthetic isolation/parity checks without exposing device credentials.

The isolated preview infrastructure is configured; live preview-origin CORS/session behavior, account-backed browser/Mac/Hope parity, the supported real wrong-device HTTP 401 check, remaining approved Stage 2–5 evidence, and fresh independent end-to-end acceptance remain open. Foundation remains **NOT MET**; Stage 6 remains gated. No production deployment, custom domain, production configuration, or D1 write occurred for this change.
