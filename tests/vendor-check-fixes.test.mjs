import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../standalone/src/index.js', import.meta.url), 'utf8');
const worker = (await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))).default;
const page = '<html><body>All Waves Plugins: Across-the-board software update to V17.\n' +
  'Trackspacer 2.5.10\n' + 'Release notes and version details. '.repeat(6) + '</body></html>';
const originalFetch = globalThis.fetch;

async function check(products) {
  const urls = [];
  globalThis.fetch = async url => {
    urls.push(url);
    return new Response(page, { status: 200, headers: { 'Content-Type': 'text/html' } });
  };
  try {
    const request = new Request('https://aimixmasters.com/api/vendor-check', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ products }),
    });
    const response = await worker.fetch(request, {});
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    return { results: body.results, urls };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('companion vendor strings match only an eligible publisher', async () => {
  const vendors = [
    ['uaudio', ''], ['ikmultimedia', ''], ['scalermusic', 'scalermusic.com'],
    ['slatedigital', ''], ['ValhallaDSP', ''], ['AconDigital', ''],
    ['pluginalliance', 'plugin-alliance.com'], ['SirAudioTools', 'siraudiotools.com'],
    ['AurallySound', 'aurallysound.com'], ['wavesfactory', 'wavesfactory.com'],
    ['Universal Audio', ''], ['waves', 'waves.com'],
  ];
  const products = vendors.map(([vendor]) => ({ vendor, name: vendor === 'scalermusic' ? 'Scaler 3' : vendor === 'wavesfactory' ? 'Trackspacer' : 'Test Plugin', versions: ['2.5.10'] }));
  const { results } = await check(products);
  vendors.forEach(([vendor, domain], index) => {
    assert.equal(results[index].vendor, vendor);
    assert.equal(domain ? new URL(results[index].sourceUrl).hostname.includes(domain) : results[index].sourceUrl === '', true, vendor);
  });
});

test('Waves V17 is current, V16 needs a major upgrade check, and Trackspacer stays independent', async () => {
  const { results } = await check([
    { vendor: 'waves', name: 'Abbey Road Chambers', versions: ['16.7.33'] },
    { vendor: 'waves', name: 'Abbey Road Plates', versions: ['17.1.42'] },
    { vendor: 'wavesfactory', name: 'Trackspacer', versions: ['2.5.10'] },
  ]);
  assert.equal(results[0].status, 'manual-check');
  assert.equal(results[0].reason, 'Waves V17 is a new major version (V16 installed). Check your Waves Update Plan.');
  assert.equal(results[1].status, 'up-to-date');
  assert.equal(results[2].status, 'up-to-date');
  assert.equal(results[2].latestVersion, '2.5.10');
});
