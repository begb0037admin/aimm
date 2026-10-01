# MWTM set record — Using the Dynamics on a SSL Console

- Kind: Interview
- Track: `Using the Dynamics on a SSL Console` (single video, no separate artist)
- Engineer: Andy Wallace
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-10-01 10-49-01.mp4` (1029.9 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Andy_Wallace_Using_The_Dynamics_On_A_SSL_Console_Interview/`
- Parts: 1
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers trimmed

Unlike every prior set, this one is a single standalone interview video, not a
multi-part lesson, so `--parts 1` was used with no interior dividers needed.
`Kind` is "Interview" rather than "Mixing"/"Production", matching the page's own
label.

## Cut range (source seconds)

Trailing divider (white card): 399.9 to end (about 632 s / 10.5 min of dead
recording).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 (= FULL) | 0.000 | 404.883 | 6.7 min |

Part 1 and `FULL.mp4` are byte-identical (128,724,577 bytes each), as expected
for a single-part set.

## Verification

`ffprobe`: both files H.264 3504x1970 + AAC. First frame is the black lead-in,
last frame is the white divider card, nothing cut off. Source recording moved
to the Trash automatically once `FULL.mp4` was verified (standing cleanup
rule, 2026-09-28).
