# Guía rápida para agentes de soporte

Contexto mínimo para entender y extender la arquitectura pseudo‑SPA usada en este repo.

## Propósito del proyecto
- Ofrecer un armazón ligero para sitios estáticos que se comportan como SPA: enrutado interno, carga de parciales de layout, scripts por página y servicio de modales accesibles.
- Todo vive en JS y CSS plano, sin bundlers ni frameworks externos; el bundle final se genera con scripts de Node incluidos en `tools/`.

## Piezas principales
- `src/bootstrap.js`: punto de entrada. Inyecta parciales (header/footer), marca el enlace activo de navegación, carga scripts de la página actual y levanta el router pseudo-SPA.
- `src/core/layout.js`: helpers para cargar parciales (`fetch` + `innerHTML`) y resaltar el enlace activo según la ruta normalizada.
- `src/core/pseudo-spa.js`: intercepta enlaces internos, usa `fetch` para traer la nueva vista, reemplaza solo el `<main>` con clases de transición opcionales, actualiza `history.pushState` y dispara `onAfterNavigate` para rehidratar.
- `src/core/script-loader.js`: lee `window.PageConfig` para cargar scripts compartidos y específicos de cada `data-page`; opcionalmente ejecuta una función `init` global tras la navegación.
- `src/core/modal-service.js`: servicio de modales con delegación de eventos (`data-modal-open` / `data-modal-close`), gestión de foco y API `Modal.getOrCreate(el)` para uso programático.

## Configuración de páginas
- El HTML debe tener un `<main data-page="id-de-pagina">…</main>` para que `PageScriptLoader` cargue la lógica correspondiente.
- `window.PageConfig` define layout, scripts y `init`/`teardown` por página. Ejemplo mínimo:
  ```js
  window.PageConfig = {
    layout: {
      header: { selector: "#app-header", url: "/partials/header.html" },
      footer: { selector: "#app-footer", url: "/partials/footer.html" },
      navSelector: "#menu a[href]", // opcional
    },
    sharedScripts: ["/scripts/shared/common.js"],
    pages: {
      index: {
        scripts: ["/scripts/pages/home.js"], // solo vive en esta página
        init: "Home.init", // puede devolver una función cleanup
        teardown: "Home.teardown", // opcional, llamada al salir de la vista
      },
      about: { scripts: [], init: null },
    },
  };
  ```
  - Al cambiar de página, `PageScriptLoader` elimina los `<script>` exclusivos de la vista anterior, borra su caché y ejecuta cleanup: primero el que devuelva `init` (si lo hace) y luego `teardown` si existe.
  - Ejemplo de módulo de página:
    ```js
    window.Home = {
      init() {
        const intervalId = setInterval(tick, 1000);
        document.addEventListener("click", handleClick);
        return () => {
          clearInterval(intervalId);
          document.removeEventListener("click", handleClick);
        };
      },
      teardown() {
        destroyWidgets(); // fallback si init no devolvió cleanup
      },
    };
    ```
  - Qué es “cleanup”: es la función que deshace lo que montó `init` (listeners, timers, instancias) cuando abandonas la página. Puede venir de dos sitios:
    1. Lo que devuelve `init` (si devuelve una función).  
    2. La función `teardown` declarada en `PageConfig.pages[...].teardown` (referencia global).  
    `PageScriptLoader` las ejecuta en ese orden antes de cargar la siguiente vista.

## Flujo de arranque
1) Al cargar la página, `bootstrap.js` inyecta header/footer según `PageConfig.layout`.
2) Marca activo el enlace de navegación que mejor coincide con la URL normalizada.
3) Llama a `PageScriptLoader.loadForPage(pageId)` para la vista actual.
4) Inicializa `PseudoSPA`, que al navegar vuelve a marcar nav y recarga scripts/`init` de la nueva vista.

## Construcción de artefactos
- JS: `node tools/build-arch-bundle.js` concatena las piezas anteriores en `dist/bundle.js` (incluye banner ASCII).
- CSS: `node tools/build-arch-styles.js` concatena los `.css` en `src/styles/` y genera `dist/arch-core.css`. Incluye estilos de modales (`src/styles/modal.css`).
- Consumo: en el HTML final basta incluir `<link rel="stylesheet" href="/dist/arch-core.css" />` y `<script src="/dist/bundle.js"></script>`.

## Servicio de modales
- Declarativo recomendado:
  ```html
  <button data-modal-open="#mi-modal">Abrir modal</button>
  <section id="mi-modal" class="modal" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__dialog" role="document">
      <button class="modal__close" aria-label="Cerrar" data-modal-close>×</button>
      <!-- contenido -->
    </div>
  </section>
  ```
- Programático: `const modal = Modal.getOrCreate(document.querySelector("#mi-modal")); modal.open();`
- Los listeners usan delegación en `document`, así que funcionan tras cambios de `<main>` sin rehidratar.

## Consejos para colaborar
- Mantén el HTML estructurado de forma que `<main>` contenga el contenido reemplazable y conserve el atributo `data-page`.
- Si agregas vistas nuevas, recuerda registrar sus scripts/`init` en `PageConfig.pages`.
- Las clases de transición se controlan en `PageConfig.transition` (ver defaults en `pseudo-spa.js`).
- Evita mutar globales fuera de `window.PageConfig` y APIs expuestas (`Layout`, `PseudoSPA`, `PageScriptLoader`, `Modal`) para no romper compatibilidad con proyectos que consumen el bundle.
