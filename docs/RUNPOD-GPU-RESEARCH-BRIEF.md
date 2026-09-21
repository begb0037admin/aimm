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

---

## Findings note — 2026-09-21 (Cat), aimm/stem-separation angle only

**Scope of this pass:** Kevin asked specifically whether Runpod could deliver AIMM's not-yet-built stem separation feature. This is a feasibility/architecture writeup for Kevin's decision — nothing built, no pod created, no spend. The Runpod MCP tools named in this brief (`list-billing`, `get-gpu-type`, `list-public-templates`, etc.) **did not load in this session** — searched three ways, no match — so **Step 1 (live balance + pricing check) is still not done.** The balance figure below is still Kevin's own unverified note from the brief above, not reconfirmed.

**1. Roadmap status (verified directly, `docs/ROADMAP.md`, `DASHBOARD.html` card 22):** Stem separation is **not built**. It exists only as "Option B" inside Backlog 22 (Multi-stem Mix Check): auto-splitting a single mixed WAV into stems via a real separation model. Kevin explicitly chose to build "Option A" first (2026-09-07) — Kevin supplies already-separated stem files, which the app measures — and that shipped as the `multistem-mixcheck-final.html` mockup pass. Option B was deliberately deferred, "isn't blocking A's build," and has no scheduled date; it's explicitly behind the Hope-intelligence backlog (items 24/25) in priority. ROADMAP.md itself already flags Option B as needing "the same backend-microservice shape as the ARCH-2/ARCH-3 Platform Evolution Epic."

**2. Current AIMM architecture (verified directly against `index.html` @ `main`, 1.2MB):** AIMM is still a single-file browser app, Stage 1 of the Platform Evolution Epic. All audio measurement (RMS/crest/LUFS/spectral bands/tempo/key/stereo width) runs client-side in Web Audio API JS — zero `BiquadFilterNode`, `OfflineAudioContext`, or `AudioWorklet` usage found, i.e. there's no real-time DSP chain yet, only analysis. The **only** backend surface is the `aimm-proxy` Cloudflare Worker (`aimm-proxy.kevinlelitte.workers.dev`), and it does exactly one job: relay API keys for Claude (Hope's chat) and ElevenLabs (TTS) calls. No file storage, no auth, no job queue, no R2 usage anywhere in the file. This confirms ARCH-1 (Backend Foundation — Worker extension + R2 + auth, the stated "gate for all subsequent ARCH stages") has not been built.

**3. What stem separation actually needs:** The practical open-source option is **Demucs** (Meta/FAIR, MIT licence) — the hybrid-transformer `htdemucs` model splits a track into 4 stems (vocals/drums/bass/other) or 6 with the extended model. It's a PyTorch model; GPU inference is dramatically faster than CPU (roughly under a minute for a 3–4 minute song on a modern GPU vs several minutes on CPU-only). Spleeter (Deezer, TensorFlow) is the older, lighter, lower-quality alternative, largely superseded by Demucs now. Notably, **Kevin's own local RTX 3070 is already a capable card for Demucs** — this isn't a case where local hardware can't do the job at all, unlike some heavier video-model workloads.

**4. Is Runpod a good fit — yes for compute, no for the actual gap.** Runpod's tools are infrastructure-only (pods/serverless endpoints/GPU catalog) — no SSH, no file transfer, no local builds, confirmed by the Runpod MCP's own tool instructions text. A Runpod **serverless** GPU endpoint running a Demucs container is a clean, plausible fit for the raw inference step, and arguably a *better* fit than the roadmap's originally-sketched Railway/Render CPU microservice specifically because Demucs is GPU-bound and serverless bills per-second — good for AIMM's occasional, bursty usage. **But Runpod only ever substitutes for the ARCH-2 compute layer.** It does not remove AIMM's real architectural gap, which is that there is no backend at all today beyond the key-relay Worker — no upload, no storage, no auth, no job orchestration. Plugging Runpod in doesn't skip ARCH-1; it just decides which compute provider a future ARCH-2 service would call.

**5. Cost shape:** GPU compute itself is cheap — a single song's Demucs separation is well under a minute of GPU time, so at the brief's own $0.74/hr figure that's a couple of cents per song in raw compute, before cold-start overhead. If the ~13-hour credit figure is still accurate (not reverified this session), that's headroom for several hundred individual song separations. **Compute spend is not the constraint here — the engineering lift is.**

**6. Two distinct proposals for Kevin to choose between (neither built, neither decided):**

- **A — Pragmatic workaround, no AIMM engineering, usable now.** Run Demucs as an ad hoc, agent-driven job (Runpod serverless, or Kevin's own local RTX 3070 — genuinely worth comparing before committing to any cloud spend, since the 3070 needs no data-path solved at all) outside the app entirely: mixed WAV in, stems out, then drop those stems into AIMM's **already-live** Option A multi-stem upload. Delivers the outcome Kevin actually wants (auto-split stems Hope can see) today, touches zero app code. Real open question carried over from the brief: whether a genuinely zero-manual-steps data path into/out of Runpod (send/receive, network volume, or URL-in/URL-out) is actually provable — that's still Step 5 of this brief's original research questions, unresolved.
- **B — Real in-product Option B.** Build ARCH-1 first (~1 day per the Epic's own estimate), then a stem-split service in the ARCH-2/ARCH-3 shape (Runpod serverless as its compute backend). Multi-day engineering, not currently prioritized — Hope-intelligence work sits ahead of it in the queue per Kevin's own 2026-09-05 call. This is the only path that makes stem separation a native AIMM feature rather than a pre-processing workflow step.

**Recommendation, not a decision:** if the goal is "get separated stems into Hope's hands soon," A is the cheap, fast path and doesn't wait on any backend build — worth comparing against just running Demucs locally on the 3070 before spending any Runpod credit on it. If the goal is "AIMM natively splits stems for any user," that's B, and it's a real multi-day prioritization call Kevin hasn't made.

**Still open / not done this pass:** live Runpod balance and GPU pricing (tools unavailable this session), and the zero-manual-steps data-path proof for option A.
