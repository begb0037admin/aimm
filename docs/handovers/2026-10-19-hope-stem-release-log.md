# AIMM Hope and stem release log — 2026-10-19

## Hope voice cost controls — build `2026-10-19.52`

- Commit `3bd99c0` aligns the OpenAI Realtime path with the shared persisted idle-call control. The previous silence watcher ended Realtime calls after about 9 seconds even when the control was off; it now respects opt-out and its visible countdown aligns with the 2-minute idle cutoff. Turning the setting off cancels an active Realtime countdown, and each tick rechecks the setting before ending a call. During assistant playback, the silence watcher remains active until the response drains.
- Active PTT/recording and assistant response playback are excluded from the shared auto-end timer. PTT press/release resets the idle clock and warning state.
- Existing ElevenLabs behavior remains: spoken replies target 12–25 words by default; call-start context stays compact and detailed app/plugin/research context is fetched on demand.
- Prior comparison baseline: 94 seconds, 926 credits (691 voice/platform; 235 LLM). No post-change savings claim until a comparable call is measured.
- Build `.52` committed to `main`; a fresh load of AIMixmasters.com confirmed `.52` live. A comparable voice call is still needed to measure savings.

## Spectral Balance visual alignment correction — build `2026-10-19.37`

Kevin clarified that the outstanding issue was the visual: Spectral Balance ended above the neighbouring panels. The earlier `.32` `align-self:stretch` change did not span the empty Fix Queue grid row, which Audio Specs already spans. Build `.37` makes the desktop analyser span both rows when the queue is empty. Mobile layout is unchanged. Hosted visual verification is pending.

## Hope transcript height correction — build `2026-10-19.39`

Kevin reported that accumulated Hope messages made the page grow into an endless scroll, pushing the workbench out of alignment. The desktop Hope rail now uses size containment and a zero minimum height, clipping its outer overflow; the transcript owns the scroll area and the composer remains fixed at the bottom. The rail stretches to the app row. This release includes the `.37` Spectral Balance alignment. Markey's read-only review confirmed the inner flex/scroll chain and identified the outer intrinsic row sizing risk, addressed with `contain:size`. GitHub Pages is currently queuing deployments; hosted visual verification is pending.

## Spectral Balance plot height — build `2026-10-19.40`

Kevin clarified that the blank area below the LOW/MID/HIGH cards should be used. The canvas wrapper now flexes to occupy the available height in the Spectral Balance card; the three readout cards remain anchored at the bottom. This release includes the `.39` Hope rail containment and `.37` panel row-span fixes. GitHub Pages is currently queuing deployments; hosted visual verification is pending.

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

## Hope panel alignment and Fix Queue request failure — 2026-10-19

Build `.30` changes the desktop Hope rail to stretch to the app column's content height so its bottom aligns with the Mix Check panels and Fix Queue. Chrome confirms `.30` is live on AIMixmasters.com.

The screenshot's “Request failed: Failed to fetch” on **Ask Hope about this** was caused by the production origin missing from the `aimm-proxy` CORS allowlist. Commit `8aceee4` added both `https://aimixmasters.com` and `https://www.aimixmasters.com`; the correction was deployed from Cloudflare Quick Edit as active version `dc296fab`. Afterward, a typed Hope request from the live app returned `connected`, confirming production-origin requests now reach Hope. The exact Fix Queue card context still needs checking with stems loaded.

## Hope panel alignment — build `2026-10-19.30` (live)

Kevin asked for Hope's chat panel to end at the same lower edge as the Mix Check panels and Fix Queue. The desktop rail no longer uses a viewport-based minimum height; it stretches to the app column's content height. The mobile overlay rule remains unchanged.

## ElevenLabs account routing — build `2026-10-19.36` (local)

Keep role identities stable and independent of plan names: Default is `agent_9001m42hnyrwedts40en5a5npapp`, and Fallback is `agent_2601kqm4g7txfsvv0pkvpe02389p`. Select Fallback for normal sessions for now; if Fallback returns a clear exhausted-credit/quota signal, try Default once. Generic network errors do not trigger failover. Kevin granted microphone access and spoke with the Fallback agent, confirming it responds. Build `.35` briefly swapped the role IDs; `.36` corrects the identities and separates active selection from account roles. No ElevenLabs account configuration was changed. Build `.36` awaits publication.

## Live verification — build `.31` and `aimm-proxy` CORS — 2026-10-19

Cloudflare Quick Edit deployed the two production origins to `aimm-proxy`; Cloudflare showed active version `dc296fab`. Reloading AIMixmasters.com displayed build `2026-10-19.31`. A typed request from the production app received Hope's `connected` reply. The specific **Ask Hope about this** request needs a final check with the user's stems and Fix Queue loaded; the current browser verification had no audio loaded. The quota-exhaustion failover also remains untested.

## Spectral Balance panel alignment — build `2026-10-19.32` (local)

Kevin's screenshot showed the center Spectral Balance card ending above the Audio Specs and Hope panels, leaving a black gap underneath. The analyser column and its card now stretch to the shared grid row height, while the plot itself grows to use the extra vertical space and the LOW/MID/HIGH cards stay at the bottom. This change is local and awaits hosted visual verification; the current browser view had no stems loaded.


## Hope voice call-start context reduction — builds `2026-10-19.43` through `2026-10-19.46`

**Correction to the .43 record:** .43 removed the separate library and full app-reference digests, but the long RT_INSTRUCTIONS prompt and research digest were still included in every ElevenLabs call. The previous note that the full app manual was no longer sent overstated the reduction.

**.44 change:** Commit 9fc449c replaces that oversized start context with short voice guidance, the compact live mix summary, and a profile capped at 800 characters. The long runtime prompt and research digest are no longer sent at call start. The compact current-mix state remains; detailed app, plugin and spectral facts are still available through Hope's on-demand tools.

**.45–.46 follow-up:** Tool descriptions and returned state now make plugin/app retrieval explicitly on demand. YouTube research instructions no longer tell Hope to search every mixing question; they reserve searches for named sources or questions the live measurements and existing knowledge cannot resolve. The stale voice-prompt comments now match the actual payload.

**Usage baseline before .44:** One 94-second call used 926 credits total: 691 voice/platform credits and 235 LLM credits. This is the comparison point; measure another similar call on .46 before claiming a reduction.

**Release state:** .46 (`3318384`) is committed to `main` and live. Chrome loaded `https://aimixmasters.com/?verify=202610192046b` and showed build `2026-10-19.46`.

## Hope voice cost reduction — build `2026-10-19.49`

**What changed:** Hope's ElevenLabs start guidance now targets 12–25 spoken words for a normal reply while allowing more detail when Kev asks. The existing idle-call setting now also applies to ElevenLabs; calls show a warning at 1m45s and end after 2 minutes without a completed conversation turn. It is enabled by default for users without a saved preference and preserves an explicit opt-out. This closes the gap where the earlier auto-pause only watched OpenAI Realtime.

**Cost facts:** ElevenLabs voice-only agents are charged per call minute at the plan rate; current Creator pricing lists $0.08/minute for additional minutes. ElevenLabs documents a 95% discount for silence longer than 10 seconds. Changing the agent voice model does not lower the standard per-minute rate. The last measured 94-second call cost 691 voice/platform credits and 235 LLM credits (926 total). The next comparable call on .49 is needed to measure the actual reduction.

**Release state:** .49 (`b6c97ac`) is committed to `main`; hosted verification pending.

References: [ElevenAgents pricing](https://elevenlabs.io/pricing/agents), [voice-call billing and silence discount](https://elevenlabs.io/docs/help-center/product/eleven-agents/how-much-does-eleven-agents-cost).
