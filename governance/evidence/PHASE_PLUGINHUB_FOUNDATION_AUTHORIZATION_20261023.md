# PluginHub replica — Foundation authorization checkpoint

## State

Kevin authorized the Foundation stage and instructed the agent to continue while he is away. This record captures that authorization for the repository restart trail. The authorization covers the prepared Foundation scope in the Phase 2 architecture; it does not approve production deployment, paid commitments, acceptance of legal terms, or later cutover/release gates.

**Phase:** Foundation — authorized; implementation entry gate pending; empty development D1 created  
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

## Entry gate

The architecture makes exact retention periods for action receipts, profiles/shares, and deleted-account data a Foundation entry gate. A request for Kevin to confirm the proposed values is pending. No Foundation implementation begins until this gate is resolved.

## Independent preparation completed

- Current official Auth0 material describes a standard OIDC issuer, JWKS verification, refresh-token rotation, passwordless/passkey options and user export. Auth0's current pricing page lists a free tier through 25,000 monthly active users and passkeys; this is a provider candidate, not a tenant or account decision.
- Auth0 source: <https://auth0.com/pricing>, <https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation>, <https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow>.
- GitHub MCP read/write is available. The local clone is on stale `main` commit `960edfe`; local `gh` authentication is invalid and Wrangler is not installed/cached. GitHub remains the only authorized repository writing surface. Cloudflare account/resource changes require an available authenticated Cloudflare route.
- Created an empty Cloudflare D1 database in the user's account: `aimm-library-foundation-dev`, ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. It has zero queries, rows, and tables. Cloudflare's D1 Free plan includes 5 GB storage and daily read/write quotas; paid-tier use would need separate approval.
- No identity tenant, credential, Worker binding, schema migration, service, or production site was changed.

## Resume instructions

1. Read this checkpoint and the Foundation gates in the architecture.
2. Resolve the exact retention decision recorded in Kevin's response.
3. Confirm the provider configuration route and use Auth0 only if the evidence and cost conditions remain suitable.
4. Execute Foundation changes on this branch with a restore point and backup-first GitHub API writes; GET-verify each change.
5. Record the schema/API validation, evidence package, independent challenge/validation, and synchronized status surfaces before closing the phase.
6. Stop before any paid commitment, legal acceptance, production deployment, cutover, or other gate requiring separate action-time authorization.
