import { bootstrapDemiurge } from "@n0m4d-d3v/demiurgejs";
import "@n0m4d-d3v/demiurgejs/style.css";

// Consumer-owned config. DemiurgeJS reads it and wires the architecture.
window.PageConfig = {
  layout: {
    header: { selector: "#app-header", url: "/partials/header.html" },
    footer: { selector: "#app-footer", url: "/partials/footer.html" },
    navSelector: "#menu a[href]",
  },
  sharedScripts: [
    "/scripts/shared/demo-shell.js",
    "/scripts/shared/demo-telemetry.js",
  ],
  pages: {
    home: {
      scripts: ["/scripts/pages/home.js"],
      init: "HomePage.init",
      teardown: "HomePage.teardown",
    },
    schedules: {
      scripts: ["/scripts/pages/schedules.js"],
      init: "SchedulesPage.init",
      teardown: "SchedulesPage.teardown",
    },
    "schedule-detail": {
      scripts: ["/scripts/pages/schedule-detail.js"],
      init: "ScheduleDetailPage.init",
      teardown: "ScheduleDetailPage.teardown",
    },
    settings: {
      scripts: ["/scripts/pages/settings.js"],
      init: "SettingsPage.init",
      teardown: "SettingsPage.teardown",
    },
    "settings-detail": {
      scripts: ["/scripts/pages/settings-detail.js"],
      init: "SettingsDetailPage.init",
      teardown: "SettingsDetailPage.teardown",
    },
  },
};

bootstrapDemiurge().then((router) => {
  window.__demiurgeRouter = router;
});
