# PluginHub Stages 2–5 checkpoint — 2026-10-24 21:59 UTC

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Verified starting head:** `d78bcfa26216a913b318b795f8bd568c057a9de3`  
**Current code head after this checkpoint:** `86f83a36a229452bb241233535180768066ea2a8`  
**Foundation exit:** **NOT MET**. Historical independent Stage 5 review: **PARTIAL**.  
**Stage 6:** not ready. **Deployment/cutover:** none.

## New Stage 5 work

Added an owner-requested `launch_hub` action in the account inventory preview. The API queues one current inventory record with an idempotency key and the companion receives only the record ID and operation metadata. It receives no application path or URL.

On the Mac, the owner chooses an installed `.app` bundle, sees its name, and presses a separate Open button. The companion rejects non-app, non-directory, and symlink selections, then launches the selected app and submits a device-signed receipt. The app path stays local. Migration 0012 adds the operation kind while preserving existing operations and items.

This is a generic, owner-selected hub launch. It does not infer a vendor mapping or prove that the chosen app manages the selected product. No actual hub app was launched during tests.

## Verification

The full `sh scripts/pluginhub-nonprod-check.sh` suite passed at 21:59 UTC:

- Swift companion and journal checker build; pairing/sync/privacy checks.
- Scanner fixtures: 3/3.
- API/browser tests: 30/30.
- JavaScript syntax checks.
- Recovery export restore and migrations through 0012, including preservation of existing actions/items and acceptance of `launch_hub`.
- Temporary local D1/Worker health, authentication, and CORS checks.
- Synthetic Swift pairing-init, inventory sync, Manual Check upload, and signed reveal-receipt readback.

Tests did not open a hub application, perform real Finder/Keychain pairing, exercise a live Auth0 account or remote two-account isolation, apply migrations to the project D1, or deploy/cut over.

## Remaining Stage 2–5 work

- Stage 2: real user-granted custom folder and paired-Mac/Keychain evidence.
- Stage 3: live account-backed read behavior and parity proof remain incomplete.
- Stage 4: current automatic version coverage is limited to FabFilter; other vendors, legacy versions, and stale-source cases remain open.
- Stage 5: verified direct download/installer queue, move/restore, Trash/uninstall, duplicate/old-installer cleanup, vault, sharing, and vendor-specific hub validation remain open. The new hub action opens only an owner-selected local app.
- Remote account isolation requires two valid Auth0 user sessions; no test accounts or credentials were created.
- Fresh independent Stage 5/Foundation validation remains required after implementation and evidence gates are complete.

Preserve Foundation **NOT MET**, Stage 5 historical review **PARTIAL**, and Stage 6 gated. No provider terms or credentials were accepted or created. No application D1 write, deployment, or cutover occurred.

## Source pins

| File | Commit that added this checkpoint change | Verified blob |
|---|---|---|
| `library-api/src/index.js` | `47684ca6cfc09a0b2a937e9fb558d289277b1ae1` | `fd9e7e702d2f9a2d31a9bfc07243b7625bc173ca` |
| `library-api/library-account.js` | `3a25fc0cb0128f2bc97024cbefdb51e00e9f057a` | `9c0bb01b82877411fe48a4da84874effe013e132` |
| `library-api/test/foundation.test.js` | `2ce3fa0c77bfb7f662e2914bf5e39a26fcbd45c4` | `70dd40efaff064bc5a4e896c5904ecc7c3e1d9d0` |
| `library-api/test/recovery-export.test.js` | `23c2430c5025355c689f478efbe133a559f69185` | `42ce56d5183df8efa49f431ac36a66ddae120ca0` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `0ce8c62839b54fc6a10e509fc350b165069fbfe2` | `b336927cf1dd68228f9e93077f2036a0db38f8d7` |
| Migration 0012 (API and top-level copies) | `d88492b63aa7f61a3bdb17453c5d5b0cedf33f3e` / `86f83a36a229452bb241233535180768066ea2a8` | `89008d994af4a440ae722fe142717d0065ef5189` |

