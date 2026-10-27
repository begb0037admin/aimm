# Independent review — local synthetic Stage 5 action and recovery — 2026-10-27 22:33 UTC

Branch: `codex/pluginhub-foundation`; reviewed tip: `58bf65fa16aa9b44a4f088ff185489c3cb3e22c8`.

## Disposition

**PARTIAL. Foundation remains NOT MET; Stage 6 remains gated.**

## Scope accepted

The new Stage 5 report exists at blob `2f64c28e9a759e1114c5b8e9a241393e477c12d8`. Its Worker, Wrangler config, fixture-script, and integration-script blob pins match the current branch tree. The tree contains 21 migration files, consistent with the reported count.

The report supports useful local synthetic Stage 5 evidence using Wrangler `--local`, disposable D1 state, and isolated fixture files: pairing and sync, cross-account credential rejection both ways, action claim/preview/receipts, synthetic move, restore, resync, and local recovery helpers. It discloses that the full wrapper stopped on missing/stale prerequisites in a deliberately minimal copy and that the action segment was then run separately.

I did not run or independently reproduce the checks.

## Still open

This does not establish a fresh **remote** Worker/D1 move-and-restore run or Foundation acceptance. The local synthetic HTTP 401 checks do not close the real paired-credential wrong-device probe. Browser parity, the 31-row Stage 4 map, and fresh independent end-to-end Foundation review also remain open.

The project records needed synchronization: identify the local synthetic action/recovery gate as passed while keeping remote runtime validation open, and remove the stale immediate instruction to rerun the local synthetic walkthrough.

No tests, D1 queries, repository edits, or external changes were made in this review.
