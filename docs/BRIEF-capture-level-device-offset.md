# Brief: Spotify capture level depends on the output device (14 Nov 2026)

Status: research + tone test done. Fix NOT started. Nothing deployed, no code changed. Kevin rejected normalising readings to -14 LUFS.

## Findings
- Same Mac mini, same Headlines section: Universal Audio interface (10 output channels) read LUFS -28.7 / true peak -15.6 / RMS -26.6; built-in speakers read -14.5 / -2.5 / -12.1. Difference 14.2 dB.
- Matches Apple forum thread https://developer.apple.com/forums/thread/743156 (ScreenCaptureKit level depends on output device since macOS 14.2; Apollo Twin -14 dB, built-in 0 dB; not affected by volume). A gist reports the cause as buffers scaled by about 2/outputChannels (10 channels -> -14 dB). Unverified by Apple.
- Companion (audio-reference-companion, ScreenCaptureKit, no gain code) is accurate on built-in speakers: 1 kHz tone at -20 dBFS peak (-23.0 RMS) read -19.5/-23.0 on the MacBook (volume 31) and -20.6/-24.5 on the mini (volume 20). Volume does not change it.
- Spotify web player does not apply loudness normalisation (https://support.spotify.com/artists/article/loudness-normalization/).
- Not explained: Headlines on the two built-in speakers still differed 5-7 dB (mini louder). Capture is accurate, so likely a different stretch or Spotify embed volume.
- Tempo/key agree when the same section is used (77-78 BPM, F# minor). The 105 vs 77 BPM was different stretches.

## Plan Kevin approved ("go ahead")
1. When the Universal Audio interface is connected to the mini and set as the output, run `python3 docs/tools/tonetest.py <tone.wav>` (tone: 1 kHz, 48 kHz stereo, amplitude 0.1 = -20 dBFS peak, 12 s) and record the offset. Keep the Mac volume low.
2. Add a per-device correction in the companion (Swift): detect the default output device and its output channel count (CoreAudio), apply the measured/validated gain to captured audio and the live spectrum. Codex makes the edit; Jules not needed (no UI). Preview/local build first; Kevin approves before installing.
3. Alternative if the correction is unreliable: capture with a Core Audio process tap of Chrome instead of ScreenCaptureKit (not confirmed to avoid the scaling; needs the same tone test).

## Rules
Kevin is dyslexic: one short action at a time. Codex edits (gpt-6.1-sol, medium). No tone playing loud. Do not commit audio files.
