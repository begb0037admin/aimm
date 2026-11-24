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
  assert.match(html,/onError:event=>/);assert.doesNotMatch(html.slice(html.indexOf('<section class="lp"'),html.indexOf('<div class="lib-group">',html.indexOf('<section class="lp"'))),/play\/pause|scrub|volume/i);
});
test('YouTube embed error shows the cannot-embed state',()=>{
  let failed=false;
  const Player=class{constructor(_id,options){options.events.onError({data:101});}};
  const ctx=setup({window:{YT:{Player}},YT:{Player},document:{getElementById:()=>({classList:{add:()=>{failed=true}}})}});
  ctx.libPlayerEnsureApi();
  assert.equal(failed,true);
});
