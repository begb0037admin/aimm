# AIMM Library API — Foundation slice

This directory is an isolated Cloudflare Worker for the approved Plugin Library Foundation. It is separate from `worker/`, which remains the live AI relay. Nothing in this directory is bound to the live relay or site.

## Included

- Version 1 D1 migration for OIDC account mappings, device records and hashed device credentials.
- Retention-ready tables for redacted action receipts, public shares and profile comparison snapshots.
- OIDC JWT validation using a configured HTTPS JWKS endpoint, RS256 signature verification, exact issuer/audience checks, expiry checks and subject-to-random-internal-account mapping.
- `GET /health`, `GET /v1/me`, `GET /v1/devices` and owner-scoped `POST /v1/devices/{id}/revoke`.
- Exact-origin CORS response for the configured AIMM site. CORS is an additional browser boundary; verified identity and account scoping are the authorization boundary.

## Explicitly not implemented in this slice

Pairing, device credential issuance, browser cookie sessions/CSRF, inventory generations, vendor checks, action execution, sharing endpoints, and UI/Hope integration belong to subsequent prepared phases. The worker accepts only Auth0-compatible OIDC access tokens configured for the Library API audience. Until a development tenant and credentials exist, protected routes return a generic identity-unavailable response. Do not point the website or Hope at this worker.

Auth0 is the current OIDC provider selection based on the architecture requirements and current product evidence. Creating an Auth0 tenant requires an owner-authenticated route and acceptance of provider terms. No tenant, app, credential, or paid feature has been created or accepted here.

## Isolated development resource

The Wrangler configuration points only to D1 `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`). It has no custom domain or production route. Apply migrations only to that named database after confirming the selected Cloudflare account/database in the authenticated tool. The migration does not touch existing data because this database was created empty.

Do not deploy this Worker until the Auth0 development application settings and required Worker variables are available. Required variables are `OIDC_ISSUER`, `OIDC_AUDIENCE`, `OIDC_JWKS_URL` and `SITE_ORIGIN`. These must be configured as development settings/secrets, never committed.

## Retention

The approved Foundation policy is in `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md`. Server-side action receipts expire 90 days after terminal state; shares and profiles expire within 30 days; confirmed account deletion removes active data immediately and any retained backup must expire or be purged within 30 days. Expiry cleanup routes/scheduling and enforcement are not in this Foundation slice.

The current development D1 uses the Free plan. Cloudflare documents a 500 MB per-database limit and seven-day Time Travel recovery window for Workers Free. Recheck the production plan, backup behaviour and deletion enforcement before production deployment.
