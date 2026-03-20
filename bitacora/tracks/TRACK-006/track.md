---
track_id: TRACK-006
status: completed
priority: medium
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-20T09:26:12.364Z
completion: 100
compacted_at: 2026-03-20T09:26:12.364Z
history_path: bitacora/history/TRACK-006.md
---

# Overview
- Goal: Finalize unit-testing rollout with coverage enforcement, publish workflow integration, and memory/documentation closeout.
- Scope:
- Full history: bitacora/history/TRACK-006.md

# Tasks
- Checklist completed: 8/8

# Decisions
- 2026-03-02T09:12:37Z | Coverage threshold target fixed at 80% global.
- 2026-03-02T09:12:37Z | `test:unit` must run in prepublish workflow.
- 2026-03-17T16:10:00Z | Keep `browser-auto-bootstrap` global attachment explicit (`attachDemiurgeToGlobal()`) instead of relying on bare side-effect imports to avoid bundler side-effects pruning warnings.

# Log
- 2026-03-20T09:26:12.364Z | compacted track and archived full history
