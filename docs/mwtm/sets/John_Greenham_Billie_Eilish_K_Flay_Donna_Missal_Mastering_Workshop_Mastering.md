# MWTM set record — Mastering Workshop (Billie Eilish, K.Flay, Donna Missal)

- Kind: Mastering
- Track: `Mastering Workshop` (a workshop covering several tracks)
- Artist: `Billie Eilish, K.Flay, Donna Missal`
- Engineer: John Greenham
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-10-01 14-23-58.mp4` (2113.0 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/John_Greenham_Billie_Eilish_K_Flay_Donna_Missal_Mastering_Workshop_Mastering/`
- Parts: 3
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept, ends trimmed

## Part descriptions (from the MWTM page)

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 16 min | Professional background, equipment, monitoring, loudness, converters, metering, dynamics |
| 2 | 10 min | Mastering 'Bad Guy' & 'Everything I Wanted' by Billie Eilish |
| 3 | 7 min | Mastering 'Dating My Dad' by K.Flay & 'Sex Is Good (But Have You Tried)' by Donna Missal |

## Cut ranges (source seconds)

Dividers found on keyframes (black): interior 1006.6-1020.3, 1649.2-1662.8;
trailing 2098.9 to end (about 16 s).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 1012.500 | 16.9 min |
| 2 | 1012.500 | 1655.033 | 10.7 min |
| 3 | 1655.033 | 2103.900 | 7.5 min |
| FULL | 0.000 | 2103.900 | 35.1 min |

Sizes: 260, 130, 106 MB (combined 495.7 MB, within 10 KB of `FULL.mp4`'s
495.7 MB — normal per-file MP4 header overhead).

## Verification

`ffprobe`: all four files H.264 3504x1970 + AAC. Every first/last frame is the
black divider screen, nothing cut off. Source recording moved to the Trash
automatically once `FULL.mp4` was verified (standing cleanup rule, 2026-09-28).
