import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import {pageTools,newToolNames,sourceText as html} from '../scripts/hope-tool-catalog.mjs';
const byName=new Map(pageTools.map(t=>[t.name,t]));
const cases=html.slice(html.indexOf("      case 'snapshots_list':"),html.indexOf("      case 'vocal_favorites_read':"));
const rescan=html.slice(html.indexOf("      case 'inventory_rescan':"),html.indexOf("      case 'inventory_mark_vendor_app_checked':"));
function run(code,context){vm.runInNewContext(`async function call(name,args={}){switch(name){${code}default:throw Error(name)}}globalThis.call=call;`,context);return context.call;}
test('all 14 new schemas are available to both shared routes and writes require confirmed',()=>{
  assert.equal(newToolNames.length,14);
  for(const name of newToolNames){const def=byName.get(name);assert.ok(def,name);assert.equal(def.parameters.type,'object');assert.ok(def.description);}
  for(const name of ['snapshots_apply','snapshots_add_note','plugin_tag_set','plugin_hide','saved_target_apply','mixbus_load_preset','mixbus_auto_fill'])assert.ok(byName.get(name).parameters.required.includes('confirmed'),name);
  assert.match(html,/const AICHAT_TOOL_DEFS = TOOL_DEFS\.map/);
  assert.match(html,/tools:TOOL_DEFS/);
});
test('snapshot apply waits for confirmation and refuses a failed backup verification',async()=>{
  let applied=0,backups=0;
  const entry={id:'one',subject:'Test',workbenchSnapshot:{chain:{master:[{n:'EQ'}]}}};
  const context={STATE:{journal:[entry]},BUSES:[{id:'master'}],summariseSnapshot:()=> 'Restores master',createWorkbenchBackupPill:()=>{backups++;return {id:'backup'};},hopeStoredState:async()=>false,applyCapturedSnap:()=>applied++,document:{getElementById:()=>({value:'trap'})}};
  const call=run(cases,context);
  assert.equal((await call('snapshots_apply',{id:'one',confirmed:false})).needs_confirmation,true);
  assert.equal(applied,0);assert.equal(backups,0);
  const result=await call('snapshots_apply',{id:'one',confirmed:true});
  assert.equal(result.ok,false);assert.equal(backups,1);assert.equal(applied,0);
});
test('tag and hide confirmation leave storage unchanged',async()=>{
  let writes=0;
  const group={name:'Pro-Q',vendor:'FabFilter'};
  const context={INV_SYNTHETIC_PREVIEW:false,invBuildGroups:()=>[group],INV_SCAN_ROWS:[],invActionKey:(v,n)=>v.toLowerCase()+'|'+n.toLowerCase(),invNorm:s=>String(s||'').toLowerCase(),invReadProductActions:()=>({}),invReadUserTags:()=>[],invReadTagColors:()=>({}),invTagCommit:()=>{writes++;return true;},invWriteProductActions:()=>{writes++;return true;}};
  context.hopeProductById=args=>args.id==='fabfilter|pro-q'?group:null;
  const call=run(cases,context);
  assert.equal((await call('plugin_tag_set',{id:'fabfilter|pro-q',tags:['Vocal'],confirmed:false})).needs_confirmation,true);
  assert.equal((await call('plugin_hide',{id:'fabfilter|pro-q',hidden:true,confirmed:false})).needs_confirmation,true);
  assert.equal(writes,0);
});
test('rescan waits for a changed completed scan and reports totals',async()=>{
  let clock=0,clicks=0,polls=0;
  const context={INV_SCAN_ROWS:[1],INV_SCAN_INFO:{generatedAt:'old'},pcCompanionCapability:{lastScanAt:'old'},pcCompanionConnected:true,invBuildGroups:rows=>rows,document:{getElementById:()=>({disabled:false,click(){clicks++;}})},Date:{now:()=>clock},setTimeout:fn=>{clock+=1000;fn();},pcCompanionFetch:async path=>({ok:true,json:async()=>path==='/status'?{scanning:++polls<3,lastScanAt:polls<3?'old':'new'}:{rows:[1,2]}}),pcCompanionAdopt:inventory=>{context.INV_SCAN_ROWS=inventory.rows;context.INV_SCAN_INFO.generatedAt='new';},pcCompanionReadUnused:async()=>[],hopePushPluginSummary:()=>{}};
  const result=await run(rescan,context)('inventory_rescan',{});
  assert.equal(result.ok,true);assert.equal(result.before_total,1);assert.equal(result.after_total,2);assert.equal(result.lastScanAt,'new');assert.equal(result.timed_out,false);assert.equal(clicks,1);assert.equal(polls,3);
});
test('rescan times out after 120 seconds without claiming a new count',async()=>{
  let clock=0;
  const context={INV_SCAN_ROWS:[1],INV_SCAN_INFO:{generatedAt:'old'},pcCompanionCapability:{lastScanAt:'old'},pcCompanionConnected:true,invBuildGroups:rows=>rows,document:{getElementById:()=>({disabled:false,click(){}})},Date:{now:()=>clock},setTimeout:fn=>{clock+=1000;fn();},pcCompanionFetch:async()=>({ok:true,json:async()=>({scanning:false,lastScanAt:'old'})})};
  const result=await run(rescan,context)('inventory_rescan',{});
  assert.equal(result.timed_out,true);assert.equal(result.ok,false);assert.equal(result.after_total,1);assert.equal(clock,120000);
});
test('settings_status returns only provider booleans and safe spend/model fields',()=>{
  const start=html.indexOf('function hopeSettingsStatus()'),end=html.indexOf('\nlet hopeReferenceBridge=',start);
  const store={secret:'SUPER_SECRET_KEY'};
  const context={AIMM_PROXY_URL:'https://example.invalid',EL_KEY_STORAGE:'eleven',RT_KEY_STORAGE:'openai',localStorage:{getItem:()=>store.secret},document:{getElementById:()=>({value:'selected-model'})},elLoadCostAccount:()=>({spent:5,creditsUsed:20,creditsLimit:100}),loadSpend:()=>({spent:3}),SPEND_KEY_OAI:'spend',pcCompanionConnected:false,pcCompanionCapability:null,pcCompanionBusy:false,INV_SCAN_INFO:{generatedAt:null}};
  vm.runInNewContext(html.slice(start,end)+'\nglobalThis.result=hopeSettingsStatus();',context);
  assert.equal(context.result.providers.elevenlabs,true);
  assert.equal(JSON.stringify(context.result).includes('SUPER_SECRET_KEY'),false);
  assert.equal(JSON.stringify(context.result).includes('https://example.invalid'),false);
});
test('standing Plugins summary reports scan, favourites, hidden and unknown Unused honestly',()=>{
  const start=html.indexOf('function hopePluginSummary()'),end=html.indexOf('\nfunction hopeSettingsStatus()',start);
  const group={name:'EQ',vendor:'Vendor'};
  const context={INV_SCAN_ROWS:[group],INV_SCAN_INFO:{generatedAt:'2026-11-20T10:00:00Z'},INV_SYNTHETIC_PREVIEW:false,pcCompanionUnusedEntries:null,pcCompanionConnected:true,pcCompanionCapability:{scanning:false},pcCompanionBusy:false,invBuildGroups:()=>[group],invReadProductActions:()=>({'vendor|eq':{hidden:true}}),invActionKey:()=> 'vendor|eq',invIsFavorite:()=>true};
  vm.runInNewContext(html.slice(start,end)+'\nglobalThis.summary=hopePluginSummary();',context);
  assert.equal(context.summary.total_plugins,1);assert.equal(context.summary.favorites,1);
  assert.equal(context.summary.hidden,1);assert.equal(context.summary.unused,null);
  assert.equal(context.summary.companion_connected,true);
});
test('snapshot note and MixBus writes refuse failed persistence',async()=>{
  const entry={id:'one',subject:'Test',text:'Before'};
  const context={STATE:{journal:[entry],chain:{master:[{n:'EQ'}]},userPresets:[]},BUSES:[{id:'master'}],PRESETS:[{id:'preset',label:'Preset',bus:'master',chain:[{n:'Comp'}]}],hopeStoredState:async()=>false,saveState:()=>{},renderJournal:()=>{},renderFavouritePills:()=>{},cloneWorkbenchState:()=>({chain:{master:[]}}),document:{getElementById:()=>({checked:false})},applyPreset:()=>{},autoFillChainSettings:async()=>({ok:true,changes:[]}),renderChain:()=>{}};
  const call=run(cases,context);
  assert.equal((await call('snapshots_add_note',{id:'one',note:'After',confirmed:false})).needs_confirmation,true);
  assert.equal(entry.text,'Before');
  assert.equal((await call('snapshots_add_note',{id:'one',note:'After',confirmed:true})).ok,false);
  assert.equal((await call('mixbus_load_preset',{name:'Preset',confirmed:false})).needs_confirmation,true);
  assert.equal((await call('mixbus_load_preset',{name:'Preset',confirmed:true})).ok,false);
  assert.equal((await call('mixbus_auto_fill',{confirmed:false})).needs_confirmation,true);
  assert.equal((await call('mixbus_auto_fill',{confirmed:true})).ok,false);
});
test('saved target uses confirmation and checks persisted selection',()=>{
  const start=html.indexOf('  hopeReferenceBridge={'),end=html.indexOf('\n  window.addEventListener',start);
  const select={value:'__default__'};
  const context={MC_TRACK_TARGET_SELECTED_KEY:'target',refTrackTargets:[{id:'one',name:'Target'}],document:{getElementById:()=>select},window:{refTargetChanged:()=>{}},localStorage:{getItem:()=>null}};
  vm.runInNewContext('let hopeReferenceBridge=null;'+html.slice(start,end)+'\nglobalThis.bridge=hopeReferenceBridge;',context);
  const preview=context.bridge.apply({id:'one',confirmed:false});
  assert.equal(preview.needs_confirmation,true);assert.equal(select.value,'__default__');
  assert.equal(context.bridge.apply({id:'one',confirmed:true}).ok,false);
});
test('excluded capture tools are absent from both schemas and handler',()=>{
  for(const name of ['reference_capture_spotify','match_sound']){
    assert.equal(byName.has(name),false);
    assert.equal(html.includes("case '"+name+"':"),false);
  }
});
