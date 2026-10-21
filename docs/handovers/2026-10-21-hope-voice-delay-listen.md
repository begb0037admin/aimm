# Hope voice delay and selected-reply Listen handover — 2026-10-21

## Where to resume

- Repository: `/private/tmp/aimm-hope-luna-rollout`
- Current branch: `codex/hope-luna-route-wiring-20261021`
- Live site: `https://aimixmasters.com`, build `.58`
- Selected-reply Listen implementation: PR #46, branch above; not merged or deployed.
- Current user report: the Luna route still has a very long delay and Hope cuts off before finishing. Kevin stopped the investigation and wants to continue in a new chat. The immediate request here was to update files, logs and handover; no new delay investigation or release was performed in this docs pass.

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

1. Reproduce one complete turn on the Luna route and collect timestamps for microphone end-of-turn, Deepgram transcript/final turn, Luna request start/first token/completion, ElevenLabs TTS start/first audio, and playback completion. Record which provider/model actually served the turn, including any fallback.
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
