# Stage 5 preview recovery and current blocker — 2026-10-29

## Source recovery

At verified branch head `5bc742e03443b28a7e5121bc0f0fd95aef13db46`, Jules reviewed the exact Companion and Worker source diffs for safe recovery of an expired, unconfirmed synthetic action preview. The Companion now checks the live operation, expired preview, unconfirmed state, and absence of a journaled local action before requesting discard; the Worker makes digest clearing and matching payload deletion atomic. Jules passed both diffs. Source commit: `5a90b392fcd439d8c8f4006bab5d389285387865`.

`git diff --check`, `node --check library-api/src/index.js`, Swift Companion build, and Wrangler development dry-run completed successfully. These are source/build checks; no test suite was run. The Worker source change is committed but not live.

## Development Worker deployment recovery

A development Worker deploy command unexpectedly published version `802bb879-e32b-45c2-bc84-c6389b257d4a` before interruption. It was immediately rolled back to the previously verified surgical passkey RP-fix version `68932c1c-2419-4b36-8208-b90449f4302c`; rollback deployment `55cad8f4-72d1-414e-aef6-7957534ee592` is active at 100%. No production deployment occurred. Do not deploy the branch Worker source as part of this recovery: that would replace the RP fix, whose live bundle is still not reproducible from branch source.

## Companion state

The owner had already selected the intended isolated `Unused` folder in the earlier preview. That preview expired before exact paths were confirmed, so no file moved and no passkey assertion occurred. After recovery, Companion may reopen the folder picker and require selecting the same destination again to prepare a fresh preview; the current Keychain error occurs before that step. The rebuilt synthetic diagnostic Companion was opened and asked to check for requests; macOS Keychain returned status `-25244` (`errSecInvalidOwnerEdit`), and the action queue did not load. The diagnostic app is ad-hoc signed; this credential-store error blocks use of the existing paired-device credential. No Keychain item was deleted, replaced, or exposed. Do not repeat passkey enrollment or create another action request. Resume with a Companion build that can access the already paired credential, recover the existing request, and show exact source and destination paths before the owner confirms.

No plug-in inventory was scanned. Synthetic non-production data only. Stage 5 remains **PARTIAL**; Foundation remains **NOT MET** and Stage 6 remains gated pending the exact preview, owner-confirmed move and restore, cleanup, and fresh independent review. The live development Worker RP fix remains a surgical bundle patch rather than a reproducible build from branch source.
