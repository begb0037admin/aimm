import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const systemStart = html.indexOf('const HOPE_USAGE_SYSTEM = `');
const systemEnd = html.indexOf('`;', systemStart);
assert.ok(systemStart >= 0 && systemEnd > systemStart, 'Luna system prompt is present');
const systemSource = html.slice(systemStart, systemEnd + 2);
const systemPrompt = vm.runInNewContext(`${systemSource}\nHOPE_USAGE_SYSTEM`);
const lunaTurnStart = html.indexOf('async function hopeUsageSendLunaTurn(');
const lunaTurnEnd = html.indexOf('function aimmBuildFixQueueQuestion(', lunaTurnStart);
assert.ok(lunaTurnStart >= 0 && lunaTurnEnd > lunaTurnStart, 'Luna request function is present');
const lunaTurnSource = html.slice(lunaTurnStart, lunaTurnEnd);

test('Luna prompt keeps spoken answers short, direct, and complete', () => {
  assert.match(systemPrompt, /stay under about 120 words/i);
  assert.match(systemPrompt, /lead with the answer/i);
  assert.match(systemPrompt, /finish the sentence before stopping; never end mid-sentence/i);
});

test('Luna how-to format caps numbered steps at five', () => {
  assert.match(systemPrompt, /For how-to questions, give the usable steps from the knowledge base directly and in order, using numbered steps \(at most five\)/i);
});

test('Luna request body keeps max_output_tokens at 220', () => {
  const bodyStart = lunaTurnSource.indexOf('body:JSON.stringify(');
  const bodyEnd = lunaTurnSource.indexOf('),signal:abort.signal', bodyStart);
  assert.ok(bodyStart >= 0 && bodyEnd > bodyStart, 'Luna fetch body is present');
  const bodyExpression = lunaTurnSource.slice(bodyStart + 'body:'.length, bodyEnd + 1);
  const body = JSON.parse(vm.runInNewContext(bodyExpression, { inputItems: [], tools: [] }));
  assert.equal(body.max_output_tokens, 220);
});
