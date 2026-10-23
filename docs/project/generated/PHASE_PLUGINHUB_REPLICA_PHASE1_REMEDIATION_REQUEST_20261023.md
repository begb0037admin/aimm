
# PHASE_PLUGINHUB_REPLICA_PHASE1_REMEDIATION_REQUEST_20261023
# PluginHub Replica Phase 1 — Remediation Request

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | PluginHub replica, Phase 1: source research |
| Date | 2026-10-23 |
| Produced by | Independent Claude CLI governance challenger (`claude-haiku-5-5`), read-only session |
| Source Challenge Report | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_CHALLENGE_REPORT_20261023.md` (same session, GAPS FOUND) |
| Reviewing | Evidence Package at `3b388d041ad81f5ddfa8abcc4b047f7ac3bda896` (blob `fa153a5dba0a065675a29ba916fc48058eb1a0e9`) |
| Review Request at | `d6c780cb51da1200e2e96fab8a6889fc97ef2727` (blob `7df34bf74d40fb096a9d90294f3518c809b85096`) |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v1.0 |
| Status | Open — awaiting Stage 4 Remediation |
| Commit SHA (this document) | Not committed by challenger. To be populated by the committing agent. |

---

## Scope of Remediation

This request covers only the PARTIAL findings: VT-01, VT-02, VT-04 and VT-06. VT-03, VT-05 and VT-07 are PASS and need no action. Nothing here authorises Phase 2 code, cutover, or any change to product files, `index.html`, `bridge/` or `pluginhub-ui-review.patch`.

---

## Required Remediation Items

### R-01 — VT-01: Complete the work-product commit inventory

**Gap:** The Evidence Package names `c2cd0d1`, `f87dedf` and `9c0df06` as the earlier work-product commits. It omits `fbd76e9` (15:22:59Z) and `d752d0b` (16:44:28Z), both Phase 1 work-product commits. It also omits the trace-review handover `docs/handovers/2026-10-23-pluginhub-trace-review.md` (blob `7504011466805cfb61ffd11b126d36b75ccbfc17`).

**Required action:**
1. Add `fbd76e9447a42f4ceb34069a6d273c6a0aea4a35` and `d752d0b65c8e948b318289b4c7c44ff40c92e340` to the commit inventory, with their changed-path lists.
2. Add the trace-review handover to the review list, with its blob SHA.
3. Add GitHub API evidence for "ai-news-channel and personal-finance were not changed": `pushed_at` and default-head SHA for each repository, from `GET repos/begb0037admin/<repo>`.

**Acceptance evidence:** Revised Evidence Package, with the Commit API output for `fbd76e9` and `d752d0b`, and both sibling-repo GETs.

---

### R-02 — VT-02: Restate the authentication claim to what the API can prove

**Gap:** "The feature branch was pushed with existing Git credentials" is not supported by GitHub evidence. All nine commits carry `verification.verified=false` (`unsigned`). The commit author and committer names are client-set. The repository events feed has no entries on or after 2026-10-23, so it cannot evidence the Phase 1 pushes.

**Required action:** Replace the statement with an attribution-only one, for example: "Commits `d9cd831` through `d6c780c` are attributed by GitHub to account `begb0037admin`. They are unsigned. The API cannot identify the credential used to push them." Alternatively, Kevin records an explicit acceptance of this limit.

**Acceptance evidence:** Revised Evidence Package section, and either a Kevin acceptance note or a signed-commit change documented under the governed workflow. Do not rewrite or force-push existing commits to satisfy this item.

---

### R-03 — VT-04: Correct backup timing and complete the backup inventory

**Gap:**
1. The four-file `d9cd831` snapshot set (`DASHBOARD.html` `f4144d3…`, `HANDOVER.md` `ac8756c…`, `ROADMAP.md` `e1ab1a1…`, `STATUS.md` `daf9374…`) has no blob SHAs in the package. It was committed in the same commit as the first writes to those four tracked files, so "committed earlier" holds only relative to `c2cd0d1`, not before the write.
2. Six Archive files are undisclosed: `Archive/2026-10-23-aimm-pluginhub-phase1-followup/` (`6514cf3…`, `1f18d4e…`; committed in `fbd76e9`), and `Archive/2026-10-23-aimm-pluginhub-review-fixes/` (`d867bee…`, `dd5d9ed…`, `42ea4db…`, `186fd22…`; committed in `d752d0b`).
3. The exit-set file `PLUGINHUB_VENDOR_ACTION_MATRIX.md` (`cb1230f…`) is a post-initial-edit copy and must not be used as a pre-edit restore source.

**Required action:**
1. Add the four `d9cd831` blob SHAs. State that their content equals the pre-edit blobs at `c717fc6`, and correct the timing wording to "committed in the same commit as the first write; pre-edit content recoverable at `c717fc6`."
2. Add all six undisclosed Archive files to the inventory, with blob SHAs. State that they were committed in the same commit as their first tracked modification (`fbd76e9` and `d752d0b`), and that their content equals the parent-commit blobs (`d9cd831` and `fbd76e9` respectively).
3. Mark `cb1230f` as "not pre-edit; do not restore." Name `baseline-d752d0b` (`160c205…`, equal to the `d752d0b` tracked blob) as the vendor-matrix pre-edit source.

**Acceptance evidence:** Revised backup table with every Archive blob SHA, and each row's parent-commit comparison.

---

### R-04 — VT-06: Complete the risk register and label unverified claims

**Gap:**
1. The final technical review's PARTIAL verdict, its "Not verified" list, and its five residuals are not carried into the package.
2. The `.exe/.msi` acceptance in the Mac installer slot (vendor matrix line 9) is not in the risk table.
3. The `cache_status.source=cache` caveat on the saved update report (vendor matrix line 8) is not in the package.
4. Numeric results (970 / 1,230 / zero unresolved, SHA-256 `8605f731…`, counts from the local snapshot) are presented as results. The only basis is an executor-reported run, and the final technical review explicitly did not confirm them.

**Required action:**
1. Add the final technical review's verdict, unverified list and residuals to the package, with a disposition for each residual (fixed, or deferred to Phase 2 with the reason).
2. Add the `.exe/.msi` guard weakness and the `cache` caveat to the risk table, with a Phase 2 control for each.
3. For item 4, either attach the executing terminal's transcript (command, SHA-256 output, and the 970/1,230 result) or label the figures "executor-reported, not independently reproduced."

**Acceptance evidence:** Revised risk table and reproduction note. No change to any product file.

---

## Governance Constraints

- Remediation follows the backup-first, GET-verify protocol (AGENT_MODEL.md §3). Commit SHAs, blob SHAs and backup locations are recorded as the work proceeds.
- Corrections go in new commits. Do not rewrite or force-push `d9cd831`, `fbd76e9`, `d752d0b`, `c2cd0d1` or any later commit.
- Remediation writes are limited to `governance/evidence/`, `docs/` and `Archive/` paths for this phase. Do not touch `index.html`, `bridge/`, `pluginhub-ui-review.patch`, product code, or any file in `ai-news-channel` or `personal-finance`.
- The challenger does not write remediation evidence (Stage 4 is executing-agent work).

---

## Next Stage

1. Claude Code (executing agent) completes R-01 to R-04 and produces a Phase Remediation Evidence document, committed to `governance/evidence/`.
2. Claude Code submits a Phase Validation Request (Stage 5). The challenger then re-verifies VT-01, VT-02, VT-04 and VT-06 via GitHub GET, and issues a Validation Report to `docs/project/generated/`.
3. Only after all findings reach PASS does the operation proceed to Stage 6 (Governance Review Request and Kevin's Governance Decision).

No Phase 2 code or live cutover is authorised by this Remediation Request or by the Phase 1 review.
