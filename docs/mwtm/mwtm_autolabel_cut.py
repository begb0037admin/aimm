#!/usr/bin/env python3
"""Label and copy-cut a raw MWTM FULL.mp4 recording.

This is deliberately a two-stage command: it first asks mwtm_copycut.py for a
one-part dry run, parses the dividers it prints, and then calls its ``plan``
function with the resulting real count.  That keeps divider detection in one
place rather than maintaining a subtly different copy here.

The source is a folder below /Volumes/MacStore/AIMM_MWTM_Tutorials containing
only FULL.mp4.  --go requires a *new* --out directory.  In particular it does
not try to shuffle a bare FULL.mp4 out of the source folder: doing that would
temporarily move the only raw recording, and a failed cut could leave its
layout ambiguous.  Supply a fresh destination, review it, then make any
intentional source-folder replacement manually.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request

from mwtm_copycut import plan


TUTORIALS = "/Volumes/MacStore/AIMM_MWTM_Tutorials"
WORKER = "https://meeting-transcriber-worker.kevinlelitte.workers.dev"
# Routed through the existing aimm-proxy /anthropic passthrough (worker/src/index.js)
# instead of calling api.anthropic.com directly with a local ANTHROPIC_API_KEY -
# zero credentials needed in this script's own environment, same pattern already
# proven working for Markey's /kb/embed-debug work earlier tonight.
ANTHROPIC_URL = "https://aimm-proxy.kevinlelitte.workers.dev/anthropic/v1/messages"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15"


def http_json(url, payload, timeout=120, headers=None):
    request_headers = {"Content-Type": "application/json", "User-Agent": UA}
    if headers:
        request_headers.update(headers)
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), method="POST",
                                 headers=request_headers)
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read())


def http_put_file(url, path, content_type, timeout=300):
    with open(path, "rb") as f:
        data = f.read()
    req = urllib.request.Request(url, data=data, method="PUT",
                                 headers={"Content-Type": content_type, "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.status


def _transcribe_once(mp3_path):
    size = os.path.getsize(mp3_path)
    upload = http_json(f"{WORKER}/upload-url", {
        "filename": os.path.basename(mp3_path), "contentType": "audio/mpeg",
        "declaredSize": size, "mode": "standard",
    })
    http_put_file(upload["uploadUrl"], mp3_path, "audio/mpeg")
    result = http_json(f"{WORKER}/transcribe", {
        "source": "r2", "key": upload["key"], "mode": "standard",
        "declaredSize": size, "contentType": "audio/mpeg", "uploadToken": upload["uploadToken"],
    }, timeout=1800)
    if result.get("status") != "ok":
        raise RuntimeError(f"transcribe failed: {result}")
    return result["text"]


def transcribe_via_worker(mp3_path, retries=2):
    """Retry the complete upload cycle: worker upload keys are single-use."""
    last_error = None
    for attempt in range(retries + 1):
        try:
            return _transcribe_once(mp3_path)
        except (ConnectionResetError, urllib.error.URLError, urllib.error.HTTPError) as exc:
            last_error = exc
            if attempt < retries:
                print(f"   (retrying with a fresh upload after {type(exc).__name__}: {exc})")
    raise last_error


def detect_part_count(source):
    """Use copycut's printed divider classification as the count authority."""
    copycut = os.path.join(os.path.dirname(__file__), "mwtm_copycut.py")
    probe = subprocess.run([sys.executable, copycut, source, "--parts", "1", "--labels", "Probe",
                            "--out", os.path.join(tempfile.gettempdir(), "mwtm-autolabel-probe")],
                           capture_output=True, text=True)
    output = probe.stdout + "\n" + probe.stderr
    divider_re = re.compile(r"^\s*divider \(interior\):\s+([0-9.]+)s\s+->\s+([0-9.]+)s", re.M)
    interior = [(float(a), float(b)) for a, b in divider_re.findall(output)]
    if probe.returncode and "STOP:" not in output:
        raise RuntimeError("divider probe failed:\n" + output.strip())
    return len(interior) + 1, interior


def extract_clip(source, start, end, destination):
    clip_start = start + 5.0
    duration = min(45.0, end - clip_start)
    if duration <= 0:
        raise RuntimeError("part is shorter than five seconds after its boundary")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                    "-ss", f"{clip_start:.3f}", "-i", source, "-t", f"{duration:.3f}", "-vn",
                    "-ac", "1", "-ar", "16000", "-b:a", "64k", destination], check=True)


def normalise_label(value):
    words = re.findall(r"[A-Za-z0-9]+", value)
    if not 3 <= len(words) <= 6:
        raise ValueError("label must contain 3-6 words")
    label = "_".join(word[:1].upper() + word[1:] for word in words)
    if not re.fullmatch(r"[A-Za-z0-9_]+", label):
        raise ValueError("label contains invalid characters")
    return label


def label_transcript(transcript):
    # The aimm-proxy Worker injects the real key server-side and strips any
    # x-api-key this script sends - no local credential needed at all.
    result = http_json(ANTHROPIC_URL, {
        "model": "claude-haiku-4-5-20251001", "max_tokens": 40,
        "system": ("Return only one 3-6 word Title_Case_With_Underscores topic label for this "
                   "mixing/audio-engineering transcript snippet. Use only letters, digits, and "
                   "underscores; no punctuation or explanation."),
        "messages": [{"role": "user", "content": transcript[:12000]}],
    }, timeout=120, headers={
        "anthropic-version": "2023-06-01",
        # Worker's ALLOWED_ORIGINS check (browser-enforced only, but still
        # required from a plain script) - reuse the same origin the live app
        # itself sends.
        "Origin": "https://begb0037admin.github.io",
    })
    try:
        return normalise_label(result["content"][0]["text"].strip())
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise RuntimeError(f"invalid Anthropic label response: {result!r}") from exc


def fmt(seconds):
    minutes, seconds = divmod(seconds, 60)
    return f"{int(minutes):02d}:{seconds:05.2f}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_folder", help="folder beneath AIMM_MWTM_Tutorials containing FULL.mp4")
    parser.add_argument("--kind", default="")
    parser.add_argument("--engineer", default="")
    parser.add_argument("--artist", default="")
    parser.add_argument("--track", default="")
    parser.add_argument("--out", help="new destination set folder; required with --go")
    parser.add_argument("--go", action="store_true", help="write the copy-cut set after labels are reviewed")
    args = parser.parse_args()

    if os.path.basename(args.source_folder) != args.source_folder or args.source_folder in (".", ".."):
        parser.error("source_folder must be a folder name, not a path")
    source_dir = os.path.join(TUTORIALS, args.source_folder)
    source = os.path.join(source_dir, "FULL.mp4")
    if not os.path.isdir(source_dir) or not os.path.isfile(source):
        parser.error(f"expected raw source at {source}")
    if args.go and not args.out:
        parser.error("--go requires --out pointing at a new destination folder")
    if args.out and not os.path.isabs(args.out):
        parser.error("--out must be an absolute path")
    if args.go and os.path.exists(args.out):
        parser.error("--out already exists; choose a new destination set folder")

    try:
        count, detected = detect_part_count(source)
        cut_plan = plan(source, count)
    except (OSError, subprocess.CalledProcessError, RuntimeError) as exc:
        sys.exit(f"STOP: could not detect dividers: {exc}")
    if "error" in cut_plan:
        sys.exit("STOP: divider count changed while planning: " + cut_plan["error"])

    print(f"Detected {count} part(s); interior dividers: " +
          (", ".join(f"{fmt(a)} -> {fmt(b)}" for a, b in detected) or "none"))
    labels = []
    with tempfile.TemporaryDirectory(prefix="mwtm-autolabel-") as work:
        for number, (start, end) in enumerate(cut_plan["parts"], 1):
            fallback = f"Part_{number:02d}"
            clip = os.path.join(work, f"part_{number:02d}.mp3")
            try:
                extract_clip(source, start, end, clip)
                transcript = transcribe_via_worker(clip)
                label = label_transcript(transcript)
            except Exception as exc:
                print(f"WARNING: Part {number} labelling failed ({exc}); using {fallback}")
                label = fallback
            labels.append(label)
            print(f"Part {number:02d}: {fmt(start)} -> {fmt(end)}  {label}")

    if not args.go:
        print("DRY RUN — clips were transcribed and labelled; no video files were written.")
        return

    command = [sys.executable, os.path.join(os.path.dirname(__file__), "mwtm_copycut.py"), source,
               "--parts", str(count), "--labels", ",".join(labels), "--out", args.out,
               "--kind", args.kind, "--engineer", args.engineer, "--artist", args.artist,
               "--track", args.track, "--go"]
    print("Starting copy-cut into " + args.out)
    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as exc:
        sys.exit(f"STOP: copy-cut failed (exit {exc.returncode}); inspect the destination before retrying.")


if __name__ == "__main__":
    main()
