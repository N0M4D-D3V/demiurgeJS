# UX Style Guide

## Visual Tokens
- Background: consumer-defined (DemiurgeJS does not impose global page background).
- Surface: consumer-defined.
- Surface alt: consumer-defined.
- Text: consumer-defined, with `var(--text)` referenced by `.modal__close`.
- Muted text: consumer-defined.
- Primary accent: consumer-defined (active nav behavior uses `.accent` class, style owned by consumer).
- Success: consumer-defined.
- Warning: consumer-defined.
- Error: consumer-defined.
- Border: consumer-defined.
- Library-owned overlay token: modal backdrop `rgba(0, 0, 0, 0.7)`.

## Layout / Spacing
- Base spacing unit: 4px grid.
- Panel gap: not defined by library core.
- Panel padding: modal dialog uses `padding: 3.5rem`.
- Header padding: not defined by library core.
- Modal sizing constraints: `max-width: 700px`, `width: 90%`, `max-height: 90vh`.

## Borders / Depth
- Border style: none enforced by core modal styles.
- Shadow style: none enforced by core modal styles.
- Layering: modal root uses `z-index: 999`.
- Effects policy: avoid visual noise; prefer crisp, readable UI.

## Typography
- Font family: consumer-defined (no global font set by library).
- Heading style: consumer-defined.
- Body style: consumer-defined.
- Label style: consumer-defined.
- Library-specific text sizing: `.modal__close` uses `font-size: 1.25rem`.

## Components / Interaction Rules
- Buttons: modal close button is visually minimal (`background: transparent`, no border) and should remain clearly tappable.
- Inputs: not styled by core library.
- Data views: not styled by core library.
- Feedback states: not styled by core library; app-level styles own semantic state presentation.
- Modal behavior: visibility controlled by `.is-open` (opacity/pointer-events), with delegated `data-modal-open` and `data-modal-close` triggers.
- Navigation behavior: `<main>` transition classes (`spa-leave*`, `spa-enter*`) drive pseudo-SPA visual continuity.

## Motion / Performance
- Keep animations minimal and purposeful.
- Main content transition uses 160ms opacity/translate (`ease-out`) for enter/leave.
- Modal visibility transition uses 200ms opacity (`ease`).
- Respect reduced motion: disable `main` transitions under `prefers-reduced-motion: reduce`.
- Prefer readability/responsiveness over decoration; avoid expensive effects in frequently navigated paths.
