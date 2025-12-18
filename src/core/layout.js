(function (global) {
  // Inserta un fragmento de HTML remoto dentro del selector indicado.
  async function injectPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return null;

    try {
      const res = await fetch(url, {
        headers: { "X-Requested-With": "LayoutPartial" },
      });
      if (!res.ok) {
        console.error(`No se pudo cargar ${url}:`, res.status);
        return null;
      }

      const html = await res.text();
      el.innerHTML = html;
      return el;
    } catch (err) {
      console.error(`Error al cargar ${url}:`, err);
      return null;
    }
  }

  // Normaliza rutas para compararlas (quita query/hash, colapsa index.html, quita slash final).
  function normalizePath(path) {
    if (!path) return "/";
    path = path.split("?")[0].split("#")[0];
    path = path.replace(/\/index\.html?$/i, "/");
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (path === "") return "/";
    return path;
  }

  // Calcula qué link se parece más a la ruta actual (prefiere coincidencia exacta/prefijo).
  function matchScore(linkPath, currentPath) {
    // "/" solo aplica cuando la ruta actual es raíz
    if (linkPath === "/") return currentPath === "/" ? 0 : -1;

    if (currentPath === linkPath) return linkPath.length;

    // Coincidencia por prefijo con frontera de segmento (/blog/post -> /blog)
    if (currentPath.startsWith(linkPath)) {
      const boundary = currentPath.charAt(linkPath.length);
      if (!boundary || boundary === "/") {
        return linkPath.length;
      }
    }

    return -1;
  }

  // Añade la clase "accent" al link más cercano a la ruta actual; quita el resto.
  function markActiveNavLink(root, selector) {
    root = root || document;
    selector = selector || "#menu a[href]";

    const links = root.querySelectorAll(selector);
    const currentPath = normalizePath(window.location.pathname);

    let bestLink = null;
    let bestScore = -1;

    links.forEach((link) => {
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

    links.forEach((link) => {
      if (link === bestLink) {
        link.classList.add("accent");
      } else {
        link.classList.remove("accent");
      }
    });
  }

  global.Layout = {
    injectPartial,
    markActiveNavLink,
  };
})(window);
