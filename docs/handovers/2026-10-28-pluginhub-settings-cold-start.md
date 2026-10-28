# PluginHub cold-start continuation — 2026-10-28

## Authoritative project state

Repository: `begb0037admin/aimm`  
Branch: `codex/pluginhub-foundation`  
Latest verified GitHub branch head at this handover: `d7e9bd1c36d7bada7878acaf7c87cfb0ac8ebb10`  
Latest handover commit: `d7e9bd1c36d7bada7878acaf7c87cfb0ac8ebb10`  
The local checkout at `/Users/admin/aimm-pluginhub-stage2-5` is stale at `d4bdcf741fd940bb9e79fee39fb76d61becb12a3` and has a dirty worktree. Do not reset, clean, or push that whole stale worktree over the branch. Check the latest branch first and reconcile changed files individually.

Read `docs/HANDOVER.md`, this file, `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md`, `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md`, and `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`.

## Current UI and passkey state

The Settings page work is already on GitHub. The Library account section is in Settings; inventory/status tools are tucked into “More Library settings,” with short background notifications and collapsed detail output. The branch preview was verified in Chrome at `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/`, deployment `feb20e90-cf3d-4a0a-9b43-b8be1433df4f`. The visible “Set up a passkey” button was confirmed. No local build or tests were run for that UI checkpoint.

The preview’s passkey error was traced to a WebAuthn RP ID mismatch. Branch source fix is commit `19bd4a048990a7178e84e307b35efccb9bf190bc`, source blob `05bd55aaf196cb5743d3a2bf80f1482aebd03cf8`; test commit `9bd7935f92ed64a98420f83f55b7b1cb3dc53f83`, test blob `ee45e0d5515c750ca366eca73dbc2bdb7ce5a9a9`. Branch Worker tests passed 22/22, local API suite 38/38, and Wrangler dry-run bundling succeeded.

The non-production Worker is serving version 10 at 100%, deployment `7562c0a0-cfe8-4472-8897-f00853453900`; `/health` returned 200. The passkey behaviour was installed as a surgical patch to the prior deployed bundle because Wrangler auth was expired. This is not a reproducible bundle built from branch source; the Worker commit annotation is not build attestation. Keep that limitation visible for independent review and rebuild from branch source when Wrangler authentication is restored. No passkey ceremony was complete at the latest verified handover. The latest recorded next step is to refresh the preview, sign in, and retry “Set up a passkey”; Touch ID/browser confirmation is Kevin’s action.

## Foundation gates and safety

Foundation remains **NOT MET**; Stage 6 remains gated. Do not change this status until every approved exit gate has evidence and fresh independent end-to-end validation accepts it.

The historical 22:47 D1 creation authorization is resolved. The bounded synthetic non-production D1 validation scope is recorded as cleared, with its evidence linked from the root handover. Preserve any narrower currently open hold described by the newest branch records. Use synthetic data only. Do not deploy to production, cut over, accept provider terms, create credentials, or take other separately gated actions without required authorization. No secrets or passkey material belong in repo files.

The latest branch handover records: a 1,641-entry paired-Mac scan; a synthetic move request claimed by the companion but not yet executed; passkey enrollment needed before move/restore; 317 browser-only entries and two version differences; a real paired-credential wrong-device HTTP 401; and fresh independent Foundation review remain open. Recheck the newest GitHub handover because these may have advanced.

## What happened in the stale local session

A separate local-only session added another cold-start file and inserted notes into the stale local Dashboard, Status, Roadmap, closeout and evidence package. It did not publish those local notes. Some of the earlier local notes say no preview was available; that describes the stale local attempt and is superseded by the verified GitHub preview above. Do not publish those stale local record files wholesale. The remote branch’s root handover and synchronized records are the source of truth.

## Resume checklist

1. Confirm the branch head and read the source-of-truth records above.
2. Preserve the dirty Mac checkout; compare local changes with the latest remote tree before deciding what to keep or publish.
3. Continue from the latest handover’s passkey and Stage 5 instructions; do not repeat already completed work without checking evidence.
4. Record only newly verified results. Keep Dashboard, Roadmap, Status, closeout and evidence package pins consistent with the commit being published.
5. Keep Foundation NOT MET and Stage 6 gated until all exit evidence and fresh independent review are complete.

## Copy/paste prompt

```text
Continue the PluginHub project in begb0037admin/aimm, branch codex/pluginhub-foundation. Start by reading docs/HANDOVER.md and docs/handovers/2026-10-28-pluginhub-settings-cold-start.md, then the linked Foundation closeout, evidence package and approved seven-stage architecture. Check GitHub for a newer head first. The local Mac checkout is stale and dirty; preserve it and do not push or overwrite it wholesale.

The Settings UI redesign is already published and its GitHub Pages development preview was verified. The passkey RP-ID fix is live on the development Worker, but it was installed as a surgical bundle patch rather than a reproducible branch build. Read the latest handover for the exact preview, runtime and next passkey step, and keep that provenance limitation visible.

Continue the authorized PluginHub work without repeating completed checks. Foundation remains NOT MET and Stage 6 remains gated until every exit requirement is evidenced and fresh independent review accepts it. Use synthetic non-production data only. Do not deploy to production, cut over, accept provider terms, create credentials, or take separately gated external actions without the required authorization. Keep project records and evidence SHAs synchronized as verified work is published.
```
