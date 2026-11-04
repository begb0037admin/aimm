# AIMM Audio Reference Companion

The macOS companion captures system playback for AIMM's Spotify reference workflow. Spotify search and mix/stem analysis remain in AIMM.

The companion starts one continuous system-audio monitor when it opens. It captures stereo PCM at 44.1 kHz and computes an incremental 4096-point Hann-window spectrum with 50% overlap, streaming live readings to AIMM over a loopback HTTP bridge on `127.0.0.1:41735`. AIMM draws the smoothed live spectrum in white as soon as playback begins. Pressing **Capture reference** starts a separate averaging window and WAV buffer without interrupting the monitor; the averaged spectrum appears as the thicker purple target. On stop, the bridge returns that captured target and WAV; AIMM saves the curve and calculates the existing Audio Specs from the captured audio.

Only one companion process may own the bridge. A process lock is held in `~/Library/Application Support/AIMM/audio-reference-companion.lock`; a second launch exits. The app uses one SwiftUI `Window` scene, so repeated open actions cannot create duplicate windows. The bridge also terminates if the capture port is already owned.

## Run

The build script installs the only app copy at `~/Applications/AIMM Audio Reference Companion.app`. Open that installed app once and leave it running. To update it, quit the companion first; the script stops safely if the bridge is still active. Then open the installed app again. In AIMM at `https://aimixmasters.com/`, play a Spotify track and check that the white spectrum follows playback. Select the track in AIMM, press **Capture reference** to begin averaging the purple target, then press **Stop & use reference** to save the target and audio specs.

macOS may request Screen & System Audio Recording access for system audio capture. Capture is limited to 180 seconds. If AIMM reports `No audio received`, keep Spotify playing and check that the companion's received-audio count is increasing. The reference curve uses a 3 dB display corridor pending further calibration against AudioLens' saved target envelope; the measured spectrum itself is the captured track's average spectrum.

This local development companion is not signed or notarised for distribution.
