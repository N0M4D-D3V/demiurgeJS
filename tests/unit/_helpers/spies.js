const activeRestorers = new Set();

function rememberRestore(restore, testContext) {
  activeRestorers.add(restore);

  if (testContext?.after) {
    testContext.after(() => {
      restore();
    });
  }
}

export function restoreAllSpies() {
  for (const restore of [...activeRestorers]) {
    restore();
  }
}

export function spyOn(target, methodName, testContext, implementation) {
  const original = target[methodName];
  const calls = [];

  const spy = (...args) => {
    calls.push(args);
    if (implementation) {
      return implementation(...args);
    }

    return original?.apply(target, args);
  };

  const restore = () => {
    target[methodName] = original;
    activeRestorers.delete(restore);
  };

  target[methodName] = spy;
  rememberRestore(restore, testContext);

  return { calls, restore, fn: spy };
}

export function spyOnConsole(testContext, methods = ['error', 'warn', 'log']) {
  const spies = {};

  for (const method of methods) {
    spies[method] = spyOn(console, method, testContext, () => {});
  }

  return spies;
}

export function mockFetch(testContext, implementation = async () => ({ ok: true })) {
  return spyOn(globalThis, 'fetch', testContext, implementation);
}

export function trackEventListeners(target, testContext) {
  const listeners = [];
  const originalAdd = target.addEventListener;
  const originalRemove = target.removeEventListener;

  const add = spyOn(target, 'addEventListener', testContext, (type, handler, options) => {
    listeners.push({ action: 'add', type, handler, options });
    return originalAdd.call(target, type, handler, options);
  });

  const remove = spyOn(target, 'removeEventListener', testContext, (type, handler, options) => {
    listeners.push({ action: 'remove', type, handler, options });
    return originalRemove.call(target, type, handler, options);
  });

  return {
    listeners,
    restore() {
      remove.restore();
      add.restore();
    },
  };
}
