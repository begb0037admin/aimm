# Hope usage-based voice prototype — 2026-10-20

**State:** build `2026-10-20.3` is built in local review branch `codex/hope-usage-voice-spike`, based on fetched `main` at `8e59ff2`. Not pushed, deployed, or tested against a real speech request.

## What changed

- The Hope composer now offers **Live Agent** (existing default) and **Usage test**.
- Usage test records one press-to-talk utterance (maximum 30 seconds), converts it in-browser to mono 16 kHz PCM WAV, and sends it to the new `POST /hope/stt` route on AIMM's Worker. Cloudflare Workers AI Whisper Large v3 Turbo transcribes it; the audio is not written to KV or R2. The transcript uses the existing Claude chat/tool loop with the last eight chat messages, compact live chain/meter context and only intent-relevant tool schemas, then Hope's complete reply is spoken through ElevenLabs Flash v2.5. It uses the model selected under Settings → Research brain (Claude).
- The stem-selection/playback tool and live-context tool are always available, including when Kev says a specific track name; other tool schemas remain intent-selected. Detailed library, research and app guide remain available through AIMM tools when requested.
- Speech uses Hope's current Fallback voice ID `qFJ4KX1Kat5K6ywU2Rnm` and settings read from agent version `agtvrsn_6101m5atfkxhebet6g1rsnyng4k2`: stability `0.5`, similarity boost `0.8`, speed `1.0`. This keeps the same voice identity; Flash v2.5 may sound less expressive than the Agent's `eleven_v3_conversational` synthesis.
- The custom path never starts `Conversation.startSession()`, so it avoids an idle connected-Agent timer. Existing Live Agent mode remains available as rollback.
- The Worker CORS response exposes `character-cost`, `x-character-count` and request IDs so the browser can display actual speech-generation credits once deployed. The Worker requires `HOPE_STT_TOKEN` authentication, validates PCM format and WAV chunk boundaries, caps transcription at 8 requests/minute per client IP per Cloudflare location, and limits audio to 30 seconds / 1 MB.
- In this mode, speech recognition no longer uses ElevenLabs credits; only Hope's generated speech uses ElevenLabs. Cloudflare lists Whisper at `$0.000513` per audio minute, a separate Cloudflare usage charge. This is not an ElevenLabs-allowance saving estimate until real calls are compared.
- This branch includes `set_stem_selection` for choosing loaded Logic stems and controlling play/pause/stop/seek/skip/monitor volume. That action is wired into the compact voice tool loop; verify it with loaded stems after deployment before treating it as proven parity. Audio generation keeps the request abort handle and “speaking” state through download/playback, ignores stale turn completions, and reports muted speech clearly.

## Current blocker

Read-only request to `https://aimm-proxy.kevinlelitte.workers.dev/health` returned:

```text
✅ ANTHROPIC_API_KEY — OK
❌ ELEVENLABS_API_KEY — rejected by elevenlabs (HTTP 401) — check the key value
✅ AIMM_KV — bound (captures sync ON)
```

The live Worker key currently returns 401, so ElevenLabs TTS cannot yet be verified. Cloudflare transcription and relay CORS are also local until the Worker is deployed. Before deploy, generate a private token, set it as the Worker's `HOPE_STT_TOKEN` secret, and enter the same value in Settings → API Keys → Hope — usage test access token. The route fails closed without this credential. No real speech path, voice quality, or usage delta has been measured; do not state that the build saves credits yet.

## First live check after key repair and review

Use **Usage test**, ask one short question about the loaded mix, then wait for the completed spoken response. Confirm the transcript, Hope audio, tool response if requested, Worker `character-cost` header and account usage delta. Repeat the same prompt in Live Agent mode and compare the actual ElevenLabs credits, including STT and TTS. Compare LLM/API spend separately. Keep Live Agent as the default until that evidence is recorded.

## Files

- `index.html` — optional voice mode, compact chat request, local WAV conversion, TTS call, token setting and composer controls; `AIMM_BUILD` `2026-10-20.3`.
- `worker/src/index.js` — bounded Whisper transcription route and ElevenLabs per-request cost headers.
- `worker/wrangler.toml` — Cloudflare AI and per-IP request-rate bindings.
- `docs/VOICE_PROVIDER_DECISION.md`, `docs/STATUS.md`, `docs/HANDOVER.md`, `docs/ROADMAP.md`, `DASHBOARD.html` — decision, current state and next test.
