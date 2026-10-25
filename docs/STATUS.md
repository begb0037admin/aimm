## Latest checkpoint — 2026-10-25 13:01 UTC

Repository `begb0037admin/aimm`, branch `codex/pluginhub-foundation`. Local source checkpoint `59cc9db06d179fa501526e4d7f8ce4665e58cf6b` is now published to GitHub; the push from the previously verified head `d14b6764dfbc945fdd9d65129a1c39fffc43b99a` succeeded. The fresh local verification note is [`PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261025.md`](../governance/evidence/PHASE_PLUGINHUB_LOCAL_NONPROD_RERUN_20261025.md), blob `ef5445ed311eb834debee1c0447fea7708f882b0`.

`sh scripts/pluginhub-nonprod-check.sh` passed on the clean source checkpoint: local preview build/ad-hoc signature; Swift build/journal/recovery; scanner 3/3; API/browser 38/38; disposable local D1 migrations through 0021; local Worker health/auth/CORS and synthetic two-account rejection; and Swift pairing/sync/Manual Check/reveal/move/restore. Descriptor-anchored installer staging, atomic no-replace publication, the actual URLSession redirect-delegate rejection fixture, size bounds, DMG structure and digest checks passed. All account and installer inputs were synthetic.

The owner authorized bounded validation of `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`): verify identity/migration state, apply migration 0003 only if needed, run synthetic two-account isolation, and verify recovery through a suitable non-production path. That work has not run. Wrangler 4.152.0's token expired; the Cloudflare auth endpoint was unreachable; the requested read-only GitHub email OAuth consent is still pending. Resume remote D1 work only once the owner completes that consent or restores Wrangler auth; then verify exact database identity/state before any write. No remote D1 query or write has occurred under this authorization. The separate 22:47 database-creation authorization is resolved. Do not attempt broad table export.

The latest independent review accepted only the descriptor-anchored installer-staging slice within its stated same-UID threat boundary; it did not validate Foundation or remote behavior. Foundation remains **NOT MET**; Stages 2–5 remain partial/in progress; Stage 6 is gated. Open work includes remote isolation/recovery, provider-backed Auth0/passkey runtime and pairing, browser-to-Mac parity, remaining Stage 5 actions, required distribution/signing work, and fresh end-to-end independent Foundation validation. No production data, deployment, cutover, provider terms acceptance, or credential creation.

Next: once Cloudflare sign-in is ready, inspect the exact target and migration state, apply 0003 only if required, run only the synthetic isolation/recovery checks authorized above, and capture results. Meanwhile continue non-production work that does not need remote credentials. Keep dashboard, roadmap, status, evidence package, closeout and handover synchronized.

---

## Latest Stage 2–5 continuation — 2026-10-25 11:24 UTC

Source: branch `codex/pluginhub-foundation`; implementation commit `fd081bb1f956a1e3d98d759dddfd77a48841cd70`; evidence commit `50c2a42129ebb78df2fa079d56182ae2fa5c0367`.

Added a deterministic interruption-and-restart fixture for cross-volume restore staging. It proves the synthetic Unused source survives interruption and is deleted only after the staged destination is verified during recovery. `swift build`, `swift run aimm-journal-check`, and the full local non-production suite passed: API/browser 38/38, scanner 3/3, local D1 through 0021, local two-account HTTP 401 rejection, and Swift pairing/sync/Manual Check/reveal/move/restore. [Evidence report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_INTERRUPTED_CROSS_VOLUME_RESTORE_20261025.md), blob `b3c613bcacc905c5c68f8e2be3785fe0f1981951`.

Evidence remains local/synthetic. No real Auth0/passkey walkthrough, remote two-account check, populated remote recovery, or live browser-to-Mac parity was performed. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open. No remote D1 access/write, deployment, or cutover.


Independent read-only review **ACCEPTED** the interrupted cross-volume recovery fixture and synchronized evidence pins only; the reviewer ran no tests or remote checks. [Review report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_INTERRUPTED_RESTORE_INDEPENDENT_REVIEW_20261025.md), commit `8695988a77e3e4cec32a6bd02ac21c52cc4484fa`, blob `d968756f996036b9cb427d26a7efe6b92d444ecb`. This is not full Stage 5 or Foundation acceptance.
---

## Latest Stage 2–5 continuation — 2026-10-25 11:13 UTC

Source: branch `codex/pluginhub-foundation`, commit `b4906aeff63fb099fbf26d18709ed83bf0897e52`.

The corrected restore alias and ancestor-symlink checks passed. The local Worker fixture now uses owned temporary storage. Wrangler's vulnerable transitive `undici` was pinned to patched `7.30.1`; `npm audit` reports zero vulnerabilities. Full local checks passed: API/browser 38/38, scanner 3/3, local D1 through 0021, two-account HTTP 401 rejection, Swift pairing/sync/reveal/move/restore, and mounted APFS cross-volume move/restore/recovery. The targeted independent read-only code review accepted these fixes.

This remains local synthetic evidence. No real Auth0/passkey ceremony, remote two-account check, populated remote recovery, or live browser-to-Mac parity was performed. Foundation **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 gate open. No remote D1 access/write, deployment, or cutover. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE2_5_PATH_SAFETY_AND_LOCAL_CHECKS_20261025.md).

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

Source blobs: Worker `6ab969c04bb45d87a1b38bed470a22606cf8ac5e`; account UI `d9e282ae4b30526e5c2dd91070e4f017d8394ccd`; API tests `2d2d3f6fdf3889923740e21d48399500c9ecb06c`; account UI tests `c2f94987cbde8facbfa619ae2cd0051cdcff073f`; migration 0021 `ff23b971c20f7b6a2cf78a5d71885b68535ca9bc`; companion API client `429ba10d7b16cd3002c3d68576480947046612a8`; companion UI `5614fe1a0fcd28f510f7eab5708626ea92b3e75d`.

[Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_RESTORE_API_COMPANION_20261025.md) (source commit `42aae59be235d1024c9265817b443cf8605eabea`, report blob `d773f3c3462bc3f066408cb4cd52915d95d68a77`). Foundation remains **NOT MET**; Stages 2–5 remain partial; Stage 6 gated; 22:47 remote D1 gate open. Real Auth0 pairing/provider runtime, remote account isolation/recovery, live browser-to-Mac validation, remaining Stage 5 action classes, and fresh independent end-to-end review remain open. No remote D1 access/write, deployment, or cutover.

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

> **Latest verified checkpoint — 2026-10-25:** Implemented Stage 5 move-to-Unused groundwork through the account request, exact signed destination/content preview, owner passkey confirmation, local journal/recovery, and post-move complete rescan receipt. Full local check passed: API/browser 34/34, scanner 3/3, Swift/journal, local D1 migrations through 0018 and isolated Worker pairing/sync. Synthetic fixtures only; no real Auth0/passkey walkthrough or user file move. Source head `23c3cc3391202788d350b5da865142ed4d490b10`. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_MOVE_TO_UNUSED_20261025.md), report commit `8bf8057575c9463df02b266e659d490da695a44f`, blob `5154a105c90eb85211012fbe6542e6d5e14ef136`. Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated. No remote D1 write, deployment or cutover.

> **Latest verified checkpoint — 2026-10-25: after the Swift companion submits its signed exact preview, the account UI now offers a passkey-gated “View exact path” flow using the one-use capability. Browser UI/API tests and the full local suite passed (API/browser 34/34; scanner 3/3; Swift/journal and Worker/D1 pairing, sync, signed preview and receipt). Tested source checkpoint e41e8b12cf573f311a1198310b76859195c962fb. Real passkey/account walkthrough and Mac authorization revalidation remain open. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit f4ef278b89370bfd546ca9be584d59d361e9a320, blob 60fb6f9865a786e596649f0df36f98a3add8b4a1).**

> **Latest verified checkpoint — 2026-10-25: the Swift companion now signs and submits its exact local action preview; the local Worker verified it and stored the path payload encrypted in D1. Session-bound one-use owner preview access is also implemented at the API layer. Full local checks passed: API/browser 33/33, scanner 3/3, Swift/journal, Worker/D1, pairing, sync, Manual Check, signed preview and receipt. Tested source checkpoint 326fd668ae3b78623ea25a66c0a2e1c66e478fd4. Real passkey/UI walkthrough and device-side revalidation before action remain open. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit 7efbbb7c5f7db79f1245fc01d7cb3a2d0316f1c5, blob fce7d85deb79a05e746b3920334a9f208556378b).**

> **Latest verified checkpoint — 2026-10-25: the local API now verifies a paired-device signature, encrypts the exact preview, and offers a WebAuthn-gated, session-bound, one-use path capability. Focused capability/session tests and the full non-production suite passed (API/browser 33/33; scanner 3/3; Swift/journal and local Worker/D1 integration). Tested source checkpoint be6ac59915b428d15edcdac8cb0d7cb094582d37. A real authenticator and companion/UI integration have not yet been exercised. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit b8b5870a87b204e6be32184818c61aa6c3e9f79b, blob acea46bc2508667881e7543abacb1811bbf28ec6).**

> **Latest verified checkpoint — 2026-10-25: the Worker verified a device-signed exact preview, checked it against the current operation and inventory, derived its digest, and stored the canonical path payload encrypted in short-lived local D1. The focused test and full non-production suite passed (API/browser 33/33; scanner 3/3; Swift/journal and local Worker/D1 integration). Tested source checkpoint cea877952d6c3765e58db4376aa0044d83c748f1. Owner preview unlock/retrieval/confirmation and companion revalidation remain unfinished. Stages 2–5 in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit d5bb28f7ac707e22b6f0a068d2147be9d5244149, blob c80f95e482b45a9c8070a8f8ebf1411407a1842b).**

> **Latest verified checkpoint — 2026-10-25: exact-preview WebAuthn challenge binding passed the focused test and full local non-production suite (API/browser 33/33; scanner 3/3; Swift/journal and isolated Worker/D1 pairing/sync/receipt checks passed). Tested source checkpoint 8c6da696b8e030e9f301385046159f2802ef5a7f. This only binds a passkey challenge to an unlocked operation/digest; signed preview, encrypted path payload, one-use capability and end-to-end device authorization are still unfinished. Stages 2–5 remain in progress; Foundation NOT MET; Stage 6 gated. No remote D1 write, deployment or cutover. Evidence: governance/evidence/PHASE_PLUGINHUB_ACTION_PREVIEW_WEBAUTHN_BINDING_20261025.md (commit 47c01bfee1564568787816d68dba4ba70fa052fd, blob 13e0cf81df9ca2e2668c785b08e45fb32afaea40).**

> **Latest verified checkpoint — 2026-10-25 08:01 UTC:** live checks parsed public versions for four vendor adapters: FabFilter (14 products), Voxengo (46), u-he (3), and Valhalla DSP (4). The full offline non-production suite passed on source head `3a1034526716b981634ff15523a30874f2e90a2e`: Swift companion/journal, scanner 3/3, API/browser 30/30, isolated Worker/D1, pairing, sync, Manual Check and signed synthetic receipt. No account data was sent to vendor pages; no installers were downloaded. Stages 2–5 remain in progress; Foundation **NOT MET**; Stage 6 gated. No deployment or cutover. Evidence: `governance/evidence/PHASE_PLUGINHUB_STAGE4_LIVE_VENDOR_ADAPTERS_20261025.md` (commit `d86dc27891f2a7d225c06c24812274643608dd83`, blob `52f9e83475cfd2756ad20335a05c31f5add01697`).**




> **Latest verified checkpoint — 2026-10-25 07:33 UTC: added a reproducible unsigned macOS app-bundle packager for the companion. The generated app passed plist validation, launched successfully and showed a safe first-run state without scanning or pairing. This makes the local non-production companion directly testable; Stage 2 is still in progress. Stages 2–5 remain in progress, Foundation exit remains NOT MET, and Stage 6 remains gated. No deployment or cutover occurred. Evidence: governance/evidence/PHASE_PLUGINHUB_STAGE2_NONPROD_APP_BUNDLE_20261025.md (commit fb6ed3b1bdb6e9e6c2886878592025c0c0a8e465, blob e73244d93e54dc06be98f9aaec3e1a285fde332d).**

> **Latest verified checkpoint — 2026-10-24 22:26 UTC: u-he vendor checks now preserve successful product-page results when another official page fails; only the affected product reports an error. Unsupported products remain Manual Check. The deterministic mixed-success fixture and full isolated non-production check pass. Stage 4 remains in progress; Stages 2–5 remain in progress, Foundation exit remains NOT MET, and Stage 6 remains gated. No deployment or remote project D1 write occurred. Evidence report: governance/evidence/PHASE_PLUGINHUB_STAGE4_UHE_FAILURE_HANDLING_20261024.md (commit f8979fc5a19f3a9816fc9ccbcb4d0d7b4d00c45a, blob f0495afea31d0af28c8eb24a6613318f089de7c3).**

> **Latest verified checkpoint — 2026-10-24 22:22 UTC: added u-he version observations and fixed official vendor-page actions for Diva, Hive 2 and Zebra 3. The full local non-production check passed after fixing the API bundle-identifier field mapping. This is one Stage 4/5 increment; Stages 2–5 and Foundation remain in progress, Foundation exit remains NOT MET, and Stage 6 remains gated. No deployment or remote project D1 write occurred. Evidence: governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_UHE_INCREMENT_20261024.md (commit a5dc9312825b3cd14447528918da9a85298a3e42, blob 3489621d2446a9c48c2b647fe33677e9791db198).**

# Project status — PluginHub replacement

**Latest verified checkpoint — 2026-10-24 22:15 UTC:** Eligible failed supported actions can now be retried; the API retains the parent action and rechecks the item's current inventory and vendor route. Full local no-deploy suite PASS, including signed Voxengo failure receipt/retry/replay/cancel, Swift build/check, scanner 3/3, API/browser 30/30, syntax, D1 recovery through 0012, local Worker/D1 and synthetic Swift flows. No actual Mac action, remote isolation check, project D1 write or deployment. Real-device/action recovery, broader vendor coverage/parity, remote runtime/isolation and fresh independent review remain open. Foundation NOT MET; historical Stage 5 review PARTIAL; Stage 6 gated. Checkpoint `35091e56c60e3c537353c025011df465fec1dc25` / `9b565d460feec29161828d75115e5c6af50642fb`; progress `889be114c3aa0123ebbd70fb50d9c3a89115416a` / `0b74bf4706f13e107fc8729f5f027df0b1772c37`; evidence `a080c71489048cd2b724df3d10cb809a81c29a50` / `a463e9bb129b776fb1c1fbfa98f07fc6df1296e3`; closeout `3ada79bc9b76ce77e98b35b7f681b00c96b06296` / `c0101521a67cf7452bfb671887a74b6186a6362c`; dashboard `ce920b86449c1f913f699b243f1decbda7c46f8e` / `357fc782113cc6e003f18f3253e5f91352d8d079`; roadmap `c449c0e46312dda64ce0642989b298c9d988f811` / `27c101d794b51918a44124de953b15b897cc930c`.

**Latest verified checkpoint — 2026-10-24 22:12 UTC:** Added the Voxengo fixed vendor-page action. The account UI exposes it only for supported vendors, the API rejects unsupported items before queueing, and the companion derives the fixed URL locally and requires a separate Mac confirmation. Full local suite PASS: Swift build/check, scanner 3/3, API/browser 30/30, syntax, recovery through migration 0012, temporary Worker/D1 checks, synthetic pairing/sync/manual status/signed receipt, and supported/rejected action tests. No real Finder/Keychain action, remote isolation test, project D1 write or deployment. Real-device/action recovery, wider vendor coverage/parity, remote isolation/runtime proof and fresh independent review remain open. Foundation NOT MET; historical Stage 5 review PARTIAL; Stage 6 gated. Report `f5a6ed2791fbe8a7dfeef953cb7388545808c58b` / `8638387ae2c7c78c9bae2541ef8de545c3049be9`; progress `faa512ac680f2adf4b59e27b92aadd1f6650d885` / `2341acbbc5862ed74ad69f9f1ce96a5b738d83fa`; evidence `9b703bfed30ca71eac948e9c78d9dbfd2fb0611c` / `13dabae448896fda9b58817a2bf970f7c567bef5`; closeout `966c684bee6cef106433a22c4b82af1fb589391d` / `4d59e5bb060d0c95dabded5d4ca73df953cd4523`; dashboard `bb7301aa230ba66f275dff4ce53a1e1e25ead552` / `c38579b024529dd9c67b7b7f948f63966a3c299a`; roadmap `ccf8263d718a2608ecb280257b2ebaf6e49073a4` / `3ab5fda1a8eab46e99e8e4c14f4f1cafcd1ceb07`.

**Latest verified checkpoint — 2026-10-24 22:08 UTC:** Stage 4 adds a Voxengo public-version adapter and companion control. Fixture checks and the local full no-deploy suite passed, including scanner 3/3, API/browser 30/30, syntax, D1 recovery through 0012, temporary Worker/D1 health/auth/CORS and synthetic Swift pairing/sync/manual status/signed receipt. No real vendor request, Keychain/Finder action, remote two-account check, project D1 write or deployment. Wider vendor coverage/parity, real-device/action recovery, remote isolation/runtime proof and fresh independent review remain open. Foundation NOT MET; historical Stage 5 review PARTIAL; Stage 6 gated. Report `8cc2c4916188bd983f986935d17c170b714e6853` / `9befc2863f5701902f7cdba5729fca61f8d8358f`; progress `83a4af522550feccd454bc3d3a9cf4ed253177a2` / `1cb1c3f419cc8a5e3be3def9adde7965131f5282`; evidence `6d5c7d971a2d62dbec1a793752e2658a1a77df10` / `c9f6019d3785fba0402103ef5be217f051064446`; closeout `478775975ae6b142f28394aea9999d1b3e9a451e` / `0daf03eba226e9ab6efe63565689e1beeb884c5b`; dashboard `f284dbd2edc1442be06c9ab5153225cc4cb3dd9a` / `94059da52a9aba726ed451a5944cc1f2579d80be`; roadmap `d8a3bc06c3a139ee06acfad11f4ce12c8456dff9` / `3e00665582c1bf2ad6b5eccbc008a88a28bb4ada`.

**Latest verified checkpoint — 2026-10-24 22:04 UTC:** Stage 3/5 now has a read-only account-scoped action preview for Hope and the account UI. The preview is bound to the active device's current complete generation; it omits local paths/URLs, queues no operation and changes no file. Cross-account lookup returns not found; local Mac confirmation remains required. Full no-deploy suite PASS: companion/checker, scanner 3/3, API/browser 30/30, syntax, recovery/migrations through 0012, temporary Worker/D1, synthetic pairing/sync/manual status/signed receipt. No real Finder/Keychain, remote two-account test, project D1 write or deployment. Real-device evidence, broader Stage 4/5, full parity and fresh independent review remain open. Foundation NOT MET; historical Stage 5 review PARTIAL; Stage 6 gated. Report 9c5b10424f2dab7148b4f564c372fb53fdccbed1 / 9fbc936e27ca18f09c26f09569901db3cdacb56e; progress ecbeaba44d8f8d8cfbbdb85ba62471fac6b7b251 / 34612fa9e7bb2a2a81d6591a5fd3554bed7eef08; evidence cf418f18e88d499b3293b3a79e0cff28c6741c47 / 76f00a75c1b5d9ad582ec19c659f0d18cf647499; closeout a9d5506770ba076b649349e59c61c82e6152820a / 604c961d35a702d17dccad370ad496b09bc4c330; dashboard 4b904cc27f7d4171953a1564845022e1507be503 / 4e1bb397f4f75ff10ce4aae9263eec87d21a67ce; roadmap a9643a3655ba2a6ab762000022ccba389107c082 / 08e94407626a9e3cf6bda9d83f175bb5b8d8eb77.


**Latest verified checkpoint — 2026-10-24 21:42 UTC:** Stage 4 includes a non-production adapter for current FabFilter public versions; other vendors remain Manual Check. The complete local suite passed: companion/app + adapter checks, scanner 3/3, API/browser 30/30, syntax, temporary local D1/Worker, Swift pairing/sync/manual upload, and synthetic signed reveal receipt. No live vendor test request, real Finder/Keychain action, remote write, deployment or cutover. Foundation remains NOT MET; historical Stage 5 review PARTIAL; Stage 6 gated. Report e8eaae29e0197f2781363f4e5c8088be587fe921 / 4865777cb6e36d94231ac26bb5ed092111299dc3; progress 1fb53618727b671a94333d018db12831df8e2c07 / faed54d7cb737918da4caf0f73a7d8ef5b15ecbc; evidence package 0d790ab5aadc322fa72609b123f9e7f1d043096f / e82a8c6b613788053e4a4699964f5e48f5702d16; closeout 54f48e65fb4968445b0915fc233442cbc2f48092 / 4bc394da3e20431a635543661fefc29026b6cce4; dashboard d93aa59fd1f1f86a53b6a99a4b194fd45e500098 / e4a1113f7bed145c2d77a8452b576dc478ef40a7.


**Verified checkpoint — 2026-10-24 21:36 UTC:** Verified 2026-10-24 21:36 UTC: Stage 4 companion submits path-free Manual Check observations for the active scan when vendor adapters are unavailable. Status source/route are manual with explicit manual_check_required reason; no vendor calls or current-update claims. Stage 2 saved roots, Stage 3 shared Hope/site snapshot, and Stage 5 cancel/retry remain. Full local suite PASS: companion build, scanner 3/3, API/browser 30/30, temporary Worker/D1, Swift pairing/sync/manual check, signed synthetic receipt. Automatic vendor adapters and remote/real-Mac evidence remain open. Foundation NOT MET; Stage 5 review PARTIAL; Stage 6 gated. Report aa4bf75e41c4aebec964dbda9f7251eefd270ad7 / 0425cdbacacf1d3398df143a891c14390d968185; progress 2e1bcabfab8a99eb908eafd8de0d63ec54dff913 / 60eef1b8efc2628be8098a069ff71f1893e1ebe8; evidence package 5022735d805e912b0d1ebc22e87177ba7442e8e4 / c0b04e84c96c66c902ec110eab6a64491326b09b; closeout ff1f7895a1f5f1e9a458143d1733de32cca8a4cf / 04a3aadbe0f23d81d9260be0b92b03b58cb69120.


**Verified checkpoint — 2026-10-24 21:33 UTC:** Verified 2026-10-24 21:33 UTC: Stage 2 standard-root scans and local custom-folder bookmarks; Stage 3 account preview and Hope read the same inventory snapshot and show last API contact/observation time; Stage 5 failed-reveal retry and pre-claim cancel. Full local suite PASS: app build/bookmark fixture, scanner 3/3, API/browser 30/30, local D1/Worker, Swift pairing/sync and signed synthetic receipt. Last contact is not live-online proof. No actual Finder action, real folder grant, Keychain write, remote write, deploy or cutover. Foundation NOT MET; Stage 5 review PARTIAL; Stage 6 gated. Report 4e5511261f5d4b9b5e96517eb2362e7ebdb2dcd8 / fa6d3abb8f31c3cd6e43f84631a164e7d1b1055f; progress 627068200512ddadb7dc3385cadc9cabf90e11f7 / a0273395485f2568f6471955950b36bd31609270; evidence package e15b1d9b3dd4a3533dbc7b974b6a9579c601bacd / 7f83aa4a4c4a570906fbb5a347176e76f9c29343; closeout 193bd4ca72ed3eeeca267d379e1624e0456302e5 / 32945b4fcd81c6271bff06376df7e987fbb105f0.


**Verified checkpoint — 2026-10-24 21:31 UTC:** Verified 2026-10-24 21:31 UTC: Stage 2 standard-root scans and local security-scoped custom-folder bookmarks; Stage 5 retry of eligible failed reveal items and owner cancel before Mac claim. Full no-deploy suite PASS: companion build/bookmark fixture, scanner 3/3, API/browser 29/29, temporary local D1/Worker, Swift pairing/sync and synthetic signed receipt. No actual Finder action, real folder grant, Keychain write, remote write, deploy or cutover. Foundation NOT MET; historical Stage 5 review PARTIAL; Stage 6 gated. Checkpoint 3f1eace8edd55c283201df5d7856d468bba1b312 / 0e5127bfbcb6a94c1f24f22e1342b5cfff92d06e; progress 8b739e41ffaa221dc427b72da21d1437961fb395 / 9bd16ee3b188ed2e2daacbcb514d339fdc275e03; evidence package 11d0791912648bda336edbb7ede52553a21da115 / be2a14ffa01df1a5bf0874cc56789cc43c0c320c; closeout fe479d3fb4e4d474ec90210d8e30204d74b98b66 / 53295428beec1dbf78f4b960c118e83d8c0e20f6.


**Verified checkpoint — 2026-10-24 21:29 UTC:** Verified 2026-10-24 21:29 UTC: companion has user-triggered standard-root scanning and persistent local security-scoped bookmarks for custom folders, with rescan/forget and stale-grant reporting. Bookmark temp-fixture round trip passed. Stage 5 failed-reveal retry retained. Full no-deploy suite PASS: app build, Swift checks, scanner 3/3, API/browser 28/28, local D1/Worker pairing/sync and signed-receipt readback. No real plug-in path, Finder action, remote write, Keychain write, deploy or cutover. Foundation NOT MET; historical Stage 5 review PARTIAL; Stage 6 gated. Report 1a46f969239313b3e82b0bbba70743207cacd06f / 3dcff9a7129d55d3399ef36a7d03667307c6fe95; progress 1e702a7fb701a0738691b3d26e134886484314b1 / 5b727851f877b4b5d9b2f3a470b070c136bd96f1; evidence package 9d86141a495b780278a629f8a46b657a0ace9163 / a5ff276f539406332888f12099d8176ca8a88ab0; closeout a25e5eb5c53d92d57af39458eacd73acc394eba5 / f41a529dac224adf725bd482156f129b89598897.


**Verified checkpoint — 2026-10-24 21:25 UTC:** Verified 2026-10-24 21:25 UTC: Stage 2 now offers user-triggered scans of standard user/system Audio/Plug-Ins folders, with custom folder selection preserved. Stage 5 one-item failed-reveal retry retained. Full no-deploy suite PASS, including aimm-companion app build, Swift/root-discovery checks, scanner 3/3, API/browser 28/28, local D1/Worker, actual Swift pairing-init/sync, synthetic signed-receipt readback. No Finder action, remote write, Keychain write, deploy or cutover. Foundation NOT MET; Stage 5 review PARTIAL; Stage 6 gated. Checkpoint d8c374de4dd8dd9c5ce24cc1327921cf522f5a13 / 343872b1b1dd65cc42ce269de5f8f92f8d79335c; progress 824529711e859cf643b8b8ecb61d1981f8a5ed78 / 83c7f51de232cb7d1309e173526a2785606afe8c; evidence package ccf4aab5d2691bbcd473e0931458d91c4266b060 / a50dce1d33767c627d2f66b380fbb0cec7a57f73; closeout 3f528563a4cb2a99a7e384cc11a8bfce5d716edb / 1c6f219ba843a115b98f5e35e8b6a9cd2c56146a.


**Verified checkpoint — 2026-10-24 21:23 UTC:** Verified 2026-10-24 21:23 UTC: Stage 5 one-item failed-reveal retry is implemented. Full local no-deploy suite PASS: Swift companion checks; scanner 3/3; API/browser 28/28; syntax; temporary D1/Worker health/auth/CORS; actual Swift pairing-init and sync; synthetic claim and signed receipt readback. No Finder action, remote write, Keychain write, deployment or cutover. Foundation NOT MET; historical Stage 5 review PARTIAL; Stages 2–5 in progress; Stage 6 gated. Report c92c708ad0b2bf925c4c8babc6d694222d6bad31 / 21915892504cddabcf15910339712c5101bc240e; progress 51c77d65d32e67c66e1bba0dfc40ecb1f825ff2a / 275cfed6a7166589659bf0cc9e19e41310d928e; evidence package de9b890e806360c7d6fd8993c44a1ef242604b3c / 820476f51deb28fcfbb534bd815ed88919deb156; closeout 1aaa8f2942b3786b3cb18e2b022d746b91e9f5c4 / 4a987c44d7c61fa106f50422457c9a82532f054c.


**Verified checkpoint — 2026-10-24 21:17 UTC:** Actual Swift pairing-init and inventory sync pass against temporary local Worker/D1. A synthetic reveal operation was polled and claimed; its P-256 signed receipt was verified and stored in local D1. No Finder/file action occurred. No remote call, Keychain write, or deployment. DeviceSync `b6cab365986c452e5e395b99d2e73aaeaf6a9854` / `3dcf98558d50ed45a4fd9c3fbf2f101f0f2a1913`; checker `f3bb230bd196048c793c19bf1780304946cb9574` / `7dd9bc8c71ee45a9cde85486ea80b134e42a47b7`; script `b75ca2c5db00b90a49686dce16cd52a3e28d7cf5` / `0c473382381b40081697c22013b2137d941086d9`; fixture `1383941cc3d1f2900561d49246f05ac194ea71b9` / `c1964871c1adf7cbdf3fe8ecbefa67925b67a080`; report `67b97e99fa2ce849ada265b364c965d8a15471a7` / `c13e5c72a80ce2e9c3d3ee490d47c83b8374e065`; progress `f67830670d3981651c5ffb0a5957b706fbd0581a` / `b735ca077ad488ee103d7780eed0bd5d513a71a2`. Foundation NOT MET; Stage 5 PARTIAL; remaining remote, real-Mac, broad action, parity and independent review gates remain open.


**Verified checkpoint — 2026-10-24 21:13 UTC:** Full no-deploy suite PASS, including actual Swift sync through temporary local Worker/D1 and readback of one complete generation/record; all temporary state removed. Checker `0e19d9ee859f406fe6ffaa752239bb57395b7965` / `e2ff00ba172c5f25e4bffa811b8bfbcedf8a5221`; script `328a2f2fd73d2d98aaa2cab3e1329fd9de06c318` / `151c9bdac71f9e7ad16d2e67d222ff10597c3ced`; report `6e7b3c43c1255417dc588496ba49a36296f759cc` / `07933dc4ab293f37cf18308b9378df4de8f0ea6c`; progress `8a85589f083a6d7cf4261087c3a9ef933832d8ce` / `04a0a95286dd9eb336fbedf83c7aff951e9453aa`. Foundation remains NOT MET; Stage 5 remains PARTIAL; remote and independent gates remain open.


**Verified evidence pins — 2026-10-24 21:09 UTC:** checkpoint report commit `611ebdb5aa0829bcb7e525a259d25a4c613ea332`, blob `ead1a267ac13a4cf1083b14163cd33a27fba3965`; progress commit `ac3f6d13fb3251ec38a925011c13c87da8608851`, blob `6b647d5204f530819aa67261b0f04468d2b711e2`. Full local suite PASS; Foundation NOT MET; Stage 5 PARTIAL.


**Current checkpoint — 2026-10-24 21:09 UTC**

**Foundation exit: NOT MET. Historical Stage 5 review: PARTIAL. Stages 2–5 in progress. Stage 6 not ready.**

Repeated non-production suite passed after rerunning with local SwiftPM build permission: companion build/check; scanner 3/3; API/browser 27/27; JavaScript syntax; temporary local D1 migrations and Worker health/auth/CORS; actual Swift pairing client to temporary local Worker/D1. Temporary state removed. No remote call, deployment, owner approval, device credential issue, or Keychain write. Sources: checker `8bf8926e13b1f05c7ea95b008b9a67d4b1b61d5a` / `38dd08b4d27716c047f343d86b0230d6d0e4205f`; script `9dd10e3b12a47108fe9903e17423fdba6f1b3ed0` / `e698c9e5af5be542f0baaa6acf8c165a59b3c6d7`; report `ead1a267ac13a4cf1083b14163cd33a27fba3965`; progress `9ee4dfa401afd193a555608114f61ea5a3f89851`.

Remote Worker HTTP and cross-account denial, full remote recovery, real Mac/Keychain pairing and end-to-end receipts, parity closure, and a fresh independent Stage 5 PASS remain open. Preserve Foundation NOT MET; Stage 6 remains gated. No deployment or cutover.


**Current checkpoint — 2026-10-24 21:08 UTC**

**Foundation exit: NOT MET. Historical Stage 5 review: PARTIAL. Stages 2–5 in progress. Stage 6 not ready.**

The local regression now drives the Swift companion pairing client against a real temporary local Wrangler Worker/D1. The Worker accepted its P-256 proof and returned the pending approval phrase/URL; temporary state was removed. No approval, device credential issuance, Keychain write, or remote service call. Checker `8bf8926e13b1f05c7ea95b008b9a67d4b1b61d5a` / blob `38dd08b4d27716c047f343d86b0230d6d0e4205f`; script `9dd10e3b12a47108fe9903e17423fdba6f1b3ed0` / blob `e698c9e5af5be542f0baaa6acf8c165a59b3c6d7`; report `f8ce146ce72c6321ba377f5134d1aa2ca6db1a1d` / blob `7016f442027fe2b6f5ff3ff41c9101b3df7912f0`.

Auth0 A/B browser/session/CSRF/local isolation tests already passed against local Worker/D1. This is not real Mac/Keychain pairing or remote HTTP proof. Cloudflare shows a pre-existing dev Worker, D1-bound with 03:00 schedule; unchanged here. Remote HTTP cannot be reached from this environment due DNS/browser access.

Remote D1 read-only: migrations 0001–0009; 20 tables; 2 accounts; 4 revoked devices/credentials; 23 active sessions; no pairings/operations/receipts; one rate-limit row. No row contents/writes; list metadata says zero tables despite SQL results.

Open: real Mac pairing, remote Worker/auth and cross-account denial, full remote recovery, end-to-end receipts, parity closure, fresh independent Foundation PASS.

---

# Project status — PluginHub replacement

**Current checkpoint — 2026-10-24 20:25 UTC**

**Foundation exit: NOT MET. Historical Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

The companion's mocked sync path, path privacy, approved HTTPS origin, and same-origin redirect guard pass. A focused independent source review found no defect. The dev D1 migration ledger is 0001–0009 and the new Stage 2–5 tables are present. Swift build/checker PASS, scanner integration 3/3, API suite 18/18. The Cloudflare API blocked `PRAGMA integrity_check`, so that result remains unknown. Real browser/Mac runtime, remote isolation/recovery, full action receipts and broader parity remain open. See `governance/evidence/PHASE_PLUGINHUB_STAGE2_SYNC_CLIENT_REVIEW_20261024.md` and `governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_SYNC_D1_CHECKPOINT_20261024.md`.

---

# Project status — PluginHub replacement

**Current checkpoint — 2026-10-24 20:21 UTC**

**Foundation exit: NOT MET. Historical Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

The companion now has local mocked-transport evidence for its complete inventory sync sequence and path privacy: start/chunk/finalize requests, device bearer headers, development-host restriction, and no raw local plug-in path in the upload. Swift build and checker pass; scanner integration passes 3/3. This does not establish live pairing or remote runtime. Code tip: 7636f5f6a1726eadd93f6c9588e6c7c0e11a2feb; source/checker blobs: 8b40602ee4bc2892ddb753877c9efda274109d3f / 205d807d30fc7efc0d6f696bfd3a85f085964f01. Remote isolation, full recovery, real browser/Mac runtime, broader parity and fresh independent Foundation validation remain open.

---

# Project status — PluginHub replacement

**Current checkpoint — 2026-10-24 20:14 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

The Stage 4 “Raw updates” count now uses raw observations. Regression checks cover stale raw-vs-bucketed counts plus hidden/snoozed actionable counts. API/browser tests 18/18; JavaScript syntax checks, Swift build and local journal check pass; scanner integration 3/3 passes. Independent patch review found no defects in this UI fix/test; it does not validate runtime or Foundation exit.

- Code commits: `79432e49bbd0120169da4154de0dac3c68f98e68`, `3ef22d83d8a4e6de6943f9ec2b81895ca9ac863d`, `e42ea2c56295780330b583a0c433ba073fce5292`.
- Patch-review report blob: `ebd5c362114288d90432a7d34cce570d82362635`.
- Progress blob: `8ebc9d9e6f9f723cdaccc7c7cff1290f4b128657`.
- Evidence package blob: `64634f338e9363264e5c12ca5773774f0c3350ee`.
- Foundation closeout blob: `eb42c8c1e92f64f2ba1eb8f275d0415a9c587ce6`.

Read-only dev D1 ledger confirms 0001–0005 applied and 0006–0009 pending. No remote writes or deployment. Live Auth0/browser and paired-Mac runtime, remote isolation/recovery, end-to-end actions, broader Stage 2–5 parity, and fresh independent Foundation validation remain open. Foundation remains NOT MET; Stage 6 stays gated.

# Project status — PluginHub replacement

**Current checkpoint — 2026-10-24 20:11 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

A Stage 4 status-panel bug is fixed: “Raw updates” now uses the raw observation count. Browser/API regression coverage verifies stale, hidden and snoozed cases. API/browser tests 18/18, JS syntax checks, Swift build, scanner tests 3/3, and the independent patch-level review passed.

- Code commits: `79432e49bbd0120169da4154de0dac3c68f98e68`, `3ef22d83d8a4e6de6943f9ec2b81895ca9ac863d`, `e42ea2c56295780330b583a0c433ba073fce5292`.
- Independent UI patch review blob: `ebd5c362114288d90432a7d34cce570d82362635`.
- Progress report blob: `95168f3c625bbb494723c8cd7ea0ffe681afcc06`.
- Evidence package blob: `8843231b82cd639c205e0f0464cfcd0da2969c80`.
- Foundation closeout blob: `29588621726a820cb15661c5a8beb092d292bffb`.

Read-only Cloudflare checks show dev D1 migrations 0001–0005 applied and 0006–0009 pending. No remote database write or deployment. Live Auth0/browser and paired-Mac runtime, remote isolation/recovery, full Stage 2–5 parity, and fresh independent Foundation exit validation remain open. Keep Foundation NOT MET and Stage 6 gated.

# Project status — PluginHub replacement

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

Stages 2–5 are locally implemented and independently source-reviewed; runtime and Foundation exit gates remain open. No deployment.

---

# Project status — PluginHub replacement

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

## Current PluginHub Foundation status — 2026-10-24 16:24 UTC

**Exit: NOT MET. Stage 5: PARTIAL. Stage 6: not ready. Deployment: none.**

**Complete at code/local-test level:** device pairing and device credential lifecycle are implemented. Local API suite: **14/14**; includes pairing proof and owner approval, CSRF, one-time delivery, device-scoped identity, credential rotation race protection, revocation, abuse limits, caps and cleanup.

**Remote D1:** migrations 0001–0005 are applied to the isolated development database. Current read-only queries show zero rows in accounts, devices, credentials, browser sessions, pairings and pairing rate limits. Foreign-key check: zero violations. Cloudflare rejects `PRAGMA integrity_check` with `SQLITE_AUTH`. Current Time Travel bookmark read. Post-0005 export generation completed, but export SQL was not downloaded/restored; earlier local export-copy restore only covers schema 0001–0003. No Time Travel restore was attempted.

**Remote runtime/isolation:** Cloudflare inventory shows no `aimm-library-api-dev` Worker. Therefore no remote HTTP runtime, cross-account rejection, or remote pairing result is claimed. These require a non-production Worker deployment, which remains out of scope. **Fresh independent review is complete: pairing/credential code and local tests PASS (14/14); remote runtime/isolation and post-0005 recovery remain unproven. Overall Stage 5 PARTIAL; Foundation NOT MET. Report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REVIEW_20261024.md` (blob `166e9c683dd80302e65b6daa60d6aa39c4964171`).**

**Next gates:** (1) authorize deployment of the non-production Worker with already-configured provider values, (2) run remote two-account session/CSRF/isolation and pairing probes, (3) retrieve and locally restore the post-0005 export or conduct an isolated Time Travel recovery check, (4) complete independent Stage 5 review and remediate findings, (5) synchronize final evidence and only then assess Foundation exit. Keep exit NOT MET until all gates pass. The 22:47 D1 creation authorization remains resolved and separate from the 22:51 retention approval.

**Current code pins:** branch HEAD `ad76677a805275711ace40e52a5b1ffc25cad020`; API source blob `283b66dbfaba6d2076a02d01a7c17064d2e09082`; test blob `32e4f623e673868dce294cfc8b1231498c2d8735`; migrations 0004/0005 blobs `8005dc890221b9daef8c29972c70faf7599d1dab` / `2301b4725b10b25dfa315a6cac81e25eb8a499c7`.

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

# AIMM Plugin Library — PluginHub replica status (2026-10-24)
**2026-10-24 implementation update:** The API Foundation has 5 passing synthetic route/security tests; Wrangler ran it locally against local-only D1, with health 200 and unauthenticated account access 401. The Stage 2 read-only companion scanner core now builds and has 3 passing synthetic integration tests for AU/VST2/VST3/CLAP detection, AAX/symlink exclusion, bounded bundle metadata, explicit roots and overlapping-root de-duplication. No real plug-in folders were scanned; no remote migration or deployment occurred. These executor checks do not make Stage 5 pass. Foundation exit remains **NOT MET**. The recorded owner confirmation resolves the 22:47 D1 authorization question, while preserving both the 22:47 creation and 22:51 retention-approval timestamps. The signed companion UI, user folder permission, local journal, keychain identity, pairing/sync, remote runtime/isolation, recovery, inventory/status/actions, site/Hope integration, and fresh independent review remain. See the [companion report](../governance/evidence/PHASE_PLUGINHUB_COMPANION_SCANNER_REPORT_20261024.md), [Foundation local test report](../governance/evidence/PHASE_PLUGINHUB_LOCAL_TEST_REPORT_20261024.md), [pinned evidence package](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md), and [approved seven-stage architecture](PLUGINHUB_PHASE2_ARCHITECTURE.md).
**Current stage: Foundation and read-only Stage 2 core — in progress.** Phase 1 is complete; the seven-stage Phase 2 architecture is approved as design. The API regression suite (5/5) and companion scanner synthetic suite (3/3) pass, and the local Worker smoke check passes. Foundation Stage 5 remains PARTIAL and exit is NOT MET. The scanner CLI is not the signed companion app; pairing, remote D1 runtime/recovery and later inventory, status/actions and site/Hope stages remain open.

**Current stage: Foundation — authorized and underway (2026-10-23). Retention defaults are approved; the isolated account/device API slice is committed and its D1 schema is applied to the non-production database. Auth0 tenant setup, pairing, runtime validation and deployment remain. Browser session/CSRF source is present but unverified. Phase 2 architecture is approved as the design baseline. Foundation Stage 5 is PARTIAL and exit is NOT MET. Phase 1 is complete and approved.** The goal is to reproduce PluginHub’s full plugin-library functionality inside AIMM, backed by an AIMM-owned Mac companion and AIMM’s shared account library. The companion will not call or require PluginHub. aimixmasters.com, the Workbench, and Hope remain one product and use the same inventory. Kevin’s scope excludes AAX/Pro Tools and duplicate product cards; duplicate detection remains an explicit management feature. Hope mechanics, local licence-secret handling, and the approved AIMM visual design are protected.

Read-only evidence captured from the 32-page manual, installed PluginHub 2.0.12 app resources, and aggregate local scan/report metadata. The full-scope 31-row [parity matrix](PLUGINHUB_PARITY_MATRIX.md), [vendor/action inventory](PLUGINHUB_VENDOR_ACTION_MATRIX.md), [workflow trace](PLUGINHUB_WORKFLOW_TRACE.md), [status rules](PLUGINHUB_STATUS_RULES.md), [count reconciliation](PLUGINHUB_COUNT_RECONCILIATION.md), and [data boundary](PLUGINHUB_DATA_BOUNDARY.md) support the durable [Phase 1 brief](PLUGINHUB_REPLICA.md). A reproducible static audit found 970 candidate checker keys; live checker availability and remote share/cache/download service behavior remain unverified.

No product code was changed during this architecture checkpoint, no PluginHub operation was invoked by this work, and nothing was deployed. The independent Phase 1 governance challenge and validation are complete; Kevin approved Phase One. The decision is recorded in [`governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_DECISION_20261023.md`](../governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_DECISION_20261023.md). The [Phase 2 architecture](PLUGINHUB_PHASE2_ARCHITECTURE.md) and [31-row ownership map](PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md) now define the companion, account/API, site/Hope data, action confirmation, receipts and cutover. Six read-only Claude CLI reviews are preserved in the [dated handover](handovers/2026-10-23-pluginhub-phase2-architecture.md). Formal challenge found three documentation gaps; remediation and independent validation closed them all, including the new adaptive model/effort process rule. Kevin authorized the prepared Foundation stage. The signed [Phase 2 decision](../governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_GOVERNANCE_DECISION_20261023.md), [Foundation authorization checkpoint](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md), and [architecture build sequence](PLUGINHUB_PHASE2_ARCHITECTURE.md) record the scope and restart path. The isolated `library-api/` Worker slice, migration, Wrangler configuration and restart records are committed on `codex/pluginhub-foundation`. Migrations 0001 and 0002 are applied to `aimm-library-foundation-dev`; the original application tables are verified. Migration 0003 adds browser sessions but remains unapplied. The Worker remains undeployed and unbound. Auth0 is selected, but its development tenant/credentials are absent. Browser session/CSRF source is committed but untested; device pairing remains unimplemented. The candidate branch contains pre-existing uncommitted `index.html` changes and a PluginHub-dependent `bridge/` prototype. A separate PluginHub bridge LaunchAgent is already running from the main checkout. None was changed; do not stage or deploy the candidate code with this documentation. No companion has been built; the account Library API is an isolated, incomplete Foundation slice and is not deployed. The retention decision was approved on 2026-10-23 and the isolated schema/API implementation is underway; independent validation remains pending. Purchases/resources/credentials, service/local changes, merge, cutover and deployment remain gated as recorded in the architecture.

**2026-10-22 update — Plugin Library active navigation styling, build 2026-10-22.5.** Selected plug-in navigation rows now use the same blue-purple gradient as the active Library tab, with dark text and icons and no left highlight stripe. The installed inventory keeps its collapsible browse sidebar, monochrome MixCheck-style icons, fixed Hope rail, favorites and category filtering. The legacy catalogue switch stays removed from the user-facing inventory; Hope mechanics, reference data, and scanner behavior are unchanged.

**2026-10-22 update — Plugin inventory + local scan, build 2026-10-22.1.** The live Library now opens to a MixCheck-styled installed plug-in inventory, with the AIMM catalogue retained as a separate view. On the Mini, the browser was granted access to `/Library/Audio/Plug-Ins` and `/Library/Application Support/Avid/Audio/Plug-Ins`; the completed scan checked 1,880 bundles and found 2,197 readable records, grouped into 1,618 products across AU, VST2, VST3, AAX and CLAP. The browser reads bundle names and Info.plist metadata only; folder access and results remain in this browser. Hope's chat/voice mechanics remain available. No Logic project was edited. Source commit `77612f0`.

**2026-10-21 update — Sonnet calls switched to Haiku 5.5, build `.77`.** Typed Hope chat, Research Brain, top-picks re-ranking, and Mix Check advice now call Claude Haiku 5.5. Sonnet was removed from active model selectors/defaults; saved Sonnet selections migrate to Haiku 5.5. Mix Check and ranking cost estimates now use Haiku pricing. Historical pricing entries remain for old usage records. GitHub main commit `1078d45c9ef2149d363928c53d9d91babc98da15`. Live ElevenLabs Hope agents currently use GPT-6 Luna; native ElevenLabs model choices currently list Claude Haiku 4.5, not Haiku 5.5, so their voice configs were not changed. No live model call or tests were run for this release.

# STATUS.md — AIMM

**2026-10-21 update — all Fix Queue questions and displays aligned, build `.76` prepared.** Full-mix
and per-stem “Ask Hope” buttons now use one question builder; missing or “Analysing” moves are
identified as pending instead of being sent as if they were recommendations. Typed chat, Luna
voice, and both live ElevenLabs Hope agents share the same judgement rules for loudness targets,
premaster vs master, source contribution, evidence-based moves, follow-up checks, and explain-only
safety. The two live agents now have identical 40-tool catalogs. Hope action cards now follow the
main queue: band-specific fixes show an orange frequency marker; broadband fixes show the numeric
reading without a misleading full-range bar. Build `.74`'s solid fill and `.75`'s translucent fill
are superseded. Source release is prepared; GitHub deployment is pending. No mix/workbench state
was changed.

**2026-10-21 update — Hope tool parity, build `.73`.** Typed chat, ElevenLabs Live Agent voice,
and the Luna voice route now receive the same complete `TOOL_DEFS` catalog and call the same
`handleToolCall` functions. This removes typed chat's Repair-only tool restriction and Luna's
keyword-based tool filter. Explicit Fix Queue “explain only” turns remain tool-free by request.
The three legacy Repair tile helpers are included in the shared catalog and attached to the
Live Agent. The voice route sends the Repair chain as JSON text because ElevenLabs' connected
tool authoring surface rejects array-valued input schemas; the shared handler accepts both
forms. App self-registration hit a relay HTTP 401; the connected ElevenLabs account was used
to attach the tools directly. The active Live Agent now has 40 attached tools, including
`list_symptom_tiles`, `add_symptom_tile`, and `delete_symptom_tile`. Build `.73` is live on
aimixmasters.com. A live typed request invoked `open_dashboard`; Chrome blocked the new window,
so AIMM correctly showed the dashboard overlay with an “Open in new tab” link. No test roadmap
capture or workbench edit was made. Full release record: `docs/handovers/2026-10-21-hope-chat-voice-parity.md`.

**2026-10-21 update — Hope typed-chat reply reliability, build `.71`.** The text prompt
explicitly requires a useful answer to the visible question, and prior generic “send it
again” replies are excluded from future Claude context so they cannot reinforce the
failure. The `.70` direct-answer handling for Fix Queue and tool-free recovery remains.

**2026-10-21 update — Hope direct replies and recovery, build `.70`.** Fix Queue turns
that intentionally disable tools now use a focused Hope prompt that answers from the
supplied measurement and recommendation. Empty-response recovery explicitly overrides
earlier knowledge-base tool requirements after the tool phase has ended, so Hope can
write a final reply instead of requesting tools that are no longer available. The
Anthropic Worker health check is green; a live chat turn has not been run in this change.

**2026-10-21 update — Typed Hope replies use the existing Hope coach persona, build `.69`.** The chat
system prompt now identifies the assistant as Hope and carries over her established producer-to-
producer tone and workbench grounding from voice mode. Chat labels describe the text reply as Hope's;
Claude remains the underlying model.

**2026-10-21 update — Hope empty-reply recovery in build `.68`.** If a model turn returns no text,
Hope retries once without tools. If that also returns no answer, the chat reports whether the retry
failed at HTTP/network level or the model returned empty content, with its stop reason, rather than
asking the user to resend blindly.

**2026-10-21 update — Fix Queue Ask Hope prompt rewritten in build `.67`.** It sends the selected
fix title, measured reason and recommendation as context, then asks: “Is this worth correcting in my
mix? If so, what should I change, and what should I measure afterwards to check it worked?” The
question no longer starts with the title-only “About fix #01” phrasing. The button sends directly;
it does not apply the fix. Stem-level fix cards use a Logic-focused question. `AIMM_BUILD` is
`2026-10-21.69`.

**2026-10-21 update — Hope message speech controls implemented in `index.html` and `worker/src/index.js`.**
Every assistant reply has a Speak/Stop action, including typed/tool replies. Read-aloud uses Hope’s
ElevenLabs Flash voice through the new `/hope/read-aloud` Worker path and existing TTS-only secret.
It is restricted to AIMM’s allowed origins, rate-limited per IP, and capped at 2,400 characters per
request; it does not require the Usage-test token. Selected text is read when selected, otherwise the
full reply. Each request uses ElevenLabs credits. The unused composer mic, route, mute and global
Speak controls remain removed; the floating call control and two pictured message examples are
unchanged. Main and Worker syntax checks and `git diff --check` passed in build `.63`; the matching roadmap/dashboard status is updated in this change.

**2026-10-21 Hope knowledge — Sonnox Oxford Inflator:** Added the paraphrased official Sonnox Oxford Inflator guide as `docs/knowledge/sonnox-oxford-inflator-guide.md` (4 searchable-format chunks) and registered it in `docs/knowledge/index.json` (708 source entries). The large generated `kb-search-index.json` is still unchanged because the connected GitHub editor rejected a ~10 MB file update; Hope's topic search will not discover this guide until `python3 scripts/build_kb_search_index.py` is run and its regenerated index committed. Do not claim end-to-end retrieval is verified. Official source: https://store-8pfrvbtcba.mybigcommerce.com/content/plugins/user-guides/Oxford_Inflator_User_Guide.html

**Hope usage voice — build `.58` live; spoken test passed, 2026-10-21:** Cloudflare Worker `aimm-proxy` hosts the Deepgram Flux → GPT-6 Luna streaming route with AIMM tools and Hope’s ElevenLabs Flash voice. The existing Live Agent remains available and is the default in a new browser. Build `.58` adds the visible route selector and mic dispatch; it is live on `aimixmasters.com`. Kevin reports the spoken test passed, and the live page shows completed Hope replies with the Luna route selected. Production has encrypted `OPENAI_API_KEY` and a 30-request-per-minute limiter; AIMM Settings confirms `HOPE_STT_TOKEN` is saved in this browser. Quantitative response latency and provider credit usage have not been recorded, so no savings claim yet.

**2026-10-20 build label placement — build `.56`:** Moved the visible build label from its fixed top overlay to beneath Clear chat in Hope's composer. The browser title and console still show the same build value.

**2026-10-20 Hope Mix Check control — build `.55`:** The app implements `set_stem_selection` for exact loaded-stem selection and play, pause, stop, seek, skip, volume and status. The ElevenLabs Live Agent is attached to the matching client tool. The returned result includes confirmed selection and transport state. This controls AIMM's loaded Mix Check audio, not Logic Pro or file import. The `.54` Space key and Live Agent path remain in place. Cloudflare's custom-domain build had failed because its deploy command included an unsupported `--yes` flag; restoring the prior `npx wrangler deploy` command published `.55`. A root `.assetsignore` now excludes Git and Wrangler metadata from static assets.

**Hope tool reconciliation:** The active Fallback-role ElevenLabs agent has all 37 client tools defined in AIMM, including the newly added stem/transport control and previously unlinked dashboard inbox, mix move card and Fix Queue completion tools. The separate Default-role account is not accessible through the current ElevenLabs connection, so its tool attachment is unverified. A fresh spoken call with loaded WAVs is still needed to verify audible end-to-end operation.

**2026-10-20 rollback — AIMM restored to the last working Hope voice path:** Build `.54` restores the `.53` Live Agent implementation, removing today's Usage-test route from the app. The spacebar again starts or ends Hope's existing ElevenLabs Live Agent conversation. The Usage test could not start because its separate access token was missing, and its microphone path was not proven. No savings are claimed from that experiment. The previously measured `.53` Luna context reduction remains the only valid comparison; Hope's ElevenLabs agent configuration and voice are unchanged.

**Earlier Usage-test experiment — paused after failed live verification:** The `.6` attempt accidentally created Live Agent conversation `conv_5401m5cqcnjqet58deajj6yy5jyt` (33 seconds, 248 credits / $0.044858). Later Usage-test builds never produced a verified transcript and completed reply. The route is removed in `.54` while the working Live Agent path is restored. No Usage-test savings were established.

**2026-10-20 Hope voice cost baseline — build `.6`:** The six-question comparison baseline `conv_0001m5cnyz5bf2gaea39317j9epx` lasted 156 seconds and cost 1,254 credits ($0.22742), including 1,146 voice/platform credits and 108 GPT-6 Luna credits. It generated 86.32 seconds / 1,519 characters of ElevenLabs v3 speech and used 49.88 seconds of Scribe Realtime input. It was a Live Agent call, not a Usage test, so it is only the baseline for the intended comparison.

**2026-10-19 Hope usage retest — build `.53` live, Fallback agent v44 (GPT-6 Luna):** Correct-account comparison: baseline `conv_2701m5avagx6fjmraa8ep3pvr28t` (8:48 PM, 1:34, 6 billed LLM turns) used 691 voice/platform credits and 235 LLM credits ($0.0427), 926 total credits. Retest `conv_7301m5azfk1xe3rt0cgfwxbcksbn` (10:01 PM, 2:37, also 6 billed turns) used 1,153 voice/platform credits and 50 LLM credits ($0.00895), 1,203 total credits. LLM spend fell about 79% despite the longer call; cost per minute fell about 87%. The differing prompts mean this is strong evidence for the reduced-context change, not a perfectly controlled test. Total credits rose about 30% because the call stayed connected longer. Both records show about 441 voice credits per connected minute; this is connection-duration usage, not measured spoken seconds, with a 95% discount for silence over 10 seconds. Transcript answers are complete, plus one extra plugin question; the client disconnected unexpectedly, so spoken-audio completion is unverified. The shared saved idle-call control remains: warning at 1m45s, end after 2 minutes without a conversation turn across ElevenLabs and OpenAI, protecting active PTT/recording and assistant speech.

**2026-10-19 visual fixes — build `.42` deployed (Kevin confirmed):** When no Logic stem is selected, the stem-analysis card is hidden, removing the instruction strip and empty Fix Queue placeholder. Selecting a stem still reveals its existing measurements and Fix Queue. Build `.41` was visually checked on AIMixmasters.com: Spectral Balance, Audio Specs and Hope align at the bottom; chart and readout text are more legible.

**2026-10-19 Spectral Balance layout — build `.37` (included in `.38`):** Corrects the incomplete `.32` stretch rule. On desktop, when the Fix Queue is empty, Spectral Balance spans the empty queue row that Audio Specs already spans; the plot fills the taller card while LOW/MID/HIGH remain anchored below. Mobile stacking is unchanged.

**2026-10-19 song-folder import affordance — build `2026-10-19.29` is live and confirmed by Kevin:** A visible **Song folder…** button beside the normal WAV picker opens the directory picker directly. Kevin confirmed the folder import works. The unsupported-selection notice points to the folder button or selecting multiple WAV files.

**2026-10-19 AIMM stem workflow release — build `2026-10-19.27` is live.** Commit `9dbbd11` is pushed to `main`; the hosted GitHub Pages app now displays build `.27`. The integrated-LUFS Fix Queue item has an enabled **Play mix** action from 0:00; timestamped fixes start at their absolute cue position and resume a suspended AudioContext. Cloudflare shows `aimm-proxy` active version `1316e5dc`, with both local preview origins (`localhost:8765`, `127.0.0.1:8765`) allowed. Hosted Hope passed a typed connection check and replied `Hope connected`. No WAV was loaded during that check, so the specific −19.9 LUFS Fix Queue context and audible playback were not verified. Wrangler's stored token was expired; its OAuth flow requested 29 account permissions and was declined. The roadmap, dashboard, handover and release log record this state.

**2026-10-19 song-folder naming — build `2026-10-19.28`:** Mix Check now offers **Browse song folder**. Chrome reads the selected folder name and shows it in the loaded stem title alongside the stem count (for example, `Song Name · 6 stems`); selecting a song folder replaces the prior audio set so stems from two songs cannot be accidentally summed together. Existing multi-file WAV/AIFF reference selection remains available. The folder-name path is implemented and syntax-checked; it still needs an actual folder import with the user's six WAVs to verify the resulting label and analysis.


**2026-10-19 Hope spectral analysis context — local build `2026-10-19.23`, uncommitted and undeployed:** Hope receives the full-mix spectrum, chart legend and exact corridor anchor bounds. Context lists every imported track and gives every decoded source its own measurements, full-record spectrum, leave-one-out comparison and Fix Queue, whether or not it is currently selected. It also provides selected tracks separately plus their combined PCM-summed spectrum and unselected remainder, with legend names, colours and line styles. Her instructions distinguish measured shape from what it cannot prove: the full-mix corridor is not a validated solo/group target, curves are gain-aligned rather than loudness-matched, and spectral overlap alone does not prove masking. A leave-one-out result does not calculate an ideal fader level. An imported track labeled `Bass` appears as `808` in stem rows, chart, transport and Hope context; the original WAV filename remains visible as provenance. Hope's live model response has not been verified.

**2026-10-19 visual adjustment — build `2026-10-19.22`:** the purple genre corridor now has a stronger, still softly blurred fill in both full-mix and stem views. It remains a blended band without a hard outline; chart layout, dB scale and spectrum values are unchanged. Local only.

**2026-10-19 update — live stem comparison corrected in local build `2026-10-19.21`; uncommitted and undeployed.** During playback, the cyan selected-stem/group spectrum and dashed orange unselected remainder are now calculated from the same aligned 8192-sample PCM window at the same playhead, then smoothed with the same 0.4-second linear-power filter. While paused, both remain full-record Welch spectra. Both use the fixed gain offset from the complete stem sum and the shared ±72 dB axis; neither trace is forced to a chosen 20 Hz starting level. The legend names the selected group and actual unselected track names.

**Data check:** In the user’s shown selection (Vocals, Drums, Piano, Guitar and Other; Bass left unselected), an independent full-record audit of the six WAVs gives -13.1 dB at 20 Hz for the full sum, -35.3 dB for the selected group and -13.1 dB for Bass alone (before the chart’s common genre offset). At 1 kHz the full sum and selected group are both about -17.7 dB, while Bass alone is about -61.5 dB. This supports a lower starting point for the selected group and a Bass remainder that falls above 1 kHz; forcing the curves to start together would misstate the audio. The live browser playback overlay still needs review with the WAVs loaded. Chrome is open on the local `.21` build; no commit or deployment has happened.

**2026-10-19 update (Cat + Markey) — full-record stem spectrum and source attribution built locally; uncommitted, not merged or deployed.** Kevin's approved first prototype remains: split one mixed WAV manually in Logic Pro, export the stems, then upload them together into AIMM. Automatic Logic control and one-WAV split-on-upload are deferred.

Local build `2026-10-19.19`: Mix Check accepts aligned WAV stems and displays source-named rows and individual waveforms. Selecting a stem updates the orange Mix Check title to that Logic track name and its independent Fix Queue. Spectral Balance keeps the original purple corridor display. In selected-stem view, the existing cyan curve slot shows that track's full-record spectrum while paused and reuses the same curve for its live spectrum during playback; no second blue curve or all-stems cyan trace is added there. The orange same-sum-without-selected-source curve remains a static comparison guide. The moving source trace is calculated from the selected WAV or selected group’s aligned PCM with the same 8192-point Hann window and power normalization as the full-record Welch analysis, then plotted using the fixed full-sum gain offset; it is not gain-normalized frame by frame. Live selected-source updates now sample at 20 Hz and smooth each frequency bin in linear power with a 0.4-second exponential time constant; pausing and full-record spectra are unchanged, and changing the selected group or seeking backwards resets the smoother. This reduces frame-to-frame jitter while retaining measured spectral shape and calibration. This visual smoothing adds a short display lag and does not change the stored full-record readings. All-stems, individual-stem and multi-stem charts now share the same fixed ±72 dB scale, with 12 dB ticks and 0 dB centred; silence-floor FFT bins no longer stretch the chart to ±240 dB. The plot clips values outside this display window without changing analysis data. Frequency dividers and band labels now use the same log-frequency coordinates; duplicate fixed-percentage dividers were removed, and the redundant in-chart empty-state prompt is removed because the drop zone above already explains how to load audio; band labels have improved contrast. The selected-stem chart remains 320 px high. Multiple stem rows can be toggled into a simultaneous audition; the latest selected stem remains the focus for per-stem measurements and Fix Queue while Spectral Balance follows the combined audition group; the orange transport title names the active group. Stem analysis uses full-record 8192-point Hann Welch spectra with 50% overlap over every complete frame in a Web Worker, average power, log-frequency folding and dB-relative readings. The comparison remains between the full sum and the active genre corridor; that full-mix corridor is never treated as a solo-stem target. Selected stem rows route their buffers together into playback; the latest selected row remains the focus for per-stem measurements and Fix Queue. Toggling all selected rows off restores the combined stem mix. The full-mix and selected-stem views use the same symmetric dB-relative axis centred at 0, with a reserved title strip so the unit label does not overlap the top tick. When multiple stems are selected, the cyan curve is measured from their sample-aligned time-domain sum and the dashed orange curve is the full sum with that selected group removed; the purple corridor remains the full-mix genre reference. The latest selected stem remains the Fix Queue focus. A source Fix Queue item is created only for a material full-sum deviation where removing that source materially improves the deviation or crosses the corridor; it states the measured evidence and asks for listening, without automatic processing. Known source names map to an existing Workbench bus; ambiguous names remain named as their Logic source track. Hope's existing panel is unchanged. Single-reference WAV/AIFF loading remains compatible. Mismatched stems are excluded with reasons. Hope's typed and voice contexts now receive the selected track's measurements, full-sum and leave-one-out spectra, target basis, evidence and current source Fix Queue; its guidance distinguishes measured contribution from listening and source-backed technique advice.

**Verification:** JavaScript syntax and `git diff --check` pass on build .14. The existing spectrum worker passed a synthetic-tone check and ran on the real six WAVs: each 216.34-second file contributes 2,534 complete 8192-point windows at 4096-sample hops. With the Trap / 808-heavy corridor selected, the Low band reads +4.2 dB rel. for all stems and -3.62 dB rel. without Bass. That is evidence that Bass materially changes the full-sum low-band balance, not proof that Bass alone is wrong. The new multi-selection spectrum has not yet been run against the real WAVs; the ChatGPT Chrome extension previously blocked local-file access. The earlier 39/39 browser checks do not cover this path. Hope's runtime voice/backend delivery is also unverified. Nothing has been committed, pushed, merged, or deployed.

**Naming rule and project name (Kevin, 2026-10-18; 808 display alias added 2026-10-19):** the Logic project and source song for the current six-stem test set is `AI MM switching beats`. The `input (Bass).wav` track now displays as `808` in the row, transport, chart and Hope context; the original WAV filename remains visible as provenance. Other stems retain their Logic track names.

**Next gate:** Review build `2026-10-19.23` in Chrome with 808 selected and with a multi-stem group; confirm the user-facing label is 808, chart and Hope context follow the same selection, and Hope distinguishes measured contribution from a target or listening-based claim. Live Hope response remains unverified. Kevin reviews the local implementation before any commit or deployment. The longer-page redesign remains parked; Hope's fixed/open panel behaviour stays protected.

Read-only safety gate: Logic initially had Kevin's existing project open with unsaved changes.
Choosing New raised Save / Don't Save / Cancel; Cat chose Cancel. Kevin saved and closed that
project, then opened a blank scratch project. Cat copied Kevin's supplied 133.521-second,
stereo 48 kHz 24-bit mix WAV byte-for-byte to scratch storage, imported the copy, and ran
Logic's six-way Stem Splitter. Six aligned regions appeared in under 18.2 seconds from Apply
to verified result. Exporting the six selected regions took 11.4 seconds. All six exported
WAVs have 6,409,013 frames at stereo 48 kHz 24-bit and nonzero audio. Their sum differs from
the source by about -33.6 dB relative RMS error. This proves a manual split/export on this
Mac; subjective separation quality and automated AIMM handoff are untested. Kevin's original
mix file and saved Logic project were not modified. The scratch project remains open.

`docs/ROADMAP.md` item 22 and `DASHBOARD.html` cards 22/34/41 now carry the current direction.
Next action: Jules reviews the stem input copy and stem rows against the final mockup and reports any feasibility points; Kevin signs off and decides commit/merge. After sign-off: per-stem product analysis (Cat); Hope's per-stem context and tools go to Markey. Nothing deployed; no Hope code changed.

**2026-10-04 update (Markey) — item 39, Hope's Agent ID localStorage fix, built and tested, uncommitted in working tree.**
Real incident same day: Hope's migration to `begb0037@ox.ac.uk` (new agent `agent_9001m42hnyrwedts40en5a5npapp`)
updated `index.html`'s hardcoded default, but Kevin's Windows browser still had the OLD pre-migration
agent ID cached in localStorage (`aiMixMastersElevenAgent_v1`), silently talking to the dormant old
Hope the whole session while Mac worked correctly with the new agent. Root cause: `aimmProxyInit()`'s
seeding logic only filled an empty localStorage slot — once any value existed, it overrode the source
default forever, even across later deploys. Full detail: `docs/ROADMAP.md` item 39.

Fix built directly in `index.html`: new `getHopeAgentId()` is the single source of truth (always
returns the hardcoded `AIMM_DEFAULT_AGENT_IDS` value); `getActiveAgentId()` now delegates to it
unconditionally, never reading localStorage; `aimmProxyInit()` actively purges the old localStorage
key on every load instead of seeding it, so an already-affected browser self-heals on next load with
zero manual action. Settings' Agent ID field is now read-only display; `elSaveAgentId`/
`elClearAgentId` and their buttons were deleted entirely (confirmed zero dangling references via
grep). `updateCallButtonState`, `registerInboxTool`, and `micStartFromFloat` no longer gate on the
localStorage value. `AIMM_BUILD` → `2026-10-04.4`.

Codex three-touchpoint discipline run in full, lead-implementer mode per `SESSION_PROTOCOL.md` §9:
TP1 (plan review against the live code) found one real gap — `getActiveAgentId()`'s dormant persona
branch could still return a localStorage value if `TAB_PERSONA_MAP` were ever repopulated — folded in
by making the function return the hardcoded accessor unconditionally, plus several stale-comment
corrections (Settings copy, the in-app knowledge digest's localStorage-keys list, the dormant
call-button label). TP2 was the actual implementation (Codex CLI, `workspace-write` sandbox). TP3
(full end-to-end pass over the real diff in the real file, not just the patch) confirmed GO — zero
dangling references to deleted functions/buttons, no orphaned HTML, main JS block parses clean. Two
non-blocking stale-copy findings from TP3 (an outdated "your ElevenLabs key + Agent ID" help-box
string and an outdated code comment) were fixed directly afterward.

**Tested against the exact failure mode**, not just "the code compiles": a standalone Node harness
(`/private/tmp/.../stale_cache_test.js`, not committed — scratch only) copied the real purge +
accessor logic verbatim, pre-seeded a fake localStorage with the real pre-migration agent ID
(`agent_2601kqm4g7txfsvv0pkvpe02389p`), then ran the fixed logic and asserted: the returned agent ID
is the current hardcoded one, not the stale one; the old localStorage key is purged; a second
simulated reload still returns the current hardcoded ID (durable, not one-shot). All assertions
passed.

**Not committed or pushed** — per Markey's show-first rule for any change to Hope's voice/chat
behaviour, the diff is left in the working tree for Kevin's review before commit/push, overriding
this repo's general "everything through git, no uncommitted edits" rule for this one case (the
same show-first exception that rule already makes room for). See `docs/HANDOVER.md`'s matching entry
for the exact diff summary.

**2026-10-03 update (Markey) — KB semantic-search upgrade (item 35) built on `kb-semantic-search-upgrade`, not yet deployed.**
Kevin-approved architecture (reviewed and approved by Kevin himself in conversation, implementation
dispatched by Jacob same session — not an overnight/absent-Kevin delegation): `voyage-context-3`
contextualized embeddings + Cloudflare Vectorize + hybrid BM25/RRF + Cohere Rerank 3.5, per
`docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`. Built end-to-end on Hope's side (`worker/src/index.js`
gained `/kb/vector-search`, `/kb/rerank`, `/kb/upsert`; `scripts/kb_embed_helper.py` +
`scripts/backfill_kb_embeddings.py` new; `scripts/ingest_yt.py`/`scripts/ingest_mwtm.py` gained a
best-effort semantic-upsert step; `index.html`'s `search_yt_knowledge` handler rewritten to run BM25
and Vectorize concurrently, fuse via Reciprocal Rank Fusion, rerank the fused shortlist via Cohere,
and gracefully degrade to whichever leg(s) are actually available — external tool contract unchanged).
`read_yt_knowledge` deliberately left unchanged this pass (flagged `TODO(kb-semantic-search-upgrade)`
in the code and back to Kevin/Jacob as an open scope question — semantic search can now discover a
video whose content doesn't literally contain the paraphrase, so the existing substring-match read
path may not find the relevant part; the brief's own text names both tools but Markey didn't treat
"DECIDED" brief status as license to redesign read_yt_knowledge's matching without Kevin confirming
that's in scope). Codex three-touchpoint discipline run in full: TP1 (plan review) caught 2 real
spec errors against the live Voyage/Vectorize/Cohere APIs (wrong Voyage request/response shape,
wrong Vectorize `returnMetadata` value, Cohere v2 wants string documents not objects) — corrected
before implementation. TP2 (write pass) implemented the corrected spec. A full TP3 end-to-end pass
found 5 real blocking bugs (Voyage response-shape parsing still wrong in a different way than
predicted, the per-video 3-chunk cap bypassed on the vector-only degradation branch, a malformed
Cohere response silently treated as a successful empty-result rerank, stale vectors deleted before
their replacements were confirmed written — a data-loss window — and the original BM25-infrastructure-
failure error shape silently changed into the generic "no results" shape). All 5 fixed in a follow-up
Codex write pass; Markey independently re-verified each fix by reading the resulting code directly
(not just trusting Codex's own summary) before the second full TP3 pass confirmed GO. One additional
bug (`--dry-run` on the backfill script wrongly requiring Worker secrets that a pure local dry run
never uses) was found and fixed by Markey directly during review, outside the Codex loop.
**Not deployed, not live.** Blocked on: (1) Kevin creating a Voyage AI account and a Cohere account
and setting 3 new Worker secrets (`VOYAGE_API_KEY`, `COHERE_API_KEY`, `AIMM_INGEST_KEY`) himself via
`npx wrangler secret put` — confirmed via `ToolSearch` that no MCP connector exists for either
provider, so this is a narrow, explicitly-justified exception to the zero-manual-steps rule, not a
shortcut; (2) this session having no authenticated Cloudflare/`wrangler` session available
(`wrangler whoami` showed not logged in, non-interactive environment) to run
`wrangler vectorize create aimm-yt-kb --dimensions=1024 --metric=cosine` or `wrangler deploy` — both
exact commands are in `worker/README.md`'s new "Semantic search" section for Kevin or a future
authenticated session to run; (3) once both of those exist, a one-time run of
`scripts/backfill_kb_embeddings.py` over the ~3,191 existing chunks. `AIMM_BUILD` bumped to
`2026-10-03.2`. Pushed to branch `kb-semantic-search-upgrade`, **NOT merged to `main`** — per this
project's push-approval rule, Kevin/Jacob see the diff before it ships; Jacob will independently
re-run the exact Teezio-vs-Stuart-White comparison test once it's deployed and report back, same as
the prior two fixes tonight. See `docs/ROADMAP.md` item 35, `docs/HANDOVER.md`.

**2026-10-03 update (Markey) — compound/comparison questions now decompose into per-subject KB searches (direct follow-up to the 2026-10-02 fix below).**
Kevin live-tested the 5d76abb fix in the real deployed app with two questions. Test A (single-topic, hard —
"What does Teezio do differently when mixing a clap, specifically?") PASSED: 2 tool calls (search then read),
correct real numbers (357/1100/5900 Hz EQ cuts, Spectre saturation detail), real citation to the actual MWTM
video, no fabrication. Test B (two-topic comparison, deliberately hard — Teezio's sibilance handling on J. Cole's
vocal in "Blow for Blow" vs. Stuart White's actual mic chain recording Beyoncé's lead vocal on "Yoncé") was only
PARTIAL: the anti-fabrication rule held correctly (no fabricated source for the Stuart White half — a real
improvement over the previous ITT105/ITT112 incident), but this was a genuine retrieval MISS, not an honest
"doesn't exist" case. Jacob root-caused it directly: the Stuart White content genuinely exists in the KB
(`docs/knowledge/mwtm-stuart-white-beyonce-yonce-p03.md` plus a separate pre-existing video `wsi4Cyizql4`), and
replicating the client-side BM25 scoring in Python confirmed a query blending both halves of the comparison
doesn't surface either Stuart White source in a useful position (dominated by Teezio results), while a query
using the Stuart White content's own vocabulary ("Elam 251 Avalon 737 Tube-Tech compressor warm setting") ranks
it #1. Conclusion: Claude ran one blended `search_yt_knowledge` call across the whole compound question instead
of decomposing it into a separate, properly targeted search per sub-topic before concluding anything was
missing. Kevin called this the bigger issue of the two — any "X vs Y" / "compare A and B" phrasing is completely
normal producer language, not an edge case, so a fix that only reliably works single-topic silently degrades
exactly the kind of nuanced question a producer would actually ask, while looking confident and honest (since
the anti-fabrication rule masks the miss as an honest "I don't have that" rather than a retrieval failure).

**Fix:** added a COMPOUND/COMPARISON QUESTIONS hard-gate section to both `AICHAT_SYSTEM` (typed chat) and
`RT_INSTRUCTIONS` (voice) — both already carry the search→read-more chain and anti-fabrication rule from
5d76abb, this builds on top, doesn't duplicate. New rule: if Kevin's question asks to compare/contrast two or
more INDEPENDENT subjects (two producers/engineers, two songs, "X vs Y", "how does A differ from B"), decompose
BEFORE searching — one separate, narrowly-targeted `search_yt_knowledge` call per sub-topic (never one blended
query), each followed by its own `read_yt_knowledge` call, and no anti-fabrication fallback on either half until
THAT half specifically has had its own genuinely targeted search attempt. Explicitly scoped to exclude false
positives: one subject's single workflow spanning multiple plugins/steps/settings (e.g. "how does Teezio use EQ
and saturation together on a clap?") stays ONE search — this is an independent-subjects rule, not a
two-keywords rule. `TOOL ROUTING RULES` and the `PRIMARY PATH FOR PRODUCER/ENGINEER QUESTIONS` section (voice)
were also updated so the existing search-then-read chain explicitly runs per sub-topic when two producers are
named, rather than once across both. `AIMM_BUILD` bumped to `2026-10-03.1`.

**Codex three-touchpoint findings folded in:** the first full-implementation-mode pass (plan + diff review)
returned two BLOCKERs, both fixed before shipping — (1) the original trigger wording ("two or more distinct
topics... two names or two things in it") was too broad and would have over-triggered on a single subject's
multi-step workflow; narrowed to require genuinely INDEPENDENT subjects and added an explicit exclusion for the
one-subject/multi-component case. (2) `RT_INSTRUCTIONS` had a looser, inconsistent phrase ("every time a
question has two names or two things in it") that contradicted the narrower AICHAT_SYSTEM threshold — removed,
both prompts now use identical wording for the decomposition trigger. The final TP3 end-to-end pass re-traced
the exact Teezio/Stuart-White question (confirmed: two separate targeted searches, one per producer) AND a
new single-subject control question ("How does Teezio use EQ and saturation together on a clap?", confirmed: one
search, no false-positive decomposition) and verdict was GO with zero remaining findings.

**Voice-side loop-cap check (Jacob's specific ask):** confirmed directly in code — the only `MAX_LOOPS` constant
in the file (`= 8`) belongs to the typed-chat tool loop only (`index.html` ~line 11451); the voice path has no
equivalent manual cap in our own code because tool-calling there runs through the ElevenLabs Conversational AI
SDK's own `clientTools` map (`handleToolCall` registered per tool name) — the EL agent runtime itself governs
how many tool calls happen in a turn, not a loop we wrote. This was verified by direct code read, not live
voice-call testing (no mic/browser access this session).

**Not independently live-tested by Markey** (no mic/browser access this session) — verified via a Python
replication of the real BM25 scoring against the live `kb-search-index.json` (confirming the root cause), a
Node syntax check of the updated inline script block, and two Codex dry-run traces of the exact failing question
plus a new single-subject control question against the finished instructions. Jacob will re-run the exact same
compound question live against the deployed app once this ships to confirm both halves now resolve with real
citations — that live confirmation has NOT happened yet as of this commit.

Approved by Jacob under Kevin's explicit standing delegation (same overnight-delegation basis as 5d76abb) — Kevin
reviewed the live test result himself and called this the bigger issue ("wake markey to fix the issue - this is
bigger"), but has not reviewed this diff personally.

**2026-10-02 update, later (Markey) — text chat gets the YouTube KB tools (parity with voice) + anti-fabrication
hardening on both surfaces.** Kevin ran two live tests tonight through the Conversation composer's TYPED chat,
not voice as first reported. Root cause (found via direct code read, not guessed): `AICHAT_TOOLS` (text chat's
Anthropic tool list) only had the 3 Repair-tile tools — `search_yt_knowledge`/`read_yt_knowledge` were voice-only
via `RT_INSTRUCTIONS`/`handleToolCall`, and `AICHAT_SYSTEM` said so explicitly ("this text chat surface does not
have the YouTube KB search tools"). That line was true until today's MWTM ingestion made it a real product gap:
a muddy-clap question got zero KB lookup and answered from general knowledge, and a Teezio clap-EQ question got
a correct high-level answer from training memory (not a real retrieval — no retrieval tool existed on this
surface) then, when pushed for the exact EQ numbers, fabricated two plausible-sounding but entirely fictional
lesson codes ("ITT105"/"ITT112" — confirmed absent from the whole repo via grep) instead of saying it didn't
know. **Fix:** added `search_yt_knowledge`/`read_yt_knowledge` tool schemas to `AICHAT_TOOLS`, and
`executeAichatTool` now delegates both to the exact same `handleToolCall(name, input)` voice already uses (not a
reimplementation — confirmed `handleToolCall` is already called from non-voice contexts elsewhere in the file,
e.g. the Mix Move "Apply" flow, and has no EL/voice-session-only state in these two cases) so typed chat gets
byte-identical results to voice, per Kevin's explicit requirement ("if I choose to type instead of voice chat I
expect the same results"). Rewrote `AICHAT_SYSTEM`'s RESEARCH NOTES/WEB SEARCH block into a new YOUTUBE KNOWLEDGE
BASE section with the same precedence (search first, read deeper on a promising video_id — especially `mwtm-`
prefixed ones — before concluding a detail is missing) plus an explicit anti-fabrication rule. **Also hardened
voice's own `RT_INSTRUCTIONS`** (the originally-reported secondary target) to close the same gaps there:
OVERALL PRECEDENCE now explicitly covers general (non-named-producer) technique questions, not just named ones;
a new ANTI-FABRICATION RULE forbids stating any lesson code/reference ID/video_id not actually returned by a
tool call; the PRODUCER/ENGINEER and YOUTUBE KNOWLEDGE BASE sections now require a `read_yt_knowledge` follow-up
(mandatory for `mwtm-` video_ids) before falling back to NotebookLM; the NOTEBOOKLM ESCAPE HATCH is no longer the
default for MWTM-covered producers (Teezio, Jaycen Joshua, Leslie Brathwaite, Andy Wallace, Stuart White, Tony
Maserati, etc.) — only for genuinely uncovered topics. `AIMM_BUILD` bumped to `2026-10-02.1`. Reviewed via Codex
three-touchpoint (plan review, diff review, end-to-end pass) before push — see commit for exact findings folded
in. **Not independently live-tested by Markey** (no mic/browser access this session) — verified via direct code
read (confirmed `handleToolCall`'s non-voice call sites, confirmed `mwtm-` is the real ingested-file prefix via
`ls docs/knowledge/`, confirmed JS still parses with `node -e "new Function(...)"` on both script blocks) and a
dry textual walkthrough of the Teezio clap question against the new instructions. Approved by Jacob under
Kevin's explicit standing overnight delegation (Kevin AFK, reviewing in the morning), timestamped 2026-10-02.

**Codex three-touchpoint findings actually folded in (not just run for show):** TP2 (diff review) caught a real
contradiction — the new anti-fabrication rule as first drafted would have told Hope/Claude to stop citing
`KEV'S RESEARCH NOTES` titles, which is legitimate pre-loaded context, not a fabricated pointer — fixed by
scoping the rule to KB-specific pointers (lesson code/reference ID/video_id/chunk) and explicitly carving out
research-note citation as the one legitimate exception, in both `RT_INSTRUCTIONS` and `AICHAT_SYSTEM`. It also
flagged one NotebookLM-fallback paragraph that still permitted skipping the mandatory `read_yt_knowledge`
follow-up — reworded. TP3 (full end-to-end pass, which traced BOTH of tonight's real test questions against the
new instructions and confirmed both now resolve correctly — the muddy-clap query surfaces the right
`mwtm-teezio-...` chunk, and the Teezio follow-up's mandatory read returns the real 357/1100/5900 Hz numbers)
found three more real gaps, verdict "ship with fixes," now applied: (1) the injected `buildAppKnowledgeDigest()`
"FULL APP KNOWLEDGE" block — read by both voice and text chat as ground truth about what tools exist — still
listed only the 3 Repair-tile tools for typed chat and omitted `search_yt_knowledge`/`read_yt_knowledge` from the
voice client-tools inventory line entirely; both lists now include them. (2) The `search_yt_knowledge` tool's
own no-results message told the model to "answer from general knowledge or offer NotebookLM" directly, bypassing
the `KEV'S RESEARCH NOTES` fallback step both prompts now require — reworded to defer to the system prompt's
fallback order. (3) Minor wording drift between the tool schema descriptions and the stronger RT_INSTRUCTIONS
text — aligned. **One item intentionally deferred, not fixed tonight:** `read_yt_knowledge`'s query matching is
a literal substring match, not semantic/token-based — a later-chunk detail that doesn't share an exact substring
with the follow-up query can still be missed (tonight's Teezio case worked because the real answer was in the
same chunk already surfaced). This is a pre-existing retrieval-quality limitation, not something introduced by
this change, and fixing it is a code change (not prompt engineering) deserving its own session with live
testing, not a late-night addition alongside this one. Logged here as an explicit follow-up.

**2026-10-02 update (Jacob) — All 30 cut MWTM sets ingested into Hope's knowledge base (145 parts, 576 chunks).**
New `scripts/ingest_mwtm.py` transcribes each cut `Part_NN.mp4` via Kevin's own meeting-transcriber Worker
(`transcribe.lelitte.co.uk`, Cloudflare's Whisper, already free/paid-for) and writes it into `docs/knowledge/`
in the exact same markdown/frontmatter/chunk shape `scripts/ingest_yt.py` uses for the YouTube KB. No changes to
Hope or `index.html` — `search_yt_knowledge`/`read_yt_knowledge` already discover and cite this content
generically, since they key off `video_id`/title/channel without assuming YouTube. Kevin's resource constraint
("keep simple and resource mindful") is met: zero added cost, reuses infrastructure he already runs. Three real
bugs found and fixed during the run: Cloudflare's bot protection 403'd Python's default user-agent; Whisper's
output occasionally has zero punctuation so the sentence-boundary chunker never split (added a 750-word hard
cap); an intermittent mid-transcribe connection reset couldn't be retried with the same upload key (it's
single-use server-side) — fixed by retrying the whole upload+transcribe cycle with a fresh key each time. All
30 sets with a `set_manifest.json` verified complete (expected part count == ingested part count). Pushed to
`main` (`8671d62`). Transcription-API ingestion only; `index.html`/Hope untouched.

**2026-09-28 update, evening (Jacob) — MWTM copy-cut tested through Codex; Money set complete (Parts 1-5).**
`mwtm_copycut.py` gained `--append --first-part N` for a second recording of the same lesson (writes the new parts, adds
them to the manifest, and writes a stream-copy `FULL_joined.mp4` beside the old FULL). A fresh Codex run followed the process
doc alone to add Money Parts 4-5 (dry run, then `--go`) and Jacob's independent check passed (joined length = old FULL + new
recording within 0.03 s, clean decode across the join, parts add up to FULL). `FULL.mp4` in the Money folder is now the
complete 83-minute lesson. Originals for sets already covered by a verified FULL were moved to the Trash at Kevin's request.

**2026-09-28 update, later (Jacob) — MWTM process CHANGED to copy-cut (no re-encode), Kevin's decision.**
Kevin asked why cutting needs encoding at all; it does not. `docs/mwtm/mwtm_copycut.py` now cuts parts by stream
copy (`-c copy`): a 3-part, 50-minute set takes 56 seconds instead of ~1.5-1.9x content length per part (one 21-minute
part took 46 minutes to re-encode and came out 1.94 GB vs 726 MB copy-cut, same quality). MWTM divider screens (white
logo card / black) are now KEPT, with each cut in the middle of a divider; blank/logo dead ends (Kevin AFK) are trimmed
to about 5 seconds; every set folder has `FULL.mp4`. Jacob runs the script himself; Codex is fallback only. The
re-encode command stays in the process doc as a fallback. Sets done this way: Money (Cardi B / Leslie Brathwaite,
Parts 1-3 of 5, Parts 4-5 being recorded) and Rolling in the Deep (Adele / Tom Elmhirst, replaced an older
re-encoded folder, old one in the Trash). Earlier sets (Teezio, Tchad Blake) were re-encoded with slates removed and are
unchanged. `index.html` untouched; supersedes the earlier same-day entry below where it says Codex executes.

**2026-09-28 update (Jacob, coordinator; Codex executed) — MWTM tutorial-recording process LOCKED via Jacob.**
Kevin's entry point for Mix With The Masters OBS recordings is now Jacob, not a bare session: he says
"let's do our Mix with the Masters recordings" and pastes the lesson title/URL + a part-list screenshot;
Jacob runs the global `mwtm-recordings` skill, sends Codex a text-only brief, and verifies the parts
himself (`ffprobe` + first/last frame). First set done and verified end to end: Tchad Blake / Arctic
Monkeys / "R U Mine ?" (2 parts + `FULL.mp4`, folder `Tchad_Blake_Arctic_Monkeys_R_U_Mine_Mixing`, record
`docs/mwtm/sets/Tchad_Blake_Arctic_Monkeys_R_U_Mine_Mixing.md`). Lessons folded into
`docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md` ("Jacob-coordinated route"): white logo slate (blackdetect finds
nothing), check the first frame BEFORE encoding (two Part 2 start estimates were 5 to 7 s early and cost
two wasted encodes), never dispatch with truncated part text, MWTM site is Cloudflare-blocked for scripted
fetches, kill stale scan loops, export takes about 1.5x to 1.9x content length. No transcription or AIMM
import done (still only on Kevin's request). Docs/skill only; `index.html` untouched.

**2026-09-21 update, later same day (Cat) — item 34 APPROVED, Kevin: "we will implement this."**
AIMM stem separation (cloud backend + RunPod serverless Demucs worker, the proposal scoped earlier
today) is no longer a proposal for Kevin to decide — he has approved it and committed to building it.
Docs-only update this pass: `docs/ROADMAP.md` item 34, `DASHBOARD.html` card 34, this file, and
`docs/RUNPOD-GPU-RESEARCH-BRIEF.md` all reworded from "proposal"/"research" framing to "approved,
scoped for build." Nothing built or spent yet. Priority position unchanged — still behind the
Hope-intelligence backlog (items 24/25) in the queue unless Kevin explicitly reprioritizes.
**Next step: implementation goes through Codex as lead implementer (Cat reviews), per standing
process — not started this pass.** `index.html` untouched.

**2026-09-21 update, earlier same day, REVISED (Cat) — Backlog 34, monetization rules out the local-GPU
workaround.** Kevin clarified AIMM is intended to be monetized: stem separation must work for any user on
any computer via the app itself, not depend on Kevin's local hardware. This retires the earlier "run
Demucs on the RTX 3070" workaround proposal entirely (kept in the brief for history, not deleted) —
the real in-product build is now the only candidate, worked out in architectural detail. Live GPU
pricing (pulled by the coordinator, `list-gpu-types`/serverless/secure): RTX 4090 serverless $1.10/hr
(HIGH availability, 10 DCs) or RTX A5000 serverless $0.69/hr (also HIGH availability), both ample VRAM
for Demucs; serverless per-second billing is the right product type for bursty per-user usage, not a
rented pod. At ~1 min inference/song: ≈$0.018/song (4090) or ≈$0.011/song (A5000) — compute is cheap at
scale, the backend build is the real cost. Minimal backend scoped (an ARCH-1-equivalent slice, not the
full Epic): auth, R2 presigned-upload path, job-trigger + tracking (Worker → RunPod `/run` → D1/KV job
row), result delivery via the worker pushing stems straight to R2, storage retention, and — the actual
monetization hook — a usage ledger (per-user, per-job) built in from day one so a future quota/paywall is
a policy change, not a rebuild. RunPod worker: Demucs + a standard `handler(event)`, check the RunPod Hub
first for an existing maintained worker before building a custom image. Full pricing table, backend
breakdown, and cost model: `docs/RUNPOD-GPU-RESEARCH-BRIEF.md`, `docs/ROADMAP.md` item 34. Runpod's own
MCP tools remained unreachable from this session (confirmed a subagent-tool-grant gap, not a credential
problem — OAuth was already completed in a prior `ai-news-channel` session) — the coordinator supplied
the live pricing directly instead. `index.html` untouched.

**2026-09-21 update, feasibility research (Cat) — Backlog 34 (Runpod GPU credit), stem-separation angle.**
Kevin asked whether Runpod could deliver AIMM's not-yet-built stem separation. Research only, nothing
built, no pod created, no spend. Findings appended to `docs/RUNPOD-GPU-RESEARCH-BRIEF.md`: (1) stem
separation is confirmed NOT built — it's "Option B" inside Backlog 22 (Multi-stem Mix Check), explicitly
deferred behind "Option A" (manual stem upload, which shipped), no scheduled date, behind Hope-intelligence
work in priority; (2) AIMM's only backend surface today is the `aimm-proxy` Cloudflare Worker, a pure
API-key relay (Claude + ElevenLabs) — no storage, no auth, no job queue, confirmed via a direct read of
`index.html` (zero `BiquadFilterNode`/`OfflineAudioContext`/`AudioWorklet` matches, no R2 usage) — so
ARCH-1 (Backend Foundation) is still unbuilt; (3) Demucs (MIT licence) is the practical stem-separation
model, GPU-bound, and Kevin's own local RTX 3070 is already capable of running it; (4) Runpod serverless
is a clean fit for the compute step specifically (cheap, pay-per-second, plausibly better than the
roadmap's Railway/Render CPU sketch) but does NOT remove the real gap — AIMM still needs ARCH-1 built
before any ARCH-2-shaped service (Runpod or otherwise) has anywhere to plug in; (5) two distinct proposals
logged for Kevin's decision — a no-engineering workaround (run Demucs via Runpod or the local 3070 outside
the app, then drop stems into the already-live Option A upload) vs. the real in-product Option B (multi-day
ARCH-1 + ARCH-2/3-shaped build, not currently prioritized). Runpod MCP tools did not load this session, so
live balance/pricing (Step 1 of the brief) is still not verified. Full detail in the brief. `index.html`
untouched.

**2026-09-20 update, docs-only backlog capture (Cat) — Backlog 34 (Runpod GPU credit).**
Logged a parked idea: Kevin has roughly 13 hours of RTX 4090 Runpod credit (about $0.74/hr, per his own
note, not re-verified) on his Runpod account, not the repo. Candidate aimm uses only, repo not inspected:
Demucs-style stem separation or heavier audio analysis, both slow on his RTX 3070. No spend committed,
nothing created on Runpod. Caution recorded: no Oxford or work audio/documents to a rented GPU. Advice:
don't spend just to use it up; state the pod's hourly cost before creating anything. See
`docs/ROADMAP.md` item 34 and its `DASHBOARD.html` card. Research brief:
`docs/RUNPOD-GPU-RESEARCH-BRIEF.md`. Next action: fresh Cat session, read the brief, run Step 1 (read-only
Runpod balance and GPU pricing check). `index.html` untouched.

**2026-09-07 update, filename-first stem labelling (Cat) — Backlog 22 (Multi-stem Mix Check).**
Kevin tested the mockup with his own real files and sent a screenshot showing filenames like
"Paypadream$ (mastered)_Bass.wav", "_Drums.wav", "_Guitar.wav", "_Other.wav", "_Piano.wav",
"_Vocals.wav" — the instrument name is explicitly right there in the filename, and the audio-content
classifier (which had a real bug fixed in it earlier the same day — the stereo-downmix sign error
that fabricated harmonics) was running anyway, guessing an answer the filename already gave for
free. Kevin's framing: "AI should be intelligent enough to be able to know the title, and instrument
from the wav title, this should not be a guess." `index.html` untouched — `docs/mockups/multistem-
mixcheck-final.html` only.

**Fix — filename tried first, content classifier only as fallback.** Added
`FILENAME_KEYWORD_CATEGORIES` + `labelFromFilename(name)` (placed immediately before
`classifyStem()`, since it conceptually runs first) covering Bass/Drums/Guitar/Vocals/Piano/Kick/
Snare/Hats/Percussion/Synth/Keys/Strings/Brass/FX/Other, each matched case-insensitively via a
regex using a negative lookbehind/lookahead requiring a NON-LETTER (or start/end of string) on both
sides — deliberately NOT JS `\b`, which treats `_` as a word character and would fail to match
"_Bass.wav" (no boundary between `_` and `B`, both `\w`). The stem-classification loop in
`mcHandleFiles` now calls `labelFromFilename(s.fileName)` first; if it returns exactly one
unambiguous category, that becomes the label directly with `guessed:false` (NOT badged "GUESSED" —
it's a known fact from the filename, not a guess) and `classifyStem()` is skipped entirely. Only
falls back to the audio-content classifier (`guessed:true`, badge shown) when the filename gives no
usable clue (a generic export name like "track1.wav") or an ambiguous one (two different instrument
keywords in the same filename, e.g. "Guitar_Bass_stem.wav" — resolved by falling back rather than
picking one arbitrarily). Rename (the contenteditable label) is untouched and works identically for
both filename-derived and content-guessed labels.

**Codex three-touchpoint review, mandatory per agent-commons policy:**
- **TP1 (plan)** — reviewed the lookbehind/lookahead approach and keyword set before writing code.
  Confirmed the `\b`-vs-custom-lookaround reasoning was necessary; flagged two real caveats folded
  into the code comments (ASCII-only `[a-zA-Z]` — Unicode filenames out of scope; modern-JS lookbehind
  support required, acceptable since this runs in Kevin's own current browser) and one compound-word
  limitation accepted as out of scope ("drumloop.wav" style fused compounds don't match — Kevin's
  real files use delimiters).
- **TP2 (diff)** — reviewed the actual diff; ran a real Node execution of the exact regex table
  against representative filenames as part of the review. No functional bug found. One inaccurate
  code *comment* caught and fixed (an example claimed "an-OTHER-.wav" wouldn't match "Other" — it
  actually does, since hyphens are delimiters, not letters; the comment was corrected to state the
  rule accurately instead of contradicting the code's own real behaviour).
- **TP3 (real headless-Chrome, Playwright)** — synthetic WAV stems built with Kevin's exact filename
  pattern, dropped through the real `#refFileInput` → `window.mcHandleFiles()` path (not a unit test
  of the function in isolation) and the actual rendered `#mcStemRows` DOM read back. Four scenarios,
  all passed: (1) all six of Kevin's real filenames ("_Bass.wav" through "_Vocals.wav") resolved to
  the correct label with the "GUESSED" badge absent in every case; (2) a generic filename
  ("track1.wav") with no instrument keyword fell back to the content classifier and showed the
  "GUESSED" badge, while a filename-keyword stem in the same session correctly stayed
  filename-derived; (3) an ambiguous filename containing two different instrument keywords
  ("Guitar_Bass_stem.wav") fell back to the content classifier rather than picking Guitar or Bass
  arbitrarily; (4) a false-positive-prone filename ("brassy_loop.wav") did NOT match "Bass" and
  correctly fell back to the classifier, confirming the word-boundary logic holds against the
  substring-collision case Kevin's brief specifically named. A companion Node-level test (25 cases
  covering "another.wav"/"mother_track.wav" not matching "Other", "percent_calc.wav"/"percolate.wav"
  not matching "Percussion" via "perc", `vocals_vox.wav` matching Vocals via either synonym without
  being flagged ambiguous, delimiter tolerance for `_`/space/`-`/`()`, etc.) also passed 25/25. Two
  unrelated pre-existing 404s (`docs/knowledge/*.json`, a relative-path artifact of serving the
  mockup outside its normal deployed root) were confirmed present and unrelated before/after this
  change — not a regression.

**Debug hook added (mockup-only, matches existing convention):** `window.__mcDebug.labelFromFilename`
exposed alongside the existing `classifyStem` debug accessor, for TP3 headless-Chrome verification —
same "not used by any UI/app code path, safe to leave in a design mockup" convention already
documented at that object's definition.

---

**2026-09-07 update, corridor-comparison architectural fix (Cat) — Backlog 22 (Multi-stem Mix
Check) requirement 3 refinement.** Kevin found a real architectural gap: dropping a solo bass stem
into Mix Check compared it against the FULL-MIX genre corridor, producing meaningless numbers
("your low end is forty one dB over") since a bass-only signal has no highs by design — the
corridor didn't know it was looking at an isolated stem rather than a full mix. Went with Kevin's
explicitly chosen simpler option (of the two he offered): when a multi-stem session has been
narrowed to exactly one currently-audible stem, SUPPRESS the corridor comparison and say so
honestly, rather than inventing a stem-specific reference target (a fabricated "what a solo bass
stem should look like" target would be just as misleading as the wrong-target comparison it
replaces). `index.html` untouched — `docs/mockups/multistem-mixcheck-final.html` only, build bumped
to `2026-09-07.4`.

**Exact detection condition** — a new shared accessor `window.__mcSingleStemIsolated()` (added
inside the existing multi-stem IIFE, exported as `window.mcCorridorSuppressed()` for external
callers) returns true only when BOTH: (a) more than one stem was EVER loaded into the session
(`stems.length > 1` — counts every stem dropped in, including ones later excluded for a
sample-rate/length mismatch, so a 2-stem session where one failed validation still counts as
"attempted multi-stem", not an ordinary single-file load — a real edge case Codex's TP1 review
caught, see below), AND (b) exactly one of the non-mismatched stems is currently audible
(`eligibleStems().filter(s=>!effectiveMuted(s)).length === 1`, using the SAME
`eligibleStems()`/`effectiveMuted()` logic `runAnalysisSync()` itself uses, so "suppressed here" can
never disagree with "audible for analysis"). Deliberately returns **false** (corridor stays
meaningful, unaffected) for: an ordinary single-file load (no stems array populated at all) and a
degenerate one-stem-total session (nothing was ever loaded alongside it) — matching Kevin's own
framing that a single loaded "stem" IS the full file the corridor was designed for. Mute-down-to-one
and solo-one are treated identically (both produce `audible.length === 1`), confirmed by direct
test.

**What's suppressed vs. shown when isolated** — three surfaces gated on the same flag: (1) the
visible Spectral Balance Low/Mid/High corridor-deviation cards (`ozPopulateBands()`) show `N/A ·
isolated stem` instead of a computed dB delta, plus a new visible banner
(`#mcCorridorNote`, "Corridor comparison needs the full mix (or multiple stems) — showing raw
spectrum only") — the raw spectral CURVE canvas itself is left completely untouched, still drawing
the real measured curve; (2) the Fix Queue's per-band corridor-delta signal group
(`MC_FIXQUEUE.build()`, titled e.g. "Low end +X dB vs corridor") is skipped entirely — zero
corridor-based items generated; (3) Hope's context feed (`breakdownData().tonalBalanceDeltas`
nulled + new `tonalBalanceSuppressed` flag, consumed by both `buildMixCheckContextBlock()`'s "MIX
CHECK — LIVE STATE" block and the real Claude-API prompt that generates Hope's spoken "read") says
the comparison isn't meaningful right now instead of reciting fabricated or blank numbers.
Deliberately UNCHANGED: LUFS/true peak/PLR/correlation/crest (Audio Specs) — all computed directly
from the combined audible buffer with zero corridor involvement — and the Fix Queue's other signal
groups (true peak/PLR/correlation/loudness direct-measure signals, plus the ratio-based sub/air-band
heuristics like "muddy"/"808"/"harsh", which use fixed thresholds rather than a corridor
comparison) — the brief scoped suppression strictly to "corridor-comparison claims", and these
remain valid measurements of whatever's currently audible.

**Codex three-touchpoint review, mandatory per agent-commons policy:**
- **TP1 (plan)** — reviewed the exact detection condition + what gets suppressed before writing
  code. Flagged one real edge case (see (a) above — using `eligibleStems().length` instead of
  `stems.length` would have misclassified a multi-stem session where all-but-one stem failed
  validation as an ordinary single-file load); confirmed leaving the ratio-based Fix Queue signals
  untouched was the correct scope boundary per the brief.
- **TP2 (diff)** — found and fixed one real bug: the "N/A — isolated stem" tag text was written into
  `#ozBand*Tag`, an element permanently `display:none` in this redesign (status is conveyed via the
  fill bar, not the tag) — so the explanation was silently invisible, leaving only a bare dash on
  screen. Fixed by moving the explanation into `.oz-band-val` itself (genuinely visible). Also
  flagged a defensive-consistency nit (two call sites used `window.__mcSingleStemIsolated()`
  directly instead of the guarded `mcCorridorSuppressed()` wrapper) — fixed for consistency across
  all three gated surfaces.
- **TP3 (real headless-Chrome, Playwright)** — synthetic 3-stem session (60/90 Hz "Bass", 150/3000 Hz
  "Drums", 300/700 Hz "Vocals") driven via `window.mcHandleFiles()` + real solo/mute button clicks.
  Confirmed: full mix shows real corridor numbers + corridor Fix Queue items, note hidden; soloing
  Bass suppresses corridor cards (now visibly "N/A · isolated stem"), shows the banner, drops
  corridor Fix Queue items while keeping LUFS/PLR items, and LUFS/true peak read real numbers for the
  isolated stem (-16.2 LUFS / -10.9 dBTP, distinct from the full-mix numbers); un-soloing back to
  full mix resumes corridor comparison with the exact same numbers as before; mute-down-to-one
  (no solo) produces identical suppression to solo-one, confirming the two are treated the same;
  all-muted (unrelated pre-existing edge case, zero stems audible) correctly does NOT trigger
  suppression — out of scope either way; the ordinary single-file-loaded case (`stemCount:0`, never
  entered stem mode at all — `mcHandleFiles` degenerate-case path) was explicitly re-tested and
  confirmed corridor comparison still works completely normally, unaffected by this fix.

**2026-09-07 update, second correctness-bug pass (Cat) — Backlog 22 (Multi-stem Mix Check):
five issues found and fixed on `docs/mockups/multistem-mixcheck-final.html`, routed by Jules.**
Kevin re-tested with 6 real WAV files after the stem-classifier fix (below) and reported two
concrete bugs from a screenshot; Jules folded in three more real gaps mid-pass (immediate-draw
timing, the colour scheme never actually being applied, and Hope having zero stem awareness).
`index.html` untouched throughout — mockup-only. Full Codex three-touchpoint review on all five.

1. **Per-stem waveforms were completely blank.** Root cause, confirmed with real headless-Chrome
   instrumentation (temporary console.log probes in `smDraw()`/`mcDrawStemRows()`, real synthetic
   stereo WAV stems loaded via `#refFileInput`, live DOM ancestor-chain dump at the exact moment
   the draw call returned early): the whole `#mcStemStack` tree lives inside `#refDzLoaded`, which
   is `display:none` until something adds `.visible` to it. That reveal only ever happened inside
   `window.refLoadFile()` (the single-file path), and for the multi-stem path `refLoadFile()` is
   only invoked ASYNCHRONOUSLY and LATER — via `scheduleAnalysisSync() -> runAnalysisSync() ->
   await window.refLoadFile(wavFile)` (the synthesized down-mixed analysis file). `mcEnterStemMode()`
   calls `mcRenderStemRows()` (which draws every stem canvas) synchronously and immediately, well
   before that async reveal — so every canvas measured 0×0 at draw time, `smDraw()`'s
   `if(!cw||!ch) return;` guard silently fired, and nothing ever re-triggered a redraw until a
   later transport action (play/pause/seek) happened to fire after the reveal had finally landed.
   Measured directly: initial draw call logged `cw=0,ch=0` with `#refDzLoaded` computed
   `display:none`; a later draw call (post-reveal) produced non-blank canvas pixel data.
   **Fix:** added `window.__mcRevealTransport()` — the same three DOM writes `refLoadFile()` always
   did, now shared and called SYNCHRONOUSLY at the top of `mcEnterStemMode()`, before any row is
   rendered/drawn — plus a defensive extra `mcDrawStemRows()` call at the end of
   `runAnalysisSync()`'s success branch as a cheap, idempotent second-chance repaint. This also
   satisfies Kevin's separate, previously-missed requirement that waveforms render immediately once
   stems are decoded, not wait for Play.

2. **Stem rows with the same guessed category were visually identical.** Root cause, confirmed by
   reading the code: `mcHandleFiles()`'s `stems.push({..., label: stemBaseName(f.name), ...})`
   initially stored the real filename in `label`, but the immediately-following classification loop
   unconditionally overwrote it (`s.label=guess.label`), permanently discarding it — nothing else on
   the stem object retained it, and the row template only ever rendered `label` + a "guessed" badge.
   With 3 stems guessed "Other" and 2 "Bass" (Kevin's screenshot), those rows became text-for-text
   identical. **Fix:** added an immutable `fileName` field captured once at push time (never touched
   by classification or rename), rendered in the row head ahead of the existing editable
   content-guessed label + badge, reusing the app's existing muted small-mono `.tp-file` filename
   styling (used for the single main loaded file's name) with a row-local override
   (`.mc-stem-file{min-width:0;flex-shrink:1;max-width:130px}`) so long names still fit.

3. **Colour scheme was never actually applied.** Kevin's words: "I want the waves in our colour...
   complete wave and as played they turn Orange." `smDraw()` previously stroked the WHOLE unplayed
   span in flat grey and only the played span in the app's blue->purple `--send-blue` gradient — the
   opposite of what was asked, and never implemented at all despite being in the original brief.
   **Fix:** inverted for these NEW per-stem rows only (the real locked `#mcWave` transport canvas is
   untouched — `smDraw()` is a fully separate function from `MC_WAVE.draw()`): the full/unplayed
   span now renders in the blue->purple gradient (`#2fa1e6`->`#a557f4`, spanning the whole canvas
   width) and the played span (behind the playhead) switches to the app's existing faded-orange
   gradient (`#fdba74`->`#f97316`, reused verbatim from `.aichat-msg.fixaction .fa-mini i`).
   Verified with real per-pixel colour sampling across the canvas width, before and during playback.

4. **Hope had zero stem awareness.** Kevin tested it and Hope answered "bounce a stem down and drop
   it in separately" as if only a single rendered mix file was loaded — a dropped requirement from
   the original brief (req 4: "Hope must be aware of stem state at all times... never ask, she
   already knows"). Root cause: the Hope rail's text chat (`aichatSend()`, a REAL Claude API call,
   not scripted text) builds its system-prompt context via `buildMixCheckContextBlock()`, which only
   ever described `buildMixCheckState()`'s single `file_name` — nothing in it ever asked the
   multi-stem module (whose `stems` array is private to its own IIFE closure) whether stems were
   loaded at all. **Fix:** added `window.__mcStemsForHope()`, a real (non-debug) accessor bridging
   the closure, and wove its output into `buildMixCheckContextBlock()` — stem list, guessed/renamed
   labels, and accurate mute/solo/audible state, woven in ahead of the existing Fix Queue section.
   Scoped as content/context-string changes only — explicitly not new ElevenLabs/RT_INSTRUCTIONS/
   TOOL_DEFS wiring, so this stayed with Cat rather than routing to Markey.
   **Codex TP2 caught two real follow-on bugs, both fixed and re-verified:** (a) a stale-analysis
   exposure — muting/soloing/adding/removing a stem bumps the async re-analysis but the OLD Fix
   Queue/loudness numbers stayed visible with no indication they didn't match the new stem
   combination yet; fixed with `window.__mcAnalysisStale()` (an `analysisSeq` vs
   `lastCompletedAnalysisSeq` tracker) which now suppresses stale numbers behind an explicit
   "re-running after a stem change" note. (b) a soloed-AND-muted stem displayed as `[SOLO, muted]`
   even though solo overrides mute and the stem is actually audible; fixed to read
   "mute requested but overridden by solo — still audible", based on the same `effectiveMuted()`
   logic already used for playback.

Codex three-touchpoint summary for this pass: TP1 (plan, before code) confirmed the bug-1 root
cause against the actual `mcEnterStemMode()`/`refLoadFile()`/`runAnalysisSync()` code and the fix
location, flagged an existing-but-separate async race (stems cleared mid-analysis) as a hardening
note (not required for this scope), and confirmed bug-2 + the colour plan. TP2 (diff review) found
the two real follow-on bugs described above (stale analysis exposure, solo/mute display) — both
fixed before TP3. TP3 (real headless Chrome, Playwright + a real Chrome binary, 6 real synthetic
stereo WAV stems — kick/bass/vocal/guitar/pad/fx, deliberately producing 3 "Bass" + 3 "Vocals"
duplicate-category guesses to reproduce the original "3 identical Other rows" scenario): confirmed
all 6 rows show real non-blank waveform pixel content the instant stems finish decoding (before any
Play click); confirmed all 6 rows show a distinguishing filename alongside the guessed-category
badge, with same-category rows fully distinguishable; confirmed real per-pixel colour sampling
matches the blue->purple (unplayed) / orange (played) split exactly, both before playback (100%
blue->purple) and mid-playback (orange up to the playhead, blue->purple after it); confirmed
`buildMixCheckContextBlock()` (the actual string fed into both the elStart voice path and the
aichatSend text-chat path) correctly lists all 6 stems with accurate labels and updates mute/solo
state live, including the stale-analysis and solo-overrides-mute corrections. Zero console
`pageerror`s across the full run.

---

**2026-09-07 update, correctness-bug pass (Cat) — Backlog 22 (Multi-stem Mix Check): real
stem-classifier bug found and fixed, routed by Jules.** Kevin tested the final-brief build
(commit `755e68b`) and reported: "vocals appear as drums - we need to fix this - every track is
completely off." Real DSP debugging, not a threshold re-tune — full Codex three-touchpoint review.

**Root cause, proven with real headless-Chrome numbers, not self-report.** `classifyStem()`'s
stereo-to-mono downmix (`mono()`) fed a signal into the FFT whose every sample's magnitude came
from the correct energy formula `sqrt((L^2+R^2)/2)` but whose SIGN was an arbitrary global choice
based on `(l+r)`'s sign — the code's own comment claimed this was "harmless… magnitude-only," which
was false. Whenever L and R aren't in phase (true of nearly every real stereo stem — reverb, delay,
chorus, stereo width, all normal on a vocal stem exported from a DAW), this produces a
rectification-like artifact that fabricates broadband harmonic content not present in either
channel, inflating spectral flatness specifically. Measured directly: a formant-shaped, sung-melody
synthetic "vocals" test signal (mono) measured flatness ≈0.066 (correctly reads as tonal, well under
the 0.30 Vocals ceiling); the identical vocal content, unchanged, with a realistic 3-tap reverb tail
added to the right channel only, measured flatness 0.33–0.43 through the old downmix — enough to
cross out of the Vocals bucket entirely and, depending on the exact reverb/onset shape, all the way
past the 0.35 Drums floor too, even with `midRatio` still ≈0.6–0.86 (clearly vocal-formant-dominant).
This directly reproduces "vocals reads as drums / every track is completely off" — since almost
every real-world stereo stem carries some width/reverb, this wasn't an edge case.

**Fix:** `classifyStem()` no longer downmixes time-domain samples before the FFT. It now FFTs each
channel separately (same Hann window) and sums squared magnitude per bin across channels — a
phase-safe combination that can neither fabricate harmonics (the bug) nor destructively cancel
out-of-phase content (the original, valid concern the old sign-hack was trying, incorrectly, to
solve). `mono()` was renamed `monoEnergy()` and kept only for the RMS/onset envelope, where sign is
provably irrelevant (RMS squares the sample). Mono-file behaviour is unchanged. Real headless-Chrome
verification (Playwright + a real Chrome binary, same 4 realistic stereo synthetic stems, before
`git HEAD` vs after the fix): Drums/Bass/Other all still correctly classified both before and after;
Vocals went from misclassified (`Other`, flatness 0.356) to correctly `Vocals` (flatness 0.066),
`midRatio` unchanged (≈0.87, always clearly vocal) proving the fix touched only the fabricated
metric, not the real signal content. Codex TP1 (plan, before code) flagged the `mono()` sign bug on
inspection before any instrumentation ran; Codex TP2 (diff review) approved with two minor
follow-ups applied (`Float64Array` for the power-spectrum accumulator to preserve the original
double-precision accuracy; `channels` debug field now reads `buf.numberOfChannels` directly).

**Also confirmed, not fixed (honest limitation, not a bug):** an extreme synthetic test where a
"vocal" signal's energy was deliberately ~80% broadband noise (a far heavier sibilant/consonant
ratio than any real singing voice) still reads as Drums even post-fix (`flatness` 0.43,
`transientsPerSec` 3.5) — a stem that's mostly noise-transient energy genuinely does resemble
percussive content on this feature set. This matches the classifier's existing disclosed limitation
in the section below (tonal-vs-percussive ambiguity is a real heuristic ceiling, not a coding error)
and is not something this fix should chase further — badged "guessed," click-to-rename remains the
correction path.

Instrumentation added (all additive, no decision-logic change): `classifyStem()`'s return now also
carries `activeWindows`, `framesCounted`, `onsets` (split into `silenceOnsets`/`jumpOnsets`),
`analyzedSec`, `sampleRate`, `channels`; `window.__mcDebug.classifyStem` exposes the real function
for future headless-Chrome verification without needing file drag/drop. `AIMM_BUILD` bumped to
`2026-09-07.3`.

---

**2026-09-07 update, final pass (Jules) — Backlog 22 (Multi-stem Mix Check): final agreed brief,
SUPERSEDES `multistem-mixcheck.html`, `multistem-mixcheck-in-context.html`, and
`multistem-mixcheck-minimal.html` for review purposes.** After an extensive live design discussion,
Kevin gave a complete final brief covering all remaining open questions on this feature (the exact
continuous-sync-while-muted playback model, content-based stem labelling instead of filenames,
Snapshot integration, and a hard "never concatenate filenames in the header" rule after the earlier
concatenated-header bug). One-line reason each prior mockup is superseded: `multistem-mixcheck.html`
— wrong drop-target structure (a separate stem-slot panel instead of extending the real shared
drop zone); `multistem-mixcheck-in-context.html` — hidden real components + a duplicate Hope panel;
`multistem-mixcheck-minimal.html` — wrong interaction model (one single-buffer engine reused for
both playback and analysis, so mute/solo had to interrupt the mix, and filename-based labels, which
is what produced the concatenated-header bug).

**Flagged, not silently resolved:** a fourth prior mockup, `multistem-mixcheck-v2.html` (per-stem
drop slots, built after Kevin rejected the minimal pass's shared picker), was NOT named in this
final brief's explicit supersession list. This pass's shared-drop-zone requirement is the opposite
structural direction from v2's slots. Very likely also superseded given the rest of the brief
(content classification + rename removes the labelling problem slots partly existed to solve), but
logged as an open question for Kevin to confirm rather than assumed — see the full reasoning in
`docs/ROADMAP.md`'s Multi-stem Mix Check section. `multistem-mixcheck-v2.html` stays live,
unchanged; its DASHBOARD.html badge is not removed.

**Delivered:** `docs/mockups/multistem-mixcheck-final.html`, pushed to `main`. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-final.html`. Base = a fresh
fetch of `main` `index.html`, edited in place; `index.html` itself untouched throughout.

**The core correction, verified not just built:** every loaded stem's `AudioBufferSourceNode` now
runs continuously for the whole playback duration regardless of mute state — mute/solo ramps ONLY
that stem's own persistent `GainNode`, never stops/restarts/reschedules a source. Verified via a
debug hook (`window.__mcDebug`) instrumenting real `AudioContext.prototype.createBufferSource`
calls: 3 full rounds of mute-toggling every stem + a solo/un-solo cycle, while genuinely playing,
produced zero new source-node creations, with `AudioContext.state` staying `"running"` and
`currentTime`/elapsed-time continuing to advance throughout. Isolating one stem changed measured
loudness from -70.0 LUFS (all muted) to -14.7 LUFS (real signal) — live-reactive Audio Specs/Fix
Queue/Spectral Balance confirmed functionally correct, not just visually plausible, reusing the
same summed-buffer-through-`refLoadFile()` technique the minimal pass proved, now serialized via a
latest-wins queue. Stem labels come from real content-based classification (concrete FFT/threshold
constants, honestly badged "guessed," click-to-rename), classified all 4 correctly on
spectrally-distinguishable synthetic demo stems after a TP3-found onset-detection fix. A Snapshot
extends the existing `STATE.journal`/`createWorkbenchBackupPill()` pattern (fingerprint-keyed,
settings-only) — confirmed via headless-Chrome save/reload that labels (including a manual rename)
restore automatically without re-classifying. Header never concatenates (`#mcSub` = "N stems loaded
— duration"). No EQ, exactly one real `#hopeRail`. Codex three-touchpoint review — TP1 materially
reshaped the playback engine, analysis-serialization, classification constants, and Snapshot
fingerprint design before code was written; TP2 (diff review) confirmed the mute/solo path never
touches a source node and found+fixed 6 more real bugs (an analysis-reset race, a solo+mute
audible-set inconsistency between playback and analysis, an unstable Fix-Queue signature across
reloads, a Snapshot-restore duplicate-matching gap, a stem added mid-playback staying silent, a
mismatch-reference edge case); TP3 (real headless-Chrome click-through) found+fixed 2 more (a
`[hidden]` CSS bug, the onset-detection logic bug) then re-ran the full suite clean. Full
design-decision + Codex-findings write-up in `docs/ROADMAP.md`'s Multi-stem Mix Check section.
Not build authorization; Option A vs B remains Kevin's open call.

**2026-09-07 update, later same day again (Jules) — Backlog 22 (Multi-stem Mix Check) v2:
per-stem drop slots, SUPERSEDES the minimal pass below after Kevin tested it and found a real
bug plus a wrong interaction model.** Kevin tested `docs/mockups/multistem-mixcheck-minimal.html`
(the "minimal pass" write-up immediately below this one) and reported two problems: (1) a real
bug — dropping files produced 7 identical duplicate stem rows all named the same thing, with a
"mismatched stem(s) excluded" warning; (2) the interaction model itself was wrong — he sent a
screenshot of the ORIGINAL standalone mockup's "Input — Stems" panel (fixed Drums/Bass/Vocals/
Other rows, each its own independent drop target reading "Drop WAV here or click to browse", plus
a "+ Add stem" row) and said "they should look like this," explicitly rejecting the minimal
pass's single shared multi-file `Drop / browse WAV` picker. He also asked "where are the multiple
wave files" — expecting each stem to show its own waveform preview inline, not just the shared
combined waveform.

**Root cause of the duplicate-stem bug, confirmed by live headless-Chrome reproduction (Playwright
against the actual built minimal-pass file, not guessed):** a single synthetic drop with one file
correctly produced exactly one stem — event bubbling/`stopPropagation()` were NOT the problem.
Re-dispatching the SAME file at the SAME shared drop target 7 times in a row produced exactly 7
identical `window.mcStems` entries, an exact match for Kevin's report. The minimal pass's shared
multi-file picker had no dedupe check against an already-loaded identical stem, AND gave ZERO
visible feedback below 2 stems (`mcRenderStemRow()` hides the stem row entirely until there are
2+ stems, by design, to keep the single-file case pixel-identical to today) — so a user who drops
once, sees no visible "stem added" acknowledgement, and reasonably re-drops the same file
expecting it to register, silently accumulates duplicate stems. This is a UX/interaction-model
bug, not a stray double-event-firing bug — and it is exactly the kind of failure the per-stem-slot
redesign structurally prevents (each slot holds at most one stem and REPLACES, not appends, on
every drop).

**Delivered: `docs/mockups/multistem-mixcheck-v2.html`**, pushed to `main`. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-v2.html`. `index.html`
read-only reference throughout, fetched fresh — never edited. Kevin should review THIS one now;
the minimal pass and both earlier mockups stay live at their own URLs, unchanged, for reference
only.

**What changed vs the minimal pass:**
- **Per-stem drop slots, not a shared picker.** Four default slots (Drums/Bass/Vocals/Other) plus
  a "+ Add stem" row for open-ended generic slots, matching the structure in Kevin's screenshot.
  Each slot is independently droppable/clickable; dropping into an already-filled slot REPLACES
  its stem in place (no remove-then-reload needed), closing the duplicate-drop failure mode
  structurally, not just by coincidence of the new layout.
- **Restyled to the real app's own visual language**, not the standalone mockup's separate dark
  card system Kevin had already flagged as inconsistent in an earlier round — reuses the real
  page's own `--card`/`--card-bd`/`--inset2`/`--grad`/`--mono` tokens and the exact `.ref-t-btn`
  button class already used by the real transport's play/prev/loop/stop buttons.
- **Each stem shows its own inline waveform preview** — a small per-slot `<canvas>` peak-render of
  that individual stem's decoded audio, standalone/decoupled from the real combined-waveform
  engine (no shared mutable state) — in addition to, not instead of, the existing shared combined
  waveform below the transport (which still shows the combined currently-audible mix).
- **Generation-token guarded loads** — a rapid second drop onto the same slot before the first
  decode resolves always lets the newer one win, never a stale race (a Codex TP1 plan-review
  catch, verified in TP3 with two back-to-back drops onto one slot).
- **The legacy shared "Drop / browse WAV" control is hidden (via CSS, not deleted)**, not
  re-purposed into the slot system — its pristine drop/click handlers call `refLoadFile()`
  directly and bypass `window.mcSlots` entirely, so wiring it into the new model would let it
  silently fight the slot system for control of the transport (a real risk Codex's TP2 diff review
  caught and this pass closed with a capture-phase guard on `#eq` that blocks any drop landing
  outside a stem slot, rather than letting it silently diverge state). `#refDropZone`/
  `#refFileInput`/`#mcInput` keep their exact ids/DOM position so the real page's own uncapped
  DOM-retry init loops (`wireDropZone()`/`wireMcInput()`) still resolve on the first pass, per the
  standing lesson from the earlier in-context mockup pass.
- Mute(M)/Solo(S) per stem still reuse the real `.ref-t-btn` styling. **No EQ anywhere** — still
  explicitly out of scope, confirmed via a zero-match grep for real `BiquadFilterNode` usage (the
  one text hit in the file is this pass's own code comment saying EQ is out of scope).
- Sync/mismatch validation (requirement 1), the combine-buffer-through-`refLoadFile()` reuse for
  live-reactive Audio Specs/Spectral Balance/Fix Queue (requirement 3), the single-file degenerate
  case, and the single real `#hopeRail` are all unchanged in behaviour from the minimal pass,
  just re-plumbed onto a slot-keyed data model instead of a flat push-only array.

**Codex three-touchpoint review — all three touchpoints found real, concrete issues, all fixed
and re-verified via live headless-Chrome (Playwright) execution, not self-report:**
- **TP1 (plan):** confirmed the root-cause diagnosis and that per-slot replace-not-append
  semantics close the duplicate-drop bug, but flagged: add a generation token per slot to guard
  against a race between two in-flight loads targeting the same slot (built in from the start);
  keep the per-slot waveform renderer fully decoupled from the real combined-waveform engine's
  state (built in from the start — a standalone pure function, no shared globals); and account
  for the real page's uncapped DOM-retry init functions when replacing the shared drop zone's
  markup (addressed by leaving `#refDropZone`/`#refFileInput`/`#mcInput` untouched and only hiding
  their empty-state children via CSS, never deleting/moving them).
- **TP2 (diff, against the actual built file):** found 3 real issues, all fixed and re-verified:
  (1) the legacy `#refDropZone`/`#eq`/`#mcTransport` background area could still silently diverge
  `window.mcSlots` from the visible transport via a stray drop outside any stem slot — closed
  with a capture-phase guard on `#eq`; (2) `mcClearAllStems()` cleared the internal slot array but
  never called `scheduleSync()`, leaving the real transport showing a stale combined file — fixed;
  (3) replacing an already-loaded slot required remove-then-reload since the drop target was only
  the empty-state markup — fixed by delegating drag/drop off the whole `.mc-stem-slot` row instead
  of just its empty-state child, so a direct drop-to-replace works.
- **TP3 (real headless-Chrome click-through, Playwright, not a self-report):** re-verified the
  original bug fix (a single drop into one slot → exactly 1 stem; the SAME file re-dropped 7 times
  onto the SAME slot → still exactly 1 stem, replaced not accumulated — the literal regression
  test for what Kevin hit); 4 different stems loaded into their own slots with correct names; each
  loaded slot's own waveform canvas has real non-empty drawn pixels, confirmed via `getImageData`,
  alongside the still-present shared combined waveform; solo/mute correctly re-drives the combined
  buffer and Audio Specs/Spectral Balance; a genuine mismatch (very different real duration, not
  just a re-decode of the same file) is correctly flagged/excluded; a race — two drops onto one
  slot with no await between them — the later one always wins; dynamically added "+ Add stem"
  slots load, render their own waveform, and can be fully removed (this surfaced and fixed a real
  bug during iteration: a loaded dynamic slot initially had no way to remove the SLOT itself, only
  its stem, since the remove control only rendered in the empty state — fixed by unifying the
  remove button's behaviour on `slot.fixed`); a stray drop outside any stem slot is blocked
  entirely, never appearing in `window.mcSlots`; a replacement file dropped directly onto an
  already-loaded slot replaces it in place; `mcClearAllStems()` now genuinely clears the real
  transport (`#refDzLoaded` loses its `.visible` class, `#mcTitle` resets to "Mix Check"); zero EQ
  UI/`BiquadFilterNode`; exactly one `#hopeRail`; single-file load into one slot unchanged from
  today's behaviour.

**Disclosed, carried forward unchanged from the already-Codex-reviewed minimal pass, not a new
v2 issue:** the combined buffer is hard-clamped to `[-1,1]` rather than normalized, so multiple
simultaneous full-scale stems can clip the combined analysis — an accepted product-acceptance
question for Kevin, not a bug in this pass.

Still backlog capture only, still not build authorization; Option A vs B in `docs/ROADMAP.md`
remains Kevin's open call, unaffected by this or any of the other mockups.

**2026-09-07 update, later same day (Jules) — Backlog 22 (Multi-stem Mix Check): a fresh, MUCH
NARROWER mockup after a live design discussion with Kevin, superseding both prior mockups for
review purposes.** Kevin's explicit framing after seeing the all-7-requirements and in-context
mockups below: "we already have this, just add the tracks." The two prior mockups (built earlier
today) were both too elaborate and built the wrong shape — a separate stem-rack panel, a real
per-stem EQ, a scripted duplicate Hope surface. **New scope, nothing more:** the real Mix Check
transport bar (play/prev/loop/stop, volume, time readout, `Drop / browse WAV ▾`) stays completely
unchanged mechanically; the ONLY new capability is that the drop control now accepts MULTIPLE named
stems (filename = stem label, no fixed Kick/Bass/Vocals/Other taxonomy) with a minimal inline
mute(M)/solo(S)/remove(×) toggle per stem, styled with the exact same `.ref-t-btn` class as the
existing play/prev/loop/stop buttons. **EQ (requirement 7) is explicitly OUT OF SCOPE this pass —
Kevin: "remove EQ — this is not working."** Nothing from either prior mockup's EQ code was carried
into this one.

**Kevin should review `docs/mockups/multistem-mixcheck-minimal.html`** — this is the one to look
at now, not `multistem-mixcheck.html` or `multistem-mixcheck-in-context.html` (both still live at
their own URLs, unchanged, kept for reference — this minimal pass supersedes them for review
purposes only, it doesn't delete or replace them). Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-minimal.html`.

**Build approach — genuinely minimal, reuses the real pipeline as a black box.** Base: a fresh
`index.html` fetched straight from `main` (byte-identical), edited surgically in place —
`index.html` itself was never touched, it's read-only reference. The diff against it is small and
literal: `#refFileInput` gains a `multiple` attribute; the existing `wireDropZone` drop/change
handlers (on `#refDropZone`, and the shared `#eq`/`#mcTransport` drop targets) now collect ALL
dropped/selected files into `window.mcHandleFiles()` instead of only `files[0]`; a new hidden
`<div id="mcStemRow">` sits inside the real `#refDzLoaded`, between the existing `.ref-transport`
row and the existing `.mc-wave-box` — hidden until 2+ stems are loaded, so the single-file
workflow (requirement 8) is pixel-identical to today. All the real analysis machinery (Audio
Specs, Spectral Balance, Fix Queue, `#mcWave`, the transport) is reused UNMODIFIED: a stem store
(`window.mcStems`) decodes and validates each stem (requirement 1 — sample rate/channel
count/length checked against the first stem; a mismatch is flagged with a visible ⚠ + a toast and
excluded from the combined sum, never silently misaligned), and on every add/remove/mute/solo
change, `mcSync()` sums the currently-audible stems' PCM into one combined `AudioBuffer`, encodes
it as a small in-memory WAV, and feeds it through the SAME unmodified `window.refLoadFile()` the
app already uses for a single file — so there's only ever one playback/analysis buffer (no
separate multi-source clock-sync engine needed) and Audio Specs/Spectral Balance/Fix Queue update
live via the app's own existing repopulate functions (requirement 3), exactly as they would for
any normal file load. The degenerate 1-unmuted-stem case routes the ORIGINAL file straight through
`refLoadFile()`, unchanged from today's exact single-file path.

**Codex three-touchpoint review — real issues found and fixed at TP1 and TP2, not just a clean
pass-through.** TP1 (plan, before code) confirmed the `refLoadFile()`-reuse approach was sound and
the scope was clean, but flagged 7 concrete implementation risks: drop-event bubbling could
double-load files (three nested elements all bound `drop` without `stopPropagation`), an
async-race guard was needed, mismatch validation needed to check channel count too (not just
sample rate/length) and exclude mismatched stems from the sum rather than including them
misaligned, a "byte-for-byte" framing claim was slightly inaccurate, PCM16 encoding needed an
explicit clipping policy, the synthetic file's identity needed to be fresh every time so the Fix
Queue never inherits a stale applied/dismissed entry from a different mute/solo state, and the
1-stem-remaining and 0-stems-remaining removal paths both needed explicit handling. All 7 were
fixed before TP2. **TP2 (diff review) then reproduced two REAL bugs live**, not just scope-audited:
(1) a drop landing on `#mcTransport` (inside `#eq`) still bubbled to `#eq`'s own copy of the same
handler and double-loaded every file — reproduced with an actual `DragEvent`/`DataTransfer` drop;
fixed by adding `stopPropagation()` to that shared handler too. (2) the first draft's "revision
counter" race guard was ineffective because it only checked staleness AFTER `refLoadFile()` had
already mutated the shared UI state — replaced with a strictly-serialized promise-chain queue
(`scheduleSync()`) where every mutating action reads `window.mcStems` fresh at execution time, so
no matter how many rapid clicks queue up, the run that actually executes last always reflects the
truly-current state. TP2 also caught that reducing to exactly 1 stem always reloaded the original
file regardless of that stem's own mute state — a muted lone stem would have silently un-muted
itself; fixed so the single-file shortcut only applies when that stem is actually unmuted, muted
routes through the general (silence-capable) combine path instead. TP3 (real headless-Chrome
click-through, not a self-report) then specifically re-tested both TP2 findings as regression
cases — a real `DragEvent` dropped directly on `#mcTransport` added exactly one stem, not two; a
stem muted via the UI then reduced down to the last remaining one stayed muted (measured loudness
read near-silence, ~−70 LUFS, not the plain unmuted tone) — plus the full original checklist:
exactly one `#hopeRail` on the page, zero `BiquadFilterNode`/EQ UI anywhere (the only "EQ" text
matches on the page are the pre-existing plugin-library names like "Neutron 5 EQ", unrelated to
this feature), single-file load unchanged (stem row stays hidden), 3 demo stems loading + chip
names correct, mute/solo verifiably changing the measured loudness and the `#mcWave` pixel output,
a sample-rate/length-mismatched stem correctly flagged and excluded, and clean removal all the way
back down to zero stems (which correctly calls the real `refClearFile()` and restores the empty
drop-zone state). Console was clean of errors introduced by this diff (the only console noise —
`docs/knowledge/*.json` fetch failures and an Anthropic-proxy CORS block — is pre-existing app
behaviour when run outside its normal hosted origin, reproducible identically on vanilla
`index.html`, unrelated to this change).

**Requirements 4-6 (Hope-awareness, tool-calling control, demonstrate-vs-instruct) were NOT built
this pass** — the brief flagged them as lower priority than 1-3 for this minimal pass, and time
went to getting 1-3 genuinely robust (including the TP1/TP2 fixes above) rather than a shallow pass
at all seven. Logged here as explicitly deferred, not silently dropped — a future pass extending
`buildMixCheckState()`/`buildMixCheckContextBlock()` with stem/mute/solo state, feeding the ONE
real `#hopeRail`, is the next piece if Kevin wants to continue down this path after reviewing the
minimal version.

**Not build authorization.** This is still a mockup for Kevin's review, on `main` alongside (not
replacing) the two prior mockups; Option A vs B (multi-stem upload vs auto stem-split) in
`docs/ROADMAP.md`'s "Multi-stem Mix Check" section remains Kevin's open call, unaffected by any of
the three mockups existing.

**2026-09-07 update (Jules) — Backlog 22 (Multi-stem Mix Check) mockup now shown IN THE REAL APP
FRAME, alongside the original standalone mockup:** Per Kevin's explicit ask after reviewing the
standalone mockup ("I want to see it in context of the entire page"), built a second mockup file,
`docs/mockups/multistem-mixcheck-in-context.html`, that wraps the exact same multi-stem Mix Check
feature (all 7 requirements, unchanged) inside the REAL, freshly-fetched `main` `index.html`'s own
chrome — real header, real 8-tab strip (Mix Check/Workbench/Library/Insight/Snapshots/Settings/
Marketing/Community, Mix Check active by default), and the real `#hopeRail` dock, so Kevin can
judge the new stem-slot UI sitting in the actual app rather than as an isolated single-tab demo.
Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-in-context.html` — the
original standalone mockup (`docs/mockups/multistem-mixcheck.html`) is unchanged and still live at
its own URL below; this is an additional view, not a replacement. `index.html` itself is
read-only reference for this pass — never edited.

**Build approach:** the real `index.html` is carried over byte-for-byte; only `#eq`'s (Mix
Check's) inner content changed. The REAL `.mc-head` title row (which also receives the real
Genre/Target/Settings header-actions cluster, exactly as it does live) was kept fully visible and
untouched. Everything else that used to be inside `#eq` — the real banner/transport/meter-rail/
analyser/actions markup — was wrapped in a hidden (`display:none`), NOT deleted, wrapper
(`#eqLegacyHidden`), matching this codebase's existing hide-via-CSS-don't-delete pattern, so the
real page's own init code (`wireDropZone`/`wireMcBanner`/`wireMcInput`/`wireScrub`/`wireMcVol`/
`ozSpecInit`, the transport/header-actions relocation shims, `eqGridInit`/`refTargetChanged`) keeps
finding every element it looks for instead of retrying forever against missing nodes — this exact
retry-loop risk was one of Codex's TP1 catches, before any code was written. The new multi-stem
content itself was carried over verbatim from the standalone mockup into a new `#msmcRoot`
container, with its `<style>` block re-scoped so every selector is prefixed `#msmcRoot` (nothing
in it can bleed into, or be shadowed by, the real page's own extensive CSS).

**Codex three-touchpoint review, all three touchpoints found real issues, all fixed:**
- **TP1 (plan):** verified the tab strip's actual click-handler logic, the `.panel`/`.panel.active`
  CSS, and that the one function known to reach into `#eq`'s specific descendants (`eqGridInit`)
  already null-guards cleanly — but flagged that verbatim page-copying is only safe if the OTHER
  real Mix-Check-specific relocation/init hooks are checked too, not just that one. Follow-up
  investigation (still pre-build) found several more — `wireDropZone`/`wireMcBanner`/`wireMcInput`/
  `wireScrub`/`wireMcVol`/`ozSpecInit`, plus the transport and header-actions relocation shims —
  which retry forever (uncapped `setTimeout`) against missing DOM nodes, which directly shaped the
  hide-don't-delete decision above instead of deleting `#eq`'s original content outright. Also
  flagged real global `@keyframes` names in the standalone mockup's CSS as a zero-cost thing to
  namespace before merging (renamed `hopePulse`/`ringPulse2`/`fadeIn`/`blinkDot` to an `msmc-`
  prefix — no actual collision existed, but cheap to rule out for good).
- **TP2 (diff, against the actual built file):** found a genuine event-bubbling bug — dropping a
  WAV onto a stem row also bubbles up to the real page's own `#eq` drop listener (wired by the
  hidden `wireDropZone()`), which would silently call the real single-file `refLoadFile()` and
  overwrite the real, still-visible `.mc-head` title with the dropped filename. Fixed with
  `stopPropagation()` on the stem-row handler, plus a catch-all `dragover`/`drop` guard on
  `#msmcRoot` itself for anywhere else in the new content. TP2 also found that several transport
  class names (`tp-file`, `tp-row`, `tp-btns`, `ref-t-btn`, `ref-play-pause`, `tp-vol`,
  `tp-vol-ico`, `tp-vol-range`, `tp-time`, `mc-wave-box`) were intentionally named to match the
  real component's own styling in the original standalone mockup, but because both now live under
  the same `#eq` subtree, the real page's `#eq.oz-mixcheck .tp-file`-style rules (higher
  specificity than `#msmcRoot`'s scoped rules) would win and visibly clip/re-style the transport's
  file label — renamed all ten to an `msmc-` prefix to remove the whole class of risk rather than
  patch it rule-by-rule; re-screenshotted afterward to confirm no visual regression (values had
  been intentionally matched anyway, so the fix is style-neutral). Confirmed the carried-over
  multi-stem markup/script otherwise matches the standalone mockup exactly (ids and interaction
  functions intact), and confirmed the `#eq.oz-mixcheck.active{display:block}` override is
  guaranteed to win over the real page's own `display:grid` rule for this file (later in source
  order, identical specificity, nothing downstream re-asserts `display:grid`).
- **TP3 (end-to-end, real headless-Chrome click-through):** confirmed Mix Check loads by default
  showing the new content; clicked through all 8 tabs in sequence and back to Mix Check, confirming
  `.tab.active`/`.panel.active` matched the clicked tab every time and that returning to Mix Check
  preserved live in-progress state (stem still soloed, playback still running, live analysis panel
  still updating) with the new UI fully intact; loaded demo stems, confirmed Solo/Play/EQ-panel-
  open/Hope-suggestion-card/"Let me show you" (tool-call audit line + Undo link) all worked exactly
  as in the standalone mockup; ran `node --check` on every real `<script>` block (clean; one
  pre-existing non-JS `<script type="application/json">` block correctly fails, same as in
  unmodified `index.html`); confirmed the only 2 console messages seen
  (`docs/knowledge/*.json` fetch failures) are byte-identical when loading the unmodified real
  `index.html` directly — a `file://`-vs-`https://` testing artifact, not something this change
  introduced; and specifically re-tested the TP2 drop-bubbling fix with a dispatched native `drop`
  event on a stem row, confirming the real `.mc-head` title text is unchanged afterward.

**2026-09-07 update (Jules) — Backlog 22 (Multi-stem Mix Check) mockup now covers all 7
requirements, pushed to `main`, awaiting Kevin's review:** Per Kevin's 2026-09-06 priority bump
and his explicit authorization to proceed to the mockup stage overnight, extended the existing
requirement-1/2 stem-upload mockup (`docs/mockups/multistem-mixcheck.html`, built 2026-09-04) to
also cover requirements 3-7 — the full requirement set from `docs/ROADMAP.md`'s "Multi-stem Mix
Check" section. Reqs 1-2 (stem drop/upload, sync-mismatch validation, one shared sample-accurate
transport) are unchanged from the earlier pass. New in this pass: a deterministic in-browser
demo-stem generator ("Load demo stems") so the whole mockup is reviewable without Kevin supplying
his own files; a real reactive live-analysis panel (req 3) — an `AnalyserNode` tapped BEFORE the
monitor-volume gain (so playback volume never affects the reading), redrawing on every
mute/solo/EQ change, explicitly labelled "relative FFT magnitude, demo only" rather than claiming
production BS.1770-4/corridor numbers; a scripted, state-grounded Hope rail (req 4); Hope
suggestion cards with two real interaction modes (reqs 5-6, the emphasis area per Kevin) — "Let
me show you" genuinely calls the same `toggleSolo()`/`play()` functions the UI buttons call
(exclusive isolate, a visible tool-call audit line, and a full-state Undo restoring every stem's
solo state + transport position), while "Talk me through it" changes nothing and instead rings
the real controls Kevin should click; and a genuinely-wired per-stem 3-band EQ (req 7) via real
`BiquadFilterNode`s, so a demonstrated move is audibly real, not just pictured. Codex
three-touchpoint review run in full — TP1 (plan) surfaced 9 gaps (deterministic fixture, a
correctly-separated analysis/monitor audio graph, no fabricated dB claims, broader req-5
coverage, protecting the two Hope modes from ambiguity, layout) all addressed before building;
TP2 (diff, against the actual built file) surfaced further honesty/robustness gaps (paused
analysis reading stale "Live" values, `Math.random()` non-determinism, an unsupported "Low is
reading hot" diagnostic claim, several async races around stale `decodeAudioData` callbacks and
delayed Hope timers surviving a Reset, non-real `<button>` elements) — all fixed and independently
re-verified via a real headless-Chrome click-through (load demo → sync OK → play → live analysis
→ pause correctly drops to Idle, not stale → solo → exactly 1 stem isolated → suggestion card →
demonstrate → both tool-call audit lines + Undo correctly restores solo state → reset clears
everything); TP3 (end-to-end) found 4 further concrete issues (Undo not keyboard-accessible,
Undo not restoring transport position, `play()` never resuming a suspended `AudioContext`, Hope
directly mutating state instead of calling the same `toggleSolo()` the UI uses) — all fixed and
re-verified. `index.html` untouched throughout — this is a docs/mockups-only pass, no build
authorization. Pushed directly to `main` (mockups are design artifacts per `docs/CLAUDE.md`'s
standing process, not a branch this time) at commit `24e491e`. Review at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck.html` — Kevin reviews live
and gives explicit sign-off/redirect before any real build starts; Option A vs B (multi-stem
upload vs auto stem-split) also remains Kevin's call, unchanged by this mockup.

**2026-09-06 update — Hope-rail waveform saga CLOSED (build 2026-09-06.8), Kevin: "better - it will do for now":**
Final state after 4 rounds (3 blind, 1 source-verified) on the same live-call feedback thread
("no headroom, constantly large, no dynamics" → fixed for speaking; then "this should not happen
in an active chat" → the "listening" state needed its own fix too). What actually closed it:
cloned `begb0037admin/windows-mac-dictation` (PTT) directly and read its real `ui/app.js` instead
of continuing to guess from screenshots — PTT has NO separate "listening" state at all; its
"recording" state is ONE continuous state, always fed real mic RMS through the full-size aurora
rendering (idle shimmer even uses the SAME `paintBar(60,4)` size as active, per an explicit
historical Kevin PTT instruction: "use the active as the default in terms of size and bars" — the
AIMM port had drifted to a smaller `26px` idle without that being noticed until now). Also
confirmed directly in the pinned `@elevenlabs/client@0.1.7` SDK source that it exposes
`getInputVolume()` (identical `calculateVolume()` math to `getOutputVolume()`, reading the input
analyser instead) — nobody had checked for this in 3 prior rounds. Final fix: `HOPE_VOICE`'s
`currentMode` now switches `tick()` between sampling `getOutputVolume()` (speaking) and
`getInputVolume()` (listening — Kevin's own real mic input), both routed through the SAME
`feed()`/`feedReal()`/aurora-colour pipeline at the same `ACTIVE_BAR_MAX=60`, so listening shows
real audio, at full size, in the same colour spectrum as speaking — matching PTT's actual source
instead of three successive invented approximations (single fixed hue → full aurora sweep with a
synthetic breathing pattern → this). True pre/post-call standby (`IDLE_BAR_MAX=26`, mono chrome
shimmer) is UNTOUCHED throughout — confirmed fine as-is by Kevin. New standing lesson captured:
[[feedback_port_from_real_source_not_screenshots]] — clone the actual reference repo before
inventing a fix next time a similar "make it like X" report comes in. Commits `6a649fd` (diagnostic
logging, interim AGC target drop), `125ff25` (distinct listening state v1, single fixed hue),
`6aeb598` (v2, full aurora sweep), `dc4e1a2` (v3, real getInputVolume()-driven — the one that
stuck). All on `main`, pushed and live.

**2026-09-06 update — Markey: Hope-rail waveform AGC round 1 (`2026-09-06.3`, merged to `main`) did NOT work live, round 2 fix pushed:** Kevin live-tested the merged round-1 fix and reported "no change." Confirmed not a deploy/cache issue. Actual root cause: a conceptual flaw, not a code bug — `feedReal()`'s reference (`realRef`) was a same-signal EMA lagging `rms` by only 550ms, so `gain = target/realRef` self-cancelled within roughly a word, making output converge to a constant `target` regardless of absolute loudness (a compressor, not a VU meter). Round 2 replaces the single 550ms symmetric tau with an asymmetric attack (1500ms, rising toward louder) / release (4000ms, falling toward quieter) follower — both far slower than speech-level dynamics, so real loud/quiet contrast survives display instead of being normalized away, while still auto-leveling overall loudness across calls/turns. Hand-worked numerical example (quiet→LOUD→quiet) Codex-verified at both TP1 (plan) and TP2 (diff): LOUD reads `0.885-1.000`, QUIET-after-LOUD reads `0.613-0.698`, for the FULL duration of each segment. Merged to `main` this pass (was branch `markey-hopewave-gain-tune-2-work`) — Kevin's live listen is the remaining step, same as round 1. Full detail in the "R3 Mix Check full-layout" section below.

**2026-09-06 update — Fix Queue "Analysing…" stuck-placeholder bug FIXED, pushed pending merge:**
Confirmed Kevin's diagnosis was correct, with the exact root cause pinned down.
`MC_FIXMOVES.generate()` (the silent background call to Anthropic's API that populates the Fix
Queue card's "Recommended move" text) has an early-return guard for "no Anthropic key configured
/ nothing queued yet" that returned immediately WITHOUT ever applying the honest fallback text
("Ask Hope to talk through the move — she has it grounded in your reference library.") that the
same function's own `finally` block already used on a failed/unparseable API call — so
`movesById` stayed permanently empty for that path and the card patched with nothing, forever,
regardless of what Hope had already told Kevin verbally via her own separate `propose_mix_move`
tool. Fix: the early-return branch now applies that same fallback before returning. The deeper
gap — feeding Hope's live answer INTO the Fix Queue card directly — was investigated and found to
have no clean 1:1 mapping (`propose_mix_move`'s `bus` argument and the Fix Queue's `key`/
`focusBand` taxonomy don't correspond, and `propose_mix_move` has no `fix_id` unlike
`mark_fix_applied`); flagged as a follow-up UX/tooling decision for Kevin rather than guessed at.
Codex three-touchpoint review (TP1 plan / TP2 diff / TP3 end-to-end) all clean. Pushed to branch
`cat-fixqueue-stuck-placeholder-safety-net` off `main` @ `2c98bfd` (main has since moved on —
`markey-hopewave-gain-tune-2` merged after this branch was cut; rebasing/merging is the
coordinating session's call), build `2026-09-06.4`, NOT merged. Logged as ROADMAP.md item 33 /
DASHBOARD.html Now card 33. Per the priority reorder below, this correctly drops to low priority
relative to Backlog 22 now that it's shipped-to-branch.

**2026-09-06 update — Priority reorder (Kevin, explicit):** Backlog 22 (Multi-stem Mix Check)
bumped up — it's now the next thing to pick up. The Fix Queue "Analysing…" stuck-placeholder bug
fix (Cat was already mid-fix on it when this reorder came in — let to finish rather than stopped,
per Kevin's own call, since it was already running) is correspondingly dropped to low priority
once it lands; it's a real confirmed bug, just no longer urgent relative to Backlog 22.

**2026-09-06 update — Docs-only backlog capture, Glossary/Reference tab:** Kevin referenced
[iZotope's glossary of common and confusing mixing
terms](https://www.izotope.com/community/blog/a-glossary-of-common-and-confusing-mixing-terms) as
scope/structure inspiration — checked directly (WebFetch), roughly 30 "confusing" + 50 "common"
terms with short practical definitions; AIMM needs its own written content, not a copy. Captured as
new **Backlog 32**: a visible Glossary/Reference tab Kevin can browse (taking the nav slot freed up
when the Conversation tab was retired, not a literal revival), plus Hope drawing on the same
glossary in conversation ("Hope can use this when explaining e.g. muddy," grounding terms in real
definitions instead of using them loosely). Explicit cross-reference to Backlog 31 (logged in the
same pass, below): 31's term-to-frequency vocabulary map IS 32's audio-diagnostic subset — not
duplicated, 31 seeds it. Implementation consideration flagged for later, not decided now: Hope's
side could reuse whatever compact-digest mechanism Markey builds for the YouTube KB (Backlog 24).
Not prioritized ahead of Backlog 24/25 or 22. `index.html` untouched — docs-only, no build
authorization. Codex three-touchpoint review clean. Same branch as the frequency-solo capture below:
`docs-roadmap-capture-freq-solo-2026-09-06`.

**2026-09-06 update — Docs-only backlog capture, frequency-range solo / ear-training mode:**
Kevin called this "a must-have feature for stems," inspired by [Carve Audio's "Mixing Cheat
Sheet"](https://www.audioloom.com/carve-audio/mixing-cheat-sheet) (free plugin — direct
inspiration for the solo-to-hear mechanic only, not something to copy exactly). Captured as new
**Backlog 31**: let the user (or Hope, once her control tools exist) solo/isolate a specific
frequency range of the loaded audio — or, once stems exist, a specific stem's frequency range — so
it's audible in isolation, not just shown as a number/chart, paired with a vocabulary layer mapping
frequency ranges to named mix problems (muddy, boxy, harsh, sibilant, boomy, thin, nasal, hissy) so
Hope can name the actual problem and let the user hear it, not just report a delta number. Kevin's
framing: "the more Hope can point us to the issue... the better she can help to really improve a
mix." Explicit cross-reference: this is a direct extension of Backlog 22 (Multi-stem Mix Check) —
it's what Backlog 22's requirement 6 ("demonstrate and instruct" / "let me show you") would
actually demonstrate, and shares DSP work with requirement 7 (basic live EQ). **Not prioritized
ahead of Backlog 24/25 or Backlog 22** — sequenced as an extension of those once they exist, per
Kevin's explicit instruction. Verified before capture: re-checked `docs/ROADMAP.md` and
`DASHBOARD.html` directly against `main` to confirm 30 was the highest existing backlog ID (item 31
is next-free) and to confirm a pre-existing numbering mismatch — the "Multi-stem Mix Check" section
in `docs/ROADMAP.md` has no numeric prefix even though `DASHBOARD.html` labels it Backlog 22; noted
inline rather than silently assumed. `index.html` untouched — docs-only capture, no build
authorization. Codex three-touchpoint review clean. Branch:
`docs-roadmap-capture-freq-solo-2026-09-06`.

**2026-09-05 update — Docs-only backlog capture, loudness/reference-track investigation:**
Investigated Kevin's report that Mix Check's Audio Specs "Classified Genre" reading seemed stuck on
Trap. Found three separate, confusingly-similar loudness/genre-target controls in the live
`index.html` (Genre pill — works correctly; Target pill — confirmed broken/dormant hardcode; Spectral
Balance's own "Target" dropdown — works but synthetic-corridor only, not a real reference track). Full
finding recorded as a standing note in `docs/ROADMAP.md` (not an action item) so it isn't re-explored
as unknown territory. Kevin then referenced loudnesspenalty.com and iZotope's reference-track mixing
guidance, reframing two backlog items: **Backlog 29** (revive + expand the dormant Platform Loudness
Comparison table to show every platform at once, fix the underlying hardcode — awaiting a Jules
mockup, not "not started") and **Backlog 30** (real reference-track A/B comparison for Spectral
Balance — updates the existing P-B/B-P2 "A/B Ref tab" item, not a duplicate). Both explicitly queued
by Kevin behind Hope's intelligence work (Backlog 24/25) — captured now so the insight isn't lost, not
prioritized ahead of it. `index.html` untouched — docs-only capture, no build authorization.
Codex three-touchpoint review clean. Branch: `docs-roadmap-capture-loudness-refab-2026-09-05`.

**2026-09-05 update — KB ingestion, "That Logic Pro Guy" (20 videos):** Following `docs/INGEST.md`
Path B, curated the top 20 videos from `@thatlogicproguy` (6.53k subs, 145 videos, concrete
Logic Pro workflow/UI/mixing-technique content) for trap/hip-hop relevance and general production
technique — Kevin approved the curated list before ingestion. Ran the batch `ingest` command
directly (VPN on, Kevin confirmed). **Caught and fixed two real bugs during this run, not just
ingested blindly:** (1) `youtube-transcript-api` wasn't installed for the Python `ingest_yt.py`
actually runs under — installed, all 20 transcripts then fetched cleanly. (2) `fetch_video_title()`
silently falls back to the video ID as the title when its `import yt_dlp` fails — that module
wasn't installed for the same interpreter either (only the separate `yt-dlp` CLI was), so all 20
entries were first written with the raw video ID as their title (e.g. `"GJclT90IhPM"` instead of
the real title). Installed `yt-dlp` for the correct interpreter, verified title-fetch works, then
re-fetched and patched the real titles into both `docs/knowledge/index.json` and the 20 markdown
files' frontmatter/heading (did not need to re-fetch transcripts, only titles). KB now at **353
videos** (was 333). `fetch_video_title()`'s bare `except Exception: return video_id` still silently
swallows errors going forward — worth hardening in a future pass so a broken title-fetch surfaces
loudly instead of silently degrading citations again, but not blocking on that now since the
underlying environment cause (missing module) is fixed. **Follow-up same day:** the other three
candidate channels were also curated and ingested with Kevin's approval — TheModernCreative (20
of 593, technique-focused subset, channel otherwise skews plugin-review/gear-comparison),
Make Your Music (20 of 91, strong finishing-discipline + Logic Pro mixing content), Radium
Records (13 of 20 curated — the other 7, a "Mixing Masterclass" series, are paywalled behind a
paid channel membership tier and not publicly scrapable, confirmed via a genuine
`VideoUnplayable` error, not a pipeline bug). **KB now at 406 videos** (was 333 at session start).

Last updated: 2026-09-06 (Cat, docs-only backlog capture — Backlog 31 and 32 added, see updates above). Current reality: the 2026-09-02 Mix Check feedback round — items
1–15 (16 folded into 15), 17, 18, 20 — is **SHIPPED & LIVE on `main` @ `e9bcd8a`, build
`2026-09-02.15`**. Docs were reconciled the same day in a docs-only commit, `main` @ `4424590`,
then a further docs-only pass added the DASHBOARD.html hard-sync rule to `docs/CLAUDE.md`,
bringing `main`'s HEAD to **`ced9e6cf1`** (still `index.html` build `2026-09-02.15` — that commit
was docs/CLAUDE.md only). The still-open queue from the 2026-09-02 round (Backlog 9–14 / feedback
#21, #22, #19, #3, #6 + a default-tab change) is tracked in `docs/ROADMAP.md` → "Mix Check redesign
— outstanding feedback queue" and mirrored as DASHBOARD.html Backlog cards 9–14 (owners: mostly
Markey, one Cat item — #13 default tab, one Cat-builds/Jules-specs item — #9).

**In flight (not yet merged):** branch `mixcheck-audiospecs-label-align` @ `05eb0362` off `main`
@ `ced9e6cf1` — fixes the Audio Specs card label-wrap misalignment ("LUFS short-term" / "Phase /
correlation" rows), build `2026-09-04.1`. Codex 3-touchpoint review clean (TP2 caught one CSS
comment accuracy issue, fixed and re-verified). Pushed for Kevin's review/merge — not on `main`
yet.

**New backlog capture 2026-09-04** (not started, no build authorization yet): "Multi-stem Mix
Check" — DASHBOARD.html Backlog card 22 / `docs/ROADMAP.md` → "Multi-stem Mix Check — stem upload
/ auto-split so Hope can see per-element measurements". Full requirement set (sync, UI, live
reactive analysis, Hope-awareness, transport/stem control tools, demonstrate-and-instruct, basic
live EQ) captured from a live conversation with Kevin; next step is a Jules interactive mockup, not
implementation.

DASHBOARD.html is Kevin's working source of truth for planning; its "Now" section's 4 legacy P1
cards (P-C/P-B/P-K2/P-E, carried over from the 2026-05/06 Session-6 priorities) were corrected in
place 2026-09-04 rather than removed: P-C (Retire Repair tab) was actually already shipped
2026-06-04 (`620f708`) and is now marked done there; P-B/P-K2/P-E are confirmed not started and not
currently in flight, marked accordingly — none of the four represent active work. See
`docs/HANDOVER.md` top entry for the full correction record.

**2026-09-05 update (Markey):** Backlog item 12 (feedback #3 — Hope tab-awareness verify +
persisted-history fix) is done and **pushed pending merge**, not backlog anymore. Root cause:
the 9797772 instruction fix (RETIRED SURFACES / "never ask" rule in `buildAppKnowledgeDigest`/
`RT_INSTRUCTIONS`) was correct, but a user's pre-fix persisted chat history under
`AICHAT_HISTORY_KEY` (`trapMasterAiChatHistory_v1`) could still replay old contaminated turns on
page load. Fixed by bumping the key to `_v2` (old key orphaned, not migrated) plus, as a
defense-in-depth fold-in from Codex review, bumping `EL_LAST_CALL_KEY`
(`aiMixMastersLastCall_v1 → _v2`, the 30-min voice-call continuity cache, same contamination
path). Live-verified headless against a real HTTP origin: old key seeded with contaminated
history is ignored on reload, new turns persist only under the new keys, the 9797772 instruction
text confirmed unregressed. Codex 3-touchpoint review (plan / diff / end-to-end) all clean. Not
independently verified: a live Anthropic/ElevenLabs round-trip (no API key available in the
review sandbox) — the mechanism-level fix is proven directly instead, per the card's own verify
steps. Branch `markey-hope-history-key-bump` @ `f8cb2b6`, off `main` @ `ced9e6cf1`,
`AIMM_BUILD 2026-09-05.1`, pushed, **NOT merged** (Kevin merges).

**New backlog capture 2026-09-05** (docs-only, no build authorization, no priority reordering
beyond what's explicitly noted below): six items captured from a live session with Kevin, mirrored
in `docs/ROADMAP.md` and DASHBOARD.html Backlog cards 23–28.

- **Competitive context (attached to Backlog 22, Multi-stem Mix Check, not a new item):** a live
  competitor already ships paid AI stem-splitting, a scored mix-history library with
  compare-versions, a "Tools" marketplace, and a locked Reference-track A/B feature. Kevin's read:
  their structure is generic/replicable — AIMM's differentiator has to be Hope actually being
  intelligent, not matching their feature checklist.
- **Backlog 23 — Library reorganization** (LOWER PRIORITY, explicitly deprioritized behind
  Hope-intelligence work below): sub-sections analogous to the competitor's — scored history (ties
  to Snapshots, needs reconciling), Tools (deferred, new scope — no processing-tools feature exists
  in AIMM today), Stems (ties to Backlog 22), References (ties to ROADMAP P-B / DASHBOARD B-P2).
- **Backlog 24 — Hope DAW-specific instruction quality** (achievable soon): Hope should name actual
  Logic Pro UI elements/steps, not generic mixing language — confirmed 33 of 333 ingested KB videos
  are Logic-Pro-specific. Gated on two existing DASHBOARD Now/P2 cards now **elevated to P1**:
  "Smoke test: YouTube KB hits" and "YouTube citation links" — neither confirmed working
  end-to-end yet.
- **Backlog 25 — Hope actually driving/controlling Logic Pro** (bigger, unscoped): ties to
  B-DAW1/2/3. Real caveat logged explicitly and folded into B-DAW1's own description: Logic Pro has
  no rich public scripting/automation API like some DAWs — needs a technical research spike
  (AppleScript hooks, MIDI/OSC control surfaces) before any build estimate.
- **Backlog 26 — Mix Check first-run onboarding, pending Kevin's decision** (design work exists,
  not "not started"): Jules built v1 (`jules-mixcheck-empty-state` — lightweight greeting + chips +
  1-2-3 strip) and v2 (`jules-mixcheck-firstrun-tour` — full 5-step guided tour) mockups. Kevin
  hasn't reviewed/chosen yet. **Separately, being built live right now by Markey (not on this
  backlog list, not "not started"):** the Hope-rail greeting-message piece specifically, extracted
  from v1 — Kevin's call, "there's nothing stopping us, it's a quick win."
- **Backlog 27 — "1-2-3 guide" onboarding strip** (deferred, separate future stage): the
  "① Drop → ② Measure → ③ Ask Hope" strip from v1, explicitly not bundled into whichever onboarding
  direction Backlog 26 resolves to.
- **Backlog 28 — Spectral Balance card, revisit** (deprioritized, vague placeholder): Kevin flagged
  interest, no specifics given; Hope-intelligence work (24/25) matters more right now.

**2026-09-05 correction round (Markey, same branch, commit `d492eb1`, `AIMM_BUILD 2026-09-05.2`):**
Kevin reviewed the above and gave three corrections:
1. Confirmed the Insight tab was never actually named in the RETIRED SURFACES list — only "an
   Insight note" (as a fix source) was disclaimed there, distinct from the Insight tab itself,
   which was always described elsewhere as a real, active tab. Nothing to remove; added an
   explicit "NOT retired" clarifier to prevent future ambiguity.
2. Retired the standalone **Conversation tab** for real, since Hope's chat is now a persistent
   rail docked on every tab: removed the nav button + default-active markup (Mix Check `#eq` is
   the new default-active tab+panel, which also resolves backlog item 13 as a forced side effect,
   including an on-load init fix — `eqGridInit()`/`window.refTargetChanged()` — so Mix Check is
   fully live without requiring a manual first click); updated Hope's own instructions
   (`buildAppKnowledgeDigest()` — both the tour list AND a second "full inventory" appendix
   section Codex TP1 found I'd missed — and `RT_INSTRUCTIONS`) so she never offers to switch
   there; removed `voice` from the `switch_tab` tool's enum and its case-handler VALID list;
   removed the now-dead `TAB_DISPLAY_NAMES.voice`/`TAB_PURPOSES.voice` entries; fixed a
   legacy-but-still-wired Troubleshooter handoff handler (Codex TP1 catch) that force-activated
   the retired panel directly; fixed several genuinely user-visible strings (tip-boxes, toasts,
   empty states, tooltips) referencing "the Conversation tab"/"the Hope tab" as a destination.
   **Investigated the mobile collapse-fallback mechanism FIRST, per Kevin's explicit caveat**,
   before removing anything: confirmed live (headless Chrome, 390×844 mobile viewport) that
   `#voice`'s DOM node (kept in place, just never `.active`/nav-reachable) is still the exact
   attachment point the rail re-parents `.aichat-layout` into when "closed" below the 1024px
   breakpoint, and that the floating `#railReopen` button (position:fixed, not scoped to any tab)
   already opens the chat overlay from any tab regardless of Conversation's existence — switched
   to the Workbench tab, tapped reopen, chat opened correctly; collapsed again, correctly
   re-parented back to `#voice` immediately before `#aichatHome`. No mobile regression.
3. Tab-strip must not shrink when Conversation is removed. Confirmed no CSS change needed:
   `.tabs.oz-tabstrip .tab.oz-tab{flex:1 1 0}` is already global (R3 round 15). Measured live
   before (pristine `main` @ `ced9e6cf1`) vs after: strip `left:16 right:1088 width:1072` in BOTH
   states — identical — 9 tabs @ ~115-117px each before, 8 tabs @ ~130-132px each after.
   Screenshots taken of both states for visual confirmation.

Codex 3-touchpoint review ran across both rounds; the correction round's TP1 (plan-confirmation)
found the real gaps listed above (all folded in, none dropped), TP2 (diff review) and TP3
(end-to-end incl. the live render results) both came back clean. One **pre-existing, unrelated**
issue flagged non-blocking by TP3: ~9 toast/status strings across the file already said "add a
key on the Hope tab" before this change, even though those keys live in Settings — not caused or
worsened by this correction, left untouched to avoid scope creep (candidate for a separate,
small follow-up ticket). Branch `markey-hope-history-key-bump` @ `d492eb1`, off `main` @
`ced9e6cf1` (confirmed unchanged throughout both rounds), `AIMM_BUILD 2026-09-05.2`, pushed,
**NOT merged** (Kevin merges).

## Workstream status

| Workstream | Status | Notes |
|---|---|---|
| Project OS setup | SHIPPED | Committed, pushed |
| GitHub repo rename | SHIPPED | github.com/begb0037admin/aimm live |
| Hope Knowledge Base — wiring | SHIPPED | Smoke tested, KB hitting correctly |
| Hope Knowledge Base — .nojekyll fix | SHIPPED | Transcript files now serve on GitHub Pages |
| Hope Knowledge Base — trigger fix | SHIPPED | buildResearchDigest early-exit fixed |
| Hope Knowledge Base — topic index | SHIPPED | 28 topics mapped to video_ids in RT_INSTRUCTIONS |
| Hope Knowledge Base — ingestion | IN PROGRESS | 333 videos ingested (+92 Mix With The Masters 2026-06-17: Jaycen Joshua, Leslie Brathwaite, Bainz, Illangelo, Teezio, Anthony Kilhoffer, Young Guru, Boi-1da, Rodney Jerkins, Timbaland, Stuart White, Ben Baptie, Tom Elmhirst, Josh Gudwin, Neal Pogue, Finneas, others; 17 failed — no transcript/age-restricted). Logic Pro & DAW Training tier next (14 channels). |
| YouTube citation links | PLANNED — **elevated to P1 2026-09-05** | Hope cites title/channel but no clickable URL yet; gates Backlog 24 (Hope DAW-specific instruction quality) |
| Ingest tooling | SHIPPED | ~/bin/ingest + Ingest Video.command + docs/INGEST.md |
| **Reference tab rebuild** | **SHIPPED** | WAV drop + transport + meter dashboard + spectral analyser + loudness tables. Committed 4be7200, live on GitHub Pages. |
| **Mix Check tab (P-A)** | **SHIPPED 2026-06-04** | Renamed Reference→Mix Check; threshold-driven troubleshooter pills from WAV analysis + manual input overrides. Commit a3d96ba. Superseded by the R3 Mix Check full-layout redesign (row below). |
| **R3 Mix Check full layout** | **PROMOTED & LIVE on `main` @ `dbc793d` (build 2026-09-01.9), 2026-09-01. Post-ship fix round CLOSED 2026-09-02 — feedback items 1–15 (16 folded into 15), 17, 18, 20 SHIPPED & LIVE on `main` @ `e9bcd8a` (build 2026-09-02.15). Docs reconciled `main` @ `4424590` (2026-09-04). Still-open queue (Backlog 9–14 / feedback #21, #22, #19, #3, #6 + default-tab) tracked in `docs/ROADMAP.md` — nothing currently mid-build.** | First R3 tab rebuilt mockup→live to Jules mockup `05-r3-mixcheck-full-layout.html` @ `8c2785e`. Grid shell + de-pinned transport; single `Drop / browse WAV ▾` input + brand wordmark; Audio Specs panel absorbing the 4 meter cards (RMS/Crest/LRA/noise-floor DSP, Tempo via web-audio-beat-detector, in-browser chroma Key, TEMPO/KEY headline tiles, stereo-width meter, SSL-style band deviation meters); context banner; Fix Queue with the `window.mcFixQueue` contract + `aimm:analysis-complete` event (replaces the 6 Mix Issues pills); transport waveform; `#hopeRail` full-height grid item with a speech-tied meter; Hope transcript mix-breakdown + live action-item cards + `mark_fix_applied` tool (Markey). Codex TP1 approve-with-notes (folded), per-step TP2 clean, TP3 end-to-end complete (no blockers). Gate 1 + Gate 2 Kevin-approved 2026-09-01; PROMOTED to `main` via Kevin's PowerShell ff-only merge 2026-09-01 (`main` @ `dbc793d`, live). Durable record: `docs/HANDOVER-r3-mixcheck.md`; post-ship fix round: `docs/HANDOVER.md`. Deferred/residual items listed below. **Post-fix follow-up (header re-layout, tab strip full-width + taller, Genre/Target/Settings → title row, WAV loader → transport bar) shipped as part of the 2026-09-02 feedback round above — no longer awaiting review.** |
| **A/B Ref tab (P-B)** | **PLANNED** | New tab: two drop zones, overlaid spectral curves, delta meters, Hope commentary. Spec in docs/ROADMAP.md. Mockup: docs/mockups/ab-ref.html |
| **Retire Repair tab (P-C)** | **PLANNED** | Remove Repair tab once P-A ships; slot freed for P-B. ~1 hr. |
| **Hope's sphere (P-D)** | **PLANNED** | Animated particle orb replaces floating mic button. Idle/listening/speaking/thinking states. Mockup: docs/mockups/hope-sphere.html |
| **Hope tools for Mix Check + A/B Ref (P-E)** | **PLANNED** | get_mix_check_state, set_meter_value, get_ab_ref_state client tools. Depends on P-A + P-B. |
| **Cloudflare Worker key relay** | **SHIPPED** | Merged PR #1 (`a533ed3`), live. Worker deployed at aimm-proxy.kevinlelitte.workers.dev, secrets set, `/health` verified green. Zero Settings entry on any device. |
| **Voice session stacking fix + spacebar-only** | **SHIPPED 2026-06-11** | Root cause: elEnd during connect orphaned the in-flight session. Session registry + endRequested + ending lock + 600ms space cooldown; mouse call control removed per 2026-06-04 brief. Sphere = drag only. |
| **open_dashboard + capture fixes** | **SHIPPED 2026-06-11** | Dashboard now opens in in-app overlay (popup blocker killed the old new-tab path); relative URL fixes localStorage origin; capture dedup reads docs/ROADMAP.md; captures toast on success. |
| **open_dashboard root cause (round 2)** | **SHIPPED 2026-06-11** | Tool was registered on EL side but MISSING from TOOL_DEFS → no client handler → 30s timeout → "isn't connecting". Added. Also: read_doc remaps to active docs (ROADMAP.md→docs/ROADMAP.md, CLAUDE.md→docs/HANDOVER.md); elEnd paints instant "Ending…" feedback. |
| **Build stamp + panic button** | **SHIPPED 2026-06-11** | `AIMM_BUILD` const + bottom-right badge (bump every index.html commit — hard rule in docs/CLAUDE.md); pagehide handler explicitly endSession()s every live Hope session so closing the tab always stops billing instantly. Build `2026-06-11.4`. |
| **Durable captures store** | **SHIPPED 2026-06-11** | `/captures` on aimm-proxy Worker (Workers KV, binding `AIMM_KV`); app + DASHBOARD sync with localStorage fallback. Kev one-time setup: KV namespace + binding + re-paste worker code (`worker/README.md`). |
| **Dashboard opens in new tab** | **SHIPPED 2026-06-11** | window.open first (needs one-time pop-up allow for the site), overlay only as fallback. Build 2026-06-11.5. |
| **Hope dashboard sight + inbox autonomy** | **SHIPPED 2026-06-11** | read_doc DASHBOARD.html → live digest (inbox + roadmap); new manage_roadmap_inbox tool (list/remove/promote/edit, live overlay refresh). Kev one-time: Settings → "Register dashboard-inbox tool", then fresh call. Build 2026-06-11.6. |
| **Double-tap orb call control (iPad)** | **SHIPPED 2026-06-11** | Double-tap (2 non-drag taps ≤450ms) toggles the call via the same guarded path as spacebar; first tap arms (orb flash). Build 2026-06-11.7. |
| **Mix Check meter accuracy (BS.1770-4)** | **SHIPPED 2026-06-11** | Real K-weighted gated LUFS + 4× oversampled true peak + PLR; validated vs reference signals (−18dBFS 997Hz → −18.00 LUFS exact). Was raw RMS/sample-peak. Build 2026-06-11.8. |
| **Live input metering** | **SHIPPED 2026-06-11** | "or meter live" bar: input device (BlackHole = DAW feed) or tab-audio capture; streaming BS.1770 + max-hold TP; Stop locks readings. Validated −18.00/−18.00 on simulated stream. Build 2026-06-11.9. |
| **Tonal Balance-style spectral display** | **SHIPPED 2026-06-11** | Genre target corridor + normalised smoothed 64-pt curve (8192 FFT) + whole-file average spectrum at load + graphite restyle. Target selector follows workbench genre. Build 2026-06-11.10. |
| **Mix Move cards (Mixio steal #1)** | **SHIPPED 2026-06-11** | propose_mix_move tool → structured card (plugin/move/why/confidence) + Apply button (adds plugin + pins settings). Kev: re-click the Settings register button, fresh call. Build 2026-06-11.11. |
| **Bus snapshot overlay (Mixio steal #2)** | **PLANNED** | Solo a bus → capture curve via live metering → overlay colours on the corridor display. Spec in docs/ROADMAP.md P-K2. |
| **Full-page redesign — R3 per-tab rollout** | **Mix Check tab PROMOTED & LIVE on `main` @ `dbc793d` (build 2026-09-01.9) 2026-09-01, plus the full 2026-09-02 feedback round on top (`main` @ `e9bcd8a`, build 2026-09-02.15); other tabs still to do** | The R3 Mix Check full-layout redesign (see the dedicated row above) is the first R3 tab taken mockup→live to a real working build against Jules mockup `05-r3-mixcheck-full-layout.html` @ `8c2785e`. Gate 1 + Gate 2 Kevin-approved 2026-09-01 @ `256cae8`; the PowerShell `git merge --ff-only` promote of `main` was run by Kevin 2026-09-01 (`main` @ `dbc793d`). The 2026 rounds 1–5 screenshot-rebuild history and the `r3-preview` branch (`https://raw.githack.com/begb0037admin/aimm/r3-preview/index.html`) are **superseded** by this build. Still to do: the rest of the R3 per-tab redesign — Workbench, Library, Insight, Snapshots, Settings, Marketing, Community, Conversation. Epic not fully settled (still blocks the Hope→Mia rename — see docs/ROADMAP.md). |
| **Hope chat rail (static on every page)** | **SHIPPED 2026-06-11** | #hopeRail docks .aichat-layout on the right of every tab (Mixio-style); collapse returns it to the Conversation tab; persisted. Build 2026-06-11.13. |
| DAW Bridge Epic | PLANNED | 3 phases scoped, not started |
| iPad PWA | PLANNED | Not started |
| Branch consolidation | PLANNED | Consolidate voice-elevenlabs into main only |
| **Platform Evolution Epic** | **PLANNED — decision locked 2026-06-23** | AIMM evolves from single-file to hosted, login-based web app. No install ever. 3 staged arches: ARCH-1 (Cloudflare Worker + R2 + auth), ARCH-2 (RoEx-style analysis via Python/Librosa microservice), ARCH-3 (HyFi-style AI online mastering). Spec in docs/ROADMAP.md. Cards in DASHBOARD.html. |

## R3 Mix Check full-layout — deferred & accepted residuals (as of build 2026-09-01.9)

**Deferred to the analyst phase (tracked, not bugs — logged as Backlog 6/7 in ROADMAP.md + DASHBOARD.html):**

- **Audio Specs "with full analysis" placeholders** — Subgenre / Production style / Energy / Mood / Dissonance render as placeholder rows with a neutral dot; real detected values need the deferred server-side analysis phase (Platform Evolution ARCH-2 territory). Placeholders by design.
- **Transport waveform INTRO / VERSE / BRIDGE / VERSE sections** are fixed cosmetic proportional layers, not detected from the audio. Real arrangement detection (SSM / novelty / energy segmentation) is an analyst-phase job, explicitly deferred in the build's locked decisions.
- **Markey's Hope-rail speaking-meter real-amplitude gain — round 1 (`markey-hopewave-gain-tune`, build 2026-09-06.3) DID NOT WORK LIVE; round 2 fix on `markey-hopewave-gain-tune-2-work` (build 2026-09-06.4), NOT YET MERGED, Kevin's live confirmation still pending.** Was originally a flat `getOutputVolume() * 18` (docs previously said `× 11` — that was stale; the live code was `× 18`) copied verbatim from PTT's mic-RMS curve. Kevin's live-call feedback confirmed the predicted symptom (constantly large, no headroom/dynamics). Root cause of the ORIGINAL bug confirmed by reading the pinned `@elevenlabs/client@0.1.7` dist source directly: `getOutputVolume()` is `calculateVolume(getOutputByteFrequencyData())`, structurally not the same signal domain as PTT's time-domain mic RMS. Round 1's fix (`feedReal()`/`resetRealPeak()` in `HOPE_WAVE`, merged to `main` at `20c9384`) replaced the flat multiplier with a `REAL_REF_TARGET=0.62` / `REAL_REF_TAU_MS=550` single-tau EMA reference, passed Codex TP2 round 5 approval on numerically-verified AGC behavior — **but Kevin live-tested it and reported "no change."** Confirmed NOT a deploy/caching issue (live site was serving `2026-09-06.3`'s actual code). Real root cause, found on re-reading the design itself: `realRef` was a same-signal EMA of `rms` lagging by only ~550ms — since word/sentence-level loudness changes happen on that timescale or slower, `gain = target/realRef` converged so `rms*gain -> target` almost immediately regardless of absolute loudness. That's a textbook compressor (removes dynamic range); a VU-meter-style visualization needs the opposite (reveal dynamic range). The code was doing exactly what an AGC/compressor is supposed to do — the wrong tool for this job, and a design-intent bug Codex's correctness-focused review didn't catch. **Round 2 fix (this update):** `realRef` is now an ASYMMETRIC attack/release follower — climbs toward a new LOUDER rms over `REAL_REF_ATTACK_TAU_MS=1500`ms, falls toward a new QUIETER rms over `REAL_REF_RELEASE_TAU_MS=4000`ms — both far slower than word/phrase-level speech dynamics (~0.3-1s), so within any single loud or quiet passage the reference does not catch up before the passage ends. Hand-worked and Codex-verified (TP1 + TP2, both PASS): a quiet(0.30)->LOUD(0.75) 2s->quiet(0.30) 3s sequence reads `0.885-1.000` throughout the LOUD segment and `0.613-0.698` throughout the following QUIET segment — a persistent ~0.2-0.4 gap for the FULL segment duration, not just a brief attack transition; even a single ~400ms loud word spikes to `1.000` against a ~0.73-0.75 quiet floor right after. Reasoned through with hand arithmetic + Codex review rather than a live console.log round-trip with Kevin, to avoid a third blind guess without first fixing the fundamental self-cancellation flaw — if this ALSO reads as "no change" live, the next step is the console.log-behind-a-dev-flag capture this round skipped. **Still open:** Kevin's own live listen is the confirmation step, same as round 1 — this round has NOT been live-tested yet.

**Accepted Gate-2 residuals (Kevin signed off 2026-09-01 with these known — logged as Backlog 8):**

- A. Empty (no-WAV) state — Audio Specs column runs well below the shorter empty analyser card before the columns bottom-align; matching the empty analyser height is a separate grid tweak.
- B. Very hot bands peg at the ±6 dB edge of the deviation meter (e.g. LOW +11 shows at the edge); the signed value above carries the true number.
- C. Stereo-width meter is a 1:1 %→track map; typical masters (~25–40%) sit left of centre; could switch to a compressed scale.
- D. RESOLVED 2026-09-06, build `2026-09-06.8` (`dc4e1a2`) — Kevin: "better - it will do for now." Took 4 rounds; the one that stuck came from reading PTT's actual source directly rather than guessing further. See the top-of-file entry for full detail.
- E. Speaker button in the composer has no effect with no call live (arms the mute preference); could show a disabled state.
- F. PRE-EXISTING: empty-state analyser hint text overlaps the "Low / Low-Mid / High-Mid / High" axis labels — long-standing, not introduced by R3, still present.

## Last known good state

- index.html on `main`: v4 redesign live — build 2026-06-18.3 (3-column layout, canvas orb, ribbon waveform). **Unchanged this round — confirmed `git diff main r3-preview -- index.html` before push.**
- index.html on `r3-preview` (branch, NOT merged): round-5 MixCheck rebuild, build 2026-08-17.1, commit `433888d`. **Superseded by `r3-mixcheck-codex` below — do not use for sign-off.**
- index.html on `main` @ `dbc793d`: R3 Mix Check full-layout redesign, build 2026-09-01.9 (merged ff-only from `r3-mixcheck-codev` @ `256cae8`). Gate 1 + Gate 2 Kevin-approved 2026-09-01; Codex TP3 end-to-end clean; PROMOTED & LIVE 2026-09-01. Durable record: `docs/HANDOVER-r3-mixcheck.md`; post-ship fixes: `docs/HANDOVER.md`.
- index.html on `main` @ `e9bcd8a` (build 2026-09-02.15): the 2026-09-02 Mix Check feedback round fully shipped on top of `dbc793d` — header re-layout, Hope-rail pass, Fix Queue + transport batch, transcript layout, `#hopeWave` PTT port, viewport-fit density, page gutter, Fix Queue "production line" (queue side + Hope side). **This is the current live index.html on `main`.**
- `main` HEAD as of 2026-09-04 is `4424590` — one docs-only commit on top of `e9bcd8a` (DASHBOARD.html + docs/ROADMAP.md, no index.html/build change) reconciling the feedback round into Recently Shipped and queuing Backlog 9–14.
- `main` HEAD confirmed live 2026-09-05 (Markey, at dispatch time) is `ced9e6cf1`, unchanged when this branch was pushed.
- index.html on branch `markey-hope-history-key-bump` @ `f8cb2b6` (off `main` @ `ced9e6cf1`): item 12 fix (`AICHAT_HISTORY_KEY`/`EL_LAST_CALL_KEY` → `_v2`), build `2026-09-05.1`. Pushed, **NOT merged**.
- Tag pre-v4-redesign: full pre-v4 app preserved for instant revert
- docs/knowledge/index.json: 333 videos (+92 Mix With The Masters, 2026-06-17)
- ~/bin/ingest: installed and smoke tested
- Both branches: 4be7200 (voice-elevenlabs and main both at this commit)
- GitHub Pages: live — https://begb0037admin.github.io/aimm/ (still serving `main`, untouched)
- Round 3/4 screenshot-only review pages (mixcheck-r3-review.html / -v2.html / -v3.html) are superseded by the round-5 live build above — don't use them for sign-off.

## Session 6 start priorities (2026-05-26)

P-A → P-C → P-B → P-D → P-E (in that order, each depends on prior)
Effort total: ~12.5 hours across all five items.
Start with P-A (Mix Check) — smallest risk, highest immediate value.

## PluginHub latest progress — 2026-10-25 08:10 UTC

WebAuthn registration setup is implemented in the non-production API/account preview. Tests cover CSRF, same-account cross-session rejection, challenge expiry/replay, required user verification configuration, cleanup and migration recovery. `npm test` passed 31/31 and the full local Worker/D1/companion check passed. A real authenticator and passkey assertion flow are not verified. Remote provider runtime, cross-account and recovery proof, live Mac/site parity, remaining Stage 2–5 work and fresh independent review remain open. Foundation is **NOT MET** and Stage 6 remains gated. [Evidence report](../governance/evidence/PHASE_PLUGINHUB_WEBAUTHN_REGISTRATION_20261025.md) (commit 1fa7ade641e1662d4099e49e75a549d60dfd2a3b, blob 091f308c0d4fff6084aa5cc7216b4a6d1b668b98); [closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) (commit a3db765ebd2316e457d7b48080ffa4cfd1f643b0, blob 0a97ff0f03a7c3eb95a3e685af2b6b0a8a23705e). No project D1 write, deployment or cutover.

## PluginHub latest progress — 2026-10-25 08:15 UTC

Passkey registration and assertion setup now exist in the non-production API and account preview. The assertion confirms the signed-in owner session; it does not authorize file actions yet. Local verification passed with 32/32 API/browser tests and the full companion/Worker/D1 check. No real authenticator was used. Remote provider runtime, cross-account and recovery proof, live Mac parity, exact action-preview authorization, remaining Stage 2–5 work and fresh independent review remain open. Foundation **NOT MET**; Stage 6 gated. [Evidence](../governance/evidence/PHASE_PLUGINHUB_WEBAUTHN_ASSERTION_20261025.md) (commit 51bbc7355edec5ebe539253d484f07c5518c9e71, blob fce7b3911f0b7b07b5078db3a6848189a57c02ee); [closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) (commit 08839ce0bcf381d1a6f057cd3db2864a3b43ae64, blob 3a7ef5fa5a7b9125b7de917cf236c6a7e8b4447e). No project D1 write, deployment or cutover.

## PluginHub latest progress — 2026-10-25 08:15 UTC

The API and paired companion now agree on Valhalla DSP's fixed vendor-site action routes. The route preview and queue are covered by tests; the Mac still opens a fixed official vendor page only after the local user presses the action button. No installer is downloaded. `npm test` passed 32/32 and the full local suite passed. [Evidence](../governance/evidence/PHASE_PLUGINHUB_STAGE5_VALHALLA_VENDOR_SITE_20261025.md) (commit cf87e68338eecc19247f7c0f0f3fa45b2b802806, blob 24d2e824ac1b7dc39e3f28ebea9db29dac133f1b); [closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) (commit fc4ab35444ce590f76c6e9658a98475b4c03d8d4, blob f476a7ef6dca2b2488db1ba2f2ab75c168987518). Foundation remains **NOT MET**, Stage 6 gated; remote runtime/isolation/recovery, exact action security, real Mac parity, remaining Stage 2–5 work and fresh independent review remain open. No remote D1 write, deployment or cutover.

## Stage 5 route verification — 2026-10-25 08:17 UTC

API and companion tests now verify the same fixed Valhalla DSP vendor-page route. Full local suite passed, including the Swift dispatcher fixture and 32 API/browser tests. No installer was downloaded. [Report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_VALHALLA_VENDOR_SITE_20261025.md) commit 4ac9aabd8ae035cb9819ecfa7b40436186846f4a, blob eda7f5a6bbc5c3f6988bd9aee87f49855c44af8e; [closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md) commit 66d95d18d6fbf4867d6c5c0d2d808cfd3960d63e, blob e671e56eb893c324a1aa5bf2c4b0be0469615840. Foundation remains **NOT MET**; Stage 6 gated. Other Foundation and Stages 2–5 work, plus independent review, remain open. No remote D1 write, deployment or cutover.

## PluginHub Stage 5 checkpoint — 2026-10-25


## Stage 5 local preview revalidation — 2026-10-25

The Mac companion now keeps the accepted signed preview bound to its account, device, operation, kind, nonce, item, scan generation, digest, and expiry. Before Finder reveal, vendor-page open, or hub-app launch it checks that the action and preview are still current, the same item remains in the current local scan, and the local item still exists and is not a symlink. Changed, stale, or expired actions are cleared. Retrying a receipt does not repeat a completed action.

Local verification passed: Swift build; API/browser 34/34; scanner 3/3; isolated Worker/D1 pairing, inventory sync, Manual Check, signed/encrypted exact-preview submission, and signed reveal receipt. Negative checks reject changed generation, changed local record, and expired preview. Evidence: [Stage 5 local preview revalidation](../governance/evidence/PHASE_PLUGINHUB_STAGE5_LOCAL_PREVIEW_REVALIDATION_20261025.md), report commit `d7ea39d6da0965201182151a9e6bc584a2d9f9b5`, blob `e3acc645ce4c514a7ee471d072e3897d0a36b3a8`.

Source pins: DeviceSync commit `c08fe8fb6d76d40c92c20fe8801f2dad5e5a4bd3`, blob `bc480d5291f167bb3e59876640a251a0822596c5`; companion UI commit `f01d95a9dcfaf4113f3b302c973f9d016dd4ca03`, blob `aa2d0ddb462ea9fad9e657f245c51f0c47ca4268`; integration checker commit `e47ec791261fcbbde3a6de118bdbf87ca73ead51`, blob `600ce38b74d263d46055bafe6025cba04e12c30e`.

This is local fixture evidence, not a real Mac/browser/Auth0/passkey walkthrough, remote isolation or remote recovery proof. Foundation remains **NOT MET**; Stages 2–5 and fresh independent review remain in progress; Stage 6 remains gated. The 22:47 D1 authorization chronology is unchanged. No remote D1 write, deployment, or cutover occurred.


## Owner-confirmation handoff follow-up — 2026-10-25

After the owner views an exact preview, the browser now requests passkey confirmation for high-risk action types. The device command feed carries the preview digest, expiry, and owner-confirmed time; the companion checks that these match its locally prepared preview. The local suite passes (API/browser 34/34; scanner 3/3; Swift and isolated Worker/D1 preview/receipt flow), including wrong-digest rejection. Evidence: [Stage 5 local preview revalidation](../governance/evidence/PHASE_PLUGINHUB_STAGE5_LOCAL_PREVIEW_REVALIDATION_20261025.md), report commit `cd1e5b8690d11e629edbbac15d5eb914dab929cf`, blob `15917bce6d24e13b738446b6e988957be104e629`.

This does **not** enable installer or file-changing actions: the API still allows only the current low-risk action types. Real passkey use, remote provider/isolation/recovery, live Mac/browser parity, remaining Stage 2–5 actions, and fresh independent review remain open. Foundation remains **NOT MET**; Stages 2–5 in progress; Stage 6 gated. Preserve the 22:47 D1 chronology. No remote D1 write, deployment or cutover.
## PluginHub Stage 5 checkpoint — 2026-10-25

Continued the approved non-production work on `codex/pluginhub-foundation` from checkpoint `d14b6764dfbc945fdd9d65129a1c39fffc43b99a`. Installer staging now uses descriptor-anchored file operations, a private owner-only staging directory, atomic no-replace publication, POSIX/ACL shared-write rejection, and receipt identity checks. A URLSession-level fixture confirms the redirect delegate rejects a disallowed host before a request is issued to it. Full `sh scripts/pluginhub-nonprod-check.sh` passed: API/browser 38/38, scanner 3/3, disposable local D1 through migration 0021, local Worker checks, Swift pairing/sync and synthetic reveal/move/restore fixtures. No installer was downloaded; no remote D1 was accessed or written. Fresh independent review **ACCEPTED this slice** within its same-UID threat boundary; reviewer ran no tests. See [review report](../governance/evidence/PHASE_PLUGINHUB_STAGE5_INSTALLER_INDEPENDENT_REVIEW_20261025.md).

Foundation remains **NOT MET**; Stages 2–5 partial; Stage 6 gated. Keep the 22:47 D1 gate open. No deployment or cutover.
