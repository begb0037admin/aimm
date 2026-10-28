# Library Settings: background checks and passkey visibility — 2026-10-28

## Change

The development Library card now puts **Set up a passkey** beside **Sign in** at the top of Settings. Inventory comparison, saved status checks, API URL, sign-out, preferences, passkey verification, and the Hope tool switch are in a collapsed **More Library settings** section. Detailed account results stay behind a second collapsed disclosure.

Inventory and status actions still run only when selected. They now show a compact progress notification and a short summary or error when complete, instead of making large result tables the main Settings content. Pairing links open their approval details automatically. No browser notification permission or automatic polling is added.

## Scope and verification

- Repository: `begb0037admin/aimm`, branch `codex/pluginhub-foundation`.
- UI source: `library-api/library-account.js`, updated blob `5e6bb59fbc2fb26337355612f4eccbac61a58bac`, source commit `b6054480aa7fe1cbcaf95a0ccaebd57a00e28151`.
- Baseline branch commit: `fc6654d59cf4ca6a8c2eb0f388441b1941bd5b89`.
- Cloudflare automatically built and deployed the isolated branch preview after the GitHub push. Verified successful preview deployment `feb20e90-cf3d-4a0a-9b43-b8be1433df4f` for commit `b55efec758e448900f9ab33dfbe5f2a922bb3164`; stable preview: https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/. The preview project has production deployments disabled and this branch is preview-only; there was no production deployment.
- Browser review confirmed **Set up a passkey** beside **Sign in**, with **More Library settings** collapsed and the detailed results hidden. No test suite or local build was run. No provider change, credential creation, production access, or account data mutation was performed.
- Foundation remains **NOT MET**; Stage 6 remains gated. The owner passkey is still required to continue the separately recorded synthetic move/restore probe.
