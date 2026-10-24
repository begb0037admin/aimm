import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const helperStart = html.indexOf('function hopeUsageSelectTools(');
const helperEnd = html.indexOf('function hopeUsageStatus(', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'Luna tool helpers are present');
const helperSource = html.slice(helperStart, helperEnd);
const workerSource = await readFile(new URL('../worker/src/index.js', import.meta.url), 'utf8');
const workerModule = await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`);

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
      TOOL_DEFS: [{ name: 'search_yt_knowledge' }],
      handleToolCall: async (_name, args) => {
        const result = args.query === 'usable' ? { results: [{ text: 'KB answer' }] } : { results: [] };
        context.HOPE_KB_STATE = result.results.length ? 'found' : 'empty';
        return result;
      }
    });
    vm.runInContext(helperSource, context);
    const execute = vm.runInContext('hopeUsageExecuteLunaCall', context);
    const searchFee = vm.runInContext('hopeUsageLunaSearchFee', context);

    const earlyWeb = await execute({ name: 'web_search_fallback', arguments: JSON.stringify({ query: 'too early' }) }, { base: 'https://worker.test', token: 'test-token' });
    assert.equal(earlyWeb.result.error, 'Search the knowledge base first with search_yt_knowledge. Use web search only if it finds nothing.');
    assert.equal(appFetchCalls.length, 0, 'web fallback is blocked before a KB search');

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

    const empty = await fakeLunaTurn('empty');
    assert.deepEqual(empty.map(item => item.name), ['search_yt_knowledge', 'web_search_fallback']);
    assert.equal(appFetchCalls.length, 1, 'web fallback runs after an empty KB result');
    assert.equal(JSON.parse(appFetchCalls[0].options.body).query, 'live fact');
    assert.equal(searchFee(empty.at(-1).result.web_search_requests), 0.02, 'search fee uses ANT_WEB_SEARCH_RATE');

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
