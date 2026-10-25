# PluginHub Stage 4 — account preference controls

**Date:** 2026-10-25 07:49 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source head:** `63dafda931096ec7fd384e6e18b385d5c0f5b217`  
**Result:** Local non-production checks passed  
**Deployment/cutover:** None

## Implemented

The account inventory preview now reads persisted product marks and lets the owner set or clear **Favourite**, **Hidden**, and comma-separated tags. Saves go through the existing CSRF-protected `PUT /v1/preferences/marks` API and carry the current revision; the API's existing conflict response is shown if another edit changed the mark. Tags are capped at 20 values, each at 48 characters, matching the API validation. The preview still compares the complete local and account inventories without displaying local paths.

## Verification

The account-preview test submits a favourite update for a product bundle ID and verifies the scoped request body. The full `sh scripts/pluginhub-nonprod-check.sh` passed: Swift companion checks, scanner 3/3, API/browser 30/30, isolated local D1/Worker, pairing, inventory sync, Manual Check and signed reveal receipt.

## Limits and remaining gates

This verifies the feature with local fixtures only. It does not prove owner-authenticated use against the remote provider or parity against a live current Mac. Status/vendor coverage and other Stage 2–5 work remain open, as does the fresh independent review. Foundation exit remains **NOT MET**; Stage 6 remains gated. No remote D1 write, deployment or cutover occurred.
