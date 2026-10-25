/* Stage 3 account-library preview. Feature flag is off until the owner enables it. */
(() => {
  "use strict";

  const OIDC_ISSUER = "https://dev-cxmqjc40zltqlx7l.us.auth0.com/";
  const OIDC_CLIENT_ID = "3EbH8eIpW9FxYvKoXIeYtRvhcGWGtwPA";
  const OIDC_AUDIENCE = "https://aimm-library-api-dev";
  const CANONICAL_ORIGIN = "https://aimixmasters.com";
  const APPROVED_API_ORIGINS = new Set([
    "https://aimm-library-api-dev.kevinlelitte.workers.dev"
  ]);
  const ACCOUNT_TOOL_NAMES = new Set([
    "list_installed_plugins", "get_plugin_status", "get_plugin_action_preview", "request_plugin_reveal", "get_action_result"
  ]);
  const PASSKEY_CONFIRMED_ACTIONS = new Set([
    "download_installer", "open_installer", "move_to_unused", "offload", "restore",
    "trash_plugin_copy", "trash_old_installer"
  ]);
  const FLAG_KEY = "aimmAccountLibraryPreviewEnabled_v1";
  const API_KEY = "aimmLibraryPreviewApiBase_v1";
  let csrfToken = null;
  let sessionInfo = null;
  let baselineToolDefinitions = null;
  let baselineToolDescriptions = new Map();
  let originalToolHandler = null;
  let accountToolHandler = null;

  const text = (tag, value, className) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value == null ? "" : String(value);
    return element;
  };

  function cleanApiBase(value) {
    const parsed = new URL(String(value || "").trim());
    const localLoopback = parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname);
    if ((!localLoopback && (parsed.protocol !== "https:" || !APPROVED_API_ORIGINS.has(parsed.origin))) ||
        parsed.username || parsed.password || parsed.search || parsed.hash) {
      throw new Error("Enter the approved Library API URL or a local loopback URL for development.");
    }
    return parsed.origin;
  }

  function apiBase() {
    try { return cleanApiBase(localStorage.getItem(API_KEY)); }
    catch { return ""; }
  }

  function parityKey(record) {
    const format = String(record?.format || "").trim().toLowerCase();
    const bundle = String(record?.bundleIdentifier || record?.bundle_identifier || record?.bundleId || "")
      .trim().toLowerCase();
    const name = String(record?.name || "").normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
    const vendor = String(record?.vendor || "").normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
    return format && (bundle || name) ? `${format}|${bundle ? `bundle:${bundle}` : `name:${vendor}|${name}`}` : null;
  }

  function compareInventoryRows(localRows, accountRows) {
    const accountByKey = new Map();
    for (const row of accountRows) {
      const key = parityKey(row);
      if (!key) continue;
      const queue = accountByKey.get(key) || [];
      queue.push(row);
      accountByKey.set(key, queue);
    }
    const localOnly = [];
    const versionMismatches = [];
    let matched = 0;
    for (const row of localRows) {
      const key = parityKey(row);
      const queue = key ? accountByKey.get(key) : null;
      const match = queue?.shift();
      if (!match) {
        localOnly.push(row);
        continue;
      }
      matched++;
      const localVersion = String(row.version || "").trim();
      const accountVersion = String(match.version || "").trim();
      if (localVersion && accountVersion && localVersion !== accountVersion) {
        versionMismatches.push({ name: row.name || match.name, format: row.format, localVersion, accountVersion });
      }
    }
    const accountOnly = [];
    for (const queue of accountByKey.values()) accountOnly.push(...queue);
    return { matched, localOnly, accountOnly, versionMismatches };
  }

  function randomVerifier() {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return base64url(bytes);
  }

  function base64url(bytes) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
  }

  async function challengeFor(verifier) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return base64url(new Uint8Array(digest));
  }

  function redirectUri() { return `${location.origin}${location.pathname}`; }

  function requestedScopes() {
    const pairingID = new URL(location.href).searchParams.get("pairing") || "";
    const canApprovePairing = /^[A-Za-z0-9_-]{40,64}$/.test(pairingID);
    return canApprovePairing
      ? "openid profile read:library manage:devices"
      : "openid profile read:library";
  }

  async function beginLogin() {
    if (location.origin !== CANONICAL_ORIGIN) {
      location.replace(CANONICAL_ORIGIN + location.pathname + location.search + location.hash);
      return;
    }
    const verifier = randomVerifier();
    const state = randomVerifier();
    const nonce = randomVerifier();
    sessionStorage.setItem("aimmOidcPkce_v1", JSON.stringify({ verifier, state, nonce }));
    const authorize = new URL("authorize", OIDC_ISSUER);
    authorize.search = new URLSearchParams({
      response_type: "code", client_id: OIDC_CLIENT_ID, redirect_uri: redirectUri(),
      scope: requestedScopes(), audience: OIDC_AUDIENCE,
      code_challenge: await challengeFor(verifier), code_challenge_method: "S256",
      state, nonce, response_mode: "query"
    }).toString();
    location.assign(authorize.toString());
  }

  async function completeLoginFromCallback() {
    const url = new URL(location.href);
    const code = url.searchParams.get("code");
    if (!code) return false;
    const saved = JSON.parse(sessionStorage.getItem("aimmOidcPkce_v1") || "null");
    sessionStorage.removeItem("aimmOidcPkce_v1");
    if (!saved || !saved.verifier || saved.state !== url.searchParams.get("state")) {
      throw new Error("Sign-in state did not match. Start sign-in again.");
    }
    const response = await fetch(new URL("oauth/token", OIDC_ISSUER), {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code", client_id: OIDC_CLIENT_ID,
        code, redirect_uri: redirectUri(), code_verifier: saved.verifier
      }), credentials: "omit", cache: "no-store"
    });
    const body = await response.json();
    if (!response.ok || typeof body.access_token !== "string") {
      throw new Error("Sign-in did not return a Library API access token.");
    }
    const base = apiBase();
    if (!base) throw new Error("Enter the non-production Library API URL before signing in.");
    const exchange = await fetch(`${base}/v1/session`, {
      method: "POST", headers: { authorization: `Bearer ${body.access_token}` },
      credentials: "include", cache: "no-store"
    });
    const session = await exchange.json();
    if (!exchange.ok) throw new Error(session?.error?.message || "The Library API session could not be created.");
    csrfToken = session.csrf_token;
    sessionInfo = session;
    history.replaceState(null, "", location.pathname + (url.searchParams.has("pairing") ? `?pairing=${encodeURIComponent(url.searchParams.get("pairing"))}` : ""));
    return true;
  }

  async function ensureSession() {
    if (sessionInfo && csrfToken) return sessionInfo;
    const base = apiBase();
    if (!base) throw new Error("Set the non-production Library API URL first.");
    const response = await fetch(`${base}/v1/session`, { credentials: "include", cache: "no-store" });
    if (response.ok) {
      sessionInfo = await response.json();
      csrfToken = sessionInfo.csrf_token;
      return sessionInfo;
    }
    throw new Error("Sign in to your AIMM account to read this inventory.");
  }

  async function api(path, options = {}) {
    const base = apiBase();
    if (!base) throw new Error("Set the non-production Library API URL first.");
    const method = options.method || "GET";
    const headers = { accept: "application/json", ...(options.body ? { "content-type": "application/json" } : {}), ...(options.headers || {}) };
    if (method !== "GET" && csrfToken) headers["x-csrf-token"] = csrfToken;
    const response = await fetch(`${base}${path}`, {
      method, headers, credentials: "include", cache: "no-store",
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error?.message || `Library API request failed (${response.status}).`);
    return payload;
  }

  function decodeBase64url(value) {
    const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }

  function encodeBase64url(value) {
    const bytes = new Uint8Array(value);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
  }

  function selectedDeviceID(args = {}) {
    if (args.device_id === undefined) return null;
    if (typeof args.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.device_id)) {
      throw new Error("Choose a valid device ID before reading account data.");
    }
    return args.device_id;
  }

  async function registerAccountPasskey() {
    await ensureSession();
    if (!window.isSecureContext || !navigator.credentials?.create || !window.PublicKeyCredential) {
      throw new Error("Passkeys need a supported browser on this secure site.");
    }
    const { challenge_id: challengeID, options } = await api("/v1/webauthn/registration/options", { method: "POST", body: {} });
    const publicKey = {
      ...options,
      challenge: decodeBase64url(options.challenge),
      user: { ...options.user, id: decodeBase64url(options.user.id) },
      excludeCredentials: (options.excludeCredentials || []).map((item) => ({ ...item, id: decodeBase64url(item.id) }))
    };
    const credential = await navigator.credentials.create({ publicKey });
    if (!(credential instanceof PublicKeyCredential)) throw new Error("The browser did not return a passkey credential.");
    const response = {
      id: credential.id,
      rawId: encodeBase64url(credential.rawId),
      type: credential.type,
      authenticatorAttachment: credential.authenticatorAttachment || undefined,
      clientExtensionResults: credential.getClientExtensionResults(),
      response: {
        clientDataJSON: encodeBase64url(credential.response.clientDataJSON),
        attestationObject: encodeBase64url(credential.response.attestationObject),
        transports: credential.response.getTransports?.() || []
      }
    };
    return api("/v1/webauthn/registration/verify", { method: "POST", body: { challenge_id: challengeID, credential: response } });
  }

  async function verifyAccountPasskey(purpose = {}) {
    await ensureSession();
    if (!window.isSecureContext || !navigator.credentials?.get || !window.PublicKeyCredential) {
      throw new Error("Passkeys need a supported browser on this secure site.");
    }
    const { challenge_id: challengeID, options } = await api("/v1/webauthn/authentication/options", { method: "POST", body: purpose });
    const publicKey = {
      ...options,
      challenge: decodeBase64url(options.challenge),
      allowCredentials: (options.allowCredentials || []).map((item) => ({ ...item, id: decodeBase64url(item.id) }))
    };
    const credential = await navigator.credentials.get({ publicKey });
    if (!(credential instanceof PublicKeyCredential)) throw new Error("The browser did not return a passkey assertion.");
    const response = {
      id: credential.id,
      rawId: encodeBase64url(credential.rawId),
      type: credential.type,
      authenticatorAttachment: credential.authenticatorAttachment || undefined,
      clientExtensionResults: credential.getClientExtensionResults(),
      response: {
        clientDataJSON: encodeBase64url(credential.response.clientDataJSON),
        authenticatorData: encodeBase64url(credential.response.authenticatorData),
        signature: encodeBase64url(credential.response.signature),
        userHandle: credential.response.userHandle ? encodeBase64url(credential.response.userHandle) : undefined
      }
    };
    return api("/v1/webauthn/authentication/verify", { method: "POST", body: { challenge_id: challengeID, credential: response } });
  }

  async function getInstalledInventory(args = {}) {
    const deviceID = selectedDeviceID(args);
    await ensureSession();
    const rows = [];
    let payload = null;
    let cursor = null;
    for (let page = 0; page < 256; page++) {
      const params = new URLSearchParams({ limit: "200" });
      if (deviceID) params.set("device_id", deviceID);
      if (cursor) params.set("cursor", cursor);
      const nextPage = await api(`/v1/library?${params}`);
      if (!payload) payload = nextPage;
      else if (nextPage.generation?.generation_id !== payload.generation?.generation_id ||
               nextPage.device?.device_id !== payload.device?.device_id) {
        throw new Error("The account inventory changed while it was being read. Compare again.");
      }
      rows.push(...(Array.isArray(nextPage.records) ? nextPage.records : []));
      cursor = nextPage.next_cursor || null;
      if (!cursor) break;
      if (page === 255) throw new Error("The account inventory is too large to compare in one session.");
    }
    payload ||= { device: null, generation: null };
    const query = String(args.search || "").trim().toLowerCase();
    const matches = query ? rows.filter((row) => `${row.name} ${row.bundleIdentifier || ""}`.toLowerCase().includes(query)) : rows;
    return {
      device: payload.device ? {
        name: payload.device.display_name, device_id: payload.device.device_id,
        last_seen_at: payload.device.last_seen_at || null
      } : null,
      generation: payload.generation ? {
        generation_id: payload.generation.generation_id,
        observed_at: payload.generation.observed_at,
        record_count: payload.generation.record_count
      } : null,
      count: matches.length,
      records: (args.full_snapshot === true ? matches : matches.slice(0, 100)).map((row) => ({
        record_id: row.id,
        name: row.name, format: row.format, version: row.version || null,
        bundle_identifier: row.bundleIdentifier || row.bundle_identifier || null,
        metadata_source: row.metadataSource
      })),
      truncated: matches.length > 100,
      notice: "Installed inventory is from the last complete scan; this is not an update check."
    };
  }

  async function getPluginStatus(args = {}) {
    const deviceID = selectedDeviceID(args);
    await ensureSession();
    const params = new URLSearchParams();
    if (deviceID) params.set("device_id", deviceID);
    const payload = await api(`/v1/status-summary${params.size ? `?${params}` : ""}`);
    const query = String(args.search || "").trim().toLowerCase();
    const records = Array.isArray(payload.records) ? payload.records : [];
    const matches = query ? records.filter((row) => `${row.name} ${row.format}`.toLowerCase().includes(query)) : records;
    return {
      rule_version: payload.rule_version,
      counts: payload.counts || {},
      raw_counts: payload.raw_counts || {},
      count: matches.length,
      records: matches.slice(0, 100).map((row) => ({
        device: row.device_name, name: row.name, format: row.format,
        bundle_identifier: row.bundle_identifier || null,
        status: row.status, raw_status: row.raw_status,
        installed_version: row.installed_version || null,
        latest_version: row.latest_version || null,
        source_type: row.source_type || null,
        comparison_reason: row.comparison_reason || null,
        checked_at: row.checked_at || null,
        last_good_at: row.last_good_at || null,
        last_good_latest_version: row.last_good_latest_version || null,
        freshness_ttl_seconds: row.freshness_ttl_seconds,
        error_code: row.error_code || null,
        route: row.route || null,
        stale: Boolean(row.stale), paid_upgrade: Boolean(row.paid_upgrade),
        snoozed: Boolean(row.snoozed), snooze_until: row.snooze_until || null,
        snooze_reason: row.snooze_reason || null, hidden: Boolean(row.hidden), pinned: Boolean(row.pinned),
        marked_up_to_date: Boolean(row.marked_up_to_date),
        marked_latest_version: row.marked_latest_version || null, marked_at: row.marked_at || null
      })),
      notice: "Statuses are only as current as their recorded source observation. Unknown or stale results are never treated as up to date."
    };
  }

  async function requestPluginReveal(args = {}) {
    await ensureSession();
    if (typeof args.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.device_id) ||
        typeof args.record_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.record_id)) {
      throw new Error("Choose one current inventory record and device first.");
    }
    return api("/v1/actions", { method: "POST", body: {
      device_id: args.device_id, kind: "reveal", record_ids: [args.record_id],
      idempotency_key: crypto.randomUUID()
    } });
  }

  async function getPluginActionPreview(args = {}) {
    await ensureSession();
    if (typeof args.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.device_id) ||
        typeof args.record_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.record_id) ||
        !["reveal", "open_vendor_site", "launch_hub", "move_to_unused"].includes(args.kind)) {
      throw new Error("Choose one supported action, current inventory record and device.");
    }
    const params = new URLSearchParams({ device_id: args.device_id, record_id: args.record_id, kind: args.kind });
    return api(`/v1/actions/preview?${params}`);
  }

  async function requestPluginVendorSite(args = {}) {
    await ensureSession();
    if (typeof args.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.device_id) ||
        typeof args.record_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.record_id)) {
      throw new Error("Choose one current inventory record and device first.");
    }
    return api("/v1/actions", { method: "POST", body: {
      device_id: args.device_id, kind: "open_vendor_site", record_ids: [args.record_id],
      idempotency_key: crypto.randomUUID()
    } });
  }

  async function requestPluginHubLaunch(args = {}) {
    await ensureSession();
    if (typeof args.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.device_id) ||
        typeof args.record_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.record_id)) {
      throw new Error("Choose one current inventory record and device first.");
    }
    return api("/v1/actions", { method: "POST", body: {
      device_id: args.device_id, kind: "launch_hub", record_ids: [args.record_id],
      idempotency_key: crypto.randomUUID()
    } });
  }

  async function requestPluginMoveToUnused(args = {}) {
    await ensureSession();
    if (typeof args.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.device_id) ||
        typeof args.record_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.record_id)) {
      throw new Error("Choose one current inventory record and device first.");
    }
    return api("/v1/actions", { method: "POST", body: {
      device_id: args.device_id, kind: "move_to_unused", record_ids: [args.record_id],
      idempotency_key: crypto.randomUUID()
    } });
  }

  async function getPluginActionResult(args = {}) {
    await ensureSession();
    if (typeof args.operation_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.operation_id)) {
      throw new Error("Provide a valid action ID.");
    }
    return api(`/v1/actions/${encodeURIComponent(args.operation_id)}`);
  }

  async function cancelPluginAction(operationID) {
    await ensureSession();
    return api(`/v1/actions/${encodeURIComponent(operationID)}/cancel`, { method: "POST", body: {} });
  }

  async function retryPluginAction(operationID, recordID) {
    await ensureSession();
    if (typeof operationID !== "string" || !/^[0-9a-f-]{36}$/i.test(operationID) ||
        typeof recordID !== "string" || !/^[0-9a-f-]{36}$/i.test(recordID)) {
      throw new Error("This action cannot be retried from the current inventory.");
    }
    return api(`/v1/actions/${encodeURIComponent(operationID)}/retry`, { method: "POST", body: {
      item_ids: [recordID], idempotency_key: crypto.randomUUID()
    } });
  }

  function addToolDefinitions() {
    if (typeof TOOL_DEFS === "undefined" || !Array.isArray(TOOL_DEFS)) return;
    for (const tool of TOOL_DEFS) {
      if (tool.name === "list_plugins" || tool.name === "get_library") {
        tool.description = `Reference catalogue only. This does not verify which plug-ins are installed. ${tool.description || ""}`;
      }
    }
    if (!TOOL_DEFS.some((tool) => tool.name === "list_installed_plugins")) {
      TOOL_DEFS.push({
        type: "function", name: "list_installed_plugins",
        description: "List plug-ins observed in the selected Mac's last complete authenticated inventory. This is not an update check. Never claim an install or update from this result alone.",
        parameters: { type: "object", properties: {
          search: { type: "string" }, device_id: { type: "string" }
        }, required: [] }
      });
    }
    if (!TOOL_DEFS.some((tool) => tool.name === "get_plugin_status")) {
      TOOL_DEFS.push({
        type: "function", name: "get_plugin_status",
        description: "Read raw update observations for the selected Mac from AIMM's account API. Report the selected device and check time. Unknown or stale observations are not up to date; this tool does not initiate a vendor check.",
        parameters: { type: "object", properties: {
          search: { type: "string" }, device_id: { type: "string" }
        }, required: [] }
      });
    }
    if (!TOOL_DEFS.some((tool) => tool.name === "request_plugin_reveal")) {
      TOOL_DEFS.push({
        type: "function", name: "request_plugin_reveal",
        description: "Request that the paired Mac show one installed plug-in in Finder. This creates a pending local request; the Mac displays its exact path and waits for local confirmation. It does not move or change a file.",
        parameters: { type: "object", properties: {
          device_id: { type: "string" }, record_id: { type: "string" }
        }, required: ["device_id", "record_id"] }
      });
    }
    if (!TOOL_DEFS.some((tool) => tool.name === "get_plugin_action_preview")) {
      TOOL_DEFS.push({
        type: "function", name: "get_plugin_action_preview",
        description: "Preview a named local action for one current installed item. Returns a redacted summary only, never a path, URL or executable command. This does not queue or execute the action; the Mac still requires local confirmation.",
        parameters: { type: "object", properties: {
          device_id: { type: "string" }, record_id: { type: "string" },
          kind: { type: "string", enum: ["reveal", "open_vendor_site", "launch_hub", "move_to_unused"] }
        }, required: ["device_id", "record_id", "kind"] }
      });
    }
    if (!TOOL_DEFS.some((tool) => tool.name === "get_action_result")) {
      TOOL_DEFS.push({
        type: "function", name: "get_action_result",
        description: "Read a redacted summary for a pending or finished local action. Never returns exact file paths.",
        parameters: { type: "object", properties: { operation_id: { type: "string" } }, required: ["operation_id"] }
      });
    }
  }

  function setAccountToolsEnabled(enabled) {
    if (typeof TOOL_DEFS !== "undefined" && Array.isArray(TOOL_DEFS)) {
      if (enabled) {
        if (!baselineToolDefinitions) {
          baselineToolDefinitions = new Set(TOOL_DEFS);
          baselineToolDescriptions = new Map(TOOL_DEFS.map((tool) => [tool, tool.description]));
        }
        addToolDefinitions();
      } else if (baselineToolDefinitions) {
        for (let i = TOOL_DEFS.length - 1; i >= 0; i--) {
          if (!baselineToolDefinitions.has(TOOL_DEFS[i])) TOOL_DEFS.splice(i, 1);
        }
        for (const [tool, description] of baselineToolDescriptions) tool.description = description;
      }
    }

    if (enabled && typeof window.handleToolCall === "function" && !accountToolHandler) {
      originalToolHandler = window.handleToolCall;
      accountToolHandler = async function (name, args) {
        if (name === "list_installed_plugins") return getInstalledInventory(args || {});
        if (name === "get_plugin_status") return getPluginStatus(args || {});
        if (name === "get_plugin_action_preview") return getPluginActionPreview(args || {});
        if (name === "request_plugin_reveal") return requestPluginReveal(args || {});
        if (name === "get_action_result") return getPluginActionResult(args || {});
        return originalToolHandler(name, args);
      };
      window.handleToolCall = accountToolHandler;
    } else if (!enabled && accountToolHandler && window.handleToolCall === accountToolHandler) {
      window.handleToolCall = originalToolHandler;
      originalToolHandler = null;
      accountToolHandler = null;
    }
  }

  function showInventoryPreview(host, payload, preferences = { marks: [] }) {
    host.replaceChildren();
    const heading = text("h3", "Account inventory preview");
    const localRows = (() => {
      try {
        const rows = JSON.parse(localStorage.getItem("aimmPluginInventoryRows_v1") || "[]");
        return Array.isArray(rows) ? rows : [];
      } catch { return []; }
    })();
    host.append(heading, text("p", `Local browser scan: ${localRows.length} entries. Account API: ${payload.generation?.record_count ?? 0} entries. Comparison uses bundle identifier and format; it does not upload the browser scan.`));
    if (!payload.generation) {
      host.append(text("p", "No complete account inventory has been synced for this account yet."));
      return;
    }
    const parity = compareInventoryRows(localRows, payload.records);
    host.append(text("p", `Parity: ${parity.matched} matching entries · ${parity.localOnly.length} only in browser · ${parity.accountOnly.length} only in account · ${parity.versionMismatches.length} version differences.`));
    for (const row of parity.localOnly.slice(0, 5)) host.append(text("p", `Browser only: ${row.name || "Unknown plug-in"} · ${row.format || "unknown format"}`));
    for (const row of parity.accountOnly.slice(0, 5)) host.append(text("p", `Account only: ${row.name || "Unknown plug-in"} · ${row.format || "unknown format"}`));
    for (const row of parity.versionMismatches.slice(0, 5)) host.append(text("p", `Version difference: ${row.name} · ${row.format} · browser ${row.localVersion} / account ${row.accountVersion}`));
    host.append(text("p", `${payload.device?.name || "Selected Mac"} · last API contact ${payload.device?.last_seen_at || "unknown"} · inventory observed ${payload.generation.observed_at} · generation ${payload.generation.generation_id}`));
    const counts = new Map();
    for (const record of payload.records) counts.set(record.format, (counts.get(record.format) || 0) + 1);
    host.append(text("p", Array.from(counts, ([format, count]) => `${format}: ${count}`).join(" · ") || "No inventory rows."));
    const marksByTarget = new Map((preferences.marks || []).filter((mark) => mark.scope === "product")
      .map((mark) => [mark.target_key, {
        favorite: Boolean(mark.favorite), pinned: Boolean(mark.pinned), hidden: Boolean(mark.hidden),
        tags: Array.isArray(mark.tags) ? mark.tags : [], snooze_until: mark.snooze_until || null,
        snooze_reason: mark.snooze_reason || null,
        marked_latest_version: mark.marked_latest_version || null, marked_at: mark.marked_at || null,
        revision: Number(mark.revision) || 0
      }]));
    const list = document.createElement("ul");
    list.style.maxHeight = "260px";
    list.style.overflow = "auto";
    for (const record of payload.records.slice(0, 100)) {
      const item = document.createElement("li");
      item.append(text("span", `${record.name} · ${record.format}${record.version ? ` · ${record.version}` : ""} `));
      const reveal = text("button", "Request reveal on Mac");
      reveal.type = "button";
      const bundleIdentifier = (record.bundle_identifier || record.bundleIdentifier || "").toLowerCase();
      const vendorSiteSupported = ["fabfilter", "voxengo"].some((vendor) =>
        bundleIdentifier.includes(vendor) || record.name.toLowerCase().startsWith(`${vendor} `)
      ) || (bundleIdentifier.includes("u-he") &&
        ["diva", "hive 2", "hive2", "zebra 3", "zebra3"].includes(record.name.toLowerCase().replace(/\s+/g, " ").trim()));
      const vendorSite = text("button", "Open vendor page on Mac");
      vendorSite.type = "button";
      const launchHub = text("button", "Open hub app on Mac");
      launchHub.type = "button";
      const actionStatus = text("div", "");
      const targetKey = record.bundle_identifier || record.bundleIdentifier || record.name;
      let currentMark = marksByTarget.get(targetKey) || {
        favorite: false, pinned: false, hidden: false, tags: [], snooze_until: null, snooze_reason: null, revision: 0
      };
      const snoozeStatus = text("span", "");
      const refreshSnoozeStatus = () => {
        const active = currentMark.snooze_until && Date.parse(currentMark.snooze_until) > Date.now();
        snoozeStatus.textContent = active
          ? `Snoozed until ${new Date(currentMark.snooze_until).toLocaleString()} · ${currentMark.snooze_reason || "No reason added"}`
          : "No active snooze";
      };
      refreshSnoozeStatus();
      const saveMark = async (patch) => {
        const next = { ...currentMark, ...patch };
        const saved = await api("/v1/preferences/marks", { method: "PUT", body: {
          scope: "product", target_key: targetKey,
          favorite: next.favorite, pinned: next.pinned, hidden: next.hidden,
          tags: next.tags, snooze_until: next.snooze_until, snooze_reason: next.snooze_reason,
          marked_latest_version: next.marked_latest_version || null,
          expected_revision: currentMark.revision
        } });
        currentMark = { ...next, marked_latest_version: saved.marked_latest_version, marked_at: saved.marked_at, revision: saved.revision };
        marksByTarget.set(targetKey, currentMark);
        favorite.textContent = currentMark.favorite ? "Unfavourite" : "Favourite";
        hidden.textContent = currentMark.hidden ? "Unhide" : "Mark hidden";
        tagInput.value = currentMark.tags.join(", ");
        snoozeReason.value = currentMark.snooze_reason || "";
        refreshSnoozeStatus();
        actionStatus.textContent = "Account preference saved.";
      };
      const favorite = text("button", currentMark.favorite ? "Unfavourite" : "Favourite");
      favorite.type = "button";
      favorite.addEventListener("click", async () => {
        favorite.disabled = true;
        try { await saveMark({ favorite: !currentMark.favorite }); }
        catch (error) { actionStatus.textContent = error.message; }
        finally { favorite.disabled = false; }
      });
      const hidden = text("button", currentMark.hidden ? "Unhide" : "Mark hidden");
      hidden.type = "button";
      hidden.addEventListener("click", async () => {
        hidden.disabled = true;
        try { await saveMark({ hidden: !currentMark.hidden }); }
        catch (error) { actionStatus.textContent = error.message; }
        finally { hidden.disabled = false; }
      });
      const tagInput = document.createElement("input");
      tagInput.type = "text";
      tagInput.maxLength = 800;
      tagInput.placeholder = "Tags, comma separated";
      tagInput.setAttribute("aria-label", `Tags for ${record.name}`);
      tagInput.value = currentMark.tags.join(", ");
      const saveTags = text("button", "Save tags");
      saveTags.type = "button";
      saveTags.addEventListener("click", async () => {
        const tags = Array.from(new Set(tagInput.value.split(",").map((tag) => tag.trim()).filter(Boolean)));
        if (tags.length > 20 || tags.some((tag) => tag.length > 48)) {
          actionStatus.textContent = "Use up to 20 tags, each 48 characters or fewer.";
          return;
        }
        saveTags.disabled = true;
        try { await saveMark({ tags }); }
        catch (error) { actionStatus.textContent = error.message; }
        finally { saveTags.disabled = false; }
      });
      const snoozeReason = document.createElement("input");
      snoozeReason.type = "text";
      snoozeReason.maxLength = 240;
      snoozeReason.placeholder = "Why snooze this update?";
      snoozeReason.setAttribute("aria-label", `Snooze reason for ${record.name}`);
      snoozeReason.value = currentMark.snooze_reason || "";
      const snooze = text("button", "Snooze for 1 week");
      snooze.type = "button";
      snooze.addEventListener("click", async () => {
        snooze.disabled = true;
        try {
          await saveMark({
            snooze_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            snooze_reason: snoozeReason.value.trim() || null
          });
        } catch (error) { actionStatus.textContent = error.message; }
        finally { snooze.disabled = false; }
      });
      const clearSnooze = text("button", "Clear snooze");
      clearSnooze.type = "button";
      clearSnooze.addEventListener("click", async () => {
        clearSnooze.disabled = true;
        try { await saveMark({ snooze_until: null, snooze_reason: null }); }
        catch (error) { actionStatus.textContent = error.message; }
        finally { clearSnooze.disabled = false; }
      });
      const previewAction = text("button", "Preview Finder action");
      previewAction.type = "button";
      previewAction.addEventListener("click", async () => {
        previewAction.disabled = true;
        try {
          const result = await getPluginActionPreview({ device_id: payload.device.device_id, record_id: record.record_id, kind: "reveal" });
          actionStatus.textContent = result.preview.summary;
        } catch (error) { actionStatus.textContent = error.message; }
        finally { previewAction.disabled = false; }
      });
      const actionControls = document.createElement("span");
      let currentOperationID = null;
      const checkAction = text("button", "Check action status");
      checkAction.type = "button";
      checkAction.addEventListener("click", async () => {
        if (!currentOperationID) return;
        checkAction.disabled = true;
        try {
          const action = await getPluginActionResult({ operation_id: currentOperationID });
          actionStatus.textContent = `Action ${action.state}${action.receipt?.item_statuses?.length ? ` · ${action.receipt.item_statuses.join(", ")}` : ""}`;
          actionControls.replaceChildren(checkAction);
          if (action.state === "claimed" && action.preview_digest && action.preview_expires_at) {
            const viewPaths = text("button", "View exact path with passkey");
            viewPaths.type = "button";
            viewPaths.addEventListener("click", async () => {
              viewPaths.disabled = true;
              try {
                const verified = await verifyAccountPasskey({
                  purpose: "action_preview_unlock", operation_id: currentOperationID, preview_digest: action.preview_digest
                });
                const exact = await api(`/v1/actions/${encodeURIComponent(currentOperationID)}/owner-preview`, {
                  headers: { "x-action-preview-capability": verified.capability }
                });
                const item = exact.preview.items[0];
                actionStatus.replaceChildren(
                  text("strong", "Exact preview viewed"),
                  text("div", `${item.name} · ${item.format}${item.version ? ` · ${item.version}` : ""}`),
                  text("div", `Source: ${item.source_display_path}`),
                  ...(item.destination_display_path ? [text("div", `Destination: ${item.destination_display_path}`)] : [])
                );
                if (PASSKEY_CONFIRMED_ACTIONS.has(action.kind)) {
                  const confirmAction = text("button", "Confirm this action with passkey");
                  confirmAction.type = "button";
                  confirmAction.addEventListener("click", async () => {
                    confirmAction.disabled = true;
                    try {
                      const confirmed = await verifyAccountPasskey({
                        purpose: "action_confirm", operation_id: currentOperationID, preview_digest: action.preview_digest
                      });
                      if (confirmed.confirmed_operation_id !== currentOperationID || confirmed.preview_digest !== action.preview_digest) {
                        throw new Error("The passkey confirmation did not match this exact action preview.");
                      }
                      actionStatus.replaceChildren(text("strong", "Action confirmed"),
                        text("div", "The paired Mac receives this exact-preview authorization when it checks for actions."));
                    } catch (error) {
                      actionStatus.append(text("div", error.name === "NotAllowedError" ? "Passkey confirmation was cancelled." : error.message));
                      confirmAction.disabled = false;
                    }
                  });
                  actionStatus.append(confirmAction);
                }
                viewPaths.textContent = "Path preview used";
                setTimeout(() => {
                  actionStatus.replaceChildren(text("span", "The exact path view has expired. Check the action again to request a new preview."));
                }, 2 * 60_000);
              } catch (error) {
                actionStatus.textContent = error.name === "NotAllowedError" ? "Passkey preview was cancelled." : error.message;
                viewPaths.disabled = false;
              }
            });
            actionControls.append(viewPaths);
          }
          if (action.state === "requested") {
            const cancel = text("button", "Cancel pending action");
            cancel.type = "button";
            cancel.addEventListener("click", async () => {
              cancel.disabled = true;
              try {
                await cancelPluginAction(currentOperationID);
                actionStatus.textContent = "Action cancelled before the Mac claimed it.";
                actionControls.replaceChildren(checkAction);
              } catch (error) {
                cancel.disabled = false;
                cancel.textContent = error.message;
              }
            });
            actionControls.append(cancel);
          }
          if (action.state === "failed" && action.receipt?.retryable) {
            const retry = text("button", "Retry failed action");
            retry.type = "button";
            retry.addEventListener("click", async () => {
              retry.disabled = true;
              try {
                const child = await retryPluginAction(currentOperationID, record.record_id);
                currentOperationID = child.operation_id;
                actionStatus.textContent = `Retry requested · ${child.state}`;
                retry.textContent = "Retry queued";
              } catch (error) {
                retry.disabled = false;
                retry.textContent = error.message;
              }
            });
            actionControls.append(retry);
          }
        } catch (error) {
          actionStatus.textContent = error.message;
        } finally { checkAction.disabled = false; }
      });
      reveal.addEventListener("click", async () => {
        reveal.disabled = true;
        try {
          const action = await requestPluginReveal({ device_id: payload.device.device_id, record_id: record.record_id });
          currentOperationID = action.operation_id;
          reveal.textContent = `Requested · ${action.state}`;
          actionControls.replaceChildren(checkAction);
        } catch (error) { reveal.disabled = false; reveal.textContent = error.message; }
      });
      vendorSite.addEventListener("click", async () => {
        vendorSite.disabled = true;
        try {
          const action = await requestPluginVendorSite({ device_id: payload.device.device_id, record_id: record.record_id });
          currentOperationID = action.operation_id;
          vendorSite.textContent = `Requested · ${action.state}`;
          actionControls.replaceChildren(checkAction);
        } catch (error) { vendorSite.disabled = false; vendorSite.textContent = error.message; }
      });
      launchHub.addEventListener("click", async () => {
        launchHub.disabled = true;
        try {
          const action = await requestPluginHubLaunch({ device_id: payload.device.device_id, record_id: record.record_id });
          currentOperationID = action.operation_id;
          launchHub.textContent = `Requested · ${action.state}`;
          actionControls.replaceChildren(checkAction);
        } catch (error) { launchHub.disabled = false; launchHub.textContent = error.message; }
      });
      const moveToUnused = text("button", "Move to Unused…");
      moveToUnused.type = "button";
      moveToUnused.addEventListener("click", async () => {
        moveToUnused.disabled = true;
        try {
          const action = await requestPluginMoveToUnused({ device_id: payload.device.device_id, record_id: record.record_id });
          currentOperationID = action.operation_id;
          moveToUnused.textContent = `Requested · ${action.state}`;
          actionControls.replaceChildren(checkAction);
          actionStatus.textContent = "The Mac will ask you to choose the Unused folder. The exact move requires a passkey and a separate local confirmation.";
        } catch (error) { moveToUnused.disabled = false; moveToUnused.textContent = error.message; }
      });
      item.append(favorite, hidden, tagInput, saveTags, reveal);
      item.append(snoozeReason, snooze, clearSnooze, snoozeStatus);
      item.append(previewAction);
      item.append(launchHub);
      item.append(moveToUnused);
      if (vendorSiteSupported) item.append(vendorSite);
      item.append(actionStatus, actionControls);
      list.append(item);
    }
    host.append(list);
  }

  async function renderPairingApproval(host) {
    const pairingID = new URL(location.href).searchParams.get("pairing");
    if (!pairingID) return;
    host.replaceChildren(text("h3", "Approve companion pairing"));
    if (!/^[A-Za-z0-9_-]{40,64}$/.test(pairingID)) {
      host.append(text("p", "The pairing link is invalid or has expired."));
      return;
    }
    try {
      await ensureSession();
      const pairing = await api(`/v1/pairings/${encodeURIComponent(pairingID)}`);
      host.append(text("p", `${pairing.device_name} wants to pair with this account.`));
      const phrase = text("p", pairing.verification_phrase);
      phrase.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
      phrase.style.fontWeight = "700";
      host.append(phrase, text("p", `Expires ${pairing.expires_at}. Compare this phrase with the companion window before approving.`));
      const approve = text("button", "Approve this Mac");
      approve.type = "button";
      approve.addEventListener("click", async () => {
        approve.disabled = true;
        try {
          await api(`/v1/pairings/${encodeURIComponent(pairingID)}/approve`, {
            method: "POST", body: { verification_phrase: pairing.verification_phrase }
          });
          host.append(text("p", "Pairing approved. The Mac will finish pairing securely."));
        } catch (error) {
          approve.disabled = false;
          host.append(text("p", error.message));
        }
      });
      host.append(approve);
    } catch (error) {
      const signIn = text("button", "Sign in to approve pairing");
      signIn.type = "button";
      signIn.addEventListener("click", beginLogin);
      host.append(text("p", error.message), signIn);
    }
  }

  function mount() {
    const library = document.getElementById("library");
    if (!library) return;
    const style = document.createElement("style");
    style.textContent = `#aimm-account-preview{display:none;margin:14px auto;max-width:1520px;padding:16px;border:1px solid #4b5563;border-radius:12px;background:#111827;color:#f3f4f6}#aimm-account-preview.is-enabled{display:block}#aimm-account-preview button{padding:8px 12px;border:1px solid #6b7280;border-radius:8px;background:#1f2937;color:inherit;cursor:pointer}#aimm-account-preview input{min-width:280px;padding:8px;border:1px solid #4b5563;border-radius:7px;background:#030712;color:inherit}#aimm-account-preview .account-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}#aimm-account-preview .account-result{margin-top:12px}#aimm-account-preview li{padding:3px 0}`;
    library.prepend(style);
    const card = document.createElement("section");
    card.id = "aimm-account-preview";
    card.setAttribute("aria-label", "Account-backed Plugin Library preview");
    const toggle = text("button", localStorage.getItem(FLAG_KEY) === "true" ? "Hide account preview" : "Enable account preview");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", String(localStorage.getItem(FLAG_KEY) === "true"));
    const root = document.createElement("div");
    const title = text("h2", "AIMM account inventory · preview");
    const help = text("p", "This preview reads the last complete account snapshot. The existing Library remains available as fallback. It does not perform update checks or change files; Finder reveal requests require a separate confirmation on the paired Mac.");
    const row = document.createElement("div");
    row.className = "account-row";
    const apiInput = document.createElement("input");
    apiInput.type = "url";
    apiInput.placeholder = "Non-production Library API URL (https://… )";
    apiInput.value = apiBase();
    apiInput.setAttribute("aria-label", "Non-production Library API URL");
    const saveAPI = text("button", "Save API URL");
    saveAPI.type = "button";
    const signIn = text("button", "Sign in");
    signIn.type = "button";
    const signOut = text("button", "Sign out");
    signOut.type = "button";
    const refresh = text("button", "Compare inventory");
    refresh.type = "button";
    const statusButton = text("button", "Show status observations");
    statusButton.type = "button";
    const preferencesButton = text("button", "Account preferences");
    preferencesButton.type = "button";
    const passkeyButton = text("button", "Set up a passkey");
    passkeyButton.type = "button";
    const verifyPasskeyButton = text("button", "Verify passkey");
    verifyPasskeyButton.type = "button";
    row.append(apiInput, saveAPI, signIn, signOut, refresh, statusButton, preferencesButton, passkeyButton, verifyPasskeyButton);
    const notice = text("p", "Feature flag is off. Nothing is read from the account API until you enable this preview.");
    const pairing = document.createElement("div");
    pairing.className = "account-result";
    const result = document.createElement("div");
    result.className = "account-result";
    const statusResult = document.createElement("div");
    statusResult.className = "account-result";
    const preferencesResult = document.createElement("div");
    preferencesResult.className = "account-result";
    const passkeyResult = document.createElement("div");
    passkeyResult.className = "account-result";
    root.append(title, help, row, notice, pairing, result, statusResult, preferencesResult, passkeyResult);
    card.append(toggle, root);
    const shell = library.querySelector(".inv-shell");
    if (shell) library.insertBefore(card, shell);
    else library.append(card);

    const setEnabled = (enabled) => {
      card.classList.toggle("is-enabled", enabled);
      toggle.textContent = enabled ? "Hide account preview" : "Enable account preview";
      toggle.setAttribute("aria-expanded", String(enabled));
      localStorage.setItem(FLAG_KEY, String(enabled));
      setAccountToolsEnabled(enabled);
      notice.textContent = enabled ? "Account preview enabled. API reads require your sign-in." : "Feature flag is off. No account API reads will be made.";
      if (enabled) void renderPairingApproval(pairing);
    };
    toggle.addEventListener("click", () => setEnabled(!card.classList.contains("is-enabled")));
    saveAPI.addEventListener("click", () => {
      try {
        localStorage.setItem(API_KEY, cleanApiBase(apiInput.value));
        notice.textContent = "Development API URL saved in this browser.";
      } catch (error) { notice.textContent = error.message; }
    });
    signIn.addEventListener("click", beginLogin);
    signOut.addEventListener("click", async () => {
      try {
        await ensureSession();
        await api("/v1/session", { method: "DELETE" });
        csrfToken = null; sessionInfo = null;
        notice.textContent = "Signed out of the Library API.";
      } catch (error) { notice.textContent = error.message; }
      const logout = new URL("v2/logout", OIDC_ISSUER);
      logout.search = new URLSearchParams({ client_id: OIDC_CLIENT_ID, returnTo: redirectUri() }).toString();
      location.assign(logout.toString());
    });
    refresh.addEventListener("click", async () => {
      result.replaceChildren(text("p", "Loading the account snapshot…"));
      try {
        const snapshot = await getInstalledInventory({ full_snapshot: true });
        const preferences = await api("/v1/preferences");
        showInventoryPreview(result, snapshot, preferences);
      }
      catch (error) {
        result.replaceChildren(text("p", error.message));
        const login = text("button", "Sign in");
        login.type = "button"; login.addEventListener("click", beginLogin); result.append(login);
      }
    });
    statusButton.addEventListener("click", async () => {
      statusResult.replaceChildren(text("p", "Loading current observations…"));
      try {
        const payload = await getPluginStatus({});
        const preferences = await api("/v1/preferences");
        const marksByTarget = new Map((preferences.marks || []).filter((mark) => mark.scope === "product")
          .map((mark) => [mark.target_key, { ...mark, tags: Array.isArray(mark.tags) ? mark.tags : [] }]));
        statusResult.replaceChildren(text("h3", "Status observations"), text("p", payload.notice));
        const summary = payload.counts || {};
        const rawSummary = payload.raw_counts || {};
        statusResult.append(text("p", `Raw updates: ${rawSummary.update || 0} · Free: ${summary.free_update || 0} · Paid: ${summary.paid_update || 0} · Actionable: ${summary.actionable_update || 0} · Stale: ${summary.stale || 0} · Unknown: ${summary.unchecked || 0}`));
        for (const row of payload.records.slice(0, 100)) {
          const observed = row.checked_at ? ` · checked ${row.checked_at} via ${row.source_type || "unknown source"}` : " · never checked";
          const lastGood = row.last_good_at ? ` · last good ${row.last_good_at}` : "";
          const error = row.error_code ? ` · ${row.error_code}` : "";
          const reason = row.comparison_reason ? ` · ${row.comparison_reason}` : "";
          const targetKey = row.bundle_identifier || row.name;
          const currentMark = marksByTarget.get(targetKey) || {
            favorite: false, pinned: false, hidden: false, tags: [], snooze_until: null,
            snooze_reason: null, marked_latest_version: null, marked_at: null, revision: 0
          };
          const markMessage = row.marked_up_to_date
            ? ` · marked up to date for ${row.marked_latest_version} since ${row.marked_at || "unknown"}`
            : currentMark.marked_latest_version && row.latest_version && currentMark.marked_latest_version !== row.latest_version
              ? ` · previous mark for ${currentMark.marked_latest_version} expired when version ${row.latest_version} appeared`
              : "";
          const line = document.createElement("div");
          const label = text("p", `${row.name} · ${row.format}: ${row.status} (raw ${row.raw_status})${observed}${lastGood}${row.latest_version ? ` · latest ${row.latest_version}` : ""}${markMessage}${reason}${error}`);
          line.append(label);
          if (row.raw_status === "update" && row.latest_version && targetKey) {
            const markButton = text("button", row.marked_up_to_date ? "Reset version mark" : "Mark this version up to date");
            markButton.type = "button";
            markButton.addEventListener("click", async () => {
              markButton.disabled = true;
              try {
                const nextVersion = row.marked_up_to_date ? null : row.latest_version;
                const saved = await api("/v1/preferences/marks", { method: "PUT", body: {
                  scope: "product", target_key: targetKey,
                  favorite: Boolean(currentMark.favorite), pinned: Boolean(currentMark.pinned), hidden: Boolean(currentMark.hidden),
                  tags: currentMark.tags, snooze_until: currentMark.snooze_until || null,
                  snooze_reason: currentMark.snooze_reason || null,
                  marked_latest_version: nextVersion, expected_revision: currentMark.revision || 0
                } });
                currentMark.marked_latest_version = saved.marked_latest_version;
                currentMark.marked_at = saved.marked_at;
                currentMark.revision = saved.revision;
                marksByTarget.set(targetKey, currentMark);
                row.marked_up_to_date = Boolean(nextVersion);
                row.marked_latest_version = nextVersion;
                row.marked_at = saved.marked_at;
                label.textContent = `${row.name} · ${row.format}: ${row.status} (raw ${row.raw_status})${observed}${lastGood}${row.latest_version ? ` · latest ${row.latest_version}` : ""}${nextVersion ? ` · marked up to date for ${nextVersion} since ${saved.marked_at}` : ""}${reason}${error}`;
                markButton.textContent = nextVersion ? "Reset version mark" : "Mark this version up to date";
              } catch (error) { label.textContent = error.message; }
              finally { markButton.disabled = false; }
            });
            line.append(markButton);
          }
          statusResult.append(line);
        }
      } catch (error) { statusResult.replaceChildren(text("p", error.message)); }
    });
    passkeyButton.addEventListener("click", async () => {
      passkeyButton.disabled = true;
      passkeyResult.replaceChildren(text("p", "Waiting for the browser to create your passkey…"));
      try {
        const saved = await registerAccountPasskey();
        passkeyResult.replaceChildren(text("p", `Passkey saved to this account. Active passkeys: ${saved.credential_count}.`));
      } catch (error) {
        passkeyResult.replaceChildren(text("p", error.name === "NotAllowedError" ? "Passkey setup was cancelled." : error.message));
      } finally { passkeyButton.disabled = false; }
    });
    verifyPasskeyButton.addEventListener("click", async () => {
      verifyPasskeyButton.disabled = true;
      passkeyResult.replaceChildren(text("p", "Waiting for passkey verification…"));
      try {
        const verified = await verifyAccountPasskey();
        passkeyResult.replaceChildren(text("p", `Passkey verified at ${verified.verified_at}.`));
      } catch (error) {
        passkeyResult.replaceChildren(text("p", error.name === "NotAllowedError" ? "Passkey verification was cancelled." : error.message));
      } finally { verifyPasskeyButton.disabled = false; }
    });
    preferencesButton.addEventListener("click", async () => {
      preferencesResult.replaceChildren(text("p", "Loading account preferences…"));
      try {
        await ensureSession();
        const saved = await api("/v1/preferences");
        const values = new Map((saved.settings || []).map((item) => [item.key, item]));
        preferencesResult.replaceChildren(text("h3", "Account preferences"));
        for (const [key, label, choices, fallback] of [
          ["check_cadence", "Check cadence", ["manual", "daily", "weekly", "monthly"], "manual"],
          ["appearance", "Appearance", ["system", "light", "dark"], "system"]
        ]) {
          const wrap = document.createElement("label");
          wrap.append(text("span", `${label}: `));
          const select = document.createElement("select");
          for (const choice of choices) { const option = text("option", choice); option.value = choice; select.append(option); }
          const previous = values.get(key);
          let currentRevision = previous?.revision || 0;
          select.value = previous?.value || fallback;
          const save = text("button", `Save ${label.toLowerCase()}`);
          save.type = "button";
          save.addEventListener("click", async () => {
            save.disabled = true;
            try {
              const updated = await api("/v1/preferences/settings", { method: "PUT", body: {
                key, value: select.value, expected_revision: currentRevision
              } });
              currentRevision = updated.revision;
              preferencesResult.append(text("span", " Saved."));
            } catch (error) { preferencesResult.append(text("span", ` ${error.message}`)); }
            save.disabled = false;
          });
          wrap.append(select, save);
          preferencesResult.append(wrap, document.createElement("br"));
        }
      } catch (error) { preferencesResult.replaceChildren(text("p", error.message)); }
    });

    void completeLoginFromCallback().then((completed) => {
      if (completed) {
        setEnabled(true);
        void renderPairingApproval(pairing);
        refresh.click();
      }
    }).catch((error) => { notice.textContent = error.message; });
    if (localStorage.getItem(FLAG_KEY) === "true") setEnabled(true);

  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
