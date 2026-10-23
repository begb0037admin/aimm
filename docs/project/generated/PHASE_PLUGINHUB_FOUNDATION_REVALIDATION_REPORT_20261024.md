# PluginHub Foundation — Stage 5 Revalidation Report

**Date:** 2026-10-24  
**Repository/branch:** begb0037admin/aimm / codex/pluginhub-foundation  
**Reviewer:** GPT-6 (model family exposed; effort setting not exposed by this runtime)  
**Mode:** Independent source/evidence revalidation. No tests, builds, provider writes, deployment, credential creation, legal acceptance, or governance decision.

## Scope and pinned inputs

I GET-verified the current request at commit 4d70ae6d7eb529e486222c2db4bd8fdfafc95570, content blob f1f67c8937a4be06ff9637aeeca6865b5d6b3ce7. Its cited Stage 3 challenge is commit ec9452caf4bd704a2364e427a0e33f7d8f964efe / blob cc6e81424564a15bdef0f6cab79675f94b189060, and its Stage 4 remediation request is commit 87cccd242b7f58c58f6d8e8a985bbd42ae51e74e / blob caf002e46cc5a68ed7b24fd6cd30a8ffaecad2d0.

The current package GET is commit c7b7325c3a7349ee55f6a51b8002d9c243cadbff / blob 808285f434487ae56f885bb9628ddd4eb4cf2bbf. The request body is internally inconsistent: its package hyperlink uses c7b7325..., but its “commit” field says 6e331f94c38c016d99026e9ea391e66478d672ac. GitHub commit GET shows c7b7325... is the later package edit and its contents GET returns blob 808285...; commit 6e331f... is an earlier package revision. The actual current pair is therefore c7b7325... / 808285..., but the request's printed commit pin is wrong.

The prior Stage 5 report remains at commit 46c5712ce083ce1cada6f3d911bb96392acdd50c / blob 7f06a40b6cc4e029e85932057da8b0c9023d5fe6 and was not changed.

## Findings

| Task | Result | Revalidation |
|---|---|---|
| VT-01 — Authorization, scope and phase boundary | PARTIAL | The addendum discloses that the owner quote and exact D1 creation-timing authority are executor-reported, not source-attested. Scope gates remain explicit. |
| VT-02 — Repository writes and evidence integrity | PARTIAL | Current package GET matches c7b7325... / 808285..., but the request prints the earlier 6e331f... commit. The package output ledger also pins an older Worker output. |
| VT-03 — Token authorization and account isolation | PARTIAL | The earlier audience/client and missing-scope source gaps are corrected. Scope is checked before account lookup/creation. No configured tenant or runtime proof exists. |
| VT-04 — Schema integrity and migration state | PARTIAL | Migration source contains composite ownership foreign keys and retention checks. Applied D1 schema/history and a rejected cross-account insert were not independently verified. |
| VT-05 — Retention, deletion and provider claims | PARTIAL | Cleanup/deletion and a daily trigger are in source. Runtime behavior and backup expiry/purge are unproven. |
| VT-06 — Backups and rollback | PARTIAL | The six archive contents GET-match their listed baseline blobs. The rollback table still names a stale Dashboard current blob; D1 recovery is untested. |
| VT-07 — Status-surface consistency | PASS | All six requested status-surface blobs match their pins and describe Stage 5 as PARTIAL with Foundation exit unmet/revalidation pending. |
| VT-08 — Evidence completeness | PARTIAL | The package now includes the ledger, provider observations, backup table, rollback section and risks, but its request pin, Worker ledger entry and Dashboard rollback target remain inconsistent; D1 and owner evidence are reported rather than independently proven. |

### VT-01 — Authorization and scope boundary: PARTIAL

The authorization addendum GET returned blob e6ea7c61ad240a9582c4d1d85f260d05e8f9ccb9. It explicitly labels the conversation excerpt as executor-authored and not a source-attested GitHub record. It also states that the addendum cannot prove a separate owner authorization for creating the empty D1 resource before the retention decision was recorded. This accurately discloses the chronology and avoids backdating approval, but it does not independently establish owner authorization. The package, README and current status records continue to gate provider terms, paid services, credentials, deployment, merge, cutover and release.

### VT-02 — Output ledger and package pin: PARTIAL

The package GET at c7b7325... matches blob 808285.... The request's hyperlink and commit field disagree; 6e331f... is an earlier package commit, while the current package content is at c7b7325....

The request's Worker pin is commit b5b623968d4cb05b21ce9eaf69ae26182de325e3 / blob 46421d7d020d7492991be40e4a2617dcb6d6e0ff. GitHub commit detail confirms b5b623... changes library-api/src/index.js, and the branch GET returns blob 46421.... However, the package Outputs table still lists the older Worker commit fcf7c207a98b15e3f6c22e52dbc69aa638fac432 / blob 93da6074b6304b3815d7f23eda8cd6c025147297. That row does not describe the current source version under review.

The package acknowledges the initial 2026-10-23 package and pre-resource authorization backup as earlier branch artifacts; their branch GETs returned blobs 116db0e0a48c628fa5784b60ed13699a430f10c1 and 5692197a79b41ffa12c51677c8b4ca8bf761f712. The six 2026-10-24 backup GETs also match the package's listed baseline blobs. These corrections improve the ledger, but do not cure the incorrect request pin and stale current Worker row.

### VT-03 — Token authorization and account isolation: PARTIAL

The Worker GET returns blob 46421d7d020d7492991be40e4a2617dcb6d6e0ff; the pinned commit b5b623... changes that file. Static inspection confirms:

- Signature/JWKS, RS256, issuer, audience, expiry and not-before checks remain.
- The API audience is matched against string or array audience values; azp is treated as OAuth client ID and checked against OIDC_ALLOWED_CLIENT_IDS.
- Accepted profiles are Auth0 authorization_code/refresh_token tokens with absent/JWT typ, or absent-gty tokens with typ at+jwt. Subjects ending in @clients are rejected.
- scope must be a string to yield permissions. requiredScopeFor maps each protected route to its required scope; requireAccount checks it before getOrCreateAccount. Unknown routes return 404 before identity/account provisioning.

This closes the prior source-level client/audience confusion and missing route-scope enforcement. It does not prove that an Auth0 tenant is configured with intended clients, grants and scopes, or that valid and invalid tokens behave correctly at runtime. The request itself notes no tenant, client values or runtime proof. Account isolation remains source-only without two-account execution evidence.

### VT-04 — Schema and migration history: PARTIAL

Migration GET blob 374781b9ded5dfa7d07993ceaf05f65095ae617a contains composite (device_id, account_id) foreign keys for device_credentials and action_receipts referencing devices(device_id, account_id), plus expiry checks limiting receipts to 90 days after terminal_at and shares, profiles and deletion tombstones to 30 days. Wrangler GET blob ca9667df8b047fda7c89cc1e643a55899c1d594e names the same development database, migrations directory and daily schedule.

The package reports sqlite_master and d1_migrations query results, including both migration names and zero application rows. I could not independently re-query the existing authorized D1 Console session in this validation. No cross-account insert was attempted. Therefore the applied DDL, migration-history parity and constraint rejection remain unverified by this review; no D1 write was made.

### VT-05 — Retention and provider claims: PARTIAL

Worker source includes a scheduled cleanup for expired action receipts, shares, profile comparisons and deleted-identity tombstones. Account deletion requires recent auth_time and exact account-ID confirmation, then batches tombstone insertion with account deletion. Migration checks impose maximum retention bounds. README blob 38918e7e3848af0695da82e09760513eee0c7a79 describes the policies and says the Worker remains undeployed and unverified at runtime.

No execution evidence proves scheduled cleanup or deletion. No backup expiry/purge mechanism or provider recovery proof is provided. Auth0 tenant and credentials are absent, so provider configuration and legal/billing state remain unverified.

### VT-06 — Backups and rollback: PARTIAL

GETs of the six 2026-10-24 archive files returned the exact baseline blobs in the package: Dashboard 1970b4a7e43d011a680ed21061151c9dbd73a205; Roadmap 4750bc4fcb43b958bfa06921733c0d9ffa3d7584; Status 649ee52b50b34edb2218cacbfc4db9b587539649; Handover ef3a2b7791eaab0d02c204976b8642fbe838c4e4; dated handover 369a486f2a77defbeed45d692a6ff7cf65a823ad; project brief 5c05d01c4c863d46992f8aca9909c74d8ce8621d.

The current Dashboard GET is blob 0b0ca12f3a7dfbdd22689c8570b58ea69161deb4. The package Outputs table also identifies 0b0ca... as current, but its Rollback Claims table says restoration would overwrite Dashboard blob 94bd2108fa54a7d308ce1c42dceb0fad61b5cf6b. The latter is stale, so the rollback table does not identify the current target correctly. No repository rollback was performed. The package states that D1 restore/recovery was not exercised; database recovery remains unproven.

### VT-07 — Status surfaces: PASS

Direct branch GETs match all six request pins:

- DASHBOARD.html — 0b0ca12f3a7dfbdd22689c8570b58ea69161deb4
- docs/ROADMAP.md — 5443b8f5b0ec08db2ac5289cafb741b218f2efb6
- docs/STATUS.md — 45428451697fb7e20c211aa25d12581a1c735fb7
- docs/HANDOVER.md — 633c022b04c22876d55a7816dcfaff235bf731b6
- docs/handovers/2026-10-23-pluginhub-phase2-architecture.md — de35cedbcfcdac0f9765dc92c66539fa11ffd14e
- docs/PLUGINHUB_REPLICA.md — f91efe1b7e51ec1e238c6107589d8d4030e9d3e5

The Dashboard, Roadmap, Status, handover, dated handover and project brief all describe Foundation as incomplete, Stage 5 as PARTIAL, and revalidation or remaining work as pending. Their content SHAs match the request. The Dashboard's reference to architecture-level Phase 2 validation being complete is separately scoped and does not assert Foundation exit.

### VT-08 — Evidence completeness: PARTIAL

The revised package contains document status, an output table, GitHub source identifiers, reported D1 query excerpts, archive rows, rollback claims, scope, assumptions and risk mitigations. It explicitly distinguishes source-level work from runtime proof and says D1 recovery was not exercised.

Reproducibility remains incomplete: the request's package commit field disagrees with its link; the package output row omits the current Worker commit/blob; the Dashboard rollback target is stale; and D1 observations and owner authorization are not independently verified. These are material to the package's stated purpose as a reviewable evidence record.

## Unresolved limits and Foundation exit

No tests or builds were run. The D1 Console schema/migration history was not independently re-queried, no rejected cross-account insert was tested, and no database restore was performed. Worker runtime/token/account behavior remains untested and undeployed. No Auth0 tenant, configured client/scope values or credentials exist. Backup expiry/purge is not evidenced. Browser session/CSRF and device pairing remain unimplemented. The authorization quote and the timing authority for initial empty D1 creation remain executor-reported pending owner confirmation in a governance record.

**Foundation exit criteria are NOT MET.** The source remediation resolves important earlier static defects, but runtime/provider, D1 enforcement/history, backup purge/recovery and owner-authorization limitations remain. This report records evidence findings only; it does not issue an approval or make Kevin's governance decision.
