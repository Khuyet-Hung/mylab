# Thí nghiệm con lắc đơn Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen two-configuration pendulum experiment whose report reveals how string length changes the oscillation period at a shared initial angle after both periods are measured.

**Architecture:** Add a pure TypeScript nonlinear pendulum model with deterministic fixed-step integration and period measurement. Build a PixiJS view that renders model states, then connect it to a full-screen React page using `ExperimentFrame`. When both periods are measured, open a separate report with measured periods and the small-angle prediction curve.

**Tech Stack:** React 19, TypeScript, React Router, PixiJS 8, Vite, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-27-simple-pendulum-design.md`

> **Update 2026-10-27:** The user made the full-screen → completion → report flow a project-wide rule in `AGENTS.md`. The implementation keeps results, chart, and explanation on `PendulumReportPage.tsx`. The simulation auto-completes when both pendulums have measured a full period; reset or input changes hide the report action. This update supersedes any Task 3 wording below that places results or a chart on the simulation page.

## Global Constraints

- Use an ideal point-mass pendulum on a massless, inextensible string in uniform `g = 9.8 m/s²`; neglect drag and friction.
- Use the full-angle equation of motion for simulation; label `T₀ = 2π√(L/g)` as a small-angle approximation.
- Compare two string lengths at the same initial angle and display that angle.
- Derive scene, measurements, and graph from the same model state or measured period.
- Do not add dependencies, persistence, or a general-purpose physics engine.
- Support desktop, narrow screens, mouse, touch, keyboard controls, and reduced-motion preferences for interface motion.

## File Structure

- Create `src/experiments/pendulum/model.ts` for validated inputs, RK4 state stepping, and zero-crossing period measurement.
- Create `tests/pendulum/model.test.ts` for model invariants and reference cases.
- Create `src/experiments/pendulum/scene.ts` for PixiJS drawing and rendering of supplied state snapshots only.
- Create `src/experiments/pendulum/PendulumPage.tsx` for the full-screen simulation, two configurations, shared-angle control, clock integration, completion state, and report navigation.
- Create `src/experiments/pendulum/PendulumReportPage.tsx` for measured results, comparison chart, explanation, and direct-route empty state.
- Create `src/styles/pendulum.css` for full-screen canvas and report styles.
- Modify `src/styles/global.css` to load the pendulum stylesheet.
- Modify `src/App.tsx` to register the experiment route.
- Modify `src/catalog/experiments.ts` and `src/catalog/CatalogPage.tsx` to expose the experiment in the Physics catalogue.

## Review Focus

- Model rejects non-finite or physically invalid inputs; settings allow the endpoints `0.5–3 m` and `5°–80°`; test those boundaries and invalid inputs in Task 1.
- Zero initial angle does not produce a fabricated period; test that period measurement remains unavailable until a valid oscillation is observed in Task 1.
- Period detection counts crossings in the same direction and does not mistake a half-cycle for a full period; test a known small-angle period in Task 1.
- Numerical integration remains stable near the maximum configured angle and length; test bounded state and energy drift over several cycles in Task 1.
- Pausing, resuming, resetting, or changing either comparison length does not mix elapsed time or measured periods between configurations; verify in Task 3.

---

### Task 1: Scientific pendulum model and period measurement

**Files:**
- Create: `src/experiments/pendulum/model.ts`
- Create: `tests/pendulum/model.test.ts`

**Interfaces:**
- `PendulumInput = { lengthM: number; initialAngleRad: number; gravityMps2: number }`.
- `PendulumState = { timeS: number; angleRad: number; angularVelocityRadS: number }`.
- `PendulumIntegrator` exposes `advance(deltaS: number): PendulumState`, `getState(): PendulumState`, `getMeasuredPeriodS(): number | null`, and `reset(input?: PendulumInput): void`.
- `advance` throws `RangeError` for negative or non-finite elapsed time.
- `createPendulumIntegrator(input: PendulumInput): PendulumIntegrator` validates inputs and owns its deterministic integration state.
- `smallAnglePeriodS(lengthM: number, gravityMps2 = 9.8): number` returns `2π√(L/g)`.

- [ ] Add tests for the small-angle formula, invalid inputs, zero-angle no-period behavior, and full-period detection using same-direction equilibrium crossings.
- [ ] Implement RK4 integration for `θ'' = -(g/L) sin(θ)` with a fixed internal step of `1/240 s`; retain fractional elapsed time between `advance` calls so frame rate does not change the trajectory.
- [ ] Validate finite positive lengths, finite angles strictly between `-π` and `π`, and `gravityMps2 = 9.8`; settle concrete UI bounds as `lengthM ∈ [0.5, 3]` and `|initialAngleRad| ∈ [5°, 80°]`.
- [ ] Record a period only after two consecutive equilibrium crossings in the same direction; return `null` until that complete cycle is observed.
- [ ] Run `npm test -- tests/pendulum/model.test.ts`; expect all model tests to pass, including the bounded-state and period tolerance cases.

### Task 2: PixiJS pendulum scene

**Files:**
- Create: `src/experiments/pendulum/scene.ts`

**Interfaces:**
- `PendulumScene` exposes `update(left: PendulumState, right: PendulumState, inputs: { leftLengthM: number; rightLengthM: number }): void` and `destroy(): void`.
- `createPendulumScene(host: HTMLElement): Promise<PendulumScene>` owns and cleans up its PixiJS application and resize observer.
- Scene receives state snapshots and never computes elapsed time, integrates motion, or estimates the period.

- [ ] Draw two clearly labeled side-by-side pendulums, their supports, bobs, and length guides in a fixed logical coordinate space.
- [ ] Map each state angle and length to the bob position; keep both pendulums' pivot, gravity, and initial-angle comparison visually aligned.
- [ ] Add responsive resizing and teardown matching the lifecycle pattern in `src/experiments/gravity/scene.ts`.
- [ ] Verify by inspecting that `update` alone controls displayed geometry and scene code imports no clock or integration utilities.

### Task 3: Full-screen simulation and completion

**Files:**
- Create: `src/experiments/pendulum/PendulumPage.tsx`
- Create: `src/styles/pendulum.css`
- Modify: `src/styles/global.css`
- Modify: `src/components/SiteShell.tsx`

**Interfaces:**
- Page creates independent `PendulumIntegrator` instances for configurations A and B, both using one shared `initialAngleRad`.
- `ExperimentFrame` receives the composed canvas, settings, running state, start/pause/reset handlers, and exit link to `/physics`.
- Completion is true only when both integrators return a measured period; the report link then carries the completed snapshot.

- [ ] Wire a single animation clock to advance both integrators by identical elapsed time and publish their states to the scene.
- [ ] Add settings for shared initial angle and separate lengths A/B; resetting returns both integrators to their current settings and clears elapsed time and measured periods.
- [ ] Auto-pause when both measured periods are available, then reveal the report link; hide it again on reset or input change.
- [ ] Keep numerical results, chart, and conclusion off the simulation screen; show only scene, inputs, and experiment controls.
- [ ] Keep the scene and controls reachable on narrow screens, and honor reduced-motion for non-scientific UI transitions.
- [ ] Verify play, pause/resume, reset, settings changes, and completion-gated report action in the browser.

### Task 3b: Separate pendulum report

**Files:**
- Create: `src/experiments/pendulum/PendulumReportPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/pendulum.css`

**Interfaces:**
- Route: `/physics/pendulum/simple/report`.
- Receives completed settings and measured periods from the simulation via navigation state; returns to the simulation with the same state.

- [ ] Show A/B lengths, the shared initial angle, measured periods, and small-angle predictions with SI units.
- [ ] Render an accessible SVG period-versus-length chart with a labelled prediction curve and measured A/B points.
- [ ] Explain the result and model limits; direct navigation without a completed snapshot shows a no-results state and return link.

### Task 4: Catalogue route and navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/catalog/experiments.ts`
- Modify: `src/catalog/CatalogPage.tsx`

**Interfaces:**
- Topic route: `/physics/pendulum`; experiment route: `/physics/pendulum/simple`.
- Catalogue entry: `id: "simple-pendulum"`, `field: "physics"`, `topic: "Dao động"`, title `"Con lắc đơn"`, question `"Dây dài hơn thì con lắc dao động chậm hơn bao nhiêu?"`, status `"available"`.

- [ ] Register `/physics/pendulum` with `CatalogPage` filtered to `Dao động`, and `/physics/pendulum/simple` with `PendulumPage`.
- [ ] Add a `Dao động` topic card to the Physics catalogue; keep the gravity topic and show the available experiment count for each topic.
- [ ] Update `CatalogPage` topic heading and eyebrow to use the selected topic rather than hard-coding gravity, and add the pendulum experiment card illustration in the existing catalogue style.
- [ ] Update the Physics home card count from one to two experiments.
- [ ] Verify `/physics` → `/physics/pendulum` → experiment navigation and that the experiment exit action returns to `/physics`.

### Task 5: Integrated behavior and production build

**Files:**
- No additional files unless earlier task integration reveals a necessary fix.

**Interfaces:**
- Public behavior is the full-screen simulation, completion-gated report, measurements, graph, and assumptions described above.

- [ ] Run `npm test` and `npm run build`; expect model tests and TypeScript/Vite build to pass.
- [ ] Check desktop and narrow viewport layouts, keyboard focus and slider access, reduced-motion setting behavior, and Pixi scene cleanup after leaving the route.
- [ ] Verify the report action is hidden before completion, appears after both periods are measured, and hides after reset or settings changes; direct report navigation shows no results.
- [ ] Confirm at small initial angles both measured periods are within 0.5% of the small-angle prediction, and increasing length increases the period for the same angle.
- [ ] Confirm at a larger allowed angle the measured period exceeds the small-angle approximation while both configurations still share the displayed angle.

## Plan self-review

- Spec coverage: two configurations, equal comparison angle, full-angle model, responsive full-screen simulation, completion-gated report, labelled measurements and chart on the report, catalogue route, and limitations are assigned to tasks.
- Step scan: interfaces and concrete behavior are defined before the page consumes them; model tests name the failure cases that matter. No source code is included as a substitute for implementation steps.
- Type consistency: page and scene use `PendulumState`; the model integrator owns state and period measurement; chart rows use measured values and the matching approximation.
- Review focus: each input and numerical risk has a model check or explicit browser verification step in its owning task.
- Proportion: five tasks split the independent model, renderer, workbench, discovery route, and integration checks.
