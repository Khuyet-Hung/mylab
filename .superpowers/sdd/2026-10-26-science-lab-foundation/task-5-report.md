# Task 5 report — complete free-fall experiment

Status: complete. No Git commands, subagents, or reviewers used, as requested. Final visual styling remains Task 6's responsibility.

## Delivered

- Added `src/experiments/gravity/GravityPage.tsx` and replaced the placeholder route in `src/App.tsx`.
- One input object defaults to 12 m, 1 kg, 5 kg with fixed 9.8 m/s² gravity. Mutable input/scene/clock refs keep frame and drag callbacks current.
- One `snapshotAt` samples both masses, sends those exact snapshots to Pixi, and publishes React display values at most once per 100 ms, with unconditional publication at release/reset and landing. Positions are not stored per frame in React. Landing pauses the sole lab clock.
- Native labeled height and mass ranges support keyboard input. Every input change, including canvas dragging, resets the clock and immediately resamples at zero. Play resumes a pause; play after landing starts a new release. Pause and reset update button/status state.
- Measurements show elapsed time, calculated impact time, both heights, distance fallen, and downward velocity with SI units. The numeric elapsed span has `data-testid="elapsed-seconds"` as required for Task 7.
- Added `HeightGraph` using 41 deterministic model samples across 40 equal time intervals. A model-derived marker shows the displayed time. Accessible description explains the shared curve and includes current height/time.
- Plain Vietnamese explanation precedes expandable formulas; explicitly states release from rest, uniform gravity, and no air resistance. Linked and verified OpenStax College Physics 2e section 2.7, which supports equal acceleration independent of mass and g = 9.80 m/s².
- Async scene effect owns its local clock/scene and cancellation flag. A scene resolving after cleanup is immediately destroyed. A live scene receives current height and fresh model snapshots immediately after creation. Cleanup disposes its clock, destroys its scene, and only clears refs it owns. This handles React StrictMode mount/cleanup/remount without a late promise taking over the live refs.
- Scene creation failure leaves native controls and numerical experiment available with an accessible status message.
- No GSAP or independent scientific animation loop was added. Semantic class hooks support Task 6 styling.

## Verification

- `npm.cmd run build`: passed TypeScript and production Vite build. Vite reports the existing large chunk advisory (main JavaScript approximately 558 kB, Pixi included).
- `npm.cmd test -- tests/gravity`: passed 3 files / 36 tests covering model, clock, and scene pointer cancellation.
- Chrome on existing localhost:5173 dev server: release numbers 12.00 m, 0.00 m fallen, 0.00 m/s, elapsed 0.00 s; graph text agrees.
- Play/pause browser check: elapsed 0.42 s (rounded), heights 11.15 m, distances 0.85 m, velocities 4.08 m/s for both masses; graph text agrees with those same snapshots. Exact underlying sample is approximately 0.4167 s; two-decimal elapsed text is rounded separately.
- Resume reaches automatic landing: elapsed/impact time 1.56 s, both heights 0.00 m, distances 12.00 m, impact speed retained as 15.34 m/s. Screenshot confirmed both canvas balls at ground level.
- Reset returned all values to zero-time release. Keyboard ArrowRight on height changed 12.0 to 12.1 m; End on mass A changed it to 10.0 kg. Both objects/graph reset to 12.10 m, elapsed 0.00 s, impact prediction 1.57 s.
- Two full exit/entry cycles through the gravity catalog produced exactly one canvas after each entry, with default inputs restored. StrictMode also exercises the cancelled first scene creation.
- Desktop canvas drag changed release height from 12.0 to 18.2 m. Native slider, both measurements, graph summary, and guide all updated to 18.2 m at 0 s; prediction became 1.93 s.
- Mobile viewport override 390 × 844: screenshot showed complete scaled scene, readable labels, native controls, and wrapping copy. Read-only layout measurement reported document client/scroll widths both 375 px (scrollbar-adjusted), canvas 330.4 px: no horizontal overflow. Temporary viewport override reset afterward.
- Browser captured no warning/error logs during checks.

## Limits and integration notes

- Final panel/button/graph color and responsive visual composition belongs to Task 6; this page deliberately supplies semantic layout hooks without competing styles.
- Display and graph are intentionally throttled to 10 Hz while canvas consumes every clock sample; during motion or immediately after pause they can lag the latest canvas snapshot by less than 100 ms. Release/reset and landing publish immediately, as specified.
- Actual touch hardware was unavailable. A mobile synthetic drag did not change the height; desktop pointer drag and native keyboard controls did. Do not treat this as real-device touch validation; Task 7 should exercise real touch.
- No autonomous decorative animation was added, so there is no new GSAP reduced-motion behavior to gate here. Existing scientific play/pause controls remain explicit.
- Browser checks are interactive evidence, not new automated page integration coverage. Task 7 owns browser regression tests and reduced-motion verification.
- No Git repository operations or commits were performed per explicit handoff instruction.
