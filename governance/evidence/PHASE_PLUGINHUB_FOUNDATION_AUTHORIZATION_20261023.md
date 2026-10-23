# PluginHub replica — Foundation authorization checkpoint

## State

Kevin authorized the Foundation stage and instructed the agent to continue while he is away. This record captures that authorization for the repository restart trail. The authorization covers the prepared Foundation scope in the Phase 2 architecture; it does not approve production deployment, paid commitments, acceptance of legal terms, or later cutover/release gates.

**Phase:** Foundation — authorized; retention entry gate resolved; implementation in progress; empty development D1 created  
**Branch:** `codex/pluginhub-foundation`  
**Restore point:** `codex/pluginhub-replication` at commit `6a049bcfffe9504608977db734408f911c59b6c8`  
**Architecture:** `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`, build sequence and cutover gates  
**Architecture approval:** `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_GOVERNANCE_DECISION_20261023.md`

## Authorized Foundation scope

1. Select and configure an OIDC identity provider.
2. Build the AIMM Library API account/device model in isolation.
3. Add versioned D1 schema migrations and non-production database setup.
4. Keep the existing key relay, live site, and local PluginHub bridge untouched.

The later prepared stages remain in the architecture: read-only companion; read-only site/Hope; status/preferences; local actions; cutover; release.

## Entry gate — resolved

Kevin approved the proposed Foundation defaults on 2026-10-23. The durable policy is recorded in [`governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md`](PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md): server-side action receipts are retained for 90 days after terminal state; profiles and public shares expire within 30 days (shorter owner-selected periods allowed); confirmed account deletion removes active serving data immediately, with any backup copy purged or expired within 30 days. Short-lived previews expire and are purged at expiry. Foundation implementation may proceed.

## Independent preparation completed

- Current official Auth0 material describes a standard OIDC issuer, JWKS verification, refresh-token rotation, passwordless/passkey options and user export. Auth0's current pricing page lists a free tier through 25,000 monthly active users and passkeys; this is a provider candidate, not a tenant or account decision.
- Auth0 source: <https://auth0.com/pricing>, <https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation>, <https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow>.
- GitHub MCP read/write is available. The local clone is on stale `main` commit `960edfe`; local `gh` authentication is invalid and Wrangler is not installed/cached. GitHub remains the only authorized repository writing surface. Cloudflare account/resource changes require an available authenticated Cloudflare route.
- Created an empty Cloudflare D1 database in the user's account: `aimm-library-foundation-dev`, ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. It has zero queries, rows, and tables. The creation form used Cloudflare's automatic nearest-region placement and no jurisdiction lock. Cloudflare D1 Free allows 500 MB per database, 5 GB total account storage, and seven days of Time Travel recovery; paid-tier use would need separate approval. See the retention decision for the backup-deletion constraint and recheck production retention before launch.
- No identity tenant, credential, Worker binding, schema migration, service, or production site was changed.

## Resume instructions

1. Read this checkpoint, the retention decision, and the Foundation gates in the architecture.
2. Implement the isolated account/device model and versioned D1 migrations on this branch; keep the live key relay, site and PluginHub bridge untouched.
3. Select Auth0 as the current OIDC candidate; do not create a tenant, accept terms, or configure credentials without an available owner-authenticated route.
4. Apply and inspect the migration only against `aimm-library-foundation-dev`; keep it unbound and non-production.
5. Record schema/API validation, the evidence package, independent challenge/validation, and synchronized status surfaces.
6. Stop before paid service, legal acceptance, production deployment, cutover, or any later gate requiring separate action-time authorization.
