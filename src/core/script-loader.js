// Carga scripts declarados en window.PageConfig y evita duplicados entre navegaciones pseudo-SPA.
const loadedScripts = new Set();
let currentPageScripts = new Set();
let currentPageId = null;
let currentInitCleanup = null;

function getGlobal() {
  return typeof window !== "undefined" ? window : globalThis;
}

// Inserta un <script> en <head> y resuelve cuando termina de cargar (o si ya estaba cargado).
export function loadScript(src, { trackForCleanup = false } = {}) {
  return new Promise((resolve, reject) => {
    if (!src) return resolve();

    if (loadedScripts.has(src)) return resolve();

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    if (trackForCleanup) {
      s.dataset.pageScriptLoader = "true";
      s.dataset.pageScriptSrc = src;
    }

    s.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    s.onerror = () => {
      console.error("Error cargando script:", src);
      reject(new Error("Error cargando script: " + src));
    };

    document.head.appendChild(s);
  });
}

// Resuelve un string tipo "Namespace.fn" a una función global; devuelve null si no existe.
export function resolveFunction(path) {
  if (!path) return null;
  const parts = path.split(".");
  let ctx = getGlobal();

  for (const part of parts) {
    ctx = ctx?.[part];
    if (ctx == null) return null;
  }
  return typeof ctx === "function" ? ctx : null;
}

// Ejecuta teardown registrado (init que devolvió cleanup + PageConfig.pages[pageId].teardown).
function runTeardown(config) {
  const pageCfg = config.pages && currentPageId && config.pages[currentPageId];

  if (typeof currentInitCleanup === "function") {
    try {
      currentInitCleanup();
    } catch (err) {
      console.error("Error en cleanup de init:", err);
    }
  }
  currentInitCleanup = null;

  if (pageCfg && pageCfg.teardown) {
    const teardownFn = resolveFunction(pageCfg.teardown);
    if (teardownFn) {
      try {
        teardownFn();
      } catch (err) {
        console.error("Error en teardown de la página:", err);
      }
    }
  }
}

// Elimina scripts exclusivos de la página anterior (se vuelven a cargar si se regresa a ella).
function cleanupPageScripts() {
  if (!currentPageScripts.size) return;

  const nodes = document.querySelectorAll('script[data-page-script-loader="true"]');

  nodes.forEach((node) => {
    const src = node.dataset.pageScriptSrc;
    if (src && currentPageScripts.has(src)) {
      node.remove();
    }
  });

  currentPageScripts.forEach((src) => loadedScripts.delete(src));
  currentPageScripts = new Set();
}

// Carga scripts compartidos + específicos de la página y ejecuta opcionalmente su init.
export async function loadForPage(pageId) {
  const config = getGlobal().PageConfig;
  if (!config) return;

  runTeardown(config);
  cleanupPageScripts();

  const tasks = [];

  if (Array.isArray(config.sharedScripts)) {
    tasks.push(...config.sharedScripts.map(loadScript));
  }

  const pageCfg = config.pages && config.pages[pageId];
  const pageScripts = pageCfg && Array.isArray(pageCfg.scripts) ? pageCfg.scripts : [];

  pageScripts.forEach((src) => currentPageScripts.add(src));
  tasks.push(...pageScripts.map((src) => loadScript(src, { trackForCleanup: true })));

  await Promise.all(tasks);

  if (pageCfg && pageCfg.init) {
    const initFn = resolveFunction(pageCfg.init);
    if (initFn) {
      const res = await initFn();
      if (typeof res === "function") {
        currentInitCleanup = res;
      }
    }
  }

  currentPageId = pageId;
}

export function resetScriptLoaderState() {
  loadedScripts.clear();
  currentPageScripts.clear();
  currentPageId = null;
  currentInitCleanup = null;
}

export const PageScriptLoader = {
  loadForPage,
  loadScript,
  resolveFunction,
  resetScriptLoaderState,
};

export default PageScriptLoader;
