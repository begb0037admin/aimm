# Brief: test how accurate AIMM's Tempo reading is (13 Nov 2026)

For a session on the Mac mini. Read-only test. Nothing is deployed and the live app is not changed.

## Working rules (from Kevin)
- Kevin is dyslexic: one short action at a time, no long explanations. Say preview-only vs deployed, with the build number.
- Codex makes any edits (gpt-6.1-sol, medium). Jules reviews any design. Kevin approves before anything goes live.
- Do not edit `standalone/assets/index.html` in this task.
- Do not print localStorage into chat. Do not commit audio files.
- Do not ask Kevin to copy/paste anything. Find files and tools yourself.

## Why
Kevin doubts the Tempo tile. On 13 Nov 2026 the same song read 77 BPM on the MacBook and 105 BPM on the mini. Kevin believes the real tempo is about 154 (trap, so a double-time feel). 105 is not a half or double of 154. It is roughly two thirds of it. So the estimate may be unstable, not simply "half-time".

Build live: 2026-11-13.08. Spotify audio-features is 403 for this app, so the page uses its own estimators.

## The two estimators (in `standalone/assets/index.html`)
- `mcEstimateTempoLocal(buf)` around line 23712: the page's own estimator for captured audio. It has a prior centred on 110 BPM, scores 1, 2 and 4-beat repeats, and penalises tempos outside about 70-160.
- `mcDetectTempo(buf)` around line 23693: uses the `web-audio-beat-detector@8.2.39` library from esm.sh, with an 8 second timeout.
- Not yet confirmed: which one the Capture button uses. Trace this first and report it.

## Steps
1. Trace which estimator the Capture path uses. Report it in one line.
2. Ask Kevin for 8 to 10 songs where he is sure of the tempo. Cover trap, pop, slow R&B, and at least two very fast and two very slow tracks. He gives title plus BPM. The audio files should be local on the mini; find them yourself if they are in his music folders, otherwise ask for the folder once.
3. Have Codex build a standalone test page (preview folder, for example `~/aimm-previews/tempo-test.html`, not in the repo):
   - It decodes each audio file with the Web Audio API.
   - It runs both estimators on the same decoded buffer, copied unchanged from the live file.
   - It also runs each estimator on a 10 second slice from three different points in the song, to measure stability.
   - It shows a table: song, known BPM, estimate per estimator, and a label: exact (within 2 BPM), half, double, two-thirds or three-halves, other, or none.
4. Open the page in Chrome on the mini. Take your own screenshots. Do not ask Kevin to run it.
5. Report: how often each estimator is exact, how often half or double, how often wrong, how often it gives none, and how much the answer changes between slices of the same song.
6. Stop. Give Kevin a one-line recommendation: fix the estimator, switch to the library, add a x2 / ÷2 button, or just label the tile "approx" and lean on tap tempo. Kevin decides before any change.

## Out of scope
- Changing the live app or deploying anything.
- The coach chat bug "activeToolNames is not defined" (`standalone/assets/index.html:16371`). It is separate and Kevin chose to leave it for now.
