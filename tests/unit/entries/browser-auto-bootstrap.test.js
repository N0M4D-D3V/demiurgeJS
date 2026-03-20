import assert from 'node:assert/strict';
import { test } from 'node:test';

import { initAutoBootstrap, runAutoBootstrap } from '../../../src/entries/browser-auto-bootstrap.js';

test('runAutoBootstrap delegates to provided function', () => {
  let calls = 0;
  const result = runAutoBootstrap(() => {
    calls += 1;
    return 'ran';
  });

  assert.equal(calls, 1);
  assert.equal(result, 'ran');
});

test('initAutoBootstrap registers DOMContentLoaded handler when document is loading', () => {
  const listeners = [];
  const fakeDoc = {
    readyState: 'loading',
    addEventListener(type, handler, options) {
      listeners.push({ type, handler, options });
    },
  };

  let runCalls = 0;
  const didInit = initAutoBootstrap(fakeDoc, () => {
    runCalls += 1;
  });

  assert.equal(didInit, true);
  assert.equal(runCalls, 0);
  assert.equal(listeners.length, 1);
  assert.equal(listeners[0].type, 'DOMContentLoaded');
  assert.deepEqual(listeners[0].options, { once: true });

  listeners[0].handler();
  assert.equal(runCalls, 1);
});

test('initAutoBootstrap runs immediately when document is already ready', () => {
  const fakeDoc = {
    readyState: 'interactive',
    addEventListener() {
      throw new Error('should not add listener for ready documents');
    },
  };

  let runCalls = 0;
  const didInit = initAutoBootstrap(fakeDoc, () => {
    runCalls += 1;
  });

  assert.equal(didInit, true);
  assert.equal(runCalls, 1);
});

test('initAutoBootstrap returns false when document is unavailable', () => {
  let runCalls = 0;
  const didInit = initAutoBootstrap(undefined, () => {
    runCalls += 1;
  });

  assert.equal(didInit, false);
  assert.equal(runCalls, 0);
});
