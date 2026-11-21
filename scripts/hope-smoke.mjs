import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFileSync,existsSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,extname} from 'node:path';
import {pageTools} from './hope-tool-catalog.mjs';
const root=resolve(new URL('../standalone/assets/',import.meta.url).pathname);
const repo=resolve(root,'../..');
const firstVideo=JSON.parse(readFileSync(join(repo,'docs/knowledge/index.json'),'utf8')).videos[0].video_id;
// Every read-only page tool has a safe invocation. Keep this table in sync with
// the page catalogue; missing names fail before a browser is started.
const tests={get_context:{},inventory_search:{query:''},inventory_summary:{},vocal_favorites_read:{section:'all'},inventory_status:{},inventory_duplicates:{},inventory_unused:{},snapshots_list:{},snapshots_read:{id:'missing-smoke-id'},plugin_tags_read:{},hidden_list:{},reference_status:{},saved_targets_list:{},settings_status:{},set_stem_selection:{action:'status'},list_symptoms:{},list_plugins:{},get_library:{},inspect_app:{query:'AIMM_BUILD'},read_doc:{name:'README.md',query:'AIMM'},search_yt_knowledge:{query:'mixing',n:1},read_yt_knowledge:{video_id:firstVideo},emit_notebooklm_prompt:{topic:'mixing'},manage_roadmap_inbox:{action:'list'},list_eq_tiles:{},list_knowledge_notes:{},list_symptom_tiles:{}};
const readOnlyNames=Object.keys(tests);
for(const name of readOnlyNames)if(!pageTools.some(t=>t.name===name))throw Error('Smoke invocation has no page tool: '+name);
const checklist=reason=>{
  console.error('Headless smoke unavailable: '+reason);
  console.error('Checklist: serve standalone/assets/index.html; open it in Chrome; for each tool below call handleToolCall(name, args) in DevTools and record a JSON result or explicit unavailable response. Do not supply credentials or change state.');
  for(const [name,args] of Object.entries(tests))console.error(JSON.stringify({name,args}));
};
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'};
const server=createServer((req,res)=>{try{const requested=decodeURIComponent(req.url.split('?')[0]);const asset=resolve(root,'.'+requested);const fallback=resolve(repo,'.'+requested);if(!asset.startsWith(root)||!fallback.startsWith(repo))throw Error('outside root');const path=existsSync(asset)?asset:fallback;const data=readFileSync(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(data);}catch(_){res.writeHead(404);res.end('Not found');}});
try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});}catch(error){checklist(error.message);process.exit(2);}
const dir=mkdtempSync(join(tmpdir(),'hope-smoke-'));
const chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if(!existsSync(chrome)){checklist('Google Chrome is not installed at '+chrome);server.close();process.exit(2);}
const child=spawn(chrome,['--headless=new','--no-first-run','--no-default-browser-check','--disable-gpu','--disable-background-networking','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});
let socket;
try{
  const portFile=join(dir,'DevToolsActivePort');for(let i=0;i<100&&!existsSync(portFile);i++)await new Promise(r=>setTimeout(r,100));
  if(!existsSync(portFile))throw Error('Chrome did not start its DevTools endpoint');
  const port=Number(readFileSync(portFile,'utf8').split('\n')[0]);
  const tabs=await (await fetch(`http://127.0.0.1:${port}/json/new?http://127.0.0.1:${server.address().port}/index.html`,{method:'PUT'})).json();
  socket=new WebSocket(tabs.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  let id=0;const pending=new Map();socket.addEventListener('message',event=>{const msg=JSON.parse(event.data);if(msg.id&&pending.has(msg.id)){pending.get(msg.id)(msg);pending.delete(msg.id);}});
  const send=(method,params={})=>new Promise(resolve=>{const next=++id;pending.set(next,resolve);socket.send(JSON.stringify({id:next,method,params}));});
  await send('Runtime.enable');
  let ready=false;for(let i=0;i<100;i++){const r=await send('Runtime.evaluate',{expression:'typeof handleToolCall === "function"',returnByValue:true});if(r.result?.result?.value===true){ready=true;break;}await new Promise(r=>setTimeout(r,100));}
  if(!ready)throw Error('Served page did not initialise handleToolCall');
  let failed=0;for(const [name,args] of Object.entries(tests)){
    const expression=`(async()=>{try{return await handleToolCall(${JSON.stringify(name)},${JSON.stringify(args)})}catch(error){return {smoke_error:String(error.message||error)}}})()`;
    const response=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    const value=response.result?.result?.value;
    const pass=!response.result?.exceptionDetails&&value!==undefined&&!value?.smoke_error&&!value?.error;
    if(!pass)failed++;
    console.log(JSON.stringify({tool:name,status:pass?'pass':'fail',result:pass?undefined:value,error:response.result?.exceptionDetails?.text}));
  }
  console.log(JSON.stringify({tested:Object.keys(tests).length,passed:Object.keys(tests).length-failed,failed}));
  if(failed)process.exitCode=1;
}catch(error){console.error('Smoke harness failed:',error.message);process.exitCode=1;}
finally{
  socket?.close();child.kill();server.close();
  if(child.exitCode===null)await new Promise(resolve=>child.once('exit',resolve));
  try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:100});}catch(error){console.error('Could not remove temporary Chrome profile:',error.message);}
}
