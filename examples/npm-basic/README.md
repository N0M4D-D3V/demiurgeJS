# DemiurgeJS `npm-basic` Vite Example

Runnable reference project that shows how the DemiurgeJS npm package is used in a static multi-page Vite app with pseudo-SPA behavior.

## What This Demonstrates

- `window.PageConfig` as the consumer contract (`examples/npm-basic/src/main.js`)
- layout partial injection (`public/partials/header.html`, `public/partials/footer.html`)
- pseudo-SPA navigation across multiple HTML documents (`index.html`, `schedules.html`, `settings.html`, etc.)
- shared scripts loaded once (`public/scripts/shared/*`)
- per-page scripts with `init` + returned cleanup + configured `teardown` (`public/scripts/pages/*`)
- modal delegation via `data-modal-open` / `data-modal-close`

## Run It

1. Build the local package from the repository root:

```bash
npm run build
```

2. Install and run the example:

```bash
cd examples/npm-basic
npm install
npm run dev
```

3. Open the Vite URL (usually `http://localhost:5173`).

## Important Notes

- The example depends on the local repo package via `file:../..` in `examples/npm-basic/package.json`.
- The footer includes a runtime log so you can verify page lifecycle order while navigating.
- Each page includes the same `src/main.js` entry; DemiurgeJS swaps `<main>` during internal navigation.

## Architecture Map (For Developers and AI Agents)

- `src/main.js`
  - imports `bootstrapDemiurge` and package CSS
  - defines `window.PageConfig`
  - calls `bootstrapDemiurge()`
- `public/partials/*`
  - injected into `#app-header` and `#app-footer`
  - header provides `#menu` for active link highlighting
- `public/scripts/shared/*`
  - loaded once by `sharedScripts`
  - persists across pseudo-SPA navigation
- `public/scripts/pages/*`
  - loaded only for the active page
  - `init` may return cleanup; `teardown` runs after cleanup on navigation
- `*.html`
  - static documents for Vite MPA mode
  - each must include `<main data-page="...">`

## Suggested Validation Flow

1. Start on `/`.
2. Click `Schedules`, then `Schedule Detail`, then `Settings`.
3. Watch the footer runtime log.
4. Confirm cleanup logs appear before teardown logs for the page you leave.

