#!/usr/bin/env python3
"""Rerank all AIMM video cards for benchmark questions via the private research route."""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


DEFAULT_ENDPOINT = "https://aimm-proxy.kevinlelitte.workers.dev/research/kb-search"


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


def benchmark_rows(path: Path, suite: str) -> list[dict]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    rows = payload.get("results") if isinstance(payload, dict) else payload
    if not isinstance(rows, list):
        raise ValueError("benchmark must be a JSON array or an object with a results array")
    return [row for row in rows if suite == "all" or row.get("suite") == suite]


def request_rerank(endpoint: str, token: str, query: str, cards: list[dict], timeout: int) -> list[dict]:
    body = json.dumps({
        "mode": "rerank",
        "query": query,
        "documents": [{"id": card["id"], "text": card["text"]} for card in cards],
        "top_n": len(cards),
    }, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        endpoint,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "aimm-video-ranker-research/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace").strip()
        raise RuntimeError(f"HTTP {exc.code}: {detail or exc.reason}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"network error: {exc.reason}") from exc
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"invalid JSON response: {exc}") from exc
    if not isinstance(payload, dict) or not isinstance(payload.get("results"), list):
        raise RuntimeError(f"unexpected response: {json.dumps(payload, ensure_ascii=False)[:500]}")
    return payload["results"]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards", type=Path, required=True, help="JSONL from build_video_cards.py")
    parser.add_argument("--benchmark", type=Path, required=True, help="Existing retrieval benchmark JSON")
    parser.add_argument("--suite", choices=("title", "real", "all"), default="title")
    parser.add_argument("--limit", type=int, help="Run only the first N selected questions")
    parser.add_argument("--endpoint", default=DEFAULT_ENDPOINT)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--timeout", type=int, default=180)
    parser.add_argument("--pause", type=float, default=0.4)
    parser.add_argument("--dry-run", action="store_true", help="validate payload size and selection without making API calls")
    args = parser.parse_args()

    token = os.environ.get("AIMM_RESEARCH_TOKEN", "")
    if not token and not args.dry_run:
        print("ERROR: AIMM_RESEARCH_TOKEN is not set (read the existing value from 1Password into the environment; do not pass it on the command line).", file=sys.stderr)
        return 2
    try:
        cards = load_jsonl(args.cards)
        if not cards:
            raise ValueError("video-card file is empty")
        ids = [str(card.get("id") or "") for card in cards]
        if any(not item for item in ids) or len(set(ids)) != len(ids):
            raise ValueError("video-card IDs must be present and unique")
        if len(cards) > 10000:
            raise ValueError(f"catalogue has {len(cards)} cards; Cohere Rerank 5 accepts up to 10000 documents per request")
        questions = benchmark_rows(args.benchmark, args.suite)
        if args.limit is not None:
            questions = questions[:max(0, args.limit)]
        if not questions:
            raise ValueError(f"benchmark has no questions for suite {args.suite!r}")
        if args.dry_run:
            payloads = [len(json.dumps({
                "mode": "rerank", "query": str(item.get("question") or ""),
                "documents": [{"id": card["id"], "text": card["text"]} for card in cards],
                "top_n": len(cards),
            }, ensure_ascii=False).encode("utf-8")) for item in questions]
            print(f"Dry run: {len(cards)} unique video cards; {len(questions)} selected questions; Cohere Rerank 5 maximum 10,000 documents/request (1,000 recommended).")
            print(f"Largest prepared request: {max(payloads):,} bytes. No network request was made.")
            return 0

        output_rows = []
        for index, item in enumerate(questions, 1):
            query = str(item.get("question") or "").strip()
            if not query:
                raise ValueError(f"benchmark question {index} is missing question text")
            ranked = request_rerank(args.endpoint, token, query, cards, args.timeout)
            positions = {str(row.get("id")): rank for rank, row in enumerate(ranked, 1)}
            expected = [str(value) for value in item.get("expected", [])]
            best_rank = min((positions.get(video_id, 10**9) for video_id in expected), default=None)
            output_rows.append({
                "suite": item.get("suite"),
                "n": item.get("n"),
                "question": query,
                "expected": expected,
                "best_rank": best_rank if best_rank is None or best_rank < 10**9 else None,
                "vector_best_rank": item.get("vector_best_rank"),
                "hybrid_best_rank": item.get("hybrid_best_rank"),
                "top5": [
                    {"rank": rank, "video_id": row.get("id"), "score": row.get("relevance_score")}
                    for rank, row in enumerate(ranked[:5], 1)
                ],
                "ranked_ids": [row.get("id") for row in ranked],
            })
            print(f"[{index}/{len(questions)}] {item.get('suite')} Q{item.get('n')}: best rank {output_rows[-1]['best_rank']}")
            if index < len(questions) and args.pause > 0:
                time.sleep(args.pause)

        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps({
            "method": "cohere-rerank-v3.5-full-video-catalogue",
            "video_count": len(cards),
            "question_count": len(output_rows),
            "results": output_rows,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        found = [row for row in output_rows if row["best_rank"] is not None]
        top5 = sum(row["best_rank"] <= 5 for row in found)
        print(f"Completed: {top5}/{len(found)} labeled questions have an expected video in the top 5.")
        for suite_name in sorted({row.get("suite") or "unknown" for row in output_rows}):
            suite_rows = [row for row in output_rows if (row.get("suite") or "unknown") == suite_name and row["best_rank"] is not None]
            if not suite_rows:
                continue
            vector_count = sum(row["vector_best_rank"] is not None and row["vector_best_rank"] <= 5 for row in suite_rows)
            hybrid_count = sum(row["hybrid_best_rank"] is not None and row["hybrid_best_rank"] <= 5 for row in suite_rows)
            rerank_count = sum(row["best_rank"] <= 5 for row in suite_rows)
            print(f"  {suite_name}: full-catalogue {rerank_count}/{len(suite_rows)} top-5; vector baseline {vector_count}/{len(suite_rows)}; hybrid baseline {hybrid_count}/{len(suite_rows)}")
        print(f"Saved report to {args.output}")
    except Exception as exc:  # report exact underlying HTTP or data error
        print(f"ERROR: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
