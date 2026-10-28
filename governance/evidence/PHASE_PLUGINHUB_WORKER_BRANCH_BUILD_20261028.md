# Development Worker branch-source bundle dry-run — 2026-10-28

## Result

A development Worker bundle was compiled from source files fetched directly from GitHub branch `codex/pluginhub-foundation` at `66fdc60a8d62ff58790986384c22e53e464606c5`. The stale, dirty checkout was not reset, cleaned or edited.

Exact GitHub blobs used:

- `library-api/src/index.js`: `05bd55aaf196cb5743d3a2bf80f1482aebd03cf8`
- `library-api/wrangler.toml`: `c77601aab375cfd25901b25958e234f05bdac6cb`
- `library-api/package.json`: `c96907860d1b8f1f56fac41ef3cce78e36b5a552`
- `library-api/package-lock.json`: `9a033cd0389dc190e61685ccaaf361b83fee1af9`

Wrangler `4.152.0` ran `wrangler deploy --dry-run --outdir /private/tmp/aimm-worker-branch-bundle-66fdc60` in an isolated source directory. It exited successfully and reported 884.21 KiB total upload / 159.69 KiB gzip. The emitted `index.js` SHA-256 was `17820debaff29453d2a3b9a047ed77df18209b916b3ce4967f8ce3102cab7ceb`.

The source, Wrangler config, package manifest and lockfile came from the exact GitHub branch blobs above. For speed, the isolated build linked the existing local `node_modules` directory; a clean `npm ci` from the lockfile was not run. This demonstrates a successful branch-source bundle, but does not yet establish a clean-room dependency rebuild or live runtime provenance.

## Deployment boundary and remaining limitation

`wrangler whoami` reported that the local Wrangler token had expired. No upload or deployment was attempted. The development Worker still serves the earlier surgical patch to a deployed bundle; this dry-run does not attest that the emitted bundle is live. No production deployment, D1 query/write, account action, credential change, or test suite run occurred.

Next, restore Wrangler authentication through the owner and obtain the separately required owner approval for a non-production Worker upload/deployment. Only after both are recorded, perform a clean dependency install from the pinned lockfile and publish the branch-built bundle to the isolated development Worker. Keep the surgical-patch provenance limitation open until the deployed version is tied to this source build.
