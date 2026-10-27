# AIMM video-ranker training pilot

This pilot is isolated from the live app and Worker. It has two purposes:

1. Compare the current Cohere reranker when given **all 737 video cards**, removing Vectorize candidate recall as a bottleneck.
2. Prepare and train an open cross-encoder from reviewed question-to-video judgments.

The existing index (`docs/knowledge/kb-search-index.json`) contains 7,556 transcript chunks across 737 videos. The card builder produces one bounded document per video, with its title, channel and transcript excerpts spread across the video.

## Research finding that changes the plan

Cohere's current Rerank 5 API supports up to 10,000 documents per request, while its API reference recommends staying at or below 1,000; a 737-video full-catalogue comparison fits within both. The API can be used as a no-training baseline and candidate-label suggester. It is not a trainable endpoint: Cohere's deprecation notice says fine-tuning for rerank models was retired in September 2025. Sources: [Rerank best practices](https://docs.cohere.com/docs/reranking-best-practices), [Rerank API](https://docs.cohere.com/reference/rerank), and [Cohere deprecations](https://docs.cohere.com/docs/deprecations).

For training, this pilot uses Sentence Transformers' supported CrossEncoder training API and binary cross-entropy over query/video pairs. Its current guidance calls out hard negatives, warns that rerankers can overfit quickly, and recommends held-out evaluation. GPL provides a closely related research recipe: generate queries from target-domain text, mine difficult negatives, and use a cross-encoder teacher for pseudo-labels. Sources: [GPL paper](https://aclanthology.org/2022.naacl-main.168.pdf), [CrossEncoder training guidance](https://www.sbert.net/docs/cross_encoder/training_overview.html), and [loss overview](https://www.sbert.net/docs/cross_encoder/loss_overview.html).

## Build the video cards

From the repository root:

```sh
python3 scripts/research/build_video_cards.py \
  --output research/video-ranker/local/video-cards.jsonl
```

The output is local-only and gitignored. Each card carries `id`, `video_id`, title, channel, sampled transcript excerpts, and chunk numbers. Increase `--max-chars` or `--excerpts` to include more transcript, while keeping Cohere's 4,096-token per-document default in mind.

## Full-catalogue Cohere baseline

Use the existing research token from 1Password, placed only in the process environment as `AIMM_RESEARCH_TOKEN`; never put it in a file or pass it as a command-line argument. Then run:

```sh
python3 scripts/research/rerank_full_catalogue.py \
  --cards research/video-ranker/local/video-cards.jsonl \
  --benchmark research/video-ranker/local/benchmark.json \
  --suite title \
  --limit 1 \
  --output research/video-ranker/local/full-catalogue-smoke.json
```

`--limit 1` is a one-question endpoint smoke check across all video cards. Remove it to run the selected suite. Use `--suite real` for the real-question set or `--suite all` for both suites. The script reports the exact upstream/HTTP error and never prints the authorization header.

The benchmark format is the existing JSON shape: either an array or `{ "results": [...] }`; each row has `suite`, `n`, `question`, and `expected` video IDs. The pilot's 58-question benchmark already includes 20 title questions and 38 real questions. Preserve it outside the public repo because some rows contain spoken user queries. Only the six `sure=true` real labels are confirmed; do not call the other real-query labels ground truth until reviewed.

## Generate candidate synthetic questions

```sh
python3 scripts/research/make_question_jobs.py \
  --cards research/video-ranker/local/video-cards.jsonl \
  --questions-per-video 12 \
  --output research/video-ranker/local/question-jobs.jsonl
```

This creates 737 transcript-grounded jobs requesting up to 8,844 varied questions. It does **not** call a model, spend API credits, or mark results verified. Review generated questions against their cited chunk/quote, remove duplicates and incorrectly answerable questions, and set `verified: true` only after that review. Internet questions can diversify wording, but their original labels point to web documents, not our videos; map and verify them against transcript evidence before training.

## Reviewed judgments format

Create a private local `judgments.jsonl`, one question per line:

```json
{"query":"How do I clean up a muddy clap with EQ?","positive_video_ids":["mk-bbzNkeJc"],"judged_negative_video_ids":["5QDXc8s6GgM","I_X-XEpX6LY"],"evidence":[{"video_id":"mk-bbzNkeJc","chunk":3,"quote":"..."}],"source":"human_verified_internet","verified":true,"split":"train"}
```

Rules:

- `positive_video_ids` may contain more than one valid answer.
- `judged_negative_video_ids` must be reviewed as genuinely not answering the question; similar-topic videos are useful hard negatives only after that check.
- Include an `evidence` entry for every positive, with an exact transcript quote and chunk ID; the trainer checks that the quote exists in the exported card.
- Keep generated variants of the same seed passage/query in one split to prevent leakage.
- Split by question family/source before training. Keep a separate human-written, real-query holdout untouched until final evaluation.
- Use `train`, `validation`, or `test`; training reads only rows marked `verified: true` and never uses the test split.
- Do not publish query logs, spoken user text, or the local judgments file.

## Train and evaluate

Install the optional local dependencies:

```sh
python3 -m venv .venv-ranker
source .venv-ranker/bin/activate
python3 -m pip install -r scripts/research/requirements.txt
```

Train only after reviewed data includes at least 100 distinct verified training queries and at least 20 distinct verified validation queries. These are minimum safeguards for a pilot, not a claim that this quantity guarantees generalisation:

```sh
python3 scripts/research/train_video_cross_encoder.py \
  --cards research/video-ranker/local/video-cards.jsonl \
  --judgments research/video-ranker/local/judgments.jsonl \
  --output research/video-ranker/local/model-run
```

Evaluate a saved model across all videos, without a retrieval shortlist:

```sh
python3 scripts/research/evaluate_video_cross_encoder.py \
  --model research/video-ranker/local/model-run/model \
  --cards research/video-ranker/local/video-cards.jsonl \
  --benchmark research/video-ranker/local/benchmark.json \
  --suite title \
  --output research/video-ranker/local/model-title-results.json
```

Compare top-5 accuracy, reciprocal rank, and per-question ranks against the same frozen benchmark and the prior vector/hybrid results. Report confirmed and uncertain-label groups separately. No model, site, Worker, secret, route, or live ranking is changed by these tools.

## Current readiness and known blockers

- Full-catalogue reranking and local model evaluation are implemented as separate reproducible commands.
- Data generation is prepared as prompt jobs. It awaits an explicitly selected, already-authorized generation model/credential; this pilot does not access or create credentials.
- A trainable dataset does not exist yet. The scripts reject unverified labels and require reviewed hard negatives and a validation split.
- Do not treat thousands of generated or internet questions as thousands of independent facts. They are useful supervision only when each positive is supported by this library's video content.
- This pilot is local, unmerged, and undeployed. The live app and Worker remain untouched.
