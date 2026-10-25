# Auth0 development tenant and SPA setup — initial setup 2026-10-25 19:43 UTC

**Follow-up:** the approved SPA callback/origin and API scopes were saved and verified at 20:28 UTC. See [Auth0 configuration validation](PHASE_PLUGINHUB_AUTH0_CONFIGURATION_VALIDATION_20261025.md) for the current provider state and remaining gates.

**Repository:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source checkpoint:** `026477f566ccb0e806690a47536d1e747869158c`
**Foundation:** **NOT MET**; Stage 6 gated

The verified file tree was published to GitHub branch `codex/pluginhub-foundation` at `004841d04060fcd5c8d312ce5b56f0cfe9d450f9` (tree `84b7e40db083acf2c2ea3f49a5e374bf6ec75c07`), equivalent to local commit `31128ff4923c28cd64f5d71e71906ab7cfdf78c1`.

Auth0 dashboard access was available for development tenant `dev-4zlw1s642szi48ve`. The tenant was already present and was reused; no new tenant was created. The project API was created in this tenant with audience `https://aimm-library-api-dev`, Auth0 API ID `6ade5b1d6f1ddf7816f03622`, and RS256 token signing. A browser SPA named `AIMM Library Web (development)` was created with public client ID `pKFWfTQBFDCO7Wt9aAUoHq0vdtwJkci4`.

Issuer: `https://dev-4zlw1s642szi48ve.us.auth0.com/`. JWKS: `https://dev-4zlw1s642szi48ve.us.auth0.com/.well-known/jwks.json`. The setup metadata and public SPA client ID were saved in 1Password under **AIMM PluginHub Foundation — Auth0 Development (dev-4zlw1s642szi48ve)**. No client secret or machine-to-machine secret was retrieved, copied, used, or saved. The SPA uses Authorization Code with PKCE and is not configured to use a client secret.

The loopback callback and origin are still unsaved. Intended callback: `http://127.0.0.1:4173/pair-remote-test.html`; intended web origin: `http://127.0.0.1:4173`. The API has no permissions configured yet, and no SPA-to-API grant exists. Proposed minimum scopes are `read:library` and `manage:devices`. Approval was requested at action time before saving redirect/origin security settings and granting those scopes; no such security setting or grant has been applied.

Local project config now points at the new tenant issuer, JWKS and SPA client ID, and the pairing browser harness points at its domain/client ID. These source edits are uncommitted and have not been verified against a live Auth0 login. No Auth0 user was created, no credentials were reset, no provider terms were accepted, and no deployment, D1 access, or D1 write occurred.

The full local `sh scripts/pluginhub-nonprod-check.sh` passed with the new identifiers in source: local preview packaging/signature, Swift recovery and installer protections, scanner 3/3, API/browser 38/38, local Worker/D1 auth/CORS and synthetic two-account rejection, plus Swift pairing/sync/Manual Check/reveal/move/restore. It initially stopped at SwiftPM manifest planning under the sandbox; the approved local build retry passed. This does not verify Auth0 configuration or remote runtime.

Remaining Foundation evidence includes the saved Auth0 callback/origin and minimum-scope grant, actual provider-backed login, authenticated two-account route isolation, browser session/CSRF, real device pairing, live browser-to-Mac parity, and fresh independent end-to-end review. Keep Foundation **NOT MET** and Stage 6 gated.
