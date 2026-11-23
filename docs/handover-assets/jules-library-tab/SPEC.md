# Library tab (Insight + Snapshots merged) - design spec (Jules, 22 Nov 2026, design only)

Brief: `docs/handover-assets/briefs/BRIEF-library-tab-merge.md`. Preview: `preview.html` (same folder; `?only=overview|empty|add|approve|review|browse|states`, add `&scale=1.4` for text size). Exact CSS: `library.css` (draft, scoped to `#library`). Nothing is built. Codex builds after Kevin approves the preview. Superseded designs in `jules-insight-style/` were used as lessons only.
Checked: the real live Insight and Snapshots tabs in headless Chrome at 1900 (build 2026-11-22.3), and this preview, viewed as screenshots at 1900, 1300 and 560 wide (overview, empty, add states, approval list, To review incl. edit, browse, states sheet).

## 1. Structure and why (one paragraph)
One tab, "Library", replaces Insight and Snapshots. The page does Kevin's three jobs in his order, top to bottom: **add** (one card), **review what Hope proposed** (one card), then **browse** what the library holds (three cards: Videos, Notes, Saved chats). Each of the five is one outlined card in its own palette colour, built exactly like a MixBus bus and a Plugins sidebar card, so purple never dominates and the page reads as a stack of clearly different jobs. A tip kept from To review becomes a Note (flagged "Tip from Hope"), so there are only three kinds of thing in the library, not four. Snapshot pills live with Saved chats because they are favourites of saved chats. Hope's memory facts are gone from this page. Within cards, every entry is one row of a strict column table (title, then fixed-width columns for source, date and each action, with a quiet header row) so results, tips, videos, notes and chats look like one system; space and a hairline divide entries, never boxes.

## 2. Page, top to bottom (1900: main column about 1440 wide, Hope rail unchanged)
| # | Element | Colour | Notes |
|---|---|---|---|
| 1 | Head: "Library" 30px/500 left, readout right | neutral | readout "Hope reads 4 of 14 notes" 14px dim; over budget it turns orange and says "Hope reads 4 of 14 notes, budget full". The only count shown; no per-item tokens/bytes anywhere |
| 2 | Card "Add to Hope's library" | Tools yellow #e8b45a | three rows: Paste a link, Find videos, Add a note; approval list opens inside it under Find videos |
| 3 | Card "To review" + count | Status blue #36a8ed | tips Hope offered to save |
| 4 | Plain heading "Browse" + one search field + Expand all / Collapse all | neutral | search filters Videos, Notes and Saved chats together; 40px above |
| 5 | Card "Videos" + count | Video pink #f472b6 | grouped by the six categories |
| 6 | Card "Notes" + count | Categories orange #f97316 | grouped by the six categories; footer "Export notes" |
| 7 | Card "Saved chats" + count | Library purple #b970ff | groups Favourites (pills) and Sessions; footer "Export all", "Clear all" |
Colours: yellow, blue, pink, orange, purple, each once, no neighbours alike. Black ink on every bar (contrast 5.3 to 10.3 as in the MixBus spec). Teal appears only for the selected tab. Categories are the six (Mixing techniques, Producer interviews / chains, Reference tracks, Mastering, Vocal techniques, Workflow; fallback Mixing techniques). Gap between cards 12; between the do group and Browse 40. Empty page: same cards; To review, Videos, Notes, Saved chats show a count of 0 and one dim line ("Nothing to review.", "No videos yet.", "No notes yet.", "No saved chats yet."); Add stays open.

## 3. Card and bar (identical to MixBus / Plugins)
1px section colour border, radius 12, fill #1a1d21, overflow hidden. Bar: full-bleed section colour, min 48, padding 8 12 8 14, 16px/700 black; count 15/600 black at 80% right beside the name; fold glyph at the right edge, plain minus (open) or plus (closed), 22px, black, no box (`aria-expanded`). Whole bar toggles. No hover change; keyboard focus 2px white inset ring. Closed = bar only.
Groups inside Videos, Notes and Saved chats are a 56px hairline row: name 16/700 white, count 15/600 dim beside it, plus/minus at the right in the card colour. They are not cards, so there is never a border inside a border. Entries inside a group follow directly (no hairline between the group row and its first entry).

## 4. Add card
Three rows on one grid: label 200 | field (takes all free width) | button. Rows divided by the hairline, 22px padding above and below.
- **Paste a link**: field "YouTube link", button Add (solid yellow). States: Adding = button "Adding" disabled, a one-line message under the field "Reading the transcript and writing the summary." and a 2px sweep line (neutral). Added = "Added. Summary saved under {category}." (Added in white 600). Failed = orange line, "Could not add. {plain reason}." Field and button return to rest.
- **Find videos**: field `e.g. 808s in hip hop`, button Find. While searching: "Searching YouTube." plus the sweep line. Results open in the approval list below (section 5). A Hope-started search fills this field with Hope's query and lands in the same list, with "Started by Hope" beside the list title.
- **Add a note**: neutral buttons "Write a note" and "Import a file" (dropping a file anywhere on the tab still works). Opens the existing note editor.
Narrow (card under 640): label on its own line, field + button below, status lines below that.

## 5. Approval list (inside the Add card, under Find videos, hairline above)
- List head: "Results for "808s in hip hop"" 16/700 white; right zone: **Add all** (solid yellow) and plain text "Clear". Under it, 14px dim: "5 already in the library were left out." (quiet; shown only when the count is above 0; videos already in the repo library or added from the dashboard, matched by video id, never listed).
- Entry (table row, columns in section 9): Title, then directly under it the one-line reason across the full row; Channel; Length and views ("11:42 · 312K views"); **Open video** (plain text, bright, opens YouTube in a new tab); **Dismiss** (dim, removes from the list); **Add** (neutral button 44px, white on hover).
- Per-entry states: Adding = Add becomes disabled "Adding", status line plus sweep line under the reason. Added = actions become Open video and "View in Videos", status "Added. Summary saved under {category}." Failed = orange status "Could not add. {reason}", button becomes "Try again".
- **Add all**: becomes disabled "Adding all"; a 2px meter under the list head shows progress across the list; each entry shows its own state as it runs. Failed ones stay with Try again; the rest finish.
- Zero results: "Nothing new found for "{query}"." If everything was already in the library: "Everything found is already in the library." Search failure: orange "Search failed. Try again." with the Find button back.
- Add / Add all only ingest on click; nothing is ingested by search alone.

## 6. To review (blue)
Each tip is a table row (no tick; columns in section 9): title = Hope's one-line label, the tip text directly under it; Files under {category} (Hope's suggestion, fallback Mixing techniques); Received date and time; Edit, Delete (dim), **Keep** (solid blue button, last column). Keep files it as a Note and the row becomes a one-line "Kept. Filed in Notes under {category}." with a plain **Undo**. Edit swaps the row to fields in place: title field, tip text area (full row width), category select (neutral field), with Cancel in the Delete column and Save (solid blue) in the Keep column; Delete asks to confirm. Empty: "Nothing to review." The count in the bar is the number waiting, so it is the only badge Hope's "record that tip" needs.

## 7. Browse
Column templates are in section 9. Contents per card:
- **Videos**: Channel, Added date (or "Library" for repo videos), Edit, View/Hide (the summary note under the title), Open video. Six columns in all: Title, Channel, Added, Edit, Show, Link. No Re-summarise, no Remove column and no Hope reads tick (Kevin removed them; Hope reads everything). A dashboard-added video can still be deleted from inside its Edit view. "Show 39 more" is a plain text row at the end of a group (12 at a time).
- **Notes**: tags as plain dim text directly under the title; Source ("Written by you", "Tip from Hope", "Imported file"), Added, Edit, View/Hide, Summary/Raw, Remove. No Re-summarise and no Hope reads tick.
- **Saved chats**: group **Favourites** = pill grid (section 8); group **Sessions** = table rows (own header inside the group): Contents, Saved, Edit, View/Hide, Apply to MixBus (only with a chain), Favourite/Unfavourite, Copy, Delete. Open shows the summary then the turns, "You" and "Hope" bold, 12px apart, no hairlines inside a row. No tick column.
- No Hope reads tick anywhere: Hope reads everything.
- Search: one field full width of the line after "Browse"; groups with matches open, groups with none hide, cards with none show "No matches."

## 8. Snapshot pills (kept behaviour, new look)
Filled favourites only; the 24 empty "+ snapshot a chat" slots are removed (maximum stays 24; at the limit the Favourite action is disabled and its tooltip says "Favourites are full"). Grid `repeat(auto-fill,minmax(260px,1fr))`, gap 12. Pill = #2a2e35, radius 10, min 48, label 15/600 white (wraps, balanced, never cut off) and a plain purple star at the right (the unfavourite control, 44px target, no box, no glow). Click on the label = recall, unchanged: mid-call `sendContextualUpdate` to Hope (toast "Sent to Hope: ..."); idle it drops "Recalling: ..." into the compose box, switching to the compose box as today. Hover or keyboard focus on the pill: solid white fill, black label and star, plus a 2px black inset ring for keyboard only. Edit, Copy, Delete and Apply to MixBus moved from the pill hover icons to the session entry (same handlers). Where the starred-item standard still says "soft glow", this spec drops the glow to follow the no-highlights rule; update the standard.

## 9. Entry = one table row (Kevin, 22 Nov: strict columns, every row lines up)
Every entry in a card uses one fixed column template (`--grid` on the card), and a quiet header row (13px/600 dim plain text, no fill, no rule) names the columns. Title takes the remaining width and wraps cleanly (never cut off). Every other column is its own fixed-width cell, left-aligned under its header, 24px gaps; a missing action (for example Delete on a repo video, Apply to MixBus on a chat-only session) leaves its column empty so nothing shifts. Hairline `#2a2e35` full width between rows, 22px above and below it. No boxes, no fills, no hover on the row. The summary or open text sits directly under its own title and runs the full row width (grid-column 1 to the last).
| Card | Columns (widths at 100%) |
|---|---|
| Videos | Title (1fr) / Channel 180 / Added 110 / Edit 56 / Show 64 (View or Hide) / Link 100 (Open video). Six columns. |
| Notes | Title (tags directly under it) / Source 180 / Added 110 / Edit 56 / Show 64 / Mode 100 (Summary or Raw) / Remove 72 |
| Saved chats, Sessions | Title / Contents 170 (Chat only, or Chat and MixBus chain) / Saved 120 / Edit 56 / Show 64 / MixBus chain 130 (Apply to MixBus) / Favourite 110 / Copy 56 / Remove 72 |
| To review | Title / Files under 190 / Received 150 / Edit 56 / Delete 72 / Keep 112 (button) |
| Approval list | Title / Channel 190 / Length and views 170 / Link 100 / Dismiss 80 / Add 112 (button) |
Header names: where a column holds an action, the header is its plain noun (Edit, Show, Link, Summary, Remove); the cell holds the action word. The date cell shows only the date ("21 Nov"; repo videos show "Library"), because the header says Added.
**Summary/Raw: it stays its own column, in Notes only, and does not merge with Re-summarise.** They do different things: Summary/Raw only switches which stored text the open note shows (harmless, instant); Re-summarise regenerates the summary (slow, overwrites). Putting both in one control would make a harmless view toggle sit beside a destructive action. Videos have no raw view in the list, so the same slot there is Open video; Notes have no video, so the slot is Summary/Raw. Both cards keep the same number of columns, so the two tables read as one system.
Type: title 16/600 #e5e7ea; sub line (tags) 14 dim 4px below; cells 14/1.5 #c4cad3 (dates dim); actions 15/600 in three tiers (bright 700: Show, Link, Mode, Apply to MixBus; normal: Edit, Re-summarise, Favourite, Copy; dim: Delete, Dismiss); summary 15/1.65, 10px under the title row.
Widths: the table layout needs a card at least 1300 wide (about 1900 viewport with the Hope rail: card 1440, title about 450 on Videos). Below 1300 (card width, via container query, so it follows the app column not the window) the header row hides and each row stacks: title (tick at the right), channel/source and date on one line under it, the summary, then the actions in their own left-aligned row 16px below; empty cells disappear. 1300 viewport (card about 870) and 560 both use this. Verified at 1900, 1300, 560.

## 10. States
| State | Look |
|---|---|
| Rest | transparent, ink #c4cad3, titles #e5e7ea |
| Hover, content row | nothing. No fill, underline, glow or marker |
| Hover, text action / Open video / Expand all | text turns white, nothing else |
| Hover, button, pill | solid white fill, black ink (Plugins/MixBus) |
| Hover, bar / group row | no change |
| Keyboard focus (`:focus-visible` only) | button and pill: white fill + 2px black inset ring; text action, tick, group row, field: 2px white inset ring; bar: 2px white outline inset 3px |
| Disabled | #2a2e35 fill, #9aa0a6 ink |
| Selected | none on this page (teal is only the active tab) |
No hover fill on content rows, no tinted backgrounds, no underlines, no pills behind counts, ticks or stars, no emoji, no token or byte counts per item. Sizes use `--inv-text-scale` (`?scale=1.4` in the preview).

## 11. Spacing and type (px at 100%)
Head 30/500, gap below 28. Card bar 48. Cards 12 apart; 40 before Browse; Browse heading 22/700 with search on the same line and 16 below. Add rows 22 / 22; label 200 wide, field-to-button gap 24; fields and buttons 44 high, radius 10; field fill #2a2e35; pills 48. Row and group metrics in sections 9 and 3. Status lines 14/1.5, 12 below the text above; sweep line 2 high (static in reduced-motion).

## 12. Hope integration (must keep working; names are for Codex and Markey to confirm)
- Tab: one tab id `library`; `switch_tab` accepts `library`, and `knowledge` and `snapshots` stay as aliases that open Library so old calls and saved prompts do not break. The tool description's tab list changes to "library = Library (videos, notes, tips, saved chats)". Tool description text sits in Hope's voice territory: route that edit through Markey.
- Tips: `add_knowledge_note` with a to-review state creates the row in To review and bumps its count; after the user's yes, Hope should say it is in To review. Keep/Edit/Delete are UI only.
- Search: a Hope voice search calls the same function as Find, fills the Find field with Hope's query and fills the same approval list ("Started by Hope"). Hope never ingests; Kevin presses Add or Add all.
- Existing `snapshots_list/read/apply/add_note` read the same data; Favourites pills call the same `recallFavourite`. `search_yt_knowledge`, `read_yt_knowledge`, list/export knowledge notes unchanged.
- Data the list needs per result (Worker side, Codex's call): video id, title, channel, duration, views, url, one-line reason, plus the already-in-library exclusion by video id over repo library and `/kb/user-videos`, and the number excluded.

## 13. Not shown / open points
- Real data volume (hundreds of videos): the 12-at-a-time "Show more" and group folds carry it; search is the fast path. Codex to confirm render cost.
- Dismiss only clears a result from the current list; it is not remembered.
- Delete confirmation, undo toast and Import flow reuse existing dialogs, restyle only (solid or plain-text buttons).
- The page head subtitle and all explanatory blurbs are removed by design; the "?" hints are not needed.
- Hope's memory facts have no section here (separate core/archive work).
- Preview data is invented; build-stamp and the Hope rail are placeholders.
