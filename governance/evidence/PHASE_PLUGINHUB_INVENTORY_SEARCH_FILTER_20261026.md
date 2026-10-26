# Account inventory search, filters and sort — 2026-10-26

## Change

The local account-backed inventory preview now searches product names, vendor names, bundle identifiers, and versions, with case-insensitive matching. Format and tag selectors are populated from the current snapshot and saved account preferences. Users can retain source order or sort by product name, vendor, or format. Search, format, tag, sort, favourites, and hidden-product filters compose; the preview reports the visible/total count and shows an explicit empty result message.

## Verification

- `npm test` in `library-api`: passed 38/38.
- Regression coverage checks vendor-identifier search, combined search and format filters, alphabetical sorting, preserved search while sorting, saved-tag filtering, and result counts. Existing preference assertions continue to cover favourites, pinning, hide/show/unhide, and their interaction with the inventory list.
- `git diff --check`: passed.
- The broader local script was not rerun in this checkpoint. Its prior attempt stopped before tests at SwiftPM manifest planning (`sandbox_apply: Operation not permitted`); no Swift build/test result is claimed here.

## Working-tree source pins

These are local Git blob IDs, not published commit pins:

| File | Blob SHA |
|---|---|
| `library-api/library-account.js` | `b06bbec4ad35b07a9a05f129c4eb65ebe31e6d4c` |
| `library-api/test/library-account.test.js` | `fa396b0a02a85580d57d8b607966b37d6f842706` |

## Scope and gates

This is local, non-production browser behavior on the account-preview surface. It does not modify the main public `index.html`, change Mac files, access Auth0 or remote D1, deploy, or cut over. Remote D1 validation/write hold remains **OPEN**; Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated. Auth0 access case #03075407, remote runtime/account isolation/recovery, live pairing/parity, and fresh independent end-to-end review remain outstanding.

The source changes were reconciled against GitHub parent `d705f1a51b13f0839ba8b8c5386debf2eadd4c73` and published in commit `088a117779ab090cc3e5261e800195b6382f3545` (tree `3b32007abcb061ad519cd5425a1eef832dc64a5c`). No provider call, remote D1 access/write, deployment, or cutover occurred.
