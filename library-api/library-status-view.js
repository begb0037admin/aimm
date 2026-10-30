(() => {
  "use strict";
  const css = `
    #library .inv-side-button[data-inv-scope="stale"] .inv-side-count{color:#e8b45a;font-weight:700}
    #library .inv-side-button[data-inv-scope="error"] .inv-side-count{color:#ee7777;font-weight:700}
    #library .inv-side-button.active[data-inv-scope="stale"] .inv-side-count,#library .inv-side-button.active[data-inv-scope="error"] .inv-side-count{display:inline-flex;align-items:center;justify-content:center;min-width:28px;min-height:22px;padding:1px 5px;border-radius:6px;background:rgba(9,11,15,.72);box-shadow:0 0 0 1px rgba(255,255,255,.08)}
    #library .inv-account-status-view{display:grid;gap:14px}
    #library .inv-account-status-summary,#library .inv-account-status-notice{margin:0;padding:12px 14px;border:1px solid #2c323a;border-radius:10px;background:#15181c;color:#aeb7c2}
    #library .inv-account-status-notice{color:#8f9aa7}
    #library .inv-account-status-list{display:grid;gap:12px}
    #library .inv-account-status-card{display:grid;grid-template-columns:minmax(180px,1.5fr) minmax(90px,.55fr) minmax(180px,1.2fr) minmax(180px,1fr);align-items:center;gap:16px;padding:16px 18px;border:1px solid #303741;border-radius:12px;background:#1c2025;min-width:0}
    #library .inv-account-status-main{display:grid;gap:3px;min-width:0}
    #library .inv-account-status-publisher{font-size:12px;color:#8893a2;overflow-wrap:anywhere}
    #library .inv-account-status-product{font-size:16px;line-height:1.35;color:#edf1f5;overflow-wrap:anywhere}
    #library .inv-account-status-device{font-size:12px;color:#87919d}
    #library .inv-account-status-format,#library .inv-account-status-version,#library .inv-account-status-result{display:grid;gap:5px;min-width:0}
    #library .inv-account-status-card small{font-size:11px;line-height:1.45;color:#8993a2;overflow-wrap:anywhere}
    #library .inv-account-status-format strong{font-size:13px;color:#d4d9df}
    #library .inv-account-status-version>div{font:13px ui-monospace,SFMono-Regular,Menlo,monospace;color:#aeb7c2;overflow-wrap:anywhere}
    #library .inv-account-installed{color:#aeb7c2}
    #library .inv-account-latest{color:#f0787e;font-weight:750}
    #library .inv-account-status-badge{justify-self:start;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;background:#2b3037;color:#a8b0ba}
    #library .inv-account-status-badge.updates{background:rgba(238,119,119,.15);color:#f0787e}
    #library .inv-account-status-badge.up-to-date{background:rgba(66,201,149,.15);color:#42c995}
    #library .inv-account-status-badge.manual-check,#library .inv-account-status-badge.stale{background:rgba(232,180,90,.15);color:#e8b45a}
    #library .inv-account-status-badge.error{background:rgba(238,119,119,.18);color:#ff8b91}
    #library .inv-account-generation{font:10px ui-monospace,SFMono-Regular,Menlo,monospace;color:#707b88}
    #library .inv-account-status-notice.error{border-color:#70434a;color:#ef999e}
    @media(max-width:900px){#library .inv-account-status-card{grid-template-columns:minmax(0,1fr) minmax(100px,.5fr);gap:12px}}
    @media(max-width:560px){#library .inv-account-status-card{grid-template-columns:minmax(0,1fr);gap:10px;padding:15px}}
  `;
  const style = document.createElement("style");
  style.id = "inv-account-status-bridge-styles";
  style.textContent = css;
  document.head.appendChild(style);

  let snapshot = null;
  let loading = false;
  let message = "";
  let originalRender = null;
  const esc = (value) => String(value ?? "").replace(/[&<>"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const norm = (value) => String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
  const synthetic = () => typeof INV_SYNTHETIC_PREVIEW !== "undefined" && INV_SYNTHETIC_PREVIEW;
  const statusScope = (scope) => ["updates","up-to-date","manual-check","unchecked","stale","error"].includes(scope);
  function key(row) {
    if (row?.stale || row?.status === "stale") return "stale";
    if (row?.status === "error" || row?.error_code) return "error";
    const value = String(row?.status || "").toLowerCase().replaceAll("-", "_");
    if (["update","updates","free_update","paid_update","actionable_update"].includes(value)) return "updates";
    if (["up_to_date","uptodate"].includes(value)) return "up-to-date";
    if (["manual_check","manual"].includes(value)) return "manual-check";
    return "unchecked";
  }
  const labels = {updates:"Updates available","up-to-date":"Up to date","manual-check":"Manual check",unchecked:"Unchecked",stale:"Stale results",error:"Check errors"};
  function currentScope() { try { return INV_SCOPE; } catch (_) { return "all"; } }
  function currentSearch() { try { return INV_SEARCH || ""; } catch (_) { return ""; } }
  function formats() { try { return INV_FORMATS; } catch (_) { return new Set(); } }
  function filteredRows() {
    if (!snapshot) return [];
    const query = norm(currentSearch());
    const chosenFormats = formats();
    return snapshot.records.filter((row) => {
      if (!INV_SHOW_HIDDEN && row.hidden) return false;
      if (statusScope(currentScope()) && key(row) !== currentScope()) return false;
      if (chosenFormats.size && !chosenFormats.has(row.format)) return false;
      if (query && !norm([row.name,row.publisher_name,row.device,row.format,row.installed_version,row.latest_version].join(" ")).includes(query)) return false;
      return true;
    });
  }
  function updateSidebar() {
    if (!snapshot) return;
    const counts = {updates:0,"up-to-date":0,"manual-check":0,unchecked:0,stale:0,error:0};
    snapshot.records.forEach((row) => { if (INV_SHOW_HIDDEN || !row.hidden) counts[key(row)]++; });
    const ids = {updates:"invSidebarUpdatesCount","up-to-date":"invSidebarUpToDateCount","manual-check":"invSidebarManualCount",unchecked:"invSidebarUncheckedCount",stale:"invSidebarStaleCount",error:"invSidebarErrorCount"};
    Object.entries(ids).forEach(([scope,id]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = counts[scope].toLocaleString();
      const button = document.querySelector('[data-inv-scope="' + scope + '"]');
      if (button) {
        const count = counts[scope].toLocaleString();
        button.setAttribute("aria-label", labels[scope] + ": " + count + " account format records");
        button.title = counts[scope]
          ? count + " matching format records in the loaded account snapshot."
          : "No " + labels[scope].toLowerCase() + " records in the loaded account snapshot.";
      }
    });
  }
  function updateBanner() {
    const banner = document.getElementById("invStatusScopeBanner");
    if (!banner || !statusScope(currentScope())) return;
    const scope = currentScope();
    const rows = (snapshot?.records || []).filter((row) => key(row) === scope && (INV_SHOW_HIDDEN || !row.hidden));
    const devices = new Set(rows.map((row) => row.device_id).filter(Boolean)).size;
    const title = banner.querySelector("[data-inv-scope-title]");
    const count = banner.querySelector("[data-inv-scope-count]");
    const copy = banner.querySelector("[data-inv-scope-copy]");
    if (title) title.textContent = labels[scope];
    if (count) count.textContent = rows.length.toLocaleString() + " matching format " + (rows.length === 1 ? "record" : "records") + " across " + devices.toLocaleString() + " devices";
    const guidance = {
      updates:"Red available versions identify the formats that need attention. Review each installed → available version and update through the vendor.",
      "up-to-date":"Green means the recorded vendor observation found no update. Check the observation time if you need to confirm freshness.",
      "manual-check":"Amber means the version could not be compared automatically. Check the plug-in with its vendor.",
      unchecked:"Grey means no status result is recorded; do not assume it is current.",
      stale:"These last known observations are older than their freshness window. Check the plug-in with its vendor again.",
      error:"These status checks failed. Review the error shown on each format record and retry the check."
    };
    if (copy) copy.textContent = snapshot ? guidance[scope] : (message || "Load account status to see the signed-in account's generation-bound observations.");
    banner.className = "inv-scope-banner " + scope;
    banner.hidden = false;
  }
  function syncStats() {
    const statusMode = statusScope(currentScope()) && !synthetic();
    const stats = document.querySelectorAll("#library .inv-stats .inv-stat");
    if (stats.length < 3) return;
    if (!statusMode) {
      const localValues = [
        ["Installed products", "invProductCount", "grouped by name and publisher"],
        ["Format bundles", "invBundleCount", "one plug-in may have several formats"],
        ["Formats found", "invFormatCount", "AU · VST2 · VST3 · CLAP"]
      ];
      stats.forEach((stat,index) => {
        const [label,id,detail] = localValues[index];
        stat.querySelector("span").textContent = label;
        stat.querySelector("strong").textContent = document.getElementById(id)?.textContent || "—";
        stat.querySelector("small").textContent = detail;
      });
      return;
    }
    const rows = snapshot?.records || [];
    const devices = new Set(rows.map((row) => row.device_id).filter(Boolean));
    const foundFormats = new Set(rows.map((row) => row.format).filter(Boolean));
    stats[0].querySelector("span").textContent = "Status records";
    stats[0].querySelector("strong").textContent = snapshot ? rows.length.toLocaleString() : "—";
    stats[0].querySelector("small").textContent = "generation-bound account observations";
    stats[1].querySelector("span").textContent = "Devices";
    stats[1].querySelector("strong").textContent = snapshot ? devices.size.toLocaleString() : "—";
    stats[1].querySelector("small").textContent = "records remain separated by generation";
    stats[2].querySelector("span").textContent = "Formats found";
    stats[2].querySelector("strong").textContent = snapshot ? foundFormats.size.toLocaleString() : "—";
    stats[2].querySelector("small").textContent = Array.from(foundFormats).join(" · ") || "No account records loaded";
  }
  function bindRenderer() {
    const current = window.invRenderInventory;
    if (typeof current !== "function" || current.__aimmStatusBridge) return;
    originalRender = current;
    const wrapped = function() {
      originalRender.apply(this,arguments);
      if (snapshot) updateSidebar();
      syncStats();
      renderStatusView();
    };
    wrapped.__aimmStatusBridge = true;
    window.invRenderInventory = wrapped;
  }
  function refreshBridgeView() {
    bindRenderer();
    if (typeof originalRender === "function") originalRender();
    updateSidebar();
    syncStats();
    renderStatusView();
  }
  function renderStatusView() {
    if (synthetic() || !statusScope(currentScope())) return false;
    const host = document.getElementById("invInventory");
    if (!host) return true;
    updateBanner();
    if (!snapshot) {
      host.innerHTML = '<div class="inv-empty">' + esc(loading ? "Loading generation-bound account status records…" : message || "Choose Load account status to read the signed-in account snapshot.") + '</div>';
      return true;
    }
    const rows = filteredRows();
    if (!rows.length) {
      const scope = currentScope();
      const visible = snapshot.records.filter((row) => INV_SHOW_HIDDEN || !row.hidden);
      const scopeRows = visible.filter((row) => key(row) === scope);
      const emptyCopy = {
        updates: "No update-available observations are recorded in this snapshot. This does not mean everything is current; review Unchecked and Stale results.",
        "up-to-date": "No fresh up-to-date observations are recorded in this snapshot. Unchecked and Stale results still need checking.",
        "manual-check": "No records are flagged for a manual vendor comparison in this snapshot.",
        unchecked: "No records are unchecked in this snapshot.",
        stale: "No stale observations are recorded in this snapshot.",
        error: "No failed status checks are recorded in this snapshot."
      };
      const detail = scopeRows.length
        ? "No records in this status match the current search or format filters."
        : emptyCopy[scope] || "No records are available for this view.";
      host.innerHTML = '<div class="inv-empty">' + esc(detail) + '<small style="display:block;margin-top:8px">These are saved account observations; loading this view does not run a vendor check.</small></div>';
      return true;
    }
    const cards = rows.map((row) => {
      const state = key(row), label = labels[state];
      const installed = row.installed_version ? "v" + row.installed_version : "Version unavailable";
      const latest = row.latest_version ? "v" + row.latest_version : "";
      const version = state === "updates" && latest
        ? '<span class="inv-account-installed">' + esc(installed) + '</span><span aria-hidden="true"> → </span><strong class="inv-account-latest">' + esc(latest) + '</strong>'
        : '<span class="inv-account-installed">' + esc(installed) + '</span>';
      const note = state === "stale" ? (row.last_good_latest_version ? "Last known latest: v" + row.last_good_latest_version + " · observation is stale" : "Observation is outside its freshness window")
        : state === "error" ? (row.error_code ? "Check error: " + row.error_code : "The latest check failed")
        : row.comparison_reason || "";
      const checked = row.checked_at ? "Checked " + new Date(row.checked_at).toLocaleString() : "Not checked";
      const generation = row.generation_id ? "Generation " + row.generation_id.slice(0,8) : "Generation unavailable";
      const publisher = row.publisher_name || "Publisher not identified";
      return '<article class="inv-account-status-card ' + state + '" role="listitem"><div class="inv-account-status-main"><span class="inv-account-status-publisher">' + esc(publisher) + '</span><strong class="inv-account-status-product">' + esc(row.name || "Unnamed plug-in") + '</strong><span class="inv-account-status-device">' + esc(row.device || "Unknown device") + '</span></div><div class="inv-account-status-format"><small>Format</small><strong>' + esc(row.format || "Unknown") + '</strong></div><div class="inv-account-status-version"><small>Installed' + (state === "updates" && latest ? " → Available" : "") + '</small><div>' + version + '</div></div><div class="inv-account-status-result"><span class="inv-account-status-badge ' + state + '">' + esc(label) + '</span><small>' + esc(checked) + '</small>' + (note ? '<small>' + esc(note) + '</small>' : '') + '<span class="inv-account-generation" title="' + esc(row.generation_id || "") + '">' + esc(generation) + '</span></div></article>';
    }).join("");
    const devices = new Set(snapshot.records.map((row) => row.device_id).filter(Boolean)).size;
    const generations = new Set(snapshot.records.map((row) => row.generation_id).filter(Boolean)).size;
    const noticeText = message || "Status comes from saved observations. Stale, failed and unknown checks are shown separately; no rows are joined to the local browser scan.";
    host.innerHTML = '<section class="inv-account-status-view"><p class="inv-account-status-summary">' + snapshot.records.length.toLocaleString() + ' format records · ' + devices.toLocaleString() + ' devices · ' + generations.toLocaleString() + ' inventory generations</p><p class="inv-account-status-notice">' + esc(noticeText) + '</p><div class="inv-account-status-list" role="list">' + cards + '</div></section>';
    return true;
  }
  async function loadStatus() {
    if (synthetic()) { message = "This synthetic preview uses sample records; it does not read account status."; return; }
    if (loading) return;
    if (typeof window.aimmReadAccountPluginStatus !== "function") {
      message = "Account status connection is unavailable. Reload AIMM and sign in under Settings → Account Library.";
      refreshBridgeView();
      return;
    }
    loading = true;
    message = "Loading generation-bound account status records…";
    refreshBridgeView();
    try {
      const result = await window.aimmReadAccountPluginStatus({});
      snapshot = {records:Array.isArray(result.records) ? result.records : [], ruleVersion:result.rule_version || null, loadedAt:new Date().toISOString()};
      message = snapshot.records.length
        ? "Loaded " + snapshot.records.length.toLocaleString() + " account format records. The device, inventory generation and record IDs are preserved; local folder scans are separate."
        : "No account status records were returned. Pair a device and complete an inventory scan, then load status again.";
    } catch (error) {
      snapshot = null;
      message = (error?.message || "The account status request failed.") + " Sign in under Settings → Account Library, then load account status again.";
    } finally {
      loading = false;
      refreshBridgeView();
    }
  }
  const liveInstallState = { overlay:null, queue:new Set(), actions:new Map(), busy:false, restoreFocus:null };
  function liveInstallRows() {
    return (snapshot?.records || []).filter((row) => key(row) === "updates" && (INV_SHOW_HIDDEN || !row.hidden));
  }
  function liveInstallCounts() {
    const counts = {updates:0,"up-to-date":0,"manual-check":0,unchecked:0,stale:0,error:0};
    (snapshot?.records || []).forEach((row) => { if (INV_SHOW_HIDDEN || !row.hidden) counts[key(row)]++; });
    return counts;
  }
  function liveInstallClose() {
    if (!liveInstallState.overlay) return;
    liveInstallState.overlay.removeEventListener("click",liveInstallClick);
    liveInstallState.overlay.removeEventListener("keydown",liveInstallKey);
    liveInstallState.overlay.remove();
    liveInstallState.overlay = null;
    liveInstallState.queue.clear();
    liveInstallState.actions.clear();
    if (liveInstallState.restoreFocus?.isConnected) liveInstallState.restoreFocus.focus();
  }
  function liveInstallRender(message = "") {
    const overlay = liveInstallState.overlay;
    if (!overlay) return;
    const counts = liveInstallCounts();
    const rows = liveInstallRows();
    const vendors = Array.from(new Set(rows.map((row) => row.publisher_name || "Publisher not identified"))).sort();
    const queueRows = Array.from(liveInstallState.queue).map((id) => rows.find((row) => [row.device_id,row.generation_id,row.record_id].join("|") === id)).filter(Boolean);
    const grouped = vendors.map((vendor) => {
      const items = rows.filter((row) => (row.publisher_name || "Publisher not identified") === vendor);
      return '<section class="aimm-live-im-vendor"><header><strong>' + esc(vendor) + '</strong><span>' + items.length.toLocaleString() + ' update ' + (items.length === 1 ? 'record' : 'records') + '</span></header>' +
        items.map((row) => {
          const id = [row.device_id,row.generation_id,row.record_id].join("|");
          const state = liveInstallState.actions.get(id);
          const installed = row.installed_version ? "v" + row.installed_version : "Version unavailable";
          const latest = row.latest_version ? "v" + row.latest_version : "Latest version unavailable";
          const name = esc(row.name || "Unnamed plug-in");
          const format = esc(row.format || "Unknown format");
          const device = esc(row.device || "Unknown device");
          const actionText = state ? esc(state.message) : "";
          return '<article class="aimm-live-im-row"><div class="aimm-live-im-product"><strong>' + name + '</strong><span>' + device + '</span></div><div class="aimm-live-im-format"><small>Format</small><strong>' + format + '</strong></div><div class="aimm-live-im-version"><small>Installed → available</small><strong><span>' + esc(installed) + '</span> <b>→ ' + esc(latest) + '</b></strong>' + (row.paid_upgrade ? '<em>Paid upgrade</em>' : '') + '</div><div class="aimm-live-im-actions"><button type="button" data-live-im-queue="' + esc(id) + '"' + (liveInstallState.queue.has(id) ? ' disabled' : '') + '>Queue page</button><button type="button" class="primary" data-live-im-open="' + esc(id) + '"' + (liveInstallState.busy ? ' disabled' : '') + '>Open vendor page</button>' + (state?.operation_id ? '<button type="button" data-live-im-refresh="' + esc(id) + '">Refresh request</button>' : '') + (actionText ? '<small role="status">' + actionText + '</small>' : '') + '</div></article>';
        }).join("") + '</section>';
    }).join("");
    const content = rows.length
      ? grouped
      : '<div class="aimm-live-im-empty"><strong>No fresh update records are available.</strong><p>' +
          counts.stale.toLocaleString() + ' observations are stale and ' + counts.unchecked.toLocaleString() +
          ' are unchecked. Zero updates does not mean everything is current. Review those scopes for the next status check.</p></div>';
    overlay.innerHTML = '<section class="aimm-live-im-shell" role="dialog" aria-modal="true" aria-labelledby="aimmLiveIMTitle"><header class="aimm-live-im-head"><div><h2 id="aimmLiveIMTitle">Install Manager</h2><p>' +
      (snapshot ? rows.length.toLocaleString() + ' fresh update records · account snapshot' : 'Account status is not loaded') +
      '</p></div><div class="aimm-live-im-tools"><button type="button" data-live-im-queue-all' + (!rows.length ? ' disabled' : '') + '>Queue all</button><button type="button" data-live-im-clear' + (!queueRows.length ? ' disabled' : '') + '>Clear queue</button><button type="button" class="primary" data-live-im-done>Done</button></div></header>' +
      '<div class="aimm-live-im-notice"><strong>Vendor pages open through your paired Companion and wait for its local confirmation.</strong><span>Download and install actions are not connected. No file is downloaded or opened by this manager.</span></div>' +
      '<div class="aimm-live-im-summary"><div><small>Updates</small><strong class="updates">' + counts.updates.toLocaleString() + '</strong></div><div><small>Up to date</small><strong class="current">' + counts["up-to-date"].toLocaleString() + '</strong></div><div><small>Manual check</small><strong class="manual">' + counts["manual-check"].toLocaleString() + '</strong></div><div><small>Stale / unchecked</small><strong>' + counts.stale.toLocaleString() + ' / ' + counts.unchecked.toLocaleString() + '</strong></div></div>' +
      (message ? '<p class="aimm-live-im-message" role="status">' + esc(message) + '</p>' : '') +
      '<div class="aimm-live-im-body"><main class="aimm-live-im-list">' + content + '</main><aside class="aimm-live-im-queue"><h3>VENDOR PAGE QUEUE <span>' + queueRows.length.toLocaleString() + '</span></h3>' +
      (queueRows.length ? '<ol>' + queueRows.map((row) => '<li>' + esc(row.name || "Unnamed plug-in") + ' · ' + esc(row.publisher_name || "Publisher not identified") + '<button type="button" data-live-im-remove="' + esc([row.device_id,row.generation_id,row.record_id].join("|")) + '" aria-label="Remove from queue">×</button></li>').join("") + '</ol><button type="button" class="primary" data-live-im-next' + (liveInstallState.busy ? ' disabled' : '') + '>Request next vendor page</button>' : '<p>No vendor pages are queued.</p>') +
      '<small>Requests are sent one at a time. The paired Companion must be online to receive a request; it shows a local confirmation before opening the vendor page.</small></aside></div></section>';
  }
  function liveInstallClick(event) {
    if (event.target === liveInstallState.overlay) { liveInstallClose(); return; }
    const target = event.target.closest("button");
    if (!target) return;
    if (target.hasAttribute("data-live-im-done")) { liveInstallClose(); return; }
    if (target.hasAttribute("data-live-im-clear")) { liveInstallState.queue.clear(); liveInstallRender(); return; }
    if (target.hasAttribute("data-live-im-queue-all")) {
      liveInstallRows().forEach((row) => liveInstallState.queue.add([row.device_id,row.generation_id,row.record_id].join("|")));
      liveInstallRender(); return;
    }
    if (target.hasAttribute("data-live-im-remove")) { liveInstallState.queue.delete(target.dataset.liveImRemove); liveInstallRender(); return; }
    const id = target.dataset.liveImQueue || target.dataset.liveImOpen || target.dataset.liveImRefresh;
    if (target.hasAttribute("data-live-im-queue")) { liveInstallState.queue.add(id); liveInstallRender(); return; }
    if (target.hasAttribute("data-live-im-open") || target.hasAttribute("data-live-im-next")) {
      const selected = target.hasAttribute("data-live-im-next") ? Array.from(liveInstallState.queue)[0] : id;
      const row = liveInstallRows().find((item) => [item.device_id,item.generation_id,item.record_id].join("|") === selected);
      if (row) void liveInstallRequest(row,selected);
      return;
    }
    if (target.hasAttribute("data-live-im-refresh")) {
      const saved = liveInstallState.actions.get(id);
      if (saved?.operation_id) void liveInstallRefresh(id,saved.operation_id);
    }
  }
  async function liveInstallRequest(row,id) {
    if (liveInstallState.busy) return;
    liveInstallState.busy = true;
    liveInstallState.actions.set(id,{message:"Requesting vendor page…"});
    liveInstallRender();
    try {
      if (typeof window.aimmRequestAccountVendorPage !== "function") throw new Error("The account action bridge is unavailable. Reload AIMM and sign in.");
      const result = await window.aimmRequestAccountVendorPage({device_id:row.device_id,record_id:row.record_id});
      liveInstallState.queue.delete(id);
      liveInstallState.actions.set(id,{operation_id:result.operation_id,state:result.state,message:"Request " + (result.state || "queued") + ". The paired Companion must receive it and ask for local confirmation."});
    } catch (error) {
      liveInstallState.actions.set(id,{message:error?.message || "The vendor-page request failed."});
    } finally { liveInstallState.busy = false; liveInstallRender(); }
  }
  async function liveInstallRefresh(id,operationID) {
    if (liveInstallState.busy) return;
    liveInstallState.busy = true;
    liveInstallState.actions.set(id,{operation_id:operationID,message:"Refreshing request…"});
    liveInstallRender();
    try {
      if (typeof window.aimmReadAccountPluginAction !== "function") throw new Error("The account action bridge is unavailable.");
      const result = await window.aimmReadAccountPluginAction({operation_id:operationID});
      const action = result.action || result;
      liveInstallState.actions.set(id,{operation_id:operationID,state:action.state,message:"Request " + (action.state || "status unavailable") + (action.receipt?.message ? " · " + action.receipt.message : "")});
    } catch (error) {
      liveInstallState.actions.set(id,{operation_id:operationID,message:error?.message || "Could not refresh the request."});
    } finally { liveInstallState.busy = false; liveInstallRender(); }
  }
  function liveInstallKey(event) { if (event.key === "Escape") { event.preventDefault(); liveInstallClose(); } }
  async function openLiveInstallManager() {
    if (liveInstallState.overlay) return;
    if (!snapshot) await loadStatus();
    liveInstallState.restoreFocus = document.activeElement;
    liveInstallState.overlay = document.createElement("div");
    liveInstallState.overlay.id = "aimmLiveInstallManagerOverlay";
    liveInstallState.overlay.addEventListener("click",liveInstallClick);
    liveInstallState.overlay.addEventListener("keydown",liveInstallKey);
    document.body.append(liveInstallState.overlay);
    liveInstallRender(message || "");
    liveInstallState.overlay.querySelector("[data-live-im-done]")?.focus();
  }
  function bindLiveInstallManager() {
    if (synthetic()) return;
    const button = document.querySelector("[data-inv-install-manager]");
    if (!button || button.__aimmLiveInstallManager) return;
    button.disabled = false;
    button.title = "Open the account-backed Install Manager. Fresh updates are shown; vendor pages require local Companion confirmation.";
    button.setAttribute("aria-label","Install Manager — account-backed update records and vendor page requests");
    button.__aimmLiveInstallManager = true;
    button.addEventListener("click",(event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void openLiveInstallManager();
    },true);
  }
  const liveManagerStyle = document.createElement("style");
  liveManagerStyle.id = "aimm-live-install-manager-styles";
  liveManagerStyle.textContent = `
    #aimmLiveInstallManagerOverlay{position:fixed;inset:0;z-index:20004;display:grid;place-items:center;padding:20px;background:rgba(5,7,11,.84)}
    #aimmLiveInstallManagerOverlay .aimm-live-im-shell{display:grid;grid-template-rows:auto auto auto auto minmax(0,1fr);width:min(1420px,96vw);height:min(900px,92vh);overflow:hidden;border:1px solid #38404a;border-radius:14px;background:#191d22;color:#e8edf2;box-shadow:0 20px 70px rgba(0,0,0,.6)}
    #aimmLiveInstallManagerOverlay h2,#aimmLiveInstallManagerOverlay h3,#aimmLiveInstallManagerOverlay p{margin:0}
    #aimmLiveInstallManagerOverlay button{min-height:34px;padding:7px 11px;border:1px solid #414a55;border-radius:7px;background:#252a31;color:#dfe6ed;cursor:pointer;font:inherit;font-size:12px}
    #aimmLiveInstallManagerOverlay button:hover:not(:disabled){border-color:#5aa4d5;background:#253342}
    #aimmLiveInstallManagerOverlay button:disabled{opacity:.5;cursor:not-allowed}
    #aimmLiveInstallManagerOverlay button.primary{border-color:#3187bd;background:#143b53;color:#eaf7ff}
    #aimmLiveInstallManagerOverlay .aimm-live-im-head{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:18px 20px;border-bottom:1px solid #343b45}
    #aimmLiveInstallManagerOverlay .aimm-live-im-head h2{font-size:20px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-head p{margin-top:5px;color:#96a1ad;font-size:13px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-tools{display:flex;gap:8px;flex-wrap:wrap}
    #aimmLiveInstallManagerOverlay .aimm-live-im-notice{display:grid;gap:5px;padding:14px 20px;border-bottom:1px solid #344454;background:#17232e;color:#d5e3ef;font-size:13px;line-height:1.45}
    #aimmLiveInstallManagerOverlay .aimm-live-im-notice span{color:#a9b7c5}
    #aimmLiveInstallManagerOverlay .aimm-live-im-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:16px 20px;border-bottom:1px solid #343b45}
    #aimmLiveInstallManagerOverlay .aimm-live-im-summary>div{display:grid;gap:6px;min-width:0;padding:14px 16px;border:1px solid #333b44;border-radius:10px;background:#1f242a}
    #aimmLiveInstallManagerOverlay .aimm-live-im-summary small{color:#98a3af;font-size:11px;letter-spacing:.03em}
    #aimmLiveInstallManagerOverlay .aimm-live-im-summary strong{font-size:22px;color:#aeb7c2}
    #aimmLiveInstallManagerOverlay .aimm-live-im-summary .updates{color:#ee7777}
    #aimmLiveInstallManagerOverlay .aimm-live-im-summary .current{color:#42c995}
    #aimmLiveInstallManagerOverlay .aimm-live-im-summary .manual{color:#e8b45a}
    #aimmLiveInstallManagerOverlay .aimm-live-im-message{padding:10px 20px;color:#ef999e}
    #aimmLiveInstallManagerOverlay .aimm-live-im-body{display:grid;grid-template-columns:minmax(0,1fr) 330px;min-height:0}
    #aimmLiveInstallManagerOverlay .aimm-live-im-list{overflow:auto;display:grid;align-content:start;gap:12px;padding:18px 20px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-vendor{border:1px solid #333c46;border-radius:11px;background:#1e2329;overflow:hidden}
    #aimmLiveInstallManagerOverlay .aimm-live-im-vendor>header{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #323a44}
    #aimmLiveInstallManagerOverlay .aimm-live-im-vendor>header strong{font-size:15px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-vendor>header span{color:#95a1ad;font-size:12px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-row{display:grid;grid-template-columns:minmax(180px,1.3fr) minmax(110px,.55fr) minmax(190px,1fr) minmax(190px,1.1fr);gap:16px;align-items:center;padding:16px 18px;border-bottom:1px solid #323a44}
    #aimmLiveInstallManagerOverlay .aimm-live-im-row:last-child{border-bottom:0}
    #aimmLiveInstallManagerOverlay .aimm-live-im-product,#aimmLiveInstallManagerOverlay .aimm-live-im-format,#aimmLiveInstallManagerOverlay .aimm-live-im-version,#aimmLiveInstallManagerOverlay .aimm-live-im-actions{display:grid;gap:6px;min-width:0}
    #aimmLiveInstallManagerOverlay .aimm-live-im-product strong{font-size:15px;line-height:1.35;overflow-wrap:anywhere}
    #aimmLiveInstallManagerOverlay .aimm-live-im-product span,#aimmLiveInstallManagerOverlay .aimm-live-im-format small,#aimmLiveInstallManagerOverlay .aimm-live-im-version small,#aimmLiveInstallManagerOverlay .aimm-live-im-actions small{color:#96a1ad;font-size:12px;line-height:1.4;overflow-wrap:anywhere}
    #aimmLiveInstallManagerOverlay .aimm-live-im-format strong{font-size:13px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-version strong{display:flex;flex-wrap:wrap;gap:5px;font:13px ui-monospace,SFMono-Regular,Menlo,monospace}
    #aimmLiveInstallManagerOverlay .aimm-live-im-version b{color:#f0787e}
    #aimmLiveInstallManagerOverlay .aimm-live-im-version em{color:#e8b45a;font-size:11px;font-style:normal}
    #aimmLiveInstallManagerOverlay .aimm-live-im-actions{grid-template-columns:1fr 1fr;gap:7px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-actions small{grid-column:1/-1}
    #aimmLiveInstallManagerOverlay .aimm-live-im-queue{display:flex;flex-direction:column;gap:12px;min-width:0;padding:18px;border-left:1px solid #343b45;background:#15191e;overflow:auto}
    #aimmLiveInstallManagerOverlay .aimm-live-im-queue h3{display:flex;justify-content:space-between;font-size:12px;letter-spacing:.08em}
    #aimmLiveInstallManagerOverlay .aimm-live-im-queue ol{margin:0;padding-left:22px;color:#aeb8c2}
    #aimmLiveInstallManagerOverlay .aimm-live-im-queue li{padding:7px 0;line-height:1.45}
    #aimmLiveInstallManagerOverlay .aimm-live-im-queue li button{float:right;min-height:24px;padding:1px 7px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-queue>small,#aimmLiveInstallManagerOverlay .aimm-live-im-queue>p{color:#9aa4af;font-size:12px;line-height:1.5}
    #aimmLiveInstallManagerOverlay .aimm-live-im-empty{display:grid;gap:8px;align-content:start;padding:22px;border:1px dashed #3a444f;border-radius:10px;color:#d6dde5}
    #aimmLiveInstallManagerOverlay .aimm-live-im-empty p{color:#a4afba;font-size:13px;line-height:1.55}
    @media(max-width:900px){#aimmLiveInstallManagerOverlay .aimm-live-im-summary{grid-template-columns:repeat(2,minmax(0,1fr))}#aimmLiveInstallManagerOverlay .aimm-live-im-row{grid-template-columns:minmax(0,1fr) minmax(110px,.6fr);gap:12px}}
    @media(max-width:620px){#aimmLiveInstallManagerOverlay{padding:8px}#aimmLiveInstallManagerOverlay .aimm-live-im-shell{width:100%;height:96vh;grid-template-rows:auto auto auto auto minmax(0,1fr)}#aimmLiveInstallManagerOverlay .aimm-live-im-head{align-items:flex-start;flex-direction:column;padding:14px}#aimmLiveInstallManagerOverlay .aimm-live-im-notice{padding:12px 14px}#aimmLiveInstallManagerOverlay .aimm-live-im-summary{padding:12px 14px;gap:8px}#aimmLiveInstallManagerOverlay .aimm-live-im-body{grid-template-columns:minmax(0,1fr)}#aimmLiveInstallManagerOverlay .aimm-live-im-queue{border-left:0;border-top:1px solid #343b45}#aimmLiveInstallManagerOverlay .aimm-live-im-row{grid-template-columns:minmax(0,1fr);gap:10px;padding:14px}}
  `;
  document.head.append(liveManagerStyle);

  function install() {
    const nav = document.querySelector('#library nav[aria-label="Inventory status"]');
    const unchecked = nav?.querySelector('[data-inv-scope="unchecked"]');
    if (nav && unchecked) {
      let scopeAnchor = unchecked;
      const addScope = (scope, label, icon, title) => {
        if (nav.querySelector('[data-inv-scope="' + scope + '"]')) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "inv-side-button";
        button.dataset.invScope = scope;
        button.title = title;
        button.setAttribute("aria-label", label);
        button.innerHTML = '<span class="inv-side-icon" aria-hidden="true">' + icon + '</span><span class="inv-side-label">' + label + '</span><span class="inv-side-count" id="invSidebar' + (scope === "stale" ? "Stale" : "Error") + 'Count">0</span>';
        scopeAnchor.insertAdjacentElement("afterend", button);
        scopeAnchor = button;
      };
      addScope("stale","Stale results",'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',"Last known observations are older than the freshness window");
      addScope("error","Check errors",'<svg viewBox="0 0 24 24"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>',"The latest status check returned an error");
    }
    const scan = document.getElementById("invScanBtn");
    if (scan?.parentElement && !document.getElementById("invLoadAccountStatusBtn")) {
      const button = document.createElement("button");
      button.id = "invLoadAccountStatusBtn";
      button.type = "button";
      button.className = "inv-btn";
      button.textContent = "Load account status";
      button.addEventListener("click",loadStatus);
      const note = document.createElement("span");
      note.id = "invAccountStatusNotice";
      note.className = "inv-small";
      note.setAttribute("role","status");
      note.setAttribute("aria-live","polite");
      note.textContent = "Account observations load separately from folders scanned in this browser.";
      scan.insertAdjacentElement("afterend",button);
      button.insertAdjacentElement("afterend",note);
    }
    bindLiveInstallManager();
    if (synthetic()) {
      const button = document.getElementById("invLoadAccountStatusBtn");
      const note = document.getElementById("invAccountStatusNotice");
      if (button) button.hidden = true;
      if (note) note.textContent = "Synthetic sample · account status is not read";
    }
    bindRenderer();
    const sidebar = document.getElementById("invSidebar");
    sidebar?.addEventListener("click",(event) => {
      const button = event.target.closest("[data-inv-scope]");
      if (button && statusScope(button.dataset.invScope) && !synthetic() && !snapshot && !loading) setTimeout(loadStatus,0);
    },true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();