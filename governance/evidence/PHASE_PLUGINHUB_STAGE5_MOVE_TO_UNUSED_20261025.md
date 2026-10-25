# Stage 5 move-to-Unused implementation — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested code checkpoint:** `23c3cc3391202788d350b5da865142ed4d490b10`  
**Foundation exit:** **NOT MET**  
**Stages 2–5:** in progress  
**Stage 6:** gated  
**Deployment / cutover:** none

## Implemented

The account Library can request a one-item `move_to_unused` action. The Mac asks the user to select a folder named `Unused`, confirms that the current item and destination can be previewed, then submits a device-signed preview containing the exact source, destination and tree digest. The browser's existing owner-preview flow exposes the exact paths; a fresh passkey confirmation is required before the Mac enables its local Move button.

The companion journals the action in its local SQLite database before touching the filesystem. It rejects a changed preview digest, a destination collision, symlinks, unsupported entries and unsafe source/destination relationships. Same-volume moves are rehashed after the move. Cross-volume fallback copies to an operation-specific staging name, verifies the source and copy, renames the verified copy, persists a destination-verified marker, then removes the source. Replay and crash recovery check the journal and both trees; an ambiguous pair is preserved for recovery.

After a successful move, the companion scans all available standard and saved custom plug-in roots and syncs a complete new inventory generation. The signed receipt includes the exact preview digest, redacted tree evidence and rescan generation. The Worker accepts success only after owner confirmation and after the synced generation no longer contains the moved record. The new D1 migration preserves queued actions and encrypted exact previews while adding the action kind.

## Verification

`sh scripts/pluginhub-nonprod-check.sh` passed against the exact source blobs below. It built the Swift companion, ran the local journal/action fixtures, scanner checks (3/3), API and browser checks (34/34), JavaScript syntax checks, local D1 migrations through 0018, and an isolated local Worker. It also verified local Swift pairing, complete inventory sync, Manual Check and signed reveal receipt.

Synthetic file-action fixtures cover successful move and replay; a pre-existing identical destination; content changed after preview; ambiguous source/destination copies; a journal-marked verified copy; resumption from a matching staging copy; and a symlink inside a bundle. API/browser fixtures cover explicit move queueing, exact destination and digest requirements, preservation of encrypted previews through migration 0018, and rejection of a move receipt before owner passkey confirmation.

The suite did not use a real Auth0 session or authenticator, select a real Mac folder, move a user's installed plug-in, or complete the move through a real browser-to-Mac passkey walkthrough. It tested recovery from a synthetic staging copy; it did not trigger the cross-volume fallback on a second filesystem. Remote isolation/recovery and fresh independent review remain outstanding. These limits are not Foundation exit evidence.

## Source pins

| File | Commit | Blob |
|---|---|---|
| `library-api/migrations/0018_move_to_unused_action.sql` | `d7e298ed8f37ad378ba5836dd8c984dd88d3324c` | `fe5d5b5bddbbbfaf9965044cc6e63cfc8335947a` |
| `companion/Sources/AIMMCompanionCore/ScanJournal.swift` | `ff40cde1cf84057a05d0a52c75a7d71060b2662a` | `78e6bac44aefa9f7041dff8290c3026efb4cf15c` |
| `companion/Sources/AIMMCompanionCore/LocalPluginFileActions.swift` | `64621a044fcbb6daa9adf9dcab0e3bdac54b8fcd` | `d302e60d312c108e1b2ec0da8cbbca8497747ca0` |
| `companion/Sources/aimm-journal-check/main.swift` | `7da91d2b4481d2317708e3c0580bec304aef961c` | `861ce8fb4a3257ec92a027d9c80f81036cef774b` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `fa1b22a1f697c311acceac1b47c795d02187e4f7` | `20366b3e24abc0639f538ce767f5b1082c4734a0` |
| `companion/Sources/AIMMCompanionCore/DeviceSync.swift` | `020bf4becfa4be157cf939ad5a141cebf082a7f0` | `cb6d5cc645b10da407278a8336ad1f17b484cc84` |
| `library-api/src/index.js` | `6681dbd65c860665033a726e274a24c802cd38d5` | `3211351e3ea871f8aab89f0d24c127dbff53858e` |
| `library-api/library-account.js` | `a57936e7dd46df0635841e7fdd0a6a7a018a77c4` | `c501091536829031fb0b5b3d46187a23a8f1abab` |
| `library-api/test/foundation.test.js` | `e73df4eafd56caf207e8ddf2ba34e242fa3553d9` | `edf27d01103df7934d9036a28b69a444c66a85a4` |
| `library-api/test/library-account.test.js` | `d5ccc89f16de8877200b022d9a9cc288692d4e6a` | `75c71b85a5ed1ede133f255a2973432575707586` |
| `library-api/test/recovery-export.test.js` | `23c3cc3391202788d350b5da865142ed4d490b10` | `34f8ab7e01b2aae7f8135918fc579530c6e7f6fb` |

## Remaining gates

This completes the local move-to-Unused implementation slice. It does not complete Stage 5. Direct installer download/verification and queueing, installer launch, restore, Trash uninstall, duplicate and old-installer cleanup, vault, sharing, broader per-item recovery, and fresh independent review remain open. Stages 2–4 also retain their real pairing/runtime, live browser-to-Mac/Hope parity and complete preference/status coverage requirements. Provider-backed remote runtime, cross-account isolation and recovery evidence remain open for Foundation.

Keep Foundation **NOT MET**, Stage 6 gated, and the 22:47 D1 authorization chronology unchanged. No project D1 write, deployment or live cutover occurred.
