# Handover 14 Nov 2026 — companion tap, stems target band, Spotify panel fixes (live build 2026-11-14.07)

Read first. Kevin is dyslexic: one short action at a time, open images with `open`, always say deployed vs preview-only plus the build number (bottom of left panel, "AIMM · build ..."), Cmd+Shift+R to refresh. Codex makes the edits (`codex exec --skip-git-repo-check -m gpt-6-sol -c model_reasoning_effort=medium`), Jules reviews design, Kevin approves each deploy in chat. Kevin dislikes pills, noise and extra wording.

## Live now
Build **2026-11-14.07**, Worker `2c3ccc51-e351-421e-8711-88b04b63a0a5` (aimixmasters.com and aimm.kevinlelitte.workers.dev). Kevin confirmed ".07 works well" with the real Spotify player and the button.

## What shipped on 14 Nov
| Build | Change | Worker |
|---|---|---|
| .01 | Stem view draws the saved Spotify target as the purple band + outline, blue stem line on top | 84d51b60 |
| .02 | Audio Specs show the stems' own numbers whenever stems are loaded (Spotify button disabled, Spotify numbers return when stems cleared); paused stem trace smoothed to match the live line (display only) | 74e16f57 |
| .03 | Cut-off album thumbnails fixed (art button inherited the generic result-button padding/border; rule now `button.mc-spotify-result-art`) | 0b64f65f |
| .04 | White live line draws while a track player (opened by Select) is open and the companion hears sound; "Play Spotify to monitor..." / "Select a Spotify match..." placeholder wording removed | 5748e214 |
| .05 | Capture diagnostic lines (embed / currently playing / metadata / saved label) hidden; only audio problems shown | a57b98a7 |
| .06 | **BROKEN. DO NOT REDEPLOY.** Clear control + player-loading guards. Kevin lost the Spotify player. Cause unknown. | 72c58882 |
| .07 | One round purple button (same look as Stop, white square, no words) in the Spotify Reference row: clears the Spotify panel; greyed out when there is nothing to clear; during a capture it acts as the existing Stop/Cancel (separate Stop/Cancel hidden). No player-loading code touched. | 2c3ccc51 |

Rollback chain: .07 -> .05 (a57b98a7) -> .04 (5748e214) -> .03 (0b64f65f) -> .02 (74e16f57) -> .01 (84d51b60). Use `npx -y wrangler@4.161.0 rollback <version-id> -y` from `standalone/`.

## Companion (audio-reference-companion)
Core Audio process-tap companion 0.3.1 (build 10) installed on BOTH Macs (mini and MacBook), committed (`1bd37fe6`; `.build` now untracked/ignored). Captures Chrome and Spotify processes; automatic N/2 compensation for multichannel output devices (mini UA interface 10 ch = +14 dB, built-in 2 ch = 0 dB) so Audio Specs match across Macs (loudness within ~0.1 dB; true peak 0.8 dB apart, unexplained). Teal full-bleed app icon. Each rebuild of the ad-hoc-signed app needs the Core Audio permission re-granted. Untested: macOS 26, output devices other than 2 ch / 10 ch. Live line data: `/monitor/spectrum/live` (verified returning livePoints while Chrome plays sound). See `audio-reference-companion/TAP-NOTES.md`.

## Gotchas learned (important)
1. **Pushing to main can trigger an automatic Worker deployment** (seen ~36 s after a push). After a `wrangler rollback`, a push redeployed .06 over the rollback until main matched. Keep main == the build that should be live; put STATUS edits in the same commit as the code.
2. **Stub-Spotify tests are not enough.** .06 passed Codex's stand-in tests and still lost the real player. Suspects (unproven): the `embed.isConnected` guards before/inside `createController`, the search-generation counter in `mcSpotifySearch`/load-more. Reproduce with real Spotify (serve the preview as aimixmasters.com over local HTTPS in a separate signed-in Chrome profile, see memory file) before touching player-loading code again.
3. The track preview player is a plain Spotify iframe with no API listener; only the artist embed controller sets `mcSpotifyIsPlaying`.
4. `.mc-spotify-result button` generic styles out-rank `.mc-spotify-result-art`; use higher-specificity selectors for new button variants.
5. Claude-in-Chrome extension was not connected this session; testing used Codex + Chrome for Testing (`/tmp/aimm-playwright-browsers/chromium-1254`, harness in `~/aimm-previews/stems-specs-harness`).

## Open / parked
1. **Keep the playing track when Select is pressed on another row** (Kevin: "do not cut off the current playing track"). Cause: `openPreview` closes the open `.is-previewing` player before opening another. Preview `~/aimm-previews/keep-playing-preview.html` is built on broken .06 — redo on .07 and test with the real player. Approved behaviour: with a player open, Select only selects the track; with none open, Select opens the player as today.
2. Find the real cause of the .06 lost-player (see gotcha 2).
3. Codex review of the Clear diff raised: pending search/load-more can still resolve after Clear (button is a no-op while `mcSpotifySearchBusy`, guarded not invalidated); capture-save race (button acts as Stop during capture, no-op otherwise while capturing).
4. Seen but ignored by Kevin: saved label can differ from the playing song after capture ("not an issue").
5. Earlier: stems Key/BPM line check, dedupe repeat captures, "Open Spotify" in normal search, coach chat bug (`activeToolNames is not defined` ~index.html 16371), tempo accuracy test per `docs/BRIEF-tempo-accuracy-test.md` (waiting for Kevin's song list), tap companion on macOS 26.

## Preview and test files (Mac mini, `~/aimm-previews/`)
`clear-round7-preview.html` (= live .07 source), `clear-preview.html` (broken .06 source), `keep-playing-preview.html`, `clear-review-codex.md` (Codex review), `stems-specs-preview.html`, `thumb-fix-preview.html`, `live-line-preview.html`, `stems-specs-harness/` (Playwright tests), `stems-real/` (real stems + capture).

## Release recipe
Copy reviewed preview over `standalone/assets/index.html`, bump `const AIMM_BUILD` (line ~5161), add the STATUS entry, commit once, push main, `npx -y wrangler@4.161.0 deploy` from `standalone/`, verify the build string on both URLs (re-check after a minute), record in `docs/STATUS.md` and memory.
