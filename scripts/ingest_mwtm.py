#!/usr/bin/env python3
"""
ingest_mwtm.py — Pilot: transcribe a cut MWTM set via Kevin's own meeting-transcriber
Worker (https://transcribe.lelitte.co.uk) and write it into Hope's knowledge base in
exactly the same markdown/index shape scripts/ingest_yt.py uses, so search_yt_knowledge
and read_yt_knowledge pick it up with zero changes to Hope or index.html.

Pipeline per part:
  1. ffmpeg: extract audio from Part_NN...mp4 -> mono 64kbps mp3 (small, free, local)
  2. POST /upload-url  -> {uploadUrl, key, uploadToken, expiresAt}
  3. PUT the mp3 to uploadUrl (direct to R2, no Worker involvement)
  4. POST /transcribe {source:"r2", ...} -> {status, text, language, words}
  5. chunk_transcript() (same ~500-word logic as ingest_yt.py) + write markdown
  6. update_index() (same shape, video_id = a stable mwtm-<slug>-pNN id)
  7. build_kb_search_index.py (unchanged) rebuilds kb-search-index.json

Usage:
    python3 scripts/ingest_mwtm.py <set_folder_name> [--go]

Dry run (default): extracts audio and reports sizes/durations, does NOT call the
transcription API or write anything. Pass --go to actually transcribe and ingest.
"""
import sys, os, re, json, time, argparse, subprocess, urllib.request, urllib.error

WORKER = "https://meeting-transcriber-worker.kevinlelitte.workers.dev"  # confirmed from index.html's DEFAULT_TRANSCRIBE_ENDPOINT
TUTORIALS = "/Volumes/MacStore/AIMM_MWTM_Tutorials"
KNOWLEDGE_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "knowledge")
CHUNK_SIZE = 500


def clean_text(text):
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def chunk_transcript(text, chunk_size=CHUNK_SIZE):
    """Flush at a sentence end once past chunk_size, same as ingest_yt.py. Cloudflare's
    Whisper output sometimes carries NO punctuation at all (observed on a real MWTM part),
    in which case the sentence-end condition never fires — so a hard cap at 1.5x chunk_size
    forces a flush anyway rather than letting the whole transcript collapse into one chunk."""
    words = clean_text(text).split()
    hard_cap = int(chunk_size * 1.5)
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        if (len(cur) >= chunk_size and w.endswith((".", "?", "!"))) or len(cur) >= hard_cap:
            chunks.append(" ".join(cur)); cur = []
    if cur:
        chunks.append(" ".join(cur))
    return [c for c in chunks if c]


def extract_audio(video_path, out_path):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                     "-i", video_path, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "64k", out_path],
                    check=True)


UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"


def http_json(url, payload, timeout=120):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), method="POST",
                                  headers={"Content-Type": "application/json", "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def http_put_file(url, path, content_type, timeout=300):
    with open(path, "rb") as f:
        data = f.read()
    req = urllib.request.Request(url, data=data, method="PUT",
                                  headers={"Content-Type": content_type, "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status


def _transcribe_once(mp3_path):
    size = os.path.getsize(mp3_path)
    filename = os.path.basename(mp3_path)
    up = http_json(f"{WORKER}/upload-url", {
        "filename": filename, "contentType": "audio/mpeg", "declaredSize": size, "mode": "standard",
    })
    http_put_file(up["uploadUrl"], mp3_path, "audio/mpeg")
    result = http_json(f"{WORKER}/transcribe", {
        "source": "r2", "key": up["key"], "mode": "standard",
        "declaredSize": size, "contentType": "audio/mpeg", "uploadToken": up["uploadToken"],
    }, timeout=1800)
    if result.get("status") != "ok":
        raise RuntimeError(f"transcribe failed: {result}")
    return result["text"]


def transcribe_via_worker(mp3_path, retries=2):
    """A mid-/transcribe connection reset happens occasionally (confirmed: the worker itself is
    healthy immediately after one such failure — not an outage). The upload key is single-use
    server-side (the coordinator's tryConsume), so a reset may mean the server actually finished
    and just didn't get the response back to us; retrying with the SAME key then 409s. The only
    safe retry is the whole cycle with a FRESH upload-url/key/token each attempt."""
    last_err = None
    for attempt in range(retries + 1):
        try:
            return _transcribe_once(mp3_path)
        except (ConnectionResetError, urllib.error.URLError, urllib.error.HTTPError) as e:
            last_err = e
            if attempt < retries:
                print(f"   (retrying with a fresh upload after {type(e).__name__}: {e})")
                time.sleep(5 * (attempt + 1))
    raise last_err
    return result["text"]


def write_markdown(video_id, source, title, channel, chunks, today, tags):
    os.makedirs(KNOWLEDGE_DIR, exist_ok=True)
    out_path = os.path.join(KNOWLEDGE_DIR, f"{video_id}.md")
    lines = ["---", f"title: {json.dumps(title)}", f"source: {json.dumps(source)}",
              f"video_id: {json.dumps(video_id)}", f"ingested: {json.dumps(today)}",
              f"chunks: {len(chunks)}", f"channel: {json.dumps(channel)}",
              f"tags: [{', '.join(tags)}]", "---", "", f"# {title}", "", f"Source: {source}",
              f"Channel: {channel}", ""]
    for i, c in enumerate(chunks, 1):
        lines += [f"## Chunk {i}", "", c, ""]
    open(out_path, "w", encoding="utf-8").write("\n".join(lines))
    return out_path


def update_index(video_id, title, channel, url, today, chunks):
    index_path = os.path.join(KNOWLEDGE_DIR, "index.json")
    data = json.load(open(index_path)) if os.path.exists(index_path) else {"videos": []}
    videos = data.get("videos", [])
    entry = {"video_id": video_id, "title": title, "channel": channel, "url": url,
             "ingested": today, "chunks": len(chunks)}
    for i, existing in enumerate(videos):
        if existing.get("video_id") == video_id:
            videos[i] = entry; break
    else:
        videos.append(entry)
    data["videos"] = videos
    os.makedirs(KNOWLEDGE_DIR, exist_ok=True)
    json.dump(data, open(index_path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("set_folder")
    ap.add_argument("--go", action="store_true")
    a = ap.parse_args()
    set_dir = os.path.join(TUTORIALS, a.set_folder)
    if not os.path.isdir(set_dir):
        sys.exit(f"STOP: not a folder: {set_dir}")
    manifest = json.load(open(os.path.join(set_dir, "set_manifest.json")))
    parts = sorted(manifest["parts"], key=lambda p: p["number"])
    slug = re.sub(r"_Mixing$|_Mastering$|_Interview$", "", a.set_folder).lower().replace("_", "-")
    channel = "Mix With The Masters"
    today = time.strftime("%Y-%m-%d")

    for p in parts:
        num = p["number"]
        candidates = [f for f in os.listdir(set_dir) if f.startswith(f"Part_{num:02d}_") and f.endswith(".mp4")]
        if not candidates:
            print(f"SKIP: no file for part {num}"); continue
        video_path = os.path.join(set_dir, candidates[0])
        mp3_path = f"/tmp/mwtm_ingest_p{num:02d}.mp3"
        print(f"-- Part {num}: {candidates[0]}")
        extract_audio(video_path, mp3_path)
        size_mb = os.path.getsize(mp3_path) / 1e6
        print(f"   audio extracted: {size_mb:.1f} MB")
        if not a.go:
            os.remove(mp3_path)
            continue
        print("   uploading + transcribing...")
        text = transcribe_via_worker(mp3_path)
        os.remove(mp3_path)
        word_count = len(text.split())
        print(f"   got {word_count} words")
        chunks = chunk_transcript(text)
        video_id = f"mwtm-{slug}-p{num:02d}"
        title = f"{manifest.get('track','')} — Part {num}: {p['label'].replace('_',' ')}"
        source = f"MWTM set record: docs/mwtm/sets/{a.set_folder}.md (local recording, no public URL)"
        write_markdown(video_id, source, title, channel, chunks, today,
                        ["hope-kb", "mwtm", manifest.get("kind", "mixing").lower()])
        update_index(video_id, title, channel, source, today, chunks)
        print(f"   wrote {video_id}.md ({len(chunks)} chunks)")

    if a.go:
        subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), "build_kb_search_index.py")], check=True)
    else:
        print("DRY RUN (audio extraction + sizing only). Re-run with --go to transcribe and ingest.")


if __name__ == "__main__":
    main()
