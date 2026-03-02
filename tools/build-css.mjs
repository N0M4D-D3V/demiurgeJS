import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { bundle } from "lightningcss";

const root = resolve(process.cwd());
const distDir = resolve(root, "dist");
mkdirSync(distDir, { recursive: true });

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const cssBanner = `/*!
 * DemiurgeJS v${pkg.version}
 * ${pkg.homepage || ""}
 * License: ${pkg.license || "UNLICENSED"}
 */\n`;

function buildCssVariant({ minify }) {
  return bundle({
    filename: resolve(root, "src/styles/index.css"),
    minify,
    sourceMap: true,
  });
}

export function buildCss() {
  const dev = buildCssVariant({ minify: false });
  const prod = buildCssVariant({ minify: true });

  writeFileSync(resolve(distDir, "demiurge.css"), Buffer.concat([Buffer.from(cssBanner), Buffer.from(dev.code)]));
  writeFileSync(resolve(distDir, "demiurge.css.map"), dev.map);
  writeFileSync(resolve(distDir, "demiurge.min.css"), Buffer.concat([Buffer.from(cssBanner), Buffer.from(prod.code)]));
  writeFileSync(resolve(distDir, "demiurge.min.css.map"), prod.map);

  console.log("CSS builds complete.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildCss();
}
