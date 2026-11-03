# AIMM publisher audit

Audited against plug-in bundle metadata in the system and user Audio Plug-Ins folders on this Mac and the direct-source adapters in `src/index.js`. A read-only pass on 2 November 2026 found 1,649 readable bundles and 76 raw publisher labels. These labels include capitalization, bundle-ID aliases, bundle names used as fallback metadata, and format variants; the alias inventory below records each label and its audit grouping. This is a filesystem audit, not a claim that every product can be checked against a public release list.

## Direct checks

| Publisher / labels found | Coverage in AIMM | Boundary |
|---|---|---|
| FabFilter | Official download catalogue | Product identity is matched; Pro-Q generations are kept distinct. |
| Arturia | Curated official product pages: Analog Lab, Dist COLDFIRE, Mini V4, Pigments | Unmapped products and earlier Mini V generations remain Manual Check. |
| Sonarworks | SoundID Reference release notes | Applies to SoundID Reference products only. |
| Wavesfactory | Official changelog | Trackspacer 2.5 only; 2.0 remains separate and manual. |
| sonible | Product pages for exact names in the adapter map | Other sonible products remain Manual Check. |
| Soundtoys | Official release log | Uses the shared Soundtoys suite release. |
| Softube | Official release notes | Uses the shared suite release and normalizes build suffixes. |
| MeldaProduction | Official downloads page's shared kernel version | Applies to the Melda suite. |
| LiquidSonics / Reverb Foundry | Official downloads catalogue | Exact product heading and macOS version are required. |
| oeksound | Official downloads page | Exact product name and macOS installer version are required. |
| Aurally Sound | Prism official downloads page | Prism is covered; Prism Drums has no matching public version entry and stays manual. |
| SIR Audio Tools | StandardCLIP official version history | Uses the macOS build; other products, if present, remain manual. |
| Splice | INSTRUMENT official changelog | Covers Splice INSTRUMENT, not other Splice components. |
| EVAbeat | Melody Sauce 3 official user guide | Reads the version printed in the current official guide; other products remain manual. |
| Celemony | Melodyne 5 official version history | Major version 5 only; earlier major versions remain manual. |
| Scaler Music | Scaler 3 official latest-version thread | Scaler Detector components are separate and remain manual. |
| iZotope | Official product-download catalogue | Requires an exact product entry. |
| Native Instruments | Official product-download catalogue | Requires an exact product/update entry. |
| Waves / WavesAudio | Official Waves V17 release notes | Legacy products excluded from the V17-wide update remain manual. |
| Plugin Alliance / Brainworx / Lindell Plugins and selected PA brands | Exact official product heading plus that product's changelog | Unmapped slugs, redirects, and non-matching titles fail closed to Manual Check. |
| Voxengo | Official downloads catalogue | Requires an exact product/version match. |
| Eventide / Newfangled Audio | Official Eventide product pages | Only Blackhole, CrushStation, Temperance Lite and Temperance Pro are mapped. |
| Altitude | Official Crossfeed and Limiter pages | Those two products only. |

## Audited; no safe live comparison yet

| Publisher / labels found | Audit result |
|---|---|
| Universal Audio / UA Audio / UADx | [UA Connect](https://www.uaudio.com/pages/download-ua-connect) manages the plug-ins; public notices use suite versions. Comparing suite version to plug-in versions would create false updates. Manual Check. |
| Sonnox | The [public installer catalogue](https://sonnox.com/installers) renders its current product/version list with JavaScript, which the Worker does not run. Because the fetched HTML does not contain the list, it cannot be checked live. Existing dated snapshots for selected Sonnox products are accepted for 14 days; other products stay Manual Check. |
| IK Multimedia | [Product Manager](https://www.ikmultimedia.com/products/productmanager/index.php) shows updates for the user's registered account. Manual Check. |
| Slate Digital | [Complete Access](https://app.completeaccess.audio/installers) account manages the available updates; no exact public per-product version list was found. Manual Check. |
| UJAM | [UJAM App](https://www.ujam.com/ujam-app/) syncs the user's account and shows product updates; the public changelog is for the app, not each plug-in. Manual Check. |
| Valhalla DSP | [Public demos/downloads](https://valhalladsp.com/demos-downloads/) include free products, but the vendor directs paid users to account downloads. The public page is not reliably readable by the checker. Manual Check. |
| Acon Digital | [Limit](https://acondigital.com/products/limit) identifies only version family 1.x, not a precise installed plug-in build. Manual Check. |
| Busy Works Beats | Store pages can show versions, but the installed “Tape Emulation” label does not safely match a current product page by exact identity. Manual Check. |
| Bettermaker | Public pages identify hardware/controller software, but no exact current version was found for the installed Mastering Compressor DSP plug-in. Manual Check. |
| Cradle | [Orion release notes](https://support.cradle.app/hc/en-us/articles/30832044280980-Updates-and-release-notes) say its plug-in GUI retains the previous version number and only Cradle Hub shows the latest version. The bundle version AIMM reads therefore cannot confirm whether Orion is updated. [The God Particle support page](https://support.cradle.app/hc/en-us/articles/6423691528468-Updates-and-Release-notes) points to release notes but exposes no current product version in its public text. Manual Check. |
| ARTonic Music | The [ChordAXE FAQ](https://www.chordaxe.com/faq) gives a shared version “as of December 6, 2025”; that dated value cannot support a current automatic status. Manual Check. |
| NoiseWorks / DynAssist | DynAssist is discontinued and its old update URL now redirects to a product-transition page. Manual Check. |
| Image-Line | The installed FL Studio plug-in is distributed with [FL Studio](https://www.image-line.com/fl-studio/); its independent plug-in version is not listed publicly. Manual Check. |
| Plugins That Knock | No exact public version entry for the installed KNOCK-Clipper bundle was found. Manual Check. |
| Hit'n'Mix | RipLink is bundled with [RipX DAW](https://hitnmix.com/changes/); the public change log doesn't give a separate RipLink version. Manual Check. |
| Navie D | No exact public version entry for noteGRABBER2 was found. Manual Check. |
| Apple | AES3 Audio Decoder is an Apple system component, not an independently versioned third-party plug-in. Manual Check. |
| Steinberg | The installed WaveLab plug-in is bundled with WaveLab; no independent public version entry was found. Manual Check. |
| Accidental / ACE Bridge | Appears to be a DAW/ARA bridge component; no independent plug-in release list was found. Manual Check. |
| “Synth” metadata label | The bundle metadata does not identify a publisher reliably enough to map it. Manual Check pending better publisher metadata. |

SSL and Harrison are also audited: their official download table lists AAX versions but warns that AU/VST versions can differ, so AIMM retains the source as a reference and leaves status in Manual Check. Several mapped publishers above have product-specific exceptions; passing through `sourceFor` does not mean every product from that publisher is covered.

## Raw label reconciliation

Every raw label in the local scan is accounted for below. Labels separated by commas are treated as aliases or bundle-name fallbacks for the audit group shown; labels are retained here so the coverage claim can be checked against the scan rather than inferred from the source map.

| Audit group | Raw labels observed |
|---|---|
| Accidental / ACE Bridge | `accidental` |
| Acon Digital | `Acon Digital` |
| Altitude | `Altitude` |
| Arturia | `Arturia`, `Analog Lab V.component`, `Dist COLDFIRE.component` |
| ARTonic Music | `ARTonic Music`, `ARTonicMusic` |
| Aurally Sound | `Aurally Sound`, `AurallySound` |
| Bettermaker | `bettermaker` |
| BusyWorksBeats | `BusyWorksBeats` |
| Celemony | `Celemony`, `celemony` |
| Cradle | `Cradle`, `cradle` |
| EVAbeat | `Evabeat` |
| FabFilter | `FabFilter`, `fabfilter` |
| Harrison | `Harrison`, `Harrison Audio`, `HarrisonAudio` |
| Hit'n'Mix | `hitnmix` |
| IK Multimedia | `IK Multimedia`, `ikmultimedia` |
| Image-Line | `Image-Line`, `image-line`, `FL Studio.component` |
| iZotope | `iZotope`, `izotope` |
| LiquidSonics | `LiquidSonics`, `liquidsonics` |
| MeldaProduction | `MeldaProduction` |
| Native Instruments | `Native Instruments`, `native-instruments` |
| Navie D | `Navie D`, `NavieD` |
| NoiseWorks / DynAssist | `NoiseWorks`, `DynAssist` |
| oeksound | `oeksound` |
| Plugin Alliance and affiliated brands | `Plugin Alliance`, `plugin-alliance`, `pluginalliance`, `lindellplugins` |
| Plugins That Knock | `Plugins That Knock`, `PluginsThatKnock` |
| Scaler Music | `Scaler Music`, `scalermusic` |
| SIR Audio Tools | `SIR Audio Tools` |
| Slate Digital | `Slate Digital` |
| Softube | `Softube`, `softube` |
| Sonarworks | `Sonarworks`, `sonarworks` |
| sonible | `sonible` |
| Sonnox | `Sonnox` |
| Soundtoys | `Soundtoys` |
| Splice | `Splice`, `splice` |
| SSL | `SSL` |
| Steinberg | `Steinberg` |
| Unknown / app-owned metadata | `Synth`, `aimm`, `apple`, `Unknown publisher` |
| Universal Audio | `Universal Audio`, `Universal Audio (UADx)`, `uaudio` |
| UJAM | `UJAM`, `ujam` |
| Valhalla DSP | `Valhalla DSP, LLC`, `ValhallaDSP` |
| Waves | `Waves`, `WavesAudio` |
| Wavesfactory | `Wavesfactory`, `wavesfactory` |
