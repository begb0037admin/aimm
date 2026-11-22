# PRODUCT BRIEF: "Library" tab (Insight + Snapshots merged) - full redesign, not a patch

Owner: Kevin. Date: 22 Nov 2026. Designer: Jules (design only). Builder later: Codex through Jacob.
The tab is currently two tabs: Insight (id knowledge: Knowledge Base notes + Hope's memory facts) and Snapshots (id snapshots: favourite-chat "snapshot pills" + Session Snapshots list). Kevin asked to stop patching, rethink and redesign. Design from first principles against this brief.

## What the page is for (Kevin's words, in his order)
1. **Add to Hope's library, from the dashboard, no terminal.** (a) Paste a YouTube share link: already built (build 2026-11-22.3: Worker /kb/add-youtube via Apify -> transcript chunked into Hope's searchable library + a summary note). (b) **Find videos:** Kevin types a request ("find videos on this plugin", "this part of Logic", "808s in hip hop"); the app searches YouTube and shows a LIST for his approval: for each video the title, channel, length, views, a one-line reason it is relevant, and a LINK to open the video for review. He approves each (or all); only then are they ingested. Results NEVER include videos already in the library (match by video id against the repo library AND dashboard-added videos); a quiet line may say how many were left out. Proven 22 Nov: Apify actor streamers/youtube-scraper returns title, channelName, duration, viewCount, url for a search query.
2. **Keep what is useful from conversations with Hope.** Hope says "That's a great tip, want me to record that in the Library so you can review it later?"; on yes it is saved as a tip in a TO REVIEW list. Kevin later reviews: keep (file it), edit, or delete.
3. **Review and browse** what is in the library: videos, notes, tips, saved chats.

Snapshots merge in: saved chats with Hope (Session Snapshots) and the favourite "snapshot pills" (click recalls a chat; mid-call it is sent to Hope as context, idle it drops into the compose box) must keep working; Jules decides where they live. Hope's memory FACTS are NOT shown in this page (separate core/archive memory work; leave no section for them).

## Hope integration (must keep working)
Hope tools today: list/add/export knowledge notes, search_yt_knowledge, read_yt_knowledge, snapshots_list/read/apply/add_note, switch_tab (tab names are in the tool description: knowledge=Insight, snapshots=Snapshots; these will change to the single Library tab). Hope can ask to record a tip (add_knowledge_note, with a to-review state) and later could start a video search by voice (design the UI so a Hope-started search lands in the same approval list).

## Hard design rules (Kevin, all repeated more than once)
- ROOM TO BREATHE and USE THE FULL WIDTH: content zones and summaries use the full width of their card; NO narrow max-width/ch caps, nothing bunched to one side, no empty right half at 1900px. Space creates the readability and the divisions. Check 1900, 1300 and 560 wide.
- No highlights anywhere: no glows, tinted/filled backgrounds, underline/ring/pill markers under text, colour floods. Allowed: solid hover fill on buttons and pills (white fill, black ink, per Plugins/MixBus), solid teal selected row only where a selection exists, keyboard-only focus ring. No hover fill on content rows.
- No boxes/tiles/pills behind counts, arrows, icons or markers. No emoji icons. Plus/minus fold icons. No per-item token/byte counts shown (a single header budget readout of what Hope reads is OK if still relevant).
- Primary palette only (Status blue #36a8ed, Tools yellow #e8b45a, Library purple #b970ff, Video pink #f472b6, Categories orange #f97316; teal #2dd4bf selected). Purple must not dominate: give sections their own palette colours (like MixBus buses), black ink on bars, outline treatment identical to MixBus/Plugins cards (1px section colour border, radius 12, 48px bar, fold glyph at right).
- Proximity: a summary sits directly under its own title (same column, small gap, no rule between); a full-width 1px hairline plus a larger gap separates entries, equal space above and below. Entry actions (Summary/Raw, View/Hide, Edit, Re-summarise, Delete) in their own right-hand zone, not crowding the text.
- Plain words, no explanatory blurbs, no orphan words. Scales with text size.
- Categories: the old Knowledge Base categories are down to six (Mixing techniques, Producer interviews / chains, Reference tracks, Mastering, Vocal techniques, Workflow); Plugin recipes and Misc are removed; fallback category is Mixing techniques. Jules may revise how videos/notes/tips are organised.

## Existing pieces to reuse or replace (read the code)
standalone/assets/index.html: #knowledge panel (~line 3662, kb-* classes, KB_CATEGORIES ~14138, insight redesign CSS block), #snapshots panel (~3625, rtPillsGrid, journalList), live Add YouTube link row. Worker: worker/src/index.js (/kb/add-youtube, /kb/user-videos, /kb/transcript, /kb/vector-search). Previous (superseded) Insight designs: docs/handover-assets/jules-insight-style/ (use as lessons, not as a base).

## Deliver (design only; do not touch index.html)
docs/handover-assets/jules-library-tab/SPEC.md and preview.html showing: page overview (empty and populated), Add-by-link row, Find-videos request, the approval list (with links, already-have excluded, per-video Add and Add all, progress, success and failure lines), To review tips from Hope, library browse (videos, notes, saved chats), snapshot pill behaviour, narrow layout. Include rest/hover/focus states, spacing values, CSS draft, and a one-paragraph rationale for the structure. Verify with real screenshots at 1900, 1300 and 560 and state that you viewed them. Report in 8 lines.
