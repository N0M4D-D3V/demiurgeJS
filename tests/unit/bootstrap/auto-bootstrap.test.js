import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { autoBootstrapDemiurge } from '../../../src/bootstrap/auto-bootstrap.js';
import { restoreAllSpies, spyOnConsole } from '../_helpers/spies.js';

afterEach(() => {
  restoreAllSpies();
});

test('autoBootstrapDemiurge returns bootstrap promise result on success', async () => {
  const result = await autoBootstrapDemiurge(async () => 'ok');
  assert.equal(result, 'ok');
});

test('autoBootstrapDemiurge catches bootstrap errors and logs them', async (t) => {
  const consoleSpies = spyOnConsole(t, ['error']);
  const error = new Error('boom');

  const result = await autoBootstrapDemiurge(async () => {
    throw error;
  });

  assert.equal(result, undefined);
  assert.equal(consoleSpies.error.calls.length, 1);
  assert.equal(consoleSpies.error.calls[0][0], 'Error during Demiurge bootstrap:');
  assert.equal(consoleSpies.error.calls[0][1], error);
});
