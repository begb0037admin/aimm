# PluginHub live Stage 2–5 validation — 2026-10-27

Branch: `begb0037admin/aimm`, `codex/pluginhub-foundation`. Connected GitHub is authoritative; the local checkout remains stale/dirty and was not overwritten.

## Mac scan and account comparison

The paired AIMM Companion completed a fresh standard-folder scan at `2026-10-27T21:48:16Z` and reported that the complete generation synced. The development Library then reported 1,641 account records for generation `9ff4225e-fb10-4966-aae4-393cf8294210`.

The current browser comparator reported 1,958 local entries: 1,641 matching, 317 browser-only, 0 account-only, and 2 version differences. The fresh scan did not change the discrepancy. The 317 rows and two version differences still need reconciliation before parity can be accepted.

## Vendor status readback and fix

The companion reported public checks for 9 FabFilter items and 6 Valhalla DSP items; no Voxengo or u-he items were supported. A bounded D1 aggregate read for the new generation found 11 public-vendor `up_to_date` and 4 public-vendor `update` observations.

The account status panel showed zero updates and the latest per-item rows had been replaced by Manual Check. The cause was that each vendor action submitted a Manual Check result for every unsupported record, overwriting newer observations from other adapters. This was reproduced in the persisted history and identified in `CompanionModel`.

The current branch now filters vendor refresh submissions to `source_type = public_vendor`, preserving records owned by other adapters. The fix and regression check are in source commit chain ending at `1b29362541f316cb0da3bbe8235bc6e7705ce711`. The isolated Swift build succeeded and `aimm-journal-check` passed against the current branch test source, including the new preservation check. The updated app was not installed or launched on the Mac, so live status preservation after the fix remains to be verified.

## Stage 5 read-only action

One installed-item Finder reveal completed after the paired Mac showed the exact request and the local Reveal control was pressed. Finder opened, the companion reported a signed receipt saved, and a bounded read confirmed the operation state was `completed` with a receipt present. A subsequent Library action-status read also returned `completed`. No plug-in file was changed.

This proves the read-only reveal/receipt path and status recovery for that completed operation. Synthetic move/restore recovery, remaining action classes, and the full 31-row mapping are still open.

## Remaining Foundation work

- Reconcile the 317 browser-only entries and 2 version differences; preserve the account generation as the canonical paired-Mac snapshot.
- Build and run the updated non-production companion, rerun supported public checks, and verify the API and Library summary retain current/update results across vendors.
- Finish a synthetic non-production move/restore recovery walk without touching real plug-in files.
- Complete the 31-row Stage 4 map and a supported paired-credential wrong-device HTTP 401 probe without displaying or logging credentials.
- Obtain a fresh independent end-to-end review after those checks.

No production deployment, cutover, migration, credential change, provider terms acceptance, or broad table export occurred. Preserve the recorded D1 authorization chronology and keep Foundation exit unmet until the remaining evidence and independent acceptance are complete.
