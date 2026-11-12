import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const start = html.indexOf('const MC_FIXQUEUE=(function(){');
const end = html.indexOf('window.MC_FIXQUEUE=MC_FIXQUEUE;', start);
assert.ok(start >= 0 && end > start, 'Fix Queue engine is present');
const engine = html.slice(start, end).replaceAll('items=build(r);', 'items=r&&r.__testItems?r.__testItems:build(r);');

function makeQueue(storage) {
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
    window: { dispatchEvent: event => events.push(event) },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    escapeHtml: value => String(value),
  };
  vm.runInNewContext(`${engine}\nglobalThis.queue=MC_FIXQUEUE;`, context);
  return { queue: context.queue, host, events };
}

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
  assert.match(host.innerHTML, /Undo done/);
  assert.match(host.innerHTML, /Previous/);
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
