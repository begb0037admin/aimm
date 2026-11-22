# BRIEF: Insight tab redesign (next build after 2026-11-21.9)

Repo ~/github/aimm, branch insight-style. Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Kevin approved Jules's design. Implement exactly docs/handover-assets/jules-insight-style/SPEC.md, matching docs/handover-assets/jules-insight-style/preview.html. Palette: no new colours.

Kevin also approved: change user-visible wording "Luna" to "Hope" in Insight tooltips and status text (e.g. "Summarising with Luna..."). Confirm no logic, test or stored-data key depends on the word before changing; copy only.

Rules:
1. Keep every existing class name, id and click handler the spec says must stay; behaviour must not change (add/edit/import/export, drag between categories, pin/edit/toggle/delete, byte meters, Hope tools list/add/export note).
2. No boxes behind counts/icons, no emoji icons, plus/minus fold icons.
3. Bump AIMM_BUILD to 2026-11-22.1 and update the 3 tests that assert the build stamp (tests/hope-installed-rule.test.mjs, sidebar-option-c.test.mjs, vocal-favs.test.mjs).
4. Run all tests (155 before); fix anything you break.
5. Do NOT commit, push or deploy. Leave changes in the working tree and report a diff summary and test result.
