# AIMM Plugin Library — Phase 2 architecture

**Status:** Architecture draft, checkpoint 2 (2026-10-23). Phase 1 was approved; no companion or account inventory has been built.

## Approved outcome and scope

Design one AIMM-owned plugin library for aimixmasters.com, its Workbench, Hope and a Mac companion. Cover the 31 Phase 1 parity rows with explicit owners and data contracts. The companion must work without PluginHub installed or running. AU, VST2, VST3 and CLAP are included; AAX and Pro Tools are excluded. This document is an architecture work product, not a build or deployment approval.

## Inspected baseline

| Surface | Source at inspection | Finding |
|---|---|---|
| Published app source | `origin/main` / GitHub `main` at `c717fc616a8a1caf6cc66d8a6e35767ab53783c6`, `index.html` | Static single-file site. Installed-plugin scanner reads bundle names and Info.plist metadata through browser-granted folder handles. It stores handles in IndexedDB and rows/scan summary in browser localStorage (`aimmPluginInventoryRows_v1`, `aimmPluginInventoryScan_v1`). The scan includes an AAX path today. Product grouping is normalized vendor plus name. |
| Hope in the site | Same `index.html`, `buildLibraryDigest`, `TOOL_DEFS`, `handleToolCall` | Hope's `list_plugins`/`get_library` and session library digest use the built-in `allPlugins()` catalogue. They do not use the installed inventory rows, so ownership assertions are not grounded in the browser scan. The existing chat/voice providers share the tool handler; that common handler is the integration seam. |
| Existing Worker source | `worker/src/index.js`, `worker/wrangler.toml` at branch base | The Worker relays AI calls and has `/captures` in KV, knowledge search and Hope voice routes. `/captures` is a single-user, last-write-wins array. The Worker has no AIMM account/device identity or plugin inventory API. Its Origin allowlist is browser enforcement, not user authentication; it cannot secure shared plugin data or actions. |
| Existing bridge artifacts | Unstaged `index.html`, `bridge/` in this checkout; separate running LaunchAgent from `/Users/admin/github/aimm/bridge/` | The prototype imports PluginHub's `dashboard_webview` and reads PluginHub report/data. It cannot be the independent companion. It must be considered in cutover; it was not invoked or changed. |
| Mac build environment | `swift --version`, `xcode-select -p`, `xcodebuild -version` on 2026-10-23 | Swift 6.3.3 command-line tools are available. Full Xcode is not active (`xcodebuild` requires Xcode). Packaging/signing a Mac app needs a later build-environment decision. |

The current site's `aimixmasters.com` domain and the GitHub Pages repository are the same product. Product observations above come from repository source, not a fresh live login or runtime plugin check.

## Architecture direction under evaluation

1. **AIMM-owned Mac companion** scans and acts on local plugins, keeps paths and secrets locally, and sends only permitted inventory metadata to the AIMM account. It initiates an outbound connection to the AIMM API for sync and action work. The UI does not need to call a localhost bridge.
2. **Authenticated AIMM account API** stores per-device inventory snapshots, check observations, account preferences and operation summaries. It separates private inventory, public shares and optional aggregate contribution. The current key relay and captures KV are not suitable as this authoritative store without new auth and data models.
3. **One site/ Hope inventory service** makes the page and Hope read the same account snapshot and observation timestamps. Hope actions use a named backend operation and return the companion's verified receipt. The existing `TOOL_DEFS`/`handleToolCall` routing is retained as the site-side entry point, with new plugin tools added when implemented.
4. **Explicit local action authorization** requires a fresh preview and confirmation for moves, Trash and uninstall operations. Hub launch and installer download are separate actions; a downloaded file or opened hub never counts as an installed update. The companion rescans after local changes.

The detailed contracts below are proposed for Phase 2 review. They have not been implemented or exercised.

## Phase 2 exit work remaining

- Review the [31-row ownership and acceptance map](PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md) against the Phase 1 matrix and the detailed contracts below; resolve any missing workflow.
- Select the concrete OIDC account provider and release-time entitlement policy before implementation. Validate platform and vendor assumptions at their designated build gates.
- Obtain an independent Terminal review of this architecture, as Kevin requested, then remediate concrete findings and present the reviewed result for approval.

## Evidence and restart

Start with [`PLUGINHUB_REPLICA.md`](PLUGINHUB_REPLICA.md), the [31-row parity matrix](PLUGINHUB_PARITY_MATRIX.md), the [Phase 2 ownership map](PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md), [data boundary](PLUGINHUB_DATA_BOUNDARY.md), [status rules](PLUGINHUB_STATUS_RULES.md), [vendor/action matrix](PLUGINHUB_VENDOR_ACTION_MATRIX.md), and [workflow trace](PLUGINHUB_WORKFLOW_TRACE.md). Phase 1 approval is in `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_DECISION_20261023.md`. The Phase 2 before-edit backups are in `Archive/2026-10-23-aimm-pluginhub-phase2-start/` at commit `721d466`.

Preserve the current unstaged `index.html`, `bridge/` and `pluginhub-ui-review.patch`. Do not treat those PluginHub-dependent files as the new architecture or stage them in documentation commits. No PluginHub operation, file action, Logic change, application build, service change, merge or deployment was performed at this checkpoint.

## Component decision

| Component | Proposed design | Reason and boundary |
|---|---|---|
| AIMM site | Keep aimixmasters.com and its current Workbench/Hope shell. Replace the Library's browser scanner only after the new account inventory is proven. | One product and one Hope panel. A companion app is the local engine; it does not replace the website. |
| Library API | A separate `aimm-library-api` Cloudflare Worker at `api.aimixmasters.com`, with an AIMM-owned D1 database. Keep the present AI key relay Worker separate during migration. | The existing relay is Origin-gated and has no account or device auth. D1 supports Worker bindings and transactional batches; a separate service limits risk to live Hope. [D1 API](https://developers.cloudflare.com/d1/worker-api/d1-database/), [Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). |
| Mac companion | Native, non-sandboxed Developer ID Swift app with a menu bar control and a normal detail window for pairing, local folders, downloads, diagnostics and approval. Local SQLite journal/cache; macOS Keychain for device credential and licence vault. No PluginHub import, module, database or process call. | The Mac supplies folder access and executes local actions. The companion discovers standard user/system plug-in roots, records user-added roots via a folder picker, and persists root identities/bookmarks where appropriate. It handles macOS privacy denials visibly and never assumes an old grant still works. SwiftUI supports menu bar scenes; Keychain is suited to small secrets. [MenuBarExtra](https://developer.apple.com/documentation/swiftui/menubarextra), [Keychain services](https://developer.apple.com/documentation/security/keychain-services). |
| Background operation | User-enabled launch at login for the signed companion using Apple's supported service management mechanism. Scheduled scans/checks run in the logged-in user context; no always-running root service. | The current manually installed PluginHub bridge LaunchAgent is a migration item, not the long-term service. [SMAppService](https://developer.apple.com/documentation/servicemanagement/smappservice). |
| Connection | The companion makes outbound HTTPS requests to the Library API for sync, work claims and receipts. The page and Hope call the same API. Initial progress uses bounded polling; add real-time delivery only if measured UX needs it. | Works with the site on another device and avoids making the browser depend on a localhost port. An offline Mac is explicit in the UI. |
| Durable storage | D1 stores account/device/product/format/check/preference/action/share metadata. Companion SQLite holds local paths, full scan details and operation journal. Existing `AIMM_KV` remains for captures/cache, not authoritative inventory. No plug-in binaries or installer downloads enter D1 or R2. | The web inventory is a permitted projection of the local source; sensitive and bulky artifacts stay on the Mac. |
| Distribution | Signed, notarized app outside the Mac App Store, with a signed release manifest and a staged update/rollback path. Build and sign in an Xcode-capable environment before distribution. | `xcodebuild` is not available in the currently selected Command Line Tools installation. Apple documents Developer ID signing and notarization for direct distribution. [Notarization](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution). |

The proposed OIDC identity provider is not selected yet. Its required contract is specified below so a provider can be chosen without changing inventory/action semantics. No paid provider, Cloudflare resource or Apple signing account is created during architecture work.

## Identity, pairing and permissions

1. A managed OpenID Connect issuer authenticates website users. The Library API validates issuer, audience, expiry and signature, maps the provider subject to an internal `account_id`, and issues an HttpOnly, Secure, same-site API session. Browser writes require a CSRF token. Every D1 query is scoped by `account_id`; the Origin allowlist remains an extra browser restriction, never the identity check. `api.aimixmasters.com` and `aimixmasters.com` are same-site; signed-in inventory on the GitHub Pages fallback redirects to the canonical domain.
2. On first run, the companion generates a device signing key locally and requests a pairing ID and a random polling secret over HTTPS. It opens a short-lived URL containing only the public pairing ID; the secret stays in companion memory until completion and travels only in HTTPS polling request headers, never in a URL, log or browser. A short verification phrase derived from the pairing transaction appears in both the Mac window and browser approval page. The signed-in owner compares the phrases, sees the named Mac and approves once. The server enforces the account's device limit before approval, registers the device public key, issues a device-scoped credential only to the polling Mac, and records the approval. The long-lived credential and private key are stored in Keychain. No manual code copying is required. Pairing is single-use, expires after 10 minutes, is rate-limited and is logged. The website can rename/revoke a device; revocation stops sync and action claims.
3. Device credentials are separate from browser sessions and scoped to that `device_id` and account. Rotate them, store only token hashes on the server, and deny a revoked device immediately. A companion never receives another device's commands or inventory. The Mac never receives the user's browser session cookie.
4. Version 1 has one `account_owner` browser principal per account and a limited public-share `viewer`; these roles are derived from the signed-in account or share token, not user-editable membership rows. The owner can change preferences, approve pairing, create shares and confirm actions; a device can upload only its own inventory, claim its commands and post receipts. A public viewer can read only the published share projection. Hope uses the current signed-in browser's API session through the shared `handleToolCall` executor. It cannot mint a device credential or complete a local-action confirmation. A future ChatGPT Desktop/MCP client must use the same account API and scoped authorization, not a separate inventory copy.
5. The current AI relay's `/captures` remains independent. Its single-user KV and Origin-only gate do not grant access to the Library API. If AIMM later shares account auth across Workbench features, that is a separate migration with its own review.

**Account provider gate:** before implementation, select an OIDC issuer with email/passkey or equivalent login, token rotation, account recovery, export/deletion, and a practical path to multiple customers. Cloudflare Access can protect a private Worker but is not assumed to be the eventual customer account system. The internal `account_id` must not be an email address so a provider migration does not rewrite inventory ownership.

## Canonical data model

| Record | Core fields | Ownership and rule |
|---|---|---|
| `account` | `account_id`, provider subject mapping, created/deleted time | Library API. No vendor credentials. |
| `device` | `device_id`, `account_id`, display name, companion version, last-seen, revoked time, capabilities | API identity. Hostname is not required for ordinary inventory. |
| `scan_generation` | `device_id`, generation UUID, started/completed time, root count, bundle/readable/product counts, partial/unreadable/truncated flags, schema version | Companion sends; API publishes only a complete generation. A partial scan is recorded as a warning while the previous complete inventory remains active. |
| `product` | Stable account product ID, canonical vendor/name, aliases, category, provenance/confidence | API projection from AIMM identity rules. Unknown/ambiguous names remain separate until resolved; no guessed merge. |
| `format_install` | Device, product, AU/VST2/VST3/CLAP, opaque local record ID, bundle ID if available, installed version string, architecture, observed time | Companion source; no path or binary hash in ordinary account inventory. Multiple files may belong to one product and format. AAX is rejected at ingestion. |
| `check_observation` | Device/product/format, installed/latest strings, comparison result/reason, source type, checked time, last-good time, error, paid-upgrade flag, route | Immutable observation. Unknown and failed checks never become “up to date”. |
| `preference` | Scoped target (`vendor` or `product`), favorite, hidden, tags, mark version, snooze expiry, revision | Account-owned for cross-device use; marks/snoozes never rewrite observations. Hidden vendors and products remain recoverable. |
| `collection` / `saved_selection` | Account ID, stable ID, name, ordered product IDs, revision, created/updated time | Distinct account-owned records for custom browsing and batch queues; membership edits are revision-checked. |
| `account_setting` | Check cadence, notification preference, appearance preference, category display, revision | Account-owned defaults; Mac-specific folder grants and login launch remain local. Browser geometry stays browser-local. |
| `consent` | Account ID, purpose (`public_share`, `profile_share`, `aggregate_contribution`), disclosed fields, granted/revoked time, revision | Explicit, purpose-specific choice. Routine inventory sync never grants public or aggregate use. |
| `project_requirement` | Device ID, local opaque project ID, DAW type, parsed plug-in names/versions, uncertainty, observation time, expiry | Optional owner-approved summary only; project path and file never sync. |
| `release_manifest` | Version, channel, signed artifact URL, digest, minimum schema, published time, rollback version | AIMM-published companion update metadata. The Mac independently verifies signature and notarization before use. |
| `operation` and `operation_item` | Operation ID, idempotency key, device, product/format, kind, state, preview digest/expiry, authorization time, per-item outcome, receipt, timestamps | API has redacted summary; companion SQLite is the full local journal. Exact paths appear only in a short-lived, explicitly requested preview and local receipt. |
| `share` / `profile` | Chosen fields, selected devices/vendors, expiry, revocation, access policy, comparison snapshot version | Separate user-initiated publication/compare data. No implicit publication from inventory sync. |
| `entitlement` | Account feature eligibility and period | Separate from plug-in ownership and the local licence-key vault. Business pricing remains a product decision. |

Identity rules are versioned. Start with normalized vendor/product names plus reviewed alias tables and product/bundle IDs where reliable. Preserve the raw names, per-format versions and provenance locally. Never hard-code the earlier 873, 1,613 or 1,618 product totals; page and Hope both derive counts from one active generation and label the unit. Waves shell expansion, helpers and aliases need fixture-based verification before migration. A product has one visible card, with formats and files beneath it. The duplicate finder reports extra on-disk copies separately.

**Inventory publication:** the companion starts a generation, uploads bounded chunks with stable IDs, then finalizes after all chunks and counts are acknowledged. The API atomically switches the device's active generation only after validation; D1 transactional batch support is documented by Cloudflare. The companion retains its prior local generation until the server acknowledges finalization. Idempotent chunk keys permit retry without doubling rows. Deleting a device or account removes its projection under a documented retention policy. Any public share has its own copy and expiry.

## Site and companion API contract, version 1

All endpoints below use JSON over HTTPS, schema version `1`, request IDs, bounded page sizes and structured errors (`code`, `message`, `retryable`). The Library API rejects unsupported schema versions, invalid formats and cross-account IDs. A server operation status is never accepted as proof that a Mac file changed until the companion posts a verified receipt.

| Route family | Caller | Result |
|---|---|---|
| `GET /v1/me`, `GET /v1/devices`, `POST /v1/devices/{id}/revoke` | Site | Owner role, entitlement/device limit and current usage, device presence/capabilities, revocation. The pairing approval rejects a full device allowance. |
| `POST /v1/pairings`, `POST /v1/pairings/{id}/approve`, `GET /v1/pairings/{id}` | Companion, then signed-in site, then companion | Single-use account/device binding and scoped device credential. |
| `PUT /v1/devices/{id}/inventory/{generation}/chunks/{index}`, `POST .../finalize` | Paired companion | Staged rows, validation, active-generation switch and server receipt. |
| `GET /v1/library?device=&cursor=`, `GET /v1/checks?device=&cursor=`, `GET /v1/status-summary?device=&filters=`, `GET /v1/vendors/{id}` | Site and Hope via same browser session | One canonical snapshot, format detail, source/timestamps and server-computed status buckets for the same device/filter/generation. |
| `PATCH /v1/preferences/{scope}/{id}` with `If-Match`, `POST /v1/preferences/marks/reset` | Site | Versioned vendor/product favorite, hidden, tag, mark or snooze; bulk mark reset is scoped and returns changed IDs. Conflicts return current revision. |
| `GET/POST/PATCH/DELETE /v1/collections`, `GET/POST/PATCH/DELETE /v1/selections`, `GET/PATCH /v1/settings` | Site | Revision-checked collections, saved batch selections, account check cadence and display defaults. Local grants and login launch never sync as account settings. |
| `POST /v1/actions`, `GET /v1/actions/{id}`, `POST /v1/actions/{id}/confirm`, `POST /v1/actions/{id}/cancel` | Site/Hope for request; signed-in user for confirmation | Exact scoped operation request, prepared preview and state. Hope may request a preview but cannot confirm a file mutation. Read-only `scan`/`check_updates` requests use short expiry and no destructive confirmation. |
| `GET /v1/devices/{id}/commands?after=`, `POST /v1/actions/{id}/prepared-preview`, `POST /v1/actions/{id}/events`, `POST /v1/actions/{id}/receipt` | Paired companion | Claim, locally prepared preview, progress and verified local outcome. |
| `POST /v1/shares`, `GET /v1/shares`, `DELETE /v1/shares/{id}`, `GET /public/{token}` | Site/public viewer | Explicit limited-field list share, expiry and revocation; public token is opaque and stored hashed. |
| `POST /v1/profiles/compare`, `POST /v1/project-requirements`, `GET /v1/diagnostics` | Site/paired companion as scoped | Authorized device comparison, optional owner-approved read-only project summary, and redacted check/action diagnostics. |
| `GET/POST/DELETE /v1/consents/{purpose}`, `POST /v1/contributions`, `GET /v1/releases/companion` | Site/paired companion as scoped | Separate revocable consent, explicitly disclosed aggregate contribution, and signed companion release metadata. Contributions are rejected without current opt-in. |

`GET /v1/library` includes active `generation_id`, `device_id`, `observed_at`, `last_attempt_partial`, product count, format count and rows; partial rows are never published. `GET /v1/checks` returns raw `update`, `up_to_date`, `manual`, `unchecked` or `error` outcomes plus last-good/stale indication. `GET /v1/status-summary` applies one versioned bucket function to those raw observations, paid flags, snoozes, marks and filters and returns counts plus its rule version and generation ID. The site and Hope display that returned summary; neither recomputes its own actionable counts. Every Hope answer names the selected Mac and observation time, and says when a Mac is offline or a check is stale.

## Operation state and local safety

```text
requested → preparing → preview_ready → awaiting_confirmation
                                           ↓ confirm before expiry
                                       queued → claimed → running
                                               ↘ completed / partial / failed
requested or queued → cancelled / expired
```

The site first requests an operation with an API-generated `operation_id`, random nonce, account/device identity, kind and selected opaque item IDs. The Mac resolves the live files and prepares a canonical versioned preview: account/device/operation/nonce, kind, product/format, active scan generation, each item's stable local ID, source identity/path, destination, current version, file metadata, symlink status and permission result. The companion computes SHA-256 over the canonical serialized bytes, signs the digest with its Keychain-held device key, stores the full preview and digest in its SQLite journal, and posts the signed digest with a redacted summary. The server verifies the registered device public key and accepts only a matching pending request. Exact paths are returned only to the owner's explicit preview screen for confirmation, stored for at most 10 minutes, and omitted from Hope context, analytics and generic logs. The API records an owner-confirmed authorization bound to the digest, generation and expiry; confirmation requires the current session and CSRF token. The command returned to the Mac includes that authorization and digest. Before execution, the Mac checks its own journaled digest and all bound fields against the returned command, fetches current authorization, checks expiry/revocation, then re-resolves every item. Any change of path identity, symlink, version, destination, permissions or generation invalidates the preview and requires a new one. Destructive commands expire 10 minutes after preview creation and cannot be revived after reconnect. Read-only `scan` and `check_updates` commands have a separate 24-hour expiry and never carry file-action authorization.

The companion journals each item before it acts. Same operation ID plus item ID is idempotent: a retry resumes unfinished items and never repeats a completed move/removal. A batch receipt contains per-item `completed`, `failed`, `skipped`, `cancelled` or `needs_permission`, with observed evidence and a rescan generation. The Mac signs the receipt; the API verifies its device binding. `partial` stays partial even when one item succeeds. The site polls the API while an operation is visible and shows an offline/unknown state if the companion stops reporting; it does not infer success from elapsed time.

For local file operations, the companion restricts paths to user-connected roots, checks symlinks and collisions, and uses recoverable Trash for uninstall. Move to Unused/offload records source and destination; a cross-volume copy is verified by content before the source is removed. Restore refuses occupied destinations. No generic `rm -rf` fallback or always-running privileged daemon is part of the design. If the OS requires elevated access, request it locally for the named item and record denial or partial completion. Direct installers remain in a local managed download folder; URL/platform/product/version/redirect/size and available signature or hash must be checked before offering or opening them. Vendor hubs and vendor websites are separate routes. Launching an installer, completing a download, and verifying a new installed version are separate receipt states.

## Status, vendor routes and scheduling

The check engine uses AIMM-owned vendor adapters with declared evidence source (`public_vendor`, `local_hub`, `manual`) and cache TTL. Adapters run in the companion when local hub state is needed; public sources may be checked by an AIMM service if its terms and access permit. Each adapter emits source timestamp, installed/latest versions, paid-upgrade signal, confidence, URL route and explicit failure reason. Cached last-good data remains labelled stale after a failed refresh. Vendor-specific comparators can override a conservative generic version parser with documented fixtures. A verified direct installer route is permitted only for a current Mac artifact and the exact product/version; otherwise show hub or vendor page/manual check. The Phase 1 970 static candidate keys and 13 saved direct installer candidates are research leads, not AIMM support claims.

The companion scans standard AU/VST2/VST3/CLAP folders at first setup, on request and on a user-enabled schedule, adding custom roots only after the user selects them. A completed scan syncs automatically when paired and online. Update checks can run on daily/weekly/monthly preference with manual `check_updates` requests from the site; manual `scan` is a distinct command. On an offline Mac, the site keeps the last complete snapshot but displays age and connectivity; Hope cannot imply a check occurred. User marks, snoozes, hidden state and paid-upgrade preferences are applied by the API's shared bucket function over raw observations and retain revision history.

## Hope, Workbench and the existing Library

The current `allPlugins()` reference catalogue continues to serve music guidance and stage recommendations, but it must be clearly separated from verified installed ownership. The installed Library, Workbench owned-plugin picker and Hope's `list_installed_plugins`, `get_plugin_status`, `get_plugin_action_preview` and `get_action_result` tools all call the same authenticated Library API. Existing `list_plugins`/`get_library` calls must stop presenting reference entries as installed ownership; their descriptions and digest are migrated only when the new API is live. The shared `handleToolCall` executor remains the typed/voice integration point, preserving Hope's current voice/chat mechanics. Hope tool results may include canonical product/vendor names, formats, installed/latest version labels, status, selected device display name and observation time. They omit exact paths, project names/content, licence values, pairing data, tokens and raw diagnostic errors. The browser discloses the permitted tool result to its selected voice/LLM provider as part of a user request; this is explained in the Library privacy UI. Desktop Hope can later use a scoped MCP adapter to the same API; no additional catalogue or local file authority is created for it.

The Library UI retains the approved MixCheck-cohesive design: collapsible left navigation with distinct monochrome icons, coloured square pills with white text, three-column vendor cards where width permits, dense row layout without vertical holes, and Hope's persistent right rail. Status/tool/catalogue tabs are backed by the account API; a status cannot display an update badge without an observation. Vendor marks are sourced/licensed for AIMM and have a fallback icon.

## Shares, profiles, vault and diagnostic boundaries

List sharing and profile comparison are separate from routine account sync. Before creating a public list, the user previews selected vendors/fields and expiry; hostname and local paths are omitted by default. The API uses opaque share tokens, optional stronger passkey policy, rate limiting, revocation and deletion. Logic/Cubase project parsing happens on the Mac from a user-selected file; only an optional requirements summary is synced, never a DAW file. AAX/Pro Tools paths remain excluded. The licence-key vault uses Keychain with user-presence unlock and local encrypted export/import; the Library API and Hope never see key values. Optional aggregate contribution has a separate explicit opt-in and field disclosure. Diagnostics include app/API/check versions and redacted errors, excluding secrets, ordinary paths and installer files. AIMM entitlement checks are independent of users' vendor plug-in ownership.

## Build sequence and cutover gates

1. **Foundation:** select OIDC provider and build Library API account/device model in isolation; keep the existing key relay and live site unchanged. Create schema migrations and a non-production D1 database.
2. **Read-only companion:** build the signed-app skeleton, pairing, AU/VST2/VST3/CLAP scan and local journal; exclude AAX at the scanner source. Sync a complete generation. Confirm product/format counts from one generation and investigate aliases/utility bundles.
3. **Read-only site/Hope:** add an account-backed inventory behind a feature flag. Compare it with the present browser scan on this Mac. Preserve the current Library as fallback until parity is demonstrated. Make Hope read the same snapshot with age/device labels; preserve chat/voice routes.
4. **Status and preferences:** implement current vendor adapters, raw status/cache semantics and account preferences. Expose only verified update actions; complete the 31-row UI mapping.
5. **Local actions and tools:** implement preview/confirmation/receipt flow in increasing risk order: reveal and hub open, direct download, installer queue, move/restore, Trash uninstall, duplicate and old-installer cleanup, vault and sharing. Each action class has per-item failure and recovery checks.
6. **Cutover:** once AIMM-owned scanning and actions are verified without PluginHub, switch Library and Hope to the account API. Then separately stop/remove the PluginHub-dependent LaunchAgent and retire the uncommitted bridge candidate using a reviewed rollback plan. Do not remove PluginHub or local data merely because the new UI exists.
7. **Release:** independent Terminal review, parity walk, signed/notarized companion artifact, site/API verification, and Kevin's review of a concrete release candidate before merging/deploying.

The live browser scan is a migration comparator, not the canonical future store. Do not import PluginHub's database or private catalogue. Any user favorites/tags in AIMM are mapped to canonical IDs only after identity confidence is checked, with an export/rollback copy. The companion can be unpaired without deleting local plug-in files; account deletion has a separate metadata purge. App update rollback keeps the previous signed release and compatible local database migration.

## Design assumptions and remaining decisions

| Item | Current decision or open gate |
|---|---|
| Account identity provider | Protocol fixed to OIDC; select a concrete issuer before implementation. Current Worker has no account auth. |
| Companion packaging | Native Swift app is recommended; Xcode-capable signing/notarization environment is required later. The current Mac only has Command Line Tools active. |
| API persistence | D1 for authoritative metadata. Confirm schema size, migration and quota against the intended release tier before deployment; no new binding was created now. |
| Live action transport | Outbound bounded polling first, with explicit stale/offline UI. A real-time channel is an optimization if measured progress needs it. |
| Vendor update coverage | Rebuild adapters independently and validate vendor terms, current endpoints and Mac artifacts. The static PluginHub registry is not an AIMM support guarantee. |
| Samples view | P31 is in parity scope, but installed source did not expose its feature-flag default or full behavior. Review visible manual/app behavior before final UI contract. |
| Entitlements and commercial access | Data model and API gate are specified; pricing, trial length and device limit require a product decision before launch. |
| Operational retention | Define exact retention windows for action receipts, profiles, shares and deleted accounts during API implementation. Short-lived previews expire and are purged; local full journal remains on the Mac. |

## Current platform documentation checked

- Cloudflare: [D1 Worker API and transactional batches](https://developers.cloudflare.com/d1/worker-api/d1-database/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
- Apple: [SwiftUI MenuBarExtra](https://developer.apple.com/documentation/swiftui/menubarextra), [SMAppService](https://developer.apple.com/documentation/servicemanagement/smappservice), [Keychain services](https://developer.apple.com/documentation/security/keychain-services), [notarizing macOS software](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution).

These links establish platform capability only. They do not prove the proposed API, Mac app, vendor adapters or download paths work yet.
