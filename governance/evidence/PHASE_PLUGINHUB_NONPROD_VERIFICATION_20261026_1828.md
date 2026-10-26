# PluginHub Foundation — local suite and remote read-only verification — 2026-10-26 18:28 UTC

**Repository:** `begb0037admin/aimm`  
**Branch:** `codex/pluginhub-foundation`  
**Verified GitHub head before this evidence update:** `23980a1f855ae0f3c7182f301f6238e23158e8aa`  
**Scope:** Non-production local verification and read-only Cloudflare metadata/D1 checks. No deployment, cutover, provider configuration change, or remote D1 write.

## Local non-production pipeline

Ran `sh scripts/pluginhub-nonprod-check.sh`. The default sandbox blocked SwiftPM manifest planning; the approved local retry completed successfully.

- Companion app packaged and locally ad-hoc signed; signature validation passed.
- Companion build and journal checks passed.
- Direct-installer staging, redirect rejection, streaming limits, DMG structure, and digest checks passed without downloading a live installer.
- Recovery, duplicate-analysis and pairing controls passed with synthetic local fixtures.
- Scanner: 3/3.
- API/browser: 38/38.
- Disposable local D1 and Worker migration/runtime/CORS checks passed.
- Synthetic cross-account credential/device rejection passed.
- Swift pairing, inventory sync, Manual Check, reveal, move and restore receipts passed against disposable local Worker/D1.

## Remote read-only checks

Cloudflare identity is the existing `kevin@lelitte.com` connection. The active development Worker is `aimm-library-api-dev`; read-only binding metadata confirms its D1 binding points to `aimm-library-foundation-dev` / `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. The Worker compatibility date is `2026-10-23`. No Worker variable values or secret values were read.

A read-only query of `d1_migrations` returned 21 migration names through `0021_restore_actions.sql`, including `0003_browser_sessions.sql`. Cloudflare reported 21 rows read, zero rows written, and `changed_db: false`. No account, device, session, or other user rows were queried.

The earlier bounded synthetic D1 authorization/isolation and separate synthetic-only time-travel recovery evidence remain as recorded in [D1 validation](PHASE_PLUGINHUB_D1_VALIDATION_20261026.md) and [D1 recovery](PHASE_PLUGINHUB_D1_TIME_TRAVEL_RECOVERY_20261025.md). This checkpoint did not repeat those write/recovery probes.

## Identity-consent checkpoint

The Auth0 flow was aimed at the saved Test User B. Google now presents an explicit consent asking to share the account's name, profile picture, and email with `auth0.com` for the development sign-in. The consent was **not accepted**; no Auth0 token, API session, or D1 session row was created. Awaiting owner approval at the exact consent step.

## Disposition

The local pipeline is **PASS**. Remote Worker binding and migration-ledger checks are **PASS**. This is not remote authenticated A/B endpoint-isolation evidence, current-Mac remote pairing/Keychain delivery, project recovery/parity, full remaining Stage 2–5 coverage, or a fresh independent end-to-end review.

**Foundation remains NOT MET; Stage 6 remains gated.** No deployment or cutover occurred.

Local source files `library-api/src/index.js`, `library-api/library-account.js`, `library-api/dev-auth-test.html`, API tests, `DeviceSync.swift`, and `scripts/pluginhub-nonprod-check.sh` hash exactly to the source blobs pinned in the branch's evidence package. The temporary login-hint adjustment used to select the saved test identity has been reverted; it is not part of the source.
