# Tracks

> Canonical project status and handoff registry.
>
> Last updated: 2026-03-17
>
> Rule: update this file after meaningful implementation changes.

## Snapshot

- Project: @n0m4d-d3v/demiurgejs
- Current status: TRACK-006 completed; coverage gate and publish workflow integration are active with all tracks closed.
- Active tracks: none

## Track Registry

| ID | Title | Status | Phase | Last Update | Notes |
| --- | --- | --- | --- | --- | --- |
| TRACK-001 | Bootstrap project memory | completed | green | 2026-03-02 | Product/tech/workflow/UX docs populated using README, docs, and source files |
| TRACK-002 | Unit testing baseline and harness setup | completed | green | 2026-03-17 | Unit harness scaffold delivered (`tests/unit`), legacy exploration tests moved to `tests/legacy`, scripts and coverage command validated |
| TRACK-003 | Unit tests for layout and script-loader | completed | green | 2026-03-17 | Added deterministic contract tests for `injectPartial`, `markActiveNavLink`, `loadScript`, `resolveFunction`, `loadForPage`, and state reset |
| TRACK-004 | Unit tests for pseudo-spa and modal | completed | green | 2026-03-17 | Added behavior-driven tests for link handling matrix, lifecycle, transitions, modal accessibility, delegation, and idempotency |
| TRACK-005 | Unit tests for bootstrap and browser entries | completed | green | 2026-03-17 | Added test suites for bootstrap/entries plus minimal testability refactor with no export-surface change |
| TRACK-006 | Coverage gate, publish integration, and closeout | completed | green | 2026-03-17 | Enforced 80% coverage thresholds, updated prepublish workflow, validated full gate chain, and synced docs |

## Sequencing Rules

1. Execute TRACK-002 fully before starting any other track.
2. Execute TRACK-003 then TRACK-004.
3. Start TRACK-005 only after TRACK-002 helper utilities are stable.
4. Execute TRACK-006 last for gate enforcement and documentation closeout.

## Session Handoff (Required)

- 2026-03-17 | Implementation session: completed TRACK-006 coverage gate and publish integration closeout.

- Tracks touched: TRACK-006, tracks.md
- What changed:
  - Enforced 80% global coverage thresholds in `package.json` by updating `test:unit:coverage` to use `c8 --check-coverage --lines 80 --functions 80 --branches 80 --statements 80`.
  - Updated publish gate order in `prepublishOnly` to: `npm run build && npm run test:unit && npm run test:smoke && npm run check:pack`.
  - Updated `README.md` development section with `test:unit` and `test:unit:coverage` commands and aligned publish command examples.
  - Updated `bitacora/workflow.md` quality gates and release flow to include unit and coverage gates.
  - Applied a safety refactor in `src/entries/browser-auto-bootstrap.js` to call `attachDemiurgeToGlobal()` explicitly, preventing bundler side-effect pruning warnings from bare imports.
- Tests run:
  - `npm run test:unit:coverage` -> pass (global coverage: 97.5% lines, 84.72% branches, 96.07% functions, 97.5% statements; thresholds enforced at 80%).
  - `npm run build && npm run test:unit && npm run test:smoke` -> pass.
  - `npm run check:pack` -> pass (required elevated execution due local npm cache permission ownership).
  - `npm run prepublishOnly` -> pass (full gate chain validated end-to-end).
- Current phase:
  - TRACK-006 completed (green).
- Blockers/assumptions:
  - No blockers; all planned tracks are closed.
- Next recommended action:
  - Prepare release actions (version bump/changelog/tag/publish) when desired.

- 2026-03-17 | Implementation session: completed TRACK-005 for bootstrap and browser entries unit testing.

- Tracks touched: TRACK-005, tracks.md
- What changed:
  - Added `tests/unit/bootstrap/bootstrap.test.js` and `tests/unit/bootstrap/auto-bootstrap.test.js` to cover orchestration order, layout/header-footer injection, active-nav refresh, page-script loading, router `init`, toggles (`enableModalDelegation`, `logBanner`), and bootstrap error logging.
  - Added `tests/unit/entries/browser-global.test.js` and `tests/unit/entries/browser-auto-bootstrap.test.js` to cover `window.Demiurge` merge, legacy aliases, modal delegation init, `DOMContentLoaded` registration, ready-state immediate execution, and no-document guards.
  - Applied minimal internal testability refactor with no public package export changes:
    - `src/bootstrap/bootstrap.js`: optional `modalDelegationInit` injection hook.
    - `src/bootstrap/auto-bootstrap.js`: optional bootstrap function injection.
    - `src/entries/browser-global.js`: extracted `getGlobalObject` and `attachDemiurgeToGlobal`.
    - `src/entries/browser-auto-bootstrap.js`: extracted `runAutoBootstrap` and `initAutoBootstrap`.
- Tests run:
  - `npm run test:unit` -> pass (47 tests).
  - `npm run test:unit:coverage` -> pass (global: 97.5% lines, 84.72% branches, 96.07% funcs, 97.5% statements; bootstrap/entries line coverage 100%).
- Current phase:
  - TRACK-005 completed (green).
- Blockers/assumptions:
  - No blockers for TRACK-005 closeout.
- Next recommended action:
  - Start TRACK-006: enforce coverage gate in workflow/publish path and update docs.

- 2026-03-17 | Review session: audited active tracks to confirm execution target and immediate next action. No source-code changes or tests run.

- Tracks touched: TRACK-005, tracks.md
- What changed:
  - Confirmed `TRACK-005` is the only active track in registry and frontmatter status.
  - Revalidated open task list and acceptance criteria for bootstrap and browser entries coverage.
  - Synced `TRACK-005/track.md` log with review traceability entry.
- Tests run:
  - None (documentation/state review only).
- Current phase:
  - TRACK-005 remains active (red).
- Blockers/assumptions:
  - No new blockers; execution depends on implementing bootstrap/entries unit tests in TRACK-005.
- Next recommended action:
  - Start TRACK-005 RED step by adding failing tests for bootstrap orchestration order using injected doubles.

- 2026-03-17 | Implementation session: completed TRACK-004 with TDD-oriented unit tests for pseudo-spa and modal.

- Tracks touched: TRACK-004, tracks.md
- What changed:
  - Added `tests/unit/core/pseudo-spa.test.js` covering link-handling reject/accept matrix, router init/destroy, delegated clicks, no-op guards, `loadDocument`, `swapContent`, fallback assignment, and transition class timing cleanup.
  - Added `tests/unit/core/modal.test.js` covering `Modal.getOrCreate`, open/close/toggle, aria states, focus transfer/restore, Escape behavior, delegation open/close, and delegation idempotency.
  - Extended `tests/unit/_helpers/dom-env.js` globals (`Element`, `MouseEvent`, `KeyboardEvent`, `FocusEvent`, `PopStateEvent`) to support deterministic DOM-event tests.
- Tests run:
  - `npm run test:unit` -> pass (35 tests).
  - `npm run test:unit:coverage` -> pass (`pseudo-spa.js` 93.77% lines, `modal.js` 100% lines).
- Current phase:
  - TRACK-004 completed (green).
- Blockers/assumptions:
  - No blockers for TRACK-004 closeout.
- Next recommended action:
  - Start TRACK-005 for bootstrap orchestration and browser entry side effects.

- 2026-03-17 | Implementation session: completed TRACK-003 with TDD-oriented unit tests for layout and script-loader.

- Tracks touched: TRACK-003, tracks.md
- What changed:
  - Added `tests/unit/core/layout.test.js` with fetch failure/success, header assertion, and nav matching normalization/boundary coverage.
  - Added `tests/unit/core/script-loader.test.js` covering no-op/duplicate prevention, tracked scripts, load errors, resolver behavior, PageConfig flows, cleanup ordering, page-script reloading, and reset state.
  - Reused TRACK-002 helpers and enforced test teardown (`resetScriptLoaderState`, DOM teardown, spy restoration) in every test.
- Tests run:
  - `npm run test:unit` -> pass (20 tests).
  - `npm run test:unit:coverage` -> pass (`layout.js` 100% lines, `script-loader.js` 97.2% lines).
- Current phase:
  - TRACK-003 completed (green).
- Blockers/assumptions:
  - No blockers for TRACK-003 closeout.
- Next recommended action:
  - Start TRACK-004 test suite for `src/core/pseudo-spa.js` and `src/core/modal.js`.

- 2026-03-17 | Implementation session: completed TRACK-002 unit testing baseline and harness setup.

- Tracks touched: TRACK-002, tracks.md
- What changed:
  - Added `jsdom` and `c8` dev dependencies.
  - Added scripts `test:unit` and `test:unit:coverage`.
  - Created `tests/unit/_helpers/{dom-env,spies,flush}.js` and `tests/unit/sanity.test.js`.
  - Moved prior exploration tests/scripts to `tests/legacy/` to retire them from the active unit path.
  - Added `coverage/` and `.nyc_output/` to `.gitignore`.
- Tests run:
  - `npm run test:unit` -> pass (3 tests).
  - `npm run test:unit:coverage` -> pass (3 tests, coverage report emitted).
- Current phase:
  - TRACK-002 completed (green).
- Blockers/assumptions:
  - Coverage percentages are expectedly low/zero until TRACK-003+ adds tests that exercise `src/` modules.
- Next recommended action:
  - Start TRACK-003 with failing tests for `src/core/layout.js` and `src/core/script-loader.js`.

- 2026-03-17 | Review session: audited open tasks across TRACK-002 to TRACK-006 to prepare execution order. No source-code changes or tests run.

- Tracks touched: tracks.md, TRACK-002, TRACK-003, TRACK-004, TRACK-005, TRACK-006
- What changed:
  - Confirmed all remaining open tasks and dependency order from the unit-testing roadmap.
  - Confirmed active work should continue in TRACK-002 before any pending track starts.
- Tests run:
  - None (documentation/state review only).
- Current phase:
  - TRACK-002 remains active in RED.
- Blockers/assumptions:
  - Blocker unchanged: TRACK-002 harness setup is still pending and gates all downstream tracks.
- Next recommended action:
  - Execute TRACK-002 task: create `tests/unit/sanity.test.js` and start harness scaffold.

- 2026-03-17 | Advisory session: reviewed project documentation to define how to install the `demiurgejs-architect` skill in another repository for AI agents. No source-code changes or tests run.

- Tracks touched: TRACK-002, TRACK-003, TRACK-004, TRACK-005, TRACK-006, tracks.md
- What changed:
  - Added five new detailed execution tracks for unit-testing rollout.
  - Defined sequential dependencies, explicit RED/GREEN/REFACTOR tasks, and acceptance criteria.
  - Documented baseline failure mode of current tests and target commands for future execution.
- Tests run:
  - `node --test tests/*.test.js` -> failed (5 failing files using `require(...)` under ESM: `architecture-md.test.js`, `exploration-verify.test.js`, `exploration.test.js`, `explore-structure.test.js`, `project-exploration.test.js`).
- Current phase:
  - TRACK-002 at RED (baseline captured, implementation pending).
- Blockers/assumptions:
  - Assumption: Node.js >=22 remains the runtime baseline.
  - Assumption: `node:test` + `jsdom` + `c8` will be the long-term unit testing stack.
  - Blocker to clear in TRACK-002: remove/replace legacy exploration tests from active test path.
- Next recommended action:
  - Start TRACK-002 task 2 (`tests/unit/sanity.test.js`) and complete harness setup before module-level tests.

Minimum handoff payload:
- Track(s) touched
- Tests run (exact command + result)
- Current phase/status
- Blockers/assumptions
- Next recommended action
