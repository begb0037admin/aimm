# PluginHub Foundation — local runtime and regression evidence

**Date:** 2026-10-24  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Starting branch head:** `c631ce9dbb60e2774b004b5fec2676f933b1f4bb`  
**Scope:** Non-production local checks only. This is executor evidence, not independent Stage 5 validation or a Stage 6 decision.

## Recorded implementation

- `library-api/package.json`, added in commit `81c5c8c06a6a260f0596cf3790bcd28c48759add`, blob `3259f956c4d259c1cc12716a232b324c0e67053f`.
- `library-api/test/foundation.test.js`, added in commit `6c2ed141c7661921ec6694d2db7325b6261d7cd2`, blob `1362ee26ae4bf3275b0554cd7fb45327c9ac4041`.
- `library-api/README.md`, updated in commit `b0cf2ae7888674b9bc9f943524225586211f5604`, blob `ad32414574ed73efe52cb6ab415ce80bc9983b94`.

The tests use Node's built-in test runner, a generated throwaway RSA signing key, the actual Worker module and all three SQL migrations in an in-memory SQLite D1-compatible adapter. The JWKS fetch is stubbed locally. No user data, provider account, credentials, external API, or remote D1 was used.

## Results

`npm test` in `library-api/`: **5 passed, 0 failed**.

Covered health and unauthorized access; OIDC issuer/audience/client/scope and signature validation; exact Origin rejection; HttpOnly/Secure/SameSite session cookies; session restore, CSRF rejection and logout; cross-account device isolation and revoke rejection; confirmed account deletion and anti-resurrection tombstone; and scheduled cleanup of expired sessions.

A real local Workers runtime was also started with Wrangler **4.151.3**, bound to local D1 only. Wrangler applied migrations `0001_foundation.sql`, `0002_enforce_ownership_and_retention.sql`, and `0003_browser_sessions.sql` to the isolated local state directory `/private/tmp/pluginhub-foundation/.wrangler/state`. Requests to `http://127.0.0.1:8787` returned:
- `GET /health` → HTTP 200, `{"status":"ok","service":"aimm-library-api","api_version":1}`;
- `GET /v1/me` without credentials → HTTP 401, `unauthorized`.

The local Worker stopped after the requests. The Wrangler configuration was not run with `--remote`; no Cloudflare D1 migration, Worker deployment, website change, or production action occurred.

## Limits and open gates

The SQLite adapter tests Worker route behavior and SQL constraints but is not a substitute for Cloudflare D1 production-engine validation. The local Worker smoke test did not configure an Auth0 tenant or perform a provider-backed token exchange. No remote runtime/account-isolation test, backup restore, device-pairing implementation, companion app, inventory UI integration, or fresh independent review was done.

Foundation exit remains **NOT MET**. Open work includes owner-authenticated Auth0 development setup if required; remote non-production runtime and cross-account evidence; backup expiry/recovery within the approved limit; device pairing and companion implementation; remaining approved stages; and fresh independent Stage 5 validation. Do not advance to Stage 6 or claim release readiness from this report.
