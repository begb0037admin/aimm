# Hope usage-based voice prototype — 2026-10-20

## Deepgram Flux streaming update — build `.9` implemented, pending deploy/live check

Kevin reported the first usage route was too slow and did not display his spoken words. Build `.9` now opens a streaming microphone connection to Deepgram Flux through the AIMM Worker. Interim transcript events update the chat input; Flux's `EndOfTurn` submits the final transcript to the existing Claude/tool loop. The route uses Deepgram's conversational Flux model with a 1.6-second end-of-turn timeout and no speculative LLM request, to avoid extra tokens. The Worker keeps the Deepgram key server-side and issues a 60-second HMAC-signed ticket after checking the existing `HOPE_STT_TOKEN`. Hope's output remains ElevenLabs Flash v2.5 in her established voice. The LLM and TTS are still awaited before playback, so only inbound transcription is streaming. Build `.9` is local on `codex/hope-usage-guard-deployed-20261020`, not deployed/live-tested. No response-time or saving claim yet.

The non-expiring Deepgram key was created as `AIMM Hope realtime`, saved in the 1Password item `Deepgram API Key — AIMM Hope realtime`, and added as the production `DEEPGRAM_API_KEY` Worker Secret. No credential value is recorded here.

Next: syntax-check app/Worker code and whitespace, update release records, commit and push the feature branch, deploy the Worker streaming route, then run one brief live test. Record transcript display, end-of-turn and first-audio timings, Deepgram input seconds, ElevenLabs TTS characters/credits, Claude input/output tokens and cost, complete reply playback, and verify no Agent conversation was created. Compare those records against the Live Agent baseline at the top of this file.

## Current Usage test path

- The `Usage test` mic starts a continuous Deepgram Flux WebSocket through the AIMM Worker. Flux `Update` messages place interim words in the composer; `EndOfTurn` submits a complete transcript automatically. Hope resumes listening after her answer has finished.
- The browser authenticates to `POST /hope/stt/ticket` with the existing private `HOPE_STT_TOKEN`. The Worker returns a 60-second HMAC-signed ticket bound to the allowed app origin. The Worker authenticates upstream to Deepgram with `DEEPGRAM_API_KEY`; that permanent key is never sent to the browser. Audio is relayed in memory and not stored.
- Claude uses the existing compact voice prompt, last four text messages (900 characters each), compact live AIMM state, and intent-selected tools. It does not resend old screenshots. Spoken LLM output remains capped at 180 tokens. This is normal Claude response generation after Flux marks the turn complete; speculative generation is disabled to avoid duplicate LLM spend.
- Hope's output still uses her existing ElevenLabs Flash v2.5 voice ID `qFJ4KX1Kat5K6ywU2Rnm`; the sample recorded below was accepted by Kevin. Generated speech is not yet streamed to playback: the app waits for the LLM answer and TTS file before it starts speaking.
- The old batch Whisper endpoint remains in the Worker for compatibility but the new Usage test path no longer calls it. Live Agent mode remains a rollback option.
- Usage totals show turn count, microphone input seconds, actual ElevenLabs character credits when returned, and Claude model cost. Deepgram billed usage must be read from Deepgram's usage dashboard for the same test window; no Deepgram cost/usage comparison is claimed yet.

## Earlier `.7` routing check and baseline

Build `.7` is live on aimixmasters.com and hard-blocks Live Agent startup when Usage test is selected. The `.6` failure recorded `conv_5401m5cqcnjqet58deajj6yy5jyt` (33 seconds, 248 credits / $0.044858; 246 voice/platform credits / $0.044447; 10.72 seconds / 200 characters v3 speech; 7.08 seconds Scribe input; $0.00041154 Luna). That is not a valid Usage-test sample. The relevant Live Agent baseline is `conv_0001m5cnyz5bf2gaea39317j9epx` (156 seconds, 1,254 credits / $0.22742).

## Voice sample evidence

On 2026-10-20, one 4.64-second sample was generated through ElevenLabs' speech-generation API using voice **Hope US AIMM** (`qFJ4KX1Kat5K6ywU2Rnm`) and model `eleven_flash_v2_5`. Text: “Hey Kev, the 808 is sitting a little heavy. Pull it down half a decibel, then listen again.” Cost reported by ElevenLabs: **90.9909 credits / $0.01654**. Kevin's response: “sound good.” This confirms the sample sounds acceptable to him; it does not prove end-to-end AIMM quality or savings versus a Live Agent call.

## Earlier playback regression (superseded by the `.6` routing failure below)

Earlier read-only request to `https://aimm-proxy.kevinlelitte.workers.dev/health` returned:

```text
✅ ANTHROPIC_API_KEY — OK
❌ ELEVENLABS_API_KEY — rejected by elevenlabs (HTTP 401) — check the key value
✅ AIMM_KV — bound (captures sync ON)
```

The earlier prototype completed transcription plus a written answer; Kevin reported speech cutting off. Code review found the mic handler called the global TTS stop whenever a tap arrived during playback. That playback correction shipped before `.6`; it is separate from the later mode-routing defect documented at the top of this file. No usage saving or complete stem-control parity is claimed.

## Required live verification after the `.7` routing correction

Preflight complete on the live page: `.7` badge present, Usage test selected, mic label says “Press to record”, and the latest ElevenLabs Agent conversation remains the earlier `.6` failure; no call was created during the check. Remaining: Kevin speaks one short fixed prompt into the mic and waits for Hope's complete spoken reply. Then read the app/Worker usage for Whisper input seconds, ElevenLabs Flash characters/credits and Luna tokens/cost, and confirm there is no corresponding Agent conversation. Compare the same prompt to baseline `conv_0001m5cnyz5bf2gaea39317j9epx` (156 seconds / 1,254 credits / $0.22742). Report the actual allowance difference separately from dollar charges; only then decide whether the switch saves allowance.

## Files

- `index.html` — optional voice mode, compact chat request, local WAV conversion, dedicated TTS route, token setting and composer controls; build `.7` contains the hard Live Agent guard and shared-mic routing fix and is live.
- `worker/src/index.js` — bounded Whisper transcription route and ElevenLabs per-request cost headers.
- `worker/wrangler.toml` — Cloudflare AI and per-IP request-rate bindings.
- `docs/VOICE_PROVIDER_DECISION.md`, `docs/STATUS.md`, `docs/HANDOVER.md`, `docs/ROADMAP.md`, `DASHBOARD.html` — decision, current state and next test.
