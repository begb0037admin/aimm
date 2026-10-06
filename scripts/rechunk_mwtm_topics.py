#!/usr/bin/env python3
"""Rechunk existing MWTM transcripts by topic using Claude Haiku."""
import argparse
import json
import os
import re
import time
import urllib.error
import urllib.request

KNOWLEDGE_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "knowledge")
ENDPOINT = "https://aimm-proxy.kevinlelitte.workers.dev/anthropic/v1/messages"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/120.0.0.0 Safari/537.36")


def read_video(path):
    text = open(path, encoding="utf-8").read()
    match = re.match(r"\A---\s*\n(.*?)\n---\s*\n", text, re.S)
    if not match:
        raise ValueError("missing YAML frontmatter")
    fm = match.group(1)
    for key in ("title", "source", "video_id", "ingested"):
        if not re.search(rf"(?m)^{key}:\s*.+$", fm):
            raise ValueError(f"frontmatter missing {key}")
    start = match.end()
    headers = list(re.finditer(r"(?m)^## Chunk (\d+)\s*$", text[start:]))
    if not headers:
        raise ValueError("no chunk sections")
    headers.sort(key=lambda m: int(m.group(1)))
    preamble = text[:start + headers[0].start()].rstrip()
    chunks = []
    for i, header in enumerate(headers):
        body_start = start + header.end()
        body_end = start + headers[i + 1].start() if i + 1 < len(headers) else len(text)
        body = text[body_start:body_end].strip()
        if body:
            chunks.append((int(header.group(1)), body))
    chunks.sort(key=lambda pair: pair[0])
    return preamble, chunks


def ask_haiku(transcript):
    prompt = ("Split this transcript into topic-coherent segments, roughly 100-300 words "
              "each; a segment may be shorter for a single distinct aside. Every segment "
              "must be copied VERBATIM from the transcript, with no paraphrasing. Reply "
              'with STRICT JSON ONLY in this shape: {"segments":["...","..."]}.\n\n'
              "TRANSCRIPT:\n" + transcript)
    payload = json.dumps({"model": "claude-haiku-4-5-20251001", "max_tokens": 8192,
                          "messages": [{"role": "user", "content": prompt}]}).encode()
    req = urllib.request.Request(ENDPOINT, data=payload, method="POST", headers={
        "Content-Type": "application/json", "Origin": "http://localhost:8000",
        "anthropic-version": "2023-06-01", "User-Agent": UA,
    })
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as response:
                result = json.loads(response.read().decode("utf-8"))
            content = result.get("content", [])
            raw = "".join(item.get("text", "") for item in content if item.get("type") == "text").strip()
            # Defensive: strip a ```json ... ``` / ``` ... ``` fence if Haiku wraps the
            # JSON in one despite being told not to -- cheap insurance against an
            # otherwise-good response getting treated as a parse failure and skipped.
            if raw.startswith("```"):
                raw = re.sub(r"^```[a-zA-Z]*\n?", "", raw)
                raw = re.sub(r"\n?```$", "", raw).strip()
            parsed = json.loads(raw)
            segments = parsed.get("segments") if isinstance(parsed, dict) else None
            if not isinstance(segments, list) or not segments or not all(isinstance(s, str) and s.strip() for s in segments):
                raise ValueError("response must contain a non-empty string segments array")
            return [s.strip() for s in segments]
        except urllib.error.HTTPError:
            raise
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            if attempt == 3:
                raise RuntimeError(f"network failed after 4 attempts: {exc}") from exc
            time.sleep(2 ** attempt)


def verify(transcript, segments):
    normalize = lambda value: re.sub(r"\s+", " ", value).strip()
    source = normalize(transcript)
    cursor = 0
    total_words = 0
    for segment in segments:
        part = normalize(segment)
        position = source.find(part, cursor)
        if position < 0:
            raise ValueError("segment is not an exact transcript substring in order")
        cursor = position + len(part)
        total_words += len(part.split())
    original_words = len(source.split())
    if total_words < original_words * 0.9:
        raise ValueError(f"segments cover {total_words}/{original_words} words (<90%)")


def process(video_id, go):
    path = os.path.join(KNOWLEDGE_DIR, video_id + ".md")
    try:
        preamble, old_chunks = read_video(path)
        transcript = " ".join(body for _, body in old_chunks)
        segments = ask_haiku(transcript)
        verify(transcript, segments)
        old_words, new_words = len(transcript.split()), sum(len(s.split()) for s in segments)
        print(f"{video_id}: {len(old_chunks)} -> {len(segments)} chunks; avg words "
              f"{old_words / len(old_chunks):.1f} -> {new_words / len(segments):.1f}")
        if go:
            backup = path + ".pre-rechunk-backup"
            if os.path.exists(backup):
                raise FileExistsError(f"backup already exists: {backup}")
            with open(path, "rb") as src, open(backup, "xb") as dst:
                dst.write(src.read())
            # Keep the frontmatter/preamble's own 'chunks: N' count field (used by
            # build_kb_search_index.py to cross-check chunk counts) in sync with the
            # new chunk count -- found live: leaving it stale produces a mismatch
            # warning on every rebuild otherwise.
            preamble = re.sub(r"(?m)^chunks:\s*\d+\s*$", f"chunks: {len(segments)}", preamble)
            lines = [preamble, ""]
            for i, segment in enumerate(segments, 1):
                lines += [f"## Chunk {i}", "", segment, ""]
            with open(path, "w", encoding="utf-8") as out:
                out.write("\n".join(lines))
    except Exception as exc:
        print(f"WARNING: {video_id}: {exc}; skipped")


def main():
    parser = argparse.ArgumentParser()
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument("--video-id")
    target.add_argument("--all-mwtm", action="store_true")
    parser.add_argument("--go", action="store_true", help="write verified chunks (default: dry run)")
    args = parser.parse_args()
    if args.video_id:
        process(args.video_id, args.go)
    else:
        for name in sorted(os.listdir(KNOWLEDGE_DIR)):
            if name.startswith("mwtm-") and name.endswith(".md"):
                process(name[:-3], args.go)


if __name__ == "__main__":
    main()
