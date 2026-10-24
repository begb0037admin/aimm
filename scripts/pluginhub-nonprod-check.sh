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
SYNC_DEVICE_ID='22222222-2222-4222-8222-222222222222'
SYNC_TOKEN='pluginhub-local-worker-smoke-bearer-token'
node "$ROOT/scripts/pluginhub-local-worker-fixture.mjs" "$STATE_DIR" seed
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --file "$STATE_DIR/seed-fixture.sql" >"$STATE_DIR/seed-fixture.log" 2>&1 || {
  cat "$STATE_DIR/seed-fixture.log" >&2
  exit 1
}
(
  cd "$ROOT/companion"
  AIMM_PAIRING_SMOKE_URL="$BASE_URL" \
  AIMM_SYNC_SMOKE_URL="$BASE_URL" \
  AIMM_SYNC_SMOKE_DEVICE_ID="$SYNC_DEVICE_ID" \
  AIMM_SYNC_SMOKE_TOKEN="$SYNC_TOKEN" \
  swift run aimm-journal-check
)

# Seed a reveal operation only after sync has published the exact generation
# and path-keyed record. The actual Swift client claims it and signs its receipt.
node "$ROOT/scripts/pluginhub-local-worker-fixture.mjs" "$STATE_DIR" action
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --file "$STATE_DIR/action-fixture.sql" >"$STATE_DIR/action-fixture.log" 2>&1 || {
  cat "$STATE_DIR/action-fixture.log" >&2
  exit 1
}
(
  cd "$ROOT/companion"
  AIMM_PAIRING_SMOKE_URL="$BASE_URL" \
  AIMM_ACTION_SMOKE_URL="$BASE_URL" \
  AIMM_SYNC_SMOKE_DEVICE_ID="$SYNC_DEVICE_ID" \
  AIMM_SYNC_SMOKE_TOKEN="$SYNC_TOKEN" \
  swift run aimm-journal-check
)

./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --json \
  --command "SELECT state, record_count FROM scan_generations WHERE device_id = '$SYNC_DEVICE_ID'" \
  >"$STATE_DIR/sync-result.json" 2>"$STATE_DIR/sync-result.log" || {
    cat "$STATE_DIR/sync-result.log" >&2
    exit 1
  }
node --input-type=module - "$STATE_DIR/sync-result.json" <<'NODE'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const output = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const rows = output[0]?.results ?? output.result?.[0]?.results ?? output.results;
assert.ok(Array.isArray(rows), 'Wrangler should return local D1 query rows as JSON');
assert.equal(rows.length, 1, 'one test inventory generation should be stored');
assert.equal(rows[0].state, 'complete', 'the Swift client should finalize a complete generation');
assert.equal(rows[0].record_count, 1, 'the Swift client should sync one synthetic record');
console.log('PASS: local D1 contains one complete generation from the Swift client');
NODE

./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --json \
  --command "SELECT o.state AS operation_state, COUNT(r.receipt_id) AS receipt_count, json_extract(r.summary_json, '$.items[0].status') AS item_state FROM operations o LEFT JOIN action_receipts r ON r.operation_id = o.operation_id WHERE o.operation_id = '44444444-4444-4444-8444-444444444444' GROUP BY o.operation_id" \
  >"$STATE_DIR/action-result.json" 2>"$STATE_DIR/action-result.log" || {
    cat "$STATE_DIR/action-result.log" >&2
    exit 1
  }
node --input-type=module - "$STATE_DIR/action-result.json" <<'NODE'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const output = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const rows = output[0]?.results ?? output.result?.[0]?.results ?? output.results;
assert.ok(Array.isArray(rows), 'Wrangler should return local D1 action rows as JSON');
assert.equal(rows.length, 1, 'the signed action should be stored');
assert.equal(rows[0].operation_state, 'completed', 'the reveal operation should complete');
assert.equal(rows[0].receipt_count, 1, 'one signed action receipt should be stored');
assert.equal(rows[0].item_state, 'completed', 'the receipt should contain a completed item result');
console.log('PASS: local D1 contains the completed operation and verified signed receipt');
NODE

printf '%s\n' 'All non-production PluginHub checks passed.'
