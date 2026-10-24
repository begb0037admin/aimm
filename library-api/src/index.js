const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

function readCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim();
  }
  return null;
}

function encodeBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}

function randomToken() {
  return encodeBase64Url(crypto.getRandomValues(new Uint8Array(32)));
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function pairingRateLimit(request, env, kind) {
  const source = request.headers.get("cf-connecting-ip") || "local-development";
  const sourceHash = await sha256Hex(source);
  const windowStart = Math.floor(Date.now() / 60_000) * 60_000;
  const column = kind === "create" ? "create_count" : "poll_count";
  const maximum = kind === "create" ? 5 : 30;
  const delta = kind === "create" ? [1, 0] : [0, 1];
  const result = await env.DB.prepare(
    `INSERT INTO pairing_rate_limits (source_hash, window_start, create_count, poll_count) VALUES (?1, ?2, ?3, ?4) ` +
    `ON CONFLICT(source_hash) DO UPDATE SET ` +
    `window_start = excluded.window_start, ` +
    `create_count = CASE WHEN pairing_rate_limits.window_start < excluded.window_start THEN excluded.create_count ELSE pairing_rate_limits.create_count + excluded.create_count END, ` +
    `poll_count = CASE WHEN pairing_rate_limits.window_start < excluded.window_start THEN excluded.poll_count ELSE pairing_rate_limits.poll_count + excluded.poll_count END ` +
    `WHERE pairing_rate_limits.window_start < excluded.window_start OR pairing_rate_limits.${column} + ?5 <= ?6 ` +
    `RETURNING source_hash`
  ).bind(sourceHash, windowStart, delta[0], delta[1], 1, maximum).first();
  return Boolean(result);
}

function pairingPhrase(bytes) {
  const words = ["amber", "birch", "cobalt", "dawn", "ember", "fern", "glide", "harbor", "island", "juniper", "kite", "lunar", "maple", "north", "opal", "pine", "quiet", "river", "silver", "tulip", "umber", "velvet", "willow", "xenon", "yellow", "zephyr", "cloud", "meadow", "ocean", "flint", "cedar", "mosaic"];
  return [0, 1, 2, 3].map((offset) => words[bytes[offset] & 31]).join(" ");
}

function activeDeviceLimit(env) {
  const configured = Number(env.MAX_ACTIVE_DEVICES);
  return Number.isInteger(configured) && configured >= 1 && configured <= 10 ? configured : 10;
}

async function verifyPairingKeyProof(jwk, nonce, signature) {
  try {
    if (
      !jwk || jwk.kty !== "EC" || jwk.crv !== "P-256" ||
      typeof jwk.x !== "string" || typeof jwk.y !== "string" ||
      typeof nonce !== "string" || nonce.length < 22 || nonce.length > 128 ||
      typeof signature !== "string" || signature.length > 256
    ) return false;
    const key = await crypto.subtle.importKey(
      "jwk", { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y, ext: true },
      { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]
    );
    const canonical = JSON.stringify({ kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y });
    const fingerprint = await sha256Hex(canonical);
    return await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" }, key, decodeBase64Url(signature),
      new TextEncoder().encode(`AIMM-PAIR-INIT\n${nonce}\n${fingerprint}`)
    );
  } catch {
    return false;
  }
}

async function parseJsonBody(request, maximumBytes = 4096) {
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
    throw new Error("invalid_content_type");
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maximumBytes) throw new Error("request_too_large");
  if (!request.body) return {};
  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel();
        throw new Error("request_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function setSessionCookies(response, sessionToken, csrfToken, maxAge) {
  const headers = new Headers(response.headers);
  headers.append("set-cookie", `__Host-aimm-library-session=${sessionToken}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`);
  headers.append("set-cookie", `__Host-aimm-library-csrf=${csrfToken}; Path=/; Max-Age=${maxAge}; Secure; SameSite=Strict`);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function clearSessionCookies(response) {
  const headers = new Headers(response.headers);
  headers.append("set-cookie", "__Host-aimm-library-session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict");
  headers.append("set-cookie", "__Host-aimm-library-csrf=; Path=/; Max-Age=0; Secure; SameSite=Strict");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

let jwksCache = { url: "", expiresAt: 0, keys: [] };

function json(body, status = 200, requestId, origin, env) {
  const headers = new Headers(JSON_HEADERS);
  headers.set("x-request-id", requestId);
  headers.set("vary", "Origin");
  if (origin && env.SITE_ORIGIN && origin === env.SITE_ORIGIN) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-headers", "authorization, content-type, x-csrf-token");
    headers.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
    headers.set("access-control-max-age", "600");
    headers.set("access-control-allow-credentials", "true");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function errorResponse(code, message, status, requestId, origin, env) {
  return json({ error: { code, message, retryable: status >= 500 }, request_id: requestId }, status, requestId, origin, env);
}

function decodeBase64Url(value) {
  const standard = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard + "=".repeat((4 - (standard.length % 4)) % 4);
  const raw = atob(padded);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

function decodeJsonSegment(value) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

async function getJwks(env) {
  const url = env.OIDC_JWKS_URL;
  if (!url) throw new Error("oidc_not_configured");
  if (jwksCache.url === url && jwksCache.expiresAt > Date.now()) return jwksCache.keys;

  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error("oidc_not_configured");
  }

  const response = await fetch(parsed.toString(), { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("jwks_unavailable");
  const body = await response.json();
  if (!Array.isArray(body.keys)) throw new Error("jwks_unavailable");

  jwksCache = { url, expiresAt: Date.now() + 5 * 60 * 1000, keys: body.keys };
  return jwksCache.keys;
}

async function verifyAccessToken(request, env) {
  if (!env.OIDC_ISSUER || !env.OIDC_AUDIENCE || !env.OIDC_JWKS_URL || !env.OIDC_ALLOWED_CLIENT_IDS) {
    throw new Error("oidc_not_configured");
  }
  const authorization = request.headers.get("authorization") || "";
  const match = /^Bearer ([^\s]+)$/.exec(authorization);
  if (!match || match[1].length > 16384) throw new Error("unauthorized");

  const parts = match[1].split(".");
  if (parts.length !== 3) throw new Error("unauthorized");

  let header;
  let claims;
  try {
    header = decodeJsonSegment(parts[0]);
    claims = decodeJsonSegment(parts[1]);
  } catch {
    throw new Error("unauthorized");
  }
  if (header.alg !== "RS256" || typeof header.kid !== "string") throw new Error("unauthorized");

  const keys = await getJwks(env);
  const jwk = keys.find((key) => key.kid === header.kid && key.kty === "RSA" && (!key.use || key.use === "sig") && (!key.alg || key.alg === "RS256"));
  if (!jwk) throw new Error("unauthorized");

  let signatureValid = false;
  try {
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    signatureValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      decodeBase64Url(parts[2]),
      new TextEncoder().encode(parts[0] + "." + parts[1])
    );
  } catch {
    throw new Error("unauthorized");
  }
  if (!signatureValid) throw new Error("unauthorized");

  const now = Math.floor(Date.now() / 1000);
  const audienceMatches = claims.aud === env.OIDC_AUDIENCE ||
    (Array.isArray(claims.aud) && claims.aud.includes(env.OIDC_AUDIENCE));
  if (
    claims.iss !== env.OIDC_ISSUER ||
    !audienceMatches ||
    typeof claims.sub !== "string" ||
    claims.sub.length === 0 ||
    !Number.isFinite(claims.exp) ||
    claims.exp <= now ||
    (Number.isFinite(claims.nbf) && claims.nbf > now + 60)
  ) {
    throw new Error("unauthorized");
  }
  // Auth0's azp identifies the OAuth client; it is not the API audience.
  // Only explicitly configured first-party user clients may enter account routes.
  const allowedClients = env.OIDC_ALLOWED_CLIENT_IDS.split(",").map((id) => id.trim()).filter(Boolean);
  // Auth0 user access tokens may use typ=JWT and omit gty even for the
  // Authorization Code flow. The signed issuer, configured azp, non-client
  // subject, audience, and required scope remain the account-route boundary.
  const acceptedTokenType = header.typ === undefined || header.typ === "JWT" || header.typ === "at+jwt";
  const acceptedGrantType = acceptedTokenType && (
    claims.gty === undefined ||
    claims.gty === "authorization_code" ||
    claims.gty === "refresh_token"
  );
  const scopes = typeof claims.scope === "string"
    ? claims.scope.split(/\s+/).filter(Boolean)
    : [];
  if (
    allowedClients.length === 0 ||
    typeof claims.azp !== "string" ||
    !allowedClients.includes(claims.azp) ||
    !acceptedGrantType ||
    claims.sub.endsWith("@clients")
  ) {
    throw new Error("unauthorized");
  }
  return {
    issuer: env.OIDC_ISSUER,
    subject: claims.sub,
    scopes,
    authTime: Number.isFinite(claims.auth_time) ? claims.auth_time : null,
    expiresAt: claims.exp
  };
}

async function getOrCreateAccount(db, identity) {
  try {
    const now = new Date().toISOString();
    const deleted = await db.prepare(
      "SELECT purge_at FROM deleted_identities WHERE oidc_issuer = ?1 AND oidc_subject = ?2 AND purge_at > ?3"
    ).bind(identity.issuer, identity.subject, now).first();
    if (deleted) throw new Error("account_deleted");

    const existing = await db.prepare(
      "SELECT account_id, created_at FROM accounts WHERE oidc_issuer = ?1 AND oidc_subject = ?2"
    ).bind(identity.issuer, identity.subject).first();
    if (existing) return existing;

    const accountId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await db.prepare(
      "INSERT OR IGNORE INTO accounts (account_id, oidc_issuer, oidc_subject, created_at) VALUES (?1, ?2, ?3, ?4)"
    ).bind(accountId, identity.issuer, identity.subject, createdAt).run();

    const account = await db.prepare(
      "SELECT account_id, created_at FROM accounts WHERE oidc_issuer = ?1 AND oidc_subject = ?2"
    ).bind(identity.issuer, identity.subject).first();
    if (!account) throw new Error("database_unavailable");
    return account;
  } catch (error) {
    if (error?.message === "account_deleted") throw error;
    throw new Error("database_unavailable");
  }
}

function requiredScopeFor(method, pathname) {
  if ((method === "GET" && ["/v1/me", "/v1/devices", "/v1/library", "/v1/checks", "/v1/status-summary", "/v1/preferences"].includes(pathname))) return "read:library";
  if (method === "GET" && /^\/v1\/actions\/[0-9a-f-]{36}$/.test(pathname)) return "read:library";
  if (method === "POST" && pathname === "/v1/actions") return "read:library";
  if (method === "PUT" && ["/v1/preferences/settings", "/v1/preferences/marks"].includes(pathname)) return "read:library";
  if (method === "DELETE" && pathname === "/v1/me") return "delete:account";
  if (method === "POST" && /^\/v1\/devices\/[0-9a-f-]{36}\/revoke$/.test(pathname)) return "manage:devices";
  if (method === "GET" && /^\/v1\/pairings\/[A-Za-z0-9_-]{40,64}$/.test(pathname)) return "read:library";
  if (method === "POST" && /^\/v1\/pairings\/[A-Za-z0-9_-]{40,64}\/approve$/.test(pathname)) return "manage:devices";
  return null;
}

async function sessionFromRequest(request, env) {
  const rawToken = readCookie(request, "__Host-aimm-library-session");
  if (!rawToken || rawToken.length > 128) return null;
  const tokenHash = await sha256Hex(rawToken);
  const now = new Date().toISOString();
  try {
    return await env.DB.prepare(
      "SELECT session_id, account_id, scopes_json, auth_time, csrf_hash, expires_at FROM browser_sessions WHERE token_hash = ?1 AND expires_at > ?2 AND revoked_at IS NULL"
    ).bind(tokenHash, now).first();
  } catch {
    throw new Error("database_unavailable");
  }
}

async function requireCsrf(request, env, account, requestId, origin) {
  if (account.authMode !== "cookie") return null;
  const cookieToken = readCookie(request, "__Host-aimm-library-csrf");
  const headerToken = request.headers.get("x-csrf-token");
  if (
    origin !== env.SITE_ORIGIN ||
    !cookieToken ||
    !headerToken ||
    cookieToken !== headerToken ||
    await sha256Hex(cookieToken) !== account.csrf_hash
  ) {
    return errorResponse("csrf_rejected", "A valid same-site CSRF token is required.", 403, requestId, origin, env);
  }
  return null;
}

async function requireAccount(request, env, requiredScope) {
  if (request.headers.has("authorization")) {
    const identity = await verifyAccessToken(request, env);
    if (!identity.scopes.includes(requiredScope)) throw new Error("insufficient_scope");
    const account = await getOrCreateAccount(env.DB, identity);
    return { ...account, identity, authMode: "bearer" };
  }

  const session = await sessionFromRequest(request, env);
  if (!session) throw new Error("unauthorized");
  let scopes;
  try {
    scopes = JSON.parse(session.scopes_json);
  } catch {
    throw new Error("unauthorized");
  }
  if (!Array.isArray(scopes) || !scopes.includes(requiredScope)) throw new Error("insufficient_scope");
  const account = await env.DB.prepare(
    "SELECT account_id, created_at FROM accounts WHERE account_id = ?1"
  ).bind(session.account_id).first();
  if (!account) throw new Error("unauthorized");
  return {
    ...account,
    authMode: "cookie",
    session_id: session.session_id,
    csrf_hash: session.csrf_hash,
    identity: { authTime: Number.isFinite(session.auth_time) ? session.auth_time : null }
  };
}

async function requireDeviceCredential(request, env, deviceId) {
  const authorization = request.headers.get("authorization") || "";
  const match = /^Bearer ([^\s]+)$/.exec(authorization);
  if (!match || match[1].length > 128) throw new Error("unauthorized");
  const now = new Date().toISOString();
  try {
    const device = await env.DB.prepare(
      "SELECT d.device_id, d.capabilities_json FROM device_credentials c JOIN devices d ON d.device_id = c.device_id AND d.account_id = c.account_id WHERE c.token_hash = ?1 AND c.device_id = ?2 AND c.revoked_at IS NULL AND (c.expires_at IS NULL OR c.expires_at > ?3) AND d.revoked_at IS NULL"
    ).bind(await sha256Hex(match[1]), deviceId, now).first();
    if (!device) throw new Error("unauthorized");
    let capabilities;
    try {
      capabilities = JSON.parse(device.capabilities_json);
    } catch {
      throw new Error("database_unavailable");
    }
    if (!Array.isArray(capabilities) || capabilities.some((capability) => typeof capability !== "string")) {
      throw new Error("database_unavailable");
    }
    return { device_id: device.device_id, capabilities };
  } catch (error) {
    if (error?.message === "unauthorized" || error?.message === "database_unavailable") throw error;
    throw new Error("database_unavailable");
  }
}

const INVENTORY_FORMATS = new Set(["AU", "VST2", "VST3", "CLAP"]);
const INVENTORY_SOURCES = new Set(["infoPlist", "filenameOnly"]);

function normalizeInventoryRecords(records) {
  if (!Array.isArray(records) || records.length > 250) throw new Error("invalid_inventory");
  const ids = new Set();
  return records.map((record) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error("invalid_inventory");
    const allowed = new Set(["id", "name", "bundleIdentifier", "version", "format", "metadataSource"]);
    if (Object.keys(record).some((key) => !allowed.has(key))) throw new Error("invalid_inventory");
    const { id, name, bundleIdentifier, version, format, metadataSource } = record;
    if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
        typeof name !== "string" || name.trim().length < 1 || name.length > 256 ||
        !INVENTORY_FORMATS.has(format) || !INVENTORY_SOURCES.has(metadataSource) ||
        (bundleIdentifier !== null && bundleIdentifier !== undefined && (typeof bundleIdentifier !== "string" || bundleIdentifier.length > 255)) ||
        (version !== null && version !== undefined && (typeof version !== "string" || version.length > 128))) {
      throw new Error("invalid_inventory");
    }
    if (ids.has(id)) throw new Error("invalid_inventory");
    ids.add(id);
    return {
      id, name: name.trim(), bundleIdentifier: bundleIdentifier || null,
      version: version || null, format, metadataSource
    };
  });
}

async function writeInventoryChunk(request, env, requestId, origin, deviceId, generationId, chunkIndex) {
  let body;
  try { body = await parseJsonBody(request, 256 * 1024); }
  catch (error) {
    const status = error.message === "request_too_large" ? 413 : 400;
    return errorResponse("invalid_request", "A bounded JSON inventory chunk is required.", status, requestId, origin, env);
  }
  let records;
  try { records = normalizeInventoryRecords(body.records); }
  catch { return errorResponse("invalid_inventory", "Inventory records contain unsupported or invalid fields.", 400, requestId, origin, env); }
  const startedAt = body.started_at;
  const rootCount = body.root_count;
  if (typeof startedAt !== "string" || Number.isNaN(Date.parse(startedAt)) ||
      !Number.isInteger(rootCount) || rootCount < 1 || rootCount > 100 || body.schema_version !== 1) {
    return errorResponse("invalid_inventory", "The generation metadata is invalid.", 400, requestId, origin, env);
  }
  const canonical = JSON.stringify(records);
  if (new TextEncoder().encode(canonical).byteLength > 200 * 1024) {
    return errorResponse("request_too_large", "The normalized inventory chunk is too large.", 413, requestId, origin, env);
  }
  const payloadHash = await sha256Hex(canonical);
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      "INSERT OR IGNORE INTO scan_generations (device_id, generation_id, started_at, root_count, record_count, chunk_count, schema_version, state, created_at) VALUES (?1, ?2, ?3, ?4, 0, 0, 1, 'staging', ?5)"
    ).bind(deviceId, generationId, startedAt, rootCount, now).run();
    const generation = await env.DB.prepare(
      "SELECT started_at, root_count, state FROM scan_generations WHERE device_id = ?1 AND generation_id = ?2"
    ).bind(deviceId, generationId).first();
    if (!generation || generation.state !== "staging" || generation.started_at !== startedAt || generation.root_count !== rootCount) {
      return errorResponse("generation_conflict", "This generation is already finalized or its metadata changed.", 409, requestId, origin, env);
    }
    const previous = await env.DB.prepare(
      "SELECT payload_hash FROM inventory_chunks WHERE device_id = ?1 AND generation_id = ?2 AND chunk_index = ?3"
    ).bind(deviceId, generationId, chunkIndex).first();
    if (previous) {
      if (previous.payload_hash !== payloadHash) return errorResponse("chunk_conflict", "A different chunk already uses this index.", 409, requestId, origin, env);
      return json({ device_id: deviceId, generation_id: generationId, chunk_index: chunkIndex, accepted: true, replay: true }, 200, requestId, origin, env);
    }
    const priorCount = await env.DB.prepare(
      "SELECT COALESCE(SUM(record_count), 0) AS n, COUNT(*) AS chunks FROM inventory_chunks WHERE device_id = ?1 AND generation_id = ?2"
    ).bind(deviceId, generationId).first();
    if (Number(priorCount?.n || 0) + records.length > 100000 || Number(priorCount?.chunks || 0) >= 1000) {
      return errorResponse("inventory_limit", "The inventory generation exceeds its limit.", 413, requestId, origin, env);
    }
    await env.DB.prepare(
      "INSERT INTO inventory_chunks (device_id, generation_id, chunk_index, payload_hash, records_json, record_count, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"
    ).bind(deviceId, generationId, chunkIndex, payloadHash, canonical, records.length, now).run();
    return json({ device_id: deviceId, generation_id: generationId, chunk_index: chunkIndex, accepted: true, replay: false }, 201, requestId, origin, env);
  } catch {
    return errorResponse("database_unavailable", "Inventory storage could not be reached.", 503, requestId, origin, env);
  }
}

async function startInventoryGeneration(request, env, requestId, origin, deviceId, generationId) {
  let body;
  try { body = await parseJsonBody(request, 4096); }
  catch { return errorResponse("invalid_request", "A small JSON generation start is required.", 400, requestId, origin, env); }
  const { started_at: startedAt, root_count: rootCount, schema_version: schemaVersion } = body;
  if (typeof startedAt !== "string" || Number.isNaN(Date.parse(startedAt)) ||
      !Number.isInteger(rootCount) || rootCount < 0 || rootCount > 100 || schemaVersion !== 1 ||
      Date.parse(startedAt) > Date.now() + 60_000) {
    return errorResponse("invalid_inventory", "The generation start metadata is invalid.", 400, requestId, origin, env);
  }
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      "INSERT OR IGNORE INTO scan_generations (device_id, generation_id, started_at, root_count, record_count, chunk_count, schema_version, state, created_at) VALUES (?1, ?2, ?3, ?4, 0, 0, 1, 'staging', ?5)"
    ).bind(deviceId, generationId, startedAt, rootCount, now).run();
    const existing = await env.DB.prepare(
      "SELECT started_at, root_count, state FROM scan_generations WHERE device_id = ?1 AND generation_id = ?2"
    ).bind(deviceId, generationId).first();
    if (!existing || existing.state !== "staging" || existing.started_at !== startedAt || existing.root_count !== rootCount) {
      return errorResponse("generation_conflict", "This generation is already finalized or its metadata changed.", 409, requestId, origin, env);
    }
    return json({ device_id: deviceId, generation_id: generationId, state: "staging" }, 201, requestId, origin, env);
  } catch {
    return errorResponse("database_unavailable", "Inventory storage could not be reached.", 503, requestId, origin, env);
  }
}

async function finalizeInventory(request, env, requestId, origin, deviceId, generationId) {
  let body;
  try { body = await parseJsonBody(request, 4096); }
  catch { return errorResponse("invalid_request", "A small JSON generation summary is required.", 400, requestId, origin, env); }
  const { completed_at: completedAt, record_count: recordCount, chunk_count: chunkCount, partial = false } = body;
  if (typeof completedAt !== "string" || Number.isNaN(Date.parse(completedAt)) ||
      !Number.isInteger(recordCount) || recordCount < 0 || recordCount > 100000 ||
      !Number.isInteger(chunkCount) || chunkCount < 0 || chunkCount > 1000 || typeof partial !== "boolean") {
    return errorResponse("invalid_inventory", "The generation summary is invalid.", 400, requestId, origin, env);
  }
  try {
    const generation = await env.DB.prepare(
      "SELECT started_at, root_count, state FROM scan_generations WHERE device_id = ?1 AND generation_id = ?2"
    ).bind(deviceId, generationId).first();
    if (!generation || generation.state !== "staging") return errorResponse("generation_unavailable", "The inventory generation is unavailable.", 409, requestId, origin, env);
    if (Date.parse(completedAt) < Date.parse(generation.started_at) || Date.parse(completedAt) > Date.now() + 60_000) {
      return errorResponse("invalid_inventory", "The generation completion time is outside the valid range.", 400, requestId, origin, env);
    }
    const counts = await env.DB.prepare(
      "SELECT COUNT(*) AS chunks, COALESCE(SUM(record_count), 0) AS records, MIN(chunk_index) AS min_index, MAX(chunk_index) AS max_index FROM inventory_chunks WHERE device_id = ?1 AND generation_id = ?2"
    ).bind(deviceId, generationId).first();
    const actualChunks = Number(counts?.chunks || 0);
    const actualRecords = Number(counts?.records || 0);
    const contiguous = actualChunks === 0 || (Number(counts.min_index) === 0 && Number(counts.max_index) === actualChunks - 1);
    if (actualChunks !== chunkCount || actualRecords !== recordCount || !contiguous) {
      return errorResponse("generation_incomplete", "The uploaded chunks do not match the generation summary.", 409, requestId, origin, env);
    }
    const identities = await env.DB.prepare(
      "SELECT COUNT(*) AS total, COUNT(DISTINCT json_extract(items.value, '$.id')) AS unique_ids FROM inventory_chunks chunks, json_each(chunks.records_json) items WHERE chunks.device_id = ?1 AND chunks.generation_id = ?2"
    ).bind(deviceId, generationId).first();
    if (Number(identities?.total || 0) !== Number(identities?.unique_ids || 0)) {
      return errorResponse("duplicate_inventory_record", "A record ID appears more than once in this generation.", 409, requestId, origin, env);
    }
    const state = partial ? "partial" : "complete";
    const results = await env.DB.batch([
      env.DB.prepare("UPDATE scan_generations SET completed_at = ?1, record_count = ?2, chunk_count = ?3, state = ?4 WHERE device_id = ?5 AND generation_id = ?6 AND state = 'staging'")
        .bind(completedAt, recordCount, chunkCount, state, deviceId, generationId),
      ...(partial ? [] : [
        env.DB.prepare("INSERT INTO published_inventory_records (device_id, generation_id, record_id, name, bundle_identifier, version, format, metadata_source) SELECT chunks.device_id, chunks.generation_id, json_extract(items.value, '$.id'), json_extract(items.value, '$.name'), json_extract(items.value, '$.bundleIdentifier'), json_extract(items.value, '$.version'), json_extract(items.value, '$.format'), json_extract(items.value, '$.metadataSource') FROM inventory_chunks chunks, json_each(chunks.records_json) items WHERE chunks.device_id = ?1 AND chunks.generation_id = ?2")
          .bind(deviceId, generationId),
        env.DB.prepare("INSERT INTO device_inventory_heads (device_id, generation_id, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(device_id) DO UPDATE SET generation_id = excluded.generation_id, updated_at = excluded.updated_at")
          .bind(deviceId, generationId, completedAt)
      ])
    ]);
    if (results[0]?.meta?.changes !== 1) return errorResponse("generation_conflict", "The inventory generation was finalized concurrently.", 409, requestId, origin, env);
    return json({ device_id: deviceId, generation_id: generationId, state, record_count: recordCount, chunk_count: chunkCount }, 200, requestId, origin, env);
  } catch {
    return errorResponse("database_unavailable", "Inventory storage could not be reached.", 503, requestId, origin, env);
  }
}

async function readLibrary(request, env, account, requestId, origin) {
  const requestedDevice = new URL(request.url).searchParams.get("device_id");
  const head = await env.DB.prepare(
    "SELECT d.device_id, d.display_name, d.last_seen_at, g.generation_id, g.started_at, g.completed_at, g.root_count, g.record_count FROM device_inventory_heads h JOIN devices d ON d.device_id = h.device_id JOIN scan_generations g ON g.device_id = h.device_id AND g.generation_id = h.generation_id WHERE d.account_id = ?1 AND d.revoked_at IS NULL AND (?2 IS NULL OR d.device_id = ?2) ORDER BY g.completed_at DESC LIMIT 1"
  ).bind(account.account_id, requestedDevice).first();
  if (!head) return json({ device: null, generation: null, records: [] }, 200, requestId, origin, env);
  const result = await env.DB.prepare(
    "SELECT record_id AS id, name, bundle_identifier AS bundleIdentifier, version, format, metadata_source AS metadataSource FROM published_inventory_records WHERE device_id = ?1 AND generation_id = ?2 ORDER BY name, format, record_id"
  ).bind(head.device_id, head.generation_id).all();
  const records = result.results || [];
  return json({
    device: { device_id: head.device_id, display_name: head.display_name, last_seen_at: head.last_seen_at },
    generation: { generation_id: head.generation_id, started_at: head.started_at, observed_at: head.completed_at, root_count: head.root_count, record_count: head.record_count, state: "complete" },
    records
  }, 200, requestId, origin, env);
}

const CHECK_RESULTS = new Set(["update", "up_to_date", "manual", "unchecked", "error"]);
const CHECK_SOURCES = new Set(["public_vendor", "local_hub", "manual"]);
const CHECK_ROUTES = new Set(["hub", "vendor_site", "manual"]);
const CHECK_ERRORS = new Set(["network_unavailable", "permission_denied", "vendor_rate_limited", "manual_required", "source_unavailable", "parse_error"]);
const SAFE_ACTION_KINDS = new Set(["reveal"]);

async function createAction(request, env, account, requestId, origin) {
  let body;
  try { body = await parseJsonBody(request, 8192); }
  catch { return errorResponse("invalid_request", "A small JSON action request is required.", 400, requestId, origin, env); }
  const { device_id: deviceId, kind, record_ids: recordIDs, idempotency_key: idempotencyKey } = body;
  if (typeof deviceId !== "string" || !/^[0-9a-f-]{36}$/i.test(deviceId) || !SAFE_ACTION_KINDS.has(kind) ||
      !Array.isArray(recordIDs) || recordIDs.length !== 1 ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recordIDs[0]) ||
      typeof idempotencyKey !== "string" || idempotencyKey.length < 16 || idempotencyKey.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(idempotencyKey)) {
    return errorResponse("invalid_action", "Only a one-item reveal request with an idempotency key is available in this build.", 400, requestId, origin, env);
  }
  const device = await env.DB.prepare(
    "SELECT d.device_id, d.capabilities_json, h.generation_id FROM devices d JOIN device_inventory_heads h ON h.device_id = d.device_id WHERE d.device_id = ?1 AND d.account_id = ?2 AND d.revoked_at IS NULL"
  ).bind(deviceId, account.account_id).first();
  if (!device) return errorResponse("device_not_found", "The selected active device has no complete inventory.", 404, requestId, origin, env);
  let capabilities;
  try { capabilities = JSON.parse(device.capabilities_json); }
  catch { return errorResponse("database_unavailable", "Device capabilities could not be read.", 503, requestId, origin, env); }
  if (!capabilities.includes("commands:read") || !capabilities.includes("actions:write")) {
    return errorResponse("capability_denied", "The selected device cannot receive local actions.", 403, requestId, origin, env);
  }
  const currentRecord = await env.DB.prepare(
    "SELECT record_id FROM published_inventory_records WHERE device_id = ?1 AND generation_id = ?2 AND record_id = ?3"
  ).bind(deviceId, device.generation_id, recordIDs[0]).first();
  if (!currentRecord) return errorResponse("record_not_found", "The selected item is not in the device's current complete inventory.", 409, requestId, origin, env);

  const requestHash = await sha256Hex(JSON.stringify({ account_id: account.account_id, device_id: deviceId, kind, generation_id: device.generation_id, record_ids: recordIDs }));
  const existing = await env.DB.prepare(
    "SELECT operation_id, device_id, generation_id, kind, state, created_at, expires_at, request_hash FROM operations WHERE account_id = ?1 AND idempotency_key = ?2"
  ).bind(account.account_id, idempotencyKey).first();
  if (existing) {
    if (existing.request_hash !== requestHash) return errorResponse("idempotency_conflict", "This idempotency key was already used for a different action.", 409, requestId, origin, env);
    return json({ operation_id: existing.operation_id, device_id: existing.device_id, generation_id: existing.generation_id, kind: existing.kind, state: existing.state, created_at: existing.created_at, expires_at: existing.expires_at, replay: true }, 200, requestId, origin, env);
  }
  const operationId = crypto.randomUUID();
  const nonce = randomToken();
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO operations (operation_id, account_id, device_id, generation_id, kind, nonce, idempotency_key, request_hash, state, created_at, expires_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'requested', ?9, ?10)")
        .bind(operationId, account.account_id, deviceId, device.generation_id, kind, nonce, idempotencyKey, requestHash, createdAt, expiresAt),
      env.DB.prepare("INSERT INTO operation_items (operation_id, device_id, generation_id, record_id) VALUES (?1, ?2, ?3, ?4)")
        .bind(operationId, deviceId, device.generation_id, recordIDs[0])
    ]);
  } catch {
    const raced = await env.DB.prepare("SELECT operation_id, device_id, generation_id, kind, state, created_at, expires_at, request_hash FROM operations WHERE account_id = ?1 AND idempotency_key = ?2").bind(account.account_id, idempotencyKey).first();
    if (raced?.request_hash === requestHash) return json({ operation_id: raced.operation_id, device_id: raced.device_id, generation_id: raced.generation_id, kind: raced.kind, state: raced.state, created_at: raced.created_at, expires_at: raced.expires_at, replay: true }, 200, requestId, origin, env);
    return errorResponse("database_unavailable", "The action request could not be queued.", 503, requestId, origin, env);
  }
  return json({ operation_id: operationId, device_id: deviceId, generation_id: device.generation_id, kind, state: "requested", item_count: 1, created_at: createdAt, expires_at: expiresAt, replay: false }, 201, requestId, origin, env);
}

async function deviceCommands(request, env, requestId, origin, deviceId) {
  let device;
  try { device = await requireDeviceCredential(request, env, deviceId); }
  catch (error) {
    const status = error.message === "database_unavailable" ? 503 : 401;
    return errorResponse(status === 503 ? "database_unavailable" : "unauthorized", "A valid active device credential is required for this device.", status, requestId, origin, env);
  }
  if (!device.capabilities.includes("commands:read")) return errorResponse("capability_denied", "This device cannot read the local action queue.", 403, requestId, origin, env);
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    "SELECT operation_id, generation_id, kind, nonce, state, created_at, expires_at FROM operations WHERE device_id = ?1 AND state IN ('requested', 'claimed') AND expires_at > ?2 ORDER BY created_at LIMIT 50"
  ).bind(deviceId, now).all();
  const commands = [];
  for (const operation of result.results || []) {
    const items = await env.DB.prepare("SELECT record_id FROM operation_items WHERE operation_id = ?1 ORDER BY record_id").bind(operation.operation_id).all();
    commands.push({ ...operation, record_ids: (items.results || []).map((item) => item.record_id) });
  }
  return json({ commands }, 200, requestId, origin, env);
}

async function claimDeviceAction(request, env, requestId, origin, deviceId, operationId) {
  let device;
  try { device = await requireDeviceCredential(request, env, deviceId); }
  catch (error) {
    const status = error.message === "database_unavailable" ? 503 : 401;
    return errorResponse(status === 503 ? "database_unavailable" : "unauthorized", "A valid active device credential is required for this device.", status, requestId, origin, env);
  }
  if (!device.capabilities.includes("commands:read")) return errorResponse("capability_denied", "This device cannot claim local actions.", 403, requestId, origin, env);
  const now = new Date().toISOString();
  const result = await env.DB.prepare("UPDATE operations SET state = 'claimed', claimed_at = COALESCE(claimed_at, ?1) WHERE operation_id = ?2 AND device_id = ?3 AND state IN ('requested', 'claimed') AND expires_at > ?1")
    .bind(now, operationId, deviceId).run();
  if (result?.meta?.changes !== 1) return errorResponse("action_unavailable", "This action is no longer available to claim.", 409, requestId, origin, env);
  const claimed = await env.DB.prepare("SELECT claimed_at FROM operations WHERE operation_id = ?1 AND device_id = ?2").bind(operationId, deviceId).first();
  return json({ operation_id: operationId, state: "claimed", claimed_at: claimed?.claimed_at || now }, 200, requestId, origin, env);
}

function canonicalJSON(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJSON(value[key])}`).join(",")}}`;
}

async function acceptActionReceipt(request, env, requestId, origin, deviceId, operationId) {
  let device;
  try { device = await requireDeviceCredential(request, env, deviceId); }
  catch (error) {
    const status = error.message === "database_unavailable" ? 503 : 401;
    return errorResponse(status === 503 ? "database_unavailable" : "unauthorized", "A valid active device credential is required for this device.", status, requestId, origin, env);
  }
  if (!device.capabilities.includes("actions:write")) return errorResponse("capability_denied", "This device cannot submit local action receipts.", 403, requestId, origin, env);
  let body;
  try { body = await parseJsonBody(request, 16 * 1024); }
  catch { return errorResponse("invalid_request", "A small signed action receipt is required.", 400, requestId, origin, env); }
  const receipt = body.receipt;
  const signature = body.signature;
  const receiptKeys = new Set(["operation_id", "device_id", "generation_id", "nonce", "completed_at", "state", "items"]);
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt) || Object.keys(receipt).some((key) => !receiptKeys.has(key)) ||
      receipt.operation_id !== operationId || receipt.device_id !== deviceId || typeof receipt.generation_id !== "string" ||
      typeof receipt.nonce !== "string" || typeof receipt.completed_at !== "string" || Number.isNaN(Date.parse(receipt.completed_at)) ||
      !new Set(["completed", "failed"]).has(receipt.state) || !Array.isArray(receipt.items) || receipt.items.length !== 1 ||
      typeof signature !== "string" || signature.length > 256) {
    return errorResponse("invalid_receipt", "The signed receipt fields are invalid.", 400, requestId, origin, env);
  }
  const item = receipt.items[0];
  if (!item || Object.keys(item).some((key) => !new Set(["record_id", "status"]).has(key)) ||
      typeof item.record_id !== "string" || !new Set(["completed", "failed", "needs_permission", "skipped"]).has(item.status)) {
    return errorResponse("invalid_receipt", "The signed receipt item is invalid.", 400, requestId, origin, env);
  }
  const operation = await env.DB.prepare("SELECT account_id, device_id, generation_id, kind, nonce, state, created_at, expires_at FROM operations WHERE operation_id = ?1 AND device_id = ?2")
    .bind(operationId, deviceId).first();
  if (!operation) return errorResponse("action_unavailable", "The action does not belong to this device.", 404, requestId, origin, env);
  const canonical = canonicalJSON(receipt);
  const receiptHash = await sha256Hex(`${canonical}\n${signature}`);
  const prior = await env.DB.prepare("SELECT summary_json FROM action_receipts WHERE device_id = ?1 AND operation_id = ?2").bind(deviceId, operationId).first();
  if (prior) {
    let summary;
    try { summary = JSON.parse(prior.summary_json); } catch { return errorResponse("database_unavailable", "The receipt could not be read.", 503, requestId, origin, env); }
    if (summary.signature_hash === receiptHash) return json({ operation_id: operationId, state: summary.state, replay: true }, 200, requestId, origin, env);
    return errorResponse("receipt_conflict", "A different receipt is already stored for this action.", 409, requestId, origin, env);
  }
  if (operation.state !== "claimed" || operation.expires_at <= new Date().toISOString() ||
      receipt.generation_id !== operation.generation_id || receipt.nonce !== operation.nonce ||
      Date.parse(receipt.completed_at) < Date.parse(operation.created_at) || Date.parse(receipt.completed_at) > Date.now() + 60_000) {
    return errorResponse("action_unavailable", "The signed receipt does not match an active claimed action.", 409, requestId, origin, env);
  }
  const expected = await env.DB.prepare("SELECT record_id FROM operation_items WHERE operation_id = ?1 AND device_id = ?2 AND generation_id = ?3")
    .bind(operationId, deviceId, operation.generation_id).first();
  if (!expected || expected.record_id !== item.record_id || item.status === "skipped") {
    return errorResponse("invalid_receipt", "The receipt item does not match the requested action.", 409, requestId, origin, env);
  }
  const keyRow = await env.DB.prepare("SELECT public_key_jwk FROM devices WHERE device_id = ?1 AND revoked_at IS NULL").bind(deviceId).first();
  let verified = false;
  try {
    const jwk = JSON.parse(keyRow.public_key_jwk);
    const publicKey = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    verified = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, publicKey, decodeBase64Url(signature), new TextEncoder().encode(canonical));
  } catch { verified = false; }
  if (!verified) return errorResponse("invalid_receipt_signature", "The action receipt signature could not be verified.", 401, requestId, origin, env);

  const state = item.status === "completed" ? "completed" : "failed";
  if (receipt.state !== state) return errorResponse("invalid_receipt", "The receipt state does not match its item result.", 400, requestId, origin, env);
  const terminalAt = receipt.completed_at;
  const expiresAt = new Date(Date.parse(terminalAt) + 90 * 24 * 60 * 60 * 1000).toISOString();
  const summary = { state, completed_at: terminalAt, generation_id: operation.generation_id, items: [{ record_id: item.record_id, status: item.status }], signature_hash: receiptHash };
  try {
    await env.DB.batch([
      env.DB.prepare("UPDATE operations SET state = ?1, terminal_at = ?2 WHERE operation_id = ?3 AND device_id = ?4 AND state = 'claimed'").bind(state, terminalAt, operationId, deviceId),
      env.DB.prepare("INSERT INTO action_receipts (receipt_id, account_id, device_id, operation_id, terminal_at, expires_at, summary_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)")
        .bind(crypto.randomUUID(), operation.account_id, deviceId, operationId, terminalAt, expiresAt, JSON.stringify(summary), new Date().toISOString())
    ]);
  } catch { return errorResponse("database_unavailable", "The signed receipt could not be stored.", 503, requestId, origin, env); }
  return json({ operation_id: operationId, state, replay: false }, 201, requestId, origin, env);
}

async function submitChecks(request, env, requestId, origin, deviceId, generationId) {
  let body;
  try { body = await parseJsonBody(request, 128 * 1024); }
  catch (error) {
    const status = error.message === "request_too_large" ? 413 : 400;
    return errorResponse("invalid_request", "A bounded JSON check result batch is required.", status, requestId, origin, env);
  }
  if (!Array.isArray(body.observations) || body.observations.length > 90) {
    return errorResponse("invalid_checks", "Send no more than 90 check observations at a time.", 400, requestId, origin, env);
  }
  const now = Date.now();
  const observations = [];
  const unique = new Set();
  for (const row of body.observations) {
    const allowed = new Set(["record_id", "installed_version", "latest_version", "result", "source_type", "checked_at", "last_good_at", "error_code", "paid_upgrade", "route"]);
    if (!row || typeof row !== "object" || Array.isArray(row) || Object.keys(row).some((key) => !allowed.has(key)) ||
        typeof row.record_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(row.record_id) ||
        !CHECK_RESULTS.has(row.result) || !CHECK_SOURCES.has(row.source_type) ||
        typeof row.checked_at !== "string" || Number.isNaN(Date.parse(row.checked_at)) || Date.parse(row.checked_at) > now + 60_000 ||
        (row.installed_version != null && (typeof row.installed_version !== "string" || row.installed_version.length > 128)) ||
        (row.latest_version != null && (typeof row.latest_version !== "string" || row.latest_version.length > 128)) ||
        (row.last_good_at != null && (typeof row.last_good_at !== "string" || Number.isNaN(Date.parse(row.last_good_at)) || Date.parse(row.last_good_at) > now + 60_000)) ||
        (row.error_code != null && !CHECK_ERRORS.has(row.error_code)) ||
        (row.paid_upgrade != null && typeof row.paid_upgrade !== "boolean") ||
        (row.route != null && !CHECK_ROUTES.has(row.route)) || unique.has(row.record_id)) {
      return errorResponse("invalid_checks", "A check observation contains invalid fields.", 400, requestId, origin, env);
    }
    if (row.result === "error" && !row.error_code) return errorResponse("invalid_checks", "Error results require a redacted error code.", 400, requestId, origin, env);
    unique.add(row.record_id);
    observations.push(row);
  }
  try {
    const head = await env.DB.prepare(
      "SELECT d.account_id FROM devices d JOIN device_inventory_heads h ON h.device_id = d.device_id AND h.generation_id = ?2 WHERE d.device_id = ?1 AND d.revoked_at IS NULL"
    ).bind(deviceId, generationId).first();
    if (!head) return errorResponse("stale_generation", "Checks must refer to this device's active complete inventory.", 409, requestId, origin, env);
    const ids = observations.map((row) => row.record_id);
    if (ids.length) {
      const placeholders = ids.map((_, index) => `?${index + 3}`).join(",");
      const found = await env.DB.prepare(
        `SELECT COUNT(DISTINCT record_id) AS n FROM published_inventory_records WHERE device_id = ?1 AND generation_id = ?2 AND record_id IN (${placeholders})`
      ).bind(deviceId, generationId, ...ids).first();
      if (Number(found?.n || 0) !== ids.length) return errorResponse("record_not_found", "A check refers to a record outside the active generation.", 409, requestId, origin, env);
    }
    const created = new Date().toISOString();
    const results = await env.DB.batch(observations.map((row) => env.DB.prepare(
      "INSERT INTO check_observations (observation_id, account_id, device_id, generation_id, record_id, installed_version, latest_version, result, source_type, checked_at, last_good_at, error_code, paid_upgrade, route, expires_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)"
    ).bind(
      crypto.randomUUID(), head.account_id, deviceId, generationId, row.record_id,
      row.installed_version ?? null, row.latest_version ?? null, row.result, row.source_type,
      row.checked_at, row.last_good_at ?? null, row.error_code ?? null, row.paid_upgrade ? 1 : 0,
      row.route ?? null, new Date(Date.parse(row.checked_at) + 90 * 24 * 60 * 60 * 1000).toISOString()
    )));
    if (results.length !== observations.length) throw new Error("database_unavailable");
    await env.DB.prepare("UPDATE devices SET last_seen_at = ?1 WHERE device_id = ?2 AND revoked_at IS NULL").bind(created, deviceId).run();
    return json({ device_id: deviceId, generation_id: generationId, accepted: observations.length }, 201, requestId, origin, env);
  } catch {
    return errorResponse("database_unavailable", "Check observations could not be stored.", 503, requestId, origin, env);
  }
}

async function readChecks(request, env, account, requestId, origin) {
  const deviceId = new URL(request.url).searchParams.get("device_id");
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    "SELECT observation_id, device_id, generation_id, record_id, installed_version, latest_version, result, source_type, checked_at, last_good_at, error_code, paid_upgrade, route FROM (SELECT c.*, ROW_NUMBER() OVER (PARTITION BY c.device_id, c.record_id ORDER BY c.checked_at DESC, c.observation_id DESC) AS rn FROM check_observations c JOIN devices d ON d.device_id = c.device_id AND d.account_id = c.account_id WHERE c.account_id = ?1 AND c.expires_at > ?2 AND d.revoked_at IS NULL AND (?3 IS NULL OR c.device_id = ?3)) WHERE rn = 1 ORDER BY checked_at DESC"
  ).bind(account.account_id, now, deviceId).all();
  return json({ observations: result.results || [] }, 200, requestId, origin, env);
}

async function readPreferences(env, account, requestId, origin) {
  const [settings, marks] = await Promise.all([
    env.DB.prepare("SELECT setting_key, value_json, revision, updated_at FROM account_settings WHERE account_id = ?1 ORDER BY setting_key").bind(account.account_id).all(),
    env.DB.prepare("SELECT scope, target_key, favorite, pinned, hidden, tags_json, snooze_until, revision, updated_at FROM library_marks WHERE account_id = ?1 ORDER BY scope, target_key").bind(account.account_id).all()
  ]);
  return json({
    settings: (settings.results || []).map((item) => ({ key: item.setting_key, value: JSON.parse(item.value_json), revision: item.revision, updated_at: item.updated_at })),
    marks: (marks.results || []).map((item) => ({ ...item, tags: JSON.parse(item.tags_json), tags_json: undefined }))
  }, 200, requestId, origin, env);
}

async function updateSetting(request, env, account, requestId, origin) {
  let body;
  try { body = await parseJsonBody(request, 4096); }
  catch { return errorResponse("invalid_request", "A small JSON preference update is required.", 400, requestId, origin, env); }
  const { key, value, expected_revision: expected } = body;
  const allowed = key === "check_cadence" ? ["manual", "daily", "weekly", "monthly"] :
    key === "appearance" ? ["system", "light", "dark"] :
    key === "notifications" || key === "category_display" ? [true, false] : null;
  if (!allowed || !allowed.includes(value) || !Number.isInteger(expected) || expected < 0) {
    return errorResponse("invalid_preferences", "The preference key, value or revision is invalid.", 400, requestId, origin, env);
  }
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    "INSERT INTO account_settings (account_id, setting_key, value_json, revision, updated_at) VALUES (?1, ?2, ?3, 1, ?4) ON CONFLICT(account_id, setting_key) DO UPDATE SET value_json = excluded.value_json, revision = account_settings.revision + 1, updated_at = excluded.updated_at WHERE account_settings.revision = ?5 RETURNING revision"
  ).bind(account.account_id, key, JSON.stringify(value), now, expected).first();
  if (!result) return errorResponse("revision_conflict", "This preference changed elsewhere. Refresh it before saving.", 409, requestId, origin, env);
  return json({ key, value, revision: result.revision, updated_at: now }, 200, requestId, origin, env);
}

async function updateMark(request, env, account, requestId, origin) {
  let body;
  try { body = await parseJsonBody(request, 8192); }
  catch { return errorResponse("invalid_request", "A small JSON mark update is required.", 400, requestId, origin, env); }
  const { scope, target_key: targetKey, favorite = false, pinned = false, hidden = false, tags = [], snooze_until: snoozeUntil = null, expected_revision: expected } = body;
  if (!new Set(["vendor", "product"]).has(scope) || typeof targetKey !== "string" || targetKey.length < 1 || targetKey.length > 255 ||
      /[\\/\u0000-\u001f]/.test(targetKey) || typeof favorite !== "boolean" || typeof pinned !== "boolean" || typeof hidden !== "boolean" ||
      !Array.isArray(tags) || tags.length > 20 || tags.some((tag) => typeof tag !== "string" || tag.length > 48 || /[\u0000-\u001f]/.test(tag)) ||
      (snoozeUntil !== null && (typeof snoozeUntil !== "string" || Number.isNaN(Date.parse(snoozeUntil)) || Date.parse(snoozeUntil) > Date.now() + 90 * 24 * 60 * 60 * 1000)) ||
      !Number.isInteger(expected) || expected < 0) {
    return errorResponse("invalid_preferences", "The preference mark contains invalid fields.", 400, requestId, origin, env);
  }
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    "INSERT INTO library_marks (account_id, scope, target_key, favorite, pinned, hidden, tags_json, snooze_until, revision, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1, ?9) ON CONFLICT(account_id, scope, target_key) DO UPDATE SET favorite = excluded.favorite, pinned = excluded.pinned, hidden = excluded.hidden, tags_json = excluded.tags_json, snooze_until = excluded.snooze_until, revision = library_marks.revision + 1, updated_at = excluded.updated_at WHERE library_marks.revision = ?10 RETURNING revision"
  ).bind(account.account_id, scope, targetKey, favorite ? 1 : 0, pinned ? 1 : 0, hidden ? 1 : 0, JSON.stringify(tags), snoozeUntil, now, expected).first();
  if (!result) return errorResponse("revision_conflict", "This mark changed elsewhere. Refresh it before saving.", 409, requestId, origin, env);
  return json({ scope, target_key: targetKey, favorite, pinned, hidden, tags, snooze_until: snoozeUntil, revision: result.revision, updated_at: now }, 200, requestId, origin, env);
}

async function readStatusSummary(request, env, account, requestId, origin) {
  const deviceId = new URL(request.url).searchParams.get("device_id");
  const now = Date.now();
  const rows = await env.DB.prepare(
    "SELECT d.device_id, d.display_name, g.generation_id, g.completed_at AS observed_at, r.record_id, r.name, r.bundle_identifier, r.version AS installed_version, r.format, c.result AS raw_result, c.checked_at, c.latest_version, c.source_type, c.paid_upgrade FROM devices d JOIN device_inventory_heads h ON h.device_id = d.device_id JOIN scan_generations g ON g.device_id = h.device_id AND g.generation_id = h.generation_id JOIN published_inventory_records r ON r.device_id = d.device_id AND r.generation_id = g.generation_id LEFT JOIN (SELECT * FROM (SELECT checks.*, ROW_NUMBER() OVER (PARTITION BY device_id, record_id ORDER BY checked_at DESC, observation_id DESC) AS rn FROM check_observations checks WHERE account_id = ?1 AND expires_at > ?2) WHERE rn = 1) c ON c.device_id = d.device_id AND c.record_id = r.record_id WHERE d.account_id = ?1 AND d.revoked_at IS NULL AND (?3 IS NULL OR d.device_id = ?3) ORDER BY d.device_id, r.name"
  ).bind(account.account_id, new Date(now).toISOString(), deviceId).all();
  const marksResult = await env.DB.prepare("SELECT scope, target_key, favorite, pinned, hidden, snooze_until FROM library_marks WHERE account_id = ?1").bind(account.account_id).all();
  const marks = new Map((marksResult.results || []).map((mark) => [`${mark.scope}:${mark.target_key}`, mark]));
  const counts = { update: 0, up_to_date: 0, manual: 0, unchecked: 0, error: 0, stale: 0, snoozed: 0, hidden: 0, pinned: 0 };
  const resultRows = (rows.results || []).map((row) => {
    const mark = marks.get(`product:${row.bundle_identifier || row.name}`);
    const isFresh = row.checked_at && now - Date.parse(row.checked_at) <= 7 * 24 * 60 * 60 * 1000;
    const bucket = !row.raw_result ? "unchecked" : !isFresh ? "stale" : row.raw_result;
    counts[bucket] = (counts[bucket] || 0) + 1;
    if (mark?.snooze_until && Date.parse(mark.snooze_until) > now) counts.snoozed++;
    if (mark?.hidden) counts.hidden++;
    if (mark?.pinned) counts.pinned++;
    return {
      device_id: row.device_id, device_name: row.display_name,
      generation_id: row.generation_id, observed_at: row.observed_at,
      record_id: row.record_id, name: row.name, format: row.format,
      installed_version: row.installed_version, latest_version: row.latest_version,
      raw_status: row.raw_result || "unchecked", status: bucket,
      checked_at: row.checked_at || null, stale: Boolean(row.checked_at && !isFresh),
      paid_upgrade: Boolean(row.paid_upgrade),
      snoozed: Boolean(mark?.snooze_until && Date.parse(mark.snooze_until) > now),
      hidden: Boolean(mark?.hidden), pinned: Boolean(mark?.pinned)
    };
  });
  return json({ rule_version: 1, counts, records: resultRows }, 200, requestId, origin, env);
}

async function createPairing(request, env, requestId, origin) {
  let input;
  try {
    input = await parseJsonBody(request);
  } catch (error) {
    const status = error.message === "request_too_large" ? 413 : 400;
    return errorResponse("invalid_request", "A small JSON pairing request is required.", status, requestId, origin, env);
  }
  const deviceName = typeof input?.device_name === "string" ? input.device_name.trim() : "";
  const publicKey = input?.public_key;
  if (deviceName.length < 1 || deviceName.length > 80 || /[\u0000-\u001f\u007f]/.test(deviceName)) {
    return errorResponse("invalid_request", "A valid companion device name is required.", 400, requestId, origin, env);
  }
  let rateAllowed;
  try {
    rateAllowed = await pairingRateLimit(request, env, "create");
  } catch {
    return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
  }
  if (!rateAllowed) return errorResponse("rate_limited", "Too many pairing requests. Try again shortly.", 429, requestId, origin, env);
  if (!await verifyPairingKeyProof(publicKey, input?.client_nonce, input?.proof_signature)) {
    return errorResponse("invalid_pairing_proof", "The companion signing key could not be verified.", 401, requestId, origin, env);
  }

  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
  const pairingId = randomToken();
  const pollingSecret = randomToken();
  const serverNonce = randomToken();
  const canonicalPublicKey = { kty: "EC", crv: "P-256", x: publicKey.x, y: publicKey.y };
  const publicKeyJson = JSON.stringify(canonicalPublicKey);
  const fingerprint = await sha256Hex(publicKeyJson);
  const phraseDigest = new Uint8Array(await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode(`${pairingId}\n${serverNonce}\n${fingerprint}`)
  ));
  const phrase = pairingPhrase(phraseDigest);
  try {
    await env.DB.prepare(
      "INSERT INTO pairings (pairing_id, polling_secret_hash, device_name, public_key_jwk, public_key_fingerprint, server_nonce, verification_phrase, created_at, expires_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)"
    ).bind(pairingId, await sha256Hex(pollingSecret), deviceName, publicKeyJson, fingerprint, serverNonce, phrase, createdAt, expiresAt).run();
  } catch {
    return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
  }
  const approvalUrl = env.SITE_ORIGIN
    ? `${env.SITE_ORIGIN}/?pairing=${encodeURIComponent(pairingId)}`
    : null;
  return json({ pairing_id: pairingId, polling_secret: pollingSecret, server_nonce: serverNonce,
    verification_phrase: phrase, device_name: deviceName, expires_at: expiresAt, approval_url: approvalUrl },
  201, requestId, origin, env);
}

async function pollPairing(request, env, requestId, origin, pairingId) {
  const pollingSecret = request.headers.get("x-pairing-secret") || "";
  if (!pollingSecret || pollingSecret.length > 128) {
    return errorResponse("unauthorized", "A valid pairing polling secret is required.", 401, requestId, origin, env);
  }
  let rateAllowed;
  try {
    rateAllowed = await pairingRateLimit(request, env, "poll");
  } catch {
    return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
  }
  if (!rateAllowed) return errorResponse("rate_limited", "Too many pairing polls. Try again shortly.", 429, requestId, origin, env);

  const now = new Date().toISOString();
  let pairing;
  try {
    pairing = await env.DB.prepare(
      "SELECT pairing_id, polling_secret_hash, device_name, public_key_jwk, approved_account_id, approved_at, delivered_at, expires_at, poll_attempts FROM pairings WHERE pairing_id = ?1"
    ).bind(pairingId).first();
  } catch {
    return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
  }
  if (!pairing || pairing.expires_at <= now) {
    return errorResponse("pairing_expired", "This pairing request is no longer available.", 410, requestId, origin, env);
  }
  if (pairing.poll_attempts >= 240) return errorResponse("rate_limited", "This pairing request has reached its polling limit.", 429, requestId, origin, env);
  if (await sha256Hex(pollingSecret) !== pairing.polling_secret_hash) {
    return errorResponse("unauthorized", "A valid pairing polling secret is required.", 401, requestId, origin, env);
  }
  if (pairing.delivered_at) return errorResponse("pairing_consumed", "This pairing credential was already issued.", 410, requestId, origin, env);
  if (!pairing.approved_account_id) {
    await env.DB.prepare("UPDATE pairings SET poll_attempts = poll_attempts + 1 WHERE pairing_id = ?1 AND poll_attempts < 240").bind(pairingId).run();
    return json({ status: "pending", retry_after_seconds: 3, expires_at: pairing.expires_at }, 202, requestId, origin, env);
  }

  const deviceId = crypto.randomUUID();
  const credentialId = crypto.randomUUID();
  const deviceCredential = randomToken();
  const credentialHash = await sha256Hex(deviceCredential);
  let results;
  try {
    results = await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO devices (device_id, account_id, display_name, public_key_jwk, capabilities_json, created_at) SELECT ?1, approved_account_id, device_name, public_key_jwk, '[\"inventory:write\",\"checks:write\",\"commands:read\",\"actions:write\",\"diagnostics:write\"]', ?2 FROM pairings WHERE pairing_id = ?3 AND approved_account_id = ?4 AND delivered_at IS NULL AND expires_at > ?2 AND (SELECT COUNT(*) FROM devices WHERE account_id = approved_account_id AND revoked_at IS NULL) < ?5"
      ).bind(deviceId, now, pairingId, pairing.approved_account_id, activeDeviceLimit(env)),
      env.DB.prepare(
        "INSERT INTO device_credentials (credential_id, device_id, account_id, token_hash, issued_at) SELECT ?1, ?2, ?3, ?4, ?5 FROM devices WHERE device_id = ?2 AND account_id = ?3 AND revoked_at IS NULL"
      ).bind(credentialId, deviceId, pairing.approved_account_id, credentialHash, now),
      env.DB.prepare(
        "UPDATE pairings SET device_id = ?1, delivered_at = ?2, poll_attempts = poll_attempts + 1 WHERE pairing_id = ?3 AND approved_account_id = ?4 AND delivered_at IS NULL AND EXISTS (SELECT 1 FROM device_credentials WHERE credential_id = ?5 AND device_id = ?1)"
      ).bind(deviceId, now, pairingId, pairing.approved_account_id, credentialId)
    ]);
  } catch {
    return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
  }
  if (results?.[0]?.meta?.changes !== 1 || results?.[1]?.meta?.changes !== 1 || results?.[2]?.meta?.changes !== 1) {
    const active = await env.DB.prepare("SELECT COUNT(*) AS n FROM devices WHERE account_id = ?1 AND revoked_at IS NULL").bind(pairing.approved_account_id).first();
    if (Number(active?.n) >= activeDeviceLimit(env)) return errorResponse("device_limit_reached", "This account has reached its active device limit.", 409, requestId, origin, env);
    return errorResponse("pairing_unavailable", "This pairing request has already been completed or expired.", 409, requestId, origin, env);
  }
  return json({ status: "paired", device_id: deviceId, device_credential: deviceCredential,
    credential_id: credentialId, credential_expires_at: null }, 200, requestId, origin, env);
}

async function handle(request, env, requestId, origin) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") {
    if (origin && origin !== env.SITE_ORIGIN) {
      return errorResponse("origin_denied", "Origin is not allowed.", 403, requestId, origin, env);
    }
    return new Response(null, { status: 204, headers: {
      "vary": "Origin",
      ...(origin && env.SITE_ORIGIN ? {
        "access-control-allow-origin": origin,
        "access-control-allow-headers": "authorization, content-type, x-csrf-token",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-max-age": "600",
        "access-control-allow-credentials": "true"
      } : {})
    } });
  }

  if (url.pathname === "/health" && request.method === "GET") {
    return json({ status: "ok", service: "aimm-library-api", api_version: 1 }, 200, requestId, origin, env);
  }

  if (url.pathname === "/v1/session" && request.method === "GET") {
    if (!env.SITE_ORIGIN || origin !== env.SITE_ORIGIN) {
      return errorResponse("origin_denied", "Session read requires the configured AIMM site origin.", 403, requestId, origin, env);
    }
    const session = await sessionFromRequest(request, env);
    const csrfToken = readCookie(request, "__Host-aimm-library-csrf");
    if (!session || !csrfToken || await sha256Hex(csrfToken) !== session.csrf_hash) {
      return errorResponse("unauthorized", "A valid Library API browser session is required.", 401, requestId, origin, env);
    }
    return json({
      account_id: session.account_id,
      role: "account_owner",
      csrf_token: csrfToken,
      expires_at: session.expires_at
    }, 200, requestId, origin, env);
  }

  if (url.pathname === "/v1/session" && request.method === "POST") {
    if (!env.SITE_ORIGIN || origin !== env.SITE_ORIGIN) {
      return errorResponse("origin_denied", "Session exchange requires the configured AIMM site origin.", 403, requestId, origin, env);
    }
    try {
      const identity = await verifyAccessToken(request, env);
      if (!identity.scopes.includes("read:library")) {
        return errorResponse("insufficient_scope", "The access token lacks permission for this operation.", 403, requestId, origin, env);
      }
      const account = await getOrCreateAccount(env.DB, identity);
      const nowSeconds = Math.floor(Date.now() / 1000);
      const maxAge = Math.min(identity.expiresAt - nowSeconds, 8 * 60 * 60);
      if (!Number.isInteger(maxAge) || maxAge < 1) {
        return errorResponse("unauthorized", "A valid, unexpired Library API access token is required.", 401, requestId, origin, env);
      }
      const sessionToken = randomToken();
      const csrfToken = randomToken();
      const createdAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();
      try {
        await env.DB.prepare(
          "INSERT INTO browser_sessions (session_id, account_id, token_hash, csrf_hash, scopes_json, auth_time, created_at, expires_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)"
        ).bind(
          crypto.randomUUID(),
          account.account_id,
          await sha256Hex(sessionToken),
          await sha256Hex(csrfToken),
          JSON.stringify(identity.scopes),
          identity.authTime,
          createdAt,
          expiresAt
        ).run();
      } catch {
        throw new Error("database_unavailable");
      }
      const response = json({
        account_id: account.account_id,
        role: "account_owner",
        csrf_token: csrfToken,
        expires_at: expiresAt
      }, 200, requestId, origin, env);
      return setSessionCookies(response, sessionToken, csrfToken, maxAge);
    } catch (error) {
      if (error.message === "unauthorized") {
        return errorResponse("unauthorized", "A valid Library API access token is required.", 401, requestId, origin, env);
      }
      if (error.message === "oidc_not_configured") {
        return errorResponse("identity_unavailable", "Identity provider configuration is not available.", 503, requestId, origin, env);
      }
      if (error.message === "database_unavailable") {
        return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
      }
      if (error.message === "account_deleted") {
        return errorResponse("account_deleted", "This account was deleted and cannot be restored during the deletion period.", 403, requestId, origin, env);
      }
      console.error("Library API session exchange failure", requestId);
      return errorResponse("identity_unavailable", "Identity provider could not be reached.", 503, requestId, origin, env);
    }
  }

  if (url.pathname === "/v1/session" && request.method === "DELETE") {
    const session = await sessionFromRequest(request, env);
    if (!session) {
      return errorResponse("unauthorized", "A valid Library API browser session is required.", 401, requestId, origin, env);
    }
    const account = { authMode: "cookie", csrf_hash: session.csrf_hash };
    const csrfError = await requireCsrf(request, env, account, requestId, origin);
    if (csrfError) return csrfError;
    await env.DB.prepare(
      "UPDATE browser_sessions SET revoked_at = ?1 WHERE session_id = ?2 AND revoked_at IS NULL"
    ).bind(new Date().toISOString(), session.session_id).run();
    return clearSessionCookies(json({ signed_out: true }, 200, requestId, origin, env));
  }

  if (url.pathname === "/v1/pairings" && request.method === "POST") {
    return createPairing(request, env, requestId, origin);
  }
  const pairingPoll = /^\/v1\/pairings\/([A-Za-z0-9_-]{40,64})\/poll$/.exec(url.pathname);
  if (pairingPoll && request.method === "POST") {
    return pollPairing(request, env, requestId, origin, pairingPoll[1]);
  }

  const deviceCredentialRotate = /^\/v1\/devices\/([0-9a-f-]{36})\/credentials\/rotate$/.exec(url.pathname);
  if (deviceCredentialRotate && request.method === "POST") {
    const deviceId = deviceCredentialRotate[1];
    try {
      await requireDeviceCredential(request, env, deviceId);
    } catch (error) {
      if (error.message === "database_unavailable") {
        return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
      }
      return errorResponse("unauthorized", "A valid active device credential is required for this device.", 401, requestId, origin, env);
    }
    const authorization = request.headers.get("authorization") || "";
    const match = /^Bearer ([^\s]+)$/.exec(authorization);
    if (!match) return errorResponse("unauthorized", "A valid active device credential is required for this device.", 401, requestId, origin, env);
    const now = new Date().toISOString();
    const oldHash = await sha256Hex(match[1]);
    const newCredential = randomToken();
    const newCredentialId = crypto.randomUUID();
    let results;
    try {
      results = await env.DB.batch([
        env.DB.prepare(
          "UPDATE device_credentials SET revoked_at = ?1, rotated_to_credential_id = ?2 WHERE device_id = ?3 AND token_hash = ?4 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?1) AND EXISTS (SELECT 1 FROM devices d WHERE d.device_id = ?3 AND d.account_id = device_credentials.account_id AND d.revoked_at IS NULL)"
        ).bind(now, newCredentialId, deviceId, oldHash),
        env.DB.prepare(
          "INSERT INTO device_credentials (credential_id, device_id, account_id, token_hash, issued_at, expires_at) SELECT ?1, d.device_id, d.account_id, ?2, ?3, NULL FROM devices d WHERE d.device_id = ?4 AND d.revoked_at IS NULL AND EXISTS (SELECT 1 FROM device_credentials old WHERE old.device_id = d.device_id AND old.token_hash = ?5 AND old.rotated_to_credential_id = ?1 AND old.revoked_at = ?3)"
        ).bind(newCredentialId, await sha256Hex(newCredential), now, deviceId, oldHash)
      ]);
    } catch {
      return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
    }
    if (results?.[0]?.meta?.changes !== 1 || results?.[1]?.meta?.changes !== 1) {
      return errorResponse("unauthorized", "This device credential is no longer active.", 401, requestId, origin, env);
    }
    return json({ device_id: deviceId, device_credential: newCredential, credential_expires_at: null }, 200, requestId, origin, env);
  }

  const deviceIdentity = /^\/v1\/devices\/([0-9a-f-]{36})\/identity$/.exec(url.pathname);
  if (deviceIdentity && request.method === "GET") {
    try {
      const device = await requireDeviceCredential(request, env, deviceIdentity[1]);
      return json(device, 200, requestId, origin, env);
    } catch (error) {
      if (error.message === "database_unavailable") {
        return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
      }
      return errorResponse("unauthorized", "A valid active device credential is required for this device.", 401, requestId, origin, env);
    }
  }

  const inventoryChunk = /^\/v1\/devices\/([0-9a-f-]{36})\/inventory\/([0-9a-f-]{36})\/chunks\/(\d{1,3})$/.exec(url.pathname);
  if (inventoryChunk && request.method === "PUT") {
    const [, deviceId, generationId, indexText] = inventoryChunk;
    let device;
    try { device = await requireDeviceCredential(request, env, deviceId); }
    catch (error) {
      const status = error.message === "database_unavailable" ? 503 : 401;
      return errorResponse(status === 503 ? "database_unavailable" : "unauthorized", "A valid active device credential is required for this device.", status, requestId, origin, env);
    }
    if (!device.capabilities.includes("inventory:write")) return errorResponse("capability_denied", "This device is not authorised to write inventory.", 403, requestId, origin, env);
    const result = await writeInventoryChunk(request, env, requestId, origin, deviceId, generationId, Number(indexText));
    if (result.status < 500) await env.DB.prepare("UPDATE devices SET last_seen_at = ?1 WHERE device_id = ?2 AND revoked_at IS NULL").bind(new Date().toISOString(), deviceId).run();
    return result;
  }

  const inventoryStart = /^\/v1\/devices\/([0-9a-f-]{36})\/inventory\/([0-9a-f-]{36})\/start$/.exec(url.pathname);
  if (inventoryStart && request.method === "POST") {
    const [, deviceId, generationId] = inventoryStart;
    let device;
    try { device = await requireDeviceCredential(request, env, deviceId); }
    catch (error) {
      const status = error.message === "database_unavailable" ? 503 : 401;
      return errorResponse(status === 503 ? "database_unavailable" : "unauthorized", "A valid active device credential is required for this device.", status, requestId, origin, env);
    }
    if (!device.capabilities.includes("inventory:write")) return errorResponse("capability_denied", "This device is not authorised to write inventory.", 403, requestId, origin, env);
    const result = await startInventoryGeneration(request, env, requestId, origin, deviceId, generationId);
    if (result.status < 500) await env.DB.prepare("UPDATE devices SET last_seen_at = ?1 WHERE device_id = ?2 AND revoked_at IS NULL").bind(new Date().toISOString(), deviceId).run();
    return result;
  }

  const deviceCommandsRoute = /^\/v1\/devices\/([0-9a-f-]{36})\/commands$/.exec(url.pathname);
  if (deviceCommandsRoute && request.method === "GET") {
    return deviceCommands(request, env, requestId, origin, deviceCommandsRoute[1]);
  }
  const deviceClaimRoute = /^\/v1\/devices\/([0-9a-f-]{36})\/actions\/([0-9a-f-]{36})\/claim$/.exec(url.pathname);
  if (deviceClaimRoute && request.method === "POST") {
    return claimDeviceAction(request, env, requestId, origin, deviceClaimRoute[1], deviceClaimRoute[2]);
  }
  const deviceReceiptRoute = /^\/v1\/devices\/([0-9a-f-]{36})\/actions\/([0-9a-f-]{36})\/receipt$/.exec(url.pathname);
  if (deviceReceiptRoute && request.method === "POST") {
    return acceptActionReceipt(request, env, requestId, origin, deviceReceiptRoute[1], deviceReceiptRoute[2]);
  }

  const inventoryFinalize = /^\/v1\/devices\/([0-9a-f-]{36})\/inventory\/([0-9a-f-]{36})\/finalize$/.exec(url.pathname);
  if (inventoryFinalize && request.method === "POST") {
    const [, deviceId, generationId] = inventoryFinalize;
    let device;
    try { device = await requireDeviceCredential(request, env, deviceId); }
    catch (error) {
      const status = error.message === "database_unavailable" ? 503 : 401;
      return errorResponse(status === 503 ? "database_unavailable" : "unauthorized", "A valid active device credential is required for this device.", status, requestId, origin, env);
    }
    if (!device.capabilities.includes("inventory:write")) return errorResponse("capability_denied", "This device is not authorised to write inventory.", 403, requestId, origin, env);
    const result = await finalizeInventory(request, env, requestId, origin, deviceId, generationId);
    if (result.status < 500) await env.DB.prepare("UPDATE devices SET last_seen_at = ?1 WHERE device_id = ?2 AND revoked_at IS NULL").bind(new Date().toISOString(), deviceId).run();
    return result;
  }

  const checkBatch = /^\/v1\/devices\/([0-9a-f-]{36})\/checks\/([0-9a-f-]{36})$/.exec(url.pathname);
  if (checkBatch && request.method === "POST") {
    const [, deviceId, generationId] = checkBatch;
    let device;
    try { device = await requireDeviceCredential(request, env, deviceId); }
    catch (error) {
      const status = error.message === "database_unavailable" ? 503 : 401;
      return errorResponse(status === 503 ? "database_unavailable" : "unauthorized", "A valid active device credential is required for this device.", status, requestId, origin, env);
    }
    if (!device.capabilities.includes("checks:write")) return errorResponse("capability_denied", "This device is not authorised to write check observations.", 403, requestId, origin, env);
    return submitChecks(request, env, requestId, origin, deviceId, generationId);
  }

  const requiredScope = requiredScopeFor(request.method, url.pathname);
  if (!requiredScope) {
    return errorResponse("not_found", "Route not found.", 404, requestId, origin, env);
  }

  let account;
  try {
    account = await requireAccount(request, env, requiredScope);
  } catch (error) {
    if (error.message === "unauthorized") {
      return errorResponse("unauthorized", "A valid Library API access token is required.", 401, requestId, origin, env);
    }
    if (error.message === "insufficient_scope") {
      return errorResponse("insufficient_scope", "The access token lacks permission for this operation.", 403, requestId, origin, env);
    }
    if (error.message === "oidc_not_configured") {
      return errorResponse("identity_unavailable", "Identity provider configuration is not available.", 503, requestId, origin, env);
    }
    if (error.message === "database_unavailable") {
      return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
    }
    if (error.message === "account_deleted") {
      return errorResponse("account_deleted", "This account was deleted and cannot be restored during the deletion period.", 403, requestId, origin, env);
    }
    console.error("Library API identity failure", requestId);
    return errorResponse("identity_unavailable", "Identity provider could not be reached.", 503, requestId, origin, env);
  }

  const pairingRead = /^\/v1\/pairings\/([A-Za-z0-9_-]{40,64})$/.exec(url.pathname);
  if (pairingRead && request.method === "GET") {
    let pairing;
    try {
      pairing = await env.DB.prepare(
        "SELECT pairing_id, device_name, public_key_fingerprint, verification_phrase, created_at, expires_at, approved_at, delivered_at FROM pairings WHERE pairing_id = ?1 AND (approved_account_id IS NULL OR approved_account_id = ?2)"
      ).bind(pairingRead[1], account.account_id).first();
    } catch {
      return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
    }
    if (!pairing || pairing.expires_at <= new Date().toISOString() || pairing.delivered_at) {
      return errorResponse("pairing_unavailable", "This pairing request is no longer available.", 404, requestId, origin, env);
    }
    return json({ pairing_id: pairing.pairing_id, device_name: pairing.device_name,
      public_key_fingerprint: pairing.public_key_fingerprint, verification_phrase: pairing.verification_phrase,
      expires_at: pairing.expires_at, approved: Boolean(pairing.approved_at) }, 200, requestId, origin, env);
  }

  const pairingApproval = /^\/v1\/pairings\/([A-Za-z0-9_-]{40,64})\/approve$/.exec(url.pathname);
  if (pairingApproval && request.method === "POST") {
    if (account.authMode === "cookie") {
      const csrfError = await requireCsrf(request, env, account, requestId, origin);
      if (csrfError) return csrfError;
    }
    let input;
    try {
      input = await parseJsonBody(request, 1024);
    } catch {
      return errorResponse("invalid_request", "Confirm the displayed pairing phrase.", 400, requestId, origin, env);
    }
    if (typeof input?.verification_phrase !== "string") {
      return errorResponse("confirmation_required", "Confirm the displayed pairing phrase.", 400, requestId, origin, env);
    }
    let pairing;
    try {
      pairing = await env.DB.prepare(
        "SELECT verification_phrase, expires_at, approved_account_id, delivered_at FROM pairings WHERE pairing_id = ?1"
      ).bind(pairingApproval[1]).first();
    } catch {
      return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
    }
    if (!pairing || pairing.expires_at <= new Date().toISOString() || pairing.delivered_at) {
      return errorResponse("pairing_unavailable", "This pairing request has expired or was already completed.", 404, requestId, origin, env);
    }
    if (pairing.approved_account_id) {
      return errorResponse("pairing_unavailable", "This pairing request has already been approved.", 409, requestId, origin, env);
    }
    if (input.verification_phrase.trim().toLowerCase() !== pairing.verification_phrase.toLowerCase()) {
      return errorResponse("pairing_phrase_mismatch", "The verification phrase does not match.", 403, requestId, origin, env);
    }
    let activeDevices;
    try {
      activeDevices = await env.DB.prepare(
        "SELECT COUNT(*) AS n FROM devices WHERE account_id = ?1 AND revoked_at IS NULL"
      ).bind(account.account_id).first();
    } catch {
      return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
    }
    if (Number(activeDevices?.n) >= activeDeviceLimit(env)) {
      return errorResponse("device_limit_reached", "This account has reached its active device limit.", 409, requestId, origin, env);
    }
    const approvedAt = new Date().toISOString();
    let result;
    try {
      result = await env.DB.prepare(
        "UPDATE pairings SET approved_account_id = ?1, approved_at = ?2 WHERE pairing_id = ?3 AND approved_account_id IS NULL AND delivered_at IS NULL AND expires_at > ?2"
      ).bind(account.account_id, approvedAt, pairingApproval[1]).run();
    } catch {
      return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
    }
    if (result?.meta?.changes !== 1) {
      return errorResponse("pairing_unavailable", "This pairing request has already been approved or expired.", 409, requestId, origin, env);
    }
    return json({ pairing_id: pairingApproval[1], approved: true, approved_at: approvedAt }, 200, requestId, origin, env);
  }

  if (url.pathname === "/v1/me" && request.method === "GET") {
    return json({
      account_id: account.account_id,
      role: "account_owner",
      created_at: account.created_at
    }, 200, requestId, origin, env);
  }

  if (url.pathname === "/v1/library" && request.method === "GET") {
    return readLibrary(request, env, account, requestId, origin);
  }
  if (url.pathname === "/v1/checks" && request.method === "GET") {
    return readChecks(request, env, account, requestId, origin);
  }
  if (url.pathname === "/v1/status-summary" && request.method === "GET") {
    return readStatusSummary(request, env, account, requestId, origin);
  }
  if (url.pathname === "/v1/preferences" && request.method === "GET") {
    return readPreferences(env, account, requestId, origin);
  }
  if (url.pathname === "/v1/preferences/settings" && request.method === "PUT") {
    return updateSetting(request, env, account, requestId, origin);
  }
  if (url.pathname === "/v1/preferences/marks" && request.method === "PUT") {
    return updateMark(request, env, account, requestId, origin);
  }
  if (url.pathname === "/v1/actions" && request.method === "POST") {
    return createAction(request, env, account, requestId, origin);
  }
  const ownerAction = /^\/v1\/actions\/([0-9a-f-]{36})$/.exec(url.pathname);
  if (ownerAction && request.method === "GET") {
    const operation = await env.DB.prepare(
      "SELECT o.operation_id, o.device_id, o.generation_id, o.kind, o.state, o.created_at, o.expires_at, r.summary_json FROM operations o LEFT JOIN action_receipts r ON r.operation_id = o.operation_id AND r.device_id = o.device_id WHERE o.operation_id = ?1 AND o.account_id = ?2"
    ).bind(ownerAction[1], account.account_id).first();
    if (!operation) return errorResponse("not_found", "Action was not found.", 404, requestId, origin, env);
    let receipt = null;
    if (operation.summary_json) {
      try {
        const summary = JSON.parse(operation.summary_json);
        receipt = { state: summary.state, completed_at: summary.completed_at, item_statuses: summary.items.map((item) => item.status) };
      } catch { return errorResponse("database_unavailable", "Action receipt could not be read.", 503, requestId, origin, env); }
    }
    const itemCount = await env.DB.prepare("SELECT COUNT(*) AS n FROM operation_items WHERE operation_id = ?1").bind(operation.operation_id).first();
    return json({ operation_id: operation.operation_id, device_id: operation.device_id, generation_id: operation.generation_id, kind: operation.kind, state: operation.state, item_count: Number(itemCount?.n || 0), created_at: operation.created_at, expires_at: operation.expires_at, receipt }, 200, requestId, origin, env);
  }

  if ((request.method === "POST" || request.method === "PUT" || request.method === "DELETE") && account.authMode === "cookie") {
    const csrfError = await requireCsrf(request, env, account, requestId, origin);
    if (csrfError) return csrfError;
  }

  if (url.pathname === "/v1/me" && request.method === "DELETE") {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const authTime = account.identity.authTime;
    if (authTime === null || authTime > nowSeconds + 60 || nowSeconds - authTime > 10 * 60) {
      return errorResponse("reauthentication_required", "Sign in again before deleting this account.", 403, requestId, origin, env);
    }

    const length = Number(request.headers.get("content-length") || 0);
    if (length > 1024) {
      return errorResponse("invalid_request", "Deletion confirmation is too large.", 413, requestId, origin, env);
    }

    let confirmation;
    try {
      if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
        throw new Error("invalid_content_type");
      }
      confirmation = await request.json();
    } catch {
      return errorResponse("invalid_request", "A JSON account deletion confirmation is required.", 400, requestId, origin, env);
    }
    if (!confirmation || confirmation.confirm_account_id !== account.account_id) {
      return errorResponse("confirmation_required", "Confirm the account ID before deleting account data.", 400, requestId, origin, env);
    }

    const deletedAt = new Date().toISOString();
    const purgeAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const results = await env.DB.batch([
      env.DB.prepare(
        "INSERT OR REPLACE INTO deleted_identities (oidc_issuer, oidc_subject, deleted_at, purge_at) SELECT oidc_issuer, oidc_subject, ?1, ?2 FROM accounts WHERE account_id = ?3 AND oidc_issuer = ?4 AND oidc_subject = ?5"
      ).bind(deletedAt, purgeAt, account.account_id, account.identity.issuer, account.identity.subject),
      env.DB.prepare(
        "DELETE FROM accounts WHERE account_id = ?1 AND oidc_issuer = ?2 AND oidc_subject = ?3"
      ).bind(account.account_id, account.identity.issuer, account.identity.subject)
    ]);
    if (!results[0]?.meta || results[0].meta.changes !== 1 || !results[1]?.meta || results[1].meta.changes !== 1) {
      return errorResponse("not_found", "Account was not found.", 404, requestId, origin, env);
    }
    return json({ deleted: true, deleted_at: deletedAt }, 200, requestId, origin, env);
  }

  if (url.pathname === "/v1/devices" && request.method === "GET") {
    const result = await env.DB.prepare(
      "SELECT device_id, display_name, companion_version, capabilities_json, created_at, last_seen_at, revoked_at FROM devices WHERE account_id = ?1 ORDER BY created_at"
    ).bind(account.account_id).all();
    return json({ devices: result.results || [] }, 200, requestId, origin, env);
  }

  const revoke = /^\/v1\/devices\/([0-9a-f-]{36})\/revoke$/.exec(url.pathname);
  if (revoke && request.method === "POST") {
    const revokedAt = new Date().toISOString();
      const results = await env.DB.batch([
      env.DB.prepare(
        "UPDATE devices SET revoked_at = ?1 WHERE device_id = ?2 AND account_id = ?3 AND revoked_at IS NULL"
      ).bind(revokedAt, revoke[1], account.account_id),
      env.DB.prepare(
        "UPDATE device_credentials SET revoked_at = ?1 WHERE device_id = ?2 AND account_id = ?3 AND revoked_at IS NULL"
      ).bind(revokedAt, revoke[1], account.account_id)
    ]);
    if (!results[0]?.meta || results[0].meta.changes !== 1) {
      return errorResponse("not_found", "Device not found or already revoked.", 404, requestId, origin, env);
    }
    return json({ device_id: revoke[1], revoked_at: revokedAt }, 200, requestId, origin, env);
  }

  return errorResponse("not_found", "Route not found.", 404, requestId, origin, env);
}

async function runRetentionCleanup(env) {
  const now = new Date().toISOString();
  return env.DB.batch([
    env.DB.prepare("DELETE FROM action_receipts WHERE expires_at <= ?1").bind(now),
    env.DB.prepare("DELETE FROM check_observations WHERE expires_at <= ?1").bind(now),
    env.DB.prepare("UPDATE operations SET state = 'expired', terminal_at = ?1 WHERE state IN ('requested', 'claimed') AND expires_at <= ?1").bind(now),
    env.DB.prepare("DELETE FROM operations WHERE terminal_at IS NOT NULL AND terminal_at <= ?1").bind(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()),
    env.DB.prepare("DELETE FROM shares WHERE expires_at <= ?1 OR revoked_at IS NOT NULL").bind(now),
    env.DB.prepare("DELETE FROM profile_comparisons WHERE expires_at <= ?1 OR revoked_at IS NOT NULL").bind(now),
    env.DB.prepare("DELETE FROM deleted_identities WHERE purge_at <= ?1").bind(now),
    env.DB.prepare("DELETE FROM browser_sessions WHERE expires_at <= ?1 OR revoked_at IS NOT NULL").bind(now),
    env.DB.prepare("DELETE FROM pairings WHERE expires_at <= ?1 OR (delivered_at IS NOT NULL AND delivered_at <= ?2)").bind(now, new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    env.DB.prepare("DELETE FROM pairing_rate_limits WHERE window_start < ?1").bind(Date.now() - 60 * 60 * 1000)
  ]);
}

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();
    const origin = request.headers.get("origin");
    if (!env.DB) {
      return errorResponse("database_unavailable", "Library database is not configured.", 503, requestId, origin, env);
    }
    try {
      return await handle(request, env, requestId, origin);
    } catch {
      console.error("Library API request failure", requestId);
      return errorResponse("internal_error", "The request could not be completed.", 500, requestId, origin, env);
    }
  },
  async scheduled(controller, env, ctx) {
    if (!env.DB) throw new Error("database_unavailable");
    ctx.waitUntil(runRetentionCleanup(env));
  }
};
