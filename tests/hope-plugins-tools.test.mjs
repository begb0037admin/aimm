import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const helpers=html.slice(html.indexOf('function pcCompanionRows('),html.indexOf('function pcCompanionDialog('));
const action=html.slice(html.indexOf('async function pcCompanionAction('),html.indexOf('function pcCompanionConfirm('));
const cases=html.slice(html.indexOf("      case 'inventory_status':{"),html.indexOf("      case 'inventory_add_to_bus':{"));
const row={id:'row-1',name:'Pro-Q',vendor:'FabFilter',format:'VST3',version:'3',source:'companion',path:'/private/example'};
function harness(connected=true){
  const calls=[];
  const context={
    pcCompanionConnected:connected,pcCompanionActions:connected,pcCompanionCapability:{version:'0.2.0'},pcCompanionLastAction:null,
    pcCompanionDuplicateGroups:null,pcCompanionUnusedEntries:null,pcCompanionMoveNames:new Map(),
    INV_SCAN_ROWS:[row],INV_SCAN_INFO:{source:'companion',generatedAt:'2026-11-20T10:00:00Z',bundles:1,unreadable:0},
    INV_VENDOR_CHECKS:{},INV_SYNTHETIC_PREVIEW:false,
    invNorm:value=>String(value||'').toLowerCase(),invActionKey:(vendor,name)=>vendor.toLowerCase()+'|'+name.toLowerCase(),
    invBuildGroups:()=>[{vendor:'FabFilter',name:'Pro-Q',statusCounts:{'vendor-app':1},versions:new Set(['3'])}],
    invPrimaryProductStatus:()=> 'vendor-app',invActiveVendorCheck:()=>null,
    invMarkVendorChecks:()=>true,invUnmarkVendorCheck:()=>{},
    invStatus:()=>{},pcCompanionAdopt:()=>{},pcCompanionUnavailable:()=>{},
    pcCompanionFetch:async(path,options)=>{calls.push({path,options});return {ok:true,json:async()=>path==='/duplicates'?{groups:[{name:'Pro-Q',format:'VST3',needsReview:false,items:[{keep:true,rowIds:['new']},{keep:false,rowIds:['old']}]}]}:path==='/unused'?[{moveId:'move-1',name:'Pro-Q',vendor:'FabFilter',format:'VST3',version:'3'}]:{results:[{id:'row-1',ok:false,reason:'administrator approval cancelled'}]}};},
    document:{getElementById:()=>({disabled:false,click(){}})},Date,Set,Map,JSON,
  };
  vm.runInNewContext(helpers+action+`async function call(name,args={}){switch(name){${cases}default:throw Error(name)}}globalThis.call=call;`,context);
  return {call:context.call,calls,context};
}
test('disconnected reads state without contacting the companion',async()=>{
  const h=harness(false);
  assert.equal((await h.call('inventory_status')).connected,false);
  assert.equal((await h.call('inventory_duplicates')).connected,false);
  assert.equal((await h.call('inventory_unused')).connected,false);
  assert.equal(h.calls.length,0);
});
test('unconfirmed moves and trash make no fetch',async()=>{
  const h=harness();
  for(const name of ['inventory_move_to_unused','inventory_move_to_trash']){
    const result=await h.call(name,{plugin:'Pro-Q',publisher:'FabFilter',confirmed:false});
    assert.equal(result.needs_confirmation,true);assert.equal(result.count,1);
  }
  assert.equal(h.calls.length,0);
});
test('confirmed move posts row IDs only and returns companion failure reason',async()=>{
  const h=harness();
  const result=await h.call('inventory_move_to_unused',{plugin:'Pro-Q',publisher:'FabFilter',confirmed:true});
  assert.equal(h.calls[0].path,'/action/unuse');
  assert.deepEqual(JSON.parse(h.calls[0].options.body),{ids:['row-1']});
  assert.equal(result.results[0].reason,'administrator approval cancelled');
});
test('trash needs both confirmations',async()=>{
  const h=harness();
  assert.equal((await h.call('inventory_move_to_trash',{plugin:'Pro-Q',publisher:'FabFilter',confirmed:true})).needs_confirmation,true);
  assert.equal(h.calls.length,0);
  await h.call('inventory_move_to_trash',{plugin:'Pro-Q',publisher:'FabFilter',confirmed:true,confirmed_trash:true});
  assert.equal(h.calls[0].path,'/action/trash');
  assert.deepEqual(JSON.parse(h.calls[0].options.body),{ids:['row-1']});
});
test('restore and duplicate cleanup use cached lists and companion IDs',async()=>{
  const h=harness();
  await h.call('inventory_unused');await h.call('inventory_duplicates');
  h.calls.length=0;
  assert.equal((await h.call('inventory_restore',{plugin:'Pro-Q',publisher:'FabFilter',confirmed:false})).needs_confirmation,true);
  assert.equal((await h.call('inventory_keep_newest_duplicates',{confirmed:false})).needs_confirmation,true);
  assert.equal(h.calls.length,0);
  await h.call('inventory_restore',{plugin:'Pro-Q',publisher:'FabFilter',confirmed:true});
  await h.call('inventory_keep_newest_duplicates',{confirmed:true});
  assert.deepEqual(JSON.parse(h.calls[0].options.body),{moveIds:['move-1']});
  assert.deepEqual(JSON.parse(h.calls[1].options.body),{ids:['old']});
});
test('reveal uses companion row IDs without confirmation',async()=>{
  const h=harness();
  await h.call('inventory_reveal',{plugin:'Pro-Q',publisher:'FabFilter',format:'VST3'});
  assert.equal(h.calls[0].path,'/action/reveal');
  assert.deepEqual(JSON.parse(h.calls[0].options.body),{ids:['row-1']});
});
test('vendor check changes only after confirmation',async()=>{
  const h=harness();let marks=0;
  h.context.invMarkVendorChecks=()=>{marks++;return true;};
  assert.equal((await h.call('inventory_mark_vendor_app_checked',{plugin:'Pro-Q',publisher:'FabFilter',confirmed:false})).needs_confirmation,true);
  assert.equal(marks,0);assert.equal(h.calls.length,0);
  await h.call('inventory_mark_vendor_app_checked',{plugin:'Pro-Q',publisher:'FabFilter',confirmed:true});
  assert.equal(marks,1);
});
