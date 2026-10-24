/* Stage 3 account-library preview. Feature flag is off until the owner enables it. */
(() => {
  "use strict";

  const OIDC_ISSUER = "https://dev-cxmqjc40zltqlx7l.us.auth0.com/";
  const OIDC_CLIENT_ID = "3EbH8eIpW9FxYvKoXIeYtRvhcGWGtwPA";
  const OIDC_AUDIENCE = "https://aimm-library-api-dev";
  const CANONICAL_ORIGIN = "https://aimixmasters.com";
  const FLAG_KEY = "aimmAccountLibraryPreviewEnabled_v1";
  const API_KEY = "aimmLibraryPreviewApiBase_v1";
  let csrfToken = null;
  let sessionInfo = null;

  const text = (tag, value, className) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value == null ? "" : String(value);
    return element;
  };

  function cleanApiBase(value) {
    const parsed = new URL(String(value || "").trim());
    if ((parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") ||
        parsed.username || parsed.password || parsed.search || parsed.hash) {
      throw new Error("Enter the HTTPS development Library API URL.");
    }
    return parsed.origin;
  }

  function apiBase() {
    try { return cleanApiBase(localStorage.getItem(API_KEY)); }
    catch { return ""; }
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
      scope: "openid profile read:library manage:devices", audience: OIDC_AUDIENCE,
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

  async function getInstalledInventory(args = {}) {
    await ensureSession();
    const params = new URLSearchParams();
    if (typeof args.device_id === "string" && /^[0-9a-f-]{36}$/i.test(args.device_id)) params.set("device_id", args.device_id);
    const payload = await api(`/v1/library${params.size ? `?${params}` : ""}`);
    const rows = Array.isArray(payload.records) ? payload.records : [];
    const query = String(args.search || "").trim().toLowerCase();
    const matches = query ? rows.filter((row) => `${row.name} ${row.bundleIdentifier || ""}`.toLowerCase().includes(query)) : rows;
    return {
      device: payload.device ? { name: payload.device.display_name, device_id: payload.device.device_id } : null,
      generation: payload.generation ? {
        generation_id: payload.generation.generation_id,
        observed_at: payload.generation.observed_at,
        record_count: payload.generation.record_count
      } : null,
      count: matches.length,
      records: matches.slice(0, 100).map((row) => ({
        record_id: row.id,
        name: row.name, format: row.format, version: row.version || null,
        bundle_identifier: row.bundleIdentifier || null,
        metadata_source: row.metadataSource
      })),
      truncated: matches.length > 100,
      notice: "Installed inventory is from the last complete scan; this is not an update check."
    };
  }

  async function getPluginStatus(args = {}) {
    await ensureSession();
    const params = new URLSearchParams();
    if (typeof args.device_id === "string" && /^[0-9a-f-]{36}$/i.test(args.device_id)) params.set("device_id", args.device_id);
    const payload = await api(`/v1/status-summary${params.size ? `?${params}` : ""}`);
    const query = String(args.search || "").trim().toLowerCase();
    const records = Array.isArray(payload.records) ? payload.records : [];
    const matches = query ? records.filter((row) => `${row.name} ${row.format}`.toLowerCase().includes(query)) : records;
    return {
      rule_version: payload.rule_version,
      counts: payload.counts || {},
      count: matches.length,
      records: matches.slice(0, 100).map((row) => ({
        device: row.device_name, name: row.name, format: row.format,
        status: row.status, raw_status: row.raw_status,
        installed_version: row.installed_version || null,
        latest_version: row.latest_version || null,
        checked_at: row.checked_at || null, stale: Boolean(row.stale),
        paid_upgrade: Boolean(row.paid_upgrade)
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

  async function getPluginActionResult(args = {}) {
    await ensureSession();
    if (typeof args.operation_id !== "string" || !/^[0-9a-f-]{36}$/i.test(args.operation_id)) {
      throw new Error("Provide a valid action ID.");
    }
    return api(`/v1/actions/${encodeURIComponent(args.operation_id)}`);
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
    if (!TOOL_DEFS.some((tool) => tool.name === "get_action_result")) {
      TOOL_DEFS.push({
        type: "function", name: "get_action_result",
        description: "Read a redacted summary for a pending or finished local action. Never returns exact file paths.",
        parameters: { type: "object", properties: { operation_id: { type: "string" } }, required: ["operation_id"] }
      });
    }
  }

  function showInventoryPreview(host, payload) {
    host.replaceChildren();
    const heading = text("h3", "Account inventory preview");
    const localCount = (() => {
      try {
        const rows = JSON.parse(localStorage.getItem("aimmPluginInventoryRows_v1") || "[]");
        return Array.isArray(rows) ? rows.length : 0;
      } catch { return 0; }
    })();
    host.append(heading, text("p", `Local browser scan: ${localCount} entries. Account API: ${payload.generation?.record_count ?? 0} entries. Counts are compared as entries; naming or product grouping may differ.`));
    if (!payload.generation) {
      host.append(text("p", "No complete account inventory has been synced for this account yet."));
      return;
    }
    host.append(text("p", `${payload.device?.name || "Selected Mac"} · observed ${payload.generation.observed_at} · generation ${payload.generation.generation_id}`));
    const counts = new Map();
    for (const record of payload.records) counts.set(record.format, (counts.get(record.format) || 0) + 1);
    host.append(text("p", Array.from(counts, ([format, count]) => `${format}: ${count}`).join(" · ") || "No inventory rows."));
    const list = document.createElement("ul");
    list.style.maxHeight = "260px";
    list.style.overflow = "auto";
    for (const record of payload.records.slice(0, 100)) {
      const item = document.createElement("li");
      item.append(text("span", `${record.name} · ${record.format}${record.version ? ` · ${record.version}` : ""} `));
      const reveal = text("button", "Request reveal on Mac");
      reveal.type = "button";
      reveal.addEventListener("click", async () => {
        reveal.disabled = true;
        try {
          const action = await requestPluginReveal({ device_id: payload.device.device_id, record_id: record.record_id });
          reveal.textContent = `Requested · ${action.state}`;
        } catch (error) { reveal.disabled = false; reveal.textContent = error.message; }
      });
      item.append(reveal);
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
    const help = text("p", "This preview reads the last complete account snapshot. The existing Library remains available as fallback. It does not perform update checks or local actions.");
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
    row.append(apiInput, saveAPI, signIn, signOut, refresh, statusButton, preferencesButton);
    const notice = text("p", "Feature flag is off. Nothing is read from the account API until you enable this preview.");
    const pairing = document.createElement("div");
    pairing.className = "account-result";
    const result = document.createElement("div");
    result.className = "account-result";
    const statusResult = document.createElement("div");
    statusResult.className = "account-result";
    const preferencesResult = document.createElement("div");
    preferencesResult.className = "account-result";
    root.append(title, help, row, notice, pairing, result, statusResult, preferencesResult);
    card.append(toggle, root);
    const shell = library.querySelector(".inv-shell");
    if (shell) library.insertBefore(card, shell);
    else library.append(card);

    const setEnabled = (enabled) => {
      card.classList.toggle("is-enabled", enabled);
      toggle.textContent = enabled ? "Hide account preview" : "Enable account preview";
      toggle.setAttribute("aria-expanded", String(enabled));
      localStorage.setItem(FLAG_KEY, String(enabled));
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
      try { showInventoryPreview(result, await getInstalledInventory({})); }
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
        statusResult.replaceChildren(text("h3", "Status observations"), text("p", payload.notice));
        statusResult.append(text("p", Object.entries(payload.counts).map(([key, value]) => `${key}: ${value}`).join(" · ") || "No observations recorded."));
        for (const row of payload.records.slice(0, 100)) {
          const observed = row.checked_at ? ` · checked ${row.checked_at}` : " · never checked";
          statusResult.append(text("p", `${row.name} · ${row.format}: ${row.status}${observed}${row.latest_version ? ` · latest ${row.latest_version}` : ""}`));
        }
      } catch (error) { statusResult.replaceChildren(text("p", error.message)); }
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

    addToolDefinitions();
    if (typeof handleToolCall === "function" && !window.__aimmAccountLibraryToolBridge) {
      const original = handleToolCall;
      window.handleToolCall = async function (name, args) {
        if (name === "list_installed_plugins") return getInstalledInventory(args || {});
        if (name === "get_plugin_status") return getPluginStatus(args || {});
        if (name === "request_plugin_reveal") return requestPluginReveal(args || {});
        if (name === "get_action_result") return getPluginActionResult(args || {});
        return original(name, args);
      };
      window.__aimmAccountLibraryToolBridge = true;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
