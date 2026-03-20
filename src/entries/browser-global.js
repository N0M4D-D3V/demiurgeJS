import * as DemiurgeExports from "./index.js";

export function getGlobalObject() {
  return typeof window !== "undefined" ? window : globalThis;
}

export function attachDemiurgeToGlobal(
  globalObj = getGlobalObject(),
  exportsObject = DemiurgeExports,
  doc = typeof document !== "undefined" ? document : undefined,
) {
  if (!globalObj) return null;

  globalObj.Demiurge = Object.assign({}, globalObj.Demiurge, exportsObject);

  // Compatibilidad con consumidores antiguos.
  globalObj.Layout = exportsObject.Layout;
  globalObj.PseudoSPA = exportsObject.PseudoSPA;
  globalObj.PageScriptLoader = exportsObject.PageScriptLoader;
  globalObj.Modal = exportsObject.Modal;

  if (doc) {
    exportsObject.initModalDelegation(doc);
  }

  return globalObj.Demiurge;
}

attachDemiurgeToGlobal();

export default DemiurgeExports;
