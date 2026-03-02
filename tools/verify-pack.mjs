import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const root = resolve(process.cwd());
const dist = resolve(root, "dist");

const requiredFiles = [
  "index.js",
  "index.cjs",
  "index.d.ts",
  "demiurge.global.js",
  "demiurge.global.min.js",
  "auto-bootstrap.global.js",
  "auto-bootstrap.global.min.js",
  "demiurge.css",
  "demiurge.min.css",
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(dist, file))) {
    throw new Error(`Missing build artifact: dist/${file}`);
  }
}

const esm = await import(resolve(dist, "index.js"));
if (typeof esm.PseudoSPA !== "function") {
  throw new Error("ESM smoke check failed: PseudoSPA export missing");
}

const require = createRequire(import.meta.url);
const cjs = require(resolve(dist, "index.cjs"));
if (typeof cjs.PseudoSPA !== "function") {
  throw new Error("CJS smoke check failed: PseudoSPA export missing");
}

console.log("Smoke checks passed.");
