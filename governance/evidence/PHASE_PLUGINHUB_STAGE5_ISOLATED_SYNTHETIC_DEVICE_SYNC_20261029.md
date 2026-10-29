# Stage 5 isolated synthetic device sync — 2026-10-29

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

This closes only isolated synthetic pairing and one-record sync, reported complete by the Companion; no independent API inventory readback was made. Stage 5 remains **PARTIAL**: the supported owner UI requires selecting the diagnostic device before creating a move request. The only available device-list route is the signed-in development Pages session and may return metadata for existing devices. Automatic approval review rejected that read because it could expose non-synthetic device metadata, so the query was not made and no move request was created. Do not route around that rejection.

The prior synthetic request `b9b490c3-543b-4312-a52b-7c20b482fc81` targeted the older 1,642-entry generation and was not usable with this isolated one-entry diagnostic device. It expired at `2026-10-29T08:06:53.728Z`; it was not claimed or reused, and no replacement request was created. No file move may occur until the owner sees and confirms the exact move preview. Move, exact-preview owner authorization, restore, fixture cleanup, diagnostic credential revocation and fresh independent Stage 5 review remain open.

The Stage 5 diagnostic app, journal and fixture are temporary under `/private/tmp`. Keep the diagnostic device paired until the remaining Stage 5 action/restore evidence is complete, then revoke that device through the supported owner UI and remove only its temporary Keychain items and fixture/journal after successful restoration. Foundation remains **NOT MET**; Stage 6 remains gated.
