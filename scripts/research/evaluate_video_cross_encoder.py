#!/usr/bin/env python3
"""Evaluate a local cross-encoder over every video card for each benchmark question."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def read_jsonl(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as handle:
        for number, line in enumerate(handle, 1):
            if line.strip():
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError as exc:
                    raise ValueError(f"{path}:{number}: {exc}") from exc
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, required=True, help="Saved model directory or Hub model ID")
    parser.add_argument("--cards", type=Path, required=True)
    parser.add_argument("--benchmark", type=Path, required=True)
    parser.add_argument("--suite", choices=("title", "real", "all"), default="title")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        from sentence_transformers import CrossEncoder
        cards = read_jsonl(args.cards)
        payload = json.loads(args.benchmark.read_text(encoding="utf-8"))
        questions = payload.get("results") if isinstance(payload, dict) else payload
        if not isinstance(questions, list):
            raise ValueError("benchmark must be a JSON array or an object with a results array")
        questions = [row for row in questions if args.suite == "all" or row.get("suite") == args.suite]
        if args.limit is not None:
            questions = questions[:max(0, args.limit)]
        if not cards or not questions:
            raise ValueError("cards and selected benchmark questions must be non-empty")
        ids = [str(card["id"]) for card in cards]
        model = CrossEncoder(str(args.model), num_labels=1, max_length=512)
        results = []
        for number, item in enumerate(questions, 1):
            query = str(item.get("question") or "").strip()
            if not query:
                raise ValueError(f"benchmark question {number} has no query")
            pairs = [[query, str(card["text"])] for card in cards]
            scores = model.predict(pairs, batch_size=args.batch_size, show_progress_bar=False)
            order = sorted(range(len(cards)), key=lambda i: float(scores[i]), reverse=True)
            ranks = {ids[index]: rank for rank, index in enumerate(order, 1)}
            expected = [str(value) for value in item.get("expected", [])]
            best_rank = min((ranks[value] for value in expected if value in ranks), default=None)
            results.append({
                "suite": item.get("suite"),
                "n": item.get("n"),
                "question": query,
                "expected": expected,
                "best_rank": best_rank,
                "top5": [{"rank": rank, "video_id": ids[index], "score": float(scores[index])}
                         for rank, index in enumerate(order[:5], 1)],
                "ranked_ids": [ids[index] for index in order],
            })
            print(f"[{number}/{len(questions)}] {item.get('suite')} Q{item.get('n')}: best rank {best_rank}")
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps({
            "method": "local-cross-encoder-full-video-catalogue",
            "model": str(args.model),
            "video_count": len(cards),
            "question_count": len(results),
            "results": results,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        labeled = [row for row in results if row["best_rank"] is not None]
        top5 = sum(row["best_rank"] <= 5 for row in labeled)
        print(f"Completed: {top5}/{len(labeled)} labeled questions in top 5; report: {args.output}")
    except ImportError as exc:
        print(f"ERROR: missing local inference dependency: {exc}. Install scripts/research/requirements.txt", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"ERROR: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
