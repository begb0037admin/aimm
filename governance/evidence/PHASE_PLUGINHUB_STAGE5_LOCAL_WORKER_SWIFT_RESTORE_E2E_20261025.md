# Stage 5 local Worker/Swift restore integration — 2026-10-25

## Result

The actual Swift companion HTTP client completed a synthetic restore through the local Worker and disposable local D1. The fixture started from a completed, verified parent move and later complete scan generation. The Swift client claimed the restore, generated and signed the exact parent-bound preview, paused for the fixture, restored the synthetic filesystem item, synced a complete post-restore generation, and submitted the signed parent-bound completion receipt. The check queried local D1 and confirmed the restore operation and receipt reached `completed`.

The local test fixture inserted the owner-confirmation timestamp directly into its disposable D1 after verifying the exact operation ID and preview digest. It did not perform a browser passkey ceremony, Auth0 sign-in, or live owner approval. The test used a synthetic item under `/private/tmp/aimm-synthetic-local-worker-fixture`, removed by the script cleanup trap.

## Verification

Ran `sh scripts/pluginhub-nonprod-check.sh` successfully after the final corrections:

- Ad-hoc signed companion preview packaging and signature verification.
- Swift companion build, journal/recovery fixtures, including same-volume and cross-volume restore behavior.
- Scanner integration: 3/3.
- API and browser suite: 38/38.
- Local D1 migrations through 0021.
- Local Worker health, missing-auth rejection, and allowed/hostile CORS.
- Real Swift client pairing bootstrap, inventory sync, Manual Check, reveal claim/preview/signed receipt.
- Real Swift client restore preview, local synthetic filesystem restore, complete post-restore inventory sync, signed parent-bound receipt, and D1 terminal-state query.

The integration found and fixed a macOS path-alias edge: journaled canonical paths such as `/tmp` must compare correctly with scanner paths under `/private/tmp`. Restore preview validation now compares canonical identities while still requiring absolute traversal-free journal paths, a non-symlinked moved item, the expected content digest, the exact parent move, and an unoccupied original destination.

## Source pins

Source commit: `8541c4a57d59c1576a3adfa5abe5fdf0e8e0e18c`.

- `companion/Sources/AIMMCompanionCore/DeviceSync.swift`: `2c1c1ca7135653d1219069099f74fb7d1d9d9f3e`
- `companion/Sources/aimm-journal-check/main.swift`: `33047ba2f58d66b0e57f2fc73b7c98f324ed574c`
- `scripts/pluginhub-nonprod-check.sh`: `5699d26a1e1f6440a534b48720b62b2e6fe4fd21`
- `scripts/pluginhub-local-worker-fixture.mjs`: `39d14ea9301f572d70e1fa4bc868ca865e5ffc7f`

## Limits and remaining gates

This is local synthetic integration evidence. It does not prove the real browser passkey ceremony, remote Auth0/provider runtime, remote two-account isolation, remote backup recovery, live browser-to-Mac parity, full Stage 5 action coverage, Developer ID distribution, or fresh independent review. No remote project D1 was accessed or written. Nothing was deployed or cut over.

Foundation remains **NOT MET**. Stages 2–5 remain partial; Stage 6 remains gated. Keep the 22:47 D1 authorization gate open.
