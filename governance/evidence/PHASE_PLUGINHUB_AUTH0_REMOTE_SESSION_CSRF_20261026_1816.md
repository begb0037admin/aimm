# Auth0 browser session and CSRF runtime checks — 2026-10-26 18:16 UTC

## Result

Test User A completed Authorization Code with PKCE through the development SPA. The active non-production Worker validated the access token and issued a browser session for the existing account owner. The authenticated account read returned HTTP 200. Session restore returned HTTP 200. A DELETE request with no CSRF header returned HTTP 403 `csrf_rejected`; the normal logout returned HTTP 200; and a subsequent `/v1/me` returned HTTP 401.

The same flow first passed against the disposable local Worker on port 8788. The local account was `023a684a-ed98-4549-a5b0-de9efa62ddd1`; it was not used for the remote account. The remote session resolved to existing account `958d0ea1-47c8-4862-999b-614740440ee8` (`account_owner`, account created 2026-10-24T16:43:23.509Z). The remote API session was logged out before the check ended.

## Test boundary

The loopback test harness retained the OAuth access token and CSRF value in memory only. A temporary loopback-only proxy forwarded requests solely to `https://aimm-library-api-dev.kevinlelitte.workers.dev` and allowed only the session, account-read and device-list endpoints. It did not log request headers or bodies. For the upstream request, it supplied the already-configured canonical site Origin (`https://aimixmasters.com`); therefore this verifies Auth0 token validation, remote session creation/restoration, remote CSRF rejection and logout behavior, but does not prove a direct browser CORS path from the canonical production site. The proxy and temporary CSRF page were removed after the run.

No provider settings, credentials, app terms, or Worker configuration changed. No device or pairing was created. No deployment/cutover occurred. Only the authorized Test User A and the development API were used. The scoped synthetic D1 validation authorization remains as previously recorded; the historical 22:47 creation authorization is resolved and distinct from the 22:51 retention record.

## Verification

`sh scripts/pluginhub-nonprod-check.sh` passed in full after retrying outside the default sandbox, which denied Swift Package Manager manifest planning. Results included companion package/build and journal checks, scanner 3/3, API/browser 38/38, disposable local D1 and Worker, synthetic cross-account rejection, and real Swift pairing, inventory sync, Manual Check, reveal, move, restore, and signed receipt checks. No tests changed during this run.

The live remote session exchange, `/v1/me`, restore, CSRF negative probe, logout and post-logout rejection returned 200, 200, 200, 403, 200 and 401 respectively. No remote test session remains active. Foundation exit remains **NOT MET** pending authenticated A/B endpoint isolation, actual Mac Keychain pairing/delivery, project-appropriate recovery/parity coverage, remaining Stages 2–5 evidence, and a fresh independent end-to-end review. Stage 6 remains gated.
