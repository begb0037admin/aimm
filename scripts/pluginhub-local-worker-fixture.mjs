import { createHash, createHmac, createECDH } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [stateDir, phase] = process.argv.slice(2);
if (!stateDir || !["seed", "action", "restore"].includes(phase)) {
  throw new Error("Usage: node pluginhub-local-worker-fixture.mjs <temporary-state-dir> <seed|action|restore>");
}

const accountID = "local-worker-smoke-account";
const deviceID = "22222222-2222-4222-8222-222222222222";
const generationID = "33333333-3333-4333-8333-333333333333";
const operationID = "44444444-4444-4444-8444-444444444444";
const movedGenerationID = "55555555-5555-4555-8555-555555555555";
const parentMoveOperationID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const restoreOperationID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const credential = "pluginhub-local-worker-smoke-bearer-token";
const privateKey = Buffer.alloc(32, 9);
const pluginPath = "/private/tmp/aimm-synthetic-local-worker-fixture/Synth.component";
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const sqlFile = join(stateDir, `${phase}-fixture.sql`);

let statements;
if (phase === "seed") {
  const ecdh = createECDH("prime256v1");
  ecdh.setPrivateKey(privateKey);
  const point = ecdh.getPublicKey(undefined, "uncompressed");
  const base64url = (bytes) => bytes.toString("base64url");
  const publicJWK = JSON.stringify({
    kty: "EC", crv: "P-256", x: base64url(point.subarray(1, 33)), y: base64url(point.subarray(33, 65))
  });
  const tokenHash = createHash("sha256").update(credential).digest("hex");
  const now = new Date().toISOString();
  statements = [
    `INSERT INTO accounts (account_id, oidc_issuer, oidc_subject, created_at) VALUES (${quote(accountID)}, 'https://issuer.local.test/', 'local-worker-smoke-subject', ${quote(now)});`,
    `INSERT INTO devices (device_id, account_id, display_name, public_key_jwk, capabilities_json, created_at) VALUES (${quote(deviceID)}, ${quote(accountID)}, 'Disposable local sync fixture', ${quote(publicJWK)}, '["inventory:write","checks:write","commands:read","actions:write"]', ${quote(now)});`,
    `INSERT INTO device_credentials (credential_id, device_id, account_id, token_hash, issued_at) VALUES ('local-worker-smoke-credential', ${quote(deviceID)}, ${quote(accountID)}, ${quote(tokenHash)}, ${quote(now)});`
  ];
} else if (phase === "action") {
  const bytes = createHmac("sha256", privateKey).update(pluginPath).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  const recordID = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const nonce = "local-worker-smoke-action-nonce";
  statements = [
    `INSERT INTO operations (operation_id, account_id, device_id, generation_id, kind, nonce, idempotency_key, request_hash, state, created_at, expires_at) VALUES (${quote(operationID)}, ${quote(accountID)}, ${quote(deviceID)}, ${quote(generationID)}, 'reveal', ${quote(nonce)}, 'local-worker-smoke-idempotency', 'local-worker-smoke-request-hash', 'requested', ${quote(now)}, ${quote(expires)});`,
    `INSERT INTO operation_items (operation_id, device_id, generation_id, record_id) VALUES (${quote(operationID)}, ${quote(deviceID)}, ${quote(generationID)}, ${quote(recordID)});`
  ];
} else {
  const bytes = createHmac("sha256", privateKey).update(pluginPath).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  const recordID = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  const movedItem = join("/private/tmp/aimm-synthetic-local-worker-fixture/Unused", "Synth.component");
  const content = Buffer.from("synthetic-preview-item");
  mkdirSync(movedItem, { recursive: true });
  writeFileSync(join(movedItem, "Contents.bin"), content);
  const digest = createHash("sha256")
    .update(Buffer.from(".\0\x01\0"))
    .update(Buffer.from("Contents.bin\0\x02\0"))
    .update(content)
    .update(Buffer.from([0xff]))
    .digest("hex");
  const now = new Date().toISOString();
  const movedAt = new Date(Date.now() - 60_000).toISOString();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const summary = JSON.stringify({
    state: "completed", completed_at: movedAt, generation_id: generationID,
    items: [{ record_id: recordID, status: "completed", evidence: {
      tree_digest: digest, destination_verified: true, source_removed: true
    }, rescan_generation_id: movedGenerationID }], signature_hash: "local-restore-smoke-parent"
  });
  statements = [
    `INSERT INTO scan_generations (device_id, generation_id, started_at, completed_at, root_count, record_count, chunk_count, schema_version, state, created_at) VALUES (${quote(deviceID)}, ${quote(movedGenerationID)}, ${quote(movedAt)}, ${quote(movedAt)}, 1, 0, 0, 1, 'complete', ${quote(movedAt)});`,
    `UPDATE device_inventory_heads SET generation_id = ${quote(movedGenerationID)}, updated_at = ${quote(now)} WHERE device_id = ${quote(deviceID)};`,
    `INSERT INTO operations (operation_id, account_id, device_id, generation_id, kind, nonce, idempotency_key, request_hash, state, created_at, expires_at, terminal_at) VALUES (${quote(parentMoveOperationID)}, ${quote(accountID)}, ${quote(deviceID)}, ${quote(generationID)}, 'move_to_unused', 'local-parent-move-nonce', 'local-parent-move-idempotency', 'local-parent-move-hash', 'completed', ${quote(movedAt)}, ${quote(expires)}, ${quote(movedAt)});`,
    `INSERT INTO operation_items (operation_id, device_id, generation_id, record_id) VALUES (${quote(parentMoveOperationID)}, ${quote(deviceID)}, ${quote(generationID)}, ${quote(recordID)});`,
    `INSERT INTO action_receipts (receipt_id, account_id, device_id, operation_id, terminal_at, expires_at, summary_json, created_at) VALUES ('local-restore-parent-receipt', ${quote(accountID)}, ${quote(deviceID)}, ${quote(parentMoveOperationID)}, ${quote(movedAt)}, ${quote(expires)}, ${quote(summary)}, ${quote(movedAt)});`,
    `INSERT INTO operations (operation_id, account_id, device_id, generation_id, kind, nonce, idempotency_key, request_hash, state, created_at, expires_at, restore_parent_operation_id) VALUES (${quote(restoreOperationID)}, ${quote(accountID)}, ${quote(deviceID)}, ${quote(movedGenerationID)}, 'restore', 'local-restore-nonce', 'local-restore-idempotency', 'local-restore-hash', 'requested', ${quote(now)}, ${quote(expires)}, ${quote(parentMoveOperationID)});`,
    `INSERT INTO restore_action_items (operation_id, parent_move_operation_id, device_id, parent_generation_id, record_id) VALUES (${quote(restoreOperationID)}, ${quote(parentMoveOperationID)}, ${quote(deviceID)}, ${quote(generationID)}, ${quote(recordID)});`
  ];
}

writeFileSync(sqlFile, `${statements.join("\n")}\n`, { mode: 0o600 });
console.log(`${phase} fixture prepared in temporary local test state`);
