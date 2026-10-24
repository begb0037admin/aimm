# Foundation browser session source change — 2026-10-24

## Scope

This record describes an isolated source change in `library-api/`. It does not claim successful execution, runtime security validation, or Foundation exit.

## Source added

- `POST /v1/session` exchanges an allowlisted OIDC bearer token carrying `read:library` for a browser session.
- Session and CSRF tokens are random opaque values; SHA-256 hashes are stored in D1.
- The browser session is set in a Secure, HttpOnly, host-only `__Host-` cookie. The separate CSRF value is returned for in-memory use and set in a Secure, same-site cookie.
- Session lifetime is capped at the upstream token expiry and eight hours.
- Cookie-authenticated POST/DELETE routes require the exact configured AIMM Origin and matching CSRF cookie/header whose hash matches the stored session record. Bearer-authenticated routes remain explicit-token calls.
- `DELETE /v1/session` revokes the current session and clears both cookies. Retention cleanup removes expired/revoked sessions.
- Credentialed CORS is limited to the configured exact site origin.

Migration `0003_browser_sessions.sql` adds the account-bound session table and expiry indexes. `library-api/README.md` records the route contract and its unverified state.

## Authorization and validation limits

The 22:47 UTC D1-creation authorization chronology remains unresolved and open. This change did not apply migration 0003 to D1, call Auth0, create credentials, deploy the Worker, or use user data. No tests, builds, or API runtime checks were run. The new source and schema require code/security review and authorized runtime validation before use.

Foundation exit remains **NOT MET**. Device pairing, Auth0 setup, runtime proof, backup recovery and fresh independent Stage 5 validation remain open.
