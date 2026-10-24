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
  return null;
}

async function sessionFromRequest(request, env) {
  const rawToken = readCookie(request, "__Host-aimm-library-session");
  if (!rawToken || rawToken.length > 128) return null;
  const tokenHash = await sha256Hex(rawToken);
  const now = new Date().toISOString();
  return env.DB.prepare(
    "SELECT session_id, account_id, scopes_json, auth_time, csrf_hash, expires_at FROM browser_sessions WHERE token_hash = ?1 AND expires_at > ?2 AND revoked_at IS NULL"
  ).bind(tokenHash, now).first();
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
    env.DB.prepare("DELETE FROM browser_sessions WHERE expires_at <= ?1 OR revoked_at IS NOT NULL").bind(now)
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
