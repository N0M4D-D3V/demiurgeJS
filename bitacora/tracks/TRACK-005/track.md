---
track_id: TRACK-005
status: completed
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-17T16:06:12Z
---

# Overview

- Goal: Add unit coverage for `bootstrap` and browser entry points while preserving public API and backward compatibility behavior.
- Scope:
  - Test orchestration flow in `src/bootstrap/bootstrap.js`.
  - Test error handling in `src/bootstrap/auto-bootstrap.js`.
  - Test side-effect behavior in `src/entries/browser-global.js` and `src/entries/browser-auto-bootstrap.js`.
  - Apply minimal internal refactor to expose testable helpers without changing package exports.
- Out of scope:
  - Build tooling changes and coverage gate enforcement (handled in TRACK-006).
- Dependencies:
  - TRACK-002 completed.
  - TRACK-003 and TRACK-004 completed (shared helper maturity).

# Tasks

- [x] RED: Add failing tests for bootstrap orchestration order using injected doubles.
- [x] GREEN: Add tests that verify layout partial injection calls for header/footer configs.
- [x] GREEN: Add tests that verify active-nav marking after layout injection and after navigation.
- [x] GREEN: Add tests that verify current page script loading based on `<main data-page="...">`.
- [x] GREEN: Add tests verifying router creation with `contentSelector: "main"` and callback composition.
- [x] GREEN: Add tests for `enableModalDelegation` toggle and `logBanner` toggle behavior.
- [x] GREEN: Add tests ensuring returned router object has `init()` invoked.
- [x] GREEN: Add tests for `autoBootstrapDemiurge` catching bootstrap errors and logging.
- [x] RED: Add failing tests for browser-global attachment behavior.
- [x] GREEN: Apply small internal refactor in entries to expose pure helper functions for tests.
- [x] GREEN: Add tests that verify `window.Demiurge` merge behavior and legacy aliases assignment.
- [x] GREEN: Add tests that verify modal delegation auto-init when `document` exists.
- [x] GREEN: Add tests for browser-auto-bootstrap behavior across `document.readyState` conditions.
- [x] REFACTOR: Confirm no changes required in `package.json` exports surface.

# Acceptance Criteria

- `tests/unit/bootstrap/bootstrap.test.js` and `tests/unit/bootstrap/auto-bootstrap.test.js` pass.
- `tests/unit/entries/browser-global.test.js` and `tests/unit/entries/browser-auto-bootstrap.test.js` pass.
- Public package exports remain unchanged (`.` / `./style.css` / `./browser` / `./auto-bootstrap`).
- Browser-global backward compatibility symbols remain covered by assertions.

# Deliverables

- Bootstrap unit tests.
- Entries unit tests.
- Minimal internal testability refactor with zero public API change.

# Decisions

- 2026-03-02T09:12:37Z | Internal testability refactor is allowed only if public API and behavior remain unchanged.
- 2026-03-02T09:12:37Z | Legacy global compatibility (`window.Layout`, `window.PseudoSPA`, `window.PageScriptLoader`, `window.Modal`) must be asserted.

# Log

- 2026-03-02T09:12:37Z | Track created from roadmap implementation.
- 2026-03-02T09:12:37Z | Waiting on TRACK-002, TRACK-003, and TRACK-004.
- 2026-03-17T15:48:17Z | TRACK-004 completed; dependencies cleared and track promoted to active.
- 2026-03-17T15:50:24Z | Review session: active track checklist revalidated; no implementation changes applied.
- 2026-03-17T16:06:12Z | Added bootstrap and entries test suites (`tests/unit/bootstrap/*`, `tests/unit/entries/*`) covering orchestration, toggles, error handling, global attachment merge, legacy aliases, and readyState auto-bootstrap behavior.
- 2026-03-17T16:06:12Z | Applied minimal internal testability refactor: `bootstrapDemiurge` now accepts `modalDelegationInit` override; entries expose `attachDemiurgeToGlobal`, `runAutoBootstrap`, and `initAutoBootstrap` while preserving side-effect entry behavior.
- 2026-03-17T16:06:12Z | Validation: `npm run test:unit` pass (47/47), `npm run test:unit:coverage` pass; `bootstrap/*` and `entries/*` at 100% lines and `package.json` exports unchanged.
