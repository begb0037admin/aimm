# PluginHub Stage 5 increment — Valhalla DSP vendor-site action

**Date:** 2026-10-25  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source checkpoint:** `b1bda84a20f35d296eef7d2b3e071b314c90a01f`

## Change

The API's vendor-site allowlist now matches the companion's existing fixed Valhalla DSP routes for VintageVerb, Room, Delay and Supermassive. Before this change the companion knew those official destinations, but the API rejected Valhalla records before preview or queueing. The API still chooses only the vendor label; the paired Mac resolves the URL from its own fixed adapter table and requires the owner to press the local action button.

No download or file change is performed by this action.

## Verification

- `npm test`: 32 tests passed.
- `sh scripts/pluginhub-nonprod-check.sh`: passed, including Swift companion/journal, scanner 3/3, API/browser 32/32, isolated local D1 migrations and Worker runtime, pairing, inventory sync, Manual Check, and signed synthetic reveal receipt.
- The API test verifies a ValhallaVintageVerb preview, successful queueing, and the corresponding command for the paired Mac. The companion journal check also asserts that the combined vendor-site dispatcher selects the same fixed Valhalla URL and label.
- No live vendor page was opened during the test. No installer was downloaded or opened. No remote project D1 write, deployment or cutover occurred.

## Source pins

- Worker API: commit `970b6b93e7eaa738674331e4e6d7b008d17879e8`, blob `ca215cd00bf283d4fee09c72410c4f6fc10c5a5c`.
- API route/queue test: commit `161bdd2fa35c567dbb89810dce00c3850f118925`, blob `515c365d629ad058606cf722746651b5b6d14aa3`.
- Existing companion route implementation: blob `5e33e4de48e027a21bf0884d1417e05aeae2113d` in `companion/Sources/AIMMCompanionCore/VendorStatus.swift`. Combined dispatcher assertion: commit `b1bda84a20f35d296eef7d2b3e071b314c90a01f`, blob `6e4ccbea9ba001421a567400bff1f6cecc719c2f`.

## Gate status

This closes one narrow Stage 5 route gap only. Direct download and installer verification, exact owner preview/passkey binding, move/restore/Trash and cleanup actions, vault/sharing, per-item recovery evidence, real Mac checks, provider-backed runtime, remote account isolation/recovery, current Mac/site parity and fresh independent review remain open. Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated.
