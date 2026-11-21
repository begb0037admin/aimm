# BRIEF: hover is solid in the section colour; selected stays teal (build 2026-11-21.7)

Repo ~/github/aimm, branch sidebar-v3. Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Kevin's instruction (final): ONLY the hover changes. A selected row MUST stay solid teal (#2dd4bf) with black ink, exactly as it was in build 2026-11-21.4.

Steps:
1. Undo the build .6 selected-row change: the `.active` and `.active:hover` rules (around lines 4806-4807 of standalone/assets/index.html) must use the original teal background again (see `git show HEAD:standalone/assets/index.html` for the original). Selected rows stay teal in every section.
2. Hover and keyboard focus-visible (non-selected, non-disabled rows), in BOTH the expanded sidebar and the collapsed rail: solid fill `var(--section-colour,#36a8ed)`, black icon, black label, black count (use var(--pv-black) like the .active rules). Replaces the soft 18% tint and coloured-icon-on-dark hover from build .5. Tools yellow, Library purple, Video chain picks pink, Categories #68d3e6, Status blue.
3. Rest state unchanged. Disabled rows get no hover. No markup changes, no boxes/rings added, no emoji.
4. Bump AIMM_BUILD to 2026-11-21.7; update any test asserting the build stamp, the teal selected colour, or the hover rule.
5. Run all tests. Do NOT commit, push or deploy. Report a short diff summary and the test result.
