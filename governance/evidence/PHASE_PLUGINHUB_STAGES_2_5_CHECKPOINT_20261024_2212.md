# PluginHub Stages 2–5 checkpoint — 2026-10-24 22:12 UTC

**Branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Verified implementation commit:** `b8ab867ecc416a6082014cd14e88eb84d31cd635`  
**Foundation exit:** **NOT MET**. Historical independent Stage 5 review: **PARTIAL**.  
**Stage 6:** not ready. **Deployment/cutover:** none.

## Stage 4 and Stage 5 increment

Extended the fixed vendor-site action from FabFilter to Voxengo. The account preview exposes it for those two vendors. The API verifies the current complete inventory row and rejects unsupported vendor routes before queueing an operation. The companion independently resolves the approved fixed URL from its local adapter, shows the vendor and destination, waits for an explicit local press, and submits the signed receipt. No URL comes from the server, and no download or file modification occurs.

Voxengo's version check remains fixture-tested against its [official downloads page](https://www.voxengo.com/downloads/). The Stage 5 route uses that vendor's official downloads page, with its destination fixed in companion code.

## Verification

`sh scripts/pluginhub-nonprod-check.sh` passed after the change:
- Swift companion/app build and journal checks passed.
- Scanner 3/3; API/browser 30/30; JavaScript syntax passed.
- D1 export recovery and migrations through 0012 passed.
- Temporary Worker/D1 health/auth/CORS checks passed.
- Synthetic Swift pairing, inventory sync, Manual Check upload and signed reveal receipt readback passed.
- API tests verify the Voxengo action summary, unsupported-vendor rejection without an operation row, normal signed action receipt, and browser-button request payload.

No vendor request, real Keychain pairing, Finder/hub operation, remote two-account Auth0 check, project D1 write, deployment or cutover was performed.

## Current boundaries

Stages 2–5 remain in progress. Stage 4 still needs broader vendor coverage and the 31-row parity map. Real-device and action/recovery evidence, remote isolation/runtime/security proof, and fresh independent Stage 5/Foundation validation remain open. Preserve Foundation **NOT MET** and Stage 6 gated.

## Source pins

| File | Commit | Blob |
|---|---|---|
| `library-api/src/index.js` | `95dc4dd311676ede83f895b69d754816551932dc` | `0f5651fbb3544a78173f272ba0ec4b859a25fc3f` |
| `library-api/library-account.js` | `069bf2e28af8c5d74b9d0c347386fc61ded8c1fb` | `db01ad6a6c5f68d0025939f8e2e1daa010b1dcdb` |
| `library-api/test/foundation.test.js` | `35ed13ebcced6a4741717e6f043f87c0fded30d5` | `772b5c4b7c84b61623c14e409a8d6159bfedde5d` |
| `library-api/test/library-account.test.js` | `4345c03a4244dc688d094f388b9e6ef0ee3d3015` | `700578297d57146cad0bef6a53b1543f13499a32` |
| `companion/Sources/AIMMCompanionCore/VendorStatus.swift` | `a4f007f2e0481198c46e3c468b3000de7f75cc33` | `bb9b3b7156eb58a9c2acfbb2c6884ca4ceebb55f` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `b8ab867ecc416a6082014cd14e88eb84d31cd635` | `ef816c424d15a172798ec27954861d6707a7c4d5` |
| `companion/Sources/aimm-journal-check/main.swift` (Stage 4 fixtures) | `610248cead3575658f42b6770c1f9ba7dc1e99f6` | `3a273fe5ecf14bfd313ccc151d04fad6e921dec6` |

No production or project D1 changes were made.
