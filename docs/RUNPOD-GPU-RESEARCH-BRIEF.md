# Runpod GPU credit — use-case research brief

**Status:** OPEN, research only. Nothing built, no pods created, no spend.
**Logged:** 2026-09-20, at Kevin's request ("explore the use case in detail — log it for a new session research").
**Lead for the research session:** Cat (aimm + ai-news-channel). Consult Markey for voice-model questions. Hope visuals are Codex-exclusive (see `agent-commons/operating-model/HOPE_IN_AI_VISUAL_OWNERSHIP.md`).
**Related:** the queued card in `ROADMAP.md` and the awareness note in Max's memory (Max does not own Runpod usage).

## The asset

- Credit sits on Kevin's **Runpod account**, not on any repo, so any project can use it.
- Approx. **13 hours on an RTX 4090 at $0.74/hr**. Treat as a finite, non-renewing pool — verify the live balance first (see Step 1).
- Kevin's local GPU is an **RTX 3070**.

## Candidate uses (NOT plans — repos not yet inspected for GPU-bound work)

| Repo | Candidate job | Why a GPU might help |
|---|---|---|
| aimm | Stem separation (e.g. Demucs), audio analysis | Fast on a 4090, slow on the 3070 |
| ai-news-channel | Upscaling/restoring Flow footage, batch face/detail clean-up | Video is GPU-heavy. Hope visuals are Codex-owned, so this must route through Codex |
| Markey's voice repos | Whisper large-v3, private TTS experiments | Better accuracy than the small CPU model |

## Hard constraints

1. **No Oxford or work-related audio/documents on a rented GPU.** Third-party hosting outside Kevin's controlled setup. Hope in AI and personal projects only.
2. **Zero manual steps** (Kevin's permanent rule). A use case only qualifies if an agent can run it end to end: no copy-paste, no dashboard clicking, no multi-step terminal instructions for Kevin. If an agentic path doesn't exist, say so once and stop.
3. **Never ask Kevin to paste a credential into chat.** Use the connected Runpod MCP tools / existing auth.
4. **State the hourly price before creating anything billable**; only stop/delete resources this session created. Delete pods when done — an idle pod keeps billing.
5. **Don't spend it just to use it up.** Only for a real slow or GPU-bound job.

## Research questions

1. **Live balance.** How much credit actually remains? (Runpod MCP `list-billing` / `list-pod-billing`, read-only.) Does it expire?
2. **Where is the real pain?** For aimm: which analysis/DSP steps are slow on the 3070 today (measure, don't guess). Is stem separation even on the roadmap? Check `ROADMAP.md` before proposing features. For ai-news-channel/voice: which jobs are actually GPU-bound and recurring?
3. **Per-use-case cost model.** Estimated GPU-minutes per job, x $0.74/hr, plus pod start-up/model-download overhead. Jobs per 13 hours. Compare with a cheaper GPU or serverless.
4. **Pod vs serverless vs flash.** Which fits occasional jobs best? Serverless endpoint (pay per second, cold starts) vs a pod started only for a batch. Consider `runpod:flash` (code-first, run Python functions on remote GPUs).
5. **Agentic data path (the likely blocker).** The Runpod MCP does infrastructure only: no SSH, no file transfer to/from pods. How do audio/video inputs get in and outputs come back with zero manual steps? Options: `runpodctl send/receive`, network volume, object storage, or a serverless endpoint with URL in/out. Establish which one an agent can drive unattended.
6. **Data-classification gate.** For each input, confirm it is personal/Hope in AI content only. Define how the job refuses work/Oxford material.
7. **Quality vs local.** Does the GPU output beat what the 3070 already produces? Any licence issues with models (Demucs, Whisper, upscalers)?
8. **Routing.** Who owns each job if it goes ahead: aimm audio = Cat (DSP, implementation via Codex per lead-implementer rule); Hope visuals = Codex; voice models = Markey.

## Suggested method

1. Read-only: check balance, GPU availability/pricing (`get-gpu-type`, `get-capacity`), and existing templates/Hub entries for Demucs/Whisper/upscaling (`list-public-templates`, `list-hub-repos`).
2. Inspect the three repos for GPU-bound tasks (read only).
3. Rank use cases by (real pain) x (agentic path exists) x (safe data).
4. Produce a short recommendation with a cost estimate per job. **Get Kevin's go-ahead before creating any pod**, quoting the hourly price.

## Deliverable

A short findings note appended here (or a sibling file) stating: verified balance, ranked use cases, recommended pod/serverless approach, cost per job, the data path, and a clear "do it / don't" per use case. Update the ROADMAP card status when done.

## Exact next action

Start a fresh Cat session, read this file, then run Step 1 (read-only Runpod balance + GPU pricing check) and report.
