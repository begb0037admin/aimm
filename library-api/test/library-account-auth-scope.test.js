import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { webcrypto } from "node:crypto";

class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    this.style = {};
    this.classList = { toggle() {}, contains() { return false; } };
  }
  append(...nodes) { this.children.push(...nodes); }
  prepend(...nodes) { this.children.unshift(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  addEventListener(name, callback) { this.listeners.set(name, callback); }
  querySelector() { return null; }
  async click() { return this.listeners.get("click")?.(); }
}

function findText(root, value) {
  if (root.textContent === value) return root;
  for (const child of root.children) {
    const found = findText(child, value);
    if (found) return found;
  }
  return null;
}

async function loginScope(search) {
  const library = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: () => library,
    createElement: (tag) => new Element(tag),
    addEventListener: (_name, callback) => { document.readyHandler = callback; }
  };
  let authorizationURL;
  const location = {
    origin: "https://aimixmasters.com", pathname: "/", search,
    hash: "", href: `https://aimixmasters.com/${search}`,
    assign: (url) => { authorizationURL = url; }
  };
  const sandbox = {
    document, window: {}, TOOL_DEFS: [], location,
    localStorage: { getItem: () => null, setItem() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    history: { replaceState() {} }, URL, URLSearchParams, crypto: webcrypto,
    TextEncoder, btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    fetch: async () => { throw new Error("Unexpected network request in auth scope test"); }
  };
  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  await findText(library, "Sign in").click();
  return new URL(authorizationURL).searchParams.get("scope");
}

test("ordinary account sign-in requests read-only scope", async () => {
  assert.equal(await loginScope(""), "openid profile read:library");
  assert.equal(await loginScope("?pairing=bad"), "openid profile read:library");
});

test("device-management scope is requested only for a valid pairing approval", async () => {
  const pairingID = "A".repeat(40);
  assert.equal(
    await loginScope(`?pairing=${pairingID}`),
    "openid profile read:library manage:devices"
  );
});

test("account preview script URL resolves to the tracked module", () => {
  const repoRoot = new URL("../../", import.meta.url);
  const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  assert.match(html, /<script src="\/library-api\/library-account\.js" defer><\/script>/);
  assert.doesNotMatch(html, /<script src="\/library-account\.js" defer><\/script>/);
  assert.ok(readFileSync(new URL("../library-account.js", import.meta.url), "utf8").length > 0);
});
