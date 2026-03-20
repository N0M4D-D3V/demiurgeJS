---
track_id: TRACK-002
status: completed
priority: high
created_at: 2026-03-02T09:12:37Z
updated_at: 2026-03-20T09:26:12.364Z
completion: 100
compacted_at: 2026-03-20T09:26:12.364Z
history_path: bitacora/history/TRACK-002.md
---

# Overview
- Goal: Establish a deterministic unit-testing baseline for DemiurgeJS using `node:test` + `jsdom` and remove current test noise.
- Scope:
- Full history: bitacora/history/TRACK-002.md

# Tasks
- Checklist completed: 11/11

# Decisions
- 2026-03-02T09:12:37Z | Use `c8` for coverage and enforce threshold in TRACK-006.
- 2026-03-02T09:12:37Z | Replace legacy exploration tests instead of running mixed old/new suites.
- 2026-03-17T15:27:51Z | Scope active unit execution to `tests/unit/**/*.test.js` and move prior exploration suite to `tests/legacy/`.

# Log
- 2026-03-20T09:26:12.364Z | compacted track and archived full history
