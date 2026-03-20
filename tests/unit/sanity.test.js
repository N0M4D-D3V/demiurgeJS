import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { flushAll, flushMicrotasks } from './_helpers/flush.js';
import { setupDomEnv, teardownDomEnv } from './_helpers/dom-env.js';
import { mockFetch, restoreAllSpies, spyOnConsole, trackEventListeners } from './_helpers/spies.js';

afterEach(() => {
  restoreAllSpies();
  teardownDomEnv();
});

test('unit harness bootstraps jsdom with location/history support', (t) => {
  setupDomEnv(t, { url: 'https://demiurgejs.test/initial?page=1#hash' });

  assert.equal(document.querySelector('main')?.dataset.page, 'home');
  assert.equal(location.pathname, '/initial');
  assert.equal(location.search, '?page=1');

  history.pushState({}, '', '/next');
  assert.equal(location.pathname, '/next');
});

test('spies helper controls console, fetch, and event listener tracking', async (t) => {
  setupDomEnv(t);
  const consoleSpies = spyOnConsole(t, ['error']);
  const fetchSpy = mockFetch(t, async (url) => ({ ok: true, url }));
  const listenerTracker = trackEventListeners(document, t);

  const clickHandler = () => {};
  document.addEventListener('click', clickHandler);
  document.removeEventListener('click', clickHandler);

  console.error('sample-error');
  const response = await fetch('/api/ping');

  assert.equal(consoleSpies.error.calls.length, 1);
  assert.equal(fetchSpy.calls.length, 1);
  assert.equal(response.ok, true);
  assert.equal(listenerTracker.listeners.length, 2);
  assert.equal(listenerTracker.listeners[0].action, 'add');
  assert.equal(listenerTracker.listeners[1].action, 'remove');
});

test('flush helper drains microtasks and timers deterministically', async (t) => {
  setupDomEnv(t);
  const callOrder = [];

  Promise.resolve().then(() => {
    callOrder.push('microtask');
  });

  setTimeout(() => {
    callOrder.push('timer');
  }, 0);

  await flushMicrotasks();
  assert.deepEqual(callOrder, ['microtask']);

  await flushAll();
  assert.deepEqual(callOrder, ['microtask', 'timer']);
});
