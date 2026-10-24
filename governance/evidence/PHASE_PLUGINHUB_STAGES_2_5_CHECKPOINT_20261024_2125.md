# Phase 2 Stages 2–5 checkpoint — 2026-10-24 21:25 UTC

**Foundation exit:** NOT MET. Historical Stage 5 independent review: PARTIAL. Stages 2–5 remain in progress; Stage 6 is not ready. No deploy or cutover.

## Implemented in this checkpoint

Stage 2 companion scanning now discovers existing standard per-user and system plug-in roots (Audio/Plug-Ins). The companion exposes this as an explicit “Scan standard folders” user action. Custom folders remain selected through the folder picker. Discovery is read-only; no scan starts automatically. A deterministic fixture check confirms only existing, non-symlink directory roots are returned.

The Stage 5 retry increment remains in place: an owner can retry one failed reveal receipt item. The API ties the child operation to the parent and current complete generation, and enforces same-account/device ownership, receipt eligibility, CSRF and idempotency. The UI exposes retry only for an eligible redacted result.

## Verification

At 21:25 UTC, sh scripts/pluginhub-nonprod-check.sh passed:

- Swift build, including the aimm-companion app target, and journal/client checks: PASS.
- Standard plug-in root discovery fixture check: PASS.
- Scanner tests: 3/3 PASS.
- API/browser tests: 28/28 PASS.
- JavaScript syntax and temporary local D1 migration checks: PASS.
- Local Worker health/auth/CORS: PASS.
- Actual Swift pairing-init and inventory sync through local Worker/D1: PASS.
- Synthetic reveal command claim and signed P-256 receipt verification/readback: PASS.

All Worker/D1 data was local and disposable. The synthetic action does not open Finder or touch a plug-in file. No remote write, Keychain write, deployment or cutover occurred.

## Source pins

- Scanner root discovery: commit ffe8aeed219c4042960cdc0df7e260da53758f7d / blob 9266422ed1da675e53e1458162725ed48b6932e5.
- Companion scan control: commit 261b473e1dce68bb2290662d195671c1ef6b6fea / blob dd1a9f07620ea3a0f8eb5c93375af14cd30b1fe2.
- Root discovery checker: commit 5f9cd59964f56149f68ae7ab03ea4fb834fd5cd0 / blob a9541d22b62327928d8edcadd143f7de418e6e3b.
- Stage 5 retry checkpoint and pins: commit c92c708ad0b2bf925c4c8babc6d694222d6bad31 / blob 21915892504cddabcf15910339712c5101bc240e.

## Remaining evidence and implementation

This is local build evidence only. Real Mac/Keychain pairing, remote Worker runtime and account-isolation rejection, full remote recovery, actual Finder action, complete Phase 2 parity, broader Stage 5 actions (hub/site, verified downloads/installers, move/restore, Trash cleanup, vault and sharing), and fresh independent Stage 5/Foundation PASS remain open. Keep Foundation NOT MET and Stage 6 gated.
