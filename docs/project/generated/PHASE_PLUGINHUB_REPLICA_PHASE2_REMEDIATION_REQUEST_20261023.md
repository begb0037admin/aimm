# PluginHub replica — Phase 2 remediation request

**Date:** 2026-10-23  
**Repository/branch:** begb0037admin/aimm, codex/pluginhub-replication  
**Source challenge:** docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE2_CHALLENGE_REPORT_20261023.md, commit 104b0790ce10687098e5ae0c466db9162bd12db3, GET blob 4ae482191d03367959b068bdeef873fe99c3f726.  
**Trigger:** VT-06 and VT-08 were PARTIAL. Governance Workflow Standard v1.0 therefore requires Stage 4 remediation and Stage 5 independent validation before a Stage 6 Governance Review Request.

## Requested corrections

1. **Future authorization gates (VT-06/VT-08).** In docs/PLUGINHUB_PHASE2_ARCHITECTURE.md, add a clear statement that an architecture decision authorizes design only. Before work begins, require separate, explicit authorization for companion implementation, account/API and Cloudflare resource creation, identity-provider/signing credential setup, purchases or paid commitments, service or scheduler changes, local file actions, bridge/LaunchAgent retirement, merge, cutover and deployment. Keep the existing technical build and release gates. The current introduction excludes build/deployment approval, and the handover calls for a separately authorized foundation phase, but the architecture does not currently state every required future boundary.

2. **Retention decision timing (VT-06/VT-08).** Reconcile docs/PLUGINHUB_DATA_BOUNDARY.md (“Evidence limit”: exact retention is a Phase 2 design decision) with docs/PLUGINHUB_PHASE2_ARCHITECTURE.md (“Design assumptions and remaining decisions”: exact windows for receipts, profiles, shares and deleted accounts are to be defined during API implementation). State whether each exact window must be settled before implementation starts or is an implementation task with an explicit pre-production gate. Preserve the existing ten-minute preview access and purge rules.

3. **Attribution of Kevin's request (VT-06).** The Evidence Package's first assumption says this candidate is the one Kevin asked to take through formal review. The reviewed handover reports the request, but the cited primary source set does not include Kevin's direct instruction for this particular governance handoff. Supply a primary, reviewable reference if available; otherwise qualify the attribution as reported handover context. This is an evidence precision correction, not a request to infer or seek a new architecture decision.

## Remediation evidence and validation

The executing agent should commit the permitted documentation correction(s) under its own authority, record exact changed paths, commit SHAs and GET blob SHAs in Phase 2 Remediation Evidence under governance/evidence/, and submit a Validation Request. The independent challenger should GET the updated files at the named commit and test each numbered correction against the original PARTIAL findings. The Phase 1 approval and all unresolved technical gates remain as stated in the architecture and ownership map. No implementation, purchase, local action, service change, merge or deployment is requested by this remediation request.

This request makes no governance approval decision.
