import { bootstrapDemiurge } from "./bootstrap.js";

export function autoBootstrapDemiurge() {
  return bootstrapDemiurge().catch((err) => {
    console.error("Error during Demiurge bootstrap:", err);
  });
}
