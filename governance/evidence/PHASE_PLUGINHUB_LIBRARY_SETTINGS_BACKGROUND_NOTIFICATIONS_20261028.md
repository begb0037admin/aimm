# Library Settings: background checks and passkey visibility — 2026-10-28

## Change

The development Library card now puts **Set up a passkey** beside **Sign in** at the top of Settings. Inventory comparison, saved status checks, API URL, sign-out, preferences, passkey verification, and the Hope tool switch are in a collapsed **More Library settings** section. Detailed account results stay behind a second collapsed disclosure.

Inventory and status actions still run only when selected. They now show a compact progress notification and a short summary or error when complete, instead of making large result tables the main Settings content. Pairing links open their approval details automatically. No browser notification permission or automatic polling is added.

## Scope and verification

- Repository: `begb0037admin/aimm`, branch `codex/pluginhub-foundation`.
- UI source: `library-api/library-account.js`, blob `749b09aa67756fd2c7dd9df5949ccfd87a8454dc` before this change; updated blob recorded in the synchronizing handover.
- Baseline branch commit: `fc6654d59cf4ca6a8c2eb0f388441b1941bd5b89`.
- This is a source change only. No tests or builds were run. No deployment, provider change, credential creation, production access, or data mutation was performed.
- Foundation remains **NOT MET**; Stage 6 remains gated. The owner passkey is still required to continue the separately recorded synthetic move/restore probe.
