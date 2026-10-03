# KB Semantic Search Upgrade — Architecture Brief

**Status: DECIDED, implementation starting 2026-10-03.** Canonical technical reference for both
AIMM/Hope and hr-fa-knowledge-base/Linda — same architecture, two separate implementations, each
against its own repo's existing Worker and ingest pipeline. Cross-cutting record also logged at
`begb0037admin/agent-commons/memory/candidate_kb_semantic_search_upgrade_hope_and_linda.md`.

## Why this exists

Measured 2026-10-03: Hope's keyword-only search (`search_yt_knowledge`/`read_yt_knowledge`, BM25-style
`kbSearchTok`/`kbSearchRetrieve` against `docs/knowledge/kb-search-index.json`) is invisible to 56.6% of
new MWTM videos and 47.5% of the pre-existing YouTube KB when searched by their own title, and misses
86.5%/92.2% of content beyond a video's opening chunk. Investigated whether Linda (hr-fa-knowledge-base)
had a working answer to reuse — she runs the identical client-side keyword-match family and has the same
underlying flaw (lower measured rate, 27.9%, due to denser HR-jargon vocabulary masking it, not better
tech — confirmed via a direct vocabulary-gap test). Full incident history: aimm `docs/ROADMAP.md` item
35, `begb0037admin/adam/memory/linda-search-mechanism-same-blind-spot.md`.

Kevin's directive (2026-10-03), verbatim: **"I need the absolute best fix, I don't care if it's going to
cost me — this is an absolute priority for both Hope and Linda — I need robust options, no quick fix or
cheaper bandaids."** Properly researched (web search against current, dated sources) before deciding —
not picked from training-data memory.

## Decided architecture

**1. Embeddings — `voyage-context-3` (Voyage AI, now MongoDB).** Chosen specifically because it generates
*contextualized chunk embeddings* — each chunk's vector encodes the chunk's own content plus the whole
document's context. This is a direct, benchmarked fix for our exact proven failure mode (a detail-rich
deep chunk with nothing tying it back to the document/producer/subject it belongs to — e.g. Stuart
White's mic-chain detail sitting in chunk 3 of his Yoncé transcript with no chunk-level signal connecting
it to "Stuart White" or "Yoncé"). Benchmarked 14–24% better retrieval than OpenAI-v3-large, Cohere-v4,
and Jina-v3 late-chunking specifically on chunk-vs-document-context retrieval (Voyage AI's own published
benchmark, cross-checked via web search 2026-10-03). Cost: ~$0.12/M tokens — one-time backfill of all
existing chunks (≈3,191 Hope + ≈23,345 Linda ≈ 26,500 total) is a few dollars, not recurring; per-query
embedding cost at runtime is fractions of a cent.

**2. Vector storage — Cloudflare Vectorize.** Decided over Pinecone/Turbopuffer explicitly:
- Both projects already run on Cloudflare Workers (`aimm-proxy` for Hope, `worker/worker.js` for Linda)
  with Cloudflare API access already in place — Vectorize needs zero new vendor account, zero new API
  key, provisioned entirely via the existing `wrangler`/Cloudflare API. Pinecone would require Kevin to
  create a new account and hand over a new credential — exactly the manual multi-step friction his
  standing zero-manual-steps rule exists to prevent, for no benefit at our scale.
- Vectorize is embedding-agnostic — it stores and searches arbitrary float vectors regardless of which
  model produced them, so choosing Vectorize does not compromise the embedding-quality decision above.
- Scale: Vectorize supports up to 10M vectors/index; our combined ~26,500 chunks across both projects is
  nowhere near a real constraint. Pinecone's extra raw performance headroom (lower p99 latency at
  10M–100M+ vector scale) buys nothing we'd ever feel at this size.
- Cost at our scale: negligible either way (Vectorize ~$5/mo base plan minimum); cost was not the
  deciding factor per Kevin's directive, but there is also no actual tradeoff being made here.

**3. Hybrid retrieval — keep the existing BM25 search, add semantic in parallel, fuse with Reciprocal
Rank Fusion (RRF).** 2026 best practice, confirmed across multiple current sources: dense embeddings
alone miss exact matches (model numbers like "Avalon 737", specific Hz values, plugin names); BM25 alone
misses paraphrased/differently-worded questions. The existing `kbSearchTok`/`kbSearchRetrieve` (Hope)
and `retrieve()` (Linda) implementations are NOT thrown away — they become one leg of the hybrid fusion,
run alongside a new Vectorize query, combined via RRF (standard starting parameters: k=60).

**4. Reranking — Cohere Rerank 3.5** as a cross-encoder pass over the RRF-fused top candidates before
handing results to the model. This is the single highest-leverage addition in the whole pipeline
(benchmarked +17.2 points MRR@3, +12.1 points Recall@5 over unreranked hybrid retrieval). Chosen over
Voyage rerank-2.5 for latency in a live chat context (~390ms vs ~610ms average) — both are within 1-3
NDCG@10 points of each other on quality and cost the same (~$0.05/M tokens), so latency was the
deciding factor for a conversational assistant.

## What implementation requires, per project

Both Markey (Hope, `begb0037admin/aimm`) and Adam (Linda, `begb0037admin/hr-fa-knowledge-base`) build
the same architecture independently against their own repo:

1. **New Worker route(s)** in the project's existing Worker (`aimm-proxy` / `worker/worker.js`) to proxy:
   embedding calls to Voyage's API (ingest-time batch + query-time single calls), Vectorize index
   writes/queries (via Cloudflare's native binding, no proxy needed if the Worker already runs on
   Cloudflare), and reranking calls to Cohere's API.
2. **One-time backfill**: embed every existing chunk (`docs/knowledge/*.md` chunks for Hope;
   `data/kb.json`/`data/kb-index.json` chunks for Linda) via voyage-context-3 and upsert into a new
   Vectorize index.
3. **Ingest pipeline update**: any future-ingested content (new `scripts/ingest_mwtm.py`/`ingest_yt.py`
   runs for Hope; Linda's existing scraper pipeline) gains an embedding+upsert step so new content never
   falls behind the backfill.
4. **Query-path rewrite**: `search_yt_knowledge`/`read_yt_knowledge` (Hope) and the equivalent retrieval
   call (Linda) change from pure BM25 to: BM25 top-N + Vectorize semantic top-N (parallel) → RRF fuse →
   Cohere rerank → top 5-8 results returned, same external tool contract/shape as today so nothing else
   in either app's calling code needs to change.
5. **New secrets**: a Voyage AI API key and a Cohere API key, per project (or shared across both if
   Kevin prefers one account — his call, not assumed). Cloudflare Vectorize itself needs no new secret,
   it uses the existing Cloudflare account/API access already configured for each project's Worker.

## Explicitly NOT in scope for this brief

- Does not change Hope's or Linda's conversational behavior/prompts beyond what's needed to keep using
  the same tool contract — this is a retrieval-quality fix, not a persona/prompt change.
- Does not merge Hope's and Linda's knowledge bases into one shared index — each project keeps its own
  separate Vectorize index, separate backfill, separate content. (A shared cross-project KB is a
  different, bigger idea, not decided here.)
- Does not remove BM25 — it stays as one leg of the hybrid fusion, not replaced.

## Full research trail (web-searched 2026-10-03, not from training-data memory)

- Embedding model landscape (MTEB rankings, Google gemini-embedding-001, Voyage-4-large, Qwen3-Embedding,
  OpenAI text-embedding-3-large, Cohere Embed v4)
- Vector DB comparison (Cloudflare Vectorize vs. Pinecone vs. Turbopuffer — pricing, latency, limits)
- Hybrid search + reranking best practice (BM25+dense+RRF+cross-encoder rerank pipeline, 2026 default)
- Cloudflare Workers AI's own embedding (`@cf/baai/bge-m3`) and reranking (`@cf/baai/bge-reranker-base`)
  models — considered and NOT chosen for the primary embedding role, since voyage-context-3's
  document-context-aware chunking is a direct, benchmarked fix for our specific measured failure mode
  that a generic multilingual model doesn't target
- voyage-context-3's specific "contextualized chunk embeddings" mechanism and benchmark results
- Cohere Rerank 3.5 vs. Voyage rerank-2.5 (accuracy, latency, cost)
