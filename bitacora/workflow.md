# Workflow

## Development Method
- Prefer incremental, behavior-preserving changes with small vertical slices.
- Verify distributable outputs and compatibility flows after meaningful changes.

## Implementation Rules
- Preserve public API symbols and script-tag/browser-global compatibility unless a breaking change is explicitly planned.
- Keep library modules free of top-level DOM side effects.
- Isolate browser side effects to dedicated browser entry files.
- When exports/entries/output names change, update docs/examples/AGENTS in the same change.
- When CLI commands, `bin`, or published file lists change, validate publish payload via `npm run check:pack`.
- Do not hand-edit `dist/`; regenerate with build scripts.

## Quality Gates
- `npm run build` must succeed and generate expected `dist/` artifacts.
- `npm run test:unit` must pass for unit-level contract coverage.
- `npm run test:unit:coverage` must pass with global thresholds >= 80% for lines, functions, branches, and statements.
- `npm run test:smoke` must validate ESM/CJS and output integrity.
- `npm run check:pack` must confirm publish payload.
- `prepublishOnly` is expected to run all gates before `npm publish`.

## Release Flow
1. Update code and docs.
2. Bump version in `package.json`.
3. Run `npm run build`.
4. Run `npm run test:unit`.
5. Run `npm run test:unit:coverage`.
6. Run `npm run test:smoke`.
7. Run `npm run check:pack`.
8. Verify `dist/` and `package.json` exports alignment.
9. Publish package.

## Non-negotiable Session Rules
- Always read `bitacora/index.md` at the beginning of every session.
- Always update `bitacora/tracks/tracks.md` after meaningful implementation changes.
- Always write handoff updates before ending a session.

## Handoff Checklist
- What changed
- Tests run (exact commands + result)
- Current phase/status
- Blockers or assumptions
- Single best next action
