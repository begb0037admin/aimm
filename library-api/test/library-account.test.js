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

function findAllText(root, value, matches = []) {
  if (root.textContent === value) matches.push(root);
  for (const child of root.children) findAllText(child, value, matches);
  return matches;
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
  assert.ok(TOOL_DEFS.some((tool) => tool.name === "get_plugin_action_preview"));
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

test("the account preview and Hope use the same inventory snapshot and expose last contact", async () => {
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
  const calls = [];
  const lastSeen = "2026-10-24T21:20:00.000Z";
  const observed = "2026-10-24T21:19:00.000Z";
  const libraryPayload = {
    device: { device_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", display_name: "Test Mac", last_seen_at: lastSeen },
    generation: { generation_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", observed_at: observed, record_count: 2 },
    records: [
      { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", record_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", name: "Voxengo BMS", bundleIdentifier: "com.voxengo.bms", format: "AU", version: "2.6" },
      { id: "ffffffff-ffff-4fff-8fff-ffffffffffff", record_id: "ffffffff-ffff-4fff-8fff-ffffffffffff", name: "Diva", bundle_identifier: "com.u-he.Diva", format: "AU", version: "1.4.7" }
    ]
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
    fetch: async (url, options = {}) => {
      const path = new URL(url).pathname;
      calls.push({ path, options });
      if (path === "/v1/session") return { ok: true, json: async () => ({ csrf_token: "test-csrf" }) };
      if (path === "/v1/library") return { ok: true, json: async () => libraryPayload };
      if (path === "/v1/actions/preview") return { ok: true, json: async () => ({
        preview: { kind: "reveal", summary: "Show this item in Finder after confirmation.", requires_mac_confirmation: true, changes_local_files: false }
      }) };
      if (path === "/v1/actions" && options.method === "POST") return { ok: true, json: async () => ({ operation_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", state: "requested" }) };
      throw new Error(`Unexpected request: ${path}`);
    },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  const hopeResult = await sandbox.window.handleToolCall("list_installed_plugins", {});
  const previewResult = await sandbox.window.handleToolCall("get_plugin_action_preview", {
    device_id: libraryPayload.device.device_id,
    record_id: libraryPayload.records[0].id,
    kind: "reveal"
  });
  await findText(library, "Compare inventory").click();
  const card = library.children.find((child) => child.id === "aimm-account-preview");
  assert.equal(hopeResult.device.last_seen_at, lastSeen);
  assert.equal(hopeResult.generation.observed_at, observed);
  assert.equal(hopeResult.records[0].name, "Voxengo BMS");
  assert.equal(previewResult.preview.requires_mac_confirmation, true);
  assert.equal(previewResult.preview.changes_local_files, false);
  assert.ok(calls.some((call) => call.path === "/v1/actions/preview"));
  assert.ok(findText(card, `Test Mac · last API contact ${lastSeen} · inventory observed ${observed} · generation dddddddd-dddd-4ddd-8ddd-dddddddddddd`));
  const vendorSiteButtons = findAllText(card, "Open vendor page on Mac");
  assert.equal(vendorSiteButtons.length, 2, `Voxengo and supported u-he items should offer the fixed vendor-site action; Diva row rendered: ${Boolean(findText(card, "Diva · AU · 1.4.7 "))}`);
  await vendorSiteButtons[1].click();
  const vendorAction = calls.find((call) => call.path === "/v1/actions");
  assert.ok(vendorAction);
  assert.equal(JSON.parse(vendorAction.options.body).kind, "open_vendor_site");
  assert.deepEqual(JSON.parse(vendorAction.options.body).record_ids, [libraryPayload.records[1].record_id]);
  assert.equal(calls.filter((call) => call.path === "/v1/library").length, 2);
});

test("account preview offers a retry only after a failed action result", async () => {
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
  const recordID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const deviceID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  const operationID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  const calls = [];
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
    fetch: async (url, options = {}) => {
      const parsed = new URL(url);
      calls.push({ path: parsed.pathname, options });
      if (parsed.pathname === "/v1/session") return { ok: true, json: async () => ({ csrf_token: "test-csrf" }) };
      if (parsed.pathname === "/v1/library") return { ok: true, json: async () => ({
        device: { device_id: deviceID, display_name: "Test Mac" },
        generation: { generation_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", observed_at: "now", record_count: 1 },
        records: [{ id: recordID, name: "Synth", format: "AU", version: "1.0" }]
      }) };
      if (parsed.pathname === "/v1/actions" && options.method === "POST") return { ok: true, json: async () => ({ operation_id: operationID, state: "requested" }) };
      if (parsed.pathname === `/v1/actions/${operationID}`) return { ok: true, json: async () => ({
        operation_id: operationID, state: "failed", receipt: { item_statuses: ["failed"], retryable: true }
      }) };
      if (parsed.pathname === `/v1/actions/${operationID}/retry` && options.method === "POST") return { ok: true, json: async () => ({ operation_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", state: "requested" }) };
      throw new Error(`Unexpected request: ${parsed.pathname}`);
    },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  const card = library.children.find((child) => child.id === "aimm-account-preview");
  await findText(card, "Compare inventory").click();
  await findText(card, "Request reveal on Mac").click();
  await findText(card, "Check action status").click();
  const retryButton = findText(card, "Retry failed action");
  assert.ok(retryButton, "a retry control should appear for a failed, retryable receipt");
  await retryButton.click();
  const retryCall = calls.find((call) => call.path === `/v1/actions/${operationID}/retry`);
  assert.ok(retryCall);
  const retryBody = JSON.parse(retryCall.options.body);
  assert.deepEqual(retryBody.item_ids, [recordID]);
  assert.match(retryBody.idempotency_key, /^[0-9a-f-]{36}$/i);
  assert.equal(findText(card, "Retry queued")?.textContent, "Retry queued");
});

test("account preview can cancel an unclaimed pending action with CSRF", async () => {
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
  const recordID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const deviceID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  const operationID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  const calls = [];
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
    fetch: async (url, options = {}) => {
      const parsed = new URL(url);
      calls.push({ path: parsed.pathname, options });
      if (parsed.pathname === "/v1/session") return { ok: true, json: async () => ({ csrf_token: "test-csrf" }) };
      if (parsed.pathname === "/v1/library") return { ok: true, json: async () => ({
        device: { device_id: deviceID, display_name: "Test Mac" },
        generation: { generation_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", observed_at: "now", record_count: 1 },
        records: [{ id: recordID, name: "Synth", format: "AU", version: "1.0" }]
      }) };
      if (parsed.pathname === "/v1/actions" && options.method === "POST") return { ok: true, json: async () => ({ operation_id: operationID, state: "requested" }) };
      if (parsed.pathname === `/v1/actions/${operationID}`) return { ok: true, json: async () => ({ operation_id: operationID, state: "requested" }) };
      if (parsed.pathname === `/v1/actions/${operationID}/cancel` && options.method === "POST") return { ok: true, json: async () => ({ operation_id: operationID, state: "cancelled" }) };
      throw new Error(`Unexpected request: ${parsed.pathname}`);
    },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  const card = library.children.find((child) => child.id === "aimm-account-preview");
  await findText(card, "Compare inventory").click();
  await findText(card, "Request reveal on Mac").click();
  await findText(card, "Check action status").click();
  await findText(card, "Cancel pending action").click();
  const cancelCall = calls.find((call) => call.path === `/v1/actions/${operationID}/cancel`);
  assert.ok(cancelCall);
  assert.equal(cancelCall.options.headers["x-csrf-token"], "test-csrf");
  assert.equal(findText(card, "Action cancelled before the Mac claimed it.")?.textContent, "Action cancelled before the Mac claimed it.");
});
