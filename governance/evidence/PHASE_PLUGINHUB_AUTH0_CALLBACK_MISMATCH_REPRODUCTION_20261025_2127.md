# Auth0 callback mismatch reproduced — 2026-10-25 21:27 UTC

**Repository:** `begb0037admin/aimm`, branch `codex/pluginhub-foundation`  
**Target tenant:** `dev-cxmqjc40zltqlx7l`  
**Test SPA client:** `3EbH8eIpW9FxYvKoXIeYtRvhcGWGtwPA`  
**Callback used:** `http://localhost:4173/dev-auth-test.html`

## Result

The Auth0 authorization request returned **Callback URL mismatch** before displaying a login form. No username or password was entered, no access token was issued, no Library API request was made, and no D1 query or write occurred. No Auth0 setting changed.

The 1Password setup note lists this callback for the old SPA, but the live tenant rejected it. The current signed-in Auth0 dashboard exposes only tenant `dev-4zlw1s642szi48ve`; opening the old application settings link resolves inside that tenant and reports an application-load error. The tenant switcher lists only `dev-4zlw1s642szi48ve`. The existing Test User A/B entries belong to `dev-cxmqjc40zltqlx7l`, which is also the issuer/client used by the active non-production Worker.

## Gate and next action

Use the existing A/B users; do not create duplicates. The tenant owner must make `dev-cxmqjc40zltqlx7l` available in the Auth0 dashboard session so its actual callback and SPA grant can be inspected. If the callback is missing, add only the approved loopback test callback after explicit action-time confirmation. Verify `manage:devices` exists and is granted before attempting pairing; do not broaden scopes without approval.

The current remote D1 validation/write hold remains **OPEN** per Kevin's instruction. Foundation remains **NOT MET**; Stage 6 remains gated. No deployment or cutover.
