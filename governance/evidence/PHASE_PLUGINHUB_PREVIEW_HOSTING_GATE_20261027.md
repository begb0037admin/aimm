# Non-production web preview hosting gate — 2026-10-27

## Approved isolated preview project

Kevin approved a separate Cloudflare Pages project connected to `begb0037admin/aimm`, with preview builds restricted to `codex/pluginhub-foundation` and production deployments disabled.

- Project: `aimm-pluginhub-foundation-dev` (ID `3db2e4e5-2501-4710-88b1-d049bc909512`)
- Account: `Kevin@lelitte.com's Account` (ID `f1896a0ef4e88f1f90abcc2cbbdd87f1`)
- Production branch: `main`; production deployments disabled.
- Preview setting: custom, only `codex/pluginhub-foundation`.
- No custom domains.
- Stable branch preview: https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/

## Verified preview

Cloudflare's API confirms a successful preview deployment for branch `codex/pluginhub-foundation`, commit `895e5a58c9da9e71d6cad51304de5791de4e2658`, deployment `d817bf82-7808-4aa3-b3cc-f30fccf8dbbb`. The deployment URL is `https://d817bf82.aimm-pluginhub-foundation-dev.pages.dev`; Cloudflare assigned the stable branch alias above. Every stage ended successfully.

A browser opened the branch alias and loaded the AIMM homepage. Its visible version label is `2026-10-22.5`. This confirms the preview serves the branch's static site, but the account-preview controls were not yet exercised in that browser session. No Auth0 sign-in, account API request, account data, D1 access/write, or device action was used.

## Safe next step and gate effect

The preview origin has not been enabled for authenticated account use. Before that, add only this exact origin to the development Worker CORS allowlist and Auth0 development callback/web-origin allowlists; keep production configuration untouched. Then exercise the signed-in account preview using synthetic/non-production accounts and continue browser/Mac/Hope parity and isolation checks.

The project and successful static preview remove the hosting-creation blocker; they do not prove account-backed parity. The earlier failed project-creation attempt is superseded by the approved creation and successful deployment. Foundation remains **NOT MET**; Stage 6 remains gated. No production deployment, custom domain, D1 change, or production configuration change occurred.
