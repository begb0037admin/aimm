# Development Library sign-in reached app but API rejected session — 2026-10-27

**Observed at:** 2026-10-27 18:35 UTC
**Branch:** `codex/pluginhub-foundation`
**Preview:** `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/`

## Result

From Settings in the non-production branch preview, the Library **Sign in** control returned to the app through the configured Auth0 issuer. The app’s automatic post-login account refresh then displayed: “A valid Library API access token is required.” The Library settings panel still reports that a valid access token is required.

No inventory or account preference data was returned. No credentials or token contents were inspected or recorded. This does not prove the Auth0 callback/token exchange or Library API session creation works end to end; the browser-to-Worker account parity gate remains open.

## Next diagnosis

Check the development Worker’s authentication diagnostic for the rejected session and compare its live OIDC issuer, audience, allowed client ID and preview-origin configuration with the SPA. Do not retry account reads until the failure is understood. Then repeat the approved non-production account parity check, followed by the supported cross-account paired-credential rejection probe and fresh independent Foundation review.

No deployment, credential change, D1 operation, or provider update was made. Foundation remains **NOT MET**; Stage 6 remains gated. Preserve the 22:47 authorization chronology.
