# Stage 5 restore API and companion wiring — 2026-10-25

## Change

A verified move-to-Unused can now be found in the account preview after the item has disappeared from installed inventory. The authenticated API lists only completed, signed moves for the caller's account/device, validates their receipt evidence, excludes moves that already have a restore request, and returns no local path. The owner can queue a restore tied to that exact move.

The Mac companion now loads the historical record from the move's journal generation while requiring the current complete scan generation to match the restore request and to no longer contain the item. It checks the exact completed parent move, moved content digest, Unused location, and original path before submitting a signed preview. Restore execution requires the existing owner passkey confirmation plus a separate local button, uses the journaled restore executor, rescans and syncs, then sends a signed receipt bound to the parent move. A durable local restore journal entry resumes safely without sending a premature failure receipt.

## Verification

`sh scripts/pluginhub-nonprod-check.sh` passed on 2026-10-25. It verified the ad-hoc signed local companion preview; Swift build, local move/restore and cross-volume/recovery journal fixtures; scanner tests (3/3); API/browser tests (38/38), including sanitized restorable history and the account UI restore request; local D1 migrations through 0021; isolated Worker health/auth/CORS; and local pairing, complete inventory sync, Manual Check and signed action receipt flows. This command used only disposable local Worker/D1 state and did not deploy or contact the remote project D1.

The local executor fixture and API/browser fixtures pass separately; the restore route has not yet been exercised end-to-end against the local Worker with a real filesystem item and the actual Swift HTTP client. The app UI was built but not launched. This is testable non-production progress, not proof of remote provider/runtime, account-isolation or backup-recovery behavior.

## Source pins

- Source commit: `42aae59be235d1024c9265817b443cf8605eabea`.
- `library-api/src/index.js`: blob `6ab969c04bb45d87a1b38bed470a22606cf8ac5e`.
- `library-api/library-account.js`: blob `d9e282ae4b30526e5c2dd91070e4f017d8394ccd`.
- API restore tests: blob `2d2d3f6fdf3889923740e21d48399500c9ecb06c`.
- Account UI restore test: blob `c2f94987cbde8facbfa619ae2cd0051cdcff073f`.
- Migration `0021_restore_actions.sql`: blob `ff23b971c20f7b6a2cf78a5d71885b68535ca9bc`.
- `DeviceSync.swift`: blob `429ba10d7b16cd3002c3d68576480947046612a8`.
- `AIMMCompanionApp.swift`: blob `5614fe1a0fcd28f510f7eab5708626ea92b3e75d`.

## Gate status

Foundation remains **NOT MET** and Stages 2–5 remain partial. The 22:47 remote D1 authorization gate remains open. Real Auth0 pairing/provider runtime, remote two-account isolation and recovery, live browser-to-Mac operation validation, remaining Stage 5 action classes, and fresh independent end-to-end review remain open. No credentials were created, no provider terms were accepted, and no remote D1 access/write, deployment, or cutover occurred.
