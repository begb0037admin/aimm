# AIMM companion scanner core

This Swift package is the read-only scanning core for Stage 2 of the approved PluginHub replacement architecture. It is a testable command-line/library slice, not yet the signed macOS companion app.

The scanner accepts only caller-selected roots. It recognises AU `.component`, VST2 `.vst`, VST3 `.vst3`, and CLAP `.clap` entries; explicitly excludes AAX; reads bounded `Info.plist` metadata for bundle formats; and uses a CLAP filename only because reading embedded metadata would require parsing or loading plug-in code. It does not load, execute, or modify plug-ins. Paths remain in local scan results and are not sent to a service.

Build with `swift build`. Run synthetic integration tests with `python3 -m unittest discover -s tests`; tests create temporary plug-in bundles and invoke the built scanner CLI. To scan, explicitly pass directories using `swift run aimm-scan --root <directory>`; the command has no implicit roots and never starts a scan on its own.

A signed menu-bar UI, user-granted standard folder selection, custom-root preferences, local journal, pairing/sync transport, inventory reconciliation and Hope/site integration remain to be implemented and reviewed. Tests create synthetic plug-in bundles only and do not inspect the user's installed plug-ins.
