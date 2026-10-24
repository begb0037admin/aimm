# PluginHub Stages 2–5 checkpoint — 2026-10-24 22:08 UTC

**Branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Verified implementation commit:** `610248cead3575658f42b6770c1f9ba7dc1e99f6`  
**Foundation exit:** **NOT MET**. Historical independent Stage 5 review: **PARTIAL**.  
**Stage 6:** not ready. **Deployment/cutover:** none.

## Stage 4 increment

Added a Voxengo public-version adapter to the companion, with a “Check Voxengo versions” control. It parses product/version pairs only from official downloads-page sections that advertise a Mac download, compares numeric versions, marks unsupported entries Manual Check, and records source failures as errors. Requests are bounded, cached in memory for two hours, HTTPS-only, capped at 2 MiB, and redirects are restricted to the official Voxengo host. No installer is downloaded or installed.

The adapter uses the official [Voxengo downloads page](https://www.voxengo.com/downloads/). Fixture checks cover BMS/SPAN parsing, Mac-download gating, newer/current comparisons, unsupported products, fixed official destination, source failure and malformed source content.

## Verification

- `swift build`: passed.
- `sh scripts/pluginhub-nonprod-check.sh`: passed.
- Companion journal/endpoint/pairing checks passed; scanner 3/3; API/browser 30/30; JavaScript syntax passed.
- Temporary local D1 migration/recovery through 0012 and Worker health/auth/CORS passed.
- Synthetic Swift pairing, inventory sync, Manual Check submission and signed reveal receipt readback passed against temporary local Worker/D1.

No real vendor request, real Keychain pairing, real Finder/hub action, remote two-account Auth0 isolation test, project D1 write, deployment or cutover was performed.

## Current boundaries

Stages 2–5 remain in progress. Stage 4 now has FabFilter and Voxengo public adapters; broad vendor coverage and the approved 31-row parity map remain open. Real-device and action/recovery evidence, remote isolation/security evidence, and fresh independent Stage 5/Foundation validation remain open. Preserve Foundation **NOT MET** and Stage 6 gated.

## Source pins

| File | Commit | Blob |
|---|---|---|
| `companion/Sources/AIMMCompanionCore/VendorStatus.swift` | `ba7bde53eb685a1f19045085a58939d14f4311c0` | `ca7b312c9428d0f32713531e43faa705879c25a6` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `32cbfc4c0c606b0a509e0a60c4673a99874ed53a` | `acc8d33dc50d66a7612840cd77054c65c0bf7002` |
| `companion/Sources/aimm-journal-check/main.swift` | `610248cead3575658f42b6770c1f9ba7dc1e99f6` | `3a273fe5ecf14bfd313ccc151d04fad6e921dec6` |

No production or project D1 changes were made.
