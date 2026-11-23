# BRIEF: Library section bars flush with the card edge, like MixBus

Repo ~/github/aimm, branch library-bars. Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Problem (Kevin's screenshots): in Library, each coloured title bar sits INSIDE the 1px outline with a gap all round (bar inset from the border). In MixBus the coloured bar is flush: it fills the top of the card edge to edge, its top corners follow the card's rounded corners, and the 1px outline runs round the whole card with no gap above, left or right of the bar.

Do:
1. Study how the MixBus bus cards (Master Bus, Vocal Bus, 808 / Bass, Drum Bus) build the card and bar in standalone/assets/index.html. Make every Library section (Add to Hope's library, Hope's review, Videos, Notes, Saved chats) use the same construction: card border 1px section colour, radius 12, overflow hidden, bar 48px flush to the card edge, fold glyph at right, same bar text size and weight, same left inset for the title.
2. Body content below the bar keeps its own inset so text and table do not touch the edges (room to breathe, full width).
3. Folded state: the card is just the bar, still flush, outline all round.
4. No highlights, no boxes, no arrows. Colours unchanged. Check at 1900, 1300 and 560 wide.
5. Bump AIMM_BUILD to 2026-11-23.1 and the 3 stamp tests (tests/hope-installed-rule.test.mjs, sidebar-option-c.test.mjs, vocal-favs.test.mjs). Run node --test tests/*.test.mjs, fix breakage.
6. Do NOT commit, push or deploy. Report the diff summary and test result.
