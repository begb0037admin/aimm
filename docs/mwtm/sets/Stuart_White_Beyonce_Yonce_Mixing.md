# MWTM set record — Yoncé

- Kind: Mixing
- Track: `Yoncé`
- Artist: `Beyoncé`
- Engineer: Stuart White
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-09-29 15-37-16.mp4` (4871.7 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Stuart_White_Beyonce_Yonce_Mixing/`
- Parts: 4
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept, ends trimmed

## Part descriptions (from the MWTM page)

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 16 min | Template overview, effects sends, gain staging, drums and percussion |
| 2 | 14 min | Low-end processing, percussion, strings, synths, backing vocals, publishing splits |
| 3 | 18 min | Vocal tracking, de-essing, EQ, compression, reverb, delays, routing, sound design |
| 4 | 8 min | Mix bus, tracking vs mixing, headroom, production workflow, summing |

The review screenshot showed a thumbnail sliver below Part 4; the recording's
own divider structure confirmed only 3 interior dividers (4 parts), so that
sliver is the next lesson, not Part 5 of this one.

## Cut ranges (source seconds)

Dividers found on keyframes (black): interior 1012.3-1027.9, 1917.3-1933.0,
3072.5-3088.1; trailing 3626.4 to end (about 1246 s / 20.8 min of dead
recording).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 1020.067 | 17.0 min |
| 2 | 1020.067 | 1925.150 | 15.1 min |
| 3 | 1925.150 | 3080.333 | 19.3 min |
| 4 | 3080.333 | 3631.417 | 9.2 min |
| FULL | 0.000 | 3631.417 | 60.5 min |

Sizes: 248, 227, 269, 145 MB (add up exactly to `FULL.mp4`, 889 MB).

## Verification

`ffprobe`: all five files H.264 3504x1970 + AAC. Part 1 and FULL open on the
lesson's real first shot, all interior cuts and Part 4's end are the black
divider screen. Source recording moved to the Trash automatically once
`FULL.mp4` was verified (standing cleanup rule, 2026-09-28).
