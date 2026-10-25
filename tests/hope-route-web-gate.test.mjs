import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const agentToolManifest = JSON.parse(await readFile(new URL('../elevenlabs-client-tools.json', import.meta.url), 'utf8'));
const decisionStart = html.indexOf('function hopeWebSearchRequested(');
const decisionEnd = html.indexOf('function hopeShowGarbledRepeat(', decisionStart);
assert.ok(decisionStart >= 0 && decisionEnd > decisionStart);
const decisionSource = `let HOPE_KB_STATE='unchecked';let HOPE_WEB_REQUESTED=false;let HOPE_KB_DECISION={question:'',usable:false,searched:false,results:[],garbled:false};\n${html.slice(decisionStart, decisionEnd)}`;

function context(extra = {}) {
  const ctx = vm.createContext({
    fetchCalls: [], toolCalls: [],
    fetch: async (...args) => { ctx.fetchCalls.push(args); return { ok:true, json:async()=>({answer:'stub'}) }; },
    handleToolCall: async (...args) => { ctx.toolCalls.push(args); return {}; },
    ...extra
  });
  vm.runInContext(decisionSource, ctx);
  vm.runInContext('hopeWebSearchBeginTurn("Search the web for mixing prices")', ctx);
  return ctx;
}

test('ElevenLabs manifest removes research and retains its guarded web fallback', () => {
  const names = agentToolManifest.map(tool => tool.name);
  assert.equal(names.includes('research'), false);
  assert.equal(names.includes('web_search_fallback'), true);
});

test('Deepgram/Luna refuses a web endpoint call before the KB search', async () => {
  const start = html.indexOf('function hopeUsageSelectTools(');
  const end = html.indexOf('function hopeUsageStatus(', start);
  const ctx = context({
    AICHAT_TOOL_DEFS:[{name:'search_yt_knowledge'},{name:'read_yt_knowledge'}],
    TOOL_DEFS:[], HOPE_USAGE_VOICE:{}, AIMM_PROXY_URL:'https://worker.test'
  });
  vm.runInContext(html.slice(start, end), ctx);
  const result = await vm.runInContext(`hopeUsageExecuteLunaCall({name:'web_search_fallback',arguments:'{"query":"prices"}'},{base:'https://worker.test',token:'stub'})`, ctx);
  assert.match(result.result.error, /Search the knowledge base first/);
  assert.equal(ctx.fetchCalls.length, 0);
});

test('ElevenLabs generic client tools and web fallback refuse before the KB search', async () => {
  const start = html.indexOf('    const clientTools = {};', html.indexOf('async function elStart('));
  const end = html.indexOf('    // Diagnostic: print exactly', start);
  assert.ok(start >= 0 && end > start, 'Agent client tool registration source is present');
  const ctx = context({
    TOOL_DEFS:[{name:'research'}], AIMM_PROXY_URL:'https://worker.test', HOPE_STT_TOKEN_STORAGE:'token',
    localStorage:{getItem:()=> 'stub'}
  });
  vm.runInContext(html.slice(start, end), ctx);
  const research = JSON.parse(await vm.runInContext(`clientTools.research({question:'prices'})`, ctx));
  const web = JSON.parse(await vm.runInContext(`clientTools.web_search_fallback({query:'prices'})`, ctx));
  assert.match(research.error, /Search the knowledge base first/);
  assert.match(web.error, /Search the knowledge base first/);
  assert.equal(ctx.toolCalls.length, 0);
  assert.equal(ctx.fetchCalls.length, 0);
});

test('ElevenLabs search and read client tools enter the shared KB decision and executor', async () => {
  const start = html.indexOf('    const clientTools = {};', html.indexOf('async function elStart('));
  const end = html.indexOf('    // Diagnostic: print exactly', start);
  const ctx = context({
    TOOL_DEFS:[{name:'search_yt_knowledge'},{name:'read_yt_knowledge'}],
    HOPE_KB_DECISION:{question:'How do I use this technique?',usable:false,searched:false,results:[],garbled:false},
    AIMM_PROXY_URL:'https://worker.test', localStorage:{getItem:()=> 'stub'}
  });
  const decisions = [];
  ctx.hopeKnowledgeDecision = (args) => {
    decisions.push(args);
    if (args.tool === 'search_yt_knowledge' || args.tool === 'read_yt_knowledge') {
      ctx.HOPE_KB_DECISION = { ...ctx.HOPE_KB_DECISION, searched:true, usable:false };
    }
    return { allow:true };
  };
  vm.runInContext(html.slice(start, end), ctx);
  await vm.runInContext(`clientTools.search_yt_knowledge({query:'technique'})`, ctx);
  await vm.runInContext(`clientTools.read_yt_knowledge({video_id:'video'})`, ctx);
  assert.deepEqual(decisions.map(call => [call.tool, call.route]), [
    ['search_yt_knowledge','agent'], ['read_yt_knowledge','agent']
  ]);
  assert.deepEqual(ctx.toolCalls.map(([name]) => name), ['search_yt_knowledge','read_yt_knowledge']);
});

test('typed chat omits server web search before KB search and does not enable it later in the tool loop', () => {
  const firstGate = html.match(/if \(\(useSearch\|\|HOPE_WEB_REQUESTED\)&&hopeKnowledgeDecision\(\{tool:'web_search_fallback',route:'typed'\}\)\.allow\) tools\.unshift\(\{type:'web_search_20250305', name:'web_search', max_uses:5\}\);/);
  const loopGate = html.match(/if\(\(useSearch\|\|HOPE_WEB_REQUESTED\)&&hopeKnowledgeDecision\(\{tool:'web_search_fallback',route:'typed'\}\)\.allow&&!tools\.some\(tool=>tool\.name==='web_search'\)\)/);
  assert.ok(firstGate, 'initial typed tool offer uses the shared decision');
  assert.ok(loopGate, 'typed tool loop uses the shared decision after client tools');
  const ctx = context({ useSearch:true, tools:[] });
  vm.runInContext(`${firstGate[0]}\n${loopGate[0]} tools.unshift({type:'web_search_20250305',name:'web_search',max_uses:5});`, ctx);
  assert.equal(ctx.tools.length, 0);
  assert.equal(vm.runInContext(`hopeKnowledgeDecision({tool:'web_search_fallback',route:'typed'}).allow`, ctx), false);
});

test('direct research function refuses before its Anthropic web-search request', async () => {
  const start = html.indexOf('async function research(question, contextHint){');
  const end = html.indexOf('\n}\n\n// ========== AI CHAT', start) + 2;
  assert.ok(start >= 0 && end > start, 'research function is present');
  const ctx = context({
    RT_ANT_KEY_STORAGE:'ant-key', localStorage:{getItem:()=> 'stub'},
    document:{getElementById(){throw new Error('must refuse before touching UI');}}
  });
  vm.runInContext(html.slice(start, end), ctx);
  const result = await vm.runInContext(`research('prices','')`, ctx);
  assert.match(result.error, /Search the knowledge base first/);
  assert.equal(ctx.fetchCalls.length, 0);
});

