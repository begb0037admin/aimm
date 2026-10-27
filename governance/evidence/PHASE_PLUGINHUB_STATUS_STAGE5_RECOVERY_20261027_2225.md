# PluginHub status and Stage 5 recovery checkpoint — 2026-10-27 22:25 UTC

Branch: `codex/pluginhub-foundation`  
Source commits reviewed: `60d2c571089198add6c3b2a36022b97f5cd9d9b4`, `f265c25226c89847de31d66b67b970382571c981`, `1b29362541f316cb0da3bbe8235bc6e7705ce711`.

## Mac scan and account Library comparison

The paired Mac's standard-folder scan produced generation `9ff4225e-fb10-4966-aae4-393cf8294210` at 2026-10-27 21:48:16 UTC, with 1,641 records. The browser compare showed 1,958 local rows, 1,641 matching account rows, 317 browser-only, 0 account-only, and 2 version differences. This comparison is exact to the approved metadata comparison and does not upload the browser scan. The 317 and two version differences remain unresolved.

## Corrected public status checks

The running companion was confirmed as **AIMM Companion Status Fix**, paired to development device `a21e727f-ce14-4a98-bba9-7bcf6f595fc6`. Refreshed vendor checks completed:
- FabFilter: 9 supported items checked; 1,632 others remain Manual Check.
- Voxengo: 0 supported items; all 1,641 remain Manual Check.
- u-he: 0 supported items; all 1,641 remain Manual Check.
- Valhalla DSP: 6 supported items checked; 1,635 others remain Manual Check.

A bounded, read-only D1 aggregation on the exact generation confirmed the latest observation per record is 1,626 Manual Check, 11 up-to-date, and 4 update available. It also showed 22 historical public up-to-date and 8 historical public update rows, because some records were checked more than once. The refresh path now submits only supported `public_vendor` observations, so unsupported records no longer overwrite other adapters' observations. The app displayed each check completion. The browser's all-observations panel remained stuck at “Loading current observations…” during refresh; the D1 aggregate was used as the authoritative account-side readback.

## Stage 5 action and recovery checks

A live paired-Mac read-only reveal had already completed earlier in this checkpoint: Finder opened only after Mac confirmation; Library action state was `completed`; bounded D1 readback found the matching signed receipt. No plug-in file was changed. Evidence: [live validation report](PHASE_PLUGINHUB_LIVE_VALIDATION_20261027_2159.md), blob `f5ec44684cbafbfcd793b46213db416ba731ed9d`.

Using the isolated copy of the current branch companion sources at `/private/tmp/aimm-foundation-status-fix`, `swift build` passed and `swift run aimm-journal-check` passed. The recovery checks covered interrupted cross-volume restore with source retention, cross-volume copy/verification/journalling, and resumed two-copy/staged recovery. The checker also passed its endpoint-protection, local journal, and synthetic pairing checks. No live installer was downloaded and no real plug-in file changed.

This was not a fresh full Worker/D1 move-and-restore end-to-end run. The prior full local suite and prior synthetic Worker/Swift move/restore evidence remain separately recorded; this checkpoint does not upgrade them to fresh remote runtime evidence.

## Remaining evidence

- Resolve or explain the 317 browser-only records and 2 version differences.
- Fresh full end-to-end Stage 5 synthetic move/restore through Worker/D1 and Mac fixture.
- Complete the 31-row Stage 4 mapping.
- Prove real paired-credential wrong-device HTTP 401.
- Fresh independent end-to-end review.

Foundation exit remains NOT MET until the approved gates are evidenced and independently accepted. Stage 6 remains gated. No deployment, cutover, production data use, migration, or credential change occurred. The 22:47 D1 authorization chronology is unchanged.
