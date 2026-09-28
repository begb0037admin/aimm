# MWTM set record — Money

- Kind: Mixing
- Track: `Money`
- Artist: `Cardi B`
- Engineer: Leslie Brathwaite
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Leslie_Brathwaite_Cardi_B_Money_Mixing/`
- Method: stream copy (no re-encode), dividers kept, ends trimmed
- Status: Parts 1 to 3 done. Parts 4 and 5 (28 minutes) are in a second recording and are added later; see below.

## Part descriptions (from the MWTM page, 5 parts)

| Part | Length on page | Description |
|---:|---:|---|
| 1 | 25 min | Rough mix analysis, producer and engineer rapport, template, starting points |
| 2 | 16 min | Treatment of vocals and 808 samples, plug-in choices, incorporating rough mix elements |
| 3 | 12 min | Focus on vocal effects, acknowledging and maximising a hook, doing clean version edits |
| 4 | 10 min | Dealing with a revision request and processing the hi-hats, piano and 'Money' vocal sample |
| 5 | 18 min | Gain staging, mix buss chains, mastering, monitoring advice, streaming platforms |

## Recording 1: `2026-09-28 17-37-07.mp4` (3430 s), Parts 1 to 3

The page lists 81 minutes but this recording is 57 minutes: it contains Parts 1 to
3 (25 + 16 + 12) and then sits on the MWTM logo card for about 170 seconds. The MWTM
page had Part 3 highlighted as the part playing when recording stopped.

Dividers found on keyframes: leading black 0 to 3.9; 1505.2 to 1520.9 (white card
then black); 2501.6 to 2517.4 (white card); trailing 3260.7 to end.

| Part | Start | End | Length |
|---:|---:|---:|---:|
| 1 | 0.000 | 1513.050 | 25.2 min |
| 2 | 1513.050 | 2509.483 | 16.6 min |
| 3 | 2509.483 | 3265.700 | 12.6 min |
| FULL (Parts 1 to 3) | 0.000 | 3265.700 | 54.4 min |

Sizes: 600 MB, 360 MB, 244 MB (add up to `FULL.mp4`, 1.2 GB). Trailing card kept for
about 5 seconds. This set was cut by hand with the same method before
`mwtm_copycut.py` existed; a dry run of the script reproduces these cut points exactly.

## Recording 2: Parts 4 and 5

Recording started 2026-09-28 18:48 (`2026-09-28 18-48-11.mp4`). Not yet cut. When it
is: add `Part_04_...` and `Part_05_...` to the same folder, rebuild `FULL.mp4` as one
joined file with a stream-copy concat (Parts 1 to 5), update this record and
`SET_INFO.md`.

## Verification (Parts 1 to 3)

`ffprobe`: H.264 3504x1970 + AAC. First and last frames viewed: black start, black end
of Part 1, black start of Part 2, white card end of Part 2, white card start and end of
Part 3. Original recording moved to the Trash on 2026-09-28 at Kevin's request, after `FULL.mp4` was verified frame-for-frame and packet-for-packet identical to it.
