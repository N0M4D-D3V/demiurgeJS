(function registerSettingsDetailPage(global) {
  function log(msg) {
    global.DemiurgeDemo?.log?.(msg);
  }

  global.SettingsDetailPage = {
    init() {
      global.DemiurgeDemo?.markPage?.("settings-detail");
      log("SettingsDetailPage.init()");

      const form = document.getElementById("settings-detail-form");
      const status = document.getElementById("settings-detail-status");

      const onSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const name = formData.get("displayName");
        const notifications = formData.get("notifications");
        const mfa = formData.get("mfa") ? "enabled" : "disabled";

        if (status) {
          status.textContent = `saved: ${name}, notifications=${notifications}, mfa=${mfa}`;
        }

        log("Settings detail form submitted (demo only)");
      };

      form?.addEventListener("submit", onSubmit);

      return () => {
        form?.removeEventListener("submit", onSubmit);
        log("SettingsDetailPage init cleanup()");
      };
    },

    teardown() {
      log("SettingsDetailPage.teardown()");
    },
  };
})(window);

