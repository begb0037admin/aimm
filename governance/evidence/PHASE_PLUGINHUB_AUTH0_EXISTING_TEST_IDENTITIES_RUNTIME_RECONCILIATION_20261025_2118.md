# Auth0 test identities and deployed runtime reconciliation — 2026-10-25 21:18 UTC

**Repository:** `begb0037admin/aimm`, branch `codex/pluginhub-foundation`  
**GitHub branch head:** `cb602aeca1239148e017f76f1e618571a1d64278` (tree `a12f47348c3786ce33d536bfa3f3865b4983614e`)  
**Local checkout:** `d4bdcf741fd940bb9e79fee39fb76d61becb12a3`, same tree `a12f47348c3786ce33d536bfa3f3865b4983614e`

## Findings

Kevin confirmed the two Auth0 test users already exist. Read-only inspection of 1Password verified saved Test User A and Test User B entries for tenant `dev-cxmqjc40zltqlx7l`; no password was revealed or copied.

Read-only Cloudflare deployment metadata verified that the active non-production Worker version is `47c58f05-8f9e-4600-bb76-4d6520d9ba79` (100% traffic), bound to the approved D1 `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. Its OIDC issuer, audience and allowed SPA client match the existing A/B tenant and client. The current branch's `library-api/wrangler.toml` instead points to the later tenant `dev-4zlw1s642szi48ve` and its newer SPA client. The source has not been deployed since the earlier Worker version, so these two configurations are not interchangeable.

The deployed Worker health endpoint returned HTTP 200 with `{"status":"ok","service":"aimm-library-api","api_version":1}`. No Auth0 login or token exchange was attempted. No D1 query or write, deployment, 1Password edit, production action or cutover occurred in this checkpoint.

## Gate and next action

The existence of A and B clears the test-identity creation prerequisite; do not create duplicate users. The 22:47 D1 authorization gate remains **OPEN** per Kevin's instruction. Session exchange, CSRF, authenticated two-account isolation and pairing checks that create or change D1 rows must wait until that gate is cleared. Foundation remains **NOT MET** and Stage 6 remains gated.

Once the D1 gate is cleared, use the existing A/B identities against a runtime whose issuer/client match them. Before pairing, reconcile the source/live tenant mismatch and verify the old SPA's `manage:devices` grant; do not silently broaden provider access. No deployment is included in this work.
