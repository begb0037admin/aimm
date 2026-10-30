# PluginHub tool and browse contract matrix — 2026-10-30

## Latest Companion installer staging trace

The exact Companion downloader source is `VerifiedInstallerDownload.swift` blob `8edbb7f9880926675ee519902250c5b52a4621b6`, byte-identical to the accepted descriptor-anchored staging implementation. It requires a caller-supplied digest and explicit safe destination; it returns a verified-file receipt, not an install result. The catalog resolves FabFilter Pro-Q 4 only and has no trusted digest configured. The app does not invoke the helper; no queue/progress/cancel or app-facing receipt UI is present. See [source contract trace](PHASE_PLUGINHUB_INSTALLER_STAGING_CONTRACT_TRACE_20261030.md).

Next: after this trace is independently reviewed, reconcile the reopened format badge colors against Kevin’s latest screenshot (VST2/VST3 blue, CLAP brown, AU green; status dots unchanged) and obtain exact-source/desktop/390px review. Then implement a synthetic-only PluginHub-style manager surface with in-memory rows, queue controls and simulated outcomes; do not claim a file download or install. Actual hookup needs a trusted digest and progress/cancellation contract. No vendor page or installer was accessed.

## Previous read-only contract review — status projection and Install Manager

The Library API returns account-authenticated, current-generation status per format record with freshness, last-good, stale/error, paid-upgrade and mark fields. The visible UI remains an in-memory synthetic fixture and has no /v1/status-summary call or generation/record join. AU component-to-bundle identity and product roll-up are unresolved; migration 0022 is not applied. The Install Manager entry remains disabled, and the account API has no download/queue/install workflow. The reviewed local Companion downloader is groundwork only. See [contract review](PHASE_PLUGINHUB_STATUS_INSTALL_CONTRACT_REVIEW_20261030.md).

Next: trace the local Companion downloader and receipt contract without downloading an installer; after independent review, reconcile the reopened format colors and then build one synthetic Install Manager slice. Keep Library live status disconnected until exact generation/record and AU component mapping is resolved. No live account/vendor calls or real inventory were used.


