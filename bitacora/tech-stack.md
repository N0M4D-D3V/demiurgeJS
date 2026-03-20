# Tech Stack

## Runtime
- Node.js >= 22 (tooling/build/release scripts)
- Browser DOM runtime (document/window/fetch/history/URL APIs)
- Plain JavaScript (ES modules) + CSS (no framework runtime)
- Node CLI runtime for `demiurgejs` command (`bin/` + `cli/` modules using `fs`, `path`, `crypto`, `child_process`)

## Tooling
- `esbuild` for JavaScript bundles (`tools/build-js.mjs`)
- `lightningcss` for CSS bundling/minification (`tools/build-css.mjs`)
- `tools/build.mjs` for build orchestration and watch mode
- `tools/verify-pack.mjs` for smoke verification of package outputs
- npm scripts as canonical execution interface (`build`, `dev`, `test:smoke`, `check:pack`)

## Runtime Dependencies
- None. Runtime dependency target is zero.

## Dev Dependencies
- `esbuild`: bundle ESM/CJS/IIFE outputs.
- `lightningcss`: bundle/minify framework CSS outputs.

## Core Technical Rules
- Do not run top-level DOM side effects in library modules intended for package import.
- Keep side effects isolated to browser entries (`src/entries/browser-global.js`, `src/entries/browser-auto-bootstrap.js`).
- Preserve public package exports and browser global compatibility symbols.
- Preserve `window.PageConfig` contract and page lifecycle cleanup order.
- Keep `dist/` as generated output only; never hand-edit built artifacts.
- Keep CLI behavior idempotent for skill sync operations and deterministic for lockfile hash generation.
