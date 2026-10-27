import test from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "./[[path]].js";

const SITE = "https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev";
const RELAY = "https://aimm-proxy.kevinlelitte.workers.dev/anthropic/v1/messages";
const ACCOUNT = "https://aimm-library-api-dev.kevinlelitte.workers.dev/v1/session";

function makeRequest(path="/anthropic/v1/messages", overrides={}) {
  const headers = new Headers({
    origin: SITE,
    "content-type": "application/json",
    cookie: "__Host-aimm-library-session=synthetic-session; __Host-aimm-library-csrf=synthetic-csrf",
    "anthropic-version": "2023-06-01",
    "x-api-key": "aimm-proxy-managed",
    authorization: "Bearer must-not-forward"
  });
  for (const [name, value] of Object.entries(overrides.headers || {})) {
    if (value == null) headers.delete(name); else headers.set(name, value);
  }
  return new Request(SITE + path, {
    method: overrides.method || "POST",
    headers,
    body: overrides.body === undefined ? JSON.stringify({ model:"test-model", max_tokens:1, messages:[{ role:"user", content:"synthetic" }] }) : overrides.body
  });
}

function context(request) { return { request }; }

test("authenticated preview session relays only the narrow Anthropic request", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (input, init={}) => {
    const url = String(input);
    calls.push({ url, init });
    if (url === ACCOUNT) return new Response(JSON.stringify({ role:"account_owner" }), { status:200 });
    if (url === RELAY) return new Response(JSON.stringify({ id:"synthetic", type:"message" }), {
      status:200, headers:{ "content-type":"application/json", "request-id":"synthetic-request", "set-cookie":"must-not-forward" }
    });
    throw new Error("unexpected upstream");
  };
  try {
    const response = await onRequest(context(makeRequest()));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("set-cookie"), null);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, ACCOUNT);
    assert.equal(new Headers(calls[0].init.headers).get("origin"), SITE);
    assert.equal(new Headers(calls[0].init.headers).get("cookie").includes("synthetic-session"), true);
    assert.equal(calls[1].url, RELAY);
    const relayHeaders = new Headers(calls[1].init.headers);
    assert.equal(relayHeaders.get("origin"), "https://aimixmasters.com");
    assert.equal(relayHeaders.get("cookie"), null);
    assert.equal(relayHeaders.get("authorization"), null);
    assert.equal(relayHeaders.get("x-api-key"), null);
    assert.equal(relayHeaders.get("anthropic-version"), "2023-06-01");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects an unauthenticated session before the provider relay", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("{}", { status:401 }); };
  try {
    const response = await onRequest(context(makeRequest()));
    assert.equal(response.status, 401);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = originalFetch; }
});

test("rejects a missing session cookie without contacting either service", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error("must not fetch"); };
  try {
    const response = await onRequest(context(makeRequest("/anthropic/v1/messages", { headers:{ cookie:null } })));
    assert.equal(response.status, 401);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test("rejects an unapproved host and mismatched origin before any fetch", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error("must not fetch"); };
  try {
    const otherHost = new Request("https://aimixmasters.com/anthropic/v1/messages", {
      method:"POST", headers:{ origin:"https://aimixmasters.com", "content-type":"application/json", cookie:"session=x" }, body:"{}"
    });
    const crossOrigin = await onRequest(context(otherHost));
    assert.equal(crossOrigin.status, 403);
    const mismatch = await onRequest(context(makeRequest("/anthropic/v1/messages", { headers:{ origin:"https://attacker.example" } })));
    assert.equal(mismatch.status, 403);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test("only POST to the exact Anthropic messages path is proxied", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("{}", { status:200 }); };
  try {
    const wrongPath = await onRequest(context(makeRequest("/anthropic/v1/models")));
    assert.equal(wrongPath.status, 404);
    const withQuery = await onRequest(context(makeRequest("/anthropic/v1/messages?x=1")));
    assert.equal(withQuery.status, 404);
    const wrongMethod = await onRequest(context(makeRequest("/anthropic/v1/messages", { method:"GET", body:null })));
    assert.equal(wrongMethod.status, 405);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test("rejects non-JSON and oversized request bodies", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("{}", { status:200 }); };
  try {
    const nonJson = await onRequest(context(makeRequest("/anthropic/v1/messages", { headers:{ "content-type":"text/plain" }, body:"hello" })));
    assert.equal(nonJson.status, 415);
    const huge = await onRequest(context(makeRequest("/anthropic/v1/messages", { body:"x".repeat(1_000_001) })));
    assert.equal(huge.status, 413);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

