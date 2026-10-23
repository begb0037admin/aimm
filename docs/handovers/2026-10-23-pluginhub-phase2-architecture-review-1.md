**Verdict: PARTIAL**

The direction is sound and the baseline claims check out against the repo. But the API and data contracts don't yet cover several workflows the ownership map assigns to them, and the local-action safety binding is underspecified. Nothing in the docs claims more than was verified, so this is about incompleteness, not misstatement.

Plan mode is active, so I made no edits, wrote no plan file, and made no PluginHub, vendor, or secret access. I only read the files listed below.

## Verified behavior (checked against the repo)

- **Baseline, ARCH §Inspected baseline:** `origin/main` is `c717fc6`. Its `index.html` has `aimmPluginInventoryRows_v1` and `aimmPluginInventoryScan_v1` (lines 5281–5282), IndexedDB use (5324–5325), `showDirectoryPicker` (5453), and an `.aax` path (5295).
- **Hope reads the built-in catalogue, not installed inventory:** `list_plugins` (14058), `get_library` (14063), and `buildLibraryDigest` (9705) all use `allPlugins()`.
- **Worker:** the Origin allowlist is explicitly browser-only (`worker/src/index.js` 18–19). `/captures` is one KV key, `captures`, read and written whole (626–644), so it is last-write-wins.
- **Phase One traceability:** the governance decision is APPROVED. The ownership map covers P01–P31, and the 970 candidate keys, 159/100/19/1 report counts, 13 installer candidates and 15 vendors match the Phase One records. All relative links resolve. Archive commit `721d466` contains the Phase Two backups.
- **Labelling is good:** the docs repeatedly say "proposed", "not implemented or exercised", and "not a support claim".

## Material findings

1. **Local-action digest is not defined (high).** ARCH §Operation state (line 113) says a preview "binds… a digest", but nothing says who computes it, what it covers, or that the companion checks a server-claimed command against the digest it prepared locally. The Mac acts on server-supplied commands, so this is the core safety boundary. Preview expiry is also unstated ("short window").

2. **Pairing has no out-of-band binding (medium).** ARCH §Identity #2 (line 59) has the companion open a pairing URL and the signed-in user approve "the named Mac". The companion supplies that name. Nothing ties the approval to the device the user is looking at, such as a short verification phrase shown on both screens. The pairing secret's transport is also unspecified; it must not go in a URL.

3. **Mapped workflows lack contract elements (medium).** The ownership map cites contract elements that don't exist:
   - P06 vendor-level favourites and hidden items: only the product-scoped `PATCH /v1/preferences/{product_id}` exists (ARCH line 95).
   - P07 collections and P16 saved selection lists: no entity, only a "collection" field.
   - P19/P22/P24 consent: no consent record, and no route for P24 contribution at all.
   - P20 requirements summary "synced": no record or route.
   - P25/P26 account-level schedule and settings: no route.
   - P02/P25 manual refresh: no action kind, and the commands endpoint is claim-only.
   - P03 bulk reset marks: no route.
   - P28 device limits: no enforcement in the pairing contract.
   - P29 companion updates: no release-manifest endpoint.
   - Roles in ARCH §Identity #4 have no data model or route.

4. **Status counts computed in two places (medium).** ARCH line 101 says the UI computes actionable counts. P02 (line 10) requires Hope to show the same counts. Nothing says the bucket logic is server-side or in one shared module, which is the divergence the Phase One count-semantics note warns about.

5. **Partial-generation contradiction (low–medium).** ARCH line 72 says only complete generations are published, but line 101 returns `is_partial` from `GET /v1/library`. Either partial data can be active or the field is always false. Clarify.

6. **Confusable routes (low).** `POST /v1/actions/previews` (site) and `POST /v1/actions/{id}/preview` (companion) differ by one segment. Name them distinctly.

7. **Model-provider disclosure (low–medium).** Hope's tool results cross into browser-side voice and LLM providers. ARCH §Hope says exact paths stay out of Hope context, but it doesn't list which inventory fields may leave the browser. Machine labels and error text are new fields.

8. **Folder access mechanism undecided (low–medium).** ARCH line 48 says the Mac "supplies folder access", and P10/P30 depend on persistent grants. The doc doesn't record whether the companion is sandboxed or uses security-scoped bookmarks, which decides how grants persist.

## Not verified by this review

- External Apple and Cloudflare documentation, which the docs cite only for platform capability.
- Mac toolchain state, which is a point-in-time observation.
- Vendor endpoints, installer validity, D1 limits, and the OIDC choice. The docs already mark these as open gates.

Findings 1 and 4 should be fixed before the design is presented for approval. The rest can be handled in remediation. I can draft the remediation after you review these.
