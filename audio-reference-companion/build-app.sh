#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
STAGING=$(mktemp -d "${TMPDIR:-/tmp}/aimm-reference-companion.XXXXXX")
OUTPUT="$STAGING/AIMM Audio Reference Companion.app"
INSTALL="$HOME/Applications/AIMM Audio Reference Companion.app"
BIN_DIR="$OUTPUT/Contents/MacOS"
trap 'rm -rf "$STAGING"' EXIT

cd "$ROOT"
swift build -c release --disable-sandbox
rm -rf "$OUTPUT"
mkdir -p "$BIN_DIR"
cp "$ROOT/.build/release/aimm-reference-companion" "$BIN_DIR/aimm-reference-companion"
mkdir -p "$OUTPUT/Contents/Resources"
cp "$ROOT/assets/AppIcon.icns" "$OUTPUT/Contents/Resources/AppIcon.icns"
printf 'APPL????' > "$OUTPUT/Contents/PkgInfo"
cat > "$OUTPUT/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleDevelopmentRegion</key><string>en</string>
  <key>CFBundleName</key><string>AIMM Audio Reference Companion</string>
  <key>CFBundleDisplayName</key><string>AIMM Audio Reference Companion</string>
  <key>CFBundleIdentifier</key><string>com.aimixmasters.audio-reference-companion</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>CFBundleExecutable</key><string>aimm-reference-companion</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>NSPrincipalClass</key><string>NSApplication</string>
  <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
  <key>CFBundleShortVersionString</key><string>0.3.1</string>
  <key>CFBundleVersion</key><string>10</string>
  <key>LSMinimumSystemVersion</key><string>13.0</string>
  <key>NSScreenCaptureUsageDescription</key><string>AIMM Audio Reference Companion captures system playback so AIMM can monitor the live spectrum and save a reference target when you start capture.</string>
  <key>NSAudioCaptureUsageDescription</key><string>AIMM Audio Reference Companion uses private Core Audio process taps to capture Chrome and Spotify playback for live analysis and reference capture. ScreenCaptureKit system playback capture is available as a fallback.</string>
  <key>LSUIElement</key><false/>
</dict></plist>
PLIST
codesign --force --deep --sign - "$OUTPUT"

# Never interrupt an in-progress capture to install an update.
if lsof -nP -iTCP:41735 -sTCP:LISTEN 2>/dev/null | rg -q 'aimm-refe'; then
  echo "Quit AIMM Audio Reference Companion before updating it; installation stopped without interrupting its capture session." >&2
  exit 1
fi

mkdir -p "$HOME/Applications"
rm -rf "$INSTALL"
ditto "$OUTPUT" "$INSTALL"

# An earlier build left a second registered app with the same bundle ID.
OLD_BUILD_APP="$ROOT/build/AIMM Audio Reference Companion.app"
if [ -d "$OLD_BUILD_APP" ]; then
  LSREGISTER=/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister
  "$LSREGISTER" -u "$OLD_BUILD_APP" >/dev/null 2>&1 || true
  rm -rf "$OLD_BUILD_APP"
fi

echo "Installed the single AIMM companion at $INSTALL"
