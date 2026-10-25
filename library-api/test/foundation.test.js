import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { createHash, generateKeyPairSync, sign as signJwt } from "node:crypto";
import { readFileSync } from "node:fs";
import worker, { checkFreshnessBucket } from "../src/index.js";

test("status freshness uses the two-hour cache window and preserves failed refresh as stale", () => {
  const now = Date.parse("2026-10-24T20:00:00.000Z");
  assert.equal(checkFreshnessBucket({ result: "update", checkedAt: "2026-10-24T18:00:00.000Z", now }), "update");
  assert.equal(checkFreshnessBucket({ result: "update", checkedAt: "2026-10-24T17:59:59.000Z", now }), "stale");
  assert.equal(checkFreshnessBucket({ result: "error", checkedAt: "2026-10-24T19:59:00.000Z", lastGoodAt: "2026-10-24T19:00:00.000Z", now }), "stale");
  assert.equal(checkFreshnessBucket({ result: "error", checkedAt: "2026-10-24T19:59:00.000Z", now }), "error");
  assert.equal(checkFreshnessBucket({ result: null, checkedAt: null, now }), "unchecked");
});

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
    "../migrations/0008_safe_actions.sql",
    "../migrations/0009_check_comparison_reason.sql",
    "../migrations/0010_action_retries.sql",
    "../migrations/0011_vendor_site_action.sql",
    "../migrations/0012_launch_hub_action.sql",
    "../migrations/0013_webauthn_credentials.sql",
    "../migrations/0014_webauthn_authentication_challenges.sql",
    "../migrations/0015_action_preview_authorization_binding.sql",
    "../migrations/0016_encrypted_action_previews.sql",
    "../migrations/0017_owner_preview_capabilities.sql",
    "../migrations/0018_move_to_unused_action.sql",
    "../migrations/0019_snooze_reason.sql",
    "../migrations/0020_version_bound_marks.sql",
    "../migrations/0021_restore_actions.sql"
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
  OIDC_ALLOWED_CLIENT_IDS: "local-first-party-client",
  ACTION_PREVIEW_ENCRYPTION_KEY: Buffer.from("0123456789abcdef0123456789abcdef").toString("base64url")
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

test("WebAuthn registration options are CSRF protected and challenges are session-bound and one-use", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  async function browserSession(subject) {
    const exchange = await call(env, "/v1/session", {
      method: "POST", headers: { origin: env.SITE_ORIGIN, authorization: "Bearer " + token(subject) }
    });
    assert.equal(exchange.status, 200);
    return {
      cookie: exchange.headers.getSetCookie().map((cookie) => cookie.split(";")[0]).join("; "),
      csrf: (await exchange.json()).csrf_token
    };
  }
  const first = await browserSession("webauthn-registration-owner");
  const second = await browserSession("webauthn-registration-owner");
  const denied = await call(env, "/v1/webauthn/registration/options", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie }, body: {}
  });
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "csrf_rejected");

  const optionsResponse = await call(env, "/v1/webauthn/registration/options", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie, "x-csrf-token": first.csrf }, body: {}
  });
  assert.equal(optionsResponse.status, 201);
  const issued = await optionsResponse.json();
  assert.match(issued.challenge_id, /^[0-9a-f-]{36}$/i);
  assert.equal(issued.options.authenticatorSelection.userVerification, "required");
  assert.equal(issued.options.rp.id, "aimixmasters.com");
  const stored = DB.raw("SELECT account_id, session_id, purpose, challenge, created_at, expires_at, consumed_at FROM webauthn_challenges WHERE challenge_id = ?", issued.challenge_id)[0];
  assert.ok(stored);
  assert.equal(stored.purpose, "registration");
  assert.equal(stored.challenge, issued.options.challenge);
  assert.equal(Date.parse(stored.expires_at) - Date.parse(stored.created_at) <= 5 * 60_000, true);

  const foreignSessionAttempt = await call(env, "/v1/webauthn/registration/verify", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: second.cookie, "x-csrf-token": second.csrf, "content-type": "application/json" },
    body: { challenge_id: issued.challenge_id, credential: {} }
  });
  assert.equal(foreignSessionAttempt.status, 409);
  assert.equal((await foreignSessionAttempt.json()).error.code, "challenge_expired");
  assert.equal(DB.raw("SELECT consumed_at FROM webauthn_challenges WHERE challenge_id = ?", issued.challenge_id)[0].consumed_at, null);

  const invalidCredential = await call(env, "/v1/webauthn/registration/verify", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie, "x-csrf-token": first.csrf, "content-type": "application/json" },
    body: { challenge_id: issued.challenge_id, credential: { id: "invalid", rawId: "invalid", type: "public-key", response: {} } }
  });
  assert.equal(invalidCredential.status, 400);
  assert.equal((await invalidCredential.json()).error.code, "passkey_rejected");
  const replay = await call(env, "/v1/webauthn/registration/verify", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie, "x-csrf-token": first.csrf, "content-type": "application/json" },
    body: { challenge_id: issued.challenge_id, credential: { id: "invalid", rawId: "invalid", type: "public-key", response: {} } }
  });
  assert.equal(replay.status, 409);
  assert.equal((await replay.json()).error.code, "challenge_expired");
});

test("WebAuthn assertion challenges require a registered account passkey and are session-bound", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  async function browserSession() {
    const exchange = await call(env, "/v1/session", {
      method: "POST", headers: { origin: env.SITE_ORIGIN, authorization: "Bearer " + token("webauthn-assertion-owner") }
    });
    const payload = await exchange.json();
    return { cookie: exchange.headers.getSetCookie().map((cookie) => cookie.split(";")[0]).join("; "), csrf: payload.csrf_token, accountID: payload.account_id };
  }
  const first = await browserSession();
  const second = await browserSession();
  const missing = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie, "x-csrf-token": first.csrf, "content-type": "application/json" }, body: {}
  });
  assert.equal(missing.status, 409);
  assert.equal((await missing.json()).error.code, "passkey_not_registered");
  DB.raw("INSERT INTO webauthn_credentials (credential_id, account_id, public_key, sign_count, transports_json, created_at) VALUES (?, ?, ?, 0, '[]', ?)",
    "fixture-credential-id", first.accountID, Buffer.from("fixture-public-key").toString("base64url"), new Date().toISOString());
  const options = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie, "x-csrf-token": first.csrf, "content-type": "application/json" }, body: {}
  });
  assert.equal(options.status, 201);
  const issued = await options.json();
  assert.equal(issued.options.userVerification, "required");
  assert.equal(issued.options.allowCredentials.length, 1);
  const foreign = await call(env, "/v1/webauthn/authentication/verify", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: second.cookie, "x-csrf-token": second.csrf, "content-type": "application/json" },
    body: { challenge_id: issued.challenge_id, credential: { id: "fixture-credential-id" } }
  });
  assert.equal(foreign.status, 409);
  assert.equal((await foreign.json()).error.code, "challenge_expired");
  const invalid = await call(env, "/v1/webauthn/authentication/verify", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie, "x-csrf-token": first.csrf, "content-type": "application/json" },
    body: { challenge_id: issued.challenge_id, credential: { id: "fixture-credential-id", rawId: "invalid", type: "public-key", response: {} } }
  });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, "passkey_rejected");
  const replay = await call(env, "/v1/webauthn/authentication/verify", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: first.cookie, "x-csrf-token": first.csrf, "content-type": "application/json" },
    body: { challenge_id: issued.challenge_id, credential: { id: "fixture-credential-id", rawId: "invalid", type: "public-key", response: {} } }
  });
  assert.equal(replay.status, 409);
  assert.equal((await replay.json()).error.code, "challenge_expired");
});

test("action-confirm WebAuthn challenges bind to one unlocked, current preview digest", async (t) => {
  const DB = d1(); t.after(() => DB.close());
  const env = envFor(DB);
  async function browserSession(subject) {
    const exchange = await call(env, "/v1/session", {
      method: "POST", headers: { origin: env.SITE_ORIGIN, authorization: "Bearer " + token(subject) }
    });
    const payload = await exchange.json();
    return {
      cookie: exchange.headers.getSetCookie().map((cookie) => cookie.split(";")[0]).join("; "),
      csrf: payload.csrf_token,
      accountID: payload.account_id
    };
  }
  const owner = await browserSession("preview-owner");
  const otherOwner = await browserSession("preview-other-owner");
  DB.raw("INSERT INTO webauthn_credentials (credential_id, account_id, public_key, sign_count, transports_json, created_at) VALUES (?, ?, ?, 0, '[]', ?)",
    "preview-owner-credential", owner.accountID, Buffer.from("fixture-public-key").toString("base64url"), new Date().toISOString());

  const deviceID = crypto.randomUUID();
  const generationID = crypto.randomUUID();
  const operationID = crypto.randomUUID();
  const nonce = "preview-operation-nonce";
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
  const previewExpiresAt = new Date(Date.now() + 4 * 60_000).toISOString();
  const exactPreview = {
    schema_version: 1, account_id: owner.accountID, device_id: deviceID, operation_id: operationID,
    nonce, kind: "reveal", generation_id: generationID, created_at: now, expires_at: previewExpiresAt,
    items: [{ record_id: "fixture-record", name: "Fixture Synth", format: "AU", version: "1.0",
      source_display_path: "/Library/Audio/Plug-Ins/Components/Fixture.component", destination_display_path: null,
      symlink: false, permission: "allowed" }]
  };
  const canonicalPreview = (value) => Array.isArray(value) ? `[${value.map(canonicalPreview).join(",")}]` :
    value && typeof value === "object" ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalPreview(value[key])}`).join(",")}}` : JSON.stringify(value);
  const previewText = canonicalPreview(exactPreview);
  const digest = createHash("sha256").update(previewText).digest("hex");
  DB.raw("INSERT INTO devices (device_id, account_id, display_name, capabilities_json, created_at) VALUES (?, ?, 'Preview Mac', '[]', ?)",
    deviceID, owner.accountID, now);
  DB.raw("INSERT INTO scan_generations (device_id, generation_id, started_at, completed_at, root_count, record_count, chunk_count, schema_version, state, created_at) VALUES (?, ?, ?, ?, 1, 1, 1, 1, 'complete', ?)",
    deviceID, generationID, now, now, now);
  DB.raw("INSERT INTO operations (operation_id, account_id, device_id, generation_id, kind, nonce, idempotency_key, request_hash, state, created_at, expires_at, claimed_at) VALUES (?, ?, ?, ?, 'reveal', ?, ?, ?, 'claimed', ?, ?, ?)",
    operationID, owner.accountID, deviceID, generationID, nonce, "preview-confirm-key", "preview-request-hash", now, expiresAt, now);

  const headers = { origin: env.SITE_ORIGIN, cookie: owner.cookie, "x-csrf-token": owner.csrf, "content-type": "application/json" };
  const invalidDigest = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers, body: { purpose: "action_confirm", operation_id: operationID, preview_digest: "not-a-digest" }
  });
  assert.equal(invalidDigest.status, 400);
  assert.equal((await invalidDigest.json()).error.code, "invalid_request");

  const lockedPreview = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers, body: { purpose: "action_confirm", operation_id: operationID, preview_digest: digest }
  });
  assert.equal(lockedPreview.status, 409);
  assert.equal((await lockedPreview.json()).error.code, "preview_unavailable");
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM webauthn_auth_challenges")[0].n, 0,
    "a passkey challenge must not be issued until the exact preview has been unlocked");

  DB.raw("UPDATE operations SET preview_digest = ?, preview_expires_at = ? WHERE operation_id = ?",
    digest, previewExpiresAt, operationID);
  const encryptionKey = await crypto.subtle.importKey("raw", Buffer.from(env.ACTION_PREVIEW_ENCRYPTION_KEY, "base64url"), { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const additionalData = new TextEncoder().encode(`${owner.accountID}\n${operationID}\n${digest}`);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData }, encryptionKey, new TextEncoder().encode(previewText));
  const encode = (bytes) => Buffer.from(bytes).toString("base64url");
  DB.raw("INSERT INTO action_preview_payloads (operation_id, account_id, device_id, preview_digest, iv, ciphertext, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    operationID, owner.accountID, deviceID, digest, encode(iv), encode(new Uint8Array(ciphertext)), now, previewExpiresAt);
  const unlockOptions = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers, body: { purpose: "action_preview_unlock", operation_id: operationID, preview_digest: digest }
  });
  assert.equal(unlockOptions.status, 201);
  const unlockChallenge = DB.raw("SELECT purpose, operation_id, preview_digest, preview_expires_at FROM webauthn_auth_challenges ORDER BY created_at DESC LIMIT 1")[0];
  assert.equal(unlockChallenge.purpose, "action_preview_unlock");
  assert.equal(unlockChallenge.operation_id, operationID);
  assert.equal(unlockChallenge.preview_digest, digest);
  const wrongDigest = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers, body: { purpose: "action_confirm", operation_id: operationID, preview_digest: "b".repeat(64) }
  });
  assert.equal(wrongDigest.status, 409);
  assert.equal((await wrongDigest.json()).error.code, "preview_unavailable");

  const otherAccount = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: otherOwner.cookie, "x-csrf-token": otherOwner.csrf, "content-type": "application/json" },
    body: { purpose: "action_confirm", operation_id: operationID, preview_digest: digest }
  });
  assert.equal(otherAccount.status, 409);
  assert.equal((await otherAccount.json()).error.code, "preview_unavailable");

  const notViewed = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers, body: { purpose: "action_confirm", operation_id: operationID, preview_digest: digest }
  });
  assert.equal(notViewed.status, 409);
  assert.equal((await notViewed.json()).error.code, "preview_unavailable");

  const ownerSession2 = await browserSession("preview-owner");
  const ownerSessionToken = /__Host-aimm-library-session=([^;]+)/.exec(ownerSession2.cookie)[1];
  const ownerSessionID = DB.raw("SELECT session_id FROM browser_sessions WHERE token_hash = ?", createHash("sha256").update(ownerSessionToken).digest("hex"))[0].session_id;
  const capability = encode(crypto.getRandomValues(new Uint8Array(32)));
  const capabilityHash = createHash("sha256").update(capability).digest("hex");
  DB.raw("UPDATE operations SET preview_unlocked_at = ?, owner_preview_capability_hash = ?, owner_preview_capability_expires_at = ?, owner_preview_capability_session_id = ? WHERE operation_id = ?",
    now, capabilityHash, new Date(Date.now() + 2 * 60_000).toISOString(), ownerSessionID, operationID);
  const capabilityHeaders = { origin: env.SITE_ORIGIN, cookie: ownerSession2.cookie, "x-action-preview-capability": capability };
  const wrongSession = await call(env, `/v1/actions/${operationID}/owner-preview`, {
    headers: { origin: env.SITE_ORIGIN, cookie: owner.cookie, "x-action-preview-capability": capability }
  });
  assert.equal(wrongSession.status, 403);
  const wrongAccount = await call(env, `/v1/actions/${operationID}/owner-preview`, {
    headers: { origin: env.SITE_ORIGIN, cookie: otherOwner.cookie, "x-action-preview-capability": capability }
  });
  assert.equal(wrongAccount.status, 403);
  const exactResponse = await call(env, `/v1/actions/${operationID}/owner-preview`, { headers: capabilityHeaders });
  assert.equal(exactResponse.status, 200, JSON.stringify(await exactResponse.clone().json()));
  assert.equal((await exactResponse.json()).preview.items[0].source_display_path, exactPreview.items[0].source_display_path);
  assert.equal(DB.raw("SELECT owner_preview_capability_hash, owner_preview_viewed_at FROM operations WHERE operation_id = ?", operationID)[0].owner_preview_capability_hash, null);
  assert.ok(DB.raw("SELECT owner_preview_viewed_at FROM operations WHERE operation_id = ?", operationID)[0].owner_preview_viewed_at);
  const capabilityReplay = await call(env, `/v1/actions/${operationID}/owner-preview`, { headers: capabilityHeaders });
  assert.equal(capabilityReplay.status, 403);

  const issued = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: ownerSession2.cookie, "x-csrf-token": ownerSession2.csrf, "content-type": "application/json" }, body: { purpose: "action_confirm", operation_id: operationID, preview_digest: digest }
  });
  assert.equal(issued.status, 201);
  const issuedBody = await issued.json();
  const bound = DB.raw("SELECT account_id, session_id, purpose, operation_id, preview_digest, preview_expires_at, created_at, expires_at FROM webauthn_auth_challenges WHERE challenge_id = ?", issuedBody.challenge_id)[0];
  assert.equal(bound.account_id, owner.accountID);
  assert.equal(bound.purpose, "action_confirm");
  assert.equal(bound.operation_id, operationID);
  assert.equal(bound.preview_digest, digest);
  assert.equal(bound.preview_expires_at, previewExpiresAt);
  assert.equal(Date.parse(bound.expires_at) - Date.parse(bound.created_at) <= 5 * 60_000, true);

  DB.raw("UPDATE operations SET preview_expires_at = ? WHERE operation_id = ?", new Date(Date.now() - 1000).toISOString(), operationID);
  const expired = await call(env, "/v1/webauthn/authentication/options", {
    method: "POST", headers, body: { purpose: "action_confirm", operation_id: operationID, preview_digest: digest }
  });
  assert.equal(expired.status, 409);
  assert.equal((await expired.json()).error.code, "preview_unavailable");
});

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
    { id: crypto.randomUUID(), name: "Synth", bundleIdentifier: "com.example.synth", version: "1.2", format: "AU", metadataSource: "infoPlist" },
    { id: crypto.randomUUID(), name: "Utility", bundleIdentifier: "com.example.utility", version: "2.0", format: "VST3", metadataSource: "infoPlist" }
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
    body: { completed_at: completedAt, record_count: 2, chunk_count: 1 }
  });
  assert.equal(finalized.status, 200);
  const library = await call(env, "/v1/library", { headers: ownerHeaders });
  assert.equal(library.status, 200);
  const visible = await library.json();
  assert.equal(visible.generation.generation_id, generationId);
  assert.equal(visible.records.length, 2);
  assert.equal("localPath" in visible.records[0], false);
  const firstPageResponse = await call(env, "/v1/library?limit=1", { headers: ownerHeaders });
  assert.equal(firstPageResponse.status, 200);
  const firstPage = await firstPageResponse.json();
  assert.equal(firstPage.records.length, 1);
  assert.ok(firstPage.next_cursor);
  const secondPageResponse = await call(env, `/v1/library?limit=1&cursor=${encodeURIComponent(firstPage.next_cursor)}`, { headers: ownerHeaders });
  assert.equal(secondPageResponse.status, 200);
  const secondPage = await secondPageResponse.json();
  assert.equal(secondPage.records.length, 1);
  assert.equal(secondPage.records[0].name, "Utility");
  assert.equal(secondPage.next_cursor, null);
  assert.equal((await call(env, "/v1/library?limit=251", { headers: ownerHeaders })).status, 400);
  assert.equal((await call(env, "/v1/library?cursor=broken", { headers: ownerHeaders })).status, 400);

  const checkedAt = new Date().toISOString();
  const recordId = chunkBody.records[0].id;
  const checkURL = `/v1/devices/${deviceId}/checks/${generationId}`;
  const updateCheck = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{
      record_id: recordId, installed_version: "1.2", latest_version: "1.3",
      result: "update", source_type: "public_vendor", checked_at: checkedAt,
      last_good_at: checkedAt, paid_upgrade: false, route: "vendor_site",
      comparison_reason: "numeric_version_newer"
    }] }
  });
  assert.equal(updateCheck.status, 201);
  const checks = await call(env, "/v1/checks", { headers: ownerHeaders });
  assert.equal((await checks.json()).observations[0].result, "update");
  const statusBeforeMarks = await call(env, "/v1/status-summary", { headers: ownerHeaders });
  const beforeSummary = await statusBeforeMarks.json();
  assert.equal(beforeSummary.rule_version, 2);
  assert.equal(beforeSummary.counts.update, 1);
  assert.equal(beforeSummary.records[0].status, "update");
  assert.equal(beforeSummary.counts.free_update, 1);
  assert.equal(beforeSummary.counts.actionable_update, 1);
  assert.equal(beforeSummary.records[0].comparison_reason, "numeric_version_newer");
  const unobservedVersionMark = await call(env, "/v1/preferences/marks", {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { scope: "product", target_key: "com.example.synth", marked_latest_version: "9.9", expected_revision: 0 }
  });
  assert.equal(unobservedVersionMark.status, 409, "a mark cannot claim a version that was not observed");
  const versionMark = await call(env, "/v1/preferences/marks", {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { scope: "product", target_key: "com.example.synth", marked_latest_version: "1.3", expected_revision: 0 }
  });
  assert.equal(versionMark.status, 200);
  assert.equal((await versionMark.json()).marked_latest_version, "1.3");
  const markedVersionSummary = await (await call(env, "/v1/status-summary", { headers: ownerHeaders })).json();
  assert.equal(markedVersionSummary.records[0].raw_status, "update", "marking a version must not rewrite the vendor observation");
  assert.equal(markedVersionSummary.raw_counts.update, 1);
  assert.equal(markedVersionSummary.counts.marked_update, 1);
  assert.equal(markedVersionSummary.counts.actionable_update, 0);

  const newerVersionAt = new Date(Date.now() + 20_000).toISOString();
  const newerVersionCheck = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{ record_id: recordId, installed_version: "1.2", latest_version: "1.4", result: "update",
      source_type: "public_vendor", checked_at: newerVersionAt, last_good_at: newerVersionAt, paid_upgrade: false,
      route: "vendor_site", comparison_reason: "numeric_version_newer" }] }
  });
  assert.equal(newerVersionCheck.status, 201);
  const expiredVersionSummary = await (await call(env, "/v1/status-summary", { headers: ownerHeaders })).json();
  assert.equal(expiredVersionSummary.records[0].latest_version, "1.4");
  assert.equal(expiredVersionSummary.records[0].marked_up_to_date, false, "a newer vendor version expires the old mark");
  assert.equal(expiredVersionSummary.records[0].marked_latest_version, "1.3");
  assert.equal(expiredVersionSummary.counts.actionable_update, 1);

  const clearVersionMark = await call(env, "/v1/preferences/marks", {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { scope: "product", target_key: "com.example.synth", marked_latest_version: null, expected_revision: 1 }
  });
  assert.equal(clearVersionMark.status, 200);
  const restoredAt = new Date(Date.now() + 40_000).toISOString();
  const restoredCheck = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{ record_id: recordId, installed_version: "1.2", latest_version: "1.3", result: "update",
      source_type: "public_vendor", checked_at: restoredAt, last_good_at: restoredAt, paid_upgrade: false,
      route: "vendor_site", comparison_reason: "numeric_version_newer" }] }
  });
  assert.equal(restoredCheck.status, 201);
  const failedRefreshAt = new Date(Date.parse(restoredAt) + 1_000).toISOString();
  const failedRefresh = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{
      record_id: recordId, installed_version: "1.2", latest_version: null,
      result: "error", source_type: "public_vendor", checked_at: failedRefreshAt,
      last_good_at: checkedAt, error_code: "source_unavailable", paid_upgrade: false
    }] }
  });
  assert.equal(failedRefresh.status, 201);
  const afterFailedRefresh = await (await call(env, "/v1/status-summary", { headers: ownerHeaders })).json();
  assert.equal(afterFailedRefresh.rule_version, 2);
  assert.equal(afterFailedRefresh.raw_counts.error, 1);
  assert.equal(afterFailedRefresh.counts.stale, 1);
  assert.equal(afterFailedRefresh.records[0].raw_status, "error");
  assert.equal(afterFailedRefresh.records[0].status, "stale");
  assert.equal(afterFailedRefresh.records[0].latest_version, "1.3");
  assert.equal(afterFailedRefresh.records[0].last_good_latest_version, "1.3");
  assert.equal(afterFailedRefresh.records[0].error_code, "source_unavailable");
  assert.equal(afterFailedRefresh.records[0].source_type, "public_vendor");
  const unverifiedRoute = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{
      record_id: recordId, installed_version: "1.2", latest_version: "1.3",
      result: "update", source_type: "public_vendor", checked_at: checkedAt,
      route: "direct_verified"
    }] }
  });
  assert.equal(unverifiedRoute.status, 400);

  const manualCheckAt = new Date(Date.parse(restoredAt) + 2_000).toISOString();
  const manualFallback = await call(env, checkURL, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { observations: [{
      record_id: recordId, installed_version: "1.2", latest_version: null,
      result: "manual", source_type: "manual", checked_at: manualCheckAt,
      route: "manual", comparison_reason: "manual_check_required"
    }] }
  });
  assert.equal(manualFallback.status, 201);
  const manualSummary = await (await call(env, "/v1/status-summary", { headers: ownerHeaders })).json();
  assert.equal(manualSummary.raw_counts.manual, 1);
  assert.equal(manualSummary.records[0].status, "manual");
  assert.equal(manualSummary.records[0].comparison_reason, "manual_check_required");

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
      tags: ["keys"], snooze_until: new Date(Date.now() + 86_400_000).toISOString(),
      snooze_reason: "Review after the session", expected_revision: 2 }
  });
  assert.equal(mark.status, 200);
  assert.equal((await mark.json()).snooze_reason, "Review after the session");
  const invalidSnoozeReason = await call(env, "/v1/preferences/marks", {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { scope: "product", target_key: "com.example.synth", expected_revision: 3,
      snooze_reason: "reason without an expiry" }
  });
  assert.equal(invalidSnoozeReason.status, 400);
  const markedSummary = await (await call(env, "/v1/status-summary", { headers: ownerHeaders })).json();
  assert.equal(markedSummary.counts.pinned, 1);
  assert.equal(markedSummary.counts.snoozed, 1);
  assert.equal(markedSummary.counts.actionable_update, 0, "snoozed updates are not actionable");
  assert.equal(markedSummary.records[0].snooze_reason, "Review after the session");
  const hiddenMark = await call(env, "/v1/preferences/marks", {
    method: "PUT", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { scope: "product", target_key: "com.example.synth", favorite: true, pinned: true,
      hidden: true, tags: ["keys"], snooze_until: null, expected_revision: 3 }
  });
  assert.equal(hiddenMark.status, 200);
  assert.equal((await hiddenMark.json()).snooze_reason, null);
  const hiddenSummary = await (await call(env, "/v1/status-summary", { headers: ownerHeaders })).json();
  assert.equal(hiddenSummary.counts.hidden, 1);
  assert.equal(hiddenSummary.counts.actionable_update, 0, "hidden updates are not actionable");
  const preferences = await (await call(env, "/v1/preferences", { headers: ownerHeaders })).json();
  assert.equal(preferences.settings[0].value, true);
  assert.equal(preferences.marks[0].tags[0], "keys");
  assert.equal(preferences.marks[0].snooze_reason, null, "a cleared snooze must clear its reason");

  const actionInput = {
    device_id: deviceId, kind: "reveal", record_ids: [recordId],
    idempotency_key: "reveal-test-record-0001"
  };
  const operationsBeforePreview = DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n;
  const actionPreviewResponse = await call(env,
    `/v1/actions/preview?device_id=${deviceId}&record_id=${recordId}&kind=reveal`,
    { headers: ownerHeaders });
  assert.equal(actionPreviewResponse.status, 200);
  const actionPreview = await actionPreviewResponse.json();
  assert.equal(actionPreview.preview.requires_mac_confirmation, true);
  assert.equal(actionPreview.preview.changes_local_files, false);
  assert.equal(actionPreview.item.record_id, recordId);
  assert.equal("localPath" in actionPreview, false);
  assert.equal("path" in actionPreview, false);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n, operationsBeforePreview,
    "preview must not queue or execute an operation");
  const moveActionPreviewResponse = await call(env,
    `/v1/actions/preview?device_id=${deviceId}&record_id=${recordId}&kind=move_to_unused`,
    { headers: ownerHeaders });
  assert.equal(moveActionPreviewResponse.status, 200);
  const moveActionPreview = await moveActionPreviewResponse.json();
  assert.equal(moveActionPreview.preview.requires_owner_passkey, true);
  assert.equal(moveActionPreview.preview.changes_local_files, true);
  assert.match(moveActionPreview.preview.summary, /exact source and destination/);
  const vendorRecordId = crypto.randomUUID();
  DB.raw("INSERT INTO published_inventory_records (device_id, generation_id, record_id, name, bundle_identifier, version, format, metadata_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    deviceId, generationId, vendorRecordId, "Voxengo BMS", "com.voxengo.bms", "2.6", "AU", "infoPlist");
  const vendorPreviewResponse = await call(env,
    `/v1/actions/preview?device_id=${deviceId}&record_id=${vendorRecordId}&kind=open_vendor_site`,
    { headers: ownerHeaders });
  assert.equal(vendorPreviewResponse.status, 200);
  assert.equal((await vendorPreviewResponse.json()).preview.summary,
    "Open Voxengo's fixed official downloads page after confirmation on the Mac. No download is started.");
  const uHeRecordId = crypto.randomUUID();
  DB.raw("INSERT INTO published_inventory_records (device_id, generation_id, record_id, name, bundle_identifier, version, format, metadata_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    deviceId, generationId, uHeRecordId, "Diva", "com.u-he.Diva", "1.4.7", "AU", "infoPlist");
  const uHePreviewResponse = await call(env,
    `/v1/actions/preview?device_id=${deviceId}&record_id=${uHeRecordId}&kind=open_vendor_site`,
    { headers: ownerHeaders });
  assert.equal(uHePreviewResponse.status, 200);
  assert.equal((await uHePreviewResponse.json()).preview.summary,
    "Open u-he's fixed official downloads page after confirmation on the Mac. No download is started.");
  const valhallaRecordId = crypto.randomUUID();
  DB.raw("INSERT INTO published_inventory_records (device_id, generation_id, record_id, name, bundle_identifier, version, format, metadata_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    deviceId, generationId, valhallaRecordId, "ValhallaVintageVerb", "com.valhalladsp.ValhallaVintageVerb", "4.0.4", "AU", "infoPlist");
  const valhallaPreviewResponse = await call(env,
    `/v1/actions/preview?device_id=${deviceId}&record_id=${valhallaRecordId}&kind=open_vendor_site`,
    { headers: ownerHeaders });
  assert.equal(valhallaPreviewResponse.status, 200);
  assert.equal((await valhallaPreviewResponse.json()).preview.summary,
    "Open Valhalla DSP's fixed official downloads page after confirmation on the Mac. No download is started.");
  const unsupportedRecordId = crypto.randomUUID();
  DB.raw("INSERT INTO published_inventory_records (device_id, generation_id, record_id, name, bundle_identifier, version, format, metadata_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    deviceId, generationId, unsupportedRecordId, "Other Synth", "com.example.other", "1.0", "VST3", "infoPlist");
  const unsupportedVendorAction = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "open_vendor_site", record_ids: [unsupportedRecordId], idempotency_key: "unsupported-vendor-site-01" }
  });
  assert.equal(unsupportedVendorAction.status, 409);
  assert.equal((await unsupportedVendorAction.json()).error.code, "action_not_supported");
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n, operationsBeforePreview,
    "an unsupported vendor-site route must not create an operation");
  const otherOwnerPreview = await call(env,
    `/v1/actions/preview?device_id=${deviceId}&record_id=${recordId}&kind=reveal`,
    { headers: { authorization: "Bearer " + token("unrelated-owner") } });
  assert.equal(otherOwnerPreview.status, 404, "preview must remain scoped to the signed-in account");

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
  const vendorSiteAction = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "open_vendor_site", record_ids: [vendorRecordId], idempotency_key: "open-vendor-site-test-01" }
  });
  assert.equal(vendorSiteAction.status, 201, JSON.stringify(await vendorSiteAction.clone().json()));
  const vendorSiteOperation = await vendorSiteAction.json();
  const uHeSiteAction = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "open_vendor_site", record_ids: [uHeRecordId], idempotency_key: "open-uhe-site-test-01" }
  });
  assert.equal(uHeSiteAction.status, 201, JSON.stringify(await uHeSiteAction.clone().json()));
  const uHeSiteOperation = await uHeSiteAction.json();
  const valhallaSiteAction = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "open_vendor_site", record_ids: [valhallaRecordId], idempotency_key: "open-valhalla-site-test-01" }
  });
  assert.equal(valhallaSiteAction.status, 201, JSON.stringify(await valhallaSiteAction.clone().json()));
  const valhallaSiteOperation = await valhallaSiteAction.json();
  const launchHubAction = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "launch_hub", idempotency_key: "launch-hub-test-0001" }
  });
  assert.equal(launchHubAction.status, 201, JSON.stringify(await launchHubAction.clone().json()));
  const launchHubOperation = await launchHubAction.json();
  const moveActionResponse = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "move_to_unused", idempotency_key: "move-to-unused-test-0001" }
  });
  assert.equal(moveActionResponse.status, 201, JSON.stringify(await moveActionResponse.clone().json()));
  const moveAction = await moveActionResponse.json();
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
  assert.equal(commands.commands.length, 6);
  assert.deepEqual(commands.commands[0].record_ids, [recordId]);
  const vendorSiteCommand = commands.commands.find((command) => command.operation_id === vendorSiteOperation.operation_id);
  assert.equal(vendorSiteCommand.kind, "open_vendor_site");
  const uHeSiteCommand = commands.commands.find((command) => command.operation_id === uHeSiteOperation.operation_id);
  assert.equal(uHeSiteCommand.kind, "open_vendor_site");
  assert.deepEqual(uHeSiteCommand.record_ids, [uHeRecordId]);
  const valhallaSiteCommand = commands.commands.find((command) => command.operation_id === valhallaSiteOperation.operation_id);
  assert.equal(valhallaSiteCommand.kind, "open_vendor_site");
  assert.deepEqual(valhallaSiteCommand.record_ids, [valhallaRecordId]);
  const launchHubCommand = commands.commands.find((command) => command.operation_id === launchHubOperation.operation_id);
  assert.equal(launchHubCommand.kind, "launch_hub");
  assert.deepEqual(launchHubCommand.record_ids, [recordId]);
  const moveActionCommand = commands.commands.find((command) => command.operation_id === moveAction.operation_id);
  assert.equal(moveActionCommand.kind, "move_to_unused");
  assert.deepEqual(moveActionCommand.record_ids, [recordId]);
  assert.equal("localPath" in commands.commands[0], false);
  const claim = await call(env, `/v1/devices/${deviceId}/actions/${operation.operation_id}/claim`, {
    method: "POST", headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(claim.status, 200);

  const previewCreatedAt = new Date().toISOString();
  const exactPreview = {
    schema_version: 1,
    account_id: accountId,
    device_id: deviceId,
    operation_id: operation.operation_id,
    nonce: commands.commands[0].nonce,
    kind: operation.kind,
    generation_id: generationId,
    created_at: previewCreatedAt,
    expires_at: new Date(Date.now() + 9 * 60_000).toISOString(),
    items: [{ record_id: recordId, name: "Synth", format: "AU", version: "1.2",
      source_display_path: "/Library/Audio/Plug-Ins/Components/Synth.component", destination_display_path: null,
      symlink: false, permission: "allowed" }]
  };
  const canonical = (value) => Array.isArray(value) ? `[${value.map(canonical).join(",")}]` :
    value && typeof value === "object" ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}` : JSON.stringify(value);
  const previewCanonical = canonical(exactPreview);
  const previewSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey, new TextEncoder().encode(previewCanonical)
  )).toString("base64url");
  const preparedPreviewPath = `/v1/devices/${deviceId}/actions/${operation.operation_id}/prepared-preview`;
  const submitPreview = (preview = exactPreview, signatureValue = previewSignature) => call(env, preparedPreviewPath, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { preview, signature: signatureValue }
  });
  const acceptedPreview = await submitPreview();
  assert.equal(acceptedPreview.status, 201, JSON.stringify(await acceptedPreview.clone().json()));
  const acceptedPreviewBody = await acceptedPreview.json();
  assert.equal(acceptedPreviewBody.state, "preview_ready");
  assert.equal(acceptedPreviewBody.preview_digest, createHash("sha256").update(previewCanonical).digest("hex"));
  const refreshedCommands = await call(env, `/v1/devices/${deviceId}/commands`, {
    headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(refreshedCommands.status, 200);
  const refreshedAction = (await refreshedCommands.json()).commands.find((item) => item.operation_id === operation.operation_id);
  assert.equal(refreshedAction.preview_digest, acceptedPreviewBody.preview_digest);
  assert.equal(refreshedAction.preview_expires_at, exactPreview.expires_at);
  assert.equal(refreshedAction.owner_confirmed_at, null);
  const encryptedPreview = DB.raw("SELECT preview_digest, iv, ciphertext, expires_at FROM action_preview_payloads WHERE operation_id = ?", operation.operation_id)[0];
  assert.equal(encryptedPreview.preview_digest, acceptedPreviewBody.preview_digest);
  assert.equal(encryptedPreview.expires_at, exactPreview.expires_at);
  assert.doesNotMatch(encryptedPreview.ciphertext, /Synth\.component|Library\/Audio/);
  const previewReplay = await submitPreview();
  assert.equal(previewReplay.status, 200);
  assert.equal((await previewReplay.json()).replay, true);
  const changedPreview = { ...exactPreview, items: [{ ...exactPreview.items[0], source_display_path: "/tmp/changed.component" }] };
  const conflictingPreview = await submitPreview(changedPreview, previewSignature);
  assert.equal(conflictingPreview.status, 409);
  assert.equal((await conflictingPreview.json()).error.code, "preview_conflict");

  const moveClaim = await call(env, `/v1/devices/${deviceId}/actions/${moveAction.operation_id}/claim`, {
    method: "POST", headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(moveClaim.status, 200);
  const invalidMovePreview = {
    ...exactPreview, operation_id: moveAction.operation_id, nonce: moveActionCommand.nonce,
    kind: "move_to_unused", items: [{ ...exactPreview.items[0], destination_display_path: null }]
  };
  const invalidMoveCanonical = canonical(invalidMovePreview);
  const invalidMoveSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey, new TextEncoder().encode(invalidMoveCanonical)
  )).toString("base64url");
  const invalidMoveResponse = await call(env,
    `/v1/devices/${deviceId}/actions/${moveAction.operation_id}/prepared-preview`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
      body: { preview: invalidMovePreview, signature: invalidMoveSignature }
    });
  assert.equal(invalidMoveResponse.status, 400, "a move preview without a selected destination and content digest must be rejected");
  const validMovePreview = {
    ...invalidMovePreview,
    items: [{ ...invalidMovePreview.items[0],
      destination_display_path: "/Users/test/Library/Audio/Unused/Synth.component",
      tree_digest: createHash("sha256").update("fixture-content").digest("hex") }]
  };
  const validMoveCanonical = canonical(validMovePreview);
  const validMoveSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey, new TextEncoder().encode(validMoveCanonical)
  )).toString("base64url");
  const validMoveResponse = await call(env,
    `/v1/devices/${deviceId}/actions/${moveAction.operation_id}/prepared-preview`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
      body: { preview: validMovePreview, signature: validMoveSignature }
    });
  assert.equal(validMoveResponse.status, 201, JSON.stringify(await validMoveResponse.clone().json()));
  const validMoveBody = await validMoveResponse.json();
  const prematureMoveReceipt = {
    operation_id: moveAction.operation_id, device_id: deviceId, generation_id: generationId,
    nonce: moveActionCommand.nonce, completed_at: new Date().toISOString(), state: "failed",
    preview_digest: validMoveBody.preview_digest,
    items: [{ record_id: recordId, status: "failed", evidence: { failure_code: "move_failed" } }]
  };
  const prematureMoveSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey, new TextEncoder().encode(canonical(prematureMoveReceipt))
  )).toString("base64url");
  const prematureMoveReceiptResponse = await call(env,
    `/v1/devices/${deviceId}/actions/${moveAction.operation_id}/receipt`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
      body: { receipt: prematureMoveReceipt, signature: prematureMoveSignature }
    });
  assert.equal(prematureMoveReceiptResponse.status, 409,
    "a move result must not be recorded before the owner confirms its exact preview with a passkey");

  // This local-only fixture places the operation past the owner-confirmation
  // gate so the receipt validator's success path can be exercised without
  // claiming that a real WebAuthn ceremony occurred.
  const ownerConfirmedAt = new Date().toISOString();
  DB.raw("UPDATE operations SET owner_confirmed_at = ? WHERE operation_id = ?", ownerConfirmedAt, moveAction.operation_id);
  const movedGenerationID = crypto.randomUUID();
  const movedGenerationAt = new Date().toISOString();
  DB.raw("INSERT INTO scan_generations (device_id, generation_id, started_at, completed_at, root_count, record_count, chunk_count, schema_version, state, created_at) VALUES (?, ?, ?, ?, 1, 0, 0, 1, 'complete', ?)",
    deviceId, movedGenerationID, movedGenerationAt, movedGenerationAt, movedGenerationAt);
  DB.raw("UPDATE device_inventory_heads SET generation_id = ?, updated_at = ? WHERE device_id = ?",
    movedGenerationID, movedGenerationAt, deviceId);
  const successfulMoveReceipt = {
    operation_id: moveAction.operation_id, device_id: deviceId, generation_id: generationId,
    nonce: moveActionCommand.nonce, completed_at: new Date().toISOString(), state: "completed",
    preview_digest: validMoveBody.preview_digest,
    items: [{ record_id: recordId, status: "completed",
      evidence: { tree_digest: validMovePreview.items[0].tree_digest, destination_verified: true, source_removed: true },
      rescan_generation_id: movedGenerationID }]
  };
  const successfulMoveSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey,
    new TextEncoder().encode(canonical(successfulMoveReceipt))
  )).toString("base64url");
  const successfulMoveResponse = await call(env,
    `/v1/devices/${deviceId}/actions/${moveAction.operation_id}/receipt`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
      body: { receipt: successfulMoveReceipt, signature: successfulMoveSignature }
    });
  assert.equal(successfulMoveResponse.status, 201, JSON.stringify(await successfulMoveResponse.clone().json()));
  assert.equal((await successfulMoveResponse.json()).state, "completed");
  const successfulMoveOwnerResult = await call(env, `/v1/actions/${moveAction.operation_id}`, { headers: ownerHeaders });
  assert.equal((await successfulMoveOwnerResult.json()).state, "completed");
  const restorableMovesResponse = await call(env, `/v1/actions/restorable?device_id=${deviceId}`, { headers: ownerHeaders });
  assert.equal(restorableMovesResponse.status, 200, JSON.stringify(await restorableMovesResponse.clone().json()));
  const restorableMoves = await restorableMovesResponse.json();
  assert.equal(restorableMoves.moves.length, 1);
  assert.equal(restorableMoves.moves[0].operation_id, moveAction.operation_id);
  assert.equal(restorableMoves.moves[0].record_id, recordId);
  assert.equal(JSON.stringify(restorableMoves).includes("/private/"), false, "restorable history must not expose local paths");
  const restorePreviewResponse = await call(env,
    `/v1/actions/preview?device_id=${deviceId}&record_id=${recordId}&kind=restore&parent_move_operation_id=${moveAction.operation_id}`,
    { headers: ownerHeaders });
  assert.equal(restorePreviewResponse.status, 200, JSON.stringify(await restorePreviewResponse.clone().json()));
  const restoreActionPreview = await restorePreviewResponse.json();
  assert.equal(restoreActionPreview.preview.requires_owner_passkey, true);
  assert.equal(restoreActionPreview.preview.parent_move_operation_id, moveAction.operation_id);
  const restoreInput = { device_id: deviceId, kind: "restore", record_ids: [recordId],
    parent_move_operation_id: moveAction.operation_id, idempotency_key: "restore-move-test-0001" };
  const restoreCreatedResponse = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" }, body: restoreInput
  });
  assert.equal(restoreCreatedResponse.status, 201, JSON.stringify(await restoreCreatedResponse.clone().json()));
  const restoreAction = await restoreCreatedResponse.json();
  assert.equal(restoreAction.kind, "restore");
  assert.equal(restoreAction.parent_move_operation_id, moveAction.operation_id);
  const noLongerRestorable = await call(env, `/v1/actions/restorable?device_id=${deviceId}`, { headers: ownerHeaders });
  assert.equal((await noLongerRestorable.json()).moves.length, 0, "a queued restore must not be offered a second time");
  const duplicateRestore = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...restoreInput, idempotency_key: "restore-move-test-0002" }
  });
  assert.equal(duplicateRestore.status, 409, "a completed move can have only one restore operation");
  const restoreCommandResponse = await call(env, `/v1/devices/${deviceId}/commands`, {
    headers: { authorization: `Bearer ${credential}` }
  });
  const restoreCommand = (await restoreCommandResponse.json()).commands.find((command) => command.operation_id === restoreAction.operation_id);
  assert.equal(restoreCommand.kind, "restore");
  assert.equal(restoreCommand.parent_move_operation_id, moveAction.operation_id);
  assert.deepEqual(restoreCommand.record_ids, [recordId]);
  const restoreClaim = await call(env, `/v1/devices/${deviceId}/actions/${restoreAction.operation_id}/claim`, {
    method: "POST", headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(restoreClaim.status, 200);
  const restorePreview = {
    schema_version: 1, account_id: accountId, device_id: deviceId,
    operation_id: restoreAction.operation_id, nonce: restoreCommand.nonce,
    kind: "restore", generation_id: movedGenerationID,
    parent_move_operation_id: moveAction.operation_id,
    created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 9 * 60_000).toISOString(),
    items: [{ record_id: recordId, name: "Synth", format: "AU", version: "1.2",
      source_display_path: "/Users/test/Library/Audio/Unused/Synth.component",
      destination_display_path: "/Library/Audio/Plug-Ins/Components/Synth.component",
      tree_digest: validMovePreview.items[0].tree_digest, symlink: false, permission: "allowed" }]
  };
  const restorePreviewSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey, new TextEncoder().encode(canonical(restorePreview))
  )).toString("base64url");
  const restorePreparedResponse = await call(env,
    `/v1/devices/${deviceId}/actions/${restoreAction.operation_id}/prepared-preview`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
      body: { preview: restorePreview, signature: restorePreviewSignature }
    });
  assert.equal(restorePreparedResponse.status, 201, JSON.stringify(await restorePreparedResponse.clone().json()));
  const restorePrepared = await restorePreparedResponse.json();
  DB.raw("UPDATE operations SET owner_confirmed_at = ? WHERE operation_id = ?", new Date().toISOString(), restoreAction.operation_id);
  const restoredGenerationID = crypto.randomUUID();
  const restoreGenerationAt = new Date().toISOString();
  DB.raw("INSERT INTO scan_generations (device_id, generation_id, started_at, completed_at, root_count, record_count, chunk_count, schema_version, state, created_at) VALUES (?, ?, ?, ?, 1, 1, 1, 1, 'complete', ?)",
    deviceId, restoredGenerationID, restoreGenerationAt, restoreGenerationAt, restoreGenerationAt);
  DB.raw("INSERT INTO published_inventory_records (device_id, generation_id, record_id, name, bundle_identifier, version, format, metadata_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    deviceId, restoredGenerationID, recordId, "Synth", "com.example.synth", "1.2", "AU", "infoPlist");
  DB.raw("UPDATE device_inventory_heads SET generation_id = ?, updated_at = ? WHERE device_id = ?",
    restoredGenerationID, restoreGenerationAt, deviceId);
  const restoredReceipt = {
    operation_id: restoreAction.operation_id, device_id: deviceId, generation_id: movedGenerationID,
    nonce: restoreCommand.nonce, completed_at: new Date().toISOString(), state: "completed",
    preview_digest: restorePrepared.preview_digest, parent_move_operation_id: moveAction.operation_id,
    items: [{ record_id: recordId, status: "completed",
      evidence: { tree_digest: validMovePreview.items[0].tree_digest, destination_verified: true, source_removed: true },
      rescan_generation_id: restoredGenerationID }]
  };
  const restoredReceiptSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey, new TextEncoder().encode(canonical(restoredReceipt))
  )).toString("base64url");
  const restoredReceiptResponse = await call(env, `/v1/devices/${deviceId}/actions/${restoreAction.operation_id}/receipt`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { receipt: restoredReceipt, signature: restoredReceiptSignature }
  });
  assert.equal(restoredReceiptResponse.status, 201, JSON.stringify(await restoredReceiptResponse.clone().json()));
  const restoreOwnerResult = await call(env, `/v1/actions/${restoreAction.operation_id}`, { headers: ownerHeaders });
  const restoreOwnerBody = await restoreOwnerResult.json();
  assert.equal(restoreOwnerBody.kind, "restore");
  assert.equal(restoreOwnerBody.parent_move_operation_id, moveAction.operation_id);
  assert.equal(restoreOwnerBody.item_count, 1);
  assert.equal(restoreOwnerBody.receipt.parent_move_operation_id, moveAction.operation_id);
  // Later cases share this fixture generation and must retain their current
  // inventory head after the isolated success-path assertion.
  DB.raw("UPDATE device_inventory_heads SET generation_id = ?, updated_at = ? WHERE device_id = ?",
    generationId, new Date().toISOString(), deviceId);

  const signedReceipt = {
    operation_id: operation.operation_id, device_id: deviceId,
    generation_id: generationId, nonce: commands.commands[0].nonce,
    completed_at: new Date().toISOString(), state: "completed",
    items: [{ record_id: recordId, status: "completed" }]
  };
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

  const vendorSiteClaim = await call(env, `/v1/devices/${deviceId}/actions/${vendorSiteOperation.operation_id}/claim`, {
    method: "POST", headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(vendorSiteClaim.status, 200);
  const vendorSiteReceipt = {
    operation_id: vendorSiteOperation.operation_id, device_id: deviceId,
    generation_id: generationId, nonce: vendorSiteCommand.nonce,
    completed_at: new Date().toISOString(), state: "completed",
    items: [{ record_id: vendorRecordId, status: "completed" }]
  };
  const vendorSiteSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey,
    new TextEncoder().encode(canonical(vendorSiteReceipt))
  )).toString("base64url");
  const vendorSiteReceiptResponse = await call(env, `/v1/devices/${deviceId}/actions/${vendorSiteOperation.operation_id}/receipt`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { receipt: vendorSiteReceipt, signature: vendorSiteSignature }
  });
  assert.equal(vendorSiteReceiptResponse.status, 201);
  const vendorSiteOwnerResult = await call(env, `/v1/actions/${vendorSiteOperation.operation_id}`, { headers: ownerHeaders });
  assert.equal((await vendorSiteOwnerResult.json()).state, "completed");

  const failedActionResponse = await call(env, "/v1/actions", {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { ...actionInput, kind: "open_vendor_site", record_ids: [vendorRecordId], idempotency_key: "vendor-site-failure-test-001" }
  });
  assert.equal(failedActionResponse.status, 201);
  const failedAction = await failedActionResponse.json();
  const failedCommand = await call(env, `/v1/devices/${deviceId}/commands`, {
    headers: { authorization: `Bearer ${credential}` }
  });
  const failedCommandBody = await failedCommand.json();
  const failedQueuedCommand = failedCommandBody.commands.find((candidate) => candidate.operation_id === failedAction.operation_id);
  assert.ok(failedQueuedCommand, "the failed-action fixture should reach the paired device queue");
  const failClaim = await call(env, `/v1/devices/${deviceId}/actions/${failedAction.operation_id}/claim`, {
    method: "POST", headers: { authorization: `Bearer ${credential}` }
  });
  assert.equal(failClaim.status, 200);
  const failedReceipt = {
    operation_id: failedAction.operation_id, device_id: deviceId,
    generation_id: generationId, nonce: failedQueuedCommand.nonce,
    completed_at: new Date().toISOString(), state: "failed",
    items: [{ record_id: vendorRecordId, status: "failed" }]
  };
  const failedSignature = Buffer.from(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, receiptKeys.privateKey,
    new TextEncoder().encode(canonical(failedReceipt))
  )).toString("base64url");
  const failedReceiptResponse = await call(env, `/v1/devices/${deviceId}/actions/${failedAction.operation_id}/receipt`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${credential}` },
    body: { receipt: failedReceipt, signature: failedSignature }
  });
  assert.equal(failedReceiptResponse.status, 201);

  const retryPath = `/v1/actions/${failedAction.operation_id}/retry`;
  const retryBody = { item_ids: [vendorRecordId], idempotency_key: "retry-failed-vendor-site-01" };
  const operationsBeforeRetryCsrf = DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n;
  const retryWithoutCsrf = await call(env, retryPath, {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: browserSession, "content-type": "application/json" },
    body: retryBody
  });
  assert.equal(retryWithoutCsrf.status, 403);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM operations")[0].n, operationsBeforeRetryCsrf);
  const retryResponse = await call(env, retryPath, {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" }, body: retryBody
  });
  assert.equal(retryResponse.status, 201);
  const retry = await retryResponse.json();
  assert.equal(retry.parent_operation_id, failedAction.operation_id);
  assert.equal(retry.retry_record_id, vendorRecordId);
  assert.equal(retry.kind, "open_vendor_site");
  assert.equal(retry.generation_id, generationId);
  const retryRow = DB.raw("SELECT retry_parent_operation_id, retry_record_id FROM operations WHERE operation_id = ?", retry.operation_id)[0];
  assert.equal(retryRow.retry_parent_operation_id, failedAction.operation_id);
  assert.equal(retryRow.retry_record_id, vendorRecordId);
  const retryReplay = await call(env, retryPath, {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" }, body: retryBody
  });
  assert.equal(retryReplay.status, 200);
  const retryReplayBody = await retryReplay.json();
  assert.equal(retryReplayBody.operation_id, retry.operation_id);
  assert.equal(retryReplayBody.replay, true);
  const cancelPath = `/v1/actions/${retry.operation_id}/cancel`;
  const cancelWithoutCsrf = await call(env, cancelPath, {
    method: "POST", headers: { origin: env.SITE_ORIGIN, cookie: browserSession, "content-type": "application/json" }, body: {}
  });
  assert.equal(cancelWithoutCsrf.status, 403);
  assert.equal(DB.raw("SELECT state FROM operations WHERE operation_id = ?", retry.operation_id)[0].state, "requested");
  const cancelResponse = await call(env, cancelPath, { method: "POST", headers: ownerHeaders });
  assert.equal(cancelResponse.status, 200);
  assert.equal((await cancelResponse.json()).state, "cancelled");
  const cancelReplay = await call(env, cancelPath, { method: "POST", headers: ownerHeaders });
  assert.equal(cancelReplay.status, 200);
  assert.equal((await cancelReplay.json()).replay, true);
  const queuedAfterCancel = await call(env, `/v1/devices/${deviceId}/commands`, {
    headers: { authorization: `Bearer ${credential}` }
  });
  assert.ok(!(await queuedAfterCancel.json()).commands.some((command) => command.operation_id === retry.operation_id));
  const crossAccountCancel = await call(env, cancelPath, {
    method: "POST", headers: { authorization: `Bearer ${token("other-cancel-owner")}` }
  });
  assert.equal(crossAccountCancel.status, 404);
  const cancelCompleted = await call(env, `/v1/actions/${operation.operation_id}/cancel`, {
    method: "POST", headers: ownerHeaders
  });
  assert.equal(cancelCompleted.status, 409);

  const retryCompletedAction = await call(env, `/v1/actions/${operation.operation_id}/retry`, {
    method: "POST", headers: { ...ownerHeaders, "content-type": "application/json" },
    body: { item_ids: [recordId], idempotency_key: "retry-completed-action-0001" }
  });
  assert.equal(retryCompletedAction.status, 409);
  assert.equal((await retryCompletedAction.json()).error.code, "action_not_retryable");
  const crossAccountRetry = await call(env, retryPath, {
    method: "POST", headers: { authorization: "Bearer " + token("other-retry-owner") , "content-type": "application/json" }, body: retryBody
  });
  assert.equal(crossAccountRetry.status, 404);

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
    body: { completed_at: completedAt, record_count: 2, chunk_count: 1, partial: true }
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
  DB.raw("INSERT INTO browser_sessions (session_id, account_id, token_hash, csrf_hash, scopes_json, created_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    "session-live", account_id, "hash-session-live", "hash-csrf-live", "[]", new Date().toISOString(), new Date(Date.now() + 60 * 60_000).toISOString(), null);
  DB.raw("INSERT INTO webauthn_challenges (challenge_id, account_id, session_id, purpose, challenge, created_at, expires_at) VALUES (?, ?, ?, 'registration', ?, ?, ?)",
    "expired-webauthn-challenge", account_id, "session-live", "expired-challenge", "2026-01-01T00:00:00.000Z", "2026-01-01T00:05:00.000Z");
  DB.raw("INSERT INTO webauthn_auth_challenges (challenge_id, account_id, session_id, challenge, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
    "expired-webauthn-auth-challenge", account_id, "session-live", "expired-auth-challenge", "2026-01-01T00:00:00.000Z", "2026-01-01T00:05:00.000Z");
  DB.raw("INSERT INTO pairings (pairing_id, polling_secret_hash, device_name, public_key_jwk, public_key_fingerprint, server_nonce, verification_phrase, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    "expired-pairing", "hash-poll", "Old Mac", "{}", "fingerprint", "nonce", "amber birch cobalt dawn", "2026-01-01T00:00:00.000Z", "2026-01-01T00:10:00.000Z");
  DB.raw("INSERT INTO pairing_rate_limits (source_hash, window_start) VALUES (?, ?)", "old-rate-key", Date.now() - 2 * 60 * 60 * 1000);

  let cleanup;
  worker.scheduled({}, env, { waitUntil(promise) { cleanup = promise; } });
  await cleanup;
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM browser_sessions")[0].n, 1);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM webauthn_challenges")[0].n, 0);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM webauthn_auth_challenges")[0].n, 0);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM pairings")[0].n, 0);
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM pairing_rate_limits")[0].n, 0);
});
