import { createHash, createHmac, createECDH } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const [stateDir, phase] = process.argv.slice(2);
if (!stateDir || !["seed", "action"].includes(phase)) {
  throw new Error("Usage: node pluginhub-local-worker-fixture.mjs <temporary-state-dir> <seed|action>");
}

const accountID = "local-worker-smoke-account";
const deviceID = "22222222-2222-4222-8222-222222222222";
const generationID = "33333333-3333-4333-8333-333333333333";
const operationID = "44444444-4444-4444-8444-444444444444";
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
} else {
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
}

writeFileSync(sqlFile, `${statements.join("\n")}\n`, { mode: 0o600 });
console.log(`${phase} fixture prepared in temporary local test state`);
