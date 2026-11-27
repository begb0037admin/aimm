import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const catalogs=['../standalone/assets/hope-tools-manifest.json','../new-hope-tools.json','../elevenlabs-client-tools.json'].map(path=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8')));

test('Hope uses ordinary reply bubbles and keeps the NotebookLM pattern',()=>{
  assert.match(html,/const AIMM_BUILD = '2026-11-23\.71'/);
  assert.match(html,/isNbPrompt\?'ai hope-card'/);
  assert.match(html,/NotebookLM prompt for '\+escapeHtml\(m\.topic/);
  assert.match(html,/notebooklm-sources-label">Sources to add/);
  assert.match(html,/aichat-favourite/);
  assert.match(html,/aichat-speak-message/);
  assert.match(html,/aichat-copy-btn/);
  assert.doesNotMatch(html,/function renderFixActionBody|aimmFixCardDone|aimmApplyMixMove|hope-card-action|hope-card-accent|hope-card-done|case 'propose_mix_move'|name:'propose_mix_move'/);
});

test('old action entries are purged on load and cannot render',()=>{
  const marker="  history: (function(){try{const history=JSON.parse(localStorage.getItem(AICHAT_HISTORY_KEY)||'[]');";
  assert.ok(html.includes(marker));
  assert.match(html,/history\.filter\(m=>m&&!\['fix-action','fix-history','mix-move'\]\.includes\(m\.kind\)\)/);
  assert.match(html,/if\(\['breakdown','fix-action','fix-history','mix-move'\]\.includes\(m\.kind\)\)return ''/);
});

test('NotebookLM prompt and real sources copy cleanly',()=>{
  const start=html.indexOf('function aimmNotebookLmPromptText(topic){');
  const end=html.indexOf('function aichatRender(){',start);
  assert.ok(start>0&&end>start);
  const context={URL};
  vm.runInNewContext(html.slice(start,end)+'globalThis.visible=aimmNotebookLmVisibleText;globalThis.sources=aimmNotebookLmSources;globalThis.copy=aimmNotebookLmCopyText;',context);
  assert.match(context.visible({topic:'Vocal Balance',content:'NotebookLM research prompt'}),/Synthesise Vocal Balance/);
  assert.equal(context.visible({topic:'Vocal Balance',content:'My custom prompt'}),'My custom prompt');
  const message={topic:'Vocal Balance',content:'My custom prompt',sources:[
    {title:'Mix With The Masters: Vocal Balance',url:'https://www.youtube.com/watch?v=abcdefghijk'},
    {title:'Unsafe',url:'javascript:alert(1)'},
    {title:'Duplicate',url:'https://www.youtube.com/watch?v=abcdefghijk'}]};
  assert.equal(context.sources(message).length,1);
  assert.equal(context.copy(message),'My custom prompt\n\nSources to add\nMix With The Masters: Vocal Balance — https://www.youtube.com/watch?v=abcdefghijk');
});

test('walkthrough requires a clear yes and skips a final no',()=>{
  assert.match(html,/FIX QUEUE WALKTHROUGH: When Mix Check analysis finishes/);
  assert.match(html,/greet Kev by name/);
  assert.match(html,/Give the Fix Queue count in words/);
  assert.match(html,/offer to take the fixes one at a time/);
  assert.match(html,/Never open with “I found N items”/);
  assert.match(html,/Between fixes use a brief human transition/);
  assert.match(html,/Only on Kev’s clear yes, call add_plugin_to_bus, then set_plugin_settings, then mark_fix_applied/);
  assert.match(html,/if he still declines, call skip_fix/);
  assert.match(html,/After the last item, say the queue is clear/);
  assert.match(html,/No list or precise readings/);
  for(const catalog of catalogs){
    assert.ok(!catalog.some(x=>x.name==='propose_mix_move'));
    assert.ok(!catalog.some(x=>x.name==='dismiss_fix'));
    const mark=catalog.find(x=>x.name==='mark_fix_applied');
    if(mark)assert.match(mark.description,/clearly says yes/);
  }
});
