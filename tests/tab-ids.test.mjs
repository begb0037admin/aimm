import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const start=html.indexOf('function aimmMapLegacyTabId(');
const end=html.indexOf('(function aimmMigrateStoredTabOrder()',start);
const ctx=vm.createContext({});
vm.runInContext(html.slice(start,end),ctx);
const order=values=>Array.from(ctx.aimmMigrateTabOrderIds(values));
test('localStorage tab order migrates in place, preserves order and unknown ids, and is idempotent',()=>{
  const saved=new Map([['aimmTabOrder_v2',JSON.stringify(['snapshots','eq','future','library','chain','knowledge'])]]);
  let writes=0;
  const storage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>{writes++;saved.set(key,value);}};
  const code=html.slice(html.indexOf('(function aimmMigrateStoredTabOrder()'),html.indexOf('// Tab order persistence',start));
  ctx.localStorage=storage;ctx.console=console;
  vm.runInContext(code,ctx);
  const migrated=JSON.parse(saved.get('aimmTabOrder_v2'));
  assert.deepEqual(migrated,['library','mixcheck','future','plugins','mixbus']);
  assert.equal(writes,1);
  vm.runInContext(code,ctx);
  assert.equal(writes,1);
  assert.deepEqual(order(migrated),migrated);
});
test('switch_tab maps old ids to their new ids and accepts new ids',()=>{
  for(const [oldId,newId] of Object.entries({chain:'mixbus',eq:'mixcheck',knowledge:'library',snapshots:'library'})){
    assert.equal(ctx.aimmMapLegacyTabId(oldId),newId);
    assert.equal(ctx.aimmMapLegacyTabId(newId),newId);
  }
  assert.match(html,/case 'switch_tab':\{[\s\S]*?const tab = aimmMapLegacyTabId\(requestedTab\)/);
});
test('a pre-rename Plugins library id is preserved as Plugins in old tab orders',()=>{
  assert.deepEqual(order(['chain','library','knowledge','snapshots','eq']),['mixbus','plugins','library','mixcheck']);
});
