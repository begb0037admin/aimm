# PluginHub replica — Phase 2 challenge report

**Date:** 2026-10-23  
**Reviewer mode:** Option A — Controlled GitHub Artefact Writer  
**Branch reviewed:** `codex/pluginhub-replication`  
**Decision boundary:** This report is an independent challenge, not Kevin's governance decision.

## Scope and method

I independently retrieved the Evidence Package, Review Request, referenced workflow standard, architecture candidate, ownership map, data boundary and dated handover through the connected GitHub API. I also fetched the cited artifact commits, the checkpoint commit, the current branch ref, and current branch GETs of both inputs. The package is treated as an unverified claim set.

The final branch ref observed is `5b56384c627945531a6b8db467ae4ea08e4effa4`. The current GET content SHAs are:

- Evidence Package: `31a6b34ae9599da14cf2f844fece211829503fae`
- Review Request: `1fbf16d888116a401148263c9d2957d7c564fa49`

These match the Review Request's pinned package SHA and the task's supplied SHAs. The workflow standard requires challenge and, for any PARTIAL/FAIL, remediation and independent validation before Stage 6.

## Findings

| Task | Finding | Summary |
|---|---|---|
| VT-01 — Repository Scope Completeness | PASS | The checkpoint and all cited handoff commits are in `begb0037admin/aimm`; no other repository is listed or modified by these cited commits. |
| VT-02 — Authentication Verification | PASS | The connected GitHub API returned the cited commit records and file contents. The earliest package write exists and its file addition is confirmed. |
| VT-03 — Authorization Verification | PASS | The handoff writes are limited to the two new governance files. They do not make or imply the architecture decision or bypass the later governance stage. |
| VT-04 — Backup Validation | PASS | The package/review writes add new files; their follow-ups modify only those files. No pre-existing file was overwritten, so no backup is applicable to these writes. |
| VT-05 — Rollback Claims | PASS | Reverting the artifact commits restores/removes only the two governance files; the checkpoint and architecture inputs are parent history and are untouched by those diffs. |
| VT-06 — Governance Assumptions and Architecture Candidate | PARTIAL | Source descriptions and most assumptions are supported. However, one package assumption is only reported in the handover, and the architecture omits an explicit purchase/spend authorization boundary; retention timing also conflicts. |
| VT-07 — Estate-Wide Completion and GET Verification | PASS | The package claims only AIMM as updated, and latest branch GETs match the required content SHAs. |
| VT-08 — Residual Design Risks | PARTIAL | The architecture is explicit about most pre-build unknowns and later implementation/cutover gates, but purchase authority and retention sequencing are not sufficiently explicit for a clean architecture-only handoff. |

## Primary evidence inspected

### Artifact commits and exact scope

GitHub API commit detail and file diffs show:

- `f7b4a370748dabe065c5738d0ae2268c80c9b92e` — checkpoint; six planning/status files, all in AIMM.
- `8524ac7c175aefc1576d7551681fe16089c4a8b4` — adds only the Evidence Package; parent is the checkpoint; initial blob SHA `f1cd2f9a4093b1293304a76c43218edb67a81a8a`.
- `08230eec147c4d0f1b96808c823419d4e9877403` — adds only the Review Request.
- `acd6ceb6dbfd8c48bb3ba1b8a1520baeda1b9e76` — modifies only the Review Request metadata.
- `4c2efedc77de6a23d9ed1fefc1b97212e6fbabe4` — modifies only the Evidence Package output references.
- `2399987d8a82bf6a51ca9f7397dd1fa829969aa6` — modifies only the Evidence Package's historical Review Request reference.
- `5b56384c627945531a6b8db467ae4ea08e4effa4` — modifies only the Review Request's pinned package reference and is the current branch head.

Thus the new handoff writes are confined to the Evidence Package and Review Request paths in `aimm/governance/evidence/`. The checkpoint’s six touched files are also all in AIMM. This verifies the cited repository/commit scope; it cannot independently prove the absence of unrelated uncommitted local activity outside those records.

The package's no-backup statement is supported: the first commit adds the package, the request commit adds the request, and subsequent cited commits edit only those newly added paths. Revert-based rollback is consistent with these additive artifact diffs and leaves the checkpoint/source documents intact.

### Referenced inputs and SHA checks

At checkpoint `f7b4a370748dabe065c5738d0ae2268c80c9b92e`, direct Contents API GETs returned:

- `governance/GOVERNANCE_WORKFLOW_STANDARD.md` — `ce78b5bd78a5c03c27191304c89efb8451d6e62b`
- `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md` — `c69ecc6c453561c563466efed63cd39a2e1395f2`
- `docs/PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md` — `b3d98e3d1afcbe2ff8d89474ab28c0f3cb47722f`
- `docs/PLUGINHUB_DATA_BOUNDARY.md` — `25ca4c65b0c7b5b4c909c07f094701b0f6876cbf`
- `docs/handovers/2026-10-23-pluginhub-phase2-architecture.md` — `7a4fa44e1219a8a728c31b606784911648c1db69`

The architecture labels itself a draft and says no companion/account inventory has been built. The ownership map says it is a future build and verification contract, and explicitly leaves vendor endpoint validity, effective checker coverage, full Samples UX and current canonical count unverified. The data boundary says exact AIMM schema and retention are Phase 2 decisions. The handover records the remaining gates and states that formal governance review and Kevin's decision remain open. These references support the package's descriptions; reported prior CLI reviews are not treated as proof of implementation or security.

## Task detail

### VT-01 — Repository Scope Completeness: PASS

The checkpoint diff changes only `DASHBOARD.html`, `docs/HANDOVER.md`, `docs/PLUGINHUB_REPLICA.md`, `docs/ROADMAP.md`, `docs/STATUS.md` and the dated handover, all under `begb0037admin/aimm`. Every cited package/review commit is also in that repository and touches only the stated evidence/review file. No different repository appears in the cited phase commit scope. This finding is bounded to the named phase records and API evidence inspected.

### VT-02 — Authentication Verification: PASS

The connected GitHub API returned the earliest package commit `8524ac7c175aefc1576d7551681fe16089c4a8b4`, its parent, one-file diff and blob SHA. It also returned the review commit chain and the current branch ref. The commits are unsigned in GitHub's commit verification metadata, so this proves API reachability and recorded repository writes, not cryptographic authorship of each commit. The package's claim that a connected GitHub repository API was used is consistent with this direct evidence.

### VT-03 — Authorization Verification: PASS

The cited writes add or update only the two governance artifacts. Under the inspected workflow standard, the challenger is expressly authorised to create these review artifacts in `docs/project/generated/`; Stage 6 approval remains Kevin's responsibility. The existing architecture and implementation files were not changed by the evidence/review commits. The architecture calls itself not a build/deployment approval, and its checkpoint says formal review and Kevin's decision remain pending. No approval decision was issued here.

### VT-04 — Backup Validation: PASS

The package file was added in `8524ac7`; the Review Request was added in `08230ee`; follow-ups only modify those paths. This supports the package's statement that no backup is applicable to this documentation handoff. The cited diffs do not overwrite an existing file.

### VT-05 — Rollback Claims: PASS

The artifact commits are additive or metadata edits restricted to the two new files. Their parent history includes the checkpoint/source documents; reverting these artifact changes would not revert the checkpoint or touch application/service state. No backup restore is required for the artifact writes. This conclusion addresses Git content only, not an external runtime rollback.

### VT-06 — Governance Assumptions and Architecture Candidate: PARTIAL

Direct source inspection supports the architecture and data-boundary summaries: the design separates local paths/secrets from account inventory, requires explicit consent for shares/contribution, defines action preview/confirmation/receipt behavior, and states that implementation and runtime verification are future work. The architecture retains gates for OIDC selection, entitlement/device policy, vendor adapters, Xcode signing, P31 Samples UX, retention, implementation, cutover, independent release review and merge/deployment. The checkpoint/handover also says the PluginHub-dependent prototype and LaunchAgent remain untouched pending proven replacement/cutover.

Two qualifications remain:

1. Package assumption 1 says this is the design candidate Kevin asked to take through formal review. The cited handover says a review was requested, but the inspected claim set contains no direct primary record of that request. Treat the attribution as reported context, not verified fact.
2. The architecture discusses pricing, trial/device limits and later entitlement decisions, but contains no explicit statement that architecture approval does not authorise purchases, paid vendor commitments or other spend. This matters because the Review Request expressly asks whether purchase gates are preserved.

Additionally, the data boundary says retention is a Phase 2 design decision, while the architecture's open-decision table schedules exact retention windows during API implementation. Reconcile that sequence before implementation starts.

### VT-07 — Estate-Wide Completion and GET Verification: PASS

The package's repository scope is AIMM only. At current branch ref `5b56384c627945531a6b8db467ae4ea08e4effa4`, direct GETs returned Evidence Package SHA `31a6b34ae9599da14cf2f844fece211829503fae` and Review Request SHA `1fbf16d888116a401148263c9d2957d7c564fa49`. Both match the task inputs and the Review Request's pin. The ref resolves to the same branch head.

### VT-08 — Residual Design Risks: PARTIAL

The architecture marks itself as a design candidate and is careful not to claim implementation, security testing, runtime verification, deployment or operational proof. It details user/device auth, local-only data, action authorization, stale/offline status, staged cutover and rollback. The ownership map makes whole-system acceptance observable and lists important unknowns. This is a strong basis for architecture review.

Before the architecture can be cleanly handed to implementation, it should state that approval authorises design only and does not authorise purchases/spend or paid commitments, alongside its existing implementation, account/API, service, local-action, merge and deployment boundaries. The design should also settle whether retention policy is a pre-implementation architecture gate or an implementation-time task, and align the data-boundary document. The risk is a boundary/sequence ambiguity, not evidence that any purchase or implementation occurred.

## Required next stage

Because VT-06 and VT-08 are PARTIAL, the workflow standard requires Stage 4 remediation followed by Stage 5 independent validation before Stage 6. The conditional remediation request is recorded separately. This report does not approve or reject the architecture.
