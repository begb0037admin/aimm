import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const defsStart=html.indexOf('const TOOL_DEFS=');
const defsEnd=html.indexOf('\n];',defsStart)+3;
const defs=vm.runInNewContext(html.slice(defsStart,defsEnd)+'\nTOOL_DEFS');
const helperStart=html.indexOf('const LUNA_MAX_TOOLS =');
const helperEnd=html.indexOf('function hopeUsageLunaSearchFee',helperStart);
const errors=[];
const context=vm.createContext({AICHAT_TOOL_DEFS:defs.map(t=>({name:t.name,description:t.description,input_schema:t.parameters})),console:{error:message=>errors.push(message)}});
vm.runInContext(html.slice(helperStart,helperEnd),context);
const tools=vm.runInContext("hopeUsageLimitLunaTools(hopeUsageSelectTools('')).map(t=>({type:'function',name:t.name,description:t.description,parameters:t.input_schema,strict:false}))",context);
const block=name=>html.match(new RegExp('const '+name+' = `([^`]+)`;'))[1];
const names=['HOPE_USAGE_SYSTEM','HOPE_INVENTORY_RULES','HOPE_COVERAGE_RULES','HOPE_CHAIN_BUILD_RULES','HOPE_LIBRARY_RULES','HOPE_FIX_QUEUE_RULES'];
const contextText='\n\n=== COMPACT LIVE AIMM STATE ===\n'+JSON.stringify({genre:'hiphop',genre_label:'Hip Hop',platform:'spotify',platform_label:'Spotify',chain:{vocal:['FabFilter Pro-Q 3','1176'],master:['Limiter']},meters:{lufs:-14,true_peak:-1},flagged_symptoms:['Low-end buildup'],plugins_inventory:{total:350},active_tab:'mixcheck'})+'\nUse get_context when Kev asks about detailed measurements, stem selection, playback or Fix Queue. Use plugin lookup tools before recommending or applying a plugin.';
const history=[{role:'user',content:'Can you check the low end of my mix?'},{role:'assistant',content:'The low end needs a closer look. Shall I check the Fix Queue?'},{role:'user',content:'Yes, please check the first item.'},{role:'assistant',content:'The first item suggests a gentle EQ cut. Would you like me to apply it?'},{role:'user',content:'Yes, apply it.'}];
const request={input:[{role:'system',content:names.map(block).join('\n\n')+contextText},...history],max_output_tokens:1000,tools};

test('every catalogue tool except research reaches the Luna request',()=>{
 const expected=defs.filter(t=>t.name!=='research').map(t=>t.name);
 assert.deepEqual(Array.from(tools,t=>t.name),[...expected,'web_search_fallback']);
 for(const name of ['skip_fix','unmark_fix_applied','mark_fix_applied','add_plugin_to_bus','set_plugin_settings','open_library_channel','show_library_picks','add_videos_to_library'])assert.ok(tools.some(t=>t.name===name),name);
});
test('over-limit catalogue logs an error and retains priority tools',()=>{
 errors.length=0;
 const selected=context.hopeUsageLimitLunaTools([...Array.from({length:129},(_,i)=>({name:'extra_'+i})),{name:'skip_fix'},{name:'web_search_fallback'}]);
 assert.equal(selected.length,128); assert.ok(selected.some(t=>t.name==='skip_fix')); assert.ok(selected.some(t=>t.name==='web_search_fallback')); assert.match(errors[0],/tool limit exceeded/i);
});
test('realistic full request passes site and proxy and forwards all tools',async()=>{
 const siteSource=readFileSync(new URL('../standalone/src/index.js',import.meta.url),'utf8');
 const proxySource=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
 const site=(await import('data:text/javascript;base64,'+Buffer.from(siteSource).toString('base64'))).default;
 const proxy=(await import('data:text/javascript;base64,'+Buffer.from(proxySource).toString('base64'))).default;
 const env={HOPE_INTERNAL_TOKEN:'secret',OPENAI_API_KEY:'key',HOPE_STT_LIMIT:{limit:async()=>({success:true})}};
 const original=globalThis.fetch;let forwarded;
 try{
  globalThis.fetch=async (url,options)=>{
   if(String(url).includes('openai.com')){forwarded=JSON.parse(options.body);return new Response('data: done\n\n');}
   return proxy.fetch(new Request(url,options),env);
  };
  const response=await site.fetch(new Request('https://aimixmasters.com/api/hope/luna',{method:'POST',headers:{'Content-Type':'application/json','Cf-Access-Jwt-Assertion':'valid'},body:JSON.stringify(request)}),env);
  assert.equal(response.status,200);assert.equal(forwarded.tools.length,79);assert.deepEqual(forwarded.tools.map(t=>t.name),Array.from(tools,t=>t.name));
 }finally{globalThis.fetch=original;}
});
test('voice and chat share Luna rules and have room for tool arguments',()=>{
 const start=html.indexOf('async function hopeUsageSendLunaTurn('),end=html.indexOf('function hopeChatRequestFailure',start),source=html.slice(start,end);
 for(const name of names)assert.ok(source.includes(name),name);
 assert.match(source,/max_output_tokens:options\.source==='chat'\|\|tools\.length\?1000:220/);
 assert.match(html,/aichatSend\(\{voiceUsage:true,speakReply:true,source:'voice'/);
 const arguments10=JSON.stringify({video_ids:Array.from({length:10},(_,i)=>`abcdefghij${i}`),confirmed:true});
 assert.ok(arguments10.length/4<1000);
});
const oldTools=[...tools.slice(0,39),tools.at(-1)];
const oldRequest={...request,input:[{role:'system',content:names.slice(0,-1).map(block).join('\n\n')+contextText},...history],max_output_tokens:220,tools:oldTools};
console.log('Luna representative request sizes:',JSON.stringify({beforeBytes:Buffer.byteLength(JSON.stringify(oldRequest)),afterBytes:Buffer.byteLength(JSON.stringify(request)),beforeChars:JSON.stringify(oldRequest).length,afterChars:JSON.stringify(request).length,previouslyCut:tools.slice(39,-1).map(t=>t.name)}));
