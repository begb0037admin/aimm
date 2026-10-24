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
  node --check library-account.js
)

printf '%s\n' 'Checking an isolated local D1 migration and Worker HTTP runtime...'
STATE_DIR=$(mktemp -d "${TMPDIR:-/tmp}/pluginhub-worker-check.XXXXXX")
WORKER_PID=
cleanup() {
  if [ -n "$WORKER_PID" ]; then
    kill "$WORKER_PID" 2>/dev/null || true
    wait "$WORKER_PID" 2>/dev/null || true
  fi
  rm -rf "$STATE_DIR"
}
trap cleanup EXIT HUP INT TERM

cd "$ROOT/library-api"
./node_modules/.bin/wrangler d1 migrations apply aimm-library-foundation-dev \
  --local --persist-to "$STATE_DIR" >"$STATE_DIR/migrations.log" 2>&1 || {
    cat "$STATE_DIR/migrations.log"
    exit 1
  }
WORKER_PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')
./node_modules/.bin/wrangler dev --local --persist-to "$STATE_DIR" \
  --ip 127.0.0.1 --port "$WORKER_PORT" --show-interactive-dev-session=false \
  >"$STATE_DIR/worker.log" 2>&1 &
WORKER_PID=$!

check_http_status() {
  expected=$1
  shift
  attempt=0
  while [ "$attempt" -lt 40 ]; do
    actual=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "$@" 2>/dev/null || true)
    if [ "$actual" = "$expected" ]; then
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 0.25
  done
  printf 'Expected HTTP %s; got %s for %s\n' "$expected" "$actual" "$1" >&2
  cat "$STATE_DIR/worker.log" >&2
  return 1
}

BASE_URL="http://127.0.0.1:$WORKER_PORT"
check_http_status 200 "$BASE_URL/health"
check_http_status 401 "$BASE_URL/v1/me"
check_http_status 204 -X OPTIONS "$BASE_URL/v1/me" \
  -H 'Origin: https://aimixmasters.com' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: authorization'
check_http_status 403 -X OPTIONS "$BASE_URL/v1/me" \
  -H 'Origin: https://example.invalid' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: authorization'
printf '%s\n' 'PASS: local D1 migrations, health, unauthenticated rejection, and allowed/hostile CORS.'

printf '%s\n' 'All non-production PluginHub checks passed.'
