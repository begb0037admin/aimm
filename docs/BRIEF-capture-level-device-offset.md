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

## Update 14 Nov (UA interface connected, tone test run)
Tone -40 dBFS (expected rms -43.0), companion restarted while UA was output:
- Built-in speakers: rms -41.2, -43.3 (about +-1 dB run to run).
- Universal Audio Thunderbolt (10 ch): rms -54.5, -53.2.
- Offset UA vs built-in: about -11.6 dB (range -10 to -13). Formula 2/channels predicts -14, not exact.
- First UA run, BEFORE the companion was restarted (companion had started while built-in was the output): rms -67.2 = about -24 dB. So the offset also depends on whether the output device changed after the companion started. A fixed per-device gain correction is therefore fragile.
- tonetest.py now acks the capture (/capture/ack); without the ack the next capture returns 409 until the companion is restarted.
Recommendation: prototype a Core Audio process tap (tap Chrome only) and run the same tone test through UA and built-in; only fall back to a calibrated correction if the tap also scales.

## DECISION (Kevin, 14 Nov 2026)
No capture-code change. On the Mac mini, Kevin switches the output to "Mac mini Speakers" (built-in) before capturing a Spotify reference; the Universal Audio interface reads about 11 dB low through ScreenCaptureKit. Core Audio tap prototype NOT approved. Caveat: after changing the output device, if the first capture reads oddly low, restart the companion (one early UA run read about 24 dB low after a hot switch).

## Update 14 Nov (same companion on both Macs)
Mini companion replaced with the MacBook's exact file (md5 a8c3b0dd7852eb1c59c2e6b17eb7054e, both Macs). Old mini app, 20261104 backup, "Isolated Preview" app and the ARCHIVED source folder moved to the Trash. New file needed Screen & System Audio Recording re-allowed once (done by Kevin). Capture confirmed working. UA offset on this run: tone -60.7 vs -43 expected, about -17.7 dB (earlier runs -11.6 and -24), so the interface offset is unstable; capture on the built-in output.
