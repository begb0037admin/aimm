# PluginHub Stages 2–5 checkpoint — 2026-10-24 22:15 UTC

**Branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Verified implementation commit:** `190b56a059e7ca554f89e52fb5737e8acb5d77d1`  
**Foundation exit:** **NOT MET**. Historical independent Stage 5 review: **PARTIAL**.  
**Stage 6:** not ready. **Deployment/cutover:** none.

## Stage 5 retry increment

Failed supported actions can now be retried when the signed receipt marks the item failed, skipped, or needing permission. The API preserves the parent action kind and checks that the item is still in the device's current complete generation. For a vendor-site retry it revalidates the current vendor route before queueing. Replay remains idempotent and each retry reaches the companion as a new operation requiring the same local confirmation.

The API fixture uses a failed Voxengo vendor-site receipt, retries it, verifies replay, and verifies that an unclaimed retry can be cancelled. Existing unsupported-vendor rejection and signed-receipt checks remain passing.

## Verification

`sh scripts/pluginhub-nonprod-check.sh` passed: Swift companion/app build/check, scanner 3/3, API/browser 30/30, JavaScript syntax, D1 export recovery/migrations through 0012, temporary Worker/D1 health/auth/CORS, and synthetic Swift pairing, inventory sync, Manual Check upload and signed reveal receipt readback.

No real Finder/vendor-page operation, Keychain pairing, remote two-account Auth0 test, application D1 write, deployment or cutover occurred.

## Current boundaries

Stages 2–5 remain in progress. Real paired-Mac/Keychain and custom-folder evidence, actual Finder/hub action and recovery evidence, broader Stage 4 coverage and the 31-row parity map, remote runtime/isolation/security proof, and fresh independent Stage 5/Foundation validation remain open. Preserve Foundation **NOT MET** and Stage 6 gated.

## Source pins

| File | Commit | Blob |
|---|---|---|
| `library-api/src/index.js` | `e03fcca8a6ab5e53860dc15acd5d703696752cf5` | `a777d28d4b29544ff24893865b89819a01581f2c` |
| `library-api/test/foundation.test.js` | `190b56a059e7ca554f89e52fb5737e8acb5d77d1` | `7a3bca2d561039cfe1886312be0d2d5361409bd0` |

No project D1 or production changes were made.
