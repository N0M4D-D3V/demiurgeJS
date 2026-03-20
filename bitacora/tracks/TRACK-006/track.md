---
track_id: TRACK-006
status: completed
priority: medium
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-17T16:10:00Z
---

# Overview

- Goal: Finalize unit-testing rollout with coverage enforcement, publish workflow integration, and memory/documentation closeout.
- Scope:
  - Reach and enforce 80% global coverage threshold.
  - Integrate `test:unit` in `prepublishOnly`.
  - Update docs and bitacora to reflect final testing workflow.
- Out of scope:
  - Major test harness redesign.
  - New runtime features unrelated to testing.
- Dependencies:
  - TRACK-002 through TRACK-005 completed.

# Tasks

- [x] RED: Run `npm run test:unit:coverage` and capture module gaps.
- [x] GREEN: Add missing assertions/cases to reach >=80% for lines, functions, branches, and statements.
- [x] GREEN: Update `package.json` `prepublishOnly` to include `npm run test:unit`.
- [x] GREEN: Verify command order: `npm run build && npm run test:unit && npm run test:smoke && npm run check:pack`.
- [x] GREEN: Update `README.md` development section with unit test and coverage commands.
- [x] GREEN: Update `bitacora/workflow.md` quality gates to include unit test gate.
- [x] REFACTOR: Consolidate duplicated helper logic discovered during prior tracks.
- [x] REFACTOR: Ensure all track logs and `tracks.md` final handoff are synchronized.

# Acceptance Criteria

- `npm run test:unit` passes.
- `npm run test:unit:coverage` passes with 80% global thresholds.
- `npm run build`, `npm run test:smoke`, and `npm run check:pack` remain green.
- `prepublishOnly` includes `test:unit` and executes successfully.
- Bitacora records full closeout for all tracks.

# Deliverables

- Coverage gate active.
- Publish workflow updated.
- Documentation and memory aligned with the final testing workflow.

# Decisions

- 2026-03-02T09:12:37Z | Coverage threshold target fixed at 80% global.
- 2026-03-02T09:12:37Z | `test:unit` must run in prepublish workflow.
- 2026-03-17T16:10:00Z | Keep `browser-auto-bootstrap` global attachment explicit (`attachDemiurgeToGlobal()`) instead of relying on bare side-effect imports to avoid bundler side-effects pruning warnings.

# Log

- 2026-03-02T09:12:37Z | Track created from roadmap implementation.
- 2026-03-02T09:12:37Z | Waiting on TRACK-002 through TRACK-005 completion.
- 2026-03-17T16:06:12Z | TRACK-005 completed; dependencies cleared and track promoted to active.
- 2026-03-17T16:10:00Z | Enforced coverage thresholds in `test:unit:coverage` (`--check-coverage` with 80% gates for lines/functions/branches/statements); validation run passed (global lines 97.5, branches 84.72, funcs 96.07, statements 97.5).
- 2026-03-17T16:10:00Z | Updated publish workflow gates: `prepublishOnly` now runs `build -> test:unit -> test:smoke -> check:pack`; full `npm run prepublishOnly` run passed.
- 2026-03-17T16:10:00Z | Updated docs (`README.md`, `bitacora/workflow.md`) with unit and coverage commands; checked helper refactor need and kept existing helper layout (no additional consolidation required).
