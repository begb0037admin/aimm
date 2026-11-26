import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const workerSource = await readFile(new URL('../worker/src/index.js', import.meta.url), 'utf8');
const worker = (await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`)).default;
const route = '/api/hope/ai';
const env = {HOPE_STT_TOKEN:'valid-token',OPENAI_API_KEY:'server-key',HOPE_STT_LIMIT:{limit:async()=>({success:true})}};
function request(token, body={system:'Follow instructions',user:'Summarise this',max_output_tokens:3000}){
  return new Request('https://worker.test/hope/ai',{method:'POST',headers:{Origin:'https://aimixmasters.com','Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});
}
test('Worker /hope/ai requires the Hope token and sends a bounded Luna Responses request', async () => {
  assert.equal((await worker.fetch(request(),env)).status,401);
  assert.equal((await worker.fetch(request('wrong'),env)).status,401);
  const original = globalThis.fetch;
  let upstream;
  try{
    globalThis.fetch = async (url, options) => {upstream={url,options};return new Response(JSON.stringify({output:[{type:'message',content:[{type:'output_text',text:'Luna reply'}]}],usage:{input_tokens:5,output_tokens:3}}),{headers:{'Content-Type':'application/json'}});};
    const response=await worker.fetch(request('valid-token'),env);
    assert.equal(response.status,200);
    assert.deepEqual(await response.json(),{text:'Luna reply',usage:{input_tokens:5,output_tokens:3},sources:[]});
    assert.equal(upstream.url,'https://api.openai.com/v1/responses');
    const body=JSON.parse(upstream.options.body);
    assert.equal(body.model,'gpt-6-luna');
    assert.deepEqual(body.reasoning,{effort:'low'});
    assert.equal(body.store,false);
    assert.equal(body.stream,false);
    assert.equal(body.max_output_tokens,2000);
    assert.equal(body.input,'Summarise this');
  }finally{globalThis.fetch=original;}
});

test('Worker web search uses Luna web_search and preserves the caller response shape', async () => {
  const original=globalThis.fetch;
  let payload;
  try{
    globalThis.fetch=async (_url,options)=>{
      payload=JSON.parse(options.body);
      return new Response(JSON.stringify({output:[
        {type:'web_search_call',action:{type:'search',queries:['current facts']}},
        {type:'message',content:[{type:'output_text',text:'A sourced answer',annotations:[{type:'url_citation',url:'https://example.com/source',title:'Source'}]}]}
      ]}),{headers:{'Content-Type':'application/json'}});
    };
    const response=await worker.fetch(new Request('https://worker.test/hope/web-search',{method:'POST',headers:{Origin:'https://aimixmasters.com',Authorization:'Bearer valid-token','Content-Type':'application/json'},body:JSON.stringify({query:'Current facts?'})}),env);
    assert.equal(response.status,200);
    assert.deepEqual(await response.json(),{answer:'A sourced answer',sources:['https://example.com/source'],web_search_requests:1});
    assert.equal(payload.model,'gpt-6-luna');
    assert.deepEqual(payload.tools,[{type:'web_search'}]);
    assert.equal(payload.tool_choice,'required');
  }finally{globalThis.fetch=original;}
});

function slice(start,end){const a=html.indexOf(start),b=html.indexOf(end,a+start.length);assert.ok(a>=0&&b>a,`${start} found`);return html.slice(a,b);}
const helper = slice('async function aimmAiText(', 'const RT_PREFS_STORAGE=');
const factGuard = slice('function isMeaningfulFactText(', 'function categorizeFactText(');
const featureSources = {
  extractProfile:slice('async function extractProfile(', '// Orchestrator: at end'),
  autoFillChainSettings:slice('async function autoFillChainSettings()', 'function showFillSummary'),
  rerankTopPicksWithClaude:slice('async function rerankTopPicksWithClaude()', 'function resetTopPicks()'),
  kbCallHaikuSummary:slice('async function kbCallHaikuSummary(', 'function kbExport()'),
  kbExtractMetadata:slice('async function kbExtractMetadata(', '// ----- The orchestrator:'),
  parseImportWithClaude:slice('async function parseImportWithClaude()', 'function renderImportPreview()'),
  research:slice('async function research(question, contextHint)', '// ========== AI CHAT')
};
function featureContext(source, reply, overrides={}){
  const calls=[];
  const elements={autoFillBtn:{textContent:'Auto-fill',disabled:false},revertFillBtn:{style:{}},reviewStarsBtn:{textContent:'Re-rank',disabled:false},importPaste:{value:'FabFilter Pro-Q 3'},importParseBtn:{disabled:false},importCommitBtn:{disabled:false}};
  const context=vm.createContext({
    localStorage:{getItem:()=>null},
    fetch:async (url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({text:reply,usage:{input_tokens:10,output_tokens:5}})};},
    document:{getElementById:id=>elements[id]||{value:'',style:{},disabled:false}},
    BUSES:[{id:'master',label:'Master'}],STATE:{chain:{master:[{n:'Pro-Q 3',notes:''}]},topPicksOverride:null,genre:'trap'},
    STAGES:[{id:'eq-clean',label:'EQ'}],TOP_PICKS:{trap:['Pro-Q 3']},IMPORT:{busy:false,image:null,parsed:[]},
    allPlugins:()=>[{n:'Pro-Q 3',s:'eq-clean'}],genreLabel:()=> 'Trap',
    snapshotChainFill(){},buildAutoFillPrompt:()=>({chain:{master:[]}}),showFillSummary(){},saveState(){},renderChain(){},renderLibrary(){},
    renderImportPreview(){},importStatus(){},buildImportSystemPrompt:()=> 'Parse plugins',resolvePubKey:()=> 'other',
    hopeKnowledgeDecision:()=>({allow:true}),RESEARCH_SYSTEM:'Research current facts',
    PROFILE_CATEGORIES:[{id:'misc'}],categorizeFactText:()=> 'misc',
    toast(){},confirm:()=>true,console,
    ...overrides
  });
  vm.runInContext(helper+'\n'+factGuard+'\n'+source,context);
  return {context,calls};
}
for(const [name, source] of Object.entries(featureSources)){
  test(`${name} uses the same-origin Hope AI route without a browser token`,async()=>{
    const replies={extractProfile:'[]',autoFillChainSettings:'{"buses":{}}',rerankTopPicksWithClaude:'{"trap":["Pro-Q 3"],"hiphop":[],"rnb":[],"pop":[],"afrobeats":[],"lofi":[]}',kbCallHaikuSummary:'Short useful summary',kbExtractMetadata:'{"title":"Title","source":"","tags":[],"summary":"Summary"}',parseImportWithClaude:'{"plugins":[]}',research:'Research answer https://example.com'};
    const {context,calls}=featureContext(source,replies[name]);
    const args={extractProfile:['Transcript text',[]],autoFillChainSettings:[],rerankTopPicksWithClaude:[],kbCallHaikuSummary:['Raw research'],kbExtractMetadata:['Raw research','note.txt'],parseImportWithClaude:[],research:['Question','Context']}[name];
    await vm.runInContext(`${name}(...${JSON.stringify(args)})`,context);
    assert.equal(calls.length,1,`${name} made one request`);
    assert.equal(calls[0].url,route);
    assert.equal(new Headers(calls[0].options.headers).has('Authorization'),false);
    const body=JSON.parse(calls[0].options.body);
    assert.equal(typeof body.system,'string');
    assert.ok(typeof body.user==='string'||Array.isArray(body.user));
    assert.ok(body.max_output_tokens>0&&body.max_output_tokens<=2000);
    if(name==='rerankTopPicksWithClaude'||name==='research')assert.equal(body.web_search,true);
  });
}
