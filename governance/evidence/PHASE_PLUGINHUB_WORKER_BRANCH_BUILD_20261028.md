# Development Worker branch-source bundle dry-run — 2026-10-28

## Result

A development Worker bundle was compiled from exact GitHub branch `codex/pluginhub-foundation` at `8e394b89499b7f9d5e2de9b7bf9f5042f793ef56`. The stale, dirty checkout was not reset, cleaned or edited.

Exact GitHub blobs used:

- `library-api/src/index.js`: `05bd55aaf196cb5743d3a2bf80f1482aebd03cf8`
- `library-api/wrangler.toml`: `c77601aab375cfd25901b25958e234f05bdac6cb`
- `library-api/package.json`: `06bfc1488722d5e6f57950360550f7cff7889721`
- `library-api/package-lock.json`: `9a033cd0389dc190e61685ccaaf361b83fee1af9`
- `.gitignore`: `dd01457e2cd52b40c607997644eb1a7b39033707`

In an isolated source directory, clean `npm ci` installed 61 packages from the branch lockfile. npm's `allow-scripts` policy skipped install scripts for `esbuild`, `fsevents` and `workerd`; the Worker build still completed successfully. The reproducible branch command is `npm run build:worker`, which runs `wrangler deploy --dry-run --outdir .wrangler/worker-build`. Wrangler was `4.152.0`.

The dry-run reported 874.57 KiB total upload / 159.32 KiB gzip. The emitted `index.js` SHA-256 was `5d024fab98ec125b40f718e0171ad1597bbf5d3752a82d09a60782be22740c0e`. A second clean `npm ci` and invocation of the new script produced the same output size and SHA-256.

## Deployment boundary and remaining limitation

`wrangler whoami` reports the local Wrangler token expired. No upload or deployment was attempted. A development Worker upload requires both restored Wrangler authentication and separately recorded owner approval. The development Worker still serves the earlier surgical patch to a deployed bundle; this dry-run does not attest that the emitted bundle is live. No production deployment, D1 query/write, account action, credential change, or test suite run occurred.

Keep the surgical-patch provenance limitation open until the deployed version is tied to this branch-source build.
