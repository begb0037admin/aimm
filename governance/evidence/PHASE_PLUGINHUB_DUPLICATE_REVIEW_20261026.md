# Local duplicate review — 2026-10-26 09:49 UTC

## Change

The companion now shows a read-only “Possible duplicate copies” section. It groups records only when they share a non-empty bundle identifier and plug-in format. Matching is case-insensitive and paths are normalized before duplicate counting. Different formats are kept separate, and records without a bundle identifier are not guessed to be duplicates. The result is stable across scan ordering and does not depend on the machine locale. The app displays the additional local path for human review and explicitly reports that no file was changed. This slice does not sync paths, create a deletion request, or authorize Trash.

Implementation commit: `73846cc8158d14d01c87b20c17e2ca1d0b6f5843`; tree `44431830d9133a06633b58b29deb9042145b0aae`; parent `724012ccf6232b0917e9071f875b3fbea3f20e55`.

| Source file | Blob SHA |
|---|---|
| `companion/Sources/AIMMCompanionCore/DuplicateAnalyzer.swift` | `1712b38d71655f8b702593be8cad29d3880073b4` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `fa728ddb81677855a303cb52b30ca7cf296a0114` |
| `companion/Sources/aimm-journal-check/main.swift` | `53c28b883ceaf2efc064f0c87b5dfe4b2d5008b9` |

## Verification

`sh scripts/pluginhub-nonprod-check.sh` passed. The companion packaged with a local ad-hoc signature; Swift journal and scanner checks passed (scanner 3/3); the duplicate regression verified case-insensitive bundle-ID grouping within one format, deterministic primary selection, different-format separation and rejection of missing identity. API/browser tests passed 38/38. The disposable local D1 and loopback Worker passed CORS/auth checks and synthetic cross-account rejection. Actual Swift pairing, inventory sync, Manual Check, reveal, move and restore receipts passed against that local Worker/D1. `git diff --check` passed.

All fixtures were synthetic and local. No project/remote D1, provider request, credential, deployment or cutover was involved. The current remote D1 validation/write hold remains **OPEN**; Foundation remains **NOT MET**; Stages 2–5 continue; Stage 6 remains gated. This read-only duplicate display does not complete duplicate deletion or the full Stage 5 action suite. Provider-backed browser session/CSRF and pairing, remote two-account isolation/recovery, current-Mac browser parity, remaining Stage 5 actions and fresh end-to-end independent Foundation review remain outstanding.
