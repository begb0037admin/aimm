import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test } from 'node:test';

// Run separately with puppeteer-core installed or available on NODE_PATH.
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const origin = 'http://localhost';
const assets = new URL('../standalone/assets/', import.meta.url);
const preview = new URL('../docs/handover-assets/jules-fq-align/preview-1000.png', import.meta.url);
const contentTypes = {
  html: 'text/html; charset=utf-8',
  js: 'text/javascript',
  json: 'application/json',
  woff2: 'font/woff2',
};

async function measureInk(page, png, regions) {
  return page.evaluate(async ({ png, regions }) => {
    const image = new Image();
    image.src = 'data:image/png;base64,' + png;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const scale = devicePixelRatio;
    return regions.map(({ left, top, right, bottom, red }) => {
      const x = Math.floor(left * scale);
      const y = Math.floor(top * scale);
      const width = Math.ceil(right * scale) - x;
      const height = Math.ceil(bottom * scale) - y;
      const { data } = context.getImageData(x, y, width, height);
      // Ignore the lightest antialiasing pixels at the edge of each shape.
      for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
          if (data[(row * width + col) * 4] >= red) return (x + col) / scale;
        }
      }
      return null;
    });
  }, { png: Buffer.from(png).toString('base64'), regions });
}

function loadTestStems({ tones, duration, folderTitle }) {
  // PCM stems exercise the real file input and Web Audio playback graph.
  const transfer = new DataTransfer();
  const sampleRate = 44100;
  const frames = sampleRate * duration;
  for (const [name, frequency] of tones) {
    const wav = new DataView(new ArrayBuffer(44 + frames * 2));
    for (const [offset, tag] of [[0, 'RIFF'], [8, 'WAVE'], [12, 'fmt '], [36, 'data']]) {
      for (let i = 0; i < tag.length; i++) wav.setUint8(offset + i, tag.charCodeAt(i));
    }
    wav.setUint32(4, wav.byteLength - 8, true);
    wav.setUint32(16, 16, true);
    wav.setUint16(20, 1, true);
    wav.setUint16(22, 1, true);
    wav.setUint32(24, sampleRate, true);
    wav.setUint32(28, sampleRate * 2, true);
    wav.setUint16(32, 2, true);
    wav.setUint16(34, 16, true);
    wav.setUint32(40, frames * 2, true);
    for (let i = 0; i < frames; i++) {
      wav.setInt16(44 + 2 * i, Math.round(600 * Math.sin(2 * Math.PI * frequency * i / sampleRate)), true);
    }
    const file = new File([wav.buffer], name, { type: 'audio/wav' });
    if (folderTitle) Object.defineProperty(file, 'webkitRelativePath', { value: folderTitle + '/' + name });
    transfer.items.add(file);
  }
  const input = document.getElementById(folderTitle ? 'refFolderInput' : 'refFileInput');
  input.files = transfer.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

test('Fix Queue and Stem mix transport layouts and shared playback', async t => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  try {
    const page = await browser.newPage();
    const viewport = { width: 1280, height: 900, deviceScaleFactor: 2 };
    await page.setViewport(viewport);
    await page.setRequestInterception(true);
    page.on('request', async request => {
      const url = new URL(request.url());
      const contentType = contentTypes[url.pathname.split('.').at(-1)];
      if (url.origin !== origin) return request.abort();
      const body = contentType && await readFile(new URL('.' + url.pathname, assets)).catch(() => null);
      return body ? request.respond({ contentType, body }) : request.respond({ status: 404 });
    });
    await page.goto(origin + '/index.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      document.querySelector('.tab[data-tab="mixcheck"]').click();
      window.toggleHopeRail(true);
    });
    await page.evaluate(loadTestStems, { tones: [['Bass.wav', 110], ['Vocals.wav', 440]], duration: 5 });
    await page.waitForSelector('.mcq-transport [data-stem-mode="drums-bass"]', { visible: true });
    await page.evaluate(() => document.fonts.ready);
    const [previewRank, previewPlay] = await measureInk(page, await readFile(preview), [
      { left: 46, right: 70, top: 90, bottom: 106, red: 90 },
      { left: 46, right: 70, top: 201, bottom: 227, red: 175 },
    ]);
    assert.deepEqual([previewRank, previewPlay], [49, 49.5], 'ink coordinates in Jules’s 2× preview');
    const previewLeft = 28;
    const previewRight = previewLeft + 560;

    for (const width of [1280, 1440, 1500, 1512, 1728, 2400]) {
      await t.test(`${width}px`, async () => {
        await page.setViewport({ ...viewport, width });
        const leftColumn = await page.$('.mcq-left');
        const screenshot = await leftColumn.screenshot();
        const layout = await page.evaluate(() => {
          const box = selector => document.querySelector(selector).getBoundingClientRect();
          const rail = document.getElementById('hopeRail');
          const column = box('.mcq-left');
          const inkRegion = (selector, red) => {
            const { left, top, right, bottom } = box(selector);
            return {
              left: left - column.left - 1,
              right: right - column.left,
              top: top - column.top,
              bottom: bottom - column.top,
              red,
            };
          };
          const labels = [...document.querySelectorAll('.mcq-transport .mc-stem-mode')].map(button => {
            const range = document.createRange();
            range.selectNodeContents(button);
            const { left, right, top } = range.getBoundingClientRect();
            return { text: button.textContent, left, right, top, lines: range.getClientRects().length };
          });
          return {
            railOpen: document.body.classList.contains('rail-open') && rail.getBoundingClientRect().width > 0
              && rail.contains(document.querySelector('.aichat-layout')),
            ranks: [...document.querySelectorAll('.mcq-rank')].map(rank => rank.getBoundingClientRect().left),
            playLeft: box('.mcq-transport .mc-play-toggle').left,
            playRight: box('.mcq-transport .mc-play-toggle').right,
            toggleCount: document.querySelectorAll('.mcq-transport > button').length,
            leftColumnWidth: column.width,
            leftColumnRight: column.right,
            actions: [...document.querySelectorAll('.mcq-row-actions')].map(row =>
              [...row.children].map(button => button.getBoundingClientRect().left - column.right)),
            inkRegions: [inkRegion('.mcq-rank', 90), inkRegion('.mcq-transport .mc-play-toggle', 175)],
            viewportOverflow: document.documentElement.scrollWidth - innerWidth,
            labels,
          };
        });
        assert.ok(layout.railOpen, 'Hope rail is visible and docked');
        assert.ok(layout.ranks.length >= 2, 'at least two numbered fixes are visible');
        for (const left of layout.ranks) {
          assert.equal(layout.playLeft, left, 'play button and rank share the same box start');
        }
        const [rankInk, playInk] = await measureInk(page, screenshot, layout.inkRegions);
        assert.ok(rankInk !== null && playInk !== null, 'Chrome painted both the rank and the play glyph');
        assert.ok(Math.abs(playInk - rankInk) <= 1, `rank ink at ${rankInk}px and play ink at ${playInk}px`);
        assert.ok(Math.abs(rankInk - (previewRank - previewLeft)) <= 1, 'rank ink matches the preview inset');
        assert.ok(Math.abs(playInk - (previewPlay - previewLeft)) <= 1, 'play ink matches the preview inset');
        for (const actions of layout.actions) {
          assert.deepEqual(actions, [518 - previewRight, 552 - previewRight],
            'each row matches the tick and cross positions relative to the preview’s right edge');
        }
        const { labels } = layout;
        assert.deepEqual(labels.map(label => label.text), ['Full song', 'Vocals only', 'Instrumental', 'Drums + Bass']);
        assert.ok(labels.every(label => label.lines === 1 && Math.abs(label.top - labels[0].top) <= 1),
          'all four stem labels occupy one line');
        assert.equal(layout.toggleCount, 1, 'one playback button beside the stem choices');
        const compact = layout.leftColumnWidth < 506;
        assert.ok(Math.abs(labels[0].left - layout.playRight - 36) <= 1,
          '36px gap from Play to Full song');
        for (let i = 1; i < labels.length; i++) {
          assert.ok(Math.abs(labels[i].left - labels[i - 1].right - (compact ? 20 : 36)) <= 1,
            'approved gap between stem labels');
        }
        assert.ok(labels.at(-1).right <= layout.leftColumnRight - 16, 'stem labels fit inside the row’s right inset');
        assert.ok(layout.viewportOverflow <= 0, 'no horizontal viewport overflow');
        t.diagnostic(`${width}px viewport, ${layout.leftColumnWidth}px left column, rank/play ink ${rankInk}/${playInk}px from its left edge`);
      });
    }

    for (const width of [900, 899, 506, 505.5, 458, 457.5, 344]) {
      await t.test(`${width}px card content`, async () => {
        const layout = await page.evaluate(width => {
          const card = document.querySelector('#mcActions');
          Object.assign(card.style, { boxSizing: 'content-box', width: width + 'px' });
          const left = card.querySelector('.mcq-left').getBoundingClientRect();
          const detail = card.querySelector('.mcq-detail').getBoundingClientRect();
          const list = card.querySelector('.mcq-list').getBoundingClientRect();
          const transport = card.querySelector('.mcq-transport').getBoundingClientRect();
          const play = card.querySelector('.mcq-transport .mc-play-toggle').getBoundingClientRect();
          const modes = card.querySelector('.mc-stem-modes');
          return {
            columnWidth: left.width,
            stacked: detail.top > left.top && detail.left === left.left,
            spaceAfterList: transport.top - list.bottom,
            modeTop: modes.getBoundingClientRect().top,
            modeLeft: modes.getBoundingClientRect().left,
            play: { left: play.left, right: play.right, bottom: play.bottom },
            rowGap: getComputedStyle(modes).rowGap,
            columnGap: getComputedStyle(modes).columnGap,
            labels: [...modes.children].map(label => {
              const range = document.createRange();
              range.selectNodeContents(label);
              return { top: label.offsetTop, right: range.getBoundingClientRect().right, lines: range.getClientRects().length };
            }),
            rightInset: left.right - 16,
          };
        }, width);
        assert.equal(layout.stacked, width < 900);
        assert.equal(layout.columnWidth, width < 900 ? width : 524);
        assert.equal(layout.spaceAfterList, 24);
        assert.equal(layout.columnGap, width < 506 ? '20px' : '36px');
        assert.ok(layout.labels.every(label => label.lines === 1 && label.right <= layout.rightInset),
          'each stem name fits without wrapping inside the right inset');
        if (width < 458) {
          assert.equal(layout.modeLeft, layout.play.left, 'modes start under play');
          assert.equal(layout.modeTop - layout.play.bottom, 12);
          assert.equal(layout.rowGap, '12px');
        } else {
          assert.equal(layout.modeLeft - layout.play.right, 36);
          assert.ok(layout.modeTop < layout.play.bottom, 'play and choices share a row');
        }
        assert.equal(new Set(layout.labels.map(label => label.top)).size, width === 344 ? 2 : 1);
      });
    }
    await t.test('Fix Queue column fits selected, focused and hovered stem labels', async () => {
      const minimum = await page.$eval('.mcq-transport', transport => {
        const card = transport.closest('#mcActions');
        card.style.width = '506px';
        const labels = [...transport.querySelectorAll('.mc-stem-mode')];
        const widthAt = (label, weight) => {
          label.style.fontWeight = weight;
          const width = label.getBoundingClientRect().width;
          label.style.removeProperty('font-weight');
          return width;
        };
        const regular = labels.map(label => widthAt(label, '500'));
        const extra = labels.map((label, index) => widthAt(label, '600') - regular[index])
          .sort((a, b) => b - a);
        const { paddingLeft, paddingRight, columnGap } = getComputedStyle(transport);
        const labelGaps = 3 * parseFloat(getComputedStyle(transport.querySelector('.mc-stem-modes')).columnGap);
        return parseFloat(paddingLeft) + parseFloat(paddingRight) + parseFloat(columnGap) + labelGaps
          + transport.querySelector('.mcq-transport .mc-play-toggle').getBoundingClientRect().width
          + regular.reduce((sum, width) => sum + width, 0) + extra[0] + extra[1] + extra[2];
      });
      assert.equal(Math.ceil(minimum), 506, `single row requires ${minimum}px`);
      t.diagnostic(`Fix Queue requires ${minimum}px with three stem labels at weight 600`);
    });
    await page.$eval('#mcActions', card => card.removeAttribute('style'));
    for (const width of [1000, 1280, 1500, 700]) {
      await t.test(`Stem mix at ${width}px`, async () => {
        await page.setViewport({ ...viewport, width });
        await page.evaluate(() => {
          window.toggleHopeRail(false);
          window.scrollTo(0, 0);
        });
        const png = await page.screenshot();
        const layout = await page.evaluate(() => {
          const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
          const style = (selector, properties) => {
            const computed = getComputedStyle(document.querySelector(selector));
            return properties.map(property => computed[property]);
          };
          return {
            title: box('#mcStemTrackTitle'),
            meta: box('.mc-stem-track-facts'),
            clock: box('.mc-stem-clock'),
            transport: box('.mc-stem-transport'),
            play: box('.mc-stem-transport .mc-play-toggle'),
            transportButtons: document.querySelectorAll('.mc-stem-transport button').length,
            labels: [...document.querySelectorAll('.mc-stem-transport [data-stem-mode]')].map(button => {
              const range = document.createRange();
              range.selectNodeContents(button);
              return { ...button.getBoundingClientRect().toJSON(), text: button.textContent, lines: range.getClientRects().length };
            }),
            surfaces: ['#mcTransport', '#refDropZone', '#mcStemStack', '.mc-stem-transport .mc-play-toggle', '[data-stem-mode]']
              .map(selector => style(selector, ['backgroundColor', 'borderTopWidth', 'borderRadius'])),
            titleStyle: style('#mcStemTrackTitle', ['fontSize', 'fontWeight', 'color']),
            metaStyle: style('.mc-stem-track-facts', ['fontSize', 'fontWeight', 'color']),
            elapsedStyle: style('#mcStemElapsed', ['fontSize', 'fontWeight', 'color']),
            durationStyle: style('#mcStemDuration', ['fontSize', 'fontWeight', 'color']),
            selectedStyle: style('[data-stem-mode][aria-pressed="true"]', ['fontSize', 'fontWeight', 'color']),
            idleStyle: style('[data-stem-mode][aria-pressed="false"]', ['fontSize', 'fontWeight', 'color']),
            overflow: document.documentElement.scrollWidth - innerWidth,
          };
        });
        assert.ok(layout.surfaces.every(surface => surface.join('/') === 'rgba(0, 0, 0, 0)/0px/0px'),
          JSON.stringify(layout.surfaces));
        assert.deepEqual(layout.titleStyle, ['20px', '500', 'rgb(241, 242, 244)']);
        assert.deepEqual(layout.metaStyle, ['13.5px', '400', 'rgb(123, 129, 144)']);
        assert.deepEqual(layout.elapsedStyle, ['14px', '500', 'rgb(232, 235, 238)']);
        assert.deepEqual(layout.durationStyle, ['14px', '500', 'rgb(123, 129, 144)']);
        assert.deepEqual(layout.selectedStyle, ['13.5px', '600', 'rgb(45, 212, 191)']);
        assert.deepEqual(layout.idleStyle, ['13.5px', '500', 'rgb(123, 129, 144)']);
        assert.equal(layout.meta.top - layout.title.bottom, 6);
        assert.equal(layout.clock.top, layout.title.top);
        assert.equal(layout.clock.right, layout.transport.right);
        assert.equal(layout.transport.top - layout.meta.bottom, 24);
        assert.equal(layout.play.left, layout.title.left);
        assert.equal(layout.meta.left, layout.title.left);
        assert.deepEqual([layout.play.width, layout.play.height], [24, 24]);
        assert.equal(layout.transportButtons, 5, 'one play/pause toggle and four stem choices');
        const [titleInk, playInk] = await measureInk(page, png, [layout.title, layout.play]
          .map(box => ({ ...box, right: box.left + 24, red: 175 })));
        assert.ok(titleInk !== null && playInk !== null, 'Chrome painted both the title and play icon');
        assert.ok(Math.abs(playInk - titleInk) <= 1, `title/play ink at ${titleInk}/${playInk}px`);
        const { labels } = layout;
        assert.deepEqual(labels.map(label => label.text), ['Full song', 'Vocals only', 'Instrumental', 'Drums + Bass']);
        assert.ok(labels.every(label => label.lines === 1 && label.top === labels[0].top));
        assert.equal(labels[0].left - layout.play.right, 36);
        for (let i = 1; i < labels.length; i++) assert.equal(labels[i].left - labels[i - 1].right, 36);
        assert.ok(labels.at(-1).right <= layout.transport.right && layout.overflow === 0);
        t.diagnostic(`${width}px viewport, title/play ink ${titleInk}/${playInk}px`);
      });
    }

    await t.test('Stem mix compact gaps and wrapping follow available content width', async () => {
      for (const width of [472, 471.5, 412, 411.5, 300]) {
        const layout = await page.evaluate(width => {
          const stack = document.getElementById('mcStemStack');
          stack.style.width = width + 'px';
          const play = stack.querySelector('.mc-stem-transport .mc-play-toggle').getBoundingClientRect();
          const modes = stack.querySelector('.mc-stem-modes');
          const first = modes.firstElementChild.getBoundingClientRect();
          return {
            gap: getComputedStyle(modes).columnGap,
            inset: first.left - play.left,
            below: modes.getBoundingClientRect().top - play.bottom,
            labelRows: new Set([...modes.children].map(button => button.offsetTop)).size,
            fits: [...modes.children].every(button => button.getBoundingClientRect().right <= stack.getBoundingClientRect().right),
          };
        }, width);
        assert.equal(layout.gap, width < 472 ? '20px' : '36px');
        assert.equal(layout.inset, width < 412 ? 0 : width < 472 ? 48 : 60);
        if (width < 412) assert.equal(layout.below, 12);
        else assert.ok(layout.below < 0, `play and choices share a row at ${width}px`);
        assert.equal(layout.labelRows, width === 300 ? 2 : 1);
        assert.ok(layout.fits);
      }
      await page.$eval('#mcStemStack', stack => stack.style.removeProperty('width'));
    });

    for (const width of [700, 1000, 1280, 1500, 1728]) {
      await t.test(`Shared playback and stem selection at ${width}px`, async () => {
        await page.setViewport({ ...viewport, width, height: 1600 });
        await page.evaluate(open => window.toggleHopeRail(open), width >= 1280);
        const click = async selector => {
          await page.$eval(selector, button => button.scrollIntoView({ block: 'center', behavior: 'instant' }));
          const hit = await page.$eval(selector, button => {
            const { x, y, width, height } = button.getBoundingClientRect();
            const target = document.elementFromPoint(x + width / 2, y + height / 2);
            return {
              x, y, width, height,
              clickable: button.contains(target),
              target: target && target.outerHTML.slice(0, 190),
            };
          });
          assert.ok(hit.clickable, `${selector} hit test failed: ${JSON.stringify(hit)}`);
          await page.click(selector);
        };
        const readSelection = () => page.evaluate(() => [
          document.querySelector('[data-stem-mode][aria-pressed="true"]').dataset.stemMode,
          document.querySelector('.mcq-transport [data-stem-mode][aria-pressed="true"]').dataset.stemMode,
          window.mcStemAnalysis.playbackState().keys.length,
        ]);
        const assertPlayback = async playing => {
          const state = await page.evaluate(() => ({
            controls: [...document.querySelectorAll('.mc-stem-transport .mc-play-toggle, .mcq-transport .mc-play-toggle')].map(button => [
              button.getAttribute('aria-label'), button.title, button.getAttribute('aria-pressed'),
              button.querySelector('use').getAttribute('href'),
            ]),
            engine: window.mcTransport.snapshot(),
          }));
          const label = playing ? 'Pause stem mix' : 'Play stem mix';
          const expected = [label, label, String(playing), playing ? '#i-pause' : '#i-play'];
          assert.deepEqual(state.controls, [expected, expected]);
          assert.equal(state.engine.status, playing ? 'playing' : 'paused');
          return state.engine.elapsed_seconds;
        };
        await click('.mc-stem-transport [data-stem-mode="full"]');
        assert.deepEqual(await readSelection(), ['full', 'full', 2]);
        await click('.mc-stem-transport [data-stem-mode="vocals"]');
        assert.deepEqual(await readSelection(), ['vocals', 'vocals', 1]);
        await click('.mcq-transport [data-stem-mode="instrumental"]');
        assert.deepEqual(await readSelection(), ['instrumental', 'instrumental', 1]);
        await click('.mc-stem-transport .mc-play-toggle');
        await assertPlayback(true);
        await page.waitForFunction(() => window.mcTransport.snapshot().elapsed_seconds > 0.05);
        await click('.mcq-transport .mc-play-toggle');
        const pausedAt = await assertPlayback(false);
        assert.ok(pausedAt > 0.05, 'pause preserves the playhead');
        await click('.mcq-transport .mc-play-toggle');
        assert.ok(await assertPlayback(true) >= pausedAt, 'play resumes from the paused position');
        await click('.mc-stem-transport .mc-play-toggle');
        await assertPlayback(false);
      });
    }

    await t.test('Six uploaded stems switch seamlessly from either transport at 1500px with Hope open', async t => {
      const tones = [['Vocals', 211], ['Drums', 347], ['Bass', 523], ['Guitar', 719], ['Keys', 941], ['Other', 1277]];
      const fixture = { tones: tones.map(([name, hz]) => [name + '.wav', hz]), duration: 12 };
      const switches = [
        ['vocals', ['Vocals']],
        ['instrumental', ['Drums', 'Bass', 'Guitar', 'Keys', 'Other']],
        ['drums-bass', ['Drums', 'Bass']],
        ['full', tones.map(([name]) => name)],
      ];
      await page.setViewport({ ...viewport, width: 1500, height: 1600 });
      await page.goto(origin + '/index.html', { waitUntil: 'domcontentloaded' });
      const read = await page.evaluate(tones => {
        document.querySelector('.tab[data-tab="mixcheck"]').click();
        window.toggleHopeRail(true);
        let analyser;
        const createAnalyser = AudioContext.prototype.createAnalyser;
        AudioContext.prototype.createAnalyser = function () {
          analyser = createAnalyser.call(this);
          return analyser;
        };
        window.stemSourceStarts = 0;
        const start = AudioBufferSourceNode.prototype.start;
        AudioBufferSourceNode.prototype.start = function (...args) {
          window.stemSourceStarts++;
          return start.apply(this, args);
        };
        const elapsed = () => window.mcTransport.snapshot().elapsed_seconds;
        document.addEventListener('keydown', event => {
          if (event.target.matches('[data-stem-mode]')) window.switchBefore = elapsed();
        }, true);
        document.addEventListener('click', event => {
          const choice = event.target.closest('[data-stem-mode]');
          if (choice) window.switchAfter = elapsed();
        });
        window.readStemTransportTest = () => {
          const bins = new Float32Array(analyser.frequencyBinCount);
          analyser.getFloatFrequencyData(bins);
          const heard = tones.filter(([, hz]) => {
            const index = Math.round(hz * analyser.fftSize / analyser.context.sampleRate);
            return Math.max(...bins.slice(index - 1, index + 2)) > -65;
          }).map(([name]) => name);
          const snapshot = window.mcStemAnalysis.snapshot();
          const controls = [...document.querySelectorAll('[data-stem-transport]')].map(host =>
            [...host.querySelectorAll('button')].map(button => [
              button.textContent, button.getAttribute('aria-label'), button.title, button.tabIndex,
              button.getAttribute('aria-pressed'), button.getAttribute('aria-disabled'),
            ]));
          const focus = document.activeElement;
          const style = getComputedStyle(focus);
          return {
            heard, controls, starts: window.stemSourceStarts,
            before: window.switchBefore, after: window.switchAfter,
            engine: window.mcTransport.snapshot(),
            audible: snapshot.playbackStems, audition: snapshot.auditionStems,
            focus: [focus.dataset.stemMode, style.outlineWidth, style.outlineColor, style.color],
          };
        };
        return [innerWidth, document.body.classList.contains('rail-open'),
          !!document.querySelector('#hopeRailBody .aichat-layout')];
      }, tones);
      assert.deepEqual(read, [1500, true, true]);
      await page.evaluate(loadTestStems, fixture);
      await page.waitForSelector('.mcq-transport [data-stem-mode="full"]', { visible: true });
      await page.$eval('.mc-stem-row[data-role="guitar"]', row => row.click());
      const compare = async (mode, expected) => {
        try {
          await page.waitForFunction(expected => window.readStemTransportTest().heard.join() === expected.join(),
            { timeout: 3000 }, expected);
        } catch (error) {
          const actual = await page.evaluate(() => window.readStemTransportTest());
          throw new Error('Expected ' + mode + ' audio ' + expected.join(', ') + ', got ' + JSON.stringify(actual), { cause: error });
        }
        const state = await page.evaluate(() => window.readStemTransportTest());
        assert.deepEqual(state.controls[0], state.controls[1]);
        assert.deepEqual(state.audible, expected);
        assert.deepEqual(state.heard, expected);
        assert.deepEqual(state.audition, ['Guitar']);
        assert.equal(state.engine.status, 'playing');
        assert.equal(state.controls[0][0][1], 'Pause stem mix');
        assert.deepEqual(state.controls[0].slice(1).filter(control => control[4] === 'true').map(control => control[0]),
          [{ full: 'Full song', vocals: 'Vocals only', instrumental: 'Instrumental', 'drums-bass': 'Drums + Bass' }[mode]]);
        return state;
      };
      const traces = [];
      for (const host of ['.mc-stem-transport', '.mcq-transport']) {
        const play = host + ' .mc-play-toggle';
        await page.click(play);
        const full = await compare('full', tones.map(([name]) => name));
        assert.equal(full.starts, (traces.length + 1) * 6);
        await page.waitForFunction(() => window.mcTransport.snapshot().elapsed_seconds > 0.30);
        const trace = [];
        for (const [mode, expected] of switches) {
          await page.$eval(host + ' [data-stem-mode="' + mode + '"]', button => button.focus());
          await page.keyboard.press('Space');
          const state = await compare(mode, expected);
          assert.ok(state.before >= 0.30 && state.after >= state.before && state.after - state.before < 0.20,
            JSON.stringify({ before: state.before, after: state.after }));
          assert.equal(state.starts, full.starts, 'mode changes keep every source running');
          assert.deepEqual(state.focus, [mode, '2px', 'rgb(45, 212, 191)', 'rgb(45, 212, 191)']);
          t.diagnostic(`${host} ${mode} ${state.before.toFixed(2)} → ${state.after.toFixed(2)} s | audio ${state.heard.join(', ')} | audition ${state.audition.join(', ')}`);
          trace.push([state.controls, state.heard, state.audition]);
        }
        await page.click(play);
        const paused = await page.evaluate(() => window.readStemTransportTest());
        assert.equal(paused.engine.status, 'paused');
        assert.ok(paused.engine.elapsed_seconds >= 0.30);
        assert.deepEqual(paused.controls[0], paused.controls[1]);
        assert.equal(paused.controls[0][0][1], 'Play stem mix');
        t.diagnostic(`${host} paused at ${paused.engine.elapsed_seconds.toFixed(2)} s`);
        traces.push(trace);
        await page.evaluate(() => window.mcTransport.stop());
      }
      assert.deepEqual(traces[0], traces[1]);

      await page.click('.mcq-transport [data-stem-mode="vocals"]');
      assert.equal(await page.evaluate(() => window.mcTransport.snapshot().status), 'stopped');
      await page.click('.mc-stem-transport .mc-play-toggle');
      await compare('vocals', ['Vocals']);
      await page.click('.mcq-transport .mc-play-toggle');
      await page.evaluate(loadTestStems, { ...fixture, folderTitle: 'Next song', duration: 5 });
      await page.waitForSelector('.mcq-transport [data-stem-mode="full"]', { visible: true });
      const reset = await page.evaluate(() => window.readStemTransportTest());
      assert.deepEqual(reset.controls[0], reset.controls[1]);
      assert.equal(reset.controls[0][1][4], 'true');
      assert.equal(reset.engine.status, 'stopped');
      assert.equal(reset.engine.elapsed_seconds, 0);
      assert.deepEqual(reset.audition, []);
    });

    await t.test('Stem mix transport ignores disabled controls with no playable stems', async () => {
      await page.goto(origin + '/index.html', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        document.querySelector('.tab[data-tab="mixcheck"]').click();
        const transfer = new DataTransfer();
        for (const name of ['Broken Bass.wav', 'Broken Vocals.wav']) {
          transfer.items.add(new File(['invalid'], name, { type: 'audio/wav' }));
        }
        const input = document.getElementById('refFileInput');
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForSelector('#mcStemStack .mc-stem-row[data-status="error"]', { visible: true, timeout: 5000 });
      const disabled = await page.$eval('#mcStemStack', stack => {
        const buttons = [...stack.querySelectorAll('.mc-stem-transport button')];
        buttons[0].click();
        buttons[2].click();
        return {
          empty: stack.dataset.empty,
          clock: stack.querySelector('.mc-stem-clock').textContent,
          selected: stack.querySelector('[data-stem-mode][aria-pressed="true"]').dataset.stemMode,
          controls: buttons.map(button => {
            const style = getComputedStyle(button);
            return [button.getAttribute('aria-disabled'), button.tabIndex, style.opacity, style.cursor, style.color];
          }),
        };
      });
      assert.equal(disabled.empty, 'true');
      assert.equal(disabled.clock, '0:00/0:00');
      assert.equal(disabled.selected, 'full');
      assert.deepEqual(disabled.controls[0], ['true', -1, '0.4', 'default', 'rgb(232, 235, 238)']);
      assert.ok(disabled.controls.slice(1).every(control => control.join('/') === 'true/-1/0.4/default/rgb(123, 129, 144)'));
    });
  } finally {
    await browser.close();
  }
});
