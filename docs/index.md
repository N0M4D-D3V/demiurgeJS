---
layout: default
title: Demiurge.JS
---

# DemiurgeJS

DemiurgeJS is a lightweight pseudo-SPA architecture for static sites that need routing-like behavior, layout partials, per-page scripts, and utility services without a framework runtime.

It supports both:
- **Library usage** (npm/pnpm imports: ESM + CJS)
- **Script usage** (browser IIFE globals, including auto-bootstrap)

## Architecture Overview

Core runtime modules:
- `Layout` (`src/core/layout.js`): partial injection + active nav link highlighting
- `PseudoSPA` (`src/core/pseudo-spa.js`): internal navigation interception and `<main>` replacement
- `PageScriptLoader` (`src/core/script-loader.js`): page script loading, cleanup, and teardown
- `Modal` (`src/core/modal.js`): accessible modal service + delegated trigger support

Bootstrap and entries:
- `src/bootstrap/bootstrap.js`: explicit `bootstrapDemiurge()` function
- `src/entries/index.js`: package export entry (ESM/CJS)
- `src/entries/browser-global.js`: browser global entry (`window.Demiurge` + legacy globals)
- `src/entries/browser-auto-bootstrap.js`: browser global + DOMContentLoaded auto-bootstrap

## Package Architecture

### Source structure (`src/`)

- `src/core/` -> reusable runtime modules (side-effect free by default)
- `src/bootstrap/` -> bootstrap helpers and banner
- `src/entries/` -> distribution-specific entry points
- `src/styles/` -> framework CSS and CSS aggregation entry (`index.css`)

### Build tooling (`tools/`)

- `tools/build-js.mjs` -> builds ESM, CJS, and browser IIFE outputs with `esbuild`
- `tools/build-css.mjs` -> builds CSS outputs with `lightningcss`
- `tools/build.mjs` -> orchestrates build/watch flow
- `tools/verify-pack.mjs` -> smoke checks generated package artifacts

## Distribution Targets

`npm run build` generates `dist/` artifacts for multiple consumption modes:

- `dist/index.js` -> ESM library build
- `dist/index.cjs` -> CJS library build
- `dist/index.d.ts` -> Type declarations
- `dist/demiurge.global.js` / `dist/demiurge.global.min.js` -> browser global build
- `dist/auto-bootstrap.global.js` / `dist/auto-bootstrap.global.min.js` -> browser global + auto-bootstrap build
- `dist/demiurge.css` / `dist/demiurge.min.css` -> framework CSS

## Using as Library vs Script

### Library usage (npm/pnpm)

Use this when your project has a bundler/build system.

```js
import { bootstrapDemiurge, Modal } from "@n0m4d-d3v/demiurgejs";
import "@n0m4d-d3v/demiurgejs/style.css";

bootstrapDemiurge();
```

You can also import individual APIs:

```js
import { Modal, initModalDelegation } from "@n0m4d-d3v/demiurgejs";

initModalDelegation(document);
```

### Script usage (browser global)

Use this for static sites without a bundler.

Manual bootstrap:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/demiurge.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/demiurge.global.min.js"></script>
<script>
  Demiurge.bootstrapDemiurge();
</script>
```

Auto-bootstrap (legacy-friendly):

```html
<script src="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/auto-bootstrap.global.min.js"></script>
```

## Backward Compatibility (Globals)

The browser global build preserves legacy globals for existing integrations:

- `window.Layout`
- `window.PseudoSPA`
- `window.PageScriptLoader`
- `window.Modal`

Preferred global namespace for new code:
- `window.Demiurge`

## PageConfig Contract

`PageScriptLoader` expects:
- a replaceable `<main data-page="page-id">...</main>`
- a `window.PageConfig` object with page registrations

Minimal example:

```js
window.PageConfig = {
  layout: {
    header: { selector: "#app-header", url: "/partials/header.html" },
    footer: { selector: "#app-footer", url: "/partials/footer.html" },
    navSelector: "#menu a[href]",
  },
  sharedScripts: ["/scripts/shared/common.js"],
  pages: {
    home: {
      scripts: ["/scripts/pages/home.js"],
      init: "HomePage.init",
      teardown: "HomePage.teardown",
    },
  },
};
```

Cleanup behavior when navigating away:
1. Runs cleanup returned by `init()` (if any)
2. Runs configured `teardown` function (if any)

## Modal Service

Declarative usage (recommended):

```html
<button data-modal-open="#my-modal">Open modal</button>

<section id="my-modal" class="modal" aria-hidden="true" role="dialog" aria-modal="true">
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__dialog" role="document">
    <button class="modal__close" aria-label="Close" data-modal-close>×</button>
    <p>Modal content</p>
  </div>
</section>
```

Programmatic usage:

```js
const modal = Modal.getOrCreate(document.querySelector("#my-modal"));
modal?.open();
```

Delegated listeners are attached at the document level, so modal triggers continue working after pseudo-SPA page swaps.

## Development Workflow

Install dependencies:

```bash
npm install
```

Build package outputs:

```bash
npm run build
```

Watch mode:

```bash
npm run dev
```

Smoke checks:

```bash
npm run test:smoke
```

## CLI (`demiurgejs`)

The package includes a local/global CLI binary: `demiurgejs`.

Main commands:

```bash
demiurgejs skill sync
demiurgejs skill sync --project /path/to/project
demiurgejs init my-project
```

`skill sync` installs or updates the packaged architecture skill in the target project:

- `.agents/skills/demiurgejs-architect/SKILL.md`
- `skills-lock.json` (merge-safe update with deterministic hash)

### Local CLI with `npm link`

From this repository root:

```bash
npm link
demiurgejs --help
```

To remove the global link:

```bash
npm unlink -g @n0m4d-d3v/demiurgejs
```
