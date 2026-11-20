#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
diff -u "$ROOT/audio-reference-companion/Sources/AIMMReferenceCompanion/CompanionWindowKit.swift" "$ROOT/plugin-companion/Sources/AIMMPluginCompanion/CompanionWindowKit.swift"
echo "CompanionWindowKit copies are identical"
