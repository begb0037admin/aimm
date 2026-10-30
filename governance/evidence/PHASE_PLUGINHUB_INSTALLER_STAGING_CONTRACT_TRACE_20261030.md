# PluginHub Companion installer staging contract trace — 2026-10-30

## Scope

Read-only trace of the exact branch-source downloader, catalog route and known consumers. No command was run; no vendor page was requested; no installer was downloaded, opened or installed; no output directory was selected; no local inventory, Worker or D1 state was touched.

Reviewed source:
- `companion/Sources/AIMMCompanionCore/VerifiedInstallerDownload.swift`, blob `8edbb7f9880926675ee519902250c5b52a4621b6`. This is byte-identical to the independently accepted implementation reviewed at commit `241e0756136156730d165fbdf8b66e41c4852523`.
- `companion/Sources/AIMMCompanionCore/VendorStatus.swift`, blob `a5fec030f5560694a2cd4b0a49f81ab8c01b8dd4`.
- `companion/Sources/aimm-companion/AIMMCompanionApp.swift`, blob `015a63b963c36c0a8b7598bb8e1ef986cb890ee9`.
- `companion/Sources/AIMMCompanionCore/DeviceSync.swift`, blob `a06a2b46e402bd6574e8c3e3996a02bbb0628996`.
- `companion/Sources/aimm-journal-check/main.swift`, blob `61a3258ceb76502222aba0702bbe18632ca66d25`.
- [Descriptor-anchored staging evidence](PHASE_PLUGINHUB_STAGE5_DESCRIPTOR_ANCHORED_INSTALLER_STAGING_20261025.md), blob `705de3faa2fb912947a1e94f0216167adc4cbecc`, and [independent review](PHASE_PLUGINHUB_STAGE5_INSTALLER_INDEPENDENT_REVIEW_20261025.md), blob `38fd751cac622de84084a40335c3cde702f5d73b`.

## Catalog route and trust inputs

`MacInstallerArtifact` carries product key, version, URL and filename; it has no digest. The existing public catalog parser handles FabFilter download-page markup and selects an allowlisted CDN host. `currentMacInstaller(for:)` permits only FabFilter Pro-Q 4, then compares the parsed product version and artifact version. The journal-check source has an optional route-resolution mode that reports the official route without downloading a file; that mode was not run.

`VerifiedInstallerRoute` separately requires an HTTPS artifact URL, an explicit allowed-host set, a 64-hex SHA-256 digest supplied by its caller, and a positive maximum size up to 2 GiB. The current catalog does not provide an authenticated digest, and the source records no reviewed signer-derived digest configuration. Therefore the route-discovery code alone cannot authorize a real verified download.

## Local staging and receipt contract

The helper accepts an explicitly chosen local directory. It rejects unsafe/shared destinations, creates a private UUID staging directory and no-follow file, streams up to the configured byte limit, verifies HTTP 200 and permitted disk-image content type, checks the final host/redirect policy, validates the DMG structure and exact digest, then publishes atomically without overwriting an existing file. Failure is returned as a typed error and the private staging area is removed.

Success returns a `VerifiedInstallerReceipt` with product key, version, local file URL, byte count, SHA-256 and POSIX device/inode identity. This receipt confirms a verified DMG was staged. There is no install/open method in this helper; it does not prove that a user ran the vendor installer or that a plug-in was installed. Any later installer consumer must re-open without following symlinks and compare the receipt identity before use.

The async byte stream has no progress callback or cancellation API. There is no queue, batch state, retry/clear workflow, completion history or app-facing receipt rendering. The desktop app and DeviceSync sources do not call the helper. The journal-check harness uses `saveFixture` with synthetic DMG bytes and a fixture-generated digest; its optional live-route path only resolves the public URL. No fixture download was run here.

## Next work

The current color mapping has been confirmed against the current preview; the conflicting screenshot came from an older preview. Next, build one synthetic PluginHub-style Install Manager UI slice for review: vendor filters/totals, per-row download controls, queue-all/download-all, a batch panel, and Download folder/Clear installed & failed/Start over/Done affordances. Use in-memory rows, label outcomes as simulated, and do not claim a file was downloaded or installed. Actual download hookup remains separate until trusted digest and progress/cancellation contracts are available.

This trace completes the read-only Companion downloader/receipt review. Foundation remains **NOT MET** and Stage 6 gated.


## Continuation — synthetic Install Manager preview — 2026-10-30

Added the bounded UI slice requested above on branch commit \`dd3574b4c4280bac2da51bab9b5168c0af8d39a1\`, with vendor-filter event handling in \`50305f5d9b2260e6e347521b2537f499bf76b093\`.

The preview uses three in-memory records matching the sample status scope (Tapeform CLAP, Comet Dynamics VST3, Halo Equalizer AU). Vendor filtering, row queueing, per-vendor queue-all, global queue-all, removal, simulated single/batch result receipts, clear results, start over, and Done are wired to temporary in-page state. “Download folder” explains that the browser preview cannot open a local folder. Every displayed completion explicitly says no installer was downloaded or installed. No local plug-in folder, real account inventory, vendor URL, file or Companion action was accessed.

Branch Pages built and deployed successfully at \`https://233c2587.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic\`. Visual review confirmed the panel has inset spacing and aligned controls. Accessibility state confirmed the sample count, queue count and receipts update. Queue all (3), simulated batch completion (3), Clear installed & failed, the folder explanation and Start over were exercised. This closes the synthetic manager interaction preview only. Actual verified download/install remains open pending a trusted digest/signature source, Companion progress/cancel and receipt UI integration, local folder access, and dev Worker deployment. Foundation remains **NOT MET**; Stage 6 remains gated.
