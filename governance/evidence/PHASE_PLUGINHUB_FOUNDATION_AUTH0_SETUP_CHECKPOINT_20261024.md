# PluginHub Foundation — Auth0 development setup checkpoint (2026-10-24)

## Provider resources created

Kevin was signed into the existing Auth0 development tenant. No new tenant was created, no terms were accepted during this continuation, and no billing details or plan upgrade were entered.

- Tenant: `dev-cxmqjc40zltqlx7l`
- Domain: `dev-cxmqjc40zltqlx7l.us.auth0.com`
- Issuer: `https://dev-cxmqjc40zltqlx7l.us.auth0.com/`
- JWKS URL: `https://dev-cxmqjc40zltqlx7l.us.auth0.com/.well-known/jwks.json`
- API: `AIMM Library API (development)`
- API audience: `https://aimm-library-api-dev`
- API signing: RS256 (confirmed by the Auth0 quickstart after creation)
- User-delegated API access: per-app authorization
- Client credentials access: no apps allowed
- SPA: `AIMM Library Web (development)`, first-party Single Page Application
- SPA client ID: `3EbH8eIpW9FxYvKoXIeYtRvhcGWGtwPA`
- Refresh Token Rotation is enabled in the SPA settings.

Both resources were created in the development tenant through its signed-in dashboard. API creation and SPA creation were confirmed by Kevin in chat. Auth0 automatically created a separate machine-to-machine “Test Application” with the API. The custom API policy denies client access, so that test client cannot use client credentials against this API.

## 1Password record

The non-secret connection configuration was saved in the Personal vault as:

- `AIMM PluginHub Foundation — Auth0 Development` (Secure Note)
- `AIMM PluginHub Foundation — Auth0 Library API (development)` (API Credentials)

The entries contain the tenant, domain, issuer, JWKS URL, API audience and SPA client ID. The generated SPA client secret was neither revealed nor saved; a browser SPA must use Authorization Code with PKCE and must not use a client secret.

## Scope permissions correction

Three project scope definitions were briefly added before explicit owner confirmation and then removed. No application was granted them; the API currently has zero permissions and denies client access. They remain absent pending action-time approval.

## Current configuration limits

- Auth0 callback and web-origin URLs remain blank pending owner action-time confirmation. The exact local-only callback route has since been verified in Chrome at `http://localhost:4173/dev-auth-test.html`; the proposed origin is `http://localhost:4173`. The current harness does not call Auth0 logout, so an Auth0 logout URL is not needed.
- The custom API currently has no permission/scope definitions; no app has API scopes granted. The project scopes are `read:library`, `manage:devices`, and `delete:account`; define and grant them only after the exact local callback/runtime path is ready and the owner confirms the permission change.
- The Auth0 API and SPA exist, but no usable provider-backed flow has been run. No Auth0 user token, Worker HTTP exchange, browser session/CSRF, cross-account rejection, recovery or independent review evidence was produced in this checkpoint.
- The branch Worker remains undeployed. No deployment, remote D1 write, billing or production change occurred.

## Foundation disposition

Provider resource creation is evidenced, but the provider/runtime gate is incomplete. Foundation exit remains **NOT MET**. Next: after owner action-time confirmation, configure only the verified loopback callback and web origin, define and grant only `read:library` to the SPA, and run provider-backed local HTTP/session/CSRF/account-isolation checks. Do not define or grant `manage:devices` or `delete:account` for this read-only test. Pairing and fresh independent review remain separate open gates. Keep the 22:47 D1 authorization resolved by the owner's attestation and distinct from the 22:51 retention approval. Obtain fresh independent Stage 5 validation after the evidence gates are complete.

No secrets are stored in this report.


## Local harness and regression verification — 2026-10-24

The latest branch head at verification was `a453c9e4c1b62f0446f87b0dc6d3704ee3c56c31`. The loopback-only Auth0 test page is `library-api/dev-auth-test.html`, blob `003da94c11c4e485191a1b25a7081cf710382c76`. It uses Authorization Code with PKCE/S256 and OAuth state validation; it rejects non-loopback page and Worker origins, keeps the access token in memory, and contains no client secret or localStorage token persistence.

Checks run against branch-fetched source in an isolated temporary directory:

- `node --check library-api/src/index.js` — passed.
- Extracted inline browser script: `node --check` — passed.
- Focused harness static checks (loopback page/Worker guard, PKCE S256, OAuth state validation, no client secret, no localStorage, memory-only token) — 7/7 passed.
- `node --test library-api/test/foundation.test.js` — 5 passed, 0 failed. The first attempt lacked migrations in the temporary fixture and failed with ENOENT; after fetching migrations 0001–0003, the exact suite passed. The initial setup error was fixture-only.

No Auth0 sign-in, provider token exchange, Worker HTTP/session/CSRF/account-isolation test, pairing test, deployment or remote D1 write occurred. Auth0 callback/logout/web-origin settings and API scopes/grants remain unset pending action-time owner approval. The helper harness is source-verified only. Foundation exit remains **NOT MET**.


## Browser-visible loopback route verification — 2026-10-24

The branch-fetched page was served from an isolated temporary directory on a loopback-only local HTTP server and opened in Chrome. The rendered Auth0 test page was visibly verified at `http://localhost:4173/dev-auth-test.html`; this is the exact redirect URI the harness constructs from its page origin and path. The API Worker URL defaults to `http://localhost:8787`. No OAuth request or login button was initiated.

The proposed minimal Auth0 settings for the next provider test are:

- Allowed Callback URL: `http://localhost:4173/dev-auth-test.html`
- Allowed Web Origin: `http://localhost:4173`
- Allowed Logout URL is not needed for this harness because its logout control deletes the AIMM API session and does not call Auth0 logout.
- Define and grant only the `read:library` API scope to the SPA for its session exchange and account-read test. Do not add `manage:devices` or `delete:account` for this test.

These values/settings are proposed and remain unapplied pending owner confirmation because callback allowlists and API grants expand security-sensitive access. No provider-backed test, deployment or remote D1 write occurred. Foundation exit remains **NOT MET**.

## Current settings verification and grant status — 2026-10-24

The SPA settings now contain and persist the Allowed Callback URL `http://localhost:4173/dev-auth-test.html` and Allowed Web Origin `http://localhost:4173`. The API defines only the first-test permission `read:library`, but its Auth0 API Access panel still reports **0 / 1 permissions granted** for the SPA; the owner dashboard session expired before saving the grant. Re-authentication is required. The matching non-secret connection record in 1Password was updated to mark the grant as pending. The SPA must not use a client secret.


## Public JWKS reachability — local synthetic probe

The local Worker reached the configured Auth0 JWKS endpoint when presented with a synthetic JWT carrying a deliberately nonexistent key ID, and returned HTTP 401 as expected. This validates public JWKS reachability and rejection of an unknown key only; it is not a real-token or user-authentication test.
