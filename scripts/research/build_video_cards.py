#!/usr/bin/env python3
"""Build one bounded, transcript-grounded search card per AIMM video."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip()


def spread_chunks(chunks: list[dict], count: int) -> list[dict]:
    if len(chunks) <= count:
        return chunks
    if count <= 1:
        return [chunks[0]]
    indexes = sorted({round(i * (len(chunks) - 1) / (count - 1)) for i in range(count)})
    return [chunks[i] for i in indexes]


def build_cards(rows: list[dict], max_chars: int = 5000, excerpts: int = 6) -> list[dict]:
    videos: dict[str, dict] = {}
    for row in rows:
        video_id = str(row.get("video_id") or "").strip()
        if not video_id:
            continue
        video = videos.setdefault(video_id, {
            "video_id": video_id,
            "title": clean(row.get("title")),
            "channel": clean(row.get("channel")),
            "chunks": [],
        })
        text = clean(row.get("x") or row.get("text"))
        if text:
            video["chunks"].append({"chunk": row.get("chunk"), "text": text})

    cards = []
    for video_id, video in sorted(videos.items(), key=lambda item: item[0]):
        selected = spread_chunks(video["chunks"], excerpts)
        header = f"Title: {video['title']}\nChannel: {video['channel']}"
        card_parts = [header]
        evidence = []
        remaining = max(0, max_chars - len(header))
        for row in selected:
            if remaining <= 0:
                break
            # Allocate space across the selected passages to retain coverage
            # across long videos rather than allowing the first passage to win.
            budget = max(160, remaining // max(1, len(selected) - len(evidence)))
            passage = row["text"][:budget].strip()
            if not passage:
                continue
            label = f"Transcript excerpt (chunk {row['chunk']}): "
            part = label + passage
            card_parts.append(part)
            evidence.append({"chunk": row["chunk"], "text": passage})
            remaining -= len(part)
        text = "\n".join(card_parts)
        cards.append({
            "id": video_id,
            "video_id": video_id,
            "title": video["title"],
            "channel": video["channel"],
            "text": text,
            "chunk_count": len(video["chunks"]),
            "evidence": evidence,
        })
    return cards


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--index", type=Path, default=Path("docs/knowledge/kb-search-index.json"))
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--max-chars", type=int, default=5000)
    parser.add_argument("--excerpts", type=int, default=6)
    args = parser.parse_args()
    if args.max_chars < 400 or args.excerpts < 1:
        parser.error("--max-chars must be at least 400 and --excerpts must be positive")
    try:
        rows = json.loads(args.index.read_text(encoding="utf-8"))
        if not isinstance(rows, list):
            raise ValueError("knowledge index must be a JSON array")
        cards = build_cards(rows, args.max_chars, args.excerpts)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open("w", encoding="utf-8") as handle:
            for card in cards:
                handle.write(json.dumps(card, ensure_ascii=False) + "\n")
        print(f"Wrote {len(cards)} video cards from {len(rows)} transcript chunks to {args.output}")
    except Exception as exc:  # report exact underlying local/data error
        print(f"ERROR: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
