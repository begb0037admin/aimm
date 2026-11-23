import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
function source(start, end){
  const a = html.indexOf(start), b = html.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `found ${start}`);
  return html.slice(a, b);
}
const guard = source('function isMeaningfulFactText(', 'function categorizeFactText(');
const extract = source('async function extractProfile(', '// Orchestrator: at end');

test('extraction treats parsed empty arrays as no facts and accepts valid JSON', async () => {
  let reply = '';
  const context = vm.createContext({
    aimmAiText: async () => reply,
    PROFILE_CATEGORIES: [{id:'vocals'}, {id:'misc'}],
    categorizeFactText: () => 'misc'
  });
  vm.runInContext(guard + extract, context);
  for (const answer of ['[]', '[ ]', 'none', 'No new facts.']){
    reply = answer;
    assert.deepEqual(Array.from(await context.extractProfile('transcript', [])), [], answer);
  }
  reply = '- Prefers dry vocals\n- Mixes at low volume';
  assert.deepEqual(Array.from(await context.extractProfile('transcript', [])), []);
  reply = '[{"category":"vocals","text":"Prefers dry vocals","importance":4},{"category":"misc","text":"[]","importance":5},{"category":"misc","text":"Temporary preference","importance":3}]';
  assert.deepEqual(Array.from(await context.extractProfile('transcript', []), f => f.text), ['Prefers dry vocals']);
});

test('fact guard rejects short and placeholder answers', () => {
  const context = vm.createContext({});
  vm.runInContext(guard, context);
  for (const value of ['', '[]', '{}', 'a1', 'none', 'N/A', 'nothing new!', 'No new facts.']){
    assert.equal(context.isMeaningfulFactText(value), false, value);
  }
  for (const value of ['808', 'Mixes at low volume', '日本語']){
    assert.equal(context.isMeaningfulFactText(value), true, value);
  }
});

test('load preserves all historical facts for backed-up migration', async () => {
  const saved = [{id:'bad',text:'[]'},{id:'real',text:'Prefers dry vocals'},{id:'pinned',text:'[]',pinned:true}];
  const storage=JSON.stringify({profileFacts:saved});
  let migrationCalls=0;
  const context=vm.createContext({
    localStorage:{getItem:k=>k==='trapMasterState_v1'?storage:null,removeItem(){}}, STORAGE_KEY:'trapMasterState_v1',PROFILE_MIGRATION_KEY:'migration',
    STATE:{profile:'',profileFacts:[],chain:{},favorites:new Set(),symptoms:new Set(),customPlugins:[]},
    BUSES:[],TOP_PICKS:{},PROFILE_MAX_LEN:1500,document:{getElementById:()=>null},
    migrateProfileFacts(){migrationCalls++;},console
  });
  vm.runInContext(source('function loadState()', '// ========== PROFILE — cross-conversation memory'),context);
  context.loadState();
  await new Promise(setImmediate);
  assert.deepEqual(Array.from(context.STATE.profileFacts,f=>f.id),['bad','real','pinned']);
  assert.equal(migrationCalls,1);
});
