import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext, Script } from "node:vm";

const html = readFileSync(new URL("../dev-auth-test.html", import.meta.url), "utf8");
const script = html.match(/<script>([\\s\\S]*?)<\\/script>/)?.[1];
assert.ok(script, "loopback Auth0 harness has an inline script");

test("loopback Auth0 harness JavaScript parses", () => {
  assert.doesNotThrow(() => new Script(script));
});

test("Auth0 harness blocks interactive controls off loopback", () => {
  const elements = new Map();
  for (const id of ["status", "guard", "login", "restore", "me", "logout"]) {
    elements.set(id, { disabled: false, hidden: true, textContent: "" });
  }
  const document = { getElementById: (id) => elements.get(id) };
  runInNewContext(script, { document, location: { hostname: "example.com" } });

  assert.equal(elements.get("guard").hidden, false);
  for (const id of ["login", "restore", "me", "logout"]) {
    assert.equal(elements.get(id).disabled, true);
  }
  assert.match(elements.get("status").textContent, /must be served from a loopback address/);
});

test("Auth0 harness restricts its API target to loopback", () => {
  assert.match(script, /function apiBase\\(\\)[\\s\\S]*?new URL\\(value\\)[\\s\\S]*?\[\\"localhost\\", \\"127\\.0\\.0\\.1\\", \\"::1\\"\]\\.includes\\(url\\.hostname\\)/);
  assert.match(script, /Worker URL must use localhost or 127\\.0\\.0\\.1/);
});

test("Auth0 harness uses read-only PKCE and never persists tokens", () => {
  assert.match(script, /code_challenge_method:\\s*\\"S256\\"/);
  assert.match(script, /scope:\\s*\\"openid profile email read:library\\"/);
  assert.match(script, /returnedState !== expectedState/);
  assert.match(script, /let accessToken = null/);
  assert.doesNotMatch(script, /client_secret|localStorage/i);
});
