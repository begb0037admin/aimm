const SITE_ORIGIN = "https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev";
const ACCOUNT_API = "https://aimm-library-api-dev.kevinlelitte.workers.dev/v1/session";
const RELAY_API = "https://aimm-proxy.kevinlelitte.workers.dev/anthropic/v1/messages";
const RELAY_ORIGIN = "https://aimixmasters.com";
const MAX_BODY_BYTES = 1_000_000;
const REQUEST_HEADERS = ["content-type", "anthropic-version", "anthropic-beta"];
const RESPONSE_HEADERS = ["content-type", "request-id", "anthropic-request-id"];

function errorResponse(status, code, message) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

export async function onRequest({ request }) {
  const incoming = new URL(request.url);
  if (incoming.origin !== SITE_ORIGIN) {
    return errorResponse(403, "preview_host_rejected", "This route is only available on the approved development preview.");
  }
  if (incoming.pathname !== "/anthropic/v1/messages" || incoming.search) {
    return errorResponse(404, "not_found", "Route not found.");
  }
  if (request.method !== "POST") {
    return errorResponse(405, "method_not_allowed", "Method not allowed.");
  }
  if (request.headers.get("origin") !== SITE_ORIGIN) {
    return errorResponse(403, "origin_rejected", "A same-origin request is required.");
  }
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) {
    return errorResponse(415, "content_type_rejected", "A JSON request is required.");
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return errorResponse(413, "body_too_large", "The request exceeds the development preview limit.");
  }

  let body;
  try {
    if (!request.body) body = new Uint8Array();
    else {
      const reader = request.body.getReader();
      const chunks = [];
      let total = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX_BODY_BYTES) {
          await reader.cancel();
          return errorResponse(413, "body_too_large", "The request exceeds the development preview limit.");
        }
        chunks.push(value);
      }
      body = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    }
  } catch {
    return errorResponse(400, "invalid_body", "The JSON request body could not be read.");
  }

  const cookie = request.headers.get("cookie");
  if (!cookie) {
    return errorResponse(401, "session_required", "Sign in to the development Library before using Hope here.");
  }

  let session;
  try {
    session = await fetch(ACCOUNT_API, {
      method: "GET",
      headers: { cookie, origin: SITE_ORIGIN, accept: "application/json" },
      redirect: "manual"
    });
  } catch {
    return errorResponse(502, "session_check_failed", "The development Library session could not be checked.");
  }
  if (session.status === 401) {
    return errorResponse(401, "session_required", "Sign in to the development Library before using Hope here.");
  }
  if (!session.ok) {
    return errorResponse(502, "session_check_failed", "The development Library session could not be checked.");
  }
  try { await session.body?.cancel(); } catch {}

  const headers = new Headers();
  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("origin", RELAY_ORIGIN);

  let upstream;
  try {
    upstream = await fetch(RELAY_API, {
      method: "POST",
      headers,
      body,
      redirect: "manual"
    });
  } catch {
    return errorResponse(502, "provider_unavailable", "Hope's research service could not be reached.");
  }

  const responseHeaders = new Headers({
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });
  for (const name of RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders
  });
}

