## Latest continuation — local duplicate review — 2026-10-26 09:49 UTC

Stage 3/5 now shows possible duplicate copies locally, grouping only by case-insensitive non-empty bundle identifier plus the same plug-in format. Different formats stay separate; missing bundle IDs do not create guesses. The companion displays the extra local paths for owner review and states that no files changed. This read-only slice does not sync paths or authorize deletion. Implementation commit `06b672144b1c4d2ce827876bd1264b56c267453c`, tree `6ac287edf3c564e4f0eb77c0df34effa258f556d`, parent `e021e3f5aae54049120f5aec4f8813ba6d41f5c6`. [Evidence](../governance/evidence/PHASE_PLUGINHUB_DUPLICATE_REVIEW_20261026.md).

The complete `sh scripts/pluginhub-nonprod-check.sh` passed after this change: ad-hoc app packaging/signature; scanner 3/3; duplicate analyzer regressions; API/browser 38/38; disposable local D1 and loopback Worker; synthetic cross-account rejection; and Swift pairing, sync, Manual Check, reveal, move and restore receipts. No remote D1 or provider access, deployment or cutover occurred. Keep remote D1 validation/write hold **OPEN**, Foundation **NOT MET**, Stages 2–5 in progress and Stage 6 gated. Full independent Foundation validation, remote provider/isolation/recovery and live Mac/browser parity remain outstanding.

## Latest continuation — journal-backed file-action recovery and inventory integrity — 2026-10-26 09:39 UTC

Stage 3/4 inventory reads now reject missing, changing or mismatched snapshot counts, and the status UI reaches the full account snapshot in 100-row pages. Stage 5 move/restore recovery now retrieves expired actions only by IDs from the local journal, and only the active paired device can receive the same claimed, owner-confirmed operation with no receipt. The companion rechecks the device credential and exact preview immediately before file changes. If saving a preview to device-only Keychain fails, its exact unconfirmed server preview is discarded; if the journal cannot be read, queue refresh stops and preserves saved previews.

The full local `sh scripts/pluginhub-nonprod-check.sh` passed after these changes: ad-hoc app packaging/signature, Swift journal/recovery, scanner 3/3, API/browser 38/38, disposable local D1/loopback Worker, synthetic cross-account rejection, and actual Swift pairing/sync/Manual Check/reveal/move/restore with signed receipts. `git diff --check` passed. Independent review accepted the final journal-read error-path fix; the reviewer did not run tests. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STATUS_AND_RECOVERY_FOLLOWUP_20261026.md).

This remains local synthetic evidence. The remote D1 validation/write hold is **OPEN**; Foundation is **NOT MET**; Stages 2–5 continue; Stage 6 remains gated. Provider-backed browser session/CSRF and pairing, remote two-account isolation/recovery, current-Mac browser parity, remaining Stage 5 paths and fresh end-to-end independent Foundation validation remain outstanding. No provider request, remote D1 access/write, deployment or cutover occurred.

## Latest continuation — full local non-production verification — 2026-10-26 09:11 UTC

The 225-record synthetic account snapshot is verified across two API cursor pages, with page reset/clamping, later-page preferences, generation count and the 100-row DOM cap covered. API/browser suite: 38/38. The independent scoped review **ACCEPTED** the paging slice; full Foundation review remains open. [Evidence](../governance/evidence/PHASE_PLUGINHUB_INVENTORY_PAGING_20261026.md). Test follow-up `6bd1c770816ce1d9bf6a3d6dddc28fc7b2e2d5a4`.

The D1 validation/write hold remains **OPEN**; Foundation **NOT MET**; Stages 2–5 in progress; Stage 6 gated. The full local script now passes with synthetic fixtures, including companion, scanner, API/browser, disposable local D1/Worker, cross-account rejection, and actual Swift pairing/sync/reveal/move/restore receipts. [Run evidence](../governance/evidence/PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261026_0911.md). No provider call, remote D1 activity, deployment or cutover.


# AIMM Plugin Library — PluginHub feature replica

**Status (2026-10-26):** Phase 1 — COMPLETE and APPROVED (2026-10-23); Phase 2 architecture and seven-stage plan — APPROVED; Foundation exit — **NOT MET**; Stages 2–5 — in progress; Stage 6 — gated. Restart from the [current Foundation evidence package](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md), [authorization chronology addendum](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_ADDENDUM_20261024.md), [challenge report](project/generated/PHASE_PLUGINHUB_FOUNDATION_CHALLENGE_REPORT_20261024.md), [remediation request](project/generated/PHASE_PLUGINHUB_FOUNDATION_REMEDIATION_REQUEST_20261024.md), [Stage 5 validation report](project/generated/PHASE_PLUGINHUB_FOUNDATION_VALIDATION_REPORT_20261024.md), and [pin revalidation addendum](project/generated/PHASE_PLUGINHUB_FOUNDATION_REVALIDATION_ADDENDUM_20261024.md). A non-production Worker is deployed only to its isolated `workers.dev` endpoint and dedicated D1. Historical remote evidence includes User A pairing/approval/one-time delivery/replay rejection/revocation and a read-only D1 identity/migration check through 0021. The separate synthetic-only recovery exercise used a disposable D1; it did not rewind the shared project database. Current Auth0 account access is pending Support case #03075407; login fails at a callback mismatch before credentials. Auth0-backed browser session/CSRF, authenticated two-account remote isolation, live pairing/runtime revalidation, remote project-D1 recovery, browser-to-Mac parity, and fresh independent end-to-end validation remain unproven. The current remote D1 validation/write hold is **OPEN**. No Foundation completion or Stage 6 governance decision is claimed.

**Started:** 2026-10-23
**Product requirement:** reproduce PluginHub’s plugin-library functionality inside AIMM, using AIMM-owned code and services. The installed PluginHub app is a reference for observed behavior; it must not be a runtime dependency.

## Latest continuation — complete account inventory paging — 2026-10-26

Stage 3/4 account preview paging exposes the full snapshot in 100-record pages. Search, format/tag filters, sorting and account preference controls cover every page while product controls are created on demand. The API/browser suite passes 38/38. Source commit: `7035a3f4e3b1a967949668f520e236dbbb2476da`. [Evidence](../governance/evidence/PHASE_PLUGINHUB_INVENTORY_PAGING_20261026.md). Provider-backed runtime, remote isolation/recovery, live pairing/parity, remaining Stage 5 action coverage and independent review remain open; D1 hold **OPEN**, Foundation **NOT MET**, Stage 6 gated.

This is the durable project brief and restart point. Decisions, evidence, open questions, and phase status belong here and in the linked project records, not in session memory.

## Product direction

AIMM’s plugin library is intended to be a functional replica of PluginHub’s plugin management experience, adapted to AIMM’s visual design and Kevin’s stated scope. This means bringing across the whole feature set—status tracking, library and catalogue browsing, management tools, version checks, download and installer workflows, folder management, sharing, profile comparison, and settings—not building only a scanner and a new page.

The local AIMM companion enables the local parts of those workflows. It is AIMM’s scanner and local action executor; it is not a connector that calls PluginHub, imports PluginHub’s live database, or requires PluginHub to be installed or running.

```text
Mac plug-in folders and vendor installer state
                  ↕
          AIMM Mac companion
         ↙ local actions ↘ sync
AIMM account inventory and action API
             ↙             ↘
 aimixmasters.com Workbench   Hope
```

The existing AIMM site and Hope remain together at `aimixmasters.com`. The site and Hope read the same AIMM account inventory. Actions that need the Mac are sent to the paired companion and return their actual progress/result to AIMM.

## Fixed scope and constraints

- Match PluginHub’s observed functions and user workflows, not its source code or app runtime. Implement AIMM-owned equivalents.
- Keep AIMM’s existing Workbench, Hope chat/voice mechanics, and fixed Hope panel. The plugin library is part of AIMM, not a second app/site.
- Retain the approved AIMM design direction: MixCheck-cohesive dark UI, colored status/product accents, square pills with white text, three-column vendor cards where space permits, browsable/collapsible left navigation with recognizable monochrome icons, and Hope’s persistent right panel.
- Support the formats Kevin uses: AU, VST2, VST3, and CLAP. **Do not build AAX or Pro Tools workflows.**
- Do not show the same product as duplicate catalogue cards. Group one product identity and show its installed formats/locations under it. Preserve a user-invoked duplicate-management tool because finding multiple copies on disk is a separate PluginHub capability.
- Plugin metadata needed by Hope and the website may sync to Kevin’s AIMM account. Plug-in binaries, audio, DAW projects, vendor passwords/tokens, and licence secrets must not sync. Licence keys stay in local secure storage. Any public sharing or aggregate telemetry is a separate explicit opt-in.
- Local file moves and removal must show the exact affected files and request confirmation. Use recoverable Trash for uninstall/removal. Do not silently change Logic projects or DAW sessions.
- A vendor action must state whether it is an AIMM-verified direct download, an opened vendor installer/hub, or a manual vendor check. A download is not reported as installed until the local result verifies it.
- No publishing/deployment is part of Phase 1. Keep work isolated from the live AIMM.

## Phase plan

### Phase 1 — Reverse engineer PluginHub (complete; approved 2026-10-23)

1. Inventory every screen, status, tool, setting, and user-visible workflow from the manual and installed application.
2. Trace the local implementation behind scanning, identity/grouping, categories, status calculation, vendor checks, downloads, installer launching, file moves, shares, and profiles.
3. Inspect local data schemas and aggregate counts without reading or copying licence secrets, vendor credentials, or other private values.
4. Record vendor-level update-check coverage and precisely which vendors/actions support direct downloads versus vendor hubs or manual checks.
5. Build a source-backed AIMM parity matrix: observed behavior, source evidence, AIMM equivalent, user-specific exclusion, and unresolved detail.

**Exit:** complete feature/workflow matrix; implementation/source map; vendor-check and install-route inventory; resolved data-flow and privacy requirements; outstanding unknowns explicitly listed. No feature implementation is implied by completing this research phase.

### Phase 2 — Translate the reference into AIMM architecture

Define the AIMM product/inventory/status/action data model; local companion protocol and pairing; shared account API/storage/auth; local-only secret handling; operation queue/progress/receipts; and failure/recovery behavior. Map every Phase 1 feature to local companion, AIMM backend, website, or Hope.

**Exit:** reviewed end-to-end design and data contract covering every parity item.

### Phase 3 — Build the AIMM Mac companion

Implement folder permissions and discovery, scanner, product/format identity, version and architecture metadata, local status inputs, vendor/hub detection, update/download execution where supported, installer launching, safe file management, progress, receipts, and secure local licence-vault equivalents.

**Exit:** real scans and supported local actions return verified data/results to AIMM without PluginHub.

### Phase 4 — Build the complete AIMM library and management tools

Implement PluginHub-equivalent Status, Tools, Library, Catalogue, search, filters, cards/list/ledger layouts, sorting, categories, tags, favorites/pinning, hidden items, update controls, folder controls, and the full management workflows in the approved AIMM design.

**Exit:** every supported Phase 1 workflow has a working AIMM interface backed by real inventory and local operation results.

### Phase 5 — Integrate Hope

Give Hope access to the same account library and status/action results visible in the AIMM page. Allow only grounded actions exposed by the companion; report completion or failure truthfully.

**Exit:** Hope’s readbacks match the page and supported operations can be traced to actual companion results.

### Phase 6 — Parity verification and rollout

Walk the parity matrix against the reference and AIMM, including failure paths, no-AAX scope, duplicate grouping, Hope/Workbench preservation, and real inventory counts. Review from Terminal with Claude CLI as requested. Prepare and verify the candidate before any live release.

**Exit:** all supported parity rows verified, user-facing differences documented, and Kevin reviews the concrete release candidate before publication.

## Phase 1 evidence captured so far

### Reference artifacts

| Artifact | Observation | Evidence source |
|---|---|---|
| PluginHub user manual | 32 pages; extracted through macOS PDFKit because `pdftotext`/Poppler is not installed | `/Users/admin/Desktop/PluginHub_Manual.pdf`, read 2026-10-23 |
| Installed application | Bundle identifier `com.pluginhub.app`, version `2.0.12` | `/Applications/PluginHub.app/Contents/Info.plist` |
| Bundled app implementation | Readable local Python modules and dashboard HTML; source was inspected read-only and not copied into AIMM | `/Applications/PluginHub.app/Contents/Resources/` |
| PluginHub local snapshot | Generated `2026-10-22T14:39:02.856570Z`; 1,880 format records: AAX 239, VST3 538, AU 538, VST2 563, CLAP 2 | `~/Library/Application Support/PluginHub/plugin_snapshot.json` (aggregate fields only) |
| PluginHub version report | Last check `2026-10-22T15:39:05.869022`; 159 updates, 100 up to date, 19 errors, 1 unchecked; no unreadable roots or scan warnings | `version_report.json` and `.last_check.json` (aggregate fields only) |
| Download eligibility sample | Of those 159 update rows, 13 expose both `installer_url` and `installer_size`; 159 have a `download_url` field, which is not evidence that each is an installable direct download | Same local version report; aggregate/key-presence inspection only |
| AIMM browser scan (prior live record) | 1,880 bundles checked, 2,197 readable records, grouped into 1,618 products across five formats | 2026-10-22 AIMM handover evidence; this is a separate scan path and must not be equated with the PluginHub snapshot |
| UI screenshots supplied by Kevin | An earlier AIMM sidebar screenshot showed 1,613 products; a separate PluginHub screenshot showed 873 plugins | Conversation screenshots from 2026-10-22 around 17:33 and 18:08, respectively; these are different products and capture times |

Counts are time- and scan-path-specific. PluginHub’s local snapshot has 1,880 format records; its UI screenshot shows 873 grouped plugins. AIMM’s earlier UI screenshot shows 1,613 products, while a later AIMM browser scan reported 1,618 products. The AIMM scan included AAX, which the agreed replica will exclude. The fact that both scanners reported 1,880 bundles does not establish identical inclusion or identity rules. Reconcile product identity, scanner scope and capture time before setting expected counts.

The manual describes PluginHub as checking vendor websites and using locally installed vendor-app catalogue files for some vendors. Direct downloads are limited to openly published vendor files; account-gated downloads and vendor-app-managed updates route to the vendor’s own site/app. The current local report’s 13 direct installer records is an initial snapshot, not a complete vendor-support inventory.

### Source-trace checkpoint — 2026-10-23

These observations come from read-only source inspection and aggregate inspection of the current local report. They describe the reference implementation; AIMM still needs its own design and code.

| Mechanic | Confirmed reference behavior | Evidence |
|---|---|---|
| Scanner and product count | The snapshot contains one row per discovered format bundle. The dashboard’s canonical product total resolves vendor names, removes excluded helpers, expands Waves shells, then uses the Share-list grouping of vendor and cleaned product name. This explains why 1,880 bundle rows and PluginHub’s 873 UI products are different units; it does **not** reconcile AIMM’s 1,613/1,618 counts. | `dashboard_webview.py` `_canonical_snapshot`, `_canonical_plugin_counts`; `profile_compare.py` `build_list` |
| Current update routes | The saved report has 159 update rows across 15 vendors. Exactly 13 rows carry both `installer_url` and `installer_size`: FabFilter 1, SSL 6, Sonnox 6. Another 102 update rows have the paid-upgrade flag. A `download_url` on every row can be a vendor page, so AIMM must treat it separately from a verified installer. | Local `version_report.json`, key/count aggregation only; `vendor_checkers.py` `_installer_fields` |
| Direct installer gate | The basic source guard accepts HTTPS installer-looking URLs and applies deny patterns to the whole URL. `_installer_fields` rejects apparent demo/trial builds but does not itself verify version or Mac platform; redirect resolution and some callers add narrower checks. A direct-download action needs independent per-product validation. | `vendor_checkers.py` `_is_installer_url`, `_resolve_redirect_installer`, `_installer_fields` |
| Vendor checking and cache | Checkers include public vendor-site/manifest readers, local vendor-hub readers, and deliberate no-data/manual stubs. The source defines `run_all_checkers` with a two-hour default cache, longer overrides, local-only reruns and no cache write for errors/timeouts. Its actual use is unverified because the readable entrypoint imports missing `cached_checks`; the offline entrypoint requests at least a 24-hour TTL without forced refresh. Fetches use a shared polite requester with robots controls. | `vendor_checkers.py` `ALL_CHECKERS` and batch registries; `hub_checkers.py`; `run_checks.py` `run_all_checkers`, `run_checks_main`; `checker_core.py` `polite_get` |
| Version/status accuracy | `compare_versions` handles build suffixes and avoids a false update when a two-segment installed version exactly prefixes a finer latest version. The report separates updates, current, errors and unchecked; the UI adds user marks, snoozes, paid-upgrade visibility and hidden items. | `run_checks.py` `compare_versions`, `build_report`; `dashboard.html` mark/snooze/paid/hidden controls |
| Categories | Categories combine scanned records, curated mapping, optional aggregate classification and vendor-declared categories. The sidebar count is recalculated over displayed product rows, rather than raw format bundles. | `run_checks.py` `build_categories` |
| Local management | Native APIs build source-to-destination plans from actual bundle paths, with per-format selection and friendly-name resolution. They expose move-to-Unused, restore, move-to-Trash, duplicate-path handling, admin permission fallback, progress and a move ledger. The reference also has size-only copy checks and permanent-delete branches when finishing some moves; AIMM must define safer preview, verification, confirmation, recovery and per-path receipts. | `dashboard_webview.py` `_build_move_plan`, `move_single_path_to_unused`, `move_plugins_to_trash`, `restore_moved_plugins`, batch methods; [workflow trace](PLUGINHUB_WORKFLOW_TRACE.md) |
| Installer and hub actions | The native interface offers download probe/start/cancel/open/reveal/mark/dismiss/trash, batch inspect/start/status/stop/receipt, and explicit vendor-hub opening. Hub opening reports failure when the app is gone. | `dashboard_webview.py` installer methods and `open_hub`; `installer_payload.py` |
| Sharing and profile comparison | A profile share builds from a local snapshot, which can be reused from a five-minute in-memory cache; a public plugin-list share is a separate endpoint with field inclusion, vendor exclusion, optional passkey and expiry inputs. Both reference payloads include hostname. The client supports profile fetch/list/revoke and list revoke, but server enforcement is unverified. The local source includes Logic session analysis and narrows a Logic-derived list to AU. | `dashboard_webview.py` `_get_compare_snapshot_cached`, `profile_compare_share`, `profile_compare_share_list`, Logic analyzer; `profile_compare.py` |
| Scheduled checks | The current `app.py` persists 1/7/30-day choices in `settings.json`; when absent, its code defaults to 7 days. This is a reference behavior to record, not an AIMM schedule decision. | `app.py` `_load_check_interval_days`, `_set_frequency` |

**Research boundary:** no PluginHub source is incorporated into AIMM. No checker, scanner, installer or file-operation method was executed during this trace.

The [vendor/action matrix](PLUGINHUB_VENDOR_ACTION_MATRIX.md) records the saved report’s 15 update vendors, static checker inventory, and action boundaries. The [workflow trace](PLUGINHUB_WORKFLOW_TRACE.md) records local move/Trash/restore semantics and share payload/privacy findings. The [parity matrix](PLUGINHUB_PARITY_MATRIX.md), [status rules](PLUGINHUB_STATUS_RULES.md), [count reconciliation](PLUGINHUB_COUNT_RECONCILIATION.md), and [data boundary](PLUGINHUB_DATA_BOUNDARY.md) complete the Phase 1 research package. They describe reference evidence and AIMM requirements, not implementation instructions or approval to run a PluginHub action.

### AIMM data flow and open design questions

The agreed boundary is: local companion holds folder permissions, scan cache, file paths, installer queue and licence secrets; the AIMM account receives only the plugin inventory/status fields needed by the website and Hope; AIMM’s site sends a requested local action to the paired companion and displays its returned progress and verified result. Public shares and anonymous aggregate contribution are separate opt-ins. The actual pairing, authentication, retention, offline queue and conflict rules belong to Phase 2.

Open questions carried into Phase 2: exact fields and retention for account sync; how the companion proves a local action completed; whether vendor hubs expose reliable local version state; how the reference server enforces account/device access, share expiry and revocation; which direct-download URLs can be independently verified; and the exact canonical identity rules behind the 873 PluginHub, 1,613 earlier AIMM and 1,618 later AIMM product counts. Cubase session-list support remains in scope because Kevin excluded Pro Tools/AAX only. These are unknowns, not assumed product behavior.

### Existing candidate checkout that must be handled before implementation

The **uncommitted** `index.html` diff is already a PluginHub-coupled UI prototype: it changes the library to read `INV_PLUGINHUB` through bridge endpoints, exposes “Open PluginHub”/PluginHub tool controls, and removes the earlier AIMM browser folder-scan flow. The untracked `bridge/` helper reads PluginHub local data and can rescan, request an update check, open PluginHub tools/vendor hubs, and download listed installers to its own queue. It is not merely a read-only inventory source. These files were present before this Phase 1 documentation work and were not modified here. They contradict the agreed AIMM-owned architecture, so they must be inspected and either replaced or discarded in a separate code change. Do not stage, commit, push, merge, or deploy them as part of the documentation checkpoint.

A **separate installed LaunchAgent is currently running**: `~/Library/LaunchAgents/com.aimm.pluginhub-bridge.plist` has `RunAtLoad` and `KeepAlive` and launches `/Users/admin/github/aimm/bridge/pluginhub_bridge.py` from the main checkout, a different copy from this branch’s `bridge/`. A read-only `launchctl` check showed it running on 2026-10-23. That main-checkout script imports PluginHub’s `dashboard_webview` module and defaults to loopback `127.0.0.1:48321`; the sandbox did not permit an HTTP health request. No service state was changed during this research. This existing local service must be accounted for in Phase 2 migration/cutover. To inspect it in a fresh session, filter `launchctl print gui/501/com.aimm.pluginhub-bridge` to service state/path/PID lines; never dump inherited environment values.

### Feature inventory from the manual

| Area | PluginHub behavior to reproduce in AIMM | Manual pages | AIMM constraint/adaptation |
|---|---|---:|---|
| Dashboard and navigation | Menu-bar launcher; dashboard; resizable/reorderable sidebar sections; optional legacy top-tab navigation; live counts; keyboard shortcuts; layout, appearance, brightness, text-size and sort settings | 1–2, 8–10, 29–30 | Companion can provide menu-bar access, while aimixmasters.com remains the primary library. Preserve Hope panel. |
| Status | Pinned; Updates Available; Up to Date; Manual Check; Unchecked; per-view counts and global update count | 3–5, 29 | Derive counts from scanner/check results and user marks/snoozes. Do not use placeholder totals. |
| Update handling | Paid-upgrade badge and visibility toggle; version-aware Mark Up to Date; timed/date/indefinite snooze; snooze visibility toggle; reset marks; marked-date export/recheck queue | 5–7, 29–30 | Preserve independent observed status and user-deferred state; no AAX-specific behavior. |
| Library views | Vendor cards, All Plugins flat list, Hidden items, Favorites/pinned vendors or products, category and tag filters, search, format filter, vendor/plugin sorting, Cards/List/Ledger layouts, collapsible vendor cards, collections | 8–14 | One product card per canonical product; formats and install locations are detail rows, not duplicate products. |
| Categories and tags | Category taxonomy; multi-select categories/tags; color-coded category dots; user-created tags with add/remove, rename, recolor and reorder | 10–11 | Category UI is flag gated in installed source; the saved report has 15 labels. Retain AIMM styling and real filtering/management mechanics. |
| Vendor/product management | Hide/unhide vendor or product; choose products to hide; move vendor/product to Unused; uninstall selected items to Trash; undo recent hide; reveal file in Finder; select formats/files per action | 13–16 | Explicit previews/confirmations; reversible file movement; no silent destructive action. |
| Unused/restore | Move format-specific selections to sibling `(Unused)` folder; restore recent move; browse/restore older unused items; maintain source-folder relationship | 16–18, 27–28 | Preserve each configured folder’s origin and restore path. |
| Batch Plugin Management | Select vendors, products and formats; active/inactive filters; select all active/inactive; move, uninstall, restore; save/rename/reorder/reapply/delete selection lists; progress and receipt | 17–18 | Include exact file/vendor summary, cancellation/progress, recoverable removal and verified outcome. |
| Install Manager | Queue one or more updates; download open vendor installers; launch vendor installer; batch sequential install with one admin authorization; progress and receipt; clean up downloaded installers later | 18–19 | Vendor-specific allowlist/capability table; no vendor-account login scraping; never claim install success from download alone. |
| Duplicate management | Detect same product + format in multiple paths; show active/unused, path, size and install date; reveal, move one copy to Unused/Trash; filtered bulk removal of unused copies; dismiss alert | 20 | Keep a deliberate duplicate-check tool, but avoid duplicate product cards in normal browsing. |
| Old installer cleanup | Scan Downloads for `.dmg`, `.pkg`, `.zip`; identify when possible; sort/select/rescan/reveal; select outdated; move selected files to Trash | 21 | Keep installer cleanup distinct from installed plug-in removal. |
| Share Plugin List | Create expiring, optionally passkey-protected inventory share; label; format scope; choose version/format/install-date fields; exclude vendors; short code/link; web view; CSV/PDF and Copy for Sheets as clipboard TSV | 22–23 | User-initiated and AIMM-owned; no native Sheets file export was found in Python modules. Exclude licence/private credentials and AAX/Pro Tools. |
| Session plugin list | Read `.logicx`/`.cpr`/`.ptx` session references to build a session-specific required-plugin list | 23 | Support Logic and Cubase; exclude Pro Tools/AAX. |
| Compare Plugin Profiles | Share a Mac profile with another authorized Mac; five diff buckets (in sync, version diverged, only here, only there, format mismatch); format/sort filters; update link only for the older side | 23–24 | Map to AIMM account/device pairing; no cross-user exposure. No AAX format comparison. |
| License Key Vault | Secure local key storage; Touch ID/password unlock; idle lock; text/file keys; search; masked/reveal/copy timers; edit/delete; encrypted export/import with review and duplicate avoidance | 24–26 | Secrets stay on the Mac in secure storage; never sync to Hope/backend, exports, shares, or logs. |
| PluginHub licensing/trial | Licensed, trial-available and trial-expired product states; activation/deactivation, device limits and paywall | Installed `license_manager.py`, `app.py` | AIMM entitlement policy is a separate design decision from the local plug-in licence vault. |
| Local app update and onboarding | Sparkle self-update, first-run cascade and setup prompts | Installed `dashboard_webview.py`, `app.py` | AIMM companion needs its own signed update and paired first-run flow. |
| Samples view | Feature-gated sample-library view in installed source | Installed `run_checks.py` | AIMM parity item; default flag and full behavior unverified because `feature_flags.py` is absent. |
| Plugin folders | Open standard/custom folders; additive per-format custom paths; reset path; per-folder sibling Unused locations; restore from all Unused folders; permission/protected-folder warnings | 27–28 | Include AU/VST2/VST3/CLAP only. Never scan personal folders broadly. |
| Settings, privacy, support | Daily/weekly/monthly checks; launch at login; update sound; snooze visibility; optional anonymous aggregate data; reset app data without deleting plugins/keys; permission explanation; troubleshooting/debug report | 29–32 | AIMM’s explicit library sync is separate from optional public sharing/telemetry. Keep secrets out of diagnostics. |

### Source map in the installed app

| Concern | Read-only source inspected |
|---|---|
| App orchestration, menu bar, scheduled scan/check, status counts and app preferences | `Contents/Resources/app.py` |
| Standard/custom format folders, bundle discovery, Info.plist reads, product normalization, deduplication and Apple Silicon architecture | `plugin_scanner.py` |
| Vendor/category aliases and category assignment | `run_checks.py` |
| Vendor-specific and hub/catalogue-based version checks | `vendor_checkers.py`, `hub_checkers.py`, `checker_core.py` |
| Dashboard interactions, filtering, status rows, views and tool dialogs | `dashboard.html` |
| Native local bridge APIs for folders, moves, Trash, duplicate checks, batch operations, installs, cleanup, shares and session/profile operations | `dashboard_webview.py` |
| Direct installer inspection/eligibility and vendor identity | `installer_payload.py` |
| Downloads-folder installer discovery and stale/outdated classification | `installer_cleanup.py` |
| Profile normalization, share/fetch/revoke and five-way comparison | `profile_compare.py` |
| Local app licence and per-feature gates | `license_manager.py` |
| Local encrypted vendor-key vault | `license_vault.py`, `keychain.py`, `keychain_helper.swift` |
| User instructions and screenshots embedded with app | `manual.html`, `Resources/manual-images/` |
| Optional anonymized inventory contribution and local opt-in gate | `contribute.py` |

This source map records what to study; it does not authorize copying PluginHub code, its vendor catalogue, or its backend. AIMM’s implementation must be its own.

## Phase 1 exit work and known limits

- [x] Inventory the manual and installed source, map the full user-facing scope to AIMM, and preserve the explicit Pro Tools/AAX exclusion. See the 31-row parity matrix.
- [x] Trace status/cache, paid upgrades, marking, snoozing, hidden products, format versions, file actions, shares/profiles, grouping, categories, vendor icons, layout persistence and custom folders. See the linked specialist records above.
- [x] Enumerate literal candidate checker registrations without executing PluginHub. The corrected audit records key expressions, guarded fallbacks and source lines; it is not a runtime support claim. See `research/pluginhub_registry_audit.py` and the vendor/action matrix.
- [x] Record current saved-report vendor routes and structurally inspect all 13 direct installer candidates without downloading them. No remote URL, entitlement or installer integrity was verified.
- [x] Reconcile the four cited product/bundle observations by unit, path and capture time; exact cross-product numeric equality is not supported by these independent snapshots.
- [x] Complete independent technical challenge, remediation, and validation; the validation report is ALL PASS.
- [x] Record Kevin's approval and close Phase 1: [`governance decision`](../governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_DECISION_20261023.md) and [`governance review request`](../governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_REVIEW_REQUEST_20261023.md).

**Bounded unknowns for Phase 2:** static keys do not establish effective checker availability or complete method classification. `cached_checks.py`, `feature_flags.py`, `plugin_categories.py` and `login_launch.py` are absent from the readable bundle, so central-cache behavior and flag defaults cannot be verified from source. The public share server, vendor endpoints, current installer URLs, account/entitlement behavior, Samples workflow, and a fresh canonical product count were not exercised. Phase 2 must specify AIMM-owned equivalents and validation before any implementation is presented as functioning.

## Restart instructions for a fresh session

1. Set the working directory to `/Users/admin/github/aimm-pluginhub-integration` and inspect `git status --short --branch` before touching files. The current `index.html`, `bridge/` and `pluginhub-ui-review.patch` are pre-existing candidate artifacts; `index.html`/`bridge/` depend on PluginHub, so preserve them for inspection but do not stage or deploy them. A separate PluginHub bridge LaunchAgent runs from `/Users/admin/github/aimm/bridge/`; read the warning above before any local-service change. The pre-edit planning-file backups are in `Archive/2026-10-23-aimm-pluginhub-phase1/`.
2. Read `docs/CLAUDE.md` and follow its accountable-lead bootstrap where applicable, then `CONSTITUTION.md`, `AGENT_MODEL.md`, `governance/GOVERNANCE_WORKFLOW_STANDARD.md`, `docs/HANDOVER.md`, `docs/STATUS.md`, `docs/ROADMAP.md`, and this document.
3. Read `docs/handovers/2026-10-23-pluginhub-reverse-engineering.md` and `docs/handovers/2026-10-23-pluginhub-trace-review.md`, then the parity, vendor/action, workflow, status, count and data-boundary records linked above. `research/pluginhub_registry_audit.py` regenerates the static checker inventory from installed source without importing it.
4. Use the Phase 1 evidence package, review request and Claude challenge report under `governance/evidence/` and `docs/project/generated/` as the exit record. Follow the explicit Phase 2 unknowns. Do not load the candidate `bridge/` or either installed bridge as AIMM architecture.
5. Phase 1 is approved and closed. The next stage is Phase 2 architecture planning only; the Phase 1 decision does not authorize implementation, bridge integration, downloads, file actions, Logic edits, merge, or deployment.
6. Keep all decisions and evidence in these files. No conversation memory is needed to resume.

## Change log

### 2026-10-23 — Phase 1 approved; Phase 2 architecture planning next

Kevin approved Phase 1 after the independent challenge remediation and ALL PASS validation. The signed decision is in `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_DECISION_20261023.md`. Phase 2 starts with architecture planning for the independent AIMM companion and shared AIMM account/API contract; implementation is not authorized by this decision.

### 2026-10-23 — Phase 1 opened

Corrected the scope from scanner/interface work to a full PluginHub functional replica in AIMM. Began read-only reverse engineering from the 32-page manual, PluginHub 2.0.12 installed resources, and aggregate local state. The detailed evidence and current remaining work are recorded above and in the dated handover log.
