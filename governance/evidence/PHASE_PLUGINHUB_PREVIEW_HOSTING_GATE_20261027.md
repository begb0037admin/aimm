# Non-production web preview hosting gate — 2026-10-27

## Approved isolated preview project

Kevin approved creation of a separate Cloudflare Pages project connected to the public GitHub repository `begb0037admin/aimm`, with preview builds restricted to `codex/pluginhub-foundation` and production deployments disabled.

Cloudflare project: `aimm-pluginhub-foundation-dev` (ID `3db2e4e5-2501-4710-88b1-d049bc909512`).
Preview hostname: `aimm-pluginhub-foundation-dev.pages.dev`.
Account: `Kevin@lelitte.com's Account` (`f1896a0ef4e88f1f90abcc2cbbdd87f1`).
Production branch: `main`; `production_deployments_enabled=false`; `preview_deployment_setting=custom`; included preview branch: `codex/pluginhub-foundation`; custom domains: none.

## Verified deployment state

A read-only Cloudflare API check on 2026-10-27 confirmed the project and settings above. It returned no latest or canonical deployment, and the preview deployment list was empty. The project exists, but the branch has not yet produced a hosted preview. The earlier rejected attempt occurred before Kevin approved the exact project creation; it is superseded by this approval and successful creation.

The next authorized action is to obtain a preview build for the approved branch, then inspect the resulting URL and served content. Do not use account data until the exact preview origin has been added to the development API CORS allowlist and Auth0 development callback/origin allowlists. Keep the existing production domain and settings untouched. No production deployment, custom domain, D1 access/write, or data use occurred.

## Gate effect

This project provides an isolated hosting path for the account-backed browser/Mac/Hope parity work, but does not yet provide a live preview or prove parity. Foundation remains **NOT MET**; Stage 6 remains gated.
