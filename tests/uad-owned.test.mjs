import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import {pageTools,sourceText} from '../scripts/hope-tool-catalog.mjs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const require=createRequire(import.meta.url), licence=require('../standalone/assets/uad-licence.js'), publishers=require('../standalone/assets/publisher-names.js');
const data=JSON.parse(read('../standalone/assets/uad-licence.json'));
const scan=JSON.parse(read('../docs/handover-assets/inventory-scan.json'));
const groups=[...new Map(publishers.normalizeRows(scan.rows).filter(r=>licence.isUad(r.name,r.vendor)).map(r=>[r.vendor+'|'+r.name,{name:r.name,vendor:r.vendor,formats:new Set([r.format])}])).values()];
const html=read('../standalone/assets/index.html');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(read('../standalone/src/index.js')).toString('base64'))).default;
const norm=x=>String(x||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const initial=licence.split(groups,data), target=initial.notLicensed[0];
function pageContext(fetch){
 const context=vm.createContext({UadLicence:licence,PublisherNames:publishers,INV_SCAN_ROWS:groups,INV_SYNTHETIC_PREVIEW:false,invBuildGroups:x=>x,invNorm:norm,invReadProductActions:()=>({}),invActionKey:(v,n)=>norm(v)+'|'+norm(n),invRenderInventory:()=>{},localStorage:{setItem(){}},fetch,console,Date,Set});
 const start=html.indexOf('let UAD_LICENCE_DATA=null;'),end=html.indexOf('function invUadSplit',start);
 const actionStart=html.indexOf('function invGetProductActions('),actionEnd=html.indexOf('function invProductUserMetaHTML',actionStart);
 vm.runInContext(html.slice(start,end)+'\n'+html.slice(actionStart,actionEnd)+'\nUAD_LICENCE_DATA='+JSON.stringify(data)+';',context);
 return context;
}
test('central override adds and removes a real unlicensed scan product, keeping the 62 accounts',()=>{
 assert.ok(target);const key=norm(target.vendor)+'|'+norm(target.name);
 const override=g=>norm(g.vendor)+'|'+norm(g.name)===key;
 const added=licence.split(groups,data,override);assert.ok(added.owned.includes(target));assert.ok(!added.notLicensed.includes(target));
 assert.ok(licence.split(groups,data).notLicensed.includes(target));assert.equal(data.accounts.length,62);
 for(const g of initial.owned)assert.ok(added.owned.includes(g));
});
test('confirmation never writes and a failed write never marks owned',async()=>{
 let writes=0;const ctx=pageContext(async(url,opts)=>{if(opts?.method==='PUT'){writes++;return new Response('',{status:500})}return Response.json({owned:[]})});
 const args={name:target.name,owned:true,confirmed:false};
 assert.equal((await ctx.uadSetOwned(args)).needs_confirmation,true);assert.equal(writes,0);
 const result=await ctx.uadSetOwned({...args,confirmed:true});assert.equal(result.ok,false);assert.equal(writes,1);
 assert.equal(vm.runInContext('UAD_CENTRAL_OWNED.length',ctx),0);
});
test('verified save and undo re-read central storage',async()=>{
 let saved={owned:[]};const ctx=pageContext(async(url,opts)=>{if(opts?.method==='PUT'){saved=JSON.parse(opts.body);return Response.json({ok:true})}return Response.json(saved)});
 assert.equal((await ctx.uadSetOwned({name:target.name,owned:true,confirmed:true})).verified,true);
 assert.equal(vm.runInContext('UAD_CENTRAL_OWNED.length',ctx),1);
 assert.equal(ctx.invGetProductActions(target.vendor,target.name).treatAsLicensed,true);
 assert.equal(ctx.uadFind(target.name).matches[0].owned,true);
 assert.equal((await ctx.uadSetOwned({name:target.name,owned:false,confirmed:true})).verified,true);
 assert.equal(vm.runInContext('UAD_CENTRAL_OWNED.length',ctx),0);
 assert.equal(ctx.uadFind(target.name).matches[0].owned,false);
});
test('worker protects and validates the private list and blocks public bucket access',async()=>{
 let value;const env={MWTM:{get:async()=>value?{text:async()=>value}:null,put:async(k,v)=>{assert.equal(k,'config/uad-owned.json');value=v}},ASSETS:{fetch:()=>new Response('asset')}};
 const request=(path,opts={})=>worker.fetch(new Request('https://aimixmasters.com'+path,opts),env);
 assert.equal((await request('/api/uad-owned')).status,401);
 assert.equal((await request('/mwtm/f/config%2Fuad-owned.json')).status,404);
 const headers={'Cf-Access-Jwt-Assertion':'test','Content-Type':'application/json'};
 assert.equal((await request('/api/uad-owned',{method:'PUT',headers,body:'{}'})).status,400);
 assert.equal((await request('/api/uad-owned',{method:'PUT',headers,body:'x'.repeat(65537)})).status,413);
 assert.equal((await request('/api/uad-owned',{method:'PUT',headers:{...headers,Origin:'https://elsewhere.test'},body:'{}'})).status,403);
 const payload={owned:[{key:'universal audio|test',name:'Test',vendor:'Universal Audio',at:new Date().toISOString()}]};
 assert.equal((await request('/api/uad-owned',{method:'PUT',headers,body:JSON.stringify(payload)})).status,200);
 assert.deepEqual(await (await request('/api/uad-owned',{headers})).json(),payload);
});
test('both tools are registered with matching schemas',()=>{
 for(const name of ['uad_find','uad_set_owned']){
  const def=pageTools.find(t=>t.name===name);assert.ok(def);assert.ok(sourceText.includes("'"+name+"'"));assert.ok(sourceText.includes("case '"+name+"':"));
  for(const path of ['../standalone/assets/hope-tools-manifest.json','../elevenlabs-client-tools.json','../new-hope-tools.json'])assert.deepEqual(JSON.parse(read(path)).find(t=>t.name===name),def);
 }
});
