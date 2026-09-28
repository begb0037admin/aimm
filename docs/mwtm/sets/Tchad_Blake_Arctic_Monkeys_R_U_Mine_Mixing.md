# MWTM set record — R U Mine ?

- Kind: Mixing
- Track: `R U Mine ?`
- Artist: `Arctic Monkeys`
- Engineer: Tchad Blake
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-09-28 13-24-48.mp4` (3830 s; about 28 min of lesson followed by about 35 min of the MWTM logo card)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Tchad_Blake_Arctic_Monkeys_R_U_Mine_Mixing/`
- Parts: 2
- Run by: Jacob (coordinator) dispatched Codex (`codex exec`) with a text-only brief; Jacob verified the output.

## Working method used

1. OBS captured the complete lesson as one continuous MP4.
2. The MWTM slate between the two lesson parts and the trailing logo card after
   Part 2 were excluded from the content ranges below.
3. Parts were exported sequentially in the foreground with the locked direct
   `ffmpeg` H.264/AAC command in `docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md`.
4. Each part was checked with `ffprobe` (H.264 video + AAC audio, duration equal
   to the manifest range) and its first and last frames were looked at.
5. `FULL.mp4` is a byte-identical copy of the original OBS file. The original
   timestamped file is preserved at the tutorials root.
6. Transcript and AIMM knowledge-base import are separate later steps and have
   not been done for this set.

## Part descriptions (from the MWTM page)

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 14 min | Kick drum signal blend & processing, full kit distortion, polarity, expansion, phasing, EQ |
| 2 | 13 min | Kit modulation, snare treatment, guitars, bass, creative uses of phase, shelving filters |

The page also lists a TRAILER, which is not part of this set.

## Reviewed source ranges

| Part | Topic label | Start | End |
|---:|---|---:|---:|
| 1 | Kick Drum Processing, Kit Distortion, Polarity, Phase, EQ | 0.0 | 882.0 |
| 2 | Kit Modulation, Snare, Guitars, Bass, Phase, Shelving | 902.0 | 1702.0 |

## What went wrong on this first run (kept so it is not repeated)

- Part 2's first two start estimates (895.0 s, then 900.0 s) still opened on the
  MWTM logo slate. Each was a full encode that had to be thrown away and
  re-done; the final start is 902.0 s. Check the first frame at the proposed
  start **before** encoding, not after.
- The MWTM slate is white, so `blackdetect` finds nothing.
- Two premature Codex dispatches (no metadata, then truncated part text) and a
  stale frame-grab loop that starved the export of CPU cost roughly an hour.
  The Jacob-coordinated route section of the process doc now covers all of these.
- The export took about 1.5x to 1.9x the content length per part.
