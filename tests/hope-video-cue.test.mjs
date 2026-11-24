import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const schemas=JSON.parse(readFileSync(new URL('../elevenlabs-client-tools.json',import.meta.url),'utf8'));
const registration=JSON.parse(readFileSync(new URL('../new-hope-tools.json',import.meta.url),'utf8'));
const manifest=JSON.parse(readFileSync(new URL('../standalone/assets/hope-tools-manifest.json',import.meta.url),'utf8'));
const helper=html.slice(html.indexOf('const HOPE_VIDEO_TRANSCRIPTS=new Map();'),html.indexOf('async function handleToolCall(name,args){'));
const cases=html.slice(html.indexOf("      case 'cue_video':{"),html.indexOf("      case 'inventory_navigate':{"));
const runSource=`${helper} async function run(name,args){switch(name){${cases}}}`;

test('video tools are available in the shared catalogue and registration files',()=>{
  for(const name of ['cue_video','search_youtube_videos']){
    assert.match(html,new RegExp("name:'"+name+"'"));
    assert.ok(schemas.some(tool=>tool.name===name));
    assert.ok(registration.some(tool=>tool.name===name));
  }
  assert.match(html,/const AICHAT_TOOL_DEFS = TOOL_DEFS\.map/);
  assert.match(html,/for \(const def of TOOL_DEFS\)/);
  assert.match(html,/tools:TOOL_DEFS/);
  assert.match(html,/VIDEO CUEING:[\s\S]*?search_youtube_videos/);
});

test('video chain guidance builds on MixBus before cueing and exposes explicit watch switch',()=>{
  const rule=html.match(/const HOPE_CHAIN_BUILD_RULES = `([^`]+)`;/)?.[1]||'';
  assert.ok(rule.indexOf('Build the chain on the MixBus first')<rule.indexOf('Only after the chain is on the MixBus, call cue_video'));
  assert.match(rule,/Do not switch tabs; keep Kev on the MixBus/);
  assert.match(rule,/Set switch_to_library true only when Kev asks to see or watch the video/);
  for(const list of [schemas,registration,manifest]){
    const cue=list.find(tool=>tool.name==='cue_video');
    assert.equal(cue.parameters.properties.switch_to_library.type,'boolean');
    assert.match(cue.description,/Keep Kev on his current tab by default/);
  }
});

test('cue_video keeps the active tab and selects a known video without autoplay',async()=>{
  let selected,clicked=0;
  const tab={classList:{contains:()=>false},click:()=>{clicked++}};
  const ctx={document:{querySelector:()=>tab},EL:{},YT_KB:{videos:[]},MwtmCueMap:{parts:()=>null},libPlayerVideos:()=>[{video_id:'AbCdEfGhI12',title:'Known lesson',channel:'Known channel'}],libPlayerSelect:(...args)=>{selected=args}};
  vm.runInNewContext(runSource,ctx);
  const result=await ctx.run('cue_video',{video_id:'AbCdEfGhI12'});
  assert.equal(clicked,0);
  assert.equal(ctx.EL.suppressNextTabChange,undefined);
  assert.deepEqual([...selected],['AbCdEfGhI12',false,null]);
  assert.deepEqual({...result},{ok:true,cued:true,video_id:'AbCdEfGhI12',title:'Known lesson',transcript_status:'in_library',tab_switched:false});
  const shown=await ctx.run('cue_video',{video_id:'AbCdEfGhI12',switch_to_library:true});
  assert.equal(clicked,1);
  assert.equal(ctx.EL.suppressNextTabChange,true);
  assert.equal(shown.tab_switched,true);
  await assert.rejects(ctx.run('cue_video',{video_id:'invalid'}),/11-character/);
});

test('cue_video passes metadata for an external video',async()=>{
  let selected;
  const ctx={document:{querySelector:()=>({classList:{contains:()=>true}})},YT_KB:{videos:[]},MwtmCueMap:{parts:()=>null},libPlayerVideos:()=>[],libPlayerSelect:(...args)=>{selected=args}};
  vm.runInNewContext(runSource,ctx);
  const result=await ctx.run('cue_video',{video_id:'AbCdEfGhI12',title:'External lesson',channel:'Studio'});
  assert.equal(selected[1],false);
  assert.deepEqual({...selected[2]},{title:'External lesson',channel:'Studio'});
  assert.equal(result.title,'External lesson');
  assert.equal(result.transcript_status,'loading');
});

test('external cue starts one background transcript read; read waits and reuses excerpts',async()=>{
  const id='AbCdEfGhI12';
  let release,fetches=0;
  const ctx={AIMM_PROXY_URL:'https://worker.example',setTimeout,clearTimeout,kbSearchTok:text=>String(text).toLowerCase().match(/[a-z]+/g)||[],
    document:{querySelector:()=>({classList:{contains:()=>true}})},YT_KB:{videos:[]},MwtmCueMap:{parts:()=>null},libPlayerVideos:()=>[],libPlayerSelect:()=>{},
    fetch:()=>{fetches++;return new Promise(resolve=>{release=()=>resolve(Response.json({title:'Drum lesson',channel:'Studio',already:false,chunks:['Intro','Kick transient compression','Outro']}));});}};
  vm.runInNewContext(runSource,ctx);
  const cue=await ctx.run('cue_video',{video_id:id,title:'Drum lesson'});
  assert.equal(cue.transcript_status,'loading');
  assert.equal(fetches,1);
  let finished=false;
  const reading=ctx.run('read_video_transcript',{video_id:id,query:'kick transient'}).then(result=>{finished=true;return result;});
  await Promise.resolve();
  assert.equal(finished,false);
  assert.equal(fetches,1);
  release();
  const result=await reading;
  assert.equal(result.ok,true);
  assert.match(result.result,/Kick transient compression/);
  assert.equal((await ctx.run('cue_video',{video_id:id})).transcript_status,'ready');
  assert.equal((await ctx.run('read_video_transcript',{video_id:id})).ok,true);
  assert.equal(fetches,1);
});

test('failed background transcript returns a speakable error without another fetch',async()=>{
  let fetches=0;
  const ctx={AIMM_PROXY_URL:'https://worker.example',setTimeout,clearTimeout,
    document:{querySelector:()=>({classList:{contains:()=>true}})},YT_KB:{videos:[]},MwtmCueMap:{parts:()=>null},libPlayerVideos:()=>[],libPlayerSelect:()=>{},
    fetch:async()=>{fetches++;return Response.json({error:'No captions available'},{status:422});}};
  vm.runInNewContext(runSource,ctx);
  await ctx.run('cue_video',{video_id:'AbCdEfGhI12'});
  const result=await ctx.run('read_video_transcript',{video_id:'AbCdEfGhI12'});
  assert.equal(result.ok,false);
  assert.match(result.error,/No captions available/);
  assert.equal(fetches,1);
});

test('search_youtube_videos uses proxy POST and caps valid results at five',async()=>{
  let request;
  const ctx={AIMM_PROXY_URL:'https://proxy.example/',fetch:async(url,options)=>{request={url,options};return {ok:true,json:async()=>({videos:Array.from({length:7},(_,i)=>({video_id:'AbCdEfGhI'+String(i).padStart(2,'0'),title:'Video '+i,channel:'Channel',duration:'1:20'}))})}}};
  vm.runInNewContext(runSource,ctx);
  const result=await ctx.run('search_youtube_videos',{query:'voice chain'});
  assert.equal(request.url,'https://proxy.example/kb/search-youtube');
  assert.equal(request.options.method,'POST');
  assert.equal(JSON.parse(request.options.body).query,'voice chain');
  assert.equal(result.videos.length,5);
  assert.deepEqual({...result.videos[0]},{video_id:'AbCdEfGhI00',title:'Video 0',channel:'Channel',duration:'1:20'});
});
