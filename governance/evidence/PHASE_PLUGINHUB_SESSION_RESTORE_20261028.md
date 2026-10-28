# Development Library session restoration through Pages proxy — 2026-10-28

## Result

PASS — a development Library browser session can now be restored after a reload through the approved GitHub Pages branch preview. This covers one browser/session only. The Auth0 test identity was not independently identified, so this does not close User A/B session isolation or CSRF gates.

## Changes

- Commit `fc8369fe606e79fd205f6ac363ad462ce2c51563` preserves separate upstream `Set-Cookie` headers through the Pages proxy.
- Commit `5f625ae7efb4df9c2c7ada7c7cc5c38b0bf96ea7` allows an origin-less `GET /v1/session` only when `Sec-Fetch-Site` is `same-origin`, then supplies the checked Pages request origin upstream. For this session-read path, origin-less requests are rejected unless `Sec-Fetch-Site` is exactly `same-origin`; no Origin is synthesized for other paths or methods.
- Jules reviewed both exact source diffs and passed them.
- Cloudflare Pages preview deployment `51b6edb9-5bf9-4833-a738-f3a4a51a4ae1` completed successfully in the `preview` environment and aliases to the approved branch preview origin.

## Browser verification

On the approved development branch preview, sign-in returned the “Signed in to the development Library” notice and the read-only Account preferences action loaded. After reloading the page, the same read-only action displayed “Development Library preferences are ready to review” with no sign-in error.

Verification used an accessibility snapshot that included rendered Account preference control values; those values are not reproduced here or persisted in the evidence report. No identity value was inspected. Session/CSRF data were handled by the browser and app in memory; no cookie or token contents were extracted or recorded. No inventory records were requested. The normal sign-in exchange created its browser-session record through the approved development API; no manual D1 query or write was made. No inventory or provider-status check, passkey ceremony, provider configuration, terms or credential changes, plug-in file action, or Worker deployment occurred. The origin-less request denial matrix was not separately exercised.

## Remaining gates

This single-session restore result does not establish Auth0 User A/B isolation, missing-CSRF rejection, cross-site request rejection, or broader session/CSRF acceptance. The other open gates remain: 317 browser-only entries and two version differences; compatible synthetic Stage 5 move/restore and remote recovery; reproducible development Worker deployment (requires restored Wrangler authentication and separately recorded owner approval); and fresh independent end-to-end Foundation review.

Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical bundle patch, not a reproducible build from branch source. No production deployment or cutover occurred.
