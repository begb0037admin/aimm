# BRIEF: sidebar hover follows section colour (build 2026-11-21.5)

Repo ~/github/aimm, branch sidebar-v3. Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Do exactly what docs/handover-assets/jules-sidebar-v3/SPEC-section-colours.md says (sections 1, 2, 4). Kevin confirmed: Categories hover uses the heading colour #68d3e6 (no change to headings).

Steps:
1. In standalone/assets/index.html, apply the CSS draft in section 4 after the existing sidebar rules, and delete the old purple `--pm-grad` hover rule it replaces (around line 4805).
2. Bump AIMM_BUILD to 2026-11-21.5.
3. Rest state must stay identical. No tooltips, no coloured rest icons, no markup changes, no emoji.
4. Run all tests (they were 155/155 before); fix anything you broke.
5. Do NOT commit, push or deploy. Leave changes in the working tree and report the diff summary and test result.
