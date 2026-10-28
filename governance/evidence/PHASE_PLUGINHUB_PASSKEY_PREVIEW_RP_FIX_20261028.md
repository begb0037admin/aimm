# Foundation passkey preview relying-party fix — 2026-10-28

The branch preview is served from `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev`. Cloudflare had this exact origin in its development allowlist, but the active API Worker generated WebAuthn `rp.id` from `SITE_ORIGIN=https://aimixmasters.com`. Chrome therefore rejected the passkey request because the relying party did not match the preview domain.

## Source fix

The branch source now derives WebAuthn origin and RP ID from the exact request Origin, after validating it against the configured exact-origin allowlist. Registration and authentication use the same checked origin, and unapproved origins remain rejected.

- Worker source commit `19bd4a048990a7178e84e307b35efccb9bf190bc`, blob `05bd55aaf196cb5743d3a2bf80f1482aebd03cf8`.
- Regression-test commit `9bd7935f92ed64a98420f83f55b7b1cb3dc53f83`, blob `ee45e0d5515c750ca366eca73dbc2bdb7ce5a9a9`.
- Branch Worker tests: 22/22. Full local API suite: 38/38. Wrangler dry-run bundling succeeded (888.66 KiB; 159.81 KiB gzip).

## Development runtime

On 2026-10-28, the isolated Worker `aimm-library-api-dev` was updated to version 10, ID `68932c1c-2419-4b36-8208-b90449f4302c`, and deployment `7562c0a0-cfe8-4472-8897-f00853453900`. A browser request to `/health` returned `200 {"status":"ok","service":"aimm-library-api","api_version":1}`.

The version retained the existing development D1 binding `66c91fd6-fae8-43a1-8e3b-372274acd7dc`, Auth0 public configuration, exact Pages preview allowlist, and `ACTION_PREVIEW_ENCRYPTION_KEY` secret binding. The secret value was not read or changed. No D1 query or write occurred.

**Runtime provenance limitation:** To avoid waiting on expired local Wrangler authentication, version 10 was uploaded by patching the already deployed version 9 Worker bundle in place: `webauthnRP` now accepts the exact validated request Origin, and the four registration/authentication call sites pass that Origin. The behavior matches the reviewed branch fix, but version 10 is not a reproducible bundle built directly from the branch source. Its Cloudflare `workers/commit_sha` annotation points at the branch fix commit; that annotation must not be treated as a byte-for-byte source-build attestation. Rebuild and publish from the branch when Wrangler authentication is restored.

The live `/health` check confirms Worker availability only. The authenticated browser passkey ceremony has not yet been repeated; no passkey credential was created. Refresh the development preview, sign in, and select **Set up a passkey** to confirm browser enrollment now proceeds.

Foundation remains **NOT MET**; Stage 6 remains gated. No production deployment, credential creation, or cutover occurred.
