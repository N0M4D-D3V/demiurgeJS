import { watch } from "node:fs";
import { resolve } from "node:path";
import { buildCss } from "./build-css.mjs";
import { buildJs, watchJs } from "./build-js.mjs";

const isWatch = process.argv.includes("--watch");

if (isWatch) {
  buildCss();
  await watchJs();

  const stylesDir = resolve(process.cwd(), "src/styles");
  watch(stylesDir, { persistent: true }, (eventType, filename) => {
    if (!filename || !String(filename).endsWith(".css")) return;
    try {
      buildCss();
      console.log(`Rebuilt CSS (${eventType}: ${filename})`);
    } catch (err) {
      console.error("CSS rebuild failed:", err);
    }
  });

  console.log("Watching CSS in src/styles/ ...");
} else {
  await buildJs();
  buildCss();
}
