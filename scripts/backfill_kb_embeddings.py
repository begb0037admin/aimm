#!/usr/bin/env python3
"""One-time semantic embedding backfill for the YouTube knowledge base."""

import argparse
import json
import os
import sys

import kb_embed_helper


INDEX_PATH = os.path.join(os.path.dirname(__file__), "..", "docs", "knowledge", "kb-search-index.json")


def main():
    parser = argparse.ArgumentParser(description="Backfill Vectorize embeddings for the full YouTube KB")
    parser.add_argument("--dry-run", action="store_true", help="Print counts without calling the Worker")
    parser.add_argument("--limit", type=int, default=None, help="Process only the first N videos")
    args = parser.parse_args()
    if args.limit is not None and args.limit < 1:
        parser.error("--limit must be at least 1")

    with open(INDEX_PATH, "r", encoding="utf-8") as handle:
        entries = json.load(handle)
    grouped = kb_embed_helper.group_chunks_by_video(entries)
    videos = list(grouped.items())
    if args.limit is not None:
        videos = videos[:args.limit]

    total = len(videos)
    processed = 0
    chunks_upserted = 0
    failures = []
    for number, (video_id, chunks) in enumerate(videos, 1):
        print(f"[{number}/{total}] {video_id} — {len(chunks)} chunks")
        if args.dry_run:
            processed += 1
            chunks_upserted += len(chunks)
            continue
        try:
            result = kb_embed_helper.upsert_video_chunks(video_id, chunks)
            processed += 1
            chunks_upserted += result["chunks_upserted"]
        except Exception as exc:
            failures.append((video_id, str(exc)))
            print(f"  WARNING: {exc}")

    print(f"Videos processed: {processed}/{total}")
    print(f"Chunks upserted: {chunks_upserted}")
    if failures:
        print(f"Failures: {len(failures)}")
        for video_id, error in failures:
            print(f"  - {video_id}: {error}")
        return 1
    print("Failures: 0")
    return 0


if __name__ == "__main__":
    sys.exit(main())
