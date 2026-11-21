# BRIEF - Library sidebar v3 (build)

Approved by Kevin, 21 Nov 2026 (design by Jules). Build exactly this. Do not commit, push, deploy or run servers; the coordinator does that.

Read first: docs/CLAUDE.md, docs/UI_DESIGN_STANDARD.md, then **docs/handover-assets/jules-sidebar-v3/SPEC.md** (the design and the full list of what to delete/keep, with line numbers) and **docs/handover-assets/jules-sidebar-v3/override.css** (the target CSS).

File to change: standalone/assets/index.html (single file). Also update tests that assert the OLD design.

## What to build
1. Header: only the sidebar collapse icon button, right-aligned. No BROWSE/title word. Inline SVG icon (SPEC "Header collapse button").
2. Five section heading bars: label only, sentence case in the HTML (Status, Tools, Library, Video chain picks, Categories), no count element, no subheadings, plus/minus fold icon via inline SVG (SPEC "Section fold icons"). Keep the selected-here dot.
3. Remove the "Counts are products" note, the Tools note (and its JS rewrite), the "Plugin Compatibility" row, the "Not licensed (UAD)" row (button markup only; keep UAD licence logic and the lines the tests check, per SPEC).
4. Rename "Stock Plugins (Logic Pro 13)" to "Logic Pro stock" in markup and any JS/Hope text that matches it. Add icons to the three Video chain picks rows.
5. Selected row paints its own teal background; delete the JS pill overlay and every call (SPEC "Selected row").
6. Move the Scan folders text to Settings, inside the Plugin companion card under Connect, keeping id invSidebarFolderMeta; refresh it from the Settings open path (SPEC "Scan folders moves to Settings"). Add-folder and Scan buttons stay on the Plugins tab.
7. Responsive: width clamp(236px, 236px x text-scale, 34vw), rows wrap, no ellipsis/nowrap/fixed heights. Use non-breaking spaces after "&" and U+2011 in "Multi-FX" in category labels.
8. CSS: consolidate the stacked patch rules into one coherent block per SPEC "Consolidation for Codex". Do not leave another layer on top. No boxes/tiles/pills behind counts, arrows, icons, markers. No emoji.

## Keep unchanged
Per-row counts and their status colours; the UAD licence logic and test-asserted lines; Hope tools (check inventory_navigate and any tool that names a removed row or the old label); the Plugins tab behaviour.

## Rules
- Bump AIMM_BUILD (line ~5734, currently 2026-11-20.27) to 2026-11-21.1. Tests asserting the build string (hope-installed-rule, vocal-favs, sidebar-option-c) must be updated to it.
- Update tests that assert the old design (e.g. tests/sidebar-option-c.test.mjs: headings count, pill, subgroups) to the new design; do not weaken unrelated assertions. Run ALL tests/*.test.mjs (node) and make them pass.
- Keep DASHBOARD.html and docs/STATUS.md in step (short entry).
- Report: files changed, tests run with results, anything you could not do or chose differently, and anything in the SPEC that was ambiguous.
