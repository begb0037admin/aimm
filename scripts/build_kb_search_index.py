#!/usr/bin/env python3
"""
build_kb_search_index.py — Hope Knowledge Base search-index builder

Scans every docs/knowledge/<video_id>.md file (written by scripts/ingest_yt.py)
and emits a single flat chunk-level index, docs/knowledge/kb-search-index.json,
that Hope's client-side BM25-style retrieve() (index.html) loads once and
searches per question — instead of relying on a flat per-video digest that
truncates once the KB grows past a few dozen videos.

This ports the retrieval INDEX shape used by hr-fa-knowledge-base's "Linda"
assistant (data/kb-index.json: [{d, x}, ...]) but skips Linda's indirection
through a separate numeric-id metadata array, since aimm's per-video .md
files already carry video_id/title/channel in their frontmatter. Each chunk
object here embeds those fields directly:

    {"video_id": "...", "title": "...", "channel": "...", "chunk": 1, "x": "<chunk text>"}

`video_id` plays the role Linda's `d` plays for per-source retrieval capping.
`x` is transcript text ONLY (never title/channel) — Linda's retrieve() scores
against `x` alone, and mixing metadata into the scored text would change the
scoring distribution in a way that doesn't match the ported mechanism.

Usage:
    python3 scripts/build_kb_search_index.py [--quiet]

Output:
    docs/knowledge/kb-search-index.json

Called automatically at the end of every scripts/ingest_yt.py run (see
main() there) — see docs/INGEST.md Step 2. Safe to re-run any time; it's a
full rebuild from docs/knowledge/*.md + index.json, not an incremental patch.
"""

import sys
import os
import re
import json
import argparse

KNOWLEDGE_DIR = os.path.join(os.path.dirname(__file__), '..', 'docs', 'knowledge')
INDEX_JSON_PATH = os.path.join(KNOWLEDGE_DIR, 'index.json')
OUTPUT_PATH = os.path.join(KNOWLEDGE_DIR, 'kb-search-index.json')

FRONTMATTER_RX = re.compile(r'^---\n(.*?)\n---\n', re.DOTALL)
# Frontmatter values are written via json.dumps() by ingest_yt.py (write_markdown),
# so quoted string fields are valid JSON string literals — safe to json.loads()
# rather than hand-parsing (they can legitimately contain escaped quotes/unicode).
FRONTMATTER_FIELD_RX = re.compile(r'^([a-zA-Z_]+):\s*(.+)$')
CHUNK_HEADING_RX = re.compile(r'^## Chunk (\d+)\s*$', re.MULTILINE)


def parse_frontmatter(text: str) -> dict:
    """Parse the YAML-ish frontmatter block ingest_yt.py writes. Quoted scalar
    fields (title/source/video_id/ingested/channel) are real JSON string
    literals (written via json.dumps) — parse those with json.loads, not naive
    string stripping, since they may contain escaped quotes/backslashes/unicode.
    `tags` and `chunks` are NOT json.loads()-safe (tags is a bare flow list,
    chunks is a bare int) — handled separately.
    """
    m = FRONTMATTER_RX.match(text)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).split('\n'):
        line = line.rstrip()
        if not line.strip():
            continue
        fmatch = FRONTMATTER_FIELD_RX.match(line)
        if not fmatch:
            continue
        key, raw_val = fmatch.group(1), fmatch.group(2).strip()
        if key == 'chunks':
            try:
                fm[key] = int(raw_val)
            except ValueError:
                fm[key] = None
        elif key == 'tags':
            # bare flow list like: [hope-kb, mixing, trap, hip-hop] — not JSON
            # (unquoted items). Not needed for retrieval scoring; skip parsing.
            continue
        else:
            # title / source / video_id / ingested — real JSON string literals
            try:
                fm[key] = json.loads(raw_val)
            except (json.JSONDecodeError, ValueError):
                fm[key] = raw_val.strip('"')
    return fm


def split_chunks(text: str) -> list:
    """Split the markdown body on '## Chunk N' headings, returning
    [(chunk_number, chunk_text), ...] in file order. chunk_text excludes the
    heading line itself and is stripped of leading/trailing whitespace."""
    matches = list(CHUNK_HEADING_RX.finditer(text))
    out = []
    for i, m in enumerate(matches):
        num = int(m.group(1))
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        if body:
            out.append((num, body))
    return out


def build(quiet: bool = False) -> dict:
    warnings = []

    manifest = {"videos": []}
    if os.path.exists(INDEX_JSON_PATH):
        with open(INDEX_JSON_PATH, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
    manifest_videos = manifest.get('videos', [])
    manifest_by_id = {v.get('video_id'): v for v in manifest_videos}

    md_files = sorted(
        f for f in os.listdir(KNOWLEDGE_DIR)
        if f.endswith('.md') and f != 'index.json'
    )

    seen_ids = set()
    out_chunks = []
    total_chunks_written = 0

    # Deterministic build order: manifest order first (matches ingest history),
    # then any .md files present on disk but missing from the manifest.
    ordered_ids = [v.get('video_id') for v in manifest_videos if v.get('video_id')]
    md_ids_on_disk = {os.path.splitext(f)[0] for f in md_files}
    extra_ids = sorted(md_ids_on_disk - set(ordered_ids))
    ordered_ids += extra_ids

    for video_id in ordered_ids:
        if video_id in seen_ids:
            warnings.append(f"Duplicate video_id in build order, skipped: {video_id}")
            continue
        seen_ids.add(video_id)

        md_path = os.path.join(KNOWLEDGE_DIR, f"{video_id}.md")
        if not os.path.exists(md_path):
            warnings.append(f"Manifest entry has no .md file on disk: {video_id}")
            continue

        with open(md_path, 'r', encoding='utf-8') as f:
            text = f.read()

        fm = parse_frontmatter(text)
        fm_video_id = fm.get('video_id')
        if fm_video_id and fm_video_id != video_id:
            warnings.append(
                f"Frontmatter video_id ({fm_video_id!r}) disagrees with filename ({video_id!r})"
            )

        manifest_entry = manifest_by_id.get(video_id, {})
        title = fm.get('title') or manifest_entry.get('title') or video_id
        channel = fm.get('channel') or manifest_entry.get('channel') or ''

        chunks = split_chunks(text)
        if not chunks:
            warnings.append(f"No '## Chunk N' sections found: {video_id}")
            continue

        expected_chunks = fm.get('chunks') or manifest_entry.get('chunks')
        if expected_chunks is not None and expected_chunks != len(chunks):
            warnings.append(
                f"{video_id}: frontmatter/manifest says {expected_chunks} chunks, "
                f"found {len(chunks)} '## Chunk N' sections"
            )

        expected_nums = list(range(1, len(chunks) + 1))
        actual_nums = [n for n, _ in chunks]
        if actual_nums != expected_nums:
            warnings.append(
                f"{video_id}: chunk numbers non-sequential — found {actual_nums}"
            )

        for num, chunk_text in chunks:
            out_chunks.append({
                "video_id": video_id,
                "title": title,
                "channel": channel,
                "chunk": num,
                "x": chunk_text,
            })
            total_chunks_written += 1

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(out_chunks, f, ensure_ascii=False)

    if not quiet:
        print(f"[build_kb_search_index] {len(seen_ids)} videos, "
              f"{total_chunks_written} chunks -> {OUTPUT_PATH}")
        for w in warnings:
            print(f"[build_kb_search_index] WARNING: {w}")

    return {
        "videos": len(seen_ids),
        "chunks": total_chunks_written,
        "warnings": warnings,
        "output_path": OUTPUT_PATH,
    }


def main():
    parser = argparse.ArgumentParser(
        description='Rebuild docs/knowledge/kb-search-index.json from docs/knowledge/*.md'
    )
    parser.add_argument('--quiet', action='store_true', help='Suppress progress/warning output')
    args = parser.parse_args()
    result = build(quiet=args.quiet)
    if result['warnings'] and not args.quiet:
        print(f"[build_kb_search_index] {len(result['warnings'])} warning(s) — review above.")


if __name__ == '__main__':
    main()
