import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext, Script } from "node:vm";

const html = readFileSync(new URL("../dev-auth-test.html", import.meta.url), "utf8");
const scriptStart = html.indexOf("<script>");
const scriptEnd = html.indexOf("</script>", scriptStart);
assert.ok(scriptStart >= 0 && scriptEnd > scriptStart, "loopback Auth0 harness has an inline script");
const script = html.slice(scriptStart + "<script>".length, scriptEnd);

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
  assert.ok(script.includes('if (!["localhost", "127.0.0.1", "::1"].includes(url.hostname))'));
  assert.ok(script.includes("Worker URL must use localhost or 127.0.0.1."));
});

test("Auth0 harness uses read-only PKCE and never persists tokens", () => {
  assert.ok(script.includes('code_challenge_method: "S256"'));
  assert.ok(script.includes('scope: "openid profile email read:library"'));
  assert.ok(script.includes("returnedState !== expectedState"));
  assert.ok(script.includes("let accessToken = null"));
  assert.equal(script.includes("client_secret"), false);
  assert.equal(script.includes("localStorage"), false);
});
