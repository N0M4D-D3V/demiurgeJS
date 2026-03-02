---
track_id: TRACK-004
status: pending
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-02T09:12:37Z
---

# Overview

- Goal: Validate navigation logic in `src/core/pseudo-spa.js` and accessibility/delegation behavior in `src/core/modal.js`.
- Scope:
  - Test `defaultShouldHandleLink` decision matrix for internal vs external link handling.
  - Test PseudoSPA lifecycle (`init`, `destroy`, click interception, popstate handling, navigation/swap fallbacks).
  - Test modal instance behavior, focus handling, ESC key behavior, and delegated open/close triggers.
- Out of scope:
  - Bootstrap orchestration and browser entry side effects (handled in TRACK-005).
- Dependencies:
  - TRACK-002 completed.
  - TRACK-003 completed or stable helper abstractions available.

# Tasks

- [ ] RED: Add failing tests for `defaultShouldHandleLink` reject cases (`#`, `mailto`, `tel`, modifiers, target, external origin, same URL).
- [ ] GREEN: Add positive-case tests for valid internal navigation links.
- [ ] RED: Add failing tests for PseudoSPA `init`/`destroy` listener registration and removal.
- [ ] GREEN: Add tests for delegated document click behavior calling `navigate` only when allowed.
- [ ] GREEN: Add tests for `navigate` no-op when already navigating or same URL.
- [ ] GREEN: Add tests for `loadDocument` success, non-ok response returning null, and parse behavior.
- [ ] GREEN: Add tests for `swapContent` main replacement, title update, pushState behavior, and scroll reset.
- [ ] GREEN: Add tests verifying fallback to full-page navigation when swap prerequisites are missing.
- [ ] GREEN: Add tests covering transition classes for leave/enter states and cleanup timing.
- [ ] RED: Add failing tests for `Modal.getOrCreate` instance reuse and null behavior.
- [ ] GREEN: Add tests for `open`, `close`, `toggle`, `isOpen`, and `aria-hidden` state.
- [ ] GREEN: Add tests for focus transfer to first focusable element and focus restoration on close.
- [ ] GREEN: Add tests ensuring ESC key closes modal only when open.
- [ ] GREEN: Add tests for `initModalDelegation` opening and closing modals via `data-modal-open` and `data-modal-close`.
- [ ] GREEN: Add idempotency test for `initModalDelegation` with same root.
- [ ] REFACTOR: Stabilize async and timer-dependent tests to avoid flakiness.

# Acceptance Criteria

- `tests/unit/core/pseudo-spa.test.js` and `tests/unit/core/modal.test.js` pass reliably.
- `pseudo-spa.js` and `modal.js` each reach >= 85% line coverage.
- Delegation idempotency and accessibility behaviors are explicitly asserted.

# Deliverables

- `tests/unit/core/pseudo-spa.test.js`
- `tests/unit/core/modal.test.js`
- Any helper extensions needed for event/timer control.

# Decisions

- 2026-03-02T09:12:37Z | Prefer behavior-driven assertions over class internals except where side effects are public contract.
- 2026-03-02T09:12:37Z | Treat modal accessibility state and focus flow as must-have assertions.

# Log

- 2026-03-02T09:12:37Z | Track created from roadmap implementation.
- 2026-03-02T09:12:37Z | Waiting on TRACK-002 and TRACK-003 dependencies.
