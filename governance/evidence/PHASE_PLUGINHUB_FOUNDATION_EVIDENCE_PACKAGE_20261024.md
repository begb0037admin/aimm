# PluginHub replica — Foundation evidence package

## Document Information

| Field | Value |
|---|---|
| Phase | Foundation, authorized implementation stage; incomplete |
| Date | 2026-10-24 |
| Produced by | Codex session; GitHub MCP and Cloudflare D1 Console |
| Governed by | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.2 |
| Status | Remediation evidence package; Stage 5 independent validation pending |
| Commit SHA (this document) | Pin from the Stage 5 request after this update |

Phase 2's full seven-stage plan and gates were prepared and approved in `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`. This evidence package concerns only the currently authorized Foundation stage. It does not claim Foundation completion, API runtime verification, or a Stage 6 governance decision.

## Inputs

| Input | Source | SHA / reference |
|---|---|---|
| Approved Phase 2 architecture | `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md` | approved restore point `6a049bcfffe9504608977db734408f911c59b6c8` |
| Foundation authorization | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md` | blob `c9eec2bead192e6a402c5ac691c2eb4a840f897b` |
| Retention decision | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md` | commit `37aef4a6c53cea07af5edbdcaccccb9c5742a0f2`; blob `cdbb2200007fa59287f4b00398665df358826962` |
| Independent Stage 3 challenge | `docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_CHALLENGE_REPORT_20261024.md` | commit `ec9452caf4bd704a2364e427a0e33f7d8f964efe` |
| Stage 4 remediation request | `docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_REMEDIATION_REQUEST_20261024.md` | commit `87cccd242b7f58c58f6d8e8a985bbd42ae51e74e` |
| Owner chronology addendum | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_ADDENDUM_20261024.md` | commit `ada259f1ea0911794c566c67e566e05cd55fc7fe`; blob `20ddc5b326f87d690c1d46e81d736a15f92f948c` |
| Evidence template | `governance/templates/PHASE_EVIDENCE_PACKAGE_TEMPLATE.md` | blob `0b99f39a0820b92644c6b4c2e73c3c98cdb4392a` |

## Outputs

| Repository | File path | Action | Commit SHA | Content SHA |
|---|---|---|---|---|
| begb0037admin/aimm | `library-api/src/index.js` | Updated | `03cf51118fc286e216132619c47596eec140cf1a` | `417d59bbc9abc29a1e6879a02be5c4abb9641ae0` |
| begb0037admin/aimm | `library-api/migrations/0002_enforce_ownership_and_retention.sql` | Created | `191b2626fe7dfbb39888d773f50688830eac0134` | `374781b9ded5dfa7d07993ceaf05f65095ae617a` |
| begb0037admin/aimm | `library-api/wrangler.toml` | Updated | `e94a0c25c1cd2c456be87e146a5e9a68e75462a9` | `ca9667df8b047fda7c89cc1e643a55899c1d594e` |
| begb0037admin/aimm | `library-api/README.md` | Updated | `335b1bfd5cb551a6e4eb945e3f3aae2c5b348b3b` | `19a54d1269223a96bd1c5d592547349b9303a9e0` |
| begb0037admin/aimm | `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_ADDENDUM_20261024.md` | Created | `ada259f1ea0911794c566c67e566e05cd55fc7fe` | `20ddc5b326f87d690c1d46e81d736a15f92f948c` |
| begb0037admin/aimm | `DASHBOARD.html` | Updated | `da0163d4dc0ef0b1decf802b7da60047bdc5ccd2` | `7e610fcb215fcd353315c3302163bc5b8f23978e` |
| begb0037admin/aimm | `docs/ROADMAP.md` | Updated | `266a240b7cb89042034ae97d85c6cb11417b2be4` | `50faac10645fe93f1d7cf921c3332e63d5163618` |
| begb0037admin/aimm | `docs/STATUS.md` | Updated | `25fab5a2fbe372fa92d000a401080c97ba43d618` | `0f3cec88882effe9d91cade67ec45d17a66042fa` |
| begb0037admin/aimm | `docs/HANDOVER.md` | Updated | `79cc8ba5a0601c5e77213eefd0cb014aa7de8214` | `7ca29781fd41cab2927a287de38fd36b9c7d1240` |
| begb0037admin/aimm | `docs/handovers/2026-10-23-pluginhub-phase2-architecture.md` | Updated | `1b44765ba581e0fecc6f442a156212924339f5d3` | `f33cfd72e55d14c0ad5988d706ce255e8a521d3d` |
| begb0037admin/aimm | `docs/PLUGINHUB_REPLICA.md` | Updated | `b7f9423ff42e61ed849b403df5053c70f2c5ab1b` | `ed352fac8c3d7a666f1ef88b39cb768c82fc983b` |
| begb0037admin/aimm | This package | Revised | pin via Stage 5 request | pin via Stage 5 request |

Earlier branch outputs not in the original package ledger: the first evidence package at commit `9c231f23a3025a3ab47fef5838264ad58684a562` and `Archive/2026-10-23-pluginhub-phase3-foundation-start/FOUNDATION_AUTHORIZATION_PRE_RESOURCE.md` (reported blob `5692197a79b41ffa12c51677c8b4ca8bf761f712`; its commit begins `0d019ef`). The Stage 3 reviewer identified these omissions. The first package is superseded by this package; the authorization backup is retained as historical evidence. This ledger lists the remediation outputs material to the review, not every unrelated pre-existing file on the branch.

## Evidence References

### Repository API evidence

GitHub Contents API GETs on `codex/pluginhub-foundation` returned the current content SHAs in the Outputs table. The remediation source changes are:
- Access tokens require configured first-party client IDs in `OIDC_ALLOWED_CLIENT_IDS`; `azp` is checked as client ID, and machine client-credentials subjects are rejected.
- `DELETE /v1/me` requires recent authentication and exact account-ID confirmation, removes account serving data and records a 30-day identity tombstone in one D1 batch.
- Device and credential revocation uses a D1 batch.
- A scheduled Worker handler purges expired receipts, shares/profiles and tombstones.
- Migration `0002` adds composite account/device foreign keys, 90-day receipt and 30-day share/profile bounds, and the tombstone table.
- Wrangler config schedules retention cleanup daily at 03:00 UTC.
- README records the scope and authentication/retention requirements.

Representative GitHub API responses:
```text
GET library-api/src/index.js
sha = 417d59bbc9abc29a1e6879a02be5c4abb9641ae0
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
| aimm | Commit archived dashboard bytes in a new commit | `1970b4a7e43d011a680ed21061151c9dbd73a205` | dashboard current blob `6bb8b9efb1606fc2242e59a5be23076503c9221e` |
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

1. The user's “approved” referred to the immediately preceding 90-day/30-day retention proposal, as recorded in the authorization addendum.
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

Stage 3's pinned independent challenge reported VT-03 FAIL and VT-01/02/04/05/07/08 PARTIAL. Stage 4 corrected the identified source/schema/status/evidence issues that were feasible without provider terms or runtime credentials. Runtime validation, rejected cross-account insert proof, owner-authenticated Auth0 setup, browser session/CSRF and pairing remain incomplete. VT-01 creation chronology also remains a disclosed governance limitation.

**→ Stage 5: Independent Validation.** Validate the current pinned remediation package, source commits, D1 schema/migration observations, authorization addendum and synchronized status surfaces against the Stage 3 report and Stage 4 request. Report each finding PASS/PARTIAL/FAIL. Do not approve Phase 2 or make Kevin's Foundation governance decision.
