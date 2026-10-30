#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
PACKAGE_DIR="$ROOT/companion"
DESTINATION=${1:?Usage: sh scripts/package-pluginhub-nonprod-app.sh <new-output-directory>}
APP_NAME="AIMM Companion Preview.app"
BUNDLE_IDENTIFIER=${AIMM_COMPANION_PREVIEW_BUNDLE_ID:-com.aimixmasters.companion.preview.isolated}
APP_PATH="$DESTINATION/$APP_NAME"

if [ -e "$APP_PATH" ]; then
  printf 'Refusing to overwrite existing app bundle: %s\n' "$APP_PATH" >&2
  exit 2
fi

(
  cd "$PACKAGE_DIR"
  if [ "${AIMM_DISABLE_SWIFTPM_SANDBOX:-0}" = "1" ]; then
    swift build --disable-sandbox --product aimm-companion
  else
    swift build --product aimm-companion
  fi
)
BIN_DIR=$(cd "$PACKAGE_DIR" && swift build --show-bin-path)

mkdir -p "$APP_PATH/Contents/MacOS"
ditto "$BIN_DIR/aimm-companion" "$APP_PATH/Contents/MacOS/aimm-companion"
cat > "$APP_PATH/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>en</string>
  <key>CFBundleDisplayName</key>
  <string>AIMM Companion Preview</string>
  <key>CFBundleExecutable</key>
  <string>aimm-companion</string>
  <key>CFBundleIdentifier</key>
  <string>com.aimixmasters.companion.preview</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>AIMM Companion Preview</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
  <key>NSPrincipalClass</key>
  <string>NSApplication</string>
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLName</key>
      <string>com.aimixmasters.companion.preview.duplicate-review</string>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>aimm-companion</string>
      </array>
    </dict>
  </array>
</dict>
</plist>
PLIST
plutil -replace CFBundleIdentifier -string "$BUNDLE_IDENTIFIER" "$APP_PATH/Contents/Info.plist"
plutil -lint "$APP_PATH/Contents/Info.plist"
# Ad-hoc signing makes the local preview bundle verifiable and easier to
# exercise on this Mac without creating or using a distribution credential.
codesign --force --sign - --timestamp=none "$APP_PATH"
codesign --verify --strict --verbose=2 "$APP_PATH"
printf 'Created ad-hoc signed local preview app (not for distribution): %s\n' "$APP_PATH"
