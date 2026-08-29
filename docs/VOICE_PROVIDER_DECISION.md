# Hope voice provider — decision record

**Owner:** Markey (voice-engineering agent). **Last decision:** 2026-08-28. **Status:** settled; reopen only on a non-cost trigger (see below).

## What Hope actually is

Hope is an **ElevenLabs Conversational AI Agent** (`agent_2601kqm4g7txfsvv0pkvpe02389p`), not a swappable TTS `model_id`. ElevenLabs bundles STT + LLM routing (Claude Sonnet) + TTS + turn-taking + barge-in into one managed WebSocket service, billed **per minute (~$0.08/min)**, not per character. The voice/LLM/tools are configured on the agent in the ElevenLabs dashboard — there is no `model_id` or `voice_id` in this repo. Client SDK: `@elevenlabs/client@0.1.7` (pinned; see `index.html:6220`). The voice WebSocket goes browser⇄ElevenLabs directly and **bypasses `aimm-proxy`** — only REST side-calls go through the Worker.

**Deepgram Flux TTS is a text-to-speech engine only.** It cannot plug into an ElevenLabs Agent. Adopting it = replacing the entire conversational runtime.

## Decision (2026-08-28)

**Do NOT migrate Hope to Deepgram for cost reasons.**

- Migration is a full runtime replacement: **L / L+ effort** (~5–8 days for a Deepgram Voice Agent API rebuild; ~8–13 days for a fully custom orchestration).
- Break-even vs staying on ElevenLabs is **≈230 conversation-minutes/month**; below that, migration doesn't even undercut the subscription. Payback on the engineering time is **multi-year**.
- Current low Hope usage is the redesign lull, not steady state — but even at plan-cap usage the cost case is weak.

## Chosen path — reduce cost with zero engineering

**Downgrade the ElevenLabs plan.** Conversational AI Agents run on **every** tier at the **same $0.08/min** overage:

| Tier | $/mo | Included Agents min/mo |
|---|---|---|
| Free | $0 | 15 |
| **Starter** | **$6** | **75** |
| Creator (current) | $22 | 275 |

Starter + overage is ≤ Creator at every usage level up to 275 min/mo. **Target: Creator $22 → Starter $6** (or → Free if real usage is tiny), saving ~$16/mo, fully reversible, no code change.

**Open action:** Kevin pulls real Agents minutes from **elevenlabs.io/app/usage** (12-month range, filter Conversational AI) to pick the tier. Until then, assume the downgrade to Starter.

If a migration ever happens, **park ElevenLabs on the Free tier** as the dormant fallback behind a provider flag (same pattern as the retained OpenAI Realtime path) — don't hard-cancel.

## Reopen criteria (non-cost triggers only)

Revisit the migration if any of these apply:
- Strategic decision to exit ElevenLabs entirely.
- Wanting Deepgram's conversational model specifically (barge-in with `Interrupt.text_spoken` state reconciliation, per-turn objects).
- Wanting a specific Deepgram voice that beats the current Hope voice in a blind A/B.

If reopened: target **Route 2** (custom orchestration — the only route that materially cuts cost; Deepgram Voice Agent API at $0.075/min ≈ ElevenLabs Starter, no saving), and run an **M de-risk spike first** (real latency numbers + blind voice A/B) before authorising the build.

## Bug to fix regardless of this decision

The **`ELEVENLABS_API_KEY` secret on the `aimm-proxy` Worker is an API key *ID*, not a real `sk_…` key.** Effect: the in-call cost card, balance display, and post-call cost reconcile (`elFetchConversationCost`, `/v1/user/subscription`) are **currently broken**; `/health` shows ElevenLabs red. **Voice calls still work** (public agent-id, no key needed). Fix: rotate the ElevenLabs key and set the real `sk_…` value (`npx wrangler secret put ELEVENLABS_API_KEY` from `worker/`, or the Cloudflare dashboard).

## Full scoping

Everything above is condensed from the full scoping doc (current state, Flux-fit analysis, cost model, voice shortlist, migration scope, risks, rollback):
**https://github.com/begb0037admin/markey/blob/main/memory/aimm-hope-flux-tts-migration-scoping-2026-08-28.md** (commit `16a6560d`, section `REVISION 1`).
