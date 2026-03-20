import assert from 'node:assert/strict';
import { test } from 'node:test';

import { attachDemiurgeToGlobal } from '../../../src/entries/browser-global.js';

test('attachDemiurgeToGlobal merges exports, assigns legacy aliases, and initializes modal delegation', () => {
  const modalInitCalls = [];
  const exportsObject = {
    Layout: { name: 'Layout' },
    PseudoSPA: { name: 'PseudoSPA' },
    PageScriptLoader: { name: 'PageScriptLoader' },
    Modal: { name: 'Modal' },
    initModalDelegation(doc) {
      modalInitCalls.push(doc);
    },
    bootstrapDemiurge() {},
  };

  const doc = { nodeType: 9 };
  const globalObj = {
    Demiurge: {
      previous: true,
      keep: 'value',
    },
  };

  const merged = attachDemiurgeToGlobal(globalObj, exportsObject, doc);

  assert.equal(merged.previous, true);
  assert.equal(merged.keep, 'value');
  assert.equal(merged.Layout, exportsObject.Layout);
  assert.equal(globalObj.Layout, exportsObject.Layout);
  assert.equal(globalObj.PseudoSPA, exportsObject.PseudoSPA);
  assert.equal(globalObj.PageScriptLoader, exportsObject.PageScriptLoader);
  assert.equal(globalObj.Modal, exportsObject.Modal);
  assert.equal(modalInitCalls.length, 1);
  assert.equal(modalInitCalls[0], doc);
});

test('attachDemiurgeToGlobal skips modal delegation when document is missing', () => {
  let called = 0;
  const exportsObject = {
    Layout: {},
    PseudoSPA: {},
    PageScriptLoader: {},
    Modal: {},
    initModalDelegation() {
      called += 1;
    },
  };

  const globalObj = {};
  attachDemiurgeToGlobal(globalObj, exportsObject, undefined);

  assert.equal(called, 0);
});

test('attachDemiurgeToGlobal returns null when global object is unavailable', () => {
  const result = attachDemiurgeToGlobal(null, {}, undefined);
  assert.equal(result, null);
});
