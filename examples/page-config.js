// this is just an example config file! Use this file in your project as script
window.PageConfig = {
  layout: {
    header: {
      selector: "#app-header",
      url: "/partials/header.html",
    },
    footer: {
      selector: "#app-footer",
      url: "/partials/footer.html",
    },
    // opcional: selector del menú para marcar activo
    navSelector: "#menu a[href]",
  },

  //scripts compartidos para varias páginas
  sharedScripts: ["/scripts/shared/stars.js", "/scripts/shared/snap-scroll.js"],

  pages: {
    index: { scripts: [], init: null },
    systems: {
      scripts: ["/scripts/pages/systems.js"],
      init: "SystemsPage.init",
    },
    portfolio: { scripts: [], init: null },
    aboutme: { scripts: [], init: null },
    blog: { scripts: [], init: null },
    contact: { scripts: [], init: null },
  },
};
