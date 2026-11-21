# Brief: selected sidebar row count = plain black number (#0b0d10, palette black, same as the row label; Kevin changed his mind from white to black) (Kevin APPROVED preview; design by Jules)
Repo /Users/admin/github/aimm, branch plugins-status (currently at commit 25c8d9b1, build 2026-11-17.3, not deployed). Stay on this branch. Edit ONLY standalone/assets/index.html and docs/STATUS.md.
Add this CSS (colours only) right after the existing Plugins status/format colours block (the block added in 25c8d9b1), exactly:
#library .inv-side-button.active .inv-side-count,
#library .inv-side-button.active[data-inv-scope] .inv-side-count,
#library .inv-side-button.active[data-inv-open-all-plugins] .inv-side-count{background:transparent!important;box-shadow:none!important;border-color:transparent!important;color:#0b0d10!important}
Result: on the selected (teal) sidebar row the count has no block and is a plain black number (#0b0d10, palette black, same as the row label; Kevin changed his mind from white to black); the badge box keeps its size so rows do not shift. Unselected rows keep their existing count style. Reference: /Users/admin/aimm-previews/plugins-selcount.png.
Bump AIMM_BUILD to 2026-11-17.4 and update the docs/STATUS.md entry for this branch (still "local branch plugins-status, not deployed"; mention the black selected-row count). One new commit on plugins-status.
Check: render the Plugins tab sidebar with All plugins selected, and one Status and one Category row selected, at 2x crop; save to /Users/admin/aimm-previews/plugins-status-build-selcount.png (the approved preview plugins-selcount.png shows white; the final colour is BLACK). Confirm by diff only the CSS, build number and STATUS changed.
Do NOT merge, push to main or deploy. Report: diff stat, build number, screenshot path.
