(function registerHomePage(global) {
  function updateHeartbeat() {
    const node = document.getElementById("home-heartbeat");
    if (!node) return;
    node.textContent = `tick ${new Date().toLocaleTimeString()}`;
  }

  function log(msg) {
    global.DemiurgeDemo?.log?.(msg);
  }

  global.HomePage = {
    init() {
      global.DemiurgeDemo?.markPage?.("home");
      log("HomePage.init()");

      updateHeartbeat();
      const intervalId = window.setInterval(updateHeartbeat, 1000);

      const btn = document.getElementById("home-log-btn");
      const onClick = () => log("Home page button clicked");
      btn?.addEventListener("click", onClick);

      return () => {
        window.clearInterval(intervalId);
        btn?.removeEventListener("click", onClick);
        log("HomePage init cleanup()");
      };
    },

    teardown() {
      log("HomePage.teardown()");
    },
  };
})(window);

