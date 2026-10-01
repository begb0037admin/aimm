# MWTM set record — Go-to EQ Plugins

- Kind: Interview
- Track: `Go-to EQ Plugins` (single video, no separate artist)
- Engineer: Andrew Scheps
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-10-01 11-09-00.mp4` (3161.1 s)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Andrew_Scheps_Go_To_EQ_Plugins_Interview/`
- Parts: 1
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers trimmed
- Note: a different Andrew Scheps set (`Andrew_Scheps_Kaleo_Way_Down_We_Go_Mixing`) already existed and was left untouched.

A single standalone interview video, same shape as the Andy Wallace set
(`Andy_Wallace_Using_The_Dynamics_On_A_SSL_Console_Interview.md`): `--parts 1`,
no interior dividers, `Kind` is "Interview".

## Cut range (source seconds)

Trailing divider (white card): 414.5 to end (about 2747 s / 45.8 min of dead
recording — a very long idle tail, the longest trailing gap seen so far on a
single-part item).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 (= FULL) | 0.000 | 419.517 | 7.0 min |

Part 1 and `FULL.mp4` are byte-identical (177,293,552 bytes each).

## Verification

`ffprobe`: both files H.264 3504x1970 + AAC. First frame is the black lead-in,
last frame is the white divider card, nothing cut off. Source recording moved
to the Trash automatically once `FULL.mp4` was verified (standing cleanup
rule, 2026-09-28).
