const fs = require("fs");
const path = require("path");

const projectName = process.argv[2];

if (!projectName) {
  console.error("❌ Falta el nombre del proyecto. Uso:");
  console.error("   node tools/create-architecture-project.js my-project");
  process.exit(1);
}

const ROOT = path.join(process.cwd(), projectName);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
  console.log("  ✓", path.relative(ROOT, filePath));
}

if (fs.existsSync(ROOT)) {
  console.error(`❌ La carpeta "${projectName}" ya existe. Aborta.`);
  process.exit(1);
}

console.log(`🚧 Creando proyecto en: ${ROOT}`);
ensureDir(ROOT);

// ---------------------- package.json ----------------------
writeFile(
  path.join(ROOT, "package.json"),
  `{
  "name": "${projectName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build:arch": "node tools/build-architecture-bundle.js",
    "dev": "npx serve ."
  }
}
`
);

// ---------------------- build script ----------------------
writeFile(
  path.join(ROOT, "tools", "build-architecture-bundle.js"),
  `const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "..");

const SOURCES = [
  "js/core/layout.js",
  "js/core/pseudo-spa.js",
  "js/core/script-loader.js",
  "js/bootstrap.js"
];

const OUTPUT = "dist/bundle.js";

function build() {
  let bundle = "// === Arquitectura bundle ===\\n\\n";

  for (const relPath of SOURCES) {
    const absPath = path.join(PROJECT_ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      console.error("❌ No se encontró:", relPath);
      process.exit(1);
    }

    const code = fs.readFileSync(absPath, "utf8");
    bundle += "\\n// ==== BEGIN " + relPath + " ====\\n";
    bundle += code;
    bundle += "\\n// ==== END " + relPath + " ====\\n";
  }

  const outPath = path.join(PROJECT_ROOT, OUTPUT);
  const outDir = path.dirname(outPath);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, bundle, "utf8");

  console.log("✅ bundle generado:", OUTPUT);
}

build();
`
);

// ---------------------- core/layout.js ----------------------
writeFile(
  path.join(ROOT, "js", "core", "layout.js"),
  `(function (global) {
  async function injectPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return null;

    try {
      const res = await fetch(url, {
        headers: { "X-Requested-With": "LayoutPartial" }
      });
      if (!res.ok) {
        console.error("No se pudo cargar " + url + ":", res.status);
        return null;
      }

      const html = await res.text();
      el.innerHTML = html;
      return el;
    } catch (err) {
      console.error("Error al cargar " + url + ":", err);
      return null;
    }
  }

  function normalizePath(path) {
    if (!path) return "/";
    path = path.split("?")[0].split("#")[0];
    path = path.replace(/\\/index\\.html?$/i, "/");
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (path === "") return "/";
    return path;
  }

  function matchScore(linkPath, currentPath) {
    if (linkPath === "/") return currentPath === "/" ? 0 : -1;

    if (currentPath === linkPath) return linkPath.length;

    if (currentPath.startsWith(linkPath)) {
      const boundary = currentPath.charAt(linkPath.length);
      if (!boundary || boundary === "/") {
        return linkPath.length;
      }
    }

    return -1;
  }

  function markActiveNavLink(root, selector) {
    root = root || document;
    selector = selector || "#menu a[href]";

    const links = root.querySelectorAll(selector);
    const currentPath = normalizePath(window.location.pathname);

    let bestLink = null;
    let bestScore = -1;

    links.forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;

      const url = new URL(href, window.location.origin);
      const linkPath = normalizePath(url.pathname);

      const score = matchScore(linkPath, currentPath);
      if (score > bestScore) {
        bestScore = score;
        bestLink = link;
      }
    });

    links.forEach(function (link) {
      if (link === bestLink) {
        link.classList.add("accent");
      } else {
        link.classList.remove("accent");
      }
    });
  }

  global.Layout = {
    injectPartial: injectPartial,
    markActiveNavLink: markActiveNavLink
  };
})(window);
`
);

// ---------------------- core/pseudo-spa.js ----------------------
writeFile(
  path.join(ROOT, "js", "core", "pseudo-spa.js"),
  `(function (global) {
  function defaultShouldHandleLink(link, event) {
    var href = link.getAttribute("href");
    if (!href) return false;

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }

    if (link.target && link.target !== "_self") return false;

    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return false;
    }

    var url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    var currentWithoutHash = window.location.href.split("#")[0];
    if (url.href === currentWithoutHash) return false;

    return true;
  }

  function PseudoSPA(options) {
    this.options = Object.assign(
      {
        contentSelector: "main",
        linkSelector: "a[href]",
        shouldHandleLink: defaultShouldHandleLink,
        getTitle: function (doc) {
          var t = doc.querySelector("title");
          return t ? t.textContent : document.title;
        },
        onBeforeNavigate: function () {},
        onAfterNavigate: function () {},
        transition: {
          enabled: true,
          duration: 180,
          leaveClass: "spa-leave",
          leaveActiveClass: "spa-leave-active",
          enterClass: "spa-enter",
          enterActiveClass: "spa-enter-active"
        }
      },
      options || {}
    );

    this.isNavigating = false;
    this.currentUrl = window.location.href;
  }

  PseudoSPA.prototype.init = function () {
    this.bindLinkClicks();
    this.bindPopState();
  };

  PseudoSPA.prototype.getContentEl = function () {
    return document.querySelector(this.options.contentSelector);
  };

  PseudoSPA.prototype.bindLinkClicks = function () {
    var self = this;
    document.addEventListener("click", function (event) {
      var link = event.target.closest(self.options.linkSelector);
      if (!link) return;

      if (!self.options.shouldHandleLink(link, event)) return;

      event.preventDefault();
      var url = new URL(link.getAttribute("href"), window.location.href);
      self.navigate(url.href, { push: true });
    });
  };

  PseudoSPA.prototype.bindPopState = function () {
    var self = this;
    window.addEventListener("popstate", function () {
      var url = window.location.href;
      self.navigate(url, { push: false });
    });
  };

  PseudoSPA.prototype.navigate = function (url, opts) {
    opts = opts || { push: true };
    var push = opts.push;

    if (this.isNavigating) return;
    if (url === this.currentUrl) return;

    var self = this;
    this.isNavigating = true;
    this.options.onBeforeNavigate(url);

    function doFetchAndSwap() {
      self
        .loadDocument(url)
        .then(function (doc) {
          if (!doc) {
            window.location.href = url;
            return;
          }
          self.swapContent(doc, url, push);
        })
        .catch(function () {
          window.location.href = url;
        })
        .finally(function () {
          self.isNavigating = false;
        });
    }

    var t = this.options.transition;
    if (t && t.enabled) {
      var contentEl = this.getContentEl();
      if (!contentEl) {
        doFetchAndSwap();
        return;
      }

      contentEl.classList.add(t.leaveClass);
      contentEl.offsetHeight;
      contentEl.classList.add(t.leaveActiveClass);

      function onEnd(e) {
        if (e.target !== contentEl) return;
        contentEl.removeEventListener("transitionend", onEnd);
        contentEl.classList.remove(t.leaveClass, t.leaveActiveClass);
        doFetchAndSwap();
      }

      contentEl.addEventListener("transitionend", onEnd);

      setTimeout(function () {
        contentEl.removeEventListener("transitionend", onEnd);
        contentEl.classList.remove(t.leaveClass, t.leaveActiveClass);
        if (self.isNavigating) {
          doFetchAndSwap();
        }
      }, t.duration + 80);
    } else {
      doFetchAndSwap();
    }
  };

  PseudoSPA.prototype.loadDocument = function (url) {
    return fetch(url, {
      headers: { "X-Requested-With": "PseudoSPA" }
    })
      .then(function (res) {
        if (!res.ok) return null;
        return res.text();
      })
      .then(function (html) {
        if (!html) return null;
        var parser = new DOMParser();
        return parser.parseFromString(html, "text/html");
      });
  };

  PseudoSPA.prototype.swapContent = function (newDoc, url, push) {
    var newContent = newDoc.querySelector(this.options.contentSelector);
    var currentContent = this.getContentEl();

    if (!newContent || !currentContent) {
      window.location.href = url;
      return;
    }

    var importedNewContent = document.importNode(newContent, true);
    currentContent.replaceWith(importedNewContent);

    var newTitle = this.options.getTitle(newDoc);
    if (newTitle) document.title = newTitle;

    if (push) {
      history.pushState({ url: url }, "", url);
    }
    this.currentUrl = url;

    window.scrollTo({ top: 0, left: 0 });

    var t = this.options.transition;
    if (t && t.enabled) {
      importedNewContent.classList.add(t.enterClass);
      importedNewContent.offsetHeight;
      importedNewContent.classList.add(t.enterActiveClass);

      function cleanup() {
        importedNewContent.classList.remove(
          t.enterClass,
          t.enterActiveClass
        );
      }

      function onEnd(e) {
        if (e.target !== importedNewContent) return;
        importedNewContent.removeEventListener("transitionend", onEnd);
        cleanup();
      }

      importedNewContent.addEventListener("transitionend", onEnd);
      setTimeout(cleanup, t.duration + 80);
    }

    this.options.onAfterNavigate(url, newDoc);
  };

  global.PseudoSPA = PseudoSPA;
})(window);
`
);

// ---------------------- core/script-loader.js ----------------------
writeFile(
  path.join(ROOT, "js", "core", "script-loader.js"),
  `(function (global) {
  var loadedScripts = new Set();

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (!src) return resolve();

      if (loadedScripts.has(src)) return resolve();

      var s = document.createElement("script");
      s.src = src;
      s.async = true;

      s.onload = function () {
        loadedScripts.add(src);
        resolve();
      };

      s.onerror = function () {
        console.error("Error cargando script:", src);
        reject(new Error("Error cargando script: " + src));
      };

      document.head.appendChild(s);
    });
  }

  function resolveFunction(path) {
    if (!path) return null;
    var parts = path.split(".");
    var ctx = global;

    for (var i = 0; i < parts.length; i++) {
      ctx = ctx && ctx[parts[i]];
      if (ctx == null) return null;
    }

    return typeof ctx === "function" ? ctx : null;
  }

  async function loadForPage(pageId) {
    var config = global.PageConfig;
    if (!config) return;

    var tasks = [];

    if (Array.isArray(config.sharedScripts)) {
      config.sharedScripts.forEach(function (src) {
        tasks.push(loadScript(src));
      });
    }

    var pageCfg = config.pages && config.pages[pageId];

    if (pageCfg && Array.isArray(pageCfg.scripts)) {
      pageCfg.scripts.forEach(function (src) {
        tasks.push(loadScript(src));
      });
    }

    await Promise.all(tasks);

    if (pageCfg && pageCfg.init) {
      var initFn = resolveFunction(pageCfg.init);
      if (initFn) {
        await initFn();
      }
    }
  }

  global.PageScriptLoader = {
    loadScript: loadScript,
    loadForPage: loadForPage,
    resolveFunction: resolveFunction
  };
})(window);
`
);

// ---------------------- bootstrap.js ----------------------
writeFile(
  path.join(ROOT, "js", "bootstrap.js"),
  `document.addEventListener("DOMContentLoaded", async function () {
  await Layout.injectPartial("#app-header", "/partials/header.html");
  await Layout.injectPartial("#app-footer", "/partials/footer.html");

  Layout.markActiveNavLink(document, "#menu a[href]");

  async function runCurrentPage() {
    var main = document.querySelector("main");
    if (!main) return;

    var pageId = main.getAttribute("data-page");
    if (!pageId) return;

    await PageScriptLoader.loadForPage(pageId);
  }

  await runCurrentPage();

  var router = new PseudoSPA({
    contentSelector: "main",
    onAfterNavigate: async function (url, newDoc) {
      Layout.markActiveNavLink(document, "#menu a[href]");
      await runCurrentPage();
    }
  });

  router.init();
});
`
);

// ---------------------- shared/stars.js ----------------------
writeFile(
  path.join(ROOT, "js", "shared", "stars.js"),
  `(function () {
  var isTabActive = !document.hidden;
  var shootingTimeoutId = null;

  function createShootingStar() {
    var star = document.createElement("div");
    star.classList.add("shooting-star");

    var startX = Math.random() * window.innerWidth * 0.8;
    var startY = Math.random() * window.innerHeight * 0.3;

    star.style.left = startX + "px";
    star.style.top = startY + "px";

    document.body.appendChild(star);

    star.addEventListener("animationend", function () {
      star.remove();
    });
  }

  function startShootingStars() {
    var minDelay = 1000;
    var maxDelay = 8000;

    function scheduleNext() {
      if (!isTabActive) {
        shootingTimeoutId = null;
        return;
      }

      var delay = Math.random() * (maxDelay - minDelay) + minDelay;

      shootingTimeoutId = setTimeout(function () {
        if (!isTabActive) {
          shootingTimeoutId = null;
          return;
        }

        createShootingStar();
        scheduleNext();
      }, delay);
    }

    if (shootingTimeoutId === null) {
      scheduleNext();
    }
  }

  function createTwinkleStars(count) {
    count = count || 40;

    for (var i = 0; i < count; i++) {
      var star = document.createElement("div");
      star.classList.add("twinkle-star");

      var x = Math.random() * window.innerWidth;
      var y = Math.random() * window.innerHeight;

      star.style.left = x + "px";
      star.style.top = y + "px";

      var delay = Math.random() * 4;
      var duration = 3 + Math.random() * 4;

      star.style.animationDelay = delay + "s";
      star.style.animationDuration = duration + "s";

      document.body.appendChild(star);
    }
  }

  document.addEventListener("visibilitychange", function () {
    isTabActive = !document.hidden;

    if (isTabActive) {
      if (shootingTimeoutId === null) {
        startShootingStars();
      }
    } else {
      if (shootingTimeoutId !== null) {
        clearTimeout(shootingTimeoutId);
        shootingTimeoutId = null;
      }
    }
  });

  createTwinkleStars(40);
  if (!document.hidden) {
    startShootingStars();
  }
})();
`
);

// ---------------------- pages/systems.js ----------------------
writeFile(
  path.join(ROOT, "js", "pages", "systems.js"),
  `window.SystemsPage = (function () {
  async function init() {
    var detailContEl = document.getElementById("detail-container");
    if (!detailContEl) return;

    detailContEl.innerHTML = "<p>Cargando sistemas...</p>";

    try {
      var res = await fetch("/assets/data/systems.json", {
        headers: { "X-Requested-With": "PageModule" }
      });

      if (!res.ok) {
        console.error("Error al cargar systems.json:", res.status);
        detailContEl.innerHTML =
          "<p>No se pudieron cargar los sistemas.</p>";
        return;
      }

      var data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        detailContEl.innerHTML =
          "<p>No hay sistemas disponibles todavía.</p>";
        return;
      }

      var html = "";
      data.forEach(function (sys) {
        html += '<section class="flex-center my-2 snap-section" id="' + sys.id + '">';
        html += '<div class="card-glass block">';
        html += '<div class="secondary space-between">';
        html += "<h2>" + sys.title + "</h2>";
        html += '<div class="about-svg-container">' + (sys.icon || "") + "</div>";
        html += "</div>";
        html += "<h3>" + (sys.subtitle || "") + "</h3>";

        if (sys.body && Array.isArray(sys.body.target) && sys.body.target.length) {
          html += "<p>Ideal para:</p><ul><li>" + sys.body.target.join("</li><li>") + "</li></ul>";
        }

        if (sys.body && Array.isArray(sys.body.includes) && sys.body.includes.length) {
          html += "<p>Incluye:</p><ul><li>" + sys.body.includes.join("</li><li>") + "</li></ul>";
        }

        if (sys.body && Array.isArray(sys.body.technologies) && sys.body.technologies.length) {
          html += "<p>Tecnologías habituales:</p><ul><li>" + sys.body.technologies.join("</li><li>") + "</li></ul>";
        }

        html += "</div></section>";
      });

      detailContEl.innerHTML = html;
    } catch (err) {
      console.error("Error en SystemsPage.init:", err);
      detailContEl.innerHTML =
        "<p>Error inesperado cargando los sistemas.</p>";
    }
  }

  return { init: init };
})();
`
);

// ---------------------- page-config.js ----------------------
writeFile(
  path.join(ROOT, "js", "page-config.js"),
  `window.PageConfig = {
  sharedScripts: [
    "/js/shared/stars.js"
  ],
  pages: {
    home: {
      scripts: [],
      init: null
    },
    systems: {
      scripts: ["/js/pages/systems.js"],
      init: "SystemsPage.init"
    }
  }
};
`
);

// ---------------------- partials ----------------------
writeFile(
  path.join(ROOT, "partials", "header.html"),
  `<header>
  <div class="hf-container card-glass">
    <a href="/index.html" class="primary primary-hover" aria-label="Inicio">
      <span>LOGO</span>
    </a>
    <nav id="menu" aria-label="Navegacion principal">
      <a href="/index.html">HOME</a>
      <a href="/pages/systems.html">SISTEMAS</a>
    </nav>
  </div>
</header>
`
);

writeFile(
  path.join(ROOT, "partials", "footer.html"),
  `<footer>
  <div class="hf-container card-glass">
    <span class="primary">Rogue Syntax © 2025</span>
  </div>
</footer>
`
);

// ---------------------- assets/data/systems.json ----------------------
writeFile(
  path.join(ROOT, "assets", "data", "systems.json"),
  `[
  {
    "id": "system-alpha",
    "title": "System Alpha",
    "icon": "",
    "subtitle": "Core engine",
    "body": {
      "target": ["Indies", "Prototipos"],
      "includes": ["CLI", "monitorización básica"],
      "technologies": ["JS", "Node"]
    }
  }
]
`
);

// ---------------------- css ----------------------
writeFile(
  path.join(ROOT, "css", "styles.css"),
  `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: radial-gradient(circle at top, #1a1a2e 0, #050608 60%);
  color: #f5f5f5;
}

a {
  color: inherit;
  text-decoration: none;
}

.hf-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-glass {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(10px);
}

#menu a {
  margin-left: 1rem;
}

#menu a.accent {
  border-bottom: 2px solid #38bdf8;
}

main {
  max-width: 960px;
  margin: 2rem auto;
  padding: 1rem;
}

.shooting-star,
.twinkle-star {
  position: fixed;
  pointer-events: none;
  z-index: -1;
}

/* pone aquí tus animaciones de estrellas */
`
);

// ---------------------- index.html ----------------------
writeFile(
  path.join(ROOT, "index.html"),
  `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Rogue Syntax | Home</title>
    <meta name="description" content="Home Rogue Syntax" />
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <div id="app-header"></div>

    <main data-page="home">
      <h1>Home</h1>
      <p>Pseudo-SPA lista para trabajar.</p>
    </main>

    <div id="app-footer"></div>

    <script src="/dist/bundle.js"></script>
    <script src="/js/page-config.js"></script>
  </body>
</html>
`
);

// ---------------------- pages/systems.html ----------------------
writeFile(
  path.join(ROOT, "pages", "systems.html"),
  `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Sistemas | Rogue Syntax</title>
    <meta name="description" content="Sistemas Rogue Syntax" />
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <div id="app-header"></div>

    <main data-page="systems">
      <h1>Sistemas</h1>
      <section id="detail-container"></section>
    </main>

    <div id="app-footer"></div>

    <script src="/dist/bundle.js"></script>
    <script src="/js/page-config.js"></script>
  </body>
</html>
`
);

console.log("✅ Proyecto creado. Ahora:");
console.log(`   cd ${projectName}`);
console.log("   npm install (opcional si quieres usar el script dev)");
console.log("   npm run build:arch");
console.log("   npx serve .   # o el servidor estático que uses");
