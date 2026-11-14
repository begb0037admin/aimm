# Process tap test (0.3.0-taptest)
- Default: private, unmuted Core Audio process tap on macOS 14.2+.
- Existing ingest, 44.1 kHz stereo conversion, analyser and bridge routes retained.
- /status adds captureMethod: tap-a, tap-b, tap-c or sck.
- Existing status text prefixes the method, including during reference capture.
- Test order: AIMM_TAP_VARIANT=a (default), then b, then c.
- A: private, non-stacked aggregate containing ONLY the stereo mixdown tap.
- B: same tap plus default output as main sub-device; ignore hardware inputs.
- C: tap-only aggregate; explicit processes, isExclusive=false, stereo mixdown.
- A/C have no hardware main sub-device; all variants use device compensation.
- Read and use kAudioTapPropertyFormat; accept stereo float32 planar/interleaved.
- Match every HAL process object whose bundle ID starts with com.google.Chrome,
  plus exactly com.spotify.client. This includes HAL-visible Chrome helpers,
  renderers and audio services, not just foreground NSWorkspace applications.
- If HAL bundle ID is empty, use its PID's NSRunningApplication bundle ID.
- Re-resolve the HAL process-object list every 2 seconds, including silent objects.
- Rebuild when matching IDs or default output UID change; later tabs are included.
- An empty inclusion list captures no processes, never a global exclusion tap.
- AIMM_CAPTURE=sck forces the original whole-system ScreenCaptureKit path.
- Older macOS or tap startup/refresh errors use SCK automatically; status says why.
- SCK fallback retains its existing output-device scaling risk.
- Measured on Kevin's mini: Chrome 1 kHz at -40 dBFS, all variants A/B/C.
- Built-in 2-channel output: peak -39.97 dBFS, RMS -43.05 dBFS (correct).
- UA Thunderbolt 10-output interface: RMS -57.10 dBFS, 14.1 dB low.
- 20*log10(2/10) = -13.98 dB: HAL scales the tap by 2 / output channel count.
- At startup and default-output UID changes, sum mNumberChannels over every
  buffer of kAudioDevicePropertyStreamConfiguration, scope output, on that device.
- For N > 2, multiply every tap Float32 sample by N/2 before existing ingest;
  for N <= 2 use unity. No clipping/limiting; native sample rate is retained.
- AIMM_TAP_COMP=off disables gain for A/B measurement (channel count retained).
- /status adds outputChannels (Int), compensationGainDb (Double, 20*log10(gain));
  status text includes applied dB and channel count. SCK reports zero for both.
- Rebuilds can cause brief gaps; ad-hoc identity/TCC may require fresh permission.
- HAL process objects without a resolvable matching bundle ID are not captured.
- Same-device format changes without UID/process changes require reopening.
- IO callback consumes borrowed planar buffers synchronously; interleaved input
  is repacked to planar stereo with device gain before existing ingest.
- Test bundle shares port 41735 and existing instance-lock behaviour: close the
  installed companion manually before testing; this build never controls it.
- build-tap-test.sh builds/signs the separate requested sibling test bundle.
- No installation, launch, git commit or analysis/page changes are performed.
