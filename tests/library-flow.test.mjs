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
test('all videos read and Library has no per-item read or re-summary controls',()=>{
  const ctx={};vm.runInNewContext(code('function libVideoReads','function libFold('),ctx);
  assert.equal(ctx.libVideoReads('QWERTY12345'),true);
  const library=code('function libraryRender','async function libAddLink');
  assert.doesNotMatch(library,/Hope reads|Re-summarise|libToggleVideoRead|libToggleVideoRead|libRead|kbResummarise/);
  assert.doesNotMatch(html,/id="libRead"|id="kbSaveActivate"|onclick="kbToggleActive/);
  assert.match(html,/localStorage\.removeItem\?\.\('aimmLibrarySkippedVideos_v1'\)/);
  assert.match(html,/for\(const note of STATE\.knowledge\|\|\[\]\)if\(note && !note\.toReview && !note\.active\)/);
});
test('video browse starts closed, search opens matching groups, clearing closes it',()=>{
  assert.match(html, /data-sec="videos" data-open="false"><button class="bar" type="button" aria-expanded="false"/);
  const bar={expanded:null,setAttribute(_key,value){this.expanded=value}};
  const card={dataset:{open:'false'},querySelector:()=>bar};
  const browseBar={expanded:null,setAttribute(_key,value){this.expanded=value}};
  const browse={dataset:{open:'false'},querySelector:()=>browseBar};
  const search={value:'compression'};
  let renders=0;
  const ctx={document:{querySelector:selector=>selector.includes('data-sec=browse')?browse:card,getElementById:id=>id==='libSearch'?search:{value:''}},LIB_UI:{groups:{vmixing:false,nmixing:false}},libraryRender:()=>renders++};
  vm.runInNewContext(code('function libSearchChanged','function libFoldAll'),ctx);
  ctx.libSearchChanged();
  assert.equal(card.dataset.open,'true');assert.equal(bar.expanded,'true');
  assert.equal(browse.dataset.open,'true');assert.equal(browseBar.expanded,'true');
  assert.equal(ctx.LIB_UI.groups.vmixing,true);assert.equal(ctx.LIB_UI.groups.nmixing,false);
  search.value='  ';ctx.libSearchChanged();
  assert.equal(card.dataset.open,'false');assert.equal(bar.expanded,'false');assert.equal(renders,2);
});
test('channel options count videos and channel filter combines with search',()=>{
  assert.match(html,/id="libChannel"[^>]+onchange="libChannelChanged\(\)"/);
  const videos=[
    {title:'Bass compression',channel:'Mix With The Masters'},
    {title:'Vocal compression',channel:'Mix With The Masters'},
    {title:'Bass EQ',channel:'Other'},
    {title:'Bass tips'}
  ];
  const ctx={};
  vm.runInNewContext(code('function libChannels','function libFoldAll'),ctx);
  assert.deepEqual(Array.from(ctx.libChannels(videos),entry=>Array.from(entry)),[
    ['Mix With The Masters',2],['Other',1],['YouTube',1]
  ]);
  assert.deepEqual(Array.from(ctx.libFilterVideos(videos,'Mix With The Masters','BASS')), [videos[0]]);
  assert.equal(ctx.libFilterVideos(videos,'','bass').length,3);
  assert.equal(ctx.libFilterVideos(videos,'Mix With The Masters','').length,2);
  const actual=ctx.libChannels(manifest.videos);
  assert.equal(actual.reduce((sum,[,count])=>sum+count,0),manifest.videos.length);
  assert.deepEqual(new Set(actual.map(([channel])=>channel)),new Set(manifest.videos.map(v=>v.channel||'YouTube')));
  assert.ok(actual.every(([,count],i)=>i===0||actual[i-1][1]>=count));

  const bar={setAttribute(_key,value){this.expanded=value}};
  const card={dataset:{open:'false'},querySelector:()=>bar};
  const search={value:''},channel={value:'Mix With The Masters'};
  let renders=0;
  const ui={document:{querySelector:()=>card,getElementById:id=>id==='libSearch'?search:channel},LIB_UI:{groups:{vmixing:false}},libraryRender:()=>renders++};
  vm.runInNewContext(code('function libSearchChanged','function libChannels'),ui);
  ui.libChannelChanged();
  assert.equal(card.dataset.open,'true');assert.equal(bar.expanded,'true');
  assert.equal(ui.LIB_UI.groups.vmixing,true);
  channel.value='';ui.libChannelChanged();
  assert.equal(card.dataset.open,'false');assert.equal(renders,2);
});
test('undated videos display an en dash',()=>{
  const ctx={};vm.runInNewContext(code('function libDate','function libChatTurns'),ctx);
  assert.equal(ctx.libDate(null,'–'),'–');
  assert.equal(ctx.libDate(null),'Library');
  assert.match(html,/libDate\(v\.added,'–'\)/);
});
test('video View uses the matching summary note without fetching a transcript',async()=>{
  const video={video_id:'summary-1',url:'https://youtu.be/summary-1'};
  const ctx={
    YT_KB:{videos:[video]},STATE:{knowledge:[{source:video.url,summary:'A concise video summary.'}]},
    LIB_UI:{open:{},videoText:{}},fetch:()=>{throw Error('Transcript should not be fetched');},libraryRender:()=>{}
  };
  vm.runInNewContext(code('function libDate','function libChatTurns'),ctx);
  vm.runInNewContext(code('async function libViewVideo','async function libVideoNote'),ctx);
  await ctx.libViewVideo(video.video_id);
  assert.equal(ctx.libVideoContent(video,ctx.STATE.knowledge),'A concise video summary.');
  assert.equal(ctx.LIB_UI.open['video'+video.video_id],true);
  assert.match(code('function libraryRender','async function libAddLink'),/libVideoContent\(v,notes\)/);
  assert.match(code('function libraryRender','async function libAddLink'),/\['Title','Channel','Added','Edit','Show','Link'\]/);
});
test('video View falls back to transcript text without YAML front matter',async()=>{
  const video={video_id:'transcript-1',url:'https://youtu.be/transcript-1'};
  const transcript='---\r\ntitle: "Video title"\r\nsource: "https://youtu.be/transcript-1"\r\n---\r\n\r\nActual transcript words.';
  const ctx={
    YT_KB:{videos:[video]},STATE:{knowledge:[]},LIB_UI:{open:{},videoText:{}},
    AIMM_PROXY_URL:'https://example.test',fetch:async()=>({ok:true,text:async()=>transcript}),libraryRender:()=>{}
  };
  vm.runInNewContext(code('function libDate','function libChatTurns'),ctx);
  vm.runInNewContext(code('async function libViewVideo','async function libVideoNote'),ctx);
  await ctx.libViewVideo(video.video_id);
  assert.equal(ctx.libVideoContent(video,[]),'Actual transcript words.');
  assert.doesNotMatch(ctx.libVideoContent(video,[]),/---|title:|source:/i);
});
test('dashboard video Delete remains available in Edit when its transcript fails',async()=>{
  const fields=Object.fromEntries(['kbTitle','kbSource','kbContent','kbVideoDelete'].map(id=>[id,{value:'',hidden:true}]));
  let opened=false;
  const ctx={
    YT_KB:{videos:[{video_id:'dashboard-1',title:'Dashboard video',url:'https://youtu.be/dashboard-1',added:true}]},
    STATE:{knowledge:[]},AIMM_PROXY_URL:'https://example.test',
    document:{getElementById:id=>fields[id]},
    fetch:async()=>({ok:false}),kbOpenAdd:()=>{opened=true},toast:()=>{}
  };
  vm.runInNewContext(code('async function libVideoNote','renderJournal();'),ctx);
  await ctx.libVideoNote('dashboard-1');
  assert.equal(opened,true);
  assert.equal(fields.kbVideoDelete.hidden,false);
  assert.equal(typeof fields.kbVideoDelete.onclick,'function');
});
