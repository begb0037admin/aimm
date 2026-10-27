#!/usr/bin/env python3
"""Fine-tune an open cross-encoder from verified video-relevance judgments."""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path


def load_jsonl(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            if line.strip():
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError as exc:
                    raise ValueError(f"{path}:{line_number}: {exc}") from exc
    return rows


def flatten_examples(judgments: list[dict], cards: list[dict]) -> dict[str, list[dict]]:
    card_by_id = {str(card["id"]): card for card in cards}
    splits: dict[str, list[dict]] = defaultdict(list)
    group_splits: dict[str, str] = {}
    for row_number, row in enumerate(judgments, 1):
        if row.get("verified") is not True:
            continue
        split = row.get("split")
        if split not in {"train", "validation", "test"}:
            raise ValueError(f"verified judgment {row_number} must have split train, validation, or test")
        query = str(row.get("query") or "").strip()
        if not query:
            raise ValueError(f"verified judgment {row_number} has an empty query")
        group_id = str(row.get("group_id") or query.casefold())
        previous_split = group_splits.setdefault(group_id, split)
        if previous_split != split:
            raise ValueError(f"question family {group_id!r} leaks across {previous_split} and {split} splits")
        if not isinstance(row.get("positive_video_ids"), list) or not isinstance(row.get("judged_negative_video_ids"), list):
            raise ValueError(f"verified judgment {row_number} must use arrays for positive_video_ids and judged_negative_video_ids")
        positive_ids = {str(value) for value in row.get("positive_video_ids", [])}
        negative_ids = {str(value) for value in row.get("judged_negative_video_ids", [])}
        if not positive_ids:
            raise ValueError(f"verified judgment {row_number} needs positive_video_ids")
        if positive_ids & negative_ids:
            raise ValueError(f"verified judgment {row_number} marks a video both positive and negative")
        unknown = (positive_ids | negative_ids) - card_by_id.keys()
        if unknown:
            raise ValueError(f"verified judgment {row_number} refers to unknown video IDs: {', '.join(sorted(unknown))}")
        if not negative_ids:
            raise ValueError(f"verified judgment {row_number} needs reviewed hard negatives before training")
        evidence_rows = row.get("evidence", [])
        if not isinstance(evidence_rows, list):
            raise ValueError(f"verified judgment {row_number} evidence must be an array")
        evidence_by_video = defaultdict(list)
        for entry in evidence_rows:
            if isinstance(entry, dict):
                evidence_by_video[str(entry.get("video_id"))].append(entry)
        for video_id in positive_ids:
            entries = evidence_by_video.get(video_id, [])
            if not entries:
                raise ValueError(f"verified judgment {row_number} needs transcript evidence for positive video {video_id}")
            card_evidence = card_by_id[video_id].get("evidence", [])
            for entry in entries:
                quote = " ".join(str(entry.get("quote") or "").split()).casefold()
                chunk = str(entry.get("chunk"))
                supported = any(
                    str(item.get("chunk")) == chunk and
                    quote and quote in " ".join(str(item.get("text") or "").split()).casefold()
                    for item in card_evidence if isinstance(item, dict)
                )
                if not supported:
                    raise ValueError(f"verified judgment {row_number} evidence quote for {video_id} chunk {chunk} is not an exact substring of the exported card; rebuild cards or correct the quote")
        for video_id in sorted(positive_ids):
            splits[split].append({"query": query, "document": card_by_id[video_id]["text"], "label": 1.0})
        for video_id in sorted(negative_ids):
            splits[split].append({"query": query, "document": card_by_id[video_id]["text"], "label": 0.0})
    if not splits["train"]:
        raise ValueError("no verified training pairs; mark reviewed rows verified=true and split=train")
    if not splits["validation"]:
        raise ValueError("no verified validation pairs; keep a held-out set for model selection")
    query_count = {split: len({row["query"] for row in values}) for split, values in splits.items()}
    if query_count["train"] < 100:
        raise ValueError(f"only {query_count['train']} distinct verified training queries; require at least 100 to start this pilot")
    if query_count["validation"] < 20:
        raise ValueError(f"only {query_count['validation']} distinct verified validation queries; require at least 20 for model selection")
    return splits


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards", type=Path, required=True)
    parser.add_argument("--judgments", type=Path, required=True)
    parser.add_argument("--model", default="cross-encoder/ms-marco-MiniLM-L-6-v2")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch-size", type=int, default=16)
    args = parser.parse_args()
    try:
        cards = load_jsonl(args.cards)
        judgments = load_jsonl(args.judgments)
        splits = flatten_examples(judgments, cards)
        # Optional ML dependencies are imported only after data validation.
        from datasets import Dataset
        from sentence_transformers import CrossEncoder, CrossEncoderTrainer, CrossEncoderTrainingArguments
        from sentence_transformers.cross_encoder import losses

        model = CrossEncoder(args.model, num_labels=1)
        trainer = CrossEncoderTrainer(
            model=model,
            train_dataset=Dataset.from_list(splits["train"]),
            eval_dataset=Dataset.from_list(splits["validation"]),
            loss=losses.BinaryCrossEntropyLoss(model),
            args=CrossEncoderTrainingArguments(
                output_dir=str(args.output),
                num_train_epochs=args.epochs,
                per_device_train_batch_size=args.batch_size,
                per_device_eval_batch_size=args.batch_size,
                learning_rate=2e-5,
                warmup_ratio=0.1,
                load_best_model_at_end=True,
                eval_strategy="epoch",
                save_strategy="epoch",
                metric_for_best_model="eval_loss",
                greater_is_better=False,
                save_total_limit=2,
                report_to=[],
            ),
        )
        trainer.train()
        model.save_pretrained(str(args.output / "model"))
        counts = {split: {"pairs": len(rows), "queries": len({row["query"] for row in rows})} for split, rows in splits.items()}
        (args.output / "training_manifest.json").write_text(json.dumps({
            "base_model": args.model,
            "counts": counts,
            "verified_only": True,
            "test_split_used_for_training": False,
        }, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(counts, indent=2))
        print(f"Saved model and manifest to {args.output}")
    except ImportError as exc:
        print(f"ERROR: missing training dependency: {exc}. Install scripts/research/requirements.txt", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"ERROR: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
