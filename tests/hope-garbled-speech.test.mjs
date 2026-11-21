import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const start = html.indexOf('function hopeWebSearchRequested(');
const end = html.indexOf('function hopeQuestionNeedsKnowledge(', start);
assert.ok(start >= 0 && end > start, 'shared transcript decision helpers exist');
const decisionStart = html.indexOf('function hopeKnowledgeDecision(');
const decisionEnd = html.indexOf('function hopeShowGarbledRepeat(', decisionStart);
assert.ok(decisionStart >= 0 && decisionEnd > decisionStart, 'shared knowledge decision exists');
const source = `let HOPE_WEB_REQUESTED=false;let HOPE_KB_DECISION={question:'',usable:false,searched:false,results:[],garbled:false};\n${html.slice(start, end)}\n${html.slice(decisionStart, decisionEnd)}`;

function decision(text, confidence, sourceType = 'voice') {
  const ctx = vm.createContext({});
  vm.runInContext(source, ctx);
  ctx.text = text;
  ctx.confidence = confidence;
  ctx.sourceType = sourceType;
  vm.runInContext('hopeWebSearchBeginTurn(text,confidence,sourceType)', ctx);
  return {
    garbled: vm.runInContext('HOPE_KB_DECISION.garbled', ctx),
    transcript: vm.runInContext("hopeKnowledgeDecision({tool:'transcript'})", ctx),
    agentTool: vm.runInContext("hopeKnowledgeDecision({tool:'get_context',route:'agent'})", ctx)
  };
}

test('Kevin’s exact clear statement and contractions remain readable', () => {
  for (const sentence of [
    "That's fine. No problems. Let's move on to something else.",
    "I'm ready to go.", "Don't stop the music.", "It's sounding better.",
    "We'll try that next.", "That's the right EQ.",
    'That’s fine. Let’s continue.', 'That hmm works.',
    'hmm mm shh nth tv dj eq'
  ]) {
    assert.equal(decision(sentence, 0.9).garbled, false, sentence);
    assert.equal(decision(sentence).garbled, false, sentence);
  }
});

test('readable conversational statements continue through the normal path', () => {
  const result = decision("That's fine. No problems. Let's move on to something else.");
  assert.equal(result.transcript.allow, true);
  assert.equal(result.transcript.action, 'continue');
  assert.equal(result.agentTool.allow, true);
  assert.match(html, /if\(tool==='transcript'\)return\{allow:true,usable:HOPE_KB_DECISION\.usable,action:'continue'\}/);
  assert.match(html, /const decision=hopeKnowledgeDecision\(\{tool:toolName,route:'agent'\}\);\s*if\(!decision\.allow\)return/);
});

test('genuinely garbled and empty transcripts request repetition', () => {
  for (const sentence of ['sss', 'ptk bgd', 'qwrtyplkj zxcvbnm', '', '   ']) {
    assert.equal(decision(sentence).garbled, true, JSON.stringify(sentence));
  }
});

test('low confidence still requests repetition for clear speech', () => {
  assert.equal(decision("That's fine. No problems. Let's move on to something else.", 0.2).garbled, true);
  assert.equal(decision('Clear typed text', 0.2, 'chat').garbled, true);
  const ctx = vm.createContext({});
  vm.runInContext(source, ctx);
  assert.equal(vm.runInContext("hopeTranscriptLooksGarbled('Clear speech',0.2)", ctx), true);
});
