// Punto de entrada: monta parciales de layout, resalta el nav activo,
// carga scripts de la vista actual y habilita el router pseudo-SPA.
const ASCII = `
███████████████████████████████████████████████████████████████████
powered by

  ██████  ███████ ███    ███ ██ ██    ██ ██████   ██████  ███████ 
  ██   ██ ██      ████  ████ ██ ██    ██ ██   ██ ██       ██      
  ██   ██ █████   ██ ████ ██ ██ ██    ██ ██████  ██   ███ █████   
  ██   ██ ██      ██  ██  ██ ██ ██    ██ ██   ██ ██    ██ ██      
  ██████  ███████ ██      ██ ██  ██████  ██   ██  ██████  ███████

  PSEUDO-SPA ARCHITECTURE                                  v0.0.3                                  
███████████████████████████████████████████████████████████████████
`;

document.addEventListener("DOMContentLoaded", async function () {
  const config = window.PageConfig || {};
  const layoutCfg = config.layout || {};

  async function injectLayoutPart(partCfg) {
    if (!partCfg || !partCfg.selector || !partCfg.url) return;
    await Layout.injectPartial(partCfg.selector, partCfg.url);
  }

  // 1) Inyectar layout si hay config
  await Promise.all([
    injectLayoutPart(layoutCfg.header),
    injectLayoutPart(layoutCfg.footer),
  ]);

  // 2) Marcar nav activo si hay Layout y selector de menú
  if (typeof Layout?.markActiveNavLink === "function") {
    const navSelector = layoutCfg.navSelector || "#menu a[href]";
    Layout.markActiveNavLink(document, navSelector);
  }

  // 3) Ejecutar lógica de la página actual
  async function runCurrentPage() {
    const main = document.querySelector("main");
    if (!main) return;

    const pageId = main.getAttribute("data-page");
    if (!pageId) return;

    await PageScriptLoader.loadForPage(pageId);
  }

  await runCurrentPage();

  // 4) Router pseudo-SPA
  const router = new PseudoSPA({
    contentSelector: "main",
    onAfterNavigate: async function (url, newDoc) {
      if (typeof Layout?.markActiveNavLink === "function") {
        const navSelector = layoutCfg.navSelector || "#menu a[href]";
        Layout.markActiveNavLink(document, navSelector);
      }
      await runCurrentPage();
    },
  });

  router.init();
  console.log(ASCII);
});
