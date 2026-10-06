#!/usr/bin/env python3
"""Re-run ROADMAP item 37's semantic retrieval benchmark after MWTM rechunking."""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(ROOT, "docs", "knowledge", "kb-search-index.json")
IDS_PATH = (sys.argv[1] if len(sys.argv) > 1
            else os.path.join(ROOT, "scripts", "mwtm_rechunked_video_ids.txt"))
TOP_N = int(sys.argv[2]) if len(sys.argv) > 2 else 10
URL = "https://aimm-proxy.kevinlelitte.workers.dev/kb/vector-search"
HEADERS = {
    "Content-Type": "application/json",
    "Origin": "http://localhost:8000",
    "User-Agent": ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/130.0.0.0 Safari/537.36"),
}


def load_videos():
    with open(INDEX_PATH, encoding="utf-8") as handle:
        entries = json.load(handle)
    videos = {}
    for entry in entries:
        video_id = entry.get("video_id")
        if not video_id:
            continue
        if video_id not in videos:
            videos[video_id] = {"title": entry.get("title", ""), "chunks": []}
        try:
            videos[video_id]["chunks"].append(int(entry["chunk"]))
        except (KeyError, TypeError, ValueError):
            print("WARNING: invalid chunk in index for {}".format(video_id), file=sys.stderr)
    for video in videos.values():
        video["chunks"].sort()
    return videos


def load_targets():
    with open(IDS_PATH, encoding="utf-8") as handle:
        return [line.strip() for line in handle
                if line.strip() and not line.lstrip().startswith("#")]


def vector_search(title):
    payload = json.dumps({"query": title, "n": TOP_N}).encode("utf-8")
    error = None
    for attempt in range(2):
        try:
            request = urllib.request.Request(URL, data=payload, headers=HEADERS, method="POST")
            with urllib.request.urlopen(request, timeout=30) as response:
                body = json.loads(response.read().decode("utf-8"))
            if not isinstance(body.get("results"), list):
                raise ValueError("response has no results list")
            return body["results"]
        except (urllib.error.URLError, urllib.error.HTTPError, ValueError, json.JSONDecodeError) as exc:
            error = exc
            if attempt == 0:
                time.sleep(0.1)
    print("WARNING: skipping {!r} after two attempts: {}".format(title, error), file=sys.stderr)
    return None


def short_title(title):
    title = re.sub(r"\s+", " ", title).strip()
    return title[:67] + ("..." if len(title) > 67 else "")


def main():
    videos = load_videos()
    targets = load_targets()
    invisible = unreachable = measured = 0

    for video_id in targets:
        video = videos.get(video_id)
        if not video or not video["title"] or not video["chunks"]:
            print("WARNING: skipping {} (missing index title or chunks)".format(video_id), file=sys.stderr)
            continue
        results = vector_search(video["title"])
        if results is None:
            continue

        first_chunk = video["chunks"][0]
        own_chunks = set(video["chunks"])
        found = [result for result in results if result.get("video_id") == video_id
                 and result.get("chunk") in own_chunks]
        is_invisible = not found
        deep_reachable = any(result["chunk"] != first_chunk for result in found)
        invisible += is_invisible
        unreachable += not deep_reachable
        measured += 1
        print("{}: invisible: {}, deep_reachable: {}".format(
            short_title(video["title"]), "yes" if is_invisible else "no",
            "yes" if deep_reachable else "no"))
        time.sleep(0.1)

    if not measured:
        print("No videos were measured; no percentages to report.", file=sys.stderr)
        return 1
    cohort = os.path.basename(IDS_PATH)
    print("\nSummary ({}/{} videos measured, {})".format(measured, len(targets), cohort))
    print("Videos invisible to own title: {:.1f}%".format(100 * invisible / measured))
    print("Deep content (chunk 2+) unreachable: {:.1f}%".format(100 * unreachable / measured))
    return 0


if __name__ == "__main__":
    sys.exit(main())
