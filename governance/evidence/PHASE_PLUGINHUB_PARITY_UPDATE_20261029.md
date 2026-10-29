# PluginHub parity update — 2026-10-29

## Category counts on initial Library render

Branch: `codex/pluginhub-foundation`  
Source commit: `47efd003e2429f82cf2a6b21bbacbfa0404cbb92`  
Development Pages deployment: `9096b1f9-9ec6-47a9-9e03-dea0ea682b61`  
Preview: https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/

The Library sidebar previously displayed zero category totals on its initial render even though the installed inventory was available. Selecting a category and returning to All plugins caused the totals to appear. Source inspection identified an inconsistent render path: inventory rendering enriched groups with resolved categories, while the initial root-render path passed unenriched groups to the sidebar.

The branch now uses the same category resolver for inventory-row assignment and sidebar counts. An explicit empty category override remains empty and renders as **Uncategorised**, rather than falling through to a generated category. Jules reviewed the exact committed source diff and passed.

The latest development Pages deployment reports success for the source commit above. On the approved branch preview, opening Library showed category totals immediately without first selecting a category or filter. The initial Library view remained Cards with four vendor columns; earlier observed views and sorting controls remain available. The preview includes existing browser-local catalogue state; no folder scan, inventory upload, or production action was performed for this verification.

No automated tests were run.

## Remaining parity work

This correction closes the initial category-count render gap only. The installed PluginHub v2.0.12/manual sweep remains the broader reference. Remaining gaps and safe sequencing are tracked in [the parity sweep](PHASE_PLUGINHUB_PARITY_SWEEP_20261029.md): complete tag management and browse controls; functional update-status buckets and Intel-only filtering, which depend on real vendor checking; snoozed items; native Companion-backed operations; and whole-library Tools. Per-product actions already visible in the menu must continue to distinguish implemented local actions from unavailable native/backend actions.

Foundation remains **NOT MET** and Stage 6 remains gated pending all approved exit evidence and fresh independent end-to-end acceptance. The development Worker passkey RP fix is still a surgical patch, not a reproducible branch-source deployment. Use synthetic non-production data for further gated workflow work. No production deployment or separately gated external action occurred.
