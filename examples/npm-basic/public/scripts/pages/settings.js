(function registerSettingsPage(global) {
  function log(msg) {
    global.DemiurgeDemo?.log?.(msg);
  }

  function buildPreview() {
    const ids = ["flag-animations", "flag-runtime-log", "flag-modals"];
    return ids
      .map((id) => {
        const input = document.getElementById(id);
        return `${id.replace("flag-", "")}: ${input?.checked ? "on" : "off"}`;
      })
      .join(" | ");
  }

  global.SettingsPage = {
    init() {
      global.DemiurgeDemo?.markPage?.("settings");
      log("SettingsPage.init()");

      const preview = document.getElementById("settings-preview");
      const refreshBtn = document.getElementById("settings-preview-btn");
      const inputs = Array.from(
        document.querySelectorAll("#flag-animations, #flag-runtime-log, #flag-modals")
      );

      const render = () => {
        if (preview) preview.textContent = buildPreview();
      };

      const onInput = () => {
        render();
        log("Settings preview recomputed");
      };

      inputs.forEach((input) => input.addEventListener("change", onInput));
      refreshBtn?.addEventListener("click", onInput);
      render();

      return () => {
        inputs.forEach((input) => input.removeEventListener("change", onInput));
        refreshBtn?.removeEventListener("click", onInput);
        log("SettingsPage init cleanup()");
      };
    },

    teardown() {
      log("SettingsPage.teardown()");
    },
  };
})(window);

