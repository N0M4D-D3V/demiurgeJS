const fs = require("fs");
const path = require("path");

const ASCII = `
/**
███████████████████████████████████████████████████████████████████
  powered by

  ██████  ███████ ███    ███ ██ ██    ██ ██████   ██████  ███████ 
  ██   ██ ██      ████  ████ ██ ██    ██ ██   ██ ██       ██      
  ██   ██ █████   ██ ████ ██ ██ ██    ██ ██████  ██   ███ █████   
  ██   ██ ██      ██  ██  ██ ██ ██    ██ ██   ██ ██    ██ ██      
  ██████  ███████ ██      ██ ██  ██████  ██   ██  ██████  ███████

  PSEUDO-SPA ARCHITECTURE                                  v0.0.2                                  
███████████████████████████████████████████████████████████████████
*/
`;

const PROJECT_ROOT = path.join(__dirname, "..");
const SOURCES = [
  "src/core/layout.js",
  "src/core/pseudo-spa.js",
  "src/core/modal-service.js",
  "src/core/script-loader.js",
  "src/bootstrap.js",
];

const OUTPUT = "dist/demiurge.js";

function build() {
  let bundle = ASCII;

  for (const relPath of SOURCES) {
    const absPath = path.join(PROJECT_ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      console.error(`❌ No se encontró: ${relPath}`);
      process.exit(1);
    }

    const code = fs.readFileSync(absPath, "utf8");
    bundle += `\n// ==== BEGIN ${relPath} ====\n`;
    bundle += code;
    bundle += `\n// ==== END ${relPath} ====\n`;
  }

  const outPath = path.join(PROJECT_ROOT, OUTPUT);
  const outDir = path.dirname(outPath);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, bundle, "utf8");
  console.log(`✅ bundle generado: ${OUTPUT}`);
}

console.log(ASCII);
build();
