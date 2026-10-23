const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

let jwksCache = { url: "", expiresAt: 0, keys: [] };

function json(body, status = 200, requestId, origin, env) {
  const headers = new Headers(JSON_HEADERS);
  headers.set("x-request-id", requestId);
  headers.set("vary", "Origin");
  if (origin && env.SITE_ORIGIN && origin === env.SITE_ORIGIN) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-headers", "authorization, content-type");
    headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
    headers.set("access-control-max-age", "600");
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
  if (!env.OIDC_ISSUER || !env.OIDC_AUDIENCE || !env.OIDC_JWKS_URL) {
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
  if (Array.isArray(claims.aud) && claims.aud.length > 1 && claims.azp !== env.OIDC_AUDIENCE) {
    throw new Error("unauthorized");
  }
  return { issuer: env.OIDC_ISSUER, subject: claims.sub };
}

async function getOrCreateAccount(db, identity) {
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
}

async function requireAccount(request, env) {
  const identity = await verifyAccessToken(request, env);
  return getOrCreateAccount(env.DB, identity);
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
        "access-control-allow-headers": "authorization, content-type",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-max-age": "600"
      } : {})
    } });
  }

  if (url.pathname === "/health" && request.method === "GET") {
    return json({ status: "ok", service: "aimm-library-api", api_version: 1 }, 200, requestId, origin, env);
  }

  if (!url.pathname.startsWith("/v1/")) {
    return errorResponse("not_found", "Route not found.", 404, requestId, origin, env);
  }

  let account;
  try {
    account = await requireAccount(request, env);
  } catch (error) {
    if (error.message === "unauthorized") {
      return errorResponse("unauthorized", "A valid Library API access token is required.", 401, requestId, origin, env);
    }
    if (error.message === "oidc_not_configured") {
      return errorResponse("identity_unavailable", "Identity provider configuration is not available.", 503, requestId, origin, env);
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

  if (url.pathname === "/v1/devices" && request.method === "GET") {
    const result = await env.DB.prepare(
      "SELECT device_id, display_name, companion_version, capabilities_json, created_at, last_seen_at, revoked_at FROM devices WHERE account_id = ?1 ORDER BY created_at"
    ).bind(account.account_id).all();
    return json({ devices: result.results || [] }, 200, requestId, origin, env);
  }

  const revoke = /^\/v1\/devices\/([0-9a-f-]{36})\/revoke$/.exec(url.pathname);
  if (revoke && request.method === "POST") {
    const revokedAt = new Date().toISOString();
    const result = await env.DB.prepare(
      "UPDATE devices SET revoked_at = ?1 WHERE device_id = ?2 AND account_id = ?3 AND revoked_at IS NULL"
    ).bind(revokedAt, revoke[1], account.account_id).run();
    if (!result.meta || result.meta.changes !== 1) {
      return errorResponse("not_found", "Device not found or already revoked.", 404, requestId, origin, env);
    }
    await env.DB.prepare(
      "UPDATE device_credentials SET revoked_at = ?1 WHERE device_id = ?2 AND account_id = ?3 AND revoked_at IS NULL"
    ).bind(revokedAt, revoke[1], account.account_id).run();
    return json({ device_id: revoke[1], revoked_at: revokedAt }, 200, requestId, origin, env);
  }

  return errorResponse("not_found", "Route not found.", 404, requestId, origin, env);
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
  }
};
