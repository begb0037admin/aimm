# Phase 2 Stages 2–5 checkpoint — 2026-10-24 21:31 UTC

**Foundation exit:** NOT MET. Historical Stage 5 independent review: PARTIAL. Stages 2–5 remain in progress; Stage 6 is not ready. No deployment or cutover.

## Implementation

Stage 2 now supports explicit scans of standard user/system Audio/Plug-Ins roots and persistent custom folder grants. Custom roots are stored locally as macOS security-scoped bookmarks, can be rescanned or forgotten, and stale/unavailable grants are reported. A temporary fixture passed bookmark save/resolve/forget.

Stage 5 now supports retry of one failed reveal receipt item and owner cancellation before the Mac claims a pending action. Cancellation is atomic against the device claim, same-account scoped, CSRF-protected for browser sessions, replay-safe, and removes the action from the device queue. The UI shows the cancel control only for requested actions. Once claimed or finished, cancellation is rejected.

## Verification

At 21:31 UTC, sh scripts/pluginhub-nonprod-check.sh passed:

- Swift build including the aimm-companion app target and companion checks: PASS.
- Synthetic custom-root bookmark save/resolve/forget: PASS.
- Scanner tests: 3/3 PASS.
- API/browser tests: 29/29 PASS, including cancellation CSRF, isolation, replay, queue removal and UI behavior; retry authorization/idempotency also passed.
- JavaScript syntax and temporary local D1 migrations: PASS.
- Local Worker health/auth/CORS: PASS.
- Actual Swift pairing-init and inventory sync through local Worker/D1: PASS.
- Synthetic reveal command claim and signed P-256 receipt verification/readback: PASS.

Bookmark testing used only a temporary directory; it did not exercise a real user's folder grant. Synthetic action testing does not open Finder or touch a plug-in file. All Worker/D1 state was temporary/local. No remote write, Keychain write, provider change, deployment or cutover occurred.

## Source pins

- Standard-root scanner: ffe8aeed219c4042960cdc0df7e260da53758f7d / blob 9266422ed1da675e53e1458162725ed48b6932e5.
- Companion app and saved-folder controls: 40268dc2f6e2722832bc160e542c457b0066841c / blob 9435d2fdf67b2efe9763f75ecaab5a0b62a8b178.
- Bookmark store: 08843030564ddf6642e9cb9d2d0822f2bfad9d42 / blob ee14a5867f448612c51e58b42fd7110d31e3b037.
- Bookmark checker: 33a85105ae67c12a7dd4a4d1512ccf0922cedd35 / blob 4ce01b9869497f2bfc738d6d0de961a230ec1bb4.
- Action cancel API: 35fb8face3b7a38edec02ed07f27ab622d0700da / blob 24c5c6497401a7203217a809e8db931c10732bb9.
- Owner cancel UI: 6057c52bb5c2849f4d1e9195d08f48a6f66e9386 / blob 2d807ce33a23db17fc4f8a7038145a81b0145d7c.
- API cancel tests: 06edb5a015b911091f632cadf9bdd005327eb593 / blob fc913f48af05e640850cc8c573c0e0c77997a6d1.
- UI cancel test: 9d87f8927fe698d5a38d36473b851ebac41fd741 / blob fcf7a835bebff820c21011f463fd1b46687d8945.
- Action retry source/tests remain pinned in the 21:23 checkpoint report and evidence package.

## Remaining evidence and implementation

Remote Worker runtime and cross-account rejection, full remote recovery, real Mac/Keychain pairing, actual Finder action, broader Stage 5 actions (hub/site, verified download/installer, move/restore, Trash cleanup, duplicate finder, vault and sharing), full parity and fresh independent Stage 5/Foundation PASS remain open. Keep Foundation NOT MET and Stage 6 gated.
