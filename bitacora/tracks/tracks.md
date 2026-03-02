# Tracks

> Canonical project status and handoff registry.
>
> Last updated: 2026-03-02
>
> Rule: update this file after meaningful implementation changes.

## Snapshot

- Project: @n0m4d-d3v/demiurgejs
- Current status: Unit testing roadmap documented in bitacora and ready for execution.
- Active tracks: TRACK-002

## Track Registry

| ID | Title | Status | Phase | Last Update | Notes |
| --- | --- | --- | --- | --- | --- |
| TRACK-001 | Bootstrap project memory | completed | green | 2026-03-02 | Product/tech/workflow/UX docs populated using README, docs, and source files |
| TRACK-002 | Unit testing baseline and harness setup | active | red | 2026-03-02 | Create stable test foundation with node:test + jsdom and replace legacy exploration tests |
| TRACK-003 | Unit tests for layout and script-loader | pending | planned | 2026-03-02 | Cover core contracts for layout injection and PageConfig script lifecycle |
| TRACK-004 | Unit tests for pseudo-spa and modal | pending | planned | 2026-03-02 | Cover navigation behavior, transitions, modal accessibility, and delegation |
| TRACK-005 | Unit tests for bootstrap and browser entries | pending | planned | 2026-03-02 | Cover bootstrap orchestration and browser-global/auto-bootstrap side effects |
| TRACK-006 | Coverage gate, publish integration, and closeout | pending | planned | 2026-03-02 | Enforce 80% coverage and wire test:unit into prepublishOnly |

## Sequencing Rules

1. Execute TRACK-002 fully before starting any other track.
2. Execute TRACK-003 then TRACK-004.
3. Start TRACK-005 only after TRACK-002 helper utilities are stable.
4. Execute TRACK-006 last for gate enforcement and documentation closeout.

## Session Handoff (Required)

- Tracks touched: TRACK-002, TRACK-003, TRACK-004, TRACK-005, TRACK-006, tracks.md
- What changed:
  - Added five new detailed execution tracks for unit-testing rollout.
  - Defined sequential dependencies, explicit RED/GREEN/REFACTOR tasks, and acceptance criteria.
  - Documented baseline failure mode of current tests and target commands for future execution.
- Tests run:
  - `node --test tests/*.test.js` -> failed (5 failing files using `require(...)` under ESM: `architecture-md.test.js`, `exploration-verify.test.js`, `exploration.test.js`, `explore-structure.test.js`, `project-exploration.test.js`).
- Current phase:
  - TRACK-002 at RED (baseline captured, implementation pending).
- Blockers/assumptions:
  - Assumption: Node.js >=22 remains the runtime baseline.
  - Assumption: `node:test` + `jsdom` + `c8` will be the long-term unit testing stack.
  - Blocker to clear in TRACK-002: remove/replace legacy exploration tests from active test path.
- Next recommended action:
  - Start TRACK-002 task 2 (`tests/unit/sanity.test.js`) and complete harness setup before module-level tests.

Minimum handoff payload:
- Track(s) touched
- Tests run (exact command + result)
- Current phase/status
- Blockers/assumptions
- Next recommended action
