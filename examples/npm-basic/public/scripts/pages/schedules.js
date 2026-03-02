(function registerSchedulesPage(global) {
  function log(msg) {
    global.DemiurgeDemo?.log?.(msg);
  }

  global.SchedulesPage = {
    init() {
      global.DemiurgeDemo?.markPage?.("schedules");
      log("SchedulesPage.init()");

      const state = document.getElementById("schedules-script-state");
      if (state) {
        state.textContent = "active (page script loaded)";
      }

      const tbody = document.getElementById("schedules-list");
      const btn = document.getElementById("add-schedule-row");
      let counter = 2;

      const onClick = () => {
        counter += 1;
        if (!tbody) return;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>Generated Schedule ${counter}</td>
          <td>Demo Script</td>
          <td><span class="pill muted">Draft</span></td>
        `;
        tbody.appendChild(row);
        log(`Schedules page added row ${counter}`);
      };

      btn?.addEventListener("click", onClick);

      return () => {
        btn?.removeEventListener("click", onClick);
        log("SchedulesPage init cleanup()");
      };
    },

    teardown() {
      log("SchedulesPage.teardown()");
    },
  };
})(window);

