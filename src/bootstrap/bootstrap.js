import { Layout } from "../core/layout.js";
import { PseudoSPA } from "../core/pseudo-spa.js";
import { PageScriptLoader } from "../core/script-loader.js";
import { initModalDelegation } from "../core/modal.js";
import { ASCII_BANNER } from "./banner.js";

// Punto de entrada: monta parciales de layout, resalta el nav activo,
// carga scripts de la vista actual y habilita el router pseudo-SPA.
export async function bootstrapDemiurge(options = {}) {
  const {
    config = window.PageConfig || {},
    layout = Layout,
    scriptLoader = PageScriptLoader,
    PseudoSPAClass = PseudoSPA,
    enableModalDelegation = true,
    logBanner = true,
    routerOptions = {},
  } = options;

  if (enableModalDelegation) {
    initModalDelegation(document);
  }

  const layoutCfg = config.layout || {};

  async function injectLayoutPart(partCfg) {
    if (!partCfg || !partCfg.selector || !partCfg.url) return;
    await layout.injectPartial(partCfg.selector, partCfg.url);
  }

  await Promise.all([
    injectLayoutPart(layoutCfg.header),
    injectLayoutPart(layoutCfg.footer),
  ]);

  if (typeof layout?.markActiveNavLink === "function") {
    const navSelector = layoutCfg.navSelector || "#menu a[href]";
    layout.markActiveNavLink(document, navSelector);
  }

  async function runCurrentPage() {
    const main = document.querySelector("main");
    if (!main) return;

    const pageId = main.getAttribute("data-page");
    if (!pageId) return;

    await scriptLoader.loadForPage(pageId);
  }

  await runCurrentPage();

  const userAfterNavigate = routerOptions.onAfterNavigate;
  const { onAfterNavigate: _ignoredAfterNavigate, ...restRouterOptions } = routerOptions;

  const router = new PseudoSPAClass({
    contentSelector: "main",
    onAfterNavigate: async (url, newDoc) => {
      if (typeof layout?.markActiveNavLink === "function") {
        const navSelector = layoutCfg.navSelector || "#menu a[href]";
        layout.markActiveNavLink(document, navSelector);
      }
      await runCurrentPage();
      if (typeof userAfterNavigate === "function") {
        await userAfterNavigate(url, newDoc);
      }
    },
    ...restRouterOptions,
  });

  router.init();

  if (logBanner) {
    console.log(ASCII_BANNER);
  }

  return router;
}

export default bootstrapDemiurge;
