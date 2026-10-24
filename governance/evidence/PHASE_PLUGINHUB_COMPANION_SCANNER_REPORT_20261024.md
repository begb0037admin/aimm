# PluginHub Stage 2 — companion scanner core evidence

**Date:** 2026-10-24  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Starting branch head:** `37c2eac43c6da11a2418e5afbfb6f2c8480fc766`  
**Scope:** Read-only companion scanner library and CLI; no real plug-in folders were scanned.

## Source

| File | Commit | Blob |
|---|---|---|
| `companion/Package.swift` | `899426ebde655368b8b9b84521d444eba13f38e5` | `422f864c74c193b0511b732cfed2d13a97383186` |
| `companion/Sources/AIMMCompanionCore/PluginScanner.swift` | `ba69228b2f946973493fbe4a7e02057264b9e489` | `fcfeb2536db02b0930b7b69cce19cd00051ad250` |
| `companion/Sources/aimm-scan/main.swift` | `3d2700160469171a046d6161be09c1f2e9dcbe71` | `248a42961c28e875946b14b464f76dd41a851d44` |
| `companion/tests/test_scanner.py` | `edb7583a167686bbee125a4da05ced0e2d781b48` | `a1cce2126f67dbc6078949501b0251cff30a0802` |
| `companion/README.md` | `8315ea105e2ffd3728f7e519dee3257681f91fa8` | `552126116ebb041bb23a46e38d889f6f75e47092` |

## Local validation

- Swift 6.3.3 `swift build`: **passed**.
- `python3 -m unittest discover -s tests`: **3 passed**.
- Tests create temporary synthetic AU, VST2, VST3, CLAP and AAX entries, then invoke the compiled scanner. They verify supported format detection, Info.plist fields, AAX and symlink exclusion, no descent into a plug-in bundle, duplicate suppression for overlapping roots, and explicit-root validation.
- The CLI accepts no implicit scan locations. It reads bundle Info.plist files up to 256 KiB and names CLAP entries from their filenames. It never loads plug-in binaries.

No user plug-in folders, real plug-in data, provider credentials, network service, or deployment were involved.

## Stage boundary

This completes only a locally testable read-only scanner core. It is not the complete Stage 2 companion or signed macOS app. Folder-picker permissions, menu-bar UI, local journal, keychain/device identity, pairing and credential exchange, authenticated inventory sync, app packaging/signing, and independent review remain open. Foundation remains **NOT MET**; no later stage is claimed complete.
