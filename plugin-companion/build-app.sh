#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
STAGING=$(mktemp -d "${TMPDIR:-/tmp}/aimm-plugin-companion.XXXXXX")
OUTPUT="$STAGING/AIMM Plugin Companion.app"
INSTALL="$HOME/Applications/AIMM Plugin Companion.app"
trap 'rm -rf "$STAGING"' EXIT
cd "$ROOT"
swift build -c release --disable-sandbox
mkdir -p "$OUTPUT/Contents/MacOS" "$OUTPUT/Contents/Resources"
cp "$ROOT/.build/release/aimm-plugin-companion" "$OUTPUT/Contents/MacOS/aimm-plugin-companion"
cp "$ROOT/assets/AppIcon.icns" "$OUTPUT/Contents/Resources/AppIcon.icns"
printf 'APPL????' > "$OUTPUT/Contents/PkgInfo"
cat > "$OUTPUT/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleName</key><string>AIMM Plugin Companion</string>
<key>CFBundleDisplayName</key><string>AIMM Plugin Companion</string>
<key>CFBundleIdentifier</key><string>com.aimixmasters.plugin-companion</string>
<key>CFBundleIconFile</key><string>AppIcon</string>
<key>CFBundleExecutable</key><string>aimm-plugin-companion</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>NSPrincipalClass</key><string>NSApplication</string>
<key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
<key>CFBundleShortVersionString</key><string>0.1.0</string>
<key>CFBundleVersion</key><string>1</string>
<key>LSMinimumSystemVersion</key><string>13.0</string>
<key>LSUIElement</key><false/>
</dict></plist>
PLIST
codesign --force --deep --sign - "$OUTPUT"
if lsof -nP -iTCP:41736 -sTCP:LISTEN 2>/dev/null | rg -q .; then
  echo "Port 41736 is busy; installation stopped." >&2
  exit 1
fi
mkdir -p "$HOME/Applications"
rm -rf "$INSTALL"
ditto "$OUTPUT" "$INSTALL"
echo "Installed $INSTALL"
