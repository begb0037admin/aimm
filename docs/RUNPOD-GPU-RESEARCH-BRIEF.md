# Runpod GPU credit — use-case research brief

**Status:** APPROVED 2026-09-21 — Kevin: "we will implement this." No longer research/proposal-only;
scoped for build. Implementation not yet started (routes through Codex as lead implementer, Cat
reviews, per standing process). Nothing built, no pods created, no spend, as of this docs update.
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

---

## Findings note — 2026-09-21 (Cat), REVISED same day: monetization requirement rules out the local-GPU workaround

**Kevin's clarification, superseding "Proposal A" above:** AIMM is intended to be monetized as a product. Stem separation must work for any user on any computer, via the app itself — not depend on Kevin's local hardware, or any user's local GPU. This rules "Proposal A" (run Demucs on Kevin's own RTX 3070 as a workaround, drop stems into the already-live Option A upload) out entirely — it was only ever a personal workaround and does not generalize to a paying user base. **Proposal A above is retracted, not deleted — kept for history.** Proposal B (real in-product build) is now the only candidate, redone below in real architectural detail rather than a one-paragraph sketch.

### Tool-access note (verified, not guessed)

Runpod's MCP tools were not reachable from inside this session (confirmed: the plugin MCP shows "Connected" at transport level via `claude mcp list`, and Runpod OAuth was already completed in a prior `ai-news-channel` session per that repo's own `tools/voice-replace/RESUME.md` — so there's no missing sign-in — but a direct probe of `https://mcp.getrunpod.io/` 401s without the OAuth bearer token, which only the coordinating session holds; six different tool-name searches for the documented Runpod MCP tools returned nothing). **The coordinator pulled real, live GPU pricing directly** (`list-gpu-types`, `include=AVAILABILITY`, `product=SERVERLESS`, `cloud=SECURE`) and supplied it below — this is verified, not estimated.

### Live GPU pricing (coordinator-verified, 2026-09-21) — tiers relevant to Demucs (24GB+ VRAM is ample)

| GPU | VRAM | Serverless $/hr | Secure on-demand $/hr | Availability |
|---|---|---|---|---|
| RTX 4090 | 24GB | **$1.10** | $0.74 | HIGH, 10 data centers (US-IL-1 highest) |
| RTX A5000 | 24GB | **$0.69** | $0.27 | HIGH |
| RTX 3090 | 24GB | $0.69 | — | LOW |
| A40 | 48GB | $1.22 | $0.49 | HIGH (CA-MTL-1, EU-SE-1) |
| L4 | 24GB | $0.69 | — | LOW, cheaper but slower for this workload |

**Serverless, not a rented pod, is the right product type for AIMM's usage pattern** — per-request, bursty, from many different users — versus a persistent on-demand "secure" pod, which is what ai-news-channel actually rented (hence that $0.74/hr figure in the original findings above referred to the wrong product type for this use case; it's real, just not the number to build a cost model on here). **RTX 4090 or A5000 serverless — both HIGH availability — are the right tier choice for a production Demucs endpoint.**

### Minimal backend needed for a cloud stem-separation feature (an ARCH-1-equivalent slice, sized to this one job — not the full Platform Evolution Epic)

AIMM needs a genuine backend before any server-side/GPU feature can exist for its users at all — this is ARCH-1 as already scoped in the Platform Evolution Epic, broken down here to just what stem separation specifically needs:

1. **Auth / user identity.** A lightweight token or magic-link scheme (Cloudflare Access, as ARCH-1 already names) rather than nothing — needed for usage metering below, not just security. An anonymous endpoint can't be rate-limited or billed per user.
2. **Upload path.** Client uploads the mixed WAV to Cloudflare R2 (the Epic's already-chosen store — zero egress fees, pairs naturally with the existing `aimm-proxy` Worker). Realistically a presigned-upload-URL pattern: the Worker hands the client a signed R2 upload URL, the client uploads directly to R2 (not routed through the Worker — avoids request-size/duration limits on large audio), then tells the Worker the upload finished.
3. **Job trigger + orchestration.** The Worker calls the RunPod serverless endpoint's `/run` with the R2 object URL as input, gets a RunPod job id back, and stores a small job record (job id, user id, input R2 key, status, created-at) — a lightweight durable store such as Cloudflare D1 or KV is enough. RunPod's own serverless queue handles GPU-side queuing; AIMM's backend only needs the mapping from "this user's session" to "this RunPod job."
4. **Status / result delivery.** Either the client polls the Worker (which polls RunPod's `/status/<job-id>`), or — better for a paid product — the RunPod worker pushes its output stems directly to R2 on completion and the job record flips to "done" with the output R2 keys, avoiding a large multi-WAV payload round-trip through RunPod's own job-output channel. Worth checking whether the account's endpoint config supports a completion webhook to remove polling entirely — a live-tool-access question for a future session.
5. **Storage lifecycle.** Input/output audio in R2 needs a retention policy (auto-expire after N days) so a free/low-usage tier doesn't accumulate unbounded storage cost per user.
6. **Usage ledger — the actual monetization hook.** A minimal table, built in from day one even before any payment processing exists: per user, per job — job id, timestamp, outcome, a usage unit (simplest: "1 stem-separation credit" per completed job; more precise: GPU-seconds actually billed by RunPod, read back from the job result). This is the single highest-leverage thing to get right early — retrofitting metering after a feature has shipped free is much more painful than shipping it instrumented from the start, even if the initial policy is "unlimited, free, for everyone." With the ledger in place, a future quota or paywall is a policy change, not a rebuild.
7. **Quota check.** Before triggering a new RunPod job, check the requesting user's usage-ledger total against a configurable limit — trivially "no limit" today, a real gate later, same code path either way.

### Stem-separation worker on RunPod serverless

A Docker image (Demucs + a small Python handler following RunPod's standard `handler(event)` serverless pattern) deployed to a serverless endpoint on the RTX 4090 or A5000 pool. Handler: download the input WAV from the R2 URL in the job payload → run `htdemucs` → upload each stem WAV back to R2 (R2 is S3-compatible, so a direct presigned-PUT or the S3 API both work) → return the R2 keys as the job's output (small — URLs/keys only, not audio bytes, staying well under RunPod's job-payload limits). **Check the RunPod Hub for an existing maintained Demucs worker before building a custom image** — the Hub is a curated catalog of prebuilt serverless workers (the runpod-mcp skill names vLLM/ComfyUI as examples); reusing one, if it exists, is materially less engineering and maintenance than authoring and keeping a Dockerfile current. This is a live-tool-access question for whichever session builds this.

### Cost per song at scale — now real numbers, not an estimate

Using the coordinator-verified serverless rates:
- **RTX 4090 serverless: $1.10/hr ÷ 3600 ≈ $0.000306/sec.** At roughly 1 minute of inference per song (a reasonable Demucs `htdemucs` runtime on a 24GB card, per general published benchmarks — not itself a live-measured figure), that's **≈ $0.018/song** — under two cents.
- **RTX A5000 serverless: $0.69/hr ≈ $0.000192/sec → ≈ $0.011/song** at the same runtime — cheaper, same 24GB headroom, same HIGH availability. Worth benchmarking both once a real endpoint exists rather than assuming the 4090 is necessary.
- Cold-start overhead is the real unknown that isn't in this table: a worker that has to pull a multi-GB image + model weights cold could add tens of seconds. RunPod's model-caching mechanism (host-side cached weights, avoids baking them into the image) reduces this and should be used rather than a from-scratch cold container.
- At real product scale (e.g. thousands of songs/month), raw GPU spend stays in the tens-of-dollars range even on the pricier 4090 tier; R2 storage cost is near-zero (no egress fees, individually small files). The actual cost risk is operational, not per-job: e.g. accidentally leaving `--workers-min 1` (a warm always-on worker) set on the endpoint, which bills continuously even idle — a real, named trap in RunPod's own tooling docs, not a hypothetical.

### What monetization-readiness requires, at minimum (the architecture should leave room for this now, not build all of it yet)

- The usage ledger (point 6 above) — build this in from day one; it's the piece that's expensive to retrofit.
- User identity/auth wired before the feature ships, even informally — attributing usage to "whose job was this" needs to exist before a paywall can, not after.
- A deterministic, capped per-job cost: fixed model, a hard max-duration timeout on the RunPod job, so a future price-per-song can be quoted with confidence instead of guessed.
- Storage lifecycle bounds (point 5) so unit economics don't quietly erode from accumulated storage on a free tier.
- None of this requires payment processing (Stripe etc.) to exist yet — it requires the *usage data* to exist, so a future quota/paywall is a policy flip, not new plumbing.

### Bottom line

One proposal now, not a choice between two: build an ARCH-1-equivalent slice (auth + R2 + job tracking — scoped to this one job type, arguably closer to 1–2 days than the Epic's own general full-platform ARCH-1 estimate) with a RunPod serverless Demucs worker (RTX 4090 or A5000 pool) as the compute layer, instrumented with a usage ledger from the start. Multi-day engineering, not currently prioritized on the roadmap (Hope-intelligence work sits ahead of it) — Kevin's call whether to move it up. Cost per song at scale is genuinely cheap (≈1–2 cents), so compute spend is not the blocker; the backend build is.

**Still open:** whether a Hub-maintained Demucs worker already exists (saves building a custom image), whether the account's endpoint config supports completion webhooks, and the exact model-caching setup for htdemucs weights — all live-tool-access questions for whichever session builds this.

---

## Decision note — 2026-09-21 (Cat): APPROVED, Kevin: "we will implement this"

This is no longer a feasibility research brief awaiting Kevin's decision — Kevin reviewed the architecture above and approved it same day. **Status changes from "proposal for Kevin to decide" to "approved, scoped for build."** The architecture, pricing, and backend breakdown above stand as the scoped plan; nothing in the technical content changes as a result of this note, only the status.

Not reprioritized ahead of the Hope-intelligence backlog (items 24/25) — queue position unchanged unless Kevin explicitly says otherwise. **Next step: implementation via Codex as lead implementer (Cat reviews), per standing process.** This note is docs-only — no code written, no pod created, no spend committed. See `docs/ROADMAP.md` item 34 and `DASHBOARD.html` card 34 for the same status update.
