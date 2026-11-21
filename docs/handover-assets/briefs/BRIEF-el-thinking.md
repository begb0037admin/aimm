# BRIEF: "Hope is thinking" on the ElevenLabs route
For Codex (gpt-6-sol, medium). File: /Users/admin/github/aimm/standalone/assets/index.html (build 2026-11-16.1). Bump build id; edit ONLY this file. Do not upgrade @elevenlabs/client (pinned 0.1.7). No layout/button/header/CSS changes.

## Problem
EL route: after Kevin stops talking, UI stays "Listening…" until Hope's first audio. onModeChange (L19284) only handles speaking/listening. Luna route already shows "Hope is thinking…" (aichatStatus L16163 + transcript bubble `.aichat-msg.ai.thinking` L16165-16168, existing CSS L599-604).

## Signals (verified in SDK 0.1.7 source, dist/lib.modern.js)
- START: `onMessage` with `source==='user'` (L19309) = user_transcript, fires when the user turn is finalised, before the LLM replies. Mode does NOT change here (stays 'listening'), so onModeChange cannot be the start signal.
- END: `onModeChange mode==='speaking'` (first audio chunk). Backups: onMessage `source==='ai'`, onDisconnect, onError, elCleanup.
- GOTCHA: SDK flips mode to 'listening' whenever the audio buffer drains (even mid-reply, between chunks) and on interruption. So a 'listening' event must NOT clear or set thinking.
- Interruption / agent tool events are not callbacks in 0.1.7 (only onDebug gets unknown types). Do not rely on them.

## Design (reuse the Luna look, nothing new)
Add `EL.thinking` (bool) and `EL.thinkTimer`. Two small helpers near onModeChange:
- `elThinkingOn()`: if !EL.active or EL.thinking return; set EL.thinking=true; `rtSetStatus('live','Hope is thinking…')`; `aichatStatus('Hope is thinking…','busy')`; append a div with the SAME markup as L16167 (`aichat-msg ai thinking`, label "Thinking", three dots) to #aiChatTranscript, tag it `data-el-thinking`, `aichatScrollToBottom()`. Start 45s safety timer calling elThinkingOff(). Do NOT set AICHAT.busy or disable Send. Do NOT touch the wave (keeps coloured listening shimmer) or setVoiceState.
- `elThinkingOff()`: clear flag + timer, remove `[data-el-thinking]`, `aichatStatus('')`. Idempotent.
Wire-in:
1. onMessage (L19309): after the existing `aichatRender()` in the try block, `if(role==='user') elThinkingOn(); else elThinkingOff();` (aichatRender rewrites innerHTML, so append AFTER it; an ai message render wipes the bubble anyway). Guard: skip thinkingOn if text empty.
2. onModeChange (L19284): in `speaking` branch call elThinkingOff() first. In `listening` branch: if EL.thinking, skip the "Listening…" status/idle-state text (keep setListening wave call) so the label is not overwritten mid-thinking.
3. clientTools wrapper (L19069-19075 and web_search_fallback L~19085): at tool start call elThinkingOn() (covers Hope going quiet during a tool); optionally relabel via the bubble label. Cleared by speaking as usual.
4. onDisconnect (~L19250), onError (L19265), elCleanup (L19434): call elThinkingOff().
5. aichatRender (L15006): at its end, `if(EL.thinking && !tEl.querySelector('[data-el-thinking]')) re-append` so other renders (tool cards) do not drop the bubble. Check EL is defined (used before declaration order).

## Edge cases
- Barge-in: Kevin interrupts mid-reply -> mode 'listening' (no thinking) -> his new user message -> thinkingOn again; any stale flag already cleared by speaking.
- Tool-call pauses: Hope speaks "let me check", goes silent -> mode listening, thinking stays off unless a clientTool fires (step 3). Server-side tools stay unlabelled; accepted.
- Idle timer (L20892, EL.idleWarned): onMessage already refreshes EL.lastEventAt and clears idleWarned. The 45s thinking cap must stay well below the 120s auto-end so a stuck bubble cannot mask a dead call. Do not change the idle interval.
- Errors/quota failover: thinkingOff in onError and elCleanup before launchQuotaFailover.
- Multiple user fragments: thinkingOn idempotent (one bubble). Mute (HOPE_VOICE.isMuted) must still show thinking; speaking mode still fires when muted.
- Luna route and PTT/Realtime paths untouched.

## Test plan
1. `node --check` on extracted script / load page with no console errors; grep that only L15006, 19069-19090, 19250-19300, 19434 regions changed.
2. Simulated: mock `EL`, call the onMessage/onModeChange handlers in sequence (user -> thinking shown once; listening flicker -> still shown; speaking -> removed; ai msg -> no duplicate; disconnect/error -> removed; 45s timer -> removed).
3. Live (Kevin, preview first): ask a slow question, confirm "Hope is thinking…" + dots appear right after he stops and vanish at first word; interrupt mid-reply; trigger a tool ("what's in the mix"); end call mid-thinking; leave idle >2 min to confirm auto-end still fires.
4. Report build number and say preview-only vs deployed. No push/deploy without Kevin's approval; Codex end-to-end read-only review before showing.
