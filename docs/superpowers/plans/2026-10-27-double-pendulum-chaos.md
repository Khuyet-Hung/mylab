# Con lắc kép hỗn loạn Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [x]`) syntax. Follow the approved design and keep the experiment split into model, scene, simulation, report, and catalogue changes.

**Goal:** Add a two-run double-pendulum experiment that makes sensitivity to initial conditions visible and reports how the lower bobs diverge over a 20-second simulated trial.

**Architecture:** A pure TypeScript model integrates two ideal planar double pendulums independently with the same fixed-step RK4 solver. A PixiJS scene draws supplied snapshots and trails, while a React experiment page owns the clock, controls, completion state, and report navigation. A separate report page displays the sampled separation graph and assumptions.

**Tech Stack:** React, TypeScript, React Router, PixiJS 8, Vite, existing `ExperimentFrame` and shared scene resize helper.

**Spec:** `docs/superpowers/specs/2026-10-27-double-pendulum-chaos-design.md`

## Global Constraints

- Use two point masses connected by light, rigid, massless rods in uniform `g = 9.8 m/s²`; neglect drag and joint friction.
- Keep simulation state and integration in a pure TypeScript model; PixiJS renders state snapshots only.
- Use identical rod lengths and masses for A/B. B differs only by a small initial upper-joint angle offset; both start with zero angular velocity.
- Completion occurs at 20 simulated seconds; starting or pausing does not complete the experiment.
- Simulation screen uses `ExperimentFrame`; measurements, graph, and explanation stay on the separate `SiteShell` report page.
- Every Pixi scene resize calls `resizeExperimentScene` from `src/experiments/shared/resizeScene.ts`.
- Add no dependency and no automated test files or test runs unless the user asks for tests; use manual verification for the requested behavior.

## Review Focus

- Zero angle offset: A/B remain identical within numerical tolerance and separation does not gain a fabricated signal; manually compare scene and report graph.
- Maximum configured angles and lengths: trajectories remain finite over 20 seconds; manually run the highest energy supported setting.
- Large frame-time gaps and pause/resume: scientific time advances only by the shared clock and does not jump on resume; manually background/pause and resume.
- Reset or any changed setting after completion: report action disappears and prior graph samples do not survive; manually check each setting and reset.
- Narrow screens and direct report route: scene remains legible and empty report has a return link; manually inspect at 390px and load report URL without route state.

## File Structure

- Create `src/experiments/double-pendulum/model.ts` — input/state types, validation, equations of motion, RK4 integrator, sampling and separation calculation.
- Create `src/experiments/double-pendulum/trialStore.ts` — completed-trial types and session-scoped lookup/invalidation across browser history entries.
- Create `src/experiments/double-pendulum/scene.ts` — responsive PixiJS rendering of A/B rods, joints, labels and bounded trajectory trails.
- Create `src/experiments/double-pendulum/DoublePendulumPage.tsx` — experiment settings, paired model instances, shared clock, completion, report state and route return behavior.
- Create `src/experiments/double-pendulum/DoublePendulumReportPage.tsx` — result summary, SVG separation graph, explanation and empty state.
- Create `src/styles/double-pendulum.css` — canvas, illustration and report graph styles.
- Modify `src/styles/global.css` — import the experiment stylesheet.
- Modify `src/App.tsx` — register topic, simulation and report routes.
- Modify `src/components/SiteShell.tsx` — add the simulation route to the existing full-screen route set.
- Modify `src/catalog/experiments.ts` — add an available Physics card under `Dao động và hỗn loạn`.
- Modify `src/catalog/CatalogPage.tsx` — add topic copy/route card and a double-pendulum thumbnail.

---

### Task 1: Deterministic double-pendulum model

**Files:**
- Create: `src/experiments/double-pendulum/model.ts`

**Interfaces:**
- `DoublePendulumInput = { upperLengthM: number; lowerLengthM: number; upperMassKg: number; lowerMassKg: number; initialUpperAngleRad: number; initialLowerAngleRad: number; gravityMps2: number }`.
- `DoublePendulumState = { timeS: number; upperAngleRad: number; lowerAngleRad: number; upperAngularVelocityRadS: number; lowerAngularVelocityRadS: number }`.
- `DoublePendulumSample = { timeS: number; separationM: number }`.
- `DoublePendulumIntegrator` exposes `advance(deltaS: number): DoublePendulumState`, `getState(): DoublePendulumState`, and `reset(input?: DoublePendulumInput): void`.
- Export `createDoublePendulumIntegrator(input): DoublePendulumIntegrator`, `getLowerBobPosition(state, input): { xM: number; yM: number }`, and `measureLowerBobSeparation(stateA, inputA, stateB, inputB): number`.
- UI bounds: both lengths `[0.5, 1.5] m`; both masses `[0.5, 2] kg`; upper and lower initial angles `[-170°, 170°]`; offset `[0°, 5°]`; fixed gravity `9.8 m/s²`.
- Defaults: both lengths `1 m`, both masses `1 kg`, A angles `(120°, 120°)`, B angles `(120° + offset, 120°)`, offset `0.5°`, zero angular velocities.

- [x] Implement `validateDoublePendulumInput` to reject non-finite values, non-positive lengths/masses, angles outside the open interval `(-π, π)`, and gravity other than `9.8`.
- [x] Implement the standard planar double-pendulum angular accelerations for angles measured from downward vertical; document the convention in the file.
- [x] Implement fixed-step RK4 with `STEP_S = 1 / 240`, carrying fractional elapsed time across `advance` calls; reject negative or non-finite `deltaS`.
- [x] Implement lower-bob Cartesian position from both angles and rod lengths; separation is Euclidean distance between those positions.
- [x] Manually verify same-input determinism, zero-offset separation near zero, and finite states for the 20-second default and maximum-angle trials.

### Task 2: Responsive scene with trails

**Files:**
- Create: `src/experiments/double-pendulum/scene.ts`

**Interfaces:**
- `DoublePendulumScene` exposes `update(stateA: DoublePendulumState, stateB: DoublePendulumState, inputs: { upperLengthM: number; lowerLengthM: number }): void`, `appendTrailPoint(pointA: { xM: number; yM: number }, pointB: { xM: number; yM: number }): void`, `clearTrails(): void`, and `destroy(): void`.
- `createDoublePendulumScene(host: HTMLElement): Promise<DoublePendulumScene>` owns the Pixi application and resize observer.

- [x] Draw two labeled side-by-side systems on desktop and stacked systems on narrow screens; show pivot, both rods, both joints, bobs, gravity direction, and a dotted trail for each lower bob.
- [x] Use coral for A and blue for B, with labels and distinct trail dash patterns so the comparison does not rely on color alone.
- [x] Keep scene coordinates logical and call `resizeExperimentScene(app, world, host, logicalSize)` from the resize observer.
- [x] Make update/render consume supplied snapshots only; cap stored/rendered trail points at 600 per system and clear them on `clearTrails`.
- [x] Manually verify geometry follows state snapshots, resize works on desktop/mobile, and destroy disconnects the observer and removes the canvas.

### Task 3: Full-screen experiment, controls and completion

**Files:**
- Create: `src/experiments/double-pendulum/DoublePendulumPage.tsx`
- Create: `src/styles/double-pendulum.css`
- Modify: `src/styles/global.css`
- Modify: `src/components/SiteShell.tsx`

**Interfaces:**
- `DoublePendulumSettings = { upperLengthM: number; lowerLengthM: number; upperMassKg: number; lowerMassKg: number; initialUpperAngleDeg: number; initialLowerAngleDeg: number; initialOffsetDeg: number }`.
- `DoublePendulumReportState = { id: string; settings: DoublePendulumSettings; completed: true; samples: DoublePendulumSample[]; trailA: Point[]; trailB: Point[]; finalStateA: DoublePendulumState; finalStateB: DoublePendulumState; finalSeparationM: number }`.
- Route `/physics/oscillations/double-pendulum`.

- [x] Initialize A/B models from identical length/mass settings and corresponding initial angle inputs; derive B upper angle by adding `initialOffsetDeg` to A.
- [x] Advance both models with the same `LabClock` delta; sample lower-bob separation every `1/30 s` from model positions and update scene snapshots.
- [x] Complete and pause automatically at 20 simulated seconds; only then expose the `Link` to the report route with completed snapshot state.
- [x] Provide range inputs for offset, two initial angles, rod lengths and masses; any input change or reset clears both model states, samples, trails, completion and report state.
- [x] Store the completed trial by ID and associate it with the simulation history entry; return from report with the ID so browser Back and the in-page return link both retain the completed scene/settings. Reset and input changes invalidate the ID across history; starting after completion begins a fresh trial.
- [x] Keep simulation UI within `ExperimentFrame` contents and include a short setup note, not measured results or graphs.
- [x] Manually verify play, pause/resume, completion at 20 seconds, report visibility, reset/change invalidation and returning from report.

### Task 4: Separate report

**Files:**
- Create: `src/experiments/double-pendulum/DoublePendulumReportPage.tsx`
- Modify: `src/styles/double-pendulum.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Route `/physics/oscillations/double-pendulum/report` consumes a trial ID from React Router location state and looks up `DoublePendulumReportState` in the session-scoped store.

- [x] If state is absent or incomplete, render the normal `SiteShell` report empty state with a link to the simulation.
- [x] Show initial angle offset, lengths, masses and final lower-bob separation with SI units.
- [x] Render accessible SVG graph of separation (m) against simulated time (s) from `samples`; label axes, include concise text description and indicate initial separation.
- [x] Explain that deterministic equations can amplify small initial differences, and state idealizations and numerical limitations.
- [x] Return to the simulation with the full report state so the completed scene remains available and report can be reopened.
- [x] Manually verify completed and empty report states, graph labels and return navigation.

### Task 5: Catalogue integration and end-to-end review

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/catalog/experiments.ts`
- Modify: `src/catalog/CatalogPage.tsx`

- [x] Add topic route `/physics/oscillations` using topic label `Dao động và hỗn loạn` and add a matching topic card to the Physics catalogue with available count.
- [x] Add available card `double-pendulum-chaos`, title `Con lắc kép`, question `Sai khác rất nhỏ có thể làm chuyển động đổi khác đến đâu?`, and href `/physics/oscillations/double-pendulum`.
- [x] Add a code-native catalogue illustration matching the existing editorial card style.
- [x] Verify navigation from Physics catalogue to topic to experiment; confirm report is normal `SiteShell`, simulation is full-screen, and exit returns to the oscillations topic.
- [x] Manually inspect desktop and 390×844 layouts; confirm no horizontal scrolling and readable controls/labels.

## Plan self-review

- Spec coverage: model assumptions, paired runs, adjustable small offset, full-screen frame, completion gate, separate report, empty report state, return state preservation, shared resize helper and catalogue discovery are assigned to tasks.
- Step scan: each step names one implementation action and a manual check; no automated tests are added or run under the session instruction.
- Type consistency: page samples use `DoublePendulumSample`; model, scene and report share the same `DoublePendulumState` and `DoublePendulumSettings` definitions as indicated in their interfaces.
- Review focus: model determinism, high-energy stability, clock lifecycle, invalidation, responsive scene and direct route are mapped to owning tasks.
- Proportion: five tasks isolate model, Pixi scene, orchestration, report and catalogue integration.
