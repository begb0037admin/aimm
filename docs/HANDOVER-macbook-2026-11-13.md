# Handover to a new session on the MacBook (13 Nov 2026)

Read this first. Kevin is dyslexic: give one short action at a time, open images with `open`, say deployed vs preview-only plus the build number. Codex makes edits (gpt-6.1-sol, medium), Jules reviews design, Kevin approves each deploy.

## The problem to solve
Kevin loaded AIMM on his MacBook (Chrome). Build string is correct (2026-11-13.08) but "none of our recent additions are working". Kevin said it "does not seem to work on any mac machine". This must be checked on the MacBook itself.

## What the Mac mini session proved (read-only, nothing changed on either machine)
- Live page is byte-identical on mini and MacBook: md5 0117b72ab5e85be97000f88f265620a4 at aimixmasters.com and aimm.kevinlelitte.workers.dev (fetched by curl on both). No service worker. Cache-Control must-revalidate.
- Build .08 worked live on the mini's extension Chrome (capture God's Plan, then One Dance, name followed; round purple Stop; Tempo/Key tiles first; tap tempo).
- Companion "AIMM Audio Reference Companion" is running on BOTH Macs (port 41735, answers /status with Origin https://aimixmasters.com). Binaries differ in md5 (mini built 4 Nov, MacBook 7 Nov, both CFBundleVersion 8). Not yet compared in behaviour beyond /status.
- MacBook Chrome 157.0.8103.51. Profiles: only "Person 1" (Profile 12) has loopback_network=Allow for https://aimixmasters.com and a saved Spotify token (aimm_spotify_oauth_v1) and the newest history (13 Nov 20:30). Profile 16 also has AIMM storage (12 Nov) but no Spotify token and no loopback setting.
- Could NOT see Kevin's screen: SSH screencapture fails ("could not create image from display"), headless Chrome over SSH returned empty, MacBook Chrome is not in the Claude-in-Chrome extension list.

## Next steps (in order)
1. Ask Kevin which Chrome profile the AIMM tab is in (should be Person 1) and for a screenshot of the page, or what looks wrong first.
2. In that Chrome on the MacBook: hard refresh (Cmd+Shift+R); look for "AIMM · build 2026-11-13.08" at the bottom of the left panel; Audio Specs should have Tempo and Key tiles first; button says "Capture"; Stop is a round purple button.
3. If the tiles/buttons look old: it is the tab/profile, not the build. If they look new but Capture fails: check Chrome Site settings for aimixmasters.com, Loopback network = Allow, and the companion is open. If names are wrong: check Spotify sign-in in that profile and old saved targets in localStorage key aimm_mc_spotify_reference_targets_v1 (do not print localStorage into chat).
4. Use the Claude-in-Chrome extension on the MacBook if it is connected there, to test the live site directly (see memory file project_aimm_spotify_purple_target_2026_11_13.md for the test technique).

## Still open from the Spotify arc (after the MacBook issue)
- Stem view: needs the smooth purple band + 1px outline with the blue stem line on top (refDrawCanvas stemView branch ~line 21800 still draws the old haze band).
- Verify the stems "Key · —/— BPM" line fills from the Tempo/Key tiles with stems loaded.
- Repeat captures create duplicate saved targets (offer replace-or-ask).
- "Open Spotify" still shows in normal song search results.
- Tempo estimate is within a few BPM and can give none; the teal Tap tile is the fallback. Spotify audio-features is 403 for this app.

## Release recipe and rollback
Copy reviewed preview over standalone/assets/index.html, bump AIMM_BUILD, syntax check, commit, push main, `npx -y wrangler@4.161.0 deploy` from aimm/standalone, verify build on both URLs, record in docs/STATUS.md. Rollback chain for builds .06-.08 is in docs/STATUS.md (.08 = commit b441640d, Worker e0f388e5; rollback to 368e1f27 / bf1467da).
