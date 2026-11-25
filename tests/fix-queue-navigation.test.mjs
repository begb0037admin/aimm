import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const start = html.indexOf('const MC_FIXQUEUE=(function(){');
const end = html.indexOf('window.MC_FIXQUEUE=MC_FIXQUEUE;', start);
assert.ok(start >= 0 && end > start, 'Fix Queue engine is present');
const engine = html.slice(start, end).replaceAll('items=build(r);', 'items=r&&r.__testItems?r.__testItems:build(r);');
const questionBuilder = html.slice(html.indexOf('function aimmBuildFixQueueQuestion('), html.indexOf('async function aichatSend('));
const normalize = html.slice(html.indexOf('function invNorm('), html.indexOf('function invEsc('));

function makeQueue(storage, options={}) {
  const host = {
    className: '', innerHTML: '',
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const events = [];
  const context = {
    document: { getElementById: id => id === 'mcActions' ? host : null },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    HOPE_USAGE_SYSTEM:'Hope system', HOPE_INVENTORY_RULES:'inventory',
    HOPE_COVERAGE_RULES:'coverage', HOPE_CHAIN_BUILD_RULES:'chain',
    buildContextSummary:()=>({genre_label:'Hip hop',platform_label:'Spotify'}),
    setTimeout:options.setTimeout||((fn)=>fn()),
    buildMixCheckContextBlock:()=> 'current mix context',
    allPlugins:()=>[{n:'Ozone 12 Maximizer'}],
    hopeUsageReadLunaStream:async()=>({text:options.answer||'**Try a gentle cut.** Then listen again.',terminal:'response.completed'}),
    aichatStripMd:text=>text.replaceAll('**',''),
    fetch:options.fetch||(()=>{throw Error('offline')}),
    TextDecoder,
    window: { dispatchEvent: event => events.push(event), MC_FIXMOVES:options.moves },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    escapeHtml: value => String(value),
  };
  vm.runInNewContext(`${questionBuilder}\n${normalize}\n${engine}\nglobalThis.queue=MC_FIXQUEUE;`, context);
  return { queue: context.queue, host, events, question:context.aimmBuildFixQueueQuestion };
}

test('selected fix gets an explain-only engineer note without a browser token and caches it per revision', async () => {
  const storage=new Map(), requests=[];
  const fetch=async (url,init)=>{requests.push({url,body:JSON.parse(init.body)});return {ok:true,body:{getReader:()=>({})}};};
  const measured={...fixtures[0],why:'Integrated loudness measures -19.9 LUFS, 5.9 dB below the -14 LUFS reference.',
    move:'Start with Ozone 12 Maximizer at a -1 dBTP ceiling. Do not substitute Unknown Limiter.'};
  const analysis={__testItems:[measured,fixtures[1]],li:-19.9,tp:-1.8};
  storage.set('aimmMcFixHope_v1',JSON.stringify({sig:'mix-hope',rev:1,answers:{
    '#01':{fingerprint:measured.title+'\n'+measured.why,text:'Hey Kev, old cached answer.'},
  }}));
  const {queue,host}=makeQueue(storage,{fetch});
  queue.derive(analysis,null,'mix-hope');
  assert.match(host.innerHTML,/>AIMM Coach<\/span>/);
  assert.match(host.innerHTML,/Preparing engineering note…/);
  assert.doesNotMatch(host.innerHTML,/Hey Kev/);
  assert.doesNotMatch(host.innerHTML,/data-act="hope"|Ask Hope about this|#i-mic/);
  assert.equal(requests.length,1);
  assert.equal(requests[0].url,'/api/hope-explain');
  assert.deepEqual(requests[0].body.tools,[]);
  assert.ok(JSON.stringify(requests[0].body).length<30000);
  const [system,details]=requests[0].body.input;
  assert.match(system.content,/^ENGINEER NOTE\n/);
  assert.match(system.content,/3–5 plain, declarative sentences in one paragraph/);
  assert.match(system.content,/Omit greetings, first-person commentary, questions, jokes, and Markdown/);
  assert.match(system.content,/Do not search, call tools, make changes, or mark the fix done/);
  assert.doesNotMatch(system.content,/Hope system|inventory|coverage|chain|current mix context|Unknown Limiter/);
  const context=JSON.parse(system.content.split('\n\nContext: ')[1]);
  assert.deepEqual(context,{genre:'Hip hop',platform:'Spotify',integratedLufs:-19.9,truePeakDbtp:-1.8,confirmedPlugins:['Ozone 12 Maximizer']});
  assert.equal(details.content,`Selected Fix Queue item: #01 ${measured.title}\nMeasurement: ${measured.why}\nGrounded move: ${measured.move}`);
  await new Promise(setImmediate);
  assert.match(host.innerHTML,/Try a gentle cut. Then listen again/);
  assert.doesNotMatch(host.innerHTML,/\*\*/);
  queue.select('#02');
  assert.equal(requests.length,2);
  await new Promise(setImmediate);
  queue.select('#01');
  assert.equal(requests.length,2);
  const reloaded=makeQueue(storage,{fetch}).queue;
  reloaded.derive(analysis,null,'mix-hope');
  assert.equal(requests.length,2);
  reloaded.recompute(analysis);
  assert.equal(requests.length,3);
});

test('a failed note shows the error and retries on next open', async () => {
  let calls=0;
  const fetch=async()=>{calls++;if(calls<=2)throw Error('offline');return {ok:true,body:{getReader:()=>({})}};};
  const {queue,host}=makeQueue(new Map(),{fetch,answer:'The measured deviation warrants an audition.'});
  queue.derive({__testItems:fixtures},null,'mix-retry');
  await new Promise(setImmediate);
  assert.match(host.innerHTML,/>AIMM Coach<\/span>/);
  assert.doesNotMatch(host.innerHTML,/Move #01/);
  assert.match(host.innerHTML,/AIMM Coach could not connect/);
  assert.match(host.innerHTML,/Try again/);
  assert.equal(calls,2);
  queue.select('#01');
  await new Promise(setImmediate);
  assert.equal(calls,3);
  assert.match(host.innerHTML,/The measured deviation warrants an audition/);
});

test('explanation route failures show specific reasons', async () => {
  const cases=[
    [401,'',/sign in again/],
    [503,'no_internal_auth',/note is not available right now/],
    [413,'luna_request_too_large',/request was too large/],
    [429,'rate_limited',/receiving too many requests/],
    [502,'luna_request_failed',/request failed \(HTTP 502\)/],
  ];
  for(const [status,code,reason] of cases){
    let calls=0;
    const fetch=async()=>{calls++;return {ok:false,status,json:async()=>({code,error:'worker detail'})};};
    const {queue,host}=makeQueue(new Map(),{fetch});
    queue.derive({__testItems:fixtures},null,'failure-'+code);
    await new Promise(setImmediate);
    assert.match(host.innerHTML,reason,code);
    assert.match(host.innerHTML,/Try again/,code);
    assert.equal(calls,status===429||status>=500?2:1,code);
  }
});

test('even a verbose selected fix stays below the client request cap', async () => {
  const requests=[];
  const fetch=async (_url,init)=>{requests.push(JSON.parse(init.body));return {ok:true,body:{getReader:()=>({})}};};
  const huge={...fixtures[0],title:'Title '.repeat(3000),why:'Measurement '.repeat(3000),move:'Grounded move '.repeat(3000)};
  const {queue}=makeQueue(new Map(),{fetch});
  queue.derive({__testItems:[huge]},null,'verbose-fix');
  await new Promise(setImmediate);
  assert.equal(requests.length,1);
  assert.ok(JSON.stringify(requests[0]).length<30000);
});

test('a grounded move arriving during generation refreshes the selected note', async () => {
  const requests=[];
  let finishFirstRequest;
  const response={ok:true,body:{getReader:()=>({})}};
  const fetch=async (_url,init)=>{
    requests.push(JSON.parse(init.body));
    if(requests.length===1)return new Promise(resolve=>{finishFirstRequest=resolve;});
    return response;
  };
  const moves={};
  const {queue,host,question}=makeQueue(new Map(),{fetch,moves:{map:()=>moves}});
  const pending={...fixtures[0],move:'Analysing — pulling the specific move from the reference library…'};
  queue.derive({__testItems:[pending]},null,'mix-grounded');
  assert.match(requests[0].input[1].content,/Grounded move: Unavailable/);
  assert.match(question({item:pending,ordinal:1,sourceLabel:'Bass'}),/Is this worth correcting on that track\?/);
  moves['#01']='Use Ozone 12 Maximizer.';
  queue.render();
  assert.equal(requests.length,1);
  finishFirstRequest(response);
  await new Promise(setImmediate);
  assert.equal(requests.length,2);
  assert.match(requests[1].input[1].content,/Grounded move: Use Ozone 12 Maximizer/);
  assert.match(host.innerHTML,/Try a gentle cut. Then listen again/);
});

const fixtures = ['#01', '#02'].map(id => ({
  id, key: id, title: `Fix ${id}`, why: `Measured ${id}`, move: `Move ${id}`,
  focusBand: 'broadband', freqRange: { loHz: 20, hiHz: 20000 },
  impact: 'high', confidence: 'high', playFromSec: null,
}));

test('completed fixes remain navigable, undoable, and persist per mix', () => {
  const storage = new Map();
  const { queue, host, events } = makeQueue(storage);
  queue.derive({ __testItems: fixtures }, null, 'mix-a');
  assert.equal(queue.selected().id, '#01');
  assert.equal(queue.current().id, '#01');
  queue.markApplied('#01');
  assert.equal(queue.selected().id, '#02');
  assert.equal(queue.appliedCount(), 1);
  queue.markApplied('#02');
  assert.equal(queue.appliedCount(), 2);
  assert.equal(queue.current(), null);
  assert.equal(queue.selected().id, '#02');
  assert.match(host.innerHTML, /aria-label="Undo done — Fix #01"/);
  assert.match(host.innerHTML, /mcq-item/);
  assert.doesNotMatch(host.innerHTML, /Previous|Next →|Hide items/);
  assert.equal(queue.previous(), true);
  assert.equal(queue.selected().id, '#01');
  assert.equal(queue.status('#01'), 'done');
  assert.equal(events.at(-1).detail.reason, 'selected');
  queue.unmarkApplied('#01');
  assert.equal(queue.status('#01'), 'pending');
  assert.equal(queue.appliedCount(), 1);
  queue.select('#02');

  const reloaded = makeQueue(storage).queue;
  reloaded.derive({ __testItems: fixtures }, null, 'mix-a');
  assert.equal(reloaded.selected().id, '#02');
  assert.equal(reloaded.status('#02'), 'done');
  assert.equal(reloaded.appliedCount(), 1);
  reloaded.derive({ __testItems: fixtures }, null, 'mix-b');
  assert.equal(reloaded.selected().id, '#01');
  assert.equal(reloaded.appliedCount(), 0);
  assert.equal(reloaded.status('#02'), 'pending');
});

test('most recently completed fix follows marking order across reloads and undo', () => {
  const storage = new Map();
  const {queue} = makeQueue(storage);
  queue.derive({__testItems: fixtures}, null, 'mix-c');
  assert.equal(queue.mostRecentlyApplied(), null);
  queue.markApplied('#02');
  queue.markApplied('#01');
  assert.equal(queue.mostRecentlyApplied().id, '#01');
  const reloaded = makeQueue(storage).queue;
  reloaded.derive({__testItems: fixtures}, null, 'mix-c');
  assert.equal(reloaded.mostRecentlyApplied().id, '#01');
  reloaded.unmarkApplied('#01');
  assert.equal(reloaded.mostRecentlyApplied().id, '#02');
});
