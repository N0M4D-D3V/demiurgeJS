---
track_id: TRACK-003
status: pending
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-02T09:12:37Z
---

# Overview

- Goal: Fully test `src/core/layout.js` and `src/core/script-loader.js` contracts with deterministic unit tests.
- Scope:
  - Cover success/failure behavior of layout partial injection.
  - Cover route normalization and active-link selection rules.
  - Cover script loader state management, duplicate prevention, init/cleanup/teardown ordering, and reset.
- Out of scope:
  - Router behavior (`pseudo-spa`) and modal behavior (handled in TRACK-004).
- Dependencies:
  - TRACK-002 completed and stable helpers available.

# Tasks

- [ ] RED: Add failing tests for `injectPartial` null selector, failed fetch, thrown fetch, and successful HTML injection.
- [ ] GREEN: Implement deterministic mocks for `fetch` and verify header `X-Requested-With: LayoutPartial`.
- [ ] GREEN: Add tests for `markActiveNavLink` exact match behavior.
- [ ] GREEN: Add tests for `markActiveNavLink` normalization behavior (`index.html`, query/hash stripping, trailing slash).
- [ ] GREEN: Add tests for prefix boundary logic in nav matching to avoid false positives.
- [ ] RED: Add failing tests for `loadScript` no-op on empty src and duplicate script prevention.
- [ ] GREEN: Add tests for `loadScript` `trackForCleanup` dataset attributes and script append flow.
- [ ] GREEN: Add tests for `loadScript` load success and load error rejection paths.
- [ ] GREEN: Add tests for `resolveFunction` valid paths, missing paths, and non-function values.
- [ ] GREEN: Add tests for `loadForPage` when `window.PageConfig` is absent.
- [ ] GREEN: Add tests for `loadForPage` shared scripts + page scripts loading.
- [ ] GREEN: Add tests ensuring cleanup returned by `init` runs before configured `teardown`.
- [ ] GREEN: Add tests for page-specific script cleanup and re-load behavior across page changes.
- [ ] GREEN: Add tests for `resetScriptLoaderState` clearing all internal state.
- [ ] REFACTOR: Ensure every test resets loader state and DOM between cases.

# Acceptance Criteria

- All tests added in this track pass with `npm run test:unit`.
- `src/core/layout.js` reaches >= 90% line coverage in local report.
- `src/core/script-loader.js` reaches >= 90% line coverage in local report.
- Cleanup order (`init` cleanup then configured `teardown`) is explicitly asserted.

# Deliverables

- `tests/unit/core/layout.test.js`
- `tests/unit/core/script-loader.test.js`
- Updated helper usage patterns documented in test comments where non-obvious.

# Decisions

- 2026-03-02T09:12:37Z | Keep tests contract-focused and avoid internal implementation coupling when possible.
- 2026-03-02T09:12:37Z | Explicitly assert PageConfig lifecycle order because it is backward-compatibility critical.

# Log

- 2026-03-02T09:12:37Z | Track created from roadmap implementation.
- 2026-03-02T09:12:37Z | Waiting on TRACK-002 completion.
