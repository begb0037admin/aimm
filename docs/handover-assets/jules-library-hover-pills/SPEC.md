# Library hover pills and action spacing - design spec (Jules, 23 Nov 2026, design only)

Preview: `preview.html` (same folder; `?v=before|after`, `?state=rest|hover|focus`; it prints a measured audit at the bottom). CSS draft: `fix.css`. Screenshots: `shots/`. Nothing is built; `index.html` untouched.
Checked: live build 2026-11-23.2 (branch library-bars, headless Chrome 1900) and the preview at 1900, 1300 and 560, all viewed as screenshots.

## 1. Why it looked cramped (measured, preview `?v=before`)
Codex's pill is 36 high with 14 padding and a -14 side margin, so the visible box grows 14 past the text each side. Footer gap 28 and Browse gap 20 minus the bleed leaves boxes overlapping by up to 8px; the last pill sits 2px beyond the card edge (right inset is 12, bleed 14). Rows had no pill at all, so the app had two hover languages.

## 2. The rule
The button box IS the pill at rest (transparent). Hover only paints it: same box, so nothing shifts or resizes. Then every distance is a property of the box, and can be checked.
| Item | Value |
|---|---|
| Pill | height 32, side padding 12, radius 999, text 15/600, solid fill, black ink (same look as the teal Auto pill) |
| Hover fill | inside a section: that section's colour (Videos #f472b6, Notes #f97316, Saved chats #e8b45a, Add #36a8ed, Review #b970ff); outside any section: teal #2dd4bf. Black ink on all (contrast 6.8 to 11) |
| Focus (keyboard only) | same fill plus 2px black inset ring |
| Disabled | no pill, dim text |
| Motion | 160ms fill and ink; none under reduced motion |
| Gap between adjacent pill boxes | 12 (footers, Browse ends, results head); 8 in stacked rows. Text-to-text 36 and 32 |
| Inset from card | pill box 16 from the right card edge, 14 above and below inside a footer (footer 60 high with hairline above, pill 14 from hairline and 14 from card bottom) |
| Solid buttons (Add, Find, Add all, Keep, Write a note) | unchanged: 44 high, radius 10, hover white; they stay 12 from the edge so they line up with the bar's fold glyph |

## 3. Every action area
| Area | Layout | Hover |
|---|---|---|
| Browse: Expand all, Collapse all | right end of the Browse row, boxes 12 apart, box right edge = card right edge. At 1400 and below the row becomes: Browse left, ends right, then search and channel; at 700 and below search and channel each take a full line | teal |
| Show N more | centred in its own row (60 high, hairline above, pill 14 from hairline and below). Centred so the pill has room on both sides; no left edge to crowd | group's card colour |
| Section footers: Export notes; Export all, Clear all | right aligned, rules in section 2; wraps with 8 row gap if ever narrow | Notes orange, Saved chats yellow |
| Add card, results head: Add all (solid), Clear | gap 12, Clear box 16 from right edge; under 640 card width Add all left, Clear right edge | Clear: blue |
| Add card rows: Paste, Find, Write a note, Import a file | unchanged solid buttons, gap 12 | white (unchanged) |
| Result rows: Open video, Dismiss | table cells | blue |
| Hope's review rows: Edit, Delete, Cancel | table cells; Keep and Save stay solid buttons | purple |
| Kept sentence, Undo | pill starts 4 after the full stop (never over it); vertical margins -5 so the line does not grow | purple |
| Row actions (Edit, View/Hide, Open video, Summary/Raw, Re-summarise, Delete, Apply to MixBus, Favourite, Copy) | Table (card 1300+): box bleeds 12 into empty column space, so the text still starts under its header; every column gap is 24+, measured box gaps 28+. Stacked (card under 1300, includes the 1300 and 560 windows): actions row box-aligned, boxes 8 apart, action row 12 below the meta line | section colour |
| Hope reads tick, group rows, bars, favourite pills (white fill, unchanged) | no change | as before |
Decision for Kevin: row actions get the pill too (one rule, one hover language). If he prefers them text-only white as in the earlier spec, drop the two `.ent .acts` rules in fix.css; footers and Browse stay as specified.
Stacked note: because the box is the button, the first action's text sits 12 in from the title edge (box edge is on the title edge). Bleeding it left would put the box 2px from the card border, which is the same cramped fault.

## 4. Rest-state alignment (no shift on hover)
Pill box, padding and radius exist at rest, only the background is transparent, so hover repaints and nothing moves. In table cells the negative margin equals the padding, so rest text starts exactly where it did before (under its header).

## 5. Flush bars and folded state (checked on the live build, 1900)
Bars sit edge to edge inside the 1px border (Codex's `.card{padding:0}` fixes it), radius clipped by the card; folded Videos is the bar alone, also flush. No change needed.

## 6. Measured (preview audit, hover state, 44 pills)
After: smallest gap between neighbouring boxes 12 at 1900, 8 at 1300 and 560; smallest box to card edge 14, to hairline 14. Before: gap -8 (overlap), edge -2.

## 7. Codex: what to do
Delete these superseded rules, then add `fix.css`: `#library .tx{...}`, `.tx:hover`, `.tx:focus-visible`, the three `:is(.browse-head,.foot,.rhead,.none) .tx` lines and their reduced-motion line, `.more-row`, `.more`, `.more:is(...)` and its reduced-motion line, `.foot`, `.browse-head .ends`. Keep `.tx.hi` and `.tx.dim`. Markup unchanged. Please run the preview's audit idea against the built page (same four measurements) before asking Kevin to look.
Standards: no arrows, emoji, glows or boxes behind markers; room to breathe holds at 1900, 1300, 560.
