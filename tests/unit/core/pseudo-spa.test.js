import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { flushMicrotasks, flushTimers } from '../_helpers/flush.js';
import { setupDomEnv, teardownDomEnv } from '../_helpers/dom-env.js';
import { restoreAllSpies, spyOn } from '../_helpers/spies.js';
import { defaultShouldHandleLink, PseudoSPA } from '../../../src/core/pseudo-spa.js';

function makeClickEvent(options = {}) {
  return new window.MouseEvent('click', { bubbles: true, cancelable: true, ...options });
}

afterEach(() => {
  restoreAllSpies();
  teardownDomEnv();
});

test('defaultShouldHandleLink rejects hash/mailto/tel/modifiers/target/external/same-url', (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body></body></html>',
    url: 'https://demiurgejs.test/docs#section',
  });

  const rejectCases = [
    { href: '#anchor' },
    { href: 'mailto:hello@demiurgejs.test' },
    { href: 'tel:+34000000000' },
    { href: '/docs', event: makeClickEvent({ ctrlKey: true }) },
    { href: '/docs', event: makeClickEvent({ metaKey: true }) },
    { href: '/docs', event: makeClickEvent({ shiftKey: true }) },
    { href: '/docs', event: makeClickEvent({ altKey: true }) },
    { href: '/docs', target: '_blank' },
    { href: 'https://external.test/docs' },
    { href: '/docs' },
  ];

  for (const scenario of rejectCases) {
    const link = document.createElement('a');
    link.setAttribute('href', scenario.href);
    if (scenario.target) {
      link.setAttribute('target', scenario.target);
    }
    const event = scenario.event ?? makeClickEvent();
    assert.equal(defaultShouldHandleLink(link, event), false);
  }
});

test('defaultShouldHandleLink accepts valid internal navigation', (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body></body></html>',
    url: 'https://demiurgejs.test/docs',
  });
  const link = document.createElement('a');
  link.setAttribute('href', '/docs/guide?step=1#intro');

  assert.equal(defaultShouldHandleLink(link, makeClickEvent()), true);
});

test('PseudoSPA init and destroy register and remove listeners', (t) => {
  setupDomEnv(t);
  const docAdd = spyOn(document, 'addEventListener', t);
  const winAdd = spyOn(window, 'addEventListener', t);
  const docRemove = spyOn(document, 'removeEventListener', t);
  const winRemove = spyOn(window, 'removeEventListener', t);

  const spa = new PseudoSPA();
  spa.init();
  spa.destroy();

  assert.ok(docAdd.calls.some(([type]) => type === 'click'));
  assert.ok(winAdd.calls.some(([type]) => type === 'popstate'));
  assert.ok(docRemove.calls.some(([type]) => type === 'click'));
  assert.ok(winRemove.calls.some(([type]) => type === 'popstate'));
});

test('document click delegation only navigates when shouldHandleLink allows', (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <main data-page="home"></main>
          <a id="go" href="/next"><span id="inner">Go</span></a>
        </body>
      </html>
    `,
    url: 'https://demiurgejs.test/home',
  });

  const shouldHandleLink = spyOn(
    { fn: defaultShouldHandleLink },
    'fn',
    t,
    () => false,
  );
  const spa = new PseudoSPA({ shouldHandleLink: shouldHandleLink.fn });
  const navigateSpy = spyOn(spa, 'navigate', t, () => {});
  spa.init();

  document.getElementById('inner').dispatchEvent(makeClickEvent());
  assert.equal(navigateSpy.calls.length, 0);

  shouldHandleLink.restore();
  const allowSpy = spyOn(
    { fn: defaultShouldHandleLink },
    'fn',
    t,
    () => true,
  );
  spa.options.shouldHandleLink = allowSpy.fn;
  document.getElementById('inner').dispatchEvent(makeClickEvent());
  assert.equal(navigateSpy.calls.length, 1);
});

test('navigate is no-op when already navigating or same URL', (t) => {
  setupDomEnv(t, { url: 'https://demiurgejs.test/current' });
  const spa = new PseudoSPA({ transition: { enabled: false } });
  const beforeSpy = spyOn(spa.options, 'onBeforeNavigate', t);
  const loadSpy = spyOn(spa, 'loadDocument', t, async () => null);

  spa.isNavigating = true;
  spa.navigate('https://demiurgejs.test/next');
  assert.equal(beforeSpy.calls.length, 0);
  assert.equal(loadSpy.calls.length, 0);

  spa.isNavigating = false;
  spa.currentUrl = 'https://demiurgejs.test/current';
  spa.navigate('https://demiurgejs.test/current');
  assert.equal(beforeSpy.calls.length, 0);
  assert.equal(loadSpy.calls.length, 0);
});

test('loadDocument returns parsed document on success and null on non-ok', async (t) => {
  setupDomEnv(t);
  const spa = new PseudoSPA();

  globalThis.fetch = async () => ({
    ok: true,
    text: async () => '<html><head><title>Next</title></head><body><main>Ok</main></body></html>',
  });

  const okDoc = await spa.loadDocument('https://demiurgejs.test/next');
  assert.ok(okDoc);
  assert.equal(okDoc.querySelector('title')?.textContent, 'Next');
  assert.equal(okDoc.querySelector('main')?.textContent, 'Ok');

  globalThis.fetch = async () => ({ ok: false, text: async () => '' });
  const nonOkDoc = await spa.loadDocument('https://demiurgejs.test/missing');
  assert.equal(nonOkDoc, null);
});

test('swapContent replaces main, updates title, pushes history, and scrolls top', (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><head><title>Old</title></head><body><main>Old content</main></body></html>',
    url: 'https://demiurgejs.test/old',
  });
  const spa = new PseudoSPA({ transition: { enabled: false } });
  const pushSpy = spyOn(history, 'pushState', t);
  const scrollSpy = spyOn(window, 'scrollTo', t);

  const newDoc = new DOMParser().parseFromString(
    '<html><head><title>New title</title></head><body><main data-page="new">New content</main></body></html>',
    'text/html',
  );

  spa.swapContent(newDoc, 'https://demiurgejs.test/new', true);

  assert.equal(document.querySelector('main')?.textContent, 'New content');
  assert.equal(document.title, 'New title');
  assert.equal(spa.currentUrl, 'https://demiurgejs.test/new');
  assert.equal(pushSpy.calls.length, 1);
  assert.equal(scrollSpy.calls.length, 1);
});

test('swapContent falls back to location href assignment when required main nodes are missing', (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><main>Current</main></body></html>',
    url: 'https://demiurgejs.test/current',
  });
  const spa = new PseudoSPA();
  const missingMainDoc = new DOMParser().parseFromString(
    '<html><body><section>No main</section></body></html>',
    'text/html',
  );

  spa.swapContent(missingMainDoc, 'https://demiurgejs.test/current#fallback', false);
  assert.equal(window.location.href, 'https://demiurgejs.test/current#fallback');
});

test('navigate applies leave transition and swapContent applies enter transition cleanup', async (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><head><title>Old</title></head><body><main>Current</main></body></html>',
    url: 'https://demiurgejs.test/current',
  });
  const spa = new PseudoSPA({
    transition: {
      enabled: true,
      duration: 5,
      leaveClass: 'spa-leave',
      leaveActiveClass: 'spa-leave-active',
      enterClass: 'spa-enter',
      enterActiveClass: 'spa-enter-active',
    },
  });

  const newDoc = new DOMParser().parseFromString(
    '<html><head><title>Next</title></head><body><main>Next content</main></body></html>',
    'text/html',
  );
  spyOn(spa, 'loadDocument', t, async () => newDoc);

  const currentMain = document.querySelector('main');
  spa.navigate('https://demiurgejs.test/next', { push: true });

  assert.ok(currentMain.classList.contains('spa-leave'));
  assert.ok(currentMain.classList.contains('spa-leave-active'));

  currentMain.dispatchEvent(new Event('transitionend', { bubbles: true }));
  await flushMicrotasks(2);

  const newMain = document.querySelector('main');
  assert.equal(newMain.textContent, 'Next content');
  assert.ok(newMain.classList.contains('spa-enter'));
  assert.ok(newMain.classList.contains('spa-enter-active'));

  await flushTimers(120);
  assert.equal(newMain.classList.contains('spa-enter'), false);
  assert.equal(newMain.classList.contains('spa-enter-active'), false);
});
