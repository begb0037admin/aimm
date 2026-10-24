# Stage 5 retry checkpoint — 2026-10-24 21:23 UTC

**Branch:** codex/pluginhub-foundation  
**Foundation exit:** NOT MET. Historical Stage 5 review: PARTIAL. Stages 2–5 remain in progress; Stage 6 is not ready. No deployment or cutover.

## Change

Added an owner retry path for one failed item from a completed reveal operation. The API checks same-account parentage, device ownership, a current complete inventory generation, the failed/skipped/permission-needed receipt status, CSRF for browser-session writes, and an idempotency key. It creates a child operation linked to its parent and current record. Completed, stale, cross-account and otherwise ineligible requests are rejected.

The redacted action result marks only failed, skipped or permission-needed items as retryable. The account preview offers “Retry failed action” only for that result; the request contains the opaque record ID and a fresh idempotency key. The retry does not include or expose a local path, and an item still needs a new local preview/confirmation if its action class requires it.

## Verification

At 21:23 UTC, sh scripts/pluginhub-nonprod-check.sh passed using only a temporary Wrangler --local Worker/D1 and disposable test data:

- Swift companion build, journal/sync/pairing checks: PASS.
- Scanner tests: 3/3 PASS.
- API/browser tests: 28/28 PASS, including retry authorization, idempotency, account isolation, stale/current inventory handling and owner UI visibility.
- JavaScript syntax and local D1 migration checks: PASS.
- Local Worker health/auth/CORS: PASS.
- Actual Swift pairing-init and inventory sync through the local Worker/D1: PASS.
- Synthetic reveal command claim and signed P-256 receipt verification/readback: PASS.

The synthetic action does not open Finder or touch a plug-in file. No remote Worker/D1 write, Keychain write, provider change, deployment or cutover occurred.

## Source pins

- Top-level migration migrations/0010_action_retries.sql: commit 780975bf66059a9560d3a8a0b51954df6cb3afd6.
- API migration library-api/migrations/0010_action_retries.sql: commit 463daf1c4c0b83423d0961fdbc76353c0a95921e.
- Retry API library-api/src/index.js: commit a74d7494c31b279f1a8f7d0ed50908431830b07b, blob 40b1868d7911e47d2f57800d796365f6bea7c750.
- Owner retry UI library-api/library-account.js: commit 1cc85ce9740347356c776e8729a85e934fa22455, blob 3a61cc7c7ac67a79f062e03d9df10818475b8e44.
- API retry tests library-api/test/foundation.test.js: commit f13f459568c45f9e9109943875023f2ff62deac6, blob 4ad00ced1b81375bb59dd4fcf71eb3497969345e.
- Owner UI tests library-api/test/library-account.test.js: commit 9d682961294e5e482d6cfa05df8ac0be4c39458d, blob e80028fc061653bf9682a743128640c9dbefcf07.
- Recovery migration coverage library-api/test/recovery-export.test.js: commit d0b8f96ab0ad0d62f4d0e92515f70dc1458b4f3b, blob d5c6098b5d2167e4cd0ae1bcbf6d8dfefdf4cec8.

## Remaining work

This checkpoint is a local retry/protocol increment; it does not complete Stage 5. Hub/site launch, verified installer download/open, move/restore, Trash uninstall, duplicate/old-installer cleanup, vault and sharing remain unimplemented or unproven. Actual Finder execution, real Mac/Keychain pairing, remote Worker/account-isolation and recovery checks, full parity evidence, and fresh independent Stage 5/Foundation validation remain open. Preserve Foundation NOT MET and Stage 6 gated.
