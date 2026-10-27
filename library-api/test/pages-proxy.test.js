import test from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../../functions/account-api/[[path]].js";

test("same-origin API proxy forwards session cookies and preserves API Set-Cookie headers", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    const headers = new Headers({ "content-type": "application/json" });
    headers.append("set-cookie", "__Host-aimm-library-session=session; Path=/; HttpOnly; Secure; SameSite=Strict");
    headers.append("set-cookie", "__Host-aimm-library-csrf=csrf; Path=/; Secure; SameSite=Strict");
    return new Response(JSON.stringify({ account_id: "synthetic-account" }), { status: 200, headers });
  };
  try {
    const request = new Request("https://preview.example/account-api/v1/session?check=synthetic", {
      method: "POST",
      headers: {
        origin: "https://preview.example",
        cookie: "existing=synthetic",
        authorization: "Bearer synthetic-token"
      },
      body: ""
    });
    const response = await onRequest({ request });
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://aimm-library-api-dev.kevinlelitte.workers.dev/v1/session?check=synthetic");
    assert.equal(calls[0].init.headers.get("origin"), "https://preview.example");
    assert.equal(calls[0].init.headers.get("cookie"), "existing=synthetic");
    const cookies = response.headers.get("set-cookie") || "";
    assert.match(cookies, /__Host-aimm-library-session=session/);
    assert.match(cookies, /__Host-aimm-library-csrf=csrf/);
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("proxy rejects non-v1 paths and cross-origin requests before forwarding", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("unexpected"); };
  try {
    const unknown = await onRequest({ request: new Request("https://preview.example/account-api/admin") });
    assert.equal(unknown.status, 404);
    const crossOrigin = await onRequest({ request: new Request("https://preview.example/account-api/v1/me", {
      headers: { origin: "https://attacker.example" }
    }) });
    assert.equal(crossOrigin.status, 403);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
