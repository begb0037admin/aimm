# Phase 2 Stages 2–5 checkpoint — 2026-10-24 21:33 UTC

**Foundation exit:** NOT MET. Historical Stage 5 independent review: PARTIAL. Stages 2–5 remain in progress; Stage 6 is not ready. No deployment or cutover.

## Implementation

- **Stage 2:** The companion scans standard user/system Audio/Plug-Ins roots after an explicit click. Custom roots persist locally as macOS security-scoped bookmarks and can be rescanned or forgotten. Stale/unavailable grants are reported. The bookmark round trip passed using a temporary synthetic folder.
- **Stage 3:** The account preview and Hope's installed-plugin tool use the same authenticated /v1/library snapshot. Both now expose the device's last API contact and the snapshot's observed time, so old inventory is not presented as a live Mac check.
- **Stage 5:** Owners can cancel a requested action until the Mac atomically claims it, and can retry an eligible failed reveal item. Cancel uses same-account ownership, CSRF for cookie sessions, replay handling and queue removal.

## Verification

At 21:33 UTC, sh scripts/pluginhub-nonprod-check.sh passed:

- Swift build including the aimm-companion app and companion checks: PASS.
- Synthetic custom-root bookmark save/resolve/forget: PASS.
- Scanner tests: 3/3 PASS.
- API/browser tests: 30/30 PASS, including shared inventory/last-contact behavior, cancellation and retry.
- JavaScript syntax and temporary local D1 migrations: PASS.
- Local Worker health/auth/CORS: PASS.
- Actual Swift pairing-init and inventory sync through local Worker/D1: PASS.
- Synthetic reveal claim and signed P-256 receipt verification/readback: PASS.

All runtime data was temporary/local. The bookmark test used a temp directory; no real user grant was exercised. The synthetic action does not open Finder or touch a plug-in file. No remote write, Keychain write, provider change, deployment or cutover occurred.

## Source pins

- Shared inventory and last-contact UI: commit 7a721526cbb8c231151de7b8e2edbb8c3e4e95cd / blob fe4903b4cb4f464e1563b19164a80231cdd57483.
- Stage 3 UI test: commit 8282a87064233716275fb0ed65662a420e2b2f36 / blob a7614b0ba6fc52f02e2a070d36c945d0451978ac.
- Cancel API/UI/tests: 35fb8face3b7a38edec02ed07f27ab622d0700da / 24c5c6497401a7203217a809e8db931c10732bb9; 6057c52bb5c2849f4d1e9195d08f48a6f66e9386 / 2d807ce33a23db17fc4f8a7038145a81b0145d7c; 06edb5a015b911091f632cadf9bdd005327eb593 / fc913f48af05e640850cc8c573c0e0c77997a6d1; 9d87f8927fe698d5a38d36473b851ebac41fd741 / fcf7a835bebff820c21011f463fd1b46687d8945.
- Standard roots/bookmarks and companion pins: prior 21:29 checkpoint and evidence package.
- Retry implementation and tests: 21:23 checkpoint and evidence package.

## Remaining evidence and implementation

Remote Worker runtime and cross-account rejection, full remote recovery, real Mac/Keychain pairing, physical Finder action, broad Stage 5 actions (hub/site, verified download/installer, move/restore, Trash cleanup, duplicate finder, vault and sharing), complete parity and fresh independent Stage 5/Foundation PASS remain open. Keep Foundation NOT MET and Stage 6 gated.
