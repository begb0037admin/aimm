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
    #library .inv-cards{gap:16px;margin-top:14px}
    #library .inv-vendor{border-radius:12px}
    #library .inv-vendor-head{gap:10px;padding:12px 14px}
    #library .inv-logo{width:32px;height:32px;border-radius:7px;font-size:12px}
    #library .inv-logo img{inset:5px;width:22px;height:22px}
    #library .inv-vendor-name strong{font-size:14px;line-height:1.3;font-weight:700}
    #library .inv-vendor-name small{margin-top:3px;font-size:11px;line-height:1.35}
    #library .inv-vendor-count{min-width:28px;padding:4px 7px;text-align:center;font-size:11px}
    #library .inv-vendor-toggle{padding:4px 3px}
    #library .inv-product{padding:12px 14px}
    #library .inv-product-line{gap:9px}
    #library .inv-name{font-size:14px;line-height:1.35;font-weight:700}
    #library .inv-version{font-size:11px}
    #library .inv-meta{margin-top:5px;font-size:11px;line-height:1.4}
    #library .inv-formats{gap:7px;margin-top:8px;align-items:center}
    #library .inv-chip{padding:3px 7px;border-radius:5px;font-size:10px}
    #library .inv-chip.vst{border-color:#2d76a6;background:#1f5f86}
    #library .inv-chip.clap{border-color:#80602b;background:#62461c}
    #library .inv-fav{font-size:16px;padding:1px 3px}
    #library .inv-more{padding:9px 14px;font-size:10px}
    #library .inv-cards-quick{min-height:36px;padding:7px 14px;font-size:12px;font-weight:700;white-space:nowrap}
    #library .inv-sidebar-nav{gap:8px!important}
    #library .inv-sidebar-nav[aria-label="Plug-in categories"]{gap:8px!important}
    #library .inv-side-button{min-height:44px!important;padding-inline:12px!important;gap:12px!important}
    #invSidebar a[data-aimm-ilok-tool]{text-decoration:none!important}
    #aimmPluginHubLicenseOverlay{position:fixed;inset:0;z-index:20010;display:grid;place-items:center;padding:20px;background:rgba(5,7,11,.78)}
    #aimmPluginHubLicenseOverlay section{display:grid;gap:14px;width:min(560px,calc(100vw - 40px));padding:22px;border:1px solid #3b4653;border-radius:14px;background:#1b2026;color:#e8edf2;box-shadow:0 20px 70px rgba(0,0,0,.55);line-height:1.55}
    #aimmPluginHubLicenseOverlay header{display:flex;align-items:center;justify-content:space-between;gap:16px}
    #aimmPluginHubLicenseOverlay h2,#aimmPluginHubLicenseOverlay p{margin:0}
    #aimmPluginHubLicenseOverlay h2{font-size:20px}
    #aimmPluginHubLicenseOverlay p{color:#aeb8c4}
    #aimmPluginHubLicenseOverlay a{justify-self:start;padding:9px 12px;border:1px solid #3e83b4;border-radius:8px;color:#a8d9ff;text-decoration:none}
    #aimmPluginHubLicenseOverlay button{min-width:34px;min-height:34px;border:1px solid #414a55;border-radius:7px;background:#252a31;color:#dfe6ed;font:inherit;cursor:pointer}
    #library .inv-sidebar-section{margin:20px 0 10px!important}
    #library .inv-view-menu.inv-view-open-up .inv-view-panel{top:calc(100% + 8px)!important;bottom:auto!important;max-height:min(560px,calc(100vh - 660px))!important}
    #library .inv-product-line{grid-template-columns:minmax(0,1fr) 24px 20px!important;align-items:start!important;column-gap:9px!important;row-gap:7px!important}
    #library .inv-name{grid-column:1!important;grid-row:1!important;font-size:15px!important;line-height:1.35!important;font-weight:700!important;overflow-wrap:anywhere!important}
    #library .inv-version{grid-column:1/-1!important;grid-row:2!important;width:100%!important;max-width:none!important;margin:0!important;align-self:start!important;font-size:11px!important;line-height:1.45!important}
    #library .inv-version-status{gap:5px!important;line-height:1.45!important}
    #library .inv-version-row{grid-template-columns:4.2em minmax(0,1fr)!important;column-gap:8px!important;align-items:baseline!important}
    #library .inv-version-values{white-space:nowrap!important}
    #library .inv-fav{grid-column:2!important;grid-row:1!important;justify-self:center!important}
    #library .inv-product-actions{grid-column:3!important;grid-row:1!important;justify-self:center!important}
    #library .inv-hidden-badge{grid-column:1!important;grid-row:1!important;justify-self:start!important;align-self:end!important}
    @media(max-width:680px){#library .inv-product-line{grid-template-columns:minmax(0,1fr) 24px 20px!important}#library .inv-version{grid-column:1/-1!important;grid-row:2!important;width:100%!important}}
    @media(max-width:900px){#library .inv-account-status-card{grid-template-columns:minmax(0,1fr) minmax(100px,.5fr);gap:12px}}
    @media(max-width:560px){#library .inv-account-status-card{grid-template-columns:minmax(0,1fr);gap:10px;padding:15px}}
  `;
  const style = document.createElement("style");
  style.id = "inv-account-status-bridge-styles";
  style.textContent = css;
  document.head.appendChild(style);

  function aimmLayoutInventoryTiles(grid, keepCols) {
    if (!grid) return;
    const GAP = 14, MIN = 268;
    const css = getComputedStyle(grid);
    const padL = parseFloat(css.paddingLeft) || 0, padR = parseFloat(css.paddingRight) || 0;
    const padT = parseFloat(css.paddingTop) || 0, padB = parseFloat(css.paddingBottom) || 0;
    const inner = grid.clientWidth - padL - padR;
    if (inner <= 0) return;
    const cols = Math.min(4, Math.max(1, Math.floor((inner + GAP) / (MIN + GAP))));
    const colW = (inner - GAP * (cols - 1)) / cols;
    if (grid._invTileCols !== cols || Math.abs((grid._invTileColW || 0) - colW) > 0.5) keepCols = false;
    grid._invTileCols = cols;
    grid._invTileColW = colW;
    const cards = Array.from(grid.children).filter((card) => card.classList?.contains("inv-vendor"));
    const hidden = (card) => card.style.display === "none" || card.classList.contains("inv-filtered") || getComputedStyle(card).display === "none";
    const visKey = cards.map((card,index) => hidden(card) ? "" : index).filter((index) => index !== "").join(",");
    if (grid._invTileVisKey !== visKey) { grid._invTileVisKey = visKey; keepCols = false; }
    const heights = new Array(cols).fill(0);
    cards.forEach((card) => {
      if (hidden(card)) { card._invTileCol = -1; return; }
      card.style.width = colW + "px";
      let col = keepCols && Number.isInteger(card._invTileCol) && card._invTileCol >= 0 && card._invTileCol < cols ? card._invTileCol : -1;
      if (col < 0) { col = 0; for (let n = 1; n < cols; n++) if (heights[n] < heights[col]) col = n; }
      card._invTileCol = col;
      card.style.left = (padL + col * (colW + GAP)) + "px";
      card.style.top = (padT + heights[col]) + "px";
      heights[col] += card.offsetHeight + GAP;
    });
    const tallest = Math.max(0, ...heights);
    grid.style.height = (padT + Math.max(0, tallest - GAP) + padB) + "px";
    grid.classList.remove("inv-tiles-unplaced");
  }
  if (typeof window.invTileLayoutGrid === "function") {
    window.invTileLayoutGrid = aimmLayoutInventoryTiles;
    document.querySelectorAll("#invInventory .inv-cards").forEach((grid) => aimmLayoutInventoryTiles(grid, false));
  }

  function aimmSyncCardsShortcut() {
    const button = document.getElementById("invCardsQuickBtn");
    if (!button) return;
    const selected = button.getAttribute("aria-pressed") === "true" || button.classList.contains("active");
    const label = selected ? "Cards" : "Back to Cards";
    if (button.textContent.trim() !== label) button.textContent = label;
    button.setAttribute("aria-label", selected ? "Cards view selected. Choose another layout in View options." : "Return to Cards view.");
    button.title = selected ? "Cards view selected" : "Return to the publisher card tiles";
  }
  const cardsStateObserver = new MutationObserver(() => aimmSyncCardsShortcut());
  cardsStateObserver.observe(document.documentElement, {childList:true,subtree:true,attributes:true,attributeFilter:["class","aria-pressed"]});
  function aimmInstallCardsShortcut() {
    const original = window.invRenderInventory;
    if (typeof original !== "function" || original.__aimmCardsShortcutWrapped) return false;
    const wrapped = function (...args) {
      const result = original.apply(this, args);
      aimmSyncCardsShortcut();
      return result;
    };
    wrapped.__aimmCardsShortcutWrapped = true;
    window.invRenderInventory = wrapped;
    aimmSyncCardsShortcut();
    return true;
  }
  if (!aimmInstallCardsShortcut()) {
    const cardsShortcutObserver = new MutationObserver(() => {
      if (aimmInstallCardsShortcut()) cardsShortcutObserver.disconnect();
    });
    cardsShortcutObserver.observe(document.documentElement, {childList:true,subtree:true});
  }

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
      if (typeof bindLiveInstallManager === "function") bindLiveInstallManager();
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
          return '<article class="aimm-live-im-row"><div class="aimm-live-im-product"><strong>' + name + '</strong><span>' + device + '</span></div><div class="aimm-live-im-format"><small>Format</small><strong>' + format + '</strong></div><div class="aimm-live-im-version"><small>Installed → available</small><strong><span>' + esc(installed) + '</span> <b>→ ' + esc(latest) + '</b></strong>' + (row.paid_upgrade ? '<em>Paid upgrade</em>' : '') + '</div><div class="aimm-live-im-actions"><button type="button" data-live-im-hub="' + esc(id) + '" aria-label="Request local vendor app for ' + name + '"' + (liveInstallState.busy ? ' disabled' : '') + '>Choose vendor app…</button><button type="button" data-live-im-queue="' + esc(id) + '"' + (liveInstallState.queue.has(id) ? ' disabled' : '') + '>Queue page</button><button type="button" class="primary" data-live-im-open="' + esc(id) + '"' + (liveInstallState.busy ? ' disabled' : '') + '>Open vendor page</button>' + (state?.operation_id ? '<button type="button" data-live-im-refresh="' + esc(id) + '">Refresh request</button>' : '') + (actionText ? '<small role="status">' + actionText + '</small>' : '') + '</div></article>';
        }).join("") + '</section>';
    }).join("");
    const content = rows.length
      ? grouped
      : !snapshot
        ? '<div class="aimm-live-im-empty"><strong>Account status has not loaded.</strong><p>Load account status from the Library before reviewing updates. No vendor check has run in this manager.</p></div>'
        : '<div class="aimm-live-im-empty"><strong>No fresh update records are available.</strong><p>' +
          counts.stale.toLocaleString() + ' observations are stale and ' + counts.unchecked.toLocaleString() +
          ' are unchecked. Zero updates does not mean everything is current. Review those scopes for the next status check.</p></div>';
    overlay.innerHTML = '<section class="aimm-live-im-shell" role="dialog" aria-modal="true" aria-labelledby="aimmLiveIMTitle"><header class="aimm-live-im-head"><div><h2 id="aimmLiveIMTitle">Install Manager</h2><p>' +
      (snapshot ? rows.length.toLocaleString() + ' fresh update records · account snapshot' : 'Account status is not loaded') +
      '</p></div><div class="aimm-live-im-tools"><button type="button" data-live-im-queue-all' + (!rows.length ? ' disabled' : '') + '>Queue all</button><button type="button" data-live-im-clear' + (!queueRows.length ? ' disabled' : '') + '>Clear queue</button><button type="button" class="primary" data-live-im-done>Done</button></div></header>' +
      '<div class="aimm-live-im-notice"><strong>Vendor pages open through your paired Companion and wait for its local confirmation.</strong><span>Download and install actions are not connected. No file is downloaded or opened by this manager.</span></div>' +
      '<div class="aimm-live-im-summary"><div><small>Updates</small><strong class="updates">' + (snapshot ? counts.updates.toLocaleString() : '—') + '</strong></div><div><small>Up to date</small><strong class="current">' + (snapshot ? counts["up-to-date"].toLocaleString() : '—') + '</strong></div><div><small>Manual check</small><strong class="manual">' + (snapshot ? counts["manual-check"].toLocaleString() : '—') + '</strong></div><div><small>Stale / unchecked</small><strong>' + (snapshot ? counts.stale.toLocaleString() + ' / ' + counts.unchecked.toLocaleString() : '—') + '</strong></div></div>' +
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
    const id = target.dataset.liveImQueue || target.dataset.liveImOpen || target.dataset.liveImHub || target.dataset.liveImRefresh;
    if (target.hasAttribute("data-live-im-queue")) { liveInstallState.queue.add(id); liveInstallRender(); return; }
    if (target.hasAttribute("data-live-im-hub")) {
      const row = liveInstallRows().find((item) => [item.device_id,item.generation_id,item.record_id].join("|") === id);
      if (row) void liveInstallRequest(row,id,"launch_hub");
      return;
    }
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
  async function liveInstallRequest(row,id,kind = "open_vendor_site") {
    if (liveInstallState.busy) return;
    liveInstallState.busy = true;
    liveInstallState.actions.set(id,{message:kind === "launch_hub" ? "Requesting vendor app…" : "Requesting vendor page…"});
    liveInstallRender();
    try {
      const bridge = kind === "launch_hub" ? window.aimmRequestAccountHubLaunch : window.aimmRequestAccountVendorPage;
      if (typeof bridge !== "function") throw new Error("The account action bridge is unavailable. Reload AIMM and sign in.");
      const result = await bridge({device_id:row.device_id,record_id:row.record_id});
      liveInstallState.queue.delete(id);
      const nextStep = kind === "launch_hub"
        ? "The paired Companion must choose and confirm the local vendor app before opening it."
        : "The paired Companion must receive it and ask for local confirmation.";
      liveInstallState.actions.set(id,{operation_id:result.operation_id,state:result.state,kind,message:"Request " + (result.state || "queued") + ". " + nextStep});
    } catch (error) {
      liveInstallState.actions.set(id,{message:error?.message || (kind === "launch_hub" ? "The vendor-app request failed." : "The vendor-page request failed.")});
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
    if (new URLSearchParams(window.location.search).get("pluginhub-preview") === "synthetic") return;
    const button = document.querySelector("[data-inv-install-manager]");
    if (!button) return;
    if (button.__aimmLiveInstallManager) {
      button.disabled = false;
      button.title = "Open the account-backed Install Manager. Fresh updates are shown; vendor pages require local Companion confirmation.";
      button.setAttribute("aria-label","Install Manager — account-backed update records and vendor page requests");
      return;
    }
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

    #aimmLiveInstallManagerOverlay .aimm-live-im-filter{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid #343b45;background:#171b20}
    #aimmLiveInstallManagerOverlay .aimm-live-im-filter label{font-size:10px;font-weight:700;letter-spacing:.12em;color:#8f9aa7}
    #aimmLiveInstallManagerOverlay .aimm-live-im-filter select{min-height:34px;max-width:220px;padding:6px 10px;border:1px solid #414a55;border-radius:7px;background:#22272e;color:#e8edf2;font:inherit}
    #aimmLiveInstallManagerOverlay .aimm-live-im-filter>strong{margin-left:auto;font-size:12px;color:#dce3ea}
    #aimmLiveInstallManagerOverlay .aimm-live-im-filter>strong span{margin-left:5px;color:#95a1ad;font-weight:400}
    #aimmLiveInstallManagerOverlay .aimm-live-im-vendor>header>div{display:grid;gap:4px}
    #aimmLiveInstallManagerOverlay .aimm-live-im-queue [data-sim-receipts]{margin:0;padding-top:8px;border-top:1px solid #343b45;color:#42c995;font-size:12px;line-height:1.5}
    @media(max-width:680px){#aimmLiveInstallManagerOverlay .aimm-live-im-filter{padding:12px 14px}#aimmLiveInstallManagerOverlay .aimm-live-im-filter>strong{width:100%;margin:0}}

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


  const syntheticManager = { overlay:null, queue:new Set(), receipts:new Map(), vendor:"All vendors", restoreFocus:null, message:"" };
  const syntheticManagerRows = [
    {id:"tapeform-clap",vendor:"Copperline Sample DSP",name:"Tapeform",format:"CLAP",installed:"3.1.0",available:"3.2.0"},
    {id:"comet-vst3",vendor:"Northstar Sample Audio",name:"Comet Dynamics",format:"VST3",installed:"2.0.1",available:"2.0.2"},
    {id:"halo-au",vendor:"Northstar Sample Audio",name:"Halo Equalizer",format:"AU",installed:"1.4.2",available:"1.5.0"}
  ];
  function closeSyntheticManager(){
    if(!syntheticManager.overlay)return;
    syntheticManager.overlay.removeEventListener("click",syntheticManagerClick);
    syntheticManager.overlay.removeEventListener("keydown",syntheticManagerKey);
    syntheticManager.overlay.remove();
    syntheticManager.overlay=null;
    syntheticManager.queue.clear();
    syntheticManager.receipts.clear();
    syntheticManager.message="";
    if(syntheticManager.restoreFocus?.isConnected)syntheticManager.restoreFocus.focus();
  }
  function renderSyntheticManager(){
    const overlay=syntheticManager.overlay;if(!overlay)return;
    const vendors=["All vendors",...new Set(syntheticManagerRows.map((row)=>row.vendor))];
    const rows=syntheticManagerRows.filter((row)=>syntheticManager.vendor==="All vendors"||row.vendor===syntheticManager.vendor);
    const groups=Array.from(new Set(rows.map((row)=>row.vendor))).map((vendor)=>{
      const items=rows.filter((row)=>row.vendor===vendor);
      return '<section class="aimm-live-im-vendor"><header><div><strong>'+esc(vendor)+'</strong><span>'+items.length+' updates</span></div><button type="button" data-sim-queue-vendor="'+esc(vendor)+'">Queue all '+items.length+'</button></header>'+
        items.map((row)=>'<article class="aimm-live-im-row"><div class="aimm-live-im-product"><strong>'+esc(row.name)+'</strong><span>Sample update · no local plug-in is read</span></div><div class="aimm-live-im-format"><small>Format</small><strong>'+esc(row.format)+'</strong></div><div class="aimm-live-im-version"><small>Installed → available</small><strong><span>v'+esc(row.installed)+'</span><b>→ v'+esc(row.available)+'</b></strong></div><div class="aimm-live-im-actions"><button type="button" data-sim-queue="'+row.id+'"'+(syntheticManager.queue.has(row.id)?' disabled':'')+'>'+ (syntheticManager.queue.has(row.id)?"Queued":"Queue") +'</button><button type="button" class="primary" data-sim-download="'+row.id+'">Simulate download</button><small role="status">'+esc(syntheticManager.receipts.get(row.id)||"Preview only — no file downloaded.")+'</small></div></article>').join("")+'</section>';
    }).join("");
    const queued=Array.from(syntheticManager.queue).map((id)=>syntheticManagerRows.find((row)=>row.id===id)).filter(Boolean);
    const receipts=Array.from(syntheticManager.receipts.values());
    overlay.innerHTML='<section class="aimm-live-im-shell" role="dialog" aria-modal="true" aria-labelledby="aimmSimInstallTitle"><header class="aimm-live-im-head"><div><h2 id="aimmSimInstallTitle">Install Manager</h2><p>Interactive sample · '+syntheticManagerRows.length+' update records</p></div><div class="aimm-live-im-tools"><button type="button" data-sim-folder>Download folder</button><button type="button" data-sim-clear'+(!receipts.length?' disabled':'')+'>Clear installed &amp; failed</button><button type="button" data-sim-reset>Start over</button><button type="button" class="primary" data-sim-done>Done</button></div></header>'+
      '<div class="aimm-live-im-notice"><strong>Sample manager preview — actions below only change this temporary on-screen queue.</strong><span>No installer is downloaded, opened, or installed. Real downloads require an approved release digest and a verified local Companion receipt.</span></div>'+
      '<div class="aimm-live-im-summary"><div><small>Updates</small><strong class="updates">3</strong></div><div><small>Vendors</small><strong>'+new Set(syntheticManagerRows.map((row)=>row.vendor)).size+'</strong></div><div><small>Queued</small><strong>'+syntheticManager.queue.size+'</strong></div><div><small>Preview results</small><strong>'+receipts.length+'</strong></div></div>'+
      (syntheticManager.message?'<p class="aimm-live-im-message" role="status">'+esc(syntheticManager.message)+'</p>':'')+
      '<div class="aimm-live-im-filter"><label for="aimmSimVendorFilter">VENDORS</label><select id="aimmSimVendorFilter" data-sim-vendor>'+vendors.map((vendor)=>'<option'+(vendor===syntheticManager.vendor?' selected':'')+'>'+esc(vendor)+'</option>').join("")+'</select><strong>All vendors <span>'+syntheticManagerRows.length+' updates</span></strong><button type="button" data-sim-queue-all>+ Queue all ('+syntheticManagerRows.length+')</button><button type="button" class="primary" data-sim-download-queued'+(!queued.length?' disabled':'')+'>Simulate queued ('+queued.length+')</button></div>'+
      '<div class="aimm-live-im-body"><main class="aimm-live-im-list">'+(groups||'<div class="aimm-live-im-empty">No update records for this vendor.</div>')+'</main><aside class="aimm-live-im-queue"><h3>BATCH PREVIEW <span>'+queued.length+'</span></h3>'+
      (queued.length?'<ol>'+queued.map((row)=>'<li>'+esc(row.name)+' · '+esc(row.vendor)+'<button type="button" data-sim-remove="'+row.id+'" aria-label="Remove '+esc(row.name)+' from queue">×</button></li>').join("")+'</ol><button type="button" class="primary" data-sim-download-queued>Simulate queued ('+queued.length+')</button>':'<p>No sample updates are queued.</p>')+
      '<small>Queue controls work in this preview. “Simulate” records a temporary demonstration result only; it never reports a real download or installation.</small><p data-sim-receipts>'+ (receipts.length?receipts.map(esc).join("<br>"):"No preview actions completed.")+'</p></aside></div></section>';
  }
  function syntheticManagerClick(event){
    if(event.target===syntheticManager.overlay){closeSyntheticManager();return;}
    if(event.type==="change"&&event.target.matches("[data-sim-vendor]")){syntheticManager.vendor=event.target.value;syntheticManager.message="Showing "+event.target.value+".";renderSyntheticManager();return;}
    const target=event.target.closest("button");if(!target)return;
    if(target.hasAttribute("data-sim-done")){closeSyntheticManager();return;}
    if(target.hasAttribute("data-sim-folder")){syntheticManager.message="This browser preview cannot choose or access a local download folder. No folder was opened.";renderSyntheticManager();return;}
    if(target.hasAttribute("data-sim-vendor")){syntheticManager.vendor=target.value;syntheticManager.message="Showing "+target.value+".";renderSyntheticManager();return;}
    if(target.hasAttribute("data-sim-queue")){syntheticManager.queue.add(target.dataset.simQueue);syntheticManager.message="Added one sample update to the queue.";renderSyntheticManager();return;}
    if(target.hasAttribute("data-sim-queue-vendor")){syntheticManagerRows.filter((row)=>row.vendor===target.dataset.simQueueVendor).forEach((row)=>syntheticManager.queue.add(row.id));syntheticManager.message="Queued all sample updates for "+target.dataset.simQueueVendor+".";renderSyntheticManager();return;}
    if(target.hasAttribute("data-sim-queue-all")){syntheticManagerRows.forEach((row)=>syntheticManager.queue.add(row.id));syntheticManager.message="Queued all 3 sample updates.";renderSyntheticManager();return;}
    if(target.hasAttribute("data-sim-remove")){syntheticManager.queue.delete(target.dataset.simRemove);syntheticManager.message="Removed one sample update from the queue.";renderSyntheticManager();return;}
    if(target.hasAttribute("data-sim-download")||target.hasAttribute("data-sim-download-queued")){
      const ids=target.hasAttribute("data-sim-download")?[target.dataset.simDownload]:Array.from(syntheticManager.queue);
      if(!ids.length){syntheticManager.message="Queue a sample update first.";renderSyntheticManager();return;}
      ids.forEach((id)=>syntheticManager.receipts.set(id,"Simulated preview only — no file downloaded or installed."));
      ids.forEach((id)=>syntheticManager.queue.delete(id));
      syntheticManager.message=ids.length+" sample result"+(ids.length===1?"":"s")+" shown. No files were downloaded.";
      renderSyntheticManager();return;
    }
    if(target.hasAttribute("data-sim-clear")){syntheticManager.receipts.clear();syntheticManager.message="Cleared temporary preview results.";renderSyntheticManager();return;}
    if(target.hasAttribute("data-sim-reset")){syntheticManager.queue.clear();syntheticManager.receipts.clear();syntheticManager.vendor="All vendors";syntheticManager.message="Preview queue and results reset.";renderSyntheticManager();}
  }
  function syntheticManagerKey(event){if(event.key==="Escape"){event.preventDefault();closeSyntheticManager();}}
  function openSyntheticManager(){
    if(syntheticManager.overlay)return;
    syntheticManager.restoreFocus=document.activeElement;
    syntheticManager.overlay=document.createElement("div");
    syntheticManager.overlay.id="aimmLiveInstallManagerOverlay";
    syntheticManager.overlay.addEventListener("click",syntheticManagerClick);
    syntheticManager.overlay.addEventListener("change",syntheticManagerClick);
    syntheticManager.overlay.addEventListener("keydown",syntheticManagerKey);
    document.body.append(syntheticManager.overlay);
    renderSyntheticManager();syntheticManager.overlay.querySelector("[data-sim-done]")?.focus();
  }
  function bindSyntheticInstallManager(){
    if(!synthetic())return;
    const button=document.querySelector("[data-inv-install-manager]");if(!button)return;
    button.disabled=false;button.removeAttribute("aria-disabled");
    button.title="Open the interactive Install Manager sample. Queue actions are temporary; no files are downloaded.";
    button.setAttribute("aria-label","Install Manager — interactive sample queue, no files downloaded");
    if(button.__aimmSyntheticInstallManager)return;
    button.__aimmSyntheticInstallManager=true;
    button.addEventListener("click",(event)=>{event.preventDefault();event.stopImmediatePropagation();openSyntheticManager();},true);
  }
  function bindInstallManager(){if(synthetic())bindSyntheticInstallManager();else bindLiveInstallManager();}
  let libraryInstallObserver = null;
  let liveManagerObserver = null;
  let pluginHubLicenseObserver = null;
  function openPluginHubLicenseInfo() {
    if (document.getElementById("aimmPluginHubLicenseOverlay")) return;
    const previous = document.activeElement;
    const overlay = document.createElement("div");
    overlay.id = "aimmPluginHubLicenseOverlay";
    overlay.innerHTML = '<section role="dialog" aria-modal="true" aria-labelledby="aimmPluginHubLicenseTitle"><header><h2 id="aimmPluginHubLicenseTitle">PluginHub License</h2><button type="button" data-license-close aria-label="Close">×</button></header><p>This is the licence for the PluginHub app itself, including its device activations.</p><p>It is separate from the licences and serial numbers for your audio plug-ins. AIMM does not manage or receive your PluginHub licence details. The AIMM License Key Vault is a separate tool for plug-in vendor keys.</p><a href="https://www.pluginhubapp.com/license" target="_blank" rel="noopener noreferrer">Open PluginHub licence page ↗</a></section>';
    const close = () => { overlay.remove(); if (previous?.isConnected) previous.focus(); };
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest("[data-license-close]")) close();
    });
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
    });
    document.body.append(overlay);
    overlay.querySelector("[data-license-close]")?.focus();
  }
  const OUT_OF_SCOPE_TOOL_LABELS = new Set([
    "Batch Plugin Management",
    "Remove Old Installers",
    "Check for Duplicates",
    "License Key Vault",
    "Compare Plugin Profiles"
  ]);
  function pruneOutOfScopeTools() {
    const sidebar = document.getElementById("invSidebar");
    if (!sidebar) return;
    for (const item of Array.from(sidebar.querySelectorAll("button, a, [role='button'], [role='link'], [aria-label]"))) {
      const label = (item.getAttribute("aria-label") || item.innerText || item.textContent || "").trim();
      const excluded = Array.from(OUT_OF_SCOPE_TOOL_LABELS).some((name) =>
        label === name || label.startsWith(name + " —") || label.startsWith(name + " — "));
      if (!excluded) continue;
      const row = item.closest(".inv-side-button, .inv-tool-item, li") || item;
      row.remove();
    }
    for (const note of Array.from(sidebar.querySelectorAll("p, small, div"))) {
      const text = (note.innerText || note.textContent || "").trim();
      if (text.startsWith("Only Check for Duplicates has a connected hand-off")) note.remove();
    }
  }
  function bindPluginHubLicenseTool() {
    const button = Array.from(document.querySelectorAll("#invSidebar button")).find((item) =>
      /PluginHub License/i.test(item.textContent || item.getAttribute("aria-label") || ""));
    if (!button) return;
    button.disabled = false;
    button.removeAttribute("aria-disabled");
    button.title = "About the separate PluginHub app licence and open its licence page.";
    button.setAttribute("aria-label","PluginHub License — view licensing information and open the PluginHub licence page");
    if (button.__aimmPluginHubLicense) return;
    button.__aimmPluginHubLicense = true;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openPluginHubLicenseInfo();
    }, true);
  }
  function bindILokLicenseManagerTool() {
    const sidebar = document.getElementById("invSidebar");
    if (!sidebar || sidebar.querySelector("[data-aimm-ilok-tool]")) return;
    const licenseButton = Array.from(sidebar.querySelectorAll("button")).find((item) =>
      /PluginHub License/i.test(item.textContent || item.getAttribute("aria-label") || ""));
    if (!licenseButton) return;
    const link = document.createElement("a");
    link.href = "ilm://";
    link.className = licenseButton.className;
    link.dataset.aimmIlokTool = "true";
    link.title = "Open iLok License Manager on this Mac.";
    link.setAttribute("aria-label", "Open iLok License Manager on this Mac");
    link.innerHTML = '<span class="inv-side-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14 3h7v7"/><path d="M21 3 11 13"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></span><span class="inv-side-label">iLok License Manager</span>';
    licenseButton.insertAdjacentElement("afterend", link);
  }
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
    pruneOutOfScopeTools();
    bindInstallManager();
    bindPluginHubLicenseTool();
    bindILokLicenseManagerTool();
    bindCompatibilityTool();
    if (!pluginHubLicenseObserver && document.getElementById("invSidebar")) {
      pluginHubLicenseObserver = new MutationObserver(() => { pruneOutOfScopeTools(); bindPluginHubLicenseTool(); bindILokLicenseManagerTool(); bindCompatibilityTool(); });
      pluginHubLicenseObserver.observe(document.getElementById("invSidebar"),{childList:true,subtree:true});
    }
    if (!liveManagerObserver && document.body) {
      liveManagerObserver = new MutationObserver(() => {
        if (document.querySelector("[data-inv-install-manager]")) bindInstallManager();
      });
      liveManagerObserver.observe(document.body,{childList:true,subtree:true});
    }
    // The inline prototype registers its DOMContentLoaded initializer before
    // this deferred bridge runs. Reapply the live state after that initializer
    // so it cannot disable the live manager again.
    if (document.readyState === "interactive") document.addEventListener("DOMContentLoaded",bindLiveInstallManager,{once:true});
    const managerHost = document.getElementById("invSidebar");
    if (managerHost && !managerHost.__aimmManagerObserver) {
      const observer = new MutationObserver(() => bindLiveInstallManager());
      observer.observe(managerHost,{childList:true,subtree:true});
      managerHost.__aimmManagerObserver = observer;
    }
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
  function bootLibraryBridge() {
    const ready = document.getElementById("invSidebar") && document.getElementById("invScanBtn");
    if (ready) { install(); return; }
    if (libraryInstallObserver || !document.body) return;
    libraryInstallObserver = new MutationObserver(() => {
      if (document.getElementById("invSidebar") && document.getElementById("invScanBtn")) {
        libraryInstallObserver.disconnect();
        libraryInstallObserver = null;
        install();
      }
    });
    libraryInstallObserver.observe(document.body,{childList:true,subtree:true});
  }
  function safeBootLibraryBridge() {
    try { bootLibraryBridge(); }
    catch (error) { console.error("AIMM status view failed to initialize", error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",safeBootLibraryBridge,{once:true});
  else safeBootLibraryBridge();
  document.body?.addEventListener("click",(event) => {
    const trigger = event.target.closest("button");
    if (trigger && trigger.textContent.trim() === "Library") setTimeout(() => { install(); bindInstallManager(); },0);
  },true);
  if (new URLSearchParams(window.location.search).get("pluginhub-preview") !== "synthetic") {
    let attempts = 0;
    const bindTimer = setInterval(() => {
      attempts += 1;
      bindInstallManager();
      const button = document.querySelector("[data-inv-install-manager]");
      if ((document.readyState === "complete" && button?.__aimmLiveInstallManager) || attempts >= 60) clearInterval(bindTimer);
    },250);
  }

  const shareCss=document.createElement("style");
  shareCss.textContent="#aimmLocalShareOverlay{position:fixed;inset:0;z-index:20020;display:grid;place-items:center;padding:20px;background:rgba(5,7,11,.78)}#aimmLocalShareOverlay[hidden]{display:none}#aimmLocalShareOverlay>section{width:min(900px,96vw);max-height:88vh;overflow:auto;display:grid;gap:16px;padding:22px;border:1px solid #3b4653;border-radius:14px;background:#1b2026;color:#e8edf2;box-shadow:0 20px 70px #0009}#aimmLocalShareOverlay h2,#aimmLocalShareOverlay p{margin:0}#aimmLocalShareOverlay p,#aimmLocalShareOverlay small{color:#aeb8c4}#aimmLocalShareOverlay .share-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}#aimmLocalShareOverlay label{display:grid;gap:6px;color:#d7dde5}#aimmLocalShareOverlay input,#aimmLocalShareOverlay select{min-height:38px;padding:8px 10px;border:1px solid #414a55;border-radius:7px;background:#11151a;color:#e8edf2;font:inherit}#aimmLocalShareOverlay .share-vendors{display:flex;flex-wrap:wrap;gap:8px}#aimmLocalShareOverlay .share-vendors label,#aimmLocalShareOverlay .share-check{display:flex;align-items:center;gap:7px;padding:7px 9px;border:1px solid #343b45;border-radius:7px}#aimmLocalShareOverlay .share-vendors input,#aimmLocalShareOverlay .share-check input{min-height:auto}#aimmLocalShareOverlay .share-preview{max-height:250px;overflow:auto;border:1px solid #343b45;border-radius:8px}#aimmLocalShareOverlay table{width:100%;border-collapse:collapse;font-size:13px}#aimmLocalShareOverlay th,#aimmLocalShareOverlay td{padding:8px 10px;border-bottom:1px solid #303741;text-align:left}#aimmLocalShareOverlay th{position:sticky;top:0;background:#222831;color:#c8d2de}#aimmLocalShareOverlay .share-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:9px}#aimmLocalShareOverlay button{min-height:38px;padding:8px 12px;border:1px solid #414a55;border-radius:7px;background:#252a31;color:#dfe6ed;font:inherit;cursor:pointer}#aimmLocalShareOverlay button.primary{border-color:#3289b7;background:#146082}#aimmLocalShareOverlay [role=status]{min-height:1.4em;color:#42c995}@media(max-width:600px){#aimmLocalShareOverlay .share-grid{grid-template-columns:1fr}}";
  shareCss.textContent += "#aimmLocalShareOverlay .account-share-panel{margin:16px 0;padding:16px;border:1px solid #3979a6;border-radius:10px;background:#171c22}#aimmLocalShareOverlay .account-share-panel h3{margin:0 0 8px}#aimmLocalShareOverlay .account-share-panel p{line-height:1.5}#aimmLocalShareOverlay .account-share-panel .share-grid{grid-template-columns:minmax(0,1fr);gap:14px}#aimmLocalShareOverlay .account-share-panel .share-actions{display:flex;flex-wrap:wrap;gap:10px}#aimmLocalShareOverlay .account-share-panel button:disabled,#aimmLocalShareOverlay .account-share-panel input:disabled,#aimmLocalShareOverlay .account-share-panel select:disabled{opacity:.48;filter:saturate(.25);cursor:not-allowed}#aimmLocalShareOverlay .share-active-list{padding-left:20px}#aimmLocalShareOverlay .share-active-list li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0}#aimmLocalShareOverlay [data-share-created] code{display:block;overflow-wrap:anywhere;padding:10px;background:#101316;border-radius:6px}";
  shareCss.textContent += "#aimmLocalShareOverlay,#aimmLocalShareOverlay *{box-sizing:border-box}#aimmLocalShareOverlay>section{width:min(900px,calc(100vw - 40px))}#aimmLocalShareOverlay .share-grid>label{min-width:0}#aimmLocalShareOverlay input:not([type=checkbox]),#aimmLocalShareOverlay select{max-width:100%;width:100%}#aimmLocalShareOverlay input[type=checkbox]{width:auto}";
  document.head.appendChild(shareCss);
  function shareInventoryRows(){
    return Array.from(document.querySelectorAll("#invInventory .inv-product")).filter((product)=>{
      const vendor=product.closest(".inv-vendor");
      return !product.hidden&&(!vendor||(!vendor.hidden&&vendor.style.display!=="none"&&!vendor.classList.contains("inv-filtered")));
    }).map((product)=>{
      const action=product.querySelector("[data-inv-product-action]");
      let meta={};try{meta=JSON.parse(action?.dataset.invProductAction||"{}");}catch{}
      const formats=Array.from(product.querySelectorAll(".inv-format-state")).map((node)=>{
        const format=node.querySelector(".inv-chip")?.textContent.trim()||"";
        const status=node.querySelector(".inv-format-status")?.getAttribute("aria-label")||"";
        return {format,status:status.replace(/^.*?·\s*/,"").trim()};
      }).filter((item)=>item.format);
      const versionRows=Array.from(product.querySelectorAll(".inv-version-row")).map((node)=>{
        const format=node.querySelector("b")?.textContent.trim()||"";
        const version=node.querySelector(".inv-version-values")?.textContent.trim()||"";
        return format&&version?format+" "+version:"";
      }).filter(Boolean);
      return {vendor:product.closest(".inv-vendor")?.querySelector(".inv-vendor-name strong")?.textContent.trim()||meta.vendor||"Unknown publisher",
        name:product.querySelector(".inv-name")?.textContent.trim()||meta.name||"Unnamed plug-in",
        category:product.querySelector(".inv-category-label")?.textContent.trim()||meta.category||"",
        formats,versions:versionRows};
    });
  }

  const compatibilityCss=document.createElement("style");
  compatibilityCss.textContent="#aimmCompatibilityOverlay{position:fixed;inset:0;z-index:20018;display:grid;place-items:center;padding:20px;background:rgba(5,7,11,.82)}#aimmCompatibilityOverlay,#aimmCompatibilityOverlay *{box-sizing:border-box}#aimmCompatibilityOverlay>section{display:grid;gap:16px;width:min(1080px,calc(100vw - 40px));max-height:90vh;overflow:auto;padding:24px;border:1px solid #3b4653;border-radius:14px;background:#1b2026;color:#e8edf2;box-shadow:0 20px 70px #0009}#aimmCompatibilityOverlay h2,#aimmCompatibilityOverlay h3,#aimmCompatibilityOverlay p{margin:0}#aimmCompatibilityOverlay p,#aimmCompatibilityOverlay small{color:#aeb8c4;line-height:1.5}#aimmCompatibilityOverlay header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}#aimmCompatibilityOverlay header button,#aimmCompatibilityOverlay button{min-height:38px;padding:8px 12px;border:1px solid #414a55;border-radius:8px;background:#252a31;color:#dfe6ed;font:inherit;cursor:pointer}#aimmCompatibilityOverlay .compat-warning{padding:14px 16px;border:1px solid #84612e;border-radius:10px;background:#241f17;color:#f0d19b;line-height:1.5}#aimmCompatibilityOverlay .compat-target{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding:16px;border:1px solid #303741;border-radius:10px;background:#15191e}#aimmCompatibilityOverlay .compat-target label{display:grid;gap:7px;color:#d7dde5}#aimmCompatibilityOverlay select,#aimmCompatibilityOverlay input[type=search]{width:100%;min-width:0;min-height:40px;padding:8px 10px;border:1px solid #414a55;border-radius:8px;background:#11151a;color:#e8edf2;font:inherit}#aimmCompatibilityOverlay .compat-counts{display:grid;grid-template-columns:repeat(6,minmax(100px,1fr));gap:10px}#aimmCompatibilityOverlay .compat-count{display:grid;gap:6px;justify-items:start;min-height:76px;padding:12px;border:1px solid #343b45;border-radius:10px;background:#15191e;text-align:left}#aimmCompatibilityOverlay .compat-count[aria-pressed=true]{border-color:#4b92be;background:#1a2934}#aimmCompatibilityOverlay .compat-count strong{font-size:21px;line-height:1;color:#e8edf2}#aimmCompatibilityOverlay .compat-count span{font-size:11px;line-height:1.3;color:#aeb8c4}#aimmCompatibilityOverlay .compat-count.intel strong{color:#e8b45a}#aimmCompatibilityOverlay .compat-count.unknown strong{color:#9aa4af}#aimmCompatibilityOverlay .compat-list-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:4px}#aimmCompatibilityOverlay .compat-list{display:grid;gap:10px}#aimmCompatibilityOverlay .compat-row{display:grid;grid-template-columns:minmax(160px,1.1fr) minmax(120px,.8fr) minmax(120px,.6fr) minmax(220px,1.4fr);align-items:center;gap:14px;padding:14px 16px;border:1px solid #303741;border-radius:10px;background:#20242a}#aimmCompatibilityOverlay .compat-row strong{display:block;color:#edf1f5;font-size:14px;line-height:1.35;overflow-wrap:anywhere}#aimmCompatibilityOverlay .compat-row small{display:block;margin-top:4px;font-size:11px;overflow-wrap:anywhere}#aimmCompatibilityOverlay .compat-pill{display:inline-flex;align-items:center;min-height:25px;padding:3px 8px;border-radius:7px;background:#303740;color:#c5cdd6;font-size:11px;font-weight:700}#aimmCompatibilityOverlay .compat-pill.unknown{background:rgba(139,149,161,.16);color:#b6bec8}#aimmCompatibilityOverlay .compat-empty{padding:18px;border:1px dashed #3b4653;border-radius:10px;color:#aeb8c4;line-height:1.5}#aimmCompatibilityOverlay footer{display:flex;justify-content:flex-end;gap:10px;padding-top:4px}@media(max-width:800px){#aimmCompatibilityOverlay .compat-counts{grid-template-columns:repeat(3,minmax(0,1fr))}#aimmCompatibilityOverlay .compat-row{grid-template-columns:minmax(0,1fr) minmax(110px,.7fr);gap:12px}}@media(max-width:560px){#aimmCompatibilityOverlay{padding:8px}#aimmCompatibilityOverlay>section{width:100%;max-height:96vh;padding:16px;gap:14px}#aimmCompatibilityOverlay .compat-target{grid-template-columns:1fr;padding:13px}#aimmCompatibilityOverlay .compat-counts{grid-template-columns:repeat(2,minmax(0,1fr))}#aimmCompatibilityOverlay .compat-row{grid-template-columns:minmax(0,1fr);gap:8px}}";
  document.head.appendChild(compatibilityCss);
  function closeCompatibility(){
    const overlay=document.getElementById("aimmCompatibilityOverlay");if(!overlay)return;
    const previous=overlay.__compatRestoreFocus;
    overlay.remove();
    if(previous?.isConnected)previous.focus();
  }
  function openCompatibility(){
    document.getElementById("aimmCompatibilityOverlay")?.remove();
    const rows=shareInventoryRows();
    const previous=document.activeElement;
    const overlay=document.createElement("div");overlay.id="aimmCompatibilityOverlay";overlay.__compatRestoreFocus=previous;
    const scopes=[
      ["all","All plug-ins",rows.length,""],
      ["ready","Ready",null,"ready"],
      ["check-first","Check first",null,"check-first"],
      ["intel-only","Intel only",null,"intel"],
      ["no-word","No word yet",null,"no-word"],
      ["unknown","Unknown",rows.length,"unknown"]
    ];
    overlay.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="aimmCompatibilityTitle"><header><div><h2 id="aimmCompatibilityTitle">Plugin Compatibility</h2><p>Check plug-in build readiness for a target macOS version.</p></div><button type="button" data-compat-close aria-label="Close">×</button></header><div class="compat-warning"><strong>Architecture evidence is not available in this Library scan.</strong><br><small>AIMM reads bundle names and Info.plist metadata only. It does not inspect plug-in binaries, so it cannot identify Intel-only or Apple Silicon builds. Nothing is marked Ready or at risk without that evidence.</small></div><div class="compat-target"><label>Moving to<select data-compat-os><option>macOS 28</option><option>macOS 27</option><option>macOS 26</option><option>macOS 15</option><option>macOS 14</option></select></label><label>Target Mac architecture<select data-compat-arch><option value="">Choose architecture…</option><option value="apple-silicon">Apple Silicon</option><option value="intel">Intel</option></select></label></div><div class="compat-counts" aria-label="Compatibility status filters">'+scopes.map((item,index)=>'<button type="button" class="compat-count '+item[3]+'" data-compat-filter="'+item[0]+'" aria-pressed="'+(index===0?'true':'false')+'"><strong>'+(item[2]===null?"—":item[2].toLocaleString())+'</strong><span>'+item[1]+'</span></button>').join("")+'</div><div class="compat-list-head"><div><h3>Plug-ins in this Library view</h3><small data-compat-scope-note>All compatibility results are unknown until architecture evidence is available.</small></div><input type="search" data-compat-search placeholder="Search plug-in or publisher…" aria-label="Search compatibility list"></div><div class="compat-list" data-compat-list role="list"></div><footer><button type="button" data-compat-close>Done</button></footer></section>';
    let activeFilter="all";
    const list=overlay.querySelector("[data-compat-list]");
    const search=overlay.querySelector("[data-compat-search]");
    const note=overlay.querySelector("[data-compat-scope-note]");
    function render(){
      const query=norm(search.value);
      const matches=rows.filter((row)=>!query||norm([row.name,row.vendor,row.formats.map((item)=>item.format).join(" "),row.versions.join(" ")].join(" ")).includes(query));
      const knownScope=activeFilter==="all"||activeFilter==="unknown";
      const visible=knownScope?matches:[];
      list.innerHTML=visible.length?visible.map((row)=>'<article class="compat-row" role="listitem"><div><strong>'+esc(row.name)+'</strong><small>'+esc(row.vendor)+'</small></div><div><small>Formats found</small><strong>'+esc(row.formats.map((item)=>item.format).join(", ")||"Not recorded")+'</strong></div><div><small>Installed version</small><strong>'+esc(row.versions.join(" · ")||"Not recorded")+'</strong></div><div><span class="compat-pill unknown">Unknown · architecture not inspected</span><small>Binary metadata is not part of the current Library scan.</small></div></article>').join(""):'<div class="compat-empty">'+(knownScope?(query?"No plug-ins match this search.":"No plug-ins are visible in this Library view."):"No source-verified results are available for this status. AIMM has not inspected binary architecture or collected vendor/cohort evidence.")+'</div>';
      note.textContent=activeFilter==="all"?"All compatibility results are unknown until architecture evidence is available.":activeFilter==="unknown"?"These plug-ins have no inspected architecture evidence.":"No plug-ins can be placed in this status without verified architecture and vendor evidence.";
      overlay.querySelectorAll("[data-compat-filter]").forEach((button)=>button.setAttribute("aria-pressed",String(button.dataset.compatFilter===activeFilter)));
    }
    overlay.addEventListener("input",(event)=>{if(event.target.matches("[data-compat-search]"))render();});
    overlay.addEventListener("change",(event)=>{if(event.target.matches("[data-compat-os]")||event.target.matches("[data-compat-arch]")){const os=overlay.querySelector("[data-compat-os]").value,arch=overlay.querySelector("[data-compat-arch]").value;note.textContent=arch?"Targeting "+os+" on "+(arch==="apple-silicon"?"Apple Silicon":"Intel")+"; results remain Unknown because architecture evidence has not been inspected.":"Choose the target Mac architecture. Results remain Unknown until architecture evidence is available."; }});
    overlay.addEventListener("click",(event)=>{
      if(event.target===overlay||event.target.closest("[data-compat-close]")){closeCompatibility();return;}
      const filter=event.target.closest("[data-compat-filter]");
      if(filter){activeFilter=filter.dataset.compatFilter;render();}
    });
    overlay.addEventListener("keydown",(event)=>{if(event.key==="Escape"){event.preventDefault();closeCompatibility();}});
    document.body.appendChild(overlay);render();overlay.querySelector("[data-compat-os]")?.focus();
  }
  function bindCompatibilityTool(){
    const sidebar=document.getElementById("invSidebar");if(!sidebar)return;
    const button=Array.from(sidebar.querySelectorAll("button")).find((item)=>/Plugin Compatibility/i.test(item.textContent||item.getAttribute("aria-label")||""));
    if(!button)return;
    button.disabled=false;button.removeAttribute("aria-disabled");
    button.title="Review architecture and macOS compatibility evidence for plug-ins in the Library.";
    button.setAttribute("aria-label","Plugin Compatibility — view macOS architecture evidence and compatibility status");
    if(button.__aimmCompatibilityTool)return;
    button.__aimmCompatibilityTool=true;
    button.addEventListener("click",(event)=>{event.preventDefault();event.stopImmediatePropagation();openCompatibility();},true);
  }
  function csvCell(value){return '"'+String(value??"").replace(/"/g,'""')+'"';}
  function openLocalShare(){
    document.getElementById("aimmLocalShareOverlay")?.remove();
    const rows=shareInventoryRows(),vendors=Array.from(new Set(rows.map((row)=>row.vendor))).sort();
    const overlay=document.createElement("div");overlay.id="aimmLocalShareOverlay";
    overlay.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="aimmLocalShareTitle"><header><h2 id="aimmLocalShareTitle">Share Plugin List</h2><p>Create a share-ready export from the plug-ins currently shown in this Library view.</p></header><p data-share-notice>Review the fields before you copy or download.</p><div class="share-grid"><label>List name<input type="text" data-share-label maxlength="80" placeholder="My plug-in list"></label><label>Format scope<select data-share-format><option value="">All formats</option><option>AU</option><option>VST2</option><option>VST3</option><option>CLAP</option></select></label></div><div><strong>Exclude publishers</strong><div class="share-vendors">'+vendors.map((vendor,index)=>'<label><input type="checkbox" data-share-vendor value="'+esc(vendor)+'"> '+esc(vendor)+'</label>').join("")+'</div></div><div class="share-grid"><label class="share-check"><input type="checkbox" data-share-versions checked> Include versions</label><label class="share-check"><input type="checkbox" data-share-categories checked> Include categories</label></div><div class="share-preview" data-share-preview></div><small data-share-count></small><div role="status" data-share-status></div><footer class="share-actions"><button type="button" data-share-close>Close</button><button type="button" data-share-copy class="primary">Copy for Sheets</button><button type="button" data-share-download>Download CSV</button></footer></section>';
    document.body.appendChild(overlay);
    let accountSharePanel=null;
    {
      accountSharePanel=document.createElement("section");
      accountSharePanel.className="account-share-panel";
      accountSharePanel.innerHTML='<h3>Create an expiring link</h3><p>Anyone with the link can view this list until it expires. AIMM does not currently add passkey protection to shared links. Create only a list you are comfortable sharing.</p><div class="share-grid"><label>Link expires<select data-share-expiry><option value="24">In 24 hours</option><option value="72">In 3 days</option><option value="168" selected>In 7 days</option><option value="336">In 14 days</option><option value="720">In 30 days</option></select></label><label class="share-check"><input type="checkbox" data-share-public-confirm> I understand anyone with this link can view it</label></div><div class="share-actions"><button type="button" data-share-create class="primary">Create expiring link</button><button type="button" data-share-load>Load active links</button></div><div role="status" data-share-account-status></div><div data-share-created></div><div data-share-active></div>';
      const shareNotice=overlay.querySelector("[data-share-notice]");
      if(synthetic()){accountSharePanel.querySelectorAll("select,input,button").forEach((control)=>{control.disabled=true;});accountSharePanel.querySelector("p").textContent="Synthetic preview only: these sample plug-ins cannot be published. On the approved signed-in account view, anyone with the link can view it until expiry. Passkey protection is not available yet.";accountSharePanel.querySelector("[data-share-account-status]").textContent="No account request has been made.";shareNotice.textContent="Local export only. Nothing is sent from this synthetic preview. Review the fields below before copying or downloading.";}else{shareNotice.textContent="Creating a link sends the selected plug-in names, publishers, categories, formats and versions to AIMM. Anyone with the link can view the list until expiry; you can revoke it from this account.";}
      overlay.querySelector("header").insertAdjacentElement("afterend",accountSharePanel);
    }
    const query=(selector)=>overlay.querySelector(selector);
    const output=query("[data-share-preview]"),count=query("[data-share-count]"),status=query("[data-share-status]");
    function selectedRows(){
      const format=query("[data-share-format]").value;
      const excluded=new Set(Array.from(overlay.querySelectorAll("[data-share-vendor]:checked")).map((input)=>input.value));
      return rows.filter((row)=>!excluded.has(row.vendor)&&(!format||row.formats.some((item)=>item.format===format))).map((row)=>{
        const activeFormats=format?row.formats.filter((item)=>item.format===format):row.formats;
        const versions=query("[data-share-versions]").checked?row.versions.filter((item)=>!format||item.startsWith(format+" ")).join("; "):"";
        return {name:row.name,publisher:row.vendor,category:query("[data-share-categories]").checked?row.category:"",formats:activeFormats.map((item)=>item.format).join(", "),versions};
      });
    }
    function draw(){
      const selected=selectedRows(),columns=["Plug-in","Publisher"];
      if(query("[data-share-categories]").checked)columns.push("Category");
      columns.push("Formats");if(query("[data-share-versions]").checked)columns.push("Versions");
      output.innerHTML=selected.length?'<table><thead><tr>'+columns.map((col)=>"<th>"+esc(col)+"</th>").join("")+'</tr></thead><tbody>'+selected.map((row)=>'<tr><td>'+esc(row.name)+'</td><td>'+esc(row.publisher)+'</td>'+(query("[data-share-categories]").checked?'<td>'+esc(row.category)+'</td>':"")+'<td>'+esc(row.formats)+'</td>'+(query("[data-share-versions]").checked?'<td>'+esc(row.versions)+'</td>':"")+'</tr>').join("")+'</tbody></table>':'<p style="padding:14px">No matching plug-ins are shown. Change the format or publisher exclusions.</p>';
      count.textContent=selected.length+" plug-in"+(selected.length===1?"":"s")+" in this export.";
      status.textContent="";
    }
    overlay.querySelectorAll("select,input").forEach((control)=>control.addEventListener("change",draw));
    query("[data-share-label]").addEventListener("input",draw);
    query("[data-share-close]").addEventListener("click",()=>overlay.remove());
    overlay.addEventListener("click",(event)=>{if(event.target===overlay)overlay.remove();});
    function lines(tsv=false){
      const selected=selectedRows(),columns=["Plug-in","Publisher"];
      if(query("[data-share-categories]").checked)columns.push("Category");columns.push("Formats");if(query("[data-share-versions]").checked)columns.push("Versions");
      const keyMap={"Plug-in":"name","Publisher":"publisher","Category":"category","Formats":"formats","Versions":"versions"};
      const separator=tsv?"\t":",";
      const listName=query("[data-share-label]").value.trim();
      const header=listName?[[csvCell("List"),csvCell(listName)].join(separator),""]: [];
      return header.concat([columns.map((col)=>csvCell(col)).join(separator),...selected.map((row)=>columns.map((col)=>csvCell(row[keyMap[col]]||"")).join(separator))]).join("\n");
    }
    query("[data-share-copy]").addEventListener("click",async()=>{
      if(!selectedRows().length){status.textContent="There are no plug-ins to copy.";return;}
      try{await navigator.clipboard.writeText(lines(true));status.textContent="Copied "+selectedRows().length+" plug-ins as tab-separated values.";}
      catch{status.textContent="Clipboard access was unavailable. Use Download CSV instead.";}
    });
    if(accountSharePanel){
      const accountStatus=accountSharePanel.querySelector("[data-share-account-status]");
      const createdHost=accountSharePanel.querySelector("[data-share-created]");
      const activeHost=accountSharePanel.querySelector("[data-share-active]");
      const setAccountStatus=(message)=>{accountStatus.textContent=message;};
      const renderActiveShares=(payload)=>{
        activeHost.replaceChildren();
        const shares=Array.isArray(payload?.shares)?payload.shares:[];
        const heading=document.createElement("h4");heading.textContent="Active links";activeHost.append(heading);
        if(!shares.length){const empty=document.createElement("p");empty.textContent="There are no active links.";activeHost.append(empty);return;}
        const list=document.createElement("ul");list.className="share-active-list";
        for(const item of shares){
          const row=document.createElement("li"),detail=document.createElement("span");
          detail.textContent=(item.label||"Plug-in list")+" · expires "+new Date(item.expires_at).toLocaleString();
          const revoke=document.createElement("button");revoke.type="button";revoke.textContent="Revoke";
          revoke.addEventListener("click",async()=>{
            revoke.disabled=true;setAccountStatus("Revoking link…");
            try{await window.aimmRevokeAccountShare({share_id:item.share_id});row.remove();setAccountStatus("Link revoked. It can no longer be opened.");}
            catch(error){setAccountStatus(error.message);revoke.disabled=false;}
          });
          row.append(detail,revoke);list.append(row);
        }
        activeHost.append(list);
      };
      accountSharePanel.querySelector("[data-share-load]").addEventListener("click",async(event)=>{
        const button=event.currentTarget;
        if(synthetic()){setAccountStatus("Synthetic preview: no account request was made.");return;}button.disabled=true;setAccountStatus("Loading active links…");
        try{renderActiveShares(await window.aimmListAccountShares());setAccountStatus("Active links loaded.");}
        catch(error){setAccountStatus(error.message);}
        finally{button.disabled=false;}
      });
      accountSharePanel.querySelector("[data-share-create]").addEventListener("click",async(event)=>{
        const button=event.currentTarget;
        if(synthetic()){setAccountStatus("Synthetic preview: sample plug-ins cannot be published.");return;}
        if(!query("[data-share-public-confirm]").checked){setAccountStatus("Confirm that anyone with the link can view it before creating a link.");query("[data-share-public-confirm]").focus();return;}
        const selected=selectedRows();
        if(!selected.length){setAccountStatus("There are no plug-ins in this selection to share.");return;}
        button.disabled=true;createdHost.replaceChildren();setAccountStatus("Creating expiring link…");
        try{
          const result=await window.aimmCreateAccountShare({label:query("[data-share-label]").value.trim(),expiry_hours:Number(query("[data-share-expiry]").value),rows:selected});
          const link=new URL(result.share_url);
          if(link.protocol!=="https:")throw new Error("The share service returned an insecure link. No link was shown.");
          const textLine=document.createElement("p");textLine.textContent="Link (anyone who receives it can view):";
          const value=document.createElement("code");value.textContent=link.toString();
          const copy=document.createElement("button");copy.type="button";copy.textContent="Copy link";
          copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(link.toString());setAccountStatus("Link copied.");}catch{setAccountStatus("Clipboard access is unavailable. Select and copy the link above.");}});
          const expires=document.createElement("p");expires.textContent="Expires "+new Date(result.expires_at).toLocaleString()+". Revoke it from Active links at any time.";
          createdHost.append(textLine,value,copy,expires);
          setAccountStatus("Share link created. Keep it private and revoke it when it is no longer needed.");
          renderActiveShares(await window.aimmListAccountShares());
        }catch(error){setAccountStatus(error.message);}
        finally{button.disabled=false;}
      });
    }
    query("[data-share-download]").addEventListener("click",()=>{
      if(!selectedRows().length){status.textContent="There are no plug-ins to download.";return;}
      const blob=new Blob(["\ufeff"+lines(false)],{type:"text/csv;charset=utf-8"});
      const url=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=url;a.download=(query("[data-share-label]").value.trim()||"aimm-plugin-list").replace(/[^a-z0-9-_]+/gi,"-")+".csv";
      a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent="CSV export created on this device.";
    });
    draw();query("[data-share-label]").focus();
  }
  function installLocalShareTool(){
    const button=Array.from(document.querySelectorAll("#invSidebar button")).find((node)=>node.getAttribute("aria-label")?.startsWith("Share Plugin List"));
    if(!button)return false;
    button.disabled=false;button.removeAttribute("aria-disabled");
    button.setAttribute("aria-label","Share Plugin List — create a local CSV or spreadsheet export");
    button.title="Create a local share-ready export; nothing is sent";
    if(!button.__aimmLocalShareBound){button.__aimmLocalShareBound=true;button.addEventListener("click",(event)=>{event.preventDefault();openLocalShare();});}
    const note=document.querySelector("#invSidebar .inv-tools-note,#invSidebar .inv-small-note");
    if(note&&/Other tools are disabled/.test(note.textContent))note.textContent="Install Manager uses your account and paired Companion; Share Plugin List creates a local export. No public link or passkey share is connected yet.";
    const synthetic=document.querySelector("#invSyntheticPreviewNotice");
    const syntheticText=synthetic?.querySelector("span");
    if(syntheticText)syntheticText.textContent="All products and status states here are synthetic and generated in memory; no vendor checks ran. Dots: red = Updates, green = Up to date, amber = Manual check, grey = Unchecked. No saved inventory/favourites/tags are read; folder access is blocked.";
    return true;
  }

  const shareObserver=new MutationObserver(()=>{if(installLocalShareTool())shareObserver.disconnect();});
  if(!installLocalShareTool())shareObserver.observe(document.documentElement,{childList:true,subtree:true});
})();
