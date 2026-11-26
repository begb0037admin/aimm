import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { test } from 'node:test';

// Run separately with puppeteer-core installed or available on NODE_PATH.
const puppeteer = createRequire(import.meta.url)('puppeteer-core');
const origin = 'http://localhost';
const assets = new URL('../standalone/assets/', import.meta.url);
const contentTypes = { html: 'text/html', js: 'text/javascript', json: 'application/json', woff2: 'font/woff2' };
const grey = 'rgb(123, 129, 144)';
const teal = 'rgb(45, 212, 191)';
const rows = '#hopeRail .aichat-actions-row';
const play = '[data-speak-idx="1"]';
const star = '[data-msg-idx="1"] .aichat-favourite';
const copy = '[data-msg-idx="1"] .aichat-copy-btn';

test('Hope reply actions match Option B in Chrome', async t => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  try {
    for (const width of [1500, 560]) {
      await t.test(`${width}px`, async () => {
        const page = await browser.newPage();
        try {
          await page.setViewport({ width, height: 1000 });
          await page.setRequestInterception(true);
          page.on('request', async request => {
            const url = new URL(request.url());
            if (url.origin !== origin) return request.abort();
            const contentType = contentTypes[url.pathname.split('.').at(-1)];
            const body = contentType && await readFile(new URL('.' + url.pathname, assets)).catch(() => null);
            return body ? request.respond({ contentType, body }) : request.respond({ status: 404 });
          });
          await page.evaluateOnNewDocument(() => {
            localStorage.clear();
            localStorage.setItem('trapMasterAiChatHistory_v2', JSON.stringify([
              { role: 'user', content: 'What should I fix first?' },
              { role: 'ai', content: 'Start with the low end. Listen to the kick and bass together.' },
              { role: 'ai', content: 'Then check your vocal level against the reference.' },
            ]));
            const fetchAsset = window.fetch.bind(window);
            window.fetch = (url, options) => {
              if (String(url) !== '/api/hope/read-aloud') return fetchAsset(url, options);
              window.testHopeReadAloud = { method: options.method, authorization: new Headers(options.headers).get('Authorization') };
              return Promise.resolve(new Response('stub audio', { headers: { 'Content-Type': 'audio/mpeg' } }));
            };
            window.Audio = class {
              async play() { window.testHopeAudio = this; }
              pause() {}
              removeAttribute() {}
              load() {}
            };
            Object.defineProperty(navigator, 'clipboard', {
              value: { async writeText(text) { window.testClipboard = text; } },
            });
          });
          await page.goto(origin + '/index.html', { waitUntil: 'domcontentloaded' });
          await page.evaluate(() => window.toggleHopeRail(true));
          await page.waitForSelector(rows, { visible: true });

          const layout = await page.$$eval(rows, elements => elements.map(row => {
            const bubble = row.previousElementSibling.getBoundingClientRect();
            const bounds = row.getBoundingClientRect();
            return {
              below: bounds.top - bubble.bottom,
              inset: bounds.left - bubble.left,
              right: bounds.right - bubble.right,
              text: row.textContent,
              buttons: [...row.children].map((button, i) => {
                const rect = button.getBoundingClientRect();
                const svg = button.querySelector('svg');
                const style = getComputedStyle(button);
                return {
                  tag: button.tagName, icon: svg.querySelector('use').getAttribute('href'),
                  textNodes: document.createTreeWalker(button, NodeFilter.SHOW_TEXT).nextNode() !== null,
                  size: [rect.width, rect.height], svgSize: [svg.clientWidth, svg.clientHeight],
                  stroke: getComputedStyle(svg).strokeWidth, color: style.color,
                  background: style.backgroundColor, border: style.borderWidth, shadow: style.boxShadow,
                  gap: i ? rect.left - button.previousElementSibling.getBoundingClientRect().right : null,
                  top: rect.top - bounds.top,
                  label: button.getAttribute('aria-label'), title: button.title,
                };
              }),
            };
          }));
          assert.deepEqual(layout.map(row => row.buttons.map(button => button.icon)), [
            ['#i-copy'], ['#i-star', '#i-play', '#i-copy'], ['#i-star', '#i-play', '#i-copy'],
          ]);
          assert.equal(layout[0].right, 0);
          for (const [index, row] of layout.entries()) {
            assert.equal(row.below, 10);
            assert.equal(row.text, '');
            if (index) {
              assert.equal(row.inset, 11);
              assert.deepEqual(row.buttons.map(button => button.label), ['Add to favourites', 'Read aloud', 'Copy reply']);
            }
            for (const [slot, button] of row.buttons.entries()) {
              assert.deepEqual(button, {
                ...button,
                tag: 'BUTTON', textNodes: false, size: [28, 28], svgSize: [18, 18], stroke: '1.8px',
                color: grey, background: 'rgba(0, 0, 0, 0)', border: '0px', shadow: 'none',
                gap: slot ? 20 : null, top: 0, title: button.label,
              });
            }
          }

          const state = selector => page.$eval(selector, button => {
            const use = button.querySelector('use');
            return {
              icon: use.getAttribute('href'), label: button.getAttribute('aria-label'), title: button.title,
              pressed: button.getAttribute('aria-pressed'), text: button.textContent, color: getComputedStyle(use).color,
              fill: getComputedStyle(use).fill, left: button.getBoundingClientRect().left,
            };
          });
          const idle = await state(play);
          await page.keyboard.press('Tab');
          await page.focus(play);
          assert.equal((await state(play)).color, teal);
          await page.$eval(play, button => button.blur());
          await page.click(play);
          await page.waitForFunction(() => window.testHopeAudio);
          assert.deepEqual(await page.evaluate(() => window.testHopeReadAloud), { method: 'POST', authorization: null });
          await page.mouse.move(0, 0);
          const playing = { ...idle, icon: '#i-stop', label: 'Stop reading', title: 'Stop reading', pressed: 'true', color: teal };
          assert.deepEqual(await state(play), playing);
          await page.evaluate(() => aichatRender());
          assert.deepEqual(await state(play), playing);
          await page.click(play);
          await page.mouse.move(0, 0);
          assert.deepEqual(await state(play), idle);

          await page.evaluate(() => { window.testHopeAudio = null; });
          await page.click(play);
          await page.waitForFunction(() => window.testHopeAudio);
          await page.evaluate(() => window.testHopeAudio.onended());
          await page.mouse.move(0, 0);
          assert.deepEqual(await state(play), idle);

          const unstarred = await state(star);
          await page.click(star);
          await page.mouse.move(0, 0);
          assert.deepEqual(await state(star), {
            ...unstarred, label: 'Remove from favourites', title: 'Remove from favourites',
            pressed: 'true', color: teal, fill: teal,
          });
          await page.click(star);
          await page.mouse.move(0, 0);
          assert.deepEqual(await state(star), unstarred);

          const uncopied = await state(copy);
          await page.click(copy);
          await page.mouse.move(0, 0);
          assert.equal(await page.evaluate(() => window.testClipboard), 'Start with the low end. Listen to the kick and bass together.');
          assert.deepEqual(await state(copy), { ...uncopied, icon: '#i-check', label: 'Copied', title: 'Copied', color: teal });
          await page.waitForFunction(selector => document.querySelector(selector).title === 'Copy reply', { timeout: 2000 }, copy);
          assert.deepEqual(await state(copy), uncopied);
        } finally {
          await page.close();
        }
      });
    }
  } finally {
    await browser.close();
  }
});


test('Send streams a Hope reply and shows failures in Chrome without a saved token', async () => {
  const prompt = 'How do I balance the kick and bass?';
  const reply = 'Listen to the kick and bass together, then check the low end in mono.';
  const requests = [];
  let status = 200;
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname === '/api/hope/luna') {
      let raw = '';
      for await (const chunk of request) raw += chunk.toString();
      requests.push({ method: request.method, authorization: request.headers.authorization, body: JSON.parse(raw) });
      response.writeHead(status, { 'Content-Type': status === 200 ? 'text/event-stream' : 'application/json' });
      if (status !== 200) return response.end(JSON.stringify({ error: 'Upstream details' }));
      const sendEvent = event => response.write('data: ' + JSON.stringify(event) + '\n\n');
      sendEvent({ type: 'response.output_text.delta', delta: reply.slice(0, 40) });
      setTimeout(() => {
        sendEvent({ type: 'response.output_text.delta', delta: reply.slice(40) });
        sendEvent({ type: 'response.completed', response: { output: [], usage: { input_tokens: 15, output_tokens: 12 } } });
        response.end();
      }, 100);
      return;
    }
    const contentType = contentTypes[url.pathname.split('.').at(-1)];
    const asset = new URL('.' + url.pathname, assets);
    const body = contentType && asset.href.startsWith(assets.href) && await readFile(asset).catch(() => null);
    if (body) response.writeHead(200, { 'Content-Type': contentType }).end(body);
    else response.writeHead(404).end();
  });
  await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    });
    const localOrigin = 'http://127.0.0.1:' + server.address().port;
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 1000 });
    await page.setRequestInterception(true);
    page.on('request', request => new URL(request.url()).origin === localOrigin ? request.continue() : request.abort());
    await page.goto(localOrigin + '/index.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.toggleHopeRail(true));
    await page.waitForSelector('#aiChatInput', { visible: true });
    const noSavedToken = () => page.evaluate(() => localStorage.getItem('aiMixMastersHopeSttToken_v1') === null);
    assert.equal(await noSavedToken(), true);

    const send = async () => {
      await page.type('#aiChatInput', prompt);
      await page.click('#aiChatSend');
    };
    await send();
    await page.waitForSelector('[data-msg-idx="1"] .aichat-actions-row', { visible: true });
    assert.equal(await page.$eval('[data-msg-idx="1"] .body', element => element.textContent.trim()), reply);
    assert.deepEqual(await page.$$eval('[data-msg-idx="1"] .aichat-actions-row button', buttons =>
      buttons.map(button => button.getAttribute('aria-label'))),
    ['Add to favourites', 'Read aloud', 'Copy reply']);

    for (const [failureStatus, reason] of [
      [401, 'You need to sign in again (refresh the page).'],
      [429, 'Hope is being used too quickly. Wait a minute and try again.'],
      [503, "Hope's service is not available right now."],
    ]) {
      status = failureStatus;
      await send();
      await page.waitForFunction(expected => {
        const message = [...document.querySelectorAll('#aiChatTranscript .aichat-msg.ai .body')].at(-1);
        return message?.textContent.trim() === expected && !!message.getClientRects().length;
      }, {}, reason);
      assert.equal(await page.$eval('#aiChatSend', button => button.disabled), false);
    }
    assert.equal(requests.length, 4);
    for (const request of requests) {
      assert.equal(request.method, 'POST');
      assert.equal(request.authorization, undefined);
      assert.equal(request.body.input.at(-1).content, prompt);
      assert.ok(request.body.tools.length > 0 && request.body.tools.length <= 40);
      assert.ok(request.body.tools.some(tool => tool.name === 'web_search_fallback'));
      assert.ok(Buffer.byteLength(JSON.stringify(request.body)) <= 100_000);
    }
    assert.equal(await noSavedToken(), true);
  } finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
