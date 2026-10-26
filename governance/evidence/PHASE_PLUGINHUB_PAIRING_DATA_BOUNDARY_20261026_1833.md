# PluginHub Foundation — current Mac pairing data boundary — 2026-10-26 18:33 UTC

**Repository:** `begb0037admin/aimm`  
**Branch:** `codex/pluginhub-foundation`  
**Verified GitHub checkpoint:** `cd293ef14cc8b9cdb98832969be822b8cb05c33d`  
**Scope:** Read-only companion inspection and source review.

The running AIMM Companion Preview is not paired. Its development API URL is empty and the **Pair this Mac** button is disabled. The UI shows a complete local scan of 1,641 plug-in format entries across two selected roots and explicitly says nothing was uploaded. No pairing request or D1 write occurred.

Source review confirms that successful pairing saves a device credential to the Mac's Keychain and then immediately calls inventory sync when a complete scan is present. The transmitted inventory record fields include canonical product name, bundle identifier (if available), version (if available), plug-in format, metadata source, and an opaque device-scoped record ID. Local file paths and folder/bookmark data are excluded. This would disclose the current Mac's installed plug-in inventory to the active non-production AIMM Library API and its bound D1.

**Required before pairing this real scan:** obtain Kevin's explicit action-time approval to send those inventory metadata fields for this Mac to the non-production account/API and to create/store the paired-device credential. This is separate from Google's pending Test User B sign-in consent and any Auth0 application consent.

No software or remote configuration changed. No local files were scanned during this inspection; the displayed scan predates it. Foundation remains **NOT MET**; Stage 6 remains gated.
