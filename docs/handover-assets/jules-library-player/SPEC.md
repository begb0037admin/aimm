# Library with the YouTube player - design spec, revision 4 (Jules, 23 Nov 2026, design only)

Supersedes revisions 1 to 3 (the Mix Check clone, the sections-strip concept and concept B are gone). Kevin's definitive reference: the dark Elfsight-style YouTube playlist widget on a pure black page (player about 2/3, playlist panel about 1/3, panel height = whole left column), plus the Elfsight channel view as the idle state. Nothing is built; `index.html` untouched.

Files: `preview.html` (served over http://localhost; `?s=channels|channel|play|search|tip|fallback|dock|tab`, `&tier=1` shows what the YouTube Data API would add, `&scale=1.4`), `player.css` (CSS draft, scoped to `#library`, extends `jules-library-tab/library.css` and `jules-library-hover-pills/fix.css`), `shots/`.

## 1. Scope (Kevin's rulings)
- This surface shows **only the YouTube videos that were scraped**: the 494 library items with a real YouTube id, in **22 channels** (Mix With The Masters 92, Make Your Music 49, Mastering.com 21, Streaky 21, then 20 or fewer each, Try Karra 8). The 245 other items (244 Mix With The Masters clips and full recordings cut from Kevin's own recordings, plus 1 product-manual note) are **not on this surface at all**: no clip tiles, no "Transcript only" cards, no clips collection card, not in the channel list, counts or playlist. They stay in Hope's library and in the Browse tables below (Videos card, Watch cell reads "No video"). Where clips live in the Library is a later decision (section 12).
- **No custom player controls** anywhere. The player is YouTube's iframe with `controls=1`; nothing is drawn over it or imitates it.
- Dark AIMM palette, no new colours: black page, #1a1d21 surfaces, #2a2e35 pills, #12161c fields, white text, **selected = solid teal #2dd4bf with black ink** (not Kevin's sample's blue, no tint), section colours for the cards underneath unchanged.

## 2. One surface, three states (all at the top of the Library, under the page head)
1. **Channels** (idle, nothing picked): toolbar (search field + channel select), then a grid of 22 channel cards: first video's thumbnail, channel name 16/700, "N videos" 14 dim. Card = #1a1d21, radius 14, padding 10; hover = Mix Check result hover (#22262b, 1px #4f7f8c). 4 columns at 1900, 3 at 1300, 2 at 560, gap 20.
2. **Channel** (a channel picked, via card or the select): breadcrumb ("All channels / Mastering.com", All channels is a text action = the way back), header (name in the 30/500 display style, "21 YouTube videos in Hope's library", pill **Open channel on YouTube**), then the 4-column thumbnail grid, 12 at a time, pill **More videos (N)** centred under it. Video card: 16:9 thumbnail radius 10, title 15/650 (wraps, never cut off), channel 14 dim, "Added 23 May" 14 dim.
3. **Playing**: clicking any video (card, list row, Videos table Watch, Hope) swaps the grid for the player layout (section 3). The right-hand playlist is that channel's videos, so he keeps watching down the channel. The breadcrumb "All channels / Mastering.com / title" returns to the grid; "Mastering.com" returns to the channel grid.
The search field, when used from a grid state, shows matching videos from all channels as the same thumbnail grid (breadcrumb "Search / bass"); from the playing state it filters the playlist (preview `?s=search`). A pasted YouTube link loads straight into the player (Preview mode when it is not in the library: sections area says "Not in Hope's library yet" with an Add action).

## 3. Playing layout (matches Kevin's reference)
Container = the Library column (1440 at 1900). Grid `2fr | 1fr` (min 320), gap 24, areas: player / meta / desc on the left, **list spanning all three rows on the right**, so the panel is exactly as tall as the left column (the panel is absolutely positioned inside its cell, so its 494 rows can never stretch the grid).
- **Player:** the real YouTube iframe, 16:9, radius 14, black. 936 x 526 at 1900. Nothing drawn over it.
- **Title** 22/700, 20px below. **Channel row** 14 below: channel name 16/700 + "In Hope's library since 23 May" 14 dim on the left; pills on the right (44 high, radius 999, #2a2e35, hover white fill black ink): **Open on YouTube** (link out), **Copy link** (= Share), teal **Add tip at 6:42** (section 5), dim text **Close**.
- **Description box** (#1a1d21, radius 14, padding 18/20): first line "Added 23 May · Mixing techniques · Hope has 45 sections" (14/600 white), Hope's summary (15/1.65, first lines), **Read more**.
- **Playlist panel** (#1a1d21, radius 14): header "Mastering.com" 18/700 + position "9 / 21" dim, search field (52 high, radius 11, #12161c, Mix Check values), channel select. Rows scroll inside; 24 number | thumbnail 128x72 radius 8 | title 14/650, channel 12, "Added 23 May" 12. Hover = #22262b + 1px #4f7f8c. **Current row = solid teal #2dd4bf, black ink, a plain black play triangle in the number column.** The list scrolls the current row into view on load. Rows lazy-load thumbnails and the list must be virtualised (494 at most, 92 in the largest channel).
- **Narrow:** at 1300 the Library column is 872 wide, still above the 820 breakpoint, so it stays two columns (player 528, panel 320 minimum; tight but readable, see `play-1300.png`). Under 820 (560 window) it becomes one column in the order player, title and channel row, **playlist panel (fixed 560 high)**, description; the pills wrap and thumbnails shrink to 104. Channel and video grids go 4 / 3 / 2 columns at 1900 / 1300 / 560.
- Under the widget: **Hope on this video** (full width, 22/700 heading, two boxes): *Sections* (time, title, summary, "Play from here", current section teal; times labelled approximate until timestamps exist) and *Tips on this video* (orange for yours, purple for Hope's pending, Play). This is Hope's knowledge, a direct add-on, not a control; it only calls `seekTo` from labelled rows.

## 4. What the Elfsight widget shows versus what AIMM can show (honest data)
What we hold per video (checked in `docs/knowledge/index.json`): video id, title, channel name, date added (`ingested`), chunk count. **We do not hold** duration, views, published date, description, likes, comments, channel avatar, banner or subscriber counts. (The Worker's `/kb/user-videos` and the Find results may carry duration and views for newly added videos; not checked here.)
| Element | Tier 0 (buildable now, no key) | Tier 1 (YouTube Data API key) |
|---|---|---|
| Thumbnails | Shown, free: `https://i.ytimg.com/vi/<id>/mqdefault.jpg` | same |
| Title, channel name | Shown | same |
| Date | "Added 23 May" (date added to Hope's library, not the YouTube publish date) | Published date |
| Duration badge on thumbnails | **Dropped** | Shown as plain white text on the thumbnail (no chip, no box) |
| Views | **Dropped** | "48K views" in rows and cards |
| Description box | Hope's summary and category (what AIMM holds); YouTube's own description is not shown | Optionally YouTube's description under Hope's summary |
| Channel avatar, subscriber count, banner | **Dropped** | avatar, banner and counts via `channels.list` |
| Subscribe button | **Dropped** (cannot be done in-app, would only link out) | stays dropped; "Open channel on YouTube" is the link out |
| Likes, comments pills | **Dropped** | Shown as pills that link out (`&tier=1` preview) |
| Share | "Copy link" (copies the watch URL) | same |
| "Open channel on YouTube" | v1: link to YouTube search for the channel name; better: `author_url` from oEmbed, verified for one video today (`https://www.youtube.com/@masteringcom` for P3-gKGjo9iU) through a Worker proxy (browser CORS not checked) | channel url from `channels.list` |
Data API cost, from memory (not re-fetched): `videos.list` takes 50 ids per call at 1 quota unit, so the 494 videos need about 10 calls, and `channels.list` one call for 22 channels, against a free 10,000 units a day. Getting a key means a Google Cloud project, a manual step for Kevin unless an agent can do it through an API or connector (his zero-manual rule): open decision.

## 5. Add a tip (the one action YouTube cannot give)
Teal pill in the channel row (Mix Check "Capture" values: teal #2dd4bf, ink #0b0d10, 750 weight, disabled = #1a1d21 fill, #2a2e35 border, #9ca3af ink). Press: `getCurrentTime()`, `pauseVideo()`, and the description box turns into the composer ("Tip at 6:42 on {title}", text area, **Save at 6:42** teal, Cancel; preview `?s=tip`). Save files a Note ("Written by you", the video's category, pinned `video_id` + `t_seconds`) and resumes playback. It reads the player and draws nothing over it. Not playing (fallback): the pill reads "Add tip" with an optional typed time.

## 6. Embed rules and parameters (re-checked, unchanged from revision 3)
Embed URL `youtube-nocookie.com/embed/ID`; age-restricted and "Allow embedding off" videos cannot embed; **a Referer is required** (error 153 without one; address-bar opens and `file://` fail), so keep `referrerpolicy="strict-origin-when-cross-origin"`. Parameters: `controls=1`, `enablejsapi=1`, `origin=location.origin`, `rel=0` (same-channel suggestions only), `playsinline=1`, `autoplay=1` only after a click or a Hope tool call, `start`/`startSeconds` for Play from here; `fs` and `disablekb` left at default; `modestbranding` not set (deprecated, no effect); `cc_load_policy`, `iv_load_policy`, `color`, `hl` not set. iframe `allow="autoplay; encrypted-media; picture-in-picture; fullscreen"`. The preview adds `mute=1` only so the frame can play unattended. The API Terms were not read; nothing is drawn over the iframe.

## 7. Fallback, dock, leaving the tab
- **Cannot embed** (`onError` 100, 101, 150, 153, 5, or no ready event in 3 seconds): YouTube draws its own message inside the frame (the preview forces an unavailable id, so that is YouTube's real "Video unavailable" screen). Our line under the channel row says "This video cannot be played here. Open it on YouTube." with the existing Open on YouTube pill; Hope's section rows become "Open at 5:53". The id is remembered so its card and row show "Opens on YouTube".
- **Dock:** the same iframe (never reparented) moves to the bottom left of the main column when the stage scrolls out of view or another tab opens, 384 x 216 (above YouTube's 320 x 180 floor), black card with 1px #2a2e35, radius 14, title and two actions underneath (teal **Back to Library**, dim **Close**). YouTube's controls are inside the video. It keeps playing (recommended); starting Mix Check or stem playback pauses it and vice versa.

## 8. Hope voice (tools needed, none built)
`play_library_video({video_id?, query?, start_seconds?, section?, channel?})` (loads the player, picks the channel playlist), `control_library_player({action, seconds?})` (play, pause, seek, next, previous, close), `show_library_channel({channel})` (opens the channel grid), `get_library_player_state()` plus a "Now watching" line in `get_context`, and `add_knowledge_note` gaining `video_id` + `t_seconds`. `search_yt_knowledge` and `read_yt_knowledge` need `start_seconds` (Tier 2: re-read the 494 transcripts with timestamps, VPN needed). A Hope-started play may be blocked by browser autoplay; the iframe then sits cued showing YouTube's own play button and she says it is queued. Tool descriptions are Markey's territory.

## 9. Rest of the Library (unchanged order and colours)
Page head, the surface above, Add to Hope's library (blue), Hope's review (purple), Browse: Videos (pink; last column **Watch**, "Watching" with a teal title for the loaded video, "No video" for non-YouTube items; filter line All 739 / YouTube 494 / No video 245), Notes (orange), Saved chats (yellow). Pinned tips and notes show "Pinned to {title} at 6:40" with a Play at 6:40 text action. Add-results rows: Open video becomes Watch (Preview mode).

## 10. How the real player was rendered
Screenshots were taken with headless Chrome driven over the DevTools protocol against `http://localhost:8768/jules-library-player/preview.html` (page and iframe served over http, so a Referer is sent), with a real embeddable library video, `P3-gKGjo9iU`, `autoplay=1&mute=1&start=402`, an 11-second wait and a mouse move over the iframe so YouTube's own controls show. Notes: Chrome's plain `--screenshot` mode captured the iframe black (it snapshots before the iframe paints), `file://` would give error 153 per the docs, and the first attempt at `--virtual-time-budget` also failed; the DevTools route works. The claude-in-chrome connector was not available. oEmbed returned HTTP 200 (embeddable) for all 55 ids tried (41 sampled library ids and 14 well-known videos), so I could not find a real "embedding disabled" video to render; that screen is not shown, the unavailable-video screen stands in for it.

## 11. Screenshots (all in `shots/`, real YouTube player rendered over http://localhost)
Viewed at 1900, 1300 and 560: channels, channel, play, fallback, dock (15 files). Viewed at 1900: search, tip, tab, channel-tier1, play-tier1 (5 files). Two caveats: (a) the first full run showed `play-1300` and `fallback-1900` with Chrome's "unexpectedly closed the connection" instead of the player (a transient network failure during batch runs); I fixed the preview, re-ran everything and viewed the replacements, which render correctly. (b) In the final re-run I did not re-view `channels-*`, `channel-1900`, `play-1900`, `dock-1900` and `tip-1900`; I viewed identical-code renders of them in the run before (the later changes touched only the search filter, the fallback caption and the narrow Hope boxes, none of which appear in those files). The `fallback` shots show YouTube's own "This video is unavailable" screen from a deliberately invalid id; a real "embedding disabled" screen was not reproduced.

## 12. Open decisions
1. Where the 245 non-YouTube items (Mix With The Masters clips, full recordings, one manual) live in the Library: they stay searchable by Hope and in the Browse tables for now. Kevin to decide later.
2. Data API key: add one (duration badges, views, publish dates, likes and comments links, channel avatars) or stay at Tier 0 (thumbnails, titles, channel, date added). Creating the key is a manual Google Cloud step.
3. "Open channel on YouTube": search link now, or `author_url` through a Worker oEmbed proxy (needs a CORS check).
4. Timestamp backfill of the 494 transcripts (exact "Play from here", Hope can say "at 3 minutes") now or later; until then times are marked approximate.
5. Dock keeps playing on tab change (recommended) or pauses.
6. Search from the grid: results grid across all channels (recommended) or filter the current channel only.
7. Mic bleed from the video into Hope's mic during a call (not tested): headphones assumed or auto-pause on call start.
8. Where to remember watch positions and non-embeddable ids: localStorage or Worker.
9. Whether the channel grid shows all 22 channels at once (recommended, 6 rows at 1900) or the 12 largest with More channels.

## 13. For Codex
Group `docs/knowledge/index.json` by `channel` for the channel grid (22 channels, 494 videos; user-added videos from `/kb/user-videos` merge in by `video_id`). One iframe in a fixed host layer, read-only 500ms polling while `getPlayerState()` is 1, `seekTo` only from labelled rows. Lazy-load thumbnails, virtualise the playlist. Grep the built markup for anything that plays, pauses, scrubs or shows elapsed time outside YouTube's iframe (the only allowed time text is labels: "Add tip at 6:42", section times, "Section starts"). Do not touch the Hope rail. Bump `AIMM_BUILD`.
