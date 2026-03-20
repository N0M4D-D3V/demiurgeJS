import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { setupDomEnv, teardownDomEnv } from '../_helpers/dom-env.js';
import { restoreAllSpies, spyOn } from '../_helpers/spies.js';
import { initModalDelegation, Modal } from '../../../src/core/modal.js';

function click(element) {
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

afterEach(() => {
  Modal.instances.clear();
  restoreAllSpies();
  teardownDomEnv();
});

test('Modal.getOrCreate reuses instances and returns null for null root', (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><div id="m1" class="modal" aria-hidden="true"></div></body></html>',
  });
  const root = document.getElementById('m1');

  const first = Modal.getOrCreate(root);
  const second = Modal.getOrCreate(root);
  const nullModal = Modal.getOrCreate(null);

  assert.ok(first instanceof Modal);
  assert.equal(first, second);
  assert.equal(nullModal, null);
});

test('Modal open close toggle and aria-hidden contract', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <div id="m1" class="modal" aria-hidden="true">
            <button id="inside">Inside</button>
          </div>
        </body>
      </html>
    `,
  });
  const modal = Modal.getOrCreate(document.getElementById('m1'));

  assert.equal(modal.isOpen(), false);
  modal.open();
  assert.equal(modal.isOpen(), true);
  assert.equal(modal.root.getAttribute('aria-hidden'), 'false');

  modal.toggle();
  assert.equal(modal.isOpen(), false);
  assert.equal(modal.root.getAttribute('aria-hidden'), 'true');

  modal.toggle();
  assert.equal(modal.isOpen(), true);
});

test('Modal manages focus transfer on open and focus restore on close', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <button id="trigger">Open</button>
          <div id="m1" class="modal" aria-hidden="true">
            <button id="inside">Inside</button>
          </div>
        </body>
      </html>
    `,
  });
  const trigger = document.getElementById('trigger');
  const inside = document.getElementById('inside');
  const modal = Modal.getOrCreate(document.getElementById('m1'));

  trigger.focus();
  assert.equal(document.activeElement, trigger);

  modal.open();
  assert.equal(document.activeElement, inside);

  modal.close();
  assert.equal(document.activeElement, trigger);
});

test('Escape closes modal only when it is open', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <div id="m1" class="modal" aria-hidden="true">
            <button id="inside">Inside</button>
          </div>
        </body>
      </html>
    `,
  });
  const modal = Modal.getOrCreate(document.getElementById('m1'));

  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(modal.isOpen(), false);

  modal.open();
  assert.equal(modal.isOpen(), true);

  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(modal.isOpen(), false);
});

test('initModalDelegation opens and closes modal via data attributes', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <button id="open" data-modal-open="#m1">Open modal</button>
          <div id="m1" class="modal" aria-hidden="true">
            <button id="close" data-modal-close>Close</button>
          </div>
        </body>
      </html>
    `,
  });

  initModalDelegation(document);
  const modal = Modal.getOrCreate(document.getElementById('m1'));

  click(document.getElementById('open'));
  assert.equal(modal.isOpen(), true);

  click(document.getElementById('close'));
  assert.equal(modal.isOpen(), false);
});

test('initModalDelegation is idempotent for same root', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <button id="open" data-modal-open="#m1">Open modal</button>
          <div id="m1" class="modal" aria-hidden="true">
            <button id="inside">Inside</button>
          </div>
        </body>
      </html>
    `,
  });

  const openSpy = spyOn(Modal.prototype, 'open', t, () => {});
  initModalDelegation(document);
  initModalDelegation(document);

  click(document.getElementById('open'));
  assert.equal(openSpy.calls.length, 1);
});
