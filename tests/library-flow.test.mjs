import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
function code(start,end){return html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));}
test('removed note categories migrate to Mixing techniques without dropping notes',()=>{
  const ctx={STATE:{knowledge:[{id:'one',category:'plugins'},{id:'two',category:'misc'},{id:'three',category:'vocals'}]},saveState:()=>{},console};
  vm.runInNewContext(code('const KB_CATEGORIES =','// Active bytes'),ctx);
  assert.equal(ctx.knowledgeMigrateCategories(),2);
  assert.deepEqual(ctx.STATE.knowledge.map(n=>n.category),['mixing','mixing','vocals']);
  assert.equal(ctx.knowledgeMigrateCategories(),0);
});
test('Hope tip stays in To review until Keep, and Undo restores it',()=>{
  const note={id:'tip1',title:'Tip',raw:'Try parallel compression',category:'mixing',toReview:true,active:false};
  const ctx={STATE:{knowledge:[note]},LIB_UI:{kept:null},saveState:()=>{},knowledgeRender:()=>{},libraryRender:()=>{},confirm:()=>true};
  vm.runInNewContext(code('function libKeepTip','renderJournal();'),ctx);
  ctx.libKeepTip('tip1');
  assert.equal(note.toReview,false);assert.equal(note.origin,'hope');
  ctx.libUndoTip();
  assert.equal(note.toReview,true);assert.equal(note.active,false);
});
test('Hope reads control persists video exclusions',()=>{
  const values=new Map();
  const ctx={localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)},libraryRender:()=>{},toast:()=>{}};
  vm.runInNewContext(code('function libVideoSkipped','function libFold('),ctx);
  assert.equal(ctx.libVideoReads('QWERTY12345'),true);
  ctx.libToggleVideoRead('QWERTY12345');
  assert.equal(ctx.libVideoReads('QWERTY12345'),false);
  assert.deepEqual(JSON.parse(values.get('aimmLibrarySkippedVideos_v1')),['QWERTY12345']);
  ctx.libToggleVideoRead('QWERTY12345');
  assert.equal(ctx.libVideoReads('QWERTY12345'),true);
});
