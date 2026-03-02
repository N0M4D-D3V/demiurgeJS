import * as DemiurgeExports from "./index.js";

const globalObj = typeof window !== "undefined" ? window : globalThis;

if (globalObj) {
  globalObj.Demiurge = Object.assign({}, globalObj.Demiurge, DemiurgeExports);

  // Compatibilidad con consumidores antiguos.
  globalObj.Layout = DemiurgeExports.Layout;
  globalObj.PseudoSPA = DemiurgeExports.PseudoSPA;
  globalObj.PageScriptLoader = DemiurgeExports.PageScriptLoader;
  globalObj.Modal = DemiurgeExports.Modal;

  if (typeof document !== "undefined") {
    DemiurgeExports.initModalDelegation(document);
  }
}

export default DemiurgeExports;
