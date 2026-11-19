# AIMM Plugin Companion

Read-only macOS scanner for AU, VST2, VST3 and CLAP bundles. It scans system and user plug-in folders at launch and on `POST /scan`. Its only persistent write is the single-instance lock file in `~/Library/Application Support/AIMM/`.

From this folder, run `swift build -c release --disable-sandbox`, `swift test`, then `.build/release/aimm-plugin-companion --scan-json` to inspect JSON without launching a window or server.

`build-app.sh` builds, ad-hoc signs and installs one copy at `~/Applications/AIMM Plugin Companion.app`; it refuses to replace it while port 41736 is busy. The app serves `GET /status`, `GET /inventory` and `POST /scan` on `127.0.0.1:41736`, requiring an AIMM origin. Counts distinguish readable rows by format, name/publisher products, discovered bundles and unreadable items. Multi-component AU bundles can produce several rows.
