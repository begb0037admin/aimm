# Phase 2 Stages 2–5 checkpoint — 2026-10-24 21:29 UTC

**Foundation exit:** NOT MET. Historical Stage 5 independent review: PARTIAL. Stages 2–5 remain in progress; Stage 6 is not ready. No deployment or cutover.

## Stage 2 change

Custom plug-in folders selected in the companion are now saved as local macOS security-scoped bookmarks. The user can rescan saved folders later or remove the saved grants. On rescan, the app resolves each bookmark, refreshes stale grants, skips unavailable or non-directory roots, and reports when access must be reselected. Bookmark data stays on this Mac and is never synced. Standard user/system Audio/Plug-Ins folders can also be scanned with an explicit button; no scan starts automatically.

## Stage 5 change retained

The owner retry flow remains available for one failed item from a completed reveal operation. It validates same-account/device ownership, current generation, failed receipt item, CSRF and idempotency, and links the child operation to its parent.

## Verification

At 21:29 UTC, sh scripts/pluginhub-nonprod-check.sh passed:

- Swift build including the aimm-companion app target: PASS.
- Companion checker including a synthetic security-scoped bookmark save/resolve/forget round trip: PASS.
- Scanner tests: 3/3 PASS.
- API/browser tests: 28/28 PASS.
- JavaScript syntax and temporary local D1 migrations: PASS.
- Local Worker health/auth/CORS: PASS.
- Actual Swift pairing-init and inventory sync through local Worker/D1: PASS.
- Synthetic reveal command claim and signed P-256 receipt verification/readback: PASS.

The bookmark check uses a temporary fixture folder, not a user's plug-in folders. Worker/D1 data was temporary and local. The synthetic action does not open Finder or touch a plug-in file. No remote write, Keychain write, provider change, deployment or cutover occurred. The UI/bookmark flow was compiled and its storage primitive tested; no real user's custom folder grant was exercised.

## Source pins

- Standard-root discovery: commit ffe8aeed219c4042960cdc0df7e260da53758f7d / blob 9266422ed1da675e53e1458162725ed48b6932e5.
- Companion app with standard scan and saved-folder controls: commit 40268dc2f6e2722832bc160e542c457b0066841c / blob 9435d2fdf67b2efe9763f75ecaab5a0b62a8b178.
- Bookmark store: commit 08843030564ddf6642e9cb9d2d0822f2bfad9d42 / blob pending verification.
- Companion checker: commit 33a85105ae67c12a7dd4a4d1512ccf0922cedd35 / blob 4ce01b9869497f2bfc738d6d0de961a230ec1bb4.
- Stage 5 retry checkpoint: commit c92c708ad0b2bf925c4c8babc6d694222d6bad31 / blob 21915892504cddabcf15910339712c5101bc240e.

## Remaining evidence and implementation

Real Mac/Keychain pairing, remote Worker runtime and cross-account rejection, full remote recovery, physical Finder action, broad Stage 5 actions (hub/site, verified downloads/installers, move/restore, Trash cleanup, vault and sharing), complete Phase 2 parity and fresh independent Stage 5/Foundation PASS remain open. Keep Foundation NOT MET and Stage 6 gated.
