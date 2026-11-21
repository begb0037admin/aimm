# Brief: align + buttons on empty MixBus rows (Kevin approved preview, Jules APPROVED)
Repo /Users/admin/github/aimm, branch plus-align (already created from origin/main). File: standalone/assets/index.html ONLY (do not touch root index.html).
Change (CSS only): after the existing `#chain .bus-col.is-empty .empty-add{...}` rule (~line 407) add exactly:
#chain .bus-col.is-empty h4{display:grid;grid-template-columns:40px 1fr;column-gap:14px}
#chain .bus-col.is-empty .empty-add{order:-1}
Result: on EMPTY bus rows the round + button sits BEFORE the bus name and the + buttons form one straight column. Rows with plugins unchanged. No JS, markup, layout or other CSS changes.
Also: bump AIMM_BUILD to 2026-11-17.1; add a STATUS.md entry (docs/STATUS.md) in the same commit, saying "local branch plus-align, not deployed".
Check: render MixBus with all buses empty and with one bus holding plugins, at 1500px and 560px widths; save screenshots in /Users/admin/aimm-previews/plus-align-*.png. Reference preview: /Users/admin/aimm-previews/plus-mock2.png.
Do NOT merge, push to main, or deploy. Commit on branch plus-align only. Report: diff stat, build number, screenshot paths.
