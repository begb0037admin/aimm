# AIMM standalone plug-in inventory

This directory is the deployable, browser-based plug-in inventory. The browser scans only folders the user selects and stores scan rows, filters, profiles, tags, favourites, and vendor-check results in that browser.

The Worker checks every scanned product through `/api/vendor-check` and applies each publisher source to every matching product in the inventory. It does not call a PluginHub app, API, local bridge, or companion process. Each request checks up to 45 unique publisher pages; the browser automatically requests further batches until all discovered pages have been checked. Products without a safe, exact public version match remain in Manual Check.

The browse status counts are products, not format rows. A product with mixed format results is counted once, with Updates available taking precedence over Manual Check, then Unchecked, then Up to date. Individual format results remain visible on its card.

## Direct publisher sources

- FabFilter download page
- Arturia product download pages for a curated set of names with verified canonical slugs; AIMM also validates the page title and exact product entry before accepting a version. Unmapped products stay in Manual Check
- MeldaProduction's official downloads page, which publishes the current kernel version for the plug-in suite
- LiquidSonics and Reverb Foundry's official downloads catalogue, with exact product headings and macOS-specific versions for this Mac inventory
- oeksound's downloads page, matching the exact plug-in name and its macOS installer version
- Aurally Sound's Prism downloads page
- SIR Audio Tools StandardCLIP version history and macOS build
- Splice INSTRUMENT release log
- EVAbeat Melody Sauce 3 user guide
- Plugin Alliance product pages, using the exact product heading and newest version in that product's changelog; selected Plugin Alliance labels (including Brainworx, Lindell Audio, Unfiltered Audio, SPL, Shadow Hills, and elysia) resolve to their official product pages. A page that does not identify the requested product stays in Manual Check
- Celemony Melodyne 5 and Scaler 3 official version histories
- Wavesfactory product changelog at its directly accessible official hostname; Trackspacer 2.0 stays in Manual Check because its 2.5 line is a separate product version
- Sonarworks SoundID Reference release notes
- Sonible product pages with an exact product title and latest-version field
- Soundtoys release log
- Softube release notes; Softube's shared release version is applied to its plug-ins, including build-suffixed scan versions
- iZotope product downloads
- Native Instruments product downloads, for exact listed product/update entries
- Waves V17 release notes; legacy products excluded from the V17-wide update are left for manual review
- SSL and Harrison download table; the listed AAX version is retained as a source reference, while AU/VST3 status stays in Manual Check because the vendor says those formats can differ
- Voxengo downloads
- Eventide product pages for the explicitly mapped products
- Altitude Crossfeed and Altitude Limiter pages

Private account portals, product managers, and pages that do not publish a usable exact version remain manual checks. The checker does not infer a release from a different product or format. The installed plug-in itself is never opened or changed by a version check.

## Local tools

Install Manager, batch plug-in actions, installer cleanup, duplicate review, encrypted licence vault, share/export, and profile comparison run in the AIMM page against browser-local data. Installer cleanup requires selecting the items and confirming the exact list before deletion. Synthetic previews disable these tools.

The browser sends only publisher, product, and installed-version text to the AIMM Worker for public version checks. It stores the returned result locally.

See [VENDOR_AUDIT.md](./VENDOR_AUDIT.md) for the audited publisher list, direct-source coverage, and the reason other publishers remain in Manual Check.
