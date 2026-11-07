# LOCKED PLACEHOLDER — Mix Check stems, build 2026-11-07.22

Commit `531d9666` on branch `locked-build-22`, tag `locked-2026-11-07-build22`. This is the version the user approved for the blue stem line. Do not overwrite it. Any further work goes on a new branch from this one.

## What this build does (approved)
- **Blue stem line, paused, all six stems, Flat:** calibrated to the full-sum reference (full-sum offset from the 250 Hz to 3 kHz mean, so the middle sits at 0 dB). Measured within about 0.6 dB of target at 20, 100, 250, 1k, 3k, 8k and 16 kHz (target = full-sum reference + 23.2 dB: +9.3, +18.1, +10.9, +0.2, -11.0, -13.1, -21.3 dB).
- **Orange dashed (muted stems):** approved by the user as working with stem playback in this build ("Perfect, we finally got there", 7 Nov 13:48).
- Stem colour: blue only in this build. The white live line is still present in this build; the user later asked for it to be removed (not in this build).
- The Flat target, the Spotify purple/green changes and the white-line removal are NOT in this build. They are on branch `revert-approved-blue` and on `restore-blue-approved` (see below).

## Known limitations at this build (do not treat as bugs introduced later)
- **Full song with no stem selected:** the blue line is not drawn. The chart needs a selected stem or group. This gap was present from the start of the calibration work.
- **Jagged line:** the stem curve is drawn from 512 log bands point to point, so it looks jagged. The user wants it smooth, like the earlier 64-band look. Smoothing is NOT in this build.
- **Stem upload and clear:** once stems are loaded the "Drop / browse WAVs" control is hidden by a CSS rule (`#refDzLoaded:has(#mcStemStack:not([hidden])) #mcInput{display:none!important}`), and there is no clear control. The page has to be refreshed to change stems. Not fixed in this build.
- **Spotify:** not testable on localhost (Spotify login only works on aimixmasters.com). Not verified in this build.
- Orange: drawn for the unselected remainder in stem view. Not confirmed live during playback in this build.

## Where the other work is
- `restore-blue-approved` (commit `fc3d76a4` and later, `45b7f8a7`): built on this build; adds Full song blue group and paused-Flat blue path. Verified paused within about 1 dB; playing values did not pass a same-moment check at the time.
- `revert-approved-blue` (commit `7ac81ceb`): this build plus the white-line removal and Spotify green. Used for the preview on port 8765 at the time of handover.
- Two-day-old build `2026-11-06.289` (commit `7d55d11c`): the version the user reported stems working on; its code is in commit `7d55d11c`.

## How to reopen this build
- Worktree: `git worktree add <path> locked-2026-11-07-build22`, then serve the folder with `python3 -m http.server <port>`, and open `/standalone/assets/index.html`.
- Check the build label reads `2026-11-07.22`.

## Rules
- Do not push or deploy without the user's explicit go.
- Test in the preview with the user watching before any "fixed" claim.
- Give numbers only after measuring the same state the user is testing.
