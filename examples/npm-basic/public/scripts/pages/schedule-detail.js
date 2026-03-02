(function registerScheduleDetailPage(global) {
  function log(msg) {
    global.DemiurgeDemo?.log?.(msg);
  }

  global.ScheduleDetailPage = {
    init() {
      global.DemiurgeDemo?.markPage?.("schedule-detail");
      log("ScheduleDetailPage.init()");

      const heartbeat = document.getElementById("schedule-detail-heartbeat");
      let seconds = 0;
      const intervalId = window.setInterval(() => {
        seconds += 1;
        if (heartbeat) {
          heartbeat.textContent = `detail view active for ${seconds}s`;
        }
      }, 1000);

      const btn = document.getElementById("detail-log-btn");
      const onClick = () => log("Schedule detail button clicked");
      btn?.addEventListener("click", onClick);

      return () => {
        window.clearInterval(intervalId);
        btn?.removeEventListener("click", onClick);
        log("ScheduleDetailPage init cleanup()");
      };
    },

    teardown() {
      log("ScheduleDetailPage.teardown()");
    },
  };
})(window);

