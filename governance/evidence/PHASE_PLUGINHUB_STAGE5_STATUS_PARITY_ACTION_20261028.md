## Latest Stage 5 isolated synthetic sync — 2026-10-29

A fresh diagnostic Companion scanned one metadata-only synthetic AU fixture from an explicitly selected root, paired to the non-production development Worker, and reported the one-entry generation synced. The diagnostic app bundle and fresh journal are under `/private/tmp`; Keychain items use separate service names; no standard plugin folder or plugin inventory record was scanned or read. No independent API inventory readback was made. Evidence: [isolated synthetic sync report](PHASE_PLUGINHUB_STAGE5_ISOLATED_SYNTHETIC_DEVICE_SYNC_20261029.md), blob `7805133a11b252dc7ecf0f4dc38e8f32df97b7d1`.

Stage 5 remains **PARTIAL**. No move request was created. Kevin approved a narrow read-only device metadata query after the automatic review rejection; the direct GET to the development Pages `/account-api/v1/devices` route returned 401 because this tab had no active Library API access token. No device rows or plug-in inventory were returned. Retry only through this same approved route after an authenticated development Library session is active. The prior 1,642-entry request expired at `2026-10-29T08:06:53.728Z` and was not reused; no replacement request was created. No file move may occur before the owner sees and confirms its exact preview. Restore, fixture cleanup, diagnostic-device revocation and fresh independent Stage 5 review remain open. Foundation remains **NOT MET**; Stage 6 remains gated.

## Current owner-session update — 2026-10-28

Kevin reports that development passkey enrollment succeeded. No second passkey setup or verification was run.

In the later Companion session, the displayed latest complete local scan was 1,641 entries. Checking the existing move request left it unclaimed because the request's 1,642-entry generation did not match the Companion build or its latest complete local generation. No rescan or file action was performed. This supersedes the earlier “claimed” state recorded above; that state was true at the time of the original check.

The same synthetic operation remains the only pending Stage 5 request; it expires at `2026-10-29T08:06:53.728Z`. Do not create a duplicate while it is valid. Resume only after the Companion can resolve the matching synthetic local generation and the owner reviews the exact preview. Do not scan standard plug-in folders to force a match. Foundation remains **NOT MET**; Stage 6 remains gated.

# Foundation Stage 5 status, Mac parity and blocked action — 2026-10-28 08:09 UTC

## Scope and result

This continuation used the verified GitHub branch `codex/pluginhub-foundation` at starting commit `9668dd5c6017c8d043ccb54370187e570d906834`. No deployment, provider terms, credentials, or production data were involved. Foundation remains **NOT MET**; Stage 6 remains gated.

## Current paired-Mac inventory

The companion’s explicit standard-folder scan completed at **2026-10-28 08:05:22 UTC** with **1,641 entries**, generation `b67103b6-2184-4c91-9feb-e804dfabb895`. The companion confirmed the complete generation synced. The account preview reported the same generation and observed time, with 1,641 account entries. This confirms the current paired-Mac generation reached the account API.

A second account comparison uses the older browser-local inventory (1,958 entries), not the companion scan. It reports 1,641 matching entries, 317 browser-only entries, 0 account-only entries, and 2 version differences. Those browser-local parity differences remain open; the result must not be presented as a mismatch in the fresh paired-Mac generation.

## Vendor status checks

The companion read public vendor pages for supported vendors only. It found 9 supported FabFilter items and 6 supported Valhalla DSP items; the scan contains no supported Voxengo or u-he items. The last visible companion state reports 6 Valhalla items checked and 1,635 items at Manual Check. The browser’s account status-observations panel remained in “Loading current observations…” and did not provide a verified account-side status summary. No downloads or installs occurred.

## Synthetic Stage 5 action attempt

A disposable AU metadata-only bundle named `AIMM Foundation Synthetic Stage 5 Probe` was created in the per-user plug-in Components folder. It contains no executable or vendor software. The refreshed scan at **08:06:39 UTC** contained 1,642 entries, generation `b18d8b33-fc14-49bb-aa80-c46ecf5bee1d`; it synced to the development account. The account comparison showed the expected one synthetic account-only item.

A reversible move request was made for that synthetic record. The paired companion claimed it and displayed the exact local source and selected Unused destination for review. The app requires an owner passkey before the path can be revealed and before the move. The browser returned: **“Set up a passkey on this account first.”** No move was executed; the source fixture is still in place and no other plug-in files were changed. The pending operation is `b9b490c3-543b-4312-a52b-7c20b482fc81`; it expires at `2026-10-29T08:06:53.728Z`. Do not force the action or alter its claimed state to bypass the passkey requirement.

The next action is for Kevin to create a passkey on the AIMM development Library account in the browser. This requires the account owner’s credential ceremony and cannot be completed by the agent. Once enrolled, continue with the same synthetic move, restore it through the owner and companion confirmations, remove the disposable fixture, rescan, and verify cleanup. If it expires before then, create a fresh synthetic request after the passkey is enrolled.

## Remaining Foundation gates

- Complete the owner passkey ceremony, then the synthetic move and restore flow with post-action rescan and cleanup.
- Verify the current paired Mac credential rejects a different device ID.
- Complete real Auth0 A/B browser session and CSRF isolation checks.
- Resolve the 317 browser-local-only entries and 2 browser-local version differences.
- Obtain fresh independent end-to-end Foundation validation after the checks above.

D1 identity and migration state and the previous synthetic cross-account/wrong-device checks remain recorded in the prior pinned D1 evidence. The approved bounded non-production D1 validation hold remains limited to that scope. No database operation, build, deployment, or production change occurred in this continuation.
