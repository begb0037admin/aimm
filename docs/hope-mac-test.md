# Test the Hope branch on the Mac Mini

The test branch is `hope-production-agent` at commit `28f3bc2` (2026-10-21).

On the Mac Mini, run:

```sh
git clone --branch hope-production-agent https://github.com/begb0037admin/aimm.git aimm-hope-test
cd aimm-hope-test/worker
npm ci
npm test
npm run check
```

`npm test` exercises the Hope API against a local SQLite Durable Object.
`npm run check` bundles the Worker with Wrangler's dry-run flag; it does not
deploy. To run the MCP server, install its dependencies from
`aimm-hope-test/tools/hope-mcp` and follow `docs/hope-codex-setup.md`.

The shared-state API is not deployed yet, and this branch does not provide
Logic Pro control. An end-to-end Logic test still needs a verified Logic control
provider and a live Worker deployment. The current Windows session cannot SSH
to the Mac Mini: both its LAN and Tailscale addresses timed out, and the Mini
does not appear in the current Tailscale device list.
