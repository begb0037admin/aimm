# Stage 5 restore after rescan generation — 2026-10-25

The journaled local restore executor now accepts the latest complete local scan generation while still requiring the parent move journal entry to be completed, destination-verified, and bound to the exact record, original source and Unused destination, and tree digest. This supports the approved flow in which the companion completes and syncs a post-move scan before a separate restore action.

The regression fixture creates a new complete generation with no restored record after the move, then restores under that generation. It also verifies replay, duplicate-restore rejection, cross-volume fallback, and recovery behavior through the existing journal checks.

## Verification

sh scripts/pluginhub-nonprod-check.sh passed after this change:

- Companion build and ad-hoc local signature verification.
- Swift scan journal, file-action and pairing/sync checks, including restore against a distinct post-move generation.
- Scanner tests: 3/3.
- API/browser tests: 38/38.
- Local D1 migrations through 0020 and isolated local Worker health, authentication and CORS checks.
- Local Swift pairing, inventory sync, Manual Check, prepared preview and signed receipt flow.

The suite used only local fixture services and local D1. It did not access or write the project’s remote D1, change Auth0, deploy, cut over, or exercise the new restore through the browser/API/UI.

## Source pins

- Source commit: 691bc462ca6a61a12fcce50ab59fea73405cd259.
- Scan journal blob: 4990fa74f7ffdaf3f97945091f277b58e8d51f1a.
- Restore executor blob: 5935e5e4b1f1217392ee7aaa03406d0cf21109b8.
- Journal checker blob: 237c7bd6df79b4f7fd59915da25fd51571b1da85.

This is a local recovery correction, not end-to-end restore evidence or an independent review. Foundation remains **NOT MET**; Stages 2–5 remain partial; Stage 6 remains gated. The 22:47 D1 authorization gate remains open.
