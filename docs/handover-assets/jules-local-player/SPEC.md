# Library local video player, YouTube-embed look (Jules, 24 Nov 2026) - design only, nothing built

Review it: `http://127.0.0.1:8792/` (the live Library page mock, 3 MWTM rows at the top of the Playlist). Stand-alone copy: `http://127.0.0.1:8792/preview/preview.html`. Both need a server with HTTP Range (R2 has it; `python3 -m http.server` does not, and seeking breaks).
Files here: `local-player.css`, `local-player.js` (the whole player), `roboto-latin-wght.woff2` (Roboto, OFL, 37 KB), `sample.mp4`, `shots/`.

## Goal (Kevin, 24 Nov)
Selecting a Mix With The Masters row swaps `#libPlayerFrame` to our own player with no visible change from the YouTube embed. The YouTube iframe code is untouched.

## Playlist and page (all existing UI, unchanged)
MWTM items are ordinary rows: rank, thumbnail, title, channel "Mix With The Masters", "Added 21 Nov", current row highlighted teal, count "1/3". They appear in the channel filter like any channel. Title, channel row, Open and Copy buttons, and the description box under the player are the existing ones. For a local item only the button text changes: "Open on YouTube" becomes "Open recording" (opens the file), Copy link copies the file link. Data needs: `video_id` (any unique id), `title`, `channel`, `added`, thumbnail, `src`.

## Swap contract
`AimmLocalPlayer.attach(frame)` once. `lp.show({id,title,channel,src,autoplay})` adds class `is-local` to the frame (iframe and failure card hidden by CSS, our layer shown instantly, black to black, no fade). `lp.hide()` pauses, clears the video, removes `is-local`; the existing YouTube path runs unchanged. All our classes are prefixed `lpl-` because the page already uses `.bar`, `.prog`, `.row`, `.menu` etc. (that clash broke the first try).

## Look (YouTube embed, per Kevin's reference)
- Top left: title (Roboto 500, 18px, white) and channel under it (13px, 75% white) on a top gradient.
- Big centre play: YouTube's rounded rectangle 68x48, dark 80%, turns red #f00 on hover, white triangle. Replay icon at the end.
- Progress: 3px track (5px on hover), buffered white 40%, hover preview white 50%, played RED #f00, red 13px dot on hover, dark time bubble.
- Bottom left: play/pause, volume (slider slides out, white fill), time `0:00 / 33:15` (13px). Bottom right: settings, picture-in-picture, fullscreen. Bottom gradient black 80% to clear. Icons are Lucide (house rule), white at 90%, no boxes, no scale on hover.
- Settings: dark panel (28,28,28 at 92%), radius 12, 13px, "Playback speed" then 0.5 to 2, white tick on current.
- Sizes follow the frame width: under 900 bar 48px / time 13 / title 18; 900+ bar 54 / 14 / 21; 1400+ (fullscreen) bar 60 / 16 / 26.
- Colour rule: red only INSIDE the player. The rest of the page stays teal. Keyboard focus ring inside the player is still teal 2px.
- Font: Roboto (what YouTube uses), self-hosted. Page text elsewhere stays Inter.
- Motion: 90/140/200/280ms tokens, opacity and transform only, reduced motion respected.

## Behaviour (same as before)
Controls hide 2.5s after the last mouse move while playing (3px red line stays); show on hover, pause, menu, scrub, keyboard focus. Click video = play/pause, double-click = fullscreen. Keys: space/k, j/l 10s, arrows 5s, up/down volume, m, f, 0-9, Home/End, `,` `.` frame step (assumes 30fps), `<` `>` speed. Keys are caught first so the page's own space shortcut does not also fire. Resume per video (`aimm.mwtm.resume.<id>`, kept between 5s and length minus 10s). Volume and speed remembered. Spinner after 250ms wait. Error card with "Try again".

## Build notes for Codex (through Jacob)
1. Add `local-player.css/js` content to index.html (single file rule), scoped as is. Self-host Roboto like Inter.
2. In `libPlayerVideos/Select/Copy` branch on item type (see the glue at the bottom of the mock `index.html`, `mwtm-mock` folder). Do not change the YouTube branch.
3. R2: Range support, signed short-lived URLs.
4. Icons: the module carries its own `lpi-*` Lucide symbols; map to the shared sprite when building (new ones: volume-x, maximize, minimize, picture-in-picture-2, loader-circle).
5. Update `docs/CLAUDE.md` (it still bans custom players and says MWTM is not in the Library), bump `AIMM_BUILD`, update DASHBOARD.html. MWTM hosting rights question is still open.
6. Thumbnails for MWTM rows need real images (mock uses flat colour).

## Verified (real Chrome, real mouse and keys, 1500 and 560 wide, inside the Library mock)
Row shows with date and teal highlight, count 1/3, filter lists the channel, big play click, auto-hide, hover bubble, click seek, keys, space (no page side effect), speed menu (scrolls at 560), volume slide-out, double-click and f fullscreen state, swap between rows, swap to a YouTube row and back (iframe returns, `is-local` removed), no page errors. 1400px tier checked by resizing the frame.
NOT verified: how fullscreen looks (headless cannot show it), real picture-in-picture, touch, Kevin's exact YouTube screenshot (I do not have it; built from YouTube's embed as I know it, please compare).
