import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext, Script } from "node:vm";
import { webcrypto } from "node:crypto";

const html = readFileSync(new URL("../pair-remote-test.html", import.meta.url), "utf8");
const scriptStart = html.indexOf("<script>");
const scriptEnd = html.indexOf("</script>", scriptStart);
assert.ok(scriptStart >= 0 && scriptEnd > scriptStart, "pairing test has an inline script");
const script = html.slice(scriptStart + "<script>".length, scriptEnd);

function makeHarness(location) {
  const elements = new Map();
  for (const id of ["result", "login", "pair", "other", "isolation", "revoke"]) {
    elements.set(id, {
      disabled: false,
      textContent: "",
      onclick: null
    });
  }
  const storageValues = new Map();
  const sessionStorage = {
    getItem: (key) => storageValues.get(key) ?? null,
    setItem: (key, value) => storageValues.set(key, value),
    removeItem: (key) => storageValues.delete(key)
  };
  runInNewContext(script, {
    document: { getElementById: (id) => elements.get(id) },
    location,
    history: { replaceState() {} },
    sessionStorage,
    URL,
    URLSearchParams,
    crypto: webcrypto,
    TextEncoder,
    btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    fetch: async () => { throw new Error("Unexpected API request in login redirect test"); },
    window: { addEventListener() {}, open() {} }
  });
  return { elements, storageValues };
}

test("pairing test JavaScript parses", () => {
  assert.doesNotThrow(() => new Script(script));
});

test("pairing test disables every control off loopback", () => {
  const { elements } = makeHarness({ hostname: "example.com", protocol: "https:",
    origin: "https://example.com", pathname: "/pair-remote-test.html", search: "", assign() {} });
  for (const id of ["login", "pair", "other", "isolation", "revoke"]) {
    assert.equal(elements.get(id).disabled, true);
  }
  assert.match(elements.get("result").textContent, /served over HTTP from localhost or 127\.0\.0\.1/);
});

test("pairing test is pinned to the disposable local Worker, never the remote proxy", () => {
  assert.ok(script.includes('const api = "http://127.0.0.1:8787"'));
  assert.ok(script.includes("const redirectUri = location.origin + location.pathname"));
  assert.equal(script.includes("127.0.0.1:4174"), false);
  assert.equal(script.includes("client_secret"), false);
  assert.equal(script.includes("localStorage"), false);
});

test("Auth0 login uses the local callback, scoped PKCE, and no client secret", async () => {
  const location = {
    hostname: "127.0.0.1", protocol: "http:", origin: "http://127.0.0.1:4173",
    pathname: "/pair-remote-test.html", search: "", assigned: "",
    assign(url) { this.assigned = url; }
  };
  const { elements, storageValues } = makeHarness(location);
  await elements.get("login").onclick();
  const authorization = new URL(location.assigned);
  const params = authorization.searchParams;
  assert.equal(authorization.origin, "https://dev-cxmqjc40zltqlx7l.us.auth0.com");
  assert.equal(params.get("redirect_uri"), "http://127.0.0.1:4173/pair-remote-test.html");
  assert.equal(params.get("scope"), "openid profile email read:library manage:devices");
  assert.equal(params.get("code_challenge_method"), "S256");
  assert.equal(params.has("client_secret"), false);
  assert.equal(params.get("state"), storageValues.get("pair-test-state"));
  assert.equal(storageValues.has("pair-test-verifier"), true);
});
