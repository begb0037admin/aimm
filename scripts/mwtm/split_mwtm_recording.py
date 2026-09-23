#!/usr/bin/env python3
"""Export reviewed MWTM source-time ranges into labelled tutorial MP4s.

The script deliberately requires explicit boundaries. MWTM transition slates
are visually similar but are not reliably detectable across all recordings;
the code-session operator must review and record the actual source times first.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


def slug(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_")
    return value or "Unknown"


def run(cmd: list[str], *, capture: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=True, text=True,
                          capture_output=capture)


def duration_seconds(path: Path) -> float:
    result = run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ], capture=True)
    return float(result.stdout.strip())


def validate_manifest(data: dict) -> None:
    required = ("kind", "engineer", "artist", "track", "source", "parts")
    missing = [key for key in required if not data.get(key)]
    if missing:
        raise SystemExit(f"Manifest missing: {', '.join(missing)}")
    if data["kind"] not in {"Mixing", "Production"}:
        raise SystemExit("kind must be Mixing or Production")
    if not isinstance(data["parts"], list) or not data["parts"]:
        raise SystemExit("parts must be a non-empty list")
    previous_end = None
    for expected, part in enumerate(data["parts"], 1):
        for key in ("number", "start", "end", "label"):
            if key not in part:
                raise SystemExit(f"Part {expected} missing {key}")
        if int(part["number"]) != expected:
            raise SystemExit("parts must be numbered consecutively from 1")
        start, end = float(part["start"]), float(part["end"])
        if start < 0 or end <= start:
            raise SystemExit(f"Invalid range for part {expected}: {start}–{end}")
        if previous_end is not None and abs(start - previous_end) > 0.05:
            raise SystemExit(
                f"Part {expected} does not start at the previous end "
                f"({start} vs {previous_end})"
            )
        previous_end = end


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true",
                        help="replace outputs only when explicitly requested")
    args = parser.parse_args()

    data = json.loads(args.manifest.read_text(encoding="utf-8"))
    validate_manifest(data)
    source = Path(data["source"])
    if not source.exists():
        raise SystemExit(f"Source not found: {source}")

    folder_name = "_".join([
        slug(data["engineer"]), slug(data["artist"]),
        slug(data["track"]), slug(data["kind"]),
    ])
    destination = Path(data.get(
        "destination", f"/Volumes/MacStore/AIMM_MWTM_Tutorials/{folder_name}"
    ))
    source_duration = duration_seconds(source)
    if float(data["parts"][-1]["end"]) > source_duration + 1:
        raise SystemExit("Final boundary is beyond the source duration")

    print(f"Source: {source} ({source_duration:.3f}s)")
    print(f"Destination: {destination}")
    for part in data["parts"]:
        number = int(part["number"])
        filename = f"Part_{number:02d}_{slug(part['label'])}.mp4"
        output = destination / filename
        print(f"  {filename}: {float(part['start']):.3f}–{float(part['end']):.3f}s")
        if output.exists() and not args.force:
            raise SystemExit(f"Refusing to overwrite existing file: {output}")

    if args.dry_run:
        return 0

    destination.mkdir(parents=True, exist_ok=True)
    full_copy = destination / "FULL.mp4"
    if source.resolve() != full_copy.resolve():
        if full_copy.exists() and not args.force:
            print(f"Keeping existing source copy: {full_copy}")
        else:
            shutil.copy2(source, full_copy)
            print(f"Copied source to: {full_copy}")
    manifest_copy = destination / "set_manifest.json"
    manifest_copy.write_text(json.dumps({**data, "destination": str(destination)},
                                        indent=2) + "\n", encoding="utf-8")
    info = destination / "SET_INFO.md"
    info.write_text(
        f"# {data['engineer']} — {data['artist']} — {data['track']}\n\n"
        f"- Kind: {data['kind']}\n"
        f"- Source: `{source}`\n"
        f"- Parts: {len(data['parts'])}\n\n"
        "Part boundaries are source-time ranges recorded in `set_manifest.json`.\n",
        encoding="utf-8",
    )

    for part in data["parts"]:
        number = int(part["number"])
        output = destination / f"Part_{number:02d}_{slug(part['label'])}.mp4"
        start, end = float(part["start"]), float(part["end"])
        command = [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
            "-ss", f"{start:.6f}", "-i", str(source),
            "-t", f"{end - start:.6f}",
            "-map", "0:v:0", "-map", "0:a?",
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart", str(output),
        ]
        run(command)

    # Keep a simple integrity report in the set folder for later handoff.
    report = []
    for output in sorted(destination.glob("Part_*.mp4")):
        report.append({"file": output.name, "duration": round(duration_seconds(output), 3),
                       "bytes": output.stat().st_size})
    (destination / "VERIFY.json").write_text(json.dumps(report, indent=2) + "\n",
                                              encoding="utf-8")
    print(f"Exported and verified {len(report)} parts")
    return 0


if __name__ == "__main__":
    sys.exit(main())
