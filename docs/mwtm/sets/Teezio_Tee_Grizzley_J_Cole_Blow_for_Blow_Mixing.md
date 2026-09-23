# MWTM set record — Blow for Blow

- Kind: Mixing
- Track: `Blow for Blow`
- Artist: `Tee Grizzley & J. Cole`
- Engineer: Teezio (Patrizio "Teezio" Pigliacoco)
- Source: `/Volumes/MacStore/AIMM_MWTM_Tutorials/2026-09-23 16-15-10.mp4`
- Output folder: `/Volumes/MacStore/AIMM_MWTM_Tutorials/Teezio_Tee_Grizzley_J_Cole_Blow_for_Blow_Mixing/`
- Parts: 6

## Working method used

1. OBS captured the complete lesson as one continuous MP4.
2. The MWTM black/menu slate was reviewed on the source timeline and excluded
   from the content ranges below.
3. Parts were exported sequentially in the foreground with the established
   direct `ffmpeg` H.264/AAC command in
   `docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md`.
4. Each output was checked with `ffprobe` for readable H.264 video and AAC
   audio, and its duration was compared with the reviewed source range.
5. Transcript and AIMM knowledge-base import are separate later steps and have
   not been claimed by this set record.

## Reviewed source ranges

| Part | Topic label | Start | End |
|---:|---|---:|---:|
| 1 | Mix Template Breakdown — Drums | 4.142583 | 540.743125 |
| 2 | Synths — Samples | 560.260833 | 920.312625 |
| 3 | J. Cole Vocals — EQ, De-essing, Feedback | 940.281875 | 1476.494521 |
| 4 | Tee Grizzley Vocals | 1495.148375 | 2397.725792 |
| 5 | Mix Bus Processing | 2416.139792 | 2756.250021 |
| 6 | Community Mindset — Business Affairs | 2776.003563 | 3214.982521 |

The exported parts and `FULL.mp4` are in the output folder above. Existing
sets were preserved.
