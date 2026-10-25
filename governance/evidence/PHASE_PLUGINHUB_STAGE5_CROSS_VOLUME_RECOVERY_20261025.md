# Stage 5 cross-volume move recovery fixture — 2026-10-25

## API success-receipt follow-up — 2026-10-25

The API fixture now also exercises a valid move success receipt after a complete local post-move inventory generation excludes the item. It verifies the receipt is bound to the stored exact-preview digest, a valid tree digest, verified destination/source-removal evidence, and the fresh inventory head. The test sets the local fixture's owner-confirmation timestamp directly to isolate receipt validation; it does **not** exercise or claim a real WebAuthn ceremony.

The full `sh scripts/pluginhub-nonprod-check.sh` passed against tested source checkpoint `a3d95b3a536be632a66a075743a52763574e796f`: API/browser 34/34, scanner 3/3, Swift/journal including deterministic `EXDEV` fallback, JavaScript syntax, local D1 migrations through 0018 and isolated Worker, pairing, inventory sync, Manual Check, signed preview and receipt.

API test source: `library-api/test/foundation.test.js`, commit `a3d95b3a536be632a66a075743a52763574e796f`, blob `fd188c764bd189853d8bed64a6db85fd381c1190`.

---

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source checkpoint:** `e76f4c8a8d31250ef348b762a441490d2d3f16ae`  
**Foundation exit:** **NOT MET**  
**Stages 2–5:** in progress; **Stage 6:** gated

## Change

The companion journal checker now injects a one-time `EXDEV` error when the executor attempts the initial source-to-Unused move. It then verifies the existing staged-copy fallback: source and staging tree digests match the preview, the destination copy is verified and journaled, and the original source is removed only after those checks. The fixture also confirms the final destination digest matches the action receipt.

This tests the cross-volume error path deterministically. It does not exercise a second mounted filesystem, an actual macOS volume boundary, real plug-in files, a passkey, or the browser-to-Mac workflow.

## Verification

Ran `sh scripts/pluginhub-nonprod-check.sh` successfully after the change. Results: Swift companion and journal checks; cross-volume fallback fixture; scanner tests 3/3; API/browser tests 34/34; JavaScript syntax; migrations through 0018 and isolated local Worker/D1; local Swift pairing, inventory sync, Manual Check, signed exact-preview submission and signed receipt. Output ended with `All non-production PluginHub checks passed.`

The initial sandboxed invocation stopped before compiling because SwiftPM's `sandbox-exec` was blocked by the environment. The same command was rerun with the previously approved local non-production execution scope and passed. No remote project D1 write, provider operation, deployment, or cutover occurred.

## Source pin

The new fixture is in `companion/Sources/aimm-journal-check/main.swift`, blob `721c8be7d26d61a4b36d74e2bbff1b63dc114113`, committed at tested source checkpoint `e76f4c8a8d31250ef348b762a441490d2d3f16ae`.

This closes one deterministic recovery-path coverage gap only. Actual cross-volume proof, real passkey and local action walkthrough, remaining Stage 2–5 implementation/parity, provider-backed remote runtime, cross-account isolation and recovery evidence, and fresh independent review remain open. Preserve the 22:47 D1 authorization chronology. Foundation remains **NOT MET**; Stage 6 remains gated.
