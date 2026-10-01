# MWTM set record — Freedom Of The Night

- Kind: Mixing
- Track: `Freedom Of The Night`
- Artist: `Sophie Ellis-Bextor`
- Engineer: David Wrench
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-10-01 08-48-16.mp4` (5651.8 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/David_Wrench_Sophie_Ellis_Bextor_Freedom_Of_The_Night_Mixing/`
- Parts: 6
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept, ends trimmed
- Note: a different David Wrench set (`David_Wrench_Arlo_Parks_Too_Good_Mixing`) already existed and was left untouched.

## Part descriptions (from the MWTM page, some truncated with "…")

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 8 min | Introduction, production, constraints, percussion, songwriting, mixing, EQing, editing… |
| 2 | 9 min | Drums, sidechain compression, equalization, time-based effects, multiband compression, panning… |
| 3 | 12 min | Bass, comping, compression, guitar, synth, electric piano, automation |
| 4 | 7 min | Vocals, automation, vocal editing, compression, de-essing, printing tracks |
| 5 | 6 min | Vocals, background vocals, time-based effects, modulation |
| 6 | 5 min | Mix bus processing, equalization, compression, limiting, mastering |

## Cut ranges (source seconds)

Dividers found on keyframes (white card between parts, black at start/end):
interior 520.2-551.5, 1117.2-1142.6, 1897.2-1934.2, 2397.4-2413.0,
2816.9-2830.6; trailing 3177.6 to end (about 2475 s / 41.2 min of dead
recording).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 535.850 | 8.9 min |
| 2 | 535.850 | 1128.917 | 9.9 min |
| 3 | 1128.917 | 1916.683 | 13.1 min |
| 4 | 1916.683 | 2405.183 | 8.1 min |
| 5 | 2405.183 | 2822.800 | 7.0 min |
| 6 | 2822.800 | 3182.550 | 6.0 min |
| FULL | 0.000 | 3182.550 | 53.0 min |

Sizes: 206, 203, 265, 169, 146, 138 MB (combined 1126.4 MB, within 75 KB of
`FULL.mp4`'s 1126.3 MB — normal per-file MP4 header overhead).

## Verification

`ffprobe`: all seven files H.264 3504x1970 + AAC. Part 1 starts on the black
lead-in, interior cuts are the white divider card, Part 6 ends on black.
Source recording moved to the Trash automatically once `FULL.mp4` was verified
(standing cleanup rule, 2026-09-28).
