# PluginHub Hope same-origin preview proxy — 2026-10-27

## Result

Hope typed chat successfully returned the account inventory count in the non-production branch preview after the earlier browser request failed with a CORS error. The working request used the same-origin Pages Function at `/anthropic/v1/messages`; the shared provider relay and its CORS allowlist were left unchanged.

The chat response reported **485 items**. The Library account preview separately displays **1,641 inventory records**. These figures are not reconciled here and do not prove browser/Mac/Hope parity; the app may count distinct products while the account preview counts product-format records. Parity remains OPEN.

## Implementation

Source commit: `634da560d4157969c0d02daaa98797df883de442` on `codex/pluginhub-foundation`.

- `functions/anthropic/[[path]].js` blob `40eb69bff8437a5904c495891f018aeb7d31bb57`
- `functions/anthropic/proxy.test.mjs` blob `db11fbbe50b6f1529bdda62ecf32acc75fe12e1c`
- `index.html` blob `55f0968e899b85f7b876d4ff9de7d91606773aae`
- `_routes.json` blob `58b75dc6de62f713ffc664bf3b929c5dae5bfeb6`

The Pages Function accepts only same-origin POSTs to the exact Anthropic messages path on the named non-production preview, requires JSON, caps request bodies at 1 MB, and checks the existing Library session with the development account API before relaying. It forwards only the content type and Anthropic version/beta headers; it does not forward the browser cookie, browser API key, or Authorization header. The relay URL is fixed to the existing shared Worker and the upstream Origin is fixed to the established app origin. The shared Worker allowlist/configuration was not changed.

## Verification

Focused Node tests: **6/6 passed** from a disposable temporary copy. Coverage includes authenticated relay, missing/expired session rejection, host/origin rejection, exact route/method enforcement, content-type rejection, and body-size rejection.

Cloudflare Pages preview deployment `207d5c68-46cd-4d04-b3d9-d36879d21199` completed successfully for source commit `634da560d4157969c0d02daaa98797df883de442`. The stable branch alias is `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/`. After deployment, a fresh Hope typed-chat request returned the count instead of a fetch error.

No full repository suite was run. No production deployment, shared Worker change, D1 operation, credential change, provider setting change, or cutover occurred.

## Gate status

This verifies one authenticated Hope chat request on the non-production preview. It does not verify complete browser/Mac/Hope inventory parity, remote account-isolation rejection, backup recovery, the live wrong-device paired-credential 401, all approved Stage 2–5 evidence, or fresh independent end-to-end Foundation acceptance. Foundation remains **NOT MET**; Stage 6 remains gated. Preserve the 22:47 D1 authorization chronology.

The function and this narrow request path still need independent security review. The earlier independent proxy review covered only the Library session proxy, not this Anthropic relay function. Do not deploy this branch source to production without review and an explicit deployment authorization.
