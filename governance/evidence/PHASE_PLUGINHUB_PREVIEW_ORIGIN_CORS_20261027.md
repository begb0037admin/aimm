# Exact Pages preview origin support — 2026-10-27

## Change

Added a strict exact-origin helper to the development Worker. It accepts the existing `SITE_ORIGIN` and explicitly listed HTTPS origins only (plus loopback HTTP for local development), then applies that check consistently to CORS responses, preflight, browser-session exchange/read, and cookie-session CSRF validation. The preflight allow-headers list now includes the action-preview capability header. The dev-only Wrangler configuration lists only `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev` as the additional origin; the existing `https://aimixmasters.com` remains the primary origin and pairing destination.

Source commit: `9ab487957801defcd4b73907b1ab1e0bdd7f48b2`.
- Worker source blob: `f5ac1f05af0a91961fd2a91b5bb38b7ce6f3f551`
- Test blob: `704c8979191fcf71e971a0ab1ec984a2e516e464`
- Dev Wrangler config blob: `c77601aab375cfd25901b25958e234f05bdac6cb`

## Verification

- `node --test test/foundation.test.js`: **21/21 passed** using Worker source and test files fetched from the current connected branch in a disposable temp copy. It reused local migration fixture files; no remote D1 query/write occurred.
- Wrangler 4.152.0 dry-run bundle check succeeded and showed the exact preview allowlist variable, dev D1 binding and public OIDC config. No upload occurred during the dry run.
- A real deploy of only `aimm-library-api-dev` was attempted as authorized. It did not start: Wrangler's stored token had expired and could not be refreshed because the Cloudflare auth endpoint was unreachable. The existing stored credentials were left unchanged. No Worker version was deployed; the remote dev Worker still needs this code.
- No Auth0 settings, credentials, account API requests, D1 data, production configuration or production service were changed.

## Next

Restore Cloudflare Wrangler authentication/connectivity, then deploy this dev-only Worker configuration and verify preview-origin preflight, session and CSRF behavior remotely. Add the exact Pages preview URL to the development Auth0 callback and web-origin allowlists only after verifying the dev SPA/client configuration. Then perform synthetic account-backed browser/Mac/Hope parity and isolation checks without exposing device credentials.

The isolated static preview is live, but CORS/Auth0 runtime activation and account-backed checks are not complete. Foundation remains **NOT MET**; Stage 6 remains gated.
