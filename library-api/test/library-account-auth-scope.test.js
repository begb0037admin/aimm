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
  insertBefore(node, reference) {
    const index = reference ? this.children.indexOf(reference) : -1;
    if (index < 0) this.children.push(node);
    else this.children.splice(index, 0, node);
    return node;
  }
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

async function loginScope(search, origin = "https://aimixmasters.com") {
  const library = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: () => library,
    createElement: (tag) => new Element(tag),
    addEventListener: (_name, callback) => { document.readyHandler = callback; }
  };
  let authorizationURL;
  const location = {
    origin, pathname: "/", search,
    hash: "", href: `${origin}/${search}`,
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
  const authorization = new URL(authorizationURL);
  return { scope: authorization.searchParams.get("scope"), redirectUri: authorization.searchParams.get("redirect_uri") };
}

test("ordinary account sign-in requests read-only scope", async () => {
  assert.equal((await loginScope("")).scope, "openid profile read:library");
  assert.equal((await loginScope("?pairing=bad")).scope, "openid profile read:library");
});

test("device-management scope is requested only for a valid pairing approval", async () => {
  const pairingID = "A".repeat(40);
  assert.equal(
    (await loginScope(`?pairing=${pairingID}`)).scope,
    "openid profile read:library manage:devices"
  );
});


test("preview sign-in uses the exact preview callback and keeps read-only scope", async () => {
  const origin = "https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev";
  const result = await loginScope("", origin);
  assert.equal(result.redirectUri, `${origin}/`);
  assert.equal(result.scope, "openid profile read:library");
});

test("account preview script URL resolves to the tracked module", () => {
  const repoRoot = new URL("../../", import.meta.url);
  const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  assert.match(html, /<script src="\/library-api\/library-account\.js" defer><\/script>/);
  assert.doesNotMatch(html, /<script src="\/library-account\.js" defer><\/script>/);
  assert.doesNotMatch(html, /id="settingsCosts"/, "the obsolete provider billing panel must stay removed");
  assert.doesNotMatch(html, /id="(?:elTopup|anTopup|elUpdate|anUpdate)"/, "removed provider billing controls must not return");
  assert.match(html, /id="settingsSafety"/, "session safety settings should remain available");
  assert.match(html, /id="elBackupAgentId"/);
  assert.match(html, /Preferred ElevenLabs Agent — Fallback/);
  assert.match(html, /Backup ElevenLabs Agent — Default/);
  assert.match(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), /Open Library account settings/);
  assert.match(html, /Deepgram — separate route/);
  const settingsMarkup = html.slice(html.indexOf('id="settings">'), html.indexOf('<!-- MARKETING panel'));
  assert.doesNotMatch(settingsMarkup, /EL rate: \$0\.08\/min|Research \(Anthropic\)|Usage dashboards/);
  assert.match(settingsMarkup, /does not apply to the separate Deepgram route/i);
  assert.match(settingsMarkup, /AIMM relay active\. Provider credentials stay in the Worker/);
  assert.match(settingsMarkup, /id="rtClaudeModel"/);
  assert.match(html, /for\(const agentId of agentIds\)/, "Hope tools should target both Agents");
  assert.ok(readFileSync(new URL("../library-account.js", import.meta.url), "utf8").length > 0);
});
