import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { injectPartial, markActiveNavLink } from '../../../src/core/layout.js';
import { setupDomEnv, teardownDomEnv } from '../_helpers/dom-env.js';
import { restoreAllSpies, spyOnConsole } from '../_helpers/spies.js';

afterEach(() => {
  restoreAllSpies();
  teardownDomEnv();
});

test('injectPartial returns null when selector does not exist', async (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><main data-page="home"></main></body></html>',
  });
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return { ok: true, text: async () => '<p>ignored</p>' };
  };

  const result = await injectPartial('#missing', '/partials/header.html');
  assert.equal(result, null);
  assert.equal(fetchCalled, false);
});

test('injectPartial returns null and logs when fetch response is not ok', async (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><div id="slot"></div></body></html>',
  });
  const consoleSpies = spyOnConsole(t, ['error']);

  globalThis.fetch = async () => ({
    ok: false,
    status: 503,
    text: async () => '',
  });

  const result = await injectPartial('#slot', '/partials/header.html');

  assert.equal(result, null);
  assert.equal(consoleSpies.error.calls.length, 1);
});

test('injectPartial returns null and logs when fetch throws', async (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><div id="slot"></div></body></html>',
  });
  const consoleSpies = spyOnConsole(t, ['error']);
  const networkError = new Error('network down');

  globalThis.fetch = async () => {
    throw networkError;
  };

  const result = await injectPartial('#slot', '/partials/header.html');

  assert.equal(result, null);
  assert.equal(consoleSpies.error.calls.length, 1);
  assert.equal(consoleSpies.error.calls[0][1], networkError);
});

test('injectPartial injects html and sends LayoutPartial header', async (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><div id="slot"></div></body></html>',
  });

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      text: async () => '<header>Loaded</header>',
    };
  };

  const result = await injectPartial('#slot', '/partials/header.html');

  assert.ok(result);
  assert.equal(result.id, 'slot');
  assert.equal(result.innerHTML, '<header>Loaded</header>');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/partials/header.html');
  assert.equal(calls[0].options.headers['X-Requested-With'], 'LayoutPartial');
});

test('markActiveNavLink applies accent on exact path match', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <nav id="menu">
            <a href="/">Home</a>
            <a href="/docs">Docs</a>
            <a href="/blog">Blog</a>
          </nav>
        </body>
      </html>
    `,
    url: 'https://demiurgejs.test/docs',
  });

  markActiveNavLink(document, '#menu a[href]');

  const links = [...document.querySelectorAll('#menu a[href]')];
  assert.equal(links[0].classList.contains('accent'), false);
  assert.equal(links[1].classList.contains('accent'), true);
  assert.equal(links[2].classList.contains('accent'), false);
});

test('markActiveNavLink normalizes index query hash and trailing slash', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <nav id="menu">
            <a href="/docs/">Docs Slash</a>
            <a href="/docs/index.html?from=menu#top">Docs Index</a>
            <a href="/about">About</a>
          </nav>
        </body>
      </html>
    `,
    url: 'https://demiurgejs.test/docs/index.html?ref=1#section',
  });

  markActiveNavLink(document, '#menu a[href]');

  const links = [...document.querySelectorAll('#menu a[href]')];
  assert.equal(links[0].classList.contains('accent'), true);
  assert.equal(links[1].classList.contains('accent'), false);
  assert.equal(links[2].classList.contains('accent'), false);
});

test('markActiveNavLink avoids false-positive prefix matches at segment boundary', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <nav id="menu">
            <a href="/doc">Doc</a>
            <a href="/docs">Docs</a>
            <a href="/">Home</a>
          </nav>
        </body>
      </html>
    `,
    url: 'https://demiurgejs.test/docs-extra',
  });

  markActiveNavLink(document, '#menu a[href]');

  const links = [...document.querySelectorAll('#menu a[href]')];
  assert.equal(links[0].classList.contains('accent'), false);
  assert.equal(links[1].classList.contains('accent'), false);
  assert.equal(links[2].classList.contains('accent'), false);
});
