const UPSTREAM = "https://aimm-library-api-dev.kevinlelitte.workers.dev";
const PREFIX = "/account-api";
const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "DELETE", "OPTIONS"]);

function jsonError(status, code, message) {
  return new Response(JSON.stringify({ error: { code, message, retryable: false } }), {
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
  const path = incoming.pathname.slice(PREFIX.length) || "/";
  if (!path.startsWith("/v1/") && path !== "/v1") {
    return jsonError(404, "not_found", "Route not found.");
  }
  if (!ALLOWED_METHODS.has(request.method)) {
    return jsonError(405, "method_not_allowed", "Method not allowed.");
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== incoming.origin) {
    return jsonError(403, "origin_rejected", "This same-origin API proxy only accepts requests from this site.");
  }

  const target = new URL(path + incoming.search, UPSTREAM);
  const headers = new Headers(request.headers);
  for (const name of ["host", "content-length", "cf-connecting-ip", "cf-ray", "cf-worker"]) headers.delete(name);
  if (!origin && request.method === "GET" && path === "/v1/session") {
    if (request.headers.get("sec-fetch-site") !== "same-origin") {
      return jsonError(403, "origin_rejected", "This session read requires a same-origin browser request.");
    }
    headers.set("origin", incoming.origin);
  }
  const init = { method: request.method, headers, redirect: "manual" };
  if (request.method !== "GET" && request.method !== "HEAD") init.body = request.body;
  const upstream = await fetch(target, init);
  const responseHeaders = new Headers(upstream.headers);
  const setCookies = upstream.headers.getAll("Set-Cookie");
  responseHeaders.delete("Set-Cookie");
  for (const cookie of setCookies) responseHeaders.append("Set-Cookie", cookie);
  responseHeaders.set("cache-control", "no-store");
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders
  });
}
