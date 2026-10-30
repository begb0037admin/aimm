/* Stage 3 account-library preview. Feature flag is off until the owner enables it. */
(() => {
  "use strict";

  const OIDC_ISSUER = "https://dev-cxmqjc40zltqlx7l.us.auth0.com/";
  const OIDC_CLIENT_ID = "3EbH8eIpW9FxYvKoXIeYtRvhcGWGtwPA";
  const OIDC_AUDIENCE = "https://aimm-library-api-dev";
  const CANONICAL_ORIGIN = "https://aimixmasters.com";
  const APPROVED_AUTH_ORIGINS = new Set([
    CANONICAL_ORIGIN,
    "https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev"
  ]);
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
    const raw = String(value || "").trim();
    let parsed;
    try { parsed = new URL(raw, location.origin); }
    catch { throw new Error("Enter the approved Library API URL or a local loopback URL for development."); }
    const localLoopback = parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname);
    const sameOriginProxy = parsed.origin === location.origin &&
      parsed.pathname.replace(/\/$/, "") === "/account-api" &&
      !parsed.username && !parsed.password && !parsed.search && !parsed.hash;
    if (sameOriginProxy && APPROVED_AUTH_ORIGINS.has(location.origin)) {
      return location.origin + "/account-api";
    }
    if ((!localLoopback && (parsed.protocol !== "https:" || !APPROVED_API_ORIGINS.has(parsed.origin))) ||
        parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") {
      throw new Error("Enter the approved Library API URL or a local loopback URL for development.");
    }
    return parsed.origin;
  }

  function apiBase() {
    try {
      const stored = localStorage.getItem(API_KEY);
      if (!stored) return APPROVED_AUTH_ORIGINS.has(location.origin) ? location.origin + "/account-api" : "";
      const normalized = cleanApiBase(stored);
      const parsed = new URL(normalized);
      if (APPROVED_AUTH_ORIGINS.has(location.origin) && APPROVED_API_ORIGINS.has(parsed.origin)) {
        return location.origin + "/account-api";
      }
      return normalized;
    } catch {
      return "";
    }
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
    if (!APPROVED_AUTH_ORIGINS.has(location.origin)) {
      throw new Error("Sign-in is not allowed from this site origin.");
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

  function attachLoginHandler(button, errorHost, onStart = () => {}, onError = () => {}) {
    button.addEventListener("click", async () => {
      onStart();
      try { await beginLogin(); }
      catch (error) { errorHost.textContent = error.message; onError(error); }
    });
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
    if (typeof args.device_id !== "string" || args.device_id.length !== 36 ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(args.device_id)) {
      throw new Error("Choose a valid device ID before reading account data.");
    }
    return args.device_id.toLowerCase();
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

  async function verifyAccountPasskey(purpose = {}, progress = {}) {
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
    progress.onCredentialRequest?.();
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

  function beginPreparedPasskeyAssertion(options) {
    if (!window.isSecureContext || !navigator.credentials?.get || !window.PublicKeyCredential) {
      throw new Error("Passkeys need a supported browser on this secure site.");
    }
    const publicKey = {
      ...options,
      timeout: Math.min(Number(options.timeout) || 45_000, 45_000),
      challenge: decodeBase64url(options.challenge),
      allowCredentials: (options.allowCredentials || []).map((item) => ({ ...item, id: decodeBase64url(item.id) }))
    };
    return navigator.credentials.get({ publicKey, mediation: "required" });
  }

  function serializePasskeyAssertion(credential) {
    if (!(credential instanceof PublicKeyCredential)) throw new Error("The browser did not return a passkey assertion.");
    return {
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
      const nextRecordCount = nextPage.generation?.record_count;
      if (nextPage.generation && (!Number.isSafeInteger(nextRecordCount) || nextRecordCount < 0)) {
        throw new Error("The account inventory returned an invalid snapshot count. Compare again.");
      }
      if (!payload) payload = nextPage;
      else if (nextPage.generation?.generation_id !== payload.generation?.generation_id ||
               nextPage.device?.device_id !== payload.device?.device_id ||
               nextRecordCount !== payload.generation?.record_count) {
        throw new Error("The account inventory changed while it was being read. Compare again.");
      }
      rows.push(...(Array.isArray(nextPage.records) ? nextPage.records : []));
      cursor = nextPage.next_cursor || null;
      if (!cursor) break;
      if (page === 255) throw new Error("The account inventory is too large to compare in one session.");
    }
    payload ||= { device: null, generation: null };
    if (payload.generation && rows.length !== payload.generation.record_count) {
      throw new Error("The account inventory is incomplete. Compare again after the snapshot is available.");
    }
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
      records: args.count_only === true ? [] : (args.full_snapshot === true ? matches : matches.slice(0, 100)).map((row) => ({
        record_id: row.id,
        name: row.name, format: row.format, version: row.version || null,
        bundle_identifier: row.bundleIdentifier || row.bundle_identifier || null,
        publisher_name: row.publisherName || row.publisher_name || null,
        publisher_source: row.publisherSource || row.publisher_source || null,
        canonical_product_id: row.canonicalProductId || row.canonical_product_id || null,
        metadata_source: row.metadataSource || row.metadata_source || null
      })),
      truncated: args.count_only !== true && matches.length > 100,
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
    const matches = query ? records.filter((row) => `${row.name} ${row.format} ${row.publisher_name || ""} ${row.bundle_identifier || ""}`.toLowerCase().includes(query)) : records;
    return {
      rule_version: payload.rule_version,
      counts: payload.counts || {},
      raw_counts: payload.raw_counts || {},
      count: matches.length,
      records: (args.full_snapshot === true ? matches : matches.slice(0, 100)).map((row) => ({
        device_id: row.device_id, generation_id: row.generation_id, record_id: row.record_id,
        device: row.device_name, name: row.name, format: row.format,
        bundle_identifier: row.bundle_identifier || null,
        publisher_name: row.publisher_name || null, publisher_source: row.publisher_source || null,
        canonical_product_id: row.canonical_product_id || null,
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

  // Read-only page bridge for the inventory status scopes. It returns API
  // records with their device, generation and record IDs intact; it never
  // joins account observations to browser-scanned rows.
  window.aimmReadAccountPluginStatus = async (args = {}) => {
    if (!APPROVED_AUTH_ORIGINS.has(location.origin)) {
      throw new Error("Account status is not available from this preview origin. Open AIMM on an approved account page.");
    }
    return getPluginStatus({ ...args, full_snapshot: true });
  };

  // The Install Manager can request one official vendor-page action at a time.
  // The paired Companion still enforces the local owner confirmation.
  window.aimmRequestAccountVendorPage = async (args = {}) => {
    if (!APPROVED_AUTH_ORIGINS.has(location.origin)) {
      throw new Error("Vendor-page requests are not available from this preview origin.");
    }
    return requestPluginVendorSite(args);
  };
  window.aimmReadAccountPluginAction = async (args = {}) => {
    if (!APPROVED_AUTH_ORIGINS.has(location.origin)) {
      throw new Error("Action results are not available from this preview origin.");
    }
    return getPluginActionResult(args);
  };

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
        !["reveal", "open_vendor_site", "launch_hub", "move_to_unused", "restore"].includes(args.kind) ||
        (args.kind === "restore" && (typeof args.parent_move_operation_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.parent_move_operation_id)))) {
      throw new Error("Choose one supported action, current inventory record and device.");
    }
    const params = new URLSearchParams({ device_id: args.device_id, record_id: args.record_id, kind: args.kind });
    if (args.kind === "restore") params.set("parent_move_operation_id", args.parent_move_operation_id);
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
    const idempotencyKey = typeof args.idempotency_key === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(args.idempotency_key)
      ? args.idempotency_key : crypto.randomUUID();
    return api("/v1/actions", { method: "POST", body: {
      device_id: args.device_id, kind: "move_to_unused", record_ids: [args.record_id],
      idempotency_key: idempotencyKey
    } });
  }

  async function requestPluginRestore(args = {}) {
    await ensureSession();
    if (typeof args.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.device_id) ||
        typeof args.record_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.record_id) ||
        typeof args.parent_move_operation_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.parent_move_operation_id)) {
      throw new Error("Choose a valid completed move, item and device before restoring.");
    }
    return api("/v1/actions", { method: "POST", body: {
      device_id: args.device_id, kind: "restore", record_ids: [args.record_id],
      parent_move_operation_id: args.parent_move_operation_id,
      idempotency_key: crypto.randomUUID()
    } });
  }

  async function getRestorablePluginMoves(deviceID) {
    await ensureSession();
    if (typeof deviceID !== "string" || !/^[0-9a-f-]{36}$/i.test(deviceID)) {
      throw new Error("Choose a valid paired device first.");
    }
    const params = new URLSearchParams({ device_id: deviceID });
    const result = await api(`/v1/actions/restorable?${params}`);
    return Array.isArray(result.moves) ? result.moves : [];
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
        tool.description = `Reference catalogue only; it does not verify account ownership or installed state. For the signed-in Mac's installed inventory and count, call list_installed_plugins. ${tool.description || ""}`;
      }
    }
    if (!TOOL_DEFS.some((tool) => tool.name === "list_installed_plugins")) {
      TOOL_DEFS.push({
        type: "function", name: "list_installed_plugins",
        description: "List plug-ins observed in the selected Mac's last complete authenticated inventory. This is not an update check. Never claim an install or update from this result alone.",
        parameters: { type: "object", properties: {
          search: { type: "string" }, device_id: { type: "string" },
          count_only: { type: "boolean", description: "Return only the aggregate count and snapshot metadata; omit all plug-in records." }
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
    const restoreSection = document.createElement("section");
    restoreSection.append(text("h4", "Moved to Unused"));
    restoreSection.append(text("p", "Previously moved items stay out of installed inventory. A restore request returns the item to its recorded original location after passkey and Mac confirmation."));
    const listMoved = text("button", "Check items moved to Unused");
    listMoved.type = "button";
    const movedStatus = text("span", "");
    const movedList = document.createElement("ul");
    listMoved.addEventListener("click", async () => {
      listMoved.disabled = true;
      movedList.replaceChildren();
      try {
        const moved = await getRestorablePluginMoves(payload.device.device_id);
        movedStatus.textContent = moved.length ? `${moved.length} item(s) can be restored.` : "No verified moved items are currently available to restore.";
        for (const row of moved) {
          const item = document.createElement("li");
          item.append(text("span", `${row.name} · ${row.format}${row.version ? ` · ${row.version}` : ""} · moved ${row.moved_at} `));
          const restore = text("button", "Request restore on Mac");
          restore.type = "button";
          restore.addEventListener("click", async () => {
            restore.disabled = true;
            try {
              const operation = await requestPluginRestore({ device_id: row.device_id, record_id: row.record_id,
                parent_move_operation_id: row.operation_id });
              movedStatus.textContent = `Restore requested · ${operation.state}. Check for requests on the paired Mac.`;
              restore.textContent = "Restore requested";
            } catch (error) { restore.disabled = false; movedStatus.textContent = error.message; }
          });
          item.append(restore);
          movedList.append(item);
        }
      } catch (error) { movedStatus.textContent = error.message; }
      finally { listMoved.disabled = false; }
    });
    restoreSection.append(listMoved, movedStatus, movedList);
    host.append(restoreSection);
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
    const inventoryControls = document.createElement("div");
    inventoryControls.className = "account-row";
    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = "Search account inventory";
    search.setAttribute("aria-label", "Search account inventory by product or vendor");
    const formatFilter = document.createElement("select");
    formatFilter.setAttribute("aria-label", "Filter account inventory by format");
    const allFormats = document.createElement("option");
    allFormats.value = "";
    allFormats.textContent = "All formats";
    formatFilter.append(allFormats);
    const availableFormats = [...new Set(payload.records.map((record) => String(record.format || "Unknown").trim()))]
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    for (const format of availableFormats) {
      const option = document.createElement("option");
      option.value = format.toLowerCase();
      option.textContent = format;
      formatFilter.append(option);
    }
    const sortOrder = document.createElement("select");
    sortOrder.setAttribute("aria-label", "Sort account inventory");
    for (const [value, label] of [["", "Inventory order"], ["name", "Product name (A–Z)"],
      ["vendor", "Vendor (A–Z)"], ["format", "Format (A–Z)"]]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      sortOrder.append(option);
    }
    const tagFilter = document.createElement("select");
    tagFilter.setAttribute("aria-label", "Filter account inventory by tag");
    const inventoryResultCount = text("span", "");
    const hiddenToggle = text("button", "Show hidden (0)");
    hiddenToggle.type = "button";
    const favoriteToggle = text("button", "Show favourites (0)");
    favoriteToggle.type = "button";
    let showHidden = false;
    let favouritesOnly = false;
    const pageSize = 100;
    let pageIndex = 0;
    const paginationControls = document.createElement("div");
    paginationControls.className = "account-row";
    const previousPage = text("button", "Previous products");
    previousPage.type = "button";
    previousPage.setAttribute("aria-label", "Show previous account inventory products");
    const pageStatus = text("span", "");
    const nextPage = text("button", "Next products");
    nextPage.type = "button";
    nextPage.setAttribute("aria-label", "Show next account inventory products");
    const listRows = [];
    const refreshTagOptions = () => {
      const selected = tagFilter.value;
      const allTags = document.createElement("option");
      allTags.value = "";
      allTags.textContent = "All tags";
      tagFilter.replaceChildren(allTags);
      const tags = new Map();
      for (const row of listRows) for (const tag of row.tags()) {
        const normalized = tag.trim().toLocaleLowerCase();
        if (normalized && !tags.has(normalized)) tags.set(normalized, tag.trim());
      }
      for (const [value, label] of [...tags].sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: "base" }))) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        tagFilter.append(option);
      }
      tagFilter.value = tags.has(selected) ? selected : "";
    };
    const refreshProductList = () => {
      const hiddenCount = listRows.filter((row) => row.isHidden()).length;
      const favouriteCount = listRows.filter((row) => row.isFavorite()).length;
      hiddenToggle.textContent = `${showHidden ? "Hide" : "Show"} hidden (${hiddenCount})`;
      favoriteToggle.textContent = `${favouritesOnly ? "Show all products" : "Show favourites"} (${favouriteCount})`;
      const query = search.value.trim().toLocaleLowerCase();
      const selectedFormat = formatFilter.value;
      const selectedTag = tagFilter.value;
      const visibleRows = listRows.filter((row) => (showHidden || !row.isHidden()) &&
        (!favouritesOnly || row.isFavorite()) &&
        (!query || row.searchText.includes(query)) &&
        (!selectedFormat || row.format.toLowerCase() === selectedFormat) &&
        (!selectedTag || row.tags().some((tag) => tag.trim().toLocaleLowerCase() === selectedTag)));
      const sortKey = sortOrder.value;
      if (sortKey) {
        const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
        visibleRows.sort((a, b) => collator.compare(a[sortKey], b[sortKey]) || a.index - b.index);
      }
      inventoryResultCount.textContent = `${visibleRows.length} of ${listRows.length} products`;
      const pageCount = Math.ceil(visibleRows.length / pageSize);
      pageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));
      const start = pageIndex * pageSize;
      const pageRows = visibleRows.slice(start, start + pageSize);
      pageStatus.textContent = visibleRows.length ? `Showing ${start + 1}–${start + pageRows.length}` : "";
      previousPage.disabled = pageIndex === 0;
      nextPage.disabled = start + pageRows.length >= visibleRows.length;
      list.replaceChildren(...(pageRows.length ? pageRows.map((row) => row.renderItem()) : [text("li", "No products match these filters.")]));
    };
    const resetProductPage = () => { pageIndex = 0; refreshProductList(); };
    search.addEventListener("input", resetProductPage);
    formatFilter.addEventListener("change", resetProductPage);
    sortOrder.addEventListener("change", resetProductPage);
    tagFilter.addEventListener("change", resetProductPage);
    previousPage.addEventListener("click", () => {
      pageIndex = Math.max(0, pageIndex - 1);
      refreshProductList();
    });
    nextPage.addEventListener("click", () => {
      pageIndex += 1;
      refreshProductList();
    });
    hiddenToggle.addEventListener("click", () => {
      showHidden = !showHidden;
      resetProductPage();
    });
    favoriteToggle.addEventListener("click", () => {
      favouritesOnly = !favouritesOnly;
      resetProductPage();
    });
    for (const [index, record] of payload.records.entries()) {
      const targetKey = record.bundle_identifier || record.bundleIdentifier || record.name;
      let currentMark = marksByTarget.get(targetKey) || {
        favorite: false, pinned: false, hidden: false, tags: [], snooze_until: null, snooze_reason: null, revision: 0
      };
      const row = {
        item: null,
        index,
        name: String(record.name || ""),
        vendor: String(record.vendor || ""),
        format: String(record.format || "Unknown").trim(),
        searchText: [record.name, record.vendor, record.bundle_identifier, record.bundleIdentifier, record.version]
          .filter(Boolean).join(" ").toLocaleLowerCase(),
        tags: () => currentMark.tags,
        isHidden: () => currentMark.hidden,
        isFavorite: () => currentMark.favorite,
        renderItem: null
      };
      row.renderItem = () => {
      if (row.item) return row.item;
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
        refreshTagOptions();
        favorite.textContent = currentMark.favorite ? "Unfavourite" : "Favourite";
        pin.textContent = currentMark.pinned ? "Unpin" : "Pin";
        hidden.textContent = currentMark.hidden ? "Unhide" : "Mark hidden";
        tagInput.value = currentMark.tags.join(", ");
        snoozeReason.value = currentMark.snooze_reason || "";
        refreshSnoozeStatus();
        actionStatus.textContent = "Account preference saved.";
        refreshProductList();
      };
      const favorite = text("button", currentMark.favorite ? "Unfavourite" : "Favourite");
      favorite.type = "button";
      favorite.addEventListener("click", async () => {
        favorite.disabled = true;
        try { await saveMark({ favorite: !currentMark.favorite }); }
        catch (error) { actionStatus.textContent = error.message; }
        finally { favorite.disabled = false; }
      });
      const pin = text("button", currentMark.pinned ? "Unpin" : "Pin");
      pin.type = "button";
      pin.addEventListener("click", async () => {
        pin.disabled = true;
        try { await saveMark({ pinned: !currentMark.pinned }); }
        catch (error) { actionStatus.textContent = error.message; }
        finally { pin.disabled = false; }
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
      item.append(favorite, pin, hidden, tagInput, saveTags, reveal);
      item.append(snoozeReason, snooze, clearSnooze, snoozeStatus);
      item.append(previewAction);
      item.append(launchHub);
      item.append(moveToUnused);
      if (vendorSiteSupported) item.append(vendorSite);
      item.append(actionStatus, actionControls);
      row.item = item;
      return item;
      };
      listRows.push(row);
    }
    refreshTagOptions();
    refreshProductList();
    paginationControls.append(previousPage, pageStatus, nextPage);
    inventoryControls.append(search, formatFilter, tagFilter, sortOrder, inventoryResultCount, favoriteToggle, hiddenToggle);
    host.append(inventoryControls, list, paginationControls);
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
      const loginError = text("p", error.message);
      attachLoginHandler(signIn, loginError);
      host.append(loginError, signIn);
    }
  }

  function mount() {
    const settings = document.getElementById("settings");
    if (!settings) return;
    const style = document.createElement("style");
    style.textContent = `#aimm-account-preview{display:block;margin:14px 0;max-width:none;padding:22px;border:1px solid #3b4658;border-radius:14px;background:#111827;color:#f3f4f6}#aimm-account-preview h2{margin:0 0 6px;font-size:1.25rem}#aimm-account-preview p{margin:6px 0 14px;color:#cbd5e1}#aimm-account-preview button{min-height:42px;padding:9px 16px;border:1px solid #667085;border-radius:9px;background:#1f2937;color:inherit;cursor:pointer}#aimm-account-preview button:disabled{opacity:.6;cursor:wait}#aimm-account-preview .account-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:14px 0}#aimm-account-preview .account-primary{gap:14px}#aimm-account-preview .account-primary button{min-width:150px}#aimm-account-preview .account-primary .account-passkey{background:#4f46e5;border-color:#818cf8;font-weight:700}#aimm-account-preview details{margin-top:16px;padding-top:12px;border-top:1px solid #374151}#aimm-account-preview summary{cursor:pointer;font-weight:650;padding:8px 0}#aimm-account-preview details details{margin-top:10px}#aimm-account-preview input,#aimm-account-preview select{min-width:180px;min-height:40px;padding:8px 10px;border:1px solid #4b5563;border-radius:7px;background:#030712;color:inherit}#aimm-account-preview .account-results-details{margin-top:16px;padding-top:12px;border-top:1px solid #30353a}
#aimm-account-preview .account-results-details>summary{display:flex;align-items:center;gap:12px;min-height:48px;padding:8px 12px;border:1px solid transparent;border-radius:8px;cursor:pointer;list-style:none;font-weight:650;color:#edf0f3}
#aimm-account-preview .account-results-details>summary::-webkit-details-marker{display:none}
#aimm-account-preview .account-results-details>summary:before{content:"";width:9px;height:9px;border-right:2px solid #aeb8c2;border-bottom:2px solid #aeb8c2;transform:rotate(-45deg);transition:transform .16s;flex:none}
#aimm-account-preview .account-results-details[open]>summary:before{transform:rotate(45deg) translate(-2px,-2px)}
#aimm-account-preview .account-results-details>summary:hover{background:#202328;border-color:#30353a}
#aimm-account-preview .account-summary-hint{margin-left:auto;color:#737d88;font-size:12px;font-weight:450}
#aimm-account-preview .account-results-banner{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:14px;padding:16px;border:1px solid #315746;border-radius:10px;background:#121d19}
#aimm-account-preview .account-results-banner>div{min-width:0}
#aimm-account-preview .account-results-banner strong{display:block;color:#c8f2df;font-size:14px}
#aimm-account-preview .account-results-banner>div>span{display:block;margin-top:3px;color:#91b5a2;font-size:12px;overflow-wrap:anywhere}
#aimm-account-preview .account-result-state{display:inline-flex;align-items:center;gap:7px;padding:5px 9px;border:1px solid #315746;border-radius:999px;color:#a8e5c6;background:#14251c;font-size:11px;font-weight:700;white-space:nowrap}
#aimm-account-preview .account-result-state:before{content:"";width:7px;height:7px;border-radius:50%;background:#6bd49f}
#aimm-account-preview .account-result-state[data-state="busy"]{border-color:#62502a;color:#f0d38a;background:#241f13}
#aimm-account-preview .account-result-state[data-state="busy"]:before{background:#f0c45f}
#aimm-account-preview .account-result-state[data-state="error"]{border-color:#733a3a;color:#ffb5b5;background:#261515}
#aimm-account-preview .account-result-state[data-state="error"]:before{background:#f87171}
#aimm-account-preview .account-result-state[data-state="neutral"]{border-color:#3a4047;color:#b9c0c8;background:#17191c}
#aimm-account-preview .account-result-state[data-state="neutral"]:before{background:#87919b}
#aimm-account-preview .account-results-empty{margin-top:14px;padding:16px;border:1px dashed #3a4047;border-radius:8px;background:#141619;color:#9aa3ad}
#aimm-account-preview .account-results-empty[hidden]{display:none}
#aimm-account-preview .account-results-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}
#aimm-account-preview .account-results-grid .account-result{min-width:0;margin:0;padding:16px;border:1px solid #30353a;border-radius:9px;background:#141619;color:#9aa0a6;overflow-wrap:anywhere}
#aimm-account-preview .account-results-grid .account-result:empty{display:none}
#aimm-account-preview .account-results-grid .account-result h3{margin:0 0 8px;color:#e6e9ed;font-size:13px}
#aimm-account-preview .account-results-grid .account-result h4{margin:12px 0 6px;color:#e6e9ed;font-size:12px}
#aimm-account-preview .account-results-grid .account-result p{margin:6px 0;color:#9aa3ad;font-size:12px;line-height:1.55}
#aimm-account-preview .account-results-grid .account-result section{margin-top:14px;padding-top:12px;border-top:1px solid #30353a}
#aimm-account-preview .account-results-grid .account-result li{padding:3px 0;overflow-wrap:anywhere}
#aimm-account-preview .account-tools-toggle{display:flex;gap:14px;align-items:center;min-height:48px;margin:14px 0;color:#dce2e8;font-weight:550}
@media(max-width:700px){#aimm-account-preview .account-results-grid{grid-template-columns:1fr}#aimm-account-preview .account-results-banner{align-items:flex-start;flex-direction:column}#aimm-account-preview .account-results-banner>div{width:100%;min-width:0;overflow-wrap:anywhere}}#aimm-account-toast-stack{position:fixed;z-index:99999;top:16px;right:18px;display:grid;gap:9px;width:min(440px,calc(100vw - 36px));pointer-events:none}#aimm-account-toast-stack .account-toast{padding:13px 16px;border:1px solid #526078;border-radius:10px;background:#172033;color:#f8fafc;box-shadow:0 12px 34px #0008}#aimm-account-toast-stack .account-toast.is-error{border-color:#f87171}#aimm-account-toast-stack .account-toast.is-busy{border-left:4px solid #818cf8}`;
    style.textContent += `#aimm-account-preview .account-primary button.is-signed-in{background:#15803d!important;border-color:#4ade80!important;color:#fff!important;opacity:1!important;box-shadow:0 0 0 2px #4ade8055;font-weight:800;cursor:default}#aimm-account-preview .account-primary button.is-signed-in:before{content:"✓";margin-right:9px;font-weight:800}`;
    style.textContent += `#aimm-account-preview .account-synthetic-diagnostic{margin-top:16px;padding:16px;border:1px solid #30353a;border-radius:10px;background:#141619}#aimm-account-preview .account-synthetic-diagnostic>summary{cursor:pointer;font-weight:700;padding:4px 0}#aimm-account-preview .account-synthetic-diagnostic p{max-width:900px;line-height:1.5}#aimm-account-preview .account-synthetic-diagnostic select{max-width:420px}#aimm-account-preview .account-synthetic-status{margin-top:10px;color:#cbd5e1}#aimm-account-preview .account-synthetic-status[data-tone="ok"]{color:#6ee7a8}#aimm-account-preview .account-synthetic-status[data-tone="error"]{color:#fca5a5}`;
    settings.prepend(style);
    const card = document.createElement("section");
    card.id = "aimm-account-preview";
    card.setAttribute("aria-label", "Library Settings: account access and development preview");
    const sectionTitle = text("h2", "Library Settings");
    const sectionHelp = text("p", "Manage development Library access and your passkey. Inventory and status checks run quietly and report progress here.");
    const primaryRow = document.createElement("div");
    primaryRow.className = "account-row account-primary";
    const signIn = text("button", "Checking sign-in…");
    signIn.type = "button";
    signIn.disabled = true;
    signIn.setAttribute("aria-live", "polite");
    const passkeyButton = text("button", "Set up a passkey", "account-passkey");
    passkeyButton.type = "button";
    primaryRow.append(signIn, passkeyButton);
    const notice = text("p", "Sign in to manage your development Library account.");
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    const setSessionStatus = (state, message = "") => {
      signIn.dataset.sessionState = state;
      signIn.classList.toggle("is-signed-in", state === "signed-in");
      signIn.textContent = state === "signed-in" ? "Signed in" : state === "checking" || state === "signing-out" ? "Checking sign-in…" : state === "signout-error" ? "Sign-out needs attention" : "Sign in";
      signIn.disabled = state === "signed-in" || state === "checking" || state === "signing-out" || state === "signout-error";
      signOut.hidden = state !== "signed-in" && state !== "signing-out" && state !== "signout-error";
      signOut.disabled = state !== "signed-in" && state !== "signout-error";
      if (state === "signed-in") notice.textContent = "You’re signed in to the development Library.";
      else if (state === "signed-out") notice.textContent = "You’re not signed in. Sign in to manage your development Library account.";
      else if (state === "checking") notice.textContent = "Checking your development Library sign-in…";
      else if (state === "signing-out") notice.textContent = "Signing out of the development Library…";
      else if (state === "unavailable") notice.textContent = "Sign-in status is unavailable. Check your connection and try again.";
      else if (state === "error") notice.textContent = message || "Sign-in needs attention. Please try again.";
      else if (state === "signout-error") notice.textContent = message || "Sign-out failed. The development Library session may still be active.";
    };
    const refreshSessionStatus = async () => {
      setSessionStatus("checking");
      const base = apiBase();
      if (!base) { setSessionStatus("unavailable"); return false; }
      try {
        const response = await fetch(`${base}/v1/session`, { credentials: "include", cache: "no-store" });
        if (response.ok) {
          sessionInfo = await response.json();
          csrfToken = sessionInfo.csrf_token;
          setSessionStatus("signed-in");
          return true;
        }
        sessionInfo = null;
        csrfToken = null;
        if (response.status === 401) setSessionStatus("signed-out");
        else setSessionStatus("unavailable");
        return false;
      } catch {
        setSessionStatus("unavailable");
        return false;
      }
    };

    const advanced = document.createElement("details");
    const advancedSummary = text("summary", "More Library settings");
    advanced.append(advancedSummary);
    const root = document.createElement("div");
    root.id = "aimm-account-preview-content";
    root.className = "account-preview-content";
    const title = text("h3", "Development account");
    const help = text("p", "These tools run only when you choose them. Checks continue in the background and show a short notification when they finish.");
    const row = document.createElement("div");
    row.className = "account-row";
    const apiInput = document.createElement("input");
    apiInput.type = "url";
    apiInput.placeholder = "Non-production Library API URL";
    apiInput.value = apiBase();
    apiInput.setAttribute("aria-label", "Non-production Library API URL");
    const saveAPI = text("button", "Save API URL");
    saveAPI.type = "button";
    const signOut = text("button", "Sign out");
    signOut.type = "button";
    signOut.hidden = true;
    signOut.disabled = true;
    const refresh = text("button", "Compare inventory");
    refresh.type = "button";
    const statusButton = text("button", "Check update statuses");
    statusButton.type = "button";
    const preferencesButton = text("button", "Account preferences");
    preferencesButton.type = "button";
    const verifyPasskeyButton = text("button", "Verify passkey");
    verifyPasskeyButton.type = "button";
    row.append(apiInput, saveAPI, signOut, refresh, statusButton, preferencesButton, verifyPasskeyButton);
    const toolsLabel = document.createElement("label");
    toolsLabel.className = "account-tools-toggle";
    const toolsToggle = document.createElement("input");
    toolsToggle.type = "checkbox";
    toolsToggle.checked = localStorage.getItem(FLAG_KEY) === "true";
    toolsLabel.append(toolsToggle, text("span", "Enable Library tools for Hope"));
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
    const outputDetails = document.createElement("details");
    outputDetails.className = "account-results-details";
    const outputSummary = text("summary", "Detailed account results");
    const outputSummaryHint = text("span", "Open for status and action details", "account-summary-hint");
    outputSummary.append(outputSummaryHint);
    const outputBanner = document.createElement("div");
    outputBanner.className = "account-results-banner";
    const outputBannerCopy = document.createElement("div");
    const outputHeadline = text("strong", "No detailed results yet");
    const outputDescription = text("span", "Results from checks and account actions will appear here.");
    outputBannerCopy.append(outputHeadline, outputDescription);
    const outputState = text("span", "Ready", "account-result-state");
    outputBanner.append(outputBannerCopy, outputState);
    const emptyResults = text("div", "No detailed results yet. Sign in or run a Library check to see its progress, result, and any error here.", "account-results-empty");
    const outputGrid = document.createElement("div");
    outputGrid.className = "account-results-grid";
    outputGrid.append(pairing, result, statusResult, preferencesResult, passkeyResult);
    outputDetails.append(outputSummary, outputBanner, emptyResults, outputGrid);
    const setResultsSummary = (headline, description, state = "Complete", tone = "ok") => {
      outputHeadline.textContent = headline;
      outputDescription.textContent = description;
      outputState.textContent = state;
      outputState.dataset.state = tone;
    };
    const syncEmptyResults = () => {
      const hasResult = Array.from(outputGrid.children).some((host) => host.childElementCount > 0 || host.textContent.trim());
      emptyResults.hidden = hasResult;
    };
    new MutationObserver(syncEmptyResults).observe(outputGrid, { subtree: true, childList: true, characterData: true });
    const syntheticDiagnostic = document.createElement("details");
    syntheticDiagnostic.className = "account-synthetic-diagnostic";
    syntheticDiagnostic.append(text("summary", "Synthetic Stage 5 move preview"));
    const syntheticHelp = text("p", "Development only. This flow checks one synthetic fixture without reading plug-in inventory. When resuming a request, include its operation ID as stage5-operation and the UUID from the Companion’s isolated /tmp/aimm-stage5-… folder as stage5-root in this development preview URL. After selecting the paired Mac, check the request; a passkey reveals the exact paths in this browser for review, then a second passkey confirms that same preview. The Mac requires a separate local Move to Unused confirmation.");
    const syntheticControls = document.createElement("div");
    syntheticControls.className = "account-row";
    const loadDevices = text("button", "Load development devices");
    loadDevices.type = "button";
    const deviceSelect = document.createElement("select");
    deviceSelect.setAttribute("aria-label", "Choose one development device");
    const devicePlaceholder = text("option", "Choose one development device");
    devicePlaceholder.value = "";
    deviceSelect.append(devicePlaceholder);
    deviceSelect.disabled = true;
    const previewSyntheticMove = text("button", "Preview move to Unused");
    previewSyntheticMove.type = "button";
    previewSyntheticMove.disabled = true;
    const requestSyntheticMove = text("button", "Request on Mac");
    requestSyntheticMove.type = "button";
    requestSyntheticMove.disabled = true;
    const checkSyntheticMove = text("button", "Check Mac preview");
    checkSyntheticMove.type = "button";
    checkSyntheticMove.disabled = true;
    const viewSyntheticPaths = text("button", "View exact paths with passkey");
    viewSyntheticPaths.type = "button";
    viewSyntheticPaths.disabled = true;
    const confirmSyntheticMove = text("button", "Confirm exact move with passkey");
    confirmSyntheticMove.type = "button";
    confirmSyntheticMove.disabled = true;
    const stage5URL = new URL(location.href);
    const operationFromURL = stage5URL.searchParams.get("stage5-operation");
    const rootFromURL = stage5URL.searchParams.get("stage5-root");
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let syntheticOperationID = operationFromURL && uuidPattern.test(operationFromURL) ? operationFromURL : null;
    const syntheticStage5RootID = rootFromURL && uuidPattern.test(rootFromURL) ? rootFromURL.toUpperCase() : null;
    let syntheticActionDigest = null;
    let syntheticCurrentAction = null;
    let syntheticOwnerPreviewViewed = false;
    let syntheticActionConfirmed = false;
    let syntheticViewChallenge = null;
    let syntheticConfirmChallenge = null;
    const syntheticRecordID = "21e8fef3-f9a1-4e71-bfc9-244bdd22472f";
    let syntheticDeviceID = null;
    let syntheticPreviewReady = false;
    let syntheticIdempotencyKey = null;
    let syntheticRequestAttempted = false;
    let syntheticFlowEpoch = 0;
    const syntheticStatus = text("p", "Load development devices to begin.", "account-synthetic-status");
    syntheticStatus.setAttribute("role", "status");
    syntheticStatus.setAttribute("aria-live", "polite");
    syntheticControls.append(loadDevices, deviceSelect, previewSyntheticMove, requestSyntheticMove, checkSyntheticMove, viewSyntheticPaths, confirmSyntheticMove);
    syntheticDiagnostic.append(syntheticHelp, syntheticControls, syntheticStatus);
    const developmentPreviewOrigin = "https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev";
    const clearSyntheticFlow = (message, locked = false) => {
      syntheticFlowEpoch++;
      syntheticDeviceID = null;
      syntheticPreviewReady = false;
      syntheticIdempotencyKey = null;
      syntheticRequestAttempted = false;
      syntheticOperationID = null;
      syntheticActionDigest = null;
      syntheticCurrentAction = null;
      syntheticOwnerPreviewViewed = false;
      syntheticActionConfirmed = false;
      syntheticViewChallenge = null;
      syntheticConfirmChallenge = null;
      checkSyntheticMove.disabled = true;
      viewSyntheticPaths.disabled = true;
      confirmSyntheticMove.disabled = true;
      deviceSelect.replaceChildren(devicePlaceholder.cloneNode(true));
      deviceSelect.disabled = true;
      loadDevices.disabled = locked;
      previewSyntheticMove.disabled = true;
      requestSyntheticMove.disabled = true;
      syntheticStatus.textContent = message;
      syntheticStatus.dataset.tone = "";
    };
    if (location.origin === developmentPreviewOrigin) root.append(syntheticDiagnostic);
    loadDevices.addEventListener("click", async () => {
      const epoch = ++syntheticFlowEpoch;
      loadDevices.disabled = true;
      deviceSelect.disabled = true;
      syntheticStatus.textContent = "Loading development device names…";
      deviceSelect.replaceChildren(devicePlaceholder.cloneNode(true));
      previewSyntheticMove.disabled = true;
      requestSyntheticMove.disabled = true;
      syntheticDeviceID = null;
      syntheticPreviewReady = false;
      syntheticIdempotencyKey = null;
      syntheticRequestAttempted = false;
      try {
        await ensureSession();
        const payload = await api("/v1/devices");
        if (epoch !== syntheticFlowEpoch) return;
        const devices = Array.isArray(payload.devices) ? payload.devices.filter((device) => !device.revoked_at) : [];
        const nameCounts = new Map();
        for (const device of devices) {
          const name = String(device.display_name || "Development device");
          nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
        }
        const nameSeen = new Map();
        for (const device of devices) {
          if (typeof device.device_id !== "string" || !/^[0-9a-f-]{36}$/i.test(device.device_id)) continue;
          const name = String(device.display_name || "Development device");
          const ordinal = (nameSeen.get(name) || 0) + 1;
          nameSeen.set(name, ordinal);
          const option = text("option", nameCounts.get(name) > 1 ? `${name} (${ordinal})` : name);
          option.value = device.device_id;
          deviceSelect.append(option);
        }
        deviceSelect.disabled = deviceSelect.options.length <= 1;
        syntheticStatus.textContent = deviceSelect.disabled
          ? "No active development devices are available."
          : "Choose the paired Mac. The next step checks only the synthetic record ID listed for this Stage 5 fixture.";
      } catch (error) {
        if (epoch !== syntheticFlowEpoch) return;
        syntheticStatus.textContent = error.message;
        syntheticStatus.dataset.tone = "error";
      } finally {
        if (epoch === syntheticFlowEpoch) loadDevices.disabled = false;
      }
    });
    deviceSelect.addEventListener("change", () => {
      syntheticFlowEpoch++;
      syntheticDeviceID = deviceSelect.value || null;
      syntheticPreviewReady = false;
      syntheticIdempotencyKey = null;
      syntheticRequestAttempted = false;
      syntheticActionDigest = null;
      syntheticCurrentAction = null;
      syntheticOwnerPreviewViewed = false;
      syntheticActionConfirmed = false;
      syntheticViewChallenge = null;
      syntheticConfirmChallenge = null;
      checkSyntheticMove.disabled = !syntheticDeviceID || !syntheticOperationID;
      viewSyntheticPaths.disabled = true;
      confirmSyntheticMove.disabled = true;
      previewSyntheticMove.disabled = !syntheticDeviceID || Boolean(syntheticOperationID);
      requestSyntheticMove.disabled = true;
      syntheticStatus.textContent = syntheticDeviceID
        ? (syntheticOperationID ? "Check this synthetic action on the selected Mac." : "Preview will read only the synthetic fixture record on this device.")
        : "Choose one development device.";
      syntheticStatus.dataset.tone = "";
    });
    previewSyntheticMove.addEventListener("click", async () => {
      if (!syntheticDeviceID || syntheticRequestAttempted || syntheticOperationID) return;
      const requestedDeviceID = syntheticDeviceID;
      const epoch = ++syntheticFlowEpoch;
      loadDevices.disabled = true;
      deviceSelect.disabled = true;
      previewSyntheticMove.disabled = true;
      requestSyntheticMove.disabled = true;
      syntheticPreviewReady = false;
      syntheticIdempotencyKey = null;
      syntheticStatus.textContent = "Loading the read-only preview for the one synthetic record…";
      syntheticStatus.dataset.tone = "";
      try {
        const result = await getPluginActionPreview({ device_id: requestedDeviceID, record_id: syntheticRecordID, kind: "move_to_unused" });
        if (epoch !== syntheticFlowEpoch || syntheticDeviceID !== requestedDeviceID) return;
        const item = result?.item;
        if (item?.record_id !== syntheticRecordID || item?.name !== "AIMM Stage 5 Synthetic Probe" ||
            item?.format !== "AU" || item?.version !== "1.0.0" ||
            result?.preview?.kind !== "move_to_unused" || result.preview.changes_local_files !== true ||
            result.preview.requires_mac_confirmation !== true || result.preview.requires_owner_passkey !== true) {
          throw new Error("The current record did not match the expected synthetic move preview. No request was created.");
        }
        syntheticStatus.textContent = `${item.name} · ${item.format} · ${item.version}. ${result.preview.summary} No files have moved.`;
        syntheticStatus.dataset.tone = "ok";
        syntheticPreviewReady = true;
        syntheticIdempotencyKey = crypto.randomUUID();
        requestSyntheticMove.disabled = false;
      } catch (error) {
        if (epoch !== syntheticFlowEpoch) return;
        syntheticStatus.textContent = error.message;
        syntheticStatus.dataset.tone = "error";
      } finally {
        if (epoch === syntheticFlowEpoch) {
          loadDevices.disabled = false;
          deviceSelect.disabled = false;
          previewSyntheticMove.disabled = !syntheticDeviceID || syntheticRequestAttempted || Boolean(syntheticOperationID);
        }
      }
    });
    requestSyntheticMove.addEventListener("click", async () => {
      if (!syntheticPreviewReady || !syntheticDeviceID || !syntheticIdempotencyKey || syntheticRequestAttempted) return;
      const requestedDeviceID = syntheticDeviceID;
      const epoch = ++syntheticFlowEpoch;
      syntheticRequestAttempted = true;
      loadDevices.disabled = true;
      deviceSelect.disabled = true;
      previewSyntheticMove.disabled = true;
      requestSyntheticMove.disabled = true;
      syntheticStatus.textContent = "Sending one move request to the paired Mac…";
      try {
        const action = await requestPluginMoveToUnused({
          device_id: requestedDeviceID, record_id: syntheticRecordID, idempotency_key: syntheticIdempotencyKey
        });
        if (epoch !== syntheticFlowEpoch || syntheticDeviceID !== requestedDeviceID) return;
        syntheticPreviewReady = false;
        syntheticOperationID = action.operation_id;
        syntheticActionDigest = null;
        syntheticCurrentAction = null;
        syntheticOwnerPreviewViewed = false;
        syntheticActionConfirmed = false;
        syntheticViewChallenge = null;
        syntheticConfirmChallenge = null;
        checkSyntheticMove.disabled = !syntheticOperationID;
        viewSyntheticPaths.disabled = true;
        confirmSyntheticMove.disabled = true;
        syntheticStatus.textContent = `Request sent to the paired Mac (${action.state}). No files have moved. Check the Mac preview to continue.`;
        syntheticStatus.dataset.tone = "ok";
      } catch (error) {
        if (epoch !== syntheticFlowEpoch) return;
        syntheticStatus.textContent = `The request response was unclear. Check for the request on the Mac before retrying. Any retry will reuse the same request ID. ${error.message}`;
        syntheticStatus.dataset.tone = "error";
        syntheticRequestAttempted = false;
        requestSyntheticMove.disabled = false;
      }
    });

    checkSyntheticMove.addEventListener("click", async () => {
      if (!syntheticOperationID || !syntheticDeviceID || syntheticActionConfirmed) return;
      const operationID = syntheticOperationID;
      const deviceID = syntheticDeviceID;
      const epoch = syntheticFlowEpoch;
      checkSyntheticMove.disabled = true;
      viewSyntheticPaths.disabled = true;
      confirmSyntheticMove.disabled = true;
      deviceSelect.disabled = true;
      loadDevices.disabled = true;
      syntheticActionDigest = null;
      syntheticCurrentAction = null;
      syntheticOwnerPreviewViewed = false;
      syntheticViewChallenge = null;
      syntheticConfirmChallenge = null;
      syntheticStatus.textContent = "Checking this one synthetic action…";
      try {
        const action = await getPluginActionResult({ operation_id: operationID });
        if (epoch !== syntheticFlowEpoch || operationID !== syntheticOperationID || deviceID !== syntheticDeviceID) return;
        if (action.operation_id !== operationID || action.device_id !== deviceID ||
            action.kind !== "move_to_unused" || action.item_count !== 1) {
          throw new Error("This action does not match the selected device and single-item synthetic move.");
        }
        syntheticCurrentAction = action;
        if (action.state !== "claimed" || !action.preview_digest || !action.preview_expires_at ||
            Date.parse(action.preview_expires_at) <= Date.now()) {
          syntheticStatus.textContent = action.state === "requested"
            ? "The Mac has not prepared the move preview yet. Check again after choosing Unused."
            : `The action is ${action.state}; no current exact preview is available.`;
        } else {
          syntheticActionDigest = action.preview_digest;
          if (!syntheticStage5RootID) {
            syntheticStatus.textContent = "Add the UUID from the Companion’s isolated /tmp/aimm-stage5-… folder to this URL as stage5-root before viewing paths.";
          } else {
            syntheticStatus.textContent = "Preparing the passkey prompt for this exact preview…";
            const prepared = await api("/v1/webauthn/authentication/options", {
              method: "POST",
              body: { purpose: "action_preview_unlock", operation_id: operationID, preview_digest: action.preview_digest }
            });
            if (epoch !== syntheticFlowEpoch || operationID !== syntheticOperationID || deviceID !== syntheticDeviceID) return;
            syntheticViewChallenge = { ...prepared, operationID, deviceID, digest: action.preview_digest };
            viewSyntheticPaths.disabled = false;
            syntheticStatus.textContent = "The exact synthetic preview is ready. Select View exact paths with passkey to open the chooser.";
          }
        }
      } catch (error) {
        if (epoch === syntheticFlowEpoch && operationID === syntheticOperationID && deviceID === syntheticDeviceID) {
          syntheticStatus.textContent = error.message;
          syntheticStatus.dataset.tone = "error";
        }
      } finally {
        if (epoch === syntheticFlowEpoch && operationID === syntheticOperationID && deviceID === syntheticDeviceID) {
          checkSyntheticMove.disabled = false;
          deviceSelect.disabled = false;
          loadDevices.disabled = false;
        }
      }
    });
    viewSyntheticPaths.addEventListener("click", async () => {
      if (!syntheticCurrentAction || !syntheticActionDigest || !syntheticOperationID || !syntheticDeviceID) return;
      const operationID = syntheticOperationID;
      const deviceID = syntheticDeviceID;
      const digest = syntheticActionDigest;
      const epoch = syntheticFlowEpoch;
      const prepared = syntheticViewChallenge;
      if (!prepared || prepared.operationID !== operationID || prepared.deviceID !== deviceID || prepared.digest !== digest ||
          Date.parse(prepared.expires_at) <= Date.now() || Date.parse(syntheticCurrentAction.preview_expires_at) <= Date.now()) {
        syntheticViewChallenge = null;
        syntheticStatus.textContent = "The passkey prompt expired. Check the Mac preview once to prepare a fresh one.";
        viewSyntheticPaths.disabled = true;
        checkSyntheticMove.disabled = false;
        return;
      }
      checkSyntheticMove.disabled = true;
      viewSyntheticPaths.disabled = true;
      confirmSyntheticMove.disabled = true;
      deviceSelect.disabled = true;
      loadDevices.disabled = true;
      try {
        syntheticStatus.textContent = "Opening the passkey chooser…";
        syntheticStatus.dataset.tone = "";
        const assertionPromise = beginPreparedPasskeyAssertion(prepared.options);
        syntheticStatus.textContent = "Waiting for the passkey chooser in Chrome or 1Password…";
        const credential = await assertionPromise;
        const verified = await api("/v1/webauthn/authentication/verify", {
          method: "POST", body: { challenge_id: prepared.challenge_id, credential: serializePasskeyAssertion(credential) }
        });
        if (epoch !== syntheticFlowEpoch || operationID !== syntheticOperationID || deviceID !== syntheticDeviceID) return;
        const exact = await api(`/v1/actions/${encodeURIComponent(operationID)}/owner-preview`, {
          headers: { "x-action-preview-capability": verified.capability }
        });
        if (epoch !== syntheticFlowEpoch || operationID !== syntheticOperationID || deviceID !== syntheticDeviceID) return;
        const preview = exact?.preview;
        const item = preview?.items?.length === 1 ? preview.items[0] : null;
        const source = item?.source_display_path;
        const destination = item?.destination_display_path;
        const sourceMatch = typeof source === "string"
          ? source.match(/^((?:\/private)?\/tmp\/aimm-stage5-([0-9A-F-]+))\/fixture\/Stage5SyntheticProbe\.component$/i)
          : null;
        const root = sourceMatch?.[1] || null;
        const pathRootID = sourceMatch?.[2] || null;
        const permittedRoots = syntheticStage5RootID
          ? new Set([`/tmp/aimm-stage5-${syntheticStage5RootID}`.toLowerCase(), `/private/tmp/aimm-stage5-${syntheticStage5RootID}`.toLowerCase()])
          : new Set();
        const expectedDestination = root ? `${root}/Unused/Stage5SyntheticProbe.component` : null;
        if (exact.operation_id !== operationID || preview?.kind !== "move_to_unused" ||
            item?.name !== "AIMM Stage 5 Synthetic Probe" || item?.format !== "AU" || item?.version !== "1.0.0" ||
            (item?.record_id != null && item.record_id !== syntheticRecordID) ||
            !root || !syntheticStage5RootID || pathRootID.toLowerCase() !== syntheticStage5RootID.toLowerCase() ||
            !permittedRoots.has(root.toLowerCase()) || destination !== expectedDestination) {
          throw new Error("The owner preview is not the expected synthetic-only move inside the selected isolated temporary folder.");
        }
        syntheticOwnerPreviewViewed = true;
        syntheticStatus.replaceChildren(
          text("strong", "Exact synthetic move preview"),
          text("div", `${item.name} · ${item.format} · ${item.version}`),
          text("div", `Source: ${source}`),
          text("div", `Destination: ${destination}`)
        );
        syntheticStatus.dataset.tone = "ok";
        syntheticStatus.append(text("div", "Preparing the confirmation prompt…"));
        const confirmPrepared = await api("/v1/webauthn/authentication/options", {
          method: "POST",
          body: { purpose: "action_confirm", operation_id: operationID, preview_digest: digest }
        });
        if (epoch !== syntheticFlowEpoch || operationID !== syntheticOperationID || deviceID !== syntheticDeviceID) return;
        syntheticConfirmChallenge = { ...confirmPrepared, operationID, deviceID, digest };
        syntheticStatus.append(text("div", "Review the two paths above. When ready, select Confirm exact move with passkey."));
        confirmSyntheticMove.disabled = false;
        const viewedEpoch = epoch;
        setTimeout(() => {
          if (viewedEpoch !== syntheticFlowEpoch || operationID !== syntheticOperationID || digest !== syntheticActionDigest || syntheticActionConfirmed) return;
          syntheticOwnerPreviewViewed = false;
          confirmSyntheticMove.disabled = true;
          syntheticConfirmChallenge = null;
          checkSyntheticMove.disabled = false;
          syntheticStatus.replaceChildren(text("span", "The exact path view expired. Check the Mac preview again before confirming."));
        }, 2 * 60_000);
      } catch (error) {
        if (epoch === syntheticFlowEpoch && operationID === syntheticOperationID && deviceID === syntheticDeviceID) {
          syntheticStatus.textContent = error.name === "NotAllowedError" ? "Passkey path review was cancelled." : error.message;
          syntheticStatus.dataset.tone = "error";
          syntheticViewChallenge = null;
          syntheticConfirmChallenge = null;
          syntheticOwnerPreviewViewed = false;
          confirmSyntheticMove.disabled = true;
          viewSyntheticPaths.disabled = true;
        }
      } finally {
        if (epoch === syntheticFlowEpoch && operationID === syntheticOperationID && deviceID === syntheticDeviceID) {
          deviceSelect.disabled = false;
          loadDevices.disabled = false;
          checkSyntheticMove.disabled = syntheticOwnerPreviewViewed || syntheticActionConfirmed;
        }
      }
    });
    confirmSyntheticMove.addEventListener("click", async () => {
      if (!syntheticOwnerPreviewViewed || !syntheticCurrentAction || !syntheticActionDigest || !syntheticOperationID || !syntheticDeviceID) return;
      const operationID = syntheticOperationID;
      const deviceID = syntheticDeviceID;
      const digest = syntheticActionDigest;
      const epoch = syntheticFlowEpoch;
      const prepared = syntheticConfirmChallenge;
      if (!prepared || prepared.operationID !== operationID || prepared.deviceID !== deviceID || prepared.digest !== digest ||
          Date.parse(prepared.expires_at) <= Date.now() || Date.parse(syntheticCurrentAction.preview_expires_at) <= Date.now()) {
        syntheticConfirmChallenge = null;
        syntheticStatus.append(text("div", "The confirmation prompt expired. Review a fresh Mac preview before confirming."));
        confirmSyntheticMove.disabled = true;
        checkSyntheticMove.disabled = false;
        return;
      }
      checkSyntheticMove.disabled = true;
      confirmSyntheticMove.disabled = true;
      deviceSelect.disabled = true;
      loadDevices.disabled = true;
      try {
        syntheticStatus.append(text("div", "Opening the passkey chooser…"));
        const assertionPromise = beginPreparedPasskeyAssertion(prepared.options);
        syntheticStatus.append(text("div", "Waiting for the passkey chooser in Chrome or 1Password…"));
        const credential = await assertionPromise;
        const confirmed = await api("/v1/webauthn/authentication/verify", {
          method: "POST", body: { challenge_id: prepared.challenge_id, credential: serializePasskeyAssertion(credential) }
        });
        if (epoch !== syntheticFlowEpoch || operationID !== syntheticOperationID || deviceID !== syntheticDeviceID) return;
        if (confirmed.confirmed_operation_id !== operationID || confirmed.preview_digest !== digest) {
          throw new Error("The passkey confirmation did not match this exact synthetic move preview.");
        }
        syntheticOwnerPreviewViewed = false;
        syntheticActionConfirmed = true;
        syntheticConfirmChallenge = null;
        viewSyntheticPaths.disabled = true;
        checkSyntheticMove.disabled = true;
        syntheticStatus.replaceChildren(
          text("strong", "Passkey confirmation complete"),
          text("div", "The isolated Mac can now receive this exact move authorization. No file has moved yet.")
        );
        syntheticStatus.dataset.tone = "ok";
      } catch (error) {
        if (epoch === syntheticFlowEpoch && operationID === syntheticOperationID && deviceID === syntheticDeviceID) {
          syntheticStatus.append(text("div", error.name === "NotAllowedError" ? "Passkey confirmation was cancelled." : error.message));
          syntheticStatus.dataset.tone = "error";
          syntheticConfirmChallenge = null;
          confirmSyntheticMove.disabled = true;
          checkSyntheticMove.disabled = false;
        }
      } finally {
        if (epoch === syntheticFlowEpoch && operationID === syntheticOperationID && deviceID === syntheticDeviceID) {
          deviceSelect.disabled = false;
          loadDevices.disabled = false;
        }
      }
    });

    root.append(title, help, row, toolsLabel, outputDetails);
    advanced.append(root);
    card.style.order = "1";
    card.append(sectionTitle, sectionHelp, primaryRow, notice, advanced);
    if (new URL(location.href).searchParams.has("pairing")) { advanced.open = true; outputDetails.open = true; }
    if (new URL(location.href).searchParams.has("stage5-synthetic-preview") && location.origin === developmentPreviewOrigin) { advanced.open = true; syntheticDiagnostic.open = true; }
    settings.insertBefore(card, settings.children[2] || null);

    const toastStack = document.createElement("div");
    toastStack.id = "aimm-account-toast-stack";
    toastStack.setAttribute("aria-live", "polite");
    toastStack.setAttribute("aria-relevant", "additions text");
    document.body.append(toastStack);
    const notifyAccount = (message, { busy = false, error = false } = {}) => {
      const toast = text("div", message, `account-toast${busy ? " is-busy" : ""}${error ? " is-error" : ""}`);
      toast.setAttribute("role", "status");
      toastStack.append(toast);
      let timer = null;
      const update = (nextMessage, nextError = false) => {
        toast.textContent = nextMessage;
        toast.classList.toggle("is-busy", false);
        toast.classList.toggle("is-error", nextError);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => toast.remove(), nextError ? 10000 : 6500);
      };
      if (!busy) timer = setTimeout(() => toast.remove(), error ? 10000 : 6500);
      return { update };
    };
    const setEnabled = (enabled) => {
      toolsToggle.checked = enabled;
      localStorage.setItem(FLAG_KEY, String(enabled));
      setAccountToolsEnabled(enabled);
      notice.textContent = enabled
        ? "Library tools for Hope are enabled. Account data is read only when a tool is used."
        : "Library tools for Hope are off. Sign in or set up a passkey from here.";
      if (enabled) void renderPairingApproval(pairing);
    };
    toolsToggle.addEventListener("change", () => setEnabled(toolsToggle.checked));
    saveAPI.addEventListener("click", () => {
      try {
        localStorage.setItem(API_KEY, cleanApiBase(apiInput.value));
        notifyAccount("Development Library API URL saved.");
      } catch (error) { notifyAccount(error.message, { error: true }); }
    });
    attachLoginHandler(signIn, notice, () => setSessionStatus("checking"), (error) => setSessionStatus("error", error.message));
    signOut.addEventListener("click", async () => {
      const job = notifyAccount("Signing out of the development Library…", { busy: true });
      setSessionStatus("signing-out");
      clearSyntheticFlow("Signing out of the development Library…", true);
      csrfToken = null;
      sessionInfo = null;
      for (const host of [pairing, result, statusResult, preferencesResult, passkeyResult]) host.replaceChildren();
      emptyResults.hidden = false;
      outputDetails.open = true;
      setResultsSummary("Signing out", "Account results were cleared from this page while the development session is revoked.", "Running", "busy");
      try {
        await ensureSession();
        await api("/v1/session", { method: "DELETE" });
        csrfToken = null;
        sessionInfo = null;
        setResultsSummary("Signed out", "Sign in again to load account results.", "Signed out", "neutral");
        setSessionStatus("signed-out");
        job.update("Signed out of the development Library.");
      } catch (error) {
        csrfToken = null;
        sessionInfo = null;
        setSessionStatus("signout-error", "Sign-out failed. The development Library session may still be active. Retry sign-out before leaving this page.");
        setResultsSummary("API sign-out failed", "The account session may still be active. Stay on this page and retry sign-out.", "Error", "error");
        job.update(`Library API sign-out failed. Its session may still be active. ${error.message}`, true);
        return;
      }
      const logout = new URL("v2/logout", OIDC_ISSUER);
      logout.search = new URLSearchParams({ client_id: OIDC_CLIENT_ID, returnTo: redirectUri() }).toString();
      location.assign(logout.toString());
    });
    refresh.addEventListener("click", async () => {
      outputDetails.open = true;
      result.replaceChildren(text("p", "Comparing this browser’s scan with the Library account…"));
      setResultsSummary("Inventory comparison in progress", "Comparing the latest complete account snapshot with this browser’s saved scan.", "Running", "busy");
      const job = notifyAccount("Comparing this browser’s scan with the Library account…", { busy: true });
      try {
        const snapshot = await getInstalledInventory({ full_snapshot: true });
        const preferences = await api("/v1/preferences");
        showInventoryPreview(result, snapshot, preferences);
        const localRows = (() => { try { return JSON.parse(localStorage.getItem("aimmPluginInventoryRows_v1") || "[]"); } catch { return []; } })();
        const parity = compareInventoryRows(localRows, snapshot.records || []);
        const summaryText = `Library comparison complete: ${parity.matched} matched, ${parity.localOnly.length} browser-only, ${parity.accountOnly.length} account-only, ${parity.versionMismatches.length} version differences.`;
        job.update(summaryText);
        setResultsSummary("Inventory comparison complete", summaryText, "Complete", "ok");
      }
      catch (error) {
        result.replaceChildren(text("p", error.message));
        setResultsSummary("Inventory comparison needs attention", error.message, "Error", "error");
        job.update(error.message, true);
      }
    });
    statusButton.addEventListener("click", async () => {
      outputDetails.open = true;
      setResultsSummary("Status check in progress", "Loading the latest saved Library status observations.", "Running", "busy");
      const job = notifyAccount("Checking saved Library statuses…", { busy: true });
      statusResult.replaceChildren(text("p", "Checking saved Library statuses in the background…"));
      try {
        const payload = await getPluginStatus({ full_snapshot: true });
        const preferences = await api("/v1/preferences");
        const marksByTarget = new Map((preferences.marks || []).filter((mark) => mark.scope === "product")
          .map((mark) => [mark.target_key, { ...mark, tags: Array.isArray(mark.tags) ? mark.tags : [] }]));
        statusResult.replaceChildren(text("h3", "Status observations"), text("p", payload.notice));
        const summary = payload.counts || {};
        const rawSummary = payload.raw_counts || {};
        const statusRows = Array.isArray(payload.records) ? payload.records : [];
        statusResult.append(text("p", `Raw updates: ${rawSummary.update || 0} · Free: ${summary.free_update || 0} · Paid: ${summary.paid_update || 0} · Actionable: ${summary.actionable_update || 0} · Stale: ${summary.stale || 0} · Unknown: ${summary.unchecked || 0}`));
        const statusControls = document.createElement("div");
        statusControls.className = "account-row";
        const statusSearch = document.createElement("input");
        statusSearch.type = "search";
        statusSearch.placeholder = "Search status observations";
        statusSearch.setAttribute("aria-label", "Search status observations by product or vendor identifier");
        const statusFilter = document.createElement("select");
        statusFilter.setAttribute("aria-label", "Filter status observations");
        for (const [value, label] of [["", "All statuses"], ["update", "Update available"], ["up_to_date", "Up to date"],
          ["manual", "Manual Check"], ["unchecked", "Unchecked"], ["error", "Error"], ["stale", "Stale"]]) {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = label;
          statusFilter.append(option);
        }
        const statusPageSize = 100;
        let statusPageIndex = 0;
        const statusPage = text("span", "");
        const previousStatusPage = text("button", "Previous statuses");
        previousStatusPage.type = "button";
        previousStatusPage.setAttribute("aria-label", "Show previous status observations");
        const nextStatusPage = text("button", "Next statuses");
        nextStatusPage.type = "button";
        nextStatusPage.setAttribute("aria-label", "Show next status observations");
        const statusList = document.createElement("div");
        const renderStatusRows = () => {
          const query = statusSearch.value.trim().toLocaleLowerCase();
          const filter = statusFilter.value;
          const visibleRows = statusRows.filter((row) => (!query || `${row.name} ${row.format} ${row.bundle_identifier || ""}`.toLocaleLowerCase().includes(query)) &&
            (!filter || row.status === filter));
          const pageCount = Math.ceil(visibleRows.length / statusPageSize);
          statusPageIndex = Math.max(0, Math.min(statusPageIndex, pageCount - 1));
          const start = statusPageIndex * statusPageSize;
          const pageRows = visibleRows.slice(start, start + statusPageSize);
          statusPage.textContent = visibleRows.length
            ? `Showing ${start + 1}–${start + pageRows.length} of ${visibleRows.length} matching (${statusRows.length} total)`
            : `No matching status observations (${statusRows.length} total)`;
          previousStatusPage.disabled = statusPageIndex === 0;
          nextStatusPage.disabled = start + pageRows.length >= visibleRows.length;
          statusList.replaceChildren();
          for (const row of pageRows) {
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
            statusList.append(line);
          }
        };
        statusSearch.addEventListener("input", () => { statusPageIndex = 0; renderStatusRows(); });
        statusFilter.addEventListener("change", () => { statusPageIndex = 0; renderStatusRows(); });
        previousStatusPage.addEventListener("click", () => { statusPageIndex = Math.max(0, statusPageIndex - 1); renderStatusRows(); });
        nextStatusPage.addEventListener("click", () => { statusPageIndex += 1; renderStatusRows(); });
        statusControls.append(statusSearch, statusFilter, previousStatusPage, statusPage, nextStatusPage);
        statusResult.append(statusControls, statusList);
        renderStatusRows();
        const summaryText = `Status check complete: ${summary.actionable_update || 0} actionable, ${summary.stale || 0} stale, ${summary.unchecked || 0} unknown, across ${statusRows.length} items.`;
        job.update(summaryText);
        setResultsSummary("Status check complete", summaryText, "Complete", "ok");
      } catch (error) {
        statusResult.replaceChildren(text("p", error.message));
        setResultsSummary("Status check needs attention", error.message, "Error", "error");
        job.update(error.message, true);
      }
    });
    passkeyButton.addEventListener("click", async () => {
      outputDetails.open = true;
      setResultsSummary("Passkey setup in progress", "Waiting for your browser to complete the passkey ceremony.", "Running", "busy");
      passkeyButton.disabled = true;
      const job = notifyAccount("Waiting for the browser to create your passkey…", { busy: true });
      try {
        const saved = await registerAccountPasskey();
        const message = `Passkey saved to this account. Active passkeys: ${saved.credential_count}.`;
        job.update(message);
        passkeyResult.replaceChildren(text("p", message));
        setResultsSummary("Passkey setup complete", message, "Complete", "ok");
      } catch (error) {
        const message = error.name === "NotAllowedError" ? "Passkey setup was cancelled." : error.message;
        job.update(message, true);
        passkeyResult.replaceChildren(text("p", message));
        setResultsSummary("Passkey setup needs attention", message, "Error", "error");
      } finally { passkeyButton.disabled = false; }
    });
    verifyPasskeyButton.addEventListener("click", async () => {
      outputDetails.open = true;
      setResultsSummary("Passkey verification in progress", "Waiting for your browser to verify the development passkey.", "Running", "busy");
      verifyPasskeyButton.disabled = true;
      const job = notifyAccount("Waiting for passkey verification…", { busy: true });
      try {
        const verified = await verifyAccountPasskey();
        const message = `Passkey verified at ${verified.verified_at}.`;
        job.update(message);
        passkeyResult.replaceChildren(text("p", message));
        setResultsSummary("Passkey verified", message, "Complete", "ok");
      } catch (error) {
        const message = error.name === "NotAllowedError" ? "Passkey verification was cancelled." : error.message;
        job.update(message, true);
        passkeyResult.replaceChildren(text("p", message));
        setResultsSummary("Passkey verification needs attention", message, "Error", "error");
      } finally { verifyPasskeyButton.disabled = false; }
    });
    preferencesButton.addEventListener("click", async () => {
      outputDetails.open = true;
      preferencesResult.replaceChildren(text("p", "Loading account preferences…"));
      setResultsSummary("Loading account preferences", "Reading preferences from the development Library account.", "Running", "busy");
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
        setResultsSummary("Account preferences loaded", "Development Library preferences are ready to review.", "Complete", "ok");
      } catch (error) {
        preferencesResult.replaceChildren(text("p", error.message));
        setResultsSummary("Account preferences need attention", error.message, "Error", "error");
      }
    });

    void completeLoginFromCallback().then((completed) => {
      if (completed) {
        setSessionStatus("signed-in");
        notifyAccount("Signed in to the development Library.");
        setResultsSummary("Signed in", "Run a Library check when you’re ready to load account results.", "Ready", "neutral");
        void renderPairingApproval(pairing);
      } else void refreshSessionStatus();
    }).catch((error) => { setSessionStatus("error", error.message); notifyAccount(error.message, { error: true }); });
    setAccountToolsEnabled(localStorage.getItem(FLAG_KEY) === "true");
    if (localStorage.getItem(FLAG_KEY) === "true") void renderPairingApproval(pairing);

  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
