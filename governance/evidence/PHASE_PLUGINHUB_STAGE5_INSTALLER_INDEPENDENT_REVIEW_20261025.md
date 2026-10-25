# Stage 5 installer staging — independent review — 2026-10-25

**Reviewed source:** `241e0756136156730d165fbdf8b66e41c4852523`  
**Verdict:** **ACCEPT** for the verified installer staging slice within the stated threat boundary  
**Foundation:** **NOT MET**; Stages 2–5 partial; Stage 6 gated  
**22:47 D1 authorization gate:** open  
**Deployment/cutover:** none

## Review result

The fresh read-only review accepted the fixes for the prior path TOCTOU, redirect, stale receipt, shared writable directory, and receipt identity findings. The selected directory is checked for current-user ownership, owner write permission, and absence of group/world write bits. The macOS ACL check rejects any extended ACL; its fixture covers shared add/delete access. Staging remains descriptor-anchored, private, and published with atomic no-replace rename. The hostile redirect test exercises the actual URLSession delegate and confirms no request reaches the redirected host.

The reviewer ran no tests. The implementation run of `sh scripts/pluginhub-nonprod-check.sh` passed on this source: API/browser 38/38, scanner 3/3, local D1 through migration 0021, Worker auth/CORS and synthetic two-account rejection, and Swift pairing/sync/action/recovery fixtures. No remote D1 was accessed or written and no real installer was downloaded.

## Boundary and remaining limitations

This acceptance excludes hostile processes running as the same user. A `fileURL` can change after the receipt is returned; any future consumer must open without following symlinks, compare the receipt's device and inode IDs, and retain that descriptor through use. The actual installer flow is not connected to API action queueing, owner confirmation, progress/cancel UI, or installer opening; no trusted vendor digest or reviewed signer is configured. This acceptance does not close Stage 5 or Foundation.

Keep Foundation **NOT MET**, Stage 6 gated, and the 22:47 D1 gate open. No deployment or cutover.
