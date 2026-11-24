import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const build=html.match(/const AIMM_BUILD = '([^']+)'/)?.[1];
const manifest=JSON.parse(readFileSync(new URL('../docs/knowledge/index.json',import.meta.url),'utf8'));
const section=html.slice(html.indexOf('const LIB_PLAYER='),html.indexOf('function libFold(button){'));
function setup(extra={}){
  const ctx={URL,URLSearchParams,setTimeout,clearTimeout,AIMM_BUILD:build,location:{origin:'http://localhost:8765'},YT_KB:{videos:[]},document:{getElementById:()=>null},
    escapeHtml:s=>String(s),escapeJs:s=>String(s),libDate:s=>s||'–',
    libChannels:videos=>[...new Map(videos.map(v=>[v.channel,0]))].map(([name])=>[name,videos.filter(v=>v.channel===name).length]),
    libFilterVideos:(videos,channel,query)=>videos.filter(v=>(!channel||v.channel===channel)&&(!query||[v.title,v.channel].some(x=>x.toLowerCase().includes(query.toLowerCase())))),
    ...extra};
  vm.runInNewContext(section,ctx);
  return ctx;
}
const video=(id,title,channel='A')=>({video_id:id,title,channel,url:`https://www.youtube.com/watch?v=${id}`,ingested:'2026-05-22'});
test('Library accepts supported YouTube link shapes across desktop, mobile and music hosts',()=>{
  const ctx=setup(),id='NIomo3319PQ';
  for(const host of ['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com']){
    for(const path of ['watch?v='+id+'&si=x','embed/'+id,'live/'+id+'?si=x','shorts/'+id,'v/'+id]){
      const url='https://'+host+'/'+path;
      assert.equal(ctx.libYouTubeIdFromLink(url),id,url);
      assert.equal(ctx.libYouTubeId({video_id:id,url}),id,url);
    }
  }
  assert.equal(ctx.libYouTubeIdFromLink('https://youtu.be/'+id+'?si=x'),id);
  for(const url of ['https://www.youtube.com/live/'+id.slice(1),'https://www.youtube.com/v/'+id+'extra','https://youtube.com.evil.test/live/'+id]){
    assert.equal(ctx.libYouTubeIdFromLink(url),null,url);
  }
});
test('Playlist and landing thumbnails have one outside black rim without changing image geometry',()=>{
  const playlist=html.match(/\.lp \.row \.thumb\{([^}]*)\}/g)||[];
  const landing=html.match(/\.lp \.landing-thumb\{([^}]*)\}/g)||[];
  assert.equal(playlist.length,1);
  assert.equal(landing.length,1);
  for(const [rule,radius] of [[playlist[0],'10px'],[landing[0],'12px']]){
    assert.match(rule,/box-shadow:0 0 0 3px #000/);
    assert.match(rule,new RegExp(`border-radius:${radius}`));
    assert.doesNotMatch(rule,/border:|inset|padding:/);
  }
  assert.match(playlist[0],/width:var\(--thumb-w\);aspect-ratio:16\/9/);
  assert.match(landing[0],/aspect-ratio:16\/9/);
  assert.match(html,/\.lp \.row\{[^}]*grid-template-columns:var\(--rank-w\) var\(--thumb-w\) minmax\(0,1fr\)/);
  assert.match(html,/\.lp \.frame\.is-landing\{[^}]*background:#0b0d10/);
});
function storage(){
  const values=new Map();
  return {values,getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
}

test('search sits full width below the player title at wide and 560px layouts',()=>{
  const library=html.slice(html.indexOf('<section class="lp is-landing"'),html.indexOf('</section>',html.indexOf('<section class="lp is-landing"')));
  assert.ok(library.indexOf('id="libPlayerTitle"')<library.indexOf('id="libPlayerSearch"'));
  assert.ok(library.indexOf('id="libPlayerSearch"')<library.indexOf('<div class="list">'));
  assert.equal((library.match(/id="libPlayerSearch"/g)||[]).length,1);
  assert.match(library,/class="searchbar"><svg class="ic"[^>]*><use href="#i-search"\/><\/svg><input id="libPlayerSearch"[^>]*placeholder="Search or paste a link"[^>]*oninput="libPlayerSearchChanged\(\)"[^>]*libPlayerSearchEnter\(event\)/);
  assert.match(html,/\.lp \.searchbar\{[^}]*min-height:76px[^}]*margin-top:20px[^}]*padding:24px 28px[^}]*border-radius:18px[^}]*background:#1b1d20/);
  assert.match(html,/\.lp \.searchbar input::placeholder\{color:var\(--mid\);opacity:1\}/);
  assert.match(html,/\.lp \.searchbar:focus-within\{outline:2px solid var\(--teal\)/);
  assert.match(html,/\.lp \.grid\{[^}]*grid-template-areas:"player list" "meta list" "search list"/);
  assert.match(html,/@container lp \(max-width:819px\)\{\.lp \.grid\{[^}]*grid-template-areas:"player" "meta" "search" "list"/);
  assert.doesNotMatch(html,/\.lp \.searchbar\.fld/);
  assert.match(html,/\.lp \.fld:not\(\.chsel\):focus-within\{outline:2px solid rgba\(45,212,191,\.65\)/);
});

test('playlist has only the full-width alphabetical channel filter and no description path',()=>{
  const library=html.slice(html.indexOf('<section class="lp is-landing"'),html.indexOf('</section>',html.indexOf('<section class="lp is-landing"')));
  const panel=library.slice(library.indexOf('<div class="list">'));
  assert.doesNotMatch(panel,/id="libPlayerSearch"|class="fld search"/);
  assert.match(panel,/class="fld chsel" id="libPlayerChannelField"><button id="libPlayerChannelFilter"[^>]*role="combobox"[^>]*aria-controls="libPlayerChannelMenu"/);
  assert.match(panel,/<use href="#i-plus"\/>/);
  assert.match(panel,/id="libPlayerChannelMenu" class="channel-menu" role="listbox"/);
  assert.match(html,/\.lp \.fld\.chsel\{width:100%;min-width:0\}/);
  assert.match(html,/\.lp \.channel-menu\{[^}]*width:100%;max-height:320px;overflow-y:auto[^}]*border:1px solid #2c3034[^}]*background:#1b1d20/);
  assert.match(html,/\.lp \.channel-option\.is-active,\.lp \.channel-option:hover\{background:#2dd4bf;color:#000\}/);
  assert.match(html,/\.lp \.channel-trigger:focus-visible\{outline:2px solid #2dd4bf/);
  assert.doesNotMatch(html,/\.lp \.fld\.chsel select|<select id="libPlayerChannelFilter"/);
  assert.match(html,/return \[\.\.\.counts\]\.sort\(\(a,b\)=>a\[0\]\.localeCompare\(b\[0\]/);
  assert.doesNotMatch(html,/libPlayerDescription|libPlayerMore|libPlayerToggleDescription|libPlayerUpdateMore|\.lp \.desc|descriptionOpen|--desc-pad/);
  assert.doesNotMatch(section,/\/kb\/transcript|LIB_UI\.videoText|libVideoTranscript/);
});

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
  assert.doesNotMatch(landing.innerHTML,/Last played/);
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
test('Last played appears first with the four newest selections of either kind',()=>{
  const saved=storage(),landing={innerHTML:''};
  const ctx=setup({localStorage:saved,document:{getElementById:id=>id==='libPlayerLanding'?landing:null}});
  vm.runInNewContext("LIB_PLAYER.privateVideos=[{video_id:'lesson-1',title:'Private lesson',channel:'Mix With The Masters',thumb:'/mwtm/f/lesson.jpg',local:true}]",ctx);
  ctx.YT_KB.videos=[video('AbCdEfGhI12','Public lesson')];
  ctx.libPlayerRemember(ctx.YT_KB.videos[0],'AbCdEfGhI12');
  ctx.libPlayerRemember(ctx.libPlayerVideos()[0],'lesson-1');
  ctx.libPlayerRenderLanding();
  const [played,masters,recent]=landing.innerHTML.split(/(?=<div class="landing-section">)/).filter(Boolean);
  assert.match(played,/Last played/);
  assert.ok(played.indexOf('Private lesson')<played.indexOf('Public lesson'));
  assert.match(masters,/Mix With The Masters/);
  assert.match(recent,/Recently added/);
  assert.match(played,/libPlayerSelectLastPlayed\('lesson-1'\)/);
  assert.match(played,/libPlayerSelectLastPlayed\('AbCdEfGhI12'\)/);
  assert.match(html,/\.landing-card-title\{[^}]*font:500 20px\/1\.4 Inter,sans-serif/);
  assert.doesNotMatch(html,/landing-section\.recent \.landing-card-title/);
  const rows=JSON.parse(saved.getItem('aimmLibLastPlayed_v1'));
  assert.deepEqual(rows.map(row=>row.kind),['private','youtube']);
  assert.deepEqual(Object.keys(rows[0]).sort(),['channel','id','kind','thumb','time','title']);
});
test('Last played deduplicates, caps storage at 20, and resumes a saved YouTube selection',()=>{
  const saved=storage(),ctx=setup({localStorage:saved});
  for(let i=0;i<23;i++)ctx.libPlayerRemember(null,String(i).padStart(11,'0'),{title:`Video ${i}`,channel:'Archive'});
  const latest='00000000022';
  ctx.libPlayerRemember(null,latest,{title:'Updated video',channel:'Archive'});
  const rows=JSON.parse(saved.getItem('aimmLibLastPlayed_v1'));
  assert.equal(rows.length,20);
  assert.equal(rows.filter(row=>row.id===latest).length,1);
  assert.equal(rows[0].title,'Updated video');
  let selected;
  ctx.libPlayerSelect=(...args)=>{selected=args};
  ctx.libPlayerSelectLastPlayed(latest);
  assert.equal(selected[0],latest);
  assert.equal(selected[1],true);
  assert.equal(selected[2].title,'Updated video');
});
test('Last played landing shows no more than four playable cards',()=>{
  const saved=storage(),landing={innerHTML:''};
  const ctx=setup({localStorage:saved,document:{getElementById:id=>id==='libPlayerLanding'?landing:null}});
  for(let i=0;i<5;i++)ctx.libPlayerRemember(null,String(i).padStart(11,'0'),{title:`History ${i}`,channel:'Archive'});
  ctx.libPlayerRenderLanding();
  assert.equal((landing.innerHTML.match(/class="landing-card"/g)||[]).length,4);
  assert.doesNotMatch(landing.innerHTML,/History 0/);
  assert.ok(landing.innerHTML.indexOf('History 4')<landing.innerHTML.indexOf('History 3'));
});
test('Last played tolerates unavailable or malformed browser storage',()=>{
  const unavailable={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
  const ctx=setup({localStorage:unavailable});
  assert.deepEqual(Array.from(ctx.libPlayerLastPlayed()),[]);
  assert.doesNotThrow(()=>ctx.libPlayerRemember(video('AbCdEfGhI12','Lesson'),'AbCdEfGhI12'));
  const saved=storage();saved.setItem('aimmLibLastPlayed_v1','{broken');
  const fallback=setup({localStorage:saved});
  assert.deepEqual(Array.from(fallback.libPlayerLastPlayed()),[]);
  assert.doesNotThrow(()=>fallback.libPlayerRemember(video('AbCdEfGhI12','Lesson'),'AbCdEfGhI12'));
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
  assert.match(rows.innerHTML,/aria-current="true"/);assert.equal(count.textContent,'1/3');
  select.value='B';ctx.libPlayerRenderRows();
  assert.match(rows.innerHTML,/Bass compression/);assert.equal(count.textContent,'1/3');
  assert.match(html,/\.lp \.row\[aria-current="true"\]\{background:var\(--teal\)/);
});
test('custom channel combobox keeps its value API and supports keyboard, type-ahead and outside click',()=>{
  const classes=new Set(),attributes=new Map(),listeners=new Map();
  const trigger={value:'',focused:false,setAttribute:(k,v)=>attributes.set(k,v),removeAttribute:k=>attributes.delete(k),focus(){this.focused=true}};
  const field={classList:{contains:k=>classes.has(k),add:k=>classes.add(k),remove:k=>classes.delete(k)},contains:target=>target===trigger};
  const label={textContent:''};
  const optionNodes=Array.from({length:3},(_,i)=>({id:`libPlayerChannelOption${i}`,classList:{toggle(){}},scrollIntoView(){}}));
  const menu={innerHTML:'',querySelectorAll:()=>optionNodes,querySelector:selector=>optionNodes.find(row=>`#${row.id}`===selector)};
  const rows={innerHTML:''},count={textContent:''},search={value:''};
  const nodes={libPlayerRows:rows,libPlayerCount:count,libPlayerSearch:search,libPlayerChannelFilter:trigger,libPlayerChannelField:field,libPlayerChannelMenu:menu,libPlayerChannelLabel:label};
  const document={getElementById:id=>nodes[id],addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:type=>listeners.delete(type)};
  const ctx=setup({document,libChannels:videos=>[...new Set(videos.map(v=>v.channel))].sort((a,b)=>a.localeCompare(b)).map(name=>[name,videos.filter(v=>v.channel===name).length])});
  ctx.YT_KB.videos=[video('6WPtHxWkY2k','One','Zulu'),video('AbCdEfGhI12','Two','Alpha'),video('ZyXwVuTsR98','Three','Alpha')];
  ctx.libPlayerRenderRows();
  assert.equal(trigger.value,'');assert.equal(label.textContent,'Channel');
  assert.ok(menu.innerHTML.indexOf('All channels')<menu.innerHTML.indexOf('Alpha'));
  assert.ok(menu.innerHTML.indexOf('Alpha')<menu.innerHTML.indexOf('Zulu'));
  assert.match(menu.innerHTML,/channel-count">3/);
  assert.match(menu.innerHTML,/channel-count">2/);
  const key=(keyName)=>{let prevented=false;ctx.libPlayerChannelKeydown({key:keyName,currentTarget:trigger,preventDefault(){prevented=true}});return prevented};
  assert.equal(key('ArrowDown'),true);assert.equal(attributes.get('aria-expanded'),'true');
  assert.equal(attributes.get('aria-activedescendant'),'libPlayerChannelOption1');
  key('Enter');assert.equal(trigger.value,'Alpha');assert.equal(label.textContent,'Alpha');assert.equal(attributes.get('aria-expanded'),'false');
  assert.equal(trigger.focused,true);assert.match(rows.innerHTML,/Two/);assert.doesNotMatch(rows.innerHTML,/One/);
  key(' ');key('z');assert.equal(attributes.get('aria-activedescendant'),'libPlayerChannelOption2');
  key('Escape');assert.equal(attributes.get('aria-expanded'),'false');
  key('End');assert.equal(attributes.get('aria-activedescendant'),'libPlayerChannelOption2');
  listeners.get('pointerdown')({target:{}});assert.equal(attributes.get('aria-expanded'),'false');
  trigger.value='Missing';ctx.libPlayerRenderRows();assert.equal(trigger.value,'');
});
test('choosing a channel clears a pasted link and search state without changing playback',()=>{
  const classes=new Set(),attributes=new Map(),cancelled=[];
  const trigger={value:'',setAttribute:(key,value)=>attributes.set(key,value),removeAttribute:key=>attributes.delete(key),focus(){}};
  const field={classList:{remove:key=>classes.delete(key)}};
  const rows={innerHTML:''},count={textContent:''},search={value:'https://youtu.be/6WPtHxWkY2k'},clear={hidden:true};
  const nodes={libPlayerRows:rows,libPlayerCount:count,libPlayerSearch:search,libPlayerSearchClear:clear,libPlayerChannelFilter:trigger,libPlayerChannelField:field};
  const ctx=setup({document:{getElementById:id=>nodes[id],removeEventListener(){}},setTimeout:()=>17,clearTimeout:id=>cancelled.push(id)});
  ctx.YT_KB.videos=[video('6WPtHxWkY2k','First','A'),video('AbCdEfGhI12','Second','B'),video('ZyXwVuTsR98','Third','B')];
  vm.runInNewContext("LIB_PLAYER.id='6WPtHxWkY2k'",ctx);
  ctx.libPlayerSearchChanged();
  assert.match(rows.innerHTML,/First/);assert.doesNotMatch(rows.innerHTML,/Second/);
  assert.equal(clear.hidden,false);
  vm.runInNewContext("LIB_SEARCH.timer=17;LIB_SEARCH.videos=[{video_id:'QwErTyUiO12'}];LIB_SEARCH.error='error';LIB_SEARCH.addError='add error'",ctx);
  const request=vm.runInNewContext('LIB_SEARCH.request',ctx);
  const index=vm.runInNewContext("LIB_PLAYER_CHANNEL.options.findIndex(([name])=>name==='B')",ctx);
  ctx.libPlayerChannelChoose(index);
  assert.equal(search.value,'');assert.equal(clear.hidden,true);assert.equal(trigger.value,'B');
  assert.match(rows.innerHTML,/Second/);assert.match(rows.innerHTML,/Third/);assert.doesNotMatch(rows.innerHTML,/First/);
  assert.equal(count.textContent,'2/3');assert.ok(cancelled.includes(17));
  assert.equal(vm.runInNewContext('LIB_SEARCH.request',ctx),request+1);
  assert.equal(vm.runInNewContext('LIB_SEARCH.query',ctx),'');
  assert.equal(vm.runInNewContext('LIB_SEARCH.videos.length',ctx),0);
  assert.equal(vm.runInNewContext('LIB_SEARCH.error+LIB_SEARCH.addError',ctx),'');
  assert.equal(vm.runInNewContext('LIB_SEARCH.loading',ctx),false);
  assert.equal(vm.runInNewContext('LIB_PLAYER.id',ctx),'6WPtHxWkY2k');
});
test('clear search button resets results, restores rows, and refocuses the input',()=>{
  const rows={innerHTML:''},count={textContent:''},search={value:'',focused:false,focus(){this.focused=true}},clear={hidden:true},select={value:''};
  const nodes={libPlayerRows:rows,libPlayerCount:count,libPlayerSearch:search,libPlayerSearchClear:clear,libPlayerChannelFilter:select};
  const cancelled=[];
  const ctx=setup({document:{getElementById:id=>nodes[id]},setTimeout:()=>29,clearTimeout:id=>cancelled.push(id)});
  ctx.YT_KB.videos=[video('6WPtHxWkY2k','First'),video('AbCdEfGhI12','Second')];
  search.value='https://youtu.be/6WPtHxWkY2k';ctx.libPlayerSearchChanged();
  assert.equal(clear.hidden,false);assert.match(rows.innerHTML,/First/);assert.doesNotMatch(rows.innerHTML,/Second/);
  vm.runInNewContext("LIB_SEARCH.timer=29;LIB_SEARCH.videos=[{video_id:'QwErTyUiO12'}];LIB_SEARCH.error='error';LIB_SEARCH.addError='add error'",ctx);
  const request=vm.runInNewContext('LIB_SEARCH.request',ctx);
  ctx.libPlayerSearchClear();
  assert.equal(search.value,'');assert.equal(clear.hidden,true);assert.equal(search.focused,true);
  assert.match(rows.innerHTML,/First/);assert.match(rows.innerHTML,/Second/);assert.equal(count.textContent,'2');
  assert.ok(cancelled.includes(29));assert.equal(vm.runInNewContext('LIB_SEARCH.request',ctx),request+1);
  assert.equal(vm.runInNewContext('LIB_SEARCH.videos.length',ctx),0);
  assert.equal(vm.runInNewContext('LIB_SEARCH.error+LIB_SEARCH.addError',ctx),'');
  assert.equal(vm.runInNewContext('LIB_SEARCH.loading',ctx),false);
  assert.match(html,/id="libPlayerSearchClear"[^>]*aria-label="Clear search"[^>]*onclick="libPlayerSearchClear\(\)" hidden/);
  assert.match(html,/\.lp \.searchbar \.search-clear:focus-visible\{outline:2px solid var\(--teal\)/);
});
test('pasted YouTube link plays without adding',async()=>{
  const input={value:'https://youtu.be/6WPtHxWkY2k'};
  const ctx=setup({document:{getElementById:()=>null}});
  let selected,added=0;
  ctx.libPlayerSelect=(...args)=>{selected=args};
  ctx.libPlayerSearchChanged=()=>{};
  ctx.libPlayerSearchYouTube=async()=>{};
  ctx.kbAddYoutube=async()=>{added++};
  await ctx.libPlayerSearchEnter({currentTarget:input,preventDefault(){}});
  assert.equal(selected[0],'6WPtHxWkY2k');
  assert.equal(selected[1],true);
  assert.equal(added,0);
  assert.equal(input.value,'https://youtu.be/6WPtHxWkY2k');
});
test('embed URL includes YouTube API origin and native player parameters',()=>{
  const ctx=setup();const url=new URL(ctx.libPlayerEmbedUrl('6WPtHxWkY2k',true));
  assert.equal(url.hostname,'www.youtube.com');assert.equal(url.pathname,'/embed/6WPtHxWkY2k');
  assert.equal(url.searchParams.get('enablejsapi'),'1');assert.equal(url.searchParams.get('origin'),'http://localhost:8765');
  assert.equal(url.searchParams.get('rel'),'0');assert.equal(url.searchParams.get('playsinline'),'1');
  assert.equal(url.searchParams.get('cc_load_policy'),'0');
  assert.equal(url.searchParams.get('autoplay'),'1');
  assert.match(html,/onError:event=>/);assert.match(html,/<iframe id="libPlayerIframe"/);
});
test('YouTube player unloads both caption modules on ready, API change, and state change',()=>{
  const calls=[];let events;
  const player={unloadModule:module=>calls.push(module)};
  const Player=class{constructor(_id,options){events=options.events;return player}};
  const ctx=setup({window:{YT:{Player}},YT:{Player}});
  ctx.libPlayerEnsureApi();
  for(const event of ['onReady','onApiChange','onStateChange'])events[event]({target:player});
  assert.deepEqual(calls,['captions','cc','captions','cc','captions','cc']);
  player.unloadModule=module=>{if(module==='captions')throw Error('unavailable');calls.push(module)};
  assert.doesNotThrow(()=>events.onApiChange({target:player}));
  assert.equal(calls.at(-1),'cc');
});
test('YouTube iframe load calls the actual caption helper after script setup',()=>{
  const commands=[];let onload;
  const iframe={addEventListener:(name,handler)=>{if(name==='load')onload=handler},contentWindow:{postMessage:(message,origin)=>commands.push({message:JSON.parse(message),origin})}};
  const ctx=setup({document:{getElementById:id=>id==='libPlayerIframe'?iframe:null}});
  assert.equal(typeof onload,'function');
  assert.doesNotThrow(()=>onload());
  assert.deepEqual(commands.map(({message})=>message.args[0]),['captions','cc']);
  assert.ok(commands.every(({message,origin})=>message.event==='command'&&message.func==='unloadModule'&&origin==='https://www.youtube.com'));
  assert.doesNotMatch(html,/<iframe id="libPlayerIframe"[^>]*\sonload=/);
  assert.equal(typeof ctx.libPlayerUnloadCaptions,'function');
});
test('caption callbacks resolve in the full page script and use API plus iframe commands',()=>{
  const start=html.indexOf('<script>',html.indexOf('<script src="./uad-licence.js"'))+8;
  const fullScript=html.slice(start,html.indexOf('</script>',start));
  const global={window:{},document:{getElementById(){throw Error('stop startup')}},requestAnimationFrame:()=>{}};
  assert.throws(()=>vm.runInNewContext(fullScript,global),/stop startup/);
  assert.equal(typeof global.libPlayerUnloadCaptions,'function');
  assert.equal(typeof global.libPlayerSelect,'function');

  const calls=[],commands=[];
  const iframe={addEventListener(){},contentWindow:{postMessage:message=>commands.push(JSON.parse(message).args[0])}};
  const player={unloadModule:module=>calls.push(module)};
  const ctx=setup({document:{getElementById:id=>id==='libPlayerIframe'?iframe:null}});
  assert.doesNotThrow(()=>ctx.libPlayerUnloadCaptions(player));
  assert.deepEqual(calls,['captions','cc']);
  assert.deepEqual(commands,['captions','cc']);
});
test('YouTube embed error shows the cannot-embed state',()=>{
  let failed=false;
  const Player=class{constructor(_id,options){options.events.onError({data:101});}};
  const ctx=setup({window:{YT:{Player}},YT:{Player},document:{getElementById:()=>({addEventListener(){},classList:{add:()=>{failed=true}}})}});
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
  assert.equal('description' in ctx.libPlayerVideos()[0],false);
  assert.equal(ctx.libPlayerVideos()[0].src,'/mwtm/f/lessons/lesson-1.mp4');
  assert.equal(ctx.libPlayerVideos()[0].thumb,'/mwtm/f/thumbs/lesson-1.jpg');
  assert.equal(fetched,'/mwtm/manifest.json?b=2026-11-23.47');
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

test('private selection uses local player and recording link; YouTube switches back',async()=>{
  const nodes={};for(const id of ['libPlayerTitle','libPlayerChannel','libPlayerOpen','libPlayerFailLink','libPlayerIframe'])nodes[id]={textContent:'',href:'',hidden:false,addEventListener(){},removeAttribute(name){this.removed=name}};
  nodes.libPlayer={classList:{remove(){}}};nodes.libPlayerFrame={classList:{remove(){}}};
  const local={shown:[],hidden:0,show(o){this.shown.push(o)},hide(){this.hidden++}};
  const saved=storage();
  const ctx=setup({localStorage:saved,document:{getElementById:id=>nodes[id]},AimmLocalPlayer:{attach:()=>local}});
  ctx.libPlayerRenderRows=()=>{};ctx.libPlayerEnsureApi=()=>{};
  vm.runInNewContext("LIB_PLAYER.privateVideos=[{video_id:'lesson-1',title:'Lesson',channel:'Mix With The Masters',src:'/mwtm/one.mp4',thumb:'/mwtm/f/one.jpg',local:true}]",ctx);
  ctx.libPlayerSelect('lesson-1',true);
  assert.equal(nodes.libPlayerOpen.href,'/mwtm/one.mp4');assert.equal(nodes.libPlayerOpen.textContent,'Open recording');
  assert.equal(local.shown[0].autoplay,true);
  assert.equal(JSON.parse(saved.getItem('aimmLibLastPlayed_v1'))[0].kind,'private');
  ctx.libPlayerSelect('6WPtHxWkY2k');
  assert.equal(local.hidden,1);assert.equal(nodes.libPlayerOpen.hidden,true);
  assert.match(nodes.libPlayerIframe.src,/youtube\.com\/embed\/6WPtHxWkY2k/);
  assert.deepEqual(JSON.parse(saved.getItem('aimmLibLastPlayed_v1')).map(row=>row.kind),['youtube','private']);
});

test('local player uses shared Lucide sprite and scoped controls',()=>{
  assert.match(html,/#libPlayerFrame\.is-local \.lpl\{display:block\}/);
  assert.match(html,/aimm\.mwtm\.resume\./);
  assert.match(html,/window\.AimmLocalPlayer=\{attach\}/);
  assert.match(html,/href="#i-.*?"/);
  assert.doesNotMatch(html,/id="lpi-/);
  assert.match(html,/fetch\('\/mwtm\/manifest\.json\?b=' \+ encodeURIComponent\(AIMM_BUILD\)\)/);
});

test('private player matches the measured centre controls at wide and 560 widths',()=>{
  const between=(source,start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
  const centre=between(html,'.lpl .lpl-mid{','.lpl .lpl-osd{');
  assert.match(centre,/\.lpl \.lpl-big\{width:56px;height:56px;margin:0 34px;padding:10px;border-radius:50%;background:rgba\(0,0,0,\.3\);font-size:36px\}/);
  assert.match(centre,/\.lpl \.lpl-sk\{width:48px;height:48px;padding:6px;background:none;font-size:24px\}/);
  assert.match(centre,/\.lpl \.lpl-sk span\{[^}]*width:36px;height:36px;padding:6px;border-radius:50%;background:rgba\(0,0,0,\.3\)/);
  assert.match(centre,/\.lpl:not\(\.lpl-idle\):not\(\.lpl-scrub\):not\(\.lpl-is-fail\):not\(\.lpl-menu-open\):not\(\.lpl-is-loading\) \.lpl-mid\{opacity:1;visibility:visible\}/);
  assert.match(html,/\.lpl \.lpl-in\{[^\n]*--bar:48px;--ic:24px;/);
  assert.match(html,/@container lpl \(min-width:900px\)\{\.lpl \.lpl-in\{--bar:54px;--ic:27px;/);
  assert.match(html,/@container lpl \(min-width:1400px\)\{\.lpl \.lpl-in\{--bar:60px;--ic:30px;/);
  assert.match(html,/\.lpl \.lpl-ctl\{[^}]*transition:opacity 140ms[^}]*\}/);
  assert.match(html,/\.lpl\.lpl-idle \.lpl-ctl\{[^}]*transition:opacity 280ms[^}]*\}/);
  assert.doesNotMatch(between(html,'.lpl .lpl-in{','.lpl .lpl-ctl{'),/--bw|--bh/);
  assert.doesNotMatch(centre,/background:#f00|rounded rectangle/);
  assert.match(html,/id="i-sk-back"[^]*?<text[^>]*>10<\/text><\/symbol><symbol id="i-sk-fwd"/);
  assert.match(html,/class="lpl-mid"[^]*?class="lpl-sk lpl-sk-b"[^]*?class="lpl-big lpl-fill"[^]*?class="lpl-sk lpl-sk-f"/);
  assert.match(html,/HIDE_MS=4700/);
  assert.match(html,/bSkB\.addEventListener\('click',\(\)=>seekBy\(-10\)\);bSkF\.addEventListener\('click',\(\)=>seekBy\(10\)\)/);
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
  assert.equal(count.textContent,'1/2');
});

function searchHarness(fetchImpl){
  const rows={innerHTML:'',querySelector:()=>null},count={textContent:''},search={value:''},select={value:''};
  const nodes={libPlayerRows:rows,libPlayerCount:count,libPlayerSearch:search,libPlayerChannelFilter:select};
  const timers=[];
  const ctx=setup({document:{getElementById:id=>nodes[id]},AIMM_PROXY_URL:'https://proxy.example/',fetch:fetchImpl,
    setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout:()=>{}});
  return {ctx,rows,count,search,timers,nodes};
}

test('one search filters the library and adds fresh YouTube rows after a debounce',async()=>{
  const calls=[];
  const h=searchHarness(async (url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({videos:[video('6WPtHxWkY2k','Known bass'),video('ZyXwVuTsR98','Fresh bass','Studio')]})};});
  h.ctx.YT_KB.videos=[video('6WPtHxWkY2k','Known bass'),video('AbCdEfGhI12','Other')];
  h.search.value='bass';h.ctx.libPlayerSearchChanged();
  assert.match(h.rows.innerHTML,/Known bass/);assert.doesNotMatch(h.rows.innerHTML,/Fresh bass/);
  assert.match(h.rows.innerHTML,/Searching YouTube/);assert.equal(calls.length,0);
  await h.timers[0]();
  assert.equal(calls[0].url,'https://proxy.example/kb/search-youtube');
  assert.equal(JSON.parse(calls[0].options.body).query,'bass');
  assert.equal((h.rows.innerHTML.match(/Known bass/g)||[]).length,2); // title and aria-label, no duplicate row
  assert.match(h.rows.innerHTML,/On YouTube/);assert.match(h.rows.innerHTML,/Fresh bass/);
  assert.match(h.rows.innerHTML,/https:\/\/i.ytimg.com\/vi\/ZyXwVuTsR98\/mqdefault.jpg/);
  assert.match(h.rows.innerHTML,/Not in library/);assert.match(h.rows.innerHTML,/Add to Hope/);
  assert.equal(h.count.textContent,'1/2');
});

test('stale responses and proxy errors leave library matches intact',async()=>{
  let resolveFirst;
  const h=searchHarness((_url,options)=>JSON.parse(options.body).query==='bass'?new Promise(resolve=>{resolveFirst=resolve}):Promise.resolve({ok:false,json:async()=>({error:'down'})}));
  h.ctx.YT_KB.videos=[video('6WPtHxWkY2k','Bass lesson')];
  h.search.value='bass';h.ctx.libPlayerSearchChanged();const pending=h.ctx.libPlayerSearchYouTube('bass',1);
  h.search.value='less';h.ctx.libPlayerSearchChanged();await h.ctx.libPlayerSearchYouTube('less',2);
  resolveFirst({ok:true,json:async()=>({videos:[video('ZyXwVuTsR98','Stale')]})});await pending;
  assert.match(h.rows.innerHTML,/Bass lesson/);assert.doesNotMatch(h.rows.innerHTML,/Stale/);
  assert.match(h.rows.innerHTML,/YouTube search is unavailable/);
});

test('pasted link shows one external row and Add to Hope moves it into the library',async()=>{
  const id='ZyXwVuTsR98';
  const h=searchHarness(async()=>({ok:true,json:async()=>({videos:[video(id,'New lesson','Studio')]})}));
  h.search.value='https://youtu.be/'+id;h.ctx.libPlayerSearchChanged();await h.timers[0]();
  assert.equal((h.rows.innerHTML.match(/class="result-row"/g)||[]).length,1);
  assert.match(h.rows.innerHTML,/New lesson/);
  const input={value:''};h.nodes.kbYtInput=input;h.nodes.kbYtGo={disabled:true};
  h.ctx.kbAddYoutube=async()=>{h.ctx.YT_KB.videos.push(video(id,'New lesson','Studio'))};
  h.ctx.libraryRender=()=>h.ctx.libPlayerRenderRows();
  await h.ctx.libPlayerAddToHope(id);
  assert.equal(input.value,'https://www.youtube.com/watch?v='+id);
  assert.doesNotMatch(h.rows.innerHTML,/Not in library|Add to Hope|class="result-row"/);
  assert.match(h.rows.innerHTML,/New lesson/);
});

test('Enter searches text immediately and a bare link stays playable when metadata is unavailable',async()=>{
  const calls=[];
  const h=searchHarness(async (url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({videos:[]})};});
  h.search.value='drums';
  await h.ctx.libPlayerSearchEnter({currentTarget:h.search,preventDefault(){}});
  assert.equal(calls.length,1);
  assert.equal(JSON.parse(calls[0].options.body).query,'drums');
  assert.match(h.rows.innerHTML,/No videos found/);
  h.search.value='https://youtu.be/ZyXwVuTsR98';
  h.ctx.libPlayerSearchChanged();
  await h.timers.at(-1)();
  assert.match(h.rows.innerHTML,/YouTube video/);
  assert.match(h.rows.innerHTML,/Not in library/);
});
