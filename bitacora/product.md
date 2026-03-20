# Product

## Name
DemiurgeJS

## One-liner
Lightweight pseudo-SPA architecture for static sites that need SPA-like navigation behavior without a framework runtime.

## Problem
Static multi-page sites often need internal navigation, reusable layout partials, per-page lifecycle scripts, and modal UX, but full frameworks add unnecessary runtime and complexity for those use cases.

## Goals
- Provide pseudo-SPA internal navigation by intercepting links and replacing `<main>` content.
- Support layout partial injection (header/footer) and active navigation highlighting.
- Orchestrate per-page script loading, `init`, cleanup, and `teardown` via `window.PageConfig`.
- Provide a packaged CLI (`demiurgejs`) for architecture utilities, including skill sync installation/updates and legacy scaffold bootstrapping.
- Keep runtime dependency count at zero (plain JavaScript + CSS).
- Support both npm consumers (ESM/CJS) and script-tag/browser-global consumers.
- Preserve backward compatibility for legacy globals and existing PageConfig integrations.

## Non-goals
- Becoming a full frontend framework with component system/state management.
- Owning application-specific UI theming or design-system decisions.
- Replacing backend/server routing concerns.
- Breaking existing script-tag/legacy-global usage without explicit versioned migration.

## Success Criteria
- `npm run build`, `npm run test:smoke`, and `npm run check:pack` pass before release.
- Generated `dist/` artifacts match declared package exports.
- Browser global builds continue exposing `window.Demiurge` and legacy aliases.
- Pseudo-SPA lifecycle preserves cleanup order: `init` returned cleanup, then configured `teardown`.
