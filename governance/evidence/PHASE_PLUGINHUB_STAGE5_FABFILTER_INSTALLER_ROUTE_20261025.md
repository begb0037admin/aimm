# PluginHub Stage 5 — official installer route resolution

**Verified:** 2026-10-25 07:37 UTC  
**Branch:** `codex/pluginhub-foundation`  
**Result:** Non-production route resolver and deterministic tests pass; Stage 5 remains in progress.

## Change

The companion can parse a current FabFilter product/version heading and its following “Download for macOS” link from the official download page, then accept only an HTTPS DMG on `cdn-b.fabfilter.com`. A client method is enabled only for Pro-Q 4 and requires the artifact version to equal the version parsed from the same page. Unknown products, non-Mac labels, non-DMG paths and other hosts are rejected.

The fixture models the official page's Pro-Q 4 4.13 entry and also checks another product link and a hostile CDN. The test is deterministic and makes no network request.

Official source: [FabFilter downloads](https://www.fabfilter.com/download). The public page identifies Pro-Q 4 version 4.13 and a macOS download; it also states that downloads are 30-day trial versions that can be unlocked with a license key. No installer was downloaded or opened.

## Source pins

- Resolver and URL parsing: commit `64b75c1650776385636139f6f543c90bcc43feb6`, blob `e44e3615faf055cca5fb9bbbee1d9fa5c9f4a7a5`.
- Fixture and assertions: commit `21a2df99d56203def396a447daa9da7e38ba6c0e`, blob `0900851b888cb809fc81fb5b82ef4f29971df298`.

## Verification

The full `sh scripts/pluginhub-nonprod-check.sh` passed: Swift companion/journal checks, scanner tests 3/3, API/browser tests 30/30, isolated local D1 migrations and Worker runtime, and local pairing, sync, Manual Check and signed reveal receipt flows.

## Remaining P13 work

This increment only resolves the official route. It does not yet queue downloads through the API, show progress, support cancellation, save the DMG, validate the downloaded artifact signature, sequence batches or rescan to confirm installation. The companion has not been given a download action for this route. Foundation remains **NOT MET** and Stage 6 remains gated. No deployment, remote D1 write or cutover occurred.
