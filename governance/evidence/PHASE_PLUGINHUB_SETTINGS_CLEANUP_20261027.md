# PluginHub Settings cleanup and preview verification — 2026-10-27

## Change

Moved the PluginHub account preview shell from the Library inventory page into Settings. Its controls remain collapsed until the user enables the development preview. Removed the obsolete provider balance/credit, top-up, and typed-chat cost section and its direct UI bindings. Kept Session Safety, including the session time limit, idle-call stop, session breakdown, and provider usage-dashboard links.

## Verification

- Targeted account UI suite: 6/6 passed.
- Focused account authorization-scope suite: 3/3 passed.
- The Cloudflare Pages preview deployment for branch commit `2cbb62a32c178b567718469d75d55e270d026777` completed successfully: deployment `d347b965-1dd5-42be-8c78-b45b87830ddc`, environment `preview`.
- Browser verification of that immutable deployment showed the account preview under Settings; no `settingsCosts` container or provider top-up/update controls; Session Safety remained. The Library screen showed only plugin inventory controls and no account preview panel.
- Production deployments are disabled for the Pages project. No production deployment, account-data read, or D1 operation was part of this UI change.

Source pins at the verified branch commit:
- `index.html`, blob `8cc53e5483407cb1f2e7f1ff93cbd27eff049a0c`
- `library-api/library-account.js`, blob `06f5c6ed468d62036b3d1683cddc056afddac9da`
- `library-api/test/library-account.test.js`, blob `3739d37c5c02cace0176539b6207c137876b3b2a`
- `library-api/test/library-account-auth-scope.test.js`, blob `0335289040b73dd9e6f315baf1dc08901bffaa1d`

This evidence covers the Settings UI cleanup only. It does not satisfy account-backed browser/Mac/Hope parity, remote account isolation, or Foundation exit. Foundation remains **NOT MET**; Stage 6 remains gated.
