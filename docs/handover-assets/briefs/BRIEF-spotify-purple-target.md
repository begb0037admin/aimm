# Brief: Spotify purple target line missing in Spectral Balance (AIMM)
Date: 12 Nov 2026. Origin: Jacob session on MacBook Pro. Investigation by Codex gpt-6.1-sol (read-only), key lines verified by Jacob.

## Problem
Playing a song from Spotify does not show the purple target line in Spectral Balance. It must. The current live app must NOT be broken.

## Root cause (file: standalone/assets/index.html; line numbers from MacBook copy, may shift after pull)
- mcSpotifySelectTrack (~22462-22463): finds the saved target by spotifyTrackId, then sets #refCurveTarget value='' and calls refTargetChanged(). Empty selection => refActiveCorridor (~21589) returns null => refDrawCanvas (~21779) draws live spectrum with no purple target.
- refSaveSpotifyTarget (~22228): clears the selector after saving instead of selecting the new item.
- Capture path (companion/browser): refActiveCorridor (~21575) returns curves with liveAverage:true, fromCapture:true. drawReferenceLiveAverage (~21729) returns early on fromCapture; main purple renderer (~21909) rejects liveAverage. Helper also gates point generation/positioning on !corr.fromCapture, so removing one guard is not enough.
- File playback works because refApplyLoadedBuffer (~25595) does not clear the selector.
- Codex mock-harness test: Spotify+cleared => no purple; Spotify+same target manually selected => purple; capture => no purple. Not a live Spotify reproduction.

## Scope of this task: steps 1 and 2 ONLY
1. In mcSpotifySelectTrack, keep/select the matching saved target (saved.id) instead of clearing.
2. After refSaveSpotifyTarget, select the new item via refRefreshTrackTargets(item.id) and call refTargetChanged().
Step 3 (capture curves through the purple renderer) is NOT in scope; needs draw-order check vs green live trace; propose separately.
Risks: refTargetChanged (~23021) affects spectral alignment and band comparisons. Uncaptured track has no saved curve: define fallback (do not select something nonexistent).

## Rules
- PREVIEW COPY ONLY (see ~/aimm-previews/BRIEF-preview-in-place.md for the workflow). Do not commit or change the live file/main until Kevin has seen it and approved.
- Codex does the actual edit (codex exec), not Claude. Kevin 17 Oct 2026: Codex-only on aimm, via Jacob.
- Kevin is dyslexic: no multi-step manual instructions; open the preview in Chrome for him.
- Verify before claiming done: test in the real page, report what is actually true.
