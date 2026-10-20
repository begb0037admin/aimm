# Hope usage-based voice prototype — 2026-10-20

**State:** Build `.7` is merged at `18607980` and live on aimixmasters.com. It hard-blocks `elStart()` when Usage test is selected, routes the shared floating/keyboard mic into the Usage recorder, and keeps the mic's accessible state consistent. Chrome confirms `.7`, Usage test selected, and “Press to record”; a fresh ElevenLabs conversation list shows no Agent call during verification. The `.6` failure is recorded: `conv_5401m5cqcnjqet58deajj6yy5jyt` (33 seconds, 248 credits / $0.044858; 246 voice/platform credits / $0.044447; 10.72 seconds / 200 characters v3 speech; 7.08 seconds Scribe input; $0.00041154 Luna). The call is done and is not a valid Usage-test sample. No savings are proven. Next: one short spoken Usage-test turn; record Whisper seconds, Flash characters/credits and Luna tokens/cost, confirm no Agent conversation, and compare with the Live Agent baseline. Do not claim a saving until those actual usage records are captured.

## What changed

- The Hope composer offers **Live Agent** and **Usage test**; build `.7` defaults new page loads to Usage test.
- Usage test records one press-to-talk utterance (maximum 30 seconds), converts it in-browser to mono 16 kHz PCM WAV, and sends it to the new `POST /hope/stt` route on AIMM's Worker. Cloudflare Workers AI Whisper Large v3 Turbo transcribes it; the audio is not written to KV or R2. The transcript uses the existing Claude chat/tool loop with the last eight chat messages, compact live chain/meter context and only intent-relevant tool schemas, then Hope's complete reply is spoken through ElevenLabs Flash v2.5. It uses the model selected under Settings → Research brain (Claude).
- The stem-selection/playback tool and live-context tool are always available, including when Kev says a specific track name; other tool schemas remain intent-selected. Detailed library, research and app guide remain available through AIMM tools when requested.
- Speech uses Hope's current Fallback voice ID `qFJ4KX1Kat5K6ywU2Rnm` and settings read from agent version `agtvrsn_6101m5atfkxhebet6g1rsnyng4k2`: stability `0.5`, similarity boost `0.8`, speed `1.0`. Kevin heard and accepted a 4.64-second Flash v2.5 sample. It keeps Hope's voice identity; the live agent still may deliver more expressive, context-aware speech.
- The custom path never starts `Conversation.startSession()`, so it avoids an idle connected-Agent timer. Existing Live Agent mode remains available as rollback.
- The Worker CORS response exposes `character-cost`, `x-character-count` and request IDs so the browser can display actual speech-generation credits once deployed. The Worker requires `HOPE_STT_TOKEN` authentication, validates PCM format and WAV chunk boundaries, caps speech requests at 8 per minute per client IP per Cloudflare location, and limits audio to 30 seconds / 1 MB. Flash TTS uses separate secret `HOPE_USAGE_TTS_API_KEY`, scoped to Text to Speech, leaving the general ElevenLabs relay key untouched.
- In this mode, speech recognition no longer uses ElevenLabs credits; only Hope's generated speech uses ElevenLabs. Cloudflare lists Whisper at `$0.000513` per audio minute, a separate Cloudflare usage charge. This is not an ElevenLabs-allowance saving estimate until real calls are compared.
- This branch includes `set_stem_selection` for choosing loaded Logic stems and controlling play/pause/stop/seek/skip/monitor volume. That action is wired into the compact voice tool loop; verify it with loaded stems after deployment before treating it as proven parity. Audio generation keeps the request abort handle and “speaking” state through download/playback, ignores stale turn completions, and reports muted speech clearly.
- Root cause for the reported cut-off: tapping the Usage test mic while Hope was generating or playing a reply called the global `aichatStopTTS()`, which paused the audio immediately. The mic now reports that Hope is speaking and waits; it no longer doubles as a stop control. Playback completion now waits for `ended`; an early pause is surfaced as an error instead of silently treated as a complete reply.

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
