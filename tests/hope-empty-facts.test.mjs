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
  assert.deepEqual(Array.from(await context.extractProfile('transcript', []), f => f.text),
    ['Prefers dry vocals', 'Mixes at low volume']);
  reply = '[{"category":"vocals","text":"Prefers dry vocals"},{"category":"misc","text":"[]"}]';
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

test('load cleanup removes blank facts once and keeps real, pinned and edited facts', () => {
  const saved = [
    {id:'bad', text:'[]'},
    {id:'bad2', text:'n/a'},
    {id:'real', text:'Prefers dry vocals'},
    {id:'pinned', text:'[]', pinned:true},
    {id:'edited', text:'none', edited:true}
  ];
  const statuses = [];
  let saves = 0;
  let storage = JSON.stringify({profile:'[]', profileFacts:saved});
  const context = vm.createContext({
    localStorage: {getItem: () => storage},
    STORAGE_KEY: 'trapMasterState_v1',
    STATE: {profile:'', profileFacts:[], chain:{}, favorites:new Set(), symptoms:new Set(), customPlugins:[]},
    BUSES: [], TOP_PICKS:{}, PROFILE_MAX_LEN:2048,
    document: {getElementById: () => null},
    parseLegacyProfileToFacts: () => { throw Error('unexpected migration'); },
    syncLegacyProfileFromFacts(){ context.STATE.profile = context.STATE.profileFacts.map(f => f.text).join('\n\n'); },
    saveState(){ saves++; storage = JSON.stringify({profile:context.STATE.profile, profileFacts:context.STATE.profileFacts}); },
    setProfileStatus(message){ statuses.push(message); },
    console
  });
  vm.runInContext(guard + source('function loadState()', '// ========== PROFILE — cross-conversation memory'), context);
  context.loadState();
  assert.deepEqual(Array.from(context.STATE.profileFacts, f => f.id), ['real', 'pinned', 'edited']);
  assert.equal(saves, 1);
  assert.deepEqual(statuses, ['Removed 2 blank facts']);
  context.loadState();
  assert.equal(saves, 1);
  assert.deepEqual(statuses, ['Removed 2 blank facts']);
});
