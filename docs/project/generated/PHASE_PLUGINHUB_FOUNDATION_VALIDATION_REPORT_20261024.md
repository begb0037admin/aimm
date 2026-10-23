# PluginHub Foundation — Stage 5 Validation Report

**Date:** 2026-10-24  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Reviewer model / effort:** GPT-6 (Codex agent); reasoning-effort setting is not exposed in this session.  
**Operating mode:** Independent read-only validation; this report is the only write made.  
**Foundation exit criteria:** **NOT MET.** This is not Kevin's Stage 6 governance decision.

## Pinned evidence and method

I retrieved the finalized Stage 5 request from branch head `fcf11959ef3fb2f603bda6303ef8146b4787d0fa`; its Contents API blob is `038d200b2954746ba87c9c95c190fb080bffd7bc`. The request names the Stage 3 challenge `ec9452caf4bd704a2364e427a0e33f7d8f964efe` / blob `cc6e81424564a15bdef0f6cab79675f94b189060`, and Stage 4 remediation request `87cccd242b7f58c58f6d8e8a985bbd42ae51e74e` / blob `caf002e46cc5a68ed7b24fd6cd30a8ffaecad2d0`. Those pins resolve.

The request's Evidence Package pin needs correction: it calls `cbb7a433ae2993c9ca26ddbe02eccde1350cb23c` a commit, but a direct GitHub commit GET returns 422, “No commit found for SHA”. The actual package commit is `35e24b7bfd809ed1f68f6f3b7744e598e5a74ed9`, whose parent is the finalized request's parent and whose package blob is `cbb7a433ae2993c9ca26ddbe02eccde1350cb23c`. A Contents GET at the valid commit returns that blob. The report therefore evaluates the package at commit `35e24b7bfd809ed1f68f6f3b7744e598e5a74ed9` / blob `cbb7a433ae2993c9ca26ddbe02eccde1350cb23c`, and records the request's bad commit reference as a finding.

I directly GET-checked the implementation, migration, Wrangler configuration, README, authorization addendum, six backup files, package and status surfaces. The stated source SHAs match. I did not run tests. The connected D1 Console tab was already bound to another browser session, and no Cloudflare API connector is available here; therefore the package's `sqlite_master`, `d1_migrations` and empty-table observations remain reported Console evidence, not an independent live re-query.

| Task | Finding | Result |
|---|---|---|
| VT-01 — Authorization, scope and phase boundary | PARTIAL | The addendum records the authorization quote and clearly discloses that empty D1 creation preceded the recorded retention decision, but the primary owner message and resource-timing authorization cannot be independently verified from the pinned repository evidence. |
| VT-02 — Repository writes and evidence integrity | PARTIAL | The omitted historical package and authorization backup are now listed and the backup’s full commit/blob are independently retrievable. The Stage 5 request still mislabels the package blob as a commit. |
| VT-03 — API authentication and account isolation | PARTIAL | The prior audience/azp and machine-subject defects are corrected in source; the requested scope contract is absent, and no runtime token/account-isolation proof exists. |
| VT-04 — Schema integrity and migration state | PARTIAL | Migration source has composite ownership foreign keys and retention checks. D1 Console history/schema are reported but not independently re-read; no rejected cross-account insert was run. |
| VT-05 — Retention, deletion and provider claims | PARTIAL | Source implements cleanup and deletion paths, but they are undeployed and untested; backup expiry/purge is not established. |
| VT-06 — Backups and rollback | PARTIAL | Six backup blobs GET-match the package. Its rollback table names a stale Dashboard “current” blob, and database restore/recovery is untested. |
| VT-07 — Status-surface consistency | PASS | Dashboard, Roadmap, Status and Handover each state Foundation remains incomplete and Stage 5 validation is pending. |
| VT-08 — Evidence completeness | PARTIAL | The revised package has the requested ledger, query output, risk table and backup table, but retains the bad package pin and stale rollback target; Console and owner authorization evidence remain reported rather than independently proven. |

## VT-01 — Authorization, scope and phase boundary: PARTIAL

The [authorization addendum](https://github.com/begb0037admin/aimm/blob/ada259f1ea0911794c566c67e566e05cd55fc7fe/governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_ADDENDUM_20261024.md), blob `20ddc5b326f87d690c1d46e81d736a15f92f948c`, reproduces the continuation quote and says it followed the 90-day receipt / 30-day share-profile retention proposal. It explicitly records that the non-production D1 database was created before the retention decision was recorded, and does not backdate that approval.

This makes the chronology clearer, but the addendum is an executor-authored account, not the primary user message or an independently linkable transcript. It also says the prior checkpoint authorized non-production setup but that repository evidence did not clearly show a separate owner authorization for the timing of empty-resource creation. The Stage 4 request allowed either primary authorization or an explicit label that the authorization remained an unverified owner statement; this addendum presents the quote as fact and does not mark that statement unverified. The chronology remains a governance limitation.

The package and source keep the slice isolated in AIMM and state that provider terms, paid services, credentials, deployment, merge, cutover and release remain gated. No evidence inspected indicates those prohibited actions occurred. That supports the phase boundary, but does not resolve the owner-authorization limitation above.

## VT-02 — Repository writes and evidence integrity: PARTIAL

The package now lists the initial 2026-10-23 package and the omitted authorization backup. GitHub commit detail independently resolves the backup prefix to commit `0d019ef4dd8ec498494721371eab86878b6340a3`; that commit adds only `Archive/2026-10-23-pluginhub-phase3-foundation-start/FOUNDATION_AUTHORIZATION_PRE_RESOURCE.md`, blob `5692197a79b41ffa12c51677c8b4ca8bf761f712`. The branch GET of that path returns the same blob. The six 2026-10-24 backup GETs also match the six blobs in the package's backup table.

The Stage 4 package's output table lists the current API, migration, Wrangler, README, authorization addendum, dashboard, roadmap, status, handover, dated handover and project brief with commit/blob pairs. The source GETs match the pinned values. The latest Dashboard commit is `3d4aa278a7de2a7ef54d82c588f72f3aad274be8`, blob `94bd2108fa54a7d308ce1c42dceb0fad61b5cf6b`.

However, the finalized Stage 5 request gives the package blob `cbb7a433ae2993c9ca26ddbe02eccde1350cb23c` as its commit SHA and uses it in the GitHub commit URL. That ref is not a commit. The valid package commit is `35e24b7bfd809ed1f68f6f3b7744e598e5a74ed9`; it changes only the package's Dashboard output reference. This pin defect prevents the request from being followed exactly as written and should be corrected in the next evidence/request update.

## VT-03 — API authentication and account isolation: PARTIAL

The current [Worker source](https://github.com/begb0037admin/aimm/blob/codex/pluginhub-foundation/library-api/src/index.js), blob `417d59bbc9abc29a1e6879a02be5c4abb9641ae0`, corrects the Stage 3 audience/client confusion: it accepts the configured API audience as a string or member of an audience array, treats `azp` as the client ID, and requires membership in `OIDC_ALLOWED_CLIENT_IDS`. It rejects `gty === "client-credentials"` and subjects ending in `@clients`, validates a nonempty string subject, RS256 signature, exact issuer, expiry and not-before. The allowlist must be configured for protected routes to proceed. The README repeats these restrictions.

The Stage 4 request also required defining permitted token scopes. The code does not inspect a `scope` claim, and the README does not define a scope allowlist. Apart from rejecting the two machine-token indicators, the code does not explicitly define accepted grant types. These are source-level gaps against the requested human-account contract. No Auth0 tenant/client IDs or token fixtures are present; per the Stage 5 boundary, no runtime token tests were run. Thus the earlier concrete defects are addressed in source, but the full requested authorization contract and proof are not complete.

Account/device queries are account-scoped in source. Revocation and account deletion use D1 batches. Those observations do not prove deployed behavior or cross-account isolation.

## VT-04 — Schema integrity and migration state: PARTIAL

The current [migration 0002](https://github.com/begb0037admin/aimm/blob/codex/pluginhub-foundation/library-api/migrations/0002_enforce_ownership_and_retention.sql), blob `374781b9ded5dfa7d07993ceaf05f65095ae617a`, creates a unique `devices(device_id, account_id)` key and composite foreign keys from `device_credentials` and `action_receipts` to the matching device/account pair. It also constrains receipt expiry to terminal time plus no more than 90 days, share/profile expiry to no more than 30 days, and deleted-identity tombstones to no more than 30 days. The [Wrangler config](https://github.com/begb0037admin/aimm/blob/codex/pluginhub-foundation/library-api/wrangler.toml), blob `ca9667df8b047fda7c89cc1e643a55899c1d594e`, points at the same named non-production database and declares `migrations_dir = "migrations"` with the daily trigger.

The evidence package reports a read-only `sqlite_master` result with those structures and a `d1_migrations` result listing `0001_foundation.sql` and `0002_enforce_ownership_and_retention.sql`; it reports zero application rows. Because the D1 session was not accessible for an independent re-query, these remain the prior operator's observations. The request explicitly states that no cross-account rejected-insert probe was run. SQL structure and reported migration registration support the fix, but actual constraint rejection and migration parity are not independently proven here. No D1 write was made.

## VT-05 — Retention, deletion and provider claims: PARTIAL

The Worker source contains a daily scheduled cleanup for expired receipts, shares, profiles and tombstones. Account deletion requires a recent `auth_time` and a typed account-ID confirmation, then batches serving-row deletion with a 30-day tombstone. The migration sets the maximum expiry constraints. The README correctly says these paths remain unverified at runtime and that the Worker is undeployed.

The Stage 3 retention policy also requires any retained backup to expire or be purged within 30 days. The package states Cloudflare Free Time Travel is seven days and says no backup/restore test or provider recovery was exercised. No direct provider account/billing/backup configuration was accessible in this validation. The repository therefore has not demonstrated backup retention/deletion enforcement, and runtime cleanup/deletion is source-only. No real user data should enter these tables until authorized runtime validation and backup/deletion controls are established.

## VT-06 — Backups and rollback: PARTIAL

I GET-verified the six listed archive files on the branch. Their content SHAs match the package's baseline blobs:

- Dashboard: `1970b4a7e43d011a680ed21061151c9dbd73a205`
- Roadmap: `4750bc4fcb43b958bfa06921733c0d9ffa3d7584`
- Status: `649ee52b50b34edb2218cacbfc4db9b587539649`
- Handover: `ef3a2b7791eaab0d02c204976b8642fbe838c4e4`
- Dated handover: `369a486f2a77defbeed45d692a6ff7cf65a823ad`
- Project brief: `5c05d01c4c863d46992f8aca9909c74d8ce8621d`

This supports the existence and content of repository backups. The package's Outputs table now lists Dashboard current blob `94bd2108fa54a7d308ce1c42dceb0fad61b5cf6b`, but its Rollback Claims table still identifies the Dashboard “current blob” as `6bb8b9efb1606fc2242e59a5be23076503c9221e`. That is stale and conflicts with the final package/output pin. Correct the rollback target before relying on the table. The other governed-document rollback entries are described by reference to the Outputs table.

No D1 rollback or restore test was performed. The package explicitly says provider recovery was not exercised, so repository backup validation does not establish database recoverability.

## VT-07 — Status-surface consistency: PASS

The finalized request pins the current Dashboard (`94bd2108...`), Roadmap (`50faac10...`), Status (`0f3cec88...`) and Handover (`7ca29781...`). Direct GETs match those SHAs. Each surface identifies Foundation remediation as incomplete and Stage 5 validation as pending. The Dashboard's separate statement that prior Phase 2 architecture challenge/remediation/validation is complete is scoped to that earlier phase; its Foundation card explicitly says validation is pending. No contradictory Foundation completion claim was found in these four surfaces.

## VT-08 — Evidence completeness: PARTIAL

The revised package materially improves Stage 3's evidence gaps: it has a document status/producer, a complete remediation output table, primary repository GET identifiers and excerpts, reported D1 query results, backup rows, rollback limits, scope, authorization context and a risk table. It explicitly distinguishes source GETs from D1 observations, states that there was no cross-account insert probe, and does not claim API runtime verification or Foundation completion.

Remaining reproducibility problems are material: the Stage 5 request calls the package blob a commit; the rollback table retains a stale Dashboard current blob; and the owner authorization/D1 observations cannot be independently confirmed from the pinned repo evidence/current tools. The package's entry “Commit SHA (this document): Pin from the Stage 5 request after this update” is externally resolved only when the request points to the correct commit (currently `35e24b7...`), not to the blob SHA.

## Remaining limitations and Foundation exit

No tests or builds were run, as instructed. No Auth0 tenant or credentials, browser session/CSRF flow, device pairing, or API runtime behavior was verified. The Cloudflare D1 `sqlite_master` and `d1_migrations` rows, and empty application tables, are recorded observations in the package but were not re-queried in this validation. No cross-account rejected insert, database restore, or D1 rollback test exists. Backup expiry/purge is not demonstrated, and the scope allowlist is missing from the source contract. The owner-authorization chronology remains disclosed but unresolved.

**Foundation exit criteria are not met.** Source remediation closes important Stage 3 defects, but account authorization, D1 enforcement/history, retention execution and recovery remain unproven or incomplete. The branch correctly continues to mark Stage 5 pending. This report records validation findings only; it does not authorize a provider, credential, paid, deployment, merge, cutover or release action, and does not make Kevin's governance decision.
