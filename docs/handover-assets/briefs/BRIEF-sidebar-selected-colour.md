# BRIEF: selected sidebar row uses the section colour (build 2026-11-21.6)

Repo ~/github/aimm, branch sidebar-v3. Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Kevin's instruction: the selected row today is solid teal (#2dd4bf) with a black icon and black text, in both the expanded sidebar and the collapsed rail. Keep exactly that look (solid fill, black icon, black label, black count) but the fill must be the row's section colour instead of teal: `var(--section-colour,#36a8ed)`. Tools yellow, Library purple, Video chain picks pink, Categories #68d3e6, Status blue.

Steps:
1. In standalone/assets/index.html find the existing .active rules for `#library #invSidebar .inv-side-button` (teal, around lines 4807-4808) and change only the background colour to the section colour. Keep black ink, shape, size and layout.
2. Hover tint on non-selected rows (build .5) stays as is. A selected row stays solid when hovered.
3. Check black ink contrast on purple #b970ff is fine; if any section fails 4.5:1 for black text, tell me instead of changing it.
4. Bump AIMM_BUILD to 2026-11-21.6 and update any test that asserts the build stamp or the teal selected colour.
5. Run all tests. Do NOT commit, push or deploy. Report a short diff summary and the test result.
