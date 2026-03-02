import { mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { build, context } from "esbuild";

const root = resolve(process.cwd());
const distDir = resolve(root, "dist");
mkdirSync(distDir, { recursive: true });

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const banner = `/*!
 * DemiurgeJS v${pkg.version}
 * ${pkg.homepage || ""}
 * License: ${pkg.license || "UNLICENSED"}
 */`;

const baseConfig = {
  bundle: true,
  target: ["es2018"],
  sourcemap: true,
  legalComments: "none",
  banner: { js: banner },
};

const buildConfigs = [
  {
    entryPoints: [resolve(root, "src/entries/index.js")],
    outfile: resolve(root, "dist/index.js"),
    format: "esm",
    platform: "browser",
    minify: false,
  },
  {
    entryPoints: [resolve(root, "src/entries/index.js")],
    outfile: resolve(root, "dist/index.cjs"),
    format: "cjs",
    platform: "browser",
    minify: false,
  },
  {
    entryPoints: [resolve(root, "src/entries/browser-global.js")],
    outfile: resolve(root, "dist/demiurge.global.js"),
    format: "iife",
    globalName: "DemiurgeBundle",
    platform: "browser",
    minify: false,
  },
  {
    entryPoints: [resolve(root, "src/entries/browser-global.js")],
    outfile: resolve(root, "dist/demiurge.global.min.js"),
    format: "iife",
    globalName: "DemiurgeBundle",
    platform: "browser",
    minify: true,
  },
  {
    entryPoints: [resolve(root, "src/entries/browser-auto-bootstrap.js")],
    outfile: resolve(root, "dist/auto-bootstrap.global.js"),
    format: "iife",
    globalName: "DemiurgeAutoBootstrap",
    platform: "browser",
    minify: false,
  },
  {
    entryPoints: [resolve(root, "src/entries/browser-auto-bootstrap.js")],
    outfile: resolve(root, "dist/auto-bootstrap.global.min.js"),
    format: "iife",
    globalName: "DemiurgeAutoBootstrap",
    platform: "browser",
    minify: true,
  },
];

function copyTypes() {
  copyFileSync(resolve(root, "types/index.d.ts"), resolve(root, "dist/index.d.ts"));
}

export async function buildJs() {
  await Promise.all(buildConfigs.map((cfg) => build({ ...baseConfig, ...cfg })));
  copyTypes();
  console.log("JS builds complete.");
}

export async function watchJs() {
  const contexts = await Promise.all(
    buildConfigs.map((cfg) => context({ ...baseConfig, ...cfg }))
  );
  await Promise.all(contexts.map((ctx) => ctx.watch()));
  copyTypes();
  console.log("Watching JS builds...");
  return contexts;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--watch")) {
    await watchJs();
  } else {
    await buildJs();
  }
}
