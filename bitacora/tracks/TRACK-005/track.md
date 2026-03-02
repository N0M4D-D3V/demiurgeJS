---
track_id: TRACK-005
status: pending
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-02T09:12:37Z
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

- [ ] RED: Add failing tests for bootstrap orchestration order using injected doubles.
- [ ] GREEN: Add tests that verify layout partial injection calls for header/footer configs.
- [ ] GREEN: Add tests that verify active-nav marking after layout injection and after navigation.
- [ ] GREEN: Add tests that verify current page script loading based on `<main data-page="...">`.
- [ ] GREEN: Add tests verifying router creation with `contentSelector: "main"` and callback composition.
- [ ] GREEN: Add tests for `enableModalDelegation` toggle and `logBanner` toggle behavior.
- [ ] GREEN: Add tests ensuring returned router object has `init()` invoked.
- [ ] GREEN: Add tests for `autoBootstrapDemiurge` catching bootstrap errors and logging.
- [ ] RED: Add failing tests for browser-global attachment behavior.
- [ ] GREEN: Apply small internal refactor in entries to expose pure helper functions for tests.
- [ ] GREEN: Add tests that verify `window.Demiurge` merge behavior and legacy aliases assignment.
- [ ] GREEN: Add tests that verify modal delegation auto-init when `document` exists.
- [ ] GREEN: Add tests for browser-auto-bootstrap behavior across `document.readyState` conditions.
- [ ] REFACTOR: Confirm no changes required in `package.json` exports surface.

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
