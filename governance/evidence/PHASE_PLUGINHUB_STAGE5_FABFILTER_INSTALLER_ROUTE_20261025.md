# PluginHub Stage 5 — FabFilter installer route resolution

**Verified:** 2026-10-25 07:59 UTC  
**Tested source head:** `719a2b5877533f992afc73e6dc399e8055ffbc4c` on `codex/pluginhub-foundation`  
**Result:** The current Pro-Q 4 macOS route resolves live to the allowlisted FabFilter CDN. Stage 5 remains in progress.

## Change

The companion parses a current FabFilter product/version heading and its following “Download for macOS” link from the official download page, then accepts only an HTTPS DMG on `cdn-b.fabfilter.com`. The resolver is enabled only for Pro-Q 4 and requires the artifact version to match the current version parsed from the same page. Unknown products, non-Mac labels, non-DMG paths and other hosts are rejected.

## Verification

- `swift run aimm-journal-check --live-fabfilter-route` — PASS at 07:59 UTC. The live official page resolved Pro-Q 4 version 4.13 to an HTTPS DMG route on the allowlisted CDN. The test did not download, inspect or open the file.
- Offline route fixture — PASS. It checks the official-page shape, version binding, macOS label, DMG extension and hostile-host rejection.
- `sh scripts/pluginhub-nonprod-check.sh` — PASS after adding the opt-in route check: Swift build/journal, scanner 3/3, API/browser 30/30, JavaScript syntax, isolated local D1/Worker, pairing, inventory sync, Manual Check and signed synthetic reveal receipt.
- The default suite remains offline. The live diagnostic makes a read-only public-page request only.

Official source: [FabFilter downloads](https://www.fabfilter.com/download). The page labels downloads as 30-day trials that require a licence key to unlock after the evaluation period. No installer was downloaded or opened.

## Source pins

- Resolver and public-page client: commit `9752b42a28981959dd3f3028641a86bdd8338a2c`, blob `17d4f4ce60c316f0518b367eeb040f1118b696e6`.
- Live route diagnostic and fixture assertions: commit `719a2b5877533f992afc73e6dc399e8055ffbc4c`, blob `01be451953f9a7bf7ff35d3f4d1d80fa18328427`.

## Remaining P13 work

This increment verifies route discovery only. It does not queue downloads through the API, show progress, support cancellation, save the DMG, validate the downloaded artifact signature, sequence batches or rescan to confirm installation. Direct download remains unavailable until a trusted signer or digest is established and the architecture's exact preview and fresh owner verification are implemented. Foundation remains **NOT MET** and Stage 6 remains gated. No deployment, remote D1 write or cutover occurred.
