# BRIEF: Library text buttons get the pill hover (build 2026-11-23.2)

Repo ~/github/aimm, branch library-bars. FIRST do everything in docs/handover-assets/briefs/BRIEF-library-flush-bars.md (the flush-bar work was lost and must be redone), THEN this brief. Final build stamp is 2026-11-23.2. Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.

Kevin's screenshot: the "Auto" button shows the app's hover pill: solid fill, black ink, fully rounded pill (radius 999px), generous side padding. Find that exact hover treatment already used for buttons in the app and reuse it (same colour, ink, radius, padding, transition).

COLOUR (Kevin): the hover/focus fill is the colour of the SECTION the button sits in, not teal. Add to Hope's library = blue #36a8ed, Hope's review = purple #b970ff, Videos = pink #f472b6, Notes = orange #f97316 (Export notes hovers orange), Saved chats = yellow #e8b45a (Export all and Clear all hover yellow). Use each section's existing section-colour variable. The Browse-row buttons (Expand all, Collapse all) are not in a section: use solid teal #2dd4bf fill with black ink (anything outside a section is teal).

Make these Library text buttons behave the same on hover and keyboard focus: Expand all, Collapse all, Export notes, Export all, Clear all. Also any other plain text action button in #library with no hover (check Show more, and the Add / Find / Add all buttons) so every Library text button matches.

Rules: rest state stays identical (plain text, no box, no outline). Only on hover/focus the pill fill appears. Keep layout from shifting: use padding that is already present at rest (transparent background) so the text does not move on hover. No highlights, no arrows, no emoji. Table row action links (Edit, View, Open video, Remove) are NOT changed unless they already use the pill hover.

Then bump AIMM_BUILD to 2026-11-23.2 and the 3 stamp tests, run node --test tests/*.test.mjs. Do NOT commit, push or deploy. Report the diff summary and test result.

NOTE: some of this work may already be in the working tree from an interrupted run. Check what exists, keep it, and finish the rest. Do not revert files.
