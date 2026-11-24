import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/src/index.js';

const origin = 'https://begb0037admin.github.io';
const base = 'https://worker.example';
function setup(){
  const data = new Map();
  const vectors = [];
  const env = {
    APIFY_TOKEN:'mock-only', VOYAGE_API_KEY:'mock-voyage',
    AIMM_KV:{get:async (key, mode)=>{ const raw=data.get(key); return mode==='json' && raw ? JSON.parse(raw) : raw || null; },put:async (key,value)=>data.set(key,value),delete:async key=>data.delete(key)},
    VEC_YT_KB:{upsert:async values=>vectors.push(...values),deleteByIds:async()=>{}},
    HOPE_STT_LIMIT:{limit:async()=>({success:true})},
  };
  const request=(path,method='GET',body)=>worker.fetch(new Request(base+path,{method,headers:{Origin:origin,...(body?{'Content-Type':'application/json'}:{})},body:body&&JSON.stringify(body)}),env);
  return {data,vectors,env,request};
}
const sampleId = 'dQw4w9WgXcQ';
test('Add to Hope accepts every supported YouTube link shape and host',async()=>{
  const {request,data}=setup();
  data.set('yt-user:index',JSON.stringify([{video_id:sampleId,title:'Existing',chunks:3}]));
  for(const host of ['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com']){
    for(const path of ['watch?v='+sampleId+'&si=x','embed/'+sampleId,'live/'+sampleId+'?si=x','shorts/'+sampleId,'v/'+sampleId]){
      const url='https://'+host+'/'+path;
      const response=await request('/kb/add-youtube','POST',{url});
      assert.equal(response.status,200,url);
      assert.equal((await response.json()).video_id,sampleId,url);
    }
  }
  for(const url of ['https://www.youtube.com/live/'+sampleId.slice(1),'https://www.youtube.com/v/'+sampleId+'extra']){
    const response=await request('/kb/add-youtube','POST',{url});
    assert.equal(response.status,400,url);
    assert.equal((await response.json()).code,'invalid_url',url);
  }
});
test('rejects non-YouTube hosts and unsupported paths before any upstream request',async()=>{
  const {request}=setup();
  for (const url of ['https://youtube.com.evil.test/watch?v='+sampleId,'https://example.com/'+sampleId,'https://youtube.com/channel/'+sampleId]) {
    const r=await request('/kb/add-youtube','POST',{url});assert.equal(r.status,400);assert.equal((await r.json()).code,'invalid_url');
  }
});
test('accepts share, watch, shorts and live links; chunks at transcript entry boundaries; stores full text',async()=>{
  const original=globalThis.fetch;
  const seen=[];
  globalThis.fetch=async (url,options)=>{
    seen.push(String(url));
    if(String(url).includes('apify.com')) return Response.json([{videoId:sampleId,videoTitle:'Sample title',channelName:'Sample channel',segments:[{text:'[Music] '+Array(499).fill('word').join(' ')+' end.'},{text:' second part'}]}]);
    if(String(url).includes('voyageai.com')) {
      const batch=JSON.parse(options.body).inputs[0];
      return Response.json({data:[{data:batch.map((_,i)=>({index:i,embedding:[0.2,0.3]}))}]});
    }
    throw new Error('Unexpected URL');
  };
  try {
    for (const url of ['https://youtu.be/'+sampleId+'?si=abc','https://www.youtube.com/watch?v='+sampleId+'&si=x','https://youtube.com/shorts/'+sampleId+'?si=x','https://youtube.com/live/'+sampleId]) {
      const {request,vectors}=setup();
      const r=await request('/kb/add-youtube','POST',{url});
      assert.equal(r.status,200);
      const body=await r.json();assert.equal(body.chunks,2);assert.equal(body.already,false);assert.equal(body.video_id,sampleId);
      assert.equal(vectors.length,2);assert.match(vectors[0].metadata.text,/^word/);assert.doesNotMatch(vectors[0].metadata.text,/\[Music\]/);
      const transcript=await request('/kb/transcript?id='+sampleId);assert.equal(transcript.status,200);assert.match((await transcript.json()).transcript,/second part/);
      const index=await request('/kb/user-videos');assert.equal((await index.json()).videos.length,1);
    }
    assert.equal(seen.filter(url=>url.includes('apify.com')).length,4);
  } finally {globalThis.fetch=original;}
});
test('repo video duplicate returns its real title without Apify',async()=>{
  const {request}=setup();
  const r=await request('/kb/add-youtube','POST',{url:'https://youtu.be/6WPtHxWkY2k'});
  const body=await r.json();assert.equal(body.already,true);assert.match(body.title,/Logic Pro 101/);
});
test('duplicate user video skips Apify',async()=>{
  const {request,data}=setup();
  data.set('yt-user:index',JSON.stringify([{video_id:sampleId,title:'Existing',chunks:3}]));
  const r=await request('/kb/add-youtube','POST',{url:'https://youtu.be/'+sampleId});
  assert.equal((await r.json()).already,true);
});
test('no captions and service errors have plain messages without upstream body or token',async()=>{
  const original=globalThis.fetch;
  try {
    for(const mock of [Response.json([{videoId:sampleId,segments:[]}]),new Response('mock-only upstream secret', {status:500})]){
      globalThis.fetch=async()=>mock.clone();
      const r=await setup().request('/kb/add-youtube','POST',{url:'https://youtu.be/'+sampleId});
      const body=await r.text();assert.equal(r.status,mock.status===500?502:422);assert.doesNotMatch(body,/mock-only/);
    }
  }finally{globalThis.fetch=original;}
});
test('search returns approval candidates and excludes repo and dashboard video ids',async()=>{
  const original=globalThis.fetch;
  const {request,data}=setup();
  data.set('yt-user:index',JSON.stringify([{video_id:sampleId,title:'Already added'}]));
  const fresh='QWERTY12345';
  globalThis.fetch=async (url,options)=>{
    if(String(url).includes('youtubei/v1/search')) throw new Error('Innertube unavailable');
    assert.match(String(url),/streamers~youtube-scraper/);
    assert.deepEqual(JSON.parse(options.body).searchQueries,['808 drums']);
    assert.equal(JSON.parse(options.body).maxResults,8);
    assert.ok(options.signal);
    return Response.json([
      {url:'https://www.youtube.com/watch?v=6WPtHxWkY2k',title:'Repo'},
      {url:'https://youtu.be/'+sampleId,title:'User'},
      {url:'https://youtu.be/'+fresh,title:'Fresh',channelName:'Studio',duration:'11:42',viewCount:312000},
      {url:'https://youtu.be/'+fresh,title:'Duplicate'}
    ]);
  };
  try{
    const response=await request('/kb/search-youtube','POST',{query:'808 drums'});
    assert.equal(response.status,200);
    const body=await response.json();
    assert.equal(body.excluded,2);
    assert.equal(body.videos.length,1);
    assert.deepEqual(body.videos[0],{id:fresh,video_id:fresh,title:'Fresh',channel:'Studio',duration:'11:42',views:312000,url:'https://www.youtube.com/watch?v='+fresh,reason:'Matches your search for 808 drums.'});
    assert.equal(data.has('yt-user:'+fresh),false);
  }finally{globalThis.fetch=original;}
});
test('search uses Innertube videos and excludes known videos without calling Apify',async()=>{
  const original=globalThis.fetch;
  const {request,data}=setup();
  data.set('yt-user:index',JSON.stringify([{video_id:sampleId}]));
  const fresh='QWERTY12345';
  const renderer=(videoId,title)=>({videoRenderer:{videoId,title:{runs:[{text:title}]},ownerText:{runs:[{text:'Mix '},{text:'School'}]},lengthText:{simpleText:'8:42'},viewCountText:{simpleText:'12,345 views'},descriptionSnippet:{runs:[{text:'A useful '},{text:'tutorial'}]}}});
  let calls=0;
  globalThis.fetch=async (url,options)=>{
    calls++;
    assert.equal(String(url),'https://www.youtube.com/youtubei/v1/search?prettyPrint=false');
    assert.ok(options.signal);
    assert.deepEqual(JSON.parse(options.body),{context:{client:{clientName:'WEB',clientVersion:'2.20250101.00.00',hl:'en',gl:'GB'}},query:'sidechain compression'});
    return Response.json({contents:{twoColumnSearchResultsRenderer:{primaryContents:{sectionListRenderer:{contents:[{itemSectionRenderer:{contents:[renderer('6WPtHxWkY2k','Repo'),renderer(sampleId,'User'),renderer(fresh,'Fresh'),renderer(fresh,'Duplicate')]}}]}}}}});
  };
  try {
    const response=await request('/kb/search-youtube','POST',{query:'sidechain compression'});
    assert.equal(response.status,200);
    const body=await response.json();
    assert.equal(calls,1);
    assert.equal(body.query,'sidechain compression');
    assert.equal(body.excluded,2);
    assert.deepEqual(body.videos,[{id:fresh,video_id:fresh,title:'Fresh',channel:'Mix School',duration:'8:42',views:12345,url:'https://www.youtube.com/watch?v='+fresh,reason:'A useful tutorial'}]);
  } finally { globalThis.fetch=original; }
});
test('search falls back to Apify when Innertube has no videos',async()=>{
  const original=globalThis.fetch;
  const {request}=setup();
  let calls=0;
  globalThis.fetch=async url=>{
    calls++;
    if(String(url).includes('youtubei/v1/search')) return Response.json({contents:{twoColumnSearchResultsRenderer:{primaryContents:{sectionListRenderer:{contents:[]}}}}});
    assert.match(String(url),/streamers~youtube-scraper/);
    return Response.json([{id:'QWERTY12345',title:'Fallback'}]);
  };
  try {
    const response=await request('/kb/search-youtube','POST',{query:'sidechain compression'});
    assert.equal(response.status,200);
    assert.equal(calls,2);
    assert.equal((await response.json()).videos[0].title,'Fallback');
  } finally { globalThis.fetch=original; }
});
test('deleting a dashboard video removes its vector chunks and index entry',async()=>{
  const {request,data,vectors,env}=setup();
  data.set('yt-user:index',JSON.stringify([{video_id:sampleId,title:'Saved'}]));
  data.set('yt-user:'+sampleId,JSON.stringify({video_id:sampleId,transcript:'Words'}));
  data.set('kb-vec-manifest:'+sampleId,JSON.stringify([1,2]));
  let deleted=[];env.VEC_YT_KB.deleteByIds=async ids=>{deleted=ids;};
  const response=await request('/kb/user-videos/'+sampleId,'DELETE');
  assert.equal(response.status,200);
  assert.equal(deleted.length,2);
  assert.equal(data.has('yt-user:'+sampleId),false);
  assert.equal(data.has('kb-vec-manifest:'+sampleId),false);
  assert.deepEqual(JSON.parse(data.get('yt-user:index')),[]);
});
