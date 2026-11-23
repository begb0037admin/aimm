# Library video surface, v3 (Jules, 23 Nov 2026) - design only, nothing built

Files: `preview.html` (open over http://localhost, e.g. `python3 -m http.server` in this folder), `player.css` (scoped to `.lp`, container-query sized), `shots/`.
Reference: Kevin's dark Elfsight playlist screenshot. Pure black page, no outer card.

## Placement
Top of the Library page, directly under the page title "Library" (30px/500, -.035em per UI_DESIGN_STANDARD). Existing sections follow unchanged in this order: Add to Hope's library (blue #36a8ed), Hope's review (purple #b970ff), Browse. 40px of space between this surface and the next.

## Structure (nothing else exists)
Left column: YouTube iframe, title, channel row, description box. Right column: one rounded-outline panel "Playlist  n/total", a search field and a channel filter, then numbered rows. No channel list/grid, sections, tips, strips, avatars, views, likes, durations, counts of subscribers.

## Sizes (the container is the Library column; sizes follow its width, not the window)
| | Large (container 1200+; 1900 window = 1440) | Mid (820-1199; 1300 window = 872) | Narrow (under 820; 560 window = 528) |
|---|---|---|---|
| Layout | 2 columns 2fr / 1fr (939 / 469), gap 32 | 1.3fr / 1fr (479 / 369), gap 24 | single column, playlist under player, gap 20 |
| Player | 16:9, radius 18 (939x528) | 479x270 | 528x297 |
| Title | 28/1.3, 600 | 24/1.3, 600 | 22/1.3, 600 |
| Channel name | 18/600 white | 17 | 17 |
| Pills (Open on YouTube teal, Copy link #262a30) | 48 high, 16/600, pad 24 | 44 high, 15 | 44 high, 15 |
| Description box | #1a1d21, radius 16, pad 22/26, 17/1.6, 3 lines then Read more (teal 600) | pad 18/22, 16 | pad 16/20, 16 |
| Panel | height = left column (863), outline 1px #3a3f47, radius 20, black fill | 611 | fixed height min(78vh,760px) |
| Panel head | "Playlist" 22/600, count 18/600 (e.g. 374/402) | 20 / 16 | 20 / 16 |
| Fields | one row: search flex, channel 40%; 52 high, 16px, Mix Check field style (#12161c, 1px #2a3340, radius 12) | stacked (panel too narrow), 48 high, 15 | one row, 48 high |
| Row | grid rank 34 / thumb 144x81 (radius 10, mqdefault) / text; gap 16; pad 10; ~115 high | rank 24 / thumb 112x63; gap 12; ~105 high | rank 24 / thumb 120x68; ~105 high |
| Row text | title 18/1.3 600 white, max 2 lines; channel 16/600 #9aa3af; meta "Added 23 May" 15 #9aa3af | 16 / 15 / 14 | 16 / 15 / 14 |

Rows: rank is a plain number (no box). All text sizes are 14px or larger.

## Row states
- Rest: transparent, white title, grey channel and meta.
- Hover: background #1e2328.
- Keyboard focus: 2px white outline, inset (black on the current row).
- Current: solid #2dd4bf, all text and number black (channel/meta at 80%). No tint, no glow.
- Rows are buttons. Click loads the video and plays it. Count shows position in the filtered list, or only the total if the current video is filtered out. Panel scrolls inside; list jumps to the current row after a filter.

## Search and channel filter
Search matches title and channel; pasting a YouTube link and pressing Enter loads it in the player (not in the library: description box says Hope has not read it, no summary shown). Channel filter is a native select styled as a field: plus glyph at left, no arrow, label "Channel", then "Name (count)" when set. Both sit in Mix Check's field style.

## Cannot be embedded
YouTube player error 2, 5, 100, 101, 150 replaces the frame with a black message "This video can't be played here" plus one teal "Open on YouTube" pill. The title, channel row and list stay usable. Never shows YouTube's raw error. Opening a different row clears it. (Shot: `shots/v3-fail-1300.png`.)

## Real data in the preview
402 videos from `docs/knowledge/*.md` (video_id, title, channel, ingested date), excluding Mix With The Masters (336 records) and the Sonnox manual: 21 channels, not the 22/494 quoted in the brief. If 494 is a different count, Codex must read the live Library data. Description text is the first ~620 characters of each transcript as a STAND-IN: Hope's real one-paragraph summary replaces it. "Added" is the ingest date.

## Hand-off notes for Codex (through Jacob)
Needs the YouTube iframe API with enablejsapi=1, origin set, rel=0, playsinline=1 (host www.youtube.com worked). `file://` shows error 153; serve over http(s). Playlist data should come from the Library's own store, not this JSON. No behaviour was designed beyond what is listed.
