# Library, minimal neutral pass v3 - design spec (Jules, 23 Nov 2026, design only)

Kevin 23 Nov, corrected: neutral dark Mix Check cards with no coloured fills or bars. The section palette is NOT retired: it survives only as bold TITLE TEXT colour on the neutral cards. Teal stays the accent for buttons, hover pills (everywhere, no per-section hover colour), selected/playing row, links like Read more, and the focus ring. Nothing is built; `index.html` untouched.
Files: `fix.css` (override CSS, tested against the real page), `shots/before-*.png`, `shots/after-*.png` at 1900, 1300, 560, plus `after-1900-videos-open.png`.
Rev 2 re-shot after Kevin's correction; computed styles confirmed on the real page: bar text rgb 54,168,237 / 185,112,255 / 244,114,182 / 249,115,22 / 232,180,90, bar fill and card border neutral (27,29,32 and 44,48,52), hover pill token teal in all five sections. Rev 3 shots re-taken and viewed at 1900, 1300 and 560 with the Browse card restructured by script (preview only). Checked against: live build 2026-11-23.10 served over http at 127.0.0.1:8768 (branch library-bars), headless Chrome, fix.css injected into the real page with seeded sample data. I viewed after-1900, after-1300 and after-560 (and the before and videos-open runs). Anything not seeded (real library data, hover and focus states) is by CSS only, not screenshotted.

## 1. Rule
Section colours are title text only: Add to Hope's library blue #36a8ed, Hope's review purple #b970ff, Videos pink #f472b6, Notes orange #f97316, Saved chats yellow #e8b45a, Browse white. Never a fill, bar, border, fold glyph or hover. Surfaces are Mix Check's: card `#1b1d20`, hairline and border `#2c3034`, inset field `#16181b`, ink `#e8ebed`, muted `#9aa0a6`, radius 10. Teal `#2dd4bf` with black ink is the only accent, used for: selected/playing row (unchanged), primary buttons, hover pills, focus ring.

## 1b. Section-title size (rev 3, measured on the real page)
The live Browse heading (`.browse-head h3`) is 22px / weight 700 / line-height 1.25 (colour #f3f4f6); the live section bars were 16px / 700. Every section title now uses the Browse size: **22px, weight 700, line-height 1.25, letter-spacing 0** (Add to Hope's library, Hope's review, Browse, Videos, Notes, Saved chats). It scales with the text-size setting via `--u`. Confirmed on the patched real page: all five coloured bars compute 22px/700. Sub-headings inside a section (Mastering, Vocal techniques, Favourites, Sessions, "Results for ...") stay **16px / 700 white** (`.grp`, `.rhead h3`, unchanged, measured 16px/700 #fff). Counts beside titles: 16px / 600 grey.
Bar height rises 48 to **64px** (12px top and bottom padding, about 21px clear above and below the 22px title) so the bigger title keeps room to breathe. Same height in every section, including Browse.

## 2. Decisions
| Element | Now | Minimal |
|---|---|---|
| Card | 1px section-colour border, radius 12, `#1a1d21` | 1px `#2c3034`, radius 10 (Mix Check), `#1b1d20` |
| Title bar | solid section colour, black ink | same neutral surface, title text in the section colour, 16/700, flush, no inset; 1px `#2c3034` hairline under it when open; hover `#202327` |
| Count and fold glyph | black on colour | count and plus/minus neutral `#9aa0a6` (fold `#e8ebed` on hover), never coloured, no boxes |
| Secondary button | grey, hover white | grey `#2c3034` with `#e8ebed` text at rest, hover teal with black ink |
| Primary button | section colour | teal, black ink; hover `#5eead4` |
| Hover pills (.tx, .more) | section colour | teal, black ink, in every section |
| Focus ring | white / black inset | 2px teal outline (offset 2; inset on bars and group rows); teal-filled items lose the inset ring |
| Fields | `#2a2e35` fill | Mix Check inset `#16181b` + 1px `#2c3034`; focus 2px teal |
| Error text | orange | Mix Check red `#f87171` (a status colour, not a section colour) |
| Group rows (categories, Favourites, Sessions) | fold in section colour | fold grey, hairline unchanged |
| Favourite pill | white hover | teal hover; star stays the plain purple the UI standard requires for starred items |
| Player and Playlist | approved | layout and sizes untouched. Only: surface `#1b1d20`, line `#2c3034`, secondary video pill grey with teal hover, Open on YouTube hover `#5eead4`, focus rings teal. Selected playlist row is already teal |
Unchanged: flush title bars, plus/minus folds, section order, full width, spacing, no boxes behind small elements, no emoji, no arrows, no glows, button text visible at rest.

## 3. Check against docs/UI_DESIGN_STANDARD.md
Mix Check is the template: surfaces and radius now match it. No boxes behind counts, folds or markers: pass (counts and folds are bare glyphs on the surface). Headings: unchanged Inter, title case, no capitals. Spacing and gutters: untouched, 1900/1300/560 checked, no overflow seen. Hover and selected states legible: black on teal 11.6:1 (computed from the hex values), light ink on `#2c3034` about 10:1. Two items for Kevin: the purple star (kept, per the standard) and the red error text (new, replaces orange).

## 3b. Browse card (rev 3, needs one markup change)
Browse becomes its own neutral card with a flush title bar like the others: bar text "Browse" in white 22/700, plus/minus fold, 64px high. Structure:
`<section class="card" data-sec="browse" data-open="true"><button class="bar" onclick="libFold(this)">Browse<span class="fold"></span></button><div class="cbody"><div class="browse-head">[search] [channel] [Expand all] [Collapse all]</div><div class="lib-group" id="libBrowse">Videos, Notes, Saved chats cards</div></div></section>`
The old `h3` inside `.browse-head` is removed (the bar is the title). Videos, Notes and Saved chats stay Browse's children with their coloured 22/700 titles, but inside Browse they are flush sections: no second border or radius, a hairline above each, so no card-in-card boxes. Layout of the head row: search fills, channel 280, Expand all and Collapse all at the right on one row; when the Browse card is under 900px wide it becomes search on its own row then channel and the two actions; under 520px (the 560 window) all stack, actions right aligned. 18px above and below the row, left and right inset same as the rows. Screenshots show all three widths.
Notes for Codex: `libFoldAll` uses `#libBrowse .card`, which still excludes the Browse card itself (correct: Expand all must not collapse its own container). Folding Browse hides the search row too, so `libSearchChanged` should open the Browse card as well as the Videos card. Keep `#libBrowse` and the card ids.

## 4. Section colours in the Library: remove vs keep (for Codex)
File `standalone/assets/index.html`, line numbers at build 2026-11-23.10. The `--c` variable now drives ONE thing: the title text colour.
KEEP: 3247 palette variables (`--yellow --blue --pink --orange --purple`); 3256 `--c:var(--dim)` default; 3257-3261 the five `.card[data-sec=...]{--c:...}` rules; all `data-sec` attributes (3316-3320 grids and JS 22622 and 22642 depend on them); Browse heading `h3` stays white (3 `.browse-head h3`, `#f3f4f6`); `--orange` stays only if used elsewhere, otherwise drop it (see 3295 and 3339 below); purple star 3379.
CHANGE so `--c` is title text only:
- 3256 `.card`: `border:1px solid var(--c)` to `1px solid #2c3034`, radius 12 to 10, background `#1a1d21` to `#1b1d20`.
- 3262 `.bar` (also rev 3: `min-height` 48 to 64, padding 12 top and bottom, `font:700 22px/1.25`): `background:var(--c);color:#000` to `background:#1b1d20;color:var(--c)`; add `.card[data-open=true]>.bar{border-bottom:1px solid #2c3034}` and a `#202327` hover.
- 3263 `.bar .n`: black at opacity .8 to `#9aa0a6`, no opacity (count stays neutral, not coloured).
- 3265 `.fold`: `color:#000` to `#9aa0a6` (neutral, `#e8ebed` on bar/group hover). 3370 `.grp .fold{color:var(--c)}` to `#9aa0a6`.
- 3264 and 3371 white focus outlines to 2px teal.
- 3272 `.btn.pri{background:var(--c)}` to teal `#2dd4bf` (this was a section-coloured fill; primary is always teal). 3273-3274 white hover/focus to teal with black ink, `.btn.pri:hover` `#5eead4`.
- 3278 and 3281 fields: fill `#16181b` + 1px `#2c3034`, focus ring teal.
- 3295 and 3339 `.bad` text `var(--orange)` to `#f87171` (status, not a section colour).
- 3380-3382 pill hover white and black ring to teal, no ring.
- 3394 `#library .card{--hov:var(--c)}`: DELETE (or set to teal). This is the per-section hover colour; hover pills are teal everywhere. 3393 `--hov:#2dd4bf` stays.
- 3399 black inset focus ring on `.tx/.more` to teal outline.
- Player block (about 3453-3540): `.lp` tokens `--surf #1b1d20 --line #2c3034 --hover #202327`; `.video-pill:hover` white to teal; white focus outlines to teal.
JS: no colour is applied from JS in the Library render (no inline styles or `style.color`); nothing to change there beyond keeping the `data-sec` markup.
Not Library, leave alone: legacy `.library-toolbar`/`.lib-count-badge` `#fbbf24` (lines 599-606, unused by `#library`), Insight `#knowledge .insight-sec[data-sec=memory]{--c:#36a8ed}` (5249), Mix Check orange/pink (26017, 27691, 28072).

## 5. Hand-off
Spec: this file plus `fix.css`, target branch library-bars. Codex builds by editing the originals in place (not by appending fix.css), then Jules reviews the rendered build at desktop and 560 before Kevin sees it.
