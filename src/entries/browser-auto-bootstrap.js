import "./browser-global.js";
import { autoBootstrapDemiurge } from "../bootstrap/auto-bootstrap.js";

function run() {
  autoBootstrapDemiurge();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}
