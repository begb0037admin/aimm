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
