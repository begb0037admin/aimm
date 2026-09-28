# MWTM set record — Rolling in the Deep

- Kind: Mixing
- Track: `Rolling in the Deep`
- Artist: `Adele`
- Engineer: Tom Elmhirst
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-09-28 15-30-31.mp4` (3005 s; original moved to the Trash on 2026-09-28 at Kevin's request, after `FULL.mp4` was verified frame-for-frame and packet-for-packet identical to it)
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Tom_Elmhirst_Adele_Rolling_in_the_Deep_Mixing/`
- Parts: 3 (the whole lesson)
- Method: `docs/mwtm/mwtm_copycut.py`, stream copy (no re-encode), dividers kept, ends trimmed

## Part descriptions (from the MWTM page)

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 21 min | Multi-track setup on Neve VR, sends, busses, signal chains on various tracks, new rough mix, vocal automation |
| 2 | 13 min | New mix recap, master buss alteration, drums & vocal EQ, VCA assignment, gain staging, new vs. original mix |
| 3 | 14 min | Drum samples, additional percussion, parallel compression, piano & vocal effects, de-essing, sample rate |

## Cut ranges (source seconds)

Dividers found on keyframes: leading 0 to 3.9 (black), interior 1284.3 to 1300.1 and
2111.3 to 2131.1 (white logo card), trailing 2989.2 to end (about 18 s).

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 1292.217 | 21.5 min |
| 2 | 1292.217 | 2121.250 | 13.8 min |
| 3 | 2121.250 | 2994.217 | 14.6 min |
| FULL | 0.000 | 2994.217 | 49.9 min |

Sizes: 726 MB, 418 MB, 388 MB (parts add up to `FULL.mp4`, 1.5 GB).

## What happened

- The first attempt was a Codex re-encode run. Its Part 1 took about 46 minutes for
  21.3 minutes of content and came out at 1.94 GB. That run was stopped by Kevin.
- The set was then re-cut with the copy-cut script in 56 seconds and Kevin approved
  replacing the old folder with it. The old folder (one re-encoded Part 1 plus a
  manifest) was moved to the Trash, not permanently deleted.
- Codex's frame-checked boundaries (content 3.1 to 1282.5, 1301.0 to 2109.5, 2132.0
  to 2988.5) agree with the divider positions the script found.

## Verification

`ffprobe`: all four files H.264 3504x1970 + AAC. First and last frame of each part
viewed: each is the black start screen or the white logo card, none cut off. The original recording
was moved to the Trash on 2026-09-28 at Kevin's request, after `FULL.mp4` was verified
frame-for-frame and packet-for-packet identical to it. Transcript and AIMM import not done.
