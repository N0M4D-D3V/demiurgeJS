import { attachDemiurgeToGlobal } from "./browser-global.js";
import { autoBootstrapDemiurge } from "../bootstrap/auto-bootstrap.js";

export function runAutoBootstrap(autoBootstrap = autoBootstrapDemiurge) {
  return autoBootstrap();
}

export function initAutoBootstrap(
  doc = typeof document !== "undefined" ? document : undefined,
  run = runAutoBootstrap,
) {
  if (!doc) return false;

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", run, { once: true });
    return true;
  }

  run();
  return true;
}

attachDemiurgeToGlobal();
initAutoBootstrap();
