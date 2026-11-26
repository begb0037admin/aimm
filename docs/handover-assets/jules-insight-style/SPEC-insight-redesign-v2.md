# Insight redesign v2 - Knowledge base, page shell, shared patterns (Jules, 22 Nov 2026, design only)

Replaces the earlier Insight styling in `standalone/assets/index.html` (live build 2026-11-22.3). Preview: `preview-insight-redesign-v2.html` (same folder; add `?scale=1.4`). Exact CSS: `insight-v2.css` (also pasted in section 7). Nothing is built. Codex implements after Kevin approves the preview. **Hope's memory half is ON HOLD** (when designed, fact rows follow the note-row hover rule: no fill) (Kevin, 22 Nov 2026: memory is being rethought as a small core memory plus a searchable archive, mostly hidden). It is a marked placeholder only; do not restyle fact rows yet.

Checked against: the live page rendered in headless Chrome at 1900 and 700 wide with seeded notes, an open note and the YouTube row, and the new preview at 1900 and 560 wide. Room to breathe was checked at both widths.

**Standing rule, app-wide (Kevin, 22 Nov 2026, "anywhere"): No highlights: no underlines, rings or pills under text actions; no glows, no tinted or filled backgrounds, no colour floods, no marker lines. This applies everywhere in AIMM, not only Insight.** Allowed and nothing else: (1) the solid hover fill on buttons and pills (white fill, black ink); (2) the approved Plugins sidebar / MixBus row treatment and their solid section-colour bars; (3) the solid teal selected row or tab (selected state only); (4) a keyboard-only focus ring (`:focus-visible`, never on mouse click). In Insight, note rows and fact rows never fill, tint, glow or mark.

## 1. What was wrong in the live build, and why
| # | Deviation from the approved spec/preview | Cause |
|---|---|---|
| 1 | Open note is a full teal block | Spec miss. SPEC.md section 5 said "Selected = solid teal". Teal fills belong to small selected controls, not a card. Reversed here: the open note has no marker at all (see section 4) |
| 2 | Tags unreadable on teal | Spec miss. The expanded/hover ink rule (`#knowledge .kb-card.expanded :is(...)`) lists title, meta, grip, toggle, counts, actions but not `.kb-tags`, so tags stay grey on teal. Gone with the fill; `.kb-tags` is now in the hover list too |
| 3 | Summary text monospace and cramped | Spec miss (SPEC.md said 13px mono). Now Inter 15px / 1.65, readable measure |
| 4 | Fold arrow faint on the purple bar | Spec gap: glyph colour was not fixed, and the "-" is a 400-weight text character. Now 24px 700 black |
| 5 | Blue focus ring against purple | Spec miss (blue `#36a8ed` ring kept). Replaced: focused control takes its hover fill plus a 2px black inner ring. Paste field uses a 2px section-colour inner ring |
| 6 | Action row has no hierarchy | Spec miss. Now three tiers (section 4) |
| 7 | Right column crowded | Spec gap: no spacing values. Now a 24px column holding only the tick or dash, level with the title, 12px right inset. The per-note "N tok" figure is removed |
| 8 | Toolbar left-packed, paste row on its own line | New feature (YouTube) placed without a layout pass. Paste field now lives in the toolbar row and takes the free width |
| 9 | Counts tiny and pushed to the far right | Spec gap. Count now sits beside the category name, 15px 600 |
| 10 | Add rows look like orphan links, indents uneven | Spec gap. All rows share one grid (section 3) so glyph, name, title and add label line up |
| 11 | Budget bar full orange with no explanation | Spec gap: over-limit state was never designed. New over-limit line (section 5) |
| 12 | Add button had a blue ring | Same as 5 |
| 13 | Page heading and subline above the card | NOT a deviation. SPEC.md said page head unchanged. Kept; 24px gap below it |
| 15 | Teal curved underline under Summary | My v2 preview/spec only: `#knowledge .kb-card .kb-actions .kb-mode-pill.on{box-shadow:inset 0 -2px 0 var(--teal)}` on an 8px-radius button. Removed. The live 2026-11-22.3 has no underline: there `.kb-mode-pill.on` only sets a border colour, and `#knowledge .kb-card .kb-actions button{border:0}` hides it |
| 14 | Category rows not purple, bar floating with no outline | Spec miss. v1 made the whole section one card with neutral category rows; Plugins and MixBus make each category its own outlined card with a solid bar. Fixed in section 3 |
No row is a CSS conflict with older `!important` rules: the whole Insight block is cleanly scoped at lines about 4912-5001; the older `.kb-card` rules (about lines 760-800) are overridden by it and can be deleted when Codex replaces the block.

## 2. Spacing (all multiplied by the text-size setting; `--u` = 1px x scale)
| Token | Value | Matches |
|---|---|---|
| category card | 1px solid section colour, radius 12, `#1a1d21`, overflow hidden, 12 between cards | MixBus `.bus-col` (line 431, gap 12 line 425) and Plugins `.inv-sidebar-card` (line 4855, margin 12) |
| card bar | min-height 48, padding 8 12 8 14, 16px/700 black on the section colour, fold glyph 22px at the RIGHT | MixBus `h4` (line 432), Plugins section toggle (line 4861) |
| inside the card | list padding 8 2, 3 between rows | MixBus `.bus-content` 8 6 / Plugins section-inner 8 6 / nav gap 3; Insight uses 2 side padding so the row's own 12 inset lines the grip up under the bar title (both at x = 14) |
| note row | padding 14 12, title 16px, meta and tags 14px, actions min-height 36 | richer than a one-line Plugins row on purpose: notes are multi-line reading rows |
| glyph column / glyph-to-text | 18 / 14 | |
| add row | min-height 46, plus glyph in section colour | MixBus "Add plugin" row |
| section head | title 22px/700 white, read-out 14px dim right, 4px meter under it, 16 below | plain heading on the page background, no border |
| toolbar | on the page background, buttons 44 high radius 10, gap 12, 16 below | |
| between sections | 40 | |
| glow | none. Plugins `.is-current` has one (line 4860); it is a highlight and is to be swept out, so Insight does not copy it | |

## 2a. Category colours (palette only; teal is never a category colour)
Six categories (Plugin recipes / settings and Misc were removed by Kevin, 22 Nov 2026). Each card sets `--section-colour` (as Plugins does with `data-inv-section`); bar, outline, the count and the add-row plus follow it. Page-level elements are neutral: heading white, meter fill `#e5e7ea`, paste field neutral, no purple at page level. All five palette colours are used; blue repeats once, on non-adjacent cards, so neighbours never share a colour. Meaning follows MixBus where a category has a MixBus twin (Master orange, Vocal yellow).
| Category (id) | Colour | Hex | Black ink on bar |
|---|---|---|---|
| Mixing techniques (`mixing`) | Status blue | #36a8ed | 7.4 |
| Producer interviews / chains (`producers`) | Video pink | #f472b6 | 7.3 |
| Reference tracks (`refs`) | Library purple | #b970ff | 6.3 |
| Mastering (`mastering`) | Categories orange (Master) | #f97316 | 6.9 |
| Vocal techniques (`vocals`) | Tools yellow (Vocal) | #e8b45a | 10.3 |
| Workflow (`workflow`) | Status blue | #36a8ed | 7.4 |
Order top to bottom: blue, pink, purple, orange, yellow, blue. Outline against `#1a1d21`: blue 6.4, yellow 8.9, purple 5.5, pink 6.4, orange 6.0, all above 3:1. Colours attach by the existing `data-collapse-id` (`kbc-<id>`), so no markup change is needed.
Hope's memory categories: not designed yet (on hold). No colours are assigned here.

## 3. Layout
- Page head unchanged (24px gap below it).
- **Section = plain heading plus cards, not a card.** "Knowledge base" (22px/700 white) with "3 of 5 active · 873 / 8000 bytes" at the right, a 4px meter under it, then the toolbar, then one outlined card per category. The section has no border and no coloured bar, so there is never a border inside a border (this removes the floating-bar problem and the double outline). The section has no colour of its own: the heading, meter and toolbar are neutral, and each category card carries its own palette colour (section 2a). The old collapsible section bar (`aria-expanded`) is removed; categories are the fold units.
- **Each category is ONE outlined card in its own palette colour**, built like a MixBus bus and a Plugins sidebar card: coloured bar (name, then the count right beside it, fold glyph at the far right: minus when open, plus when closed), rows inside on `#1a1d21`, "Add note" as the last row. Closed and empty categories are just the bar (1px outline, 48px), exactly as an empty MixBus bus. No glow, on the open card or any other.
- Category bar and toolbar use the same zones: bar = name and count together on the left, fold glyph alone at the right edge (the count stays beside the name, by Kevin's earlier note, so the two zones are label and control); toolbar = primary buttons left, the paste field takes the free middle, text actions at the right with a 16px extra gutter. Toolbar, one row at 1900 on the page background: `[+ Add note teal] [Import] [Export] [paste field grows] [Add] ... [Expand all] [Collapse all]`. The "Add YouTube link" button is removed; the field is always visible, Add teal when a link is present, otherwise dimmed. Expand/Collapse are plain text, right-aligned via `.toolbar-end`. Status line under the toolbar. When narrow, the paste field drops to its own full-width line (`flex:1 1 340px`), nothing clips (checked at 560).
- **Between entries:** a 1px `#2a2e35` hairline, full width of the card body (edge to edge inside the outline), between every entry. A note with its open summary is one entry, so the divider falls after the summary, never inside the entry. Each entry has 14px padding top and bottom, so the space above and below every divider is equal (14 / 14). Hope's memory fact rows use the identical rule (`.fact-chip+.fact-chip`). The within-entry hairline is deliberately dimmer and inset so entry boundaries and summary splits cannot be confused. Not a box, not a highlight.
- **No per-note counts.** Token and byte counts per note (the "106 tok" figure) and per fact are not displayed anywhere in Insight (Kevin, 22 Nov 2026). The right edge of a row holds only the tick or dash toggle, aligned with the title. The one number that matters stays in the section heading: "3 of 5 active · 873 / 8000 bytes", because that budget is what limits Hope.
- Note rows and add rows: grip or plus in the glyph column under the bar title; title, meta, tags and add label start at the same x. Tags are plain text, no pills.
- **Space is the divider.** Each entry is a row of zones separated by gutters, with no boxes or rules between zones (container query on the card, so it follows the app column, not the window):
  - WIDE (card 1180px or more): `grip | reading column (title, and below it the summary at 78ch) | calm column (date/source, then tags, dim) | actions | tick`. Gutters 28 to 32px between zones; the date/source sits on the title line, tags under it, the five actions on the title line, then the tick or dash. Summary/Raw and View/Hide have a fixed minimum width so the calm column lines up on every row.
  - MEDIUM (760 to 1179px): `grip | title, date/source, tags | actions | tick`.
  - NARROW (below 760px): `grip | content | tick`, with the actions dropped under the content.
  - Vertical rhythm: 18px padding top and bottom of every entry, so the between-entry hairline has 18px above and below.
  - Why it reads better: (1) the eye finds the title in the left zone, the facts in a quiet middle zone and the controls at the right edge, so nothing competes inside one cluster; (2) the summary gets its own readable column under the title, uncluttered by menu text; (3) entries separate by a hairline plus open space rather than decoration, so a long list scans at a glance.
- Actions, three tiers:- **Between entries:** a 1px `#2a2e35` hairline, full width of the card body (edge to edge inside the outline), between every entry. A note with its open summary is one entry, so the divider falls after the summary, never inside the entry. Each entry has 14px padding top and bottom, so the space above and below every divider is equal (14 / 14). Hope's memory fact rows use the identical rule (`.fact-chip+.fact-chip`). The within-entry hairline is deliberately dimmer and inset so entry boundaries and summary splits cannot be confused. Not a box, not a highlight.
- **No per-note counts.** Token and byte counts per note (the "106 tok" figure) and per fact are not displayed anywhere in Insight (Kevin, 22 Nov 2026). The right edge of a row holds only the tick or dash toggle, aligned with the title. The one number that matters stays in the section heading: "3 of 5 active · 873 / 8000 bytes", because that budget is what limits Hope.
- Note rows and add rows: grip or plus in the glyph column under the bar title; title, meta, tags and add label start at the same x. Tags are plain text, no pills.
- Actions, three tiers: **Summary/Raw, View/Hide** bright and bold; **Edit, Re-summarise** normal; **Delete** dim, last in the same row. All five are 12px-padded buttons 4px apart (28px between labels, identical for every pair). The Summary button's on/off state is carried by its label alone ("Summary" or "Raw", `sumPillTxt`); no underline, ring or pill. Hover = text brightens to white only.

## 4. States
| State | Look |
|---|---|
| Rest | transparent, ink `#c4cad3`, titles `#e5e7ea` |
| Hover on a note row | the title brightens to white. No fill, no underline, no highlight (Kevin, 22 Nov 2026: purple row fill dropped). Text actions (Summary, View/Hide, Edit, Re-summarise, Delete, Expand/Collapse) brighten to white on hover, nothing else |
| Keyboard focus | only on keyboard (`:focus-visible`, never on mouse click): the focused action, tick or add row gets a 2px white inner ring. This is the single exception to the no-rings rule, because focus must stay visible; the blue ring is gone everywhere |
| Category bar | already solid section colour with black ink, no hover change (exactly as the Plugins sidebar and MixBus bars; open item closed) |
| Toolbar buttons hover | keep the white fill with black ink (Kevin confirmed: pills and buttons keep their hover fill, the Plugins/MixBus convention); teal Add stays teal until hover. Text-only toolbar actions (Expand all, Collapse all, Clear all) are not buttons visually: ink brightens to white, no fill |
| Add row | label brightens to white on hover, no fill (it is a list item) |
| Open note | no marker of any kind: no rule, tint, glow or colour change. The note shows its summary below a within-entry hairline (1px `#23272d`, a step dimmer than the between-entry line, inset to start at the text column and end 12px from the right; Inter 15/1.65 `#d5d8dc`, line length capped at 78ch), the View button reads Hide, and the Summary/Raw label says which text Hope receives. Vertical rhythm: title, date/source and tags are one tight group (3px); 12px then actions; about 21px above and 20px below the within-entry hairline |
| Inactive | dash instead of tick, title struck and dim, grip, meta and tags 70% |
| Dragging | the origin slot fades to 35%; the dragged row is lifted with a soft drop shadow (MixBus `sortable-drag`), no fill |
| File dragged over page | one neutral `#2a2e35` card, white text, "Drop files to import. PDF, DOCX, TXT, MD or JSON" (no teal flood) |
| Focus on paste field | 2px inner ring in the section colour (a dark field hides a black ring) |

## 4a. Final hover and focus rule per element (single source of truth)
| Element | Hover | Keyboard focus (`:focus-visible` only) |
|---|---|---|
| Toolbar buttons: Add note, Import, Export, paste-field Add (when enabled), Add fact later | solid white fill, black ink (the Plugins/MixBus button convention). Teal Add stays teal until hover | white fill + 2px black inner ring |
| Category card bar (the purple bar) | no change: it is already solid. Plugins `.inv-sidebar-section-toggle:hover` and the MixBus bar have no hover change (verified in the CSS, lines 4861 and 432) | 2px white inner outline, offset -3 (MixBus bar focus, line 433) |
| Note row (and later fact rows) | title brightens to white only. No fill, no underline | none on the row itself; focus goes to its controls |
| Text actions: Summary/Raw, View/Hide, Edit, Re-summarise, Delete, Expand all, Collapse all | text brightens to white. No fill, underline or pill | 2px white inner ring on the focused action (the only ring on text) |
| Tick / dash toggle | glyph brightens to white | 2px white inner ring |
| Add row ("Add note", "Add to X") | label brightens to white, no fill | 2px white inner ring |
| Paste field | no change | 2px white inner ring |
| Open note | same as any note row: title brightens | n/a |
Colour fill appears only on the category bars (solid at rest) and on buttons (white). Nothing else fills. Everything else that fills on hover is a button and fills white.

## 5. Budget and over-limit (shared pattern; Memory will reuse it)
- Meter under the section heading: 4px, neutral fill `#e5e7ea` on a `#2a2e35` track. At the amber threshold (6000 for KB) fill = Tools yellow `#e8b45a`. At or above the cap fill = Categories orange `#f97316`, full width.
- **Over the limit** (used >= cap): the meter turns orange and a plain line appears under it: bold orange "Over the limit." then ink text, with no rule, box or tint. Rendered by Codex as `<div class="budget-note" role="status">`, hidden otherwise. Copy for Knowledge base: "Over the limit. Turn off notes you do not need so Hope's prompt stays short." (Codex to confirm the real consequence in `buildResearchDigest`; the code comment says it does not truncate, so the copy does not claim that. Memory copy is held with the memory design.)

## 6. Empty states and Hope's memory placeholder
- Empty library: plain text, no dashed box: "**No notes yet.** Add one, paste a YouTube link, or drop a file here." plus the teal Add note button (`.insight-empty`).
- Empty category: closed row, count 0. Open empty category shows only its Add row.
- **Hope's memory: HOLD.** Placeholder in preview section 4: the same heading, meter and one outlined card so the pattern is ready; colours per section 2a. Kevin will return with the agreed behaviour (core memory plus archive). Reuse section 5 and the shared rows when designing it. The existing live memory styling stays as is until then; do not apply this spec to `.fact-chip` rows.


## 6a. Removed categories: Plugin recipes / settings and Misc (implementation note for Codex)
Kevin removed both (22 Nov 2026). Six categories remain: Mixing techniques, Producer interviews / chains, Reference tracks, Mastering, Vocal techniques, Workflow. Empty categories keep showing only their bar (1px outline, 48px).
- `standalone/assets/index.html`: remove `{id:'plugins'}` and `{id:'misc'}` from `KB_CATEGORIES` (about lines 14138-14147) and the `plugins` entry from `KB_CAT_PATTERNS` (about line 14157), so the heuristic can never return either.
- **Fallback changes from `misc` to `mixing`** (Mixing techniques): in `kbCategorize()` (lines about 14165-14174, both `return 'misc'` and the comment at 14163) and in `knowledgeRender()` (about line 14272, `: 'misc'`).
- **No note may be lost.** `knowledgeMigrateCategories()` re-files any note whose `.category` is missing or not in `KB_CATEGORIES` through `kbCategorize()`, so stored `plugins` and `misc` notes move automatically with the new `mixing` fallback, and it saves. Verify with one test note of each. The drag handler (`wireKbCardsDragdrop`, about lines 14211-14250) rebuilds order from `KB_CATEGORIES` and already appends any note it did not see, so nothing is dropped there, but re-test it after the change.
- Also check and update: the Add/Edit note dialog category list; the import path `kbExtractMetadata` (about line 14655) and its callers (about lines 14713 and 14876) in case they set a category; Hope's `add_knowledge_note` tool (about line 13019, parameter options and description) and `standalone/assets/hope-tools-manifest.json` (Hope's tool definitions are Markey's: route that edit through Markey); add-row labels; the CSS no longer has `kbc-plugins` or `kbc-misc` colours; and any test or fixture referencing `plugins` or `misc`.
- Leave Hope's memory categories (`PROFILE_CATEGORIES`, its own `misc`) alone: memory is on hold.

## 7. Exact CSS
Replace the Insight block (`#knowledge{--insight-ink...` through `#knowledge :focus-visible,#kbModal ...`) with this. `#kbModal` keeps its own focus rule until its restyle (not in this spec).
```css
/* INSIGHT v2 (Jules). All rules scoped to #knowledge. Replaces the whole block at "#knowledge{--insight-ink..." through "#knowledge :focus-visible".
   Unit: --u is 1px times the text-size setting, so calc(20*var(--u)) = 20px at 100%. Palette: section colour (--c), teal, neutrals only. */
#knowledge{--u:calc(1px*var(--inv-text-scale,1));--ink:#c4cad3;--hi:#e5e7ea;--dim:#9aa0a6;--track:#2a2e35;--black:#0b0d10;--teal:#2dd4bf;--tools:#e8b45a;--over:#f97316;
  --gutter:calc(12*var(--u));--rowx:calc(12*var(--u));--glyph:calc(18*var(--u));--cgap:calc(14*var(--u));--gap:calc(12*var(--u))}
#knowledge button{font-family:inherit}
#knowledge :focus{outline:0}
#knowledge .section-head{margin-bottom:calc(24*var(--u))}
#knowledge .section-head h2{font:500 calc(30*var(--u))/1.2 Inter,sans-serif;letter-spacing:-.035em;text-transform:none}
#knowledge .section-head .blurb{font-size:calc(14*var(--u));color:var(--dim)}

/* 1. SECTION HEAD (a plain heading, NOT a card: the cards are the categories, as in Plugins and MixBus) */
#knowledge .insight-sec{margin:0 0 calc(40*var(--u))}   /* page level is neutral: no section colour. Colour lives on each category card (section 3). */
#knowledge .sec-bar{display:flex;align-items:baseline;gap:var(--gap);width:100%;margin:0 0 calc(12*var(--u));padding:0;background:none;border:0;color:#f3f4f6;font:700 calc(22*var(--u))/1.25 Inter,sans-serif;text-align:left;cursor:default}
#knowledge .sec-bar>span:first-child{flex:1}
#knowledge .sec-read{font-size:calc(14*var(--u));font-weight:600;color:var(--dim);text-align:right}
#knowledge .sec-fold{display:none}
#knowledge .meter{height:4px;margin:0 0 calc(16*var(--u));background:var(--track)}
#knowledge .meter i{display:block;width:var(--p,0%);height:100%;background:#e5e7ea}   /* neutral fill; warn and full turn yellow and orange */
#knowledge .meter.warn i{background:var(--tools)}#knowledge .meter.full i{background:var(--over)}
/* over-limit line (new element, rendered only when used >= cap) */
#knowledge .budget-note{margin:0 0 calc(16*var(--u));padding:0;font:600 calc(15*var(--u))/1.5 Inter,sans-serif;color:var(--hi)}
#knowledge .budget-note[hidden]{display:none}
#knowledge .budget-note b{color:var(--over);font-weight:700}

/* 2. TOOLBAR: sits on the page background (no card). One row, uses the width. [primary actions] [paste field, grows] [text actions, right]. Wraps cleanly. */
#knowledge .kb-toolbar,#knowledge .hope-memory-meta{display:flex;align-items:center;flex-wrap:wrap;gap:var(--gap);margin:0 0 calc(16*var(--u));padding:0;background:transparent;border:0}
#knowledge .kb-toolbar .btn,#knowledge .hope-memory-meta .btn,#knowledge .kb-yt .btn{min-height:calc(44*var(--u));padding:0 calc(18*var(--u));border:0;border-radius:10px;background:var(--track);color:#d5d8dc;font:700 calc(15*var(--u))/1.2 Inter,sans-serif;display:inline-flex;align-items:center;gap:calc(8*var(--u));cursor:pointer}
#knowledge .kb-toolbar .btn.amber,#knowledge .hope-memory-meta .btn.purple,#knowledge .kb-yt .btn.amber{background:var(--teal);color:var(--black)}
#knowledge .kb-toolbar .btn:hover,#knowledge .hope-memory-meta .btn:hover,#knowledge .kb-yt .btn:hover:not(:disabled){background:#fff;color:var(--black)}
#knowledge .kb-toolbar .btn:focus-visible,#knowledge .hope-memory-meta .btn:focus-visible,#knowledge .kb-yt .btn:focus-visible{background:#fff;color:var(--black);box-shadow:inset 0 0 0 2px var(--black)}
#knowledge .btn.txt,#knowledge .kb-toolbar .btn[onclick^="expandAll"],#knowledge .kb-toolbar .btn[onclick^="collapseAll"],#knowledge .hope-memory-meta .btn[onclick^="expandAll"],#knowledge .hope-memory-meta .btn[onclick^="collapseAll"],#knowledge .hope-memory-meta .btn[onclick^="clearAll"]{background:transparent;color:var(--dim);padding:0 calc(12*var(--u))}
#knowledge .kb-toolbar .btn.txt:hover,#knowledge .hope-memory-meta .btn.txt:hover,#knowledge .btn.txt:hover{background:transparent;color:#fff}   /* text actions: ink brightens, no fill */
#knowledge .kb-toolbar .btn.txt:focus-visible,#knowledge .btn.txt:focus-visible{background:transparent;color:#fff;box-shadow:inset 0 0 0 2px #fff}
#knowledge .toolbar-end{margin-left:auto;padding-left:calc(16*var(--u));display:flex;align-items:center;gap:calc(4*var(--u))}
#knowledge .kb-yt{display:flex;align-items:center;gap:var(--gap);flex:1 1 calc(340*var(--u));min-width:0;padding:0}
#knowledge .kb-yt[hidden]{display:flex}
#knowledge .kb-yt-in{flex:1 1 auto;min-width:0;min-height:calc(44*var(--u));padding:0 calc(16*var(--u));background:var(--track);border:0;border-radius:10px;color:var(--hi);font:calc(15*var(--u))/1.2 Inter,sans-serif}
#knowledge .kb-yt-in::placeholder{color:var(--dim)}
#knowledge .kb-yt-in:focus{box-shadow:inset 0 0 0 2px #fff}
#knowledge .kb-yt-in[readonly]{opacity:.7}
#knowledge .kb-yt .btn:disabled{background:var(--track);color:var(--dim);cursor:default}
#knowledge .kb-yt-msg{flex:1 1 100%;margin:calc(-4*var(--u)) 0 calc(16*var(--u));font:calc(14*var(--u))/1.5 Inter,sans-serif;color:var(--ink)}
#knowledge .kb-yt-msg[hidden]{display:none}#knowledge .kb-yt-msg b{color:var(--hi);font-weight:600}
#knowledge .kb-yt-msg.is-warn{color:var(--tools)}#knowledge .kb-yt-msg.is-stop{color:var(--over)}
#knowledge .kb-yt-progress{height:2px;margin:0 0 calc(16*var(--u));background:var(--track)}#knowledge .kb-yt-progress i{display:block;height:100%;width:50%;background:#e5e7ea;animation:kbYtSweep 1.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){#knowledge .kb-yt-progress i{animation:none}}
#knowledge .kb-bytes-meter,#knowledge .hope-bytes-meter{display:none}
#knowledge .hope-status{color:var(--dim);font-size:calc(14*var(--u));margin:0 0 calc(12*var(--u))}

/* 3. CATEGORY CARDS. Each category is ONE outlined unit exactly like a Plugins sidebar card and a MixBus bus:
   1px solid section colour, radius 12, #1a1d21, overflow hidden, solid section-colour bar (48px, 16px/700 black) with the fold glyph at the RIGHT,
   rows inside on 8px 2px padding with 3px between rows, 12px between cards. The section itself has no border, so there are no double borders. */
#knowledge .kb-list,#knowledge #hopeMemoryCategories{display:flex;flex-direction:column;gap:var(--gap);padding:0}
#knowledge .hope-memory-wrap{margin:0}
#knowledge .fact-cat-card{--c:var(--section-colour,#9aa0a6);margin:0;background:#1a1d21;border:1px solid var(--c);border-radius:12px;overflow:hidden}
/* CATEGORY COLOURS. Set --section-colour per card, exactly as Plugins does with data-inv-section. Palette only: blue #36a8ed, yellow #e8b45a, purple #b970ff, pink #f472b6, orange #f97316. Teal is never a category colour (it means open/selected).
   Neighbouring cards never share a colour (six categories, five colours, blue used twice). Selectors use the existing data-collapse-id, so no markup change is needed. */
#knowledge .fact-cat-card[data-collapse-id="kbc-mixing"]{--section-colour:#36a8ed}
#knowledge .fact-cat-card[data-collapse-id="kbc-producers"]{--section-colour:#f472b6}
#knowledge .fact-cat-card[data-collapse-id="kbc-refs"]{--section-colour:#b970ff}
#knowledge .fact-cat-card[data-collapse-id="kbc-mastering"]{--section-colour:#f97316}   /* Master = orange, as MixBus */
#knowledge .fact-cat-card[data-collapse-id="kbc-vocals"]{--section-colour:#e8b45a}      /* Vocal = yellow, as MixBus */
#knowledge .fact-cat-card[data-collapse-id="kbc-workflow"]{--section-colour:#36a8ed}
/* Hope's memory category colours: NOT designed yet (on hold). */
#knowledge .fact-cat-head{display:flex;align-items:center;gap:var(--gap);min-height:calc(48*var(--u));margin:0;padding:calc(8*var(--u)) var(--gap) calc(8*var(--u)) calc(14*var(--u));background:var(--c);border:0;border-radius:0;color:var(--black);font:700 calc(16*var(--u))/1.25 Inter,sans-serif;cursor:pointer}
#knowledge .fact-cat-head>div{display:none}
#knowledge .fact-cat-label{font:inherit;letter-spacing:0;text-transform:none;color:var(--black)}
#knowledge .fact-cat-count{margin:0;color:var(--black);font:600 calc(15*var(--u))/1.3 Inter,sans-serif;font-variant-numeric:tabular-nums;opacity:.8}   /* count right beside the name */
#knowledge .collapse-chev{order:3;margin-left:auto;flex:none;width:calc(22*var(--u));color:var(--black);font:500 calc(22*var(--u))/1 Inter,sans-serif;text-align:center;transform:none!important}
#knowledge .fact-cat-head:hover{background:var(--c);color:var(--black)}   /* no hover change, same as Plugins and MixBus bars */
#knowledge .fact-cat-head:focus-visible{outline:2px solid #fff;outline-offset:calc(-3*var(--u))}   /* MixBus bar focus */
#knowledge .kb-cat-list,#knowledge .facts-list{min-height:0;padding:calc(8*var(--u)) calc(2*var(--u)) 0;gap:0}
#knowledge .fact-cat-card.collapsed>.kb-cat-list,#knowledge .fact-cat-card.collapsed>.facts-list,#knowledge .fact-cat-card.collapsed>.insight-add,#knowledge .fact-cat-card.collapsed>.fact-add-row{display:none}
#knowledge .insight-add,#knowledge .fact-add-mini{display:flex;align-items:center;gap:var(--cgap);width:calc(100% - 4*var(--u));min-height:calc(46*var(--u));margin:calc(3*var(--u)) calc(2*var(--u)) calc(8*var(--u));padding:0 var(--rowx);background:transparent;border:0;border-radius:10px;color:var(--ink);font:700 calc(15*var(--u))/1.3 Inter,sans-serif;text-align:left;cursor:pointer}
#knowledge .insight-add::before,#knowledge .fact-add-mini::before{content:'+';flex:none;width:var(--glyph);text-align:center;color:var(--c);font:700 calc(22*var(--u))/1 Inter,sans-serif}
#knowledge .insight-add:hover,#knowledge .fact-add-mini:hover{color:#fff}   /* add row: label brightens, no fill */
#knowledge .insight-add:focus-visible,#knowledge .fact-add-mini:focus-visible{color:#fff;box-shadow:inset 0 0 0 2px #fff}
#knowledge .fact-add-row{padding:0;display:block}

/* 4. NOTE ROW */
#knowledge .kb-card,#knowledge .fact-chip{margin-top:calc(3*var(--u));padding:calc(18*var(--u)) var(--rowx);background:transparent;border:0;border-radius:10px;color:var(--ink)}
#knowledge .kb-card.active{border:0}
/* NOTE ROW = ZONES SEPARATED BY SPACE (no boxes, no rules). Three layouts chosen by the width of the CARD (container query), so it follows the app column, not the window:
   WIDE (card >= 1180px): grip | READING COLUMN (title, then the summary below) | CALM COLUMN (date/source, tags: dim, secondary) | ACTIONS | TICK, with 28-32px gutters between zones.
   MEDIUM (760-1179px): grip | content (title, date/source, tags) | actions | tick.
   NARROW (< 760px): grip | content | tick, actions drop under the content.
   .kb-main uses display:contents so its children join the row grid without a markup change. */
#knowledge .kb-card{container-type:inline-size}
#knowledge .kb-card .kb-row1{display:grid;grid-template-columns:var(--glyph) minmax(0,1fr) auto calc(24*var(--u));column-gap:0;row-gap:0;margin:0;align-items:start}
#knowledge .kb-card .kb-main{display:contents}
#knowledge .kb-grip{grid-column:1;grid-row:1 / span 4;color:var(--dim);font-size:calc(19*var(--u));letter-spacing:0;cursor:grab}
#knowledge .kb-title{grid-column:2;grid-row:1;padding-left:var(--cgap)}
#knowledge .kb-meta{grid-column:2;grid-row:2;padding-left:var(--cgap)}
#knowledge .kb-tags{grid-column:2;grid-row:3;padding-left:var(--cgap)}
#knowledge .kb-summary-status{grid-column:2;grid-row:4;padding-left:var(--cgap)}
#knowledge .kb-card .kb-actions{grid-column:3;grid-row:1;justify-self:end;margin:calc(-7*var(--u)) 0 0}   /* 36px buttons centred on the 22px title line */
#knowledge .kb-state{grid-column:4;grid-row:1;padding-left:calc(20*var(--u))}
#knowledge .kb-title{font:600 calc(16*var(--u))/1.4 Inter,sans-serif;color:var(--hi);white-space:normal;overflow:visible}
#knowledge .kb-meta,#knowledge .kb-tags{margin:calc(3*var(--u)) 0 0;color:var(--dim);font-size:calc(14*var(--u));line-height:1.5;overflow-wrap:anywhere}
#knowledge .kb-meta a{color:inherit;text-decoration:none}
#knowledge .kb-state{display:flex;justify-content:flex-end;align-items:flex-start;text-align:right;margin-top:calc(-1*var(--u))}   /* just the tick or dash, level with the title */
#knowledge .kb-active-toggle{display:block;min-width:calc(24*var(--u));height:calc(24*var(--u));padding:0;background:transparent;border:0;color:var(--hi);font-size:calc(20*var(--u));line-height:1;cursor:pointer}
#knowledge .kb-active-toggle.on{background:transparent;border:0;color:var(--hi)}
/* Per-note token or byte counts are NOT displayed anywhere (Kevin, 22 Nov 2026). Codex removes the .kb-counts element from the template; the header read-out ("3 of 5 active · 873 / 8000 bytes") is the only count shown. */
#knowledge .kb-counts{display:none}
/* actions: three tiers. View group (Summary, View/Hide) bold bright; edit group (Edit, Re-summarise); Delete dim, pushed to the far right */
#knowledge .kb-card .kb-actions{display:flex;flex-wrap:wrap;align-items:center;gap:calc(2*var(--u)) calc(4*var(--u))}
#knowledge .kb-card .kb-actions button{min-height:calc(36*var(--u));margin:0;padding:0 calc(14*var(--u));background:transparent;border:0;border-radius:8px;color:var(--ink);font:600 calc(14*var(--u))/1.3 Inter,sans-serif;cursor:pointer;text-decoration:none}
#knowledge .kb-card .kb-actions button:nth-child(-n+2){color:var(--hi);font-weight:700;text-align:center}
#knowledge .kb-card .kb-actions button:nth-child(1){min-width:calc(100*var(--u))}   /* Summary and Raw take the same width, so the calm column lines up on every row */
#knowledge .kb-card .kb-actions button:nth-child(2){min-width:calc(68*var(--u))}   /* View and Hide likewise */
#knowledge .kb-card .kb-actions button:last-of-type{color:var(--dim)}   /* Delete: last in the same row, same gap, dim ink */
#knowledge .kb-card .kb-actions button:disabled{opacity:.55;cursor:default}
#knowledge .kb-summary-status{font-size:calc(14*var(--u));color:var(--dim);margin-top:calc(6*var(--u))}

/* BETWEEN-entry divider: 1px #2a2e35 across the full card width between every entry (a note with its open summary is one entry). Equal space above and below: each entry has 14px top and bottom padding. Not a box, not a highlight. Fact rows use the same rule. */
#knowledge .kb-card+.kb-card,#knowledge .fact-chip+.fact-chip{margin:0 calc(-2*var(--u));padding-left:calc(var(--rowx) + 2*var(--u));padding-right:calc(var(--rowx) + 2*var(--u));border-top:1px solid var(--track);border-radius:0}

/* NOTE ROW HOVER: the title brightens. No fill, no underline, no highlight, no glow, no tint anywhere in Insight. Text actions brighten to white on hover.
   KEYBOARD focus only (:focus-visible, never on mouse click) shows a 2px white inner ring on the focused action, the one exception to "no rings" because focus must stay visible. */
#knowledge .kb-card:hover .kb-title{color:#fff}
#knowledge .kb-card.off:hover .kb-title{color:var(--ink)}
#knowledge .kb-card .kb-actions button:hover:not(:disabled){background:transparent;color:#fff;box-shadow:none}
#knowledge .kb-card .kb-actions button:focus-visible{background:transparent;color:#fff;box-shadow:inset 0 0 0 2px #fff}
#knowledge .kb-card .kb-active-toggle:hover{color:#fff}
#knowledge .kb-card .kb-active-toggle:focus-visible{box-shadow:inset 0 0 0 2px #fff;border-radius:6px}

/* OPEN note: NO marker. No rule, no tint, no colour change. It simply shows its summary below a hairline, the View button reads Hide, and the Summary/Raw label says which text Hope receives. */
#knowledge .kb-card.expanded{background:transparent;color:var(--ink)}
#knowledge .kb-card.expanded .kb-body{display:block}
#knowledge .kb-card .kb-body{display:none;margin:calc(18*var(--u)) calc(12*var(--u)) 0 calc(32*var(--u));padding:calc(20*var(--u)) 0 0;background:transparent;border:0;border-top:1px solid #23272d;border-radius:0;color:#d5d8dc;font:400 calc(15*var(--u))/1.65 Inter,sans-serif;white-space:pre-wrap;max-height:none;overflow:visible}   /* WITHIN-entry hairline: inset to the text column and a step dimmer (#23272d) than the between-entry line, so the summary split never reads as an entry boundary */
#knowledge .kb-card .kb-body{padding-right:max(0px,calc(100% - 78ch))}   /* readable line length */

/* INACTIVE */
#knowledge .kb-card.off .kb-title{color:var(--dim);text-decoration:line-through;text-decoration-thickness:1px}
#knowledge .kb-card.off :is(.kb-grip,.kb-meta,.kb-tags){opacity:.7}
#knowledge .kb-card.off .kb-body{color:var(--dim)}

/* 5. HOPE'S MEMORY: ON HOLD. Kevin 22 Nov 2026: memory is being rethought (small core memory + searchable archive, mostly hidden). No fact-row CSS is specified here. The shared patterns above (section card, bar, meter, budget-note, toolbar, category row, add row, focus) are what memory will reuse. */

/* 6. DRAG, DROP, EMPTY */
#knowledge .fact-chip.sortable-ghost,#knowledge .kb-card.sortable-ghost{opacity:.35;background:transparent;border:0}   /* no fill while dragging */
#knowledge .fact-chip.sortable-drag,#knowledge .kb-card.sortable-drag{background:#1a1d21;color:var(--ink);border:0;box-shadow:0 8px 24px rgba(0,0,0,.55)}   /* lifted, as MixBus sortable-drag */
#knowledge.kb-drag-over{outline:0}
#knowledge.kb-drag-over::before{content:'Drop files to import. PDF, DOCX, TXT, MD or JSON';background:var(--track);color:#fff;border:0;box-shadow:none;padding:calc(20*var(--u)) calc(32*var(--u));border-radius:12px;font-size:calc(16*var(--u))}   /* neutral card, no teal flood */
#knowledge .insight-empty{max-width:calc(78ch);margin:0;padding:calc(8*var(--u)) 0 calc(16*var(--u));font:calc(15*var(--u))/1.6 Inter,sans-serif;color:var(--dim)}   /* plain text, no dashed box. Used when a section has nothing yet. */
#knowledge .insight-empty b{color:var(--hi);font-weight:600}
/* Empty library: message left, Add note right (two zones), wraps when narrow */
#knowledge .insight-empty-row{display:flex;align-items:center;justify-content:space-between;gap:var(--gap) calc(24*var(--u));flex-wrap:wrap;padding:calc(8*var(--u)) 0 calc(16*var(--u))}
#knowledge .insight-empty-row .insight-empty{padding:0}
#knowledge .insight-empty-row .kb-toolbar{margin:0}
/* container queries last so they override the base rows above */
@container (min-width:1180px){
  #knowledge .kb-card .kb-row1{grid-template-columns:var(--glyph) minmax(0,1fr) minmax(calc(200*var(--u)),calc(300*var(--u))) auto calc(44*var(--u))}
  #knowledge .kb-card .kb-meta{grid-column:3;grid-row:1;padding-left:calc(32*var(--u))}
  #knowledge .kb-card .kb-tags{grid-column:3;grid-row:2;padding-left:calc(32*var(--u))}
  #knowledge .kb-card .kb-actions{grid-column:4;padding-left:calc(32*var(--u))}
  #knowledge .kb-card .kb-state{grid-column:5;justify-content:flex-end}
  #knowledge .kb-card .kb-grip{grid-row:1 / span 3}
  #knowledge .kb-meta,#knowledge .kb-tags{margin-top:0}
  #knowledge .kb-tags{margin-top:calc(4*var(--u))}
  #knowledge .kb-meta{line-height:calc(22*var(--u))}   /* date/source sits on the title line */
}
@container (max-width:759px){
  #knowledge .kb-card .kb-row1{grid-template-columns:var(--glyph) minmax(0,1fr) calc(24*var(--u))}
  #knowledge .kb-card .kb-actions{grid-column:2 / span 2;grid-row:5;justify-self:start;margin:calc(10*var(--u)) 0 0 calc(var(--cgap) - 14*var(--u))}
  #knowledge .kb-card .kb-state{grid-column:3;padding-left:0}
}
```
Markup changes for Codex (small): delete the `.kb-counts` ("N tok") element from the note template; remove the section-level bar button and its collapse (keep the title and read-out as a plain heading); move the fold glyph after the count (CSS `order:3` already handles it); wrap Expand/Collapse in `<div class="toolbar-end">`; move `#kbYtRow` inside `.kb-toolbar` and show it always (drop the "Add YouTube link" button `#kbYt` and its toggle); keep `#kbYtMsg` and the progress line after the toolbar; add `.budget-note` after `.meter`; drop the leading "+" from add-row labels; the Summary pill keeps its existing Summary/Raw label and gets no extra on-style.

## 8. Contrast
Black on purple 5.3; teal on `#1a1d21` about 9; `#9aa0a6` on `#1a1d21` about 6; orange on `#1a1d21` 6.9; yellow 9.2; white 21.

## 8a. Same language, verified against the live build (not assumed)
Rendered the live 2026-11-22.3 MixBus and Plugins pages and read their CSS: MixBus bus = 1px solid bus colour, radius 12, `#1a1d21`, 48px solid bar with 22px fold glyph right, 12px between buses; Plugins card = the same border and radius, glow only on the current card, nav rows gap 3. The Insight cards use those exact values (section 2). Deliberate differences: no glow (a highlight, so not copied from Plugins), note rows have no hover fill (Kevin's decision), rows are taller because notes are multi-line, and the bar focus uses MixBus's white outline instead of the Plugins blue one.

## 9. Acceptance (Jules reviews against the live build before merge)
At 1900 and about 560 wide, plus scale 1.4: toolbar uses the width; every row and bar shares the 12px gutter; counts beside names; no teal fill, rule or glow anywhere; categories in their own palette colours (purple not dominant); focus ring never blue; no boxes behind glyphs or counts; Hope voice/chat and memory untouched.
