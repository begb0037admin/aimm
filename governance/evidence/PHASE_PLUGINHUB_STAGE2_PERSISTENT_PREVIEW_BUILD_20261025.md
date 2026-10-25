# Persistent non-production companion preview build — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Source commit:** `460141a65a58238daa2c2ac7780dd62c21597838`  
**Foundation:** **NOT MET**  
**Deployment/cutover:** none

## Artifact

Built a persistent local preview app from the reviewed source using:

```sh
sh scripts/package-pluginhub-nonprod-app.sh /Users/admin/aimm-pluginhub-preview-2026-10-25-restore-460141
```

- App: `/Users/admin/aimm-pluginhub-preview-2026-10-25-restore-460141/AIMM Companion Preview.app`
- Executable SHA-256: `90b9c5dcf18ba352a7807be1df8590399247d6fd40545064344660e6d1f958d4`.
- `codesign --verify --strict --verbose=2`: passed; bundle identity `com.aimixmasters.companion.preview`; signature is **ad-hoc**, with no Team ID.

This artifact is for hands-on testing on this Mac only. It is not Developer ID signed or notarised, and is not a distribution build. The GUI was not launched during this packaging check, no plug-in folders were scanned, and no credentials, provider settings, remote D1, or live services were touched.

The full source verification is recorded in the restore report: [journaled restore and recovery](PHASE_PLUGINHUB_STAGE5_JOURNALED_RESTORE_20261025.md). Foundation remains **NOT MET**; Stages 2–5 remain partial/in progress; Stage 6 gated; 22:47 D1 gate open.
