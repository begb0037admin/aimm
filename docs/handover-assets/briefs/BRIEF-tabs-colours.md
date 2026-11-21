# Task: Insight, Snapshots, Settings tabs - approved colours (CSS only)
Repo /Users/admin/github/aimm, branch tabs-colours (from main, build 2026-11-17.7). Edit only standalone/assets/index.html and docs/STATUS.md.
Kevin approved the previews of these three tabs (preview-insight/snapshots/settings .html/.png in /Users/admin/aimm-previews).
1. Add the contents of these three approved, already-scoped CSS files, in this order, as one new block placed directly after the existing Plugins tab colours / status and format colours CSS blocks (and the later Plugins rules), each under a comment line like /* Insight tab colours 2026-11-18 */ :
   /Users/admin/aimm-previews/insight-colours.css
   /Users/admin/aimm-previews/snapshots-colours.css
   /Users/admin/aimm-previews/settings-colours.css
   Copy them exactly. No JS, HTML, text, layout or other CSS changes. Do not touch the Hope chat panel.
2. Bump AIMM_BUILD to '2026-11-18.1'.
3. docs/STATUS.md entry at the top: build 2026-11-18.1, Insight, Snapshots and Settings tabs restyled to the approved palette (colours only, scoped to each tab, plus 9px radius on hover rows); local branch tabs-colours, not deployed; rollback 2026-11-17.7.
4. Check each file's CSS is scoped (every selector starts with that tab's container id or its dialog ids) and nothing changes Mix Check, MixBus, Plugins, Marketing or Community. Verify by a headless Chrome screenshot of the three tabs from your built file saved to /Users/admin/aimm-previews/shots/tabs-build-insight.png, tabs-build-snapshots.png, tabs-build-settings.png (window 1500x1800; click the tab with .tab[data-tab="knowledge"|"snapshots"|"settings"]).
5. One commit on tabs-colours. Do NOT merge, push or deploy.
