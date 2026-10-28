#!/usr/bin/env python3
"""Independently screen synthetic queries and mine likely hard negatives locally."""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from collections import Counter
from pathlib import Path


DEFAULT_MODEL = "cross-encoder/nli-deberta-v3-small"


def read_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def tokens(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.casefold())


def evidence_text(card: dict) -> str:
    evidence = card.get("evidence", [])
    return " ".join(str(row.get("text") or "") for row in evidence if isinstance(row, dict))[:5000]


def bm25_top(query: str, cards: list[dict], excluded: set[str], limit: int = 30) -> list[dict]:
    documents = [tokens(str(card.get("text") or "")) for card in cards]
    lengths = [len(doc) for doc in documents]
    average = sum(lengths) / max(len(lengths), 1)
    doc_freq = Counter(term for doc in documents for term in set(doc))
    query_terms = tokens(query)
    scored = []
    n = len(cards)
    for card, doc, length in zip(cards, documents, lengths):
        card_id = str(card.get("video_id"))
        if card_id in excluded:
            continue
        counts = Counter(doc)
        score = 0.0
        for term in query_terms:
            frequency = counts[term]
            if not frequency:
                continue
            inverse = math.log(1 + (n - doc_freq[term] + 0.5) / (doc_freq[term] + 0.5))
            score += inverse * frequency * 2.2 / (frequency + 1.2 * (0.25 + 0.75 * length / max(average, 1)))
        scored.append((score, card))
    return [card for score, card in sorted(scored, key=lambda row: row[0], reverse=True)[:limit] if score > 0]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards", type=Path, required=True)
    parser.add_argument("--candidates", type=Path, required=True)
    parser.add_argument("--benchmark", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--positive-threshold", type=float, default=0.80)
    parser.add_argument("--negative-threshold", type=float, default=0.05)
    parser.add_argument("--negatives-per-query", type=int, default=2)
    parser.add_argument("--negative-candidate-limit", type=int, default=8)
    parser.add_argument("--batch-size", type=int, default=64)
    args = parser.parse_args()
    try:
        import torch
        from transformers import AutoModelForSequenceClassification, AutoTokenizer

        cards = read_jsonl(args.cards)
        candidates = read_jsonl(args.candidates)
        benchmark_payload = json.loads(args.benchmark.read_text(encoding="utf-8"))
        benchmark = benchmark_payload.get("results") if isinstance(benchmark_payload, dict) else benchmark_payload
        benchmark_video_ids = {str(video_id) for row in benchmark for video_id in row.get("expected", [])}
        card_by_video = {str(card["video_id"]): card for card in cards}
        pilot_video_ids = {str(video_id) for row in candidates for video_id in row.get("positive_video_ids", [])}
        blocked_negative_ids = benchmark_video_ids | pilot_video_ids

        device = "mps" if torch.backends.mps.is_available() else "cpu"
        print(f"Loading independent NLI verifier {args.model} on {device}.", flush=True)
        tokenizer = AutoTokenizer.from_pretrained(args.model)
        model = AutoModelForSequenceClassification.from_pretrained(args.model).to(device)
        model.eval()
        label_map = {int(index): str(label).casefold() for index, label in model.config.id2label.items()}
        entailment_index = next(index for index, label in label_map.items() if "entail" in label)

        pairs: list[tuple[str, str]] = []
        pair_owner: list[tuple[int, str, str]] = []
        hard_candidates: list[list[dict]] = []
        for index, row in enumerate(candidates):
            positive_id = str(row["positive_video_ids"][0])
            card = card_by_video[positive_id]
            quote = row["evidence"][0]["quote"]
            evidence_rows = [entry for entry in card.get("evidence", []) if str(entry.get("chunk")) == str(row["evidence"][0]["chunk"])]
            premise = " ".join(str(entry.get("text") or "") for entry in evidence_rows)[:5000]
            # NLI expects a declarative claim as hypothesis; embedding the question
            # as prose made the verifier reject clear transcript entailments.
            hypothesis = str(row.get("draft_answer") or "").strip()
            pairs.append((premise, hypothesis))
            pair_owner.append((index, "positive", positive_id))
            excluded = blocked_negative_ids | {positive_id}
            mined = bm25_top(row["query"], cards, excluded, limit=args.negative_candidate_limit)
            hard_candidates.append(mined)
            for negative in mined:
                video_id = str(negative["video_id"])
                pairs.append((evidence_text(negative), hypothesis))
                pair_owner.append((index, "negative", video_id))

        scores: dict[tuple[int, str], float] = {}
        for start in range(0, len(pairs), args.batch_size):
            batch = pairs[start:start + args.batch_size]
            encoded = tokenizer(
                [left for left, _ in batch], [right for _, right in batch],
                padding=True, truncation=True, max_length=512, return_tensors="pt",
            ).to(device)
            with torch.inference_mode():
                logits = model(**encoded).logits.float()
                probabilities = torch.softmax(logits, dim=-1)[:, entailment_index].detach().cpu().tolist()
            for owner, probability in zip(pair_owner[start:start + args.batch_size], probabilities):
                index, kind, video_id = owner
                scores[(index, f"{kind}:{video_id}")] = float(probability)
            print(f"Scored {min(start + len(batch), len(pairs))}/{len(pairs)} query-document pairs.", flush=True)

        output_rows = []
        verified_count = Counter()
        for index, row in enumerate(candidates):
            positive_id = str(row["positive_video_ids"][0])
            positive_score = scores[(index, f"positive:{positive_id}")]
            negative_rows = []
            for card in hard_candidates[index]:
                video_id = str(card["video_id"])
                score = scores[(index, f"negative:{video_id}")]
                if score <= args.negative_threshold:
                    negative_rows.append({"video_id": video_id, "entailment": score})
            negative_rows = negative_rows[:args.negatives_per_query]
            row = dict(row)
            row["judged_negative_video_ids"] = [item["video_id"] for item in negative_rows]
            row["verified"] = positive_score >= args.positive_threshold and len(negative_rows) >= args.negatives_per_query
            row["verified_by"] = args.model
            row["nli_review"] = {
                "positive_entailment": positive_score,
                "suggested_negatives": negative_rows,
                "thresholds": {
                    "positive_min_entailment": args.positive_threshold,
                    "negative_max_entailment": args.negative_threshold,
                },
            }
            verified_count[str(row["split"])] += int(row["verified"])
            output_rows.append(row)

        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in output_rows), encoding="utf-8")
        summary = {
            "model": args.model,
            "candidate_count": len(output_rows),
            "machine_screened_verified": dict(verified_count),
            "required": {"train_queries": 100, "validation_queries": 20},
            "ready_for_training": verified_count["train"] >= 100 and verified_count["validation"] >= 20,
            "test_videos_excluded_from_train_and_validation_negatives": True,
            "manual_review_still_recommended": True,
        }
        summary_path = args.output.with_suffix(".summary.json")
        summary_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(summary, indent=2))
        print(f"Saved screened judgments to {args.output}; summary to {summary_path}")
    except ImportError as exc:
        print(f"ERROR: missing verification dependency: {exc}", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"ERROR: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
