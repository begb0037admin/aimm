const VENDOR_SOURCES = [
  { id: 'fabfilter', url: 'https://www.fabfilter.com/download', matches: ['fabfilter'], parser: 'fabfilter' },
  { id: 'arturia', url: 'https://www.arturia.com/support/downloads-manuals/product/', matches: ['arturia'], parser: 'arturia-product' },
  { id: 'sonarworks', url: 'https://www.sonarworks.com/legal/soundid-reference/release-notes', matches: ['sonarworks', 'soundid reference'], parser: 'sonarworks' },
  { id: 'wavesfactory', url: 'https://www.wavesfactory.com/blog/posts/changelog-and-updates/', matches: ['wavesfactory'], parser: 'product' },
  { id: 'sonible', url: 'https://www.sonible.com/', matches: ['sonible'], parser: 'product-page' },
  { id: 'soundtoys', url: 'https://www.soundtoys.com/release-log/', matches: ['soundtoys'], parser: 'suite-release' },
  { id: 'softube', url: 'https://www.softube.com/release-notes', matches: ['softube'], parser: 'softube-suite' },
  { id: 'melda', url: 'https://www.meldaproduction.com/downloads', matches: ['meldaproduction', 'melda production'], parser: 'melda-suite' },
  { id: 'liquidsonics', url: 'https://www.liquidsonics.com/downloads/', matches: ['liquidsonics', 'reverb foundry'], parser: 'liquidsonics-catalog' },
  { id: 'oeksound', url: 'https://oeksound.com/downloads/', matches: ['oeksound'], parser: 'oeksound-catalog' },
  { id: 'aurally-sound', url: 'https://aurallysound.com/pages/prism-downloads', matches: ['aurallysound', 'aurally sound'], parser: 'aurally-prism' },
  { id: 'sir-audio-tools', url: 'https://www.siraudiotools.com/versionHistory.php?id=standardclip', matches: ['siraudiotools', 'sir audio tools'], parser: 'sir-standardclip' },
  { id: 'splice-instrument', url: 'https://support.splice.com/en/articles/12295094-splice-instrument-change-log', matches: ['splice'], parser: 'splice-instrument' },
  { id: 'evabeat-melody-sauce', url: 'https://evabeat.com/user-guide.html', matches: ['evabeat'], parser: 'evabeat-guide' },
  { id: 'celemony', url: 'https://helpcenter.celemony.com/M5/doc/melodyneStudio5/en/M5tour_VersionHistory?env=live', matches: ['celemony'], parser: 'melodyne-version-history' },
  { id: 'scaler-music', url: 'https://forum.scalermusic.com/t/scaler-3-latest-version/20939', matches: ['scaler music'], parser: 'scaler3-version' },
  { id: 'izotope', url: 'https://www.izotope.com/pages/product-downloads/', matches: ['izotope'], parser: 'izotope' },
  { id: 'native-instruments', url: 'https://www.native-instruments.com/pages/product-downloads', matches: ['native instruments'], parser: 'ni-product' },
  { id: 'waves', url: 'https://www.waves.com/downloads/release-notes', matches: ['waves'], parser: 'waves-suite' },
  { id: 'ssl', url: 'https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-Plug-in-Downloads', matches: ['ssl', 'solid state logic'], parser: 'ssl-table' },
  { id: 'harrison', url: 'https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-Plug-in-Downloads', matches: ['harrison audio'], parser: 'ssl-table' },
  { id: 'voxengo', url: 'https://www.voxengo.com/downloads/', matches: ['voxengo'], parser: 'product' },
  { id: 'eventide', url: 'https://www.eventideaudio.com/downloads/', matches: ['eventide', 'newfangled audio'], parser: 'product-query' },
  { id: 'altitude-crossfeed', url: 'https://www.altitude.audio/crossfeed', matches: ['altitude'], parser: 'product' },
  { id: 'altitude-limiter', url: 'https://www.altitude.audio/altitude-limiter', matches: ['altitude'], parser: 'product' },
];
const ALLOWED_ORIGINS = new Set([
  'https://aimixmasters.com',
  'https://www.aimixmasters.com',
  'https://aimm.kevinlelitte.workers.dev',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
]);
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const SOURCE_CACHE = new Map();
// Worker isolates do not share this map; this is a best-effort local throttle,
// not a distributed account or IP quota.
const REQUEST_LIMITS = new Map();
const MAX_BODY_BYTES = 1_000_000;
const MAX_PRODUCTS = 3000;
const MAX_SOURCE_PAGES_PER_CHECK = 45;
const EVENTIDE_PRODUCTS = new Map([
  ['blackhole', 'Blackhole®'],
  ['crushstation', 'CrushStation®'],
  ['temperance lite', 'Temperance® Lite'],
  ['temperance pro', 'Temperance® Pro'],
]);
const SONIBLE_PRODUCTS = new Map([
  ['smart comp 3', ['smart:comp 3', 'smartcomp3']], ['smart comp 2', ['smart:comp 2', 'smartcomp2']],
  ['smart eq 4', ['smart:EQ 4', 'smarteq4']], ['smart eq 3', ['smart:EQ 3', 'smarteq3']],
  ['smart reverb 2', ['smart:reverb 2', 'smartreverb2']], ['smart reverb', ['smart:reverb', 'smartreverb']],
  ['smart deess', ['smart:deess', 'smartdeess']],
  ['smart limit', ['smart:limit', 'smartlimit']], ['smart gate', ['smart:gate', 'smartgate']],
  ['true balance', ['true:balance', 'truebalance']], ['true level', ['true:level', 'truelevel']],
  ['pure level', ['pure:level', 'purelevel']], ['pure deess', ['pure:deess', 'puredeess']],
  ['pure unmask', ['pure:unmask', 'pureunmask']], ['pure eq', ['pure:EQ', 'pureeq']],
  ['pure comp', ['pure:comp', 'purecomp']], ['pure limit', ['pure:limit', 'purelimit']],
  ['pure verb', ['pure:verb', 'pureverb']], ['prime vocal', ['prime:vocal', 'primevocal']],
  ['proximity eq', ['proximity:EQ+', 'proximityeq']], ['entropy eq', ['entropy:EQ+', 'entropyeq']],
]);
// Arturia's downloads catalogue uses canonical slugs that do not always
// follow a simple product-name-to-URL conversion. Only entries with a known
// official page are eligible for automatic comparison.
const ARTURIA_PRODUCTS = new Map([
  ['analog lab v', { slug: 'analoglab-v', product: 'Analog Lab V', titles: ['analog lab pro', 'analog lab v'] }],
  ['analog lab pro', { slug: 'analoglab-v', product: 'Analog Lab V', titles: ['analog lab pro', 'analog lab v'] }],
  ['dist coldfire', { slug: 'dist-coldfire', product: 'Dist COLDFIRE', titles: ['dist coldfire'] }],
  ['mini v', { slug: 'mini-v', product: 'Mini V4', titles: ['mini v4', 'mini v'] }],
  ['mini v4', { slug: 'mini-v', product: 'Mini V4', titles: ['mini v4', 'mini v'] }],
  ['pigments', { slug: 'pigments', product: 'Pigments', titles: ['pigments'] }],
]);

function json(body, status = 200, origin = '') {
  const headers = new Headers(JSON_HEADERS);
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  return new Response(JSON.stringify(body), { status, headers });
}
function normalize(value) {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function htmlText(html) {
  return String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\b[^>]*>/gi, '\n')
    .replace(/<\/(?:h[1-6]|p|li|div|section|article|br|tr|td|th)>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/[\t\r ]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
}
function versionAfterProduct(text, name, vendor) {
  const variants = new Set([String(name || '')]);
  const simpleName = String(name || '').replace(/^(?:fabfilter|sonnox|wavesfactory|waves|waves audio|sonarworks|soundid reference|ssl native|ssl|harrison audio)\s*[:—-]?\s*/i, '');
  if (simpleName) variants.add(simpleName);
  if (/altitude/i.test(vendor || '')) {
    const cleaned = String(name || '').replace(/^[A-Z]{1,4}_/i, '').replace(/^altitude(?: audio)?\s*[:—-]?\s*/i, '');
    if (cleaned) variants.add(cleaned);
    if (/crossfeed/i.test(cleaned)) variants.add('Crossfeed 2');
  }
  const withoutTrailingVersion = String(name || '').replace(/\s+\d+(?:\.\d+){1,3}\s*$/, '');
  if (withoutTrailingVersion !== String(name || '')) variants.add(withoutTrailingVersion);
  const versionPattern = /\b(?:version\s*)?v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i;
  const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
  for (const alias of Array.from(variants).sort((a, b) => b.length - a.length)) {
    const words = alias.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    const escaped = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s\\-_:]*');
    const matcher = new RegExp(escaped, 'ig');
    for (let index = 0; index < lines.length; index++) {
      matcher.lastIndex = 0;
      const line = lines[index];
      const match = matcher.exec(line);
      if (!match) continue;
      const sameLine = line.slice(match.index + match[0].length).match(versionPattern);
      if (sameLine) return sameLine[1];
      const nextLine = lines[index + 1] || '';
      // Accept a version on the immediately following label only. Never walk
      // through a page section, where another product may own that version.
      if (/^(?:version\s*)?v?[0-9]/i.test(nextLine)) {
        const adjacent = nextLine.match(versionPattern);
        if (adjacent) return adjacent[1];
      }
    }
  }
  return '';
}
function extractSourceVersion(source, text, product, rawHtml = '', pageTitle = '') {
  if (source.parser === 'izotope') {
    const name = normalize(String(product.name || '').replace(/^izotope\s*[:—-]?\s*/i, ''));
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    for (let index = 0; index < lines.length; index++) {
      if (normalize(lines[index]) !== name) continue;
      for (let next = index + 1; next < Math.min(lines.length, index + 4); next++) {
        const latest = lines[next].match(/^latest update\s*:\s*v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
        if (latest) return latest[1];
        if (/^latest update\b/i.test(lines[next]) || normalize(lines[next]).length < 50 && /^[A-Z0-9][A-Za-z0-9 &:+().-]+$/.test(lines[next])) break;
      }
    }
    return '';
  }
  if (source.parser === 'fabfilter') {
    const blocks = Array.from(String(rawHtml || '').matchAll(/<a\b[^>]*class=["'][^"']*dummy-link[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi), match => match[1]);
    const requested = normalize(String(product.name || '').replace(/^fabfilter\s*[:—-]?\s*/i, '').replace(/\s*\((?:mono|stereo)\)\s*$/i, '').replace(/\s+(?:mono|stereo)\s*$/i, ''));
    for (const rawBlock of blocks) {
      const heading = (rawBlock.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i) || [])[1] || '';
      const normalizedTitle = normalize(htmlText(heading)).replace(/^download fabfilter\s+/, '');
      if (!requested || !normalizedTitle.startsWith(requested)) continue;
      const remainingTitle = normalizedTitle.slice(requested.length).trim();
      // A shortened model name such as “Pro-Q” must not match “Pro-Q 4”.
      if (/^\d+(?:\s|$)/.test(remainingTitle)) continue;
      const block = htmlText(rawBlock);
      const version = block.match(/\b(?:version\s*)?v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
      if (version) return version[1];
    }
    return '';
  }
  if (source.parser === 'arturia-product') {
    const requested = normalize(source.expectedProduct || '');
    const title = normalize(source.pageTitle || '');
    if (!requested || !title || !source.expectedTitles.some(accepted => title.includes(normalize(accepted)))) return '';
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    for (let index = 0; index < lines.length; index++) {
      if (normalize(lines[index]) !== requested) continue;
      for (let next = index + 1; next < Math.min(lines.length, index + 8); next++) {
        const version = lines[next].match(/^version\s+v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
        if (version) return version[1];
        if (/^show all versions$/i.test(lines[next])) break;
      }
    }
    return '';
  }
  if (source.parser === 'melda-suite') {
    const release = String(text || '').match(/kernel\s+version\s*:\s*([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
    return release ? release[1] : '';
  }
  if (source.parser === 'plugin-alliance-product') {
    const title = normalize(source.pageTitle || '');
    const expected = normalize(source.expectedProduct || '');
    if (!title || !expected || title !== expected) return '';
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    const changelogIndex = lines.findIndex(line => /^changelog$/i.test(line));
    if (changelogIndex < 0) return '';
    const heading = lines.slice(changelogIndex + 1, changelogIndex + 5).find(line => /changelog$/i.test(line));
    const changelogProduct = normalize((heading || '').replace(/\s*[-—:]?\s*changelog$/i, ''));
    if (!heading || (changelogProduct !== expected && !changelogProduct.endsWith(' ' + expected))) return '';
    for (let index = changelogIndex + 1; index < lines.length; index++) {
      const version = lines[index].match(/^version\s+v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
      if (version) return version[1];
      if (index > changelogIndex + 1 && /^version\s+/i.test(lines[index])) return '';
    }
    return '';
  }
  if (source.parser === 'liquidsonics-catalog') {
    const requested = normalize(product.name || '');
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    for (let index = 0; index < lines.length; index++) {
      if (normalize(lines[index]) !== requested) continue;
      for (let next = index + 1; next < Math.min(lines.length, index + 5); next++) {
        const version = lines[next].match(/^macOS\s+v([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
        if (version) return version[1];
        if (normalize(lines[next]) === 'product page visit' || /^user guide:/i.test(lines[next])) break;
      }
    }
    return '';
  }
  if (source.parser === 'oeksound-catalog') {
    const requested = normalize(product.name || '').replace(/\s+/g, '');
    for (const line of String(text || '').split('\n').map(value => value.trim()).filter(Boolean)) {
      const release = line.match(/^you'?re downloading\s+(.+?)\s+\(([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\)\s+for macos\.?$/i);
      if (release && normalize(release[1]).replace(/\s+/g, '') === requested) return release[2];
    }
    return '';
  }
  if (source.parser === 'aurally-prism') {
    if (normalize(product.name) !== 'prism' || !String(source.url || '').startsWith('https://aurallysound.com/pages/prism-downloads')) return '';
    return (String(text || '').match(/\blatest version\s+([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i) || [])[1] || '';
  }
  if (source.parser === 'sir-standardclip') {
    if (normalize(product.name).replace(/\s+/g, '') !== 'standardclip' || !String(source.url || '').includes('versionHistory.php?id=standardclip')) return '';
    const release = (String(text || '').match(/\bmac\s*\(\s*v?\.?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\s*\)/i) || [])[1] || '';
    return release;
  }
  if (source.parser === 'splice-instrument') {
    if (normalize(product.name) !== 'splice instrument' || !String(source.url || '').includes('/12295094-splice-instrument-change-log')) return '';
    return (String(text || '').match(/^version\s+([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/im) || [])[1] || '';
  }
  if (source.parser === 'evabeat-guide') {
    if (normalize(product.name) !== 'melody sauce 3' || !String(source.url || '').startsWith('https://evabeat.com/user-guide.html')) return '';
    if (!normalize(source.pageTitle || '').includes('melody sauce 3 user guide')) return '';
    return (String(text || '').match(/^version\s+([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/im) || [])[1] || '';
  }
  if (source.parser === 'melodyne-version-history') {
    if (!String(source.url || '').startsWith('https://helpcenter.celemony.com/M5/doc/melodyneStudio5/en/M5tour_VersionHistory') || !/^version history\b/i.test(String(text || ''))) return '';
    return (String(text || '').match(/\bnew in version\s+([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i) || [])[1] || '';
  }
  if (source.parser === 'scaler3-version') {
    const title = normalize(source.pageTitle || '');
    if (!title.includes('scaler 3')) return '';
    return (String(text || '').match(/\bcurrent version\s*:\s*scaler\s+([0-9]{1,2}(?:\.[0-9]{1,3}){1,2})\b/i) || [])[1] || '';
  }
  if (source.parser === 'product-query') {
    const title = normalize(pageTitle);
    const expectedTitle = normalize(source.expectedTitle || '');
    if (!title || !expectedTitle || (title !== expectedTitle && title !== expectedTitle + ' downloads')) return '';
    return (String(text || '').match(/\bVersion\s+v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i) || [])[1] || '';
  }
  if (source.parser === 'product-page') {
    const requested = normalize(source.expectedProduct || '');
    const title = normalize(pageTitle);
    if (!requested || (title !== requested && !title.startsWith(requested + ' by sonible'))) return '';
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    for (let index = 0; index < lines.length; index++) {
      if (!/^latest version$/i.test(lines[index])) continue;
      const version = (lines[index + 1] || '').match(/^v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
      if (version) return version[1];
    }
    return '';
  }
  if (source.parser === 'ssl-table') {
    const requested = normalize(String(product.name || '').replace(/^(?:solid state logic|ssl native|ssl|harrison audio)\s*[:—-]?\s*/i, ''));
    for (const line of String(text || '').split('\n').map(value => value.trim()).filter(Boolean)) {
      const row = line.match(/^(.+?)\s+v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})(?:\s|$)/i);
      if (row && normalize(row[1]) === requested) return row[2];
    }
    return '';
  }
  if (source.parser === 'suite-release') {
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    const match = lines.slice(0, 30).join('\n').match(/\bSoundtoys\s+(\d+(?:\.\d+){1,3})\s+Update\b/i);
    return match ? match[1] : '';
  }
  if (source.parser === 'softube-suite') {
    const match = String(text || '').match(/Release Notes for version\s+(\d+(?:\.\d+){1,3})\s*\(Released/i);
    return match ? match[1] : '';
  }
  if (source.parser === 'waves-suite') {
    const release = String(text || '').match(/All Waves Plugins\s*:\s*Across-the-board software update to\s+V([0-9]{1,2})\b/i);
    return release ? release[1] : '';
  }
  if (source.parser === 'sonarworks') {
    if (!/soundid\s*reference/i.test(product.name) && !/sonarworks/i.test(product.vendor)) return '';
    const release = (text.match(/release notes for\s+v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})/i) || [])[1] || '';
    return release || '';
  }
  if (source.parser === 'ni-product') {
    const requested = normalize(String(product.name || '').replace(/^native instruments\s*[:—-]?\s*/i, ''));
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    for (let index = 0; index < lines.length; index++) {
      if (normalize(lines[index]) !== requested) continue;
      for (let next = index + 1; next < Math.min(lines.length, index + 4); next++) {
        const latest = lines[next].match(/^latest update\s*:\s*v?([0-9]{1,3}(?:\.[0-9]{1,4}){1,3})\b/i);
        if (latest) return latest[1];
        if (/^latest update\b/i.test(lines[next]) || normalize(lines[next]).length < 50 && /^[A-Z0-9][A-Za-z0-9 &:+().-]+$/.test(lines[next])) break;
      }
    }
    return '';
  }
  return versionAfterProduct(text, product.name, product.vendor);
}
function compareVersions(left, right) {
  const a = String(left || '').match(/\d+/g), b = String(right || '').match(/\d+/g);
  if (!a || !b) return null;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = Number(a[i] || 0), y = Number(b[i] || 0);
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}
async function fetchSource(source) {
  const cached = SOURCE_CACHE.get(source.url);
  if (cached && Date.now() - cached.at < 60 * 60 * 1000) return { text: cached.text, raw: cached.raw, title: cached.title };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(source.url, {
      headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'AIMM Vendor Version Checker/1.0' },
      cf: { cacheTtl: 3600, cacheEverything: true },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Publisher page returned HTTP ${response.status}`);
    const declaredLength = Number(response.headers.get('Content-Length') || 0);
    if (declaredLength > 2_000_000) throw new Error('Publisher page is larger than AIMM’s 2 MB safety limit');
    const reader = response.body?.getReader();
    let raw = '';
    if (reader) {
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 2_000_000) {
          await reader.cancel();
          throw new Error('Publisher page is larger than AIMM’s 2 MB safety limit');
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      raw = new TextDecoder().decode(bytes);
    } else {
      raw = await response.text();
      if (raw.length > 2_000_000) throw new Error('Publisher page is larger than AIMM’s 2 MB safety limit');
    }
    const text = htmlText(raw);
    if (!text || text.length < 80) throw new Error('Publisher page returned no readable release information');
    if (SOURCE_CACHE.size > 1000) SOURCE_CACHE.clear();
    const parserHtml = source.parser === 'fabfilter' ? raw : '';
    const titleHtml = source.parser === 'arturia-product' || source.parser === 'product-page' || source.parser === 'melodyne-version-history' || source.parser === 'scaler3-version' || source.parser === 'evabeat-guide'
      ? (raw.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ''
      : source.parser === 'plugin-alliance-product' ? (raw.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || ''
      : source.parser === 'product-query' ? (raw.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '' : '';
    const title = titleHtml ? normalize(htmlText(titleHtml)) : '';
    SOURCE_CACHE.set(source.url, { at: Date.now(), text, raw: parserHtml, title });
    return { text, raw: parserHtml, title };
  } finally {
    clearTimeout(timer);
  }
}
function sourceFor(product) {
  const vendor = normalize(product.vendor);
  if (vendor === 'celemony' && normalize(product.name) === 'melodyne') {
    const hasMajorFive = (product.versions || []).some(version => { const fromFive = compareVersions(version, '5'), beforeSix = compareVersions(version, '6'); return fromFive !== null && beforeSix !== null && fromFive >= 0 && beforeSix < 0; });
    if (!hasMajorFive) return null;
    return VENDOR_SOURCES.find(item => item.id === 'celemony');
  }
  if ((vendor === 'scaler music' || vendor.startsWith('scaler music ')) && normalize(product.name) === 'scaler 3') return VENDOR_SOURCES.find(item => item.id === 'scaler-music');
  if (vendor === 'liquidsonics' || vendor.startsWith('liquidsonics ')) return VENDOR_SOURCES.find(item => item.id === 'liquidsonics');
  if (vendor === 'plugin alliance' || vendor.startsWith('plugin alliance ')) {
    const name = String(product.name || '').replace(/^plugin alliance\s*[:—-]?\s*/i, '').trim().toLowerCase();
    const slug = name.replace(/[^a-z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slug) return null;
    return { id: 'plugin-alliance', url: `https://www.plugin-alliance.com/products/${encodeURIComponent(slug)}`, matches: ['plugin alliance'], parser: 'plugin-alliance-product', expectedProduct: name };
  }
  if ((vendor === 'brainworx' || vendor.startsWith('brainworx ')) && String(product.name || '').toLowerCase().startsWith('bx_')) {
    const name = String(product.name || '').trim().toLowerCase();
    return { id: 'plugin-alliance', url: `https://www.plugin-alliance.com/products/${encodeURIComponent(name)}`, matches: ['brainworx'], parser: 'plugin-alliance-product', expectedProduct: name };
  }
  if (['lindell audio', 'lindellplugins', 'unfiltered audio', 'spl', 'shadow hills', 'elysia', 'maag audio', 'amek', 'chandler limited', 'dangerous music', 'knif audio', 'looptrotter', 'millennia', 'purple audio', 'vertigo'].some(label => vendor === label || vendor.startsWith(label + ' '))) {
    const name = String(product.name || '').trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slug) return null;
    return { id: 'plugin-alliance', url: `https://www.plugin-alliance.com/products/${encodeURIComponent(slug)}`, matches: [vendor], parser: 'plugin-alliance-product', expectedProduct: name };
  }
  if (vendor === 'arturia' || vendor.startsWith('arturia ')) {
    const requested = normalize(String(product.name || '').replace(/^arturia\s*[:—-]?\s*/i, '').replace(/\s*\((?:au|vst2?|vst3|clap)\)\s*$/i, '').replace(/\s+(?:au|vst2?|vst3|clap)\s*$/i, ''));
    if (requested === 'mini v' && !(product.versions || []).some(version => { const comparison = compareVersions(version, '4'); return comparison !== null && comparison >= 0; })) return null;
    const entry = ARTURIA_PRODUCTS.get(requested);
    if (!entry) return null;
    return { id: 'arturia', url: `https://www.arturia.com/support/downloads-manuals/product/${entry.slug}`, matches: ['arturia'], parser: 'arturia-product', expectedProduct: entry.product, expectedTitles: entry.titles };
  }
  if ((vendor === 'wavesfactory' || vendor.startsWith('wavesfactory ')) && normalize(product.name).startsWith('trackspacer')) {
    // Trackspacer 2.0 and 2.5 are separate projects and may coexist. Only
    // compare the 2.5 line to the public 2.5.x changelog.
    if ((product.versions || []).some(version => compareVersions(version, '2.5') === -1)) return null;
  }
  if (vendor === 'sonible' || vendor.startsWith('sonible ')) {
    const productName = normalize(String(product.name || '').replace(/^sonible\s*[:—-]?\s*/i, ''));
    const match = SONIBLE_PRODUCTS.get(productName);
    if (!match) return null;
    return { id: 'sonible', url: `https://www.sonible.com/${match[1]}/`, parser: 'product-page', matches: ['sonible'], expectedProduct: match[0] };
  }
  if (vendor === 'waves' || vendor.startsWith('waves ')) {
    const name = normalize(product.name);
    if (/^(?:q clone|curves equator|curves resolve|ir1(?: series)?|irlive|gtr(?: series)?|tune real time|x noise|z noise)$/.test(name)) return null;
  }
  if (vendor.startsWith('altitude')) {
    const name = normalize(product.name);
    if (name.includes('crossfeed')) return VENDOR_SOURCES.find(item => item.id === 'altitude-crossfeed');
    if (name.includes('limiter')) return VENDOR_SOURCES.find(item => item.id === 'altitude-limiter');
    return null;
  }
  const source = VENDOR_SOURCES.find(item => item.id !== 'altitude-crossfeed' && item.id !== 'altitude-limiter' && item.matches.some(match => vendor === match || vendor.startsWith(match + ' '))) || null;
  if (source?.parser === 'product-query') {
    const queryName = String(product.name || '').replace(/^eventide\s*[:—-]?\s*/i, '').trim();
    const officialName = EVENTIDE_PRODUCTS.get(normalize(queryName));
    if (!officialName) return null;
    return { ...source, expectedTitle: officialName, url: source.url + '?product=' + encodeURIComponent(officialName) };
  }
  return source;
}
function cleanProduct(product) {
  if (!product || typeof product !== 'object') return null;
  const vendor = String(product.vendor || '').trim().slice(0, 120);
  const name = String(product.name || '').trim().slice(0, 180);
  const versions = Array.isArray(product.versions) ? product.versions.map(value => String(value || '').trim().slice(0, 80)).filter(Boolean).slice(0, 12) : [];
  if (!vendor || !name) return null;
  const formats = Array.isArray(product.formats) ? product.formats.map(value => String(value || '').trim().slice(0, 24)).filter(Boolean).slice(0, 8) : [];
  return { vendor, name, versions, formats };
}
async function readRequestBodyLimited(request, maxBytes) {
  const declaredLength = Number(request.headers.get('Content-Length') || 0);
  if (declaredLength > maxBytes) throw new Error('The inventory sent for checking is too large.');
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error('The inventory sent for checking is too large.');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
async function checkVendorSources(request) {
  const origin = request.headers.get('Origin') || '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ ok: false, error: 'Origin is not allowed.' }, 403);
  if (request.method === 'OPTIONS') {
    const headers = new Headers({ ...JSON_HEADERS, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' });
    if (origin) headers.set('Access-Control-Allow-Origin', origin);
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== 'POST') return json({ ok: false, error: 'Use POST for vendor checks.' }, 405, origin);
  const clientKey = request.headers.get('CF-Connecting-IP') || 'unknown-client';
  const minute = Math.floor(Date.now() / 60000);
  const quota = REQUEST_LIMITS.get(clientKey);
  if (quota && quota.minute === minute && quota.count >= 15) return json({ ok: false, error: 'This AIMM server instance is processing fifteen vendor-check batches per minute. Wait a minute, then retry.' }, 429, origin);
  REQUEST_LIMITS.set(clientKey, quota && quota.minute === minute ? { minute, count: quota.count + 1 } : { minute, count: 1 });
  if (REQUEST_LIMITS.size > 500) {
    for (const [key, value] of REQUEST_LIMITS) if (value.minute < minute - 1) REQUEST_LIMITS.delete(key);
    while (REQUEST_LIMITS.size > 500) REQUEST_LIMITS.delete(REQUEST_LIMITS.keys().next().value);
  }
  let raw;
  try { raw = await readRequestBodyLimited(request, MAX_BODY_BYTES); }
  catch (error) { return json({ ok: false, error: String(error?.message || 'The inventory sent for checking is too large.') }, 413, origin); }
  let body;
  try { body = JSON.parse(raw); } catch (_) { return json({ ok: false, error: 'The check request was not valid JSON.' }, 400, origin); }
  if (!Array.isArray(body.products) || body.products.length > MAX_PRODUCTS) return json({ ok: false, error: `Send up to ${MAX_PRODUCTS} installed products per check.` }, 400, origin);
  const products = body.products.map(cleanProduct).filter(Boolean);
  const requestedPageOffset = Math.max(0, Math.floor(Number(body.sourcePageOffset) || 0));
  const rotate = (items, offset) => items.length ? items.slice(offset % items.length).concat(items.slice(0, offset % items.length)) : [];
  const productSources = products.map(sourceFor);
  const allSources = Array.from(new Map(productSources.filter(Boolean).map(source => [source.url, source])).values());
  const sourcesToFetch = [];
  for (const source of rotate(allSources, requestedPageOffset)) {
    if (sourcesToFetch.length >= MAX_SOURCE_PAGES_PER_CHECK) break;
    sourcesToFetch.push(source);
  }
  const allowedSourceUrls = new Set(sourcesToFetch.map(source => source.url));
  const sourceResults = [];
  for (let index = 0; index < sourcesToFetch.length; index += 10) {
    const batch = sourcesToFetch.slice(index, index + 10);
    sourceResults.push(...await Promise.all(batch.map(async source => {
      try { return { source, ...await fetchSource(source), error: '' }; }
      catch (error) { return { source, text: '', error: String(error && error.message || 'Publisher page could not be checked').slice(0, 180) }; }
    })));
  }
  const byUrl = new Map(sourceResults.map(result => [result.source.url, result]));
  const checkedAt = new Date().toISOString();
  const results = products.map(product => {
    const source = sourceFor(product);
    const versions = product.versions;
    if (!versions.length) return { ...product, latestVersion: '', sourceUrl: source?.url || '', checkedAt, status: 'unchecked', reason: 'The folder scan did not find an installed version.' };
    if (!source) return { ...product, latestVersion: '', sourceUrl: '', checkedAt, attempted: false, invalidate: true, status: 'manual-check', reason: 'This publisher does not expose a public version list that AIMM can check automatically.' };
    if (!allowedSourceUrls.has(source.url)) return { ...product, latestVersion: '', sourceUrl: source.url, checkedAt, attempted: false, status: 'manual-check', reason: `This page is queued for a later AIMM check; up to ${MAX_SOURCE_PAGES_PER_CHECK} unique publisher pages are checked per batch.` };
    const sourceResult = byUrl.get(source.url);
    if (sourceResult?.error) return { ...product, latestVersion: '', sourceUrl: source.url, checkedAt, attempted: true, status: 'manual-check', reason: sourceResult.error, sourceError: true };
    let latestVersion = extractSourceVersion({ ...source, pageTitle: sourceResult?.title || '' }, sourceResult?.text || '', product, sourceResult?.raw || '', sourceResult?.title || '');
    if (!latestVersion) return { ...product, latestVersion: '', sourceUrl: source.url, checkedAt, attempted: true, status: 'manual-check', reason: 'AIMM could not find an exact product version in the publisher’s release page.' };
    if (source.parser === 'ssl-table') return { ...product, latestVersion, sourceUrl: source.url, checkedAt, attempted: true, status: 'manual-check', reason: 'SSL publishes the listed AAX version for reference only and notes that AU and VST3 versions may differ; AIMM leaves this plug-in in Manual Check.' };
    if (source.parser === 'sonarworks' && versions.every(version => (String(version).match(/\./g) || []).length === 2)) latestVersion = latestVersion.split('.').slice(0, 3).join('.');
    const installedComparisons = versions.map(version => source.parser === 'waves-suite'
      ? compareVersions((String(version).match(/\d+/) || [''])[0], latestVersion)
      : source.parser === 'softube-suite'
        ? compareVersions((String(version).match(/\d+(?:\.\d+){1,3}/) || [''])[0], latestVersion)
      : compareVersions(version, latestVersion));
    const status = installedComparisons.some(value => value === -1) ? 'updates'
      : installedComparisons.every(value => value === 0) ? 'up-to-date'
      : 'manual-check';
    return { ...product, latestVersion, sourceUrl: source.url, checkedAt, attempted: true, status, reason: status === 'manual-check' ? 'The installed version is newer than or formatted differently from the publisher’s listed version.' : '' };
  });
  const sourceErrors = sourceResults.filter(result => result.error).map(result => ({ publisher: result.source.id, error: result.error }));
  if (allSources.length > allowedSourceUrls.size) sourceErrors.push({ publisher: 'multiple', error: `Checked ${allowedSourceUrls.size} of ${allSources.length} publisher pages in this batch; the remaining pages are queued in the same check.` });
  const nextSourcePageOffset = allSources.length ? (requestedPageOffset + Math.max(1, sourcesToFetch.length)) % allSources.length : 0;
  return json({ ok: true, checkedAt, sourcesChecked: sourceResults.filter(result => !result.error).length, sourcePagesChecked: sourcesToFetch.length, sourcePagesTotal: allSources.length, sourceErrors, nextSourcePageOffset, results }, 200, origin);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/vendor-check') return checkVendorSources(request);
    return env.ASSETS.fetch(request);
  },
};
