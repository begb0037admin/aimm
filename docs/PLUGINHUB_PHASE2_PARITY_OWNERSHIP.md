# PluginHub replica — Phase 2 ownership and acceptance map

**Status:** Architecture draft, 2026-10-23. This maps every item in the approved [Phase 1 parity matrix](PLUGINHUB_PARITY_MATRIX.md) into AIMM-owned components. It is a build and verification contract, not a claim that the feature works today.

**Key:** C = AIMM Mac companion; A = authenticated Library API/account database; S = aimixmasters.com Library/Workbench; H = Hope through the same API. “Local” means content never enters ordinary account inventory. All site visual work preserves the approved AIMM Library and fixed Hope rail.

| ID | AIMM ownership | Required observable result and verification gate |
|---|---|---|
| P01 Menu control | C menu bar + A presence + S/H read | App opens and reports paired Mac, last scan/check and refresh state; page/Hope use those timestamps. Verify an offline Mac is shown offline. |
| P02 Status buckets | C checks + A observations + S/H | Pinned, updates, up to date, manual and unchecked are computed from raw observations and preferences; error/stale is separate. Verify the same device/format filter gives the same counts in page and Hope. |
| P03 Paid, mark, snooze | A versioned preferences + S/H | Paid upgrade is separate from free update; mark names the observed latest version and expires on a newer version; snooze expiry and reset are visible. Verify raw status remains intact. |
| P04 Cards/list/ledger | S view state; A paged data | Search, format filter, sort and expand/collapse across all three layouts yield identical product membership and per-format detail. Keep three-column cards where width permits. |
| P05 Navigation | S | Status, Tools, Library, Categories remain reachable in expanded and collapsed sidebars. Icons are distinct monochrome line icons and selected states use the approved blue treatment. Verify keyboard labels and Hope rail. |
| P06 Favorites/hidden | A preferences + S/H | Vendor and product favorites/pins and hidden records sync across devices; hidden records remain recoverable with undo. No hide action changes local files. |
| P07 Categories/tags/collections | C classification clues + A user taxonomy/preferences + S/H | Multi-select filters, user tags and collections persist. Unknown category is explicit; no missing PluginHub module is imported. Verify account revisions and category counts. |
| P08 Vendor identity | S AIMM-owned assets + fallback | Licensed/authorized vendor marks load; a monochrome fallback works when absent. No remote arbitrary icon URL is trusted as proof of vendor identity. |
| P09 One product, many formats | C raw rows + A canonical IDs + S/H | One card per canonical product; AU/VST2/VST3/CLAP versions and local copies are separate children. Verify aliases, helpers and Waves shells against fixtures before claiming a count. |
| P10 Folders/offload | C local settings + S status | Standard/custom roots, Unused and offload destination are manageable; missing permissions/drives are explicit. Exact paths stay local except an action preview. Verify no overlapping root double count. |
| P11 Installed metadata | C scan + A permitted projection + S/H | Formats, versions, architecture and display dates have source/time. Dates are not called verified install dates. AAX is filtered at scan and rejected by API. |
| P12 Vendor checks | C/A AIMM-owned adapters + A observations + S/H | Each supported checker records source, current/last-good time, comparison reason, cache/stale and error. Unsupported products get manual status. Vendor coverage is claimed only after live adapter verification. |
| P13 Direct download/installer queue | C local download and launch + A action receipts + S/H | Verified Mac artifact route, progress, cancel, reveal/open and sequential batch state are distinct. An update is “installed” only after a new scan proves the version. Test partial and interrupted paths. |
| P14 Vendor hubs/sites | C hub discovery/open + A action route + S/H | Show an installed hub only when discovered locally; otherwise an official vendor page/manual route. Opening a hub does not assert login, entitlement or installation. |
| P15 Move/restore/Trash | C local journal + A preview/receipt + S/H | Exact sources/destinations are previewed, bound to confirmation and revalidated. Restore rejects collisions; Trash is recoverable; each path has its own result. Verify cross-volume copy before source removal. |
| P16 Batch management | C item queue + A action events + S/H | Saved selection, progress, cancel and retry preserve per-item state. A partial batch is never reported as all complete. |
| P17 Duplicate finder | C local inventory analysis + A short result + S/H | Detect extra active/Unused copies as a deliberate tool; default Library still has one product card. Removal targets only confirmed extra local items, never an active copy by name guess. |
| P18 Old installer cleanup | C Downloads/custom-root inspection + A preview/receipt + S/H | Installer file cleanup is visibly separate from installed plug-in removal. Preview/reveal/Trash work per file and report skips/errors. |
| P19 Public plugin list | A separate shares + S; H may explain/prepare | Preview fields/vendors, expiry and optional access protection; create/export CSV/PDF/clipboard TSV, revoke and expire. No hostname/path by default; verify public token access and revocation. |
| P20 Logic/Cubase requirements | C read-only selected-file parser + S/H summary | Show a project's required plug-ins and missing matches without uploading or changing the project. Report parse uncertainty; Pro Tools is absent. |
| P21 AAX/Pro Tools | Excluded across C/A/S/H | No AAX scanning, counts, checks, filters, downloads, cleanup, session/profile/share fields or category masks. Audit aliases and ingestion rejection. |
| P22 Mac profile comparison | C per-device projection + A owner-scoped comparison/share + S/H read | Compare in-sync, version-diverged, only-remote, only-local and format-mismatch groups. Machine disclosure is explicit; sharing/revocation/expiry work without local paths. |
| P23 Local licence vault | C only | User-presence unlock, masked/reveal/copy/edit/delete and encrypted transfer stay local. API, Hope, shares and diagnostics cannot read values. Verify that account export omits the vault. |
| P24 Optional contribution | C/A separate opt-in + S settings | Disclose actual submitted fields, preserve opt-in/revoke, exclude AAX and secrets. Routine inventory sync does not imply consent. |
| P25 Schedule/settings | C scheduler/local settings + A user preferences + S | Daily/weekly/monthly/manual checks, login launch and notification sound work when enabled; offline/failure and reset scope are explicit. No silent background file action. |
| P26 Appearance/keyboard | S | Theme/brightness/text/layout and keyboard controls fit AIMM design; accessibility labels and collapsed navigation remain usable. Transient geometry can stay browser-local. |
| P27 Diagnostics | C redacted local checks + A status + S/H read | Explain checker source, stale status, permission failures and operation IDs. Export omits secrets, ordinary paths and private project content. |
| P28 AIMM entitlement | A account eligibility + S onboarding | Trial/licensed/expired/device-limit policy is defined by AIMM, independent of vendor plug-in licences and the local vault. Pricing and limit values need product approval before launch. |
| P29 Companion updates | C signed release/update flow + A version reporting + S | Verify signature/notarization, staged rollout, failure and rollback. A Mac on an old version remains visible; no PluginHub updater dependency. |
| P30 First-run setup | C pairing/folder grants + A device record + S help/H | Explain account pairing, Mac permissions, metadata sync and local action confirmation. Complete a fresh-install run without manual token copying or PluginHub installation. |
| P31 Samples view | C sample inventory + A permitted projection + S/H if adopted | Preserve this bounded parity row. Before build, inspect the reference's visible Samples workflow and define accepted roots/metadata; the missing feature-flag module prevents a stronger current claim. |

## Whole-system acceptance

1. Starting with only AIMM installed on a clean Mac, pair once, scan AU/VST2/VST3/CLAP, and see one canonical count in the Library and Hope. AAX/Pro Tools never appear.
2. Disconnect the Mac and show last observation plus offline age. Neither site nor Hope reports an unseen check or completed operation.
3. Run one verified direct-download path, one vendor-hub route, one manual-check route and one paid upgrade. The UI and Hope report each honestly; only a post-install scan can establish installation.
4. Exercise a cancelled, partial, permission-denied and retried multi-item local action. Confirm exact preview, single confirmation, per-path receipt and recoverable result.
5. Exercise public share creation/expiry/revocation and cross-Mac profile comparison without leaking local paths, licence values or projects.
6. Keep the current MixCheck, Workbench and Hope voice/chat behavior while replacing the Library data source. Independently review from Terminal and verify the candidate before release.

## Evidence boundary

The Phase 1 parity rows are a source-backed feature inventory from the PluginHub manual and installed 2.0.12 build. This Phase 2 table assigns AIMM ownership and defines future acceptance. Vendor endpoint validity, effective PluginHub checker coverage, the full Samples UX and the current canonical product count remain unverified. No implementation, local action, vendor request or deployment was performed to produce this map.
