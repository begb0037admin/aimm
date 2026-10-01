# MWTM set record — Bongos

- Kind: Mixing
- Track: `Bongos`
- Artist: `Cardi B, Megan Thee Stallion`
- Engineer: Leslie Brathwaite
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-10-01 12-04-14.mp4` (3890.2 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Leslie_Brathwaite_Cardi_B_Megan_Thee_Stallion_Bongos_Mixing/`
- Parts: 4
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept, ends trimmed
- Note: five other Leslie Brathwaite sets already existed and were left untouched.

## Process fix made during this set: genuine mid-recording pauses

The dry run found an interior divider lasting 706 seconds (580.0 to 599.5 was a
normal ~20s divider; the second one, 1312.1 to 2018.0, was not). Inspecting
frames across it showed: white card → solid black for about 11.4 minutes →
white card → content resumes. That is a real pause in the recording, not a
transition screen, so the previous "cut at the divider's midpoint" rule would
have left roughly 5.5 minutes of dead black padded onto the end of Part 2 and
the start of Part 3.

`mwtm_copycut.py` was fixed on the spot: an interior divider of 120 seconds or
longer (`LONG_DIVIDER`) is now treated as a genuine pause — only `KEEP_EDGE`
(about 5 s) of divider is kept on each side and everything between is dropped,
the same way a long leading/trailing blank is already trimmed. Ordinary
transitions (observed 4-80 s across all sets so far) are unaffected and still
use a single midpoint cut.

`FULL.mp4` was also fixed to match: when a pause like this is excised, `FULL`
is built by concatenating the already-cut part files instead of a single
start-to-end cut of the source, so it doesn't still contain the dead patch
in the middle. For this set that is 46.6 minutes, not the naive 58.2 minutes.

## Part descriptions (from the MWTM page, mostly truncated with "…")

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 9 min | Mixing philosophy, critical listening, lead vocals, Cardi B |
| 2 | 11 min | Vocals, resonance control, processing workflow, Megan Thee Stallion |
| 3 | 12 min | 808, bass, kick, snare, percussion, transitions, vocal chops, automation rides, drops… |
| 4 | 11 min | Managing relationships, major label artists, mix bus processing, attention to detail… |

The review screenshot showed a thumbnail sliver below Part 4; the recording's
own divider structure confirmed only 3 interior dividers (4 parts), so that
sliver is the next lesson, not Part 5 of this one.

## Cut ranges (source seconds)

Dividers found on keyframes (white card): interior 580.0-599.5 (ordinary, ~20 s),
1312.1-2018.0 (genuine pause, ~706 s, excised per above), 2765.9-2785.4
(ordinary, ~20 s); trailing 3487.6 to end (about 404 s of dead recording).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 589.717 | 9.8 min |
| 2 | 589.717 | 1317.967 | 12.1 min |
| 3 | 2012.167 | 2775.683 | 12.7 min |
| 4 | 2775.683 | 3492.550 | 11.9 min |
| FULL (concatenated, pause excised) | — | — | 46.6 min |

Sizes: 199, 222, 227, 233 MB (combined 880.5 MB, within 4.2 KB of `FULL.mp4`'s
880.5 MB — normal per-file MP4 header overhead).

## Verification

`ffprobe`: all five files H.264 3504x1970 + AAC. Every first/last frame is real
content or the white divider card, nothing cut off. Clean decode across the
Part 2/Part 3 concatenated join in `FULL.mp4` where the dead gap was removed.
Source recording moved to the Trash automatically once `FULL.mp4` was verified
(standing cleanup rule, 2026-09-28).
