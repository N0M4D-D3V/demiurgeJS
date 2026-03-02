---
track_id: TRACK-002
status: active
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-02T09:14:26Z
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
- [ ] RED: Create `tests/unit/sanity.test.js` that intentionally fails until harness is configured.
- [ ] GREEN: Add dev dependencies `jsdom` and `c8` in `package.json`.
- [ ] GREEN: Add scripts in `package.json`: `test:unit` and `test:unit:coverage`.
- [ ] GREEN: Create `tests/unit/_helpers/dom-env.js` to bootstrap/reset `window`, `document`, `history`, and `location`.
- [ ] GREEN: Create `tests/unit/_helpers/spies.js` for controlled spies on `console`, `fetch`, and DOM event listeners.
- [ ] GREEN: Create `tests/unit/_helpers/flush.js` for promise/microtask timing helpers.
- [ ] GREEN: Replace or retire legacy exploration tests from active unit execution path.
- [ ] GREEN: Add coverage output ignores to `.gitignore` (`coverage/`, `.nyc_output/`).
- [ ] REFACTOR: Standardize all active tests to ESM and `*.test.js` naming under `tests/unit/**`.
- [ ] REFACTOR: Ensure helper teardown runs after every test to prevent cross-test state leaks.

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

# Log

- 2026-03-02T09:12:37Z | Track created from roadmap implementation.
- 2026-03-02T09:12:37Z | Baseline failure confirmed with `node --test tests/*.test.js` (5 failures due to `require` in ESM context).
- 2026-03-02T09:12:37Z | Next action: implement harness scaffold and new scripts.
