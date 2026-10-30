## Latest PluginHub roadmap checkpoint — View typography, Hidden, and requested status/tool parity — 2026-10-30

Source commit 75655b4b2f327e3fff6d52c30f8512c34d1ffc9c, Library blob f9868f5392be7633e12da8520f05b05ed0c66071, increases vendor and product names while preserving four-column cards; Jules passed desktop/390px typography and Hide/Show visual review on [synthetic deployment aed2938c](https://aed2938c.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). Hidden visibility remains active and memory-only in the synthetic fixture. See [visual typography evidence](../governance/evidence/PHASE_PLUGINHUB_VISUAL_PARITY_NAMES_20261030.md).

Kevin’s latest screenshots add required parity work: activate the Updates Available, Up to Date, Manual Check and Unchecked groups with truthful counts, and make all AIMM Tools active with complete workflows. The current Library has only Unchecked active and most tools are disabled. Prioritize generation-linked vendor results and the full Install Manager workflow; do not fabricate counts or enable no-op actions. See [user-directed parity requests](../governance/evidence/PHASE_PLUGINHUB_USER_PARITY_REQUESTS_20261030.md).

Status implementation dependency: source commit `84e2e2a3a5c1ad2c2fd0355130e449a5cb03dff5` now returns nullable bundle identifiers in `/v1/status-summary`; connect the generation-bound endpoint to the Library UI and add source-backed publisher attribution/canonical product grouping. Counts remain per format record, and the page’s local scan cache has no generation join. See [status UI connection gap](../governance/evidence/PHASE_PLUGINHUB_STATUS_UI_GAP_20261030.md).

Foundation remains **NOT MET**; Stage 6 gated; Worker RP fix remains surgical.

## Historical roadmap checkpoint — View brightness and text size — 2026-10-30 (source commit 82c886d690eaaf41560af83cff4155a769cc553d)

Branch commit [`82c886d690eaaf41560af83cff4155a769cc553d`](https://github.com/begb0037admin/aimm/commit/82c886d690eaaf41560af83cff4155a769cc553d), Library `index.html` blob `a535b0a5830ad3449e1f27f14238c6f4685f5997`, adds Brightness and typography-only Text size to the View menu. Jules passed source and visual/interaction review at synthetic preview deployment 72b0770b on desktop and 390px. Text scales from 8px to 12px; product/vendor widths and SVG icon dimensions remain fixed while row heights reflow with text. The panel flips/scrolls inside the available viewport. The existing 44px page overflow at 390px remains outside the panel. See [brightness/text-size evidence](../governance/evidence/PHASE_PLUGINHUB_VIEW_BRIGHTNESS_TEXT_20261030.md).

Synthetic only; no folders, scans, real inventory, credentials or row actions. Foundation remains **NOT MET**, Stage 6 gated; the Worker RP fix remains a surgical patch.

## Historical roadmap checkpoint — View display preferences — 2026-10-30 (source commit e86c9b1787b3289a66eaa2f83f5f21260bc25a43)

Branch source [`e86c9b1787b3289a66eaa2f83f5f21260bc25a43`](https://github.com/begb0037admin/aimm/commit/e86c9b1787b3289a66eaa2f83f5f21260bc25a43), Library `index.html` blob `b56aad4f068d531a1cb930394073c72eef9f537d`, now supports category labels and note/rating visibility across Cards/List/Ledger. Jules passed source and desktop/390px visual interaction review on synthetic preview deployment 52913ac6. Populated note/rating styling is not verified because the synthetic fixture contains none. See [display-options evidence](../governance/evidence/PHASE_PLUGINHUB_VIEW_DISPLAY_OPTIONS_20261030.md).

Next: continue manual-driven View settings with existing display/data paths, then the source-backed per-record timestamp and compatibility contracts. Foundation remains **NOT MET**, Stage 6 gated, and the Worker RP fix remains surgical.

## Historical checkpoint — View menu grouping — 2026-10-30 (source commit fec3cf8c2482b1dd9aa105723ffe106b1038a33d)

Branch commit [`fec3cf8c2482b1dd9aa105723ffe106b1038a33d`](https://github.com/begb0037admin/aimm/commit/fec3cf8c2482b1dd9aa105723ffe106b1038a33d), `index.html` blob `d8c019b92ad3edee72384bc067211f53697bd3cc`, groups the existing layout, sort and Cards-only vendor collapse/expand controls in a single View menu. Jules passed source and final visual/interaction review at [development preview deployment 1915928d](https://1915928d.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic) on desktop, 390px and 320px. Selecting List and Product updated the existing controls/table, closed the popover and returned focus; Escape and outside click also close it. At 320px the panel clamps to 224px and remains within the viewport; existing page content still produces 434px document scrollWidth with the panel open or closed. The menu did not add overflow.

See [View menu review](../governance/evidence/PHASE_PLUGINHUB_VIEW_MENU_20261030.md), blob `f61f346e0bf92477d0eff62bb33a022b79b52892`; [updated tool matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob `7460319857a75fc0b1ce64230e72ef717cc47fc1`; [updated reference sweep](../governance/evidence/PHASE_PLUGINHUB_REFERENCE_SWEEP_20261030.md), blob `26c6fc24e76b7c92d0fe902c92b14ae7d1ba9e1f`. Only the in-memory synthetic sample was used. No scans, row actions, real inventory, credentials, Worker deployment or production action occurred.

The remaining View-menu gaps are appearance/brightness/text size, sidebar/top-tab navigation, key display settings, Hidden/Collections, and timestamp-based newest/oldest sorts.

Foundation remains **NOT MET**; Stage 6 remains gated pending fresh complete exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch-source build. No Worker or production deployment occurred.

## Latest PluginHub roadmap checkpoint — Compatibility destination — 2026-10-30

Branch source [commit be00a701f185a5446568881ab1f89724560eec79](https://github.com/begb0037admin/aimm/commit/be00a701f185a5446568881ab1f89724560eec79), `index.html` blob `b930bb3276a08ce72808fcb087dd2a62f02cef4a`, adds the Plugin Compatibility Library destination in the observed location after All Plugins. It is visible but disabled because architecture/build metadata and current vendor evidence are not connected. Jules passed source plus desktop and 390px visual review on [development preview 1b47232f](https://1b47232f.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). The row is 40px high and muted at desktop. At 390px the existing sidebar is an icon rail, so the label/reason are hidden visually; the accessible name/title retain them. This remains a discoverability limitation.

See [Compatibility surface review](../governance/evidence/PHASE_PLUGINHUB_COMPATIBILITY_SURFACE_20261030.md), blob `a3f15ec8a8f78c77414f42ce5f1f73b05dc31dee`; [updated PluginHub tool matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob `2f97647016e25d31f4364c4cac679da37caceab1`; [updated reference sweep](../governance/evidence/PHASE_PLUGINHUB_REFERENCE_SWEEP_20261030.md), blob `8b5a5b78b4b78cce8d408c752970619ee1ea75b0`. Only the in-memory synthetic preview was shown; no scan or action occurred.

Foundation remains **NOT MET**; Stage 6 remains gated pending fresh complete exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch-source build. No Worker or production deployment occurred.

## Latest PluginHub roadmap checkpoint — row action menu review — 2026-10-30

Jules passed the existing product row action menu in the opt-in synthetic preview at [deployment 38bed09a](https://38bed09a.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). The desktop menu includes Category, Tags, Note & rating, version-bound Mark up to date, Move to Unused, Uninstall, Reveal in Finder, Hide, Rescan, Copy name, Installer Hub, Website, License Key Vault, Keep this version, Snooze and Report. Filesystem and disconnected service actions are visibly disabled with reasons; the lower rows are available through internal menu scrolling. No action was selected and no scan started. Narrow/mobile behavior is unverified.

The screenshot’s “Installed or updated” date is not yet available from a source-backed Library timestamp; do not invent it. Evidence: [row menu visual review](../governance/evidence/PHASE_PLUGINHUB_ROW_MENU_REVIEW_20261030.md), blob `45296ddcc11fca34f69053b1c89f3f53ef295486`; [updated tool contract matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob `02fd720e5c7ec66ecc4ed2c3fb252f9aadc7d619`; [isolated Companion package/runtime report](../governance/evidence/PHASE_PLUGINHUB_COMPANION_ISOLATED_PACKAGE_20261030.md), blob `1ff1a5a3553904648ecccc6eba15fd9f764c7b85`.

The isolated Companion package build/launch visual review passed, but exact web-to-AppKit URL dispatch remains unverified. The ordinary preview app was briefly selected by display name during review; saved-generation and paired-device state and the Development API URL field were visible. No controls were used and no paths/inventory rows were viewed/copied; field values and identifiers are not retained. All future review uses the exact isolated bundle path/ID.

No production/Worker deployment, file action, scan or external share occurred. Foundation remains **NOT MET**; Stage 6 remains gated until complete fresh exit evidence and independent review accepts it. Worker passkey RP fix remains a surgical patch, not reproducible from branch source. Synthetic non-production data only.

Next: inspect whether any source-backed inventory-generation timestamp exists for the row-menu header; add the date only if it does. Verify narrow menu layout with a supported viewport review. Then verify exact Companion URL dispatch through a supported Launch Services path without installing the package or changing the default handler. Continue the contract-first tool/row sweep and generation-bound status. Keep file actions behind exact preview, explicit confirmation and receipt; keep remote share/profile behind isolation and recovery review. Foundation remains **NOT MET**; Stage 6 remains gated.

## Historical PluginHub roadmap checkpoint — Isolated Companion package — 2026-10-30

The Companion branch-source build and ad-hoc non-production package succeeded from commit `0d7bc962045315656b32e90131575f3b3c6023ff`. Package script blob `30b581d7e24c13eb4c61562be61112e87a61ca53` writes `AIMMIsolatedPreview=true` and uses a unique bundle ID. CUA launched the exact isolated bundle; Jules visually passed its empty state, zero format counts, isolation disclosure and disabled scan/folder/pairing/status/request controls. The isolated mode did not load normal defaults, Keychain credentials, Application Support scan history or folder bookmarks.

Actual web-to-AppKit URL dispatch remains unverified. The managed shell Launch Services attempt returned `kLSNoExecutableErr` and `NSWorkspace` found no handler; no app was installed and no URL handler/default was registered or changed. No route, scan or file action was triggered. During the review, a reviewer briefly selected the ordinary preview app by display name and saw saved-generation and paired-device state plus the Development API URL field. No controls were used and no paths or inventory rows were viewed/copied; field values and identifiers are not retained. Future review must select the exact isolated bundle path/ID. [Companion isolated package/runtime evidence](../governance/evidence/PHASE_PLUGINHUB_COMPANION_ISOLATED_PACKAGE_20261030.md), blob `1ff1a5a3553904648ecccc6eba15fd9f764c7b85`; [Duplicate Review report](../governance/evidence/PHASE_PLUGINHUB_DUPLICATE_REVIEW_ENTRY_20261030.md), blob `a0e5957b6bb2ce4a337fd7543a8f1b607c9b2c29`; [tool contract matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob `02fd720e5c7ec66ecc4ed2c3fb252f9aadc7d619`.

No production or Worker deployment, local file operation, automated test or remote share occurred. Foundation remains **NOT MET**; Stage 6 remains gated pending complete fresh exit evidence and fresh independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only.

Next: verify the exact `aimm-companion://duplicates` OS hand-off through a supported Launch Services path without installing the app, changing the default URL handler or reading normal local state. Then continue the contract-first row/vendor tool sweep and generation-bound statuses. Keep filesystem actions behind exact preview, explicit confirmation and receipt; keep remote share/profile behind isolation and recovery review.

## Historical PluginHub roadmap checkpoint — Tools sidebar parity — 2026-10-30

Branch UI commit `bfa4227125660d59a919ad4e0033fea9da68bac0` adds PluginHub's observed Tools sidebar order to Library navigation: Install Manager, Batch Plugin Management, Remove Old Installers, Check for Duplicates, License Key Vault, Share Plugin List, Compare Plugin Profiles and PluginHub License. Check for Duplicates retains the fixed local `aimm-companion://duplicates` hand-off; all unavailable workflows are visibly disabled with an explanation, and PluginHub licensing is labeled outside AIMM. The synthetic preview suppresses the local route and explains that no local inventory is connected.

Jules passed source review and desktop visual review at [the synthetic development preview](https://38bed09a.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), Pages deployment `38bed09a-58cd-4830-9460-bdb93582afd8`. Labels/order, spacing and disabled state passed; Cards and All Plugins table remain intact. Narrow/mobile spacing was not verified because the review session could not resize its viewport.

Evidence: [PluginHub Tools sidebar parity report](../governance/evidence/PHASE_PLUGINHUB_TOOLS_SIDEBAR_20261030.md), blob `83271809980516658f171031776e78f9eeb24fe5`; [manual/tool contract matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob `68cffd05c1f6d9bc0b55da52e6ab8712eabf4c7a`. Source `index.html` blob `60d03fdfb2585c3359f8bcee59dbeb2327ab738c`.

No real plug-in folders, saved scans, local paths or inventory were read. No tool action, automated test, production deployment or external share occurred. Companion URL dispatch remains unverified from a packaged/installed app. Foundation remains **NOT MET**; Stage 6 remains gated pending complete fresh exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only.

Next: package the Companion preview and confirm the read-only local hand-off without starting a scan. Then continue the manual sweep with generation-bound status and the next local Tools contracts. Keep filesystem changes behind exact preview, explicit confirmation and receipt; keep remote share/profile behind isolation and recovery review. Foundation remains **NOT MET**; Stage 6 remains gated.

## Historical PluginHub roadmap checkpoint — Duplicate Review hand-off — 2026-10-30

Library Tools > Duplicate Review now has a fixed local Companion route; the synthetic preview visibly disables it because no local inventory is connected. Jules passed source and desktop/390px visual review at https://15c23fd2.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic (deployment 15c23fd2-9ee5-4ea6-a84f-25d95ed676af). Cards remain four columns; All Plugins retains its 12-product synthetic sample and neutral Unchecked cells. Companion source build succeeded in an isolated tree with the explicit sandbox bypass; no app bundle was packaged, installed or launched.

Next: package the Companion preview and confirm the read-only hand-off without starting a scan. Then connect only generation-bound vendor observations to the Library and continue the manual sweep. See [Duplicate Review hand-off evidence](../governance/evidence/PHASE_PLUGINHUB_DUPLICATE_REVIEW_ENTRY_20261030.md), blob c516e5974492f9ad8df2cfc9f93a1a8d33038c04, and [the tool/browse matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob fe215eaf6345655034c8a1dba426017f257fb724.

The Companion branch source compiles with `swift build --disable-sandbox --product aimm-companion` in an isolated tree. The standard sandboxed attempt was denied by the managed environment; the successful local compile used SwiftPM’s explicit sandbox bypass. No `.app` bundle was packaged, installed or launched, so macOS URL dispatch still needs confirmation. The app’s saved local scan was not read. No real folders were scanned and no local paths or inventory were used. Foundation remains **NOT MET**; Stage 6 remains gated pending fresh exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only.

## Historical checkpoint — 2026-10-30 PluginHub Unchecked status scope

The Library > All Plugins destination opens the existing List row table and preserves filters; Cards remains the default. An enabled Unchecked scope counts visible, non-hidden installed product groups because no vendor status result is connected to this Library. Updates available, Up to date and Manual check remain disabled. Jules passed source and visual review for `index.html` blob 8cc326ffbf691a39c749d855265b49d8d6f6d94a at https://8700637a.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic (deployment 8700637a-ece1-42b7-a428-fe37e2eaab9a). The All Plugins status cell is readable at desktop, 600px and 390px; the narrow table scrolls horizontally. Cards, ordinary List and Ledger remain unchanged. The 14-row/12-product/4-format synthetic sample shows Unchecked 12. No real folders were read or scanned; generation-backed results remain unassessed.

Next: use the populated sample to complete the PluginHub flat-table status semantics and connect only actual generation-bound observations; the current Unchecked state means no result is connected, not that a check ran. See [the tool and browse matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob fa3e94396352ea4c637a3cfd0a8762fd39288495.

No inventory scan/upload, automated tests, Worker or production deployment, file operation, or share occurred. Foundation remains **NOT MET**; Stage 6 gated. The Worker RP fix remains a surgical patch, not reproducible from branch source. Synthetic non-production data only.
## Historical checkpoint — 2026-10-30 PluginHub tool-surface correction

Source/manual comparison against installed PluginHub 2.0.12 is recorded in [the tool and browse contract matrix](../governance/evidence/PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md), blob `e41e74f84fcb146f8471b80ee6d628b58ff4f262`. Corrections: AIMM already has Cards/List/Ledger selectors and Vendor/Product/Format/Version sort controls, while PluginHub has different sort semantics and a separate flat All Plugins table; the local Companion already renders Duplicate Review; API status/share/profile routes exist but are not complete surfaces connected to this Library page. Whole-library Tools navigation remains absent. No plug-in folders were scanned. Use the matrix’s safe order for the next implementation: connect generation-bound status observations to the Library, add an explicit hand-off to the Companion’s already-present local duplicate review, then extend local tools only through reviewed preview/confirmation/receipt flows. Keep API share/profile UI behind the existing remote isolation and recovery gates.

No real scan/upload, automated tests, Worker deployment, production action or file action occurred. Foundation remains **NOT MET**; Stage 6 gated. The Worker RP fix remains a surgical patch, not a reproducible branch-source build. Synthetic non-production data only.

## Historical checkpoint — VST control passed (2026-10-30; superseded by the current Unchecked/status-column checkpoint above)

Source commit `f550878fa1e29910c81881534d8c8b6a2bbb97ac` is active on the development Pages preview at [deployment ce77fbf0](https://ce77fbf0.aimm-pluginhub-foundation-dev.pages.dev/). Jules passed source and final visual review. The VST popover is readable, keyboard-operable and supports PluginHub-style cycling, replacement and Shift-click combination/removal while retaining AIMM’s supported formats and AAX exclusion. Playwright’s computed role/name lookup finds the option names; the CUA snapshot omits them, which does not establish what a native screen reader announces. The preview has zero products and connected folders. See [VST and tool-sweep evidence](../governance/evidence/PHASE_PLUGINHUB_VST_AND_TOOL_SWEEP_20261030.md).

Historical next sequence at the VST-control checkpoint (superseded by the current status-column checkpoint):

1. Map the manual’s whole-library tools to reviewed AIMM owners and existing backend contracts. Start with the Companion’s read-only duplicate analysis; paths remain local and the analysis grants no file-action authority.
2. Add tool navigation and each tool surface only when a reviewed backend is connected. Batch management, installer cleanup, vault, share, profile and entitlement are not verified in the current preview.
3. Complete the row-menu, vendor-action, Cards/List/Ledger, folder, sort, status and compatibility manual walk.
4. Add Intel-only and snooze/status controls only when architecture metadata and page-consumed vendor observations support them.
5. Keep file changes behind exact preview, owner confirmation and receipt; obtain fresh independent acceptance before any Foundation or Stage 6 gate change.

No real inventory scan/upload, automated tests, Worker deployment or production action occurred. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains surgical, not reproducible from branch source. Use synthetic non-production data only.

## Historical checkpoint — filters reviewed (2026-10-29; superseded by later VST-control and current All Plugins status checkpoints)

Source `ad1e460dea5009dbf7e88eba6cd5c16d5941ba54` is active on development Pages at [deployment 1a5f0a2b](https://1a5f0a2b.aimm-pluginhub-foundation-dev.pages.dev/). Jules passed source and visual review of the My Tags chevron correction: one chevron points down while closed and flips up while open. Browse-tag and format interactions were previously verified on source `80dd8012a19f8b3cd662ee2125aa1c30e94b4ae6` at deployment `415a8b76-f53c-4c0e-82d5-20f7dd4eeb23`. Details and data limits are in [filter evidence](../governance/evidence/PHASE_PLUGINHUB_FILTERS_20261029.md).

Historical next sequence at the filter-review checkpoint (superseded):

1. Align PluginHub's VST cycling control while preserving AIMM's supported AU, VST2, VST3 and CLAP scanner formats and AAX exclusion.
2. Add Intel-only and snoozed/status controls only when architecture metadata and live vendor-check observations support them.
3. Build the PluginHub-style whole-library Tools through reviewed backends; keep filesystem tools unavailable until native Companion paths exist.
4. Complete Companion-backed file operations through exact preview, fresh confirmation and receipt.
5. Repeat the full manual parity walk and obtain fresh independent acceptance before any Foundation/Stage 6 gate changes.

The final visual preview had zero products and zero connected folders; no real inventory was scanned or uploaded. No automated tests, Worker deployment or production action occurred. The Worker passkey RP fix remains surgical, not reproducible from branch source. Foundation remains **NOT MET**; Stage 6 remains gated.

## Historical initial parity plan — superseded by current sequence

The initial sweep compared the installed PluginHub manual/UI with branch source `304ba8df644c1ceba4cd0eb5f6ddf8693ef3aa62`. The updated status and remaining gaps are at the top of this roadmap and in the [current parity sweep](../governance/evidence/PHASE_PLUGINHUB_PARITY_SWEEP_20261029.md).

Next sequence:

1. Complete Tag Manager and persistent tag editing against the approved preference contract. Recheck category multi-select behavior during the next manual pass.
2. Add the missing browse/status controls only when their data is real. Status buckets, vendor checks, paid-upgrade signals and snooze behavior need the shared status model.
3. Add a PluginHub-style Tools section with clearly scoped surfaces. Keep local filesystem work behind the native Companion preview/confirmation/receipt protocol; do not make unsupported actions appear active.
4. Complete vault, compatibility, sharing and profile flows against their separate privacy/account contracts.
5. Repeat the visual/manual parity walk and obtain fresh independent review before any Foundation/Stage 6 gate changes.

AAX remains intentionally excluded by the approved scanner architecture. The parity sweep is not Foundation exit evidence and does not authorize production deployment. Foundation remains **NOT MET**; Stage 6 remains gated.

## Latest roadmap update — 2026-10-29
## Latest Stage 5 passkey resume — 2026-10-29

Source fix `98754965a901b37a193fa6363b7e01758283e9cb` was reviewed and passed by Jules. The same signed-in development session resumed synthetic operation `caebb13c-1f6b-4422-b23c-570b4d8a0e9f` on the paired device and verified the exact preview. The first saved-passkey assertion eventually succeeded and revealed the exact synthetic source and isolated `Unused` destination. The second confirmation attempt expired while the 1Password handoff was loading; Companion safely cleared only that expired, unconfirmed preview and reported no file changes. The same operation was resumed, the existing `Unused` folder selected again, and a fresh preview prepared.

The current passkey chooser appeared. Continuing with the saved 1Password credential opened an Autofill sheet which remains on its spinner. No second assertion succeeded; the Companion **Move to Unused** control remains disabled; no file moved. Do not create another operation or repeat enrollment. Resume this operation when the provider handoff is resolved, then complete the second passkey confirmation and separate Companion confirmation. Stage 5 remains **PARTIAL**; Foundation **NOT MET**; Stage 6 gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only; no production deployment or separately gated external action.

Evidence: `governance/evidence/PHASE_PLUGINHUB_STAGE5_KEYCHAIN_AND_WORKER_ACCESS_20261029.md`.

## Earlier Stage 5 passkey chooser observation — superseded on 2026-10-29

The verified branch Pages preview at source commit `778116538dbe294036490064574a5658e0a990ba` (deployment `f03db279-b71e-4197-b253-998d755578c6`) now shows distinct progress for the passkey challenge and chooser. Jules reviewed and passed the source change; no tests were run. The same synthetic operation remains staged in Companion with the isolated `Unused` destination. Its exact fixture-to-destination preview was visible. The browser reached **“Waiting for the passkey chooser in Chrome or 1Password…”**; no chooser appeared, 1Password remained on All Items, and Chrome showed only its generic sign-in-options notice. Chrome DevTools recorded authentication options as `201 Created`, then the 1Password universal sign-on iframe request as canceled; no assertion-verification request appears in the captured log, placing the stall before passkey assertion. No assertion succeeded and no file moved. The Companion Move control is disabled. Resume the same operation when the chooser is available; do not repeat enrollment or create another operation. Stage 5 remains **PARTIAL**, Foundation **NOT MET**, and Stage 6 gated. No production deployment or separately gated action occurred.

## Historical Stage 5 synthetic action checkpoint — superseded by the latest passkey resume

GitHub branch `codex/pluginhub-foundation` was verified at source commit `00b07d037fae2f665ba90895a6e2ae3e9a323b5e` before this record update. The synthetic record selector was corrected to the paired fixture ID in that commit; Jules had reviewed the exact source change. The branch Pages preview reflects the commit at `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/` (deployment `c6dd0988-00b6-4f72-be36-24705fd0f573`).

The live development Worker passkey RP fix remains a surgical patch rather than a reproducible deployment from branch source. A Wrangler 4.152.0 branch-source build was recorded, but it does not establish that the live fix came from that artifact: artifact SHA-256 `fc0ddd0a46edde56f8aff14b7ddc6fb59d50e663d45c1e7693607d60f7a7f102`; Worker version `6d360126-d613-407d-a4de-be4498743618`, deployment `ccb7a9bd-3ac9-442b-9095-c9e0791ad48b` at 100%. This development deployment followed the owner approval recorded for the exact branch-source deployment. This record of a branch-source build and development deployment does not resolve the live Worker passkey RP-fix provenance limitation: the current fix remains a surgical patch, not a reproducible build from branch source. No production deployment or other separately gated external action occurred.

The development Library session is visibly signed in. A single request for the synthetic fixture was sent to the paired diagnostic Companion (operation `caebb13c-1f6b-4422-b23c-570b4d8a0e9f`). The owner selected the isolated `Unused` destination. Companion prepared a signed exact-path preview for the one synthetic fixture; source and destination were checked in its local UI and match the authorized fixture-to-`Unused` operation. Local paths and device metadata are intentionally not persisted. The browser has not completed the passkey-gated exact-path reveal/confirmation; the Companion Move button remains disabled. **No file has moved and no passkey assertion has succeeded.** Do not create another request or repeat passkey enrollment. Resume the existing operation and complete the browser passkey interaction before any local move; the Companion still requires its separate Move to Unused confirmation. Restore the fixture, remove diagnostic-only credentials/state, and obtain fresh independent review afterward.

Stage 5 remains **PARTIAL**; Foundation remains **NOT MET** and Stage 6 remains gated. Other Foundation exit evidence and fresh independent end-to-end acceptance remain open. Use synthetic non-production data only; no production deployment or separately gated external action.

Evidence: `governance/evidence/PHASE_PLUGINHUB_STAGE5_KEYCHAIN_AND_WORKER_ACCESS_20261029.md`.

## Historical Stage 5 Keychain and Worker access status — superseded by the 2026-10-29 checkpoint above

The owner approved adding the synthetic diagnostic Companion to the access lists for its paired-device credential and its single saved action-preview Keychain item. Both items remained set to confirm-before-allowing access; no credential or path value was revealed. The Companion then reported “No pending local actions,” and the expired saved preview no longer appears in Keychain. No file moved, no passkey assertion occurred, and no replacement request was created.

The signed-in development Pages preview cannot currently read device/action state from the live Worker: “Load development devices” and “Check Mac preview” each returned “A valid Library API access token is required.” No device list, inventory, or action result was returned. Branch source commit `5a90b392fcd439d8c8f4006bab5d389285387865` built with Wrangler 4.152.0 and passed a dry-run; artifact SHA-256 `fc0ddd0a46edde56f8aff14b7ddc6fb59d50e663d45c1e7693607d60f7a7f102`. It was not deployed.

The live development Worker remains surgical passkey RP-fix version `68932c1c-2419-4b36-8208-b90449f4302c`. A branch Worker deployment is separately gated on explicit owner approval. No production deployment occurred. Stage 5 remains **PARTIAL**; Foundation **NOT MET**; Stage 6 gated. Next: approve the exact development Worker deployment, then check the existing synthetic action state without creating another request. Exact-path review and owner confirmation remain required before any file move.

Evidence: `governance/evidence/PHASE_PLUGINHUB_STAGE5_KEYCHAIN_AND_WORKER_ACCESS_20261029.md`.

## Historical Stage 5 recovery checkpoint — superseded by the 2026-10-29 checkpoint above

The owner selected the intended isolated `Unused` folder earlier. Once recovery can proceed, Companion may reopen the folder picker and require selecting that same destination again for a fresh preview; the app is currently blocked before that step by Keychain access. The earlier exact preview expired before path review, and no file move or passkey assertion occurred. Jules reviewed and passed the expired-preview recovery changes in source commit `5a90b392fcd439d8c8f4006bab5d389285387865`. The Companion guards recovery against a live operation, a confirmed action, or a journaled local action; the Worker clears the preview digest and matching payload atomically. Source/build checks passed; no test suite was run.

When the rebuilt diagnostic Companion checked the queue, macOS Keychain returned `-25244` (`errSecInvalidOwnerEdit`), so the existing paired-device credential could not be used and the queue did not load. No Keychain item was removed or replaced. Do not repeat passkey enrollment or create another request. Resume with a Companion build that can use the existing paired credential, then recover the same synthetic request and review exact paths before owner confirmation. No file action has occurred.

A development Worker deployment unexpectedly published version `802bb879-e32b-45c2-bc84-c6389b257d4a`; it was rolled back immediately. Rollback deployment `55cad8f4-72d1-414e-aef6-7957534ee592` restored surgical passkey RP-fix version `68932c1c-2419-4b36-8208-b90449f4302c` at 100%. The committed Worker recovery change is not live. No production deployment occurred; the RP fix is still not reproducible from branch source. Stage 5 remains **PARTIAL**, Foundation **NOT MET**, and Stage 6 gated.

Evidence: `governance/evidence/PHASE_PLUGINHUB_STAGE5_PREVIEW_RECOVERY_20261029.md`.

## Historical Stage 5 owner-preview handoff — superseded by the 2026-10-29 checkpoint above

The reviewed development Settings preview now offers a targeted, synthetic-only move flow. Source commit `3a35e2139bfb28f1b0c95eac944420223e577665`, `library-api/library-account.js` blob `461459466a361f59564582b5a0e50757013a7362`; Jules reviewed the exact source. Cloudflare development Pages deployment `7f9e75c4-a1c3-4393-b9aa-7efbd465b8b8` succeeded on the approved branch preview: https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/.

A device-scoped preview matched only the known synthetic AU fixture, “AIMM Stage 5 Synthetic Probe” version 1.0.0. One `move_to_unused` request was queued. The isolated synthetic diagnostic Companion fetched it and opened its “Choose the Unused folder” picker. It is waiting for the owner to select the intended destination, review the exact source and destination shown by Companion, and confirm with the passkey. **No files have moved and no passkey assertion has occurred.** A separate normal Companion installation showed an empty queue; it is not the diagnostic install paired to this fixture, so that result does not indicate request failure.

No device metadata or local paths are recorded here, and no unrelated plug-in inventory was requested. Stage 5 remains **PARTIAL**; Foundation remains **NOT MET** and Stage 6 remains gated. The development Worker passkey RP fix remains a surgical bundle patch, not a reproducible branch build. No production deployment occurred.

## Historical Settings sign-in and synthetic preview checkpoint — superseded by the 2026-10-29 checkpoint above

The development Library session is confirmed: the owner’s read-only Account preferences request completed. The Settings UI initially kept showing “Sign in” even while the session was active. A reviewed fix now shows a green, checkmarked “Signed in” control after a successful same-origin session check on page load; HTTP 401 shows signed out, while origin or service errors show status unavailable. Jules passed the exact source diff. Source commit `24dcbe1bbf21f0e873317f37ee612ea4b45258be`, blob `c8050ee01630a4e5f3dc754bfb67bd1c6bd499c6`. Visual confirmation: development Pages preview `81628aed-b972-4a52-9268-cc88ab735ff0`, https://81628aed.aimm-pluginhub-foundation-dev.pages.dev/. No passkey ceremony, Worker deploy, or production deploy occurred.

The approved read-only GET to `/account-api/v1/devices` returned device metadata that may include existing devices. That metadata was used transiently to select the diagnostic device; no device ID, display name, timestamp or other device metadata is reproduced or persisted here. A device-scoped read returned only one complete synthetic generation `875d53ad-e46d-4ce5-9ceb-eedb70a960d8`: AIMM Stage 5 Synthetic Probe (AU, 1.0.0, `com.synthetic.aimm.stage5.probe`; record `34234152-d78b-4e0d-8ae2-4a638a0ab619`). No other plug-in inventory records were requested or retained.

The read-only Move to Unused preview confirms that the action changes local files and requires Mac confirmation and the owner passkey; the Companion must still present the exact local source and destination after a supported request. No move request was created and no file action was performed. The expired 1,642-entry request was not reused.

Stage 5 remains **PARTIAL** pending exact Companion preview, owner confirmation/passkey action, restoration, fixture and diagnostic credential cleanup, and fresh independent review. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical bundle patch, not a reproducible branch build.

Evidence report: `governance/evidence/PHASE_PLUGINHUB_STAGE5_ISOLATED_SYNTHETIC_DEVICE_SYNC_20261029.md`, blob `32071acd5cd6f98fba16cb3e39a834492e2d3744`.

## Historical Stage 5 isolated synthetic sync — superseded by the 2026-10-29 checkpoint above

A fresh diagnostic Companion scanned one metadata-only synthetic AU fixture from an explicitly selected root, paired to the non-production development Worker, and reported the one-entry generation synced. The diagnostic app bundle and fresh journal are under `/private/tmp`; Keychain items use separate service names; no standard plugin folder or plugin inventory record was scanned or read. No independent API inventory readback was made. Evidence: [isolated synthetic sync report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_ISOLATED_SYNTHETIC_DEVICE_SYNC_20261029.md), blob `32071acd5cd6f98fba16cb3e39a834492e2d3744`.

Stage 5 remains **PARTIAL**. No move request was created. Kevin approved a narrow read-only device metadata query after the automatic review rejection; the direct GET to the development Pages `/account-api/v1/devices` route returned 401 because this tab had no active Library API access token. No device rows or plug-in inventory were returned. Retry only through this same approved route after an authenticated development Library session is active. The prior 1,642-entry request expired at `2026-10-29T08:06:53.728Z` and was not reused; no replacement request was created. No file move may occur before the owner sees and confirms its exact preview. Restore, fixture cleanup, diagnostic-device revocation and fresh independent Stage 5 review remain open. Foundation remains **NOT MET**; Stage 6 remains gated.

> **Latest development session-restore verification — 2026-10-28.** A single development browser session survived reload through the approved Pages branch preview: read-only Account preferences loaded before and after reload. Verification used an accessibility snapshot that included rendered Account preference control values; those values are not reproduced here or persisted in the evidence report. No identity value was inspected. Session/CSRF data were handled by the browser and app in memory; no cookie or token contents were extracted or recorded. No inventory records were requested. The Auth0 test identity was not independently identified; User A/B isolation and CSRF gates remain open. Source commits `fc8369fe606e79fd205f6ac363ad462ce2c51563` and `5f625ae7efb4df9c2c7ada7c7cc5c38b0bf96ea7` were both reviewed and passed by Jules. Preview deployment `51b6edb9-5bf9-4833-a738-f3a4a51a4ae1` succeeded in `preview`. A synthetic eight-scenario (16-assertion) request-header matrix passed against proxy source blob `8696cfe2754296ecd52212b54c163eb6e2dc856d`; this is source-level coverage only, not deployed-edge verification or CSRF/A/B closure. The session-read route synthesizes Origin only for origin-less `GET /v1/session` with `Sec-Fetch-Site: same-origin`; no Origin is synthesized for other paths or methods. The normal development Auth0 sign-in exchange created the browser session record; no manual D1 query/write occurred. No inventory/provider-status check, passkey ceremony, provider configuration, terms or credential change, plug-in file action, or Worker deployment occurred. Evidence report: [session-restore verification](../governance/evidence/PHASE_PLUGINHUB_SESSION_RESTORE_20261028.md), blob `9dbf776a8e26a6c2a25668a2aea976d4f05b5de2`. Foundation remains **NOT MET**; Stage 6 remains gated. The surgical passkey RP bundle limitation and all other listed gates remain open.
>

> **Latest Foundation gate update — paired-device wrong-ID probe — 2026-10-28.** The paired-device wrong-device identity probe now passes: the isolated, one-shot diagnostic Companion used the already paired credential for a read-only GET to a random different device UUID; the development Worker returned HTTP 401. The credential and response body were not displayed or persisted, and the Worker route performs a read-only SELECT. No inventory scan, sync, file action, D1 write, credential change or deployment occurred. Evidence blob 45c721a2a3471d109facbd9c3907b6f0cc855997. The live Worker remains the surgical patch; the branch dry-run is not deployment attestation. Foundation remains NOT MET and Stage 6 gated. Remaining open gates are Auth0 A/B session and CSRF isolation, 317 browser-only entries and two version differences, the synthetic Stage 5 move/restore and remote recovery, and fresh independent end-to-end review.
>
> **Latest PluginHub continuation — 2026-10-28.** Kevin reports successful development passkey enrollment; do not repeat setup or verification. The existing synthetic Stage 5 request remains unclaimed: it targets a 1,642-entry generation, while the paired Companion shows a 1,641-entry complete local generation/build. The record is metadata-only and absent from that local scan. No rescan or file action occurred; do not scan real plug-in folders to force a match. Reconcile only with a compatible synthetic local fixture/generation, then inspect the exact preview before any move. The request expires 2026-10-29T08:06:53.728Z; do not duplicate it. A clean lockfile install and `npm run build:worker` produced the branch-source Wrangler dry-run bundle from commit `8e394b89499b7f9d5e2de9b7bf9f5042f793ef56`; artifact SHA-256 `5d024fab98ec125b40f718e0171ad1597bbf5d3752a82d09a60782be22740c0e`. Evidence: Worker build blob `00d0fde8e6c123b3e26188c02fe700733926fe4a`; Stage 5 state blob `cf62c78b79148a3bbb21fc0362dc99ad442a2c55`. Wrangler auth is expired; no upload/deployment occurred. The live development Worker remains the surgical patch, not a reproducible deployed build. A later development Worker upload requires restored Wrangler auth and separately recorded owner approval. Foundation remains NOT MET and Stage 6 gated.
>
> **Passkey preview fix — live in development — 2026-10-28.** Chrome’s RP ID rejection was caused by the dev Worker using `aimixmasters.com` for WebAuthn while the branch preview runs on `codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev`. The Worker now uses the exact allowlisted request Origin for WebAuthn. Dev Worker version `68932c1c-2419-4b36-8208-b90449f4302c` is serving 100% under deployment `7562c0a0-cfe8-4472-8897-f00853453900`; `/health` returned 200. D1, Auth0 public settings, the preview allowlist, and the encryption secret binding were retained. No D1 query/write or passkey ceremony occurred. Version 10 was a surgical patch of deployed version 9, not a reproducible branch build; its commit annotation is not a source-build attestation. Branch tests 22/22, local API suite 38/38, and Wrangler dry-run bundling passed. Evidence [passkey RP fix](governance/evidence/PHASE_PLUGINHUB_PASSKEY_PREVIEW_RP_FIX_20261028.md), blob `da5a00973ff97f54b3cfab0ee5599601127a3b3d`. Foundation remains **NOT MET**; Stage 6 gated.

> **Latest Library Settings checkpoint — 2026-10-28 08:22 UTC.** The development Library card now shows **Set up a passkey** beside **Sign in**. Inventory and status checks are tucked into collapsed **More Library settings** and report brief progress/results notifications; detailed tables stay collapsed. Verified the branch preview in Chrome; preview deployment `feb20e90-cf3d-4a0a-9b43-b8be1433df4f` succeeded, and the screen showed the visible passkey button. Preview only; Cloudflare production deployments are disabled. No tests or local build were run. Foundation remains **NOT MET**; Stage 6 remains gated. The owner passkey is still needed for the synthetic Stage 5 move/restore check. Source commit `b6054480aa7fe1cbcaf95a0ccaebd57a00e28151`; UI blob `5e6bb59fbc2fb26337355612f4eccbac61a58bac`. Evidence [PHASE_PLUGINHUB_LIBRARY_SETTINGS_BACKGROUND_NOTIFICATIONS_20261028.md](../governance/evidence/PHASE_PLUGINHUB_LIBRARY_SETTINGS_BACKGROUND_NOTIFICATIONS_20261028.md), blob `edce9d6e5e1bce8ee8da28fb3300adff8c92efbb`. Preview deployment `feb20e90-cf3d-4a0a-9b43-b8be1433df4f` succeeded at https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/.

> **Latest Foundation checkpoint — 2026-10-27 22:47 UTC.** Independent review accepted only the AAX source-exclusion slice against approved P21 within its same-UID threat boundary; it did not rerun checks or validate deployed behaviour. Overall result remains PARTIAL. Source blob `c66421ed567c038e4cc6f76648ba085296c8c8f4` is unchanged at branch head `53f732c9bf1b7b622cb250b37f074c3d289e51fa`. [Independent review record](PHASE_PLUGINHUB_AAX_INDEPENDENT_SOURCE_REVIEW_20261027.md), blob `92259e0ecea2e42b698947ec92b9fdd017ebbc06`. Keep Foundation NOT MET and Stage 6 gated. Current D1 validation/write hold stays open; no D1 request or deployment. Remote runtime/action/recovery, wrong-device HTTP 401, unresolved inventory parity (317 browser-only; 2 version differences), and fresh independent end-to-end Foundation validation remain open.

> **Latest Foundation checkpoint — 2026-10-27 22:43 UTC.** Stage 4’s 31-row live UI map is recorded. It found the deployed Library still uses a browser-local scan; account preview parity remains 1,641 matched / 317 browser-only / 0 account-only / 2 version differences. The approved AAX exclusion is fixed in branch source: AAX controls/detection are removed, scanner skips `.aaxplugin` folders, and legacy cached AAX rows are filtered and cleared. Verification passed 5/5 targeted logic checks and V8 syntax parsing of all 4 non-JSON inline scripts. This was not a full application build, browser rescan, or deployment. The current preview still runs the older build and shows AAX until separately deployed. Stage 4 remains PARTIAL. [Stage 4 live UI map](PHASE_PLUGINHUB_STAGE4_UI_MAP_20261027_2239.md), blob `1b05d222e6b4799e93c56b0d29c2719d95fe24b3`. [AAX exclusion source verification](PHASE_PLUGINHUB_AAX_EXCLUSION_FIX_20261027_2243.md), blob `f2d4cab6bed54bcfd62ac445aac39843ff498539`; source commit `14a5592b14472190ea544efa18073e94193d1ddf`, `index.html` blob `c66421ed567c038e4cc6f76648ba085296c8c8f4`. No D1 query/write, file action, or deployment. Preserve the current D1 validation/write hold and separate 22:47 creation chronology. Remote Worker/D1 action/recovery, paired-credential wrong-device HTTP 401, and fresh independent end-to-end Foundation acceptance remain open. Foundation remains NOT MET; Stage 6 gated.

> **Latest Foundation checkpoint — 2026-10-27 22:43 UTC.** Stage 4’s 31-row live UI map is recorded. It found the deployed Library still uses a browser-local scan; account preview parity remains 1,641 matched / 317 browser-only / 0 account-only / 2 version differences. The approved AAX exclusion is now fixed in branch source: AAX controls/detection are removed, scanner skips `.aaxplugin` folders, and legacy cached AAX rows are filtered and cleared. Targeted source logic checks passed 5/5; this was not a full build, browser rescan, or deployment. The current preview still runs the older build and still shows AAX until separately deployed. Stage 4 remains PARTIAL. [Stage 4 live UI map](PHASE_PLUGINHUB_STAGE4_UI_MAP_20261027_2239.md), blob `1b05d222e6b4799e93c56b0d29c2719d95fe24b3`. [AAX exclusion source verification](PHASE_PLUGINHUB_AAX_EXCLUSION_FIX_20261027_2243.md), blob `ef7098903cca9e369cfcb82af9ab9c138cee924f`; source commit `14a5592b14472190ea544efa18073e94193d1ddf`, `index.html` blob `c66421ed567c038e4cc6f76648ba085296c8c8f4`. No D1 query/write, file action, or deployment. Preserve the current D1 validation/write hold and separate 22:47 creation chronology. Remote Worker/D1 action/recovery, a paired-credential wrong-device HTTP 401, and fresh independent end-to-end Foundation acceptance remain open. Foundation remains NOT MET; Stage 6 gated.

> **Latest Foundation checkpoint — 2026-10-27 22:39 UTC.** Read-only live UI inspection mapped all 31 parity rows. The account-backed preview remains in Settings while the Library tab still uses its browser-local scan; current parity is 1,641 matched / 317 browser-only / 0 account-only / 2 version differences. The Library still exposes AAX scanning/filtering despite the approved AAX exclusion. Stage 4 remains PARTIAL. [Stage 4 live UI map](PHASE_PLUGINHUB_STAGE4_UI_MAP_20261027_2239.md), blob `1b05d222e6b4799e93c56b0d29c2719d95fe24b3`. No full inventory export, D1 query/write, file action, or deployment. Foundation remains NOT MET; Stage 6 gated. Preserve the current D1 validation/write hold and the separately recorded 22:47 creation chronology. Fresh remote Worker/D1 action/recovery and independent end-to-end Foundation acceptance remain open.

> **Latest Foundation checkpoint — 2026-10-27 22:33 UTC.** The isolated local Worker/D1 synthetic action and recovery run passed: pairing, sync, two-way cross-account credential rejection, preview/receipt, synthetic move and parent-bound restore, post-action sync, local D1 receipt readback, recovery helpers, temporary bundle build, and scanner integration 3/3. The wrapper did not pass as a full suite: it stopped in an intentionally partial temp copy on missing/stale fixtures and DOM support. The report discloses this; it claims no full-suite pass. No installed plug-in files changed, no remote D1 access/write, and no deployment. Fresh independent review: PARTIAL. Reviewer verified the Stage 5 report's branch blob pins and scope, but did not reproduce the run. Local synthetic action/recovery is supported; fresh remote Worker/D1 action/recovery and full Foundation acceptance remain open. Browser/account parity remains 317 browser-only and 2 version differences; Stage 4's 31-row map and real paired-credential wrong-device HTTP 401 are still open. Foundation NOT MET; Stage 6 gated. Mac/account comparison is 1,958 local / 1,641 matched / 317 browser-only / 0 account-only / 2 version differences. [Stage 5 report](PHASE_PLUGINHUB_STAGE5_WORKER_SWIFT_RECOVERY_20261027_2229.md), blob `2f64c28e9a759e1114c5b8e9a241393e477c12d8`; [fresh independent review](PHASE_PLUGINHUB_STAGE5_INDEPENDENT_REVIEW_20261027_2233.md), blob `65a213b9de95ce7d2a80949e159a676bc60f3648`. Preserve the 22:47 authorization chronology. No deployment.

> **Latest Foundation checkpoint — 2026-10-27 22:29 UTC.** Stage 5 local synthetic Worker/Swift action and recovery passed. Actual Swift pairing, inventory sync, manual status, signed reveal receipt, synthetic move-to-Unused and parent-bound restore were exercised against an isolated local Worker/D1; post-action sync and D1 receipt readback passed. Local journal/copy recovery, bundle signing/build, and scanner integration 3/3 passed. The full wrapper did not pass: in its deliberately partial temporary tree the API test step lacked a DOM stub method and omitted root index and pinned export fixture. This is not a full-suite pass. No installed plug-in files changed; no remote D1 query/write, live installer download, or deployment. Mac/account comparison remains 1,958 local / 1,641 matched / 317 browser-only / 0 account-only / 2 version differences. Stage 4 31-row map and paired-credential wrong-device HTTP 401 remain open. Fresh independent review of this evidence is pending. Foundation remains **NOT MET**; Stage 6 gated. [Stage 5 evidence](PHASE_PLUGINHUB_STAGE5_WORKER_SWIFT_RECOVERY_20261027_2229.md), blob `2f64c28e9a759e1114c5b8e9a241393e477c12d8`. Preserve the 22:47 authorization chronology. No deployment.

> **Latest PluginHub checkpoint — 2026-10-27 22:25 UTC.** The current Mac/account compare remains 1,958 local / 1,641 matched / 317 browser-only / 0 account-only / 2 version differences. The corrected companion completed public checks for FabFilter 9, Voxengo 0, u-he 0, and Valhalla DSP 6 supported items. A bounded D1 latest-per-record aggregation now reads 1,626 Manual Check, 11 up-to-date, and 4 update observations; source fix prevents unsupported vendors from overwriting supported results. Isolated `swift build` and journal recovery checks passed. Read-only Finder reveal has a completed signed receipt; no files changed. Full Worker/D1 move-restore and fresh independent end-to-end review remain open. Foundation exit remains NOT MET; Stage 6 gated. [evidence](../governance/evidence/PHASE_PLUGINHUB_STATUS_STAGE5_RECOVERY_20261027_2225.md), blob `d2a1fb33f0875d2d0af7ace5a432279e5134b47a`. No deployment.

> **Latest PluginHub checkpoint — live Foundation validation — 2026-10-27 21:59 UTC.** A fresh paired-Mac scan synced generation `9ff4225e-fb10-4966-aae4-393cf8294210` (1,641 records). The browser comparison remains 1,958 local, 1,641 matched, 317 browser-only, 0 account-only, and 2 version differences. Vendor adapters submitted 11 public-vendor up-to-date and 4 update observations, but unsupported Manual Check rows subsequently superseded the results. The cause is fixed in source: vendor refreshes now submit only supported public-vendor observations. Isolated Swift build and current-branch journal checks passed; live verification with the rebuilt companion remains pending. One paired-Mac read-only Finder reveal completed, and the completed state plus signed receipt were verified through the Library and a bounded D1 read; no plug-in file changed. [live validation report](../governance/evidence/PHASE_PLUGINHUB_LIVE_VALIDATION_20261027_2159.md), blob `f5ec44684cbafbfcd793b46213db416ba731ed9d`. Foundation exit remains **NOT MET** pending browser parity, live verification of the status fix, synthetic move/restore recovery, the 31-row Stage 4 map, the wrong-device 401, and fresh independent end-to-end review. No production deployment, cutover, migration, or credential change.

> **Latest PluginHub checkpoint — live synthetic account-isolation preview probe — 2026-10-27 21:36 UTC.** The signed-in development preview refreshed while a sentinel record existed only under a second synthetic D1 account. Its account inventory stayed at 1,641 items and the exact sentinel search returned 0 of 1,641. All synthetic fixture rows were removed and verified absent. This is partial evidence for the preview's account-backed read path only; two-user OIDC isolation and the paired-credential wrong-device HTTP 401 are still open. The direct Worker request was not sent because shell DNS did not resolve the hostname. Stages 2–5 partial; review PARTIAL; recovery MET; Foundation **NOT MET**; Stage 6 gated. [Probe report](../governance/evidence/PHASE_PLUGINHUB_D1_SYNTHETIC_ACCOUNT_ISOLATION_20261027.md), blob `7fb955e5ab0133d30830458602d56407c4606394`; package blob `96be44d244628e77e2e0ac0567d148459c93ab63`; closeout blob `d4f1ff7ea7f0c55ac22d7cc93ec8f1c959ae320b`.

> **Latest PluginHub checkpoint — 2026-10-27 21:29 UTC.** Read-only verification confirmed the named non-production D1 and applied migration ledger through 0021; migration 0003 is already applied, so no migration/write was needed. Live two-account isolation and wrong-device 401 remain outstanding. Stages 2–5 are partial; independent review is PARTIAL; synthetic recovery is MET; Foundation **NOT MET**; Stage 6 gated. No production deployment. [D1 read](../governance/evidence/PHASE_PLUGINHUB_D1_IDENTITY_MIGRATION_READ_20261027_2129.md), blob `40744db2bd1c08965e1fe8346fbe5d032e18c141`; package `36384c77aef863165d9af7516a012a999b1266d3`; closeout `b808001098fecef3610fab7a00d8890a4afc7275`.

> **Latest PluginHub checkpoint — 2026-10-27 21:26 UTC.** Stages 2–5 remain partial. Swift scanner and companion products compiled from current branch source; synthetic scanner tests passed 3/3; focused JavaScript tests passed 12/12. Independent review at `246e7bc9fcec835833c80193c285d8c7ed178537` was **PARTIAL**. Browser/account parity remains open (317 browser-only; 2 version differences), vendor status readback remains unverified, Stage 4's 31-row map and Stage 5 live runtime walk are outstanding. Synthetic D1 recovery is MET. Foundation **NOT MET**; Stage 6 gated. No production deployment or cutover. [Build/review report](../governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_BUILD_AND_REVIEW_20261027_2126.md), blob `d0a00c7a2b29cd6534d084686745cd6dab7cff3c`; package blob `ea344914614b6cf5f090ddd96f78327e29d5d7d7`; closeout blob `3aa977f91677612b5138acfd71c02e162f46926a`.

> **Latest PluginHub checkpoint — 2026-10-27 21:17 UTC.** Foundation exit remains NOT MET; Stage 6 gated. Account-backed Library and typed Hope agree on 1,641 records. Browser scan: 1,958 records, 1,641 matching, 317 browser-only, 0 account-only, 2 version differences; parity remains OPEN. Non-production companion checks submitted: FabFilter 9 supported, Valhalla DSP 6, Voxengo 0, u-he 0; most records remain Manual Check and current account-side readback is pending. Focused current-branch tests passed 12/12; no full API suite/build ran. Stage 2–5 evidence remains partial: 31-row Stage 4 mapping, Stage 5 live action walk, real wrong-device 401, and fresh independent end-to-end review are open. Synthetic recovery remains MET. No production deployment or cutover. See [runtime evidence](../governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_RUNTIME_20261027_2117.md), blob `8adb59852808166914a5b033d8aad9bda90f55e4`. Current evidence package blob `89fc2884e23db7675f52b24a5417eac9905fd874`; closeout blob `ff910428dd4b8e624c9efca5dfe1a165de9a8607`.

> **Latest PluginHub checkpoint — Account-aware typed Hope verified — 2026-10-27. Hope now reads the signed-in account snapshot through its live typed-chat tool list. A count-only request returned 1,641 records and generation `902ed619-3a9a-48d6-b24e-c513ceffea3b`, matching the Library account view; the prior 485 was the static reference catalogue. Local browser scan remains 0, so browser/Mac local parity is OPEN. Companion public checks found 9 supported FabFilter items and 6 Valhalla items; Voxengo and u-he currently had no supported items. Stage 2–5 evidence and live wrong-device probe remain partial. Recovery remains MET from the isolated synthetic Time Travel report. Focused account tests passed 6/6; development Pages preview deployment `a10a545f-da2a-4d57-bc9b-1651257c4804` succeeded for source commit `3891230cc896363d6d8408f30f0a8449131b66cc`. Foundation remains NOT MET; Stage 6 gated. No production deployment. Evidence blob `01c83197fc80f9abbff83a8f7ab1757cdb6e70e5`; root index blob `035bb40704310c97e467e7646f5c0f26b4a82501`.** See ../governance/evidence/PHASE_PLUGINHUB_HOPE_ACCOUNT_TOOL_INTEGRATION_20261027.md.

> **Latest PluginHub checkpoint — same-origin Library session proxy independently reviewed — 2026-10-27. The non-production preview now completes Auth0 sign-in and reads the account snapshot (1,641 records); focused proxy tests passed 2/2. Independent review accepted the proxy for this preview and identified a production boundary: the fixed upstream is the development Worker, so add host/environment enforcement before any production deployment. Browser-local scan remains 0; browser/Mac/Hope parity stays OPEN. No production deployment. Foundation **NOT MET**; Stage 6 gated. Runtime evidence blob `ac7ec252d93fe902d0711001b1e5bf19d5d5cb83`; independent review blob `31806ad3ca64ef851e3a6e8a50398c8d7d176f39`.** See ../governance/evidence/PHASE_PLUGINHUB_LIBRARY_SESSION_PROXY_FIX_20261027.md and ../governance/evidence/PHASE_PLUGINHUB_LIBRARY_SESSION_PROXY_INDEPENDENT_REVIEW_20261027.md.

> **Latest PluginHub checkpoint — Library sign-in succeeds through same-origin session proxy — 2026-10-27. The branch preview now completes Auth0 sign-in, creates a browser session, and reads the account snapshot (1,641 records). A Pages Function at same-origin /account-api forwards only approved /v1/* calls to the fixed dev Worker; focused proxy tests passed 2/2. The browser-local scan is still 0, so browser/Mac/Hope parity remains OPEN. No full suite/build or production deploy. Foundation **NOT MET**; Stage 6 gated. See governance/evidence/PHASE_PLUGINHUB_LIBRARY_SESSION_PROXY_FIX_20261027.md (blob ac7ec252d93fe902d0711001b1e5bf19d5d5cb83); source commit 3fab04f0a1389c576ef6acfe4f5867aa8ac2d82f, preview deployment b679f885-fffa-47fa-b721-4377637f31d2.
> 
> **

> **Latest PluginHub checkpoint — Library sign-in diagnosis — 2026-10-27: Auth0 returned to the non-production app, but its automatic account refresh was rejected: “A valid Library API access token is required.” No account data returned; token/credential contents were not inspected. The active dev Worker’s OIDC issuer, audience, JWKS, client ID and preview-origin allowlist match the SPA. Cloudflare returned no matching telemetry event and the UI showed no sanitized rejection reason, so the failed claim/request-origin check remains unknown. See PHASE_PLUGINHUB_AUTH0_BROWSER_SESSION_REJECTION_20261027.md (blob b8e03faaf3732ae299687f4d25fca8a413f3a682). Foundation remains NOT MET; Stage 6 gated. No deployment or D1 operation.** See ../governance/evidence/PHASE_PLUGINHUB_AUTH0_BROWSER_SESSION_REJECTION_20261027.md.

> **Latest PluginHub checkpoint — Settings redesign aligned to Library and Mix Check — 2026-10-27:** Settings now follows the app’s charcoal card surfaces, typography, and blue-purple active accent. Six section links organize Library Settings, provider access, models, safety, route guidance, and reset. Pills and buttons have more space and 42px minimum height; narrow screens collapse to one column. Browser preview and computed styles verified; both inline app scripts parsed. No behavior suite reran for this layout-only change. See ../governance/evidence/PHASE_PLUGINHUB_SETTINGS_REDESIGN_20261027.md, blob `ee4489131b7fba848f9e2d5a6f9220702196034b`. Source commit `01bc8261c24efd3b234f785dbb21705fa62abc0a`; index blob `baf3b05c64ba572ba7d98951d71f20c988b688a3`. Foundation remains **NOT MET**; Stage 6 gated. No production deployment.

> **Latest PluginHub checkpoint — Settings refresh verified — 2026-10-27:** Library Settings is now clearly included in Settings. Hope route notes, relay-managed key status, both Agent roles, tool update copy, Anthropic research model, session safeguards, and reset scope match the current setup. Preview commit `9d02cbb8ad519b2602a2f0c0e55ab55c57fa95b2` succeeded at Pages deployment `f1c15cee-59ee-433f-a60d-552f59ad1738`; focused tests 10/10 and inline JavaScript syntax check passed. The tool update was not run; no provider credential or account data was changed/read. See ../governance/evidence/PHASE_PLUGINHUB_SETTINGS_REFRESH_20261027.md, blob `5ec66b01ba2d994f11ec82766370c76953578704`. Foundation **NOT MET**; Stage 6 remains gated. No production deployment.
> **Latest PluginHub checkpoint — 2026-10-27:** The account preview enable control is now reachable while its account controls remain off until explicitly enabled. Targeted UI suite: 6/6. Independent read-only review accepted this reachability fix only; see PHASE_PLUGINHUB_ACCOUNT_PREVIEW_ENABLE_REVIEW_20261027.md (blob 0cf92af2e7d34cb0d6bcf38577372b0ed08dbfdf). Fix evidence: PHASE_PLUGINHUB_ACCOUNT_PREVIEW_ENABLE_FIX_20261027.md (blob c04bfa2656a3238e62b017ad718eb414e220d438); source commit 7e654bd88899f2509d611f9a8e558a7d1da08634, test commit f747b109c0a3db93f5c2cafaba3fd917e59e7fb6. Account-backed browser/Mac/Hope parity, the real wrong-device 401 probe, remaining Stage 2–5 evidence, and fresh independent end-to-end acceptance remain open. Foundation NOT MET; Stage 6 gated. No deployment.

> **Status correction — 2026-10-27:** Historical checkpoints below that still list isolated populated-data recovery as OPEN are superseded by the 2026-10-27 gate reconciliation. Independent review agrees the isolated recovery gate is MET. Foundation remains NOT MET; Stage 6 remains gated. See ../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_GATE_RECONCILIATION_20261027.md (blob 4aee12948b2804711749d456fd3a8baeef759ab6) and PHASE_PLUGINHUB_D1_TIME_TRAVEL_RECOVERY_20261025.md (blob 6d3d3f881bc6d861744d9bd72dfbaec6074b75f3).

## Gate reconciliation — recovery evidence already recorded — 2026-10-27

The isolated populated-data recovery gate is **MET** based on the existing [Cloudflare D1 Time Travel recovery report](../governance/evidence/PHASE_PLUGINHUB_D1_TIME_TRAVEL_RECOVERY_20261025.md), blob `6d3d3f881bc6d861744d9bd72dfbaec6074b75f3`. It used synthetic records on a separate temporary development D1, restored them from a bookmark, and verified the shared project D1 unchanged. The broad-export recovery test remains excluded.

The current browser Library still uses browser-local scanning; browser/Mac/Hope parity and the supported paired-credential wrong-device HTTP 401 check remain open. Remaining Stage 2–5 evidence and fresh independent end-to-end acceptance are also open. Foundation **NOT MET**; Stage 6 gated. See [gate reconciliation](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_GATE_RECONCILIATION_20261027.md), blob `4aee12948b2804711749d456fd3a8baeef759ab6`.

## Browser parity re-check — 2026-10-27

The current AIMM Library page remains browser-local (0 connected folders; “The scan stays in this browser”; vendor update checks disconnected). Pairing and Mac inventory sync are verified separately, but account-backed browser/Mac/Hope parity is still OPEN. Foundation **NOT MET**; Stage 6 gated. [browser parity re-check](../governance/evidence/PHASE_PLUGINHUB_BROWSER_PARITY_RECHECK_20261027.md), blob `d3e2e098d3501e3f7a197d18cf7f61e0b668d8c8`.

## Follow-up validation — 2026-10-27

Current branch API/runtime suites passed 38/38 across five suites; the restricted broad-export recovery test was not run. The exact non-production D1 identity is confirmed and all 21 migrations are applied. The development Worker health endpoint returns OK. An independent source review found no exploitable cross-account bypass in inspected API routes.

**Foundation NOT MET; Stage 6 gated.** Real paired-credential isolation, account-backed browser/Mac/Hope parity, populated-data recovery and independent end-to-end acceptance remain open. No D1 write, build or deployment. Details: [continued validation report](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CONTINUED_VALIDATION_20261027.md), blob `f9651eff2658b30256a8d48b858ac83a4ba4a61a`.

## Latest checkpoint — pairing confirmed; fresh independent review is PARTIAL — 2026-10-27 15:25 UTC

The exact current Companion preview shows secure pairing and a complete 1,641-entry inventory sync, corroborated by bounded D1 approval/delivery evidence. API tests pass 20/20, including synthetic foreign-account wrong-device rejection. The live paired-credential probe remains unverified because Keychain returned status `-50` before HTTP.

Fresh independent review: **PARTIAL**. The reviewer verified record-pin consistency but did not independently query D1 or reproduce the live provider results. See [independent review](governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REVIEW_20261027_1525.md), blob `7129459d3e411103032b907cefbb9a7e995cf0ec`.

**Foundation NOT MET; Stage 6 gated.** Remaining: real paired-credential cross-account rejection, browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 evidence, and fresh independent end-to-end validation. No deployment or production access; no D1 write or credential rotation; no build ran in this checkpoint.

## Latest checkpoint — pairing and full inventory sync confirmed — 2026-10-27 15:24 UTC

The exact current Companion preview shows **Paired securely** and confirms that the complete 1,641-entry inventory generation synced. An exact, bounded D1 read independently confirms this approved pairing's delivery, active device credential, current inventory head and complete record count. The earlier stale error came from selecting a different old preview by display name; the correct preview was selected by its full bundle path. See [pairing/sync evidence](governance/evidence/PHASE_PLUGINHUB_MAC_PAIRING_AND_SYNC_20261027.md), blob `fc44a0786221a394a972f81682e172f342a16060`.

API tests pass **20/20**, including synthetic cross-account wrong-device rejection. The real paired-credential cross-account probe is still unverified: the Keychain harness returned status `-50` before HTTP. Fresh independent review is **PARTIAL**. Browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 evidence, and fresh end-to-end independent validation remain open.

**Foundation NOT MET; Stage 6 gated.** No deployment, production access, D1 write or credential rotation. No build ran.

## Latest checkpoint — pairing delivery verified; Companion state mismatch remains — 2026-10-27 15:20 UTC

The browser approval was accepted. An exact read-only D1 check confirms approval and credential delivery for that pairing, one active device credential, and a complete 1,641-record generation. The open Companion still shows its prior polling error and phrase, not “Paired securely”; reconcile the visible state without creating another pairing. See [pairing/sync evidence](governance/evidence/PHASE_PLUGINHUB_MAC_PAIRING_AND_SYNC_20261027.md), blob `ed06d6dcdabb5730295e31570b7803482a6cc435`.

`node --test test/foundation.test.js` passed **20/20** against source/test files matching the current branch. This includes a synthetic cross-account wrong-device 401 test; the real paired-device credential probe still did not reach HTTP because Keychain returned status `-50`. Current independent review is **PARTIAL** and did not independently reproduce live provider/D1 evidence. Browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 evidence, and fresh end-to-end independent validation remain open.

**Foundation NOT MET; Stage 6 gated.** No deployment or production access. No D1 writes or credential rotation. No build ran.

## Latest checkpoint — server-side pairing verified; Companion state mismatch remains — 2026-10-27 15:10 UTC

The browser approval was accepted. An exact, read-only D1 check confirms approval and credential delivery for that pairing, one active device credential, and a complete 1,641-record inventory generation. However, the open Companion window still shows its earlier polling error and verification phrase rather than “Paired securely.” Server-side delivery and sync are verified, but the visible client state still needs reconciliation; do not start another pairing. Details: [pairing and sync evidence](governance/evidence/PHASE_PLUGINHUB_MAC_PAIRING_AND_SYNC_20261027.md), blob `e012e0e77e9cd1c187a90645f3f99b74cc76c89e`.

The real wrong-device credential probe remains unverified: Keychain returned status `-50` before any HTTP request. The fresh independent review is **PARTIAL**; it verified record-pin consistency but did not independently reproduce live provider/D1 checks. Browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 evidence, and fresh end-to-end independent validation remain open.

**Foundation NOT MET; Stage 6 gated.** No deployment or production access. No D1 writes, credential rotation, tests or builds occurred in this checkpoint.

## Latest checkpoint — server-side pairing verified; Companion state mismatch remains — 2026-10-27 15:06 UTC

The browser approval was accepted. An exact, read-only D1 check confirms approval and credential delivery for that pairing, one active device credential, and a complete 1,641-record inventory generation. However, the open Companion window still shows its earlier polling error and verification phrase rather than “Paired securely.” Server-side delivery and sync are verified, but the visible client state still needs reconciliation; do not start another pairing. Details: [pairing and sync evidence](governance/evidence/PHASE_PLUGINHUB_MAC_PAIRING_AND_SYNC_20261027.md), blob `e012e0e77e9cd1c187a90645f3f99b74cc76c89e`.

The real wrong-device credential probe remains unverified: Keychain returned status `-50` before any HTTP request. The fresh independent review is **PARTIAL**; it verified record-pin consistency but did not independently reproduce live provider/D1 checks. Browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 evidence, and fresh end-to-end independent validation remain open.

**Foundation NOT MET; Stage 6 gated.** No deployment or production access. No D1 writes, credential rotation, tests or builds occurred in this checkpoint.

## Latest checkpoint — Mac pairing and inventory sync verified; Foundation gates remain — 2026-10-27 15:02 UTC

The owner approved the matching browser/Companion phrase. The development Mac is paired, and the Companion reports a complete inventory sync. Bounded read-only D1 aggregates confirm one active Mac mini device, one active credential, one current inventory head, and a complete generation containing 1,641 records. See [pairing and sync evidence](governance/evidence/PHASE_PLUGINHUB_MAC_PAIRING_AND_SYNC_20261027.md), blob `28a7cb31a4801fe352f57658b1211a174ed0821f`.

The real credential wrong-device probe did not reach the API: macOS Keychain returned status `-50` before any request. The credential was not exposed. This is not a pass; remote account-isolation evidence remains open. Account-backed browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 evidence, and fresh independent end-to-end review also remain open.

**Foundation NOT MET; Stage 6 gated.** No deployment, production access, credential rotation, or D1 write occurred. No tests/builds ran in this checkpoint.

## Latest pairing checkpoint — Auth0 redirect fixed, owner device approval pending — 2026-10-27 14:55 UTC

The development approval page now retains the pairing ID through Auth0 sign-in. The Worker/API suite passes 20/20 and Wrangler dry-run passes. Live sign-in returned successfully to the development Worker, restored the Mac mini pairing details, and shows the same phrase as the Companion. The owner approval has not happened: no remote credential or inventory sync has completed. Kevin must compare both phrases, enter the matching phrase, click **Approve this device**, and confirm the browser prompt. This grants the development Mac access to the account inventory and triggers the previously disclosed Keychain credential and metadata sync. Stop if Auth0 asks for a new `manage:devices` grant.

See [pairing redirect fix and live callback evidence](../governance/evidence/PHASE_PLUGINHUB_PAIRING_REDIRECT_FIX_20261027.md), blob `015230ec129b5e5530263adf5cb35f22ad2d1321`. Development Worker deployment: `75630f62-31f0-4971-b154-6a6ca7f51eaa`, version `a04b897b-986d-46e5-9822-21926c804769`.

**Foundation remains NOT MET; Stage 6 remains gated.** Device-credential isolation, account-backed browser/Mac/Hope parity, populated-data recovery, remaining approved Stage 2–5 gates and fresh independent end-to-end review remain open. No production deploy or cutover.

## Latest pairing checkpoint — rebuilt development Companion ready for owner confirmation — 2026-10-27 12:32 UTC

The updated Companion was rebuilt and launched as a temporary ad-hoc signed development preview from branch commit `8423e6be2e4ac26390b8204a46188a2a202b0a2a`. Its pairing disclosure is open. It identifies the Mac mini, the non-production Worker destination, the public signing key, Keychain credential creation, and automatic sync of the saved 1,641-entry metadata; local paths and folder bookmarks stay on the Mac. No pairing request or data transfer has started. Kevin's action-time step is to click **Continue to pairing approval** in the visible disclosure, then verify the phrase before approving in the browser. Stop if Auth0 requests a new `manage:devices` grant.

The development Worker poll retry fix is deployed and health is OK. See [Companion preview build and disclosure evidence](../governance/evidence/PHASE_PLUGINHUB_COMPANION_PREVIEW_BUILD_20261027.md), blob `6fbf5158a8e75b71384331ef2a91e906da4a2564`, and [poll retry deployment evidence](../governance/evidence/PHASE_PLUGINHUB_PAIRING_POLL_RETRY_20261027.md), blob `97000d33a1f2cd758c76e17be79b4eaeac763b07`.

**Foundation remains NOT MET; Stage 6 remains gated.** Remote device-credential isolation, account-backed browser/Mac/Hope parity, populated-data recovery, remaining approved Stage 2–5 gates and fresh independent end-to-end review remain open. No production deployment or cutover.

## Latest development pairing retry checkpoint — 2026-10-27 12:30 UTC

The 30-polls/minute source limit stays unchanged. The development Worker now returns retry timing and the Companion source honors it; API tests passed 20/20, the Swift retry harness passed, and Wrangler dry-run passed. Exact branch commit `8423e6be2e4ac26390b8204a46188a2a202b0a2a` is live on development deployment `13e04554-fe80-4e8c-a6fc-1679f4577854` / version `e254b220-af5f-44f9-a723-7aa71d68e15b`. Health is OK; D1 and the existing secret binding remain present and unchanged.

The running Companion Preview still shows the former cooldown phrase, so the updated client build has not yet completed a real pairing. Next: rebuild/relaunch the development preview from the branch, then retry pairing after the updated retry behavior is active. Stop at its data disclosure for Kevin's action-time confirmation and at any new Auth0 `manage:devices` grant. No credential, inventory sync, or D1 write occurred. See [pairing retry implementation and deployment evidence](../governance/evidence/PHASE_PLUGINHUB_PAIRING_POLL_RETRY_20261027.md), blob `97000d33a1f2cd758c76e17be79b4eaeac763b07`.

**Foundation remains NOT MET; Stage 6 remains gated.** Remote device credential isolation, browser/Mac/Hope parity, populated-data recovery, remaining approved Stage 2–5 evidence, and fresh independent end-to-end review remain open. No production deploy or cutover. The 22:47 D1 creation authorization is resolved.

## Latest development pairing checkpoint — 2026-10-27 11:12 UTC (runtime verification added)

The approved non-production Worker deployment and Auth0 callback/origin settings are verified. The Worker health endpoint returned `status: ok`; the new `/pairing-preview` route renders, and a synthetic invalid pairing ID is rejected. Auth0 showed a successful save with the Worker callback/origin while preserving loopback settings. The Companion currently reports “Too many pairing polls. Try again shortly” with the earlier verification phrase, so no fresh request was started. No valid pairing was approved, no device credential or Mac inventory was transmitted, and no D1 row changed. See [runtime and Auth0 configuration evidence](PHASE_PLUGINHUB_PAIRING_PREVIEW_RUNTIME_AUTH0_20261027.md), blob `91e7c93a73c3571db896f595ff7449df4f5b517f`. **Foundation remains NOT MET; Stage 6 gated.** Remote pairing/Keychain delivery, device credential isolation, browser/Mac/Hope parity, populated-data recovery, remaining Stage 2–5 evidence, and fresh independent end-to-end review remain open. 22:47 authorization remains resolved; no production deployment or cutover.

## Latest pairing checkpoint — 2026-10-27 09:56 UTC

Kevin confirmed the current Mac pairing. The Companion started a pairing request to the non-production API, but the live canonical page (build 2026-10-25.24) has no account approval script or controls. No owner phrase check, approval, device credential or inventory sync occurred. Foundation NOT MET; Stage 6 gated. No deployment. Evidence blob ec40dc01be6ec38ed88bf3cf0d92cd1067d840a0.

The short-lived request is pending; the branch approval script is not served on the canonical live page. No deploy or use of the loopback-only remote pairing helper. See [pairing approval UI gap](governance/evidence/PHASE_PLUGINHUB_PAIRING_CONFIRMED_APPROVAL_UI_GAP_20261027_0956.md).

## Latest live parity check — 2026-10-26 22:42 UTC

Latest live parity check — 2026-10-26 22:42 UTC. Read-only inspection of aimixmasters.com showed live build 2026-10-25.22, a browser-local scanner, 0 products, 0 formats and 0 connected folders; the view said “The scan stays in this browser.” This does not prove account-backed browser/Mac/Hope parity. Foundation NOT MET; Stage 6 gated. No scan, upload or deployment. Evidence blob bd9e43a118930cfe7ea317d6d146621b58c54591.

The currently served page is still the browser-local Library view, so the live integration walkthrough remains open. No deployment/cutover.

Evidence: [live Library parity check](governance/evidence/PHASE_PLUGINHUB_LIVE_LIBRARY_PARITY_CHECK_20261026_2242.md), blob `bd9e43a118930cfe7ea317d6d146621b58c54591`.

## Latest independent review — 2026-10-26 22:40 UTC

The independent reviewer accepted that the dashboard, roadmap, status, closeout and evidence package pins agree. The review did not reproduce live Auth0 or D1 checks, so it rated the overall Foundation evidence **PARTIAL**. The A-to-B probe covers /v1/preferences only; it does not prove every account route or remote device-credential isolation.

Still open: action-time approval and completion of the current Mac pairing, Keychain credential delivery and inventory sync; cross-account rejection using the paired device credential; live browser/Mac/Hope parity; project-appropriate populated-data recovery without rewinding shared D1; remaining approved Stage 2–5 evidence; and a fresh independent end-to-end Foundation review. The local suite and bidirectional synthetic preference marker checks are supporting evidence, not closure of these gates.

The 1,641-entry Mac inventory disclosure is awaiting action-time confirmation. The earlier unapproved pairing request was not delivered. The extra non-production account row from the mistaken Google-linked login remains disclosed and undeleted. The owner-confirmed 22:47 database-creation authorization remains resolved; the 22:51 retention timestamp is distinct.

**Foundation remains NOT MET; Stage 6 remains gated.** No deployment, cutover, shared-D1 rewind or production-data use occurred.

See [fresh independent review](governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REVIEW_20261026_2240.md), blob `b3fb33394d97480d415098fa4a8cb81911c3291e`.

## Latest continuation — Test User A session and reverse isolation — 2026-10-26 22:37 UTC

The saved Auth0 database credential now authenticates the existing Test User A account. Session exchange, restore, authenticated account read, and CSRF logout passed. Combined with the prior Test User B check, synthetic preference read isolation passed in both directions; the new B-only marker was removed, and final targeted reads found no probe markers or active sessions for A, B, or the extra mapping. The D1 ledger remains current through migration 0021.

The first attempt used Google federation instead of the saved Auth0 database identity. It created extra non-production account row `78ef9029-d61b-4e52-b569-57217def2476`; the row remains, but no active session remains and it was not deleted. See [the live evidence report](governance/evidence/PHASE_PLUGINHUB_AUTH0_BIDIRECTIONAL_ISOLATION_20261026_2237.md), blob `3fff94cdf4ee549a220c48074eff8fcaf19e5f8d`.

The full local no-deploy suite passed: API/browser 38/38, scanner 3/3, signed preview build, Swift journal and recovery, disposable local D1/Worker, synthetic account rejection, and actual local pairing, inventory sync, Manual Check, reveal, move, and restore receipts.

The new companion build displays the destination and exact 1,641-entry metadata disclosure. One request from the old preview remains unapproved and undelivered until it expires; no device credential or real inventory was delivered. The current pairing action is waiting for action-time owner confirmation. Remote device-credential cross-account rejection, live browser-to-Mac parity, remaining Stage 2–5 gates, and fresh independent end-to-end review remain open.

**Foundation remains NOT MET; Stage 6 remains gated.** The 22:47 creation authorization is owner-confirmed; preserve the separate 22:51 retention timestamp. No deployment/cutover or production data.

## Latest continuation — Test User B session and synthetic account-scope check — 2026-10-26 21:57 UTC

The approved Test User B Auth0 development flow reached the live Worker: session exchange, browser restore and CSRF-protected logout passed for account `a518a090-0965-4796-b8e9-86b3ac3468b1`. A bounded synthetic A-only preference probe showed that B's authenticated reads did not expose A's marker even when given A's account ID; `/v1/me` remained B, while library and device lists were empty. The marker and the orphaned test session were cleaned up; final checks found zero marker rows and zero active B sessions.

The exact D1 identity was rechecked and the read-only migration ledger returned all 21 migrations through 0021, including 0003, with 21 rows read, zero rows written and `changed_db: false`. No migration was applied. This is one-direction read-scope evidence only; Test User A was not authenticated, there are no remote devices for either account, and bidirectional/device-credential isolation remains open. Remote pairing, recovery, browser-to-Mac parity and fresh independent end-to-end review remain outstanding.

The bounded synthetic D1 validation scope is authorized. The 22:47 creation chronology remains owner-confirmed; the separate 22:51 retention timestamp remains distinct. **Foundation remains NOT MET; Stage 6 remains gated.** No tests/builds, deployment, cutover, production data or real Mac inventory upload occurred.

Evidence: [Test User B session/isolation report](governance/evidence/PHASE_PLUGINHUB_AUTH0_TEST_USER_B_SESSION_ISOLATION_20261026_2157.md), blob `beee3eaddbec4640a6282de9400c03fc51e2c867`.

## Latest continuation — Test User B Auth0 consent gate — 2026-10-26 21:05 UTC

Test User B (`kevin@lelitte.co.uk`) was selected and the approved Google identity sharing completed. The separate Auth0 app grant for **AIMM Library Web (development)**, scopes `openid profile email read:library` and API audience `https://aimm-library-api-dev`, is waiting for the owner's action-time decision. The first attempt selected Test User A and its consent was declined. No token or API session was issued. No remote D1 write, pairing or deployment occurred. Foundation remains **NOT MET**; Stage 6 remains gated.

See [Test User B consent evidence](governance/evidence/PHASE_PLUGINHUB_AUTH0_TEST_USER_B_CONSENT_20261026_2105.md).

## Latest continuation — pairing consent disclosure and verification — 2026-10-26 18:36 UTC

Added a just-in-time pairing confirmation that identifies the development API destination, device name, public key, fields in the saved inventory, and the local-only path/bookmark boundary. The full local no-deploy pipeline passed after this change: scanner 3/3, API/browser 38/38, companion build/package, disposable local D1/Worker, synthetic isolation, and real Swift pairing/sync/reveal/move/restore receipts. No remote pairing, inventory upload, Auth0 consent, or deployment occurred. The saved Test User B Google sign-in consent remains pending. Foundation remains NOT MET; Stage 6 remains gated.

See [pairing consent change and verification](../governance/evidence/PHASE_PLUGINHUB_PAIRING_CONSENT_UI_20261026_1836.md) and [real-Mac data boundary](../governance/evidence/PHASE_PLUGINHUB_PAIRING_DATA_BOUNDARY_20261026_1833.md). Pairing the saved real Mac scan still requires owner approval at the action point; the in-app disclosure now presents the exact destination and metadata before starting the request. The Google Test User B identity-sharing consent is a separate pending approval.

No remote account/device/session data changed in this checkpoint. No deployment/cutover.

## Latest continuation — current Mac pairing data boundary — 2026-10-26 18:33 UTC

Read-only inspection confirms the current Mac companion remains unpaired with an empty API URL. A complete local scan of 1,641 plug-in format entries across two roots remains on the Mac; the UI confirms nothing was uploaded. Pairing immediately syncs the saved scan's product names, bundle IDs, versions, format and metadata source (paths remain local) after storing a device credential in Keychain. Explicit action-time approval is required before sending this real inventory to the non-production Library API and creating the remote device credential. Google's Test User B sign-in consent is also still pending. Foundation remains NOT MET; Stage 6 remains gated; no deployment/cutover.

See [pairing data-boundary evidence](../governance/evidence/PHASE_PLUGINHUB_PAIRING_DATA_BOUNDARY_20261026_1833.md) and [latest local/runtime verification](../governance/evidence/PHASE_PLUGINHUB_NONPROD_VERIFICATION_20261026_1828.md). Pairing also requires the existing Google and Auth0 consent steps to be completed with their approvals at the point each grant is shown.

No pairing attempt, remote write, software/configuration change, deployment or cutover occurred in this checkpoint.

## Latest continuation — local suite and remote read-only checks — 2026-10-26 18:28 UTC

The complete local no-deploy pipeline passed at 2026-10-26 18:28 UTC: companion packaging/signature/build and journal checks, scanner 3/3, API/browser 38/38, disposable local D1/Worker, synthetic account-isolation rejection, and actual Swift pairing/sync/Manual Check/reveal/move/restore receipts. Current Cloudflare read-only binding metadata still maps `aimm-library-api-dev` to the approved development D1. A read-only D1 migration query returned all 21 migrations through 0021, including 0003, with zero rows written and `changed_db: false`. The Auth0 flow is paused at Google's explicit consent to share the saved Test User B identity with auth0.com; no consent was accepted and no token/API session was created. Foundation remains NOT MET; Stage 6 remains gated. Remote authenticated A/B HTTP isolation, current-Mac remote pairing/Keychain, recovery/parity, remaining Stages 2–5, and fresh independent end-to-end review remain open. No deployment/cutover.

See [verification evidence](../governance/evidence/PHASE_PLUGINHUB_NONPROD_VERIFICATION_20261026_1828.md). The saved Test User B login reached Google's consent page. **Do not click Continue until Kevin approves sharing the Test User B name, profile picture and email with auth0.com for PluginHub development sign-in.** Auth0's separate application consent must also be reviewed at its own action point. The 1Password Test User A/B entries are already present; no duplicate identities were created.

No deployment, cutover, production action, provider configuration change or credential creation occurred in this checkpoint.

## Latest continuation — Auth0 session and remote CSRF evidence — 2026-10-26 18:16 UTC

Test User A completed Auth0 PKCE on both the disposable local Worker and the active non-production Worker. Remote authenticated `/v1/me` and session restore returned 200; a DELETE without CSRF returned 403 `csrf_rejected`; valid logout returned 200 and the next `/v1/me` returned 401. Access token and CSRF value stayed in memory. The temporary loopback proxy forwarded only to the fixed development Worker, did not log headers/bodies, and was removed. It supplied the configured canonical site Origin, so this does not prove direct canonical-site browser CORS. No device pairing or deployment occurred. [Evidence](../governance/evidence/PHASE_PLUGINHUB_AUTH0_REMOTE_SESSION_CSRF_20261026_1816.md).

`sh scripts/pluginhub-nonprod-check.sh` passed: API/browser 38/38, scanner 3/3, companion packaging/build/journal, disposable local D1/Worker, synthetic cross-account rejection, and Swift pairing/sync/reveal/move/restore receipts. The first sandboxed run could not plan SwiftPM; the full rerun passed through the approved elevated local runner.

Foundation remains **NOT MET**; Stage 6 remains gated. Authenticated A/B endpoint isolation, current-Mac pairing and Keychain delivery, project recovery/parity, remaining Stage 2–5 gates, and fresh independent end-to-end validation remain open. No deploy/cutover.

## Latest continuation — verified development Worker and Foundation gates — 2026-10-26 18:03 UTC

Read-only Cloudflare settings confirm the active development Worker matches the recovered Auth0 issuer/client/audience, approved development D1, canonical site origin, and configured action-preview encryption secret. Live workers.dev `/health` returned 200 and unauthenticated `/v1/me` returned 401. This does not establish authenticated session or account isolation. [Evidence](../governance/evidence/PHASE_PLUGINHUB_REMOTE_WORKER_RUNTIME_20261026_1756.md).

The full local no-deploy suite passed earlier in this continuation: API/browser 38/38, Swift/app packaging and journal, scanner 3/3, disposable local D1/Worker, synthetic isolation, pairing/sync/reveal/move/restore receipts. Auth0 Test User A completed PKCE; the development consent remains pending and no API session was created. Fresh independent Foundation review is **PARTIAL**. Foundation remains **NOT MET**; Stage 6 remains gated. The bounded D1 validation scope is cleared only for the recorded synthetic checks. No deployment/cutover.

## Latest continuation — Auth0 runtime recovery and fresh review — 2026-10-26 17:49 UTC

The full local no-deploy suite passed: API/browser 38/38, Swift companion packaging/build and journal, scanner 3/3, disposable local D1/Worker, synthetic cross-account rejection, and pairing/sync/reveal/move/restore receipts. A real Auth0 Test User A completed PKCE back to the loopback harness, but its local session exchange returned 503 before session creation because the initial local process could not resolve Auth0 JWKS. A read-only public JWKS request now returns HTTP 200; a fresh loopback Worker with an empty disposable D1 is prepared on port 8788. [Runtime evidence](../governance/evidence/PHASE_PLUGINHUB_AUTH0_LOCAL_RUNTIME_20261026_1743.md).

The pending Auth0 development SPA consent has not been accepted. The fresh independent review is **PARTIAL**: no JWT validation/session creation, browser session/CSRF, authenticated A/B HTTP isolation, live pairing/passkey delivery, project-data recovery, current Mac/browser/Hope parity, remaining action coverage, or full Foundation acceptance is evidenced. [Review](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REVIEW_20261026_1749.md). The bounded synthetic D1 validation hold is cleared; Foundation **NOT MET**; Stage 6 gated. No deployment or cutover.

## Latest continuation — bounded remote D1 validation — 2026-10-26 15:06 UTC

**Done:** Kevin cleared the D1 validation hold for synthetic non-production checks. The exact dev D1 identity is verified; all migrations through 0021 (including 0003) are recorded. Synthetic cross-account device/credential binding was rejected, all probe rows were cleaned up, and the separate synthetic-only remote recovery check is already documented. [Evidence](../governance/evidence/PHASE_PLUGINHUB_D1_VALIDATION_20261026.md), blob `f2a7cd2240c0abdcdb4b319d3ed53b3b87f62aa9`.

**Still in progress:** provider-backed browser/session/CSRF and authenticated API isolation, live pairing, current Mac/browser parity, remaining Stage 2–5 actions, and fresh independent end-to-end review. Foundation **NOT MET**; Stage 6 gated. No deployment or cutover. No tests/builds ran in this checkpoint.

## Latest continuation — journal-backed file-action recovery and inventory integrity — 2026-10-26 09:39 UTC


## Latest continuation — local duplicate review — 2026-10-26 09:49 UTC

Stage 3/5 now shows possible duplicate copies locally, grouping only by case-insensitive non-empty bundle identifier plus the same plug-in format. Different formats stay separate; missing bundle IDs do not create guesses. The companion displays the extra local paths for owner review and states that no files changed. This read-only slice does not sync paths or authorize deletion. Implementation commit `73846cc8158d14d01c87b20c17e2ca1d0b6f5843`, tree `44431830d9133a06633b58b29deb9042145b0aae`, parent `724012ccf6232b0917e9071f875b3fbea3f20e55`. [Evidence](../governance/evidence/PHASE_PLUGINHUB_DUPLICATE_REVIEW_20261026.md).

The complete `sh scripts/pluginhub-nonprod-check.sh` passed after this change: ad-hoc app packaging/signature; scanner 3/3; duplicate analyzer regressions; API/browser 38/38; disposable local D1 and loopback Worker; synthetic cross-account rejection; and Swift pairing, sync, Manual Check, reveal, move and restore receipts. No remote D1 or provider access, deployment or cutover occurred. Keep remote D1 validation/write hold **OPEN**, Foundation **NOT MET**, Stages 2–5 in progress and Stage 6 gated. Full independent Foundation validation, remote provider/isolation/recovery and live Mac/browser parity remain outstanding.

Stage 3/4 inventory reads now reject missing, changing or mismatched snapshot counts, and the status UI reaches the full account snapshot in 100-row pages. Stage 5 move/restore recovery now retrieves expired actions only by IDs from the local journal, and only the active paired device can receive the same claimed, owner-confirmed operation with no receipt. The companion rechecks the device credential and exact preview immediately before file changes. If saving a preview to device-only Keychain fails, its exact unconfirmed server preview is discarded; if the journal cannot be read, queue refresh stops and preserves saved previews.

The full local `sh scripts/pluginhub-nonprod-check.sh` passed after these changes: ad-hoc app packaging/signature, Swift journal/recovery, scanner 3/3, API/browser 38/38, disposable local D1/loopback Worker, synthetic cross-account rejection, and actual Swift pairing/sync/Manual Check/reveal/move/restore with signed receipts. `git diff --check` passed. Independent review accepted the final journal-read error-path fix; the reviewer did not run tests. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STATUS_AND_RECOVERY_FOLLOWUP_20261026.md).

This remains local synthetic evidence. The remote D1 validation/write hold is **OPEN**; Foundation is **NOT MET**; Stages 2–5 continue; Stage 6 remains gated. Provider-backed browser session/CSRF and pairing, remote two-account isolation/recovery, current-Mac browser parity, remaining Stage 5 paths and fresh end-to-end independent Foundation validation remain outstanding. No provider request, remote D1 access/write, deployment or cutover occurred.

## Latest Stage 2–5 verification — complete local non-production run — 2026-10-26 09:11 UTC

The 225-record synthetic snapshot now exercises two API cursor pages, navigation through record 225, later-page filtering and preference updates, page reset/clamping, and a 100-row DOM cap. `npm test` passes 38/38. The scoped independent UI review accepted the paging slice; full end-to-end Foundation review remains open. [Evidence](../governance/evidence/PHASE_PLUGINHUB_INVENTORY_PAGING_20261026.md). Implementation commit `7035a3f4e3b1a967949668f520e236dbbb2476da`; test follow-up `6bd1c770816ce1d9bf6a3d6dddc28fc7b2e2d5a4`.

The full local no-deploy script now passes with synthetic fixtures, including companion, scanner, API/browser, disposable local D1/Worker, cross-account rejection, and actual Swift pairing/sync/reveal/move/restore. [Run evidence](../governance/evidence/PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261026_0911.md). The D1 validation/write hold stays **OPEN**; Foundation **NOT MET**; Stages 2–5 continue; Stage 6 gated. No provider call, remote D1 access/write, deployment or cutover.


## Latest Stage 3/4 increment — full account inventory paging — 2026-10-26

The account preview exposes the complete account snapshot through 100-record pages. Search, format/tag filters, sorting, saved preferences, and hidden-item recovery cover every record; row controls render as pages are visited. API/browser tests pass 38/38. See [paging evidence](../governance/evidence/PHASE_PLUGINHUB_INVENTORY_PAGING_20261026.md). Source commit `7035a3f4e3b1a967949668f520e236dbbb2476da` follows previous checkpoint `3556c9149a9855f838b282bbb31bb7140e960c3e`.

The D1 validation/write hold remains **OPEN**; Foundation remains **NOT MET**; Stages 2–5 are in progress; Stage 6 is gated. Provider-backed runtime, remote isolation/recovery, real browser-to-Mac pairing/parity, remaining action coverage, and independent end-to-end review remain outstanding. No provider call, remote D1 access/write, deployment or cutover occurred.

## Previous Stage 3/4 increment — account library preference controls — 2026-10-26 08:05 UTC

The account-backed preview now has a counted **Show favourites** filter, a per-product **Pin/Unpin** control, and reversible hidden products using **Show hidden (n)** and **Unhide**. It changes account preferences only and no Mac files. Regression coverage exercises filtering, pinning and hide/show/unhide recovery. [Evidence](../governance/evidence/PHASE_PLUGINHUB_HIDDEN_PREFERENCE_RECOVERY_20261026.md).

`npm test` passed 38/38. The broader no-deploy script could not pass SwiftPM manifest planning in this sandbox (`sandbox_apply: Operation not permitted`) and stopped before tests. No provider call or remote D1 activity occurred. Foundation **NOT MET**; D1 validation/write hold **OPEN**; Stages 2–5 continue; Stage 6 gated. Local edits await GitHub reconciliation (last visible head `d705f1a51b13f0839ba8b8c5386debf2eadd4c73`).

## Latest checkpoint — Auth0 recovery case #03075407 — 2026-10-25 21:56 UTC

Auth0 Support received a private Auth0 Teams access-recovery request for team `team-uu03jsy` / tenant `dev-cxmqjc40zltqlx7l`. It asks Auth0 to verify ownership and restore access. The required affected-tenant selector only offered a different tenant; the ticket explains that selection and identifies the old tenant as the one needing recovery. Wait for Auth0's response. [Evidence](../governance/evidence/PHASE_PLUGINHUB_AUTH0_ACCESS_RECOVERY_20261025_2153.md). No project config, D1 data, or deployment changed. D1 validation/write hold **OPEN**; Foundation **NOT MET**; Stage 6 gated. GitHub publication remains blocked by DNS failure; local edits are uncommitted.

## Latest checkpoint — Auth0 callback mismatch — 2026-10-25 21:27 UTC

Existing Auth0 A/B match the active development Worker tenant/client. Auth0 rejected the saved callback before login, and the signed-in dashboard exposes only the other tenant, so the old app cannot be inspected here. No credentials were entered and D1 was untouched. Next: make `dev-cxmqjc40zltqlx7l` available in the Auth0 admin session; then verify callback and pairing scope. Keep the remote D1 validation/write hold **OPEN**. [Evidence](../governance/evidence/PHASE_PLUGINHUB_AUTH0_CALLBACK_MISMATCH_REPRODUCTION_20261025_2127.md). Foundation **NOT MET**; Stage 6 gated.

## Previous checkpoint — D1 hold and Auth0 identity state — 2026-10-25 21:25 UTC

The historical 22:47 database creation authorization is recorded as owner-confirmed; the separate 22:51 retention timestamp is unchanged. Kevin's current instruction keeps the remote D1 validation/write hold **OPEN**. No shared-D1 session, pairing or probe writes until that hold is cleared. Existing Auth0 Test Users A/B match the active Worker tenant/client; current source points to a different tenant/client. [Gate clarification](../governance/evidence/PHASE_PLUGINHUB_D1_GATE_CURRENT_HOLD_CLARIFICATION_20261025_2125.md). Foundation **NOT MET**; Stage 6 gated.

## Previous checkpoint — Auth0 identities reconciled to active Worker — 2026-10-25 21:18 UTC

Auth0 Test Users A/B already exist in 1Password for `dev-cxmqjc40zltqlx7l` and match active Worker version `47c58f05-8f9e-4600-bb76-4d6520d9ba79`. Current branch source targets `dev-4zlw1s642szi48ve`, so reconcile the source/live tenant and client before end-to-end testing. Worker health returned 200. The remote D1 validation/write hold remains **OPEN**; no authenticated D1 checks, login or deployment occurred. [Evidence](../governance/evidence/PHASE_PLUGINHUB_AUTH0_EXISTING_TEST_IDENTITIES_RUNTIME_RECONCILIATION_20261025_2118.md). Foundation **NOT MET**; Stage 6 gated.

## Previous checkpoint — 2026-10-25 20:43 UTC

The exact development D1 identity and `d1_migrations` ledger were rechecked read-only. All migrations through `0021_restore_actions.sql` are present; the query wrote zero rows. Evidence: [D1 read-only revalidation](../governance/evidence/PHASE_PLUGINHUB_D1_READONLY_REVALIDATION_20261025_2043.md). Kevin's confirmation resolved the 22:47 database-creation authorization; the 22:51 retention timestamp remains distinct.

The full local non-production suite passed at the current source tree. The suitable remote recovery check already passed on a separate temporary synthetic-only D1; the shared project D1 was not rewound. See [recovery evidence](../governance/evidence/PHASE_PLUGINHUB_D1_TIME_TRAVEL_RECOVERY_20261025.md).

Next: approve two synthetic Auth0 development test users, with generated passwords stored only in 1Password; then run remote session/CSRF, two-account isolation and pairing checks. Continue with current Mac/browser parity, remaining Stage 5 action wiring and fresh independent review. Foundation **NOT MET**; Stage 6 gated; no deployment/cutover.

## Previous checkpoint — 2026-10-25 20:36 UTC

The complete local non-production suite passed on the current published source tree `722625b8e41340b2b36fff49237ca849acd9508b`: preview/signature, installer redirect safety, scanner 3/3, API/browser 38/38, disposable local D1/Worker, synthetic account isolation, Swift pairing/sync/actions, and recovery. See [rerun evidence](../governance/evidence/PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261025_2036.md). No remote D1/Auth0 runtime check or deployment occurred.

Next: approve creation of two disposable Auth0 development test identities with random passwords stored only in 1Password, then run remote browser-session/CSRF, cross-account isolation, and pairing checks. Continue with browser-to-Mac parity, remote recovery, remaining Stage 5 action wiring, and fresh independent review. Foundation **NOT MET**; Stage 6 gated. Kevin's confirmation resolved the 22:47 database-creation authorization; preserve the separate 22:51 retention timestamp. No deployment/cutover.

## Previous checkpoint — 2026-10-25 20:28 UTC

Auth0 development callback/origin and minimum SPA API grant are saved: `http://127.0.0.1:4173/pair-remote-test.html`, `http://127.0.0.1:4173`, and user-delegated `read:library` plus `manage:devices` (2/2); Client Access remains denied. OIDC discovery and RS256 JWKS are reachable. The non-secret setup is updated in 1Password. The full local synthetic suite passed. Provider-backed runtime, two-account isolation, browser session/CSRF, pairing, live recovery and parity remain open. Foundation **NOT MET**; Stage 6 gated. See [configuration evidence](../governance/evidence/PHASE_PLUGINHUB_AUTH0_CONFIGURATION_VALIDATION_20261025.md) and `docs/HANDOVER.md`.

## Previous checkpoint — 2026-10-25 19:23 UTC

The current source checkpoint `b15076babed34bf2dab8e83b96b043cdf57ad9de` passed the full local non-production suite: preview build/signature, Swift journal/recovery, installer redirect safety, scanner 3/3, API/browser 38/38, disposable local D1/Worker, synthetic account isolation, and Swift pairing/sync/action recovery. [Evidence](../governance/evidence/PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261025_1923.md), blob `5f55aef3bb1e17484c84b565cb20f78e858673b7`.

Auth0 dashboard access is available, but the current tenant selector lists only `dev-4zlw1s642szi48ve`; the team's link dialog has no tenants available. The configured project tenant `dev-cxmqjc40zltqlx7l` and SPA client remain unavailable in this session, so the approved loopback callback was not changed. Auth0-backed runtime/isolation, browser session/CSRF, real pairing, browser-to-Mac parity, and fresh independent end-to-end review remain open. Foundation **NOT MET**; Stage 6 gated. The isolated synthetic D1 recovery passed in its separate report; no production deployment or cutover.

## Previous checkpoint — 2026-10-25 17:50 UTC

The exact project D1 is verified through the connected Cloudflare API under account `f1896a0ef4e88f1f90abcc2cbbdd87f1`; its ledger is aligned through `0021_restore_actions.sql`. The synthetic cross-account credential/device attempt was rejected and cleaned up, with aggregate counts unchanged. [Identity and isolation evidence](../governance/evidence/PHASE_PLUGINHUB_D1_IDENTITY_ISOLATION_20261025.md).

The approved recovery check passed on isolated D1 `aimm-library-recovery-probe-20261025-1746` (`e8536d00-0fb1-4752-aa82-8be6c2141d48`) using the full 0001–0021 schema and synthetic account, device, credential-hash placeholder and browser session. Deletion removed the test rows; Cloudflare restored all four from the captured time-travel bookmark. The temporary D1 was deleted and verified absent. The original project D1 retained its prior aggregate counts and full migration ledger. [Recovery evidence](../governance/evidence/PHASE_PLUGINHUB_D1_TIME_TRAVEL_RECOVERY_20261025.md), blob `6d3d3f881bc6d861744d9bd72dfbaec6074b75f3`.

The development Worker source checkpoint `16ed6039f85f9ffb81c677155f573135f218f8d0` remains deployed to `aimm-library-api-dev` (version `47c58f05-8f9e-4600-bb76-4d6520d9ba79`); live health, unauthenticated denial, canonical CORS and Auth0 discovery checks passed. Auth0-backed two-account HTTP isolation, browser session/CSRF, real pairing, browser-to-Mac parity and fresh independent end-to-end review remain open. Foundation **NOT MET**; Stage 6 gated. No production deployment or cutover.

The full local `sh scripts/pluginhub-nonprod-check.sh` passed, including preview signature/build, Swift recovery, installer transfer and redirect checks, scanner 3/3, API/browser 38/38, local D1/Worker and Swift pairing through restore. This used disposable local state; the remote D1 was not accessed by the suite.

## Previous checkpoint — 2026-10-25 17:17 UTC

The current API source from checkpoint `16ed6039f85f9ffb81c677155f573135f218f8d0` is deployed to the isolated development Worker `aimm-library-api-dev` (version `47c58f05-8f9e-4600-bb76-4d6520d9ba79`); its random action-preview key is stored in 1Password and configured as a Worker secret. Live checks passed for health (200), unauthenticated `/v1/me` denial (401), the canonical-site CORS preflight (204), and Auth0 OIDC discovery (200). [Evidence](../governance/evidence/PHASE_PLUGINHUB_DEV_WORKER_DEPLOYMENT_HTTP_20261025.md), blob `b74a37f126948eafd73b4cb92a73029e78491bf6`.

The existing active Cloudflare token cannot read the exact project D1 (`10000` Authentication error); token-metadata read was also denied (`9109`). No remote D1 query/write occurred. Remote Auth0 user login, authenticated cross-account rejection, browser session/CSRF, live pairing/recovery and fresh independent end-to-end review remain open. Foundation remains **NOT MET**; Stage 6 remains gated. Keep the resolved 22:47 authorization and separate 22:51 retention timestamp intact.

## Latest checkpoint — 2026-10-25 14:46 UTC

Remote development D1 `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`) in account `f1896a0ef4e88f1f90abcc2cbbdd87f1` is aligned through migration 0021; the approved 0010–0021 migrations were applied sequentially and the ledger re-read successfully. Pre-write aggregates were operations 0, operation items 0, marks 0, accounts 2, devices 4. Cloudflare denied `PRAGMA integrity_check` with `SQLITE_AUTH`; no export was attempted. [Evidence](../governance/evidence/PHASE_PLUGINHUB_D1_MIGRATIONS_0010_0021_20261025.md).

The full local non-production suite passed (API/browser 38/38, scanner 3/3, local Worker/D1, Swift pairing/sync/reveal/move/restore, installer safety). Read-only calls to the existing deployed Worker returned `/health` 200 and unauthenticated `/v1/me` 401; Auth0 discovery returned 200. Current source has not been deployed. Wrangler is logged into the wrong Cloudflare account; target-account authentication failed, and automatic review rejected a broad persistent Wrangler login. Worker secret `ACTION_PREVIEW_ENCRYPTION_KEY` is absent and 1Password CLI is not signed in. No Auth0 login, authenticated route isolation, browser session/CSRF, live pairing, recovery, or fresh independent review occurred.

Foundation remains **NOT MET**; Stage 6 remains gated. Keep the resolved 22:47 owner-confirmation gate and separate 22:51 retention timestamp intact. No deployment or cutover.

## Latest checkpoint — 2026-10-25 14:42 UTC

The exact development D1 `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`) in Cloudflare account `f1896a0ef4e88f1f90abcc2cbbdd87f1` is now aligned through source migration 0021. Migrations 0010–0021 were applied in order after the latest explicit approval; a follow-up ledger read returned all 21 migration names. Aggregate pre-write counts were operations 0, operation items 0, library marks 0, accounts 2 and devices 4. Cloudflare denied `PRAGMA integrity_check` with `SQLITE_AUTH`; no export or broader permission attempt was made. [Migration evidence](../governance/evidence/PHASE_PLUGINHUB_D1_MIGRATIONS_0010_0021_20261025.md).

The full `sh scripts/pluginhub-nonprod-check.sh` passed: preview signing, Swift/journal and recovery, installer staging and redirect rejection, scanner 3/3, API/browser 38/38, local D1/Worker, synthetic two-account rejection, and Swift pairing/sync/reveal/move/restore. These are local synthetic results. The dev Worker has no `ACTION_PREVIEW_ENCRYPTION_KEY`; its protected exact-path preview function cannot work until the secret is securely configured. Wrangler authentication is expired, 1Password CLI cannot connect to the desktop app, and shell DNS cannot resolve the dev Worker hostname, so no deploy or live HTTP check occurred. No Auth0 user creation, live recovery, or independent review occurred.

Foundation remains **NOT MET**; Stage 6 remains gated. Open gates: secure storage and configuration of the Worker encryption key, deployed and reachable Auth0-backed runtime, authenticated remote account-isolation check, browser session/CSRF and real pairing, live non-production recovery, and fresh independent end-to-end review. The 22:47 owner-confirmation gate remains resolved; preserve the separate 22:51 retention approval. No deployment or cutover.

## Latest verified checkpoint — 2026-10-25 13:43 UTC

The full local Stage 2–5 non-production suite passes on branch source `a0cf4ecc262a5495959ddc41eb4bcccd38dd7cda`, including descriptor-anchored installer staging, actual hostile redirect rejection, scanner 3/3, API/browser 38/38, local synthetic account isolation, pairing/sync and move/restore recovery. [Evidence](../governance/evidence/PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261025_1340.md).

The project D1 exists under the correct Cloudflare account. Migrations 0001–0009 are deployed; 0003 is already applied. Current source is through 0021, so remote D1 is behind source. The prior bounded remote migration authorization named only 0003; that migration is complete and no later migration will be applied without a fresh scope decision. A fresh independent review is **PARTIAL**.

The 22:47 owner-confirmation gate is resolved; preserve the 22:47 creation / 22:51 retention chronology. Foundation remains **NOT MET**, Stage 6 gated. Remote Auth0-backed runtime, authenticated account isolation, real pairing/session/CSRF, live recovery, parity and outstanding Stages 2–5 remain open. No deployment/cutover. [D1 evidence](../governance/evidence/PHASE_PLUGINHUB_D1_ACCOUNT_RUNTIME_VALIDATION_20261025.md) · [Review](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REVIEW_20261025.md).

---

## Latest verified checkpoint — 2026-10-25 13:40 UTC

The exact Foundation dev database `aimm-library-foundation-dev` is verified under Cloudflare account `f1896a0ef4e88f1f90abcc2cbbdd87f1`. Migrations 0001–0009 are present; 0003 required no write. The synthetic cross-account D1 constraint probe was rejected as expected and left no matching rows. The prior wrong-account 7404 is superseded. The 22:47 creation gate is owner-confirmed/resolved; retain the separate 22:51 retention timestamp.

Recovery evidence currently covers synthetic export-to-SQLite only, not live D1 restore. Auth0-backed runtime and authenticated two-account isolation, browser session/CSRF, device pairing, live recovery, outstanding Stages 2–5 and fresh independent review remain gates. Foundation **NOT MET**; Stage 6 gated. No deploy/cutover. [Validation report](../governance/evidence/PHASE_PLUGINHUB_D1_ACCOUNT_RUNTIME_VALIDATION_20261025.md).

---

## Latest checkpoint — 2026-10-25

Wrangler OAuth is available, but the exact configured non-production D1 database could not be found under the authenticated account: the account D1 list was empty and `wrangler d1 info` returned error 7404 for ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. No migration or synthetic remote checks were run. Keep the 22:47 authorization chronology gate **OPEN** pending owner review; Foundation remains **NOT MET**, and Stage 6 remains gated. Do not create a replacement database or change the binding based on this result alone. [Evidence](../governance/evidence/PHASE_PLUGINHUB_D1_DATABASE_IDENTITY_BLOCKED_20261025.md).

## Previous checkpoint — 2026-10-25 13:09 UTC

Repository `begb0037admin/aimm`, branch `codex/pluginhub-foundation`; latest branch head `27d3b41069d355ab611802156c1d47f83763f7e7` is published to GitHub. The local verification passed at source checkpoint `59cc9db06d179fa501526e4d7f8ce4665e58cf6b`; see [report](../governance/evidence/PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261025.md), blob `ef5445ed311eb834debee1c0447fea7708f882b0`.

Remote D1 validation remains authorized but not executed. Wrangler login requests broad persistent Cloudflare access (D1 writes, Workers/Pages writes and deployments, secrets, and other services), and elevated login was rejected by automatic review as exceeding the named-database validation scope. The ordinary login attempt also hit sandbox `EPERM` on the local OAuth callback. No consent was granted, no credential was created, and no remote D1 query/write occurred. See [authentication scope checkpoint](../governance/evidence/PHASE_PLUGINHUB_CLOUDFLARE_AUTH_SCOPE_BLOCK_20261025.md), blob `698dd877b242a260b37db7d548620c14e67a1e84`. To continue with Wrangler, Kevin must explicitly approve those broad persistent scopes; otherwise a verified least-privilege D1 auth path is needed.

The 22:47 database-creation authorization is resolved. The separate bounded validation of `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`) is authorized: verify identity and migration state, apply 0003 only if required, use synthetic two-account isolation data, and verify recovery through a suitable non-production path. Foundation remains **NOT MET**; Stages 2–5 partial/in progress; Stage 6 gated. No deployment/cutover or production data.

---

## Latest Stage 2–5 continuation — 2026-10-25 11:24 UTC

Source: `begb0037admin/aimm`, branch `codex/pluginhub-foundation`; implementation commit `fd081bb1f956a1e3d98d759dddfd77a48841cd70`, evidence commit `50c2a42129ebb78df2fa079d56182ae2fa5c0367`.

Added deterministic Stage 5 recovery coverage for interruption after a cross-volume restore has copied to staging. The fixture confirms the Unused source and staging copy survive interruption, then verifies the staged copy before completing restore. `swift build`, `swift run aimm-journal-check`, and the full `sh scripts/pluginhub-nonprod-check.sh` passed; API/browser 38/38, scanner 3/3, local D1 through 0021, and the synthetic Worker/Swift flows passed. [Evidence report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_INTERRUPTED_CROSS_VOLUME_RESTORE_20261025.md), blob `b3c613bcacc905c5c68f8e2be3785fe0f1981951`.

Foundation remains **NOT MET** and Stage 6 remains gated. Real Auth0/passkey runtime and pairing, remote two-account isolation and recovery, live browser-to-Mac parity, remaining Stage 5 actions, Developer ID distribution, and fresh end-to-end independent validation remain open. Keep the 22:47 D1 authorization gate open. No deployment/cutover or remote D1 access/write.


Independent read-only review **ACCEPTED** the interrupted cross-volume recovery fixture and synchronized evidence pins only; the reviewer ran no tests or remote checks. [Review report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_INTERRUPTED_RESTORE_INDEPENDENT_REVIEW_20261025.md), commit `8695988a77e3e4cec32a6bd02ac21c52cc4484fa`, blob `d968756f996036b9cb427d26a7efe6b92d444ecb`. This is not full Stage 5 or Foundation acceptance.
---

## Latest Stage 2–5 continuation — 2026-10-25 11:13 UTC

Source: `begb0037admin/aimm`, branch `codex/pluginhub-foundation`, commit `b4906aeff63fb099fbf26d18709ed83bf0897e52`.

The restore path-alias fixture now exercises distinct `/tmp` and `/private/tmp` spellings; directory validation rejects symlinked ancestors; the local check owns a unique temporary fixture. A patched `undici` dependency removes the Wrangler audit findings. Local non-production checks pass (API/browser 38/38, scanner 3/3, local D1 migrations through 0021, account-isolation probe, Swift move/restore, and mounted APFS recovery). The targeted independent code review accepted the corrections.

Foundation remains **NOT MET** and Stage 6 remains gated. Real Auth0/passkey runtime and pairing, remote two-account isolation and recovery, live browser-to-Mac parity, remaining Stage 5 actions, Developer ID distribution, and fresh end-to-end independent validation remain open. Keep the 22:47 D1 authorization gate open. No deployment/cutover or remote D1 access/write.

[Evidence report](../governance/evidence/PHASE_PLUGINHUB_STAGE2_5_PATH_SAFETY_AND_LOCAL_CHECKS_20261025.md).

---

## Stage 5 mounted cross-volume recovery — 2026-10-25

The disposable APFS test passed across distinct filesystem devices 16777233 → 16777239. The companion verified the staged copy before removing the synthetic source, restored the synthetic item, and passed recovery fixtures; the image was detached and removed. This is local synthetic-file evidence only. [Evidence report] (../governance/evidence/PHASE_PLUGINHUB_STAGE5_MOUNTED_CROSS_VOLUME_20261025.md), blob `09972b7ec36681d88d070e06650bb0022198749a`.

This does not prove real backup recovery, remote isolation, or complete Stage 5 coverage. Foundation **NOT MET**; Stage 6 gated; 22:47 D1 gate open.

---

## Stage 4 live vendor adapter checks — 2026-10-25

The opt-in live status check parsed FabFilter 14, Voxengo 46, u-he 3, and Valhalla DSP 4 supported versions. The live FabFilter Pro-Q 4 route resolved version 4.13 to the adapter's allowlisted official macOS DMG URL. No installer was downloaded/opened; no remote project D1 or Auth0 was accessed. [Evidence report] (../governance/evidence/PHASE_PLUGINHUB_STAGE4_LIVE_VENDOR_CHECKS_20261025.md), blob `5ba0ca13394f4376da7f744f76d4c8c054529eda`.

This proves only current public-page parsing for those adapters and one route. 31-row parity, trusted download verification, install execution/verification, Auth0 runtime, remote isolation/recovery, browser-to-Mac parity, and Stage 5 coverage remain open. Foundation **NOT MET**; Stage 6 gated; 22:47 D1 gate open.

---

## Persistent local Stage 5 companion preview — 2026-10-25

Built an arm64, ad-hoc-signed preview at `/Users/admin/aimm-pluginhub-preview-2026-10-25-stage5-local-e2e/AIMM Companion Preview.app` from source commit `946ad71df470bf3d4c5ada00de5d9a7ab9ff3f15`. Executable SHA-256: `5496bbd4946211d6331469ef64619d50ef322010f29b49d7d326f68a301e3ff6`. Strict signature and Info.plist checks passed; no Team ID. It was not launched, notarized, scanned, or deployed. [Build report] (../governance/evidence/PHASE_PLUGINHUB_STAGE2_PERSISTENT_LOCAL_PREVIEW_STAGE5_20261025.md), blob `bce4ccef8cf5368c6e2cb56a92a78174bbf78337`. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open. No deploy.

---

## Stage 2 local Worker two-account credential probe — 2026-10-25

Two synthetic accounts were seeded in disposable local D1. The local Worker rejected each account's device bearer token when it was used against the other account's device identity (HTTP 401 in both directions). The complete local suite also passed: Swift build/journal, scanner 3/3, API/browser 38/38, D1 through 0021, Worker auth/CORS, pairing, sync, Manual Check, reveal receipt, and linked move/restore with signed receipts.

This is local synthetic credential-isolation evidence only. It is not a remote two-account check, Auth0-backed browser identity, or remote backup recovery. Move/restore fixture owner confirmation was inserted directly into disposable D1; no browser passkey ceremony occurred. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open. No remote D1, deployment or cutover.

Source commit: `946ad71df470bf3d4c5ada00de5d9a7ab9ff3f15`. [Evidence report] (../governance/evidence/PHASE_PLUGINHUB_STAGE2_LOCAL_WORKER_ACCOUNT_ISOLATION_20261025.md), blob `4484e7ecd3afce139e8c4a1b12ca9b9fefea8c5d`.

---

## Stage 5 local move-and-restore integration — 2026-10-25

The actual Swift companion client completed a linked synthetic move-to-Unused and restore through local Worker and disposable D1: signed previews, journaled filesystem actions, complete resync after each action, and signed receipts. The final restore receipt was accepted and D1 showed `completed`. Full local suite passed: ad-hoc app signature, Swift build/journal/recovery, scanner 3/3, API/browser 38/38, D1 migrations through 0021, Worker health/auth/CORS, pairing, sync, Manual Check, reveal, move and restore.

The fixture wrote owner-confirmation timestamps directly into disposable D1, bound to the exact action and preview digests. This is not a real passkey ceremony or Auth0 runtime check. All file work used one synthetic bundle cleaned by the test trap. Remote provider runtime, two-account isolation, remote backup recovery, live browser-to-Mac parity, broader Stage 5 actions, Developer ID distribution and fresh independent end-to-end review remain open. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open. No remote D1, deployment or cutover.

Source commit: `d49682b593dac7be1a18a130c8572d3a9a51826a`. Report: [Stage 5 local move-and-restore integration] (../governance/evidence/PHASE_PLUGINHUB_STAGE5_LOCAL_MOVE_RESTORE_E2E_20261025.md), blob `54780f94178a07dc350e9fd198badf066d1f6103`.

---

## Stage 5 local Worker/Swift restore integration — 2026-10-25

The actual Swift companion HTTP client completed a synthetic restore through a local Worker and disposable local D1: parent-bound preview, local filesystem restore, complete post-restore inventory sync, and signed parent-bound receipt. Final local D1 state was `completed`. `sh scripts/pluginhub-nonprod-check.sh` passed: app packaging/signature, Swift build and journal/recovery, scanner 3/3, API/browser 38/38, D1 migrations through 0021, Worker health/auth/CORS, pairing, sync, Manual Check, reveal receipt, and restore receipt.

The fixture directly inserted the matching owner-confirmation timestamp in disposable local D1; it did not perform browser passkey confirmation or live Auth0. This is local synthetic integration evidence only. Remote provider runtime, two-account isolation, remote backup recovery, live browser-to-Mac parity, remaining Stage 5 action classes, Developer ID distribution, and fresh independent end-to-end review remain open. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open. No remote D1 access/write, deployment, or cutover.

Source commit: `8541c4a57d59c1576a3adfa5abe5fdf0e8e0e18c`. Report: [Stage 5 local Worker/Swift restore integration] (../governance/evidence/PHASE_PLUGINHUB_STAGE5_LOCAL_WORKER_SWIFT_RESTORE_E2E_20261025.md), blob `0bfcc9d9263d3c7e0074db73bd22716c042321a6`.

---

## Latest PluginHub Stage 5 restore wiring — 2026-10-25

The account preview now lists verified completed moves to Unused without exposing paths and can queue a restore tied to the exact move. The paired Mac loads the historical record from its journal, checks that the current scan no longer contains it, prepares a signed parent-bound preview, and restores only after owner passkey confirmation plus a local button. The Mac then verifies and syncs a complete rescan before sending its signed receipt. Full local non-production verification passed (API/browser 38/38; scanner 3/3; Swift build/journal/recovery; local D1 migrations through 0021; isolated Worker and local pairing/sync/action checks). The local restore executor and API/browser fixtures pass separately; restore has not yet been exercised end-to-end through the local Worker and Swift HTTP client, and the app UI was not launched.

[Evidence and source pins](../governance/evidence/PHASE_PLUGINHUB_STAGE5_RESTORE_API_COMPANION_20261025.md) (source commit `42aae59be235d1024c9265817b443cf8605eabea`, report blob `d773f3c3462bc3f066408cb4cd52915d95d68a77`). Foundation remains **NOT MET**; Stages 2–5 remain partial; Stage 6 gated; 22:47 remote D1 gate open. Real Auth0 pairing/provider runtime, remote account isolation/recovery, live browser-to-Mac validation, remaining Stage 5 action classes, and fresh independent end-to-end review remain open. No remote D1 access/write, deployment, or cutover.

---

> **Stage 5 restore after post-move scan — 2026-10-25:** Fixed restore binding so a completed journaled move can be restored using a distinct later complete scan generation, while preserving checks for the exact parent move, item, source/destination and tree digest. Regression fixture and full local suite pass (API/browser 38/38; scanner 3/3; local D1 through 0020; isolated Worker and Swift sync/journal checks). This is local evidence only; restore is still not wired through API/browser/UI and remote isolation/recovery remain open. [Report](governance/evidence/PHASE_PLUGINHUB_STAGE5_RESTORE_POST_MOVE_GENERATION_20261025.md), code commit 691bc462ca6a61a12fcce50ab59fea73405cd259, report blob 435be9ddb194feef9b987f11668bb91ce45fcca5. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open; no deployment/cutover.

> **Persistent local companion preview — 2026-10-25:** Built from reviewed source `460141a65a58238daa2c2ac7780dd62c21597838` at `/Users/admin/aimm-pluginhub-preview-2026-10-25-restore-460141/AIMM Companion Preview.app`. Executable SHA-256 `90b9c5dcf18ba352a7807be1df8590399247d6fd40545064344660e6d1f958d4`; strict ad-hoc signature verification passed; no Team ID. For local hands-on testing only, not Developer ID distribution. No scan, provider change, remote D1, or deployment. [Build evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE2_PERSISTENT_PREVIEW_BUILD_20261025.md), commit `3ec6647a88b5954fa11e1bc1d76c3fc56fd9a119`, blob `65a7bc1fea0abe3f8316739309ce94a114d9030d`. Foundation **NOT MET**; 22:47 D1 gate open.

> **Stage 5 restore review records synchronised — 2026-10-25:** Corrected implementation and checker pins are executor `9a11c0004d91e512807376cb9a0b14b6e00cdf14` and test `0b64fc746e51ae302d98bb870a779be52125d8a4`. Fresh independent read-only review accepted the local slice after the crash-marker and symlink-recovery fixes; reviewer ran no tests. Full local suite and mounted APFS check passed. Report commit `dc629652ea998631abe83a3414edc2919fb032b9`, blob `dd4fc5f33834863667e9c260d7a5b349bc976274`; independent review commit `d26354130b689eed364f62838f2405632318e8f0`, blob `732859851fe6a266486a344d2895fb3c076caf85`. Not an end-to-end restore flow or Foundation gate closure. Foundation **NOT MET**, Stage 6 gated; 22:47 D1 gate open; no remote D1 write/deploy/cutover.

> **Independent Stage 5 restore-slice review — 2026-10-25:** Fresh read-only review accepted the local journal/executor slice after fixes for crash-resume verification and symlink-swapped Unused-directory recovery. Reviewer ran no tests; the full non-production suite and mounted APFS check passed locally. This code is not exposed in the browser/API/UI and does not complete Stage 5. [Review report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_RESTORE_INDEPENDENT_REVIEW_20261025.md); reviewed source commit `460141a65a58238daa2c2ac7780dd62c21597838`, report commit `d26354130b689eed364f62838f2405632318e8f0`, blob `732859851fe6a266486a344d2895fb3c076caf85`. Corrected source: executor `9a11c0004d91e512807376cb9a0b14b6e00cdf14`; checker `0b64fc746e51ae302d98bb870a779be52125d8a4`. Foundation **NOT MET**; Stages 2–5 partial/in progress; Stage 6 gated; 22:47 D1 gate open; no remote D1 write/deploy/cutover.

> **Stage 5 journaled restore and mounted cross-volume recovery — 2026-10-25:** Added a local SQLite restore journal and executor bound to an exact verified move-to-Unused record, plus restore/replay, duplicate-restore rejection and recovery fixtures. The disposable APFS mounted-volume check passed with distinct filesystem device IDs `16777233` → `16777239`, exercising the verified staged-copy move and restore; the test image was detached and removed. Full non-production suite also passed: API/browser 38/38, scanner 3/3, companion build/signature, journal/recovery, local D1 through 0020, isolated Worker, pairing/sync, Manual Check and signed preview/receipt. This remains local synthetic-file evidence only. The restore code is not exposed in the API/browser/companion UI; remote backup recovery and real-user action flows are unproven. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_JOURNALED_RESTORE_20261025.md), source commit `ecd12160d987cb878a96a83a1cb24d5dc2f606c0`; latest report commit `1856129d4912d529827853b5eb95d647920f7744`, blob `5dd9e0606898998d6bc7028bd2be41c0502492aa`. Source blobs: ScanJournal `37b0e86816390689d43bfeda3831f957cd4e4ea4`, restore executor `30122d3f0d90da366907535e24bf3be60e634770`, test `88ef89c49f28616905f4737161eb620568e9be90`. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open; no remote D1 write/deploy/cutover.

> **Stage 5 journaled local restore slice — 2026-10-25:** Added a separate local SQLite restore journal and executor bound to the exact previously verified move, source/destination paths and tree digest. Same-volume and simulated cross-volume restore/replay, duplicate-restore rejection and existing recovery fixtures pass. This is not exposed in the browser/API/UI and is not complete Stage 5 or Foundation evidence. The full non-production suite passed: API/browser 38/38; scanner 3/3; companion build/signature, journal/recovery, local D1 through 0020, isolated Worker, pairing/sync, Manual Check and signed preview/receipt. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_JOURNALED_RESTORE_20261025.md), source/report commit `ecd12160d987cb878a96a83a1cb24d5dc2f606c0`, report blob `197d462bd40e3a527ad98eff1be19c2179d6a2f2`. Source blobs: ScanJournal `37b0e86816390689d43bfeda3831f957cd4e4ea4`; restore executor `30122d3f0d90da366907535e24bf3be60e634770`; journal fixtures `88ef89c49f28616905f4737161eb620568e9be90`. Remote Auth0 pairing, account isolation/recovery, live browser-to-Mac parity, other Stage 5 actions and fresh independent review remain open. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated; 22:47 D1 gate open; no remote D1 write/deployment/cutover.

> **Live Mac scan and local non-production revalidation — 2026-10-25:** The companion scanned two standard folders locally: AU 538, VST2 563, VST3 538 and CLAP 2 (1,641 format entries); its UI confirmed nothing was uploaded. The full local suite passed: API/browser 38/38, scanner 3/3, Swift/journal and cross-volume recovery fixtures, local D1 migrations through 0020, isolated Worker auth/CORS, pairing/sync, Manual Check, signed preview/receipt. The local vendor checks require pairing, so no live vendor check occurred. This adds local Stage 2/3 evidence only. Real Auth0 pairing, remote two-account isolation/recovery, browser-to-Mac/Hope parity, Developer ID distribution, broader Stage 5 action classes, and fresh independent end-to-end validation remain open. Foundation **NOT MET**; Stages 2–5 **PARTIAL**; Stage 6 gated; 22:47 D1 gate open; no deployment/cutover. [Evidence report](../governance/evidence/PHASE_PLUGINHUB_STAGES2_5_LIVE_MAC_SCAN_20261025.md), report commit `fc16fdb85b45493099961adc1923cbbbb3aeaae4`, blob `b97a4f65be1cb20d7f1ca3a88c5d136e73ef6b65`.

> **Independent Stages 2–5 review — 2026-10-25:** Overall result: **PARTIAL**. Foundation remains **NOT MET**; Stage 6 remains gated. Open evidence: real Auth0 pairing and Developer ID distribution, remote two-account isolation/recovery, live browser-to-Mac parity, broader Stage 5 action coverage, and fresh end-to-end validation. The architecture status now correctly says approved design with partial non-production implementation. [Review](../governance/evidence/PHASE_PLUGINHUB_STAGES2_5_INDEPENDENT_REVIEW_20261025.md), commit `28be9c5a73bea8c2a6fc8f4b3b2b664a25267dfb`, blob `d57e4c6984badb29cc4fbd609ef920103c7c8c70`. Architecture blob `e152289abb3a235b85153e46cd94f8bcfbb5c094`. 22:47 D1 gate open; no deployment/cutover.

> **Stage 3 device selection validation — 2026-10-25:** Account inventory/status reads reject malformed selected-device IDs before API access, including misplaced dashes and trailing newlines; valid UUIDs are normalised to lowercase. Focused tests passed 6/6 and full local non-production suite passed (API/browser 38/38, scanner 3/3, local D1 through 0020, isolated Worker, Swift/journal, pairing/sync, Manual Check and signed receipt). Independent narrow code review accepted source commit `0fad9dbb2c016545a0611736d8cdc01d6f1d5e78`. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE3_DEVICE_SELECTION_VALIDATION_20261025.md), report commit `aa47195f0b14f02503b09656233644c9407201be`, blob `b44148c6e3d58f3d96e8e7717adc143276c19148`. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated; 22:47 D1 gate open; no deployment/cutover.

> **Stage 2 Auth0 callback check — 2026-10-25:** With the page pointed only at local Worker port 8787, Auth0 rejected exact callback http://127.0.0.1:4173/pair-remote-test.html as not allowlisted. No login occurred, no account data reached the Worker, and no Auth0 settings were changed. Changing that callback allowlist is the only action needed to unblock the real walkthrough. [Evidence report](../governance/evidence/PHASE_PLUGINHUB_STAGE2_LOCAL_PAIRING_HARNESS_20261025.md), commit b38d65a816860a2f2560958b57c981e972093e82, blob cc291597e362dd7a1826ece8a841beb5f305994e. Full local suite passed (API/browser 38/38, scanner 3/3, companion/journal and local D1/Worker). Foundation NOT MET; Stages 2–5 in progress; Stage 6 gated; 22:47 D1 gate open; no deploy/cutover.

> **Stage 2 local pairing harness — 2026-10-25:** Added a loopback-only Auth0 pairing/isolation test page with API fixed to disposable local Worker 127.0.0.1:8787; it cannot call the port 4174 proxy. Full non-production suite passed: API/browser 38/38, scanner 3/3, companion/journal, local D1/Worker, pairing, sync, Manual Check, signed preview and receipt. No real Auth0 login/pairing completed; no remote D1 access/write. Evidence report commit 37254b2657bf310b1f92bc0a20239d492ecd1a3c, blob 4cd00eda9b4a17e1d91cacae54b9707f12807ebb; harness blob aa2417c854d98330f41cae3e40e83feadd17583e; test blob 05e69f1596ad9508c1f2ae741d0736787677481a. Foundation NOT MET; Stages 2–5 in progress; Stage 6 gated; 22:47 D1 gate open. No deploy/cutover.

> **Stage 2 runtime check — 2026-10-25:** Launched the exact local ad-hoc-signed preview; first-run UI confirms no automatic scan or pairing. Auth0 rejected the local `127.0.0.1:4317` callback as not allowlisted. No Auth0 settings or remote D1 were changed. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE2_ADHOC_SIGNED_BUILD_20261025.md), report commit `61db821c3a1c9d0a637976a70ddce73729d41721`, blob `7baf85214afc8c69be24824901be086505a6ee43`. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated; keep 22:47 D1 gate open.

> **Latest Stage 2 local build checkpoint — 2026-10-25:** The companion packager now creates and verifies an ad-hoc-signed local preview; artifact: `/Users/admin/aimm-pluginhub-preview-2026-10-25/AIMM Companion Preview.app`. Full non-production checks passed. This is not Developer ID signing/notarization or a distribution artifact. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE2_ADHOC_SIGNED_BUILD_20261025.md), commit `9020e59a53ce32fc80c434a8e4f23ebcc9774fe8`, blob `9d967c72dab77f79f0c6d42573057bda6c0a8a12`. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated; 22:47 D1 gate open; no deploy/cutover.

> **Latest Stage 4 version-bound mark checkpoint — 2026-10-25:** Migration 0020 and the account UI now bind “Mark this version up to date” to the exact current successful vendor version; a newer version reactivates the update. Local non-production checks passed (API/browser 34/34, scanner 3/3, Swift/journal, local D1/Worker through 0020). [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE4_VERSION_BOUND_MARKS_20261025.md), report commit `93aea86786ecdd38099d798aff7253661c76508a`, blob `c6bb3b4560ca3b1abdc32fa2fc6c520ce22de1bd`. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated; 22:47 D1 gate open; no deployment/cutover.\n\n> **Latest Stage 4 preference checkpoint — 2026-10-25:** Added revision-checked snooze reason/expiry to marks and the status summary, with account UI controls to snooze for one week, see the saved reason/expiry, and clear the snooze. Migration 0019 preserves existing marks. Full local check passed: API/browser 34/34, scanner 3/3, Swift and local D1/Worker through 0019. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE4_SNOOZE_REASON_20261025.md), commit `ab2e9c8882c175dfde338bf6624924ab0388b677`, blob `3776c220ee2a0eca50dfb1a78492383750b8f709`. Tested source `ef99a140b9585a50b7eddf57709d75daf4d6ef1c`. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated.

> **Latest Stage 5 mounted recovery verification — 2026-10-25:** The verified copy fallback passed on a disposable mounted APFS image with distinct source/destination device IDs. Content and journal verification completed before source removal. The API success receipt path also passed with synthetic local owner-confirmation state. Full local check passed: API/browser 34/34, scanner 3/3, Swift/journal and Worker/D1 integration. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_CROSS_VOLUME_RECOVERY_20261025.md), commit `b57f8df07c7b9c9e21511a9bd99ead85783de996`, blob `7b1e0d13ec473fe214ca9498f22362cc5d64ca76`. Tested source `fd638d4611421ccfd7309b42d17142bb3900577a`. Synthetic files only; no real passkey event. Foundation **NOT MET**; Stage 6 gated.

> **Latest move-receipt check — 2026-10-25:** Added API coverage for accepting a signed move success receipt only after owner confirmation, exact-preview digest binding, verified destination/source-removal evidence, and a complete synced generation excluding the item. The local fixture sets the confirmation timestamp directly and does not exercise WebAuthn. Full local suite passed: API/browser 34/34, scanner 3/3, Swift/journal and isolated Worker/D1 checks. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_CROSS_VOLUME_RECOVERY_20261025.md), report commit `c35d2d9c83c1bcdd16cddb5426c90adf20578b8f`, blob `2e83020f50655596610a3536da80fb48824d36db`. Tested source `a3d95b3a536be632a66a075743a52763574e796f`. Synthetic confirmation fixture only; no real passkey event. Foundation **NOT MET**; Stage 6 gated.

> **Latest Stage 5 recovery checkpoint — 2026-10-25:** Added a deterministic `EXDEV` fixture for the staged cross-volume move fallback. It confirms destination verification and journaling precede source removal. The full local non-production check passed (API/browser 34/34; scanner 3/3; Swift companion/journal and Worker/D1 integration). This simulates the cross-volume error and does not substitute for a second mounted filesystem or a real Mac action. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_CROSS_VOLUME_RECOVERY_20261025.md), report commit `ad482fba5e2c237e47893f2477dba2b573b191f6`, blob `781ef1a4786e53c0c762312dd01fa96906d876b1`. Tested source `e76f4c8a8d31250ef348b762a441490d2d3f16ae`. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated.

> **Latest verified checkpoint — 2026-10-25:** Stage 5 now includes a one-item move-to-Unused request, exact signed source/destination/tree preview, owner passkey gate, journaled local move/recovery, and a synced complete rescan before success receipt. Full local check passed: API/browser 34/34, scanner 3/3, Swift/journal, local D1 migrations through 0018 and isolated Worker pairing/sync. Synthetic files only; no real Auth0/passkey walkthrough or user file move. Source head `23c3cc3391202788d350b5da865142ed4d490b10`. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_MOVE_TO_UNUSED_20261025.md), report commit `8bf8057575c9463df02b266e659d490da695a44f`, blob `5154a105c90eb85211012fbe6542e6d5e14ef136`. Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated. No remote D1 write, deployment or cutover.

> **Latest verified checkpoint — 2026-10-25: after the Swift companion submits its signed exact preview, the account UI now offers a passkey-gated “View exact path” flow using the one-use capability. Browser UI/API tests and the full local suite passed (API/browser 34/34; scanner 3/3; Swift/journal and Worker/D1 pairing, sync, signed preview and receipt). Tested source checkpoint e41e8b12cf573f311a1198310b76859195c962fb. Real passkey/account walkthrough and Mac authorization revalidation remain open. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit f4ef278b89370bfd546ca9be584d59d361e9a320, blob 60fb6f9865a786e596649f0df36f98a3add8b4a1).**

> **Latest verified checkpoint — 2026-10-25: the Swift companion now signs and submits its exact local action preview; the local Worker verified it and stored the path payload encrypted in D1. Session-bound one-use owner preview access is also implemented at the API layer. Full local checks passed: API/browser 33/33, scanner 3/3, Swift/journal, Worker/D1, pairing, sync, Manual Check, signed preview and receipt. Tested source checkpoint 326fd668ae3b78623ea25a66c0a2e1c66e478fd4. Real passkey/UI walkthrough and device-side revalidation before action remain open. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit 7efbbb7c5f7db79f1245fc01d7cb3a2d0316f1c5, blob fce7d85deb79a05e746b3920334a9f208556378b).**

> **Latest verified checkpoint — 2026-10-25: the local API now verifies a paired-device signature, encrypts the exact preview, and offers a WebAuthn-gated, session-bound, one-use path capability. Focused capability/session tests and the full non-production suite passed (API/browser 33/33; scanner 3/3; Swift/journal and local Worker/D1 integration). Tested source checkpoint be6ac59915b428d15edcdac8cb0d7cb094582d37. A real authenticator and companion/UI integration have not yet been exercised. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit b8b5870a87b204e6be32184818c61aa6c3e9f79b, blob acea46bc2508667881e7543abacb1811bbf28ec6).**

> **Latest verified checkpoint — 2026-10-25: the Worker verified a device-signed exact preview, checked it against the current operation and inventory, derived its digest, and stored the canonical path payload encrypted in short-lived local D1. The focused test and full non-production suite passed (API/browser 33/33; scanner 3/3; Swift/journal and local Worker/D1 integration). Tested source checkpoint cea877952d6c3765e58db4376aa0044d83c748f1. Owner preview unlock/retrieval/confirmation and companion revalidation remain unfinished. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit d5bb28f7ac707e22b6f0a068d2147be9d5244149, blob c80f95e482b45a9c8070a8f8ebf1411407a1842b).**

> **Latest verified checkpoint — 2026-10-25: exact-preview WebAuthn challenge binding passed the focused test and full local non-production suite (API/browser 33/33; scanner 3/3; Swift/journal and isolated Worker/D1 pairing/sync/receipt checks passed). Tested source checkpoint 8c6da696b8e030e9f301385046159f2802ef5a7f. This only binds a passkey challenge to an unlocked operation/digest; signed preview, encrypted path payload, one-use capability and end-to-end device authorization are still unfinished. Stages 2–5 remain in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit 47c01bfee1564568787816d68dba4ba70fa052fd, blob 13e0cf81df9ca2e2668c785b08e45fb32afaea40).**

> **Latest verified checkpoint — 2026-10-25 08:01 UTC:** live checks parsed public versions for four vendor adapters: FabFilter (14 products), Voxengo (46), u-he (3), and Valhalla DSP (4). The full offline non-production suite passed on source head `3a1034526716b981634ff15523a30874f2e90a2e`: Swift companion/journal, scanner 3/3, API/browser 30/30, isolated Worker/D1, pairing, sync, Manual Check and signed synthetic receipt. No account data was sent to vendor pages; no installers were downloaded. Stages 2–5 remain in progress; Foundation **NOT MET**; Stage 6 gated. No deployment or cutover. Evidence: `governance/evidence/PHASE_PLUGINHUB_STAGE4_LIVE_VENDOR_ADAPTERS_20261025.md` (commit `d86dc27891f2a7d225c06c24812274643608dd83`, blob `52f9e83475cfd2756ad20335a05c31f5add01697`).**




> **Latest verified checkpoint — 2026-10-25 07:33 UTC: added a reproducible unsigned macOS app-bundle packager for the companion. The generated app passed plist validation, launched successfully and showed a safe first-run state without scanning or pairing. This makes the local non-production companion directly testable; Stage 2 is still in progress. Stages 2–5 remain in progress, Foundation exit remains NOT MET, and Stage 6 remains gated. No deployment or cutover occurred. Evidence: governance/evidence/PHASE_PLUGINHUB_STAGE2_NONPROD_APP_BUNDLE_20261025.md (commit fb6ed3b1bdb6e9e6c2886878592025c0c0a8e465, blob e73244d93e54dc06be98f9aaec3e1a285fde332d).**

> **Latest verified checkpoint — 2026-10-24 22:26 UTC: u-he vendor checks now preserve successful product-page results when another official page fails; only the affected product reports an error. Unsupported products remain Manual Check. The deterministic mixed-success fixture and full isolated non-production check pass. Stage 4 remains in progress; Stages 2–5 remain in progress, Foundation exit remains NOT MET, and Stage 6 remains gated. No deployment or remote project D1 write occurred. Evidence report: governance/evidence/PHASE_PLUGINHUB_STAGE4_UHE_FAILURE_HANDLING_20261024.md (commit f8979fc5a19f3a9816fc9ccbcb4d0d7b4d00c45a, blob f0495afea31d0af28c8eb24a6613318f089de7c3).**

> **Latest verified checkpoint — 2026-10-24 22:22 UTC: added u-he version observations and fixed official vendor-page actions for Diva, Hive 2 and Zebra 3. The full local non-production check passed after fixing the API bundle-identifier field mapping. This is one Stage 4/5 increment; Stages 2–5 and Foundation remain in progress, Foundation exit remains NOT MET, and Stage 6 remains gated. No deployment or remote project D1 write occurred. Evidence: governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_UHE_INCREMENT_20261024.md (commit a5dc9312825b3cd14447528918da9a85298a3e42, blob 3489621d2446a9c48c2b647fe33677e9791db198).**

# Roadmap — PluginHub replacement

**Latest verified checkpoint — 2026-10-24 22:15 UTC:** Stage 5 retries eligible failures for all supported action kinds, preserves parent kind, rechecks current inventory and revalidates vendor routes. Full local suite passed, including signed Voxengo fail/retry/replay/cancel, companion build/check, scanner 3/3, API/browser 30/30, syntax, recovery through 0012, temporary Worker/D1 and synthetic Swift flows. No real Mac action, remote account check, project D1 write or deployment. Device/action recovery, vendor breadth/parity, remote isolation/runtime evidence and fresh independent validation remain open. Foundation NOT MET; Stage 5 review PARTIAL; Stage 6 gated. Checkpoint `35091e56c60e3c537353c025011df465fec1dc25` / `9b565d460feec29161828d75115e5c6af50642fb`; progress `889be114c3aa0123ebbd70fb50d9c3a89115416a` / `0b74bf4706f13e107fc8729f5f027df0b1772c37`; evidence `a080c71489048cd2b724df3d10cb809a81c29a50` / `a463e9bb129b776fb1c1fbfa98f07fc6df1296e3`; closeout `3ada79bc9b76ce77e98b35b7f681b00c96b06296` / `c0101521a67cf7452bfb671887a74b6186a6362c`; dashboard `ce920b86449c1f913f699b243f1decbda7c46f8e` / `357fc782113cc6e003f18f3253e5f91352d8d079`.

---

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:25 UTC**

**Foundation exit: NOT MET. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

Stage 2 sync-client verification and protected redirect behavior pass local checks and an independent scoped source review. The dev D1 schema now records migrations 0001–0009. Current verification: Swift build/checker PASS, scanner 3/3, API 18/18. Remaining: live Auth0/browser and paired-Mac runtime, two-account isolation, full recovery, end-to-end status/action receipts, broader parity, and fresh independent Foundation validation. See `governance/evidence/PHASE_PLUGINHUB_STAGE2_SYNC_CLIENT_REVIEW_20261024.md` and `governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_SYNC_D1_CHECKPOINT_20261024.md`.

---

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:21 UTC**

**Foundation exit: NOT MET. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

Stage 2 gained a verified local mocked-transport sync-client check: start/chunk/finalize sequence, bearer headers, approved development host, and private local-path omission. Swift build/checker pass; scanner tests 3/3. Code tip 7636f5f6a1726eadd93f6c9588e6c7c0e11a2feb; source blob 8b40602ee4bc2892ddb753877c9efda274109d3f; checker blob 205d807d30fc7efc0d6f696bfd3a85f085964f01. This closes only a local client-verification item. Real provider and paired-Mac runtime, remote account isolation/recovery, end-to-end status/actions and broader parity remain open. Fresh independent Foundation review is still required.

---

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:14 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

The Stage 4 “Raw updates” count now uses raw observations. Regression checks cover stale raw-vs-bucketed counts plus hidden/snoozed actionable counts. API/browser tests 18/18; JavaScript syntax checks, Swift build and local journal check pass; scanner integration 3/3 passes. Independent patch review found no defects in this UI fix/test; it does not validate runtime or Foundation exit.

- Code commits: `79432e49bbd0120169da4154de0dac3c68f98e68`, `3ef22d83d8a4e6de6943f9ec2b81895ca9ac863d`, `e42ea2c56295780330b583a0c433ba073fce5292`.
- Patch-review report blob: `ebd5c362114288d90432a7d34cce570d82362635`.
- Progress blob: `8ebc9d9e6f9f723cdaccc7c7cff1290f4b128657`.
- Evidence package blob: `64634f338e9363264e5c12ca5773774f0c3350ee`.
- Foundation closeout blob: `eb42c8c1e92f64f2ba1eb8f275d0415a9c587ce6`.

Read-only dev D1 ledger confirms 0001–0005 applied and 0006–0009 pending. No remote writes or deployment. Live Auth0/browser and paired-Mac runtime, remote isolation/recovery, end-to-end actions, broader Stage 2–5 parity, and fresh independent Foundation validation remain open. Foundation remains NOT MET; Stage 6 stays gated.

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:11 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

A Stage 4 status-panel bug is fixed: “Raw updates” now uses the raw observation count. Browser/API regression coverage verifies stale, hidden and snoozed cases. API/browser tests 18/18, JS syntax checks, Swift build, scanner tests 3/3, and the independent patch-level review passed.

- Code commits: `79432e49bbd0120169da4154de0dac3c68f98e68`, `3ef22d83d8a4e6de6943f9ec2b81895ca9ac863d`, `e42ea2c56295780330b583a0c433ba073fce5292`.
- Independent UI patch review blob: `ebd5c362114288d90432a7d34cce570d82362635`.
- Progress report blob: `95168f3c625bbb494723c8cd7ea0ffe681afcc06`.
- Evidence package blob: `8843231b82cd639c205e0f0464cfcd0da2969c80`.
- Foundation closeout blob: `29588621726a820cb15661c5a8beb092d292bffb`.

Read-only Cloudflare checks show dev D1 migrations 0001–0005 applied and 0006–0009 pending. No remote database write or deployment. Live Auth0/browser and paired-Mac runtime, remote isolation/recovery, full Stage 2–5 parity, and fresh independent Foundation exit validation remain open. Keep Foundation NOT MET and Stage 6 gated.

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:05 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

Stages 2–5 now have a locally testable implementation: companion pairing/sync, feature-flagged site/Hope integration, status/preferences, and safe local-confirmed Finder reveal with signed receipts. Browser action requests enforce CSRF; Hope tools follow the feature flag; Auth0 tokens go only to the development Worker or loopback.

- Latest branch head: `a32f07c5a696c59538e6b21190bb318a39e69d76`
- Implementation reviewed: `5d061de5f3ebcdc3c95cfdc60f8ee240ffd3a53e` (latest branch adds only a UI test)
- Progress report blob: `36492663b49036162f3c7233c9642acdb9ea0e22`
- Pinned evidence package blob: `98b779e1867a8159488750b177e3ea26d366ae80`
- Foundation closeout blob: `05f5a82deb4792cc2a5cd761e03e2146cb4d4339`

Local checks: API/browser tests 16/16; JavaScript syntax; Swift build and journal check; scanner tests 3/3; Wrangler 4.152.0 local D1 migrations and Worker checks. Independent source review found no remaining code defect.

No valid Auth0 token or real account was tested. Live pairing/sync, remote isolation/recovery, browser session and end-to-end action receipts remain open. Remote migrations 0006–0008 are unapplied. The review does not close runtime or Foundation exit. 22:47 D1 authorization is resolved; 22:51 retention remains separate.

## Stage progress

- **Stage 2:** pairing and inventory sync implemented locally; real account pairing and remote reconciliation unverified.
- **Stage 3:** site/Hope account integration implemented behind a feature flag; live browser comparison unverified.
- **Stage 4:** status observations and revision-checked preferences implemented; live freshness unverified.
- **Stage 5:** Finder reveal request, local confirmation and signed receipt implemented; end-to-end receipt and runtime validation unverified.

Local API/browser suite: 16/16. JS syntax, Swift build, journal check, scanner 3/3, Wrangler local D1 migrations 0001–0008 and Worker health/CORS/auth checks passed. Fresh independent source review found no code defect. The evidence report is pinned at blob `36492663b49036162f3c7233c9642acdb9ea0e22`.

## Before Stage 6

Validate Auth0/browser and paired-device flows, remote two-account isolation, full recovery, status/preferences, and action receipt on the non-production runtime. Close Foundation's action-time deletion check and remaining exit gates. Keep Foundation **NOT MET** and Stage 6 blocked until evidence and independent review pass. No deployment or cutover.

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 19:39 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stage 2: in progress. Phase 2 Stages 3–5: not started. Stage 6: not ready. No production deployment or cutover.**

The user authorised implementation through Phase 2 Stages 2–5 as a non-production build. Stage 2 now contains an unsigned local macOS companion app, a local SQLite scan journal and device-scoped inventory generation API code. The companion is not yet paired and does not upload inventory. The new API migration has not been applied to remote D1.

- Code: commit `df0ab79d5f14a127be8e7ae20cc9783fadbb4855`.
- Progress report: `governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_PROGRESS_20261024.md`, commit `0202aabf981ca6988d6c2f9dca354a0298c52005`, blob `9fe14cc162fcaa6012ebc85dd00dfad60477d01f`.
- Pinned evidence package: commit `25cf8f0fe999738dcad2e00c37ff73378e8b2b62`, blob `7ec4865ffbaa8d7cfa3bb112a35174c69b681116`.
- Verification: Swift build passed; local journal check passed; scanner integration 3/3 passed; API tests 15/15 passed; `node --check` passed. All scanner fixtures were synthetic; API tests used a local SQLite D1 test double.

Open implementation gates: Stage 2 pairing UI, Keychain credential storage, authenticated HTTPS sync, remote non-production runtime/reconciliation; Stage 3 site and Hope integration; Stage 4 verified status and preferences; Stage 5 preview/confirmation/receipt actions. Foundation's remote isolation, full recovery, owner-confirmed deletion check and fresh independent PASS remain separate open gates.

The 22:47 D1 creation authorization remains resolved by owner confirmation; the distinct 22:51 retention decision is unchanged. No remote D1 migration, deployment, cutover, production or PluginHub change was made.

This update supersedes the older current-status summaries below; historical evidence and decisions are retained.

## Foundation continuation — 2026-10-24 19:20 UTC

**Foundation exit remains NOT MET. Stage 5 remains PARTIAL. Stage 6 is not ready. No production deployment.**

The D1 chronology was reviewed first. Owner confirmation resolves authorization for the empty development D1 created at 22:47:13.736 UTC; the 22:51:26 UTC retention approval remains a distinct later event. Neither timestamp is changed.

The latest independent re-review checked the pinned evidence and read-only Cloudflare state. It confirmed the daily Worker schedule and current D1 counts (2 accounts, 23 active sessions, 4 revoked devices, 4 unusable credentials, 0 pairings, 1 pairing-rate-limit row, 0 receipts). It returned **PARTIAL**: User A pairing evidence was not replayed; User B remote cross-account denial is unproven; recovery is limited to a synthetic single-table export-copy; full D1/D1-to-D1 or Time Travel recovery is unproven; account deletion remains pending its separate action-time confirmation. Review report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REREVIEW_20261024_1920.md`, blob `c87f95fa7ea2183448311e33917c7dab65e6c4fe`.

This continuation also retried the loopback harness’s Test User B sign-in. It did not establish a second authenticated session, so no cross-account probe or denial is claimed. The source suite was not rerun in this continuation; prior recorded 14/14 is unchanged.

**Remaining exit gates:** obtain a usable Test User B session and capture a remote cross-account denial; demonstrate complete development D1 recovery using an authorized recovery path; perform the account-deletion check after its required action-time confirmation; remediate any findings and obtain a fresh independent Stage 5 PASS. Keep Foundation **NOT MET** until each gate has evidence and review.

No production resources or provider terms changed. No production deployment occurred.


---

## PluginHub Foundation current checkpoint — 2026-10-24 19:14 UTC

**Foundation exit: NOT MET. Stage 5: PARTIAL. Stage 6: not ready. No production deployment.**

Test User A remote pairing and revocation passed. A synthetic-only pairing-table export-copy restore passed SQLite integrity and foreign-key checks after migrations 0001–0005. The current local API suite passes 14/14. Test User B remote cross-account denial is unproven; account deletion awaits action-time owner confirmation; fresh independent Stage 5 review remains required. Current D1 totals: 2 accounts, 23 active sessions, 4 revoked devices, 4 unusable credentials, 0 pairings and 0 receipts.

Full evidence and limits: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md` and the linked evidence package.

---

## Synthetic populated-row recovery checkpoint — 2026-10-24 17:52 UTC

**Limited row-level recovery PASS; full export/D1-to-D1 recovery remains OPEN. Foundation exit NOT MET; Stage 5 PARTIAL; Stage 6 not ready.**

The isolated development D1 had 2 accounts, 20 active browser sessions, 3 revoked devices, 3 revoked/expired credentials and no pairings. A synthetic pairing-only row with no account/device reference was inserted, read by exact ID, restored locally against migrations 0001–0005, and checked in a fresh SQLite database: integrity `ok`, foreign-key check empty, ten application tables. The exact fixture was deleted and follow-up reads found 0 fixture rows and 0 pairings. D1 writes were limited to that insert/delete; no production resource changed.

The D1 export endpoint request for the pairings table was rejected by automatic review because exporting the entire remote table could include sensitive internal data. No export was started and no workaround was used. The row-level check does not establish exported-backup or D1-to-D1 recovery.

Report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_SYNTHETIC_ROW_RECOVERY_20261024.md`, commit `b1eba1956629affa3f19544420ccf58280bb3a5d`, blob `f6b52c7ac4e82d6cab1e4cd1c65495ad6c7d17a0`. The fresh independent review remains PARTIAL and predates this executor check.

---

## Fresh independent Stage 5 review — 2026-10-24 17:46 UTC

**Disposition: PARTIAL. Foundation exit remains NOT MET. Stage 6 is not ready. No production deployment.**

Fresh read-only review report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_FRESH_STAGE5_REVIEW_20261024_1746.md`, commit `e5bcadd162d8b84ed45765a01363666d21242292`, blob `40f75b246d38946e2500d24928e4e4ec322fe715`. The reviewer confirmed the development schedule is restored to `0 3 * * *`; read-only D1 counts are 2 accounts, 20 active browser sessions, 0 devices, 0 credentials, 0 pairings, 1 rate-limit row and 0 receipts. Query metadata reported no database changes or written rows.

The reviewer assessed the pinned Test User A pairing and scheduled-cleanup report as operator evidence and did not replay those flows. Test User B's cross-account denial, populated-state/D1-to-D1 recovery, and account deletion (which still requires separate action-time owner confirmation) remain open. Keep Foundation **NOT MET** and Stage 5 **PARTIAL**.
---

## Current Foundation checkpoint — 2026-10-24 17:43 UTC

**Foundation exit: NOT MET. Stage 5 PARTIAL. Stage 6 not ready. No production deployment.**

Remote Test User A pairing proof, owner approval and one-time credential delivery passed; repeat poll returned 410. Owner revocation succeeded and revoked credential reuse returned 401. Scheduled cleanup removed four expired pairings while the dev Worker schedule was temporarily every minute; daily `0 3 * * *` is restored. Read-only D1: 2 accounts, 20 active sessions, 0 active devices/credentials, 0 pairings, 1 rate-limit row, 0 action receipts. Local API suite passed 14/14.

Still open: User B cross-account rejection (Auth0 form submission did not complete), populated/D1-to-D1 recovery, separate action-time confirmation before account deletion, and fresh independent Stage 5 review. The 22:47 creation authorization is resolved by the owner's explicit confirmation; no new D1 creation or direct D1 mutation occurred. Keep 22:51 retention decision distinct.

Evidence checkpoint b1eca503dd07afa3766378f9fb20ccce7aebc98a (blob 10ce22a6a29e7e9b28bc02677a879327c68b1f90); closeout 15b488dfc291a50fff9300691711d4cc7752650b (blob c818e2c52c6a164f749f7a653aec5847c5ad4be1); evidence package 87a63130952d4d424f179f34e1bfd8d740d7dde3 (blob 3513fe3e62a8bc3a537da090113fae7adce18d51).

---


## Current Foundation checkpoint — 2026-10-24 16:52 UTC

**Foundation exit: NOT MET. Stage 5: PARTIAL. Stage 6: not ready.** This checkpoint supersedes older status text below where it says the dev Worker is absent or remote provider checks have not run.

- Latest implementation target remains `ad76677a805275711ace40e52a5b1ffc25cad020`; current records/evidence commit is `6560092f0b1ac1187070a0a69f4928252c5b5e53`.
- Canonical evidence pins: fresh independent review commit `6560092f0b1ac1187070a0a69f4928252c5b5e53`, blob `4ffdcb77e25066d3c8c71f61c764642544512f08`; evidence package commit `6560092f0b1ac1187070a0a69f4928252c5b5e53`, blob `2c1fe1809ced24eb4ffbc467a872dec428938809`.
- The 22:47 D1 creation authorization is resolved by the owner's later confirmation; the 22:51 retention approval remains a separate later decision. No timestamps have been changed.
- The isolated development Worker is configured and responding. Earlier operator probes: `/health` 200, approved-site CORS 204, hostile Origin 403. The independent reviewer verified its D1 binding, scheduled handler, cron and workers.dev settings.
- Test User B's browser session restored; `/v1/me` returned `account_owner`; `/v1/devices` returned HTTP 200 with zero devices; sign-out succeeded. The latest read-only D1 count is 2 accounts, 0 active sessions, 2 revoked/expired sessions, and 0 devices, credentials, pairings, pairing limits, receipts, shares, profile comparisons or deletion tombstones.
- The fresh independent Stage 5 report is **PARTIAL**. Reviewer reran the pinned local API suite **14/14** and independently restored/checked the post-0005 export. It could not reproduce external HTTP calls because that environment blocks outbound Worker traffic. Report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_FRESH_STAGE5_REVIEW_20261024.md`.
- The current Auth0 API defines/grants `read:library` only. Adding and granting `manage:devices` to the development SPA is awaiting owner action-time confirmation because it expands security-sensitive access.
- Still open: meaningful remote cross-account resource rejection; remote pairing, owner approval, one-time credential delivery and revocation; remote account deletion/scheduled cleanup; then fresh independent validation after all gates pass.
- No production resource, terms, or credentials were changed; no direct remote D1 mutation or production deployment occurred.

## Verified remote runtime and post-0005 recovery checkpoint — 2026-10-24 16:48 UTC

**Foundation exit: NOT MET. Stage 5 remains PARTIAL. Stage 6 is not ready.**

- The isolated development Worker `aimm-library-api-dev` is deployed at `https://aimm-library-api-dev.kevinlelitte.workers.dev`; workers.dev is enabled and preview URLs are disabled. Its D1 binding is the approved development database `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. The daily cleanup schedule is `0 3 * * *`.
- Remote `GET /health` returned HTTP 200 and `{"status":"ok","service":"aimm-library-api","api_version":1}`. CORS preflight from `https://aimixmasters.com` returned 204 with credentials enabled; an unapproved Origin returned 403 without an allow-origin header.
- Through a loopback-only test harness/proxy, Auth0 Test User A created and restored a remote API browser session, read its account as `account_owner`, received HTTP 403 `csrf_rejected` for a write without CSRF, then signed out successfully with CSRF. Test User B also established a remote API session; the two internal account IDs were distinct. B session restore/device-list testing and a cross-account rejection probe are not yet complete. No account IDs, tokens or cookies are recorded.
- A post-0005 SQL export was downloaded and restored into local SQLite. It is 5,840 bytes, SHA-256 `96f222e9865abf4f87b7d4af760225dee3a38ed885989e7ff15e85aa6683d204`. The restored migration ledger contains 0001–0005, all ten application tables were empty in the exported snapshot, `PRAGMA integrity_check` returned `ok`, and `PRAGMA foreign_key_check` returned no rows. The SQL and restored database remain in local temporary storage only; neither was committed. This export predates the remote provider smoke tests.
- A read-only query after the remote sessions showed two test accounts, one active browser session, one revoked/expired session, and zero devices, credentials, pairings, pairing-rate-limit rows, shares, receipts, comparisons or deleted-identity rows. The active Test User B session will expire; no test device was created.
- No Auth0 settings or grants were changed. The recorded Auth0 setup does not include the `manage:devices` owner permission needed to approve a device pairing. A second loopback hostname was rejected by Auth0 callback validation; both provider logins used the already configured `127.0.0.1:4173` callback.
- A fresh independent Stage 5 re-review has been requested and is in progress. No source tests/builds or production changes were made in this checkpoint. The pre-existing 14/14 local API suite remains separately evidenced.

### Remaining Foundation gates

1. Owner authorization for the development SPA to receive the `manage:devices` API permission; no provider change will be made before that approval.
2. Complete remote pairing/credential issuance, owner approval and revocation, then verify Test User B cannot read the User A device resource; sign out B and verify the remote fixture/session counts.
3. Complete the fresh independent Stage 5 review against the remote runtime and recovery evidence, remediate findings, and synchronize the final report.
4. Keep Foundation **NOT MET** and Stage 6 not ready until all required gates pass.

The 22:47 D1 creation event remains distinct from the 22:51 retention approval. No new database was created. This checkpoint did not change the gate for any further D1 creation or direct database mutation.

---

## Current PluginHub Foundation checkpoint — 2026-10-24 16:24 UTC

**Foundation exit: NOT MET. Stage 5 remains PARTIAL; Stage 6 is not ready. No deployment.**

The approved device-pairing implementation is in branch HEAD `ad76677a805275711ace40e52a5b1ffc25cad020`. The 14/14 local API suite covers pairing proof, owner approval/CSRF, one-time credential delivery, wrong-device rejection, credential identity and atomic rotation, revocation, rate/body bounds, device caps and cleanup. This is code/test evidence, not a remote pairing run.

The isolated remote D1 now has migrations 0001–0005 applied. Read-only schema inspection confirms the pairing table/rate-limit table and credential-rotation column. Accounts, devices, device credentials, browser sessions, pairings and pairing-rate-limit rows each count zero. `PRAGMA foreign_key_check` returned zero rows. Cloudflare denied `PRAGMA integrity_check` with SQLITE_AUTH. A current Time Travel bookmark was retrieved read-only. A full post-0005 D1 export completed, but the temporary download URL could not be retrieved through the available connector; its SQL has not been restored locally. The earlier export-copy recovery check covers only schema 0001–0003. No Time Travel restore was attempted.

Read-only Cloudflare inventory confirms there is no `aimm-library-api-dev` Worker. Remote HTTP runtime, provider-backed account isolation, and remote pairing cannot be tested without deploying the Worker; deployment remains expressly out of scope. A fresh independent review has concluded: local pairing/credential code and tests PASS (14/14), but remote runtime/account isolation and post-0005 recovery remain unproven. Overall Stage 5 PARTIAL; Foundation NOT MET. Report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REVIEW_20261024.md` (blob `166e9c683dd80302e65b6daa60d6aa39c4964171`). Preserve Foundation **NOT MET** until every gate has passing evidence. Keep the 22:47 D1 creation authorization distinct from the 22:51 retention approval.

### Implementation and remote evidence pins

| Item | Commit | Blob / evidence |
|---|---|---|
| Branch HEAD reviewed | `ad76677a805275711ace40e52a5b1ffc25cad020` | code review target |
| API source | `86700b5aeff21b9ca930a609688a261d48876fdd` | `283b66dbfaba6d2076a02d01a7c17064d2e09082` |
| API tests (14/14) | `ecdde6311d5aeeb370a4a891bb7fc04bfbeda7c2` | `32e4f623e673868dce294cfc8b1231498c2d8735` |
| D1 migration 0004 | `dba100ad9c68b5cc637dec0674fb0083b15c6629` | `8005dc890221b9daef8c29972c70faf7599d1dab` |
| D1 migration 0005 | `521313e71245d1e28591cc03ee07b000ae424de0` | `2301b4725b10b25dfa315a6cac81e25eb8a499c7` |
| API README | `ad76677a805275711ace40e52a5b1ffc25cad020` | `ee08714dc1fa77c8a0d53fea741a4c6eb0f396d9` |
| Remote D1 | migration 0004 at 16:21:39 UTC; 0005 at 16:21:40 UTC | DB `66c91fd6-fae8-43a1-8e3b-372274acd7dc`; all app tables empty |
| Remote recovery metadata | export completed; current Time Travel bookmark read | download/local restore and recovery exercise still open |

## Current PluginHub Foundation checkpoint — 2026-10-24

**Foundation exit: NOT MET. Stage 5 remains PARTIAL; Stage 6 is not ready. No deployment.**

The branch now contains one-time device pairing plus GET /v1/devices/{id}/identity, which verifies the issued device credential against the exact active device record and rejects credentials after revocation. The local API regression suite passes **14/14** in Node's in-memory SQLite D1 adapter; source and test syntax checks pass. Coverage includes pairing proof, owner approval/CSRF, single-use delivery, wrong-device rejection, immediate revocation, invalid-secret lockout resistance, bounded streamed bodies, create/poll rate limits, device caps at approval and delivery, and retention cleanup.

The authenticated remote D1 was rechecked read-only: migrations 0001–0003 are applied and account/device/session tables are empty. Migration 0004 is not applied. No aimm-library-api-dev Worker exists. Therefore no remote API runtime, remote pairing, or remote HTTP account-isolation evidence can be claimed without deploying Worker code. A prior Cloudflare D1 export copy (schema at migrations 0001–0003) was restored into local SQLite; integrity_check returned “ok”, foreign_key_check returned zero rows, and account/device/credential/session tables were empty. No remote restore was attempted.

A fresh independent review of the final credential-auth implementation is requested; the preceding review returned PARTIAL and identified the missing device-credential check, which is now implemented. The 22:47 D1 creation authorization remains resolved and distinct from the 22:51 retention approval. Do not change Foundation to MET until every gate has passing independent evidence.

**Current implementation pins before synchronized record updates:**

| Component | Commit | Blob |
|---|---|---|
| API source | 9b35ab6e9b36619a4f89de04c57a4796d6f1183d | cd54d57a9c6c5f6884af770396f1b3aae955d176 |
| API tests (14/14) | 58d6a2c0d348632e249e3cadc3f475b82417cc77 | 9077146695d74d5760dccfdb10adaec53a7895ca |
| D1 migration 0004 | dba100ad9c68b5cc637dec0674fb0083b15c6629 | 8005dc890221b9daef8c29972c70faf7599d1dab |
| API README | 85b253e89da8a81ee70095da19d81bd7708d3bc1 | 2c0af888d2dcb106be4ffba8fab1a12eb13d7c36 |

Older checkpoints below are retained as chronology and are superseded where they conflict with this section.


## PluginHub Foundation continuation — 2026-10-24

The local Auth0 runtime failure is fixed: Wrangler had started with an empty local D1 because migrations 0001–0003 were not applied. After applying them locally, Auth0 Test Users A and B exchanged tokens for distinct API accounts. Browser session restore/account reads, missing-CSRF rejection (403), valid-CSRF logout, post-logout restore rejection (401), and User B's exclusion of a User A device fixture passed. Temporary fixtures were removed and both sessions were signed out. The API test suite passes 8/8, including regressions that distinguish missing D1 schema and browser-session write failures from Auth0/JWKS failure.

This is local Worker/local D1 executor evidence only. Remote provider-backed runtime/isolation/recovery and independent Stage 5 review remain open. Device pairing and device-credential issuance remain unimplemented. Foundation exit remains **NOT MET**; Stage 6 is not ready. No deployment or remote D1 write occurred. Preserve the 22:47 D1 creation authorization as resolved and distinct from the 22:51 retention approval.

Foundation continuation — 2026-10-24 (Auth0 token verifier fixed; runtime still blocked)

Foundation exit remains NOT MET. The user-created Auth0 test users are saved in 1Password; passwords are not recorded here. Test User A completed Auth0 authorization and received a signed access token with the configured issuer, API audience, approved SPA client ID, future expiry, and read:library scope. Auth0 omits the optional gty claim on this typ=JWT user token. The API verifier has been updated to accept that first-party user-token shape while still rejecting machine-client subjects, unapproved clients, invalid grant types, and tokens without the required scope.

The updated API suite passed 6/6. Local browser token exchange has not yet succeeded: the local Worker returned 503 identity_unavailable while fetching Auth0's public JWKS. The same JWKS endpoint returned HTTP 200 with two keys from the host, so the remaining runtime issue is local Worker outbound connectivity. No authenticated API session, restore/CSRF, or two-account isolation result is claimed. User B has not yet been exercised.

Pairing/device credential issuance remains unimplemented. Existing independent VT-06 recovery remediation remains PASS; overall Stage 5 remains PARTIAL and needs fresh independent full validation. Keep the 22:47 D1 creation authorization resolved and distinct from the 22:51 retention approval. No deployment, remote D1 write, or production change occurred.
\n---\n\nFoundation update — 2026-10-24 (Auth0 grant verified)

Auth0 now grants exactly read:library to the AIMM Library Web development SPA (1/1). Client Access remains denied; the separate Test Application remains at 0/1. The Users page is empty, so no real login/token exchange, browser session/CSRF or two-account HTTP isolation probe was run. The current local test evidence remains 5/5 API tests plus localhost Worker checks on local D1 only. Pairing/credential issuance is unimplemented. Corrected D1 export-copy recovery passed independent VT-06 remediation review, but overall Stage 5 remains PARTIAL and Foundation exit remains NOT MET. No deployment occurred. The 22:47 D1 creation authorization is resolved; keep 22:51 retention approval separate.

Owner input needed to resume live identity checks: create two disposable Auth0 development users. Enter any passwords directly in Auth0 when prompted; do not send passwords in chat. Then tell me the users are ready and I will run the local provider-backed flow. Pairing implementation and a fresh full Stage 5 review remain required.

---

## Latest Foundation continuation — local Worker, JWKS and browser-boundary checks (2026-10-24)

Implementation source tested: `a453c9e4c1b62f0446f87b0dc6d3704ee3c56c31`. Wrangler 4.151.3 ran the branch-fetched Worker with a local D1 binding only; no remote database was configured. The local harness served at `http://localhost:4173/dev-auth-test.html`.

- `GET /health` returned HTTP 200; unauthenticated `GET /v1/me` returned HTTP 401.
- The configured Auth0 JWKS endpoint was reached by the Worker: a synthetic JWT with a deliberately nonexistent key ID returned the expected HTTP 401. No real token/account was used; JWKS/network failure would be reported as 503.
- From the approved localhost origin, session restore reached the Worker and returned the expected no-session HTTP 401. From `http://127.0.0.1:4173`, the browser rejected session restore with `Failed to fetch`, confirming exact-origin CORS.
- `node --test test/foundation.test.js` passed **5/5** against the branch-fetched suite and migrations 0001–0003.

Auth0 callback `http://localhost:4173/dev-auth-test.html` and Allowed Web Origin `http://localhost:4173` were saved and visually verified. API scope `read:library` is defined, but the SPA grant remains **0/1**. The Auth0 dashboard session expired before grant save and now requires owner re-authentication. The 1Password note reflects this. No real OAuth token exchange, authenticated browser session, cookie/CSRF or provider-backed account-isolation test has run. Pairing, remote backup restore evidence, fresh independent Stage 5 review and Foundation exit remain open.

This is non-production local executor evidence only. No deployment or remote D1 write occurred. The 22:47 D1 creation authorization remains resolved by the recorded owner confirmation; keep it distinct from the 22:51 retention approval. Foundation exit remains **NOT MET**.

## Latest Foundation checkpoint — remote D1 checks (2026-10-24 09:18 UTC)
**2026-10-24 remote Foundation checks:** Kevin's owner confirmation still resolves the D1 creation authorization; the 22:47 creation and 22:51 written retention-approval timestamps remain separate. Migration 0003 is now applied to the isolated, empty non-production D1. Direct remote probes rejected a cross-account device credential and a browser session longer than eight hours; temporary test rows were removed and cleanup queries returned zero. A current D1 export restored into fresh local SQLite with `PRAGMA integrity_check=ok`, migrations 0001–0003 present, and zero application rows. This is database-level executor evidence, not deployed Worker/OIDC/CSRF runtime evidence or independent review. Auth0 setup, Worker deployment/runtime validation, 30-day backup retention proof, pairing and fresh independent Stage 5 review remain open; Foundation exit remains **NOT MET**. See [remote D1 recovery evidence](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_REMOTE_D1_RECOVERY_20261024.md) (commit `f6327c4fc528955d7cbacc6764bb853e79ad20321`, blob `dbf78fb7337e693a4f07ef7600d22ea77f302479`). No Worker was deployed.

## PluginHub full-functionality replica inside AIMM — Phase 2 architecture approved (design only, 2026-10-23)
**2026-10-24 implementation update:** The API Foundation has 5 passing synthetic route/security tests; Wrangler ran it locally against local-only D1, with health 200 and unauthenticated account access 401. The Stage 2 read-only companion scanner core now builds and has 3 passing synthetic integration tests for AU/VST2/VST3/CLAP detection, AAX/symlink exclusion, bounded bundle metadata, explicit roots and overlapping-root de-duplication. No real plug-in folders were scanned; no remote migration or deployment occurred. These executor checks do not make Stage 5 pass. Foundation exit remains **NOT MET**. The recorded owner confirmation resolves the 22:47 D1 authorization question, while preserving both the 22:47 creation and 22:51 retention-approval timestamps. The signed companion UI, user folder permission, local journal, keychain identity, pairing/sync, remote runtime/isolation, recovery, inventory/status/actions, site/Hope integration, and fresh independent review remain. See the [companion report](../governance/evidence/PHASE_PLUGINHUB_COMPANION_SCANNER_REPORT_20261024.md), [Foundation local test report](../governance/evidence/PHASE_PLUGINHUB_LOCAL_TEST_REPORT_20261024.md), [pinned evidence package](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md), and [approved seven-stage architecture](PLUGINHUB_PHASE2_ARCHITECTURE.md).

**2026-10-24 Foundation execution update:** Stage 3 independent challenge found VT-03 FAIL and VT-01/02/04/05/07/08 PARTIAL; remediation corrected the token contract, scopes, composite ownership constraints, retention checks, deletion, cleanup and migration baseline. Stage 5 remained PARTIAL. This session directly re-queried the named non-production D1 schema and migration history, and a synthetic cross-account credential insert was rejected; the probe rows were removed. The result is documented in the [D1 review addendum](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_D1_REVIEW_20261024.md). This does not prove API runtime behavior or replace independent validation. Foundation exit remains NOT MET: Kevin has now confirmed that the 22:47 D1 creation was authorized; see the [owner confirmation](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_D1_AUTHORIZATION_CONFIRMATION_20261024.md). The timestamps remain disclosed., Auth0 development setup, API runtime proof, backup recovery, device pairing and fresh independent review remain open. Browser session/CSRF source and migration 0003 have been added but are unapplied and untested. No Worker was deployed and no production data was used. See the [challenge report](project/generated/PHASE_PLUGINHUB_FOUNDATION_CHALLENGE_REPORT_20261024.md), [remediation request](project/generated/PHASE_PLUGINHUB_FOUNDATION_REMEDIATION_REQUEST_20261024.md), [Stage 5 report](project/generated/PHASE_PLUGINHUB_FOUNDATION_VALIDATION_REPORT_20261024.md), [pin revalidation](project/generated/PHASE_PLUGINHUB_FOUNDATION_REVALIDATION_ADDENDUM_20261024.md), [evidence package](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md), and [implementation and test authorization](../governance/evidence/PHASE_PLUGINHUB_END_TO_END_TEST_AUTHORIZATION_20261024.md), [cold-session closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md).

**Direction:** reverse engineer PluginHub’s complete behavior and rebuild it as AIMM-owned functionality, not only a scanner or visual page. The AIMM Mac companion supplies local scanning and management; it does not depend on PluginHub. aimixmasters.com, Workbench, Hope, and the plugin library share one AIMM account inventory. Omit AAX/Pro Tools and duplicate product cards; retain a dedicated duplicate-management tool. Preserve Hope mechanics, local-only licence secrets, and the approved AIMM styling.

**Phase 1 — COMPLETE and APPROVED:** the 32-page manual, installed PluginHub 2.0.12 resources, and aggregate local status data have been inspected read-only. The [durable brief](PLUGINHUB_REPLICA.md) links the completed 31-row parity matrix, static checker inventory, vendor/action routes, status rules, file/share workflows, data boundary and count reconciliation. The session evidence is in [`docs/handovers/2026-10-23-pluginhub-reverse-engineering.md`](handovers/2026-10-23-pluginhub-reverse-engineering.md). Current remote checker, installer URL, share server and exact cross-scanner count equivalence are bounded Phase 2 unknowns.

**Phase 2 technical architecture candidate complete:** the [architecture](PLUGINHUB_PHASE2_ARCHITECTURE.md) and [31-row ownership map](PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md) specify the AIMM Mac companion, account Library API, pairing, shared site/Hope inventory, local actions, receipts and staged cutover. Six independent read-only CLI reviews and their remediation are recorded in the [Phase 2 handover](handovers/2026-10-23-pluginhub-phase2-architecture.md). The formal challenge's three PARTIAL findings were remediated and independently validated PASS; see the [validation report](project/generated/PHASE_PLUGINHUB_REPLICA_PHASE2_VALIDATION_REPORT_20261023.md). Kevin approved the architecture as a design baseline and authorized the prepared Foundation stage; see the [Phase 2 decision](../governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_GOVERNANCE_DECISION_20261023.md) and [Foundation checkpoint](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md). The architecture already defines the seven-step build sequence and cutover gates. The approved retention policy is recorded in [the Foundation decision](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md). The isolated `library-api/` account/device API slice, versioned D1 schema and Wrangler configuration are committed on `codex/pluginhub-foundation`; the schema is applied to `aimm-library-foundation-dev` and the original application tables were verified under migrations 0001 and 0002. Auth0 is selected as the OIDC provider, but no tenant or credentials exist. The Worker is not deployed or connected. Browser session/CSRF source exists in the branch, but migration 0003 is unapplied and the code has no runtime validation. Pairing, runtime proof and cleanup enforcement remain. Remaining identity/entitlement, P31 Samples, vendor adapter, signing, retention and sizing decisions remain attached to their prepared phase gates; production, paid commitments, service/local changes, merge, cutover and deployment require their stated separate authorizations. Earlier uncommitted `index.html`/`bridge/` changes use PluginHub at runtime and replace the AIMM browser scan; a separate PluginHub bridge LaunchAgent is already running from the main checkout. They are not the intended architecture and remain untouched pending proven replacement/cutover. Phase One approval did not authorize implementation or deployment.

## Previous checkpoint — Plugin Library active navigation styling — build 2026-10-22.5

Selected plug-in navigation rows use the same blue-purple gradient as the active Library tab, with dark text and icons and no left highlight stripe. The collapsible installed-inventory sidebar, monochrome icons, fixed Hope rail, filtering, and scanner behavior remain unchanged. The legacy catalogue switch stays removed from the user-facing inventory; Hope mechanics and catalogue/reference data remain available.

The Library now uses one installed-inventory view with a collapsible browse sidebar, monochrome line icons in the MixCheck style, blue active states, and the persistent Hope rail. The sidebar filters the scanned inventory by favorites and the existing category taxonomy. The legacy catalogue switch and catalogue-status badges are removed from the user-facing inventory; catalogue/reference data and Hope’s existing chat/voice mechanics remain in the app. Unsupported vendor update and tag filters are visibly disabled. The existing local folder scanner and its privacy behavior remain unchanged. Source commit `f19b7d3264df72807b8c3199d8b5cf7712812e43`; Build 2026-10-22.4 fixes the missing Library style tag and defines the missing HTML escaping helper that had stopped the rows and folder chips from rendering. The published inventory was visually checked in both sidebar states; plug-in rows and the fixed Hope rail are visible.

# ROADMAP.md — AIMM Active

> Active planning doc. Root ROADMAP.md is preserved as historical record.

## Plugin inventory + local scan — build 2026-10-22.1

The live Library now opens to a MixCheck-styled installed plug-in inventory and retains the AIMM catalogue. The browser scans plug-in bundle names and Info.plist metadata from folders the user selects; it does not read plug-in binaries, audio, presets or licences, and it keeps the scan in this browser. On the Mini, the live scan of `/Library/Audio/Plug-Ins` and `/Library/Application Support/Avid/Audio/Plug-Ins` checked 1,880 bundles and found 2,197 readable plug-in records, grouped into 1,618 products across AU, VST2, VST3, AAX and CLAP. Hope chat/voice mechanics remain available; no Logic project was edited. Source commit `77612f0`. See `docs/STATUS.md` and `docs/HANDOVER.md`.

## Sonnet API paths switched to Haiku 5.5 — build `.77`

Typed Hope chat, Research Brain, top-picks re-ranking, and Mix Check advice now call Claude Haiku 5.5. Active Sonnet selector options were removed, persisted Sonnet selections migrate to Haiku, and Mix Check/ranking cost estimates use Haiku pricing. Historical Sonnet price entries remain for old usage accounting. The live ElevenLabs Hope agents remain GPT-6 Luna; their current native model catalog offers Haiku 4.5 but not Haiku 5.5, so the voice configs were left unchanged. No live model call or tests were run. See `docs/STATUS.md` and `docs/HANDOVER.md`.

## Previous checkpoint — Fix Queue questions and displays, build `.76` prepared

The main Fix Queue and Hope action cards now follow the same spectrum rule: band-specific fixes
show an orange frequency marker, while broadband measurements show no fake frequency strip. Full-
mix and per-stem “Ask Hope” buttons share one question builder. Typed chat, Luna voice and both live
ElevenLabs Hope agents use the same answer guidance; both live agents now have identical 40-tool
catalogs. Build `.76` is prepared; GitHub deployment is pending. No mix/workbench settings changed.

## Hope chat/voice tool parity — build `.73`

Typed chat, ElevenLabs Live Agent voice and the Luna route use the same complete AIMM
tool catalog and shared handlers; the three legacy Repair tile tools are attached to the Live
Agent. The transport no longer limits tools by input mode or keyword matching. Fix Queue turns
that explicitly request explanation only remain tool-free. Build `.73` is live and verified;
the active Live Agent has all 40 tools attached. Typed `open_dashboard` was live-verified with
the popup-blocked overlay fallback. See `docs/handovers/2026-10-21-hope-chat-voice-parity.md`.

## Hope Luna usage voice — build `.58` live; spoken test passed

The route selector and mic dispatch are live on `aimixmasters.com`. **Agent** keeps the existing ElevenLabs Live Agent; **Luna** starts Deepgram Flux → GPT-6 Luna → AIMM tools → ElevenLabs Flash. Kevin confirmed a spoken test passed on 2026-10-21, and the live transcript shows completed Hope replies with Luna selected. Production Worker has the encrypted OpenAI key and a 30-requests-per-minute limiter; the browser-local Hope access token is saved. Next: capture quantitative response latency and provider usage before comparing credit savings.

## Build label placement — build `.56`

The build label sits below Clear chat in Hope's panel, clear of the target selector and top navigation.

## Hope Mix Check controls — build `.55`

Hope's Live Agent has `set_stem_selection` for loaded stem audition and Mix Check playback. She can set/add/remove/clear a stem group, play, pause, stop, seek, skip, change monitor volume and read status. The app validates exact loaded names and returns the resulting selection and transport state. The existing Space key and voice route remain. This does not control Logic Pro or import files.

## Hope usage-based voice — build `.57` prepared; release pending

The separate Deepgram Flux → GPT-6 Luna → AIMM tools → ElevenLabs Flash route is prepared on `codex/hope-luna-stream-release-20261021`, based on current `.56`. The working Live Agent remains. The encrypted `OPENAI_API_KEY` secret is saved in Cloudflare, and Settings → API keys provides a browser-local `HOPE_STT_TOKEN` field; the Worker code and app are still at their prior releases. A short spoken-turn check remains. No savings are claimed yet. See `docs/STATUS.md` and `docs/handovers/2026-10-20-hope-usage-voice-spike.md`.

## Hope voice cost controls and usage result — build `.53` live on AIMixmasters.com; LLM saving measured

Compact call-start context is live. In the correct Fallback account, two GPT-6 Luna v44 calls each had 6 billed LLM turns. Baseline `conv_2701m5avagx6fjmraa8ep3pvr28t`: 1:34 / 691 voice credits / 235 LLM credits / $0.0427 LLM / 926 total credits. Retest `conv_7301m5azfk1xe3rt0cgfwxbcksbn`: 2:37 / 1,153 voice credits / 50 LLM credits / $0.00895 LLM / 1,203 total credits. LLM spend fell about 79% and cost per minute about 87% despite the longer call. This is strong evidence that context reduction helped; the prompt wording differed, so it is not a perfectly controlled test. Total credits rose about 30% because the retest stayed connected longer. Voice credits follow connection duration (about 441 per connected minute in both calls), not measured spoken seconds; silence over 10 seconds receives a 95% discount. The transcript contains complete answers to the scripted questions and one extra plugin question; the client disconnected unexpectedly, so spoken-audio completion remains unverified. Build `.53` removed the strict 12–25-word target after Kevin reported cut-off replies and now asks Hope to complete thoughts in one or two short sentences. The shared idle-call control warns at 1m45s and ends calls after 2 minutes without a conversation turn, while protecting active PTT/recording and assistant speech.

## ✅ R3 Mix Check full-layout redesign — PROMOTED & LIVE on `main` @ `dbc793d` (build 2026-09-01.9), 2026-09-01 — post-ship fix round pending (see `docs/HANDOVER.md`)

The Mix Check (`#eq`) tab has been rebuilt mockup→live to the approved Jules mockup
`begb0037admin/jules` `mockups/05-r3-mixcheck-full-layout.html` @ `8c2785e` — the first R3 tab to go
from mockup to a real, working build (browser DSP, NOT the deferred server-side analysis phase).
Base = `main` @ `68a3ffa`; branch HEAD = `256cae8`. **Durable record: `docs/HANDOVER-r3-mixcheck.md`**
(full 8-step plan, locked decisions, the `window.mcFixQueue` contract, Codex pass history, promote command).

- **Steps 0–7 DONE + committed on `r3-mixcheck-codex`:** grid shell + de-pinned transport → panel
  header + single `Drop / browse WAV ▾` input + brand wordmark (`AI` yellow + `MixMasters`/`Hope`/
  filename-accent gradient) → Audio Specs panel absorbing the 4 meter cards (RMS/Crest/LRA/noise-floor
  DSP, Tempo via `web-audio-beat-detector`, in-browser chroma Key, TEMPO/KEY headline tiles,
  stereo-width meter, SSL-style band deviation meters) → context banner → Fix Queue with the
  `window.mcFixQueue` contract + `aimm:analysis-complete` event (replaces the 6 Mix Issues pills) →
  transport waveform → `#hopeRail` full-height grid item with a speech-tied meter → Hope transcript
  mix-breakdown + live action-item cards + `mark_fix_applied` tool (Markey).
- **Codex:** TP1 (plan) = approve-with-notes, folded. Per-step TP2 = clean. **TP3 end-to-end complete —
  no blockers** (one CSS-scoping nit on uniquely-named `.mc-wave`/brand/AI-star classes, assessed
  non-blocking: probe confirms 0 out-of-scope bindings; matches the file's existing `.ref-*` convention).
- **Gate 1 + Gate 2 = Kevin-approved 2026-09-01 @ `256cae8`.** PROMOTED to `main` via Kevin's
  PowerShell ff-only merge 2026-09-01 — `main` @ `dbc793d`, live. **Post-ship fix round pending:
  7 items from Kevin + residuals A–F, see `docs/HANDOVER.md` top entry.**
- Supersedes the stale "R5 Ozone-12" framing below and in `docs/STATUS.md`, plus the 2026 rounds 1–5
  screenshot-rebuild history and the `r3-preview` branch.
- **Rest of the R3 per-tab redesign** (Workbench, Library, Insight, Snapshots, Settings, Marketing,
  Community, Conversation) still to do — the redesign epic is not fully settled.
- **2026-09-02 Mix Check feedback round:** feedback items 1–15 (16 folded into 15), 17, 18, 20 are
  SHIPPED & LIVE on `main` (build `2026-09-02.15`) — see the dedicated `## ✅ Mix Check 2026-09-02
  feedback round` section below. The still-open queue (feedback #21, #19, #6 + a default-tab
  change) is tracked in `## Mix Check redesign — outstanding feedback queue (2026-09-02 round)`
  below. Operating surface: `docs/feedback/2026-09-02/BOARD.md` on branch `feedback-board`.

### Backlog — from the R3 Mix Check redesign

- **6. Real values for the Audio Specs placeholders** — Subgenre / Production style / Energy / Mood /
  Dissonance render as "with full analysis" placeholder rows (neutral dot); real detected values need
  the deferred server-side analysis phase (Platform Evolution ARCH-2 territory). Placeholders by design.
- **7. Real arrangement detection on the transport waveform** — **SUPERSEDED** by "Mix Check
  redesign — outstanding feedback queue" item **9 (feedback #21)** below, now scoped as a real
  analysis-driven ADDITIVE overlay (section boundaries + labels + clickable issue markers) on the
  LOCKED `#mcWave` canvas. The old fixed INTRO / VERSE / BRIDGE graphic was decorative and was
  removed entirely in R3 post-ship fix #4/#5 — there is no cosmetic layer left to replace.
- **8. Gate-2 accepted residuals + speaking-meter gain tune** (Kevin signed off 2026-09-01 with these known):
  - A. Empty (no-WAV) state — the Audio Specs column runs well below the shorter empty analyser card before the columns bottom-align; matching the empty analyser height is a separate grid tweak.
  - B. Very hot bands peg at the ±6 dB edge of the deviation meter (e.g. LOW +11 shows at the edge); the signed value above carries the true number.
  - C. Stereo-width meter is a 1:1 %→track map; typical masters (~25–40%) sit left of centre; could switch to a compressed scale.
  - D. NOT RESOLVED as of round 1. The flat `×18` gain (docs previously mis-stated `×11`) was replaced with an AGC/compressor-style reference-tracking gain (`markey-hopewave-gain-tune`, merged to `main` build `2026-09-06.3`) — but Kevin live-tested it and reported "no change." Root cause: the reference tracked `rms` with only a 550ms lag, self-cancelling the gain within roughly a word (compressor behavior, not VU-meter behavior). Round 2 fix (`markey-hopewave-gain-tune-2-work`, build `2026-09-06.4`, **not yet merged**) replaces the single symmetric tau with an asymmetric attack (1500ms)/release (4000ms) follower — Codex TP1+TP2 verified against a hand-worked quiet/LOUD/quiet numerical example. Full detail in docs/STATUS.md. Kevin's own live listen is still the remaining confirmation step.
  - E. Speaker button in the composer has no effect with no call live (arms the mute preference); could show a disabled state.
  - F. PRE-EXISTING: empty-state analyser hint text overlaps the "Low / Low-Mid / High-Mid / High" axis labels — long-standing, not introduced by R3, still present.

## Mix Check redesign — outstanding feedback queue (2026-09-02 round)

**Reconciled 2026-10-21 (Codex) — this section was checked against the current app.** Items 10,
12 and 13 are confirmed shipped (see their entries below); the remaining open items are 9, 11
and 14. This is also the exact section Hope
reads when asked "what's on the roadmap" (her `read_doc`/dashboard-digest mechanism fetches this
file directly) — if this section is stale, so is her answer, which is exactly the incident that
triggered this reconciliation pass.

Operating surface: `docs/feedback/2026-09-02/BOARD.md` on branch `feedback-board` — every item there
has Kevin's marked-up screenshot, the ask, the owner and the status. Feedback items 1–15 (16 folded
into 15), 17, 18, 20 are LIVE on `main` (build `2026-09-02.15`) — see Recently shipped. The `#N`
numbers are kept verbatim so the board, Kevin's chat and this roadmap all line up; the `9`–`14` are
this roadmap's own backlog IDs (matching the DASHBOARD.html Backlog cards).

### 9. Mix Check feedback #21 — Real section detection + issue markers on the transport waveform · owner: Cat builds, Jules specs the overlay · **Confirmed not started, 2026-10-08**

Windowed onset/energy analysis of the decoded buffer produces INTRO / VERSE / CHORUS / BRIDGE
boundaries and labels, drawn as an ADDITIVE overlay **under** the LOCKED `#mcWave` canvas — never a
redraw of it — with labels shown only where confidence is high. On top of the same windowed feature
extraction, place **issue markers** on the waveform showing WHERE IN THE TRACK each Fix Queue problem
occurs (e.g. an orange marker at the track position where a band deviation is worst), each clickable
to seek playback there and listen. This needs **time-localised analysis** — per-window / per-section
band-deviation, finding where each queued fix's deviation peaks — not the current whole-track
aggregate; it builds on the same windowed feature extraction the section detection already requires.
It effectively revives the old "issue marker pins" that R3 post-ship #4/#5 removed, but real
(analysis-driven) instead of fictional; the old fixed INTRO/VERSE/BRIDGE graphic (also decorative,
also removed in #4/#5) is replaced by the real segmentation. Jules specs the overlay — markers and
labels together. Supersedes the old "Backlog 7 — real arrangement detection" bullet above.
**Verified 2026-10-08: zero onset/section-detection code anywhere in `index.html` — genuinely not
started, not just undocumented.**

**Effort:** L.

### 10. Mix Check feedback #22 — Read-aloud controls for Hope replies · owner: Markey · ✅ **SHIPPED 2026-10-21**

Added Speak/Stop controls on all assistant replies, including typed/tool replies. Read-aloud uses
Hope’s ElevenLabs Flash voice via AIMM’s `/hope/read-aloud` Worker path and existing TTS-only secret.
It is limited to the allowed AIMM origins, rate-limited per IP, and capped at 2,400 characters; the
Usage-test token is not required. Selected text is read when selected; otherwise it reads the reply.
Each request uses ElevenLabs credits. Per Kevin's instruction, the unused composer mic, route, mute
and global Speak controls remain removed; the separate floating call control and the mockup's two
sample messages remain unchanged. `AIMM_BUILD` was `2026-10-21.66` when this item shipped.

**Done.** Per-reply ElevenLabs read-aloud is available without requiring the Usage-test token.

**Effort:** M.

### 11. Mix Check feedback #19 — Capture PC / tab audio into the Mix Check analyser · owner: Cat · **Confirmed built, button hidden — 2026-10-08**

A control to capture whatever is playing on the machine (e.g. Spotify) via `getDisplayMedia`
tab-audio and run it through the Mix Check analyser exactly like a loaded file. Regression — the
capability used to exist (the "Capture tab audio" bar from P0i live input metering) and there is no
button for it in the R3 Mix Check layout now. **Verified 2026-10-08: the capability is actually
implemented** (`window.refLiveTab`, a real `getDisplayMedia` call, wired to the live-metering
pipeline) — but its button (`#refLiveTabBtn`) carries a `hidden` attribute in the current R3 layout,
so it's real but genuinely inaccessible right now. Fix is small: decide whether to un-hide the
existing button or redesign its placement — not a from-scratch build.

**Effort:** S (button only — the capture logic already exists), down from M.

### 12. Mix Check feedback #3 — Hope tab-awareness verify + persisted-history fix · owner: Markey · ✅ **SHIPPED & MERGED, confirmed 2026-10-08**

Confirm on a clean live build that Hope no longer asks "was it from a Session Snapshot / the Repair
tab / your Insight tab?". Markey has confirmed the instruction text on `main` is already reconciled
(post `9797772`); the wording only reappears when pre-fix persisted chat history
(`trapMasterAiChatHistory_v1` / `AICHAT_HISTORY_KEY`) replays on load. Permanent fix: bump the
history key so pre-fix turns cannot replay. Branch `markey-hope-history-key-bump` @ `d492eb1`.
**Verified 2026-10-08 (Jacob), directly against real code, not assumed:** `git merge-base
--is-ancestor d492eb1 main` confirms the branch IS merged; `AICHAT_HISTORY_KEY` is `_v2` in the live
code; the Conversation tab nav button is confirmed removed. This card had been sitting marked
"pending merge" on the dashboard for weeks after actually shipping — the exact staleness that
triggered this whole reconciliation pass (Kevin caught it live, 2026-10-08).

**Effort:** S. **Done.**

### 13. Mix Check — Default tab on load should be Mix Check, not Conversation · owner: Cat · ✅ **SHIPPED & MERGED, confirmed 2026-10-08**

The app should open on Mix Check (`data-tab="eq"`). Shipped on branch `mixcheck-audiospecs-label-align`
(build `2026-09-05.1`), merged to `main` 2026-09-05. Markup hardcodes `active` on the Mix Check
tab/panel; the three tab-click-gated lazy-inits this card originally flagged now also fire on cold
load. **Re-verified 2026-10-08:** still true on current `main` — Conversation tab has since been
fully retired as a side effect of item 12's work, so this is doubly moot as a concern now.

**Effort:** S. **Done.**

### 14. Mix Check feedback #6 — "Clear chat" button wraps to its own line at narrow rail width · owner: Markey · **Needs a live check, 2026-10-08**

At ≲380px rail width the new "Clear chat" button wraps to its own full-width line (same
`.send-col{flex-wrap:wrap}` behaviour "Attach screenshot" has always had). Jules's review called it
acceptable graceful degradation. Kevin's call whether to force it single-line at all widths (shrink
pill padding/font, or `flex-wrap:nowrap` + `min-width:0` on the row). **Not re-verified 2026-10-08**
— real recent work has touched the Clear-chat button since this was written (it was restored to the
composer row in the Hope-rail pass), so this specific narrow-width wrap claim needs a live
narrow-viewport check before its status can be stated either way, rather than assumed unchanged.

**Effort:** S.

## ✅ Mix Check 2026-09-02 feedback round — items 1–15 (16 folded into 15), 17, 18, 20 SHIPPED & LIVE on `main` (build `2026-09-02.15`)

Batched feedback round worked from `docs/feedback/2026-09-02/BOARD.md` (branch `feedback-board`),
promoted to `main` ff-only by Kevin across builds `2026-09-02.5`–`.15`. What landed:

- **Header re-layout (#3, #9)** — Genre / Target / Settings cluster moved down onto the file-title
  row; `Drop / browse WAV` moved into the transport bar (empty state: the transport card is the drop
  zone); tab strip fills the row edge-to-edge with no trailing gap. Mix-Check-scoped, the other 8
  tabs unchanged.
- **Hope-rail pass (#2, #4, #5, #6, #8)** — Hope identity block + chat dropped down with a clear band
  for the `#hopeWave` speech wave; dead transcript↔composer drag handle removed; Clear-chat +
  Attach-screenshot buttons restored to the composer row; the rail is height-locked to the dashboard
  and long transcripts scroll internally (the page never grows). Jules design-review = APPROVE.
- **Fix Queue + transport batch (#7, #10, #12, #13)** — broadband Fix Queue items draw no frequency
  band, band items get a solid `#f97316` position marker (no brown wash); the WAV loader keeps the
  full gradient "Drop / browse WAV" button in both states; the newest chat bubble always scrolls
  fully into view; a horizontal volume slider added to the transport row (gain node spliced
  downstream of the analyser so meters / Spectral Balance / `#mcWave` are unaffected).
- **Hope-rail transcript layout (#14)** — role-label/bubble spacing, horizontal wrap/clip hardening,
  and a soft top-fade so the scrolled transcript meets Hope's zone without clipping under the wave.
- **`#hopeWave` PTT waveform port (#17)** — Hope's speech waveform replaced like-for-like with the
  `windows-mac-dictation` PTT Mini Float waveform (bar markup + CSS + amplitude analysis), wired to
  Hope's ElevenLabs output stream, keeping the item-4 reserved band. The live `getOutputVolume()`
  reaction gain was tuned 2026-09-06 (see Backlog 8 item D, RESOLVED, above) — Kevin's own live listen
  is the remaining confirmation step.
- **Viewport-fit density pass (#18)** — Mix Check dashboard compressed to ~0.81× height (flush
  ~1046px loaded) so it fits a 1920×1080 viewport with no page scroll; `#mcWave` render untouched.
- **Page gutter (#20)** — symmetric responsive `padding-inline` on `.container` (32px each side
  ≥1600px, 16px 1024–1599px) + `max-width:2000px` cap; `.container{padding-right:0}` dropped.
- **Fix "production line" (#15, #16)** — **queue side** (build `.13`): a direct "✓ Mark done" button
  on the UP NEXT card calls `MC_FIXQUEUE.markApplied()`; `emit()` carries a payload and dispatches a
  new `window` CustomEvent `aimm:fix-queue-changed`; completed cards drop off one by one to a clean
  "N / N done" state. **Hope side** (build `.15`, `e9bcd8a` — Kevin kept this on `main`): the current
  Fix Queue item renders as a self-updating card in Hope's chat transcript (revived
  `renderFixActionBody()` in the `hopeMixRead` IIFE) — analyse → card for #01 → mark done (card
  button, dismiss ×, or Hope's `mark_fix_applied` tool) → same marker re-renders as #02 → … → queue
  clear → an "ALL CLEAR" card, the marker floating to the end of the transcript on each advance;
  the count always reads live so it cannot mismatch; `onAnalysisComplete` purges stale fix-action /
  breakdown / `mc-advance` entries; `RT_INSTRUCTIONS` / digests reconciled.
- **#1** — standing rule: no wireframes, every proposal rendered from the real app.

Still open from this round → items 9, 11 and 14 above (feedback #21, #19 and #6). Item 10's
per-reply read-aloud shipped 2026-10-21; unused composer voice controls were removed per Kevin's
instruction. The floating call control remains separate.

**Hope rail bottom alignment, build `2026-10-19.30` — live:** Chrome confirms the custom domain is serving `.30`. Desktop rail now stretches to the app column content height rather than keeping a viewport-based minimum, so Hope's panel ends alongside the active Mix Check panels and Fix Queue. Mobile overlay behavior is unchanged.

**Fix Queue Hope request — CORS fix deployed, 2026-10-19:** The production app origins `https://aimixmasters.com` and `https://www.aimixmasters.com` are now allowed by `aimm-proxy` (active version `dc296fab`). A typed Hope request from the live app succeeded after the deployment. Verify the exact Fix Queue card context with stems loaded.

**ElevenLabs account routing, build `2026-10-19.36` — local:** Keep Default (`agent_9001…`) and Fallback (`agent_2601…`) as stable role identities, independent of plan names. Fallback is selected for normal sessions for now; Default is used only if Fallback returns a clear exhausted-credit/quota error. Generic network failures do not trigger failover. Publish build `.36` to make this selection live.

**Stem Fix Queue empty state, build `2026-10-19.42` — deployed (Kevin confirmed):** When no Logic stem is selected, hide the entire stem-analysis card, including the instruction strip and empty Fix Queue prompt. Selecting a stem still reveals the existing per-stem measurements and queue. Build `.42` is deployed; the prior `.41` layout was visually checked live on AIMixmasters.com: the Spectral Balance, Audio Specs and Hope panels align at the bottom, and the larger readouts are legible.

**Mix Check and Hope panel layout, build `2026-10-19.41` — pushed to `main` (`3705d3e`):** `.37` makes Spectral Balance span the empty Fix Queue row beside Audio Specs. The plot now has a 440 px minimum height, spreading the fixed ±72 dB grid lines farther apart above the bottom-anchored band cards. Axis and readout text, Audio Specs labels and the import hint are larger and higher contrast. Hope's desktop transcript uses bounded flex sizing so chat history scrolls inside the rail while the composer stays at the bottom. Mobile layout is unchanged. Build `.41` was confirmed live on AIMixmasters.com.

**Song-folder import clarity, build `2026-10-19.29` — LIVE and confirmed:** A visible **Song folder…** control beside the standard WAV picker opens folder import directly; the unsupported-selection notice gives the correct next step. Chrome confirms `.29` on AIMixmasters.com, and Kevin confirmed the folder import works.

## Multi-stem Mix Check — Logic split, bulk stem import, then per-stem analysis (captured 2026-09-04; direction corrected 2026-10-18)

**2026-10-19 update — build `2026-10-19.49`, voice cost controls (superseded by `.53` reply guidance):** The compact call-start context remains in place. The original `.49` guidance targeted 12–25 spoken words; `.53` removed that strict target after Kevin reported cut-off replies and now asks Hope to finish each thought naturally. Idle-call auto-end covers ElevenLabs and OpenAI, warns at 1m45s, and ends after 2 minutes without a conversation turn; it defaults on while preserving an explicit saved opt-out. The later Fallback GPT-6 Luna v44 usage comparison is recorded at the top of this roadmap and in the release log.

**Hope request recovery, Fix Queue playback and song-folder naming, build `2026-10-19.28` — LIVE:** build `.28` is published on AIMixmasters.com. The new **Browse song folder** option uses the chosen directory name for the stem mix title (with stem count) and replaces the previous audio set when loading a new song folder. Multi-file import remains. Build `.27`'s untimestamped **Play mix** from 0:00 and timestamped playback from the cue point are included. Cloudflare dashboard confirms `aimm-proxy` version `1316e5dc` active; the hosted Hope chat connection test passed. No WAV was loaded for that check, and an actual folder import has not yet been run, so the song-title display, exact −19.9 LUFS analysis context and audible queue playback still need verification with source audio.

**Hope complete spectral context and 808 label, build `2026-10-19.23` (local only):** Hope receives the full-mix spectrum, chart legend and exact corridor bounds, the complete imported stem inventory, and each decoded source's metrics, full-record spectrum, leave-one-out result and Fix Queue. Multi-select context provides each selected source individually plus the time-domain summed group spectrum and unselected remainder, with series colours/styles. Instructions require evidence-led commentary, distinguish mix-corridor comparisons from validated solo/group targets, and prevent midpoint fader or masking claims unsupported by these measurements. The imported track labeled `Bass` displays as `808`, with the original filename retained as provenance. Runtime Hope response remains unverified.

**Latest spectral review (2026-10-19, local build `2026-10-19.21`):** During playback the selected group and its unselected remainder now use the same aligned PCM window and playhead, with the same full-sum genre offset and smoothing. Paused curves remain full-record spectra. Neither curve is forced to start at the same dB value. On the actual WAVs, the screenshot's selected group (Vocals, Drums, Piano, Guitar and Other) measures 22.2 dB below the full sum at 20 Hz; the unselected Bass carries nearly all that sub energy and naturally falls away above 1 kHz. This was an independent data audit, not a browser playback verification. Build `.21` is open in Chrome; live playback review with the WAVs loaded remains the next gate. See `docs/STATUS.md` and the latest checkpoint in `docs/HANDOVER.md`.

**Visual follow-up, build `2026-10-19.22`:** the purple genre corridor opacity is increased in both full-mix and stem charts while keeping the same soft blended fill, no hard outline, layout and readings.

**Current first prototype — Kevin, 2026-10-18, superseding the earlier same-day automatic
split-on-upload plan:** Kevin splits one mixed WAV **manually in Logic Pro**, exports the
resulting stem WAVs, then uploads **all stems together into the AIMM dashboard**. Local build
`2026-10-19.19` accepts aligned WAV stems, displays source-named rows and waveforms, changes the orange Mix Check title to the selected Logic track, toggles rows into a simultaneous playback audition and keeps the latest selected row as the per-stem measurements and Fix Queue focus while Spectral Balance follows the selected group; toggling all rows off restores the combined mix. In the selected-stem Spectral Balance view, the existing cyan trace slot is repurposed for the selected track's full-record spectrum when paused and a selected-stem PCM frame during playback in that same slot, using the 8192-point Hann window and power normalization shared with the saved Welch spectrum and the fixed full-sum gain offset; it is not normalized frame by frame. Live selected-stem/group frames are sampled at 20 Hz and smoothed in linear power with a 0.4-second exponential time constant; this affects only the moving display, adds slight lag, and leaves paused full-record readings and calibration unchanged. Live playback review of the new smoothing is pending. All-stem, individual-stem and multi-stem plots share a fixed ±72 dB range with 12 dB ticks, centred at zero; near-silence FFT bins below the floor are clipped only in the display, not in analysis. Frequency guides and band names use the same log-frequency map, with duplicated fixed-percentage guides removed. The repeated instructional text is removed from the empty plot because the drop control above it already describes the action. The selected-stem chart is 320 px high and uses the same fixed ±72 dB scale as the full-mix chart, with 0 dB vertically centred. Stem rows toggle into a simultaneous audition; the most recently selected source remains the focus for per-stem measurements and Fix Queue while Spectral Balance follows the selected group, and the transport title names the active group. No additional blue line or all-stems cyan trace is drawn in this view. The dashed same-sum-without-selected-source guide and purple corridor remain. Real-WAV browser verification of the live line and simultaneous playback remains pending because the Chrome extension blocks local file uploads. It analyzes
each stem, and keeps a separate Fix Queue per source. The existing Spectral Balance appearance
is preserved: purple active genre corridor, cyan full aligned stem sum, and dashed same sum with
the selected source removed. The full-mix and selected-stem plots share a symmetric 0-centred relative dB scale and reserve a top label strip to keep the dB unit clear of the top tick. For multi-selection, the cyan curve is computed after summing selected PCM samples and the dashed reference is the full mix with that selected group removed; the active purple corridor remains the full-mix genre reference. Each spectrum
uses an 8192-point Hann Welch estimate, 50% overlap, every complete aligned frame, average power,
and a Web Worker. The source-removed curve is built by summing PCM samples before FFT. Band
readings compare the full sum to the active full-mix corridor; the corridor is not treated as a
target for an isolated stem. A source-specific queue item requires a material full-sum deviation
and evidence that removing that source materially improves it or moves across the corridor. The
item reports its source and a Workbench bus only where the mapping is clear, then recommends
auditioning; it never applies processing. Hope's panel UI and fixed/open behaviour remain
unchanged. Typed and voice Hope context now carry the measured comparison and source queue, with guidance separating contribution evidence from source-backed technique advice. The stem matching path is WAV-only; existing single-reference WAV/AIFF loading remains compatible. All changes are local and uncommitted. The latest browser upload test is blocked by
the ChatGPT extension's disabled file-URL access. Automatic splitting of one uploaded WAV,
including a Logic automation bridge and the parked RunPod provider, is **deferred**.

**Validation, 2026-10-18–19:** The first attempt stopped safely when Logic reported unsaved
changes in Kevin's existing project; Cat chose Cancel. Kevin then saved and closed that project
and opened an empty one. Cat copied Kevin's supplied 2:13 music WAV byte-for-byte to scratch
storage and tested the copy. Logic's "Separate All Stems" operation produced six regions
(vocals, drums, bass, guitar, piano, other) in **under 18.2 seconds** from Apply to verified
result. Export of the six selected regions took **11.4 seconds**. The six exported WAVs are all
non-silent stereo, 48 kHz, 24-bit, exactly 6,409,013 frames (133.521 seconds), and aligned;
the original mix was not exported. Summing them reconstructs the source to about -33.6 dB
relative RMS error. This verifies the manual Logic path on Kevin's Mac, not perceptual stem
quality. **Browser test 2026-10-18:** Cat's suite passed 39/39 on the six real stems and
single-WAV compatibility. **Hope review 2026-10-18:** Markey's fresh review fixed the
clear-during-in-flight race by checking the live analysis revision before a full-mix response
publishes; syntax and diff checks passed. Runtime voice/backend delivery was not exercised, so
that remains unverified. For build `2026-10-19.6`, JavaScript syntax, focused Hope-context fixture and diff checks passed; the
production spectrum worker passed a synthetic-tone check and was run against the actual Bass,
full-sum, and without-Bass signals. It processed 2,534 windows per 216.34-second signal. Under
the Trap / 808-heavy corridor, the Low band read +4.2 dB rel. with all stems and -3.62 dB rel.
without Bass. This is evidence that Bass materially changes the low-band balance; it does not
prove that the Bass stem alone is wrong. Browser upload of these files is unverified because the
ChatGPT Chrome extension blocks local file access; the earlier 39/39 suite is from an older
build and does not verify this worker path. **Naming rule and project name (Kevin, 2026-10-18):** the Logic project
and source song for the current six-stem test set is `AI MM switching beats`. Name the project
after the source song and each stem after its source Logic track. The transport label
`Stem mix · N stems` remains generic. **Next action:** Load the six files in the local Chrome app after enabling the
extension's file-URL access and review the rendered readings. Kevin reviews before commit or
deployment. The later page-layout redesign remains parked for Jules. Automatic Logic splitting
and one-WAV split-on-upload stay deferred.

**Historical status (2026-09-04; superseded by the current decision above):** Session goal
approved by Kevin 2026-09-04: move to the mockup stage (Jules builds an interactive HTML mockup
per the standing mockup-first process — see `docs/CLAUDE.md`), not to implementation.

**Historical priority note, 2026-09-06 (Kevin's explicit reprioritization):** moved up ahead of the Fix
Queue placeholder bug fix (that item was correspondingly dropped to low priority, see
`docs/STATUS.md` for its status) — this is now the next thing to pick up. DASHBOARD.html Backlog
card 22 mirrors this.

**Mockup stage update, 2026-09-07 (Jules):** `docs/mockups/multistem-mixcheck.html` now covers
all 7 requirements below (previously just 1-2), pushed to `main` (commit `24e491e`), Codex
three-touchpoint reviewed. Awaiting Kevin's review at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck.html` — see `docs/STATUS.md`
for the full design-decision writeup. Still backlog capture only, still not build authorization;
Option A vs B below is still Kevin's open call, unaffected by the mockup existing. (Note: this
mockup was pushed straight to `main`, not its own branch — `docs/CLAUDE.md`'s standing mockup
process is the authoritative one, superseding the "own branch" pattern used for the original
2026-09-04 requirement-1/2 pass.)

**v2 mockup, 2026-09-07 (Jules), later same day again — SUPERSEDES the minimal pass below after
Kevin tested it and found a real bug plus a wrong interaction model.** Kevin reported: (1) a real
bug — dropping files produced 7 identical duplicate stem rows, a "mismatched stem(s) excluded"
warning; root cause confirmed by live headless-Chrome reproduction — no dedupe check against an
already-loaded identical stem, plus zero visible feedback below 2 stems, so a user re-dropping the
same file (getting no acknowledgement) silently accumulated duplicates. (2) Wrong interaction
model — Kevin pointed at the ORIGINAL standalone mockup's per-stem-slot panel (fixed Drums/Bass/
Vocals/Other, each independently droppable, + "+ Add stem") as the correct shape, explicitly
rejecting the minimal pass's shared multi-file picker, and asked for each stem's own inline
waveform preview. **`docs/mockups/multistem-mixcheck-v2.html`** delivers per-stem drop slots
(replace-not-append semantics close the duplicate bug structurally), restyled to the real app's
own tokens/`.ref-t-btn` class (not the standalone mockup's separate dark-card system Kevin already
flagged as inconsistent), a per-slot own-waveform preview alongside the still-present shared
combined waveform, and a generation-token race guard. Codex three-touchpoint review found and
fixed 3 real issues in TP2 (a legacy-drop state-divergence risk, a `mcClearAllStems()` gap, and a
remove-then-reload requirement for replacing a loaded slot) plus one more found during TP3
iteration (a loaded dynamic "+ Add stem" slot had no way to remove the slot itself) — all fixed
and re-verified via real headless-Chrome execution. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-v2.html`. Full write-up in
`docs/STATUS.md`. Still backlog capture only, still not build authorization; Option A vs B below
remains Kevin's open call, unaffected by any of the mockups.

**Minimal-pass mockup, 2026-09-07 (Jules), later same day — SUPERSEDES both mockups below for
review purposes, per a fresh live design discussion with Kevin.** Kevin's explicit framing: the
two mockups below (all-7-requirements and in-context) were both too elaborate and built the wrong
shape — "we already have this, just add the tracks." **Kevin should review
`docs/mockups/multistem-mixcheck-minimal.html`** (live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-minimal.html`), not the two
below — they stay live/unchanged for reference only, not deleted. New scope, nothing more: the
real transport bar (play/prev/loop/stop/volume/time/`Drop / browse WAV ▾`) is completely unchanged
mechanically; the only new capability is that the drop control accepts multiple named stems
(filename = label, no fixed taxonomy) with a minimal inline mute(M)/solo(S)/remove(×) toggle per
stem styled with the exact same `.ref-t-btn` class as the existing transport buttons. **EQ
(requirement 7) is explicitly DROPPED from scope this pass — Kevin: "remove EQ — this is not
working."** None of either prior mockup's EQ code was carried into this one. Build approach: a
fresh, never-edited `main` `index.html` as the base, with a small surgical in-place diff; every
real analysis mechanism (Audio Specs, Spectral Balance, Fix Queue, the waveform, the transport) is
reused UNMODIFIED — currently-audible stems are summed into one combined buffer and fed through
the app's own existing single-file `refLoadFile()` pipeline (requirement 3 — live reactive
analysis — comes for free this way), with sample rate/channel/length validation on load
(requirement 1) flagging and excluding mismatched stems rather than silently misaligning them.
Codex three-touchpoint review found and fixed real bugs, not just scope creep: TP1 (plan) flagged
7 concrete implementation risks before code was written; TP2 (diff) reproduced two real bugs live
— a drop-bubbling double-load and a muted-lone-stem-silently-unmutes-itself case — both fixed; TP3
(real headless-Chrome click-through) regression-tested both plus the full requirement checklist,
all clean. Requirements 4-6 (Hope-awareness, tool-calling control, demonstrate-vs-instruct) were
NOT built this pass — explicitly deferred as lower priority per the brief, not dropped. Full
write-up in `docs/STATUS.md`. Still backlog capture only, still not build authorization; Option A
vs B below remains Kevin's open call, unaffected by any of the three mockups existing.

**In-context mockup, 2026-09-07 (Jules), added alongside the standalone one above, per Kevin's
explicit ask after reviewing it ("I want to see it in context of the entire page"):**
`docs/mockups/multistem-mixcheck-in-context.html` wraps the SAME multi-stem Mix Check feature (all
7 requirements, unchanged) inside the real, freshly-fetched `main` `index.html`'s own chrome — real
header, real 8-tab strip (Mix Check active by default), real `#hopeRail` dock — so Kevin can judge
it sitting in the actual app rather than as an isolated single-tab demo. `index.html` itself is
read-only reference for this pass, never edited. Codex three-touchpoint reviewed; TP1 surfaced
several real-page init hooks (`wireDropZone`/`wireMcBanner`/`wireMcInput`/`wireScrub`/`wireMcVol`/
`ozSpecInit`, the transport/header-actions relocation shims) that retry forever against missing DOM
nodes, which shaped a hide-not-delete approach for the real Mix Check markup that had to move aside;
TP2 found (and this pass fixed) a real event-bubbling bug where a stem-row file drop would silently
reach the real page's own drop handler and overwrite the real Mix Check title, plus a CSS
specificity collision on several transport class names reused from the real component's own
styling; TP3 (real headless-Chrome click-through) confirmed all 8 tabs switch correctly, the new
content survives round-trips through every other tab, and the multi-stem feature itself (demo
stems, mute/solo, live analysis, Hope demonstrate/instruct, EQ, Undo) is unchanged and fully
functional. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-in-context.html` — full
design-decision writeup in `docs/STATUS.md`. Still backlog capture only, still not build
authorization; Option A vs B below remains Kevin's open call, unaffected by either mockup.


**Final agreed brief mockup, 2026-09-07 (Jules) — SUPERSEDES `multistem-mixcheck.html`,
`multistem-mixcheck-in-context.html`, and `multistem-mixcheck-minimal.html` for review purposes,
per Kevin's final agreed brief after an extensive live design discussion.** One-line reason each
is superseded, so the history stays legible:
- `multistem-mixcheck.html` (+ its all-7-reqs expansion) — **wrong drop-target structure**: a
  separate stem-slot panel bolted on beside the real transport, instead of extending the app's own
  existing shared `Drop / browse WAV` control.
- `multistem-mixcheck-in-context.html` — **hidden real components + duplicate Hope**: hid the real
  Mix Check markup behind a wrapper instead of genuinely extending it in place, and carried a second
  scripted "Hope" panel alongside the real `#hopeRail`.
- `multistem-mixcheck-minimal.html` — **wrong interaction model**: reused `refLoadFile()` for BOTH
  playback and analysis (one single-buffer engine), so mute/solo had to stop/reload the whole mix
  rather than keep every stem's source node continuously running — the opposite of what Kevin
  corrected this pass to require — and labelled stems from the filename, which produced the
  concatenated-filenames header bug Kevin flagged directly.

**Flagged discrepancy, not silently resolved:** `docs/mockups/multistem-mixcheck-v2.html` (Jules,
later on 2026-09-07, per-stem drop slots — see the STATUS.md/DASHBOARD.html entries for that pass)
is a fourth prior mockup that Kevin's final brief for this pass did **not** name in its explicit
supersession list (which named only the three above). This final pass's point 1 ("one shared drop
zone... nothing existing is removed") is a shared-picker model, which is the opposite structural
direction from v2's per-stem-slot design that Kevin had explicitly asked for after rejecting the
minimal pass's shared picker. Read together with the rest of this final brief (content-based
classification + click-to-rename, which removes the filename-labelling problem v2's slots existed
partly to solve), it looks very likely that v2 is *also* superseded by this final direction — but
since the brief didn't say so explicitly, this is logged as an open question for Kevin to confirm
rather than assumed. `multistem-mixcheck-v2.html` is left untouched, live, and its DASHBOARD.html
badge is not silently removed.

Delivered: `docs/mockups/multistem-mixcheck-final.html`, pushed to `main`. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-final.html`. Base = a fresh
fetch of `main` `index.html` (commit `2d0f949afb3aa1f78f8e6fac10d1ea259f0e2a01`), edited in place —
`index.html` itself untouched, read-only reference throughout.

**What's new vs the minimal pass, per the brief's 11 numbered points:** the shared drop zone now
accepts multiple named stems (single-file load byte-for-byte unchanged, the degenerate case);
**every stem's `AudioBufferSourceNode` runs continuously for the whole playback duration regardless
of mute state** — mute/solo ONLY ramps that stem's own persistent `GainNode`, never
stops/starts/reschedules a source (the specific correction Kevin gave, verified — see the TP3
summary in `docs/STATUS.md`); each stem gets its own stacked waveform row (a faithful port of the
real, LOCKED `#mcWave`/`MC_WAVE` peak-drawing algorithm, parameterized per stem — `#mcWave` itself
untouched); stem labels come from real content-based classification (transient density + spectral
flatness + low/mid band-energy ratios, concrete documented thresholds, not filenames), honestly
badged "guessed" and click-to-rename; the header never concatenates — `#mcSub` shows a clean
"N stems loaded — duration" summary, individual names live only in their own row; a Snapshot
extends the existing `STATE.journal`/`createWorkbenchBackupPill()` pattern (`type:'stem-session'`,
fingerprint-keyed restore, settings-only, no raw audio) so reloading the same files restores
labels/mute/solo without re-classifying; Audio Specs/Spectral Balance/Fix Queue stay real and
unmodified, reacting live to the audible subset via the same summed-buffer-through-`refLoadFile()`
black-box technique the minimal pass proved, now serialized via a latest-wins queue; still no EQ;
exactly one real `#hopeRail`.

**Codex three-touchpoint review — all three found real, concrete issues, all fixed and
re-verified via live headless-Chrome (Playwright), not self-report.** TP1 (plan) materially
reshaped the playback-engine design (gain-automation cancel-before-ramp, transport-generation
discipline, `refCtx.resume()` handling), the analysis-serialization approach (a latest-wins drain
queue, a content-fingerprint-based Fix Queue signature instead of a timestamp), the classification
constants (concrete FFT size/hop/thresholds instead of vague adjectives, an energy-preserving
mono downmix to avoid phase cancellation), and the Snapshot fingerprint design (stable identity,
occurrence-indexed for duplicates), before any code was written. TP2 (diff review against the
actual built file) confirmed the mute/solo path never touches a source node — only
`gainNode.gain` — and found and fixed 6 more real bugs: an analysis-reset race (`mcResetStems()`
didn't invalidate the in-flight analysis generation), a solo+mute inconsistency (a stem that was
both soloed and individually muted was audible in playback but excluded from analysis — now both
paths call the same `effectiveMuted()`), a session-local-id Fix-Queue signature that changed on
every reload of the same files (now keyed to stable content fingerprints), a Snapshot-restore
duplicate-matching gap (now occurrence-indexed explicitly), a stem added mid-playback staying
silent until the next manual transport action (now re-schedules immediately, in sync), and a
mismatch-reference edge case (removing the reference stem could leave the last remaining stem
stuck flagged with nothing left to compare against). TP3 (real headless-Chrome click-through
against 4 spectrally-distinguishable synthetic demo stems — drums/bass/vocals/other) found and
fixed two more: a `[hidden]` CSS-specificity bug where the stem-stack panel showed even on a
single-file load, and a backwards onset-detection condition that required the frame BEFORE a
transient to already be active — which structurally excluded the silence-to-hit transition that
IS the onset for percussive content, so the synthetic drums stem misclassified as "Other" until
fixed. All fixed; the full TP3 suite re-ran clean afterward with zero regressions.

**Continuous-sync-while-muted, verified not just built:** a debug hook
(`window.__mcDebug`) exposes the real `AudioContext` and generation counters (not exposed on
`window` anywhere else in the app) so the test harness can inspect actual engine state rather than
trust self-report. With 4 stems loaded and playing, `AudioContext.prototype.createBufferSource`
was instrumented to count real invocations; three full rounds of mute-toggling every stem plus a
solo/un-solo cycle produced **zero** new source-node creations, `AudioContext.state` stayed
`"running"` throughout, `currentTime` kept advancing, and the transport's play state and elapsed
time both continued forward uninterrupted (confirmed advancing from the toggle point to +1s later
mid-track). Isolating a single stem (all others muted) changed the measured loudness from -70.0
LUFS (all muted, near-silence) to -14.7 LUFS (real signal) — live-reactive analysis confirmed
functionally correct, not just visually plausible.

**Classification heuristic, honestly assessed:** concrete, documented constants (2048-sample FFT,
1024 hop, analyzes up to the first 20s, a 5-window minimum before guessing at all); on the 4
spectrally-distinguishable synthetic demo stems built for TP3 (broadband decaying percussive hits,
a 55Hz sine, layered vocal-range harmonics with vibrato, a sustained high-passed noise pad) it
classified all 4 correctly after the TP3 onset-detection fix. Known, disclosed limitations (found
via Codex TP1's own critique, not hidden): tonal mid-band material that isn't a voice (guitars,
synths, pianos) will often satisfy the "Vocals" rule; a very percussive bass line or a low piano
can read as "Drums"/confuse the "Bass" rule; this is a real, honest heuristic guess, not ML-grade
classification — which is exactly why it's badged "guessed" in the UI and click-to-rename exists
as the correction path, per the brief.

**Problem:** Hope can currently only measure the whole rendered mix (`balance.wav`) on Mix Check —
she has no visibility into individual stems, so when asked "what's causing this low-end issue,"
she can only give informed reasoning from the full mix, not real per-element measurements.

**Kevin's ask, verbatim intent:** "I need to be able to upload stems for Hope to analyse — they
all need to be present, or maybe give her the ability to stem split."

**Two directions, not yet chosen:**
- **Option A — Multi-stem upload.** Kevin drops multiple stems (drums/bass/vocals/etc.) onto Mix
  Check instead of just one WAV; analyser runs BS.1770-4 + spectral measurement per stem plus the
  combined mix, so Hope can point at which specific stem is driving a flagged issue instead of
  guessing from the full mix alone. Straightforward with the existing measurement pipeline —
  requires Kevin to already have stems.
- **Option B — Client-side stem separation.** If only a single mixed WAV is provided, run a
  stem-splitting step (e.g. a WASM/ONNX port of a model like Demucs/Spleeter, or a server-side
  microservice call) to derive approximate stems automatically, then measure those. A bigger lift —
  needs a separation model, and the browser-only single-file constraint may force a backend/
  microservice call — same shape as the ARCH-2/ARCH-3 Platform Evolution Epic already below in this
  doc; cross-reference that section for the backend-microservice pattern this would reuse.

**Decision (2026-09-07, Kevin): both, not either/or.** "Can I have both?" — yes: A and B are
not mutually exclusive, they're two entry paths into the same downstream system. Once stems exist
(whether Kevin supplied them or they were auto-split), live reactive analysis, Hope's awareness,
her control tools, and per-stem EQ all work identically regardless of source. **Sequencing: build
Option A first** — cheap, immediate value, works with the existing measurement pipeline as-is, and
unblocks everything else (reqs 3-7). **Option B follows later** as an enhancement for when Kevin
only has a single mixed file and doesn't want to bounce out to a DAW to export stems first — it's
the bigger lift (needs a real separation model, same backend-microservice shape as the ARCH-2/
ARCH-3 Platform Evolution Epic) and isn't blocking A's build.

**Competitive context (captured 2026-09-05, context only — not a task list to copy):** a live
competitor product already ships, as paid features: AI stem-splitting (not just stem upload — they
split for you), a scored mix-history library with compare-versions, a "Tools" marketplace (Voice
De-Noise, Audio Restoration, Karaoke, A Capella, Delivery Master, Professional Audio, Workflows),
and a locked Reference-track A/B feature. Kevin's read: their structure is generic and replicable,
but AIMM's real differentiator has to be **Hope actually being intelligent** — teaching,
referencing, driving, and demonstrating — not matching their feature checklist point-for-point.
This note exists to inform priority calls (see Library reorganization, item 23 below, explicitly
deprioritized behind Hope-intelligence work as a result) — it is not itself a build item.

**Product vision, sharpened 2026-09-07 (Kevin, in his own words, reviewing the Multi-stem Mix
Check mockup's Hope demonstrate/instruct behavior):** "this is the kind of interaction I want from
Hope and set this apart from all the other mix apps out there." The concrete shape of it: Hope
should be conversationally smart enough to flag a real problem unprompted in plain language ("your
bass is high and over") and then genuinely act on it ("here, let me show you" — a real solo/mute
call, not just a description), or offer to talk the user through doing it themselves. This is the
explicit, load-bearing differentiator for AIMM going forward — not a nice demo moment, the actual
reason Hope exists as a product idea. Treat any future Hope-intelligence work (Backlog 24/25, the
demonstrate/instruct mechanism itself, and anything similar) as building directly toward this
statement, not a generic assistant feature.

**Requirements gathered so far (2026-09-04 session, Kevin's refinements as the spec developed —
fold all of these into whichever option/build a future session picks up):**

1. **Sync.** Stems must be exported full-length from bar 1 (no trimming) — same duration/sample
   rate. On upload, validate every stem's sample count/sample rate match and flag a mismatch rather
   than silently misaligning. Playback schedules all stem `AudioBufferSourceNode`s to start at the
   same Web Audio clock timestamp for sample-accurate sync.
2. **UI concept — for Jules to mock up, not for Cat to build yet.** Where the single Drop/browse
   WAV zone is now, a stack of stem slots (fixed categories like Kick/Bass/Vocals/Other, or generic
   "+ Add stem" rows — Jules's call), each with its own drop target, filename, and mute/solo toggle.
   One shared transport plays all unmuted stems in sync.
3. **Hard requirement — live reactive analysis.** Spectral Balance and Audio Specs must reflect
   only the currently audible (unmuted) stems, updating live as mute/solo state changes. E.g. if
   only the Bass stem is unmuted, the corridor/LOW-MID-HIGH readings show that stem's balance
   alone, not the full mix. This is **not** a static per-stem breakdown list — it's the existing
   whole-mix analysis re-running against whatever subset is currently audible. Fix Queue items
   should be able to point at a specific stem once isolated this way (e.g. "Bass stem +9 dB in Low
   band").
   - **Refinement, 2026-09-07 (Kevin — real architectural gap found in testing):** "reflect
     whatever subset is currently audible" turned out to be incomplete on its own — Kevin: "when
     you drop a solo bass stem into Mix Check, the app compares it against a full-mix corridor
     target — so it screams that your low end is forty one dB over, which is meaningless, because
     of course a bass stem has no highs. The corridor doesn't know it's looking at a stem." Kevin
     offered two options (a stem-specific reference target, or skipping the tonal-balance
     comparison entirely) and chose the SECOND, simpler one: a fabricated "what a solo bass stem
     should look like" target would be just as likely to mislead as the wrong-target comparison it
     replaces. **Fixed** on `docs/mockups/multistem-mixcheck-final.html` (mockup only,
     `index.html` untouched) — reflecting the audible subset honestly now means: when the
     currently-audible set is a single isolated stem out of a MULTI-stem session (solo, or muted
     down to one — `window.__mcSingleStemIsolated()`), the Spectral Balance corridor-deviation
     cards, the raw canvas framing, the corridor-based Fix Queue items, and Hope's own tonal-balance
     context all say the comparison isn't meaningful right now, rather than computing/reciting a
     number regardless. Loudness/true peak/dynamics/correlation remain fully live-reactive and
     valid in every state, isolated or not — only the corridor COMPARISON is suppressed, never the
     whole analysis. The ordinary single-file-loaded case (nothing else ever loaded alongside it)
     is explicitly unaffected — that state IS the full file the corridor was designed to judge. Full
     write-up (exact detection condition, what's suppressed vs. shown, Codex three-touchpoint
     summary): `docs/STATUS.md`.
4. **Hard requirement — Hope must be aware of stem state at all times, not just the finished mix.**
   Once stems ship, extend the existing Hope-awareness context mechanism
   (`buildMixCheckState()` / `buildMixCheckContextBlock()`, line ~8450/~8494 in `index.html` — the
   same pattern used for the Fix Queue live-state feed from the earlier post-ship #3 work) to
   include: which stems are loaded, which are currently muted/soloed, and the live analysis of
   whatever subset is currently audible — fed to Hope on every mute/solo/upload change, the same
   way Fix Queue changes are pushed now. This should not require Hope to ask "which stem is
   playing" or "is this the full mix or just bass" — the same acceptance bar as the earlier
   Hope-awareness restore (never ask, she already knows).
5. **Hard requirement — control/tool-calling, not just awareness.** Kevin's exact words: "able to
   control play and mute and everything else — I want Hope to be able to drive." Hope needs new
   client tools (`TOOL_DEFS` + handlers, same pattern as existing tools like `propose_mix_move` /
   `manage_roadmap_inbox`, see `index.html` ~8297 onward) so she can actually drive the transport
   and stem state via voice/chat, not just read it. At minimum: play/pause/stop transport, seek,
   mute/unmute a named stem, solo a named stem (and un-solo/return to all-unmuted), and any other
   stem-rack control that exists in the UI once built. E.g. Kevin says "solo the bass" or "mute
   everything except vocals" and Hope calls the tool directly rather than talking him through
   clicking it himself.
6. **Hard requirement — demonstrate AND instruct, not just one.** Kevin's exact words:
   "demonstrate and instruct." Hope should be able to both **demonstrate** (actually perform the
   action herself via her tools — e.g. solo the bass stem live so Kevin hears/sees it happen) AND
   **instruct** (walk Kevin through doing it himself manually, e.g. "click the solo button on the
   bass stem row") — not just one or the other. Which mode she uses should fit the moment
   (demonstrate when he wants it done now / instruct when he's asking how something works or wants
   to do it himself), same general instructional-vs-active split Hope already has to make with mix
   moves.
   - **Why this matters (Kevin's framing, not a nice-to-have):** "this is how she is able to help
     and advise — 'let me show you.'" This is core to how Hope is meant to help, not an add-on:
     when she has a suggestion, she should be able to say "let me show you" and then actually
     solo/mute/play the relevant stem herself via her tools, rather than only describing it. A
     future implementer should treat this as central to the advisory interaction model.
7. **Scope extension — basic live EQ, so a demonstrated move can actually be heard.** Kevin's
   reasoning: "this means we need some basic plugins — live EQ." For Hope to actually
   "demonstrate" a fix (requirement 6) rather than only mute/solo/play stems, she needs at least a
   basic live EQ she can apply and adjust in real time on a stem/bus — so a suggested move like
   "cut 3dB at 80Hz on the bass" can be heard live, not just described.
   - **Findings, checked directly against current `main` `index.html` (2026-09-04, so the next
     implementer isn't starting blind):** `docs/HANDOVER.md`'s 2026-06-11 addendum references
     `aimmApplyMixMove` and the `add_plugin_to_bus` / `set_plugin_settings` tool handlers built for
     Mix Move cards — confirmed these still exist and work (`aimmApplyMixMove` at ~line 10551 calls
     `add_plugin_to_bus` at ~line 11797; `add_plugin_to_bus`'s `TOOL_DEFS` entry at ~line 8315).
     **But this plumbing is a symbolic chain-builder list only** — it adds a plugin *name* (from
     Kev's owned-plugin library) and a settings *note* to the Workbench's chain view, for Kevin to
     go apply by hand in his real DAW. There is **no actual real-time audio DSP anywhere in the
     app** — confirmed via `grep` for `BiquadFilterNode`/`createBiquadFilter`, zero matches in
     `index.html`. So a live EQ Hope can apply and actually be *heard* is **new work, not an
     extension of existing plumbing** — it needs a real Web Audio `BiquadFilterNode` chain (start
     simple: a few bands, gain/freq/Q) applied live to a stem or the mix bus, with new tools for
     Hope to create/adjust it, separate from the existing symbolic `add_plugin_to_bus`.

**Cross-reference:** Option B (auto stem-split) and the live-EQ requirement above both likely need
a backend/microservice for anything beyond a toy WASM model — see the ARCH-2 (RoEx-style analysis
microservice) and ARCH-3 (HyFi-style server-side processing) sections of the Platform Evolution
Epic further down this doc; whoever scopes this should read those sections first rather than
re-deriving the same backend-vs-browser tradeoff from scratch.

**Next step:** Jules builds an interactive HTML mockup (stem slots + mute/solo + shared transport,
per requirement 2) pushed to `docs/mockups/` on its own branch per the standing mockup-first
process in `docs/CLAUDE.md` — Kevin reviews live via GitHub Pages, no screenshots, no code merged
until he approves. Not started as of this entry.

## 23. Library reorganization — sub-sections restructure (captured 2026-09-05, LOWER PRIORITY)

**Backlog capture only — not build authorization.** Explicitly deprioritized by Kevin, behind the
Hope-intelligence work (items 24/25 below) — per the competitive-context note above, matching a
competitor's feature layout is not itself the priority.

**Idea:** restructure AIMM's Library tab into sub-sections analogous to a competitor's structure —
a scored history/archive of past analyzed mixes, a Tools section, and a Stems section.

- **Scored history/archive** — ties to AIMM's existing Snapshots concept; needs reconciling with
  Snapshots rather than building a duplicate parallel history feature. Not scoped which one absorbs
  the other.
- **Tools section** — **deferred, new scope.** No processing-tools feature (Voice De-Noise, Audio
  Restoration, Karaoke, A Capella, Delivery Master, etc.) exists anywhere in AIMM today; this would
  be genuinely new engineering, not a UI reorg of something that already exists.
- **Stems** — ties directly to the "Multi-stem Mix Check" item above (this doc, "captured
  2026-09-04") — cross-reference that section, don't duplicate its requirements here.
- **References** — ties to the existing "P-B: A/B Ref tab" section below (this doc) and its
  `B-P2` backlog card — cross-reference, don't duplicate.

**Explicitly LOWER PRIORITY than the Hope-intelligence work in items 24/25 below**, per Kevin.

## 24. Hope DAW-specific instruction quality (captured 2026-09-05)

**Backlog capture only — not build authorization.** Ties to / expands the existing "Hope KB: Logic
Pro & DAW Training tier" item (`docs/STATUS.md` → Hope Knowledge Base — ingestion row; DASHBOARD.html
Now/P2 card).

**Idea:** Hope's mixing advice should name actual Logic Pro UI elements and concrete steps ("open
Channel EQ, click the high-shelf band, drag to 8kHz") rather than generic mixing language — the KB
already has the depth to support this. Confirmed directly (2026-09-05 session): **33 of the 333
ingested KB videos are Logic-Pro-specific** (SEIDS, Sean Divine, Try Karra, Yaahn Hunter Jr
channels — beginner basics, shortcuts, templates, automation, stock-plugin-only mixing/mastering
walkthroughs, vocal chains). The blocker isn't content depth, it's two existing unverified backlog
items:

- **"Smoke test: YouTube KB hits"** (DASHBOARD.html card title; this doc's "In progress" section
  below tracks the same item as "Smoke test: YouTube KB" — same item, shortened name) — never
  confirmed end-to-end that Hope actually cites this material in a live response. **Now elevated
  to P1 as of 2026-09-05** (DASHBOARD.html badge updated accordingly).
- **"YouTube citation links"** (DASHBOARD.html card / `docs/STATUS.md` row) — no clickable URL in
  KB metadata yet. **Now elevated to P1 as of 2026-09-05** (DASHBOARD.html badge updated
  accordingly; `docs/STATUS.md` row updated too).

**Live confirmation, 2026-09-06 (Kevin):** had a live text/voice session asking Hope about gain
staging (both general and Logic-Pro-specific) — her answers were accurate and specifically
grounded ("From the Mastering dot com video on this...", named a concrete −18dBFS/−6dBFS
average-vs-peak split, walked through Logic's Region Gain + VU-meter-plugin workflow). Confirms the
KB-grounding itself works well; the missing piece is exactly the "YouTube citation links" gap above
— she named the source ("the Mastering dot com video") but gave no link Kevin could click through
to actually watch it. Kevin's ask: when she cites specific videos like this, surface one or a
couple of actual clickable links in the transcript ("here's a couple of links you might want for
gain staging") rather than only a spoken/text source name. Not a bug, an enhancement — reinforces
this item's existing P1 elevation rather than adding new scope.

**Both of the above are flagged ELEVATED PRIORITY as of 2026-09-05**, referenced from this item —
they gate whether this DAW-specific-instruction-quality idea is even achievable soon, since neither
has been confirmed working.

## 25. Hope actually driving/controlling Logic Pro (captured 2026-09-05) — research spike RESOLVED, see item 41 for the voice-trigger build

**Backlog capture only — not build authorization. Bigger, unscoped.** Ties to the existing "DAW
Bridge Epic (3 phases)" section below (this doc) and its `B-DAW1` / `B-DAW2` / `B-DAW3` DASHBOARD
backlog cards.

**Idea:** Kevin wants Hope to eventually say "click here in Logic, open that, use this plugin" and
actually walk him through or drive it live.

**Real caveat, logged explicitly so a future implementer doesn't assume a plain engineering
estimate:** Logic Pro does not have a rich public scripting/automation API like some other DAWs.
This needs a **technical research spike first** — what's actually possible via AppleScript hooks,
MIDI/OSC control surfaces, or anything else Logic exposes — **before any build estimate**, not an
estimate assumed straight from B-DAW1/2/3's existing (vaguer) description. This research-spike
requirement has been added to B-DAW1's own description below (this doc, "DAW Bridge Epic") so it
isn't lost the next time someone scopes B-DAW1.

**Spike RESOLVED, 2026-09-27, confirmed working (see `project_aimm_logic_pro_track_colour.md`):**
Logic Pro Creator Studio IS drivable — not via AX mutation (the inspector's colour swatch is a
custom-drawn AppKit control with no AX children), but via opening the real native "Assign Track
Color…" window and computing a synthetic mouse click at a live-read screen coordinate
(`osascript`/System Events). Track rename and track colour are both implemented and live-verified
in `/Users/admin/logic-pro-mcp-creator-v310` (branch `aimm-routing`); bulk bus creation was
underway. The technique generalises to any Logic action reachable through a real, AX-visible
window or menu — not a one-off hack for colour specifically. **Item 41 below is the concrete
voice-activated build on top of this, captured 2026-10-07 — read that before re-scoping this item
from scratch.**

## 26. Mix Check first-run onboarding — pending Kevin's decision (captured 2026-09-05)

**Design work exists — pending Kevin's review + choice, NOT yet approved for build.** Not a
"not started" backlog item; log it as a pending-decision item.

Jules built two mockup versions of an improved empty/first-load state for Mix Check:

- **v1 (lightweight)** — branch `jules-mixcheck-empty-state`. Hope greeting + quick-prompt chips in
  the rail, a slim "① Drop → ② Measure → ③ Ask Hope" strip, cleaner idle Spectral Balance hint.
- **v2 (full first-run guided tour)** — branch `jules-mixcheck-firstrun-tour`. 5 AIMM-specific
  steps, first-run-only with a re-triggerable "?" icon, reference pattern from a competitor
  screenshot.

Kevin has **not yet reviewed/chosen** between them. Note: the **Hope-rail greeting message piece**
specifically (the first element of v1's mockup) is being extracted and built for real **right now**
by Markey, separately from this pending decision — Kevin's call ("there's nothing stopping us, it's
a quick win") — so that piece is NOT "not started"; only the rest of the onboarding-tour direction
(v1 vs v2, quick-prompt chips, the guided tour) is still pending Kevin's review and choice.

The "① Drop → ② Measure → ③ Ask Hope" strip specifically from v1 is tracked separately — see item
27 below — rather than bundled into whichever onboarding direction Kevin eventually picks.

## 27. Mix Check onboarding — "1-2-3 guide" strip (captured 2026-09-05, deferred to a later stage)

**Backlog capture only.** The slim "① Drop → ② Measure → ③ Ask Hope" getting-started strip from
Jules's v1 mockup (see item 26 above). Kevin wants this treated as its **own separate future-stage
item, explicitly deferred** — not bundled into whichever onboarding direction gets picked from item
26. Distinct from the Hope-greeting piece of the same v1 mockup, which is being built now (see item
26) — the 1-2-3 guide specifically is "some other stage."

## 28. Spectral Balance card — revisit (captured 2026-09-05, deprioritized)

**Backlog capture only — vague placeholder, no specifics.** Kevin flagged he wants to come back to
the Audio Specs / Spectral Balance card at some point. No specifics given yet — this is a flagged
area of interest, not a scoped task. Kevin explicitly said Hope's intelligence work (items 24/25
above) matters more right now. Do not invent scope for this item; expand it only when Kevin gives
specifics. **Items 29 and 30 below (captured same day) are the specifics that eventually landed —
cross-reference this item when either is picked up so it isn't scoped a second time from scratch.**

## Note — Mix Check's three loudness/genre-target controls (investigated 2026-09-05)

**Context only, not an action item.** Kevin flagged the Audio Specs card's Classified Genre reading
seemed "stuck on Trap." Investigation (reading the live `index.html` directly, not assuming) found
THREE separate, confusingly-similar controls on the Mix Check tab, only one of which was actually
broken:

1. **Header "Genre" pill (`STATE.genre`)** — works correctly. Drives plugin library top-picks and
   the Classified→Genre display. Kevin's own screenshots confirmed the Genre pill and Classified
   reading both showed "Hip-Hop" consistently — this control is fine.
2. **Header "Target" pill (platform loudness spec — Trap −8 / Spotify −14 / Apple −16 /
   SoundCloud −10 / YouTube −14 / Tidal −14)** — **confirmed broken/dormant.** `refPopulateOzTargets()`
   (`index.html` ~line 16247) hardcodes its pass/fail checks — `li>=-8` for the Trap and SoundCloud
   rows, and a literal `true` for the Spotify and Apple rows regardless of the actual measured
   loudness — instead of reading real analysis output. On top of that, both UI surfaces that would
   ever display this table's result are already dormant in the current R3 layout: the header-pill
   wrapper (`data-dormant="r3-platform-targets"`, `index.html` ~line 2773) and the full legacy
   "Platform Loudness Comparison" table (`data-dormant="mixcheck-r5-legacy"`, `index.html` ~line
   2856, table itself ~line 2924). So this was never just a hardcode bug — the whole feature is
   currently invisible to users regardless of the calculation being wrong. See item 29 below for the
   planned fix (revive + expand + correct the calculation) — this note exists purely so a future
   session doesn't treat the root cause as unexplored territory.
3. **Spectral Balance panel's own "Target" dropdown** (e.g. "Target: auto (workbench genre)") — also
   labelled "Target," which is the source of the original confusion, but this one does work. It
   compares the mix against a synthetic averaged genre-corridor curve (`REF_CORRIDORS`), not a real
   reference track. See item 30 below for the planned upgrade to a real reference-track comparison.

**Do not touch `index.html` to "fix" #2 as a standalone task** — it's folded into item 29's scoped
revival below, which also needs a Jules mockup first per the standing mockup-first process.

## 29. Revive + expand Platform Loudness Comparison table (captured 2026-09-05, awaiting a Jules mockup)

**Trigger:** Kevin referenced [loudnesspenalty.com](https://www.loudnesspenalty.com/) — a well-known
free tool that shows, all at once (not one platform at a time), how much loudness penalty a track
takes on every major streaming platform. Kevin's reaction: "this is more useful" than AIMM's current
single-platform Target picker. This maps almost exactly onto the dormant "Platform Loudness
Comparison" table already sitting in `index.html` (see the note above) — it needs reviving,
expanding, and having its calculation fixed rather than being built from scratch.

**Scope:**
- **Revive** the dormant table — drop the `hidden`/`data-dormant="r3-platform-targets"` wrapper
  (`index.html` ~line 2773) and/or the `data-dormant="mixcheck-r5-legacy"` wrapper containing the
  full "Platform Loudness Comparison" table (~line 2856/2924), whichever Jules's mockup places it
  in — this is a design decision, not a foregone conclusion, since R3's layout has moved on since
  either was last live.
- **Expand the platform list** to match loudnesspenalty.com's fuller set — add Tidal, Amazon,
  Pandora, Deezer alongside the existing Trap/Club, Spotify, YouTube, Apple Music, SoundCloud rows
  (Trap/Club and Tidal loudness targets already exist elsewhere in the app's platform-target data —
  reuse rather than re-deriving).
- **Fix the underlying calculation** — `refPopulateOzTargets()` (`index.html` ~line 16247) currently
  hardcodes `li>=-8` for Trap/SoundCloud and a literal `true` for Spotify/Apple regardless of
  measured loudness. Replace with real pass/fail logic against each platform's actual target, driven
  by the real measured integrated LUFS (`refSpecPoints`/the existing LUFS pipeline), same as the
  rest of the Audio Specs card.
- **UX direction, per Kevin:** show every platform's penalty at once in a single comparison view —
  not a picker that shows one platform at a time. loudnesspenalty.com is the direct visual/UX
  inspiration.

**Process gate — mockup required before any build.** Kevin wants to see a Jules mockup of this
table's layout within the current Mix Check (R3) design before implementation starts, per the
standing mockup-first process (`docs/CLAUDE.md` "Mockup review process"). **Status is "awaiting a
Jules mockup," not "not started"** — the direction and scope above are locked, only the visual
layout is open.

**Priority, per Kevin's explicit instruction:** queued behind Hope's intelligence work (items 24/25)
— build after, not before or instead of.

## 30. Real A/B reference-track comparison for Spectral Balance (captured 2026-09-05)

**Reinforces and updates the existing "P-B: A/B Ref tab" section below (this doc, under "Planned —
Session 6 priorities") and its matching DASHBOARD.html card "B-P2. Build A/B Reference tab" — this
is new direction for that same backlog item, not a duplicate.**

**Trigger:** Kevin referenced iZotope's own guidance on [mixing with reference
tracks](https://www.izotope.com/community/blog/mixing-reference-tracks), which confirms the
professional standard for tonal-balance comparison is uploading a real commercial reference track
and comparing a mix's actual measured spectral/loudness/stereo characteristics against that specific
track's actual measured characteristics — not a synthetic genre-average curve. This directly
validates the never-built P-B item, and specifically supersedes/updates the Spectral Balance panel's
current "Target: auto (workbench genre)" dropdown (see the note above, control #3) which only offers
a synthetic `REF_CORRIDORS` comparison today.

**Direction, per Kevin's explicit decision:** build P-B as a real reference-track A/B comparison —
let Kevin upload an actual reference track (WAV/high-quality MP3) and compare the mix's real
measured spectral/loudness/stereo characteristics against that track's real measured
characteristics, replacing or supplementing the current synthetic-corridor-only comparison. P-B's
existing spec below (two drop zones, overlaid spectral canvas, side-by-side delta meters, Hope
commentary, shared Web Audio pipeline) already describes this shape — this item's job is to fold in
the specific "real track, not synthetic corridor" validation and keep the two records from drifting
apart, not to re-scope P-B from zero.

**Priority, per Kevin's explicit instruction:** queued behind Hope's intelligence work (items 24/25)
— build after, not before or instead of. P-B's own spec still notes "Spec + mockup needed from Seat
A before any code" — that gate still applies.

## 31. Frequency-range solo / ear-training mode for Mix Check (captured 2026-09-06)

**Backlog capture only — not build authorization.** Kevin explicitly called this "a must-have
feature for stems."

**Numbering note:** this doc's own "Multi-stem Mix Check" section (above, "captured 2026-09-04")
has no numeric prefix, but `DASHBOARD.html` labels the same item **Backlog 22** — that mismatch
pre-dates this capture (confirmed by re-checking both files directly rather than assuming). This
item cross-references that section by its actual heading, and by "Backlog 22" where DASHBOARD.html
is the reference.

**Trigger:** Kevin referenced [Carve Audio's "Mixing Cheat
Sheet"](https://www.audioloom.com/carve-audio/mixing-cheat-sheet), a free plugin. Its core
mechanic: instead of only showing a visual frequency chart, it lets you **solo a specific frequency
range** so you actually hear what problem terms like "mud," "fizz," "presence," "air," "boxy,"
"harsh," "sibilant," "boomy," "thin," "nasal," "hissy" sound like in context, plus per-instrument
EQ/compression guidance. **This is the direct inspiration for the solo-to-hear mechanic — not
something to copy exactly.** Carve's plugin is a static per-instrument reference tool; AIMM's
version should be live/measured against the actual loaded audio (or, once stems exist, a specific
stem), not a generic cheat sheet.

**Kevin's exact framing for why this matters:** "the more Hope can point us to the issue, muddy,
boxed, hissy etc the better she can help to really improve a mix." This is not a generic
frequency-solo feature for its own sake — it's specifically about giving Hope real diagnostic
vocabulary backed by an actual audible demonstration, not just a dB-delta number.

**Scope:**
- **Core mechanic** — let the user (or Hope, once her control-tools item is built, see the
  "Multi-stem Mix Check" section's requirement 5) solo/isolate a specific frequency range of the
  loaded audio so it's audible in isolation, not just shown as a number/chart. Once stems exist
  (see cross-reference below), extend this to a specific stem's frequency range.
- **Vocabulary layer** — map frequency ranges + measured characteristics to named mix problems, so
  Hope can name the actual problem in plain language AND let the user hear it, not just report a
  delta number. Starting map (refine at build time against real measured data, not fixed exactly as
  below):
  - **Muddy** — low-mid buildup, ~200–500Hz
  - **Boxy** — ~300–600Hz resonance
  - **Harsh** — ~2–4kHz excess
  - **Sibilant** — ~5–8kHz excess in vocals
  - **Boomy** — sub/low buildup
  - **Thin** — lack of low-mid body
  - **Nasal** — ~800Hz–1.5kHz buildup
  - **Hissy** — high-frequency noise floor

**Explicit cross-references — this is dependent on/extends other backlog items, not a standalone
precursor:**
- **Direct extension of the "Multi-stem Mix Check" item** (this doc, captured 2026-09-04 /
  `DASHBOARD.html` Backlog 22). Once stems exist, this becomes per-stem — solo just the vocal
  stem's harsh 3–5kHz range, or just the bass stem's boxy low-mids — much more useful than soloing
  a frequency range across the full mix.
- **This is what item 22's requirement 6 ("demonstrate AND instruct" — Hope's "let me show you"
  capability) would actually demonstrate.** Requirement 6 is the general instructional/active
  mechanism; this item is the concrete diagnostic capability that mechanism would exercise for
  frequency-problem coaching.
- **Related DSP work to item 22's requirement 7** (basic live EQ, so a demonstrated move can
  actually be heard) — soloing a frequency band and applying an EQ move to it are closely related
  Web Audio work (a `BiquadFilterNode` filter chain). A future implementer scoping either should
  read both requirements together rather than building two separate filter chains.

**Priority, per Kevin's explicit instruction:** **not** prioritized ahead of Hope's core
intelligence build items (24/25) or the multi-stem item (22 / "Multi-stem Mix Check" above) — this
capability makes the most sense to build as an extension of those once they exist. Sequence
accordingly: 24/25 → 22 → this item, not the reverse.

**Forward cross-reference:** item 32 below (Glossary/Reference tab, captured same day) is the
broader vocabulary layer this item's term-to-frequency map lives inside — this map is that
glossary's audio-diagnostic subset, not a separate vocabulary to maintain twice. A future
implementer should read item 32 before finalizing this map so the two don't drift apart.

## 32. Glossary/Reference tab — mixing-terms glossary, for Kevin and Hope both (captured 2026-09-06)

**Backlog capture only — not build authorization.**

**Trigger:** Kevin referenced iZotope's own [glossary of common and confusing mixing
terms](https://www.izotope.com/community/blog/a-glossary-of-common-and-confusing-mixing-terms) as
scope/structure inspiration — **do not reproduce that article's text verbatim** anywhere in this
item or eventually in the app; it's a reference for shape and coverage, AIMM needs its own written
glossary content, not a copy. Checked directly (WebFetch, 2026-09-06, not taken on faith): the page
splits into a "confusing terms" section (roughly 30 entries — e.g. Air, Bloom, Muddy) and a "common
terms" section (roughly 50 entries — e.g. Automation, De-essing, Headroom), each with a short
1–3-sentence practical definition. Treat the exact split/count as approximate scope reference
(~80–110 terms total), not a number to hit precisely.

**Nav placement, per Kevin's framing:** this can take the nav slot freed up when the Conversation
tab was retired (see the Hope history-key-bump work, this doc/`docs/STATUS.md`, 2026-09-05) — not
literally reviving Conversation, just filling that gap in the tab strip with something useful
instead, since the tab strip already redistributed its width when Conversation was removed.

**Scope — two parts:**
1. **A visible Glossary/Reference tab Kevin can browse himself** — a curated glossary of mixing
   terms (~100+ scope, similar structure to the iZotope reference: term + practical definition,
   organized/searchable).
2. **Hope must be able to draw on the same glossary when she uses a term in conversation.**
   Kevin's exact words: "Hope can use this when explaining e.g. muddy." When she says a mix sounds
   "muddy," she should ground that in an actual definition (build-up of low-mid frequencies
   reducing clarity), not just use the word loosely.

**Explicit cross-reference — do not duplicate the term-to-frequency mapping in two places.** Item
31 above (Frequency-range solo / ear-training mode) already defines a term-to-frequency vocabulary
map for exactly this purpose — see item 31's "Vocabulary layer" bullet for the actual term list and
frequency ranges, not repeated here. That mapping IS the audio-diagnostic subset of this glossary's
content, not a separate thing to re-derive. A future implementer should treat item 31's map as the
seed for this glossary's audio-diagnostic terms, and this glossary as the broader vocabulary layer
(including non-diagnostic terms like Automation, Headroom, Sidechain, Transients) that item 31's
terms live inside.

**Implementation consideration, not a decision to make now:** Hope's side of this could likely
reuse whatever mechanism Markey is building for the YouTube KB search (`read_yt_knowledge`,
`docs/CLAUDE.md`/item 24 above) — a compact, always-loadable reference set. ~110 short terms is far
smaller than the video KB, so this might not even need search — could just be a compact digest
always in her context, similar in spirit to `buildProfileDigest()`/`buildLibraryDigest()`. Flagged
for whoever scopes this to evaluate, not decided here.

**Priority, per Kevin's explicit instruction:** backlog capture only, sequenced sensibly relative
to the other Hope-intelligence and multi-stem work already logged — not prioritized ahead of items
24/25 (Hope's core intelligence build) or item 22 (Multi-stem Mix Check). Read alongside item 31,
which this item's glossary content directly feeds.

## ✅ 33. Fix Queue "Analysing…" stuck-placeholder safety net SHIPPED — branch `cat-fixqueue-stuck-placeholder-safety-net` (2026-09-06, build 2026-09-06.4), awaiting merge

**Trigger:** Kevin's live screenshot repro — the "Up Next" card's "Recommended move" field stayed
stuck on the neutral `MOVE_PENDING` placeholder ("Analysing — pulling the specific move from the
reference library…") forever, even in a session where Hope had ALREADY given him the full,
specific move verbally in the chat/voice transcript (via her own separate `propose_mix_move`
tool path).

**Confirmed root cause:** two independent systems that don't talk to each other. (1) Hope's
spoken/typed answers come from her live ElevenLabs conversation + knowledge digest — working
correctly. (2) The Fix Queue card's own "Recommended move" text is populated by a SEPARATE,
silent background call to Anthropic's API using Kevin's own key (`MC_FIXMOVES.generate()`,
`index.html`). That function's early-return guard (`if (!key || !list || !list.length)`, fired
whenever no Anthropic key is configured or nothing's queued yet) returned immediately WITHOUT
ever assigning the honest fallback text that the function's own `finally` block already used for
a failed/unparseable API call — so `movesById` stayed empty and the card patched with nothing,
permanently, with no retry mechanism anywhere.

**Fix shipped:** the early-return branch now applies the same honest fallback string already used
elsewhere in this function ("Ask Hope to talk through the move — she has it grounded in your
reference library.") before returning, so the card can never get stuck on the neutral placeholder
forever regardless of Anthropic-key state, network failure, or parse failure.

**The second, real gap Kevin pointed at — investigated, NOT force-fixed:** even when Hope has
already given the answer live, the on-screen card still doesn't reflect it, because
`propose_mix_move` (Hope's tool, takes `bus`: master/vocal/808/drums/fx) and the Fix Queue's items
(built in `MC_FIXQUEUE.build()`, keyed by `key`: clips/crushed/mono/quiet/muddy/808/harsh/band-*
and `focusBand`: low/lowmid/mid/high/broadband, displayed as `#01`/`#02`…) use two entirely
different taxonomies with no natural 1:1 mapping — `propose_mix_move` has no `fix_id` argument at
all (unlike `mark_fix_applied`, which does). Forcing a guess-based match risked silently
misattributing a move to the wrong card. **Flagged as a follow-up UX/product decision for Kevin:**
should `propose_mix_move` gain an optional `fix_id` argument so Hope can explicitly say which Fix
Queue card a move belongs to? That's a voice-prompt/tool-definition change spanning Markey's
territory (`RT_INSTRUCTIONS`/`TOOL_DEFS`), not something to guess at silently. Not built this
round.

**Verification:** Codex three-touchpoint review (TP1 plan / TP2 diff / TP3 end-to-end) all clean.
Pushed to `cat-fixqueue-stuck-placeholder-safety-net` off `main` @ `2c98bfd` — not merged, awaiting
Kevin/coordinating session. Per Kevin's 2026-09-06 explicit priority reorder (see `docs/STATUS.md`
top entry), this item drops to low priority relative to Backlog 22 once merged — it's a real
confirmed bug fix, just no longer urgent.

## 34. AIMM stem separation — cloud backend + RunPod serverless Demucs worker — APPROVED, Kevin committed to build (decided 2026-09-21)

**Current direction, 2026-10-18:** Kevin manually runs Logic Pro Stem Splitter on his mixed
WAV, exports the stem WAVs, then bulk imports them into AIMM. The scratch split/export was
timed and verified on Kevin's music WAV. The RunPod/Demucs worker and automatic one-WAV
split-on-upload path are parked for later. The 2026-10-08 export-existing-tracks reframe
below is also historical for this input, because Kevin starts from one mixed WAV rather
than an existing multitrack session. See item 22 for the current first slice.

**Historical status (2026-09-21; see current direction above): APPROVED.** Kevin decided 2026-09-21: "we will implement this." This is no longer a
proposal under consideration — it is committed to build. This status change is docs-only; nothing
has been built or spent yet. **Priority position unchanged** — still behind the Hope-intelligence
backlog (items 24/25) in the queue; not reprioritized to jump ahead unless Kevin explicitly says so.
**Next step: implementation via Codex as lead implementer, Cat reviews, per standing process — not
started this pass.**

**Historical capture note (2026-09-20), kept for history not deleted:** originally logged as a
parked Runpod-GPU-credit idea — backlog capture only, not build authorization at the time. Nothing
has been created on Runpod; no pod, endpoint or volume exists for this item as of this update.

**Fact, per Kevin's own note (not re-verified live by this capture):** Kevin has Runpod credit worth
about 13 hours on an RTX 4090 at $0.74/hr (roughly $9.60 nominal, my arithmetic). The credit sits on
**Kevin's Runpod account, not on this repo**, so any of his projects can draw on it.

**Candidate aimm uses — candidates only, not plans.** The repo was not inspected for GPU-bound tasks
when this was captured. Two ideas that would be slow on Kevin's RTX 3070 but fast on a rented GPU:
- **Stem separation** (e.g. Demucs) — possible link to Backlog 22 (Multi-stem Mix Check), my inference, unchecked.
- **Heavier audio analysis** — possible link to the Platform Evolution Epic's ARCH-2 analysis work, my inference, unchecked.

**Caution — data boundary:** a rented GPU is third-party hosting outside Kevin's controlled setup. **Never
send Oxford or work-related audio or documents to it.** Hope in AI and personal projects only.

**Recommendation:** do not spend the credit just to use it up. Only if a real slow or GPU-bound job
actually appears, and **state the pod's hourly cost before creating anything.**

**Research brief:** `docs/RUNPOD-GPU-RESEARCH-BRIEF.md` (added 2026-09-20 for a fresh session; research
only, no spend).

**2026-09-21 update (Cat) — stem-separation feasibility, findings appended to the brief.** Confirmed:
stem separation is NOT built (it's Backlog 22's deferred "Option B"); AIMM's only backend today is the
`aimm-proxy` key-relay Worker, no storage/auth/job-queue (verified against `index.html` directly), so
ARCH-1 is still unbuilt; Demucs is the practical model; a Runpod serverless endpoint is a good fit for
the compute step but does not remove the ARCH-1 gap. Two proposals logged for Kevin's decision:
(A) an outside-the-app Demucs workaround feeding the already-live Option A upload, vs. (B) the real
in-product Option B (multi-day ARCH-1 + ARCH-2/3-shaped build). **Superseded same day, see below** —
Kevin clarified AIMM is intended to be monetized, so a workaround tied to Kevin's own hardware doesn't
qualify as a real answer.

**2026-09-21 update, later same day (Cat) — REVISED: monetization rules out the local-GPU workaround.**
Kevin's clarification: stem separation must work for any user on any computer via the app itself, not
depend on Kevin's local hardware or any user's GPU. This retires proposal A above entirely (kept for
history, not deleted) — **proposal B is now the only candidate**, and this pass works it out in real
architectural detail instead of a one-line sketch. Live GPU pricing pulled by the coordinator
(`list-gpu-types`, serverless, secure): **RTX 4090 serverless $1.10/hr** (HIGH availability, 10 DCs) or
**RTX A5000 serverless $0.69/hr** (also HIGH availability) — both ample VRAM (24GB) for Demucs; serverless
(per-second billing), not a rented pod, is the right product type for AIMM's bursty per-user usage.
At ~1 min inference/song: **≈$0.018/song on the 4090, ≈$0.011/song on the A5000** — compute spend is not
the blocker at scale. Minimal backend needed (an ARCH-1-equivalent slice, not the full Epic): auth/user
identity, an R2 presigned-upload path for the input WAV, a job-trigger + tracking record (Worker → RunPod
`/run` → D1/KV job row), a result-delivery path (worker pushes output stems straight to R2, avoiding a
large payload round-trip), a storage retention policy, and — the actual monetization hook — a usage
ledger (per-user, per-job) built in from day one so a future quota/paywall is a policy change, not a
rebuild. RunPod serverless worker: a Demucs Docker image with a standard `handler(event)` — check the
RunPod Hub first for an existing maintained Demucs worker before building a custom image. Full detail,
pricing table, and the cost/monetization breakdown: `docs/RUNPOD-GPU-RESEARCH-BRIEF.md`.

**Next action — APPROVED 2026-09-21, Kevin: "we will implement this."** This ARCH-1-slice +
RunPod-Demucs build is committed; queue position unchanged (Hope-intelligence work still sits ahead
of it). Implementation goes through Codex as lead implementer next (Cat reviews), per standing
process — not started this pass, docs-only update. Open live-tool-access questions to resolve
before/during that build: does a maintained Demucs worker already exist on the RunPod Hub, does the
account's endpoint config support completion webhooks, and the exact model-caching setup for htdemucs
weights.

**Picked up 2026-10-08 (Jacob), model-licensing decision made, real build started.** Checked the
RunPod Hub directly — **no official/maintained Demucs template exists there.** Found one small
community repo (`dwin-gharibi/runpod-demucs`, 0 stars, 7 commits, unlicensed handler code) usable
only as a reference, not something to deploy as-is. Separately surfaced a real licensing fact before
picking a model: Demucs' best-quality variant (`htdemucs`, Hybrid Transformer Demucs) is
**CC-BY-NC — non-commercial only**; `mdx_extra`/`hdemucs_mmi` are MIT (commercial-safe) but lower
quality. **Kevin's explicit decision, 2026-10-08: use `htdemucs` now** — AIMM is not yet monetized,
so CC-BY-NC is fine today. **This is a real, dated constraint, not a detail to lose: the model
MUST be swapped to an MIT-licensed variant (or a commercial Demucs license obtained) before AIMM is
actually monetized** — flag this explicitly whenever monetization work starts, don't let it ship
commercially on a non-commercial model by oversight.

RunPod API key created by Kevin (RunPod dashboard → API Keys → "AIMM Demucs", full access) and
stored in 1Password (Personal vault, item `RunPod API Key`, API Credential, `credential` field) —
never pasted into chat, read via `op read "op://Personal/RunPod API Key/credential"` when needed.
No Docker installed locally on Kevin's Mac — building the worker image via a GitHub Actions
workflow (push Dockerfile + handler → Actions builds + pushes to GHCR) instead of a local `docker
build`, so no new local tooling install is needed.

**Real end-to-end proof-of-path built, then the whole approach reframed — same session,
2026-10-08.** Worker repo `begb0037admin/aimm-demucs-worker` built (handler + Dockerfile + GHCR CI,
Codex-reviewed and fixed at every step per the mandatory implementation process), image deployed to
a real RunPod Serverless endpoint, two real bugs found and fixed via actual live test runs (Cloudflare
WAF banning `urllib`'s default User-Agent; job run/status calls hitting the wrong API host —
`api.runpod.ai/v2`, not `rest.runpod.io/v1`, which only handles template/endpoint management). Kevin
then pushed back on the cold-start wait this architecture inherently has (RunPod spinning a GPU
worker from zero + pulling a multi-GB image) — research confirmed this isn't a fixable bug, it's a
real tradeoff: truly-instant stem tools (LALAL.AI's fast mode) run entirely on-device, and the
directly-comparable cloud tool (Moises) itself averages ~75s/song, cloud processing time being real
regardless of cold starts.

**Reframe (Kevin, 2026-10-08) — the deeper insight: for Kevin's own use, stem SEPARATION technology
(Demucs/RunPod, and Logic Pro's built-in Stem Splitter) solves a problem he doesn't have.** Demucs-
style separation exists to pull apart an already-mixed-down single file. Kevin works inside his own
Logic Pro sessions — the bass, drums, vocal tracks etc. are ALREADY separate real audio, not
something that needs AI separation at all. **The actual need is simpler and higher-fidelity:
export the tracks that already exist and get them into AIMM without a manual step** — not run a
separation model on a bounced mixdown.

**Revised plan, replaces the RunPod/Stem-Splitter path for Kevin's own workflow:**
1. Automate Logic Pro's **File → Export → All Tracks as Audio Files** (or per-track Bounce in
   Place) — a long-standing standard Logic command, likely simpler to automate than the newer Stem
   Splitter feature, and the result is Kevin's actual mixed tracks, not an AI's guess at separating
   them. Reuses item 41's proven AX-window + computed-click technique; cross-reference that item
   rather than re-deriving the automation approach here.
2. Land the exported files in AIMM automatically via a **File System Access API folder grant**
   (Chrome-only, persists after one one-time grant — the single unavoidable manual step, same
   category as a one-time OAuth "Allow" click) — AIMM watches a folder Logic's export writes into,
   no drag-and-drop ever needed again after that one grant. This is the missing half of item 22
   (Multi-stem Mix Check), which is still mockup-only.
3. **Analysis and the actual Hope conversation stay in the AIMM web app — no Logic Pro plugin.**
   Considered and explicitly rejected (Kevin, 2026-10-08): building a second "Hope" inside a Logic
   plugin (AU/JUCE, a completely different tech stack) would duplicate the analysis engine (Audio
   Specs, Spectral Balance, Fix Queue) that already exists in AIMM and is the explicit product
   differentiator (see the "Hope actually being intelligent" vision note earlier in this doc). Logic
   is just the background export engine Hope reaches for; the "let me show you" conversation stays
   exactly where it is today.

**RunPod/Demucs work is NOT deleted — stays parked for a genuinely different, narrower future
case:** someone hands AIMM a single already-mixed file with no multitrack session at all (no Logic
project, just a bounced WAV) — that's the one scenario real separation technology is still needed
for, and it's the monetizable-product case per [[feedback_keep_monetization_pivot_cheap]]. Template
+ endpoint still exist on RunPod (idle, zero cost); repo `begb0037admin/aimm-demucs-worker` stays as
the real, working, Codex-reviewed starting point for whenever that case is actually built.

**Next step:** research spike into Logic Pro's "Export All Tracks as Audio Files" command — where
it lives in the menu, whether it's AX-accessible or needs the synthetic-click approach, what the
real invocation/wait/completion flow looks like. Not yet started.

**Context only, other repos — not aimm scope, not acted on:** `ai-news-channel` upscaling/restoration
of Flow footage (Hope's visuals are Codex-exclusive, so that would have to route through Codex), and
Markey's voice repos (larger speech models such as Whisper large-v3, or private TTS experiments).

## 35. Hope's KB search misses content when the question's wording doesn't match the transcript's vocabulary — ✅ SHIPPED, LIVE, VERIFIED (captured 2026-10-03, closed 2026-10-04) · owner: Markey + Adam

**Both sides are live, backfilled, and independently verified against the real deployed apps.** Full
architecture: voyage-context-3 embeddings → Cloudflare Vectorize → hybrid with existing BM25 via
Reciprocal Rank Fusion → Cohere Rerank 3.5. Brief: `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`.

**Linda (hr-fa-knowledge-base):** deployed to `hr-kb-ai.kevinlelitte.workers.dev`. Backfill: 6,678
documents, 23,298 vectors, **0 failures** (after fixing one real duplicate-document-key bug found live —
see Incident Log below). Verified directly via the real `/semantic-search` endpoint: the target
"Registering a New Radiation Worker" document returns as the #1 hit for its own title (score 0.63). The
full chat-UI test is still Kevin's to confirm himself (browser automation had trouble with Linda's specific
composer widget) — not a sign of a problem with the fix, just an untested surface.

**Hope (aimm):** PR #26 reviewed and merged by Kevin directly in conversation ("yes please go ahead and
merge and run the test"), deployed to `aimm-proxy.kevinlelitte.workers.dev`. Backfill: 608 videos, 3,191
chunks, **0 failures** on the final clean run (after fixing a real Vectorize ID-length bug found mid-run —
see Incident Log below). **Live-verified with 5 real chat tests, all grounded, zero fabrication:**

1. Teezio's clap EQ (357/1,100/5,900 Hz cuts + Spectre air) — exact quote, correct source
2. Teezio sibilance vs. Stuart White mic chain (compound question) — Teezio's half fully grounded;
   Stuart White's half correctly declined with a disclosed, accurate web-search fallback (Telefunken 251,
   Avalon 737, Tube-Tech CL 1B — verified against the same facts independently) rather than fabricating,
   when the KB search came up short on that exact generic phrasing
3. Jaycen Joshua's 808 sidechain setup (duplicated-kick trigger into Soothe2) — exact quote, correct source
4. Leslie Brathwaite's kick-vs-808 decision on "Care" — search correctly dug past a shallower transcript
   part to find the right one (Part 3), exact quote, correct source
5. Teezio's de-essing load-sharing philosophy — correctly reused the answer already established earlier
   in the same conversation instead of re-searching needlessly, same real quote, no wasted tool calls

Full question/answer text for all 5 tests is in this session's transcript; not duplicated here to keep
this entry readable. The pattern across all 5: real citations, real quotes, correct multi-hop search→read
behavior when needed, honest fallback instead of invention when search genuinely comes up short.

**Incident log — two real bugs found live, both fixed, both verified fixed:**
- **Linda:** `kb.json` has one genuine duplicate document (the same archived guide scraped twice under
  different topic passes, byte-identical content). The backfill script correctly raised rather than
  silently corrupting data. Fixed by skipping the duplicate during embedding — NOT by editing `kb.json`
  itself, since `kb-index.json` references documents by positional array index and deleting an entry
  would have silently shifted every later index.
- **Hope:** Vectorize vector IDs were a raw, unbounded `${videoId}::${chunk}` string, which exceeded
  Cloudflare's 64-byte ID limit for long MWTM slugs (producer-artist-song-partNN titles) — 3+ videos
  failed with `VECTOR_UPSERT_ERROR 40008` at 477/608 into the first backfill attempt. Fixed (commit
  `7f3775f`) with a short FNV-1a hash + truncated readable prefix + chunk number; `metadata.video_id`
  stays the full, unhashed source of truth for display, so nothing downstream changed. The Vectorize
  index was deleted and recreated clean before the final backfill run, so none of the content upserted
  under the old, broken ID scheme survived as orphaned duplicates.
- A separate browser-automation quirk (not an app bug) caused one round of live testing to silently fail
  — the `computer` tool's type/click actions weren't registering keystrokes into Hope's composer textarea.
  Confirmed via direct DOM inspection (the real input's `.value` stayed empty after "typing"). Dispatching
  the message via a direct JS `value` + `input` event + `.click()` on the real elements worked immediately
  and is the reliable method going forward for automated testing of this composer.

**Standing delegation note:** the PR #26 merge and "go ahead" were Kevin's own explicit calls in
conversation, made after reviewing a file-by-file diff summary (not the raw diff). Both bug fixes above
were narrow, clearly-justified technical corrections made under his standing overnight delegation
("accept and approve anything on my behalf... I will not be available to authorise 1Password prompts or
anything else") while he was asleep — recorded as delegated, not as if he personally reviewed either diff
line-by-line, since he hadn't at the time. He has since reviewed and confirmed the live test results
himself the next morning ("this is great").

**Overnight Cloudflare-access outage, for the record:** the 1Password↔Cloudflare-API-token bridge went
unresponsive right as Kevin went to sleep ("authorization timeout", confirmed genuinely down via multiple
isolated checks, not a chaining artifact — very likely his Mac's screen-lock blocking 1Password's
desktop-app bridge). Per his standing zero-manual-steps rule and explicit instruction against repeated
cycling, this was tried a reasonable number of times, confirmed real, then the work was paused and clearly
documented rather than hammered. It recovered on its own by morning and the remaining work (clean
reindex, deploy, backfill, live verification) completed immediately once it did.

**Remaining open items, not blocking, Kevin's call on priority:**
1. Linda's full chat-UI test, by Kevin's own hand, to close out the one surface browser automation
   couldn't reliably exercise.
2. The generic-phrasing gap (test 2 above) — the KB search still occasionally misses on very vague
   wording even when the content exists and ranks well for better-targeted queries. Not a regression,
   not fabrication (correct, disclosed fallback every time it's been seen) — a real, smaller follow-up
   on retrieval precision for a future session, not urgent.
3. `read_yt_knowledge`'s open design question (still literal substring-match) — now that semantic search
   can surface a video via paraphrase alone with no shared wording, should the read-deeper step also move
   off substring-matching? Flagged by Markey, not yet decided.

**Earlier blockers, since resolved:** Voyage AI and Cohere accounts were both created by Kevin directly in
conversation (billing added to each after hitting real rate-limit/propagation issues — Voyage's 200M free
token grant meant the actual backfill cost was effectively $0 regardless). `gh auth refresh -h github.com
-s workflow` for Linda's backfill GitHub Action was flagged as needed but turned out unnecessary — the
backfill ran via a temporary local clone instead of through GitHub Actions, sidestepping that blocker
rather than fixing it.

**Status: DECIDED, implementation dispatched 2026-10-03.** Full architecture brief, research trail, and
per-project implementation requirements: `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`. Short version:
**voyage-context-3 embeddings → Cloudflare Vectorize → hybrid with the existing BM25 via Reciprocal Rank
Fusion → Cohere Rerank 3.5.** Properly researched per Kevin's explicit directive — "I need the absolute
best fix, I don't care if it's going to cost me... I need robust options, no quick fix or cheaper
bandaids" — not a quick prompt patch. Same architecture applies to Linda (hr-fa-knowledge-base), who
has the identical underlying limitation (see below) — Markey builds Hope's side, Adam builds Linda's,
each against their own repo, both dispatched 2026-10-03.

**Original find (kept for history).** Found live-testing the two fixes shipped overnight
2026-10-02→03 (commits `5d76abb`, `d0a4cc8` — typed-chat KB-tool parity + anti-fabrication rule, then
compound/comparison-question decomposition into per-subject searches). Both of those fixes are
confirmed working live, no regression here — this is a separate, deeper, pre-existing limitation they
surfaced rather than caused.

**The bug:** `search_yt_knowledge`/`read_yt_knowledge` use a client-side BM25-style keyword match
(`kbSearchTok`/`kbSearchRetrieve` in `index.html`) against `docs/knowledge/kb-search-index.json`. When
a natural question's wording doesn't share vocabulary with the transcript's own wording, real,
already-ingested content can go completely unfound — not an honest "doesn't exist" case, a genuine
retrieval miss.

**Proven directly (not inferred):** asking Hope to compare Teezio's J. Cole sibilance work against
Stuart White's mic chain on Beyoncé's "Yoncé." The Stuart White content is real and already in the
KB (`docs/knowledge/mwtm-stuart-white-beyonce-yonce-p03.md` — Elam 251 mic w/ AC701 tube, Avalon 737
mic pre, Tube-Tech compressor, "warm" saturation setting). Hope ran 3 separate, properly-targeted
searches for it (the new decomposition fix working as intended) and still came back empty — correctly
declining to fabricate rather than inventing a gear list. Replicating the real scoring logic in Python
confirmed why: a query using natural phrasing ("mic chain", "recording") doesn't rank the right chunk;
the same query using the transcript's own gear-name vocabulary ("Elam 251 Avalon 737 Tube-Tech
compressor warm setting") ranks it correctly. Pure keyword search has no way to bridge that gap.

**Why PRIORITY, per Kevin (2026-10-03):** after reviewing the live test result himself, Kevin called
this the bigger issue of the two found that night. The anti-fabrication rule is working — but it
means a retrieval miss now LOOKS like an honest "not covered," which could quietly mask real content
gaps across the whole MWTM corpus (145 parts, 576 chunks) indefinitely unless the search itself gets
smarter. Flagged by Markey in the `af1bd1726f24befd4` hand-back as a reusable lesson: "a working
anti-fabrication rule will mask [a retrieval bug] as an honest 'I don't know' instead of exposing it."

**Measured scale (2026-10-03) — this is not a one-off edge case.** Using each video's own title as
the search query (the most natural available proxy for "would a user's question about this video find
it at all"), and checking whether its own chunks appear in the GLOBAL top-10 results:

| | MWTM (new, 2026-10-02 ingestion) | Pre-existing YouTube KB |
|---|---|---|
| Videos totally invisible to their own title search (0 chunks in top-10) | **56.6%** (82/145) | **47.5%** (220/463) |
| Deep content (chunk 2+) unreachable via the title | **86.5%** (373/431) | **92.2%** (1,984/2,152) |

This is NOT an MWTM-ingestion problem — the pre-existing, already-live YouTube KB has the same (or
worse) rate. This is a systemic limitation of the keyword-match search across the whole 608-video,
3,191-chunk library, present since before this week's ingestion, that went unnoticed precisely because
a working anti-fabrication rule makes a retrieval miss look identical to an honest "not covered." One
honest caveat on methodology: bare titles are a worst-case proxy — real conversational questions are
usually more detailed than a title, so the true miss rate on everyday questions is likely somewhat
better than these numbers — but the scale is consistent across old and new content alike, not a
small-sample fluke.

**Kevin's reaction (2026-10-03), directly:** "this is worrying and went unnoticed." Work on this started
same day — first step is investigating whether Linda's (hr-fa-knowledge-base) larger, reportedly-working
search setup has a reusable approach, before deciding whether AIMM needs something new.

**Adam's investigation (2026-10-03) — ANSWERED: Linda has the exact same limitation, nothing to reuse.**
Dispatched read-only, verified directly against the live code (not memory files) via the GitHub API:
Linda's `index.html` (`hr-fa-knowledge-base`) runs the identical family of search — client-side
TF-IDF/BM25-style keyword match (`retrieve()`, explicitly commented `BM25-style`), no embeddings, no
vector DB, nothing semantic anywhere (grepped both `index.html` and the 305-line `worker/worker.js` for
embed/vector/pinecone/weaviate/qdrant — zero matches, independently re-confirmed by Jacob). Her "larger
database" (6,680 docs, 23,345 chunks, ~33MB, confirmed via git blob API) is just more raw corpus, not
better technology. Adam replicated her real `retrieve()` logic in Python against the real data files
and ran the same style of test used on Hope: her own title-search blind-spot rate is **27.9%** (lower
than Hope's 47.5–56.6%, but Adam attributes this to a denser/more repetitive HR-jargon vocabulary
domain masking the same flaw, not a better algorithm — a direct vocabulary-gap test on a real document
("Registering a New Radiation Worker") returned **zero relevant hits** for natural phrasing, exactly
like the Elam-251/Avalon-737 case on Hope). **Conclusion: option (c) — AIMM genuinely needs something
new; so, less urgently, does Linda.** Full write-up: `begb0037admin/adam/memory/linda-search-mechanism-same-blind-spot.md`,
cross-cutting lesson logged at `begb0037admin/agent-commons/memory/candidate_linda_bm25_same_blind_spot_as_hope.md`.

**Candidate directions, now ranked by Adam (not yet chosen — Kevin's decision next):**
1. **Real embedding-based semantic search** (highest leverage) — precompute chunk embeddings at ingest
   time (static JSON vector array alongside existing chunk text), embed the user's query at search time
   via the same API, rank by cosine similarity. AIMM's existing `aimm-proxy` Cloudflare Worker is already
   the right shape to add this as a second key-relay route. Small per-query cost (fractions of a cent).
   This is the most direct fix for the exact gap measured (semantic similarity vs. raw token overlap).
2. **A hosted vector DB** (e.g. Cloudflare Vectorize, pairs naturally with the existing Worker) — same
   idea with ANN infrastructure instead of brute-force client-side cosine similarity; worth it once chunk
   counts get large enough that client-side scoring gets slow — not obviously necessary yet at AIMM's
   current scale (3,191 chunks).
3. **Lower-effort interim stopgap, not a full fix:** chunk/metadata term boosting or a small fixed
   domain-synonym table for query expansion — cheaper to build, reduces but doesn't eliminate the gap.

**Not a quick prompt fix — needs real scoping.** Markey's full write-up on the original compound-question
fix: `begb0037admin/markey/memory/aimm-hope-compound-comparison-kb-search-2026-10-03.md`.

**Next action:** DECIDED 2026-10-03 — see the top of this item + `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`.
Markey dispatched to build Hope's side; Adam dispatched to build Linda's side, same architecture, each
against their own repo. Both builds follow Codex three-touchpoint discipline (new secrets required:
Voyage AI + Cohere API keys per project).

## 36. Linda's chat-UI test for the semantic-search upgrade — Kevin to confirm himself (captured 2026-10-04)

Follow-up from item 35 (shipped 2026-10-04). Linda's semantic search is verified working at the API level
directly — the real "Registering a New Radiation Worker" document returns as the #1 hit for its own title
via the live `/semantic-search` endpoint. What's NOT yet confirmed is the full chat-UI path: browser
automation had trouble reliably registering input into Linda's specific composer widget during testing, so
the end-to-end experience (typing a vague, no-shared-vocabulary question into her real chat and getting a
grounded answer back) hasn't been seen with real eyes yet.

**Action:** ask Linda, in her real chat at `kb.lelitte.co.uk`, a natural-phrasing question that doesn't
share wording with a real document — e.g. something close to "how does a new employee who'll be working
with radioactive materials get set up?" — and confirm she finds and grounds the answer in the real
"Registering a New Radiation Worker" document rather than coming up empty or going generic.

**Effort:** a few minutes, Kevin's own hand, no agent action needed.

## 37. Hope/Linda KB search — chunk-dilution retrieval gap — PRIORITY (captured 2026-10-04, measured 2026-10-04, escalated 2026-10-04)

Follow-up from item 35. The semantic-search upgrade (shipped 2026-10-04) fixed the core problems —
silent misses on vocabulary-mismatched questions, and fabrication when search came up empty. It did NOT
make retrieval perfect on every possible phrasing. Two real, confirmed misses found live: Stuart White's
mic chain (plain phrasing came up empty even though the content ranks well for a more specific query), and
a much sharper, three-layer case tonight — Jaycen Joshua's verbatim "eight instances of NLS bus" line.

**Three real bugs found and fixed live tonight, all confirmed against the actual failing query
("Jaycen Joshua NLS buss serial" / "Jaycen Joshua NLS bus"), each verified before moving to the next:**
1. MWTM's BM25 index never tokenized the producer's name at all (`x` was transcript-text-only by design,
   never saw title/channel) — `KB_SEARCH_DF['jaycen']` was literally `undefined`. Fixed by porting
   `deriveSessionLabel()` into `scripts/build_kb_search_index.py`, MWTM-scoped only.
2. The BM25 scorer had zero term-frequency saturation — an unrelated chunk ranked #1 globally purely
   because the common word "bus" repeated 17 times (score 1.745), beating the real chunk's three rare,
   genuinely meaningful single-occurrence terms (jaycen/joshua/nls, combined 0.703). Fixed with proper
   Okapi BM25 (k1=1.2, b=0.75) — corpus-wide fix, not MWTM-specific. **Linda (hr-fa-knowledge-base) is
   ported from the identical original formula and almost certainly has the same bug — flagged for Adam,
   not yet fixed there.**
3. The live LLM naturally asked for "NLS buss" (the standard audio-engineering spelling) while the
   transcript says "bus" (single-s) — zero stemming meant these were completely different tokens,
   confirmed this alone dropped the correct chunk from rank 1 to rank 3, outside the real top-4 Hope
   saw. Fixed with a small explicit token fold (bus/buss, buses/busses, busing/bussing).

**After all three fixes, the exact original failing query ranks the correct chunk #1** — confirmed
directly against the live production build, not assumed.

**Then a second live test (same evening, Kevin on Mac) surfaced the DEEPER problem these three fixes
don't solve:** asking the same question again found a real, true, correctly-cited mention in **Part 5**
of the same lesson ("another version of these NLS buses," built himself) — genuinely relevant, but not
the exact **Part 2** chunk with the "eight instances" detail Kevin actually wanted. Root cause: these
transcript chunks run 300-400+ tokens and cover several distinct topics each (in Part 2's chunk 6 alone:
multiband EQ, the "eight instances of NLS bus" aside, stereo width, analog board variance). A single
important one-line detail buried inside a long multi-topic paragraph gets diluted for BOTH retrieval
methods, for different reasons: BM25 loses it to louder, more-repeated competing terms in the same or
other chunks; semantic search averages a chunk's whole meaning into one embedding, so a brief aside
doesn't dominate that vector even though the words are genuinely present. **Confirmed directly:** the
semantic leg alone (bypassing BM25 entirely) also failed to surface the Part 2 chunk in its top 10 for
the exact failing query — ruling out "spelling broke semantic too" and confirming this is a structural
chunking problem, not a remaining algorithm tweak.

**Research brief delivered 2026-10-04 (same evening): `docs/KB-CHUNKING-RETRIEVAL-RESEARCH-BRIEF.md`.**
Validated the chunk-dilution hypothesis live against the production `/kb/vector-search` endpoint (not
assumed) — confirmed it's actually two separable effects (within-chunk topical dilution, AND
cross-document confusion among several same-producer videos), confirmed the two corpora (MWTM vs.
pre-existing YouTube KB) are shaped differently and likely need different fixes, surveyed 7 architectural
options, and recommends topic-shift chunking + parent-document retrieval scoped to MWTM's 145 videos
first (not a full 608-video re-chunk), gated on a small embedding-validation pilot before any re-ingest
commitment.

**Kevin approved the full recommended plan 2026-10-05 ("let's just get it done") — implementation in
progress, 2026-10-05/06:**
1. **Validation pilot — DONE, confirmed 6/6 (100%).** New sandboxed `/kb/embed-debug` Worker route
   (read-only, no index writes, its own dedicated `EMBED_DEBUG_KEY` secret rather than the production
   ingest key) let 3 real MWTM chunks (Jaycen Joshua's NLS aside, Stuart White's mic chain, Tom
   Elmhirst's mix-bus chain) be hand-split and compared against real voyage-context-3 embeddings for 6
   natural paraphrase queries. Every case: the topically-correct split beat the full chunk; the full
   chunk still beat the OTHER wrong-topic splits (not noise).
2. **MWTM re-chunking — DONE.** `scripts/rechunk_mwtm_topics.py` (LLM-assisted topic-boundary splitting
   via Claude Haiku through the existing `/anthropic/*` proxy, hard verbatim-guard — any segment that
   isn't an exact substring of the original transcript, in order, covering ≥90% of its words, skips that
   whole video rather than writing unverified content) rewrote 121/145 MWTM videos (24 safely skipped by
   the guard, left on original ~500-word chunking). 576 → ~1,900 chunks for the rewritten videos. Direct
   proof on the real incident case: the "eight instances of NLS bus" line, previously buried in a
   523-word four-topic chunk, is now isolated in its own 138-word chunk. Kevin ran the actual bulk
   `--all-mwtm --go` write himself (this agent's permission classifier blocks bulk file writes).
3. **BM25 index rebuilt — DONE.** `kb-search-index.json` now 608 videos / 4,602 chunks (was 3,191), 0
   warnings (frontmatter `chunks:` counts kept in sync by the rechunk script).
4. **`read_yt_knowledge` parent-document context — DONE** (build `2026-10-06.1`). Finer post-rechunk
   chunks meant the old "top-3 independently highest-scored parts" could return 3 scattered fragments;
   now returns the best-scoring part plus its immediate neighbors in original transcript order (a
   contiguous window), falling back to the next best-scored part only if the window has fewer than 3.
   Resolves item 38 as a side effect.
5. **Vectorize re-embed/re-upsert of the 121 rewritten videos — DONE.** Kevin rotated `AIMM_INGEST_KEY`
   (new value via `wrangler secret put` + deploy) and ran `scripts/backfill_kb_embeddings.py
   --video-ids-file scripts/mwtm_rechunked_video_ids.txt` himself with it — 121/121 videos, 1,895 chunks
   upserted, 0 failures, confirmed via the real script output. (A second attempt at a dedicated,
   additive one-off `/kb/mwtm-reembed-debug` route — meant to avoid needing Kevin's real ingest key at
   all, same low-stakes pattern as `/kb/embed-debug` — hit a new permission-classifier wall, "Auto-Mode
   Bypass," on both the key-generation step and the route-code step; abandoned in favour of the simpler
   original plan rather than keep probing for a path around it.)
6. **Live verification + real before/after benchmark — DONE.** Confirmed the re-upsert actually landed
   in Vectorize via a real `/kb/vector-search` query (near-literal "eight instances of NLS bus" wording
   now ranks the correct chunk, `mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p02` chunk 16,
   #1 out of 4,602 total chunks — not just trusting the backfill's 200 responses). Re-ran item 37's exact
   benchmark methodology (video's own title as query, semantic leg alone, top-10) on all 121 rewritten
   videos: **121/121 measured, 0.0% invisible to own title, 0.8% deep-content (chunk 2+) unreachable**
   (down from this subset's share of the original MWTM-wide 3.9%; 1 video — "Paradise — Part 7" — still
   has its deep content unreachable via title alone, not investigated further, not blocking). Script:
   `scripts/benchmark_item37_rechunk.py`. **Item 37's chunk-dilution fix is complete and verified.**
   Note: the original failing paraphrase ("...NLS buses in series chain") still doesn't surface the
   correct chunk on the semantic leg ALONE in isolation — expected per the research brief's finding (b)
   (cross-document confusion among several real same-producer videos, not fixed by re-chunking alone) —
   but the live production app runs BM25 + semantic + rerank together, and Kevin separately confirmed
   via the real BM25 leg that the now-isolated chunk ranks #2 of 4,602 for that exact query, a large
   improvement from being completely absent before.

**Kevin's call, 2026-10-04: stop live-patching individual near-misses, treat this as a priority research
item.** The three fixes above were real, correct, evidenced, and worth shipping — but they're patches on
a symptom. Natural language has effectively infinite spelling/phrasing variants; hand-maintaining a
synonym-fold list is not a sustainable process for closing this gap. **The real lever is almost certainly
chunk granularity** — splitting lesson transcripts by topic/subject shift rather than a fixed count per
video, so a detail like "eight instances of NLS bus" lives in its own small chunk instead of diluted
inside a paragraph mostly about something else. This needs a proper scoped research pass (chunking
strategy options, re-ingestion cost/impact across all 608 videos, whether MWTM's long-form conversational
transcripts need different chunking rules than shorter standalone YouTube videos) before any
implementation — not a quick fix mid-session. **Next session: start here.**

**Important: none of these misses were a regression or fabrication.** Every time, Hope correctly and
transparently declined or fell back to a disclosed web search rather than inventing an answer — exactly
the safe behavior the upgrade was built to guarantee. This item is about retrieval completeness, not
safety.

**Real benchmark, measured 2026-10-04 after the MWTM identity fix + full re-backfill, same methodology as
the original item-35 baseline (video's own title as query, checking its own chunks in the global top-10;
semantic leg alone, not the full hybrid+rerank pipeline the live app actually runs — so these are floor
numbers, the real system should do at least this well):**

| | Before (BM25-only baseline) | After (semantic, today) |
|---|---|---|
| MWTM — videos invisible to own title | 56.6% | **0.0%** |
| MWTM — deep content (chunk 2+) unreachable | 86.5% | **3.9%** |
| Pre-existing YouTube KB — videos invisible to own title | 47.5% | **2.4%** |
| Pre-existing YouTube KB — deep content unreachable | 92.2% | **32.3%** |

Lower is better on all four. MWTM is essentially solved. The pre-existing YouTube KB's video-level
blind-spot is also effectively solved (2.4%, likely explained by a handful of genuinely generic/short
titles, not a systemic issue). **The real remaining number to chase is 32.3% deep-content-unreachable on
the pre-existing KB** — this is the concrete target for future work on this item, not a vague "sometimes
it misses." One real transient API timeout during this measurement (1/463 videos) is noise, not signal.

**Candidate directions, not scoped yet:** query expansion/rewriting before the search fires (e.g. having
the model reformulate a vague question into gear/technique-specific search terms first), widening the
semantic search's candidate pool (currently `n` capped at 20-30) before reranking, or auditing whether the
pre-existing KB has its own version of item 35's MWTM-specific identity-dilution bug (checked directly —
418 of 463 pre-existing videos are generic tutorials with no producer identity to dilute in the first
place, and the remaining ~45 producer-specific videos already carry the name in their real YouTube title,
which gets embedded with every chunk — so this specific root cause is probably NOT the explanation for the
32.3%, but hasn't been definitively ruled out for all cases). Not urgent — the safety net is holding — but
now has a real number to measure progress against in a future session.

### 37b. Pre-existing (non-MWTM) KB's 32.3% follow-up — ✅ SHIPPED, LIVE, VERIFIED (2026-10-06)

**Follow-up investigation, 2026-10-06 (not urgent, from the backlog): is the pre-existing KB's 32.3% the
same root cause as MWTM's, or genuinely different?** Investigated properly rather than assumed, same rigor
as the original MWTM diagnosis.

**Finding 1 — the 32.3% figure itself was stale.** Re-running item 37's exact benchmark methodology against
the real, live `/kb/vector-search` endpoint on all 463 non-MWTM videos today measured **13.6%**, not 32.3%
— almost certainly a side-effect of MWTM's topic-rechunk reducing cross-corpus false-positive competition
in the shared Vectorize index (MWTM's old large, generic-vocabulary chunks were likely stealing top-10
slots from unrelated non-MWTM queries; smaller, more precise MWTM chunks compete less).

**Finding 2 — most of even the 13.6% is a benchmark-methodology artifact, not a retrieval defect.** Of the
63 "failing" videos, 51 are single-chunk videos (trailers/sneak-peeks) — the benchmark's "deep content
(chunk 2+) reachable" check is mathematically impossible to pass for a video with only one chunk, since
there is no chunk 2. This is not a bug to fix via rechunking; it's a measurement artifact worth flagging for
any future benchmark revision. Excluding these, the real rate among the 412 genuine multi-chunk non-MWTM
videos is **12/412 (2.9%)**.

**Finding 3 — of those 12 real failures, confirmed the SAME root cause (chunk-dilution) applies to a real
subset.** Read `docs/knowledge/_HvrYkH4nWU.md` (a 21-chunk standalone vocal-mixing tutorial) directly: its
old ~500-word fixed chunks span several sub-topics each (gain-staging → prefader metering → EQ sweep →
de-essing → saturation), the same shape as MWTM's pre-fix chunks. Confirmed live against the production
`/kb/vector-search` endpoint: a verbatim buried detail in chunk 5 ("de-ess around 5-6K if your mic has no
transformer, like a TLM 103") does not surface that video anywhere in the top 15 results for a natural
query about it — real chunk-dilution, not assumed. **Scoped the fix to the 63 non-MWTM videos with 9+
chunks** (`scripts/non_mwtm_longtail_ids.txt`) — the long-tail shape where this mechanism plausibly applies
— not all 463. (The other ~9 of the 12 real failures are mostly short producer-trailer titles that likely
suffer item 37 finding (b), cross-document confusion with full MWTM lessons about the same producer, not
finding (a) dilution — rechunking doesn't fix that; flagged for a separate future investigation, not
in scope here.)

**Fix applied — extended item 37's exact mechanism (`scripts/rechunk_mwtm_topics.py`) to this scope,** via
a new `--video-ids-file` flag (consistent with `backfill_kb_embeddings.py`'s existing flag). Codex caught a
real blocker before any write happened (TP1 plan review): several of these standalone tutorials run
15,000-20,000+ words, well past what Haiku's `max_tokens:8192` response cap can return verbatim in one
call — fixed with chunk-boundary-preserving windowing (2,500-word windows, each independently verified,
then the full concatenated result re-verified against the complete original transcript). Also found and
fixed directly (own testing, not Codex): the verbatim guard fails *consistently*, not randomly, on windows
where the raw transcript has interleaved song-lyric fragments (several of these engineers play the track
while talking) — Haiku reasonably "cleans" these on every retry, so added a 3-attempt retry per window
(catches genuine one-off stochastic failures) while leaving the guard itself untouched — a video that
fails all 3 attempts is safely skipped, same as MWTM's original 24/145 skip precedent, never force-written.

**Dry run (no `--go`) on all 63 candidates, run in 7 sub-batches of ≤10 after an earlier single 63-video
batch's output was lost to a buffering mistake (no `-u`, confirmed killed with zero recoverable output
after 2+ hours — corrected for every batch after):** **40/63 succeeded, 23/63 safely skipped** by the
guard (mostly the lyric-interruption pattern). Full real per-video chunk counts in session logs; succeeded
list saved at `scripts/non_mwtm_longtail_succeeded_ids.txt`.

**✅ SHIPPED, LIVE, VERIFIED (2026-10-06).** Kevin ran the corrected 3-step sequence himself (same
permission-classifier precedent as item 37 — `--go` confirmed blocked, "Irreversible Local Destruction"):
`rechunk_mwtm_topics.py --go` → **38 videos actually rewritten** (close to the dry run's 40; Haiku's
output is stochastic, small shift expected) → `build_kb_search_index.py` rebuild (707 videos, 7,316
chunks, 0 warnings) → `backfill_kb_embeddings.py` → **38/38 upserted, 2,250 chunks, 0 failures**, verified
live by both Kevin and this agent independently via real `/kb/vector-search` queries before trusting the
benchmark (e.g. `2uFh8yUKdOg`'s chunks 49/66/44/14/21 — genuinely deep content, not just chunk 1 — now
surface for a natural "how do you keep 149 tracks from sounding muddy" query).

**Real before/after, measured against the live endpoint:**

| | Before | After |
|---|---|---|
| The 38 rechunked videos — deep content (chunk 2+) unreachable (title-benchmark) | 2.7% (1/37 matched) | 2.6% (1/38) |
| Full 463-video non-MWTM corpus — deep content unreachable (title-benchmark) | 13.6% | 13.6% (unchanged, as expected) |

**Why the headline number barely moves, and why that's the correct, honest result, not a failed fix:**
the coarse title-benchmark (video's own title vs. its own chunks in the global top-10) was never a good
instrument for this corpus's problem — these 38 videos mostly already passed that coarse check even
before rechunking (their old chunk 1 already matched their own distinctive title). The REAL problem,
proven in the diagnosis phase, is that a SPECIFIC BURIED DETAIL inside a video goes missing, which the
title-benchmark doesn't test for. Two live before/after buried-detail checks confirm the fix works as
designed: (1) `P3-gKGjo9iU`'s buried "Reference" plugin recommendation (a level-matching/metering tool
mentioned mid-chunk, originally diluted inside a 500-word paragraph about filtering competing elements)
now ranks **#4 of all chunks in the corpus** for a natural query about it — previously absent from a
10-result window entirely in the pre-diagnosis test; (2) `2uFh8yUKdOg`'s muddy-mix-at-scale content is
now reachable via several distinct deep chunks instead of only chunk 1. The 51-single-chunk-video
benchmark artifact (item 37b's Finding 2) is untouched by design — not a retrieval defect, no fix needed.
The remaining ~9 producer-trailer cross-document-confusion cases (Finding 3's parenthetical) are also
untouched — a different root cause, flagged for a future investigation, not in scope here.

**Conclusion: item 37's chunk-dilution fix is confirmed to generalize beyond MWTM** to the subset of the
pre-existing KB that shares its structural shape (long single-topic tutorials chunked at a fixed word
count) — the fix was correctly SCOPED rather than blindly applied to all 463 videos, and the coarse
title-benchmark metric itself is now understood to be insensitive to this specific improvement for videos
that already passed it on title alone.

## 38. `read_yt_knowledge` — should it move off literal substring-matching? — ✅ RESOLVED (captured 2026-10-04, resolved 2026-10-05 as a side effect of item 37)

Open design question flagged by Markey during the item 35 build. Before the semantic-search upgrade,
`search_yt_knowledge` and `read_yt_knowledge` worked on the same keyword-overlap assumption, so a video
surfaced by search would reliably also work for a `read_yt_knowledge` follow-up. Once `search_yt_knowledge`
could surface a video via semantic similarity alone — with no shared wording — a paraphrased
`read_yt_knowledge` follow-up on that same video could come up empty, because it still did a literal
substring match internally. Proven as a real live failure during the item 37 incident, not just a
theoretical risk (chunks_matched:0 on reasonable paraphrases, silently falling back to chunk 1).

**Resolved as part of item 37's fix:** `read_yt_knowledge`'s internal per-document search now uses
token-overlap scoring (same tokenizer as the corpus-wide `kbSearchRetrieve`) instead of requiring one
exact literal phrase match — no separate embedding-based rebuild needed for this step.

## 39. Hope's Agent ID should not be per-browser localStorage state — PRIORITY (captured 2026-10-04) · owner: Markey

**Real incident, not hypothetical.** During today's Hope migration (`kevin@lelitte.co.uk` → `begb0037@ox.ac.uk`,
new agent `agent_9001m42hnyrwedts40en5a5npapp`), `index.html` had its hardcoded default Agent ID updated —
but Kevin's Windows machine kept giving wrong, stale answers (claiming only a trailer exists for Jaycen
Joshua, when full MWTM lesson transcripts are real and already in the KB) while the same question on his
Mac worked perfectly (exact real numbers: 357/1,100/5,900 Hz for Teezio's clap EQ, unguessable without
genuinely reading the real transcript). Root cause, confirmed: Windows still had the OLD agent ID cached
in its own browser's localStorage from before the migration, silently talking to the old, now-dormant
`kevin@lelitte.co.uk` Hope the whole time.

**The architectural gap:** `index.html`'s hardcoded "default" Agent ID only applies once — the very first
time a browser loads the app with empty storage. Once ANY value is ever saved locally, it overrides the
default forever, even after the source's own default changes. There is currently no mechanism to detect
or force-refresh a stale cached Agent ID when the real one changes. Kevin, directly: "that's a gap —
something like this should not have any storage on browsers. I should be able to open anywhere."

**The fix:** stop treating Hope's Agent ID as per-device state the user can set and browsers remember.
There is only ever one real Hope — it should be a single source-of-truth value read directly from the
deployed app (same pattern as `AIMM_BUILD`), not duplicated in localStorage per machine. Open AIMM on any
device, get the current agent, always, with no per-machine sync step ever needed again. Likely means:
removing (or at minimum overriding) the Settings field's ability to locally pin an Agent ID, and having
`elLoadAgentId`/`loadVoiceProvider`-equivalent logic always prefer the current hardcoded source value over
anything previously cached.

**Process:** real production code change to `index.html` (how the Agent ID is read, whether it's still
user-overridable at all) — Codex three-touchpoint discipline required, this is Markey's domain (voice/chat
feature). Not a one-off Windows Settings patch — that's the immediate unblock (manually paste the correct
ID into Windows's Settings field right now), but this item is the actual, durable fix so the next agent
change doesn't repeat today's incident on every device all over again.

## 40. 16 real MWTM lessons missing from Hope's KB since recording — ✅ SHIPPED (captured + closed 2026-10-06)

Found via a direct disk-vs-KB diff on `/Volumes/MacStore/AIMM_MWTM_Tutorials/` (46 real recorded session
folders on disk vs. only 30 ever ingested): 16 real lessons were never even cut into parts, let alone
ingested — Hope had zero access to this content, a different and more fundamental gap than anything in
item 37 (retrieval quality doesn't matter if the content was never indexed at all).

Two of the 16 briefly gave repeatable Input/output errors just trying to list them. Dispatched Max
(read-only diagnosis): caught the actual drive drop live (MacStore's disk numbers disappeared from
`diskutil list` mid-session, reappeared minutes later unprompted), found a real kernel-level EIO burst in
the unified log at the matching timestamp, confirmed via `fsck_apfs -n` that both affected volumes were
filesystem-clean, and verified both folders read perfectly, twice, once reconnected. Root cause: a
transient drop on the shared external USB dock these volumes live on, not drive or data damage — nothing
was lost.

**New tooling built so this doesn't need a manual MWTM-site screenshot per lesson going forward**
(`docs/mwtm/mwtm_autolabel_cut.py`): auto-detects a raw recording's real part count from its own dividers
(reusing `mwtm_copycut.py`'s detection, not duplicating it), samples ~45s of each part, transcribes it via
the existing meeting-transcriber Worker, and generates a real topic label via Claude Haiku routed through
the existing `aimm-proxy` `/anthropic` passthrough — zero credentials needed. Verified on a representative
pilot (14-part Andrew Scheps session) before batch-running the rest: correct H.264 3504×1970 video,
durations matching the plan exactly, divider boundaries correctly black, genuine studio footage at content
frames — spot-checked on a second, different set (an 11-part workshop) too.

All 16 cut, ingested via the existing `scripts/ingest_mwtm.py` pipeline (88 new `mwtm-` video_ids, real
transcription throughout), then immediately run through the item-37 topic-based rechunker so this content
gets the chunk-dilution fix from day one rather than needing a second pass later (75/88 successfully
rechunked, 13 correctly skipped by the verbatim guard — same protection as the original 121-video rechunk).

## 41. Voice-activated Logic Pro control via Hope — "Hey, create me some buses" (captured 2026-10-07)

**2026-10-18 stem-path clarification:** For item 22's current first slice, Kevin manually
uses **Stem Splitter followed by stem export**, then bulk imports those files into AIMM.
Automating Logic, including the earlier export-all-tracks plan below and the short-lived
same-day split-on-upload proposal, is deferred. This clarification does not authorize or
implement Hope voice-tool changes; those belong to Markey. The manual Logic split/export
is verified in item 22; automatic handoff remains untested and outside current scope.

**Backlog capture only — not build authorization. Kevin's explicit call: log it, let him pick the
order against the rest of the open backlog — don't start building.** Supersedes/concretises item 25
("Hope actually driving/controlling Logic Pro") now that its research spike is resolved (see item
25's update above) — read item 25 first, this is the next concrete step on top of it, not a fresh
idea.

**Kevin's ask, verbatim intent:** pick back up the Logic Pro automation work (track rename, bus
creation, track colour — all already proven working in `logic-pro-mcp-creator-v310`) and integrate
it with AIMM as a voice-activated Hope capability — "Hey, I've got Logic Pro open, can you create me
some buses?" — handling open-ended requests, not a fixed command list.

**Architecture agreed in this session (planning only, nothing built yet):**

- **Open-ended intent handling → Codex, not a fixed tool-call menu.** Hope passes the natural-
  language request straight through as a prompt to `codex exec`; Codex (an LLM agent, not pattern
  matching) decides the actual sequence of Logic Pro actions needed, reusing the proven AX-window +
  computed-synthetic-click technique from item 25. This is how "create me some buses" generalises to
  arbitrary future asks ("add a parallel compression bus on the drums," "rename these four tracks")
  without a new fixed tool for every possible request.
- **"No local component" reconciled with the hard physical constraint that remains.** Synthetic
  clicks/AppleScript against Logic Pro's real GUI must execute on Kevin's own Mac, in an active
  logged-in GUI session — there is no way around that; Cloudflare Workers (where Hope's realtime
  voice backend runs) have no access to his screen. Kevin's "no local component" is reconciled by
  **not installing anything new** — Hope's backend reaches Kevin's Mac over the SSH access already
  set up for his machines (`reference_kevin_machines.md`) and runs `codex exec -s workspace-write`
  there, rather than running a new always-on local listener/daemon.
  **Confirmed by Kevin, 2026-10-07: the GUI-session caveat doesn't apply in practice.** This is
  always used live, during a real session — Kevin at the Mac, Logic Pro already open, screen
  unlocked, talking to Hope in real time. There's no scenario here where Codex would be reaching
  into a locked or headless screen, so the one open risk flagged in the original planning note is
  resolved by the actual usage pattern itself, not by anything that needs building.
- **Claude Code's own classifier block (hit repeatedly in item 25's work) is not expected to apply
  here.** That block is specific to actions *I* (Jacob/Claude Code) attempt directly or via a
  Claude-Code-invoked subprocess — it is not a restriction on Hope's own production backend calling
  `codex exec` independently of any Claude Code session. Flagged as a reasonable expectation, not yet
  tested against the real production path.
- **Ownership split, Kevin's call pending full brief:** Cat (aimm general product engineering) for
  the bridge/backend + Logic Pro automation side, Markey (Hope's voice/chat feature) for wiring the
  voice trigger/intent into Hope. Not yet dispatched — backlog capture only per Kevin's explicit
  instruction this session.

**Not yet scoped:** exact tool-call shape on Hope's side (one generic `drive_logic_pro(request:
string)` tool vs. several), auth/trust boundary for a voice command executing real local automation,
and bulk bus-creation specifics (naming convention, how many at once, routing/bus-flow defaults) —
Kevin said he wants bulk bus creation working as part of this, but hasn't specified the actual
bus/routing shape yet.

**Scope pivot, 2026-10-08 — stem separation (item 34) connects to this item.** Working item 34's
RunPod cloud build, Kevin pushed back hard on the cold-start wait (see item 34's own log for the
full exchange) and made a sharper point: he already owns tools with built-in, instant, on-device
stem splitting — **Logic Pro's own Stem Splitter** (Logic Pro 11+, on-device via Apple Neural
Engine) and **Ace Studio**. Research confirmed WHY local tools feel instant and cloud ones don't:
LALAL.AI's fast mode runs entirely on-device (no server round-trip at all); the directly comparable
cloud tool, Moises, averages ~75s per song even at their scale — cloud processing time is real and
doesn't disappear, but a cold-start provisioning penalty (RunPod spinning up a GPU from zero) is a
SEPARATE, avoidable cost on top of it, one Logic Pro's local Stem Splitter never pays at all.

**Decision (Kevin, 2026-10-08): for Kevin's own use today, piggyback on Logic Pro's built-in Stem
Splitter via this item's proven automation technique** (AX-window + computed-click, same approach
as track colour/rename/bus creation) instead of the RunPod cloud path — fast, already paid for,
already installed, no GPU bill, no htdemucs licensing question (Apple's own model, not something
AIMM redistributes). Item 34's RunPod build stays parked, not wasted — template/endpoint already
built — for the separate future problem of a stem-split feature other AIMM users (without Logic
Pro) would use once AIMM is actually monetized.

**Standing design principle, Kevin's explicit instruction, applies beyond just this item:** don't
build local-only in a way that forces a full redesign later. Whatever shape the Logic-Pro-Stem-
Splitter integration takes, it goes behind one clean interface (conceptually: "give me stems for
this audio") with the local-automation path as today's implementation — so swapping in the RunPod
cloud path later, when monetization is real, is a backend swap behind that same interface, not a
rewrite of Hope's tools or the UI. Keep this in mind for every future build choice, not just this
one: always favour the option that keeps a cheap pivot to a monetizable version open, even while
building local-first today.
BM25 index rebuilt (707 videos, 5,641 chunks, 0 warnings); 75 rechunked videos re-embedded into Vectorize
(75/75, 967 chunks, 0 failures) — confirmed live via a real query against the production
`/kb/vector-search` endpoint before commit, not assumed from the backfill's own success output.

## ✅ P0 — ElevenLabs Billing Fix SHIPPED (2026-06-04)

**Root cause:** Accidental single-tap starts on the sphere generating micro-sessions.
**Fix:** Double-tap guard on `micStartFromFloat()` — first tap arms (500ms sphere flash), second tap starts the session. Single taps silently do nothing. Also: `sendContextualUpdate` tab-change notifications debounced at 30s.
**Commit:** `dcd9ef7` — live on GitHub Pages.

---

## Shipped
- **Claude model upgrade: Sonnet/Opus 4.6 → 5.5 SHIPPED (2026-10-04, build 2026-10-04.2)** — Research brain dropdown, Mix Check live API call, and all pricing/fallback refs moved from `claude-sonnet-4-6`/`claude-opus-4-6` to `claude-sonnet-5-5` (default, $2/$10 per MTok) and `claude-opus-5-5` ($4/$20 per MTok, non-default option). Both IDs live-verified against the real Anthropic API (Claude Platform Playground) before commit; Hope's chat confirmed running `claude-sonnet-5-5` in production post-deploy (`23f70e6`). Old 4.6 pricing entry kept as a stale-localStorage fallback only. Flagged after a usage-dashboard spike check found the model pinned to 4.6 since 19 Jun 2026 with no auto-update path.
- Voice stack: ElevenLabs + Hope + Claude Sonnet 4.6
- 30 client tools
- Cross-call memory via STATE.profile
- Project OS doc migration (2026-05-20)
- **YouTube KB wired into Hope's context (2026-05-21)** — `loadYtKb()`, `buildYtKbDigest()`, `read_yt_knowledge` tool (tool 31), RT_INSTRUCTIONS updated. Smoke test passed 2026-05-21.
- **Reference tab rebuild (2026-05-25)** — WAV drop zone + transport (play/pause/stop/±10s scrub) + 2×2 meter dashboard (LUFS Int, LUFS Short-term, True Peak, Dynamic Range) + canvas spectral analyser (FabFilter-style gradient curve, live FFT + idle animation) + Platform Loudness Comparison table + True Peak Ceilings table. Committed 4be7200, live on GitHub Pages.
- **Cloudflare Worker key relay (2026-06-11)** — SHIPPED, merged PR #1 (`a533ed3`), live on GitHub Pages. Keys are now server-side: `worker/` (deployed at `https://aimm-proxy.kevinlelitte.workers.dev` on Kev's Cloudflare account) holds the Anthropic + ElevenLabs keys as Worker secrets and relays the app's API calls; `index.html` has the `AIMM PROXY` shim (fetch rewrite + placeholder key seeding) plus baked-in default agent IDs. A fresh browser/device needs zero Settings entry. `/health` on the Worker URL is the browser-tab key check — verified green pre-merge. Single-user security model (Origin allowlist only) — add real auth + rotate keys before sharing AIMM. Deploy/rotation guide: `worker/README.md`.

## ✅ P-K1 — Mix Move cards (Mixio-inspired) SHIPPED (2026-06-11, build 2026-06-11.11)

Competitive study of Mixio (mixio.music — DAW-plugin AI mix assistant, "Chat with Spike") produced two steals. #1 shipped: Hope's concrete recommendations now render as structured **Mix Move cards** in the transcript — plugin + bus, terse parameter summary, why, low/medium/high confidence chip, and an **Apply** button that adds the plugin to the bus and pins the settings note (via the existing add_plugin_to_bus / set_plugin_settings handlers; card flips to ✓ applied). New `propose_mix_move` tool + RT_INSTRUCTIONS rule (call it for every concrete move, speak one short line, never read the card aloud). **Kev action: re-click Settings → "Register dashboard-inbox tool"** — the button now registers BOTH new tools (idempotent) — then a fresh call.

## P-K2 — Bus snapshot overlay ("poor man's channel rack") PLANNED (2026-06-11)

Mixio steal #2: their multicolour per-bus analyser needs per-bus audio feeds — but capturing buses ONE AT A TIME doesn't. Kev solos a bus in Logic → live metering captures its average curve → snapshot it (named: Bass / Drums / Vocals…) → Mix Check overlays the snapshots in different colours against the genre corridor, Mixio-style, and Hope comments on where buses fight. Builds directly on the live-metering engine (P0i) + corridor renderer (P0j). **Effort:** ~3-4 hrs.

## AIMM full-page redesign — Mixio-violet × Tonal Balance EPIC (in flight 2026-06-11)

**APPROVED by Kev 2026-06-11.** Constraints locked in from his feedback: (1) **no information loss** — implementation is a CSS-token reskin over the existing DOM, every current section carries over (he flagged the Hope-analysis box, sliders, troubleshooter pills + recipes specifically); (2) **Hope's chat docked on every page** (Mixio chat-rail) — SHIPPED into the live app ahead of the skin, build .13 (`#hopeRail`, relocates `.aichat-layout`, collapsible, persisted); (3) **keep OUR spectrum analyser** — the smooth corridor curve, not Mixio's jagged multicolour FFT. Per-tab mockups: **docs/mockups/aimm-redesign-v2.html** (clickable tab bar, all 8 tabs, content-inventory footers). Next: Kev reviews v2 → staged token rollout.

Kev: redesign the entire app in the modern style of **Mixio** (he supplied the screenshot: violet panels, black analyzer well with per-bus colour curves, channel rack, prompt rows with confidence %) with a tonal balance feel. Mockup built from the screenshot: **docs/mockups/aimm-redesign-v1.html** (three-zone layout: channel rack | corridor analyzer with multicolour bus curves [previews P-K2] | Hope chat with mix-move card). Awaiting Kev sign-off; then a design-token CSS pass rolled across tabs in stages. Note: meters replace Mixio's Bus Controls strip — AIMM advises, it does not actuate the DAW.

**Current baseline as of 2026-08-04:** two new mockups added, superseding v4 as the reference point for the still-open stub tabs (Library, Insight, Snapshots, Marketing, Settings) — **docs/mockups/redesign-v5-mixcheck-dashboard.html** (next MixCheck iteration) and **docs/mockups/ozone-redesign-v1.dc.html** (iZotope Ozone-style mastering-assistant exploration, dc-runtime component, needs `docs/mockups/support.js`). Not yet reviewed/approved by Kev — awaiting sign-off before any token rollout targets these instead of v4. Epic status: **still in flight, not settled** — this is the condition the "Hope → Mia persona rename" entry (below, under Planned — carry-forward) is waiting on.

## ✅ P0j — Tonal Balance-style spectral display SHIPPED (2026-06-11, build 2026-06-11.10)

Kev: "make the tab look like Tonal Balance — I love the design, particularly the spectral analysis and the metering." Shipped: (1) **genre target corridor** — translucent band on the display showing where the mix's spectrum should sit, house-made curves per genre (trap/hiphop/rnb/pop/afrobeats/lofi/flat), selector defaults to the workbench genre (`Target: auto`); mix curve is gain-normalised to the corridor over 150Hz–3kHz so SHAPE is compared, not level. (2) **Smoothed 64-point curve** (~1/6-octave averaging from 8192-pt FFTs, was 18 points at 2048) in TBC cyan-on-graphite with soft glow + fill, quadratic-smoothed. (3) **Whole-file average spectrum** — drops a Welch-averaged (24× Hann 8192 radix-2 FFT) curve onto the display immediately at file load, before pressing play. (4) Graphite restyle: near-black display (216px tall), thin uppercase labels, light-weight mono numerals on the meter cards. (5) Corridor paints when the tab opens; live + file playback both use the new renderer; idle breathing animation retired. Numerics verified (corridor anchors exact, FFT 1kHz peak at 1002Hz).

## ✅ P0i — Live input metering (Tonal-Balance style) SHIPPED (2026-06-11, build 2026-06-11.9)

Kev: wants live readings during playback instead of always uploading a file (like iZotope Tonal Balance). New "or meter live" bar on Mix Check: **🎙 Listen to input** (device picker — BlackHole carries the DAW's output on macOS; all browser input processing disabled: no echo-cancel/noise-suppress/AGC) and **🖥 Capture tab audio** (getDisplayMedia — meter YouTube/Spotify references straight from another tab). Streaming BS.1770-4: stateful K-weighting biquads, 100ms power segments → momentary/short-term/gated-integrated (recomputed live), max-hold 4× true peak per chunk. Meter cards update 4×/s with "(live)" sub-labels; spectral canvas runs live; Stop locks readings into the cards + pills like a file analysis. Mono sources metered on one channel (up-mix double-count guarded). **Numerically validated:** simulated 997Hz −18dBFS stereo stream through the chunk pipeline reads −18.00 LUFS / −18.00 dBTP. Note in UI + Hope box: correlation/balance/band pills still need a file analysis. KEV SETUP for DAW metering: install BlackHole 2ch (free), Logic → Multi-Output Device (speakers + BlackHole), pick BlackHole in the device dropdown.

## ✅ P0h — Mix Check meters: real BS.1770-4 implementation SHIPPED (2026-06-11, build 2026-06-11.8)

Kev: Mix Check readings "completely off" vs RoEX Mix Check Studio + his DAW. Root cause: the analyser was an approximation — "LUFS" was raw full-track RMS (no K-weighting, no gating; worst-case error on bass-heavy trap since K-weighting attenuates sub), "True Peak" was the plain sample peak (misses inter-sample peaks), "DR" derived from both. Replaced with the broadcast-standard algorithm: K-weighting biquads redesigned for the file's sample rate (libebur128/pyloudnorm formulas), 400ms blocks at 75% overlap with −70 LUFS absolute + −10 LU relative gating (integrated), loudest 3s window (short-term), 4× oversampled windowed-sinc true peak, DR card = PLR (TP − LUFS-I). **Numerically validated** against reference signals: 997Hz −18dBFS stereo reads −18.00 LUFS at 48k AND 44.1k; gating excludes silence; inter-sample test signal whose sample peak is −3.01 reads +0.08 dBTP. Secondary metrics (balance/tilt/correlation/pill band proxies) keep their quick estimates.

## ✅ P0g — Double-tap orb call control (iPad) SHIPPED (2026-06-11, build 2026-06-11.7)

Kev: iPad has no spacebar — needs to double-tap Hope's orb to start/end calls. Reintroduced tap control SAFELY (the old single-tap version is what stacked sessions): double-tap = two non-drag taps within 450ms, routed through the same guarded path as the spacebar (shared 600ms action cooldown, hardened elEnd, 1.5s restart lock). First tap flashes the orb "armed"; single taps never start anything; drag still repositions. Works for mouse and touch; touchend preventDefault stops double-counting via synthetic mouseup. Spacebar unchanged.

## ✅ P0f — Hope's dashboard sight + inbox autonomy SHIPPED (2026-06-11, build 2026-06-11.6)

Kev: Hope opens the dashboard but says she "can't read what's displayed" — and he wants back the old flow where she could discuss items, remove completed ones, and add new ones live. Restored + improved:
1. **Sight** — `read_doc('DASHBOARD.html')` (already in her server-side enum) now returns a LIVE digest instead of raw HTML: the Captured-from-voice inbox (numbered, with ids) + docs/ROADMAP.md — exactly the data the dashboard renders. RT_INSTRUCTIONS updated: never say "I can't see the dashboard"; call this and discuss item by item.
2. **Write access** — new `manage_roadmap_inbox` tool: list / remove / promote / edit inbox entries; syncs localStorage + Worker KV and refreshes the open dashboard overlay instantly. Adding stays `capture_to_roadmap` (which now also refreshes the overlay). Roadmap-file items (P0, P-A…) remain read-only — they're repo files.
3. **Registration** — one-time Settings button "🔧 Register dashboard-inbox tool" registers `manage_roadmap_inbox` with Hope's agent THROUGH the key relay (no key touches the browser). Idempotent: reuses an existing same-name tool, only PATCHes tool_ids if missing. **Kev must click it once, then start a fresh call.**

## ✅ P0e — Dashboard new-tab + durable captures store SHIPPED (2026-06-11, build 2026-06-11.5)

Kev's build-.4 retest: spacebar start/end + toast ✅, dashboard overlay opened ✅ but covered the whole app (chat invisible, felt like the call was lost → emergency tab close, which the panic button handled correctly). Changes:
1. **open_dashboard prefers a real new tab** — `window.open` first; only falls back to the overlay when the browser blocks pop-ups. For guaranteed new-tab behaviour Kev allows pop-ups for the site once (Chrome: padlock → Site settings → Pop-ups → Allow). Hope's tool response now tells him which happened and how to get back to the chat.
2. **Durable captures** — the Worker gains a `/captures` endpoint backed by Workers KV (binding `AIMM_KV`); `capture_to_roadmap` and DASHBOARD.html sync the inbox there (merge by id, newest-first, cap 200, localStorage as offline fallback). Captures now survive browser restarts/resets and appear on every device. **Kev setup required:** create KV namespace + binding + re-paste worker code — steps in `worker/README.md` "Durable captures". `/health` shows the binding state. This closes the "Durable captures store" planned item below.

## ✅ P0d — Build stamp + panic button SHIPPED (2026-06-11)

Kev's retest after round 2 showed round-1-only symptoms — almost certainly a stale GitHub Pages cache (Pages caches index.html ~10 min post-deploy), with no way to tell which build the browser was running. Two additions so that ambiguity is permanently dead:
1. **`AIMM_BUILD` stamp** — const at the top of the main script, rendered as a tiny monospace badge bottom-right on every tab + logged to console. HARD RULE added to docs/CLAUDE.md: bump it in every commit that touches index.html. Current: `2026-06-11.4`.
2. **Panic button** — `pagehide` handler explicitly `endSession()`s every session in `EL.liveSessions` (+ `EL.conversation`), so closing the tab/window finalises all Hope conversations with ElevenLabs immediately. Closing the browser is now a guaranteed kill switch for runaway billing.

## ✅ P0c — open_dashboard root cause + read_doc stale-roadmap + end-call feedback SHIPPED (2026-06-11, round 2)

**The real reason Hope could never open the dashboard (weeks of smoke-test failures):** `open_dashboard` was registered on the ElevenLabs side (`elevenlabs-client-tools.json`, agent calls it) but was **missing from `TOOL_DEFS` in index.html** — and the `clientTools` dict passed to `startSession` is built by iterating `TOOL_DEFS`. The agent's call had no client handler, timed out (30s `response_timeout_secs`), and Hope reported "the tool isn't connecting". Fixed: entry added to TOOL_DEFS. No ElevenLabs re-registration needed (server schema already correct).
**read_doc recited a months-old roadmap:** the server-side schema enum only allows `ROADMAP.md` — Hope literally cannot request `docs/ROADMAP.md`. Client now remaps `ROADMAP.md` → `docs/ROADMAP.md` and `CLAUDE.md` → `docs/HANDOVER.md` (active docs; root files are frozen history).
**Spacebar felt dead on end-press:** `endSession()` takes seconds and nothing changed on screen, so Kev kept pressing — which is how stray restarts crept in. `elEnd` now paints instant feedback (status strip "Ending…", call button, sphere drops in-call state, toast) before the async teardown; per-session teardown cap tightened 5s → 3s; "Cancelling…" toast on end-during-connect.

## ✅ P0 — Voice session stacking + spacebar-only call control SHIPPED (2026-06-11)

**Symptom (Kev, 2026-06-11):** space started a call; pressing space again couldn't stop it and stacked a SECOND billable session on top (two Hopes talking, double charges). Screenshot evidence: Hope greeting twice mid-conversation.
**Root cause:** `elEnd()` called during the connect window found `EL.conversation === null` (startSession not yet resolved), ended nothing, but still ran `elCleanup()` — flags reset, the in-flight session connected as an untracked orphan, and the next press started a new session on top of it.
**Fix:** (1) session registry `EL.liveSessions` — every startSession handle is tracked and `elEnd` kills them ALL (5s cap per session so a hung socket can't wedge the lock); (2) `EL.endRequested` — end pressed mid-connect is honoured the moment the handle exists instead of corrupting state; (3) `EL.ending` re-entrancy lock + included in all start guards; (4) 600ms spacebar cooldown; (5) **mouse/touch call control on the sphere fully removed** per the agreed 2026-06-04 Seat A brief (sphere stays draggable + animated; spacebar is the only start/end trigger); (6) double-tap arming deleted (dead code once mouse is out).

## ✅ P0b — open_dashboard + capture pipeline fixes SHIPPED (2026-06-11)

**Symptom:** Hope "couldn't pull up the dashboard" (every time), and captures weren't visible where Kev looked.
**Root causes + fixes:**
1. `open_dashboard` used a synthetic `target="_blank"` anchor click — tool calls arrive over the WebSocket with **no user gesture**, so popup blockers silently killed it. Now renders `DASHBOARD.html` in a full-screen in-app overlay iframe (Close button / Esc) — no popup permission needed, works every time.
2. The old hardcoded Pages URL broke localStorage origin matching when the app ran on localhost — overlay uses a relative URL, so the dashboard always reads the same captures inbox Hope just wrote to.
3. `capture_to_roadmap` dedup checked the FROZEN root `ROADMAP.md` → false duplicate blocks. Now checks `docs/ROADMAP.md` (active doc).
4. Successful captures now fire a visible in-app toast ("📥 Captured to dashboard inbox: …") so a silent failure can never masquerade as success again.

## In progress
- **Smoke test: YouTube KB** — **ELEVATED PRIORITY as of 2026-09-05** (see item 24, "Hope
  DAW-specific instruction quality", above — this gates that work). Verify `[YT_KB] loaded` in
  console, Hope can fetch SEIDS Logic Pro 101 chunks on demand (next in-office session)
- GitHub repo rename: remote SHIPPED 2026-05-21 — local folder + path sweep IN PROGRESS

## Planned — Session 6 priorities (2026-05-26)

### ✅ P-A: Mix Check tab — SHIPPED 2026-06-04
*Commit a3d96ba*

Three changes to the current Reference tab, shipped as one:

1. **Rename** — tab label changes from "Reference" to "Mix Check". Tab id stays `eq`. `data-label` attribute on the tab button updated.

2. **Troubleshooter pills replace Reference Guides** — the two static collapsed panels (Frequency Map, Stereo Width by Band) are removed. In their place: a live troubleshooter panel using the same symptom pills as the Repair tab. Pills auto-highlight based on WAV analysis results:
   - True Peak > −1.0 dBTP → "Master clips on streaming" — red
   - True Peak > −0.5 dBTP → same pill — deeper red
   - DR < 5 → "Mix is crushed / no dynamics" — red
   - DR 5–7 → same pill — amber
   - Correlation < 0.5 → "Stereo image collapses in mono" — red
   - Correlation 0.5–0.7 → same pill — amber
   - Spectral excess sub/bass band → "Low end is muddy / woofy" — amber
   - Spectral deficit sub band → "808 doesn't hit in the car" — amber
   - Spectral excess high-mid/air → "Hi-hats too harsh" — amber
   - LUFS Int < −14 → new pill "Mix too quiet for platform" — amber
   - Multiple pills can fire simultaneously
   - Clicking any pill gives the recipe (same troubleshooter behaviour as Repair)
   - Auto-generate: if analysis detects an anomaly with no matching pill, Hope generates a one-off pill with label + suggested chain

3. **Manual input mode** — no WAV needed. Meter cards get editable fields so Kev can type in readings from his DAW meter plugins (iZotope Insight, Nugen, etc.) and trigger the same pass/fail logic + pill highlighting. Override also works when a WAV is loaded — typed value takes precedence.

**Effort:** ~3 hours (rename ~10 min, pills ~1.5 hrs, manual input ~1 hr)

---

### P-B: A/B Ref tab (new — replaces Repair slot)
*Designed 2026-05-25. Spec + mockup needed from Seat A before any code.*

**Updated 2026-09-05 — see item 30 above** ("Real A/B reference-track comparison for Spectral
Balance"): Kevin explicitly validated this exact direction against iZotope's reference-track
mixing guidance and wants it built after Hope's intelligence work (items 24/25). Read item 30 for
the current framing before picking this up; the spec below is unchanged in shape.

The freed Repair tab slot becomes a dedicated reference track comparison surface.

- **Two inputs** — your mix (pre-loaded from Mix Check if already analysed, no re-drop needed) + a second drop zone for a reference track (WAV/AIFF from library, downloaded from Spotify/Apple Music etc.)
- **Overlaid spectral canvas** — your mix renders as the existing gradient curve; reference track renders as a dimmer white/grey curve on the same canvas. Gap between the two is immediately visible.
- **Side-by-side delta meters** — LUFS Int, True Peak, DR, Correlation shown for both tracks with a Δ badge (e.g. "your mix is +4.1 LUFS hotter"). Pass/fail colouring on both sides.
- **Hope commentary** — on demand or automatically after both files load. Uses existing Claude/AI Chat infrastructure. "Your sub is 6dB hotter than the reference. Your True Peak headroom is tighter. Highs are well-matched."
- **Shared engine** — reuses the Web Audio API pipeline, FFT analyser, canvas renderer, and meter card components already built for Mix Check.
- **Note on Spotify:** streaming audio cannot be loaded in-browser without OAuth. Practical path is Kev downloads a reference track as WAV or high-quality MP3 and drops it. Covers 99% of the use case.

**Tab name:** A/B Ref
**Tab id:** `ab` (new panel, new button)
**Effort:** ~4 hours

---

### P-C: Retire Repair tab
*Agreed 2026-05-25. Ships alongside P-A or after.*

The Repair tab (`data-tab="meter"`) becomes redundant once P-A (Mix Check pills + manual input) ships. Everything unique to Repair moves to Mix Check. The tab slot is freed for P-B (A/B Ref).

- Remove `<button class="tab" data-tab="meter">` from nav
- Remove `<div class="panel" id="meter">` and its contents
- Remove any `meter`-specific JS that doesn't serve the new tabs
- Update `switch_tab` tool enum to remove `meter`, add `ab`
- Update `buildAppKnowledgeDigest` TAB NAV catalog
- Update RT_INSTRUCTIONS references

**Effort:** ~1 hour (mostly careful deletion + search/replace)

---

### P-D: Hope's sphere — animated particle orb replacing floating mic
*Designed 2026-05-25. Visual mockup created — see docs/mockups/hope-sphere.html.*

The flat floating mic button becomes a living representation of Hope — a particle sphere that:

- **Idle** — slow gentle pulse, cool teal/cyan, soft glow, particles drift slowly
- **Listening** — particles quicken, colour shifts slightly warmer, gentle rotation
- **Speaking** — reacts to Hope's voice amplitude via Web Audio API analyser on the EL audio output; sphere expands/contracts with her speech rhythm
- **Thinking/processing** — particles scatter then reform, cooler blue-white
- **Emotional intensity** — colour temperature shifts: calm = teal (#06b6d4), engaged = purple (#a78bfa), emphatic = white-hot (#f0f9ff)

Implementation: canvas-based, ~150 particles, no external library. Same Web Audio API infrastructure as the spectral analyser. Still draggable/floatable, same position persistence.

Reference image provided by Kev (2026-05-25 session) — teal/cyan glowing particle sphere on black background, equatorial band detail.

**Effort:** ~3 hours

---

### P-E: Hope tools for Mix Check + A/B Ref
*Designed 2026-05-25. Depends on P-A and P-B shipping first.*

New client tools added to `TOOL_DEFS` so Hope can see and interact with both new tabs:

- `get_mix_check_state` — returns filename, LUFS Int, LUFS Short-term, True Peak, DR, Correlation, Stereo Balance, which pills are highlighted and their severity
- `set_meter_value` — manually sets a meter value (LUFS/True Peak/DR/Correlation) in the Mix Check dashboard, same as Kev typing it in
- `get_ab_ref_state` — returns both sides of A/B Ref (filenames, all meter values, delta values) when both files are loaded
- Extend `toggle_symptom` to cover Mix Check pills (currently only Repair)

Hope proactively flags issues without being asked: if True Peak is over ceiling after a file loads, she mentions it on the next voice turn.

**Effort:** ~1.5 hours (after P-A + P-B)

---

## Planned — carry-forward from previous sessions

### DAW Bridge Epic (3 phases)
*Inspired by EchoJay review — 2026-05-24*

**Historical backlog requiring rescope:** this older DAW-session export concept is separate from the 2026-10-23 Plugin Library companion workstream above. Its AAX/Pro Tools references conflict with Kevin’s current Plugin Library scope and must not be carried into that companion. “Phase 1” below refers only to this old epic.

**Phase 1 — Plugin Scan (historical JUCE companion concept; rescope required)**
- Lightweight VST/AU/AAX companion plugin
- Single function: scan DAW plugin list → export `aimm-plugins.json`
- User drops JSON into AIMM → Hope confirms library update
- Existing manual/screenshot/voice input kept as fallbacks
- **Research spike required before any build estimate (added 2026-09-05, see item 25 above,
  "Hope actually driving/controlling Logic Pro"):** Logic Pro does not have a rich public
  scripting/automation API like some other DAWs. Before scoping effort for B-DAW1/2/3, a technical
  spike must confirm what's actually possible — AppleScript hooks, MIDI/OSC control surfaces, or
  anything else Logic exposes. Do not carry forward an engineering estimate assumed from this
  section's existing (pre-spike) phase descriptions.

**Phase 2 — AIMM Import Handler (index.html)**
- "Sync from DAW" button
- JSON drop/import handler
- Merges with existing plugin library

**Phase 3 — Audio Capture Bridge**
- Plugin captures snippet during DAW playback
- Sends LUFS, spectrum, dynamics to AIMM via local WebSocket
- Hope advises based on actual signal data

**Other carry-forward:**
- `ingest_yt.py` → auto-update `index.json`
- Hope KB: channel crawl continuation
- iPad PWA

### ✅ Durable captures store — SHIPPED 2026-06-11 (see P0e above)
Built as scoped: `/captures` on the aimm-proxy Worker, Workers KV, app + dashboard sync with localStorage fallback. Remaining: Kev's one-time KV namespace + binding setup (`worker/README.md`).

### Hope → Mia persona rename (blocked, scoping only — captured 2026-08-04)
Rename the AIMM voice persona "Hope" to "Mia." Full spec, scope table, and phased plan: **`docs/HOPE_TO_MIA_RENAME_PLAN.md`**.

- **Blocked on:** Cat (Kevin's dedicated agent for general AIMM product engineering) must exist first — not yet built as of 2026-08-04.
- **Sequenced after:** the in-flight Mixio-violet redesign epic reaches a stable/shipped state (currently still moving — `redesign-v5-mixcheck-dashboard.html` / `ozone-redesign-v1.dc.html` added 2026-08-04).
- **Scope:** `index.html` UI text (~213 refs), `hopeRail`/`hopeSphereCanvas` DOM/CSS ids, 6 localStorage keys, `docs/mockups/`, active docs. Excludes the dormant 5-persona system (see Icebox below), `hope-kb` KB tag, and `ai-news-channel`'s unrelated "Hope."
- **Separate track:** ElevenLabs dashboard config (system prompt, first message, voice label) owned by Markey, not this repo.
- **Open decision:** localStorage key compatibility policy (read-old/write-new vs. outright rename) — needs Kevin's confirmation before work starts.

## Icebox
- Five dormant personas (Matthew, Markey, Katie, Ashley, Lauren) — one-line revival ready

---

## Platform Evolution Epic — AIMM Beyond Single-File (captured 2026-06-23)

**Decision (2026-06-23):** AIMM evolves from a single-file browser app into a proper hosted, login-based web app with a backend. No install — browser login only. Driven by two product goals that the single-file constraint cannot support: RoEx-style mix analysis (needs Librosa/Python) and HyFi-style AI online mastering (needs server-side audio processing output). Cloudflare is the primary infrastructure (Worker already live). Staged rollout — don't break the current app while building the next layer.

**Staged rollout:**

### Stage 1 — Complete the redesign (current, no architecture change)
Ship the v4 Mixio-violet redesign. Single-file stays. No backend changes.

### ARCH-1 — Backend Foundation (Stage 2)
Extend the existing Cloudflare Worker + add R2 for audio file storage + add auth (Cloudflare Access or magic-link login). Audio files persist across sessions — no re-drop on every visit. This is the gate for all subsequent ARCH stages.

**Effort:** ~1 day

### ARCH-2 — RoEx-style Mix Analysis (Stage 3)
Python microservice (FastAPI on Railway or Render) with Librosa. WAV uploads to R2, analysis job runs, results return scored grades per dimension:
- **Tonal balance** — dark / neutral / bright (spectral centroid + band energy vs genre corridor)
- **Dynamics** — PLR + crest factor, over-compression detection
- **Loudness** — platform compliance (LUFS vs target)
- **Low end** — sub (<80Hz) vs bass (80–250Hz) energy ratio
- **Stereo width** — M/S energy ratio + correlation
- **Transient punch** — onset density (first-difference RMS envelope)
- **Overall mix health score** — A–F or 0–100 weighted average

Replaces current Web Audio API approximations. Scored report card UI replaces the current meter cards. Depends on ARCH-1.

**Effort:** ~2–3 days

### ARCH-3 — HyFi-style AI Online Mastering (Stage 4)
Online mastering: upload mix → AI processes → download mastered WAV. Like LANDR / HyFi — no install, no DAW needed for the mastering step. Server-side audio processing chain (EQ → compression → limiting → stereo enhancement) informed by ARCH-2 analysis scores. Platform loudness targeting baked in (Spotify −14, Apple −16, YouTube −14, etc.). Genre-aware chain selection. Depends on ARCH-1 + ARCH-2.

**Effort:** ~3–5 days

### Stage 5 — Full product
Login with project history. Multiple mixes per project. Saved master versions. Hope's memory server-side (not just localStorage). Multi-device sync.

**Non-negotiables:**
- Online, browser login — no install ever
- Cloudflare as primary infrastructure (Worker already live, extend don't replace)
- Staged — Stage 1 (redesign) ships on single-file; ARCH-1 onward adds the backend layer
- Current single-file app stays functional throughout the migration

## 42. Dashboard auto-generates from ROADMAP.md — single source of truth (captured 2026-10-08)

**Backlog capture only — not build authorization. Scoped via a Codex read-only planning pass,
2026-10-08; full plan: `docs/ROADMAP_DASHBOARD_SYNC_PLAN.md`. Real effort estimate: 2.5–5 days —
this is not a quick fix, Kevin's explicit call to log and defer rather than build same-session.**

**The incident this closes:** this session, `DASHBOARD.html`'s "Now" section was found sitting
stale since September — items 12/33 badged "Shipped — pending merge" for weeks after actually
shipping and merging (verified directly: `git merge-base --is-ancestor` confirmed both commits are
real ancestors of `main`). Root cause wasn't a code bug: Hope's own `read_doc`/dashboard-digest
mechanism is correctly built (live `fetch`, no caching) and was faithfully serving whatever
`docs/ROADMAP.md` actually said — the real problem is `DASHBOARD.html`'s cards are hand-maintained
in parallel with `docs/ROADMAP.md` and the two drift apart because keeping them in sync is a manual
discipline, not an automatic guarantee. This session alone needed three separate rounds of manual
reconciliation (item 34/41 content, the Now section, the ROADMAP.md Mix Check queue) to catch up —
exactly the failure mode this item exists to eliminate at the root.

**Kevin's framing, verbatim intent:** "if she can read the roadmap then she can read the dashboard"
— i.e. Hope and the dashboard should be reading the genuinely same data, not two hand-synced copies
that happen to usually agree.

**Recommended design (from the Codex plan, not yet built):** don't parse `docs/ROADMAP.md`'s
existing freeform prose directly — it's 1,932 lines of real chronological narrative, not a
consistent schema (heading levels mean different things in different sections, numbering has real
gaps/collisions, status is expressed a dozen different ways in free text). Instead, add small
`<!-- dashboard-card ... -->` HTML-comment metadata blocks immediately before each item that should
render as a dashboard card (invisible when rendered as Markdown, trivially parseable, explicit
`id`/`section`/`status`/`badge`/`effort`/`owner`/`continue` fields) — the canonical prose stays
exactly where it is, as the full evidence Hope already reads correctly. `DASHBOARD.html` then
fetches `docs/ROADMAP.md` at page load and renders cards from those blocks instead of hand-written
HTML. One file, one source of truth, for both Kevin's view and Hope's.

**Phased plan (full detail + real risks flagged in the linked doc):**
- Phase 0 (0.5–1 day): reconcile every currently-shown dashboard card against a real roadmap
  record, resolve mismatches (e.g. the dashboard's "Backlog 22" vs. the Multi-stem section's actual
  unnumbered heading), add the metadata blocks.
- Phase 1 (0.5–1 day): build + test the parser against the real file, without touching the live
  dashboard yet.
- Phase 2 (0.5–1 day): migrate just the Backlog section first as a contained proof.
- Phase 3 (1–2 days): migrate Now/Polish/Shipped, remove the old hand-written card markup.
- Phase 4 (0.5 day): add a validation check (CI or similar) so a malformed/missing metadata block
  fails loudly instead of silently drifting again.

**Real risks already flagged, not hand-waved:** the collapsible sections' persisted
`aimmDashboardSectionState_v1` localStorage state depends on stable section IDs staying static; the
"Continue here" buttons' `continueInCowork()` prompts contain real constraints ("don't start
coding", approval gates) that can't be auto-derived from title/body and must stay explicit
per-card metadata; the captures inbox (`hopeRoadmapCaptures_v1` / Worker `/captures`) is independent
data and must not be touched by this change; fetched Markdown must always be escaped, never piped
into `innerHTML` directly (XSS risk); a `file://`-opened dashboard can't fetch a sibling file at all
(Pages/local-server origin only) and must fail with a clear message, not a silent empty state.

**Explicit non-goals (from the plan):** don't change Hope's digest/read path (it's already correct);
don't turn the captures inbox into roadmap records; don't infer merge/deploy truth from prose at
render time (editors state status explicitly in the metadata block); don't ship a second generated
JSON/JS source alongside the Markdown (that would just recreate the drift problem in a different
format).

**Owner, when picked up:** Cat (aimm general product engineering) dispatches, Codex implements per
standing process, per-phase review before moving to the next phase given the real size of this.

## PluginHub continuation — 2026-10-25 08:10 UTC

The non-production API and account preview now include WebAuthn passkey registration setup. Registration challenges are session-bound, five-minute, one-use and CSRF-protected; verification requires the configured site origin/RP ID and user verification. The API stores public credential material only. Evidence: [report](../governance/evidence/PHASE_PLUGINHUB_WEBAUTHN_REGISTRATION_20261025.md) (commit 1fa7ade641e1662d4099e49e75a549d60dfd2a3b, blob 091f308c0d4fff6084aa5cc7216b4a6d1b668b98); [Foundation closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) (commit a3db765ebd2316e457d7b48080ffa4cfd1f643b0, blob 0a97ff0f03a7c3eb95a3e685af2b6b0a8a23705e). The full local non-production check passed, including 31 API/browser tests. Real-authenticator validation, passkey assertions tied to exact action previews, remote provider/isolation/recovery, live Mac/site parity, remaining Stage 2–5 action coverage and fresh independent review remain open. Foundation remains **NOT MET**; Stages 2–5 are in progress; Stage 6 is gated. No deployment or cutover.

## PluginHub continuation — 2026-10-25 08:15 UTC

The account preview now supports passkey setup and verification. Assertions require a same-site session, CSRF, a single-use five-minute challenge, matching site Origin/RP ID, and user verification. Local API tests passed 32/32; the full local suite passed. No real authenticator was used, and passkey verification is not yet connected to exact Mac action-preview authorization. Evidence: [assertion report](../governance/evidence/PHASE_PLUGINHUB_WEBAUTHN_ASSERTION_20261025.md) (commit 51bbc7355edec5ebe539253d484f07c5518c9e71, blob fce7b3911f0b7b07b5078db3a6848189a57c02ee); [closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) (commit 08839ce0bcf381d1a6f057cd3db2864a3b43ae64, blob 3a7ef5fa5a7b9125b7de917cf236c6a7e8b4447e). Foundation remains **NOT MET**; Stage 6 gated. Remote runtime/isolation/recovery, Mac parity, remaining Stage 2–5 work and independent review remain open. No deployment or cutover.

## PluginHub Stage 5 route update — 2026-10-25 08:15 UTC

The API now accepts Valhalla DSP's four fixed product routes already implemented in the paired companion. Tests cover the redacted preview and queue/command path. This opens the official vendor page only after a local user action; no download starts. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_VALHALLA_VENDOR_SITE_20261025.md) (commit cf87e68338eecc19247f7c0f0f3fa45b2b802806, blob 24d2e824ac1b7dc39e3f28ebea9db29dac133f1b); [closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) (commit fc4ab35444ce590f76c6e9658a98475b4c03d8d4, blob f476a7ef6dca2b2488db1ba2f2ab75c168987518). Full local non-production check passed, 32 API/browser tests. Remaining Foundation, parity, Stage 2–5 action/recovery and independent-review gates stay open; Foundation **NOT MET**, Stage 6 gated. No deployment or cutover.

## Stage 5 route fixture — 2026-10-25 08:17 UTC

The companion action dispatcher now has an explicit fixture proving it resolves the same fixed Valhalla DSP page that the API preview/queue supports. The full local non-production check passed (32 API/browser tests). The action opens a vendor page only; there is no installer download. [Report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_VALHALLA_VENDOR_SITE_20261025.md) commit 4ac9aabd8ae035cb9819ecfa7b40436186846f4a, blob eda7f5a6bbc5c3f6988bd9aee87f49855c44af8e; [closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) commit 66d95d18d6fbf4867d6c5c0d2d808cfd3960d63e, blob e671e56eb893c324a1aa5bf2c4b0be0469615840. Remaining gates are unchanged: Foundation **NOT MET**, Stages 2–5 incomplete, Stage 6 gated. No deployment/cutover.

## Latest verified implementation checkpoint — 2026-10-25


## Stage 5 local preview revalidation — 2026-10-25

The Mac companion now keeps the accepted signed preview bound to its account, device, operation, kind, nonce, item, scan generation, digest, and expiry. Before Finder reveal, vendor-page open, or hub-app launch it checks that the action and preview are still current, the same item remains in the current local scan, and the local item still exists and is not a symlink. Changed, stale, or expired actions are cleared. Retrying a receipt does not repeat a completed action.

Local verification passed: Swift build; API/browser 34/34; scanner 3/3; isolated Worker/D1 pairing, inventory sync, Manual Check, signed/encrypted exact-preview submission, and signed reveal receipt. Negative checks reject changed generation, changed local record, and expired preview. Evidence: [Stage 5 local preview revalidation](../governance/evidence/PHASE_PLUGINHUB_STAGE5_LOCAL_PREVIEW_REVALIDATION_20261025.md), report commit `d7ea39d6da0965201182151a9e6bc584a2d9f9b5`, blob `e3acc645ce4c514a7ee471d072e3897d0a36b3a8`.

Source pins: DeviceSync commit `c08fe8fb6d76d40c92c20fe8801f2dad5e5a4bd3`, blob `bc480d5291f167bb3e59876640a251a0822596c5`; companion UI commit `f01d95a9dcfaf4113f3b302c973f9d016dd4ca03`, blob `aa2d0ddb462ea9fad9e657f245c51f0c47ca4268`; integration checker commit `e47ec791261fcbbde3a6de118bdbf87ca73ead51`, blob `600ce38b74d263d46055bafe6025cba04e12c30e`.

This is local fixture evidence, not a real Mac/browser/Auth0/passkey walkthrough, remote isolation or remote recovery proof. Foundation remains **NOT MET**; Stages 2–5 and fresh independent review remain in progress; Stage 6 remains gated. The 22:47 D1 authorization chronology is unchanged. No remote D1 write, deployment, or cutover occurred.


## Owner-confirmation handoff follow-up — 2026-10-25

After the owner views an exact preview, the browser now requests passkey confirmation for high-risk action types. The device command feed carries the preview digest, expiry, and owner-confirmed time; the companion checks that these match its locally prepared preview. The local suite passes (API/browser 34/34; scanner 3/3; Swift and isolated Worker/D1 preview/receipt flow), including wrong-digest rejection. Evidence: [Stage 5 local preview revalidation](../governance/evidence/PHASE_PLUGINHUB_STAGE5_LOCAL_PREVIEW_REVALIDATION_20261025.md), report commit `cd1e5b8690d11e629edbbac15d5eb914dab929cf`, blob `15917bce6d24e13b738446b6e988957be104e629`.

This does **not** enable installer or file-changing actions: the API still allows only the current low-risk action types. Real passkey use, remote provider/isolation/recovery, live Mac/browser parity, remaining Stage 2–5 actions, and fresh independent review remain open. Foundation remains **NOT MET**; Stages 2–5 in progress; Stage 6 gated. Preserve the 22:47 D1 chronology. No remote D1 write, deployment or cutover.
## PluginHub Stage 5 checkpoint — 2026-10-25

Approved local Stage 2–5 continuation: installer staging uses descriptor-anchored operations, a private owner-only staging directory, atomic no-replace publication, shared POSIX/ACL write rejection and receipt identity checks. The URLSession redirect-delegate test proves a disallowed host is never contacted. Full local non-production suite passed (API/browser 38/38; scanner 3/3; disposable D1/Worker and Swift integration fixtures). No live installer or remote D1 access/write. Fresh independent review **ACCEPTED this slice** within its same-UID threat boundary; reviewer ran no tests. Foundation **NOT MET**; 22:47 D1 gate open; Stage 6 gated; no deployment/cutover. See [review](../governance/evidence/PHASE_PLUGINHUB_STAGE5_INSTALLER_INDEPENDENT_REVIEW_20261025.md) and [implementation evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_DESCRIPTOR_ANCHORED_INSTALLER_STAGING_20261025.md).

## PluginHub Stage 3/4 continuation — account inventory search — 2026-10-26

The account-backed preview now searches product names, vendor names, bundle identifiers and versions, with format and saved-tag selectors. Users may keep source order or sort by product, vendor or format. Search, format, tag, sort, favourites and hidden-product filters compose; visible/total counts and an empty-results message clarify the current view. `library-api` tests passed 38/38. Published in commit `088a117779ab090cc3e5261e800195b6382f3545` (tree `3b32007abcb061ad519cd5425a1eef832dc64a5c`). See [evidence](../governance/evidence/PHASE_PLUGINHUB_INVENTORY_SEARCH_FILTER_20261026.md); blob pins are in the current evidence-package table. Remote D1 hold **OPEN**; Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated. No deployment/cutover.
## Previous provider recovery checkpoint — 2026-10-25 21:53 UTC (superseded by case #03075407 at 21:56 UTC)

The two saved Google identities both receive Auth0 **Forbidden** on the old team `team-uu03jsy` / tenant `dev-cxmqjc40zltqlx7l`. Do not retry. Auth0 Support recovery is the next route; it will verify ownership. Kevin approved sending the account email and team/tenant IDs. The Support Center ticket form remained stuck loading, and the Community fallback requires accepting its Terms and Conditions. No terms accepted or request submitted. [Evidence](../governance/evidence/PHASE_PLUGINHUB_AUTH0_ACCESS_RECOVERY_20261025_2153.md). No project/D1 changes or deployment. D1 validation/write hold **OPEN**; Foundation **NOT MET**; Stage 6 gated.
