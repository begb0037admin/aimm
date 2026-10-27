# Development Companion rebuild and pairing disclosure — 2026-10-27

**Verified at:** 2026-10-27 12:32 UTC  
**Source commit:** `8423e6be2e4ac26390b8204a46188a2a202b0a2a`  
**Branch:** `codex/pluginhub-foundation`

The development Companion Preview was rebuilt from the branch source into a new temporary app at `/private/tmp/pluginhub-preview-build-20261027/AIMM Companion Preview.app`. Swift compilation and the repository packaging script completed; the app has a valid ad-hoc local signature. It is not a distribution build. The existing installed app was not overwritten. The new preview launched and its status is **Not paired. Scans stay on this Mac.**

The updated app now presents the expected pairing disclosure instead of the prior “Too many pairing polls” state. The visible disclosure names **Mac mini**, destination `https://aimm-library-api-dev.kevinlelitte.workers.dev`, the public signing key, Keychain credential creation after browser approval, and automatic sync of the saved **1,641-entry** scan (product names, bundle identifiers, versions, formats, metadata sources and opaque record IDs). It states that file paths and folder bookmarks stay on this Mac.

The disclosure's **Continue to pairing approval** action has not been pressed. No pairing request was started by this app, no user inventory/metadata was transmitted, no remote credential was created, and no D1 row changed. Kevin's action-time confirmation is now the only immediate pairing step: click **Continue to pairing approval** on the visible disclosure. Then verify the phrase matches in the browser before the browser approval. Stop if Auth0 requests a new `manage:devices` grant.

The API polling fix was already deployed to the development Worker as deployment `13e04554-fe80-4e8c-a6fc-1679f4577854`, version `e254b220-af5f-44f9-a723-7aa71d68e15b`; its health endpoint returns OK. The API tests (20/20), Companion retry harness and Wrangler dry-run are recorded in [poll retry evidence](PHASE_PLUGINHUB_PAIRING_POLL_RETRY_20261027.md), blob `97000d33a1f2cd758c76e17be79b4eaeac763b07`.

**Foundation remains NOT MET; Stage 6 remains gated.** After pairing, remaining work includes remote device-credential cross-account rejection, account-backed browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 gates, and fresh independent end-to-end review. No production deployment or cutover occurred.
