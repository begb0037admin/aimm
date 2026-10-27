# Exact Pages preview origin support — 2026-10-27

## Change

The development Worker now applies exact-origin checks to CORS responses, preflight, browser-session exchange/read, and cookie-session CSRF validation. Its development-only configuration permits the stable Pages branch origin `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev`; `https://aimixmasters.com` remains the primary origin and pairing destination.

The development Worker `aimm-library-api-dev` was deployed with the branch source using the authenticated Cloudflare connector after Wrangler refresh failed. Deployment ID `9d4c716e171144579cced05668e16298`, tag `2d5de43fe57449e49f85f7ddf353abc3`. Exact D1 binding, public configuration, allowlist and existing secret binding name were retained; the daily cron was retained. No secret value was read or sent.

## Verification

- `node --test test/foundation.test.js`: **21/21 passed** from branch source and tests in a disposable temporary copy; local migration fixtures were reused. No remote D1 query or write occurred.
- `node --test --test-name-pattern='sign-in|device-management|ordinary account' test/library-account-auth-scope.test.js`: **3/3 passed**, including the exact preview callback and read-only scope.
- Wrangler 4.152.0 dry-run bundle succeeded before deployment.
- The deployed Worker health route returned `{"status":"ok","service":"aimm-library-api","api_version":1}` in Chrome.
- Cloudflare execution egress policy blocked a connector-based remote preflight probe; shell DNS could not resolve the Worker host. Remote allow/deny CORS preflight and session/CSRF response behavior therefore remain unverified.
- With Kevin's approval, the Auth0 development SPA `AIMM Library Web (development)` now allows the exact preview root as callback and logout URL and its exact origin as a web origin. Auth0 displayed “Successfully saved your changes.” Existing URLs were retained.
- The branch now rejects sign-in from unapproved origins and displays a useful error; it preserves the preview origin in the OIDC callback. The focused test passed, but Pages is still building the newest branch commits, so the preview UI update is not yet live.
- No Auth0 sign-in, user/account API read, D1 query/write, credential access, production setting, or production service was used or changed.

## Next

Verify the latest Pages preview build, then exercise the approved development sign-in and account-backed snapshot path. Verify preview-origin CORS through that browser flow. Continue synthetic isolation/parity checks; do not expose device credentials. The broad-export recovery test remains excluded.

The isolated preview infrastructure is configured and the dev Worker is deployed, but live CORS/session behavior, account-backed browser/Mac/Hope parity, real wrong-device HTTP 401, remaining approved Stage 2–5 evidence, and fresh independent end-to-end acceptance remain open. Foundation remains **NOT MET**; Stage 6 remains gated.
