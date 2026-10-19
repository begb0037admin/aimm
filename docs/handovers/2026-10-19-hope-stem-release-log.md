# AIMM Hope and stem release log — 2026-10-19

## Request

Kevin asked to make the reviewed stem-analysis work live and to check Hope against Fix Queue item `Integrated -19.9 LUFS — 5.9 dB under −14 LUFS`.

## Findings

- Hope's prompt was added to the chat, but the browser's request failed at CORS preflight because the local preview origin `http://127.0.0.1:8765` was missing from the deployed `aimm-proxy` Worker allowlist. The Anthropic key health check was green.
- The integrated-LUFS fix has no track timestamp. Hope's Fix Queue action card therefore rendered Play disabled; the main Fix Queue card also had no playback action for findings without timestamps.
- The hosted `.27` app answered the typed connection check, but no WAV was loaded. The exact `-19.9 LUFS` Fix Queue context and audible playback still need verification with the source audio loaded.

## Changes

- App build `2026-10-19.27` adds **Play mix** for untimestamped broadband fixes, starting at `0:00`. Timestamped fixes start from their absolute cue position and begin playback even if the transport was stopped or its AudioContext suspended.
- `worker/src/index.js` adds `http://localhost:8765` and `http://127.0.0.1:8765` to `ALLOWED_ORIGINS` so the local preview can use the existing key relay.
- The build ID remains visible in the app title and badge.

## Release record

- Kevin authorized publication on 2026-10-19.
- Wrangler's stored token was expired. Its OAuth login requested 29 Cloudflare account permissions; that request was declined.
- The logged-in Cloudflare dashboard shows the `aimm-proxy` Worker in Kevin's account. The local-origin CORS change was deployed through that Worker's dashboard editor; active version `1316e5dc` is shown in Cloudflare.
- Commit `9dbbd11` was pushed to `main`; the GitHub Pages app displays build `2026-10-19.27`.

## Checks

- Both inline JavaScript blocks parsed successfully; `git diff --check` passed before release.
- The hosted `.27` app loaded successfully and displayed its build ID.
- A typed request to Hope returned `Hope connected`.
- No WAV was loaded during the check. Exact Fix Queue context and audible playback remain unverified.

## Follow-up

With the source mix available, load it in the hosted `.27` app, ask Hope about the integrated-LUFS Fix Queue item and audition **Play mix** from 0:00. Verify the local preview CORS path separately if needed.


## Follow-up release — song-folder title, build `2026-10-19.28`

Kevin pointed out that `Stem mix · 6 stems` hides which song is loaded. Mix Check now has a **Browse song folder** menu option. It reads the selected directory name and displays `Folder Name · N stems`; choosing another folder replaces the current audio set. The existing multi-file import remains intact. The build ID is `.28`. JavaScript parsing and `git diff --check` passed. This release has not yet been tested with an actual song folder, so its imported title and stem analysis should be checked with Kevin's WAV folder.

## Follow-up usability correction — build `2026-10-19.29` (live)

Kevin's screenshot showed the ambiguous “Choose a WAV file for stem analysis” notice while trying to import a song folder. The folder picker was only discoverable through the small caret menu, so a visible **Song folder…** button now opens the directory picker directly. The fallback notice now tells the user to choose that button or select multiple WAV files. Commit `c890155` deployed successfully; Chrome confirmed build `.29` and the visible button on AIMixmasters.com. Kevin confirmed the folder import works.

## Hope panel alignment — build `2026-10-19.30` (pending deployment)

Kevin asked for Hope's chat panel to end at the same lower edge as the Mix Check panels and Fix Queue. The desktop rail no longer uses a viewport-based minimum height; it stretches to the app column's content height. The mobile overlay rule remains unchanged.
