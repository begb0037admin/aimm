# PluginHub Foundation — pairing disclosure and full local verification — 2026-10-26 18:36 UTC

**Repository:** `begb0037admin/aimm`  
**Branch:** `codex/pluginhub-foundation`  
**Verified GitHub checkpoint before this source update:** `1828604a9b1f86cafc74a5ae9d0e4004a0dc2ce2`  
**Source changed:** `companion/Sources/aimm-companion/AIMMCompanionApp.swift`  
**Source blob:** `97cd76e92e566246f5174496033aba6e4904a38d`

## Change

Added a just-in-time pairing confirmation dialog. Before a pairing request starts, it names the development API destination and device name, explains that the public signing key is sent, and states that after the owner approves the phrase in the browser the credential is saved in macOS Keychain and the saved scan syncs automatically. For a completed scan, it lists the fields sent: product names, bundle identifiers, versions, formats, metadata sources and opaque record IDs. It states that file paths and folder bookmarks stay on this Mac. If there is no completed scan, the dialog says no inventory is sent until a later complete scan.

Cancel starts no request. Continue opens the existing pairing flow, which still requires the owner's separate browser phrase check and approval.

## Verification

Ran `sh scripts/pluginhub-nonprod-check.sh` after the change. It passed:

- Companion build and ad-hoc signed local preview packaging.
- Companion journal and local action recovery.
- Scanner 3/3.
- API/browser 38/38.
- Disposable local D1/Worker migrations, runtime and CORS.
- Synthetic cross-account rejection.
- Real Swift client local pairing, inventory sync, Manual Check, reveal, move and restore receipts.

The first sandbox attempt blocked SwiftPM planning; the approved local retry completed. No Auth0/Google consent was accepted, no remote pairing started, no real Mac inventory was uploaded, and no deployment/cutover occurred.

## Disposition

This closes a local disclosure gap; it does not prove provider-backed remote pairing or Keychain delivery. Explicit owner approval is still required before pairing the real Mac scan described in [the data-boundary report](PHASE_PLUGINHUB_PAIRING_DATA_BOUNDARY_20261026_1833.md). The Test User B Google consent is also still pending.

Foundation remains **NOT MET**; Stage 6 remains gated. Authenticated remote A/B endpoint isolation, approved remote current-Mac pairing/Keychain delivery, project recovery/parity, remaining Stage 2–5 coverage, and fresh independent end-to-end validation remain open.
