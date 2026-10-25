# Independent Stage 5 restore-slice review — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Reviewed source commit:** `460141a65a58238daa2c2ac7780dd62c21597838`  
**Review type:** independent, read-only code and fixture review; reviewer ran no tests and made no edits  
**Disposition:** acceptable for the local journal/executor slice only  
**Foundation:** NOT MET; Stages 2–5 partial/in progress; Stage 6 gated  
**22:47 D1 gate:** open

## Scope reviewed

- `companion/Sources/AIMMCompanionCore/ScanJournal.swift`, blob `37b0e86816390689d43bfeda3831f957cd4e4ea4`.
- `companion/Sources/AIMMCompanionCore/LocalPluginFileActions.swift`, blob `9a11c0004d91e512807376cb9a0b14b6e00cdf14`.
- `companion/Sources/aimm-journal-check/main.swift`, blob `0b64fc746e51ae302d98bb870a779be52125d8a4`.

The review checked additive journal compatibility, restore binding to the exact verified move, tree-digest checks, path/symlink handling, replay and cross-volume behavior, and whether the fixtures support the report claims.

## Findings and resolution

The first review identified two recovery-path defects: the crash-resume branch could mark a restore complete without saving its destination-verified marker, and resume did not revalidate that the Unused parent remained a directory rather than a symlink. The reviewed source now rehashes the restored destination, records the verified marker before completion, and validates the Unused directory on every restore attempt. Added fixtures simulate a crash after filesystem movement but before journal completion and a symlink swap before recovery. Both fixes and their tests were accepted in the fresh read-only re-review; no further defect was found in this narrow slice.

The reviewer did not run the test suites. The local verification is recorded separately in [the restore evidence report](PHASE_PLUGINHUB_STAGE5_JOURNALED_RESTORE_20261025.md). The code is not wired to the API, browser or companion UI, and this review does not establish an end-to-end restore flow, remote recovery, Auth0 pairing, remote isolation or Stage 5 completion.

No provider, remote D1, deployment or cutover action occurred. Preserve Foundation **NOT MET**, Stage 6 gated, and the open 22:47 D1 authorization gate.
