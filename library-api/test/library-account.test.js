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
    this.textContent = "";
    this.className = "";
    this.classList = {
      values: new Set(),
      toggle: (name, enabled) => enabled ? this.classList.values.add(name) : this.classList.values.delete(name),
      contains: (name) => this.classList.values.has(name)
    };
  }
  append(...nodes) { this.children.push(...nodes); }
  appendChild(node) { this.children.push(node); return node; }
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
    const result = findText(child, value);
    if (result) return result;
  }
  return null;
}

function findTag(root, tagName) {
  if (root.tagName === tagName) return root;
  for (const child of root.children) {
    const result = findTag(child, tagName);
    if (result) return result;
  }
  return null;
}

test("account preview gates Hope tools and restricts the API token destination", async () => {
  const localValues = new Map();
  const localStorage = {
    getItem: (key) => localValues.get(key) ?? null,
    setItem: (key, value) => localValues.set(key, value)
  };
  const library = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: () => library,
    createElement: (tag) => new Element(tag),
    addEventListener: (_name, callback) => { document.readyHandler = callback; }
  };
  const originalHandler = async (name) => `original:${name}`;
  const window = { handleToolCall: originalHandler };
  const TOOL_DEFS = [{ name: "list_plugins", description: "Installed catalogue" }];
  const sandbox = {
    document, window, TOOL_DEFS, localStorage,
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    location: { origin: "https://aimixmasters.com", pathname: "/", search: "", hash: "", href: "https://aimixmasters.com/" },
    history: { replaceState() {} }, URL, URLSearchParams, crypto: webcrypto,
    TextEncoder, btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    fetch: async () => { throw new Error("Unexpected network request in UI test"); },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(TOOL_DEFS.map((tool) => tool.name), ["list_plugins"]);
  assert.equal(window.handleToolCall, originalHandler);
  const card = library.children.find((child) => child.id === "aimm-account-preview");
  const toggle = findText(card, "Enable account preview");
  await toggle.click();
  assert.ok(TOOL_DEFS.some((tool) => tool.name === "list_installed_plugins"));
  assert.notEqual(window.handleToolCall, originalHandler);

  const apiInput = findTag(card, "input");
  const saveAPI = findText(card, "Save API URL");
  for (const rejectedURL of ["https://attacker.example/collect", "https://api.aimixmasters.com"]) {
    apiInput.value = rejectedURL;
    await saveAPI.click();
    assert.equal(localValues.has("aimmLibraryPreviewApiBase_v1"), false);
    assert.ok(findText(card, "Enter the approved Library API URL or a local loopback URL for development."));
  }

  apiInput.value = "https://aimm-library-api-dev.kevinlelitte.workers.dev/path";
  await saveAPI.click();
  assert.equal(localStorage.getItem("aimmLibraryPreviewApiBase_v1"), "https://aimm-library-api-dev.kevinlelitte.workers.dev");

  apiInput.value = "http://127.0.0.1:8787";
  await saveAPI.click();
  assert.equal(localStorage.getItem("aimmLibraryPreviewApiBase_v1"), "http://127.0.0.1:8787");

  await toggle.click();
  assert.deepEqual(TOOL_DEFS.map((tool) => tool.name), ["list_plugins"]);
  assert.equal(window.handleToolCall, originalHandler);
  assert.equal(TOOL_DEFS[0].description, "Installed catalogue");
});

test("status summary labels raw updates from the unbucketed response count", async () => {
  const localValues = new Map([
    ["aimmAccountLibraryPreviewEnabled_v1", "true"],
    ["aimmLibraryPreviewApiBase_v1", "http://127.0.0.1:8787"]
  ]);
  const library = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: () => library,
    createElement: (tag) => new Element(tag),
    addEventListener: (_name, callback) => { document.readyHandler = callback; }
  };
  const payloads = {
    "/v1/session": { csrf_token: "local-csrf" },
    "/v1/status-summary": {
      notice: "Observations are recorded.",
      counts: { update: 0, free_update: 0, paid_update: 0, actionable_update: 0, stale: 1, unchecked: 0 },
      raw_counts: { update: 1 }, records: []
    }
  };
  const sandbox = {
    document, window: { handleToolCall: async () => null }, TOOL_DEFS: [],
    localStorage: {
      getItem: (key) => localValues.get(key) ?? null,
      setItem: (key, value) => localValues.set(key, value)
    },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    location: { origin: "https://aimixmasters.com", pathname: "/", search: "", hash: "", href: "https://aimixmasters.com/" },
    history: { replaceState() {} }, URL, URLSearchParams, crypto: webcrypto,
    TextEncoder, btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    fetch: async (url) => {
      const path = new URL(url).pathname;
      assert.ok(payloads[path], `Unexpected request: ${path}`);
      return { ok: true, status: 200, json: async () => payloads[path] };
    },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  const card = library.children.find((child) => child.id === "aimm-account-preview");
  await findText(card, "Show status observations").click();

  assert.ok(findText(card, "Raw updates: 1 · Free: 0 · Paid: 0 · Actionable: 0 · Stale: 1 · Unknown: 0"));
});
