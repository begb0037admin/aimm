

## Final independent review — 2026-10-25

A fresh read-only review accepted this corrected local journal/executor slice after verifying the crash-resume marker and per-attempt Unused-directory validation, with no further defect found. The reviewer ran no tests. See [independent review report](PHASE_PLUGINHUB_STAGE5_RESTORE_INDEPENDENT_REVIEW_20261025.md), reviewed source commit `460141a65a58238daa2c2ac7780dd62c21597838`, report blob pending in this synchronized record update.

Latest reviewed source pins: `LocalPluginFileActions.swift` blob `9a11c0004d91e512807376cb9a0b14b6e00cdf14`; journal checker blob `0b64fc746e51ae302d98bb870a779be52125d8a4`; `ScanJournal.swift` blob `37b0e86816390689d43bfeda3831f957cd4e4ea4`. This review is narrowly scoped; it does not establish a real UI/API restore flow or close any Stage 2–5 or Foundation gate.


## Independent recovery review follow-up — 2026-10-25

A read-only review of the restore slice identified two recovery-edge gaps: replay after a filesystem move could complete without setting the verified-destination marker, and a prepared restore did not revalidate that the Unused parent was still a real directory rather than a symlink. The implementation now marks the destination verified after rehashing it on the crash-resume path and validates the Unused directory on every restore attempt. New fixtures simulate a crash after the filesystem move and swap the Unused folder for a symlink before recovery; both assertions pass. The reviewer has been asked to recheck the corrected source; the fresh read-only reviewer accepted the corrected local slice; no full Stage 5 or Foundation gate changed.

After these corrections, `sh scripts/pluginhub-nonprod-check.sh` passed again (API/browser 38/38, scanner 3/3, Swift journal/recovery, local D1 through 0020, isolated Worker, pairing/sync, Manual Check, signed preview/receipt). `sh scripts/pluginhub-cross-volume-check.sh` also passed again across distinct APFS device IDs `16777233` and `16777239`; the temporary image was detached and removed.


## Mounted cross-volume validation — 2026-10-25

Ran `sh scripts/pluginhub-cross-volume-check.sh`. It created and mounted a disposable 64 MB APFS sparse image, confirmed distinct source and destination filesystem device IDs (`16777233` and `16777239`), executed the journal checker across the mounted boundary, and detached and removed the temporary image on exit. The check passed for verified cross-volume move, restore, and staged recovery. This is synthetic-file evidence across separate local filesystems; it does not establish remote backup recovery or use real plug-in files. No remote D1 or deployment was involved.
# Stage 5 journaled local restore slice — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Foundation exit:** **NOT MET**  
**Stages 2–5:** in progress; **Stage 6:** gated  
**22:47 D1 gate:** open  
**Deployment / cutover:** none

## Change

Added a separate local SQLite restore journal and a restore executor that accepts only the exact original path recorded by a completed, destination-verified `move_to_unused` operation. It binds the restore to the same account-generation fixture identifiers and digest, rejects a second restore for one move, validates paths and symlinks, refuses destination collisions, and records recoverable progress. The cross-volume path uses an operation-specific staging copy and verifies the source and destination trees before removing the Unused copy. A completed restore is safely replayable. The existing move path now durably records destination verification for same-volume moves and for recovery when the source has already disappeared.

This is a local execution and journal slice only. It is not exposed in the account API, browser, or companion UI. It does not complete the approved Stage 5 restore workflow or prove a real user's item was restored. It intentionally leaves the existing action allowlist and remote D1 authorization unchanged.

## Verification

Ran `sh scripts/pluginhub-nonprod-check.sh` after the change with the authorized local build scope. It passed:

- Companion preview build and local ad-hoc signature validation.
- Swift journal/recovery fixtures, including same-volume restore/replay, duplicate-restore rejection, simulated cross-volume move and restore, and existing staged recovery.
- Scanner integration: 3/3.
- API/browser tests: 38/38.
- Local D1 migrations through 0020, isolated Worker health/auth/CORS checks, and local Swift pairing, inventory sync, Manual Check, preview and signed receipt flows.

The first sandboxed Swift invocation was blocked by the environment before compilation (`sandbox_apply: Operation not permitted`); the full authorized local check then passed. These are local non-production fixtures. They do not establish Auth0 pairing, remote account isolation or recovery, live browser-to-Mac parity, Developer ID distribution, or fresh independent Stage 2–5 review.

## Source pins

- `companion/Sources/AIMMCompanionCore/ScanJournal.swift` — blob `37b0e86816390689d43bfeda3831f957cd4e4ea4`.
- `companion/Sources/AIMMCompanionCore/LocalPluginFileActions.swift` — blob `9a11c0004d91e512807376cb9a0b14b6e00cdf14`.
- `companion/Sources/aimm-journal-check/main.swift` — blob `0b64fc746e51ae302d98bb870a779be52125d8a4`.

Keep Foundation **NOT MET**, Stages 2–5 in progress, Stage 6 gated, and the 22:47 D1 authorization gate open. No remote D1 request/write, deployment, or cutover occurred.
