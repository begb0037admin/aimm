# KB chunk-dilution retrieval — research brief (no implementation yet)

**Status: RESEARCH ONLY, per Kevin's explicit instruction 2026-10-04 ("go and do some deep research
on this, i want a solid fix, no more patching").** This is the scoped research pass promised in
`docs/ROADMAP.md` item 37. Nothing in this document has been built or shipped. Companion/prior reading:
item 37 (chunk-dilution gap), item 38 (`read_yt_knowledge` substring-matching), and
`docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md` (the hybrid BM25+Vectorize+rerank architecture this brief
builds on top of, not replaces).

---

## 1. Root-cause validation — tested live tonight, not assumed

Tonight's four live BM25/substring-match fixes (ROADMAP item 37, already shipped) closed the original
failing query. But a second, more natural phrasing of the same real question immediately broke again —
Kevin's point: *any* fifth fix just moves the breakage to a sixth phrasing. Before proposing an
architecture, I re-ran the actual production retrieval leg directly, live, against the real Worker
endpoint (`POST https://aimm-proxy.kevinlelitte.workers.dev/kb/vector-search`, Origin header spoofed to
an allowed value — read-only, no write, no index touched), bypassing the UI and BM25 entirely so the
result is the semantic leg's result in isolation:

**Test 1 — exact words from the transcript ("eight instances of NLS bus"):**
The correct chunk (`mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p02`, chunk 6) DOES rank
#1 — but at score **0.2025**, with the #2 result (an unrelated Bainz/Young Thug chunk about a generic
drum bus) right behind at **0.1849** — a margin of roughly 9%. Six of the top 10 results are chunks from
videos that have nothing to do with Jaycen Joshua or NLS, surfaced purely because they also mention
"bus"/"drum bus"/"mix bus" densely. This is a thin, fragile win, not a solid one.

**Test 2 — natural paraphrase actually used tonight ("what does Jaycen Joshua say about running NLS
buses in series"):** The correct chunk **does not appear anywhere in the top 10**. The real transcript
never uses the words "series" or "running" in that context — Jaycen says "when you add the two NLS's in
together" and "I'll see people's drum bus." The top 10 is dominated by two *other* real Jaycen Joshua
videos (`L6xx7DWKzng` "Mixing Summits with Jaycen Joshua", `-zhV3LvZ8EY` "JAYCEN JOSHUA Explains How To
Mix Your Drums…") that happen to share more surface vocabulary with the paraphrase.

**Test 3 — Kevin's exact second-attempt phrasing ("...NLS buses in series chain"):** Same result — the
correct chunk is absent from the top 10 again, for the same reason.

**Verdict on the hypothesis:** confirmed, not assumed — but the real finding is sharper than "chunk
dilution" alone. Two compounding effects are both real and separable:

- **(a) Topical dilution within the chunk.** Chunk 6 (523 words, confirmed via direct file read) spans at
  least four distinct ideas: multiband EQ / masking, the one-line NLS aside, analog-board-variance stereo
  width, and a digression about plugin marketing tricks. A voyage-context-3 embedding of that whole chunk
  is a weighted average over all four topics — the NLS sentence contributes roughly 1/10th of the chunk's
  words, so it is structurally diluted in the vector regardless of the "contextualized" document-context
  boost already shipped tonight (item 35/37's fix helps tie the chunk back to *Jaycen Joshua*, it does not
  concentrate the vector around *NLS specifically*).
- **(b) Vocabulary mismatch is real and independent of chunk size.** Test 2/3 fail not because the right
  chunk is diluted among its own competing topics, but because OTHER, wrong Jaycen Joshua videos score
  HIGHER — i.e. the failure mode here is cross-document confusion between several real videos about the
  same producer, not just "my own chunk doesn't rank." A smaller chunk fixes (a) but does **not**, by
  itself, fix (b) — a tightly-scoped "NLS discussion" micro-chunk still has to out-compete two entire other
  Jaycen Joshua videos' worth of chunks that are topically adjacent (drums, mix bus, hardware). This is
  the single most important finding of this research pass: re-chunking alone is necessary but almost
  certainly not sufficient.

**What I was not able to test directly tonight:** a controlled re-embedding comparison (splitting chunk 6
into e.g. 3 smaller topic-scoped chunks, embedding each via voyage-context-3, and re-querying) requires
either (i) a sandboxed "embed arbitrary text, don't write to the index" Worker route that doesn't exist
yet, or (ii) the raw `VOYAGE_API_KEY`, which per Kevin's standing zero-manual-steps/no-credentials rule I
will not ask for or touch directly. I attempted to have Codex build a pure-lexical (BM25-proxy, no
network calls) stand-in experiment to at least partially test effect (a) in isolation; it did not
complete in a reasonable time this session (15+ minutes, no output) and I am not fabricating a result in
its place. **Recommended first concrete step of any approved build** (see §3) is exactly that missing
sandbox embed-only endpoint — cheap to build, read-only, lets any future re-chunking proposal be
benchmarked against real embeddings before committing to a full re-ingest.

---

## 2. The two corpora are shaped differently — and may need different rules

Checked directly against `docs/knowledge/kb-search-index.json` (3,191 chunks total):

| | MWTM (145 videos) | Pre-existing YouTube (463 videos) |
|---|---|---|
| Total chunks | 576 | 2,615 |
| Avg chunks/video | 4.0 | 5.6 |
| Chunk-count distribution | Tight: almost all videos have 2–8 chunks (max 10) | Long tail: many videos have 1–8 chunks, but 30+ videos run 11–41 chunks |
| Deep-content-unreachable (item 37 benchmark, semantic-only) | 3.9% | **32.3%** |

These are likely **two different failure shapes**, not one:

- **MWTM's problem (what tonight's live tests exercised) is dilution-within-a-few-large-chunks** — a
  40-minute lesson transcript compressed into just 4 chunks of ~500 words each means almost every chunk
  is genuinely multi-topic (confirmed directly in chunk 6 above). Smaller, topic-bounded chunking is a
  direct fix for this shape.
- **The pre-existing KB's 32.3% is more likely a depth/volume problem**: videos with 20–41 chunks (long
  single-topic tutorials, e.g. a full mix-from-scratch walkthrough) have a opening chunk whose vocabulary
  matches the video's own title, but chunk 25 of 40 may have drifted onto a sub-topic the title never
  mentions at all (e.g. "Full Vocal Mix Breakdown" title, chunk 30 is specifically about de-essing). This
  isn't the SAME chunk being diluted across several ideas — it's a chunk that's perfectly clear and
  single-topic on its own, just disconnected from the one piece of context (the title/intent) the
  benchmark used to try to find it. **Not yet proven** (not tested live the way MWTM was tonight) but the
  structural shape of the two corpora supports treating them differently, and this benchmark number alone
  is not strong enough evidence to assume the identical fix applies to both.

**Implication for §3:** MWTM's fix is about chunk *granularity* (split more finely). The pre-existing
KB's fix, if its root cause turns out to be different on investigation, may be about something else
entirely — e.g. summarization-augmented retrieval (a per-video summary chunk that's always a retrieval
candidate alongside its detail chunks) rather than finer splitting. Recommend scoping these as two
separate (if related) investigations rather than one shared re-chunking pass — see §3.

---

## 3. Architectural options surveyed

Evaluated against this corpus's actual shape: long (MWTM) or very long (pre-existing) conversational,
multi-topic transcripts; small absolute scale (3,191 chunks, 608 videos); an Anthropic-model-based
assistant already on Claude Sonnet 5.5; already running a hybrid BM25+Vectorize+Cohere-rerank pipeline
shipped tonight.

### 3a. Finer / topic-shift-based chunking ("semantic chunking")
Split transcripts at topic boundaries instead of a fixed 500-word count, so a one-line aside like the
NLS mention becomes its own small chunk (or a very small chunk with its immediate 1–2 sentences of
context) instead of 1/10th of a 523-word paragraph. **Directly addresses finding (a) above.** Does
**not** by itself address finding (b) (cross-document confusion among several same-producer videos) —
smaller chunks could even make (b) slightly worse in isolation, since a shorter chunk has fewer
disambiguating words tying it to its own producer/context, UNLESS the document-context injection
(deriveSessionLabel, already shipped) is carried into every sub-chunk, which it should be regardless of
which option below is chosen. Cost: requires re-chunking logic (likely an LLM-assisted topic-boundary
detector, not a fixed word count — Claude Haiku is cheap enough to run per-transcript at ingest time) and
a full re-embed + re-upsert of affected chunks. For MWTM alone (576 chunks across 145 videos) this is
small — a few dollars of Haiku + Voyage calls, minutes of wall-clock. For the full corpus (3,191 chunks)
this is still cheap in raw API cost but the wall-clock/backfill-script running time tonight's team already
observed (real, non-trivial minutes, not seconds) should be budgeted, not assumed free.

### 3b. Parent-document retrieval
Index small chunks for matching, but when a small chunk matches, return it PLUS its surrounding context
(the full original ~500-word paragraph, or even the whole transcript) to the model. This is the
closest combination to what AIMM already effectively does via `read_yt_knowledge` (search finds a chunk,
then a follow-up reads more of that same document) — but currently `read_yt_knowledge`'s own matching is
the literal-substring problem flagged as item 38. **Directly complements 3a**: do the fine-grained split
for matching purposes, but once matched, hand the model back enough surrounding transcript to answer
fully and accurately (important for a 2.5-minute tangent like the NLS aside, where the model benefits
from seeing what Dave Pensado asked right before Jaycen's answer). Low additional cost over 3a — it's a
retrieval-time behavior change (what text is returned once a small chunk wins), not a new embedding
investment.

### 3c. Proposition-based indexing
Extract atomic facts/claims per chunk (e.g. "Jaycen Joshua runs two instances of the Avid/Waves NLS
channel strip in series on drum/bass buses to emulate analog board-to-board variance and increase
perceived stereo width") and index THOSE as the retrieval unit, separate from the natural transcript
chunk. This is the most surgical fix for finding (a) — a proposition is maximally concentrated, zero
dilution by definition — but it is also the most expensive to build and maintain: every chunk needs an
LLM extraction pass (cost: comparable to 3a's Haiku pass, but more fragile prompt-engineering — propositions
must stay faithful to the transcript, a real fabrication risk the semantic-search upgrade was explicitly
built to avoid), and a given spoken answer by a producer is sometimes genuinely NOT reducible to a single
clean proposition (meandering conversational teaching, hedges, "it depends" caveats) — forcing one risks
losing nuance that Hope's existing anti-fabrication design depends on being able to quote faithfully. Not
recommended as a first move for this corpus; flag as a possible SECOND-order refinement only if 3a+3b
together still leave specific known-bad queries unsolved.

### 3d. Anthropic's contextual retrieval technique
This is **effectively what's already shipped** via voyage-context-3's contextualized chunk embeddings
plus the deriveSessionLabel identity injection (item 35) — the core idea (prepend document-level context
to each chunk before embedding/indexing, specifically to fix "a chunk that means nothing without its
parent document's identity") is the same mechanism Anthropic published, just implemented via Voyage's
native contextualized-embeddings API rather than a manual "prepend a context sentence, generated by an
LLM, to each chunk's text" step. Worth noting explicitly for Kevin: there is no separate "add Anthropic's
contextual retrieval" to-do here — it's already the architecture. What it does NOT solve, confirmed live
tonight, is topical dilution WITHIN a chunk (the NLS aside problem) — Anthropic's technique concentrates
a chunk's connection to its document, not a chunk's connection to one specific detail inside itself. This
reframes 3a as "layer finer chunking on top of the contextual-retrieval mechanism we already have," not
"replace it."

### 3e. Query expansion / rewriting before the search fires
Have the model (or a cheap intermediate call) reformulate a vague/conversational question into more
search-friendly terms before embedding it — e.g. turn "what does Jaycen say about NLS buses in series"
into "NLS channel strip multiple instances drum bus analog emulation Jaycen Joshua." Already flagged as
a candidate in item 37's "not scoped yet" list. **Does not address finding (a)** (the target chunk is
still diluted regardless of how the query is worded) but could meaningfully help finding (b) if the
rewrite pulls in the specific gear name/technique rather than the conversational phrasing. Cheap to build
(one more Haiku call before `/kb/vector-search`), cheap to run, but is a band-aid on query phrasing, not a
fix to the index — the kind of incremental patch Kevin explicitly asked to move past tonight. Worth
keeping in the toolkit as a complement, not a replacement, to re-chunking.

### 3f. HyDE (Hypothetical Document Embeddings)
Have the model generate a plausible "ideal answer" to the question first, then embed THAT instead of the
raw question, on the theory that a hypothetical answer's vocabulary is closer to the real transcript's
vocabulary than a question's vocabulary is. Plausible fit for exactly this corpus's conversational
register (a hypothetical producer-coach answer probably says "run two instances in series" the way the
real transcript does, closer than a listener's question would). Not yet validated for this corpus
specifically. Moderate build cost (one more Claude call per query, pre-embedding) and adds ~1 extra model
round-trip of latency to every KB search — a real cost in a live voice conversation where Hope is already
juggling BM25 + Vectorize + rerank. Flag as a candidate worth a small isolated test before committing,
not dismiss outright.

### 3g. Agentic / iterative multi-hop retrieval
Let the model issue a first retrieval, inspect what came back, and decide to re-query with a refined term
if the first pass looks thin or ambiguous (e.g. retrieve "Jaycen Joshua NLS", notice three different
Jaycen Joshua videos competing, ask a follow-up query naming a specific plugin/technique to disambiguate).
This is the most capable option on paper, and arguably the most natural fit for finding (b)'s actual
problem (disambiguating between several real same-producer videos) — but it is also the most expensive
in both latency (multiple round-trips mid-conversation) and build complexity (needs new tool-use loop
logic, not just an index change), and risks feeling sluggish in a live voice call. Recommend as a
LATER-phase idea if 3a+3b don't fully close the gap, not a first move.

---

## 4. Recommended path

**Primary recommendation: 3a (topic-shift chunking, LLM-assisted, MWTM-scoped first) + 3b (parent-document
return) together, NOT re-chunking the pre-existing 463-video KB in the same pass.**

Reasoning:
1. Tonight's live tests prove finding (a) — multi-topic dilution within large transcript chunks — is real
   and specifically a MWTM-shaped problem (§2's chunk-count-distribution data backs this: MWTM transcripts
   are compressed into very few, dense chunks; the pre-existing KB's problem, where it exists, looks
   structurally different and isn't yet proven to share the same cause).
2. 3a is the most direct fix for exactly what was measured. 3d (contextual retrieval) is already shipped
   and doesn't need re-deciding. 3c (propositions) is higher cost/fragility for a benefit 3a+3b likely
   already captures for this corpus's actual failure mode. 3e/3f (query-side fixes) are legitimate
   complements but are exactly the "patch, not a fix" pattern Kevin asked to stop doing tonight if used
   alone. 3g is real but premature before cheaper options are tried.
3. **Scope the re-chunking to MWTM's 145 videos / 576 chunks first**, not all 608 videos. This is a much
   smaller, cheaper, faster-to-validate pass (hours, not a multi-day re-ingest), it's where the proven
   failure lives, and it avoids re-touching 2,615 already-reasonably-performing pre-existing chunks before
   there's live evidence they share the same disease.
4. Investigating the pre-existing KB's 32.3% separately (its own small research/benchmark pass, not
   assumed solved by the MWTM fix) should be the next item after this ships and is measured — per §2,
   it may need a different mechanism (e.g. a per-video summary candidate, closer to 3b than 3a).

**Concrete steps, in order, before any of this is built (still research/planning, not implementation):**
1. Build the missing sandboxed "embed text, return vector, don't write to the index" Worker route
   (small, safe, read-only — a natural first PR even ahead of deciding the final chunking algorithm,
   since every subsequent re-chunking proposal needs a way to be benchmarked against real embeddings
   before a full re-ingest commitment).
2. Using that sandbox route, run the controlled comparison this session couldn't complete: take 5–10 real
   MWTM chunks with a known buried detail (the NLS case, the Stuart White mic-chain case already flagged
   in item 37, others), split each by topic boundary (can be done by hand for a 5–10 chunk pilot, no need
   for the LLM-splitter yet), re-embed both the original and split versions, and measure whether the
   split version's real cosine similarity to 3–5 natural paraphrased queries beats the original. This is
   the actual proof the "proxy" BM25 script I asked Codex for tonight was meant to approximate, done
   properly.
3. Only once that pilot shows a real, measured improvement (not assumed), build the LLM-assisted
   topic-boundary splitter for all 145 MWTM videos, re-embed, re-upsert into the existing Vectorize index
   (upsert, not a full index rebuild — existing `video_id`/`chunk` keys can be superseded in place),
   rebuild `kb-search-index.json` for the BM25 leg (Python script, already exists, needs the new chunk
   boundaries as input), and re-run item 37's exact benchmark methodology to get a new, comparable number
   against tonight's 3.9%.
4. Fold in 3b (parent-document context on read-back) at the same time, since it's a small, low-risk
   addition to the same code path (`read_yt_knowledge`'s resolved-document step) and directly resolves
   item 38's open question in the process (read-back should use the parent full-chunk/transcript context,
   not just the small matched proposition/micro-chunk — this makes the move off literal substring
   matching, flagged in item 38, effectively necessary rather than optional once 3a ships, since a
   micro-chunked index means the OLD literal-substring read-back would miss even more often than it does
   today).
5. Re-run the pre-existing (non-MWTM) KB benchmark fresh after the MWTM-only fix ships, to see whether its
   32.3% number moved at all (it shouldn't, if this really is MWTM-specific) — that result is itself
   useful signal for scoping the pre-existing KB's own follow-up investigation.

**Re-ingestion cost estimate, if 3a is approved for MWTM scope:** 145 videos / 576 chunks. LLM
topic-boundary splitting (one Haiku call per transcript, ~145 calls, each a few cents) + re-embedding via
voyage-context-3 (same volume as tonight's backfill, known-cheap per the semantic-search brief's own
estimate) + Vectorize upsert (same mechanism already used tonight, no new infra) + BM25 index rebuild
(existing script, runs in seconds). Order-of-magnitude: a few dollars, under an hour of wall-clock
end-to-end for a careful, verified run — NOT the same scale of effort as a full 608-video corpus re-chunk,
which is explicitly NOT being recommended tonight.

---

## 5. Low-risk wins vs. the bigger redesign

**Immediate, safe, NOT yet done (worth a future small session, not tonight, per Kevin's explicit "no more
patching" instruction — flagged here for visibility, not auto-applied):**
- None identified that wouldn't itself be "another patch" in the spirit Kevin asked to move past. The
  three fixes already shipped tonight (identity tokenization, BM25 saturation, bus/buss stemming) were
  the legitimate low-risk wins already available — this research pass deliberately does not propose a
  fourth/fifth keyword-list patch on top.

**Bigger, deliberate redesign (this brief's actual subject):**
- The 3a+3b MWTM-scoped re-chunking plan in §4, gated on the embedding-validation pilot in step 2 before
  any re-ingest commitment.
- The pre-existing KB's 32.3% figure as a separate, not-yet-scoped follow-up investigation (§2), likely
  needing its own research pass rather than inheriting MWTM's fix by assumption.

---

## 6. What this brief explicitly does NOT do

Per Kevin's instruction, no implementation shipped tonight. Not built: the sandbox embed-only Worker
route, the topic-boundary splitter, any re-chunking, any re-embedding, any index changes, any change to
`read_yt_knowledge`'s matching logic. `docs/ROADMAP.md` item 37 should be updated to point at this brief
as its research deliverable; item 38 stays open, now explicitly linked to step 4 above as its resolution
path rather than a standalone decision.
