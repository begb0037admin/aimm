#!/bin/sh
set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
if [ "$(uname -s)" != "Darwin" ] || ! command -v hdiutil >/dev/null 2>&1; then
  echo "This check requires macOS hdiutil." >&2
  exit 2
fi

temporary_root=$(mktemp -d "${TMPDIR:-/tmp}/aimm-pluginhub-cross-volume.XXXXXX")
image_path="$temporary_root/pluginhub-test.sparseimage"
mount_path="$temporary_root/mount"
attached=0
cleanup() {
  if [ "$attached" -eq 1 ]; then
    hdiutil detach "$mount_path" -quiet || hdiutil detach "$mount_path" -force -quiet
  fi
  rm -rf "$temporary_root"
}
trap cleanup EXIT HUP INT TERM

mkdir -p "$mount_path"
hdiutil create -quiet -size 64m -type SPARSE -fs APFS -volname AIMMPluginHubTest "$image_path"
hdiutil attach -quiet -nobrowse -mountpoint "$mount_path" "$image_path" >/dev/null
attached=1
mkdir -p "$mount_path/Unused"

source_device=$(stat -f '%d' "$project_root/companion")
target_device=$(stat -f '%d' "$mount_path/Unused")
if [ "$source_device" = "$target_device" ]; then
  echo "The test source and mounted image did not resolve to distinct filesystem devices." >&2
  exit 1
fi

echo "Testing synthetic move across filesystem devices $source_device -> $target_device"
cd "$project_root/companion"
AIMM_CROSS_VOLUME_TEST_ROOT="$mount_path/Unused" swift run -c debug aimm-journal-check
