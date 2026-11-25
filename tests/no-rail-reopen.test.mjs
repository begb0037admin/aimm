import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

for (const page of ['../index.html', '../standalone/assets/index.html']) {
  test(`${page} has no floating Chat reopen control`, () => {
    const html = readFileSync(new URL(page, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /railReopen|rail-reopen/);
    assert.doesNotMatch(html, /<button[^>]*>Chat<\/button>/i);
  });
}
