import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const source=html.slice(html.indexOf("      case 'add_video_to_library':{"),html.indexOf("      case 'inventory_navigate':{"));
const helper=html.slice(html.indexOf('const HOPE_VIDEO_TRANSCRIPTS=new Map();'),html.indexOf('async function handleToolCall(name,args){'));
const readSource=html.slice(html.indexOf("      case 'read_video_transcript':{"),html.indexOf("      case 'add_video_to_library':{"));
const runSource=`async function run(name,args){switch(name){${source}}}`;
const id='AbCdEfGhI12';
const tools=JSON.parse(readFileSync(new URL('../elevenlabs-client-tools.json',import.meta.url)));
const registration=JSON.parse(readFileSync(new URL('../new-hope-tools.json',import.meta.url)));

function context(overrides={}){
  const ctx={YT_KB:{videos:[]},LIB_SEARCH:{videos:[{video_id:id,title:'Drum lesson',channel:'Studio'}],adding:new Set(),addError:''},
    ensureYtKbLoaded:async()=>{},loadYtKb:async()=>{},kbYtWorking:false,libPlayerAddToHope:async()=>{},
    document:{getElementById:()=>({textContent:''})},setTimeout,clearTimeout,...overrides};
  vm.runInNewContext(runSource,ctx);
  return ctx;
}

test('add_video_to_library is registered with required confirmation',()=>{
  assert.match(html,/name:'add_video_to_library'/);
  assert.match(html,/AIMM_NEW_AGENT_TOOLS[^\n]*'add_video_to_library'/);
  for(const list of [tools,registration]){
    const tool=list.find(x=>x.name==='add_video_to_library');
    assert.ok(tool);
    assert.deepEqual(tool.parameters.required,['video_id','confirmed']);
  }
});

test('read_video_transcript uses peek and selects relevant chunks without loading the library',async()=>{
  const calls=[];
  const ctx={AIMM_PROXY_URL:'https://worker.example/',setTimeout,clearTimeout,kbSearchTok:text=>String(text).toLowerCase().match(/[a-z]+/g)||[],fetch:async (url,options)=>{
    calls.push({url,options});
    return Response.json({ok:true,video_id:id,title:'Drum lesson',channel:'Studio',already:false,chunks:['intro','kick compression transient','outro']});
  }};
  vm.runInNewContext(`${helper} async function run(name,args){switch(name){${readSource}}}`,ctx);
  const result=await ctx.run('read_video_transcript',{video_id:id,query:'kick transient'});
  assert.equal(result.ok,true);
  assert.equal(result.video,'Drum lesson');
  assert.equal(result.channel,'Studio');
  assert.equal(result.chunks_matched,1);
  assert.match(result.result,/kick compression transient/);
  assert.equal(calls.length,1);
  assert.equal(calls[0].url,'https://worker.example/kb/peek-youtube');
  assert.deepEqual(JSON.parse(calls[0].options.body),{url:'https://www.youtube.com/watch?v='+id});
  for(const list of [tools,registration])assert.deepEqual(list.find(x=>x.name==='read_video_transcript').parameters.required,['video_id']);
  assert.match(tools.find(x=>x.name==='add_video_to_library').description,/heard the findings/);
});

test('preview gives metadata without adding; confirmed call verifies refreshed KB',async()=>{
  let adds=0;
  const ctx=context({libPlayerAddToHope:async()=>{adds++;ctx.YT_KB.videos.push({video_id:id,title:'Drum lesson',added:true});}});
  const preview=await ctx.run('add_video_to_library',{video_id:id,confirmed:false});
  assert.equal(preview.needs_confirmation,true);
  assert.equal(preview.title,'Drum lesson');
  assert.equal(preview.channel,'Studio');
  assert.equal(preview.already_in_library,false);
  assert.equal(adds,0);
  const added=await ctx.run('add_video_to_library',{video_id:id,confirmed:true});
  assert.deepEqual({...added},{ok:true,video_id:id,title:'Drum lesson',already_in_library:false});
  assert.equal(adds,1);
  const existing=await ctx.run('add_video_to_library',{video_id:id,confirmed:false});
  assert.equal(existing.ok,true);
  assert.equal(existing.already_in_library,true);
  assert.equal(adds,1);
});

test('failed add cannot claim success and invalid IDs are rejected',async()=>{
  const ctx=context({LIB_SEARCH:{videos:[],adding:new Set(),addError:'No captions'},
    libPlayerAddToHope:async()=>{}});
  const result=await ctx.run('add_video_to_library',{video_id:id,confirmed:true});
  assert.equal(result.ok,false);
  assert.equal(result.error,'No captions');
  assert.equal((await ctx.run('add_video_to_library',{video_id:'invalid',confirmed:true})).ok,false);
});

test('server-side duplicate refreshes a stale in-page KB before success',async()=>{
  let refreshes=0;
  const ctx=context({loadYtKb:async()=>{refreshes++;ctx.YT_KB.videos.push({video_id:id,title:'Drum lesson',channel:'Studio'});}});
  const result=await ctx.run('add_video_to_library',{video_id:id,confirmed:true});
  assert.equal(result.ok,true);
  assert.equal(refreshes,1);
  assert.ok(ctx.YT_KB.videos.some(video=>video.video_id===id));
});

test('add_custom_plugin still has no confirmed parameter or gate',()=>{
  assert.ok(!tools.find(x=>x.name==='add_custom_plugin').parameters.properties.confirmed);
  const block=html.slice(html.indexOf("case 'add_custom_plugin':"),html.indexOf("case 'remove_custom_plugin':"));
  assert.doesNotMatch(block,/args\.confirmed/);
});
