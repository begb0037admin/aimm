import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { generateKeyPairSync, sign as signJwt } from "node:crypto";
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
  for (const file of [
    "../migrations/0001_foundation.sql",
    "../migrations/0002_enforce_ownership_and_retention.sql",
    "../migrations/0003_browser_sessions.sql",
    "../migrations/0004_device_pairing.sql"
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
      sqlite.exec("BEGIN");
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        sqlite.exec("COMMIT");
        return results;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
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

  let cleanup;
  worker.scheduled({}, env, { waitUntil(promise) { cleanup = promise; } });
  await cleanup;
  assert.equal(DB.raw("SELECT COUNT(*) AS n FROM browser_sessions")[0].n, 0);
});
