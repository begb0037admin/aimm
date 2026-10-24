import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { createHash, generateKeyPairSync, sign as signJwt } from "node:crypto";
import { readFileSync } from "node:fs";
import worker from "../src/index.js";

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "local-test-key", alg: "RS256", use: "sig" };
const jwksUrl = "https://jwks.local.test/keys";
const realFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  if (String(url) === jwksUrl) return new Response(JSON.stringify({ keys: [jwk] }), { headers: { "content-type": "application/json" } });
  throw new Error("Unexpected network request in local test: " + url);
};

function token(subject, options = {}) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT", kid: "local-test-key" };
  const claims = {
    iss: "https://issuer.local.test/",
    aud: "https://api.local.test/",
    azp: "local-first-party-client",
    gty: "authorization_code",
    sub: subject,
    scope: "read:library manage:devices delete:account",
    auth_time: now,
    iat: now,
    exp: now + 3600,
    ...options
  };
  const enc = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const input = enc(header) + "." + enc(claims);
  return input + "." + signJwt("RSA-SHA256", Buffer.from(input), privateKey).toString("base64url");
}

function d1() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON");
  let batchQueue = Promise.resolve();
  for (const file of [
    "../migrations/0001_foundation.sql",
    "../migrations/0002_enforce_ownership_and_retention.sql",
    "../migrations/0003_browser_sessions.sql",
    "../migrations/0004_device_pairing.sql",
    "../migrations/0005_device_credential_rotation.sql",
    "../migrations/0006_inventory_generations.sql",
    "../migrations/0007_status_preferences.sql",
    "../migrations/0008_safe_actions.sql"
  ]) sqlite.exec(readFileSync(new URL(file, import.meta.url), "utf8"));

  return {
    prepare(sql) {
      let params = [];
      const statement = {
        bind(...values) { params = values; return statement; },
        async first() { return sqlite.prepare(sql).get(...params) ?? null; },
        async all() { return { results: sqlite.prepare(sql).all(...params) }; },
        async run() {
          const result = sqlite.prepare(sql).run(...params);
          return { success: true, meta: { changes: Number(result.changes) } };
        }
      };
      return statement;
    },
    async batch(statements) {
      let release;
      const prior = batchQueue;
      batchQueue = new Promise((resolve) => { release = resolve; });
      await prior;
      sqlite.exec("BEGIN");
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        sqlite.exec("COMMIT");
        return results;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      } finally {
        release();
      }
    },
    raw(sql, ...params) { return sqlite.prepare(sql).all(...params); },
    close() { sqlite.close(); }
  };
}

const envFor = (DB) => ({
  DB,
  SITE_ORIGIN: "https://aimixmasters.com",
  OIDC_ISSUER: "https://issuer.local.test/",
  OIDC_AUDIENCE: "https://api.local.test/",
  OIDC_JWKS_URL: jwksUrl,
  OIDC_ALLOWED_CLIENT_IDS: "local-first-party-client"
});
async function signedPairingRequest(env, deviceName = "Kevin's Mac") {
  const pairKey = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const exported = await crypto.subtle.exportKey("jwk", pairKey.publicKey);
  const publicKey = { kty: "EC", crv: "P-256", x: exported.x, y: exported.y };
  const clientNonce = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");
  const fingerprint = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(publicKey)));
  const fingerprintHex = Array.from(new Uint8Array(fingerprint), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, pairKey.privateKey,
    new TextEncoder().encode(`AIMM-PAIR-INIT\n${clientNonce}\n${fingerprintHex}`)
  );
  const toBase64Url = (bytes) => Buffer.from(bytes).toString("base64url");
  const response = await call(env, "/v1/pairings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: { device_name: deviceName, public_key: publicKey, client_nonce: clientNonce, proof_signature: toBase64Url(signature) }
  });
  return { response, pairKey };
}
const call = (env, path, { method = "GET", headers = {}, body } = {}) =>
  worker.fetch(new Request("https://api.local.test" + path, {
    method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) })
  }), env);

test("health is available and protected routes reject missing identity", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const health = await call(env, "/health");
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, "ok");
  const protectedResponse = await call(env, "/v1/me");
  assert.equal(protectedResponse.status, 401);
});

test("inventory generations are device-scoped, path-free, idempotent, and publish only when complete", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const ownerHeaders = { authorization: "Bearer " + token("inventory-owner") };
  assert.equal((await call(env, "/v1/me", { headers: ownerHeaders })).status, 200);
  const accountId = DB.raw("SELECT account_id FROM accounts WHERE oidc_subject = ?", "inventory-owner")[0].account_id;
  const deviceId = crypto.randomUUID();
  const credential = "device-inventory-secret-123456789";
  const tokenHash = createHash("sha256").update(credential).digest("hex");
  const receiptKeys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const receiptPublicJWK = await crypto.subtle.exportKey("jwk", receiptKeys.publicKey);
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, public_key_jwk, capabilities_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    deviceId, accountId, "Test Mac", JSON.stringify(receiptPublicJWK), JSON.stringify(["inventory:write", "checks:write", "commands:read", "actions:write"]), new Date().toISOString());
  DB.raw("INSERT INTO device_credentials (credential_id, device_id, account_id, token_hash, issued_at) VALUES (?, ?, ?, ?, ?)",
    crypto.randomUUID(), deviceId, accountId, tokenHash, new Date().toISOString());

  const generationId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  const chunkPath = `/v1/devices/${deviceId}/inventory/${generationId}/chunks/0`;
  const chunkBody = { schema_version: 1, started_at: startedAt, root_count: 1, records: [
    { id: crypto.randomUUID(), name: "Synth", bundleIdentifier: "com.example.synth", version: "1.2", format: "AU", metadataSource: "infoPlist" }
  ] };
  const upload = () => call(env, chunkPath, {
    method: "PUT", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` }, body: chunkBody
  });
  assert.equal((await upload()).status, 201);
  const replay = await upload();
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).replay, true);
  const conflicting = await call(env, chunkPath, {
    method: "PUT", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { ...chunkBody, records: [{ ...chunkBody.records[0], name: "Different" }] }
  });
  assert.equal(conflicting.status, 409);
  const injection = await call(env, `/v1/devices/${deviceId}/inventory/${crypto.randomUUID()}/chunks/0`, {
    method: "PUT", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { ...chunkBody, records: [{ ...chunkBody.records[0], localPath: "/private/secret" }] }
  });
  assert.equal(injection.status, 400);
  assert.doesNotMatch(DB.raw("SELECT records_json FROM inventory_chunks")[0].records_json, /localPath|\/private\/secret/);

  const completedAt = new Date(Date.now() + 1000).toISOString();
  const incomplete = await call(env, `/v1/devices/${deviceId}/inventory/${generationId}/finalize`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { completed_at: completedAt, record_count: 2, chunk_count: 2 }
  });
  assert.equal(incomplete.status, 409);
  const finalized = await call(env, `/v1/devices/${deviceId}/inventory/${generationId}/finalize`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { completed_at: completedAt, record_count: 1, chunk_count: 1 }
  });
  assert.equal(finalized.status, 200);
  const library = await call(env, "/v1/library", { headers: ownerHeaders });
  assert.equal(library.status, 200);
  const visible = await library.json();
  assert.equal(visible.generation.generation_id, generationId);
  assert.equal(visible.records.length, 1);
  assert.equal("localPath" in visible.records[0], false);

  const checkedAt = new Date().toISOString();
  const recordId = chunkBody.records[0].id;
  const checkURL = `/v1/devices/${deviceId}/checks/${generationId}`;
  const updateCheck = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{
      record_id: recordId, installed_version: "1.2", latest_version: "1.3",
      result: "update", source_type: "public_vendor", checked_at: checkedAt,
      last_good_at: checkedAt, paid_upgrade: false, route: "vendor_site"
    }] }
  });
  assert.equal(updateCheck.status, 201);
  const checks = await call(env, "/v1/checks", { headers: ownerHeaders });
  assert.equal((await checks.json()).observations[0].result, "update");
  const statusBeforeMarks = await call(env, "/v1/status-summary", { headers: ownerHeaders });
  const beforeSummary = await statusBeforeMarks.json();
  assert.equal(beforeSummary.rule_version, 1);
  assert.equal(beforeSummary.counts.update, 1);
  assert.equal(beforeSummary.records[0].status, "update");
  const unverifiedRoute = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{
      record_id: recordId, installed_version: "1.2", latest_version: "1.3",
      result: "update", source_type: "public_vendor", checked_at: checkedAt,
      route: "direct_verified"
    }] }
  });
  assert.equal(unverifiedRoute.status, 400);

  const preferenceURL = "/v1/preferences/settings";
  const setting = await call(env, preferenceURL, {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" }, body: { key: "notifications", value: true, expected_revision: 0 }
  });
  assert.equal(setting.status, 200);
  assert.equal((await setting.json()).revision, 1);
  const staleSetting = await call(env, preferenceURL, {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" }, body: { key: "notifications", value: false, expected_revision: 0 }
  });
  assert.equal(staleSetting.status, 409);
  const mark = await call(env, "/v1/preferences/marks", {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { scope: "product", target_key: "com.example.synth", favorite: true, pinned: true,
      tags: ["keys"], snooze_until: new Date(Date.now() + 86_400_000).toISOString(), expected_revision: 0 }
  });
  assert.equal(mark.status, 200);
  const markedSummary = await (await call(env, "/v1/status-summary", { headers: ownerHeaders })).json();
  assert.equal(markedSummary.counts.pinned, 1);
  assert.equal(markedSummary.counts.snoozed, 1);
  const preferences = await (await call(env, "/v1/preferences", { headers: ownerHeaders })).json();
  assert.equal(preferences.settings[0].value, true);
  assert.equal(preferences.marks[0].tags[0], "keys");

  const actionInput = {
    device_id: deviceId, kind: "reveal", record_ids: [recordId],
    idempotency_key: "reveal-test-record-0001"
  };
  const browserExchange = await call(env, "/v1/session", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, authorization: "Bearer " + token("inventory-owner") }
  });
  assert.equal(browserExchange.status, 200);
  const browserSession = browserExchange.headers.getSetCookie().map((cookie) => cookie.split(";")[0]).join("; ");
  const cookieActionInput = { ...actionInput, device_id: crypto.randomUUID(), idempotency_key: "cookie-action-csrf-check-001" };
  const operationsBeforeCsrfProbe = DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n;
  const csrfDeniedAction = await call(env, "/v1/actions", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: browserSession, "content-type": "application/json" },
    body: cookieActionInput
  });
  assert.equal(csrfDeniedAction.status, 403);
  assert.equal((await csrfDeniedAction.json()).error.code, "csrf_rejected");
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n, operationsBeforeCsrfProbe);
  const csrfAuthorizedActionValidation = await call(env, "/v1/actions", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: browserSession, "x-csrf-token": (await browserExchange.json()).csrf_token, "content-type": "application/json" },
    body: cookieActionInput
  });
  assert.equal(csrfAuthorizedActionValidation.status, 404);
  assert.equal((await csrfAuthorizedActionValidation.json()).error.code, "device_not_found");
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n, operationsBeforeCsrfProbe);

  const queued = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" }, body: actionInput
  });
  assert.equal(queued.status, 201);
  const operation = await queued.json();
  assert.equal(operation.state, "requested");
  const replayAction = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" }, body: actionInput
  });
  assert.equal(replayAction.status, 200);
  const replayActionBody = await replayAction.json();
  assert.equal(replayActionBody.operation_id, operation.operation_id);
  assert.equal(replayActionBody.replay, true);
  const unsupportedAction = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "trash_plugin_copy", idempotency_key: "trash-test-record-0001" }
  });
  assert.equal(unsupportedAction.status, 400);

  const commandResponse = await call(env, `/v1/devices/${deviceId}/commands`, {
    headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(commandResponse.status, 200);
  const commands = await commandResponse.json();
  assert.equal(commands.commands.length, 1);
  assert.deepEqual(commands.commands[0].record_ids, [recordId]);
  assert.equal("localPath" in commands.commands[0], false);
  const claim = await call(env, `/v1/devices/${deviceId}/actions/${operation.operation_id}/claim`, {
    method: "POST", headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(claim.status, 200);

  const signedReceipt = {
    operation_id: operation.operation_id, device_id: deviceId,
    generation_id: generationId, nonce: commands.commands[0].nonce,
    completed_at: new Date().toISOString(), state: "completed",
    items: [{ record_id: recordId, status: "completed" }]
  };
  const canonical = (value) => Array.isArray(value) ? `[${value.map(canonical).join(",")}]` :
    value && typeof value === "object" ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}` : JSON.stringify(value);
  const signatureBytes = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey, new TextEncoder().encode(canonical(signedReceipt)));
  const signature = Buffer.from(signatureBytes).toString("base64url");
  const receiptRequest = () => call(env, `/v1/devices/${deviceId}/actions/${operation.operation_id}/receipt`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { receipt: signedReceipt, signature }
  });
  const acceptedReceipt = await receiptRequest();
  assert.equal(acceptedReceipt.status, 201);
  const receiptReplay = await receiptRequest();
  assert.equal(receiptReplay.status, 200);
  assert.equal((await receiptReplay.json()).replay, true);
  const ownerAction = await call(env, `/v1/actions/${operation.operation_id}`, { headers: ownerHeaders });
  assert.equal(ownerAction.status, 200);
  const ownerActionBody = await ownerAction.json();
  assert.equal(ownerActionBody.state, "completed");
  assert.deepEqual(ownerActionBody.receipt.item_statuses, ["completed"]);
  assert.doesNotMatch(JSON.stringify(ownerActionBody), /localPath|selected\/AudioUnit/);

  const other = await call(env, "/v1/library", { headers: { authorization: "Bearer " + token("other-inventory-owner") } });
  assert.equal(other.status, 200);
  assert.equal((await other.json()).device, null);
  const otherChecks = await call(env, "/v1/checks", { headers: { authorization: "Bearer " + token("other-inventory-owner") } });
  assert.deepEqual((await otherChecks.json()).observations, []);
  const otherPreferences = await call(env, "/v1/preferences", { headers: { authorization: "Bearer " + token("other-inventory-owner") } });
  assert.deepEqual(await otherPreferences.json(), { settings: [], marks: [] });

  const partialId = crypto.randomUUID();
  const partialUpload = await call(env, `/v1/devices/${deviceId}/inventory/${partialId}/chunks/0`, {
    method: "PUT", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` }, body: chunkBody
  });
  assert.equal(partialUpload.status, 201);
  const partialFinalize = await call(env, `/v1/devices/${deviceId}/inventory/${partialId}/finalize`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { completed_at: completedAt, record_count: 1, chunk_count: 1, partial: true }
  });
  assert.equal(partialFinalize.status, 200);
  assert.equal((await (await call(env, "/v1/library", { headers: ownerHeaders })).json()).generation.generation_id, generationId);

  const emptyId = crypto.randomUUID();
  const emptyStart = await call(env, `/v1/devices/${deviceId}/inventory/${emptyId}/start`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { started_at: startedAt, root_count: 0, schema_version: 1 }
  });
  assert.equal(emptyStart.status, 201);
  const emptyFinalize = await call(env, `/v1/devices/${deviceId}/inventory/${emptyId}/finalize`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { completed_at: completedAt, record_count: 0, chunk_count: 0 }
  });
  assert.equal(emptyFinalize.status, 200);
  const emptyLibrary = await (await call(env, "/v1/library", { headers: ownerHeaders })).json();
  assert.equal(emptyLibrary.generation.generation_id, emptyId);
  assert.equal(emptyLibrary.records.length, 0);

  const wrongDevice = await call(env, `/v1/devices/${crypto.randomUUID()}/inventory/${crypto.randomUUID()}/chunks/0`, {
    method: "PUT", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` }, body: chunkBody
  });
  assert.equal(wrongDevice.status, 401);

  const readOnlyDevice = crypto.randomUUID();
  const readOnlySecret = "device-without-inventory-write";
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, capabilities_json, created_at) VALUES (?, ?, ?, ?, ?)",
    readOnlyDevice, accountId, "Read only Mac", "[]", new Date().toISOString());
  DB.raw("INSERT INTO device_credentials (credential_id, device_id, account_id, token_hash, issued_at) VALUES (?, ?, ?, ?, ?)",
    crypto.randomUUID(), readOnlyDevice, accountId, createHash("sha256").update(readOnlySecret).digest("hex"), new Date().toISOString());
  const capabilityDenied = await call(env, `/v1/devices/${readOnlyDevice}/inventory/${crypto.randomUUID()}/start`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${readOnlySecret}` },
    body: { started_at: startedAt, root_count: 1, schema_version: 1 }
  });
  assert.equal(capabilityDenied.status, 403);
});

test("OIDC exchange, session restore, and CSRF/logout boundaries work", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const badOrigin = await call(env, "/v1/session", {
    method: "POST",
    headers: { origin: "https://attacker.example", authorization: "Bearer " + token("user-a") }
  });
  assert.equal(badOrigin.status, 403);

  const exchange = await call(env, "/v1/session", {
    method: "POST",
    headers: { origin: env.SITE_ORIGIN, authorization: "Bearer " + token("user-a") }
  });
  assert.equal(exchange.status, 200);
  const setCookies = exchange.headers.getSetCookie();
  assert.equal(setCookies.length, 2);
  assert.match(setCookies[0], /HttpOnly/);
  assert.match(setCookies[0], /Secure/);
  assert.match(setCookies[0], /SameSite=Strict/);
  assert.match(setCookies[1], /Secure/);
  const payload = await exchange.json();
  const sessionCookie = setCookies[0].split(";")[0];
  const csrfCookie = setCookies[1].split(";")[0];
  const cookies = sessionCookie + "; " + csrfCookie;

  const restored = await call(env, "/v1/session", {
    headers: { origin: env.SITE_ORIGIN, cookie: cookies }
  });
  assert.equal(restored.status, 200);
  assert.equal((await restored.json()).csrf_token, payload.csrf_token);

  const me = await call(env, "/v1/me", { headers: { origin: env.SITE_ORIGIN, cookie: cookies } });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).account_id, payload.account_id);

  const deniedWrite = await call(env, "/v1/session", {
    method: "DELETE", headers: { origin: env.SITE_ORIGIN, cookie: cookies }
  });
  assert.equal(deniedWrite.status, 403);

  const logout = await call(env, "/v1/session", {
    method: "DELETE",
    headers: { origin: env.SITE_ORIGIN, cookie: cookies, "x-csrf-token": payload.csrf_token }
  });
  assert.equal(logout.status, 200);
  assert.equal((await logout.json()).signed_out, true);
  const afterLogout = await call(env, "/v1/session", {
    headers: { origin: env.SITE_ORIGIN, cookie: cookies }
  });
  assert.equal(afterLogout.status, 401);
});

test("a missing D1 migration is reported as a database error, not an identity-provider outage", async () => {
  const DB = {
    prepare() {
      throw new Error("no such table: deleted_identities");
    }
  };
  const env = envFor(DB);
  const response = await call(env, "/v1/session", {
    method: "POST",
    headers: {
      origin: env.SITE_ORIGIN,
      authorization: "Bearer " + token("user-missing-migration")
    }
  });
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.error.code, "database_unavailable");
  assert.doesNotMatch(JSON.stringify(body), /deleted_identities/);
});

test("a browser-session write failure is reported as a database error", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const prepare = DB.prepare.bind(DB);
  DB.prepare = (sql) => {
    const statement = prepare(sql);
    if (!sql.startsWith("INSERT INTO browser_sessions")) return statement;
    return {
      bind(...values) {
        statement.bind(...values);
        return { run: async () => { throw new Error("no such table: browser_sessions"); } };
      }
    };
  };

  const env = envFor(DB);
  const response = await call(env, "/v1/session", {
    method: "POST",
    headers: {
      origin: env.SITE_ORIGIN,
      authorization: "Bearer " + token("user-session-write-failure")
    }
  });
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.error.code, "database_unavailable");
  assert.doesNotMatch(JSON.stringify(body), /browser_sessions/);
});

test("device pairing proves key possession, requires owner confirmation, and delivers one credential once", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const { response: created } = await signedPairingRequest(env);
  assert.equal(created.status, 201);
  const pairing = await created.json();
  assert.match(pairing.pairing_id, /^[A-Za-z0-9_-]{40,64}$/);
  assert.doesNotMatch(pairing.approval_url, /polling_secret/);
  const stored = DB.raw("SELECT polling_secret_hash, verification_phrase, approved_account_id FROM pairings WHERE pairing_id = ?", pairing.pairing_id)[0];
  const secretHash = Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pairing.polling_secret))).toString("hex");
  assert.equal(stored.polling_secret_hash, secretHash);
  assert.notEqual(stored.polling_secret_hash, pairing.polling_secret);

  const invalidSecret = await call(env, `/v1/pairings/${pairing.pairing_id}/poll`, {
    method: "POST", headers: { "x-pairing-secret": "incorrect-secret" }
  });
  assert.equal(invalidSecret.status, 401);
  assert.equal(DB.raw("SELECT poll_attempts FROM pairings WHERE pairing_id = ?", pairing.pairing_id)[0].poll_attempts, 0);

  const pendingPoll = await call(env, `/v1/pairings/${pairing.pairing_id}/poll`, {
    method: "POST", headers: { "x-pairing-secret": pairing.polling_secret }
  });
  assert.equal(pendingPoll.status, 202);
  assert.equal((await pendingPoll.json()).status, "pending");

  const exchange = await call(env, "/v1/session", {
    method: "POST",
    headers: { origin: env.SITE_ORIGIN, authorization: "Bearer " + token("pair-owner") }
  });
  assert.equal(exchange.status, 200);
  const csrfToken = (await exchange.json()).csrf_token;
  const cookies = exchange.headers.getSetCookie().map((cookie) => cookie.split(";")[0]).join("; ");
  const pairingUrl = `/v1/pairings/${pairing.pairing_id}`;
  const viewed = await call(env, pairingUrl, { headers: { origin: env.SITE_ORIGIN, cookie: cookies } });
  assert.equal(viewed.status, 200);
  assert.equal((await viewed.json()).verification_phrase, pairing.verification_phrase);

  const deniedApproval = await call(env, pairingUrl + "/approve", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: cookies, "content-type": "application/json" },
    body: { verification_phrase: pairing.verification_phrase }
  });
  assert.equal(deniedApproval.status, 403);
  assert.equal((await deniedApproval.json()).error.code, "csrf_rejected");

  const approval = await call(env, pairingUrl + "/approve", {
    method: "POST",
    headers: { origin: env.SITE_ORIGIN, cookie: cookies, "x-csrf-token": csrfToken, "content-type": "application/json" },
    body: { verification_phrase: pairing.verification_phrase }
  });
  assert.equal(approval.status, 200);
  assert.equal((await approval.json()).approved, true);

  const otherAccount = await call(env, pairingUrl, {
    headers: { authorization: "Bearer " + token("other-pair-owner") }
  });
  assert.equal(otherAccount.status, 404);

  const delivery = await call(env, `/v1/pairings/${pairing.pairing_id}/poll`, {
    method: "POST", headers: { "x-pairing-secret": pairing.polling_secret }
  });
  assert.equal(delivery.status, 200);
  const issued = await delivery.json();
  assert.equal(issued.status, "paired");
  assert.ok(issued.device_credential);
  const credentialHash = Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(issued.device_credential))).toString("hex");
  assert.equal(DB.raw("SELECT token_hash FROM device_credentials WHERE credential_id = ?", issued.credential_id)[0].token_hash, credentialHash);

  const replay = await call(env, `/v1/pairings/${pairing.pairing_id}/poll`, {
    method: "POST", headers: { "x-pairing-secret": pairing.polling_secret }
  });
  assert.equal(replay.status, 410);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM devices")[0].n, 1);

  const identityUrl = `/v1/devices/${issued.device_id}/identity`;
  const deviceIdentity = await call(env, identityUrl, {
    headers: { authorization: "Bearer " + issued.device_credential }
  });
  assert.equal(deviceIdentity.status, 200);
  assert.deepEqual(await deviceIdentity.json(), { device_id: issued.device_id, capabilities: ["inventory:write", "checks:write", "commands:read", "actions:write", "diagnostics:write"] });

  const rotation = await call(env, `/v1/devices/${issued.device_id}/credentials/rotate`, {
    method: "POST", headers: { authorization: "Bearer " + issued.device_credential }
  });
  assert.equal(rotation.status, 200);
  const rotated = await rotation.json();
  assert.ok(rotated.device_credential);
  const rotatedHash = Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rotated.device_credential))).toString("hex");
  assert.equal(DB.raw("SELECT token_hash FROM device_credentials WHERE device_id = ? AND revoked_at IS NULL", issued.device_id)[0].token_hash, rotatedHash);
  const oldIdentity = await call(env, identityUrl, { headers: { authorization: "Bearer " + issued.device_credential } });
  assert.equal(oldIdentity.status, 401);
  const rotatedIdentity = await call(env, identityUrl, { headers: { authorization: "Bearer " + rotated.device_credential } });
  assert.equal(rotatedIdentity.status, 200);

  const RealDate = globalThis.Date;
  const rotationInstant = "2026-10-24T17:00:00.000Z";
  globalThis.Date = class extends RealDate {
    constructor(...args) { super(...(args.length ? args : [rotationInstant])); }
    static now() { return RealDate.parse(rotationInstant); }
  };
  let concurrentRotations;
  try {
    concurrentRotations = await Promise.all([0, 1].map(() => call(env, `/v1/devices/${issued.device_id}/credentials/rotate`, {
      method: "POST", headers: { authorization: "Bearer " + rotated.device_credential }
    })));
  } finally {
    globalThis.Date = RealDate;
  }
  assert.deepEqual(concurrentRotations.map((response) => response.status).sort(), [200, 401]);
  const winner = await concurrentRotations.find((response) => response.status === 200).json();
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM device_credentials WHERE device_id = ? AND revoked_at IS NULL", issued.device_id)[0].n, 1);
  const replacedDuringRace = await call(env, identityUrl, { headers: { authorization: "Bearer " + rotated.device_credential } });
  assert.equal(replacedDuringRace.status, 401);
  const winningIdentity = await call(env, identityUrl, { headers: { authorization: "Bearer " + winner.device_credential } });
  assert.equal(winningIdentity.status, 200);
  const winnerHash = Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(winner.device_credential))).toString("hex");

  const otherDeviceAccount = await call(env, "/v1/me", { headers: { authorization: "Bearer " + token("other-device-owner") } });
  const otherOwner = await otherDeviceAccount.json();
  const otherDeviceId = "33333333-3333-4333-8333-333333333333";
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, created_at) VALUES (?, ?, ?, ?)",
    otherDeviceId, otherOwner.account_id, "Other account device", new Date().toISOString());
  const wrongDevice = await call(env, `/v1/devices/${otherDeviceId}/identity`, {
    headers: { authorization: "Bearer " + winner.device_credential }
  });
  assert.equal(wrongDevice.status, 401);

  DB.raw("UPDATE device_credentials SET expires_at = ? WHERE token_hash = ?", "2020-01-01T00:00:00.000Z", winnerHash);
  const expiredCredential = await call(env, identityUrl, { headers: { authorization: "Bearer " + winner.device_credential } });
  assert.equal(expiredCredential.status, 401);
  DB.raw("UPDATE device_credentials SET expires_at = NULL WHERE token_hash = ?", winnerHash);

  const revoke = await call(env, `/v1/devices/${issued.device_id}/revoke`, {
    method: "POST", headers: { authorization: "Bearer " + token("pair-owner"), "content-type": "application/json" }, body: {}
  });
  assert.equal(revoke.status, 200);
  const revokedCredential = await call(env, identityUrl, {
    headers: { authorization: "Bearer " + winner.device_credential }
  });
  assert.equal(revokedCredential.status, 401);
});

test("pairing rejects invalid device key proof without creating a pairing", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const response = await call(env, "/v1/pairings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: { device_name: "Forged Mac", public_key: { kty: "EC", crv: "P-256", x: "bad", y: "bad" }, client_nonce: "x".repeat(32), proof_signature: "AAAA" }
  });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, "invalid_pairing_proof");
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM pairings")[0].n, 0);
});

test("pairing streams body limits and rate-limits invalid proofs", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const oversized = await worker.fetch(new Request("https://api.local.test/v1/pairings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ padding: "x".repeat(5000) })
  }), env);
  assert.equal(oversized.status, 413);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM pairing_rate_limits")[0].n, 0);

  const invalidProof = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: { device_name: "Invalid proof", public_key: { kty: "EC", crv: "P-256", x: "bad", y: "bad" }, client_nonce: "x".repeat(32), proof_signature: "AAAA" }
  };
  for (let i = 0; i < 5; i++) assert.equal((await call(env, "/v1/pairings", invalidProof)).status, 401);
  const limited = await call(env, "/v1/pairings", invalidProof);
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error.code, "rate_limited");
  assert.equal(DB.raw("SELECT create_count FROM pairing_rate_limits")[0].create_count, 5);
});

test("pairing polling is rate-limited by source", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  for (let i = 0; i < 30; i++) {
    const response = await call(env, `/v1/pairings/${"A".repeat(40)}/poll`, {
      method: "POST", headers: { "x-pairing-secret": "synthetic-secret" }
    });
    assert.equal(response.status, 410);
  }
  const limited = await call(env, `/v1/pairings/${"A".repeat(40)}/poll`, {
    method: "POST", headers: { "x-pairing-secret": "synthetic-secret" }
  });
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error.code, "rate_limited");
  assert.equal(DB.raw("SELECT poll_count FROM pairing_rate_limits")[0].poll_count, 30);
});

test("pairing approval enforces the configured active-device limit", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const owner = await call(env, "/v1/me", { headers: { authorization: "Bearer " + token("device-limit-owner") } });
  const { account_id: accountId } = await owner.json();
  for (let i = 0; i < 10; i++) {
    const id = `10000000-0000-4000-8000-${String(i).padStart(12, "0")}`;
    DB.raw("INSERT INTO devices (device_id, account_id, display_name, created_at) VALUES (?, ?, ?, ?)",
      id, accountId, `Existing ${i}`, new Date().toISOString());
  }
  const { response: created } = await signedPairingRequest(env, "Additional Mac");
  assert.equal(created.status, 201);
  const pairing = await created.json();
  const approval = await call(env, `/v1/pairings/${pairing.pairing_id}/approve`, {
    method: "POST",
    headers: { authorization: "Bearer " + token("device-limit-owner"), "content-type": "application/json" },
    body: { verification_phrase: pairing.verification_phrase }
  });
  assert.equal(approval.status, 409);
  assert.equal((await approval.json()).error.code, "device_limit_reached");
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM devices WHERE account_id = ?", accountId)[0].n, 10);
});

test("pairing delivery rechecks the active-device limit after approval", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const bearer = "Bearer " + token("delivery-limit-owner");
  const owner = await call(env, "/v1/me", { headers: { authorization: bearer } });
  const { account_id: accountId } = await owner.json();
  const { response: created } = await signedPairingRequest(env, "Racing Mac");
  assert.equal(created.status, 201);
  const pairing = await created.json();
  const approval = await call(env, `/v1/pairings/${pairing.pairing_id}/approve`, {
    method: "POST", headers: { authorization: bearer, "content-type": "application/json" },
    body: { verification_phrase: pairing.verification_phrase }
  });
  assert.equal(approval.status, 200);
  for (let i = 0; i < 10; i++) {
    const id = `20000000-0000-4000-8000-${String(i).padStart(12, "0")}`;
    DB.raw("INSERT INTO devices (device_id, account_id, display_name, created_at) VALUES (?, ?, ?, ?)",
      id, accountId, `Concurrent ${i}`, new Date().toISOString());
  }
  const delivered = await call(env, `/v1/pairings/${pairing.pairing_id}/poll`, {
    method: "POST", headers: { "x-pairing-secret": pairing.polling_secret }
  });
  assert.equal(delivered.status, 409);
  assert.equal((await delivered.json()).error.code, "device_limit_reached");
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM devices WHERE account_id = ?", accountId)[0].n, 10);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM device_credentials WHERE account_id = ?", accountId)[0].n, 0);
  assert.equal(DB.raw("SELECT delivered_at FROM pairings WHERE pairing_id = ?", pairing.pairing_id)[0].delivered_at, null);
});

test("bearer identities are isolated and invalid OAuth clients are rejected", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const headersA = { authorization: "Bearer " + token("user-a") };
  const headersB = { authorization: "Bearer " + token("user-b") };
  const meA = await call(env, "/v1/me", { headers: headersA });
  const meB = await call(env, "/v1/me", { headers: headersB });
  const accountA = await meA.json(), accountB = await meB.json();
  assert.notEqual(accountA.account_id, accountB.account_id);

  const deviceA = "11111111-1111-4111-8111-111111111111";
  const deviceB = "22222222-2222-4222-8222-222222222222";
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, created_at) VALUES (?, ?, ?, ?)",
    deviceA, accountA.account_id, "A device", new Date().toISOString());
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, created_at) VALUES (?, ?, ?, ?)",
    deviceB, accountB.account_id, "B device", new Date().toISOString());

  const devicesA = await call(env, "/v1/devices", { headers: headersA });
  const rowsA = (await devicesA.json()).devices;
  assert.deepEqual(rowsA.map((row) => row.device_id), [deviceA]);

  const crossRevoke = await call(env, "/v1/devices/" + deviceB + "/revoke", {
    method: "POST", headers: headersA
  });
  assert.equal(crossRevoke.status, 404);
  assert.equal(DB.raw("SELECT revoked_at FROM devices WHERE device_id = ?", deviceB)[0].revoked_at, null);

  const badClient = await call(env, "/v1/me", {
    headers: { authorization: "Bearer " + token("intruder", { azp: "unapproved-client" }) }
  });
  assert.equal(badClient.status, 401);
});

test("signed first-party user tokens may omit gty while machine tokens stay rejected", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const userWithoutGrantClaim = await call(env, "/v1/me", {
    headers: { authorization: "Bearer " + token("user-no-gty", { gty: undefined }) }
  });
  assert.equal(userWithoutGrantClaim.status, 200);

  const invalidGrant = await call(env, "/v1/me", {
    headers: {
      authorization: "Bearer " + token("user-invalid-grant", { gty: "client-credentials" })
    }
  });
  assert.equal(invalidGrant.status, 401);

  const machineToken = await call(env, "/v1/me", {
    headers: {
      authorization: "Bearer " + token("local-first-party-client@clients", { gty: undefined })
    }
  });
  assert.equal(machineToken.status, 401);
});

test("confirmed account deletion removes data and blocks immediate recreation", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const bearer = "Bearer " + token("user-delete");
  const profile = await call(env, "/v1/me", { headers: { authorization: bearer } });
  const account = await profile.json();
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, created_at) VALUES (?, ?, ?, ?)",
    "33333333-3333-4333-8333-333333333333", account.account_id, "Delete me", new Date().toISOString());
  const deletion = await call(env, "/v1/me", {
    method: "DELETE",
    headers: { authorization: bearer, "content-type": "application/json" },
    body: { confirm_account_id: account.account_id }
  });
  assert.equal(deletion.status, 200);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM accounts")[0].n, 0);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM devices")[0].n, 0);
  const recreated = await call(env, "/v1/me", { headers: { authorization: bearer } });
  assert.equal(recreated.status, 403);
  assert.equal((await recreated.json()).error.code, "account_deleted");
});

test("scheduled cleanup purges expired and revoked records", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  const account = await call(env, "/v1/me", { headers: { authorization: "Bearer " + token("cleanup-user") } });
  const { account_id } = await account.json();
  const deviceId = "44444444-4444-4444-8444-444444444444";
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, created_at) VALUES (?, ?, ?, ?)",
    deviceId, account_id, "Cleanup", new Date().toISOString());
  DB.raw("INSERT INTO browser_sessions (session_id, account_id, token_hash, csrf_hash, scopes_json, created_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    "session-expired", account_id, "hash-session", "hash-csrf", "[]", "2026-01-01T00:00:00.000Z", "2026-01-01T04:00:00.000Z", null);
  DB.raw("INSERT INTO pairings (pairing_id, polling_secret_hash, device_name, public_key_jwk, public_key_fingerprint, server_nonce, verification_phrase, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    "expired-pairing", "hash-poll", "Old Mac", "{}", "fingerprint", "nonce", "amber birch cobalt dawn", "2026-01-01T00:00:00.000Z", "2026-01-01T00:10:00.000Z");
  DB.raw("INSERT INTO pairing_rate_limits (source_hash, window_start) VALUES (?, ?)", "old-rate-key", Date.now() - 2 * 60 * 60 * 1000);

  let cleanup;
  worker.scheduled({}, env, { waitUntil(promise) { cleanup = promise; } });
  await cleanup;
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM browser_sessions")[0].n, 0);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM pairings")[0].n, 0);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM pairing_rate_limits")[0].n, 0);
});
