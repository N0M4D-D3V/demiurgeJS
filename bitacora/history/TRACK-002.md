---
track_id: TRACK-002
status: completed
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-17T15:27:51Z
---

# Overview

- Goal: Establish a deterministic unit-testing baseline for DemiurgeJS using `node:test` + `jsdom` and remove current test noise.
- Scope:
  - Define test folder conventions and helper utilities under `tests/unit/`.
  - Add package scripts for unit tests and coverage checks.
  - Replace legacy exploration tests currently failing due to CJS/ESM mismatch.
  - Document baseline and completion criteria for downstream tracks.
- Out of scope:
  - Writing module-specific assertions for `src/core/*` behavior (handled in TRACK-003 and TRACK-004).
  - Changing runtime/public library APIs.
- Dependencies:
  - None (entry point track).

# Tasks

- [x] RED: Run `node --test tests/*.test.js` and capture baseline failures in this track log.
- [x] RED: Create `tests/unit/sanity.test.js` that intentionally fails until harness is configured.
- [x] GREEN: Add dev dependencies `jsdom` and `c8` in `package.json`.
- [x] GREEN: Add scripts in `package.json`: `test:unit` and `test:unit:coverage`.
- [x] GREEN: Create `tests/unit/_helpers/dom-env.js` to bootstrap/reset `window`, `document`, `history`, and `location`.
- [x] GREEN: Create `tests/unit/_helpers/spies.js` for controlled spies on `console`, `fetch`, and DOM event listeners.
- [x] GREEN: Create `tests/unit/_helpers/flush.js` for promise/microtask timing helpers.
- [x] GREEN: Replace or retire legacy exploration tests from active unit execution path.
- [x] GREEN: Add coverage output ignores to `.gitignore` (`coverage/`, `.nyc_output/`).
- [x] REFACTOR: Standardize all active tests to ESM and `*.test.js` naming under `tests/unit/**`.
- [x] REFACTOR: Ensure helper teardown runs after every test to prevent cross-test state leaks.

# Acceptance Criteria

- `npm run test:unit` executes only the new unit test suite path.
- `npm run test:unit` is green with deterministic results across repeated runs.
- Legacy exploration tests no longer break the active unit workflow.
- `npm run test:unit:coverage` executes and emits coverage report (threshold may fail until TRACK-006).

# Deliverables

- `package.json` scripts updated.
- `tests/unit/` scaffold and helpers created.
- Legacy tests replaced/retired from active path.
- Baseline and completion evidence recorded in log.

# Decisions

- 2026-03-02T09:12:37Z | Use `node:test` + `jsdom` as the official unit test harness.
- 2026-03-02T09:12:37Z | Use `c8` for coverage and enforce threshold in TRACK-006.
- 2026-03-02T09:12:37Z | Replace legacy exploration tests instead of running mixed old/new suites.
- 2026-03-17T15:27:51Z | Scope active unit execution to `tests/unit/**/*.test.js` and move prior exploration suite to `tests/legacy/`.

# Log

- 2026-03-02T09:12:37Z | Track created from roadmap implementation.
- 2026-03-02T09:12:37Z | Baseline failure confirmed with `node --test tests/*.test.js` (5 failures due to `require` in ESM context).
- 2026-03-02T09:12:37Z | Next action: implement harness scaffold and new scripts.
- 2026-03-17T15:15:50Z | Open-task audit performed; track remains active and blocked on harness setup tasks.
- 2026-03-17T15:27:51Z | Implemented unit harness baseline, added helpers + sanity test, and validated `npm run test:unit` / `npm run test:unit:coverage`.
