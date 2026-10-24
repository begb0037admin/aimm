# Phase 2 Stages 2–5 checkpoint — 2026-10-24 21:36 UTC

**Foundation exit:** NOT MET. Historical Stage 5 independent review: PARTIAL. Stages 2–5 remain in progress; Stage 6 is not ready. No deployment or cutover.

## Stage 4 implementation

The API already accepted status observations, but the companion did not submit any. The companion now has an explicit “Record Manual Check status” control for the current complete scan. It sends one path-free observation per inventory item, in bounded batches, using the paired device credential. Each result is source=manual, route=manual and comparison_reason=manual_check_required with no latest version. The UI says no automatic vendor adapters are configured and that this action does not contact vendors or report an update as current. The API's shared status summary therefore reports Manual Check instead of implying the product is up to date or leaving the row absent.

This establishes the unsupported/manual fallback only. No automatic vendor adapter or live vendor check is claimed.

## Verification

At 21:36 UTC, sh scripts/pluginhub-nonprod-check.sh passed:

- Swift build including the aimm-companion app and companion checks: PASS.
- Mocked transport verifies paired bearer auth, path-free manual observation, and explicit manual reason: PASS.
- Scanner tests: 3/3 PASS.
- API/browser tests: 30/30 PASS, including Manual Check bucket and reason.
- JavaScript syntax and temporary local D1 migrations: PASS.
- Local Worker health/auth/CORS: PASS.
- Actual Swift pairing-init, inventory sync, and manual-check fallback through temporary local Worker/D1: PASS.
- D1 readback confirms manual source, route and reason; synthetic signed reveal receipt protocol also passes.

All Worker/D1 data was temporary and local. No vendor request, remote write, real Keychain write, Finder action, deployment or cutover occurred.

## Source pins

- Companion manual-check API client: commit a167b7993af08e97d1d1fab9da082980d6d80dd9 / blob 75799faaad7048c6f71c64bee0607d7644e489c9.
- Companion status control: commit d050fb30ac2750ed57ca216c42bce4cd9508c469 / blob eca0e514f3b010fdc15cfa8e510896422f7ff735.
- Companion checker: commit 020be10fe0f8e1b12d2b8613194416e57ae85807 / blob ddf924ccd25b3044f556d9f71d2bb34c6a700238.
- Local D1 fixture capability: commit 52000d68cf9a1e5855eef0ae15c0a4d874585471 / blob a06608ccc792b87c9eb2ab224b8978c3059acf26.
- No-deploy verification script: commit b11951192183035a2a4632d28e708b69560a6e03 / blob 9cceb0cb14e5b012b8ed3b8301e9b5069a8bf753.
- API status test: commit a56a0bfbda67fb65dbe9d62dabb49b377618e7b3 / blob 2de01e10b5edb82ec50a0fe79de29c7ceafe8b6c.

## Remaining evidence and implementation

Automatic vendor adapters, remote runtime/isolation/recovery, real Mac/Keychain pairing, actual Finder action, broader Stage 5 actions (hub/site, verified download/installer, move/restore, Trash cleanup, duplicate finder, vault and sharing), complete parity and fresh independent Stage 5/Foundation PASS remain open. Keep Foundation NOT MET and Stage 6 gated.
