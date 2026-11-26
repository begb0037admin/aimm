import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const source=html.slice(html.indexOf("      case 'add_video_to_library':{"),html.indexOf("      case 'open_library_channel':{"));
const helper=html.slice(html.indexOf('const HOPE_VIDEO_TRANSCRIPTS=new Map();'),html.indexOf('async function handleToolCall(name,args){'));
const metadata=html.slice(html.indexOf('async function libPlayerYouTubeMetadata('),html.indexOf('async function libPlayerSearchYouTube('));
const readSource=html.slice(html.indexOf("      case 'read_video_transcript':{"),html.indexOf("      case 'add_video_to_library':{"));
const runSource=`async function run(name,args){switch(name){${source}}}`;
const id='AbCdEfGhI12';
const tools=JSON.parse(readFileSync(new URL('../elevenlabs-client-tools.json',import.meta.url)));
const registration=JSON.parse(readFileSync(new URL('../new-hope-tools.json',import.meta.url)));

function context(overrides={}){
  const ctx={YT_KB:{videos:[]},LIB_SEARCH:{videos:[{video_id:id,title:'Drum lesson',channel:'Studio'}],adding:new Set(),addError:''},
    ensureYtKbLoaded:async()=>{},loadYtKb:async()=>{},kbYtWorking:false,libPlayerAddToHope:async()=>{},
    fetch:async()=>Response.json({title:'Drum lesson',author_name:'Studio'}),AbortSignal,
    document:{getElementById:()=>({textContent:''})},setTimeout,clearTimeout,...overrides};
  vm.runInNewContext(metadata+runSource,ctx);
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
});

test('a direct add request needs no transcript preview and verifies the refreshed KB',async()=>{
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
  const ctx=context({libPlayerAddToHope:async()=>({already:true}),loadYtKb:async()=>{refreshes++;ctx.YT_KB.videos.push({video_id:id,title:'Drum lesson',channel:'Studio'});}});
  const result=await ctx.run('add_video_to_library',{video_id:id,confirmed:true});
  assert.equal(result.ok,true);
  assert.equal(result.already_in_library,true);
  assert.equal(refreshes,1);
  assert.ok(ctx.YT_KB.videos.some(video=>video.video_id===id));
});

test('add_custom_plugin still has no confirmed parameter or gate',()=>{
  assert.ok(!tools.find(x=>x.name==='add_custom_plugin').parameters.properties.confirmed);
  const block=html.slice(html.indexOf("case 'add_custom_plugin':"),html.indexOf("case 'remove_custom_plugin':"));
  assert.doesNotMatch(block,/args\.confirmed/);
});

test('a confirmed batch processes videos in order, skips known IDs, and continues after a failure',async()=>{
  const known='ZyXwVuTsR98', failed='QwErTyUiO12', last='TuVwXyZaB12';
  const events=[];
  const ctx=context({libPlayerAddToHope:async video_id=>{
    events.push(['start',video_id]);
    await Promise.resolve();
    if(video_id===failed)ctx.LIB_SEARCH.addError='No captions';
    else {
      assert.equal(ctx.YT_KB.videos.some(video=>video.video_id===video_id),false);
      ctx.YT_KB.videos.push({video_id,title:'Drum lesson'});
    }
    events.push(['end',video_id]);
  }});
  ctx.YT_KB.videos.push({video_id:known,title:'Already filed'});
  const batch=html.slice(html.indexOf("case 'add_videos_to_library':"),html.indexOf("case 'inventory_navigate':"));
  vm.runInNewContext(helper+`async function handleToolCall(name,args){switch(name){${batch} default:return run(name,args);}}`,ctx);
  const call=async args=>JSON.parse(JSON.stringify(await ctx.handleToolCall('add_videos_to_library',args)));
  assert.equal((await call({video_ids:Array(11).fill(id),confirmed:true})).ok,false);
  assert.equal((await call({video_ids:[id],confirmed:'true'})).ok,false);
  const video_ids=[failed,known,id,last];
  const preview=await call({video_ids,confirmed:false});
  assert.equal(preview.needs_confirmation,true);
  assert.match(preview.summary,/Already filed \(already in library\)/);
  assert.deepEqual(events,[]);
  const result=await call({video_ids,confirmed:true});
  assert.equal(result.ok,false);
  assert.equal(result.library_count,3);
  assert.deepEqual(result.added_titles,['Drum lesson','Drum lesson']);
  assert.deepEqual(result.results.map(video=>video.status),['failed','already in library','added','added']);
  assert.equal(result.results[0].reason,'No captions');
  assert.deepEqual(events,[['start',failed],['end',failed],['start',id],['end',id],['start',last],['end',last]]);
});

 test('Library read filters and caps the results without changing them',async()=>{
  const ctx=context();
  ctx.ensureYtKbLoaded=async()=>{};
  ctx.YT_KB.videos=Array.from({length:105},(_,i)=>({video_id:String(i),title:'Mix '+i,channel:i===0?'Studio':'Other'}));
  const body=html.slice(html.indexOf("case 'get_library_videos':"),html.indexOf("case 'open_library_channel':"));
  vm.runInNewContext(`async function read(args){switch('get_library_videos'){${body}}}`,ctx);
  const all=await ctx.read({});
  assert.equal(all.library_count,105);assert.equal(all.videos.length,100);assert.equal(all.truncated,true);
  const filtered=await ctx.read({query:'studio'});
  assert.equal(filtered.total,1);assert.equal(filtered.videos[0].video_id,'0');assert.equal(ctx.YT_KB.videos.length,105);
 });
