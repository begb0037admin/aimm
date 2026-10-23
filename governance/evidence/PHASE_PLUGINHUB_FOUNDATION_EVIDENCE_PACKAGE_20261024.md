# PluginHub replica — Foundation evidence package

**Date:** 2026-10-24  
**Phase:** Foundation (authorized; implementation incomplete)  
**Branch:** `codex/pluginhub-foundation`  
**Governed by:** `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.2  
**Architecture:** `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`  
**Authorization:** `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md`  
**Retention decision:** `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md`

This is an evidence package for the partial Foundation slice to date. It does not claim the phase is complete, runtime-verified, or ready for production.

## Inputs

| Input | Source | SHA / reference |
|---|---|---|
| Phase 2 architecture baseline | `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md` on `codex/pluginhub-foundation` | Approved restore point `6a049bcfffe9504608977db734408f911c59b6c8` |
| Foundation authorization | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md` | latest content SHA `c9eec2bead192e6a402c5ac691c2eb4a840f897b` |
| Retention decision | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md` | commit `37aef4a6c53cea07af5edbdcaccccb9c5742a0f2`; content `cdbb2200007fa59287f4b00398665df358826962` |
| Governance workflow | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` | v1.2; read on this branch |

## Work outputs

| Repository | File/resource | Action | Commit or resource ID | Content SHA / evidence |
|---|---|---|---|---|
| `begb0037admin/aimm` | `library-api/migrations/0001_foundation.sql` | Created | `dcd804d4c0c312df80a66ef3d615da2493dbbcac` | `21838cf37171bd59fb10207679ff432872658e13` |
| `begb0037admin/aimm` | `library-api/src/index.js` | Created | `6ea12cb3215038a2cf30f31f03d2dc893a61fcac` | `631be8b356a0b46d1d7643d14e5620a9079b1a3` |
| `begb0037admin/aimm` | `library-api/wrangler.toml` | Created | `6e24464f540f98668154bce368f206badc2cb24a` | `0a289e9e590e8afc7707ba4f68facd6f5112412c` |
| `begb0037admin/aimm` | `library-api/README.md` | Created | `e8b58a855de9f42e9cc8922cb9cd3ad6ebceeb88` | `d45754484c09aeaf7166d97fa6d9f7b80d0c441c` |
| Cloudflare account | D1 `aimm-library-foundation-dev` | Created and schema applied | `66c91fd6-fae8-43a1-8e3b-372274acd7dc` | Cloudflare Console DDL success notices and a `sqlite_master` table query |
| `begb0037admin/aimm` | `DASHBOARD.html` | Updated | `6b9d0656758ef61ec3dfbd7afafe494c422471a6` | `1970b4a7e43d011a680ed21061151c9dbd73a205` |
| `begb0037admin/aimm` | `docs/ROADMAP.md` | Updated | `40ae42c974564a9ad7e7fa5744dd8d4a44efb907` | `4750bc4fcb43b958bfa06921733c0d9ffa3d7584` |
| `begb0037admin/aimm` | `docs/STATUS.md` | Updated | `a1d1784215448977c120f62a64b7beba2b6f9dcc` | `649ee52b50b34edb2218cacbfc4db9b587539649` |
| `begb0037admin/aimm` | `docs/HANDOVER.md` | Updated | `9ac24e52d79e42cb48d9afbaf74902faf4d70122` | `ef3a2b7791eaab0d02c204976b8642fbe838c4e4` |
| `begb0037admin/aimm` | `docs/handovers/2026-10-23-pluginhub-phase2-architecture.md` | Updated | `d61e89aee3b10b190f1606af111fe10a272a8757` | `369a486f2a77defbeed45d692a6ff7cf65a823ad` |
| `begb0037admin/aimm` | `docs/PLUGINHUB_REPLICA.md` | Updated | `252582a24299aef05a1a58f2aa22713c02267633` | `5c05d01c4c863d46992f8aca9909c74d8ce8621d` |

Each GitHub file write was followed by a Contents API GET; the resulting blob SHA matched the write result. For dashboard and status documents containing non-ASCII text, edits were applied as targeted byte replacements through Git Data API blobs, trees and commits.

## Direct D1 evidence

- Before the migration, the dashboard showed the named database and UUID above, zero user tables, and zero rows read/written.
- In the Cloudflare D1 Console, each `CREATE TABLE` and `CREATE INDEX` statement from `0001_foundation.sql` displayed “This query successfully executed.”
- A read-only query, `SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`, returned `accounts`, `action_receipts`, `device_credentials`, `devices`, `profile_comparisons`, and `shares`, plus Cloudflare's internal `_cf_KV` table.
- Console execution did not write Wrangler's migration history. The SQL uses `IF NOT EXISTS`, but reconciling migration tracking is still required before relying on Wrangler's migration status.
- The database has no Worker binding, route, or custom domain. No production database or existing relay Worker changed.

## Provider and retention decisions

- Kevin approved the proposed Foundation retention defaults on 2026-10-23. Server action receipts: 90 days from terminal state. Shares/profiles: at most 30 days, with shorter owner-selected expiry allowed. Confirmed account deletion: remove active serving data immediately; any retained backup must expire or be purged within 30 days.
- Auth0 is selected as the current OIDC provider for the isolated Foundation slice. Current official Auth0 pricing lists a Free plan at $0 with up to 25,000 monthly active users, passwordless authentication and passkeys; use of a custom domain requires credit-card verification. This supports provider selection only and does not establish future cost or create a tenant. Source: https://auth0.com/pricing
- Cloudflare currently documents D1 Free limits of 500 MB per database, 5 GB total account storage, and seven-day Time Travel restore. Sources: https://developers.cloudflare.com/d1/platform/limits/ and https://developers.cloudflare.com/d1/reference/time-travel/

## Backups and rollback

Governed-file backups were committed before editing and GET-verified. The six same-day backups are under `Archive/2026-10-23-pluginhub-phase3-foundation-start/`.

| File | Backup commit | Backup content SHA |
|---|---|---|
| `DASHBOARD.html` | `ba850705fb821b7bc6b1f389c0553972630795fd` | `e0c037a103a28ca2d19ec424dae54c32d752748b` |
| `docs/ROADMAP.md` | `fe06a4ae768515bcb32c8897b5d89193ba020fbf` | `7b93d90fb5bdfb743baa6b3002c844360a4e0f8d` |
| `docs/STATUS.md` | `fe1c3a61774760f65cdecf19511e45f4f1a8ed37` | `8dc992750e4d3381482cf9ba331459aa51d22333` |
| `docs/HANDOVER.md` | `58553d5f0f5d65543e183d273e494d9af430dbb4` | `996c504696e3795ecc7743628f8b95e0d7f2c98e` |
| Dated Phase 2 handover | `9f65717cceec892dfb5de458183ee7ca8fc3cd81` | `26eb1d3c4d67d167db91a3af47c2b7ef0d97c010` |
| `docs/PLUGINHUB_REPLICA.md` | `75111d26dc0a6e3e3b90f11d8477276fc3c831aa` | `bfb0150fffb8f36c906a1166c340937b58b9d222` |

Repository rollback: create a new commit restoring a governed file from its listed Archive copy; do not rewrite branch history. D1 has no user rows. Any database rollback should use the development database's recovery controls only after checking the resulting state; no rollback was performed.

## Repository scope, authentication and authorization

| Repository | In scope | Action |
|---|---|---|
| `begb0037admin/aimm` | Yes | Isolated Foundation implementation and synchronized status records |
| `begb0037admin/ai-news-channel` | No | No work required by this phase |
| `begb0037admin/personal-finance` | No | No work required by this phase |

- GitHub operations used the connected GitHub MCP/Contents and Git Data APIs. GitHub GETs succeeded before and after the writes. Local `gh` authentication remains invalid; the stale local clone was not used as the write source.
- Cloudflare changes used the already-authenticated account's D1 Console for the named, non-production database. The D1 database was created in this Foundation scope and remained separate from the relay Worker.
- Kevin authorized Foundation continuation and approved the proposed retention defaults. The Phase 2 decision remains design-only; paid service, legal acceptance, credentials, production deployment, merge, cutover and release remain separately gated.

## Assumptions and open limits

- The message “yes approved go ahead … continue until completion” followed the explicit proposal of the default retention schedule; the durable retention decision records that interpretation.
- Auth0 is provider-selected, but no owner-authenticated tenant setup or legal acceptance occurred.
- No Worker build, API request, unit test, integration test or runtime validation was performed. No tests were added.
- Browser HttpOnly sessions/CSRF, device pairing and credential issuance, inventory APIs, action execution, scheduled retention cleanup and account-deletion endpoint are not implemented.
- The schema has expiry columns, but there is no cleanup scheduler or deletion implementation yet. Do not store real user data in those tables until retention enforcement exists.
- D1 Console-applied schema is not registered in Wrangler migration history; current SQL is idempotent, but migration reconciliation remains necessary.

## Current stage and next work

Foundation is authorized and underway, not complete. The Phase 2 architecture already has all seven later stages and their gates prepared. Finish the isolated Foundation auth/device model, security review, migration tracking and enforceable retention behavior; then complete the formal challenge/validation chain and governance review. Stop for owner action-time confirmation before provider legal acceptance, credentials, paid service or deployment. Keep the live relay/site and PluginHub bridge untouched.

