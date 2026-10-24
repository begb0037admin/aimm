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
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maximumBytes) throw new Error("request_too_large");
  return JSON.parse(text);
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
    headers.set("access-control-allow-methods", "GET, POST, DELETE, OPTIONS");
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
  if ((method === "GET" && (pathname === "/v1/me" || pathname === "/v1/devices"))) return "read:library";
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
  if (!await verifyPairingKeyProof(publicKey, input?.client_nonce, input?.proof_signature)) {
    return errorResponse("invalid_pairing_proof", "The companion signing key could not be verified.", 401, requestId, origin, env);
  }
  let rateAllowed;
  try {
    rateAllowed = await pairingRateLimit(request, env, "create");
  } catch {
    return errorResponse("database_unavailable", "Library account storage could not be reached.", 503, requestId, origin, env);
  }
  if (!rateAllowed) return errorResponse("rate_limited", "Too many pairing requests. Try again shortly.", 429, requestId, origin, env);

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
  if (pairing.poll_attempts >= 60) return errorResponse("rate_limited", "This pairing request has reached its polling limit.", 429, requestId, origin, env);
  if (await sha256Hex(pollingSecret) !== pairing.polling_secret_hash) {
    await env.DB.prepare("UPDATE pairings SET poll_attempts = poll_attempts + 1 WHERE pairing_id = ?1 AND poll_attempts < 60").bind(pairingId).run();
    return errorResponse("unauthorized", "A valid pairing polling secret is required.", 401, requestId, origin, env);
  }
  if (pairing.delivered_at) return errorResponse("pairing_consumed", "This pairing credential was already issued.", 410, requestId, origin, env);
  if (!pairing.approved_account_id) {
    await env.DB.prepare("UPDATE pairings SET poll_attempts = poll_attempts + 1 WHERE pairing_id = ?1 AND poll_attempts < 60").bind(pairingId).run();
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
        "INSERT INTO devices (device_id, account_id, display_name, public_key_jwk, created_at) SELECT ?1, approved_account_id, device_name, public_key_jwk, ?2 FROM pairings WHERE pairing_id = ?3 AND approved_account_id = ?4 AND delivered_at IS NULL AND expires_at > ?2 AND (SELECT COUNT(*) FROM devices WHERE account_id = approved_account_id AND revoked_at IS NULL) < ?5"
      ).bind(deviceId, now, pairingId, pairing.approved_account_id, 10),
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
    if (Number(active?.n) >= 10) return errorResponse("device_limit_reached", "This account has reached its active device limit.", 409, requestId, origin, env);
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
        "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
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
    if (Number(activeDevices?.n) >= 10) {
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

  if ((request.method === "POST" || request.method === "DELETE") && account.authMode === "cookie") {
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
