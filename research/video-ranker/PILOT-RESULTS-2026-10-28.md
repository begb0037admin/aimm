# Bounded cross-encoder pilot — 28 October 2026

## Decision

**Stop this training line for now.** The local cross-encoder reached 18/20 top-five on the title-derived holdout, only one question better than the full-catalogue Cohere baseline (17/20). It reached the expected video in the top five for only 1/6 confirmed real queries, versus 4/6 for the prior hybrid baseline.

The pilot gate was at least 19/20 top-five on the frozen title set and no regression on the six confirmed real queries. The model missed both parts. Do not deploy it or spend more time generating this same kind of training data without a new, testable hypothesis.

## Title-derived holdout

All methods ranked the same 737 video cards. The cards include title, channel, and transcript excerpts. The 20 title-derived queries and their expected video IDs were excluded from pilot training positives and negatives.

| Method | Expected video in top five |
|---|---:|
| Vector baseline | 16/20 (80%) |
| Hybrid baseline | 16/20 (80%) |
| Cohere Rerank 3.5, all 737 cards | 17/20 (85%) |
| Local trained cross-encoder | 18/20 (90%) |

| Q | Cohere full-catalogue rank | Trained cross-encoder rank |
|---:|---:|---:|
| 1 | 1 | 1 |
| 2 | 1 | 1 |
| 3 | 2 | 1 |
| 4 | 1 | 1 |
| 5 | 1 | 1 |
| 6 | 1 | 1 |
| 7 | 28 | 197 |
| 8 | 4 | 1 |
| 9 | 1 | 1 |
| 10 | 5 | 1 |
| 11 | 1 | 1 |
| 12 | 1 | 1 |
| 13 | 1 | 1 |
| 14 | 2 | 1 |
| 15 | 2 | 2 |
| 16 | 1 | 1 |
| 17 | 10 | 1 |
| 18 | 2 | 1 |
| 19 | 1 | 1 |
| 20 | 67 | 125 |

The trained model improved Q17 and Q10, but degraded Q7 and Q20. The two persistent misses are still severe.

## Confirmed real-query holdout

Only six real-query labels are confirmed. The cross-encoder’s ranks are compared with the frozen vector and hybrid baselines:

| Real Q | Trained rank | Vector rank | Hybrid rank |
|---:|---:|---:|---:|
| 1 | 77 | 14 | 10 |
| 7 | 108 | — | — |
| 23 | 2 | 4 | 2 |
| 24 | 75 | 1 | 1 |
| 25 | 32 | 1 | 1 |
| 38 | 207 | — | 11 |

The model got 1/6 confirmed real answers into the top five; hybrid had 4/6. The remaining 32 real-query labels are uncertain and are not counted as ground truth.

## What was trained

- Generated 268 candidate questions locally with `mlx-community/Qwen3-4B-4bit`; no API key or external generation service was used.
- Kept 100 training and 21 validation queries after screening. Source videos were disjoint between splits, and all benchmark target videos were excluded from the pilot positives and negatives.
- Screened draft answers and likely hard negatives with `cross-encoder/nli-deberta-v3-small`; one borderline training example received a direct manual transcript check.
- Fine-tuned `cross-encoder/ms-marco-MiniLM-L-6-v2` for three epochs with binary cross-entropy. Training used 300 pairs; validation used 63 pairs.

These are weak labels, not a gold-standard dataset. The NLI screen checks whether the draft answer is supported by a transcript excerpt; it does not fully establish that every generated question and answer pair is semantically aligned. That limitation makes the poor real-query result a reason to stop, not a signal to enlarge this dataset blindly.

## Artifacts and scope

The generated queries, judgments, model weights, and result JSON files remain local under the gitignored `research/video-ranker/local/` directory. The source scripts and this report are on the unpushed `fix/video-level-retrieval` branch. No Worker, app route, secret, or live ranking was changed by this pilot.

