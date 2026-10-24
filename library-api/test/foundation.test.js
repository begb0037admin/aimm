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
    "../migrations/0003_browser_sessions.sql"
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
