import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const helper=html.slice(html.indexOf('async function hopeInventorySetFavorite('),html.indexOf('async function handleToolCall('));
const rows=[{name:'Pro-Q',vendor:'FabFilter'},{name:'Echo',vendor:'Acme'},{name:'Echo',vendor:'Other'}];
function harness({initial=[],fail=false,scope='favorites'}={}){
  const favorites=new Set(initial),calls={toggle:0,refresh:0,tab:0},storage=new Map([['trapMasterState_v1',JSON.stringify({favorites:initial})]]);
  const context={INV_SCAN_ROWS:rows,INV_SCOPE:scope,STORAGE_KEY:'trapMasterState_v1',STATE:{favorites},
    invNorm:value=>String(value||'').trim().toLowerCase(),
    invBuildGroups:scan=>scan.map(row=>({...row})),
    invUadSplit:groups=>({owned:groups,notLicensed:[]}),
    invFavoriteKey:(name,vendor)=>'inventory:'+vendor.toLowerCase()+'|'+name.toLowerCase(),
    invIsFavorite:(name,vendor)=>favorites.has('inventory:'+vendor.toLowerCase()+'|'+name.toLowerCase()),
    async invToggleFavorite(name,vendor){const key='inventory:'+vendor.toLowerCase()+'|'+name.toLowerCase();calls.toggle++;favorites.has(key)?favorites.delete(key):favorites.add(key);if(!fail)storage.set('trapMasterState_v1',JSON.stringify({favorites:[...favorites]}));return !fail;},
    invRenderInventory(){calls.refresh++;},
    localStorage:{getItem:key=>storage.get(key)||null},
  };
  vm.runInNewContext(helper+'globalThis.setFavorite=hopeInventorySetFavorite;',context);
  return {set:context.setFavorite,calls,storage,context};
}

test('star and unstar save, refresh the open Favorites view and leave the tab and filter untouched',async()=>{
  const h=harness();
  const star=await h.set({plugin:' pro-q ',publisher:'fabfilter',favorite:true});
  assert.deepEqual(JSON.parse(JSON.stringify(star)),{ok:true,changed:true,plugin:'Pro-Q',publisher:'FabFilter',favorite:true,favorites_count:1});
  assert.equal(JSON.parse(h.storage.get('trapMasterState_v1')).favorites[0],'inventory:fabfilter|pro-q');
  const unstar=await h.set({plugin:'Pro-Q',favorite:false});
  assert.equal(unstar.ok,true);assert.equal(unstar.changed,true);assert.equal(unstar.favorites_count,0);
  assert.deepEqual(h.calls,{toggle:2,refresh:2,tab:0});assert.equal(h.context.INV_SCOPE,'favorites');
  assert.match(helper,/await invToggleFavorite\(group.name,group.vendor\)/);
  assert.match(helper,/invRenderInventory\(\)/);
  assert.match(html,/function invFavoriteKey\(name,vendor\)/);
  assert.match(html,/return toggleFav\(invLegacyFavorite/);
  assert.match(html,/data-inv-fav-vendor/);
});

test('already starred returns changed false without saving or rendering',async()=>{
  const h=harness({initial:['inventory:fabfilter|pro-q']}),result=await h.set({plugin:'Pro-Q',favorite:true});
  assert.equal(result.ok,true);assert.equal(result.changed,false);assert.match(result.message,/Already starred/);
  assert.equal(h.calls.toggle,0);assert.equal(h.calls.refresh,0);
});

test('ambiguous names require publisher and missing names change nothing',async()=>{
  const h=harness();
  const ambiguous=await h.set({plugin:'Echo',favorite:true});
  assert.equal(ambiguous.code,'ambiguous');assert.deepEqual(JSON.parse(JSON.stringify(ambiguous.candidates)),[{name:'Echo',publisher:'Acme'},{name:'Echo',publisher:'Other'}]);
  assert.equal((await h.set({plugin:'Missing',favorite:true})).code,'not_found');
  assert.equal(h.calls.toggle,0);assert.equal(h.calls.refresh,0);
});

test('publisher disambiguation changes only the named scanned product',async()=>{
  const h=harness(),result=await h.set({plugin:'Echo',publisher:'Other',favorite:true});
  assert.equal(result.ok,true);assert.equal(result.favorites_count,1);
  assert.deepEqual(JSON.parse(h.storage.get('trapMasterState_v1')).favorites,['inventory:other|echo']);
});

test('persistence failure reports not_saved without claiming success',async()=>{
  const h=harness({fail:true}),result=await h.set({plugin:'Pro-Q',favorite:true});
  assert.deepEqual(JSON.parse(JSON.stringify(result)),{ok:false,code:'not_saved',message:'The favourite change could not be verified in saved storage.'});
  assert.equal(h.calls.refresh,1);assert.equal(JSON.parse(h.storage.get('trapMasterState_v1')).favorites.length,0);
});

test('tool schema and both route registration include inventory_set_favorite',()=>{
  assert.match(html,/name:'inventory_set_favorite'.*required:\['plugin','favorite'\]/);
  assert.match(html,/const AIMM_NEW_AGENT_TOOLS = .*'inventory_set_favorite'/);
  assert.match(html,/const AICHAT_TOOL_DEFS = TOOL_DEFS.map/);
  assert.match(html,/case 'inventory_set_favorite':return await hopeInventorySetFavorite\(args\)/);
});

test('the Plugins star control keeps publishers separate and honours unique legacy favourites',async()=>{
  const source=html.slice(html.indexOf('function invFavoriteKey('),html.indexOf('const INV_DB_NAME ='));
  const favorites=new Set(['Pro-Q']);
  const ctx={STATE:{favorites},INV_SCAN_ROWS:rows,INV_SYNTHETIC_PREVIEW:false,INV_SYNTHETIC_FAVORITES:new Set(),
    invNorm:value=>String(value||'').toLowerCase(),invRenderInventory:()=>{},
    UadLicence:{licensed:()=>true},UAD_LICENCE_DATA:null,invGetProductActions:()=>({}),
    toggleFav:key=>{favorites.has(key)?favorites.delete(key):favorites.add(key);return Promise.resolve(true);},Promise};
  vm.runInNewContext(source+'globalThis.star={get:invIsFavorite,toggle:invToggleFavorite};',ctx);
  assert.equal(ctx.star.get('Pro-Q','FabFilter'),true);
  await ctx.star.toggle('Pro-Q','FabFilter');
  assert.equal(ctx.star.get('Pro-Q','FabFilter'),false);
  await ctx.star.toggle('Echo','Other');
  assert.equal(ctx.star.get('Echo','Other'),true);
  assert.equal(ctx.star.get('Echo','Acme'),false);
});
