// Example consumer config for DemiurgeJS (global/script usage).
// Load this before calling Demiurge.bootstrapDemiurge() or before the auto-bootstrap build runs.
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
    // Optional selector for active nav marking
    navSelector: "#menu a[href]",
  },

  // Shared scripts loaded on every view
  sharedScripts: ["/scripts/shared/stars.js", "/scripts/shared/snap-scroll.js"],

  pages: {
    index: { scripts: [], init: null },
    systems: {
      scripts: ["/scripts/pages/systems.js"],
      init: "SystemsPage.init",
      teardown: "SystemsPage.teardown",
    },
    portfolio: { scripts: [], init: null },
    aboutme: { scripts: [], init: null },
    blog: { scripts: [], init: null },
    contact: { scripts: [], init: null },
  },
};
