# BRIEF: build the Library YouTube player surface (build 2026-11-23.6)

Repo ~/github/aimm, branch library-bars. Keep ALL existing uncommitted Library work in the tree; do not revert files. Read docs/CLAUDE.md (note the new hard rules: Cloudflare-standalone only, YouTube player = real iframe only) and docs/UI_DESIGN_STANDARD.md first.

Build exactly what Jules designed and Kevin approved: docs/handover-assets/jules-library-player-v3/ (SPEC.md, preview.html, player.css, shots/). Kevin's words: "a YouTube player, not a channel list", clean like the Mix Check Spotify block. Follow SPEC.md for sizes, states, the 1300 and 560 layouts, and the cannot-embed state. Reuse player.css values.

Where it sits: at the top of #library under the page title. Below it, unchanged and in this order: Add to Hope's library (blue), Hope's review (purple), Browse (Videos pink, Notes orange, Saved chats yellow).

Rules (non-negotiable):
1. The player is the real YouTube iframe (www.youtube.com/embed/<id>?enablejsapi=1&origin=<page origin>&rel=0&playsinline=1) with YouTube's own controls. Build NO custom play/pause/scrub/volume control and nothing that imitates one. Use the IFrame API only to hear embed errors (show the cannot-embed state with Open on YouTube).
2. No channel grid, no sections/tips tables, no extra strips. Left: player, title, channel row (channel name, Open on YouTube, Copy link), description box with Read more. Right: Playlist panel with count, search field (also accepts a pasted YouTube link and adds it through the existing add path), a '+ Channel' filter drop-down (plus glyph, no arrow), numbered rows (thumbnail from https://i.ytimg.com/vi/<id>/mqdefault.jpg, 2-line title, channel, 'Added <date>'), current row solid teal #2dd4bf with black ink.
3. Data: use the app's real library (YT_KB and dashboard-added videos) at runtime, YouTube videos only (those with a real YouTube id). Mix With The Masters clips (no YouTube id) are NOT in the playlist. Jules's preview read 402 videos / 21 channels from docs/knowledge; the app may differ (earlier counts said 494 and 22): use the app's real data and REPORT the real counts. Never invent views, likes, durations, avatars or subscribers.
4. Description box: use the video's summary note (Notes entry whose source equals the video url) when it exists; otherwise the transcript text with front matter removed (a stand-in; say so in your report). Never show '--- title:' front matter.
5. Table rows in Videos: the existing 'Open video' link becomes 'Watch' that loads that video in the player and scrolls to it; keep the table at six columns (Title, Channel, Added, Edit, Show, Link). Clips (no YouTube id) show no Watch.
6. Hope: do not change her tools. The existing switch_tab and library behaviour keep working. Add no new voice tool in this build.
7. AIMM palette only, selected = teal, no arrows, no emoji, no highlights, no boxes behind small markers, room to breathe, full width, rest ink var(--ink) on every text button (earlier build lost it), pill hover colours per the earlier hover-pill spec.
8. Nothing is served from a Mac or local files; it is the standalone Cloudflare page.

Verify before reporting: run node --test tests/*.test.mjs and add tests for the playlist build, channel filter, search, pasted-link, current-row and embed URL. Serve the real page (python3 -m http.server on a free port over standalone/assets, plus the symlinked docs/knowledge so the real videos load, as scratchpad/lib-serve does) and with headless Chrome take screenshots at 1900, 1300, 560 showing the real YouTube video rendering (not an error) and view them yourself. Bump AIMM_BUILD to 2026-11-23.6 and the 3 stamp tests. Do NOT commit, push or deploy. Report diff summary, real counts, test results and anything you could not see.
