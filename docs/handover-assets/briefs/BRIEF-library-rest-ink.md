# BRIEF: Library text buttons invisible at rest (build 2026-11-23.4)

Repo ~/github/aimm, branch library-bars. Keep all existing work; do not revert files.

Bug (Kevin's screenshot): Export all and Clear all show BLACK text on the dark card at rest. Cause: the old `#library .tx{color:var(--ink)}` rest rule was deleted and Jules's fix.css never set a rest colour, so buttons fall back to the browser default black.

Fix: give every Library text button (`.tx`, and anything else the fix.css pill rule covers, incl. Expand all, Collapse all, Export notes, Export all, Clear all, Edit/View/Open video/Remove row links, Undo) the rest colour `var(--ink)` exactly as before; hover/focus stays black ink on the pill. Disabled keeps `var(--dim)`. Also update docs/handover-assets/jules-library-hover-pills/fix.css the same way.

Verify programmatically: using the page's real computed styles (jsdom or a headless check), list every button/link in #library at rest and assert its computed colour is not black and has at least 4.5:1 contrast against its background. Report that list.

Bump AIMM_BUILD to 2026-11-23.4 and the 3 stamp tests, run node --test tests/*.test.mjs. Do NOT commit, push or deploy. Report diff summary and test result.
