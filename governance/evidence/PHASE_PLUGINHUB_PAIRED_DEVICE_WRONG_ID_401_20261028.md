# Paired-device wrong-device identity rejection — 2026-10-28

**Observed:** 2026-10-28 19:33 UTC  
**Source branch:** `codex/pluginhub-foundation`, head `ed40fd004890a2255cd784561e25269787115712`  
**Result:** PASS — the development Library API returned HTTP 401 for the real paired credential when the request named a randomly generated different device UUID.

## Method and scope

A temporary isolated Companion preview was built in `/private/tmp/pluginhub-companion-isolation-probe-20261028` from the exact branch source plus a small, uncommitted diagnostic addition. The modified app view disables local journal loading, inventory display, scanning, sync, and file actions. Its single control performs one GET to `/v1/devices/{random-different-UUID}/identity` using the already paired device credential loaded from Keychain into app memory. The API host is fixed by a guard to `aimm-library-api-dev.kevinlelitte.workers.dev`; the existing client session refuses cross-host redirects. A one-shot latch prevents repeat requests.

The app displayed: “PASS — development API returned HTTP 401 for a different device ID.” The UI disables the button after invocation. Neither the credential, either device UUID, nor the response body was printed, displayed, or saved. The one-time bearer use stayed in memory. No inventory rows were loaded by the isolated view; no scan, sync, file action, D1 write, credential change, or deployment occurred.

The branch Worker route is `GET /v1/devices/{id}/identity`. Its credential verifier hashes the bearer and performs a bounded `SELECT` joined on the requested device ID; a mismatch returns 401. Source blob: `05bd55aaf196cb5743d3a2bf80f1482aebd03cf8`.

## Temporary build provenance

The diagnostic app used branch blobs `companion/Sources/AIMMCompanionCore/DeviceSync.swift` (`1243c02b9a92ecd98e1fe0b70c44fff5f7411c6a`), `companion/Sources/aimm-companion/AIMMCompanionApp.swift` (`77d87054b0017cfd22c475aa1597bb5115e6b32b`), and the other Companion package files from source head `ed40fd004890a2255cd784561e25269787115712`, plus the temporary probe-only edits described above. It was packaged as an ad-hoc local preview (not a distribution build). Binary SHA-256: `b011d77f7f6d64c6f8dab9172aa2c274078ac4acdc86a13c1a76722189463713`. Jules reviewed the temporary probe and sandbox-scoped build adjustment before execution. The diagnostic source and build were not committed as application code.

## Disposition

The real paired-device wrong-device 401 gate is **MET**. This does not close Auth0 A/B session and CSRF isolation, browser/Mac/Hope parity, the synthetic Stage 5 move/restore flow, remote action/recovery, or fresh independent end-to-end Foundation review. Foundation remains **NOT MET**; Stage 6 remains gated.
