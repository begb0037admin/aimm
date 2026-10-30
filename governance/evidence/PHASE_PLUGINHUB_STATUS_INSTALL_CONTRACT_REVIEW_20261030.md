# PluginHub status projection and Install Manager contract review — 2026-10-30

## Scope

Read-only review of the current codex/pluginhub-foundation source, PluginHub 2.0.12 reference/manual review already recorded in the tool matrix, and the opt-in synthetic preview. No authenticated status endpoint was called, no account rows or real inventory were read, no folders were scanned, no vendor page or installer was opened, and no Worker/D1/production state changed.

Reviewed source:
- Library UI: index.html, blob 21d19ac5a4fc036780f56b5d7b7ca7c8074c3de2 (visual source commit 2b3675ab100319df9c5e6ca248eaa8970fe05388).
- Account API: library-api/src/index.js, blob f00e9eb6500a64fa2c87c793f79b812ccced4e3c.
- Existing tool contract matrix, blob 66b2c273472ae791b7f00ae63d4a10be937e10af.
- Existing status UI connection-gap record, blob 84807af834aca0c60f13523992cdf8bbab1a5dd1.

## Status projection findings

The account API exposes authenticated GET /v1/status-summary (requires read:library). It reads each active device’s current published inventory-head generation, then joins observations to that exact generation and opaque format-record ID. The response carries device/generation/record IDs; installed/latest versions; raw and freshness-bucket status; observed/checked/last-good timestamps; a two-hour freshness TTL; stale/error details; vendor route/source; paid-upgrade state; and local account marks. A failed refresh with a saved successful observation is surfaced as stale and keeps the last-good version. Counts are per format record, not per product.

The visible Library source does not request this endpoint. Its INV_SCAN_ROWS and the current 3/4/3/4 status scopes come from the in-memory synthetic fixture; no generation or record-ID join is present. The counts and colored status cues are therefore useful presentation examples, not live account/vendor results.

A safe join is still undefined: the browser scanner expands AU AudioComponents, while the Companion/API inventory uses bundle-level records. Publisher provenance exists, but canonical product IDs remain null pending a reviewed mapping. Migration 0022 is in source and is not applied remotely. Until the component-to-bundle join and product/format roll-up are reviewed, keep counts per format record and do not merge API counts into product cards. Keep raw error, stale, expired/no-result and mixed-format states distinct.

## Install Manager findings

The current Library sidebar renders Install Manager disabled with an explanation that local download, queue and receipt flows are not connected. The account API contains no Install Manager download/queue/install routes; its open_vendor_site action only opens a fixed official downloads page after Mac-side confirmation and explicitly starts no download.

The existing contract matrix records a verified Companion installer-download component, but no complete manager UI or multi-item workflow. The PluginHub reference requires vendor-filtered update groups and totals; per-row download; vendor/global queue-all and download-all; a batch panel with per-item progress/outcomes; and Download folder, Clear installed & failed, Start over and Done controls. Downloading an installer must not be presented as proof that the plug-in was installed.

## Next work, one item at a time

1. Trace the exact local Companion downloader and receipt contract from branch source without starting a download. Record its allowed artifact sources, local destination, progress/error/result states, and the distinction between download and install.
2. Build the next reviewable Install Manager slice against that local contract, with synthetic update rows only. Keep vendor network access and actual downloads out of the preview.
3. Separately design the Library status join around exact generation/record identity and AU component mapping. Preserve the synthetic-only preview until migration and source identity requirements are independently resolved.

This read-only audit does not activate tools or connect live account/vendor status. Foundation remains NOT MET; Stage 6 remains gated. “Room to breathe” remains a standing visual requirement.
