---
track_id: TRACK-006
status: pending
priority: medium
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-02T09:12:37Z
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

- [ ] RED: Run `npm run test:unit:coverage` and capture module gaps.
- [ ] GREEN: Add missing assertions/cases to reach >=80% for lines, functions, branches, and statements.
- [ ] GREEN: Update `package.json` `prepublishOnly` to include `npm run test:unit`.
- [ ] GREEN: Verify command order: `npm run build && npm run test:unit && npm run test:smoke && npm run check:pack`.
- [ ] GREEN: Update `README.md` development section with unit test and coverage commands.
- [ ] GREEN: Update `bitacora/workflow.md` quality gates to include unit test gate.
- [ ] REFACTOR: Consolidate duplicated helper logic discovered during prior tracks.
- [ ] REFACTOR: Ensure all track logs and `tracks.md` final handoff are synchronized.

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

# Log

- 2026-03-02T09:12:37Z | Track created from roadmap implementation.
- 2026-03-02T09:12:37Z | Waiting on TRACK-002 through TRACK-005 completion.
