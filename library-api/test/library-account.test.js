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
    this.value = "";
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

function findAllTag(root, tagName, matches = []) {
  if (root.tagName === tagName) matches.push(root);
  for (const child of root.children) findAllTag(child, tagName, matches);
  return matches;
}

function findAttribute(root, name, value) {
  if (root.attributes?.get(name) === value) return root;
  for (const child of root.children) {
    const result = findAttribute(child, name, value);
    if (result) return result;
  }
  return null;
}

function findTextContaining(root, value) {
  if (root.textContent.includes(value)) return root;
  for (const child of root.children) {
    const result = findTextContaining(child, value);
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
  const settings = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: (id) => id === "settings" ? settings : id === "library" ? library : null,
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
  const card = settings.children.find((child) => child.id === "aimm-account-preview");
  const style = settings.children.find((child) => child.tagName === "style");
  assert.equal(library.children.length, 0, "the account preview must not be mounted in the Library");
  assert.ok(settings.children.includes(card), "the account preview must live in Settings");
  assert.match(style.textContent, /#aimm-account-preview\\{display:block;/, "the off-state shell must remain visible");
  assert.match(style.textContent, /#aimm-account-preview \\.account-preview-content\\{display:none\\}/, "account controls must stay hidden until enabled");
  assert.match(style.textContent, /#aimm-account-preview\\.is-enabled \\.account-preview-content\\{display:block\\}/, "enabling the preview should reveal its controls");
  assert.equal(card.classList.contains("is-enabled"), false);
  assert.equal(localStorage.getItem("aimmAccountLibraryPreviewEnabled_v1"), null);
  const toggle = findText(card, "Enable account preview");
  assert.ok(toggle, "the disabled feature must expose a visible enable control");
  await toggle.click();
  assert.ok(TOOL_DEFS.some((tool) => tool.name === "list_installed_plugins"));
  assert.ok(TOOL_DEFS.some((tool) => tool.name === "get_plugin_action_preview"));
  assert.notEqual(window.handleToolCall, originalHandler);
  for (const invalidDeviceID of ["not-a-device-id", "------------------------------------", "bbbbbbbbbbbb4bbb8bbbbbbbbbbbbbbb", "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb\n"]) {
    await assert.rejects(
      window.handleToolCall("list_installed_plugins", { device_id: invalidDeviceID }),
      /Choose a valid device ID/
    );
    await assert.rejects(
      window.handleToolCall("get_plugin_status", { device_id: invalidDeviceID }),
      /Choose a valid device ID/
    );
  }

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
  const settings = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: (id) => id === "settings" ? settings : id === "library" ? library : null,
    createElement: (tag) => new Element(tag),
    addEventListener: (_name, callback) => { document.readyHandler = callback; }
  };
  const payloads = {
    "/v1/session": { csrf_token: "local-csrf" },
    "/v1/status-summary": {
      notice: "Observations are recorded.",
      counts: { update: 1, free_update: 0, paid_update: 0, actionable_update: 0, stale: 1, unchecked: 223 },
      raw_counts: { update: 2 }, records: [{ name: "Synth", format: "AU", bundle_identifier: "com.example.synth",
        status: "stale", raw_status: "update", latest_version: "1.3", installed_version: "1.2" },
      ...Array.from({ length: 223 }, (_, index) => ({ name: `Synthetic status ${index + 1}`, format: "AU",
        bundle_identifier: `com.example.synthetic${index + 1}`, status: "unchecked", raw_status: "unchecked" })),
      { name: "Zeta status beyond page one", format: "VST3", bundle_identifier: "com.example.zeta",
        status: "update", raw_status: "update", latest_version: "2.0", installed_version: "1.0" }]
    },
    "/v1/preferences": { marks: [] }
  };
  const markWrites = [];
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
      if (path === "/v1/preferences/marks") {
        const body = JSON.parse(options.body);
        markWrites.push(body);
        const saved = { ...body, marked_at: body.marked_latest_version ? "2026-10-25T09:00:00.000Z" : null,
          revision: body.expected_revision + 1 };
        return { ok: true, status: 200, json: async () => saved };
      }
      assert.ok(payloads[path], `Unexpected request: ${path}`);
      return { ok: true, status: 200, json: async () => payloads[path] };
    },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  const card = settings.children.find((child) => child.id === "aimm-account-preview");
  await findText(card, "Show status observations").click();

  assert.ok(findText(card, "Raw updates: 2 · Free: 0 · Paid: 0 · Actionable: 0 · Stale: 1 · Unknown: 223"));
  const markButton = findText(card, "Mark this version up to date");
  assert.ok(markButton);
  await markButton.click();
  assert.equal(markWrites[0].marked_latest_version, "1.3");
  assert.equal(markWrites[0].expected_revision, 0);
  assert.ok(findText(card, "Reset version mark"));
  await findText(card, "Reset version mark").click();
  assert.equal(markWrites[1].marked_latest_version, null);
  assert.equal(markWrites[1].expected_revision, 1);

  assert.ok(findTextContaining(card, "Showing 1–100"));
  await findText(card, "Next statuses").click();
  await findText(card, "Next statuses").click();
  assert.ok(findTextContaining(card, "Showing 201–225"));
  assert.ok(findTextContaining(card, "Zeta status beyond page one · VST3: update (raw update)"));
  const lastPageMark = findAllText(card, "Mark this version up to date").at(-1);
  assert.ok(lastPageMark, "version preferences should remain available on the last status page");
  await lastPageMark.click();
  assert.equal(markWrites[2].target_key, "com.example.zeta");
  assert.equal(markWrites[2].marked_latest_version, "2.0");
  const statusSearch = findAttribute(card, "aria-label", "Search status observations by product or vendor identifier");
  statusSearch.value = "zeta";
  await statusSearch.listeners.get("input")();
  assert.ok(findTextContaining(card, "Showing 1–1"), "search should find last-page observations and reset pagination");
  assert.ok(findTextContaining(card, "Zeta status beyond page one · VST3: update (raw update)"));
  assert.equal(findTextContaining(card, "Synthetic status 1 · AU: unchecked (raw unchecked)"), null);
});

test("the account preview and Hope use the same inventory snapshot and expose last contact", async () => {
  const localValues = new Map([
    ["aimmAccountLibraryPreviewEnabled_v1", "true"],
    ["aimmLibraryPreviewApiBase_v1", "http://127.0.0.1:8787"],
    ["aimmPluginInventoryRows_v1", JSON.stringify([
      { name: "Voxengo BMS", vendor: "Voxengo", bundleId: "com.voxengo.bms", format: "AU", version: "2.5", localPath: "/private/local-only" },
      { name: "FabFilter Pro-Q 4", vendor: "FabFilter", bundleId: "com.fabfilter.ProQ", format: "VST3", version: "4.13", localPath: "/private/another-path" }
    ])]
  ]);
  const library = new Element("section");
  const settings = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: (id) => id === "settings" ? settings : id === "library" ? library : null,
    createElement: (tag) => new Element(tag),
    addEventListener: (_name, callback) => { document.readyHandler = callback; }
  };
  const calls = [];
  let preferenceRevision = 0;
  let pagedSnapshot = false;
  let inventoryCountMismatch = false;
  let inventoryPageCountMismatch = false;
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
      calls.push({ path, url, options });
      if (path === "/v1/session") return { ok: true, json: async () => ({ csrf_token: "test-csrf" }) };
      if (path === "/v1/library") {
        if (!pagedSnapshot) return { ok: true, json: async () => libraryPayload };
        const cursor = new URL(url).searchParams.get("cursor");
        const records = cursor ? libraryPayload.records.slice(200) : libraryPayload.records.slice(0, 200);
        const countAdjustment = inventoryCountMismatch || (inventoryPageCountMismatch && cursor) ? 1 : 0;
        const generation = countAdjustment
          ? { ...libraryPayload.generation, record_count: libraryPayload.generation.record_count + countAdjustment }
          : libraryPayload.generation;
        return { ok: true, json: async () => ({ ...libraryPayload, generation, records, next_cursor: cursor ? null : "page-two" }) };
      }
      if (path === "/v1/actions/restorable") return { ok: true, json: async () => ({ moves: [{
        operation_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", device_id: libraryPayload.device.device_id,
        record_id: libraryPayload.records[0].id, name: "Voxengo BMS", format: "AU", version: "2.6",
        moved_at: "2026-10-25T10:00:00.000Z"
      }] }) };
      if (path === "/v1/status-summary") return { ok: true, json: async () => ({ counts: {}, raw_counts: {}, records: [] }) };
      if (path === "/v1/preferences" && options.method === "GET") return { ok: true, json: async () => ({ settings: [], marks: [] }) };
      if (path === "/v1/preferences/marks" && options.method === "PUT") return { ok: true, json: async () => ({ revision: ++preferenceRevision }) };
      if (path === "/v1/actions/preview") {
        const kind = new URL(url).searchParams.get("kind");
        return { ok: true, json: async () => ({
          preview: { kind, summary: kind === "move_to_unused" ? "Choose an Unused folder and confirm with a passkey." : "Show this item in Finder after confirmation.", requires_mac_confirmation: true, requires_owner_passkey: kind === "move_to_unused", changes_local_files: kind === "move_to_unused" }
        }) };
      }
      if (path === "/v1/actions" && options.method === "POST") return { ok: true, json: async () => ({ operation_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", state: "requested" }) };
      throw new Error(`Unexpected request: ${path}`);
    },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  const selectedDeviceID = libraryPayload.device.device_id.toUpperCase();
  const hopeResult = await sandbox.window.handleToolCall("list_installed_plugins", { device_id: selectedDeviceID });
  await sandbox.window.handleToolCall("get_plugin_status", { device_id: selectedDeviceID });
  const previewResult = await sandbox.window.handleToolCall("get_plugin_action_preview", {
    device_id: libraryPayload.device.device_id,
    record_id: libraryPayload.records[0].id,
    kind: "reveal"
  });
  const movePreviewResult = await sandbox.window.handleToolCall("get_plugin_action_preview", {
    device_id: libraryPayload.device.device_id,
    record_id: libraryPayload.records[0].id,
    kind: "move_to_unused"
  });
  await findText(library, "Compare inventory").click();
  const card = settings.children.find((child) => child.id === "aimm-account-preview");
  assert.equal(hopeResult.device.last_seen_at, lastSeen);
  assert.equal(hopeResult.generation.observed_at, observed);
  assert.equal(hopeResult.records[0].name, "Voxengo BMS");
  assert.equal(new URL(calls.find((call) => call.path === "/v1/library").url).searchParams.get("device_id"), libraryPayload.device.device_id);
  assert.equal(new URL(calls.find((call) => call.path === "/v1/status-summary").url).searchParams.get("device_id"), libraryPayload.device.device_id);
  assert.equal(previewResult.preview.requires_mac_confirmation, true);
  assert.equal(previewResult.preview.changes_local_files, false);
  assert.equal(movePreviewResult.preview.requires_owner_passkey, true);
  assert.equal(movePreviewResult.preview.changes_local_files, true);
  assert.ok(calls.some((call) => call.path === "/v1/actions/preview"));
  assert.ok(findText(card, `Test Mac · last API contact ${lastSeen} · inventory observed ${observed} · generation dddddddd-dddd-4ddd-8ddd-dddddddddddd`));
  assert.ok(findText(card, "Parity: 1 matching entries · 1 only in browser · 1 only in account · 1 version differences."));
  assert.ok(findText(card, "Browser only: FabFilter Pro-Q 4 · VST3"));
  assert.ok(findText(card, "Version difference: Voxengo BMS · AU · browser 2.5 / account 2.6"));
  assert.equal(JSON.stringify(card).includes("/private/local-only"), false, "parity display must not expose local paths");
  const inventorySearch = findAttribute(card, "aria-label", "Search account inventory by product or vendor");
  inventorySearch.value = "u-he";
  await inventorySearch.listeners.get("input")();
  assert.ok(findText(card, "Diva · AU · 1.4.7 "), "search should match vendor identifiers case-insensitively");
  assert.equal(findText(card, "Voxengo BMS · AU · 2.6 "), null);
  const formatFilter = findAttribute(card, "aria-label", "Filter account inventory by format");
  formatFilter.value = "vst3";
  await formatFilter.listeners.get("change")();
  assert.ok(findText(card, "No products match these filters."), "search and format filters should compose");
  inventorySearch.value = "";
  formatFilter.value = "au";
  await inventorySearch.listeners.get("input")();
  assert.ok(findText(card, "2 of 2 products"), "the result count should reflect the active format filter");
  formatFilter.value = "";
  await formatFilter.listeners.get("change")();
  const sortOrder = findAttribute(card, "aria-label", "Sort account inventory");
  sortOrder.value = "name";
  await sortOrder.listeners.get("change")();
  const productList = findAllTag(card, "ul").at(-1);
  assert.equal(productList.children[0].children[0].textContent, "Diva · AU · 1.4.7 ", "name sorting should be alphabetical");
  assert.equal(productList.children[1].children[0].textContent, "Voxengo BMS · AU · 2.6 ");
  inventorySearch.value = "voxengo";
  await inventorySearch.listeners.get("input")();
  assert.equal(productList.children.length, 1, "sorting should preserve the active search filter");
  inventorySearch.value = "";
  sortOrder.value = "";
  await sortOrder.listeners.get("change")();
  await findText(card, "Favourite").click();
  assert.ok(findText(card, "Show favourites (1)"), "the account inventory should expose a favourites filter");
  await findText(card, "Show favourites (1)").click();
  assert.ok(findText(card, "Voxengo BMS · AU · 2.6 "));
  assert.equal(findText(card, "Diva · AU · 1.4.7 "), null, "the favourites filter should omit unmarked products");
  await findText(card, "Show all products (1)").click();
  assert.ok(findText(card, "Diva · AU · 1.4.7 "));
  await findText(card, "Pin").click();
  assert.ok(findText(card, "Unpin"), "pin state should be user-toggleable");
  assert.equal(JSON.parse(calls.filter((call) => call.path === "/v1/preferences/marks").at(-1).options.body).pinned, true);
  await findText(card, "Mark hidden").click();
  assert.ok(findText(card, "Show hidden (1)"), "hidden products should leave the default account inventory view");
  assert.equal(findText(card, "Voxengo BMS · AU · 2.6 "), null, "hiding a product should immediately remove its row");
  await findText(card, "Show hidden (1)").click();
  assert.ok(findText(card, "Voxengo BMS · AU · 2.6 "), "the hidden-items view should keep hidden products recoverable");
  await findText(card, "Unhide").click();
  assert.ok(findText(card, "Hide hidden (0)"), "unhiding should clear the hidden count");
  await findText(card, "Hide hidden (0)").click();
  assert.ok(findText(card, "Voxengo BMS · AU · 2.6 "), "an unhidden product should remain in the default view");
  await findText(card, "Check items moved to Unused").click();
  await findText(card, "Request restore on Mac").click();
  const restoreRequest = calls.find((call) => call.path === "/v1/actions" && JSON.parse(call.options.body).kind === "restore");
  assert.ok(restoreRequest, "the account UI should offer restore for a verified historical move");
  assert.deepEqual(JSON.parse(restoreRequest.options.body).record_ids, [libraryPayload.records[0].id]);
  assert.equal(JSON.parse(restoreRequest.options.body).parent_move_operation_id, "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
  await findText(card, "Move to Unused…").click();
  const moveRequest = calls.find((call) => call.path === "/v1/actions" && JSON.parse(call.options.body).kind === "move_to_unused");
  assert.ok(moveRequest, "the Library UI should queue the explicitly requested one-item move action");
  assert.equal(JSON.parse(moveRequest.options.body).record_ids.length, 1);
  const markUpdate = calls.find((call) => call.path === "/v1/preferences/marks");
  assert.ok(markUpdate);
  assert.equal(JSON.parse(markUpdate.options.body).scope, "product");
  assert.equal(JSON.parse(markUpdate.options.body).target_key, "com.voxengo.bms");
  assert.equal(JSON.parse(markUpdate.options.body).favorite, true);
  const tagsInput = findAttribute(card, "aria-label", "Tags for Voxengo BMS");
  tagsInput.value = "Mix tools, Reference";
  await findText(card, "Save tags").click();
  const tagFilter = findAttribute(card, "aria-label", "Filter account inventory by tag");
  assert.ok(tagFilter.children.some((option) => option.textContent === "Mix tools"), "saved tags should populate the filter");
  tagFilter.value = "mix tools";
  await tagFilter.listeners.get("change")();
  assert.ok(findText(card, "Voxengo BMS · AU · 2.6 "));
  assert.equal(findText(card, "Diva · AU · 1.4.7 "), null, "tag filtering should omit products without the selected tag");
  assert.ok(findText(card, "1 of 2 products"));
  tagFilter.value = "";
  await tagFilter.listeners.get("change")();
  const snoozeReasonInput = findAttribute(card, "aria-label", "Snooze reason for Voxengo BMS");
  snoozeReasonInput.value = "Review after the session";
  await findText(card, "Snooze for 1 week").click();
  const snoozeRequest = calls.filter((call) => call.path === "/v1/preferences/marks").at(-1);
  const snoozeBody = JSON.parse(snoozeRequest.options.body);
  assert.equal(snoozeBody.snooze_reason, "Review after the session");
  assert.ok(Date.parse(snoozeBody.snooze_until) > Date.now());
  assert.ok(findTextContaining(card, "Review after the session"), "the account UI should show snooze reason and expiry");
  await findText(card, "Clear snooze").click();
  const clearSnoozeBody = JSON.parse(calls.filter((call) => call.path === "/v1/preferences/marks").at(-1).options.body);
  assert.equal(clearSnoozeBody.snooze_until, null);
  assert.equal(clearSnoozeBody.snooze_reason, null);
  assert.ok(findText(card, "No active snooze"), "clearing snooze should update its visible state");
  const vendorSiteButtons = findAllText(card, "Open vendor page on Mac");
  assert.equal(vendorSiteButtons.length, 2, `Voxengo and supported u-he items should offer the fixed vendor-site action; Diva row rendered: ${Boolean(findText(card, "Diva · AU · 1.4.7 "))}`);
  await vendorSiteButtons[1].click();
  const vendorAction = calls.find((call) => call.path === "/v1/actions" && JSON.parse(call.options.body).kind === "open_vendor_site");
  assert.ok(vendorAction);
  assert.equal(JSON.parse(vendorAction.options.body).kind, "open_vendor_site");
  assert.deepEqual(JSON.parse(vendorAction.options.body).record_ids, [libraryPayload.records[1].record_id]);

  libraryPayload.records.push(...Array.from({ length: 223 }, (_, index) => ({
    id: `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    record_id: `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    name: `Synthetic product ${String(index + 1).padStart(3, "0")}`,
    vendor: "Synthetic vendor", bundle_identifier: `com.synthetic.product${index + 1}`,
    format: index === 222 ? "CLAP" : "AU", version: "1.0"
  })));
  libraryPayload.records.at(-1).name = "Zeta beyond first 100";
  libraryPayload.generation.record_count = libraryPayload.records.length;
  pagedSnapshot = true;
  await findText(card, "Compare inventory").click();
  const pageStatus = findText(card, "Showing 1–100");
  assert.ok(pageStatus, "the full account snapshot should begin on a bounded first page");
  assert.ok(findAttribute(card, "aria-label", "Filter account inventory by format").children.some((option) => option.textContent === "CLAP"),
    "format filters should include formats that occur after the first 100 records");
  await findText(card, "Next products").click();
  assert.ok(findText(card, "Showing 101–200"), "pagination should reach records beyond the first 100");
  await findText(card, "Next products").click();
  assert.ok(findText(card, "Showing 201–225"), "the full snapshot should include records retrieved from later API cursor pages");
  assert.ok(findText(card, "Zeta beyond first 100 · CLAP · 1.0 "));
  const fullSnapshotSearch = findAttribute(card, "aria-label", "Search account inventory by product or vendor");
  fullSnapshotSearch.value = "zeta beyond first 100";
  await fullSnapshotSearch.listeners.get("input")();
  assert.ok(findText(card, "Zeta beyond first 100 · CLAP · 1.0 "), "search should include records on later pages");
  assert.ok(findText(card, "1 of 225 products"));
  assert.ok(findText(card, "Showing 1–1"), "changing a filter on a later page should reset navigation to the first page");
  fullSnapshotSearch.value = "";
  await fullSnapshotSearch.listeners.get("input")();
  await findText(card, "Next products").click();
  await findText(card, "Next products").click();
  const finalPageList = findAllTag(card, "ul").at(-1);
  assert.equal(finalPageList.children.length, 25);
  for (let index = 0; index < 25; index += 1) {
    const currentPageList = findAllTag(card, "ul").at(-1);
    const hideButton = findAllText(currentPageList, "Mark hidden")[0];
    assert.ok(hideButton, "a later-page preference control should remain available until each visible item is hidden");
    await hideButton.click();
  }
  assert.ok(findText(card, "Showing 101–200"), "hiding the final page should clamp navigation to the last remaining page");
  assert.equal(findAllTag(card, "ul").at(-1).children.length, 100, "the preview should render no more than 100 inventory rows at once");
  const lastPagePreference = calls.filter((call) => call.path === "/v1/preferences/marks").at(-1);
  assert.equal(JSON.parse(lastPagePreference.options.body).target_key, "com.synthetic.product223");
  assert.equal(JSON.parse(lastPagePreference.options.body).hidden, true, "preference writes should work from later pages");
  const libraryRequests = calls.filter((call) => call.path === "/v1/library");
  assert.equal(libraryRequests.length, 4);
  assert.equal(new URL(libraryRequests.at(-2).url).searchParams.get("cursor"), null);
  assert.equal(new URL(libraryRequests.at(-1).url).searchParams.get("cursor"), "page-two");
  inventoryCountMismatch = true;
  await findText(card, "Compare inventory").click();
  assert.ok(findText(card, "The account inventory is incomplete. Compare again after the snapshot is available."),
    "the account preview must fail closed when collected records do not match the snapshot count");
  const allLibraryRequests = calls.filter((call) => call.path === "/v1/library");
  assert.equal(allLibraryRequests.length, 6);
  inventoryCountMismatch = false;
  inventoryPageCountMismatch = true;
  await findText(card, "Compare inventory").click();
  assert.ok(findText(card, "The account inventory changed while it was being read. Compare again."),
    "the account preview must fail closed when the generation count changes between cursor pages");
  assert.equal(calls.filter((call) => call.path === "/v1/library").length, 8);
});

test("account preview offers a retry only after a failed action result", async () => {
  const localValues = new Map([
    ["aimmAccountLibraryPreviewEnabled_v1", "true"],
    ["aimmLibraryPreviewApiBase_v1", "http://127.0.0.1:8787"]
  ]);
  const library = new Element("section");
  const settings = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: (id) => id === "settings" ? settings : id === "library" ? library : null,
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
      if (parsed.pathname === "/v1/preferences" && options.method === "GET") return { ok: true, json: async () => ({ settings: [], marks: [] }) };
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
  const card = settings.children.find((child) => child.id === "aimm-account-preview");
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

test("account preview requires a passkey and one-use capability before showing an exact path", async () => {
  const localValues = new Map([
    ["aimmAccountLibraryPreviewEnabled_v1", "true"],
    ["aimmLibraryPreviewApiBase_v1", "http://127.0.0.1:8787"]
  ]);
  const library = new Element("section");
  const settings = new Element("section");
  const document = {
    readyState: "loading", getElementById: (id) => id === "settings" ? settings : id === "library" ? library : null,
    createElement: (tag) => new Element(tag), addEventListener: (_name, callback) => { document.readyHandler = callback; }
  };
  const recordID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const deviceID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  const operationID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  const digest = "a".repeat(64);
  const calls = [];
  class FakePublicKeyCredential {
    constructor() {
      this.id = "fixture-credential"; this.rawId = Uint8Array.of(1).buffer; this.type = "public-key";
      this.authenticatorAttachment = "platform";
      this.response = {
        clientDataJSON: Uint8Array.of(1).buffer,
        authenticatorData: Uint8Array.of(2).buffer,
        signature: Uint8Array.of(3).buffer,
        userHandle: null
      };
    }
    getClientExtensionResults() { return {}; }
  }
  const sandbox = {
    document, window: { handleToolCall: async () => null, isSecureContext: true, PublicKeyCredential: FakePublicKeyCredential },
    navigator: { credentials: { get: async () => new FakePublicKeyCredential() } },
    PublicKeyCredential: FakePublicKeyCredential,
    TOOL_DEFS: [], localStorage: { getItem: (key) => localValues.get(key) ?? null, setItem: (key, value) => localValues.set(key, value) },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    location: { origin: "https://aimixmasters.com", pathname: "/", search: "", hash: "", href: "https://aimixmasters.com/" },
    history: { replaceState() {} }, URL, URLSearchParams, crypto: webcrypto,
    TextEncoder, atob: (value) => Buffer.from(value, "base64").toString("binary"),
    btoa: (value) => Buffer.from(value, "binary").toString("base64"), setTimeout: () => 0,
    fetch: async (url, options = {}) => {
      const path = new URL(url).pathname;
      calls.push({ path, options });
      if (path === "/v1/session") return { ok: true, json: async () => ({ csrf_token: "test-csrf" }) };
      if (path === "/v1/library") return { ok: true, json: async () => ({
        device: { device_id: deviceID, display_name: "Test Mac" },
        generation: { generation_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", observed_at: "now", record_count: 1 },
        records: [{ id: recordID, name: "Synth", format: "AU", version: "1.0" }]
      }) };
      if (path === "/v1/preferences" && options.method === "GET") return { ok: true, json: async () => ({ settings: [], marks: [] }) };
      if (path === "/v1/actions" && options.method === "POST") return { ok: true, json: async () => ({ operation_id: operationID, state: "requested" }) };
      if (path === `/v1/actions/${operationID}`) return { ok: true, json: async () => ({
        operation_id: operationID, kind: "download_installer", state: "claimed", preview_digest: digest, preview_expires_at: "2099-01-01T00:00:00.000Z"
      }) };
      if (path === "/v1/webauthn/authentication/options") return { ok: true, json: async () => ({
        challenge_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", options: { challenge: "AQ", allowCredentials: [] }
      }) };
      if (path === "/v1/webauthn/authentication/verify") return { ok: true, json: async () => ({
        capability: "one-use-test-capability", confirmed_operation_id: operationID, preview_digest: digest
      }) };
      if (path === `/v1/actions/${operationID}/owner-preview`) return { ok: true, json: async () => ({
        operation_id: operationID, preview: { items: [{ name: "Synth", format: "AU", version: "1.0", source_display_path: "/Library/Audio/Plug-Ins/Components/Synth.component", destination_display_path: null }] }
      }) };
      throw new Error(`Unexpected request: ${path}`);
    },
    console
  };

  runInNewContext(readFileSync(new URL("../library-account.js", import.meta.url), "utf8"), sandbox);
  document.readyHandler();
  await new Promise((resolve) => setImmediate(resolve));
  const card = settings.children.find((child) => child.id === "aimm-account-preview");
  await findText(card, "Compare inventory").click();
  await findText(card, "Request reveal on Mac").click();
  await findText(card, "Check action status").click();
  await findText(card, "View exact path with passkey").click();

  const optionsCall = calls.find((call) => call.path === "/v1/webauthn/authentication/options");
  assert.ok(optionsCall, JSON.stringify(calls.map((call) => ({ path: call.path, body: call.options.body }))));
  assert.equal(JSON.parse(optionsCall.options.body).purpose, "action_preview_unlock");
  assert.equal(JSON.parse(optionsCall.options.body).operation_id, operationID);
  assert.equal(JSON.parse(optionsCall.options.body).preview_digest, digest);
  const verifyCall = calls.find((call) => call.path === "/v1/webauthn/authentication/verify");
  assert.equal(JSON.parse(verifyCall.options.body).challenge_id, "dddddddd-dddd-4ddd-8ddd-dddddddddddd");
  const exactCall = calls.find((call) => call.path === `/v1/actions/${operationID}/owner-preview`);
  assert.ok(exactCall, JSON.stringify(calls.map((call) => call.path)));
  assert.equal(exactCall.options.headers["x-action-preview-capability"], "one-use-test-capability");
  assert.ok(findText(card, "Source: /Library/Audio/Plug-Ins/Components/Synth.component"));
  await findText(card, "Confirm this action with passkey").click();
  const confirmOptions = calls.find((call) => call.path === "/v1/webauthn/authentication/options" &&
    JSON.parse(call.options.body).purpose === "action_confirm");
  assert.ok(confirmOptions);
  assert.equal(JSON.parse(confirmOptions.options.body).operation_id, operationID);
  assert.equal(JSON.parse(confirmOptions.options.body).preview_digest, digest);
  const confirms = calls.filter((call) => call.path === "/v1/webauthn/authentication/verify");
  assert.equal(confirms.length, 2);
  assert.equal(JSON.parse(confirms[1].options.body).challenge_id, "dddddddd-dddd-4ddd-8ddd-dddddddddddd");
  assert.ok(findText(card, "The paired Mac receives this exact-preview authorization when it checks for actions."));
});

test("account preview can cancel an unclaimed pending action with CSRF", async () => {
  const localValues = new Map([
    ["aimmAccountLibraryPreviewEnabled_v1", "true"],
    ["aimmLibraryPreviewApiBase_v1", "http://127.0.0.1:8787"]
  ]);
  const library = new Element("section");
  const settings = new Element("section");
  const document = {
    readyState: "loading",
    getElementById: (id) => id === "settings" ? settings : id === "library" ? library : null,
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
      if (parsed.pathname === "/v1/preferences" && options.method === "GET") return { ok: true, json: async () => ({ settings: [], marks: [] }) };
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
  const card = settings.children.find((child) => child.id === "aimm-account-preview");
  await findText(card, "Compare inventory").click();
  await findText(card, "Request reveal on Mac").click();
  await findText(card, "Check action status").click();
  await findText(card, "Cancel pending action").click();
  const cancelCall = calls.find((call) => call.path === `/v1/actions/${operationID}/cancel`);
  assert.ok(cancelCall);
  assert.equal(cancelCall.options.headers["x-csrf-token"], "test-csrf");
  assert.equal(findText(card, "Action cancelled before the Mac claimed it.")?.textContent, "Action cancelled before the Mac claimed it.");
});
