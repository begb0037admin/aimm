# MWTM set record — Love Yourself

- Kind: Mixing
- Track: `Love Yourself`
- Artist: `Justin Bieber`
- Engineer: Josh Gudwin
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Josh_Gudwin_Justin_Bieber_Love_Yourself_Mixing/`
- Parts: 2, each recorded as its own separate OBS take (no interior divider needed)
- Method: `docs/mwtm/mwtm_copycut.py` (Part 1 normal, Part 2 via `--append --first-part 2`), stream copy (no re-encode)

## Part descriptions (from the MWTM page)

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 17 min | Track background, noise reduction, tuning, inserts & effects on guitar, lead vocal, BVs, ad libs, trumpet |
| 2 | 10 min | Recording Justin's vocals, reverb, delay, doubling, chorus, mix buss treatment, song quality |

## Recording 1: `2026-09-28 21-36-48.mp4` (1051.0 s) → Part 1

A single dark keyframe at 13.75 s (inside the lesson's own dark studio footage,
YAVG 16.1) was initially misread as a divider by the brightness scan — a real
divider holds for many consecutive keyframes, this was one frame. Fixed in
`mwtm_copycut.py` by requiring a divider run to last at least `MIN_DIVIDER_LEN`
(4 s) before it counts; after the fix the recording reads as content 0 to
1038.0 s, then the trailing card. Part 1: 0.000 to 1043.017 (17.4 min).

## Recording 2: `2026-09-28 21-54-47.mp4` (634.2 s) → Part 2

No interior divider; trailing card from 627.2 s. Part 2: 0.000 to 632.217
(10.5 min), added with `--append --first-part 2`.

## Join

`FULL.mp4` = Part 1 (1043.111 s) + Part 2 (632.311 s) = 1675.421 s exactly.
Verified: clean decode across the join, frames either side of the join point are
divider screens (Part 1 ends white, Part 2 starts white, Part 2 ends black),
sizes of the two parts add up to `FULL.mp4`'s size (478 MB).

## Verification

`ffprobe`: all files H.264 3504x1970 + AAC. Both source recordings were moved to
the Trash automatically once `FULL.mp4` was verified (standing cleanup rule,
2026-09-28).
