Pseudo-SPA Architecture
=======================

Arquitectura ligera para sitios estáticos con enrutado pseudo-SPA, carga de parciales y scripts por página, más un servicio de modales accesible.

Arquitectura
------------
- `src/bootstrap.js`: punto de entrada; al cargarse inyecta parciales de layout configurados en `window.PageConfig` (por ejemplo header/footer), marca el nav activo y ejecuta la lógica de la página actual.
- `Layout` (`src/core/layout.js`): helpers para traer HTML de parciales (`fetch` + `innerHTML`) y resaltar el enlace de navegación según la URL normalizada.
- `PseudoSPA` (`src/core/pseudo-spa.js`): intercepta links internos y navegación del historial; descarga el documento destino, reemplaza solo el `<main>` con transiciones opcionales, actualiza `history.pushState` y dispara `onAfterNavigate` para rehidratar.
- `PageScriptLoader` (`src/core/script-loader.js`): lee `window.PageConfig` para cargar scripts compartidos y específicos de cada `data-page` (solo una vez); permite declarar `init` como referencia a función global para correr lógica por vista tras cada navegación.
- `Modal` (`src/core/modal-service.js`): servicio ligero con delegación de eventos para abrir/cerrar modales via `data-modal-open`/`data-modal-close` o de forma programática con `Modal.getOrCreate(el)`.

Build y artefactos
------------------
- Bundles JS: `node tools/build-arch-bundle.js` genera `dist/bundle.js` con Layout, PseudoSPA, PageScriptLoader y Modal.
- CSS core: `node tools/build-arch-styles.js` genera `dist/arch-core.css` concatenando `src/styles/*.css` (incluye `modal.css`).

Uso básico en un proyecto
-------------------------
Incluye los artefactos en tu HTML:
```html
<link rel="stylesheet" href="/dist/arch-core.css" />
<script src="/dist/bundle.js"></script>
```

Ejemplo de PageConfig con init/teardown
---------------------------------------
`PageScriptLoader` carga `sharedScripts` en todas las vistas y los `scripts` de cada `data-page`. Al salir de una página se eliminan los scripts exclusivos y se ejecuta su teardown. Ejemplo:
```js
window.PageConfig = {
  layout: {
    header: { selector: "#app-header", url: "/partials/header.html" },
    footer: { selector: "#app-footer", url: "/partials/footer.html" },
  },
  sharedScripts: ["/scripts/shared/common.js"], // siempre presentes
  pages: {
    home: {
      scripts: ["/scripts/pages/home.js"],
      init: "HomePage.init",           // puede devolver una función cleanup
      teardown: "HomePage.teardown",   // opcional, llamada al abandonar la vista
    },
    about: { scripts: [], init: null },
  },
};
```
En tu módulo de página puedes devolver un cleanup desde `init` o bien exponer un `teardown`:
```js
window.HomePage = {
  init() {
    const intervalId = setInterval(tick, 1000);
    document.addEventListener("click", handleClick);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("click", handleClick);
    };
  },
  teardown() {
    // alternativa si no devuelves cleanup desde init
    destroyWidgets();
  },
};
```

Servicio de modales
-------------------
Funciona por data-attributes o de forma programática y está expuesto como `window.Modal`.

Declarativo (recomendado)
```html
<!-- Trigger -->
<button data-modal-open="#mi-modal">Abrir modal</button>

<!-- Modal -->
<section id="mi-modal" class="modal" aria-hidden="true" role="dialog" aria-modal="true">
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__dialog" role="document">
    <button class="modal__close" aria-label="Cerrar" data-modal-close>×</button>
    <h2>Título del modal</h2>
    <p>Contenido del modal…</p>
    <button data-modal-close>Cerrar</button>
  </div>
</section>
```

Programático
```js
const modal = Modal.getOrCreate(document.querySelector("#mi-modal"));
modal.open();   // o modal.close(), modal.toggle()
```

Notas
-----
- Los listeners están delegados en `document`, así que los modales cargados vía PseudoSPA funcionan sin rehidratación.
- El estilo base de modales viene en `src/styles/modal.css` y viaja en `dist/arch-core.css`.
