(function (global) {
  // Determina si un click en un <a> debe ser manejado por el router (solo navegación interna).
  function defaultShouldHandleLink(link, event) {
    const href = link.getAttribute("href");
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

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    const currentWithoutHash = window.location.href.split("#")[0];
    if (url.href === currentWithoutHash) return false;

    return true;
  }

  // Router ligero que intercambia el contenido de <main> via fetch manteniendo history.pushState.
  class PseudoSPA {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          contentSelector: "main",
          linkSelector: "a[href]",
          shouldHandleLink: defaultShouldHandleLink,
          getTitle: (doc) => {
            const t = doc.querySelector("title");
            return t ? t.textContent : document.title;
          },
          onBeforeNavigate: () => {},
          onAfterNavigate: () => {},
          transition: {
            enabled: true,
            duration: 180,
            leaveClass: "spa-leave",
            leaveActiveClass: "spa-leave-active",
            enterClass: "spa-enter",
            enterActiveClass: "spa-enter-active",
          },
        },
        options
      );

      this.isNavigating = false;
      this.currentUrl = window.location.href;
    }

    init() {
      // Suscribe los listeners de click y popstate para interceptar navegación interna.
      this.bindLinkClicks();
      this.bindPopState();
    }

    getContentEl() {
      return document.querySelector(this.options.contentSelector);
    }

    bindLinkClicks() {
      document.addEventListener("click", (event) => {
        const link = event.target.closest(this.options.linkSelector);
        if (!link) return;

        if (!this.options.shouldHandleLink(link, event)) return;

        event.preventDefault();
        const url = new URL(link.getAttribute("href"), window.location.href);
        this.navigate(url.href, { push: true });
      });
    }

    bindPopState() {
      window.addEventListener("popstate", () => {
        const url = window.location.href;
        this.navigate(url, { push: false });
      });
    }

    // Orquesta la navegación: dispara callbacks, aplica transición y cambia el <main>.
    navigate(url, { push } = { push: true }) {
      if (this.isNavigating) return;
      if (url === this.currentUrl) return;

      this.isNavigating = true;
      this.options.onBeforeNavigate(url);

      const doFetchAndSwap = () => {
        this.loadDocument(url)
          .then((doc) => {
            if (!doc) {
              window.location.href = url;
              return;
            }
            this.swapContent(doc, url, push);
          })
          .catch(() => {
            window.location.href = url;
          })
          .finally(() => {
            this.isNavigating = false;
          });
      };

      const t = this.options.transition;
      if (t && t.enabled) {
        const contentEl = this.getContentEl();
        if (!contentEl) {
          doFetchAndSwap();
          return;
        }

        let didStartSwap = false;
        const startSwap = () => {
          if (didStartSwap) return;
          didStartSwap = true;
          doFetchAndSwap();
        };

        contentEl.classList.add(t.leaveClass);
        contentEl.offsetHeight;
        contentEl.classList.add(t.leaveActiveClass);

        const onEnd = (e) => {
          if (e.target !== contentEl) return;
          contentEl.removeEventListener("transitionend", onEnd);
          startSwap();
        };

        contentEl.addEventListener("transitionend", onEnd);

        setTimeout(() => {
          contentEl.removeEventListener("transitionend", onEnd);
          if (this.isNavigating) startSwap();
        }, t.duration + 80);
      } else {
        doFetchAndSwap();
      }
    }

    // Descarga el documento destino; devuelve un Document listo para leer.
    loadDocument(url) {
      return fetch(url, {
        headers: { "X-Requested-With": "PseudoSPA" },
      })
        .then((res) => {
          if (!res.ok) return null;
          return res.text();
        })
        .then((html) => {
          if (!html) return null;
          const parser = new DOMParser();
          return parser.parseFromString(html, "text/html");
        });
    }

    // Reemplaza el contenido principal, actualiza el título y el historial, y aplica transiciones.
    swapContent(newDoc, url, push) {
      const newContent = newDoc.querySelector(this.options.contentSelector);
      const currentContent = this.getContentEl();

      if (!newContent || !currentContent) {
        window.location.href = url;
        return;
      }

      const importedNewContent = document.importNode(newContent, true);
      currentContent.replaceWith(importedNewContent);

      const newTitle = this.options.getTitle(newDoc);
      if (newTitle) document.title = newTitle;

      if (push) {
        history.pushState({ url }, "", url);
      }
      this.currentUrl = url;

      window.scrollTo({ top: 0, left: 0 });

      const t = this.options.transition;
      if (t && t.enabled) {
        importedNewContent.classList.add(t.enterClass);
        importedNewContent.offsetHeight;
        importedNewContent.classList.add(t.enterActiveClass);

        const cleanup = () => {
          importedNewContent.classList.remove(t.enterClass, t.enterActiveClass);
        };

        const onEnd = (e) => {
          if (e.target !== importedNewContent) return;
          importedNewContent.removeEventListener("transitionend", onEnd);
          cleanup();
        };

        importedNewContent.addEventListener("transitionend", onEnd);
        setTimeout(cleanup, t.duration + 80);
      }

      this.options.onAfterNavigate(url, newDoc);
    }
  }

  global.PseudoSPA = PseudoSPA;
})(window);
