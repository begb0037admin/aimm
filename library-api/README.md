# AIMM Library API — Foundation slice

This directory is an isolated Cloudflare Worker for the approved Plugin Library Foundation. It is separate from `worker/`, which remains the live AI relay. Nothing in this directory is bound to the live relay or site.

## Included

- Version 1 D1 migration for OIDC account mappings, device records and hashed device credentials.
- Retention-ready tables for redacted action receipts, public shares and profile comparison snapshots.
- OIDC JWT validation using HTTPS JWKS and RS256, exact issuer/audience and time checks, an explicit OAuth client-ID allowlist, Auth0 authorization-code/refresh-token policy (or an absent `gty` claim for RFC 9068 user tokens), and rejection of client-credentials and `@clients` subjects.
- Route scopes are explicit: `read:library` for `GET /v1/me` and `GET /v1/devices`, `manage:devices` for device revocation, and `delete:account` for `DELETE /v1/me`. The Worker checks the required space-delimited `scope` claim before creating or loading an account.
- `GET /health`, `GET /v1/session` (restore the CSRF token from a valid browser session), `POST /v1/session` (OIDC bearer exchange for a short-lived API session), `DELETE /v1/session`, `GET /v1/me`, `GET /v1/devices` and owner-scoped `POST /v1/devices/{id}/revoke`.
- One-time companion pairing: `POST /v1/pairings` verifies proof of possession of a P-256 signing key and returns a 10-minute pairing ID plus a 256-bit polling secret (the secret is sent in a header only). An authenticated owner reviews the device name and matching verification phrase at `GET /v1/pairings/{id}`, then approves once at `POST /v1/pairings/{id}/approve` with `manage:devices` and CSRF for browser sessions. The companion polls `POST /v1/pairings/{id}/poll`; the device credential is returned once, only after approval, while only its hash is stored. `GET /v1/devices/{id}/identity` verifies that credential against the exact device/account pair and rejects revoked or expired credentials. `POST /v1/devices/{id}/credentials/rotate` atomically revokes the current credential and returns a replacement once. Active device limit: 10 per account. Migrations `0004_device_pairing.sql` and `0005_device_credential_rotation.sql` add short-lived pairing state, rate limits, and a compare-and-swap marker for one-time credential rotation.
- Browser sessions use a Secure, HttpOnly, host-only `__Host-` cookie, capped at the upstream access-token expiry and eight hours. The GET route returns the CSRF token only when the session and CSRF cookie hashes validate and the exact site Origin matches, allowing a page reload to restore it. The separate CSRF token is held in a Secure same-site cookie and session response; browser writes require it in `x-csrf-token` plus the exact configured site Origin. Session and CSRF values are stored by SHA-256 hash; logout revokes the session.
- Credentialed CORS is restricted to the exact configured AIMM site origin. CORS is an additional browser boundary; verified identity and account scoping are the authorization boundary.
- Confirmed account deletion requires a recent `auth_time` (10 minutes), typed account-ID confirmation, then atomically removes serving rows and writes a 30-day opaque-identity tombstone to prevent immediate account recreation.
- Daily scheduled cleanup for expired receipts, shares, profiles and deletion tombstones; SQL constraints cap retention at 90 days for receipts and 30 days for shares/profiles/tombstones.

## Local test workflow

Run `npm test` from this directory. The built-in Node test runner executes signed synthetic OIDC tokens against the actual Worker handler and all five migrations in an in-memory SQLite D1-compatible adapter. It checks the session cookie flags, origin and CSRF rejection, session restoration/logout, scope/client validation, cross-account device isolation and revoke rejection, account deletion/tombstones, scheduled retention cleanup, database-error classification for missing D1 migrations and failed browser-session writes, and one-time device pairing with key-possession proof, owner confirmation, CSRF, account isolation and replay rejection; wrong polling-secret lockout resistance, streamed oversized-body rejection, pre-verification create rate limits, configured device caps at approval and delivery, poll rate limits, expiry/rate-limit cleanup, credential rotation, same-time concurrent rotation rejection, and expired-credential denial. No external credentials, user data, or network calls are used by the test suite.

For an actual local Workers runtime, use the Wrangler configuration without `--remote` or `deploy`:

```sh
npx wrangler d1 migrations apply aimm-library-foundation-dev --local
npx wrangler dev --local
```

These commands create/update Wrangler's local D1 state only. The isolated non-production Cloudflare D1 now has migrations 0001–0003, as verified in the remote D1 recovery evidence. A fresh local regression run against the current branch passed 5/5 tests; a live Worker remains undeployed, so provider-backed HTTP runtime evidence is still open.

## Still incomplete or unverified

One-time device pairing and device-credential identity/revocation checks are implemented in this Foundation slice and covered by local tests. Inventory generations, vendor checks, action execution, share creation, and UI/Hope integration belong to later stages and are not implemented here. The owner-configured Auth0 development tenant and SPA are used by the isolated development Worker. The Worker is deployed only to its workers.dev development endpoint and is bound only to the isolated development D1; migrations 0001–0005 are applied and its daily schedule is 03:00 UTC. Test User A passed remote pairing, owner approval, one-time delivery, replay rejection and revocation. Test User B remote cross-account denial remains unproven. Synthetic-only export-copy recovery passed local SQLite integrity/FK checks; full D1/D1-to-D1 recovery and fresh independent Stage 5 validation remain open. Do not point the live website or Hope at this Worker.

Auth0 is the configured OIDC provider for the development environment. The development tenant and SPA were created and configured by the owner. No secret is committed in this repository.

## Isolated development resource

The Wrangler configuration points only to D1 `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`). It has no custom domain or production route. Apply migrations only to that named database after confirming the selected Cloudflare account/database in the authenticated tool. The migration does not touch existing data because this database was created empty.

This Worker is deployed only to the isolated development workers.dev endpoint. Do not deploy it to production or point the live site/Hope at it. Required variables are `OIDC_ISSUER`, `OIDC_AUDIENCE`, `OIDC_JWKS_URL`, `OIDC_ALLOWED_CLIENT_IDS` and `SITE_ORIGIN`. Configure each first-party client for Authorization Code with PKCE and Refresh Token Rotation only; grant only the API scopes documented above. The Worker rejects unknown `gty` values; an absent `gty` is accepted only alongside an allowlisted client ID, a human subject and a required API scope, to support RFC 9068 user tokens. These must be configured as development settings/secrets, never committed.

## Retention

The approved Foundation policy is in `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md`. Server-side action receipts expire 90 days after terminal state; shares and profiles expire within 30 days; confirmed account deletion removes active data immediately and any retained backup must expire or be purged within 30 days. The local regression suite verifies scheduled cleanup and account deletion against all three migrations; remote non-production runtime evidence remains open and the Worker is undeployed. Cloudflare's current Free-plan Time Travel window is seven days; recheck any paid-plan backup configuration before real data is stored.

The current development D1 uses the Free plan. Cloudflare documents a 500 MB per-database limit and seven-day Time Travel recovery window for Workers Free. Recheck the production plan, backup behaviour and deletion enforcement before production deployment.


## Latest Auth0 local runtime check — 2026-10-24

The owner-configured Auth0 development SPA successfully exchanged signed access tokens for browser sessions for Test Users A and B against the local Wrangler Worker. User A and User B received distinct internal accounts. Session restore, /v1/me, missing-CSRF rejection (403), valid-CSRF logout, post-logout restore rejection (401), and User B's inability to see a User A device fixture all passed. Disposable device fixtures were removed after the probe; both browser sessions were signed out. Tokens and cookies were not written to project files. This remains local-worker/local-D1 executor evidence; it is not remote Worker evidence or independent Stage 5 validation.

A fresh local D1 is empty until migrations 0001–0003 are applied with wrangler d1 migrations apply DB --local. The missing migration had caused a generic identity_unavailable response. The API now reports account-storage errors as database_unavailable; the regression suite verifies the distinction. Provider tests and API suite pass 7/7. No deployment or remote D1 write occurred. Foundation remains NOT MET.
