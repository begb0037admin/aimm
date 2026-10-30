# PluginHub user-directed parity requests — 2026-10-30

## Source and boundary

This register records Kevin’s user-provided PluginHub 2.0.12 comparisons on 2026-10-30. The reference screenshots show UI structure and behavior. Do not copy vendor/plugin rows, counts, paths or update records into AIMM; use the opt-in synthetic fixture for UI work. Production and real-inventory actions remain outside this work.

## Completed visual items

- **Publisher and plug-in names:** AIMM labels were smaller than PluginHub. Current source commit `75655b4b2f327e3fff6d52c30f8512c34d1ffc9c` raises vendor names to 13px and plug-in names to 12px across Cards/List/Ledger. Jules passed desktop and 390px review; four columns remain balanced. See [typography evidence](PHASE_PLUGINHUB_VISUAL_PARITY_NAMES_20261030.md).
- **Hidden visibility:** View now includes Show hidden plug-ins, with clear badges and a hidden-only scope. Jules passed synthetic hide/reveal and filter composition. See [Hidden View evidence](PHASE_PLUGINHUB_VIEW_HIDDEN_20261030.md).

## Open requirements

1. **Live status scopes and counts — high priority.** PluginHub’s Updates Available, Up to Date, Manual Check and Unchecked groups are active and display counts. AIMM currently enables only Unchecked; the other three show disabled states. Connect generation-linked vendor observations and preferences, reconcile each count against that inventory generation, and make all four filters work. Do not show placeholder totals, or treat Unchecked as proof a vendor check ran.
   Source trace: the authenticated generation-bound `/v1/status-summary` route already exists and is used by Hope, but the visible Library page does not call it. The status response now includes nullable bundle identifiers (source commit `84e2e2a3a5c1ad2c2fd0355130e449a5cb03dff5`), but has no publisher field/canonical grouping, and totals still count format rows. Add a reviewed Companion/API product grouping projection and connect the Library UI before activating these filters. See [status UI connection gap](PHASE_PLUGINHUB_STATUS_UI_GAP_20261030.md).
2. **Install Manager — high priority.** AIMM’s entry is inactive. Reproduce a functional vendor-filtered update list, update totals, per-row download, queue-all and download-all controls, and a batch-install panel with per-item progress/outcome. Include the reference controls for Download folder, Clear installed & failed, Start over and Done when their local contracts exist. Use vendor-source verification and the reviewed local Companion flow; never mark an install complete merely because an installer downloaded.
3. **Every AIMM Tool must be active at completion.** Kevin explicitly asked that the Tools surface no longer be a collection of inactive labels. Implement each AIMM-owned workflow through its real backend/Companion contract and show per-item results. Current matrix maps Batch Plugin Management, Remove Old Installers, Check for Duplicates, License Key Vault, Share Plugin List and Compare Plugin Profiles. Keep path actions local and behind exact preview, confirmation and receipt; keep vendor secrets in local Keychain; keep share/profile work behind account-isolation gates. The PluginHub License item is not AIMM licensing; define an AIMM-owned equivalent or an explicit product-scope resolution before claiming this entry complete.
4. **Remaining View parity.** Light/Dark/System appearance, colorblind-friendly status colors, sidebar/top-tab navigation, license-key marks, and PluginHub-specific List/Ledger semantics remain open. Newest/oldest sorting requires per-record timestamp metadata; never substitute scan time.

## Order and acceptance

Start with the generation-bound status projection and Install Manager contracts, then activate each remaining Tool one at a time. A label/button counts as complete only when its actual workflow is connected, errors and partial outcomes are visible, and Jules has reviewed the source and synthetic preview. Real-inventory validation and any separately gated external action require the project's existing authorization. Keep **Foundation NOT MET** and **Stage 6 gated** until fresh complete exit evidence and independent acceptance.
