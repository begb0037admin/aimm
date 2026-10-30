# PluginHub Tools sidebar parity — 2026-10-30

## Change reviewed

`index.html` blob `60d03fdfb2585c3359f8bcee59dbeb2327ab738c` (branch UI commit `bfa4227125660d59a919ad4e0033fea9da68bac0`) now presents the observed PluginHub Tools order in Library navigation: Install Manager, Batch Plugin Management, Remove Old Installers, Check for Duplicates, License Key Vault, Share Plugin List, Compare Plugin Profiles, and PluginHub License.

Check for Duplicates keeps its fixed `aimm-companion://duplicates` local hand-off. Synthetic-only preview strips that link, visibly disables the item, and explains that no local inventory is connected. Every other item is a native disabled button with an accessible label and a title explaining the unavailable workflow; PluginHub License is identified as outside AIMM capability. A persistent compact note explains that only Check for Duplicates has a connected hand-off in normal Library mode.

## Review and preview

Jules source review: PASS. Jules visually reviewed the successful development Pages deployment at desktop and passed: [synthetic preview](https://38bed09a.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), deployment `38bed09a-58cd-4830-9460-bdb93582afd8`. The visible order matches the user-provided PluginHub screenshot; unavailable items are muted, the availability notice is readable, and Cards/table content remains intact. The CUA review could not resize the viewport, so narrow/mobile spacing remains unverified.

No row or tool action was invoked. The preview uses only the opt-in synthetic data path. No real plug-in folders, inventory, saved local scan or paths were read. The Duplicate Review URL hand-off has not yet been confirmed from a packaged/installed Companion app.

## Remaining work

Implement missing tools only behind their documented local or reviewed service contracts. In particular, complete Companion packaging and non-production URL dispatch confirmation; then continue the manual sweep for row/vendor actions and generation-bound status. Keep filesystem actions behind exact preview, explicit confirmation and receipt. Keep remote share/profile surfaces gated on their isolation and recovery review.

Foundation remains **NOT MET**; Stage 6 remains gated pending complete fresh exit evidence and fresh independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only.
