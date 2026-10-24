#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

printf '%s\n' 'Checking the local companion build and sync/journal checks...'
(
  cd "$ROOT/companion"
  swift build
  swift run aimm-journal-check
  python3 -m unittest discover -s tests -v
)

printf '%s\n' 'Checking the local Library API suite and JavaScript syntax...'
(
  cd "$ROOT/library-api"
  npm test
  node --check src/index.js
)

printf '%s\n' 'All non-production PluginHub checks passed.'
