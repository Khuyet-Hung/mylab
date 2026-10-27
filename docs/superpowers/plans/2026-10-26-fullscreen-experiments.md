# Fullscreen Experiment Experience Implementation Plan

> **For agentic workers:** Implement the tasks in order. No tests are added or run for this change.

**Goal:** Make experiments run in a full-screen canvas with floating icon actions, expandable settings, and a separate draft report unlocked after the first run.

**Architecture:** Add a reusable `ExperimentFrame` that owns the full-screen layout and common play/pause/reset/settings/report controls. Refactor `GravityPage` to supply its canvas and settings, track whether it has ever run, and pass a snapshot to a small report route. Keep the site's regular shell for the report and other pages.

**Tech Stack:** React 19, TypeScript, React Router 8, CSS.

**Spec:** `docs/superpowers/specs/2026-10-26-fullscreen-experiments-design.md`

## Global Constraints

- Do not add dependencies.
- Icon actions must have accessible names.
- The report link is hidden until the first run in the current page session.
- Report content is a lightweight draft and need not persist after reload.

## Review Focus

- Starting and then resetting must not hide the report link; `hasRun` is monotonic for the page session.
- Pausing before the first run must not unlock the report.
- Directly opening the report route without navigation state must show a usable draft instead of crashing.
- The full-screen scene and controls must fit narrow viewports without horizontal overflow.
- Keyboard users must be able to open settings and identify each icon action.

---

### Task 1: Shared full-screen experiment frame

**Files:**
- Create: `src/components/experiments/ExperimentFrame.tsx`
- Modify: `src/components/SiteShell.tsx`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/gravity.css`

**Interfaces:**
- Produces `ExperimentFrameProps`: `ariaLabel: string`, `canvas: ReactNode`, `settings: ReactNode`, `isRunning: boolean`, `hasRun: boolean`, `status: string`, `onStart: () => void`, `onPause: () => void`, `onReset: () => void`, `reportLink: ReactNode`.
- `reportLink` is rendered only when `hasRun` is true. The frame renders icon buttons with `aria-label`, a `details/summary` settings disclosure, and the canvas.

- [ ] Add the `ExperimentFrame` component and shared styles for full-viewport canvas, floating actions, settings disclosure, and report action.
- [ ] Give the site shell a route-aware full-screen class for experiment paths, hiding the global header/footer and removing width/padding constraints only while the experiment runs.
- [ ] Add responsive layout rules so controls remain reachable on small screens.

### Task 2: Move free-fall into the shared frame

**Files:**
- Modify: `src/experiments/gravity/GravityPage.tsx`
- Modify: `src/experiments/gravity/clock.ts`

**Interfaces:**
- Consumes `ExperimentFrameProps` from Task 1.
- Report snapshot is `{ inputs: Inputs; display: ReturnType<typeof samples>; hasRun: boolean }` and is passed as React Router location state to `/physics/gravity/free-fall/report` and back.

- [ ] Move the current title, guidance, measurements, graph, and explanation out of the play view; retain the simulation canvas and input sliders in the frame.
- [ ] Track `hasRun` from the first play action onward; keep it true through pause, landing, and reset.
- [ ] Wire icon actions to the existing clock and pass current inputs/display as report navigation state.
- [ ] Allow the clock to initialize from the returned elapsed time so navigating back restores the current trial snapshot.

### Task 3: Separate lightweight report route

**Files:**
- Create: `src/experiments/gravity/GravityReportPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes the report snapshot from Task 2 via `useLocation().state`.
- Route: `/physics/gravity/free-fall/report`.

- [ ] Add a concise report page with a return link, experiment parameters, observations, graph, and the existing brief explanation/formula.
- [ ] Provide sensible default report values when the route is opened directly or after a reload without navigation state.

## Plan self-review

- Spec coverage: fullscreen canvas, common reusable frame, icon actions, expandable settings, first-run report unlock, separate draft report, and small-screen layout are covered by Tasks 1–3.
- Step scan: each checklist item maps to a small implementation unit; no tests or test commands are included, following the session instruction not to add or run tests unless requested.
- Type consistency: `ExperimentFrameProps` and the report snapshot shape are named above and consumed explicitly by the following tasks.
- Review focus: each listed condition is assigned to the component or route that owns it.
- Proportion: the three tasks align to the shared frame, the existing experiment, and its report route.
