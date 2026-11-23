# BRIEF: build Jules's Library hover-pill spec (build 2026-11-23.3)

Repo ~/github/aimm, branch library-bars (keep the existing uncommitted flush-bar and pill work; do not revert files). Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Do exactly what docs/handover-assets/jules-library-hover-pills/SPEC.md says: delete the old rules listed in its section 7, then add fix.css. Table row links (Edit, View, Open video, Remove) DO get the pill, as the spec has them (Kevin approved).

Hard rules: keep the Library section order exactly as is (Add to Hope's library blue, Hope's review purple, Videos pink, Notes orange, Saved chats yellow). Do not change markup or colours beyond the spec. Hover colour = section colour; outside a section teal #2dd4bf. Rest state stays plain text. Room to breathe: the spec's gaps must hold at 1900, 1300 and 560 wide; no pill may touch a neighbour, the card edge or a hairline.

Bump AIMM_BUILD to 2026-11-23.3 and the 3 stamp tests, run node --test tests/*.test.mjs. Do NOT commit, push or deploy. Report diff summary and test result.
