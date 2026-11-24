import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../docs/knowledge/index.json',import.meta.url),'utf8'));
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
test('Library cards follow the player with normal titles and no Browse or Videos card',()=>{
  const library=html.slice(html.indexOf('<div class="panel" id="library">'),html.indexOf('<div class="panel" id="snapshots">'));
  const positions=['id="libPlayer"','data-sec="notes"','data-sec="chats"','data-sec="add"','data-sec="review"'].map(marker=>library.indexOf(marker));
  assert.ok(positions.every((position,i)=>position>=0&&(i===0||position>positions[i-1])));
  assert.doesNotMatch(library,/data-sec="(?:browse|videos)"|id="(?:libBrowse|libVideoRows|libVideoCount|libSearch|libChannel)"/);
  assert.match(library,/<div class="lib-group">\s*<section class="card" data-sec="notes"/);
  assert.match(html,/#library \.bar\{[^}]*color:var\(--aimm-page-heading-color\)/);
  assert.match(library,/id="libPlayerSearch"/);
  assert.match(library,/id="libPlayerChannelFilter"/);
});
test('removed Browse and Videos code has no remaining references',()=>{
  assert.doesNotMatch(html,/libBrowse|libVideoRows|libVideoCount|libViewVideo|libVideoNote|libFoldAll|libSearchChanged|libChannelChanged|libVideoReads|kbVideoDelete|data-sec=browse|data-sec=videos/);
  assert.doesNotMatch(code('function libraryRender','async function libAddLink'),/libSearch|libChannel|filteredVideos|libVideoContent/);
});
test('playlist channels sort alphabetically and search combines with channel filter',()=>{
  const videos=[{title:'Bass compression',channel:'Mix With The Masters'},{title:'Vocal compression',channel:'Mix With The Masters'},{title:'Bass EQ',channel:'Other'},{title:'Bass tips'}];
  const ctx={};vm.runInNewContext(code('function libChannels','function libGroupToggle'),ctx);
  assert.deepEqual(Array.from(ctx.libChannels(videos),entry=>Array.from(entry)),[['Mix With The Masters',2],['Other',1],['YouTube',1]]);
  assert.deepEqual(Array.from(ctx.libFilterVideos(videos,'Mix With The Masters','BASS')),[videos[0]]);
  const actual=ctx.libChannels(manifest.videos);
  assert.equal(actual.reduce((sum,[,count])=>sum+count,0),manifest.videos.length);
  assert.ok(actual.every(([name],i)=>i===0||actual[i-1][0].localeCompare(name,undefined,{sensitivity:'base'})<=0));
});
test('Notes and Saved chats render and open without Browse search',()=>{
  const elements=Object.fromEntries(['library','libReviewRows','libNoteRows','libChatRows','libReviewCount','libNoteCount','libChatCount'].map(id=>[id,{innerHTML:'',textContent:''}]));
  const ctx={document:{getElementById:id=>elements[id]},STATE:{knowledge:[{id:'note1',title:'A note',raw:'Note body',category:'mixing'}],journal:[{id:'chat1',subject:'A chat',text:'Hope: Hello',tldr:'Chat body'}]},
    LIB_UI:{groups:{},more:{},open:{},editTip:null,kept:null},KB_CATEGORIES:[{id:'mixing',label:'Mixing'}],FAV_PILLS_MAX:4,
    knowledgeMigrateCategories:()=>{},libPlayerRender:()=>{},escapeHtml:s=>String(s),escapeJs:s=>String(s),kbActiveText:n=>n.raw,getFavouriteEntries:()=>[]};
  vm.runInNewContext(code('function libDate','async function libAddLink'),ctx);
  ctx.libraryRender();
  assert.match(elements.libNoteRows.innerHTML,/A note/);
  assert.match(elements.libChatRows.innerHTML,/A chat/);
  assert.match(elements.libNoteRows.innerHTML,/libTextButton\('note1','note'/);
  assert.match(elements.libChatRows.innerHTML,/libTextButton\('chat1','chat'/);
  ctx.libTextButton('note1','note',false);ctx.libTextButton('chat1','chat',false);
  assert.match(elements.libNoteRows.innerHTML,/Note body/);
  assert.match(elements.libChatRows.innerHTML,/Chat body/);
  assert.equal(elements.libNoteCount.textContent,1);
  assert.equal(elements.libChatCount.textContent,1);
});
