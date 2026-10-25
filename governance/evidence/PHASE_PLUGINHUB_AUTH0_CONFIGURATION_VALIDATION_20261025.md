# Auth0 development configuration validation — 2026-10-25 20:28 UTC

**Repository:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Source checkpoint tested:** `3ae9d1fe117ee685dfd75f09a5870f8ad8790fc3` (tree `e0ea57ea295da7b4ed66851572e329fc1dc7a648`)  
**Foundation:** **NOT MET**; Stage 6 remains gated

## Approved provider configuration

Kevin approved applying the two pending Auth0 development settings: the local SPA callback/origin and the minimum API scopes. In tenant `dev-4zlw1s642szi48ve`, the `AIMM Library Web (development)` SPA now has:

- Allowed callback: `http://127.0.0.1:4173/pair-remote-test.html`
- Allowed web origin: `http://127.0.0.1:4173`
- User-delegated access to `AIMM Library API (development)`: `read:library` and `manage:devices` (2/2 defined scopes)
- Client access: no permissions granted; no M2M access was enabled

The API permissions were defined as `read:library` (account library and related status reads) and `manage:devices` (approve pairings and revoke devices). Auth0 showed a successful save for the SPA URI settings and a successful creation of the per-application user-delegated grant. Reloading the SPA settings showed the exact callback and origin persisted. The API access panel showed 2/2 permissions granted and a generated grant ID. No client secret or M2M credential was viewed, copied, used or saved.

## Public provider metadata

Read-only requests to the tenant's OIDC discovery and JWKS endpoints succeeded. Discovery returned issuer `https://dev-4zlw1s642szi48ve.us.auth0.com/`, the expected authorization/token endpoints, `jwks_uri` ending in `/.well-known/jwks.json`, and support for Authorization Code with PKCE using `S256`. JWKS returned two RSA signing keys using `RS256`. This verifies public metadata reachability and consistency; it does not verify an interactive login or an issued access token.

The non-secret setup record in 1Password, **AIMM PluginHub Foundation — Auth0 Development (dev-4zlw1s642szi48ve)**, was updated with the callback, origin, scopes and access-policy result. No secret value was added.

## Local verification and limits

`sh scripts/pluginhub-nonprod-check.sh` passed at source checkpoint `3ae9d1fe117ee685dfd75f09a5870f8ad8790fc3`. The ordinary sandbox attempt stopped at SwiftPM manifest planning (`sandbox_apply: Operation not permitted`); the same requested local suite passed after the approved sandbox escalation. Results included preview packaging/signature, Swift journal and recovery, installer staging and redirect protections, scanner 3/3, API/browser 38/38, isolated local D1/Worker authorization and synthetic two-account rejection, and Swift pairing/sync/check/reveal/move/restore with signed receipts. All fixture data was local and synthetic.

No interactive SPA login/token exchange was performed, because the available Google identities are real accounts and no synthetic Auth0 test users were available. No new test account or credential was created. No remote D1 request or write occurred, and no Worker deployment or production action occurred. The suite's local checks do not establish Auth0-backed remote account isolation, browser session/CSRF behavior, real pairing or live recovery.

## Foundation status and next work

Foundation remains **NOT MET**. Continue with synthetic provider-backed account tests only after a non-production test identity is available through an authorized path. Then perform the bounded Auth0-backed runtime and two-account rejection checks, browser session/CSRF and pairing walkthrough, remote recovery evidence, current Mac/browser parity, and fresh independent end-to-end review. Keep the 22:47 D1 authorization chronology unchanged. Do not deploy or cut over.
