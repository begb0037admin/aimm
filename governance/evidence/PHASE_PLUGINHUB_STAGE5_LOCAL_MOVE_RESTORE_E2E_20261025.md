# Stage 5 local move-and-restore integration — 2026-10-25

## Result

The actual Swift companion HTTP client completed a linked move and restore lifecycle against a local Worker and disposable local D1, using only one synthetic plug-in bundle.

1. The client claimed a seeded `move_to_unused` action for the complete inventory generation and submitted its signed preview.
2. The test harness marked owner confirmation in disposable D1 only for that exact operation and preview digest.
3. The client revalidated the preview, journaled and moved the synthetic item to Unused, synced a complete generation with the item absent, and submitted a signed receipt. The Worker accepted the receipt.
4. A restore operation tied to that completed parent move was then claimed. The client signed its parent-bound preview, passed the same local-only confirmation harness, restored the item to its original location, synced a complete generation containing the item, and submitted a signed parent-bound receipt.
5. The check queried local D1 and confirmed the restore operation and receipt were `completed`.

The two owner confirmations were synthetic local fixture writes. No browser passkey/WebAuthn ceremony or live Auth0 sign-in took place. The synthetic bundle was under `/private/tmp/aimm-synthetic-local-worker-fixture` and the script cleanup trap removed it.

## Verification

Ran `sh scripts/pluginhub-nonprod-check.sh` successfully after the final changes:

- Ad-hoc signed companion preview package and signature verification.
- Swift companion build and journal/recovery fixtures, including cross-volume move/restore behavior.
- Scanner integration: 3/3.
- API/browser suite: 38/38.
- Local D1 migrations through 0021.
- Local Worker health, missing-auth rejection, and allowed/hostile CORS.
- Actual Swift pairing bootstrap, inventory sync, Manual Check, reveal claim/preview/receipt.
- Actual Swift move and restore previews, local synthetic filesystem operations, complete inventory resync after each action, and signed receipts accepted by local Worker/D1.

The integration found and fixed macOS path-alias handling: a journal path recorded canonically as `/tmp` must match the scanner's equivalent `/private/tmp` path. Validation compares canonical path identity while requiring an absolute traversal-free journal path, a non-symlinked moved item, matching content digest and parent move, and an unoccupied original destination.

## Source pins

Source commit: `d49682b593dac7be1a18a130c8572d3a9a51826a`.

- `companion/Sources/AIMMCompanionCore/DeviceSync.swift`: `2c1c1ca7135653d1219069099f74fb7d1d9d9f3e`
- `companion/Sources/aimm-journal-check/main.swift`: `695ba1051d9dad10cbc0fe1f197f29bbaf114a91`
- `scripts/pluginhub-nonprod-check.sh`: `92a3fd1f7010ac3a1f3b6ebd99a6088c9e955fb0`
- `scripts/pluginhub-local-worker-fixture.mjs`: `3cb678361bba5cb7b94b844edc9a92d2dd00f667`

## Limits and remaining gates

This is local synthetic integration evidence. It does not prove the real browser passkey ceremony, remote Auth0/provider runtime, remote two-account isolation, remote backup recovery, live browser-to-Mac parity, all Stage 5 action classes, Developer ID distribution, or fresh independent end-to-end review. No remote project D1 was accessed or written. Nothing was deployed or cut over.

Foundation remains **NOT MET**. Stages 2–5 remain partial; Stage 6 remains gated. Keep the 22:47 D1 authorization gate open.
