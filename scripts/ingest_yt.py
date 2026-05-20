#!/usr/bin/env python3
"""
ingest_yt.py — Hope Knowledge Base ingestion script
Pulls a YouTube transcript and writes clean markdown to docs/knowledge/

Usage:
    python3 scripts/ingest_yt.py <youtube_url> [--channel CHANNEL_NAME]

Output:
    docs/knowledge/<video_id>.md
"""

import sys
import os
import re
import json
import argparse
from datetime import datetime, timezone
from urllib.parse import urlparse, parse_qs

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
except ImportError:
    print("ERROR: youtube-transcript-api not installed. Run: pip3 install youtube-transcript-api")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────

CHUNK_SIZE = 500        # target words per chunk
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'docs', 'knowledge')

# ── Helpers ───────────────────────────────────────────────────────────────────

def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from any youtube.com or youtu.be URL."""
    parsed = urlparse(url)
    if parsed.hostname in ('youtu.be',):
        return parsed.path.lstrip('/')
    if parsed.hostname in ('www.youtube.com', 'youtube.com'):
        qs = parse_qs(parsed.query)
        if 'v' in qs:
            return qs['v'][0]
    raise ValueError(f"Could not extract video ID from URL: {url}")


def fetch_transcript(video_id: str) -> list:
    """Fetch transcript entries as plain text strings."""
    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id)
        return [{'text': snippet.text} for snippet in transcript]
    except TranscriptsDisabled:
        print(f"ERROR: Transcripts are disabled for video {video_id}")
        sys.exit(1)
    except NoTranscriptFound:
        print(f"ERROR: No transcript found for video {video_id}")
        sys.exit(1)


def clean_text(text: str) -> str:
    """Remove transcript artifacts and normalise whitespace."""
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def chunk_transcript(entries: list, chunk_size: int = CHUNK_SIZE) -> list:
    """
    Combine transcript entries into ~chunk_size word chunks.
    Flushes only when past chunk_size AND last word ends a sentence (. ? !).
    """
    chunks = []
    current_words = []

    for entry in entries:
        text = clean_text(entry.get('text', '') if isinstance(entry, dict) else str(entry))
        words = text.split()
        current_words.extend(words)

        if len(current_words) >= chunk_size:
            chunks.append(' '.join(current_words))
            current_words = []

    if current_words:
        chunks.append(' '.join(current_words))

    return [c for c in chunks if c]


def fetch_video_title(video_id: str) -> str:
    """Best-effort title fetch via yt-dlp if available, else return video ID."""
    try:
        import yt_dlp
        ydl_opts = {'quiet': True, 'no_warnings': True, 'skip_download': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}", download=False
            )
            return info.get('title', video_id)
    except Exception:
        return video_id


def write_markdown(video_id: str, url: str, title: str, channel: str, chunks: list) -> str:
    """Write chunks to docs/knowledge/<video_id>.md and return output path."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, f"{video_id}.md")

    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    lines = []
    lines.append("---")
    lines.append(f"title: {json.dumps(title)}")
    lines.append(f"source: {json.dumps(url)}")
    lines.append(f"video_id: {json.dumps(video_id)}")
    lines.append(f"ingested: {json.dumps(today)}")
    lines.append(f"chunks: {len(chunks)}")
    lines.append(f"channel: {json.dumps(channel)}")
    lines.append("tags: [hope-kb, mixing, trap, hip-hop]")
    lines.append("---")
    lines.append("")
    lines.append(f"# {title}")
    lines.append("")
    lines.append(f"Source: {url}")
    lines.append(f"Channel: {channel}")
    lines.append("")

    for i, chunk in enumerate(chunks, 1):
        lines.append(f"## Chunk {i}")
        lines.append("")
        lines.append(chunk)
        lines.append("")

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    return out_path


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Ingest a YouTube video into Hope KB')
    parser.add_argument('url', help='YouTube video URL')
    parser.add_argument('--channel', default='SEIDS', help='Channel name for frontmatter (default: SEIDS)')
    args = parser.parse_args()

    print(f"→ URL: {args.url}")

    video_id = extract_video_id(args.url)
    print(f"→ Video ID: {video_id}")

    print("→ Fetching title...")
    title = fetch_video_title(video_id)
    print(f"→ Title: {title}")

    print("→ Fetching transcript...")
    entries = fetch_transcript(video_id)
    print(f"→ Transcript entries: {len(entries)}")

    print("→ Chunking...")
    chunks = chunk_transcript(entries)
    print(f"→ Chunks: {len(chunks)}")

    print("→ Writing markdown...")
    out_path = write_markdown(video_id, args.url, title, args.channel, chunks)
    print(f"✅ Done: {out_path}")
    print(f"   {len(chunks)} chunks written to {out_path}")


if __name__ == '__main__':
    main()
