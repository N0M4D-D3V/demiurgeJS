(function () {
  // Servicio de modales accesible y reutilizable; conserva instancia por elemento raíz.
  class Modal {
    static instances = new Map();

    static getOrCreate(root) {
      if (!root) return null;
      if (!Modal.instances.has(root)) {
        Modal.instances.set(root, new Modal(root));
      }
      return Modal.instances.get(root);
    }

    constructor(root) {
      this.root = root;
      this.previouslyFocused = null;
      this._handleEsc = (e) => {
        if (e.key === "Escape") this.close();
      };
    }

    open() {
      if (this.isOpen()) return;

      this.previouslyFocused = document.activeElement;
      this.root.classList.add("is-open");
      this.root.setAttribute("aria-hidden", "false");

      const focusable = this.root.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      }

      document.addEventListener("keydown", this._handleEsc);
    }

    close() {
      if (!this.isOpen()) return;

      this.root.classList.remove("is-open");
      this.root.setAttribute("aria-hidden", "true");

      if (
        this.previouslyFocused &&
        typeof this.previouslyFocused.focus === "function"
      ) {
        this.previouslyFocused.focus();
      }
      document.removeEventListener("keydown", this._handleEsc);
    }

    toggle() {
      this.isOpen() ? this.close() : this.open();
    }

    isOpen() {
      return this.root.classList.contains("is-open");
    }
  }

  // Delegación de eventos para abrir/cerrar modales declarativos por data-attributes.
  function init() {
    // ABRIR
    document.addEventListener("click", (e) => {
      const path = e.composedPath ? e.composedPath() : [e.target];
      const openBtn = path.find(
        (node) =>
          node instanceof Element && node.hasAttribute("data-modal-open")
      );

      if (!openBtn) return;

      const targetSelector = openBtn.getAttribute("data-modal-open");
      if (!targetSelector) return;

      const modalEl = document.querySelector(targetSelector);
      const modal = Modal.getOrCreate(modalEl);

      if (modal) modal.open();
    });

    // CERRAR (esto probablemente ya te funciona bien)
    document.addEventListener("click", (e) => {
      const closeTrigger = e.target.closest("[data-modal-close]");
      if (!closeTrigger) return;

      const modalEl = closeTrigger.closest(".modal");
      const modal = Modal.getOrCreate(modalEl);
      if (modal) modal.close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.Modal = Modal;
})();

/*
<!-- Así se abre -->
<button
  data-modal-open="#system-pymes"
  class="btn secondary secondary-hover no-border fs-1"
>
  Ver detalles
</button>
*/

/* 
<!-- Esto es el modal -->
<section
  class="modal"
  aria-hidden="true"
  role="dialog"
  aria-modal="true"
  id="${id}"
>
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__dialog" role="document"></div>
</section>; 
*/
