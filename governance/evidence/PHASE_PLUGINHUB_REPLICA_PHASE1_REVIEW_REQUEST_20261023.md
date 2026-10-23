# PluginHub replica — Phase 1 review request

| Field | Value |
|---|---|
| Phase | PluginHub replica, Phase 1: source research |
| Date | 2026-10-23 |
| Produced by | Codex executing session |
| Addressed to | Independent Claude CLI governance challenger |
| Governed by | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.0 |
| Status | Open — awaiting Challenge Report |
| Evidence Package commit | `3b388d041ad81f5ddfa8abcc4b047f7ac3bda896` |
| Evidence Package path | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_EVIDENCE_PACKAGE_20261023.md` |
| Evidence Package GitHub blob SHA | `fa153a5dba0a065675a29ba916fc48058eb1a0e9` from Contents API GET |
| Review Request commit | Determined after this file is pushed; challenger must retrieve its commit SHA from GitHub |

## Challenger operating mode

Work as an independent, read-only reviewer with Claude CLI from Terminal. Do not modify project files or invoke PluginHub, its checker/download actions, Logic, or the running bridge. Verify evidence directly with GitHub API GETs. Output a complete Challenge Report in the format of `governance/templates/PHASE_CHALLENGE_REPORT_TEMPLATE.md`; Codex will commit the exact challenger output under `docs/project/generated/` because this CLI session has no approved GitHub write boundary. If any task is PARTIAL or FAIL, include a concrete Remediation Request in the output and require the governed remediation/validation stages.

## Inputs

1. `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_EVIDENCE_PACKAGE_20261023.md` at commit `3b388d041ad81f5ddfa8abcc4b047f7ac3bda896`.
2. `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.0 and its Challenge Report template, retrieved from GitHub.
3. This Review Request, retrieved by GitHub Contents API on `codex/pluginhub-replication`.

The Evidence Package is an unverified claim set. Do not rely on the executing agent's local output or prior Claude technical reviews as primary governance proof.

## Verification tasks

| ID | Required independent finding |
|---|---|
| VT-01 | Repository scope: Phase 1 affects `begb0037admin/aimm`; `ai-news-channel` and `personal-finance` are excluded for stated scope, not forgotten. Verify all cited AIMM work-product commit SHAs via GitHub Commit API. |
| VT-02 | Authentication: verify earliest write commit and subsequent commits via GitHub API; report what this can and cannot prove about the executing credential. |
| VT-03 | Authorization: compare changed paths against Kevin's Phase 1 research scope and the preserved dirty UI/bridge files. Verify no product code, merge or deployment is claimed by the work-product commits. |
| VT-04 | Backups: GET the Archive files via GitHub Contents API, compare their blob SHAs to the Evidence Package, and distinguish the four backups committed earlier at `d9cd831` from the later rollback set committed alongside the update at `c2cd0d1`. Do not mark the latter as prior committed backups. |
| VT-05 | Rollback: confirm immutable prior commits/Archive blobs are retrievable and identify a feasible per-file restoration path, with the timing caveat. |
| VT-06 | Assumptions: challenge the bounded source/runtime claims and limits, especially checker candidates versus effective operation, direct installer URLs, missing modules, count units, and Phase 2 deferrals. Mark unsupported claims explicitly. |
| VT-07 | Completion: GET the current parity, vendor/action, workflow, status, count, boundary, handover, status, roadmap and dashboard blobs; compare current SHA to the Evidence Package table. Confirm the technical review records and audit script are present. |

## Output and handoff

Give PASS, PARTIAL or FAIL for each VT task, with the GitHub API endpoint, returned SHA and evidence type. State ALL PASS or GAPS FOUND. Save the full Markdown text as `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_CHALLENGE_REPORT_20261023.md` through the executing agent's exact-output handoff. If there are gaps, also output `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_REMEDIATION_REQUEST_20261023.md`. The executing agent will commit and push these reviewer-authored artifacts, then remediate and request validation as required.

No Phase 2 code or live cutover is approved by this review request.
