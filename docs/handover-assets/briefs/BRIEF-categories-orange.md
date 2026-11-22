# BRIEF: Plugins tab Categories section is orange (build 2026-11-21.8)

Repo ~/github/aimm, branch categories-orange (from main 2026-11-21.7). Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Kevin's instruction: in the Library/Plugins sidebar, the Categories section colour changes from light blue #68d3e6 to orange #f97316 (already used in the app as the Mix Check accent; black ink on it is 6.94:1).

Steps:
1. In standalone/assets/index.html change the Categories `--section-colour` (the one set to #68d3e6, around line 4791 on main; the Categories heading bar, card border/glow and row hover all read it) to #f97316. Change nothing else: other sections, the teal selected row, rest states stay as they are.
2. If the heading glow/border uses a hard-coded rgba of the old blue for Categories, change that to the matching orange too.
3. Bump AIMM_BUILD to 2026-11-21.8 and update any test asserting the build stamp or the Categories colour.
4. Run all tests. Do NOT commit, push or deploy. Report a short diff summary and the test result.
