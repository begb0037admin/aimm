# Hope usage-based voice prototype — 2026-10-20

**State:** build `2026-10-20.4` is built in local review branch `codex/hope-usage-voice-spike`, based on fetched `main` at `8e59ff2`. A short Flash sample was generated and Kevin said it sounded good; the AIMM voice path has not yet been deployed or tested end to end.

## What changed

- The Hope composer now offers **Live Agent** (existing default) and **Usage test**.
- Usage test records one press-to-talk utterance (maximum 30 seconds), converts it in-browser to mono 16 kHz PCM WAV, and sends it to the new `POST /hope/stt` route on AIMM's Worker. Cloudflare Workers AI Whisper Large v3 Turbo transcribes it; the audio is not written to KV or R2. The transcript uses the existing Claude chat/tool loop with the last eight chat messages, compact live chain/meter context and only intent-relevant tool schemas, then Hope's complete reply is spoken through ElevenLabs Flash v2.5. It uses the model selected under Settings → Research brain (Claude).
- The stem-selection/playback tool and live-context tool are always available, including when Kev says a specific track name; other tool schemas remain intent-selected. Detailed library, research and app guide remain available through AIMM tools when requested.
- Speech uses Hope's current Fallback voice ID `qFJ4KX1Kat5K6ywU2Rnm` and settings read from agent version `agtvrsn_6101m5atfkxhebet6g1rsnyng4k2`: stability `0.5`, similarity boost `0.8`, speed `1.0`. Kevin heard and accepted a 4.64-second Flash v2.5 sample. It keeps Hope's voice identity; the live agent still may deliver more expressive, context-aware speech.
- The custom path never starts `Conversation.startSession()`, so it avoids an idle connected-Agent timer. Existing Live Agent mode remains available as rollback.
- The Worker CORS response exposes `character-cost`, `x-character-count` and request IDs so the browser can display actual speech-generation credits once deployed. The Worker requires `HOPE_STT_TOKEN` authentication, validates PCM format and WAV chunk boundaries, caps speech requests at 8 per minute per client IP per Cloudflare location, and limits audio to 30 seconds / 1 MB. Flash TTS uses separate secret `HOPE_USAGE_TTS_API_KEY`, scoped to Text to Speech, leaving the general ElevenLabs relay key untouched.
- In this mode, speech recognition no longer uses ElevenLabs credits; only Hope's generated speech uses ElevenLabs. Cloudflare lists Whisper at `$0.000513` per audio minute, a separate Cloudflare usage charge. This is not an ElevenLabs-allowance saving estimate until real calls are compared.
- This branch includes `set_stem_selection` for choosing loaded Logic stems and controlling play/pause/stop/seek/skip/monitor volume. That action is wired into the compact voice tool loop; verify it with loaded stems after deployment before treating it as proven parity. Audio generation keeps the request abort handle and “speaking” state through download/playback, ignores stale turn completions, and reports muted speech clearly.

## Voice sample evidence

On 2026-10-20, one 4.64-second sample was generated through ElevenLabs' speech-generation API using voice **Hope US AIMM** (`qFJ4KX1Kat5K6ywU2Rnm`) and model `eleven_flash_v2_5`. Text: “Hey Kev, the 808 is sitting a little heavy. Pull it down half a decibel, then listen again.” Cost reported by ElevenLabs: **90.9909 credits / $0.01654**. Kevin's response: “sound good.” This confirms the sample sounds acceptable to him; it does not prove end-to-end AIMM quality or savings versus a Live Agent call.

## Current blocker

Read-only request to `https://aimm-proxy.kevinlelitte.workers.dev/health` returned:

```text
✅ ANTHROPIC_API_KEY — OK
❌ ELEVENLABS_API_KEY — rejected by elevenlabs (HTTP 401) — check the key value
✅ AIMM_KV — bound (captures sync ON)
```

The live Worker key currently returns 401, so TTS from AIMM's configured relay cannot be verified. Cloudflare transcription and relay CORS are also local until the Worker is deployed. Before deploy, set the limited ElevenLabs TTS key as `HOPE_USAGE_TTS_API_KEY`, generate a private token, set it as the Worker's `HOPE_STT_TOKEN` secret, and enter the same value in Settings → API Keys → Hope — usage test access token. The routes fail closed without this credential. No end-to-end AIMM voice path or usage delta has been measured; do not state that the build saves credits yet.

## First live check after key repair and review

Use **Usage test**, ask one short question about the loaded mix, then wait for the completed spoken response. Confirm the transcript, Hope audio, tool response if requested, Worker `character-cost` header and account usage delta. Repeat the same prompt in Live Agent mode and compare the actual ElevenLabs credits, including STT and TTS. Compare LLM/API spend separately. Keep Live Agent as the default until that evidence is recorded.

## Files

- `index.html` — optional voice mode, compact chat request, local WAV conversion, dedicated TTS route, token setting and composer controls; `AIMM_BUILD` `2026-10-20.4`.
- `worker/src/index.js` — bounded Whisper transcription route and ElevenLabs per-request cost headers.
- `worker/wrangler.toml` — Cloudflare AI and per-IP request-rate bindings.
- `docs/VOICE_PROVIDER_DECISION.md`, `docs/STATUS.md`, `docs/HANDOVER.md`, `docs/ROADMAP.md`, `DASHBOARD.html` — decision, current state and next test.
