# Stage 5 isolated synthetic device sync — 2026-10-29

## Latest Stage 5 owner-preview handoff — 2026-10-29

The reviewed development Settings preview now offers a targeted, synthetic-only move flow. Source commit `3a35e2139bfb28f1b0c95eac944420223e577665`, `library-api/library-account.js` blob `461459466a361f59564582b5a0e50757013a7362`; Jules reviewed the exact source. Cloudflare development Pages deployment `7f9e75c4-a1c3-4393-b9aa-7efbd465b8b8` succeeded on the approved branch preview: https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/.

A device-scoped preview matched only the known synthetic AU fixture, “AIMM Stage 5 Synthetic Probe” version 1.0.0. One `move_to_unused` request was queued. The isolated synthetic diagnostic Companion fetched it and opened its “Choose the Unused folder” picker. It is waiting for the owner to select the intended destination, review the exact source and destination shown by Companion, and confirm with the passkey. **No files have moved and no passkey assertion has occurred.** A separate normal Companion installation showed an empty queue; it is not the diagnostic install paired to this fixture, so that result does not indicate request failure.

No device metadata or local paths are recorded here, and no unrelated plug-in inventory was requested. Stage 5 remains **PARTIAL**; Foundation remains **NOT MET** and Stage 6 remains gated. The development Worker passkey RP fix remains a surgical bundle patch, not a reproducible branch build. No production deployment occurred.


## Scope

Prepared a disposable Companion build from the current GitHub branch source blobs for `DeviceSync.swift` (`1243c02b9a92ecd98e1fe0b70c44fff5f7411c6a`), `ScanJournal.swift` (`a4d2f3f4a6858e778519e5a7cc49f753efb0e370`), `AIMMCompanionApp.swift` (`77d87054b0017cfd22c475aa1597bb5115e6b32b`) and `package-pluginhub-nonprod-app.sh` (`3c65a7f4653899f7cb273eb5ac31273a2d30db30`). GitHub source blob IDs matched the clean branch clone before the diagnostic-only changes.

Jules reviewed the exact diagnostic diff and approved the build after the journal was moved to a fresh UUID path. The temporary build uses a unique bundle identifier, unique Keychain service names for device credentials and action previews, and a new journal at `/private/tmp/aimm-stage5-FC75D47D-7D46-4A31-A677-6F329DF36FC0/Library.sqlite3`. The journal path was confirmed absent before launch. The normal Companion’s UserDefaults/bookmarks and Keychain items were not read or modified; the diagnostic app uses its own UserDefaults domain, namespaced Keychain services and journal.

## Verified work

- Created one metadata-only synthetic AU bundle at `/private/tmp/aimm-stage5-FC75D47D-7D46-4A31-A677-6F329DF36FC0/fixture/Stage5SyntheticProbe.component`; no executable plug-in was included.
- Selected and scanned only that fixture root. The Companion displayed a completed local scan of one entry and zero entries in the other formats. It did not scan standard plug-in folders.
- Used the approved non-production development Worker endpoint `https://aimm-library-api-dev.kevinlelitte.workers.dev` for the diagnostic device pairing. The development pairing page displayed device approval, and the isolated Companion subsequently reported “Paired securely” and “Scan saved locally and the complete inventory generation synced securely.”
- The only record in the diagnostic generation was the synthetic AU fixture. The Companion reported successful sync; no independent API inventory readback was made.
- No plug-in file was moved, restored, removed or changed. No real plug-in inventory was scanned or requested. No production endpoint or Worker was used.

## Current disposition

This closes only isolated synthetic pairing and one-record sync, reported complete by the Companion; no independent API inventory readback was made. Stage 5 remains **PARTIAL**: the supported owner UI requires selecting the diagnostic device before creating a move request. Automatic review initially rejected the read-only device metadata query because it could expose metadata for existing devices. Kevin then authorized that narrow read. One direct GET to the development Pages `/account-api/v1/devices` route returned HTTP 401 (`A valid Library API access token is required`) because that tab had no active Library API session. No device rows or plug-in inventory records were returned. Continue only through this same approved route after the development Library session is active; no move request was created.

The prior synthetic request `b9b490c3-543b-4312-a52b-7c20b482fc81` targeted the older 1,642-entry generation and was not usable with this isolated one-entry diagnostic device. It expired at `2026-10-29T08:06:53.728Z`; it was not claimed or reused, and no replacement request was created. No file move may occur until the owner sees and confirms the exact move preview. Move, exact-preview owner authorization, restore, fixture cleanup, diagnostic credential revocation and fresh independent Stage 5 review remain open.

The Stage 5 diagnostic app, journal and fixture are temporary under `/private/tmp`. Keep the diagnostic device paired until the remaining Stage 5 action/restore evidence is complete, then revoke that device through the supported owner UI and remove only its temporary Keychain items and fixture/journal after successful restoration. Foundation remains **NOT MET**; Stage 6 remains gated.


## Follow-up — confirmed development session and targeted synthetic preview — 2026-10-29

Kevin signed in to the approved development Pages origin. The existing Settings page showed a Sign out control, and a read-only Account preferences request completed with “Development Library preferences are ready to review.” No passkey setup or verification ceremony was repeated. The primary control still said “Sign in,” so a clearer status indicator was prepared in `library-api/library-account.js`. Jules reviewed the exact change and passed it. It checks the existing development browser session on page load using GET `/v1/session`, displays a green checkmarked “Signed in” control only after success, and distinguishes HTTP 401 (signed out) from origin/availability failures. No tokens or cookie values were extracted or saved.

The approved read-only GET to `/account-api/v1/devices` returned device metadata that may include existing devices. That metadata was used transiently to select the diagnostic device; no device ID, display name, timestamp or other device metadata is reproduced or persisted here. A device-scoped GET to `/v1/library` returned one complete synthetic generation `875d53ad-e46d-4ce5-9ceb-eedb70a960d8`, containing exactly one record: `AIMM Stage 5 Synthetic Probe`, AU, version `1.0.0`, bundle `com.synthetic.aimm.stage5.probe`, record ID `34234152-d78b-4e0d-8ae2-4a638a0ab619`. The follow-on inventory read was scoped to the diagnostic device and returned only this synthetic record; no other plug-in inventory records were requested or retained.

The read-only `move_to_unused` preview names the synthetic item and confirms that the action changes local files and requires Mac confirmation plus the owner passkey. It does not provide the exact local source and destination; those must be shown by the Companion after a supported move request. No move request was created, and no file was moved, restored, revoked or deleted. The expired 1,642-entry request was not reused. Stage 5 remains **PARTIAL** pending the exact Companion preview, owner confirmation and passkey action, restoration, fixture/diagnostic credential cleanup, and fresh independent review. Foundation remains **NOT MET** and Stage 6 remains gated.

The signed-in indicator was visually confirmed in the development Pages preview from source commit `24dcbe1bbf21f0e873317f37ee612ea4b45258be`, blob `c8050ee01630a4e5f3dc754bfb67bd1c6bd499c6`; deployment `81628aed-b972-4a52-9268-cc88ab735ff0`, URL https://81628aed.aimm-pluginhub-foundation-dev.pages.dev/. No Worker or production deployment occurred.