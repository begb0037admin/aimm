# BRIEF: MixBus tab in the sidebar design language (build 2026-11-21.9)

Repo ~/github/aimm, branch mixbus-sidebar-style (from main 2026-11-21.8). Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Kevin approved Jules's preview. Build exactly what docs/handover-assets/jules-mixbus-sidebar-style/SPEC.md says. The approved preview (CSS-only overrides plus sample rows) is at /private/tmp/claude-501/-Users-admin/4cafa38d-7fc9-40a3-adf8-57b3affa9715/scratchpad/mixbus-preview.html : use it as the visual reference and port its CSS into standalone/assets/index.html as real styles.

Approved bar colours (primary palette): Master Bus orange #f97316, Vocal Bus yellow #e8b45a, 808 / Bass blue #36a8ed, Drum Bus pink #f472b6, FX Returns purple #b970ff. Hover solid in the bus colour with black ink; selected row stays teal #2dd4bf. Plain plus/minus on the right (no circles). Chain rows: icon, name, muted "Stage . Maker", plain x. "Add plugin" is a row at the end of each chain. Load preset solid purple, Auto-fill solid teal, black ink.

Decisions from Kevin's side: remove the "How to use" note entirely, including the Snapshot -> Luna chat tip (do not keep the Luna wording). Do NOT change the auto-select-first-plugin behaviour; leave it as it is today.

Rules: keep every existing behaviour (drag to reorder, add plugin, presets, auto-fill, Edit mode, Revert last fill, saved fold state). No boxes behind icons/counts, no emoji. Scale with the text-size setting; no orphan words. Only MixBus changes; the Plugins sidebar must be pixel-identical.

Steps:
1. Implement in standalone/assets/index.html (and any JS only if the markup needs it).
2. Bump AIMM_BUILD to 2026-11-21.9; update tests that assert the build stamp or removed How-to text.
3. Run all tests. Do NOT commit, push or deploy. Report a short diff summary and the test result.
