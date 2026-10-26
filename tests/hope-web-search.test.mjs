import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const helperStart = html.indexOf('function hopeUsageSelectTools(');
const helperEnd = html.indexOf('function hopeUsageStatus(', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'Luna tool helpers are present');
const helperSource = html.slice(helperStart, helperEnd);
const lunaTurnStart = html.indexOf('async function hopeUsageSendLunaTurn(');
const lunaTurnEnd = html.indexOf('function aimmBuildFixQueueQuestion(', lunaTurnStart);
assert.ok(lunaTurnStart >= 0 && lunaTurnEnd > lunaTurnStart, 'Luna send function is present');
const lunaTurnSource = html.slice(lunaTurnStart, lunaTurnEnd);
const lunaReaderStart = html.indexOf('async function hopeUsageReadLunaStream(');
const lunaReaderEnd = html.indexOf('async function hopeUsageSendLunaTurn(', lunaReaderStart);
assert.ok(lunaReaderStart >= 0 && lunaReaderEnd > lunaReaderStart, 'Luna stream reader helpers are present');
const lunaReaderSource = html.slice(lunaReaderStart, lunaReaderEnd);
const requestMatcherStart = html.indexOf('let HOPE_WEB_REQUESTED = false;');
const requestMatcherEnd = html.indexOf('function hopeUsageGetMode()', requestMatcherStart);
assert.ok(requestMatcherStart >= 0 && requestMatcherEnd > requestMatcherStart, 'web request matcher is present');
const requestMatcherSource = html.slice(requestMatcherStart, requestMatcherEnd);
const workerSource = await readFile(new URL('../worker/src/index.js', import.meta.url), 'utf8');
const workerModule = await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`);
const kbIndex = JSON.parse(await readFile(new URL('../docs/knowledge/kb-search-index.json', import.meta.url), 'utf8'));
const kbHelpersStart = html.indexOf('const KB_SEARCH_STOP =');
const kbHelpersEnd = html.indexOf('function kbFetchJsonWithTimeout(', kbHelpersStart);
assert.ok(kbHelpersStart >= 0 && kbHelpersEnd > kbHelpersStart, 'KB retrieval helpers are present');
const kbHelpersSource = html.slice(kbHelpersStart, kbHelpersEnd);

function makeKbSearchContext() {
  const context = vm.createContext({ kbIndex });
  vm.runInContext(kbHelpersSource, context);
  vm.runInContext(`function normalizeKbCandidate(candidate, semanticOnly = false) {
    return { video_id: candidate.video_id, title: candidate.title, channel: candidate.channel, chunk: Number(candidate.chunk), text: String(candidate.x || candidate.text || ''), _semanticOnly: semanticOnly };
  }`, context);
  vm.runInContext(`
    KB_SEARCH_CHUNKS = kbIndex.map(c => ({ ...c, _tk: kbSearchTok(c.x) }));
    KB_SEARCH_DF = {};
    let tokenTotal = 0;
    KB_SEARCH_CHUNKS.forEach(c => {
      tokenTotal += c._tk.length;
      new Set(c._tk).forEach(w => { KB_SEARCH_DF[w] = (KB_SEARCH_DF[w] || 0) + 1; });
    });
    KB_SEARCH_AVGDL = tokenTotal / KB_SEARCH_CHUNKS.length;
  `, context);
  return context;
}

test('named video title is promoted ahead of other ranked videos', () => {
  const context = makeKbSearchContext();
  const unrelated = { video_id: 'other-video', title: 'Most EQ Problems Come From Skipping This Step', channel: 'TheCosmicAcademy', chunk: 1, text: 'other transcript' };
  const result = vm.runInContext(`kbPromoteNamedVideo(
    'The #1 EQ Mistake Ruining Your Sound',
    'The #1 EQ Mistake Ruining Your Sound',
    [${JSON.stringify(unrelated)}],
    6
  )`, context);

  assert.equal(result[0].video_id, '5QDXc8s6GgM');
  assert.equal(result[0].title, 'The #1 EQ Mistake Ruining Your Sound');
  assert.equal(result[0].channel, 'Make Your Music');
});

test('how-to guidance gives usable KB steps directly and returns the Logic MIDI steps', () => {
  const context = makeKbSearchContext();
  const voiceStyle = html.match(/VOICE STYLE:([^\n]+)/)?.[1] || '';
  const usageSystem = html.match(/const HOPE_USAGE_SYSTEM = `([^`]+)`;/)?.[1] || '';
  for (const instruction of [voiceStyle, usageSystem]) {
    assert.match(instruction, /how-to questions, give the usable steps from the knowledge base directly and in order/i);
    assert.match(instruction, /ask a clarifying question only when the knowledge base has nothing usable/i);
  }

  const hits = vm.runInContext("kbSearchRetrieve('Logic Pro drum loop convert to MIDI region', 25)", context);
  const steps = hits.find(hit => hit.video_id === 'zpyJFmx9NAU' && hit.chunk === 2);
  assert.ok(steps, 'the KB search returns the source chunk with Logic MIDI conversion steps');
  assert.equal(steps.title, 'You’re Not Using Logic Pro Correctly (If You Don’t Do This)');
  assert.match(steps.x, /right click.*convert to MIDI region/i);
  assert.match(steps.x, /go over here to quantize.*make groove template/i);
});

test('Luna returns streamed partial text when the response is incomplete', async () => {
  const partial = 'The transient is masking the vocal, so';
  const events = [
    { type: 'response.output_text.delta', delta: partial },
    { type: 'response.incomplete', response: { incomplete_details: { reason: 'max_output_tokens' }, usage: { input_tokens: 13, output_tokens: 7, input_tokens_details: { cached_tokens: 2 } }, output: [] } }
  ].map(event => `data: ${JSON.stringify(event)}\n\n`).join('');
  const bytes = new TextEncoder().encode(events);
  const statuses = [];
  const warnings = [];
  const input = { value: 'What should I check?' };
  const body = { textContent: '', style: {} };
  const label = { textContent: '' };
  const thinkEl = {
    className: '', innerHTML: '',
    querySelector(selector) { return selector === '.body' ? body : label; },
    remove() {}
  };
  const send = { disabled: false };
  const transcript = { appendChild() {} };
  const cost = { textContent: '' };
  const context = vm.createContext({
    AICHAT: { busy: false, history: [], sessionCost: 0 },
    HOPE_USAGE_VOICE: { turnId: 4, sessionTurns: 0, sessionLlmCost: 0, sessionLlmInputTokens: 0, sessionLlmOutputTokens: 0 },
    HOPE_STT_TOKEN_STORAGE: 'token-key', AIMM_PROXY_URL: 'https://worker.test', HOPE_USAGE_SYSTEM: 'test system',
    HOPE_KB_DECISION: { question:'What should I check?', usable:false, searched:false, results:[], garbled:false },
    hopeVagueVideoReference() { return false; },
    hopeWebSearchBeginTurn() {}, hopeShowGarbledRepeat() { return false; },
    localStorage: { getItem: () => 'test-token' },
    document: {
      getElementById(id) { return ({ aiChatInput: input, aiChatSend: send, aiChatTranscript: transcript, aiChatLastCost: cost })[id] || null; },
      createElement() { return thinkEl; }
    },
    AbortController, TextDecoder, DOMException, console: { warn(...args) { warnings.push(args); } },
    fetch: async () => ({ ok: true, body: new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }) }),
    hopeUsageSelectTools: () => [],
    aichatRender() {}, aichatSave() {}, aichatScrollToBottom() {},
    aichatStatus(message) { statuses.push(message); },
    buildContextSummary() { throw new Error('context not needed by this test'); }, activeTabId() { return ''; },
    hopeUsageLunaSearchFee() { return 0; }, aichatStripMd(value) { return value; },
    hopeUsageTurnSummary() { return 'summary'; }, hopeUsageStatus() {}, addSpend() {}, rtRenderCost() {}
  });
  vm.runInContext(lunaReaderSource + lunaTurnSource, context);

  await vm.runInContext('hopeUsageSendLunaTurn({})', context);

  assert.equal(context.AICHAT.history.at(-1).content, partial);
  assert.ok(statuses.some(message => message.startsWith('Done — GPT-6 Luna')));
  assert.equal(context.AICHAT.history.at(-1).content.startsWith('I couldn’t reach Luna'), false);
  assert.equal(context.HOPE_USAGE_VOICE.sessionLlmInputTokens, 13);
  assert.equal(context.HOPE_USAGE_VOICE.sessionLlmOutputTokens, 7);
  assert.deepEqual(warnings[0], ['[AIMM] Luna reply incomplete:', 'max_output_tokens']);
});

test('Luna tool list omits research and keeps the knowledge and web search tools', () => {
  const context = vm.createContext({
    AICHAT_TOOL_DEFS: [
      { name: 'research' }, { name: 'search_yt_knowledge' }, { name: 'read_yt_knowledge' }, { name: 'other_tool' }
    ]
  });
  vm.runInContext(helperSource, context);
  const names = vm.runInContext("hopeUsageSelectTools('').map(tool => tool.name)", context);
  assert.equal(names.includes('research'), false);
  assert.ok(names.includes('search_yt_knowledge'));
  assert.ok(names.includes('read_yt_knowledge'));
  assert.ok(names.includes('web_search_fallback'));
});

test('explicit web search requests match the supported phrases case-insensitively', () => {
  const context = vm.createContext({});
  vm.runInContext(requestMatcherSource, context);
  const matches = vm.runInContext('hopeWebSearchRequested', context);
  for (const phrase of ['web search', 'search the web', 'search online', 'search the internet', 'look it up online', 'google']) {
    assert.equal(matches(`Could you ${phrase}?`), true, `${phrase} is recognised`);
    assert.equal(matches(`Could you ${phrase.toUpperCase()}?`), true, `${phrase} is case-insensitive`);
  }
  assert.equal(matches('Can you find something in my notes?'), false);
  const beginTurn = vm.runInContext('hopeWebSearchBeginTurn', context);
  beginTurn('Please search the web for this');
  assert.equal(vm.runInContext('HOPE_WEB_REQUESTED', context), true);
  beginTurn('And what about the knowledge base?');
  assert.equal(vm.runInContext('HOPE_WEB_REQUESTED', context), false, 'each new turn clears the prior request flag');
});

test('Hope account choice maps Auto, Primary and Backup to the expected agent IDs', () => {
  const helperStart = html.indexOf("const AIMM_HOPE_DEFAULT_AGENT_ID =");
  const helperEnd = html.indexOf('function elIsUsageExhaustion(', helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart, 'Hope account mapping is present');
  const context = vm.createContext({
    EL_AGENT_ID_STORAGE: 'test-agent-storage',
    localStorage: {
      value: null,
      getItem(){ return this.value; },
      setItem(_key, value){ this.value = value; }
    }
  });
  vm.runInContext(html.slice(helperStart, helperEnd), context);
  const getChoice = vm.runInContext('getHopeAccountChoice', context);
  const getAgent = vm.runInContext('getHopeAgentId', context);
  const primary = vm.runInContext('AIMM_HOPE_DEFAULT_AGENT_ID', context);
  const backup = vm.runInContext('AIMM_HOPE_FALLBACK_AGENT_ID', context);
  const active = vm.runInContext('AIMM_HOPE_ACTIVE_AGENT_ID', context);

  assert.equal(getChoice(), 'auto');
  assert.equal(getAgent(), active, 'Auto selects the configured active role');
  context.localStorage.value = 'primary';
  assert.equal(getAgent(), primary);
  context.localStorage.value = 'backup';
  assert.equal(getAgent(), backup);
  context.localStorage.value = 'invalid';
  assert.equal(getChoice(), 'auto', 'invalid stored values safely fall back to Auto');
  assert.equal(getAgent(), active);
});

test('Luna keeps web search behind KB results, charges the fee, and Worker proxies the query', async () => {
  const upstreamCalls = [];
  const appFetchCalls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => {
    const parsedUrl = String(url);
    if (parsedUrl.endsWith('/hope/web-search')) {
      appFetchCalls.push({ url: parsedUrl, options });
      return Response.json({ answer: 'Current supported answer.', sources: ['https://example.test/source'], web_search_requests: 2 });
    }
    if (parsedUrl === 'https://api.anthropic.com/v1/messages') {
      const payload = JSON.parse(options.body);
      upstreamCalls.push({ url: parsedUrl, options, payload });
      return Response.json({
        content: [
          { type: 'text', text: 'Current supported answer.' },
          { type: 'web_search_tool_result', content: [{ type: 'web_search_result', url: 'https://example.test/source' }] }
        ],
        usage: { server_tool_use: { web_search_requests: 2 } }
      });
    }
    throw new Error(`Unexpected network call: ${parsedUrl}`);
  };

  try {
    const context = vm.createContext({
      fetch: globalThis.fetch,
      ANT_WEB_SEARCH_RATE: 10 / 1000,
      HOPE_KB_STATE: 'unchecked',
      HOPE_KB_DECISION: { question:'', usable:false, searched:false, results:[], garbled:false },
      hopeKnowledgeDecision: ({tool}) => ({allow: tool === 'search_yt_knowledge' || context.HOPE_WEB_REQUESTED || (context.HOPE_KB_DECISION.searched && !context.HOPE_KB_DECISION.usable), message:'Search the knowledge base first with search_yt_knowledge. Use web search only if it finds nothing.'}),
      HOPE_WEB_REQUESTED: false,
      TOOL_DEFS: [{ name: 'search_yt_knowledge' }, { name: 'research' }],
      AICHAT_TOOL_DEFS: [{ name: 'search_yt_knowledge' }, { name: 'read_yt_knowledge' }, { name: 'research' }],
      toolCalls: [],
      handleToolCall: async (_name, args) => {
        context.toolCalls.push({ name: _name, args });
        const result = args.query === 'usable' ? { results: [{ text: 'KB answer' }] } : { results: [] };
        context.HOPE_KB_STATE = result.results.length ? 'found' : 'empty';
        if (_name === 'search_yt_knowledge') {
          context.HOPE_KB_DECISION.searched = true;
          context.HOPE_KB_DECISION.usable = result.results.length > 0;
        }
        return result;
      }
    });
    vm.runInContext(helperSource, context);
    const execute = vm.runInContext('hopeUsageExecuteLunaCall', context);
    const searchFee = vm.runInContext('hopeUsageLunaSearchFee', context);

    const earlyWeb = await execute({ name: 'web_search_fallback', arguments: JSON.stringify({ query: 'too early' }) }, { base: 'https://worker.test', token: 'test-token' });
    assert.equal(earlyWeb.result.error, 'Search the knowledge base first with search_yt_knowledge. Use web search only if it finds nothing.');
    assert.equal(appFetchCalls.length, 0, 'web fallback is blocked before a KB search');
    const earlyResearch = await execute({ name: 'research', arguments: JSON.stringify({ question: 'too early' }) }, { base: 'https://worker.test', token: 'test-token' });
    assert.equal(earlyResearch.result.error, 'Tool is not available on the Luna route.');
    assert.equal(context.toolCalls.length, 0, 'research is blocked before a KB search');

    async function fakeLunaTurn(kbQuery) {
      let response = { output: [{ type: 'function_call', name: 'search_yt_knowledge', call_id: 'kb', arguments: JSON.stringify({ query: kbQuery }) }] };
      const toolOutputs = [];
      for (let turn = 0; turn < 3; turn++) {
        const call = response.output.find(item => item.type === 'function_call');
        if (!call) return toolOutputs;
        const executed = await execute(call, { base: 'https://worker.test', token: 'test-token' });
        toolOutputs.push({ name: call.name, result: executed.result });
        if (call.name === 'search_yt_knowledge' && !executed.result.results.length) {
          response = { output: [{ type: 'function_call', name: 'web_search_fallback', call_id: 'web', arguments: JSON.stringify({ query: 'live fact' }) }] };
        } else {
          response = { output: [{ type: 'message', content: [{ type: 'output_text', text: 'Answer' }] }] };
        }
      }
      return toolOutputs;
    }

    const usable = await fakeLunaTurn('usable');
    assert.deepEqual(usable.map(item => item.name), ['search_yt_knowledge']);
    const foundWeb = await execute({ name: 'web_search_fallback', arguments: JSON.stringify({ query: 'still blocked' }) }, { base: 'https://worker.test', token: 'test-token' });
    assert.equal(foundWeb.result.error, 'Search the knowledge base first with search_yt_knowledge. Use web search only if it finds nothing.');
    assert.equal(appFetchCalls.length, 0, 'web fallback is not called when KB search has usable hits');

    context.HOPE_WEB_REQUESTED = true;
    const explicitlyRequestedWeb = await execute({ name: 'web_search_fallback', arguments: JSON.stringify({ query: 'requested despite KB hits' }) }, { base: 'https://worker.test', token: 'test-token' });
    assert.equal(explicitlyRequestedWeb.result.answer, 'Current supported answer.');
    assert.equal(appFetchCalls.length, 1, 'explicit web request overrides usable KB hits');
    const explicitlyRequestedResearch = await execute({ name: 'research', arguments: JSON.stringify({ question: 'requested research despite KB hits' }) }, { base: 'https://worker.test', token: 'test-token' });
    assert.match(explicitlyRequestedResearch.result.error, /not available on the Luna route/);
    assert.equal(context.toolCalls.length, 1, 'direct research invocation is refused by the Luna executor allow-list');
    context.HOPE_WEB_REQUESTED = false;

    const empty = await fakeLunaTurn('empty');
    assert.deepEqual(empty.map(item => item.name), ['search_yt_knowledge', 'web_search_fallback']);
    assert.equal(appFetchCalls.length, 2, 'web fallback runs after an empty KB result');
    assert.equal(JSON.parse(appFetchCalls[1].options.body).query, 'live fact');
    assert.equal(searchFee(empty.at(-1).result.web_search_requests), 0.02, 'search fee uses ANT_WEB_SEARCH_RATE');
    const allowedResearch = await execute({ name: 'research', arguments: JSON.stringify({ question: 'after an empty KB search' }) }, { base: 'https://worker.test', token: 'test-token' });
    assert.match(allowedResearch.result.error, /not available on the Luna route/);
    assert.equal(context.toolCalls.length, 2, 'research remains unavailable after an empty KB search');

    const request = new Request('https://worker.test/hope/web-search', {
      method: 'POST',
      headers: { Origin: 'http://localhost:8000', Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Which release date is current?' })
    });
    const response = await workerModule.default.fetch(request, {
      HOPE_STT_TOKEN: 'test-token', ANTHROPIC_API_KEY: 'mock-key',
      HOPE_STT_LIMIT: { limit: async () => ({ success: true }) }
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(upstreamCalls.length, 1);
    assert.equal(upstreamCalls[0].payload.messages[0].content, 'Which release date is current?');
    assert.deepEqual(upstreamCalls[0].payload.tools, [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }]);
    assert.equal(result.answer, 'Current supported answer.');
    assert.deepEqual(result.sources, ['https://example.test/source']);
    assert.equal(result.web_search_requests, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
