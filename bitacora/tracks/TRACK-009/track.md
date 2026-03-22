---
track_id: TRACK-009
status: completed
priority: medium
created_at: 2026-03-22T17:04:11Z
updated_at: 2026-03-22T17:07:41.000Z
completion: 100
---

# Overview
- Goal: Prevent pseudo-SPA router interception for anchor elements using the native `download` attribute.
- Scope:
  - Update `defaultShouldHandleLink` in the core pseudo-router.
  - Keep existing exclusions and internal navigation behavior unchanged.
  - Add unit coverage proving `<a download>` is not intercepted.
- Out of scope:
  - Consumer-page workarounds.
  - Page lifecycle or `PageConfig` contract changes.

# Tasks
- [x] RED: Extend router link-handling tests with a `download` rejection case.
- [x] GREEN: Add an early `download` guard to the pseudo-router link interception logic.
- [x] GREEN: Mirror the same guard in the legacy pseudo-SPA scaffold generator.
- [x] VERIFY: Attempt focused router unit tests and record environment blocker.
- [x] REFACTOR: Update project memory with final verification and handoff.

# Decisions
- 2026-03-22T17:04:11Z | Keep the fix in `defaultShouldHandleLink` so all delegated click handling paths inherit the same behavior without consumer changes.
- 2026-03-22T17:04:11Z | Mirror the guard in `tools/demiurge-pseudo-spa.cli.js` to avoid divergence between package runtime and generated legacy scaffold output.

# Log
- 2026-03-22T17:04:11.000Z | Created track for pseudo-SPA download-link interception bug.
- 2026-03-22T17:04:11.000Z | Patched router link filter and added unit coverage for native download-link passthrough.
- 2026-03-22T17:06:02.000Z | Verification attempt `node --test tests/unit/core/pseudo-spa.test.js` failed before test execution under local Node v20.18.2 because `jsdom` dependency chain hit `ERR_REQUIRE_ESM`; repo memory requires Node >= 22.
- 2026-03-22T17:07:41.000Z | TEST: User verified the suite in a Node 22 environment with results `tests 52`, `pass 52`, `fail 0`, `duration_ms 852.065375`.
- 2026-03-22T17:07:41.000Z | Track completed after external verification confirmed the router change does not regress the existing test suite.
