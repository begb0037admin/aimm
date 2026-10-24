# PluginHub Stages 2–5 implementation checkpoint — 2026-10-24 21:52 UTC

**Repository / branch:** begb0037admin/aimm / codex/pluginhub-foundation  
**Foundation exit:** NOT MET. Historical independent Stage 5 review: PARTIAL. Stages 2–5 remain in progress; Stage 6 is not ready.  
**Deployment:** No deployment or cutover.

## Implemented since the previous checkpoint

Stage 4 retains the current FabFilter public-version adapter. Stage 5 now also supports an explicit `open_vendor_site` action from the account preview through the paired companion. It is limited to recognized FabFilter items and a fixed HTTPS URL compiled into the adapter; the API never supplies a destination URL. The companion shows the destination and waits for the owner to press the open button, then sends a signed receipt. No file is changed.

Migration 0011 adds the action kind while preserving existing operations and operation-item rows. The recovery test covers preservation across this migration. Broader Stage 5 action classes remain unfinished.

## Local verification

At 21:52 UTC, `sh scripts/pluginhub-nonprod-check.sh` passed:

- Companion/app build and safety checker; scanner fixtures 3/3.
- Library API/browser tests 30/30 and JS syntax checks.
- Pinned D1 export restored and migrations 0004–0011 applied; migration 0011 preserved a pending operation and item, passed foreign-key/integrity checks, and accepted the new action kind.
- Temporary local D1 migrations and Worker health/auth/CORS checks.
- Swift pairing-init, inventory sync and Manual Check upload through the temporary local Worker/D1; synthetic reveal command claim and signed receipt readback.
- API action tests queue the vendor-site operation, claim it and verify its signed receipt.

The suite did not contact a vendor or perform a Finder action, real Keychain operation, remote write, deployment or cutover.

## Remote read-only runtime and recovery evidence

The already deployed development Worker responded to `/health` with HTTP 200, rejected unauthenticated `/v1/me` with 401, allowed the configured site origin preflight with 204, and rejected a hostile origin with 403. Cloudflare settings confirm this Worker is bound to the existing `aimm-library-foundation-dev` D1. The database currently has migrations 0001–0009; migrations 0010–0011 are not applied remotely. No deploy or application-database write occurred.

A separate recovery drill used only synthetic data in two temporary EU D1 databases. A one-row export was imported into the second database and the same synthetic row was read back. Both temporary databases were deleted afterward; a follow-up list confirmed no recovery-test database remains. The exported file and upload response were removed from local temporary storage.

Remote cross-account rejection is still unverified because it requires valid sessions for two Auth0 user accounts. No credentials or test accounts were created. The real application D1 was not exported because it contains existing account/device metadata.

## Current source pins

- API action route: 320971a29ae9745697cae2c992b91e7071da9c36 / blob 621a427be6dddc780a67b32b86f7f96d82677285.
- Account preview action button: 6212b1e511c2d5730788d17945759f95530a6980 / blob ab0ed021b8aebef5c3f29773a495bd7571df6554.
- API action tests: b5e02b83e853deb12f5a64983651c4777de67cf4 / blob e2d9791934d2d43a2761efdcc96fbd1746ccb72d.
- Migration 0011: 1d43370845279259c0044ec3163022c5ba142fd8 / blob 9b8f9c91dfa22d21c46caf6d13a10df3025b7178.
- Migration preservation test: 47f2096b5b8f25561ab5874a6c96c1ab6da5b27c / blob 53f306be773613f9339dc504f3a8b0685369ee0a.
- Companion receipt support: 6259833f5b133621d0e5bc70d5346b5c7c424388 / blob 281e0a63db5ede96248b6f56f1bc8d49165ff0ec.
- Companion action handling/UI: 2d96829ee84f8bc893f524fb40e43f7a30e43ac9 / blob 6e8f5138b4608bb417c62c5cb3df797fe4e5e494.
- Fixed FabFilter destination: f4bdc789dad52b646e11191f63cbe916c20054c9 / blob a40db8d1608b768a0182335e642229937ef278ce.
- Companion safety checker: c1d59e6352530aa0fd56a4f913f78255d931eac4 / blob 568d8830ef55256f74177670eada4e64cf963ec9.

## Remaining gates

Foundation remains **NOT MET**. Stage 4 needs more vendor coverage and stale/legacy behavior. Stage 5 still needs hub launch, verified downloads and installer queue, move/restore/offload, Trash uninstall, cleanup, vault and sharing. Remote cross-account rejection, real Mac/Keychain pairing, physical Finder evidence, complete parity and a fresh independent Stage 5/Foundation PASS remain open. Keep Stage 6 gated.

The 22:47 D1 creation authorization remains recorded; preserve the separate 22:51 retention chronology. No provider terms, credentials, application D1 schema, deployment or cutover were changed.
