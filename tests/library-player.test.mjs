import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../docs/knowledge/index.json',import.meta.url),'utf8'));
const section=html.slice(html.indexOf('const LIB_PLAYER='),html.indexOf('function libFold(button){'));
function setup(extra={}){
  const ctx={URL,URLSearchParams,location:{origin:'http://localhost:8765'},YT_KB:{videos:[]},
    escapeHtml:s=>String(s),escapeJs:s=>String(s),libDate:s=>s||'–',
    libChannels:videos=>[...new Map(videos.map(v=>[v.channel,0]))].map(([name])=>[name,videos.filter(v=>v.channel===name).length]),
    libFilterVideos:(videos,channel,query)=>videos.filter(v=>(!channel||v.channel===channel)&&(!query||[v.title,v.channel].some(x=>x.toLowerCase().includes(query.toLowerCase())))),
    ...extra};
  vm.runInNewContext(section,ctx);
  return ctx;
}
const video=(id,title,channel='A')=>({video_id:id,title,channel,url:`https://www.youtube.com/watch?v=${id}`,ingested:'2026-05-22'});

test('playlist builds only from real YouTube IDs in the runtime store',()=>{
  const ctx=setup();ctx.YT_KB.videos=[video('6WPtHxWkY2k','Logic Pro'),{video_id:'mwtm_clip',title:'Clip',channel:'MWTM'}];
  assert.deepEqual(Array.from(ctx.libPlayerVideos(),v=>v.title),['Logic Pro']);
  assert.equal(ctx.libPlayerVideos().length,1);
  assert.ok(manifest.videos.length>0);
});
test('Library opens on the landing with real private recordings and newest non-Masters YouTube videos',()=>{
  const landing={innerHTML:''},rows={innerHTML:''},count={textContent:''},search={value:''},select={value:'',innerHTML:''};
  const nodes={libPlayerLanding:landing,libPlayerRows:rows,libPlayerCount:count,libPlayerSearch:search,libPlayerChannelFilter:select};
  const ctx=setup({document:{getElementById:id=>nodes[id]}});
  vm.runInNewContext("LIB_PLAYER.manifestLoading=true;LIB_PLAYER.privateVideos=[{video_id:'old',title:'Old recording',channel:'Mix With The Masters',added:'2026-01-01',thumb:'/mwtm/old.jpg',local:true},{video_id:'new',title:'New recording',channel:'Mix With The Masters',added:'2026-11-23',thumb:'/mwtm/new.jpg',local:true}]",ctx);
  ctx.YT_KB.videos=[{...video('AbCdEfGhI12','Older YouTube'),'added':'2026-11-20'},{...video('ZyXwVuTsR98','Newest YouTube'),'added':'2026-11-23'},video('6WPtHxWkY2k','Masters trailer','Mix With The Masters')];
  ctx.libPlayerRender();
  assert.equal(vm.runInNewContext('LIB_PLAYER.id',ctx),null);
  assert.equal(count.textContent,'5');
  assert.doesNotMatch(rows.innerHTML,/aria-current="true"/);
  const masters=landing.innerHTML.split('Recently added')[0];
  assert.match(masters,/New recording/);assert.match(masters,/Old recording/);
  assert.ok(masters.indexOf('New recording')<masters.indexOf('Old recording'));
  assert.doesNotMatch(masters,/YouTube|Masters trailer|i\.ytimg/);
  assert.match(landing.innerHTML,/Newest YouTube/);
  assert.ok(landing.innerHTML.indexOf('Newest YouTube')<landing.innerHTML.indexOf('Older YouTube'));
  assert.doesNotMatch(landing.innerHTML,/Masters trailer/);
  assert.match(landing.innerHTML,/href="#i-play"/);
  assert.doesNotMatch(section,/if\(!LIB_PLAYER\.id&&videos\.length\)libPlayerSelect/);
});
test('empty private manifest omits the Masters landing row',()=>{
  const landing={innerHTML:''};const ctx=setup({document:{getElementById:id=>id==='libPlayerLanding'?landing:null}});
  ctx.YT_KB.videos=[video('AbCdEfGhI12','YouTube video')];ctx.libPlayerRenderLanding();
  assert.doesNotMatch(landing.innerHTML,/Mix With The Masters/);
  assert.match(landing.innerHTML,/Recently added/);
});
test('playlist channel filter and search combine, then keep the current row teal',()=>{
  const rows={innerHTML:'',querySelector:()=>({scrollIntoView(){}})},count={textContent:''},search={value:'bass'},select={value:'A',innerHTML:''};
  const nodes={libPlayerRows:rows,libPlayerCount:count,libPlayerSearch:search,libPlayerChannelFilter:select};
  const ctx=setup({document:{getElementById:id=>nodes[id]}});
  ctx.YT_KB.videos=[video('6WPtHxWkY2k','Bass EQ'),video('AbCdEfGhI12','Vocal EQ'),video('ZyXwVuTsR98','Bass compression','B')];
  vm.runInNewContext("LIB_PLAYER.id='6WPtHxWkY2k'",ctx);
  ctx.libPlayerRenderRows();
  assert.match(rows.innerHTML,/Bass EQ/);assert.doesNotMatch(rows.innerHTML,/Vocal EQ|Bass compression/);
  assert.match(rows.innerHTML,/aria-current="true"/);assert.equal(count.textContent,'1/1');
  select.value='B';ctx.libPlayerRenderRows();
  assert.match(rows.innerHTML,/Bass compression/);assert.equal(count.textContent,'3');
  assert.match(html,/\.lp \.row\[aria-current="true"\]\{background:var\(--teal\)/);
});
test('pasted YouTube link uses the existing add path',async()=>{
  let added=0,selected='';const input={value:'https://youtu.be/6WPtHxWkY2k'},field={value:''};
  const ctx=setup({document:{getElementById:id=>id==='libLink'?field:null}});
  ctx.libPlayerSelect=id=>{selected=id};ctx.libAddLink=async()=>{added++};ctx.libPlayerRenderRows=()=>{};
  await ctx.libPlayerSearchEnter({currentTarget:input,preventDefault(){}});
  assert.equal(added,1);assert.equal(selected,'6WPtHxWkY2k');assert.equal(field.value,'https://youtu.be/6WPtHxWkY2k');
  assert.equal(input.value,'');
});
test('embed URL includes YouTube API origin and native player parameters',()=>{
  const ctx=setup();const url=new URL(ctx.libPlayerEmbedUrl('6WPtHxWkY2k',true));
  assert.equal(url.hostname,'www.youtube.com');assert.equal(url.pathname,'/embed/6WPtHxWkY2k');
  assert.equal(url.searchParams.get('enablejsapi'),'1');assert.equal(url.searchParams.get('origin'),'http://localhost:8765');
  assert.equal(url.searchParams.get('rel'),'0');assert.equal(url.searchParams.get('playsinline'),'1');
  assert.equal(url.searchParams.get('autoplay'),'1');
  assert.match(html,/onError:event=>/);assert.match(html,/<iframe id="libPlayerIframe"/);
});
test('YouTube embed error shows the cannot-embed state',()=>{
  let failed=false;
  const Player=class{constructor(_id,options){options.events.onError({data:101});}};
  const ctx=setup({window:{YT:{Player}},YT:{Player},document:{getElementById:()=>({classList:{add:()=>{failed=true}}})}});
  ctx.libPlayerEnsureApi();
  assert.equal(failed,true);
});

test('private manifest resolves unique R2 keys and preserves YouTube rows',async()=>{
  const item={id:'lesson-1',title:'Drum lesson',channel:'Ignored',added:'2026-11-21',video:'lessons/lesson-1.mp4',thumb:'thumbs/lesson-1.jpg',description:'Private lesson'};
  let fetched='';
  const ctx=setup({fetch:async url=>{fetched=url;return {ok:true,json:async()=>[item,{...item,id:'lesson-2',video:'https://elsewhere.example/video.mp4'},{...item,id:'lesson-3',thumb:'../secret.jpg'},{...item,id:'lesson-1'}]}}});
  ctx.YT_KB.videos=[video('6WPtHxWkY2k','YouTube lesson')];
  let rendered=0;ctx.libPlayerRender=()=>{rendered++};
  await ctx.libPlayerLoadManifest();
  assert.deepEqual(Array.from(ctx.libPlayerVideos(),v=>v.title),['Drum lesson','YouTube lesson']);
  assert.equal(ctx.libPlayerVideos()[0].channel,'Mix With The Masters');
  assert.equal(ctx.libPlayerVideos()[0].description,'Private lesson');
  assert.equal(ctx.libPlayerVideos()[0].src,'/mwtm/f/lessons/lesson-1.mp4');
  assert.equal(ctx.libPlayerVideos()[0].thumb,'/mwtm/f/thumbs/lesson-1.jpg');
  assert.equal(fetched,'/mwtm/manifest.json');
  assert.equal(rendered,1);
});

test('missing or empty private manifest keeps the existing YouTube playlist',async()=>{
  for(const result of [{ok:false},{ok:true,json:async()=>[]}]){
    const ctx=setup({fetch:async()=>result});ctx.libPlayerRender=()=>{};
    ctx.YT_KB.videos=[video('6WPtHxWkY2k','YouTube lesson')];
    await ctx.libPlayerLoadManifest();
    assert.deepEqual(Array.from(ctx.libPlayerVideos(),v=>v.title),['YouTube lesson']);
  }
});

test('private selection uses local player, description and recording link; YouTube switches back',async()=>{
  const nodes={};for(const id of ['libPlayerTitle','libPlayerChannel','libPlayerDescriptionText','libPlayerOpen','libPlayerFailLink','libPlayerIframe'])nodes[id]={textContent:'',href:'',hidden:false,removeAttribute(name){this.removed=name}};
  nodes.libPlayer={classList:{remove(){}}};nodes.libPlayerFrame={classList:{remove(){}}};
  const local={shown:[],hidden:0,show(o){this.shown.push(o)},hide(){this.hidden++}};
  const ctx=setup({document:{getElementById:id=>nodes[id]},AimmLocalPlayer:{attach:()=>local}});
  ctx.libPlayerRenderRows=()=>{};ctx.libPlayerUpdateMore=()=>{};ctx.libPlayerEnsureApi=()=>{};
  vm.runInNewContext("LIB_PLAYER.privateVideos=[{video_id:'lesson-1',title:'Lesson',channel:'Mix With The Masters',src:'/mwtm/one.mp4',description:'A recording',local:true}]",ctx);
  ctx.libPlayerSelect('lesson-1',true);
  assert.equal(nodes.libPlayerOpen.href,'/mwtm/one.mp4');assert.equal(nodes.libPlayerOpen.textContent,'Open recording');
  assert.equal(nodes.libPlayerDescriptionText.textContent,'A recording');assert.equal(local.shown[0].autoplay,true);
  ctx.libPlayerSelect('6WPtHxWkY2k');
  assert.equal(local.hidden,1);assert.equal(nodes.libPlayerOpen.hidden,true);
  assert.match(nodes.libPlayerIframe.src,/youtube\.com\/embed\/6WPtHxWkY2k/);
});

test('local player uses shared Lucide sprite and scoped controls',()=>{
  assert.match(html,/#libPlayerFrame\.is-local \.lpl\{display:block\}/);
  assert.match(html,/aimm\.mwtm\.resume\./);
  assert.match(html,/window\.AimmLocalPlayer=\{attach\}/);
  assert.match(html,/href="#i-.*?"/);
  assert.doesNotMatch(html,/id="lpi-/);
  assert.match(html,/fetch\('\/mwtm\/manifest\.json'\)/);
});

test('private thumbnail and channel use the ordinary Playlist row and filter',()=>{
  const rows={innerHTML:'',querySelector:()=>({scrollIntoView(){}})},count={textContent:''},search={value:'drum'},select={value:'Mix With The Masters',innerHTML:''};
  const nodes={libPlayerRows:rows,libPlayerCount:count,libPlayerSearch:search,libPlayerChannelFilter:select};
  const ctx=setup({document:{getElementById:id=>nodes[id]}});
  vm.runInNewContext("LIB_PLAYER.privateVideos=[{video_id:'lesson-1',title:'Drum lesson',channel:'Mix With The Masters',added:'2026-11-21',thumb:'/mwtm/drum.jpg',local:true}]",ctx);
  vm.runInNewContext("LIB_PLAYER.id='lesson-1'",ctx);
  ctx.YT_KB.videos=[video('6WPtHxWkY2k','Vocal lesson')];
  ctx.libPlayerRenderRows();
  assert.match(rows.innerHTML,/class="rank">1</);
  assert.match(rows.innerHTML,/src="\/mwtm\/drum.jpg"/);
  assert.match(rows.innerHTML,/Mix With The Masters/);
  assert.match(rows.innerHTML,/Added 2026-11-21/);
  assert.match(rows.innerHTML,/aria-current="true"/);
  assert.doesNotMatch(rows.innerHTML,/Vocal lesson/);
  assert.equal(count.textContent,'1/1');
});
