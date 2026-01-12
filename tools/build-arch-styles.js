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

  PSEUDO-SPA ARCHITECTURE                                  v0.0.3                                  
███████████████████████████████████████████████████████████████████
*/
`;

const PROJECT_ROOT = path.join(__dirname, "..");
const STYLES_DIR = path.join(PROJECT_ROOT, "src/styles");
const OUTPUT = path.join(PROJECT_ROOT, "dist", "demiurge.css");

function buildArchCoreCss() {
  if (!fs.existsSync(STYLES_DIR)) {
    console.warn(`⚠️  No existe la carpeta "styles" en ${STYLES_DIR}.`);
    console.warn("    Se generará un arch-core.css vacío.\n");

    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(
      OUTPUT,
      "/* arch-core.css generado: no se encontraron estilos en /styles */\n",
      "utf8"
    );
    console.log(`✅ arch-core.css generado en: ${OUTPUT}`);
    return;
  }

  const entries = fs.readdirSync(STYLES_DIR, { withFileTypes: true });

  const cssFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".css"))
    .map((e) => e.name)
    .sort();

  if (!cssFiles.length) {
    console.warn(`⚠️  No hay ficheros .css en ${STYLES_DIR}.`);
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(
      OUTPUT,
      "/* arch-core.css generado: carpeta /styles vacía */\n",
      "utf8"
    );
    console.log(`✅ arch-core.css generado en: ${OUTPUT}`);
    return;
  }

  let bundle = ASCII;

  for (const file of cssFiles) {
    const absPath = path.join(STYLES_DIR, file);
    const css = fs.readFileSync(absPath, "utf8");

    bundle += `/* ==== BEGIN ${file} ==== */\n`;
    bundle += css.trimEnd();
    bundle += `\n/* ==== END ${file} ==== */\n\n`;
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, bundle, "utf8");

  console.log("📦 Ficheros CSS incluidos desde /styles:");
  cssFiles.forEach((f) => console.log("   -", f));
  console.log(`\n✅ arch-core.css generado en: ${OUTPUT}`);
}

console.log(ASCII);
buildArchCoreCss();
