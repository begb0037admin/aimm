import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const workerSource=await readFile(new URL('../worker/src/index.js',import.meta.url),'utf8');
const worker=(await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`)).default;
const html=await readFile(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const origin='https://aimixmasters.com';
const request=(path,method='GET',requestOrigin=origin)=>new Request('https://worker.test'+path,{method,headers:{Origin:requestOrigin}});

test('backup subscription route accepts only GET on its exact path and injects only the backup key',async()=>{
  const oldFetch=globalThis.fetch;
  const calls=[];
  try{
    globalThis.fetch=async (url,options)=>{
      calls.push({url,options});
      return new Response(JSON.stringify({tier:'creator',character_count:12,character_limit:100}),{headers:{'Content-Type':'application/json'}});
    };
    const env={ELEVENLABS_API_KEY_BACKUP:'private-backup-key'};
    const path='/elevenlabs-backup/v1/user/subscription';
    const ok=await worker.fetch(request(path),env);
    assert.equal(ok.status,200);
    assert.equal(ok.headers.get('Access-Control-Allow-Origin'),origin);
    assert.equal(calls[0].url,'https://api.elevenlabs.io/v1/user/subscription');
    assert.equal(calls[0].options.method,'GET');
    assert.equal(calls[0].options.headers.get('xi-api-key'),'private-backup-key');
    assert.doesNotMatch(await ok.text(),/private-backup-key/);
    for(const method of ['POST','HEAD','OPTIONS']){
      assert.equal((await worker.fetch(request(path,method),env)).status,405);
    }
    assert.equal((await worker.fetch(request(path+'/extra'),env)).status,404);
    assert.equal((await worker.fetch(request('/elevenlabs-backup/v1/user'),env)).status,404);
    assert.equal((await worker.fetch(request(path,'GET','https://untrusted.test'),env)).status,403);
    assert.equal(calls.length,1);
    const missing=await worker.fetch(request(path),{});
    assert.equal(missing.status,503);
    assert.deepEqual(await missing.json(),{error:'Backup account is not connected yet',code:'no_backup_key'});
  }finally{globalThis.fetch=oldFetch;}
});

test('cost page chooses the Worker subscription URL for each account',()=>{
  const start=html.indexOf('function elSubscriptionUrl(account){');
  const end=html.indexOf('function elSelectCostAccount(account){',start);
  assert.ok(start>=0&&end>start);
  const context=vm.createContext({AIMM_PROXY_URL:'https://worker.test/'});
  vm.runInContext(html.slice(start,end),context);
  const url=vm.runInContext('elSubscriptionUrl',context);
  assert.equal(url('primary'),'https://worker.test/elevenlabs/v1/user/subscription');
  assert.equal(url('backup'),'https://worker.test/elevenlabs-backup/v1/user/subscription');
});

test('ElevenLabs account action opens settings in a new tab',()=>{
  const actions=html.match(/<div class="actions">\s*(<button[^>]+>[\s\S]*?<\/button>\s*){3}<\/div>/g)
    ?.find(block=>block.includes('id="elAccountLink"'));
  assert.ok(actions);
  assert.ok(actions.indexOf('id="elTopup"')<actions.indexOf('id="elAccountLink"'));
  assert.ok(actions.indexOf('id="elAccountLink"')<actions.indexOf('id="elUpdate"'));
  assert.match(actions,/id="elAccountLink" title="Open your ElevenLabs account settings in a new tab">Account <svg[^>]*><use href="#i-external"\/><\/svg><\/button>/);

  const start=html.indexOf("const elAccountLink=document.getElementById('elAccountLink');");
  const end=html.indexOf("const elUpdate=document.getElementById('elUpdate');",start);
  assert.ok(start>=0&&end>start);
  const accountButton={};
  const calls=[];
  const context=vm.createContext({
    document:{getElementById:id=>id==='elAccountLink'?accountButton:null},
    window:{open:(...args)=>calls.push(args)}
  });
  vm.runInContext(html.slice(start,end),context);
  accountButton.onclick();
  assert.deepEqual(calls,[['https://elevenlabs.io/app/settings','_blank','noopener']]);
});
