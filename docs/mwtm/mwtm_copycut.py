#!/usr/bin/env python3
"""MWTM copy-cut: split one continuous OBS recording into labelled parts WITHOUT re-encoding.

Locked process since 2026-09-28 (see docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md).
- Streams are copied (ffmpeg -c copy): original OBS quality, seconds not hours.
- MWTM divider screens (white logo card, black) are KEPT. Each cut lands on a keyframe in the
  MIDDLE of the divider between two parts, so a part ends on it and the next starts on it.
- Blank/logo screens at the very start or end (e.g. Kevin AFK) are trimmed to ~KEEP_EDGE seconds.
- Default is a DRY RUN that prints the plan. Nothing is written until --go.

Usage:
  mwtm_copycut.py SOURCE.mp4 --parts 3 --labels "Label_One,Label_Two,Label_Three" \
      --out "/Volumes/MacStore/AIMM_MWTM_Tutorials/<Engineer>_<Artist>_<Track>_<Kind>" [--go]
Metadata (--kind/--engineer/--artist/--track) is only written into set_manifest.json.
Requires ffmpeg + ffprobe on PATH. Standard library only.
"""
import argparse, json, os, re, subprocess, sys, tempfile

BRIGHT, DARK = 195, 20      # keyframe mean-luma thresholds for divider screens (logo card ~204, black ~16)
MERGE_GAP = 6.0             # seconds: white->black transitions inside one divider are merged
KEEP_EDGE = 5.0             # seconds of leading/trailing blank kept at the very ends


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw).stdout


def keyframes(src):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
               "packet=pts_time,flags", "-of", "csv=p=0", src])
    return sorted(float(l.split(",")[0]) for l in out.splitlines() if "," in l and "K" in l.split(",")[1])


def luma(src):
    tmp = tempfile.mktemp(suffix=".txt")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y", "-skip_frame", "nokey",
                    "-i", src, "-an", "-vf",
                    f"scale=160:-2,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file={tmp}",
                    "-f", "null", "-"], check=True)
    rows, t = [], None
    for l in open(tmp):
        m = re.search(r"pts_time:([0-9.]+)", l)
        if m:
            t = float(m.group(1)); continue
        m = re.search(r"YAVG=([0-9.]+)", l)
        if m and t is not None:
            rows.append((t, float(m.group(1))))
    os.unlink(tmp)
    return rows


def dividers(rows, kf_gap):
    """Merge divider keyframes into [start, end] runs (end = last divider keyframe + one keyframe gap)."""
    runs = []
    for t, y in rows:
        if y > BRIGHT or y < DARK:
            if runs and t - runs[-1][1] <= MERGE_GAP:
                runs[-1][1] = t
            else:
                runs.append([t, t])
    return [(a, b + kf_gap) for a, b in runs]


def plan(src, nparts):
    kf = keyframes(src)
    dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]))
    gaps = [b - a for a, b in zip(kf, kf[1:])]
    kg = sorted(gaps)[len(gaps) // 2] if gaps else 2.0
    runs = dividers(luma(src), kg)
    near = lambda t: min(kf, key=lambda x: abs(x - t))
    lead = [r for r in runs if r[0] <= kg + 0.5]
    trail = [r for r in runs if r[1] >= dur - kg - 0.5]
    interior = [r for r in runs if r not in lead and r not in trail]
    info = {"duration": dur, "keyframe_gap": kg, "dividers": runs, "leading": lead, "trailing": trail, "interior": interior}
    if len(interior) != nparts - 1:
        info["error"] = f"expected {nparts - 1} interior dividers for {nparts} parts, found {len(interior)}"
        return info
    start = 0.0
    if lead and lead[0][1] - lead[0][0] > KEEP_EDGE + kg:          # long blank lead-in: keep only the last KEEP_EDGE s
        start = near(lead[0][1] - KEEP_EDGE)
    cuts = [near((a + b) / 2) for a, b in interior]
    end = min(dur, trail[0][0] + KEEP_EDGE) if trail else dur       # trailing blank/logo: keep KEEP_EDGE s
    bounds = [start] + cuts + [end]
    info["bounds"] = bounds
    info["parts"] = [(bounds[i], bounds[i + 1]) for i in range(nparts)]
    info["full"] = (start, end)
    return info


def cut(src, ss, t, dest):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-n", "-ss", f"{ss:.3f}", "-i", src,
                    "-t", f"{t:.3f}", "-map", "0:v:0", "-map", "0:a:0", "-c", "copy", "-avoid_negative_ts",
                    "make_zero", "-movflags", "+faststart", dest], check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source"); ap.add_argument("--parts", type=int, required=True)
    ap.add_argument("--labels", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--kind", default=""); ap.add_argument("--engineer", default="")
    ap.add_argument("--artist", default=""); ap.add_argument("--track", default="")
    ap.add_argument("--go", action="store_true", help="actually write files (default: dry run)")
    a = ap.parse_args()
    labels = [l.strip() for l in a.labels.split(",")]
    if len(labels) != a.parts:
        sys.exit(f"--labels has {len(labels)} entries but --parts is {a.parts}")
    p = plan(a.source, a.parts)
    print(f"duration {p['duration']:.1f}s | keyframe gap ~{p['keyframe_gap']:.2f}s")
    for kind, key in (("leading", "leading"), ("interior", "interior"), ("trailing", "trailing")):
        for r in p[key]:
            print(f"  divider ({kind}): {r[0]:.1f}s -> {r[1]:.1f}s (~{r[1]-r[0]:.0f}s)")
    if "error" in p:
        sys.exit("STOP: " + p["error"] + " — review the dividers above; do not guess.")
    for i, (s, e) in enumerate(p["parts"], 1):
        print(f"  Part {i}: {s:.3f} -> {e:.3f}  ({(e-s)/60:.1f} min)  {labels[i-1]}")
    print(f"  FULL  : {p['full'][0]:.3f} -> {p['full'][1]:.3f}  ({(p['full'][1]-p['full'][0])/60:.1f} min)")
    if not a.go:
        print("DRY RUN — nothing written. Re-run with --go after checking the plan."); return
    if os.path.exists(a.out):
        sys.exit(f"STOP: {a.out} already exists — never overwrite an existing set.")
    os.makedirs(a.out)
    for i, (s, e) in enumerate(p["parts"], 1):
        cut(a.source, s, e - s, os.path.join(a.out, f"Part_{i:02d}_{labels[i-1]}.mp4"))
    cut(a.source, p["full"][0], p["full"][1] - p["full"][0], os.path.join(a.out, "FULL.mp4"))
    manifest = {"kind": a.kind, "engineer": a.engineer, "artist": a.artist, "track": a.track, "source": os.path.abspath(a.source),
                "method": "stream copy (no re-encode), cuts on keyframes inside MWTM divider screens, dividers kept, blank ends trimmed",
                "parts": [{"number": i, "start": round(s, 3), "end": round(e, 3), "label": labels[i-1]} for i, (s, e) in enumerate(p["parts"], 1)],
                "full": {"start": round(p["full"][0], 3), "end": round(p["full"][1], 3)}, "destination": a.out}
    json.dump(manifest, open(os.path.join(a.out, "set_manifest.json"), "w"), indent=2)
    print("done. Verify each part with ffprobe and look at its first/last frame before reporting.")


if __name__ == "__main__":
    main()
