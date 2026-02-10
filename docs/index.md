```js
███████████████████████████████████████████████████████████████████
powered by
  ██████  ███████ ███    ███ ██ ██    ██ ██████   ██████  ███████
  ██   ██ ██      ████  ████ ██ ██    ██ ██   ██ ██       ██
  ██   ██ █████   ██ ████ ██ ██ ██    ██ ██████  ██   ███ █████
  ██   ██ ██      ██  ██  ██ ██ ██    ██ ██   ██ ██    ██ ██
  ██████  ███████ ██      ██ ██  ██████  ██   ██  ██████  ███████
  PSEUDO-SPA ARCHITECTURE                                  v0.0.3
███████████████████████████████████████████████████████████████████
```

A lightweight architecture for static sites that behave like a SPA: internal routing, layout partials, per-page scripts, and an accessible modal service.

## Architecture

- `src/bootstrap.js`: entry point; injects layout partials from `window.PageConfig` (header/footer), marks the active nav link, and runs the current page logic.
- `Layout` (`src/core/layout.js`): helpers to fetch partial HTML (`fetch` + `innerHTML`) and highlight the nav link based on the normalized URL.
- `PseudoSPA` (`src/core/pseudo-spa.js`): intercepts internal links and history navigation; downloads the destination document, replaces only `<main>` with optional transitions, updates `history.pushState`, and fires `onAfterNavigate` for rehydration.
- `PageScriptLoader` (`src/core/script-loader.js`): reads `window.PageConfig` to load shared scripts and `data-page` scripts (once); lets you declare `init` as a global reference to run per-view logic after navigation.
- `Modal` (`src/core/modal-service.js`): lightweight service with event delegation for opening/closing modals via `data-modal-open`/`data-modal-close` or programmatically via `Modal.getOrCreate(el)`.

## Build and artifacts

- JS bundle: `node tools/build-arch-bundle.js` generates `dist/bundle.js` with Layout, PseudoSPA, PageScriptLoader, and Modal.
- Core CSS: `node tools/build-arch-styles.js` generates `dist/arch-core.css` by concatenating `src/styles/*.css` (includes `modal.css`).

## Basic usage in a project

Include the artifacts in your HTML:

```html
<link rel="stylesheet" href="/dist/arch-core.css" />
<script src="/dist/bundle.js"></script>
```

## PageConfig example with init/teardown

`PageScriptLoader` loads `sharedScripts` on every view and the `scripts` for each `data-page`. When leaving a page, it removes exclusive scripts and runs teardown. Example:

```js
window.PageConfig = {
  layout: {
    header: { selector: "#app-header", url: "/partials/header.html" },
    footer: { selector: "#app-footer", url: "/partials/footer.html" },
  },
  sharedScripts: ["/scripts/shared/common.js"], // always present
  pages: {
    home: {
      scripts: ["/scripts/pages/home.js"],
      init: "HomePage.init", // can return a cleanup function
      teardown: "HomePage.teardown", // optional, called when leaving the view
    },
    about: { scripts: [], init: null },
  },
};
```

In your page module you can return a cleanup from `init` or expose a `teardown`:

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
    // alternative if init did not return cleanup
    destroyWidgets();
  },
};
```

## Modal service

Works via data-attributes or programmatically and is exposed as `window.Modal`.

Declarative (recommended)

```html
<!-- Trigger -->
<button data-modal-open="#mi-modal">Open modal</button>

<!-- Modal -->
<section
  id="mi-modal"
  class="modal"
  aria-hidden="true"
  role="dialog"
  aria-modal="true"
>
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__dialog" role="document">
    <button class="modal__close" aria-label="Close" data-modal-close>×</button>
    <h2>Modal title</h2>
    <p>Modal content…</p>
    <button data-modal-close>Close</button>
  </div>
</section>
```

Programmatic

```js
const modal = Modal.getOrCreate(document.querySelector("#mi-modal"));
modal.open(); // or modal.close(), modal.toggle()
```

## Notes

- Listeners are delegated on `document`, so modals loaded via PseudoSPA work without rehydration.
- Base modal styles live in `src/styles/modal.css` and are included in `dist/arch-core.css`.
