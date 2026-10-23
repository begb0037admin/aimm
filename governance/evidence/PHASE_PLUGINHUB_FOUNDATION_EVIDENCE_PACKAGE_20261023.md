# PluginHub replica — Foundation evidence package

**Date:** 2026-10-23  
**Phase:** Foundation  
**Branch:** `codex/pluginhub-foundation`  
**Architecture baseline:** `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`  
**Authorization:** `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md`  
**Retention decision:** `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md`

This package records the current Foundation implementation slice. It is an evidence record, not a claim that the whole Foundation phase is complete or that the API is production-ready.

## Scope executed

- Kevin authorized the Foundation phase and approved the proposed exact retention defaults; the durable record is in the linked retention decision.
- Added a separate `library-api/` Worker skeleton, isolated from the existing relay Worker.
- Added versioned Foundation D1 schema for OIDC account mapping, devices, hashed device credentials, redacted action receipts, shares and profile snapshots.
- Added OIDC RS256/JWKS access-token verification and account-scoped `/v1/me`, device listing and device revocation routes.
- Applied the schema to only the empty development database `aimm-library-foundation-dev`, ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`.
- Selected Auth0 as the current OIDC provider based on the stated requirements and current official product information. No tenant or credentials were created.

## Repository evidence

| Artifact | Commit | Content SHA |
|---|---|---|
| Retention decision | `37aef4a6c53cea07af5edbdcaccccb9c5742a0f2` | `cdbb2200007fa59287f4b00398665df358826962` |
| D1 migration `library-api/migrations/0001_foundation.sql` | `dcd804d4c0c312df80a66ef3d615da2493dbbcac` | `21838cf37171bd59fb10207679ff432872658e13` |
| Isolated Worker `library-api/src/index.js` | `6ea12cb3215038a2cf30f31f03d2dc893a61fcac` | `631be8b356a0b46d1d764d3a14e5620a9079b1a3` |
| Wrangler development config | `6e24464f540f98668154bce368f206badc2cb24a` | `0a289e9e590e8afc7707ba4f68facd6f5112412c` |
| Library API README | `e8b58a855de9f42e9cc8922cb9cd3ad6ebceeb88` | `d45754484c09aeaf7166d97fa6d9f7b80d0c441c` |
| Updated restart checkpoint | `e5f5f74b8444857e98208870ebbead215e43788e` | `c9eec2bead192e6a402c5ac691c2eb4a840f897b` |

Each new file and checkpoint update was fetched back from the GitHub Contents API and its returned content SHA recorded.

## Cloudflare D1 evidence

- Before schema changes, the Cloudflare dashboard showed the target database name and UUID above, 0 user tables, 0 rows read/written and 0 queries.
- Each `CREATE TABLE` and `CREATE INDEX` query from migration 0001 returned “This query successfully executed.”
- A subsequent `sqlite_master` query displayed the six application tables: `accounts`, `devices`, `device_credentials`, `action_receipts`, `shares`, and `profile_comparisons`. Cloudflare's internal `_cf_KV` table was also visible.
- The SQL Console applies DDL directly and did not register a Wrangler migration history row. The SQL is idempotent (`IF NOT EXISTS`) so a future Wrangler apply can reconcile migration tracking; this should be done before relying on automated migration status.
- The development database remains unbound to any Worker. No production resource was changed.

## Limits and unverified claims

- The Worker has not been built, run, or deployed. No code tests were added or run. Authentication behaviour and API responses are therefore unverified.
- Auth0 tenant setup is pending. The dashboard currently requires owner authentication and legal terms acceptance; no such acceptance or account creation was performed. The Worker has no issuer/audience/JWKS settings.
- Browser session cookies and CSRF, device pairing/credential issuance, inventory sync, actions, expiry cleanup/scheduling, account deletion endpoint, public share endpoints, and site/Hope integration are not implemented in this slice.
- The D1 schema stores expiry fields but does not itself delete expired data. A cleanup mechanism must be added and verified before any such data is used; active-account deletion must cascade immediately.
- The current implementation reads an OIDC bearer access token. The architecture's site-facing HttpOnly session and CSRF design remains a required Foundation/API integration item.
- The Cloudflare Console DDL run is verified, but migration-registry reconciliation is outstanding.

## Current provider and platform evidence

- Auth0 current official pricing lists Free at $0, up to 25,000 monthly active users, passwordless authentication and passkeys; custom-domain use requires credit-card verification. This supports the candidate selection only and does not predict the cost of future use: https://auth0.com/pricing
- Cloudflare currently documents D1 Free limits of 500 MB per database, 5 GB per account, and seven days of Time Travel: https://developers.cloudflare.com/d1/platform/limits/
- Cloudflare documents seven-day restore capability and the Time Travel model here: https://developers.cloudflare.com/d1/reference/time-travel/

## Next work and gates

1. Finish Foundation security/API review and align implementation with the architecture's browser-session and device-pairing contracts.
2. Reconcile D1 migration tracking and validate the migration/API when the authorized runtime is available.
3. Configure an Auth0 development application only through an owner-authenticated route; stop for action-time confirmation before accepting provider legal terms.
4. Add and verify retention cleanup and immediate account-data deletion behaviour before any real account data is stored.
5. Complete the independent challenge and validation/governance chain, then synchronize the dashboard, roadmap, status and handover.
6. Do not deploy to production, pay for a tier, change the live relay/site, cut over, or release without the separate gate in the Phase 2 architecture.
