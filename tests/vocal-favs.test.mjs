import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pageTools} from '../scripts/hope-tool-catalog.mjs';
const require=createRequire(import.meta.url);
const favs=require('../standalone/assets/vocal-favs.js');
const uad=require('../standalone/assets/uad-licence.js');
const data=JSON.parse(readFileSync(new URL('../standalone/assets/vocal-favs.json',import.meta.url)));
const licence=JSON.parse(readFileSync(new URL('../standalone/assets/uad-licence.json',import.meta.url)));
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const inventory=JSON.parse(readFileSync(new URL('../docs/handover-assets/inventory-scan.json',import.meta.url),'utf8'));
const chains=['vocal','drums','808','master'];
test('v2 chain data has the required shape, counts and no genre weights',()=>{
  assert.equal(data.version,2);assert.deepEqual(new Set(Object.keys(data.chains)),new Set(chains));
  const counts={vocal:[53,57,19],drums:[28,57,15],'808':[18,57,11],master:[17,57,9]};
  for(const key of chains){const chain=favs.getChain(data,key);assert.deepEqual([chain.owned.length,chain.stock.logic.length,chain.missing.length],counts[key]);assert.deepEqual(Object.keys(chain),['owned','stock','missing']);assert.deepEqual(Object.keys(chain.stock),['logic']);}
  assert.doesNotMatch(JSON.stringify(data),/weightedVideos|weighted_videos|"genres"|"weight"/);
});
test('every owned and equivalent target resolves to a scanned, licensed product',()=>{
  const scanned=new Set(inventory.rows.map(row=>favs.norm(row.vendor)+'|'+favs.norm(row.name)));
  for(const key of chains){const chain=favs.getChain(data,key);for(const item of favs.targets(chain)){
    assert.ok(scanned.has(favs.norm(item.publisher)+'|'+favs.norm(item.name)),key+': '+item.name);
    assert.ok(uad.licensed(item.name,item.publisher,licence),key+': '+item.name+' is unlicensed');
  }
  assert.deepEqual(favs.resolve(chain,inventory.rows).unresolved,[]);
  for(const row of chain.missing){assert.ok(row.equivalents.length<=3);const makers=row.equivalents.map(x=>!!x.sameMaker);assert.deepEqual(makers,[...makers].sort((a,b)=>Number(b)-Number(a)));}
  }
  const vocal=favs.getChain(data,'vocal').missing;
  assert.equal(vocal.find(x=>x.name==='Valhalla Room').equivalents[0].name,'ValhallaVintageVerb');
  assert.equal(vocal.find(x=>x.name==='Valhalla Delay').equivalents[0].name,'ValhallaSupermassive');
});
test('Logic stock is Logic Pro 13 only and resolves in installed resources',()=>{
  const base='/Applications/Logic Pro Creator Studio.app/Contents/';
  for(const key of chains)for(const {name} of favs.getChain(data,key).stock.logic)assert.ok(existsSync(base+'Frameworks/MADSP.framework/Versions/A/Resources/'+name+'.plist')||existsSync(base+'Resources/Plug-In Settings/'+name),name);
});
test('selection apply uses only exact names, is idempotent, and verifies failures',async()=>{
  const chain=favs.getChain(data,'vocal');const selected=[chain.owned[0].name,chain.stock.logic[0].name];
  const stars=new Set();let stock=[];
  const hooks={isFavorite:x=>stars.has(x.publisher+'|'+x.name),setFavorite:async x=>{stars.add(x.publisher+'|'+x.name);return {ok:true}},readStock:()=>stock,saveStock:async names=>{stock=names;return true}};
  const first=await favs.apply(chain,inventory.rows,hooks,selected);assert.equal(first.ok,true);assert.equal(first.starred,2);assert.equal(stars.size,1);assert.deepEqual(stock,[selected[1]]);
  const second=await favs.apply(chain,inventory.rows,hooks,selected);assert.equal(second.starred,0);assert.equal(second.already,2);
  const unknown=await favs.apply(chain,inventory.rows,hooks,['Made Up']);assert.equal(unknown.ok,false);assert.equal(unknown.unresolved,1);
  const failed=await favs.apply(chain,inventory.rows,{...hooks,readStock:()=>[],saveStock:async()=>false},[chain.stock.logic[1].name]);assert.equal(failed.ok,false);assert.equal(failed.not_saved.length,1);
  const target=chain.owned[1];const rejected=await favs.apply(chain,inventory.rows,{...hooks,setFavorite:async()=>({ok:false})},[target.name]);assert.equal(rejected.ok,false);assert.equal(rejected.not_saved.length,1);
});
test('Plugins starred stars have purple glow and no background or ring',()=>{
  assert.match(html,/#plugins \.inv-fav\.on\{color:#b970ff!important;background:none!important;border:0!important;box-shadow:none!important;text-shadow:/);
  assert.match(html,/#plugins \.inv-fav\.on:is\(:hover,:focus-visible\)\{color:#b970ff!important;background:none!important;border:0!important;outline:none!important;box-shadow:none!important;text-shadow:/);
  assert.match(html,/#plugins \.inv-fav:not\(\.on\)\{color:var\(--pm-dim\)!important\}/);
});
test('Hope schemas match page tools and both routes use shared handler',()=>{
  for(const name of ['vocal_favorites_read','vocal_favorites_apply']){
    const tool=pageTools.find(t=>t.name===name);assert.ok(tool);assert.deepEqual(tool.parameters.properties.chain.enum,['vocal','drums','808','master','all']);
    assert.match(html,new RegExp("AIMM_NEW_AGENT_TOOLS = \\[([^\\]]*)'"+name+"'"));assert.match(html,new RegExp("case '"+name+"':"));
  }
  assert.deepEqual(pageTools.find(t=>t.name==='vocal_favorites_apply').parameters.properties.names,{type:'array',items:{type:'string'},description:'Exact item names to apply; omit for the whole chain view.'});
  assert.match(html,/const AICHAT_TOOL_DEFS = TOOL_DEFS\.map/);assert.match(html,/const AIMM_BUILD = '2026-11-22\.4'/);
});
