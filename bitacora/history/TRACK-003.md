---
track_id: TRACK-003
status: completed
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-17T15:43:13Z
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

- [x] RED: Add failing tests for `injectPartial` null selector, failed fetch, thrown fetch, and successful HTML injection.
- [x] GREEN: Implement deterministic mocks for `fetch` and verify header `X-Requested-With: LayoutPartial`.
- [x] GREEN: Add tests for `markActiveNavLink` exact match behavior.
- [x] GREEN: Add tests for `markActiveNavLink` normalization behavior (`index.html`, query/hash stripping, trailing slash).
- [x] GREEN: Add tests for prefix boundary logic in nav matching to avoid false positives.
- [x] RED: Add failing tests for `loadScript` no-op on empty src and duplicate script prevention.
- [x] GREEN: Add tests for `loadScript` `trackForCleanup` dataset attributes and script append flow.
- [x] GREEN: Add tests for `loadScript` load success and load error rejection paths.
- [x] GREEN: Add tests for `resolveFunction` valid paths, missing paths, and non-function values.
- [x] GREEN: Add tests for `loadForPage` when `window.PageConfig` is absent.
- [x] GREEN: Add tests for `loadForPage` shared scripts + page scripts loading.
- [x] GREEN: Add tests ensuring cleanup returned by `init` runs before configured `teardown`.
- [x] GREEN: Add tests for page-specific script cleanup and re-load behavior across page changes.
- [x] GREEN: Add tests for `resetScriptLoaderState` clearing all internal state.
- [x] REFACTOR: Ensure every test resets loader state and DOM between cases.

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
- 2026-03-17T15:43:13Z | Implemented `tests/unit/core/layout.test.js` and `tests/unit/core/script-loader.test.js` using TRACK-002 helpers.
- 2026-03-17T15:43:13Z | Followed TDD flow: initial RED run surfaced failures in test doubles/global scope; GREEN run completed after fixing test setup with no production changes.
- 2026-03-17T15:43:13Z | Validation: `npm run test:unit` pass (20/20); `npm run test:unit:coverage` pass with `layout.js` 100% lines and `script-loader.js` 97.2% lines.
