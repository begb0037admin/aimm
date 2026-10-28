# Foundation passkey preview relying-party fix — 2026-10-28

The branch preview is served from `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev`. The approved Cloudflare Worker configuration allows this exact preview origin, but had `SITE_ORIGIN=https://aimixmasters.com`; the deployed Worker built WebAuthn `rp.id` from `SITE_ORIGIN`. That produced the browser's relying-party-domain rejection.

The Worker source now derives the WebAuthn origin and RP ID from the exact request Origin only after validating it against the configured exact-origin allowlist. Registration and authentication use the same checked origin. Unapproved origins remain rejected. The source change is commit `19bd4a048990a7178e84e307b35efccb9bf190bc`, source blob `05bd55aaf196cb5743d3a2bf80f1482aebd03cf8`. Tests cover the allowlisted preview RP ID, canonical RP ID, authentication consistency, and rejection of an unapproved origin; test change commit `9bd7935f92ed64a98420f83f55b7b1cb3dc53f83`, test blob `ee45e0d5515c750ca366eca73dbc2bdb7ce5a9a9`.

The local non-production API suite passed 38/38 after the change. No passkey was created, no D1 data was read or written, and no production resource was changed.

The fix is committed to the development source branch, but is **not yet running** in Cloudflare. Read-only Cloudflare inspection showed the development Worker still annotated with source commit `b3d0e2800fcc708fddd8096878a9739a5aca0ad3`. Wrangler 4.152.0 is not authenticated; its stored token expired and the shell could not reach the Cloudflare authorization endpoint to refresh it. Do not retry passkey setup until the isolated development Worker is updated and its health/configuration is verified.

Foundation remains **NOT MET**; Stage 6 remains gated. No deployment or credential action occurred in this checkpoint.

## Build verification

The latest branch's `library-api/test/foundation.test.js` passed 22/22, including the preview RP ID and origin rejection cases. The local full Library API suite passed 38/38. Wrangler 4.152.0 `deploy --dry-run` bundled the latest branch Worker successfully (888.66 KiB, 159.81 KiB gzip) with the expected non-production D1 and exact preview allowlist. This was only a dry run; the current Wrangler token is expired, so the Worker remains unchanged.
