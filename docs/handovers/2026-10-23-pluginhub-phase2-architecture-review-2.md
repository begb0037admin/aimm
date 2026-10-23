**Overall: PARTIAL.** Commit f898abf closes the four most important gaps: the digest, pairing binding, status-count ownership and the partial-generation contradiction. Two findings are only partly closed, and the new contracts add three safety-boundary gaps that the eight findings did not cover. No edits, actions or secret access. Plan mode is active, so I wrote no plan file.

Both docs are byte-identical to f898abf, so the line numbers below are for the committed design. The review file's line numbers are from an earlier checkpoint and no longer match. Its quoted phrase "binds… a digest" does not appear; the current text is at `PLUGINHUB_PHASE2_ARCHITECTURE.md:120`.

## The eight findings

| # | Finding | Verdict | Evidence |
|---|---|---|---|
| 1 | Local-action digest undefined | **PASS** | `ARCHITECTURE.md:120`: the Mac builds the canonical preview, computes SHA-256, signs it with the Keychain device key and journals it. The server accepts only a matching pending digest. Destructive expiry is 10 minutes. Gap: the canonical serialisation is not named (e.g. RFC 8785). |
| 2 | Pairing has no out-of-band binding | **PASS** | `:59`: a verification phrase appears on the Mac and in the browser, the owner compares them, the polling secret travels only in headers, and pairing is single-use with a 10-minute expiry. Gap: the phrase's inputs are not stated; they must include the device public key. The polling secret's storage is also unstated. |
| 3 | Mapped workflows lack contract elements | **PARTIAL** | Resolved: P06 `:100,:76`; P07/P16 `:77,:101`; P19/P22/P24 `:79,:104-106`; P20 `:80,:105`; P25/P26 `:78,:101`; P02/P25 refresh `:102,:130`; P03 `:100`; P28 `:59,:96`; P29 `:81,:106`; roles `:61`. Still open: P31 Samples has no record or route (parity `:39`); P17 duplicate results have no record or route (parity `:25`); action kinds are never enumerated, though P13/P14/P18 depend on them (`:102`); the "pinned" bucket (parity `:10`) has no backing field (`:76`). |
| 4 | Status counts in two places | **PASS** | `:108` and `:130`: one versioned server bucket function; the site and Hope display its output and neither recomputes it. |
| 5 | Partial-generation contradiction | **PASS** | `:72` publishes only complete generations; `:108` renames the field to `last_attempt_partial`, which describes the last attempt, not the active data. |
| 6 | Confusable routes | **PASS** | The site route is gone. The Mac uses `POST /v1/actions/{id}/prepared-preview` (`:103`). Gap: nothing says how the owner's browser receives the exact preview (see new finding B). |
| 7 | Model-provider disclosure | **PASS** | `:134` lists the permitted tool-result fields and excludes paths, project content, licence values, pairing data, tokens and raw errors. Minor: the default device display name can contain a personal name, since macOS defaults to one. `get_plugin_action_preview` should be stated to return only the redacted summary. |
| 8 | Folder-access mechanism undecided | **PARTIAL** | `:48` decides a non-sandboxed Developer ID app, which closes the sandbox question. But "persists root identities/bookmarks where appropriate" leaves persistence undecided. Because the app is unsandboxed, the rule to restrict paths to connected roots (`:124`) is only app code and should be stated as such. |

## New material findings

**A. Hope cannot confirm, but the server does not enforce that. (High)**
`:102` and `:61` say Hope cannot confirm a file mutation. But `:120` requires only the current session and CSRF token. Hope runs in the same page with the same session and token, so the server cannot tell a Hope-initiated confirm from a button click. The boundary currently exists only in the tool surface. Require a step-up on confirm, such as a passkey or re-authentication, or a one-time token minted by a user gesture and bound to the digest.

**B. The exact-path preview has no delivery route and conflicts with server storage. (Medium-high)**
`:120` says exact paths go "to the owner's explicit preview screen … stored for at most 10 minutes", but the server holds only a redacted summary and the digest (`:82`, `:120`). The only candidate route, `GET /v1/actions/{id}` (`:102`), is not defined to return paths. Either the Mac serves the preview locally, or the server stores paths, which contradicts `:82`. Choose one and add the route.

**C. Download and installer sources are not digest-bound. (Medium)**
The bound fields at `:120` list "source identity/path" and "destination" but not the download URL, redirect chain, expected hash or signature, or size. `:124` requires those checks before opening an installer. State that these fields are bound and that the Mac derives the URL from its own adapter table, never from the server command.

**D. Minor inconsistency.** `:102` calls read-only scan and check expiry "short"; `:120` sets it at 24 hours.

## What I did not verify
Vendor endpoints, the OIDC choice, D1 limits and the Apple platform claims are open gates in the docs. I did not run the bridge or check any live system.
