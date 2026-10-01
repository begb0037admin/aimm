# MWTM set record — Humble, Love Galore, The Weekend (Mastering Workshop)

- Kind: Mastering
- Track: `Humble, Love Galore, The Weekend` (a workshop covering three tracks)
- Artist: `Kendrick Lamar, SZA`
- Engineer: Mike Bozzi
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-10-01 13-21-29.mp4` (3447.4 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Mike_Bozzi_Kendrick_Lamar_SZA_Mastering_Workshop_Mastering/`
- Parts: 4
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept

## No trailing logo card

Unlike every earlier set, this recording ends with a natural fade to black
right after Part 4's content finishes — no dividers after it, no long dead
tail. Checked by viewing frames at 3420, 3435, 3445 and 3447s: real content
through 3435s, fading out at the very end. `FULL.mp4` is the full 57.5 minutes,
nothing trimmed off the end.

## Part descriptions (from the MWTM page)

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 22 min | Mike's background, modern workflow and aesthetics, mix buss advice, sample rate, bit depth, signal path |
| 2 | 9 min | Mastering 'Humble' — subtle EQ, vocal focus, monitoring considerations, listening space |
| 3 | 11 min | Mastering 'Love Galore' — de-essing, adding warmth and air, taming high-mids, commentary on widening |
| 4 | 12 min | Mastering 'The Weekend' — adding clarity, soft saturation, light limiting, dithering, streaming algorithms |

## Cut ranges (source seconds)

Dividers found on keyframes: interior 1343.7-1357.4 (~14s, black), 1954.4-1982.1
(~28s, white card), 2675.2-2688.9 (~14s, black). No trailing divider.

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 1351.500 | 22.5 min |
| 2 | 1351.500 | 1968.283 | 10.3 min |
| 3 | 1968.283 | 2681.100 | 11.9 min |
| 4 | 2681.100 | 3447.450 | 12.8 min |
| FULL | 0.000 | 3447.450 | 57.5 min |

Sizes: 422, 180, 229, 240 MB (combined 1070.6 MB, within 28 KB of `FULL.mp4`'s
1070.6 MB — normal per-file MP4 header overhead).

## Verification

`ffprobe`: all five files H.264 3504x1970 + AAC. Part 1 starts on black,
interior cuts are divider screens, Part 4 ends on the natural fade, not a
cut-off slate. Source recording moved to the Trash automatically once
`FULL.mp4` was verified (standing cleanup rule, 2026-09-28).
