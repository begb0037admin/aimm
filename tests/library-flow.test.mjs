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
test("Hope tip stays in Hope's review until Keep, and Undo restores it",()=>{
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
test('video browse starts closed, search opens matching groups, clearing closes it',()=>{
  assert.match(html, /data-sec="videos" data-open="false"><button class="bar" type="button" aria-expanded="false"/);
  const bar={expanded:null,setAttribute(_key,value){this.expanded=value}};
  const card={dataset:{open:'false'},querySelector:()=>bar};
  const search={value:'compression'};
  let renders=0;
  const ctx={document:{querySelector:()=>card,getElementById:()=>search},LIB_UI:{groups:{vmixing:false,nmixing:false}},libraryRender:()=>renders++};
  vm.runInNewContext(code('function libSearchChanged','function libFoldAll'),ctx);
  ctx.libSearchChanged();
  assert.equal(card.dataset.open,'true');assert.equal(bar.expanded,'true');
  assert.equal(ctx.LIB_UI.groups.vmixing,true);assert.equal(ctx.LIB_UI.groups.nmixing,false);
  search.value='  ';ctx.libSearchChanged();
  assert.equal(card.dataset.open,'false');assert.equal(bar.expanded,'false');assert.equal(renders,2);
});
test('undated videos display an en dash',()=>{
  const ctx={};vm.runInNewContext(code('function libDate','function libChatTurns'),ctx);
  assert.equal(ctx.libDate(null,'–'),'–');
  assert.equal(ctx.libDate(null),'Library');
  assert.match(html,/libDate\(v\.added,'–'\)/);
});
