# BRIEF — Hope reads the plug-in inventory (repo /Users/admin/github/aimm, page only: standalone/assets/index.html)

Context: Hope's tool `inventory_search` (case at ~line 17056) reads INV_SCAN_ROWS (companion rows included). Make it richer and non-disruptive. No Worker changes, no deploy, no ElevenLabs changes.

Do exactly this:
1. `inventory_search`: stop switching tabs and stop changing the visible UI state (no tab.click, no INV_* filter/search mutation, no invRenderInventory, no input value change). Compute results from INV_SCAN_ROWS only.
2. Each result also returns: `update_status` (one of updates_available, up_to_date, manual_check, vendor_app, unchecked — use the SAME logic the sidebar uses for those groups; find and reuse the existing status function, do not reimplement), `latest_version` if known, `unused` (true if the product is only present in the Unused list from the companion, if that data is in the page; otherwise omit the field), `duplicate` (true if in the companion duplicates data when already loaded in the page; otherwise omit). Never fetch from the companion inside the tool.
3. Add optional `status` filter param (same enum) to inventory_search.
4. New tool `inventory_summary` (read-only, no args): returns total products, counts by format, counts by update_status, top 15 vendors by product count, scannedAt/source (companion or browser scan), and `synthetic` flag. Add to TOOL_DEFS, AIMM_NEW_AGENT_TOOLS, handleToolCall, HOPE_INVENTORY_RULES and the RT_INSTRUCTIONS inventory paragraph (~18165) with one sentence each. No emoji.
5. When no scan rows: return the same "No scanned plug-in inventory" message.
6. Bump AIMM_BUILD to 2026-11-20.8. Add tests/hope-inventory.test.mjs (follow existing test style) covering: search does not touch DOM/tab, status filter, summary counts, empty case. Run ALL tests/*.test.mjs; all must pass.
7. Update docs/STATUS.md and DASHBOARD.html (build .8, NOT deployed). Commit on a new branch hope-inventory, do not push to main.
Report: files changed, test results, anything you could not do.
