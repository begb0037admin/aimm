# Task: Plugins sidebar - hovered row count becomes plain white (colours only)
Repo /Users/admin/github/aimm, branch plugins-hovercount (already created from main, build 2026-11-17.4).
File: standalone/assets/index.html only, plus docs/STATUS.md.

1. Append this CSS rule at the end of the existing "Plugins tab colours" CSS block (after the selected-count rule near line 4766):
#library .inv-side-button:hover:not(.active):not(:disabled) .inv-side-count{color:#fff!important;background:transparent!important;box-shadow:none!important;border-color:transparent!important}
2. Bump AIMM_BUILD to '2026-11-17.5'.
3. Add a docs/STATUS.md entry: build 2026-11-17.5, hovered (purple) Plugins sidebar rows show a plain white count with no dark block; local branch plugins-hovercount, not deployed; rollback 2026-11-17.4.
4. One commit on plugins-hovercount. Do NOT merge, push or deploy. Change nothing else.
