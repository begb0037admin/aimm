import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const helpers=html.slice(html.indexOf('const HOPE_INVENTORY_EMPTY='),html.indexOf('async function handleToolCall(name,args)'));
const cases=html.slice(html.indexOf("      case 'inventory_search':{"),html.indexOf("      case 'inventory_add_to_bus':{"));
assert.ok(helpers.includes('invPrimaryProductStatus(group.statusCounts)'));
assert.ok(cases.includes("case 'inventory_summary':"));
const code=helpers+'\nasync function call(name,args={}){switch(name){'+cases+'default:throw Error(name);}} globalThis.call=call;';

function harness(rows=[]){
  const state={scope:'updates',search:'visible',formats:new Set(['AU'])};
  let renders=0,clicks=0,fetches=0;
  const context={
    INV_SCAN_ROWS:rows,INV_SCAN_INFO:{source:'companion',generatedAt:'2026-11-20T10:00:00Z'},INV_SYNTHETIC_PREVIEW:false,
    pcCompanionDuplicateGroups:[{vendor:'Acme',name:'One'}],
    INV_SCOPE:state.scope,INV_SEARCH:state.search,INV_FORMATS:state.formats,
    document:{querySelector(){clicks++;throw Error('DOM touched');},getElementById(){clicks++;throw Error('DOM touched');}},
    fetch(){fetches++;throw Error('fetch called');},invRenderInventory(){renders++;throw Error('render called');},
    invNorm:value=>String(value||'').toLowerCase(),
    invBuildGroups(scan){
      const groups=new Map();
      for(const row of scan){const key=row.vendor+'|'+row.name;let group=groups.get(key);
        if(!group){group={name:row.name,vendor:row.vendor,category:row.category||'',formats:new Set(),versions:new Set(),records:0,formatRows:new Map(),statusCounts:{updates:0,'up-to-date':0,'manual-check':0,'vendor-app':0,unchecked:0}};groups.set(key,group);}
        group.formats.add(row.format);group.versions.add(row.version);group.records++;
        if(!group.formatRows.has(row.format))group.formatRows.set(row.format,[]);
        group.formatRows.get(row.format).push(row);group.statusCounts[row.status]++;
      }
      return [...groups.values()];
    },
    invPrimaryProductStatus(counts){return ['updates','manual-check','vendor-app','unchecked','up-to-date'].find(key=>counts[key])||'unchecked';},
    invKnownVendorRelease:row=>row.latestVersion?{latestVersion:row.latestVersion}:null,
    invCompareVersions:(a,b)=>a.localeCompare(b,undefined,{numeric:true}),
    resolvePubKey:()=> 'other',allPlugins:()=>[],PUBS:{},invIsFavorite:()=>false,
  };
  vm.runInNewContext(code,context);
  return {call:context.call,state,context,get sideEffects(){return {renders,clicks,fetches};}};
}
const rows=[
  {name:'One',vendor:'Acme',format:'AU',version:'1.0',status:'updates',latestVersion:'2.0'},
  {name:'One',vendor:'Acme',format:'VST3',version:'1.0',status:'updates',latestVersion:'2.0'},
  {name:'Two',vendor:'Acme',format:'VST3',version:'3.0',status:'up-to-date'},
  {name:'Three',vendor:'Other',format:'CLAP',version:'1.0',status:'vendor-app'},
];

test('search reads scan rows without touching DOM, tabs, filters or companion',async()=>{
  const h=harness(rows),result=await h.call('inventory_search',{query:'one'});
  assert.equal(result.total,1);assert.equal(result.results[0].update_status,'updates_available');
  assert.equal(result.results[0].latest_version,'2.0');assert.equal(result.results[0].duplicate,true);
  assert.equal('unused' in result.results[0],false);
  assert.deepEqual(h.sideEffects,{renders:0,clicks:0,fetches:0});
  assert.equal(h.context.INV_SCOPE,'updates');assert.equal(h.context.INV_SEARCH,'visible');
  assert.deepEqual([...h.context.INV_FORMATS],['AU']);
});

test('status and format filters select products',async()=>{
  const h=harness(rows);
  const result=await h.call('inventory_search',{status:'updates_available',format:'VST3'});
  assert.deepEqual(result.results.map(row=>row.name),['One']);
  assert.equal(result.total,1);
  await assert.rejects(h.call('inventory_search',{status:'bad'}),/Unknown plug-in update status/);
});

test('summary counts products across formats and sidebar status groups',async()=>{
  const h=harness(rows),result=await h.call('inventory_summary');
  assert.equal(result.total_products,3);
  assert.deepEqual({...result.counts_by_format},{AU:1,VST2:0,VST3:2,CLAP:1});
  assert.deepEqual({...result.counts_by_update_status},{updates_available:1,up_to_date:1,manual_check:0,vendor_app:1,unchecked:0});
  assert.deepEqual(JSON.parse(JSON.stringify(result.top_vendors)),[{vendor:'Acme',products:2},{vendor:'Other',products:1}]);
  assert.equal(result.scannedAt,'2026-11-20T10:00:00Z');assert.equal(result.source,'companion');
  assert.deepEqual(h.sideEffects,{renders:0,clicks:0,fetches:0});
});

test('empty scan returns the existing message for both tools',async()=>{
  const h=harness();
  const search=await h.call('inventory_search',{}),summary=await h.call('inventory_summary');
  assert.match(search.message,/No scanned plug-in inventory/);
  assert.equal(summary.message,search.message);
  assert.equal(summary.total_products,0);
});
