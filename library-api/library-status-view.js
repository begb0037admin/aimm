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
      if (button) button.setAttribute("aria-label", labels[scope] + ": " + counts[scope].toLocaleString() + " account format records");
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
      host.innerHTML = '<div class="inv-empty">No format records match this status and filter.<small>Use the status list on the left to see another result group.</small></div>';
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
      if (originalRender) originalRender();
      return;
    }
    loading = true;
    message = "Loading generation-bound account status records…";
    if (originalRender) originalRender();
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
      if (originalRender) originalRender();
    }
  }
  function install() {
    const nav = document.querySelector('#library nav[aria-label="Inventory status"]');
    const unchecked = nav?.querySelector('[data-inv-scope="unchecked"]');
    if (nav && unchecked) {
      const addScope = (scope, label, icon, title) => {
        if (nav.querySelector('[data-inv-scope="' + scope + '"]')) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "inv-side-button";
        button.dataset.invScope = scope;
        button.title = title;
        button.setAttribute("aria-label", label);
        button.innerHTML = '<span class="inv-side-icon" aria-hidden="true">' + icon + '</span><span class="inv-side-label">' + label + '</span><span class="inv-side-count" id="invSidebar' + (scope === "stale" ? "Stale" : "Error") + 'Count">0</span>';
        unchecked.insertAdjacentElement("afterend", button);
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
    if (synthetic()) {
      const button = document.getElementById("invLoadAccountStatusBtn");
      const note = document.getElementById("invAccountStatusNotice");
      if (button) button.hidden = true;
      if (note) note.textContent = "Synthetic sample · account status is not read";
    }
    originalRender = window.invRenderInventory;
    if (typeof originalRender === "function") {
      window.invRenderInventory = function() {
        originalRender.apply(this,arguments);
        if (snapshot) updateSidebar();
        syncStats();
        renderStatusView();
      };
    }
    const sidebar = document.getElementById("invSidebar");
    sidebar?.addEventListener("click",(event) => {
      const button = event.target.closest("[data-inv-scope]");
      if (button && statusScope(button.dataset.invScope) && !synthetic() && !snapshot && !loading) setTimeout(loadStatus,0);
    },true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();