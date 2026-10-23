# PluginHub replica — Foundation evidence package

## Document Information

| Field | Value |
|---|---|
| Phase | Foundation, authorized implementation stage; incomplete |
| Date | 2026-10-24 |
| Produced by | Codex session; GitHub MCP and Cloudflare D1 Console |
| Governed by | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.2 |
| Status | Stage 5 validation and focused pin revalidation complete; Foundation exit NOT MET |
| Commit SHA (this document) | Pinned in `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md` after this package revision |

Phase 2's full seven-stage plan and gates were prepared and approved in `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`. This evidence package concerns only the currently authorized Foundation stage. It does not claim Foundation completion, API runtime verification, or a Stage 6 governance decision.

## Inputs

| Input | Source | SHA / reference |
|---|---|---|
| Approved Phase 2 architecture | `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md` | approved restore point `6a049bcfffe9504608977db734408f911c59b6c8` |
| Foundation authorization | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md` | blob `c9eec2bead192e6a402c5ac691c2eb4a840f897b` |
| Retention decision | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md` | commit `37aef4a6c53cea07af5edbdcaccccb9c5742a0f2`; blob `cdbb2200007fa59287f4b00398665df358826962` |
| Independent Stage 3 challenge | `docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_CHALLENGE_REPORT_20261024.md` | commit `ec9452caf4bd704a2364e427a0e33f7d8f964efe` |
| Stage 4 remediation request | `docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_REMEDIATION_REQUEST_20261024.md` | commit `87cccd242b7f58c58f6d8e8a985bbd42ae51e74e` |
| Stage 5 validation report | `docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_VALIDATION_REPORT_20261024.md` | commit `46c5712ce083ce1cada6f3d911bb96392acdd50c`; blob `7f06a40b6cc4e029e85932057da8b0c9023d5fe6` |
| Stage 5 focused pin revalidation | `docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_REVALIDATION_ADDENDUM_20261024.md` | commit `b545ea74530e0aa5bf02a5015450b31852588260`; blob `fc2d01b29a2d3690b069b5bb14e30dcca57ad7e2` |
| Owner chronology addendum | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_ADDENDUM_20261024.md` | commit `2af30eb5d26fe2c7eb41cc98483281595807c84c`; blob `e6ea7c61ad240a9582c4d1d85f260d05e8f9ccb9` |
| Evidence template | `governance/templates/PHASE_EVIDENCE_PACKAGE_TEMPLATE.md` | blob `0b99f39a0820b92644c6b4c2e73c3c98cdb4392a` |

## Outputs

| Repository | File path | Action | Commit SHA | Content SHA |
|---|---|---|---|---|
| begb0037admin/aimm | `library-api/src/index.js` | Updated | `b5b623968d4cb05b21ce9eaf69ae26182de325e3` | `46421d7d020d7492991be40e4a2617dcb6d6e0ff` |
| begb0037admin/aimm | `library-api/migrations/0002_enforce_ownership_and_retention.sql` | Created | `191b2626fe7dfbb39888d773f50688830eac0134` | `374781b9ded5dfa7d07993ceaf05f65095ae617a` |
| begb0037admin/aimm | `library-api/wrangler.toml` | Updated | `e94a0c25c1cd2c456be87e146a5e9a68e75462a9` | `ca9667df8b047fda7c89cc1e643a55899c1d594e` |
| begb0037admin/aimm | `library-api/README.md` | Updated | `1a871f1e57288bd97e1cee707cbed6bd65c7959d` | `38918e7e3848af0695da82e09760513eee0c7a79` |
| begb0037admin/aimm | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_ADDENDUM_20261024.md` | Updated | `2af30eb5d26fe2c7eb41cc98483281595807c84c` | `e6ea7c61ad240a9582c4d1d85f260d05e8f9ccb9` |
| begb0037admin/aimm | `DASHBOARD.html` | Updated | `79a0e70d9bee37574f5e06f010224fcaf8db17ff` | `40602e2be251b8c093d7312d133efd32e6c017ef` |
| begb0037admin/aimm | `docs/ROADMAP.md` | Updated | `3df6e11d92ca5e9834f835fa3d610c0d769eca47` | `a8a2583a0d8dc7df26cfb7ae372d387891e8cf7a` |
| begb0037admin/aimm | `docs/STATUS.md` | Updated | `b523af7143bce699a3303fb274aa18f8ad313c82` | `0774d8ff8cde8488b67cc570bfc308a03e0b6916` |
| begb0037admin/aimm | `docs/HANDOVER.md` | Updated | `a89b399b5669c5476abae45271466fc21f8b86c3` | `f338ad12444a97ccb0c27f752cc5ae90335a6e3f` |
| begb0037admin/aimm | `docs/handovers/2026-10-23-pluginhub-phase2-architecture.md` | Updated | `e25cc417f9e9166fd957bdb4155308c8aa0413f1` | `faf57c289ec2e398f6fa56082d89f573d3c7315f` |
| begb0037admin/aimm | `docs/PLUGINHUB_REPLICA.md` | Updated | `cb1efa68ff4fb1668248b6368f68d1d475ce9ef3` | `9a92c3b812dfbbff7fedd50cb7f7bbe0fb532bd5` |
| begb0037admin/aimm | This package | Revised after Stage 5 revalidation | pinned in closeout record | pinned in closeout record |

Earlier branch outputs not in the original package ledger: the first evidence package at commit `9c231f23a3025a3ab47fef5838264ad58684a562` and `Archive/2026-10-23-pluginhub-phase3-foundation-start/FOUNDATION_AUTHORIZATION_PRE_RESOURCE.md` (reported blob `5692197a79b41ffa12c51677c8b4ca8bf761f712`; commit `0d019ef4dd8ec498494721371eab86878b6340a3`). The Stage 3 reviewer identified these omissions. The first package is superseded by this package; the authorization backup is retained as historical evidence. This ledger lists the remediation outputs material to the review, not every unrelated pre-existing file on the branch.

## Evidence References

### Repository API evidence

GitHub Contents API GETs on `codex/pluginhub-foundation` returned the current content SHAs in the Outputs table. The remediation source changes are:
- Access tokens require a configured first-party client allowlist; `azp` is checked as client ID; route scopes are `read:library`, `manage:devices`, and `delete:account`; legacy Auth0 `gty` is limited to `authorization_code`/`refresh_token`, while absent `gty` is accepted only with an RFC 9068 `at+jwt` header. Machine subjects are rejected.
- `DELETE /v1/me` requires recent authentication and exact account-ID confirmation, removes account serving data and records a 30-day identity tombstone in one D1 batch.
- Device and credential revocation uses a D1 batch.
- A scheduled Worker handler purges expired receipts, shares/profiles and tombstones.
- Migration `0002` adds composite account/device foreign keys, 90-day receipt and 30-day share/profile bounds, and the tombstone table.
- Wrangler config schedules retention cleanup daily at 03:00 UTC.
- README records the grant-type, client allowlist, per-route scope and retention requirements.

Representative GitHub API responses:
```text
GET library-api/src/index.js
sha = 46421d7d020d7492991be40e4a2617dcb6d6e0ff
HTTP result = Action completed (Contents API)
GET library-api/migrations/0002_enforce_ownership_and_retention.sql
sha = 374781b9ded5dfa7d07993ceaf05f65095ae617a
HTTP result = Action completed (Contents API)
```

### Cloudflare D1 direct evidence

Target: `aimm-library-foundation-dev`; database UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. The authenticated D1 Console's read-only `sqlite_master` query returned the revised DDL/indexes, including unique `devices_id_account_unique`, composite `(device_id, account_id)` foreign keys for credentials and action receipts, expiry checks, and `deleted_identities`. A read-only `SELECT id,name,applied_at FROM d1_migrations ORDER BY id` returned:
```text
1 | 0001_foundation.sql | 2026-10-23 23:11:56
2 | 0002_enforce_ownership_and_retention.sql | 2026-10-23 23:12:24
```
The migration table uses Wrangler's documented schema. The application tables had zero rows when last queried. These are direct console observations, not an API/runtime test. No cross-account rejected-insert probe was run.

## Backup Validation

The six governed-document backups below were committed and GET-verified before their corresponding edits. Backup commit/blob identifiers are from the archive GETs.

| Repository | Backup file | Backup commit SHA | Backup content SHA | GET verified |
|---|---|---|---|---|
| aimm | `Archive/2026-10-24-pluginhub-foundation-remediation-start/DASHBOARD.html` | `fbfaa391ff2809527ab16970bbc95921057aa6d4` | `1970b4a7e43d011a680ed21061151c9dbd73a205` | YES |
| aimm | `Archive/2026-10-24-pluginhub-foundation-remediation-start/docs/ROADMAP.md` | `022441d8e566266deb6eb86f68cc9dba6b83635e` | `4750bc4fcb43b958bfa06921733c0d9ffa3d7584` | YES |
| aimm | `Archive/2026-10-24-pluginhub-foundation-remediation-start/docs/STATUS.md` | `5463f9589e1a3fc432caee0ee662410f289504ca` | `649ee52b50b34edb2218cacbfc4db9b587539649` | YES |
| aimm | `Archive/2026-10-24-pluginhub-foundation-remediation-start/docs/HANDOVER.md` | `14f1141cd401f5040da6919e92d5c6f524792c61` | `ef3a2b7791eaab0d02c204976b8642fbe838c4e4` | YES |
| aimm | `Archive/2026-10-24-pluginhub-foundation-remediation-start/docs/handovers/2026-10-23-pluginhub-phase2-architecture.md` | `313112fb10663234d7cf838d18da3c96ef6b373e` | `369a486f2a77defbeed45d692a6ff7cf65a823ad` | YES |
| aimm | `Archive/2026-10-24-pluginhub-foundation-remediation-start/docs/PLUGINHUB_REPLICA.md` | `55b545ab88aa5a76553c2b0a0223042deab10ad4` | `5c05d01c4c863d46992f8aca9909c74d8ce8621d` | YES |

## Rollback Claims

| Repository | Rollback method | Backup SHA to restore | Restoration commit would overwrite |
|---|---|---|---|
| aimm | Commit archived dashboard bytes in a new commit | `1970b4a7e43d011a680ed21061151c9dbd73a205` | dashboard current blob `40602e2be251b8c093d7312d133efd32e6c017ef` |
| aimm | Commit archived status/roadmap/handover/brief bytes in a new commit | listed above | current governed-file blobs listed in Outputs; no history rewrite |

No repository rollback was performed. The D1 database had zero application rows; no D1 rollback or restore was performed, and provider recovery was not exercised.

## Repository Scope

| Repository | In scope this phase | Action taken | Reason if excluded |
|---|---|---|---|
| begb0037admin/aimm | YES | Isolated Foundation API, D1 schema and records | — |
| begb0037admin/ai-news-channel | NO | None | Not part of Plugin Library Foundation |
| begb0037admin/personal-finance | NO | None | Not part of Plugin Library Foundation |

## Authentication and Authorization

| Item | Evidence |
|---|---|
| GitHub authentication | Connected GitHub MCP Contents and Git Data APIs; local `gh` authentication is invalid and was not used. |
| Auth verified by | Successful branch/file GETs before and after each repository write; current blob SHA verified. |
| Write authorization evidence | Kevin authorized autonomous Foundation continuation and approved the retention proposal in the prior session; exact primary message and proposal context are reproduced in the authorization addendum. |
| Provider access | Existing authenticated Cloudflare D1 Console session to the named non-production database. No Auth0 tenant creation or legal acceptance. |

## Assumptions

1. The executor's interpretation is that the user's “approved” referred to the immediately preceding 90-day/30-day retention proposal; the addendum marks that interpretation as owner-reported.
2. The Foundation work stays isolated and does not authorize provider legal acceptance, paid services, credential creation, production deployment, merge, cutover or release.
3. Console results are direct observations at query time; they do not prove future provider state or runtime behavior.

## Risks

| Risk | Severity | Mitigation or deferral |
|---|---|---|
| No runtime proof of OIDC, account isolation, deletion or cleanup | HIGH | Keep Worker undeployed and tables empty; require owner-authorized test tenant/runtime validation before use. |
| No Auth0 tenant or client allowlist values | HIGH | Protected routes fail closed until owner-authenticated setup and client IDs are configured. |
| D1 creation preceded recorded retention approval | MEDIUM | Chronology is disclosed in addendum; do not backdate; leave for Kevin governance review. |
| No database restore test; D1 Time Travel shorter than retention | MEDIUM | Keep real user data out; separately design/approve backups before production. |
| Browser session/CSRF and device pairing not implemented | HIGH | Remain explicit Foundation exit work. |

## Current Findings and NEXT STAGE

The independent Stage 5 report returned VT-07 PASS and VT-01/02/03/04/05/06/08 PARTIAL; the focused pin revalidation is recorded in the addendum above and confirmed the corrected package, Worker and rollback references; Foundation exit criteria are NOT MET. Follow-up source now enforces per-route scopes and explicit Auth0 token profiles. Focused revalidation confirmed the corrected request/package pins, Worker output and Dashboard rollback target. The remaining PARTIAL findings are D1 live verification/enforcement, runtime behavior, backup recovery/expiry and owner authorization. Runtime token/account proof, an independent D1 re-query and rejected cross-account probe, backup expiry/recovery, owner-authenticated setup, browser session/CSRF and pairing remain incomplete. VT-01 creation chronology also remains a disclosed governance limitation.

**→ Foundation exit work.** Before deployment or real user data, Kevin must confirm the unresolved D1-creation authorization chronology and complete any owner-authenticated Auth0 setup/terms required for a development tenant. Then obtain authorized runtime proof for token scopes, account isolation, deletion and cleanup; independently re-query D1 schema/history and demonstrate cross-account constraint rejection; and establish backup expiry/recovery within the approved 30-day bound. Preserve the current no-deployment/no-user-data boundary. Request a fresh independent validation and only then prepare Stage 6 governance review. This package makes no Kevin governance decision.
