import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const schemas=JSON.parse(readFileSync(new URL('../elevenlabs-client-tools.json',import.meta.url),'utf8'));
const registration=JSON.parse(readFileSync(new URL('../new-hope-tools.json',import.meta.url),'utf8'));
const cases=html.slice(html.indexOf("      case 'cue_video':{"),html.indexOf("      case 'inventory_navigate':{"));
const runSource=`async function run(name,args){switch(name){${cases}}}`;

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

test('cue_video opens Library and selects a known video without autoplay',async()=>{
  let selected,clicked=0;
  const tab={classList:{contains:()=>false},click:()=>{clicked++}};
  const ctx={document:{querySelector:()=>tab},EL:{},YT_KB:{videos:[]},MwtmCueMap:{parts:()=>null},libPlayerVideos:()=>[{video_id:'AbCdEfGhI12',title:'Known lesson',channel:'Known channel'}],libPlayerSelect:(...args)=>{selected=args}};
  vm.runInNewContext(runSource,ctx);
  const result=await ctx.run('cue_video',{video_id:'AbCdEfGhI12'});
  assert.equal(clicked,1);
  assert.equal(ctx.EL.suppressNextTabChange,true);
  assert.deepEqual([...selected],['AbCdEfGhI12',false,null]);
  assert.deepEqual({...result},{ok:true,cued:true,video_id:'AbCdEfGhI12',title:'Known lesson'});
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
