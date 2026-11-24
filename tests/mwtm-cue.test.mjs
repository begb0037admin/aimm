import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const mapper=readFileSync(new URL('../standalone/assets/mwtm-cue-map.js',import.meta.url),'utf8');
const library=html.slice(html.indexOf('const LIB_PLAYER='),html.indexOf('function libFold(button){'));
const cue=html.slice(html.indexOf("case 'cue_video':")+"case 'cue_video':".length,html.indexOf("case 'search_youtube_videos':"));
const kbId='mwtm-ben-baptie-michael-kiwanuka-beautiful-life-p05';
const privateId='mwtm-Ben_Baptie_Michael_Kiwanuka_Beautiful_Life_Mixing-05';
const recording={id:privateId,title:'Ben Baptie - Michael Kiwanuka "Beautiful Life" - Part 5: Mix',video:'set/part.mp4',thumb:'set/part.jpg'};

function setup(){
  const nodes={};
  for(const id of ['libPlayerTitle','libPlayerChannel','libPlayerOpen','libPlayerFailLink','libPlayerIframe'])nodes[id]={textContent:'',href:'',hidden:false,removeAttribute(){},addEventListener(){}};
  nodes.libPlayer={classList:{remove(){}}};nodes.libPlayerFrame={classList:{remove(){}}};
  const shown=[],tab={classList:{contains:()=>false},click(){this.clicked=true}};
  const ctx=vm.createContext({URL,URLSearchParams,setTimeout,clearTimeout,AIMM_BUILD:'2026-11-23.47',location:{origin:'http://localhost'},
    YT_KB:{loaded:true,videos:[{video_id:kbId,title:'Beautiful Life — Part 5: Mix',channel:'Mix With The Masters'}]},
    document:{getElementById:id=>nodes[id],querySelector:()=>tab},
    fetch:async()=>({ok:true,json:async()=>[recording]}),localStorage:{getItem:()=>null,setItem(){}},
    AimmLocalPlayer:{attach:()=>({show:state=>shown.push(state),hide(){}})},
    escapeHtml:String,escapeJs:String,libDate:String,libChannels:()=>[],libFilterVideos:()=>[]});
  vm.runInContext(mapper,ctx);vm.runInContext(library,ctx);
  vm.runInContext('libPlayerRender=()=>{};libPlayerRenderRows=()=>{};libPlayerEnsureApi=()=>{};ensureYtKbLoaded=async()=>{};',ctx);
  const run=vm.runInContext(`async function cue(args)${cue};cue`,ctx);
  return {ctx,nodes,shown,tab,run};
}

test('MWTM KB and private IDs resolve to one recording with matching part',()=>{
  const {ctx}=setup();
  const rows=[{video_id:privateId,title:recording.title},{video_id:privateId.replace(/-05$/,'-04'),title:'Part 4'}];
  assert.equal(ctx.MwtmCueMap.resolve(kbId,rows)?.video_id,privateId);
  assert.equal(ctx.MwtmCueMap.resolve(privateId,rows)?.video_id,privateId);
  assert.equal(ctx.MwtmCueMap.resolve(kbId.replace(/p05$/,'p06'),rows),null);
  assert.equal(ctx.MwtmCueMap.resolve('mwtm-different-folder-p05',[{video_id:'mwtm-Other_Set_Mixing-05',title:'Someone - Beautiful Life - Part 5: Mix'}],'Beautiful Life — Part 5: Mix')?.video_id,'mwtm-Other_Set_Mixing-05');
});

test('cue_video waits for a manifest load already in progress',async()=>{
  const {ctx,run,shown}=setup();
  let release;
  ctx.fetch=()=>new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>[recording]})});
  const loading=ctx.libPlayerLoadManifest();
  const cueing=run({video_id:kbId});
  release();
  await loading;
  const result=await cueing;
  assert.equal(result.video_id,privateId);
  assert.equal(shown[0].autoplay,false);
});

test('cue_video opens the Library private recording paused for either MWTM ID form',async()=>{
  for(const id of [kbId,privateId]){
    const {run,shown,tab,nodes}=setup();
    const result=await run({video_id:id});
    assert.equal(result.video_id,privateId);
    assert.equal(result.cued,true);
    assert.equal(tab.clicked,true);
    assert.equal(shown.length,1);
    assert.equal(shown[0].autoplay,false);
    assert.equal(shown[0].id,privateId);
    assert.equal(nodes.libPlayerIframe.removed,undefined);
    assert.equal(nodes.libPlayerOpen.href,'/mwtm/f/set/part.mp4');
  }
});

test('cue_video keeps 11-character YouTube IDs and rejects unmatched MWTM IDs',async()=>{
  const {run,nodes}=setup();
  const publicResult=await run({video_id:'6WPtHxWkY2k',title:'Public video'});
  assert.equal(publicResult.title,'Public video');
  assert.match(nodes.libPlayerIframe.src,/youtube\.com\/embed\/6WPtHxWkY2k/);
  await assert.rejects(run({video_id:'mwtm-no-such-set-p01'}),/no private recording matches/);
  await assert.rejects(run({video_id:'not-a-valid-video-id'}),/must be an 11-character YouTube ID or mwtm-/);
});
