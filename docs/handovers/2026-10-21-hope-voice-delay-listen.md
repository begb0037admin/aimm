# Hope voice delay and selected-reply Listen handover — 2026-10-21

## Where to resume

- Repository: `/private/tmp/aimm-hope-luna-rollout`
- Current diagnostic branch: `codex/hope-luna-timing-diagnostic-20261021` (based on PR #46 head; PR #46 itself is unchanged)
- Feature branch: `codex/hope-luna-route-wiring-20261021`
- Live site: `https://aimixmasters.com`, build `.58`
- Selected-reply Listen implementation: PR #46, branch above; not merged or deployed.
- Current user report: the Luna route still has a very long delay and Hope cuts off before finishing. Kevin stopped the investigation and wants to continue in a new chat. The immediate request here was to update files, logs and handover; no new delay investigation or release was performed in this docs pass.

## Diagnostic instrumentation checkpoint — 2026-10-21

The diagnostic branch adds opt-in console trace markers enabled by `?hopeLunaTrace=1`: microphone capture start; Deepgram final turn plus transcript character count and age of the last audio chunk; Luna request start/headers/first text delta/completion (including returned model and response ID); AIMM tool start/end; ElevenLabs TTS request/headers/body completion; first `playing` event; and each audio segment's natural playback end. No transcript text, credentials, tool arguments, or free-form provider error text are logged; failures record only event names, error classes and response statuses. It also fixes a missing `+` in the voice-route tooltip on the PR branch; that source error prevented the whole inline application script from parsing.

`git diff --check` passes and both inline JavaScript blocks parse with Node. This branch is not deployed. A live spoken turn was not run: no browser or signed-in UI session was available to this session. Therefore there is still no complete Luna timing trace, successful completion after the reported cut-off, or new provider/cost evidence. PR #46 remains open and unchanged.

**Exact next action:** the diagnostic branch's local static server is already running at `127.0.0.1:8765` (PID 13008). Open `http://127.0.0.1:8765/?hopeLunaTrace=1` in the authenticated browser, set the existing Hope speech access token in AIMM Settings for that local origin if needed, allow microphone access, and make one complete Luna turn. Save the `[Hope Luna trace]` console entries, including the returned model and every TTS segment's `playing`/`playback_complete` pair. Use that trace to diagnose the delay before changing route behaviour. Do not deploy the diagnostic branch or merge/release PR #46 during this step.

## Current route and known behaviour

On the hosted `.58` app, **Agent** uses the existing ElevenLabs Live Agent and **Luna** uses Deepgram Flux → GPT-6 Luna → AIMM tools → ElevenLabs Flash. The Live Agent remains the default for a new browser. A spoken Luna test passed earlier, but that result does not supersede the later report of poor latency and incomplete speech.

Fallback ElevenLabs agent settings were changed to `max_tokens: -1` and temperature `0`. Kevin still reported that the delay remained. These settings were not shown to fix the separate AIMM Deepgram/Luna streaming path.

## Evidence to preserve

- `conv_2301m5ent5vte5p9mw6tnnjvq8gb`: Luna attempt failed after about 5.87 seconds; the agent fell back to Gemini 2.5 Flash; TTFB was about 7.87 seconds. The reply transcript ended mid-thought. Treat this as a failure/fallback example, not as acceptable Luna performance.
- `conv_4201m5erevmpfe18qc8wvxqrxzj3`: 15 seconds, 112 credits, client disconnected with code 1005, 0 TTS output seconds/characters and no LLM usage. The record shows only the repeated user utterance. It cannot establish a successful reply, its latency, or any cost comparison.
- No complete, timed reply after the Fallback-agent setting change has been recorded. No new-route cost or savings comparison has been established.

## Selected-reply Listen request and branch state

Kevin's exact interaction: click one Hope speech tile; that tile becomes visibly selected with a muted-purple highlight; press Listen; Hope speaks only that selected tile in her own voice. Do not autoplay all replies and do not play the latest reply by default.

The implementation is in branch `codex/hope-luna-route-wiring-20261021`, commit `2c5d43b` (“Let users listen to selected Hope replies”), PR #46. It was merged locally with current `origin/main` (`94aa06b`) as `c4ee9fe`; the hosted page remains build `.58` and still shows the mute control. Do not describe this feature as live. Review/merge/deploy and hosted verification remain outstanding.

## Next steps when Kevin resumes

1. Follow the local diagnostic step above and capture one complete spoken Luna turn, including microphone/Deepgram, Luna, tool, ElevenLabs, first-audio and playback timestamps. Record the actual returned model or failure; the current `/hope/luna` Worker calls GPT-6 Luna directly and does not implement a model fallback.
2. Diagnose the delay/cut-off using that completed trace. Do not change the working Agent route or claim improvement without a successful repeated test.
3. Review PR #46, release it when ready, and verify on the hosted AIMM page that clicking a Hope tile selects only it with the muted-purple highlight and Listen speaks only its text in Hope's voice.
4. Only after both behaviour and timing are verified, update the deployment record and compare actual provider usage for the same call pattern. Keep allowance credits and separate Deepgram/OpenAI charges distinct.

## Files updated for this handover

- `DASHBOARD.html` — current Now card, Listen item and update footer.
- `docs/ROADMAP.md` — live route with unresolved delay, Listen PR state, and `.57` marked as historical preparation.
- `docs/STATUS.md` — call evidence, unresolved status and non-live Listen state.
- `docs/HANDOVER.md` — active cold-start checkpoint and next actions.
- `docs/handovers/2026-10-21-hope-voice-delay-listen.md` — this detailed session record.

Earlier implementation history remains in `docs/handovers/2026-10-20-hope-usage-voice-spike.md`.
