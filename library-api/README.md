# AIMM Library API — Foundation slice

This directory is an isolated Cloudflare Worker for the approved Plugin Library Foundation. It is separate from `worker/`, which remains the live AI relay. Nothing in this directory is bound to the live relay or site.

## Included

- Version 1 D1 migration for OIDC account mappings, device records and hashed device credentials.
- Retention-ready tables for redacted action receipts, public shares and profile comparison snapshots.
- OIDC JWT validation using HTTPS JWKS and RS256, exact issuer/audience and time checks, an explicit OAuth client-ID allowlist, Auth0 authorization-code/refresh-token policy (or an absent `gty` claim for RFC 9068 user tokens), and rejection of client-credentials and `@clients` subjects.
- Route scopes are explicit: `read:library` for `GET /v1/me` and `GET /v1/devices`, `manage:devices` for device revocation, and `delete:account` for `DELETE /v1/me`. The Worker checks the required space-delimited `scope` claim before creating or loading an account.
- `GET /health`, `GET /v1/session` (restore the CSRF token from a valid browser session), `POST /v1/session` (OIDC bearer exchange for a short-lived API session), `DELETE /v1/session`, `GET /v1/me`, `GET /v1/devices` and owner-scoped `POST /v1/devices/{id}/revoke`.
- Browser sessions use a Secure, HttpOnly, host-only `__Host-` cookie, capped at the upstream access-token expiry and eight hours. The GET route returns the CSRF token only when the session and CSRF cookie hashes validate and the exact site Origin matches, allowing a page reload to restore it. The separate CSRF token is held in a Secure same-site cookie and session response; browser writes require it in `x-csrf-token` plus the exact configured site Origin. Session and CSRF values are stored by SHA-256 hash; logout revokes the session.
- Credentialed CORS is restricted to the exact configured AIMM site origin. CORS is an additional browser boundary; verified identity and account scoping are the authorization boundary.
- Confirmed account deletion requires a recent `auth_time` (10 minutes), typed account-ID confirmation, then atomically removes serving rows and writes a 30-day opaque-identity tombstone to prevent immediate account recreation.
- Daily scheduled cleanup for expired receipts, shares, profiles and deletion tombstones; SQL constraints cap retention at 90 days for receipts and 30 days for shares/profiles/tombstones.

## Local test workflow

Run `npm test` from this directory. The built-in Node test runner executes signed synthetic OIDC tokens against the actual Worker handler and all three migrations in an in-memory SQLite D1-compatible adapter. It checks the session cookie flags, origin and CSRF rejection, session restoration/logout, scope/client validation, cross-account device isolation and revoke rejection, account deletion/tombstones, and scheduled retention cleanup. No external credentials, user data, or network calls are used by the test suite.

For an actual local Workers runtime, use the Wrangler configuration without `--remote` or `deploy`:

```sh
npx wrangler d1 migrations apply aimm-library-foundation-dev --local
npx wrangler dev --local
```

These commands create/update Wrangler's local D1 state only. The non-production Cloudflare D1 currently has migrations 0001 and 0002; migration 0003 was applied only to local test state during this session.

## Still incomplete or unverified

Device pairing and credential issuance, inventory generations, vendor checks, action execution, share creation, and UI/Hope integration are not implemented. The Worker has no owner-authenticated Auth0 development tenant/client configuration, so real provider-backed token exchange is not yet available. The local regression suite uses generated synthetic signing keys and does not replace Auth0 integration, fresh independent Stage 5 validation, or a remote non-production account-isolation test. Do not point the website or Hope at this Worker.

Auth0 is the current OIDC provider selection based on the architecture requirements and current product evidence. Creating an Auth0 tenant requires an owner-authenticated route and acceptance of provider terms. No tenant, app, credential, or paid feature has been created or accepted here.

## Isolated development resource

The Wrangler configuration points only to D1 `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`). It has no custom domain or production route. Apply migrations only to that named database after confirming the selected Cloudflare account/database in the authenticated tool. The migration does not touch existing data because this database was created empty.

Do not deploy this Worker until the Auth0 development application settings and required Worker variables are available. Required variables are `OIDC_ISSUER`, `OIDC_AUDIENCE`, `OIDC_JWKS_URL`, `OIDC_ALLOWED_CLIENT_IDS` and `SITE_ORIGIN`. Configure each first-party client for Authorization Code with PKCE and Refresh Token Rotation only; grant only the API scopes documented above. The Worker rejects unknown `gty` values; an absent `gty` is accepted only alongside an allowlisted client ID, a human subject and a required API scope, to support RFC 9068 user tokens. These must be configured as development settings/secrets, never committed.

## Retention

The approved Foundation policy is in `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md`. Server-side action receipts expire 90 days after terminal state; shares and profiles expire within 30 days; confirmed account deletion removes active data immediately and any retained backup must expire or be purged within 30 days. The local regression suite verifies scheduled cleanup and account deletion against all three migrations; remote non-production runtime evidence remains open and the Worker is undeployed. Cloudflare's current Free-plan Time Travel window is seven days; recheck any paid-plan backup configuration before real data is stored.

The current development D1 uses the Free plan. Cloudflare documents a 500 MB per-database limit and seven-day Time Travel recovery window for Workers Free. Recheck the production plan, backup behaviour and deletion enforcement before production deployment.
