import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext, Script } from "node:vm";
import { webcrypto } from "node:crypto";

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


test("loopback login builds a read-only Authorization Code with PKCE request", async () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
  const elements = new Map();
  const ids = ["status", "guard", "login", "restore", "me", "logout", "config", "domain", "client", "audience", "api"];
  for (const id of ids) {
    elements.set(id, {
      disabled: false, hidden: true, textContent: "",
      value: id === "domain" ? "dev-example.us.auth0.com" :
        id === "client" ? "public-spa-client" :
        id === "audience" ? "https://aimm-library-api-dev" :
        id === "api" ? "http://localhost:8787" : "",
      addEventListener(name, callback) { this["on" + name] = callback; },
      reportValidity() { return true; }
    });
  }
  const location = {
    hostname: "localhost", origin: "http://localhost:4173",
    pathname: "/dev-auth-test.html", search: "",
    assigned: "", assign(url) { this.assigned = url; }
  };
  runInNewContext(script, {
    document: { getElementById: (id) => elements.get(id) },
    location, history: { replaceState() {} }, sessionStorage: storage,
    URL, URLSearchParams, crypto: webcrypto, TextEncoder,
    btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    fetch: async () => { throw new Error("Unexpected request before login redirect"); }
  });

  await elements.get("login").onclick();
  const authorization = new URL(location.assigned);
  const params = authorization.searchParams;
  assert.equal(authorization.origin, "https://dev-example.us.auth0.com");
  assert.equal(params.get("redirect_uri"), "http://localhost:4173/dev-auth-test.html");
  assert.equal(params.get("scope"), "openid profile email read:library");
  assert.equal(params.get("code_challenge_method"), "S256");
  assert.equal(params.has("client_secret"), false);
  assert.equal(params.get("state"), values.get("aimm.auth0.pkce.state"));

  const verifier = values.get("aimm.auth0.pkce.verifier");
  const digest = await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = Buffer.from(digest).toString("base64url");
  assert.equal(params.get("code_challenge"), challenge);
});

test("Auth0 harness uses read-only PKCE and never persists tokens", () => {
  assert.ok(script.includes('code_challenge_method: "S256"'));
  assert.ok(script.includes('scope: "openid profile email read:library"'));
  assert.ok(script.includes("returnedState !== expectedState"));
  assert.ok(script.includes("let accessToken = null"));
  assert.equal(script.includes("client_secret"), false);
  assert.equal(script.includes("localStorage"), false);
});
