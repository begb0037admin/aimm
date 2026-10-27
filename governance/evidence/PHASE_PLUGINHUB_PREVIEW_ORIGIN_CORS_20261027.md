# Exact Pages preview origin support — 2026-10-27

## Change

The development Worker now applies exact-origin checks to CORS responses, preflight, browser-session exchange/read, and cookie-session CSRF validation. Its development-only configuration permits the stable Pages branch origin `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev`; `https://aimixmasters.com` remains the primary origin and pairing destination.

The development Worker `aimm-library-api-dev` was deployed with the branch source using the authenticated Cloudflare connector after Wrangler refresh failed. Deployment ID `9d4c716e171144579cced05668e16298`, tag `2d5de43fe57449e49f85f7ddf353abc3`. Exact D1 binding, public configuration, allowlist and existing secret binding name were retained; the daily cron was retained. No secret value was read or sent.

## Verification

- `node --test test/foundation.test.js`: **21/21 passed** from branch source and tests in a disposable temporary copy; local migration fixtures were reused. No remote D1 query or write occurred.
- `node --test --test-name-pattern='sign-in|device-management|ordinary account' test/library-account-auth-scope.test.js`: **3/3 passed**, including the exact preview callback and read-only scope.
- Wrangler 4.152.0 dry-run bundle succeeded before deployment.
- The deployed Worker health route returned `{"status":"ok","service":"aimm-library-api","api_version":1}` in Chrome.
- Cloudflare execution egress policy blocked a direct connector probe and shell DNS could not resolve the Worker host. The real preview browser flow has now verified an allowed-origin preflight and a Worker JSON response. Denied-origin preflight and cookie-session CSRF behavior remain unverified.
- With Kevin's approval, the Auth0 development SPA `AIMM Library Web (development)` now allows the exact preview root as callback and logout URL and its exact origin as a web origin. Auth0 displayed “Successfully saved your changes.” Existing URLs were retained.
- The branch rejects sign-in from unapproved origins and preserves the preview origin in the OIDC callback. Focused tests passed 3/3. In Chrome, Auth0 returned to the exact preview origin and the browser's cross-origin POST to the dev Worker received a JSON response, confirming the CORS preflight/path works. The Worker returned 401, “A valid Library API access token is required,” before account lookup/session creation. No browser session was created and no account inventory was read. Auth0's API settings show User-delegated Access is Per-app authorization and the Application Access tab has no application listed. This is the likely configuration gap; JWT claim compatibility still needs confirmation after the least-privilege app grant.
- No Auth0 sign-in, user/account API read, D1 query/write, credential access, production setting, or production service was used or changed.

## Next

Add only the development SPA `AIMM Library Web (development)` as an authorized client of the development Library API with `read:library`, then retry sign-in and verify the account snapshot. Auth0 requires a user grant before this access change. After that, continue synthetic isolation/parity checks; do not expose device credentials. The broad-export recovery test remains excluded.

The preview infrastructure and allowed-origin CORS are verified. Account session creation is blocked by the missing Auth0 per-app API grant; denied-origin CORS and CSRF checks, account-backed browser/Mac/Hope parity, real wrong-device HTTP 401, remaining approved Stage 2–5 evidence, and fresh independent end-to-end acceptance remain open. Foundation remains **NOT MET**; Stage 6 remains gated.
