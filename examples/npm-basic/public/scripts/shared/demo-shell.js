(function registerDemoShell(global) {
  const runtime = (global.DemiurgeDemo = global.DemiurgeDemo || {});

  function el(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const node = el(id);
    if (node) node.textContent = String(value);
  }

  function log(message) {
    const time = new Date().toLocaleTimeString();
    const entry = `[${time}] ${message}`;
    const list = el("runtime-log");

    setText("runtime-path", window.location.pathname);

    if (list) {
      const li = document.createElement("li");
      li.textContent = entry;
      list.prepend(li);

      const maxItems = 18;
      while (list.children.length > maxItems) {
        list.removeChild(list.lastElementChild);
      }
    }

    console.log("[Demiurge demo]", message);
  }

  function markPage(pageId) {
    setText("runtime-page", pageId || "-");
    setText("runtime-path", window.location.pathname);
  }

  runtime.log = log;
  runtime.markPage = markPage;
  runtime.setText = setText;

  log("shared script loaded: demo-shell.js");
})(window);

