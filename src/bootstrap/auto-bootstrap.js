import { bootstrapDemiurge } from "./bootstrap.js";

export function autoBootstrapDemiurge(bootstrap = bootstrapDemiurge) {
  return bootstrap().catch((err) => {
    console.error("Error during Demiurge bootstrap:", err);
  });
}
