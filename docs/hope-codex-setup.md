# Hope in Codex setup

The Hope MCP server gives Codex access to AIMM's authenticated shared state. It
does not provide microphone, browser, computer, or Logic Pro control.

## Requirements

- Node.js 20 or newer.
- Install MCP server dependencies once with `npm install` from `tools/hope-mcp`.
- `HOPE_STT_TOKEN` available in the Codex process environment. Use the existing
  private token from the approved secret store; do not put its value in this
  repository or a committed file.
- A deployed AIMM Worker with the `HOPE_STATE` Durable Object and the shared
  state routes. Until that Worker release is deployed, the MCP server will
  report the service as unavailable.

## Register the local server

From this repository, run:

```powershell
codex mcp add hope -- node C:\path\to\aimm\tools\hope-mcp\index.mjs
```

Start Codex from a process that already has `HOPE_STT_TOKEN` set. The server
reads it at launch and never prints it. The default Worker URL is configured in
the MCP server; set `AIMM_PROXY_URL` in the same process environment only if
the deployment uses a different URL.

After registration, restart Codex and check `codex mcp list`. Hope's MCP tools
expose current preferences, inventory, exact project lookup, explicit track
mapping, hash-bound stem exports and analysis, append-only events, guarded
preferences and inventory updates, and reversible local-state import.

The `hope_logic_control_status` tool currently reports Logic control as
unavailable. AIMM's own client tools may change AIMM state, but that does not
prove Logic Pro changed. A microphone or spoken Codex route also remains
unverified here; use AIMM's existing voice route for speech.
