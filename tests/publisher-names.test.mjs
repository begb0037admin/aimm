import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const require=createRequire(import.meta.url),P=require('../standalone/assets/publisher-names.js'),U=require('../standalone/assets/uad-licence.js');
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const norm=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const scanPath='/tmp/inv.json',rows=existsSync(scanPath)?JSON.parse(readFileSync(scanPath)).rows:null;
const identity=row=>norm(row.vendor)+'|'+norm(row.name);
function groups(rows){const m=new Map();for(const row of rows){const key=identity(row);if(!m.has(key))m.set(key,[]);m.get(key).push(row);}return m;}
test('publisher spelling and matching product prefix',()=>{
 assert.equal(P.canonicalVendor('uaudio'),'Universal Audio');assert.equal(P.canonicalVendor('oeksound'),'Oeksound');
 assert.equal(P.cleanProductName('Universal Audio: UAD API Preamp','uaudio'),'UAD API Preamp');
 assert.equal(P.cleanProductName('Other: Product','uaudio'),'Other: Product');
 const input=[{vendor:'uaudio',name:'Universal Audio: UAD API Preamp'},{vendor:'Universal Audio',name:'UAD API Preamp'}];assert.equal(groups(P.normalizeRows(input)).size,1);
});
test('real scan has one spelling per publisher and no lowercase card titles',{skip:!rows},()=>{
 const normalized=P.normalizeRows(rows),seen=new Map();for(const row of normalized){const key=P.key(row.vendor);if(!seen.has(key))seen.set(key,new Set());seen.get(key).add(row.vendor);assert.ok(!/[a-z]/.test(row.vendor)||/[A-Z]/.test(row.vendor),row.vendor);}assert.ok([...seen.values()].every(s=>s.size===1));
});
test('real scan merges products and preserves the licence split',{skip:!rows},()=>{
 const before=groups(rows),normalized=P.normalizeRows(rows),after=groups(normalized),data=require('../standalone/assets/uad-licence.json');
 const merged=[...after.values()].filter(list=>new Set(list.map(row=>norm(row.rawVendor)+'|'+norm(row.rawName))).size>1);
 assert.equal(before.size,1481);assert.equal(after.size,939);assert.equal(merged.length,319);
 const oldSplit=U.split([...before.values()].map(v=>v[0]),data),newSplit=U.split([...after.values()].map(v=>v[0]),data);
 assert.deepEqual([oldSplit.owned.length,oldSplit.notLicensed.length],[927,554]);assert.deepEqual([newSplit.owned.length,newSplit.notLicensed.length],[721,218]);
 for(const list of after.values())assert.equal(new Set(list.map(row=>U.licensed(row.rawName,row.rawVendor,data))).size,1);
 console.log('Merged 319 product groups, reducing the total by 542; owned 927 → 721, not licensed 554 → 218.');
});
test('old favourites and product actions remain readable and writes keep a canonical record',async()=>{
 const section=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
 const scan=P.normalizeRows([{vendor:'ikmultimedia',name:'Equalizer',format:'VST3'},{vendor:'IK Multimedia',name:'Equalizer',format:'AU'},{vendor:'uaudio',name:'Universal Audio: UAD API Preamp',format:'VST3'}]);
 let saved=JSON.stringify({'ikmultimedia|equalizer':{hidden:true,tags:['Mix'],treatAsLicensed:true},'ik multimedia|equalizer':{note:{text:'keep'}},'uaudio|universal audio uad api preamp':{tags:['UAD']}});
 const favorites=new Set(['inventory:ikmultimedia|equalizer']);
 const ctx={PublisherNames:P,INV_SCAN_ROWS:scan,invNorm:norm,STATE:{favorites},INV_SYNTHETIC_PREVIEW:false,INV_SYNTHETIC_FAVORITES:new Set(),UadLicence:{licensed:()=>true},UAD_LICENCE_DATA:null,localStorage:{getItem:()=>saved,setItem:(_k,v)=>saved=v},renderLibrary(){},saveState:async()=>true,invRenderInventory(){}};
 vm.runInNewContext(section('function invFavoriteKey(', 'const INV_DB_NAME =')+section('const INV_PRODUCT_ACTIONS_KEY=', 'function invProductUserMetaHTML(')+'globalThis.api={invIsFavorite,invToggleFavorite,invReadProductActions,invWriteProductActions};',ctx);
 assert.equal(ctx.api.invIsFavorite('Equalizer','IK Multimedia'),true);let actions=ctx.api.invReadProductActions();assert.equal(actions['ik multimedia|equalizer'].hidden,true);assert.deepEqual([...actions['ik multimedia|equalizer'].tags],['Mix']);assert.equal(actions['ik multimedia|equalizer'].note.text,'keep');assert.equal(actions['universal audio|uad api preamp'].tags[0],'UAD');
 delete actions['ik multimedia|equalizer'].hidden;assert.equal(ctx.api.invWriteProductActions(actions),true);assert.equal(ctx.api.invReadProductActions()['ik multimedia|equalizer'].hidden,undefined);assert.ok(JSON.parse(saved)['ikmultimedia|equalizer']);
 await ctx.api.invToggleFavorite('Equalizer','IK Multimedia');assert.equal(ctx.api.invIsFavorite('Equalizer','IK Multimedia'),false);await ctx.api.invToggleFavorite('Equalizer','IK Multimedia');assert.ok(favorites.has('inventory:ik multimedia|equalizer'));
});
