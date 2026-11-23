import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
test('markup fixes tab order with Mix Check selected by default',()=>{
  const tabs=html.match(/<button class="tab oz-tab(?: active)?" data-tab="[^"]+"[^>]*>/g) ?? [];
  assert.deepEqual(tabs.map(tab=>tab.match(/data-tab="([^"]+)"/)[1]),
    ['mixcheck','library','mixbus','plugins','community','marketing','settings']);
  assert.match(tabs[0],/class="tab oz-tab active"/);
  assert.equal(tabs.filter(tab=>tab.includes('class="tab oz-tab active"')).length,1);
});
test('saved tab orders are cleared without replay or migration',()=>{
  assert.doesNotMatch(html,/aimmReplayTabOrder|aimmMigrateStoredTabOrder|aimmMigrateTabOrderIds/);
  const start=html.indexOf('(function aimmClearStoredTabOrder()');
  const end=html.indexOf('// Drag-to-reorder the tab nav',start);
  assert.ok(start>0 && end>start);
  const saved=new Map([['aimmTabOrder_v1','old'],['aimmTabOrder_v2','old']]);
  vm.runInNewContext(html.slice(start,end),{localStorage:{removeItem:key=>saved.delete(key)},console});
  assert.equal(saved.size,0);
});
test('switch_tab maps old ids to their new ids and accepts new ids',()=>{
  const start=html.indexOf('function aimmMapLegacyTabId(');
  const end=html.indexOf('(function aimmClearStoredTabOrder()',start);
  const ctx=vm.createContext({});
  vm.runInContext(html.slice(start,end),ctx);
  for(const [oldId,newId] of Object.entries({chain:'mixbus',eq:'mixcheck',knowledge:'library',snapshots:'library'})){
    assert.equal(ctx.aimmMapLegacyTabId(oldId),newId);
    assert.equal(ctx.aimmMapLegacyTabId(newId),newId);
  }
  assert.match(html,/case 'switch_tab':\{[\s\S]*?const tab = aimmMapLegacyTabId\(requestedTab\)/);
  assert.match(html,/const VALID = \['mixcheck','library','mixbus','plugins','community','marketing','settings'\]/);
  assert.match(html,/name:'switch_tab'[\s\S]*?enum:\['mixcheck','library','mixbus','plugins','community','marketing','settings','knowledge','snapshots'\]/);
});
