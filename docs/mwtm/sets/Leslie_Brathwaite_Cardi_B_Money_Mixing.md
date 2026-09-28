# MWTM set record — Money

- Kind: Mixing
- Track: `Money`
- Artist: `Cardi B`
- Engineer: Leslie Brathwaite
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Leslie_Brathwaite_Cardi_B_Money_Mixing/`
- Method: stream copy (no re-encode), dividers kept, ends trimmed
- Status: Parts 1 to 5 complete across two recordings. `FULL.mp4` is the complete lesson (both recordings joined by stream copy, 4996.8 s); it replaced the earlier Parts 1 to 3 FULL on 2026-09-28 at Kevin's request and the old one is in the Trash.

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

Recording started 2026-09-28 18:48 (`2026-09-28 18-48-11.mp4`). The copy-cut dry run
found one interior divider at 612.8 to 630.6 seconds and cut at the nearest
keyframe, 622.633 seconds. The trailing divider began at about 1729.0 seconds;
the source ended at 1731.05 seconds, so the available end card was kept.

| Part | Source range | Length | Output |
|---:|---:|---:|---|
| 4 | 0.000–622.633 s | 622.711 s | `Part_04_Revision_Request_Hi_Hats_Piano_Money_Vocal_Sample.mp4` |
| 5 | 622.633–1731.050 s | 1108.480 s | `Part_05_Gain_Staging_Mix_Buss_Mastering_Monitoring_Streaming_Platforms.mp4` |

`FULL_joined.mp4` is the existing `FULL.mp4` followed by the second recording,
joined with a stream-copy concat. It is 4996.871 s. Jacob verified it independently
(old FULL + new recording to within 0.03 s, video and audio lengths equal, clean decode
across the join, five parts add up to its size) and then swapped it in as `FULL.mp4`.

## Verification

`ffprobe`: the two new parts and `FULL_joined.mp4` are H.264 3504x1970 + AAC.
First and last frames viewed for Parts 4 and 5: Part 4 starts on the black/logo
divider and ends on the white card; Part 5 starts on the white card and ends on
the black trailing card. Frames around the joined-file boundary show the
retained white/black divider, and the joined file starts and ends on the expected
black edge cards. The original recording was left untouched and no transcript or
AIMM import was performed.
