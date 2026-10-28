# Development Worker branch-source bundle dry-run — 2026-10-28

## Result

A development Worker bundle was compiled from source files fetched directly from GitHub branch `codex/pluginhub-foundation` at `66fdc60a8d62ff58790986384c22e53e464606c5`. The stale, dirty checkout was not reset, cleaned or edited.

Exact GitHub blobs used:

- `library-api/src/index.js`: `05bd55aaf196cb5743d3a2bf80f1482aebd03cf8`
- `library-api/wrangler.toml`: `c77601aab375cfd25901b25958e234f05bdac6cb`
- `library-api/package.json`: `c96907860d1b8f1f56fac41ef3cce78e36b5a552`
- `library-api/package-lock.json`: `9a033cd0389dc190e61685ccaaf361b83fee1af9`

Wrangler `4.152.0` ran `npm ci` in the isolated source directory from the exact branch lockfile, then `wrangler deploy --dry-run --outdir /private/tmp/aimm-worker-branch-bundle-66fdc60-clean`. The clean install completed with 61 packages. npm's `allow-scripts` policy skipped install scripts for `esbuild`, `fsevents` and `workerd`; despite that, Wrangler's dry-run completed successfully. It reported 874.57 KiB total upload / 159.32 KiB gzip. The emitted `index.js` SHA-256 was `5d024fab98ec125b40f718e0171ad1597bbf5d3752a82d09a60782be22740c0e`.

This clean lockfile build supersedes the first scratch bundle, which used linked local dependencies and produced a different hash. The successful clean install and bundle demonstrate a branch-source build from the pinned dependency lock. They do not establish live runtime provenance.

## Deployment boundary and remaining limitation

`wrangler whoami` reported that the local Wrangler token had expired. No upload or deployment was attempted. The development Worker still serves the earlier surgical patch to a deployed bundle; this dry-run does not attest that the emitted bundle is live. No production deployment, D1 query/write, account action, credential change, or test suite run occurred.

Next, restore Wrangler authentication through the owner and obtain the separately required owner approval for a non-production Worker upload/deployment. Only after both are recorded, publish the branch-built bundle to the isolated development Worker. Keep the surgical-patch provenance limitation open until the deployed version is tied to this source build.
