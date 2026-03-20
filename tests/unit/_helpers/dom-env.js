import { JSDOM } from 'jsdom';

const DOM_GLOBAL_KEYS = [
  'window',
  'document',
  'navigator',
  'history',
  'location',
  'Element',
  'HTMLElement',
  'Node',
  'Event',
  'CustomEvent',
  'MouseEvent',
  'KeyboardEvent',
  'FocusEvent',
  'PopStateEvent',
  'DOMParser',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'fetch',
];

let activeEnvironment = null;

function applyDomGlobals(domWindow) {
  const previousDescriptors = new Map();

  for (const key of DOM_GLOBAL_KEYS) {
    previousDescriptors.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: domWindow[key],
    });
  }

  return () => {
    for (const key of DOM_GLOBAL_KEYS) {
      const descriptor = previousDescriptors.get(key);
      if (!descriptor) {
        delete globalThis[key];
      } else {
        Object.defineProperty(globalThis, key, descriptor);
      }
    }
  };
}

function createEnvironment({
  html = '<!doctype html><html><head><title>DemiurgeJS Test</title></head><body><main data-page="home"></main></body></html>',
  url = 'https://demiurgejs.test/',
} = {}) {
  const dom = new JSDOM(html, { url });
  const restoreGlobals = applyDomGlobals(dom.window);

  return {
    dom,
    window: dom.window,
    document: dom.window.document,
    cleanup() {
      restoreGlobals();
      dom.window.close();
    },
  };
}

export function teardownDomEnv() {
  if (!activeEnvironment) {
    return;
  }

  activeEnvironment.cleanup();
  activeEnvironment = null;
}

export function resetDomEnv(options = {}) {
  teardownDomEnv();
  activeEnvironment = createEnvironment(options);
  return activeEnvironment;
}

export function setupDomEnv(testContext, options = {}) {
  const environment = resetDomEnv(options);

  if (testContext?.after) {
    testContext.after(() => {
      teardownDomEnv();
    });
  }

  return environment;
}
