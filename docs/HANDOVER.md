# PluginHub Phase 2 handover — 2026-10-24 22:08 UTC

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Latest verified code commit:** `610248cead3575658f42b6770c1f9ba7dc1e99f6`  
**Foundation exit:** **NOT MET**. Historical independent Stage 5 review: **PARTIAL**.  
**Stages 2–5:** in progress. **Stage 6:** not ready.  
**Deployment/cutover:** none.

Phase 1 and the seven-stage Phase 2 architecture are approved. Foundation remains the active implementation stage. The 22:47 D1 creation authorization is recorded; preserve the separate 22:51 retention chronology. No provider terms were accepted or credentials created.

## Latest implementation

- **Stage 2:** explicit standard plug-in root scans; custom folder bookmarks persist locally with rescan/forget and stale-grant reporting.
- **Stage 3:** account inventory and Hope share the authenticated complete inventory. Hope has `get_plugin_action_preview`, a read-only, account-scoped API action preview. It uses the active device's complete inventory, returns no local path or URL, queues no operation and changes no file; cross-account lookup returns not found. Last API-contact and observation times are shown.
- **Stage 4:** Manual Check fallback plus FabFilter and Voxengo public-version adapters with numeric comparison. Both use bounded same-host HTTPS reads, conservative source/error semantics and an in-memory cache. Voxengo checks the [official downloads page](https://www.voxengo.com/downloads/) and accepts only product sections that advertise a Mac download. Unsupported products remain Manual Check. No adapter downloads or installs software. Broader vendor/status coverage and the approved 31-row parity map remain open.
- **Stage 5:** reveal, eligible failed-reveal retry, pre-claim cancellation, fixed-destination FabFilter vendor-site action, and owner-selected local hub-app launch. Hub launch asks the Mac owner to select a non-symlink `.app`, displays its name, waits for a separate Open press, keeps its path local, and submits a signed device receipt. Product-specific hub mapping is not verified. Direct download/installer, move/restore, Trash/uninstall, cleanup, vault, sharing and other action classes remain open. All supported actions retain local confirmation.

## Latest verification

At 22:08 UTC, `swift build` and the full `sh scripts/pluginhub-nonprod-check.sh` passed. The suite covered companion build/check, scanner 3/3, API/browser 30/30, JS syntax, D1 recovery and migrations through 0012, temporary local Worker/D1 health/auth/CORS, synthetic Swift pairing, inventory sync, Manual Check submission and signed reveal receipt readback. Offline Voxengo fixtures cover product parsing, Mac-download gating, update/current/manual/error outcomes and fixed destination.

No real Voxengo request, actual Finder/hub launch, real Keychain pairing, live Auth0 session, remote two-account probe, project D1 write, deployment or cutover was performed. Remote application D1 remains on migrations 0001–0009.

## Remaining Stage 2–5 / Foundation gates

1. Real paired-Mac/Keychain credential evidence, a user-granted custom folder, and actual Finder/hub action evidence.
2. Broader vendor/status coverage and completion of the approved 31-row parity map.
3. Remaining Stage 5 action classes with per-item failure/recovery checks.
4. Remote non-production two-account isolation using two valid Auth0 sessions, plus required provider-backed runtime/security evidence.
5. Fresh independent Stage 5/Foundation validation after the implementation and evidence gates are met.

Do not mark Foundation MET or proceed to Stage 6 until its gates pass. No deployment, cutover, provider terms/credentials, application D1 writes, or production changes.

## Current evidence and project-record pins

| Record | Commit | Blob |
|---|---|---|
| Checkpoint report | `8cc2c4916188bd983f986935d17c170b714e6853` | `9befc2863f5701902f7cdba5729fca61f8d8358f` |
| Progress | `83a4af522550feccd454bc3d3a9cf4ed253177a2` | `1cb1c3f419cc8a5e3be3def9adde7965131f5282` |
| Evidence package | `6d5c7d971a2d62dbec1a793752e2658a1a77df10` | `c9f6019d3785fba0402103ef5be217f051064446` |
| Foundation closeout | `478775975ae6b142f28394aea9999d1b3e9a451e` | `0daf03eba226e9ab6efe63565689e1beeb884c5b` |
| Dashboard | `f284dbd2edc1442be06c9ab5153225cc4cb3dd9a` | `94059da52a9aba726ed451a5944cc1f2579d80be` |
| Roadmap | `d8a3bc06c3a139ee06acfad11f4ce12c8456dff9` | `3e00665582c1bf2ad6b5eccbc008a88a28bb4ada` |
| Status | `3f452d23fa9937d5b0506bc84b01b0a0d3cf3222` | `df40818b6423b62a147ec29e36a17ac91daf78ba` |

## Current implementation pins

| File | Commit | Blob |
|---|---|---|
| API route `library-api/src/index.js` | `e26878d39a260626e3b1058d15bca13e36e4608d` | `84ce00b548e577f41f5fb42a88b581f6370114e3` |
| Account preview/Hope tool `library-api/library-account.js` | `868f20f94317dde9526b164ceaefea70e91c3c5b` | `cff9557a8ceca6b5de5aabafaa72fcc923642a78` |
| API test `library-api/test/foundation.test.js` | `e2c1cf92a954e6bd113876d22cb3be6ee5f27a34` | `8d20e43b4154de1bebcd2b56bd5b972f1e59a07a` |
| Hope/browser test `library-api/test/library-account.test.js` | `392c72bd8c358790ac4be262faeed6331c284b19` | `7d51649bf65e93156e6f8b9660852e49458d40a8` |
| Companion adapter `companion/Sources/AIMMCompanionCore/VendorStatus.swift` | `ba7bde53eb685a1f19045085a58939d14f4311c0` | `ca7b312c9428d0f32713531e43faa705879c25a6` |
| Companion UI `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `32cbfc4c0c606b0a509e0a60c4673a99874ed53a` | `acc8d33dc50d66a7612840cd77054c65c0bf7002` |
| Companion checker/fixtures `companion/Sources/aimm-journal-check/main.swift` | `610248cead3575658f42b6770c1f9ba7dc1e99f6` | `3a273fe5ecf14bfd313ccc151d04fad6e921dec6` |
| Migration 0012 API/top-level copies | `d88492b63aa7f61a3bdb17453c5d5b0cedf33f3e` / `86f83a36a229452bb241233535180768066ea2a8` | `89008d994af4a440ae722fe142717d0065ef5189` |

The latest report is [the 22:08 checkpoint](https://github.com/begb0037admin/aimm/blob/8cc2c4916188bd983f986935d17c170b714e6853/governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_CHECKPOINT_20261024_2208.md). Continue Stages 2–5 in order, verify each increment locally, and keep the pinned records synchronized. Do not deploy or cut over.
