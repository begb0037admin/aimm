import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=readFileSync('worker/src/index.js','utf8');
const code=src.slice(src.indexOf('function youtubeChannelNorm('),src.indexOf('\nfunction youtubeChunks('));
const ids=['UC'+'A'.repeat(22),'UC'+'B'.repeat(22),'UC'+'C'.repeat(22)];
const channel=(id,title,sub=100)=>({id,snippet:{title,customUrl:'@'+title.replace(/\s/g,'')},statistics:{subscriberCount:String(sub),videoCount:'2'},contentDetails:{relatedPlaylists:{uploads:'uploads'}}});
function setup(candidates=[channel(ids[0],'ACE Studio')],opts={}){
 const calls=[],cache=new Map();
 const fetch=async url=>{const u=new URL(url),p=u.pathname.split('/').pop();calls.push([p,Object.fromEntries(u.searchParams)]);
  if(opts.quota)return Response.json({error:{errors:[{reason:'quotaExceeded'}]}},{status:403});
  if(p==='channels')return Response.json({items:candidates});
  if(p==='search')return Response.json({items:u.searchParams.get('type')==='channel'?candidates.map(c=>({id:{channelId:c.id}})):u.searchParams.get('maxResults')==='5'?(opts.topicResults?.[u.searchParams.get('channelId')]||[]).map(title=>({snippet:{title}})):opts.empty?[]:[{id:{videoId:'abcdefghijk'}},{id:{videoId:'shortshort1'}}]});
  if(p==='playlistItems')return Response.json({items:[{contentDetails:{videoId:'abcdefghijk'}},{contentDetails:{videoId:'shortshort1'}}]});
  if(p==='videos'&&u.searchParams.get('part')==='snippet')return Response.json({items:Object.entries(opts.library||{}).filter(([id])=>u.searchParams.get('id').split(',').includes(id)).map(([id,channelId])=>({id,snippet:{channelId}}))});
  if(p==='videos')return Response.json({items:[{id:'abcdefghijk',snippet:{title:'Lesson',liveBroadcastContent:'none'},contentDetails:{duration:'PT1H2M3S'},statistics:{viewCount:'42'}},{id:'shortshort1',snippet:{title:'Short',liveBroadcastContent:'none'},contentDetails:{duration:'PT60S'}}]});throw Error(p);
 };
 const ctx=vm.createContext({fetch,URL,Map,Set,Number,String,Object,Array,Error});vm.runInContext(code+';globalThis.run=youtubeChannelVideos;globalThis.duration=youtubeDuration',ctx);
 const env={YOUTUBE_API_KEY:'test',AIMM_KV:{get:async k=>cache.has(k)?JSON.parse(cache.get(k)):null,put:async(k,v)=>cache.set(k,v)}};
 return {ctx,env,calls};
}
test('handles, tracked URLs, and IDs resolve using channels.list',async()=>{for(const q of ['@ace-studio','https://youtube.com/@ace-studio?si=tracking',ids[0],'https://youtube.com/user/abc','https://youtube.com/c/abc']){const {ctx,env,calls}=setup();const r=await ctx.run(q,env);assert.equal(r.channel,'ACE Studio');assert.equal(calls[0][0],'channels');assert.equal(r.videos.length,1);assert.equal(r.videos[0].duration,'1:02:03');}});
test('spoken names normalise and rank candidate titles',async()=>{for(const [q,title] of [['ACE Studio','ACE Studio'],['ace studio','ACE Studio'],['kc sounds','KC Sounds'],['KCSounds','KC Sounds'],['the Busy Work Beats channel','Busy Works Beats']]){const {ctx,env}=setup([channel(ids[0],title),channel(ids[1],'Unrelated',999)]);assert.equal((await ctx.run(q,env)).channel,title);}});
test('library video, topic, then subscribers disambiguate same-name channels',async()=>{
 const candidates=[channel(ids[0],'KC Sounds',1),channel(ids[1],'KC Sounds',200)];
 const x=setup(candidates,{library:{abcdefghijk:ids[0]},topicResults:{[ids[0]]:['Logic plugins tutorial','Logic mixing'],[ids[1]]:['Music']}});
 let r=await x.ctx.run('kc sounds',x.env,'logic plugins',['abcdefghijk']);
 assert.equal(r.resolved_channel.id,ids[0]);assert.equal(r.confidence,'high');assert.equal(r.alternatives[0].id,ids[1]);
 assert.equal(x.calls.filter(([p,v])=>p==='videos'&&v.part==='snippet').length,1);
 r=await x.ctx.run('kc sounds',x.env,'logic plugins');assert.equal(r.resolved_channel.id,ids[1]);assert.equal(r.confidence,'low');
 const n=x.calls.length;await x.ctx.run('kc sounds',x.env,'logic plugins',['abcdefghijk']);assert.equal(x.calls.length,n);
 r=await x.ctx.run('kc sounds',x.env);assert.equal(r.resolved_channel.id,ids[1]);assert.equal(r.confidence,'low');assert.equal(r.alternatives[0].id,ids[0]);
});
test('topic filtering reuses cached uploads without a search request',async()=>{const x=setup();const a=await x.ctx.run('@ace',x.env,'mixing');assert.equal(a.note,'no videos matched that topic on this page');assert.equal(a.total_videos,2);assert.ok(x.calls.some(([p])=>p==='playlistItems'));assert.ok(!x.calls.some(([p])=>p==='search'));const n=x.calls.length;const b=await x.ctx.run('@ace',x.env,'lesson');assert.equal(b.videos.length,1);assert.equal(x.calls.length,n);});
test('uploads pages pass tokens and cache each page',async()=>{const x=setup();await x.ctx.run('@ace',x.env,'',[],'page2');assert.equal(x.calls.find(([p])=>p==='playlistItems')[1].pageToken,'page2');const n=x.calls.length;await x.ctx.run('@ace',x.env,'',[],'page2');assert.equal(x.calls.length,n);await x.ctx.run('@ace',x.env);assert.equal(x.calls.filter(([p])=>p==='playlistItems').length,2);});
test('duration and quota mapping',async()=>{const x=setup();assert.equal(x.ctx.duration('PT2M3S').text,'2:03');assert.equal(x.ctx.duration('PT1H2M3S').text,'1:02:03');const y=setup(undefined,{quota:true});await assert.rejects(y.ctx.run('@ace',y.env),e=>e.status===429&&e.code==='quota');});
