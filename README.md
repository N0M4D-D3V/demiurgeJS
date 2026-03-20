# DemiurgeJS

DemiurgeJS is a lightweight frontend architecture for static sites that need SPA-like behavior without a framework.

It provides:

- internal routing with `<main>` swapping
- layout partial injection (header/footer)
- per-page script loading with cleanup/teardown
- accessible modal service

DemiurgeJS is now distributed as an npm package with modular builds, while preserving browser-global usage for existing projects.

## Installation

### npm

```bash
npm install @n0m4d-d3v/demiurgejs
```

### pnpm

```bash
pnpm add @n0m4d-d3v/demiurgejs
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/demiurge.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/demiurge.global.min.js"></script>
```

## Quick Start (ESM)

```js
import { bootstrapDemiurge } from "@n0m4d-d3v/demiurgejs";
import "@n0m4d-d3v/demiurgejs/style.css";

window.PageConfig = {
  layout: {
    header: { selector: "#app-header", url: "/partials/header.html" },
    footer: { selector: "#app-footer", url: "/partials/footer.html" },
    navSelector: "#menu a[href]",
  },
  sharedScripts: ["/scripts/shared/common.js"],
  pages: {
    home: { scripts: ["/scripts/pages/home.js"], init: "HomePage.init" },
  },
};

bootstrapDemiurge();
```

## Quick Start (Script Tag / Global)

### CDN global build (manual bootstrap)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/demiurge.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/demiurge.global.min.js"></script>
<script>
  window.PageConfig = {
    layout: {
      header: { selector: "#app-header", url: "/partials/header.html" },
      footer: { selector: "#app-footer", url: "/partials/footer.html" },
    },
    pages: { home: { scripts: [], init: null } },
  };

  Demiurge.bootstrapDemiurge();
</script>
```

### Auto-bootstrap global build (legacy-friendly)

This preserves the old “include script and it boots on `DOMContentLoaded`” flow.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/demiurge.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/auto-bootstrap.global.min.js"></script>
```

## CSS Import Instructions

- npm/pnpm consumers should import the package CSS subpath:
  - `@n0m4d-d3v/demiurgejs/style.css`
- CDN/script users should include:
  - `dist/demiurge.css` or `dist/demiurge.min.css`

## Modular Usage Example

Use only what you need (for example, modal service only):

```js
import { Modal, initModalDelegation } from "@n0m4d-d3v/demiurgejs";
import "@n0m4d-d3v/demiurgejs/style.css";

initModalDelegation(document);

const modal = Modal.getOrCreate(document.querySelector("#my-modal"));
modal?.open();
```

## Auto-Bootstrap Example

If you want script-tag behavior with zero custom bootstrap code:

```html
<script src="https://cdn.jsdelivr.net/npm/@n0m4d-d3v/demiurgejs/dist/auto-bootstrap.global.min.js"></script>
```

This build:

- attaches `window.Demiurge`
- preserves legacy globals (`Layout`, `PseudoSPA`, `PageScriptLoader`, `Modal`)
- initializes modal delegation
- boots DemiurgeJS on `DOMContentLoaded`

## Exports (Package Surface)

`package.json` exports:

- `.` -> ESM/CJS library entry (`bootstrapDemiurge`, `Layout`, `PseudoSPA`, `PageScriptLoader`, `Modal`, etc.)
- `./style.css` -> package CSS
- `./browser` -> minified browser global build
- `./auto-bootstrap` -> minified browser global + auto-bootstrap build

Direct CDN artifact paths are also available under `dist/`.

## Backward Compatibility

DemiurgeJS preserves browser-global compatibility:

- `window.Layout`
- `window.PseudoSPA`
- `window.PageScriptLoader`
- `window.Modal`

New browser builds also expose `window.Demiurge` as the preferred namespace.

## Documentation

Full documentation:

- https://n0m4d-d3v.github.io/demiurgeJS/

Repository examples:

- `examples/npm-basic/`
- `examples/cdn-basic/`
- `examples/legacy-script/`

## AI Skills

DemiurgeJS provides an official architecture skill for AI agents:

- skills/demiurgejs-architect/latest.md

Use it to scaffold, extend and audit DemiurgeJS projects safely.

### CLI

The package also ships a CLI binary: `demiurgejs`.

Install/update the architecture skill in a target project:

```bash
demiurgejs skill sync
demiurgejs skill sync --project /path/to/project
```

This command writes:

- `.agents/skills/demiurgejs-architect/SKILL.md`
- `skills-lock.json` (merged and updated idempotently)

Generate the legacy pseudo-SPA scaffold:

```bash
demiurgejs init my-project
```

## Development

### Build

```bash
npm run build
```

Generates `dist/` outputs:

- `index.js` (ESM)
- `index.cjs` (CJS)
- `demiurge.global(.min).js`
- `auto-bootstrap.global(.min).js`
- `demiurge(.min).css`

### Dev (watch)

```bash
npm run dev
```

### Smoke checks

```bash
npm run test:smoke
```

### Unit tests

```bash
npm run test:unit
```

### Coverage checks (>= 80% global)

```bash
npm run test:unit:coverage
```

### Publish workflow

```bash
npm run build
npm run test:unit
npm run test:smoke
npm run check:pack
```

`prepublishOnly` runs these checks automatically before `npm publish`.
