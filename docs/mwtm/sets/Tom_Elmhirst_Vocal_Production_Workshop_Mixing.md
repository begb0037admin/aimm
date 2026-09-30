# MWTM set record — Vocal Production Workshop

- Kind: Mixing
- Track: `Vocal Production Workshop` (multi-artist workshop, not one track)
- Artists: Travis Scott, David Bowie, Norah Jones, Melody Gardot, Elisa (per part; see table)
- Engineer: Tom Elmhirst
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-09-30 11-44-57.mp4` (5577.1 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Tom_Elmhirst_Vocal_Production_Workshop_Mixing/`
- Parts: 9 (a TRAILER is also listed on the page and is not part of this set)
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept, ends trimmed
- Note: a different Tom Elmhirst set (`Tom_Elmhirst_Adele_Rolling_in_the_Deep_Mixing`) already existed and was left untouched. This is a multi-artist workshop, so the usual `<Engineer>_<Artist>_<Track>_<Kind>` naming doesn't apply cleanly — used `Tom_Elmhirst_Vocal_Production_Workshop_Mixing` instead.

## No part lengths on the review screenshot

Unlike every earlier set, the MWTM part list Kevin sent showed no minute
lengths under each part. Rather than guess, the part count (9) was confirmed
directly from the recording: the divider scan found exactly 8 interior
dividers, matching 9 parts one-to-one.

## Part descriptions (from the MWTM page, mostly truncated with "…")

| Part | Description |
|---:|---|
| 1 | Introduction, drag & drop workflow, building FX chains, Elisa… |
| 2 | Elisa, blending effects, arrangement, automation, instrumental effects… |
| 3 | Norah Jones, natural ambience, warmth, stereo width, modulation, instrumental effects… |
| 4 | Travis Scott, digital effects, pitch shifting, distortion, glitches |
| 5 | David Bowie, analog delay, saturation, filtering, automation, instrumental effects… |
| 6 | David Bowie, scene changes, arrangement, experimentation |
| 7 | Melody Gardot, building FX chains, inspiration, unique sounds… |
| 8 | Melody Gardot, time stretching, audio suite effects, automation, dropouts… |
| 9 | Melody Gardot, additional production, final tweaks, aesthetics |

## Cut ranges (source seconds)

Dividers found on keyframes (plain black, no logo card this time): interior
666.3-682.0, 1183.2-1200.8, 1730.5-1746.2, 2219.8-2235.4, 2660.5-2676.2,
3043.8-3078.9, 3608.3-3624.0, 4347.2-4362.9; trailing 4927.1 to end (about 651 s
/ 10.8 min of dead recording).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 674.133 | 11.2 min |
| 2 | 674.133 | 1192.917 | 8.6 min |
| 3 | 1192.917 | 1738.333 | 9.1 min |
| 4 | 1738.333 | 2227.567 | 8.2 min |
| 5 | 2227.567 | 2668.317 | 7.3 min |
| 6 | 2668.317 | 3061.350 | 6.6 min |
| 7 | 3061.350 | 3616.133 | 9.2 min |
| 8 | 3616.133 | 4355.017 | 12.3 min |
| 9 | 4355.017 | 4932.133 | 9.6 min |
| FULL | 0.000 | 4932.133 | 82.2 min |

Combined part size (1,277,529,563 bytes) is within 40,788 bytes of `FULL.mp4`
(1,277,488,775 bytes) — normal per-file MP4 header overhead, not a discrepancy.

## Verification

`ffprobe`: all ten files H.264 3504x1970 + AAC. Part 1 opens on real content;
every other first/last frame is the black divider screen, nothing cut off.
Source recording moved to the Trash automatically once `FULL.mp4` was verified
(standing cleanup rule, 2026-09-28).
