import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';

const asset = new URL('../standalone/assets/', import.meta.url);
test('the bundled Inter face and Lucide sprite are served with the page', async () => {
  const html = await readFile(new URL('index.html', asset), 'utf8');
  const font = await stat(new URL('fonts/inter-latin-wght.woff2', asset));
  const headers = await readFile(new URL('_headers', asset), 'utf8');
  assert.ok(font.size > 40_000);
  assert.match(html, /@font-face\{\s*font-family:"Inter";[\s\S]*?url\("\/fonts\/inter-latin-wght\.woff2"\)/);
  assert.match(html, /rel="preload" href="\/fonts\/inter-latin-wght\.woff2"[^>]*crossorigin/);
  assert.match(headers, /\/fonts\/\*\n  Cache-Control: public, max-age=31536000, immutable/);
  assert.match(html, /<symbol id="i-tab-mixcheck"/);
  assert.match(html, /<use href="#i-tab-mixcheck"\/>/);
  assert.doesNotMatch(html, /<svg class="ic[^>]*\b(?:stroke|fill)="#[0-9a-f]+"/i);
});
