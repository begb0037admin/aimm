import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const start = html.indexOf("const PLUGIN_COMPANION_URL='http://127.0.0.1:41736';");
const end = html.indexOf('function invSaveScan(){', start);
const action = html.split('function invScanButtonAction(){')[1]?.split('\n')[0];
assert.ok(start > 0 && end > start && action, 'page contains the companion logic and scan action');
const code = html.slice(start, end) + '\nfunction invScanButtonAction(){' + action + '\n' +
  'globalThis.pc={check:pcCompanionCheck,scan:pcCompanionScan,init:pcCompanionInit,action:invScanButtonAction,connected:()=>pcCompanionConnected};';

const row = (name, format) => ({name, vendor:'Acme', format, version:'1.0', bundleId:name, rootId:'system-vst3', category:'', bundleName:name, path:'/Library/Audio/Plug-Ins/'+name});
const inventory = {
  scannedAt:'2026-11-19T12:34:00Z', roots:[{id:'system-vst3',exists:true}],
  counts:{AU:1,VST2:0,VST3:2,CLAP:0,products:2,bundles:3,unreadable:0},
  rows:[row('One','AU'),row('One','VST3'),row('Two','VST3')],
};
const ok = body => ({ok:true,json:async()=>body});

function harness(reply = async path => path === '/status' ? ok({lastScanAt:inventory.scannedAt}) : ok(inventory), permission='granted') {
  const elements = new Map();
  for (const id of ['pcCompanionConnectionStatus','pcCompanionSettingsStatus','pcCompanionConnect','invScanBtn','invSidebarFolderMeta'])
    elements.set(id,{textContent:'',disabled:false,hidden:false,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}});
  const calls=[]; const settingsTab={listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}}; let chromeScans=0, renders=0, saves=0;
  const context={
    fetch: async (url,options) => {calls.push({url,options});assert.ok(url.startsWith('http://127.0.0.1:41736/'));return reply(new URL(url).pathname,options);},
    navigator:{permissions:{query:async()=>({state:permission})}},
    document:{getElementById:id=>elements.get(id),querySelector:()=>settingsTab},
    Intl,Date,Number,Set,Array,String,
    INV_SCAN_ACTIVE:false,INV_ROOTS:[],INV_SCAN_ROWS:[],INV_SCAN_INFO:{},INV_SYNTHETIC_PREVIEW:false,
    invBuildGroups:rows=>[...new Set(rows.map(r=>r.vendor+'|'+r.name))].map(name=>({name})),
    invSaveScan:()=>{saves++;return true;},invRenderInventory:()=>{renders++;},
    invStatus:()=>{},invScanNow:async()=>{chromeScans++;},
    invUpdateSettingsFolderMeta:()=>{elements.get('invSidebarFolderMeta').textContent='No folders connected';},
    pcCompanionReadUnused:async()=>[],hopePushPluginSummary:()=>{},
  };
  vm.runInNewContext(code,context);
  return {pc:context.pc,context,elements,settingsTab,calls,get chromeScans(){return chromeScans;},get renders(){return renders;},get saves(){return saves;}};
}

test('connected companion adopts rows for the existing inventory pipeline', async()=>{
  const h=harness();await h.pc.check();
  assert.equal(h.pc.connected(),true);
  assert.equal(h.elements.get('pcCompanionConnectionStatus').textContent,'Connected');
  assert.equal(h.elements.get('pcCompanionSettingsStatus').textContent,'');
  assert.equal(h.context.INV_SCAN_ROWS.length,3);
  assert.ok(h.context.INV_SCAN_ROWS.every(r=>r.source==='companion'));
  assert.equal(h.context.INV_SCAN_INFO.bundles,3);
  assert.equal(h.context.INV_SCAN_INFO.source,'companion');
  assert.equal(h.saves,1);assert.equal(h.renders,1);
  assert.equal(h.elements.get('invScanBtn').disabled,false);
  assert.ok(h.calls.every(c=>c.options.targetAddressSpace==='loopback'));
});

test('quiet check shows the real disconnected state', async()=>{
  const h=harness(async()=>{throw new TypeError('Failed to fetch');},'prompt');
  await h.pc.check();
  assert.equal(h.pc.connected(),false);
  assert.equal(h.elements.get('pcCompanionConnectionStatus').textContent,'Disconnected');
  assert.equal(h.elements.get('pcCompanionSettingsStatus').textContent,'');
  assert.equal(h.elements.get('invScanBtn').disabled,true);
});

test('rescan posts locally, refreshes inventory, and scan button uses companion', async()=>{
  const h=harness();await h.pc.check();await h.pc.action();
  assert.deepEqual(h.calls.map(c=>new URL(c.url).pathname),['/status','/inventory','/scan','/status','/inventory']);
  assert.equal(h.calls[2].options.method,'POST');
  assert.equal(h.pc.connected(),true);assert.equal(h.saves,2);
});

test('scan button falls back to Chrome folders when companion is down', async()=>{
  const h=harness(async()=>{throw new TypeError('Failed to fetch');});
  await h.pc.check();await h.pc.action();
  assert.equal(h.chromeScans,1);
  assert.deepEqual(h.calls.map(c=>new URL(c.url).pathname),['/status']);
});

test('403 and CORS failures show connection guidance', async()=>{
  const forbidden=harness(async()=>({ok:false,status:403}));
  await forbidden.pc.check(true);
  assert.match(forbidden.elements.get('pcCompanionSettingsStatus').textContent,/Chrome blocked AIMM’s loopback connection/);
  const cors=harness(async()=>{throw new TypeError('Failed to fetch');},'prompt');
  await cors.pc.check(true);
  assert.match(cors.elements.get('pcCompanionSettingsStatus').textContent,/Loopback network access/);
});

test('Settings cards use the short labels and hide normal status boxes',()=>{
  assert.match(html, /id="mcSpotifyCompanionConnect" aria-label="Connect audio reference">Connect<\/button>/);
  assert.match(html, /id="pcCompanionConnect" aria-label="Connect plugins">Connect<\/button>/);
  assert.match(html, /id="mcSpotifyCompanionConnectionStatus"[^>]*>Disconnected<\/span>/);
  assert.match(html, /id="pcCompanionConnectionStatus"[^>]*>Disconnected<\/span>/);
  assert.doesNotMatch(html, /id="pcCompanionRescan"/);
  assert.match(html, /#pcCompanionSettingsStatus\):empty\{display:none\}/);
  assert.match(html, /Connect plugins in Settings\./);
});

test('page load and Settings open each check quietly', async()=>{
  const h=harness();h.pc.init();
  await new Promise(resolve=>setTimeout(resolve,0));
  h.settingsTab.listeners.click();
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.deepEqual(h.calls.map(c=>new URL(c.url).pathname),['/status','/inventory','/status','/inventory']);
  assert.equal(h.pc.connected(),true);
  assert.equal(h.elements.get('invSidebarFolderMeta').textContent,'No folders connected');
});
