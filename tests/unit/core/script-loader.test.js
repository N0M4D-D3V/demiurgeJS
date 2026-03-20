import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import {
  loadForPage,
  loadScript,
  resetScriptLoaderState,
  resolveFunction,
} from '../../../src/core/script-loader.js';
import { setupDomEnv, teardownDomEnv } from '../_helpers/dom-env.js';
import { flushMicrotasks } from '../_helpers/flush.js';
import { restoreAllSpies, spyOn, spyOnConsole } from '../_helpers/spies.js';

function setupScriptAutoLoad(testContext) {
  const nativeAppend = document.head.appendChild;
  return spyOn(document.head, 'appendChild', testContext, (node) => {
    const appended = node;
    const result = nativeAppend.call(document.head, appended);
    queueMicrotask(() => {
      if (typeof appended.onload === 'function') {
        appended.onload();
      }
    });
    return result;
  });
}

afterEach(() => {
  if (globalThis.window) {
    delete globalThis.window.PageConfig;
    delete globalThis.window.App;
  }
  delete globalThis.PageConfig;
  delete globalThis.App;
  restoreAllSpies();
  resetScriptLoaderState();
  teardownDomEnv();
});

test('loadScript resolves immediately when src is empty', async (t) => {
  setupDomEnv(t);
  const appendSpy = spyOn(document.head, 'appendChild', t);

  await loadScript('');
  assert.equal(appendSpy.calls.length, 0);
});

test('loadScript appends script once and prevents duplicate append after load', async (t) => {
  setupDomEnv(t);
  setupScriptAutoLoad(t);

  await loadScript('/assets/shared.js');
  await loadScript('/assets/shared.js');

  const scripts = [...document.querySelectorAll('script[src="/assets/shared.js"]')];
  assert.equal(scripts.length, 1);
});

test('loadScript tracks page scripts with data attributes when requested', async (t) => {
  setupDomEnv(t);
  setupScriptAutoLoad(t);

  await loadScript('/assets/page-home.js', { trackForCleanup: true });

  const script = document.querySelector('script[src="/assets/page-home.js"]');
  assert.ok(script);
  assert.equal(script.dataset.pageScriptLoader, 'true');
  assert.equal(script.dataset.pageScriptSrc, '/assets/page-home.js');
});

test('loadScript rejects and logs on script load error', async (t) => {
  setupDomEnv(t);
  const consoleSpies = spyOnConsole(t, ['error']);
  const nativeAppend = document.head.appendChild;
  spyOn(document.head, 'appendChild', t, (node) => {
    const appended = node;
    const result = nativeAppend.call(document.head, appended);
    queueMicrotask(() => {
      if (typeof appended.onerror === 'function') {
        appended.onerror();
      }
    });
    return result;
  });

  await assert.rejects(() => loadScript('/assets/fail.js'), /Error cargando script: \/assets\/fail\.js/);
  assert.equal(consoleSpies.error.calls.length, 1);
});

test('resolveFunction handles valid path, missing path, and non-function values', (t) => {
  setupDomEnv(t);

  window.App = {
    hooks: {
      init: () => 'ok',
    },
    flags: {
      ready: true,
    },
  };

  const fn = resolveFunction('App.hooks.init');
  const missing = resolveFunction('App.hooks.missing');
  const nonFunction = resolveFunction('App.flags.ready');

  assert.equal(typeof fn, 'function');
  assert.equal(fn(), 'ok');
  assert.equal(missing, null);
  assert.equal(nonFunction, null);
});

test('loadForPage is a no-op when PageConfig is absent', async (t) => {
  setupDomEnv(t);
  const appendSpy = spyOn(document.head, 'appendChild', t);

  await loadForPage('home');
  assert.equal(appendSpy.calls.length, 0);
});

test('loadForPage loads shared scripts and page scripts', async (t) => {
  setupDomEnv(t);
  setupScriptAutoLoad(t);

  window.PageConfig = {
    sharedScripts: ['/assets/shared-a.js', '/assets/shared-b.js'],
    pages: {
      home: {
        scripts: ['/assets/home.js'],
      },
    },
  };

  await loadForPage('home');

  assert.ok(document.querySelector('script[src="/assets/shared-a.js"]'));
  assert.ok(document.querySelector('script[src="/assets/shared-b.js"]'));
  const pageScript = document.querySelector('script[src="/assets/home.js"]');
  assert.ok(pageScript);
  assert.equal(pageScript.dataset.pageScriptLoader, 'true');
});

test('loadForPage runs init cleanup before configured teardown on next navigation', async (t) => {
  setupDomEnv(t);
  setupScriptAutoLoad(t);

  const callOrder = [];
  window.App = {
    pageOneInit() {
      callOrder.push('init');
      return () => {
        callOrder.push('cleanup');
      };
    },
    pageOneTeardown() {
      callOrder.push('teardown');
    },
  };

  window.PageConfig = {
    sharedScripts: [],
    pages: {
      page1: {
        scripts: ['/assets/page1.js'],
        init: 'App.pageOneInit',
        teardown: 'App.pageOneTeardown',
      },
      page2: {
        scripts: ['/assets/page2.js'],
      },
    },
  };

  await loadForPage('page1');
  await loadForPage('page2');

  assert.deepEqual(callOrder, ['init', 'cleanup', 'teardown']);
});

test('loadForPage cleans previous page scripts and reloads them when revisiting page', async (t) => {
  setupDomEnv(t);
  setupScriptAutoLoad(t);

  window.PageConfig = {
    sharedScripts: ['/assets/shared.js'],
    pages: {
      page1: {
        scripts: ['/assets/page1.js'],
      },
      page2: {
        scripts: ['/assets/page2.js'],
      },
    },
  };

  await loadForPage('page1');
  const page1Before = document.querySelectorAll('script[src="/assets/page1.js"]').length;
  assert.equal(page1Before, 1);

  await loadForPage('page2');
  const page1AfterPage2 = document.querySelectorAll('script[src="/assets/page1.js"]').length;
  assert.equal(page1AfterPage2, 0);

  await loadForPage('page1');
  const page1AfterReturn = document.querySelectorAll('script[src="/assets/page1.js"]').length;
  const sharedCount = document.querySelectorAll('script[src="/assets/shared.js"]').length;

  assert.equal(page1AfterReturn, 1);
  assert.equal(sharedCount, 1);
});

test('resetScriptLoaderState clears in-memory script state', async (t) => {
  setupDomEnv(t);
  setupScriptAutoLoad(t);

  await loadScript('/assets/reset-me.js');
  assert.equal(document.querySelectorAll('script[src="/assets/reset-me.js"]').length, 1);

  resetScriptLoaderState();
  await loadScript('/assets/reset-me.js');
  await flushMicrotasks(2);

  assert.equal(document.querySelectorAll('script[src="/assets/reset-me.js"]').length, 2);
});
