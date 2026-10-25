#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
rm -rf /private/tmp/aimm-synthetic-local-worker-fixture

printf '%s\n' 'Packaging and verifying the local ad-hoc-signed companion preview...'
APP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/pluginhub-app-check.XXXXXX")
cleanup_app() { rm -rf "$APP_DIR"; }
trap cleanup_app EXIT HUP INT TERM
sh "$ROOT/scripts/package-pluginhub-nonprod-app.sh" "$APP_DIR"
codesign --verify --strict "$APP_DIR/AIMM Companion Preview.app"
printf '%s\n' 'PASS: preview app bundle has a valid local ad-hoc signature.'
rm -rf "$APP_DIR"
trap - EXIT HUP INT TERM

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
RESTORE_PID=
cleanup() {
  if [ -n "$RESTORE_PID" ]; then
    kill "$RESTORE_PID" 2>/dev/null || true
    wait "$RESTORE_PID" 2>/dev/null || true
  fi
  rm -rf /private/tmp/aimm-synthetic-local-worker-fixture
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
  --var 'ACTION_PREVIEW_ENCRYPTION_KEY:MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY' \
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
SECOND_ACCOUNT_DEVICE_ID='99999999-9999-4999-8999-999999999999'
SECOND_ACCOUNT_TOKEN='pluginhub-local-worker-smoke-account-b-token'
node "$ROOT/scripts/pluginhub-local-worker-fixture.mjs" "$STATE_DIR" seed
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --file "$STATE_DIR/seed-fixture.sql" >"$STATE_DIR/seed-fixture.log" 2>&1 || {
  cat "$STATE_DIR/seed-fixture.log" >&2
  exit 1
}
check_http_status 401 "$BASE_URL/v1/devices/$SYNC_DEVICE_ID/identity" -H "Authorization: Bearer $SECOND_ACCOUNT_TOKEN"
check_http_status 401 "$BASE_URL/v1/devices/$SECOND_ACCOUNT_DEVICE_ID/identity" -H "Authorization: Bearer $SYNC_TOKEN"
printf '%s\n' 'PASS: local Worker rejects device credentials across both synthetic accounts.'
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

# Exercise the destructive move path only with a disposable local D1 and a
# synthetic fixture file. The harness marks confirmation for this exact digest.
node "$ROOT/scripts/pluginhub-local-worker-fixture.mjs" "$STATE_DIR" move
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --file "$STATE_DIR/move-fixture.sql" >"$STATE_DIR/move-fixture.log" 2>&1 || {
  cat "$STATE_DIR/move-fixture.log" >&2
  exit 1
}
MOVE_GATE_DIR="$STATE_DIR/move-gate"
mkdir -p "$MOVE_GATE_DIR"
(
  cd "$ROOT/companion"
  AIMM_PAIRING_SMOKE_URL="$BASE_URL" \
  AIMM_MOVE_SMOKE_URL="$BASE_URL" \
  AIMM_MOVE_SMOKE_GATE_DIR="$MOVE_GATE_DIR" \
  AIMM_SYNC_SMOKE_DEVICE_ID="$SYNC_DEVICE_ID" \
  AIMM_SYNC_SMOKE_TOKEN="$SYNC_TOKEN" \
  swift run aimm-journal-check >"$STATE_DIR/move-client.log" 2>&1
) &
RESTORE_PID=$!
attempt=0
while [ ! -f "$MOVE_GATE_DIR/preview.txt" ] && [ "$attempt" -lt 200 ]; do
  if ! kill -0 "$RESTORE_PID" 2>/dev/null; then
    cat "$STATE_DIR/move-client.log" >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 0.25
done
if [ ! -f "$MOVE_GATE_DIR/preview.txt" ]; then
  cat "$STATE_DIR/move-client.log" >&2
  printf '%s\n' 'Swift move client did not submit its preview in time.' >&2
  exit 1
fi
MOVE_OPERATION_ID=$(sed -n '1p' "$MOVE_GATE_DIR/preview.txt")
MOVE_PREVIEW_DIGEST=$(sed -n '2p' "$MOVE_GATE_DIR/preview.txt")
CONFIRMED_AT=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" \
  --command "UPDATE operations SET owner_confirmed_at = '$CONFIRMED_AT' WHERE operation_id = '$MOVE_OPERATION_ID' AND preview_digest = '$MOVE_PREVIEW_DIGEST'" \
  >"$STATE_DIR/move-confirm.log" 2>&1 || {
    cat "$STATE_DIR/move-confirm.log" >&2
    exit 1
  }
touch "$MOVE_GATE_DIR/resume"
wait "$RESTORE_PID" || {
  cat "$STATE_DIR/move-client.log" >&2
  exit 1
}
RESTORE_PID=
cat "$STATE_DIR/move-client.log"

node "$ROOT/scripts/pluginhub-local-worker-fixture.mjs" "$STATE_DIR" restore
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --file "$STATE_DIR/restore-fixture.sql" >"$STATE_DIR/restore-fixture.log" 2>&1 || {
  cat "$STATE_DIR/restore-fixture.log" >&2
  exit 1
}
RESTORE_GATE_DIR="$STATE_DIR/restore-gate"
mkdir -p "$RESTORE_GATE_DIR"
(
  cd "$ROOT/companion"
  AIMM_PAIRING_SMOKE_URL="$BASE_URL" \
  AIMM_RESTORE_SMOKE_URL="$BASE_URL" \
  AIMM_RESTORE_SMOKE_GATE_DIR="$RESTORE_GATE_DIR" \
  AIMM_SYNC_SMOKE_DEVICE_ID="$SYNC_DEVICE_ID" \
  AIMM_SYNC_SMOKE_TOKEN="$SYNC_TOKEN" \
  swift run aimm-journal-check >"$STATE_DIR/restore-client.log" 2>&1
) &
RESTORE_PID=$!
attempt=0
while [ ! -f "$RESTORE_GATE_DIR/preview.txt" ] && [ "$attempt" -lt 200 ]; do
  if ! kill -0 "$RESTORE_PID" 2>/dev/null; then
    cat "$STATE_DIR/restore-client.log" >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 0.25
done
if [ ! -f "$RESTORE_GATE_DIR/preview.txt" ]; then
  cat "$STATE_DIR/restore-client.log" >&2
  printf '%s\n' 'Swift restore client did not submit its preview in time.' >&2
  exit 1
fi
RESTORE_OPERATION_ID=$(sed -n '1p' "$RESTORE_GATE_DIR/preview.txt")
RESTORE_PREVIEW_DIGEST=$(sed -n '2p' "$RESTORE_GATE_DIR/preview.txt")
CONFIRMED_AT=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" \
  --command "UPDATE operations SET owner_confirmed_at = '$CONFIRMED_AT' WHERE operation_id = '$RESTORE_OPERATION_ID' AND preview_digest = '$RESTORE_PREVIEW_DIGEST'" \
  >"$STATE_DIR/restore-confirm.log" 2>&1 || {
    cat "$STATE_DIR/restore-confirm.log" >&2
    exit 1
  }
touch "$RESTORE_GATE_DIR/resume"
wait "$RESTORE_PID" || {
  cat "$STATE_DIR/restore-client.log" >&2
  exit 1
}
RESTORE_PID=
cat "$STATE_DIR/restore-client.log"
./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --json \
  --command "SELECT o.state, r.summary_json FROM operations o JOIN action_receipts r ON r.operation_id = o.operation_id WHERE o.operation_id = '$RESTORE_OPERATION_ID'" \
  >"$STATE_DIR/restore-result.json" 2>"$STATE_DIR/restore-result.log" || {
    cat "$STATE_DIR/restore-result.log" >&2
    exit 1
  }
node --input-type=module - "$STATE_DIR/restore-result.json" "$RESTORE_OPERATION_ID" <<'NODE'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const output = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const rows = output[0]?.results ?? output.result?.[0]?.results ?? output.results;
assert.ok(Array.isArray(rows), 'Wrangler should return the local restore D1 row');
assert.equal(rows.length, 1, 'one local restore operation should be stored');
assert.equal(rows[0].state, 'completed', 'the actual Swift restore operation should complete');
const summary = JSON.parse(rows[0].summary_json);
assert.equal(summary.state, 'completed');
assert.equal(summary.parent_move_operation_id, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
assert.equal(summary.items[0].status, 'completed');
console.log('PASS: local D1 contains the completed Swift restore and parent-move-bound signed receipt');
NODE

./node_modules/.bin/wrangler d1 execute aimm-library-foundation-dev --local --persist-to "$STATE_DIR" --json \
  --command "SELECT state, record_count FROM scan_generations WHERE device_id = '$SYNC_DEVICE_ID' AND generation_id = '66666666-6666-4666-8666-666666666666'" \
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
  --command "SELECT result, source_type, route, comparison_reason FROM check_observations WHERE device_id = '$SYNC_DEVICE_ID' AND generation_id = '33333333-3333-4333-8333-333333333333'" \
  >"$STATE_DIR/check-result.json" 2>"$STATE_DIR/check-result.log" || {
    cat "$STATE_DIR/check-result.log" >&2
    exit 1
  }
node --input-type=module - "$STATE_DIR/check-result.json" <<'NODE'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const output = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const rows = output[0]?.results ?? output.result?.[0]?.results ?? output.results;
assert.ok(Array.isArray(rows), 'Wrangler should return local D1 check rows as JSON');
assert.equal(rows.length, 1, 'one manual status observation should be stored');
assert.equal(rows[0].result, 'manual', 'unsupported products must remain in Manual Check');
assert.equal(rows[0].source_type, 'manual', 'the source must say this is not a vendor check');
assert.equal(rows[0].route, 'manual', 'the route must not imply a verified direct update');
assert.equal(rows[0].comparison_reason, 'manual_check_required', 'the reason must be explicit');
console.log('PASS: local D1 stores an explicit Manual Check observation');
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
