# Stage 5 mounted APFS cross-volume move and restore — 2026-10-25

## Result

Ran `sh scripts/pluginhub-cross-volume-check.sh` successfully against a disposable 64 MB APFS sparse image. The test confirmed distinct filesystem device IDs `16777233` (source) and `16777239` (target), forced the companion's cross-volume staged-copy path, verified destination content before source removal, then restored the synthetic item and exercised recovery. The image was detached and the temporary directory removed by the script's cleanup trap.

The journal checker passed its additional move/restore recovery fixtures in the same run.

## Limits

This uses only synthetic files on local temporary filesystems. It does not prove recovery from a real backup or user plug-in folder, remote backup restore, remote account isolation, browser passkey confirmation, or complete Stage 5 action coverage. No remote D1/Auth0, deployment or cutover was involved.

Tested source commit: `946ad71df470bf3d4c5ada00de5d9a7ab9ff3f15`.

Foundation remains **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 authorization gate open.
