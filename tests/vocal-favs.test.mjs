import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const favs=require('../standalone/assets/vocal-favs.js');
const data=JSON.parse(readFileSync(new URL('../standalone/assets/vocal-favs.json',import.meta.url)));
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const inventory=JSON.parse(readFileSync('/Users/admin/aimm-previews/inventory-scan.json','utf8'));
const stockCount=data.stock.logic.length;
const item=(name,publisher)=>({name,publisher});
test('Logic stock is DAW keyed and scanned targets resolve by exact normalised name and publisher',()=>{
  assert.deepEqual(Object.keys(data.stock),['logic']);
  assert.equal(data.owned.length,29);
  assert.equal(stockCount,57);
  const logic='/Applications/Logic Pro Creator Studio.app/Contents/';
  for(const {name} of data.stock.logic){
    assert.ok(existsSync(logic+'Frameworks/MADSP.framework/Versions/A/Resources/'+name+'.plist')||existsSync(logic+'Resources/Plug-In Settings/'+name),name+' is absent from installed Logic resources');
  }
  assert.equal(data.missing.length,22);
  const key=x=>favs.norm(x.publisher)+'|'+favs.norm(x.name);
  assert.equal(new Set(data.owned.map(key)).size,data.owned.length);
  assert.equal(new Set(data.stock.logic.map(x=>favs.norm(x.name))).size,stockCount);
  assert.deepEqual(data.stock.logic.filter(x=>x.videos>0).map(x=>[x.name,x.videos]),[['Compressor',1],['DeEsser 2',1],['Multipressor',1],['Space Designer',3],['Stereo Delay',8],['Tape Delay',2],['Vintage Console EQ',1]]);
  const scanned=favs.resolve({owned:data.owned,missing:[]},inventory.rows);
  assert.deepEqual(scanned.unresolved,[]);
  assert.equal(scanned.resolved.length,data.owned.length);
  assert.deepEqual(favs.resolve(data,inventory.rows).unresolved,[]);
  const targets=favs.targets(data);
  const rows=targets.map(x=>({name:x.name,vendor:x.publisher}));
  assert.equal(favs.resolve(data,rows).resolved.length,targets.length);
  assert.equal(favs.resolve(data,rows.slice(1)).unresolved.length,1);
  assert.equal(data.missing.some(x=>/StudioRack|D-Verb|AIR Reverb|EQ3|Lo-Fi|Auto Pan|EQ Eight/.test(x.name)),false);
});
test('apply is idempotent and verifies saved stars and Logic stock',async()=>{
  const rows=favs.targets(data).map(x=>({name:x.name,vendor:x.publisher}));
  const stars=new Set();let stock=[];
  const hooks={isFavorite:x=>stars.has(x.publisher+'|'+x.name),setFavorite:async x=>{stars.add(x.publisher+'|'+x.name);return {ok:true}},readStock:()=>stock,saveStock:async names=>{stock=names;return true}};
  const first=await favs.apply(data,rows,hooks);
  assert.equal(first.ok,true);assert.equal(first.starred,rows.length+stockCount);assert.equal(first.already,0);
  const second=await favs.apply(data,rows,hooks);
  assert.equal(second.starred,0);assert.equal(second.already,rows.length+stockCount);
  const broken=await favs.apply(data,rows,{...hooks,readStock:()=>[],saveStock:async()=>false});
  assert.equal(broken.ok,false);assert.equal(broken.not_saved.length,stockCount);
});
test('unresolved and failed saves are reported',async()=>{
  const result=await favs.apply(data,[],{isFavorite:()=>false,setFavorite:async()=>({ok:false}),readStock:()=>[],saveStock:async()=>true});
  assert.equal(result.unresolved,favs.targets(data).length);
  assert.equal(result.ok,false);
});
test('Hope exposes both tool schemas and routes through shared handler',()=>{
  for(const name of ['vocal_favorites_read','vocal_favorites_apply']){
    assert.match(html,new RegExp("name:'"+name+"'"));
    assert.match(html,new RegExp("AIMM_NEW_AGENT_TOOLS = \\[([^\\]]*)'"+name+"'"));
    assert.match(html,new RegExp("case '"+name+"':"));
  }
  assert.match(html,/const AICHAT_TOOL_DEFS = TOOL_DEFS\.map/);
  assert.match(html,/section:\{type:'string',enum:\['owned','stock','missing','all'\]/);
  assert.match(html,/confirmed:\{type:'boolean'/);
  assert.match(html,/const AIMM_BUILD = '2026-11-20\.16'/);
});
