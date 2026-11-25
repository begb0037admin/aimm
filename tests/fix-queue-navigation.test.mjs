import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const start = html.indexOf('const MC_FIXQUEUE=(function(){');
const end = html.indexOf('window.MC_FIXQUEUE=MC_FIXQUEUE;', start);
assert.ok(start >= 0 && end > start, 'Fix Queue engine is present');
const engine = html.slice(start, end).replaceAll('items=build(r);', 'items=r&&r.__testItems?r.__testItems:build(r);');

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
      getItem: key => key==='token' && options.token ? 'test-token' : storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    HOPE_STT_TOKEN_STORAGE:'token', AIMM_PROXY_URL:'/proxy',
    HOPE_USAGE_SYSTEM:'Hope system', HOPE_INVENTORY_RULES:'inventory',
    HOPE_COVERAGE_RULES:'coverage', HOPE_CHAIN_BUILD_RULES:'chain',
    buildContextSummary:()=>({genre_label:'Hip hop',platform_label:'Spotify'}),
    setTimeout:options.setTimeout||((fn)=>fn()),
    buildMixCheckContextBlock:()=> 'current mix context',
    aimmBuildFixQueueQuestion:({item,ordinal})=>`Fix #${ordinal}: ${item.why}. ${item.move}. Please explain only; do not change anything or mark the fix done.`,
    hopeUsageReadLunaStream:async()=>({text:options.answer||'**Try a gentle cut.** Then listen again.',terminal:'response.completed'}),
    aichatStripMd:text=>text.replaceAll('**',''),
    fetch:options.fetch||(()=>{throw Error('offline')}),
    TextDecoder,
    window: { dispatchEvent: event => events.push(event) },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    escapeHtml: value => String(value),
  };
  vm.runInNewContext(`${engine}\nglobalThis.queue=MC_FIXQUEUE;`, context);
  return { queue: context.queue, host, events };
}

test('selected fix gets one Hope explanation, persisted per revision; detail has no mic', async () => {
  const storage=new Map(), requests=[];
  const fetch=async (url,init)=>{requests.push({url,body:JSON.parse(init.body)});return {ok:true,body:{getReader:()=>({})}};};
  const {queue,host}=makeQueue(storage,{token:true,fetch});
  queue.derive({__testItems:fixtures},null,'mix-hope');
  assert.match(host.innerHTML,/AIMM Coach on this fix/);
  assert.match(host.innerHTML,/Hope is reading this fix…/);
  assert.doesNotMatch(host.innerHTML,/data-act="hope"|Ask Hope about this|#i-mic/);
  assert.equal(requests.length,1);
  assert.equal(requests[0].url,'/proxy/hope/luna');
  assert.deepEqual(requests[0].body.tools,[]);
  assert.ok(JSON.stringify(requests[0].body).length<30000);
  assert.doesNotMatch(requests[0].body.input[0].content,/inventory|coverage|chain|current mix context/);
  assert.match(requests[0].body.input[0].content,/Hip hop|Spotify/);
  assert.match(requests[0].body.input[1].content,/Please explain only; do not change anything or mark the fix done/);
  await new Promise(setImmediate);
  assert.match(host.innerHTML,/Try a gentle cut. Then listen again/);
  assert.doesNotMatch(host.innerHTML,/\*\*/);
  queue.select('#02');
  assert.equal(requests.length,2);
  await new Promise(setImmediate);
  queue.select('#01');
  assert.equal(requests.length,2);
  const reloaded=makeQueue(storage,{token:true,fetch}).queue;
  reloaded.derive({__testItems:fixtures},null,'mix-hope');
  assert.equal(requests.length,2);
  reloaded.recompute({__testItems:fixtures});
  assert.equal(requests.length,3);
});

test('failed explanation shows the grounded move and retries on next open', async () => {
  let calls=0;
  const fetch=async()=>{calls++;if(calls<=2)throw Error('offline');return {ok:true,body:{getReader:()=>({})}};};
  const {queue,host}=makeQueue(new Map(),{token:true,fetch,answer:'Hope’s own explanation.'});
  queue.derive({__testItems:fixtures},null,'mix-retry');
  await new Promise(setImmediate);
  assert.match(host.innerHTML,/AIMM Coach on this fix/);
  assert.match(host.innerHTML,/Move #01/);
  assert.match(host.innerHTML,/Hope could not connect/);
  assert.match(host.innerHTML,/Try again/);
  assert.equal(calls,2);
  queue.select('#01');
  await new Promise(setImmediate);
  assert.equal(calls,3);
  assert.match(host.innerHTML,/Hope’s own explanation/);
});

test('worker failure codes and missing browser token show specific reasons', async () => {
  const cases=[
    [401,'invalid_stt_auth',/speech token is invalid/],
    [503,'no_stt_auth',/speech access is not configured/],
    [413,'luna_request_too_large',/request was too large/],
    [429,'rate_limited',/being used too quickly/],
    [502,'luna_request_failed',/AI request failed \(HTTP 502\)/],
  ];
  for(const [status,code,reason] of cases){
    let calls=0;
    const fetch=async()=>{calls++;return {ok:false,status,json:async()=>({code,error:'worker detail'})};};
    const {queue,host}=makeQueue(new Map(),{token:true,fetch});
    queue.derive({__testItems:fixtures},null,'failure-'+code);
    await new Promise(setImmediate);
    assert.match(host.innerHTML,reason,code);
    assert.match(host.innerHTML,/Try again/,code);
    assert.equal(calls,status===429||status>=500?2:1,code);
  }
  const {queue,host}=makeQueue(new Map());
  queue.derive({__testItems:fixtures},null,'missing-token');
  await new Promise(setImmediate);
  assert.match(host.innerHTML,/not saved in this browser/);
});

test('even a verbose selected fix stays below the client request cap', async () => {
  const requests=[];
  const fetch=async (_url,init)=>{requests.push(JSON.parse(init.body));return {ok:true,body:{getReader:()=>({})}};};
  const huge={...fixtures[0],title:'Title '.repeat(3000),why:'Measurement '.repeat(3000),move:'Grounded move '.repeat(3000)};
  const {queue}=makeQueue(new Map(),{token:true,fetch});
  queue.derive({__testItems:[huge]},null,'verbose-fix');
  await new Promise(setImmediate);
  assert.equal(requests.length,1);
  assert.ok(JSON.stringify(requests[0]).length<30000);
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
