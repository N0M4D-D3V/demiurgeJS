import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { bootstrapDemiurge } from '../../../src/bootstrap/bootstrap.js';
import { setupDomEnv, teardownDomEnv } from '../_helpers/dom-env.js';
import { restoreAllSpies, spyOnConsole } from '../_helpers/spies.js';

class RouterStub {
  static instances = [];

  constructor(options) {
    this.options = options;
    this.initCalls = 0;
    RouterStub.instances.push(this);
  }

  init() {
    this.initCalls += 1;
  }
}

afterEach(() => {
  RouterStub.instances.length = 0;
  restoreAllSpies();
  teardownDomEnv();
});

test('bootstrapDemiurge orchestrates layout, scripts, router callbacks, and banner toggles', async (t) => {
  setupDomEnv(t, {
    html: `
      <!doctype html>
      <html>
        <body>
          <header id="header-slot"></header>
          <main data-page="home"></main>
          <footer id="footer-slot"></footer>
        </body>
      </html>
    `,
  });

  const calls = {
    partials: [],
    markActive: [],
    pages: [],
    modalInit: [],
    userAfterNavigate: [],
  };

  const layout = {
    async injectPartial(selector, url) {
      calls.partials.push([selector, url]);
    },
    markActiveNavLink(doc, selector) {
      calls.markActive.push([doc, selector]);
    },
  };

  const scriptLoader = {
    async loadForPage(pageId) {
      calls.pages.push(pageId);
    },
  };

  const modalDelegationInit = (doc) => {
    calls.modalInit.push(doc);
  };

  const router = await bootstrapDemiurge({
    config: {
      layout: {
        header: { selector: '#header-slot', url: '/partials/header.html' },
        footer: { selector: '#footer-slot', url: '/partials/footer.html' },
        navSelector: '#menu a[href]',
      },
    },
    layout,
    scriptLoader,
    PseudoSPAClass: RouterStub,
    modalDelegationInit,
    logBanner: false,
    routerOptions: {
      transition: { enabled: false },
      onAfterNavigate: async (url, newDoc) => {
        calls.userAfterNavigate.push([url, newDoc]);
      },
    },
  });

  assert.equal(calls.modalInit.length, 1);
  assert.equal(calls.modalInit[0], document);
  assert.deepEqual(calls.partials, [
    ['#header-slot', '/partials/header.html'],
    ['#footer-slot', '/partials/footer.html'],
  ]);
  assert.equal(calls.markActive.length, 1);
  assert.deepEqual(calls.markActive[0], [document, '#menu a[href]']);
  assert.deepEqual(calls.pages, ['home']);

  assert.equal(RouterStub.instances.length, 1);
  assert.equal(router, RouterStub.instances[0]);
  assert.equal(router.initCalls, 1);
  assert.equal(router.options.contentSelector, 'main');
  assert.deepEqual(router.options.transition, { enabled: false });

  const fakeDoc = { body: true };
  await router.options.onAfterNavigate('/docs', fakeDoc);

  assert.equal(calls.markActive.length, 2);
  assert.equal(calls.pages.length, 2);
  assert.deepEqual(calls.pages, ['home', 'home']);
  assert.deepEqual(calls.userAfterNavigate, [['/docs', fakeDoc]]);
});

test('bootstrapDemiurge respects modal delegation disable and logBanner enable', async (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><main data-page="home"></main></body></html>',
  });

  const consoleSpies = spyOnConsole(t, ['log']);
  let modalDelegationCalls = 0;

  await bootstrapDemiurge({
    config: {},
    layout: {
      async injectPartial() {},
      markActiveNavLink() {},
    },
    scriptLoader: {
      async loadForPage() {},
    },
    PseudoSPAClass: RouterStub,
    modalDelegationInit() {
      modalDelegationCalls += 1;
    },
    enableModalDelegation: false,
    logBanner: true,
  });

  assert.equal(modalDelegationCalls, 0);
  assert.equal(consoleSpies.log.calls.length, 1);
});

test('bootstrapDemiurge skips script loading when main or data-page is missing', async (t) => {
  setupDomEnv(t, {
    html: '<!doctype html><html><body><section>No main</section></body></html>',
  });

  const loadCalls = [];

  await bootstrapDemiurge({
    config: {},
    layout: {
      async injectPartial() {},
      markActiveNavLink() {},
    },
    scriptLoader: {
      async loadForPage(pageId) {
        loadCalls.push(pageId);
      },
    },
    PseudoSPAClass: RouterStub,
    logBanner: false,
    enableModalDelegation: false,
  });

  assert.equal(loadCalls.length, 0);
});
