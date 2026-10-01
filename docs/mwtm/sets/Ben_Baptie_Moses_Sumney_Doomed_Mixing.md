# MWTM set record — Doomed

- Kind: Mixing
- Track: `Doomed`
- Artist: `Moses Sumney`
- Engineer: Ben Baptie
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-09-30 21-55-17.mp4` (2836.2 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Ben_Baptie_Moses_Sumney_Doomed_Mixing/`
- Parts: 5
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept, ends trimmed
- Note: two other Ben Baptie sets already existed and were left untouched (`Ben_Baptie_Little_Simz_Gorilla_Mixing`, `Ben_Baptie_Michael_Kiwanuka_Beautiful_Life_Mixing`).

## Part descriptions (from the MWTM page, mostly truncated with "…")

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 9 min | Vocals, Synth, parallel vocal treatment, EQing, multiband compression, vocal effects… |
| 2 | 5 min | Vocals, printing to tape, tape emulation, committing to tracks |
| 3 | 8 min | Reverb, outboard gear |
| 4 | 8 min | Effects, ad-libs, bass, synth, background vocals, automation |
| 5 | 11 min | Mix bus processing, tips for long sessions, mix philosophy |

## Cut ranges (source seconds)

Dividers found on keyframes (white card): interior 587.0-602.6, 933.7-968.8,
1454.6-1468.2, 1964.5-1980.1; trailing 2666.7 to end (about 170 s, black).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 594.833 | 9.9 min |
| 2 | 594.833 | 951.267 | 5.9 min |
| 3 | 951.267 | 1462.383 | 8.5 min |
| 4 | 1462.383 | 1972.267 | 8.5 min |
| 5 | 1972.267 | 2671.717 | 11.7 min |
| FULL | 0.000 | 2671.717 | 44.5 min |

Sizes: 171, 103, 155, 148, 209 MB (combined 786.5 MB, within 50 KB of
`FULL.mp4`'s 786.5 MB — normal per-file MP4 header overhead).

## Verification

`ffprobe`: all six files H.264 3504x1970 + AAC. Part 1 opens on real content,
interior cuts are the white divider card, Part 5 and FULL end on black. Source
recording moved to the Trash automatically once `FULL.mp4` was verified
(standing cleanup rule, 2026-09-28).
