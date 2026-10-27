# Task 4 report — PixiJS gravity workbench

Status: complete. No Git commands or subagents used, as instructed.

## Delivered

- Added `src/experiments/gravity/scene.ts`, exposing the requested async `createGravityScene(host, { onHeightChange })` and `GravityScene` interface.
- Installed `pixi.js` 8.22.0; updated package manifest and lockfile. The first npm command encountered PowerShell script policy; `npm.cmd` then encountered sandbox network EACCES. The required escalated retry succeeded, reporting zero vulnerabilities.
- Original paper-background workbench artwork: two coral/blue tinted outlined lanes, hard offset shadows, distinct lettered balls, ruler marks from 0–20 metres, dashed release guide, yellow striped ground, and monospaced scene labels.
- A stable 900×520 coordinate system scales to host width with a ResizeObserver and explicit renderer resize. SI-to-screen conversion stays inside the scene (`groundY - heightM / 20 * span`). Device-pixel ratio is capped at two.
- Private Pixi ticker configured with `autoStart: false`, `sharedTicker: false`, then explicitly stopped. There is no animation frame request, elapsed-time accumulation, tween, or integration in this module. Only update, guide changes, and resize trigger rendering.
- Mouse/touch/pen pointer handlers use pointer identity, a larger hit area, global move, up, outside-up, and cancellation handling. Height callbacks clamp to 2–20m and round to 0.1m. Only the canvas disables browser touch gestures.
- Idempotent cleanup disconnects the resize observer, clears callbacks, destroys app/stage children, and removes canvas. Calls after destruction do nothing.

## Integration contract for Task 5

`update(left, right)` is the only public method that positions objects; it uses supplied snapshots directly. `setHeight(heightM)` updates only the release guide, preserving this single-source-of-truth contract. After awaited creation, call setHeight(currentHeight) and update(currentLeft, currentRight) immediately. Initial placeholder height is 10m. The drag callback should update UI/model configuration and send fresh snapshots back through update. Essential native slider, numerical data, masses, and accessible description belong in DOM in Task 5. Canvas is aria-hidden to avoid duplicate/incomplete accessible content.

## Verification

- `npm.cmd run build`: passed (TypeScript and Vite).
- `npm.cmd test -- tests/gravity`: passed, 2 files / 35 model and clock tests.
- Browser check in Chrome at the existing localhost:5173 dev server using a temporary isolated harness (removed after checking): scene initialized successfully with real WebGL and original artwork visible.
- At 900px and 450px host widths: same layout and mapping, no clipping within scene. At 450px, a measured ball drag from height 20m down to y=180 produced 8.1m, consistent with scaled logical coordinates. Dragging below ground clamped at 2m; dragging above the lane clamped at 20m.
- Harness remounted four times through destroy/create; DOM status consistently showed exactly one canvas. Pointer interaction still worked after repeated remounts.
- Supplying zero-height landed snapshots moved both balls to the common ground line. Release guide remained at configured height as intended.
- Browser captured no warning or error logs during focused scene checks.

## Limits / follow-up

- Actual touch hardware was unavailable; mouse interaction exercises the shared pointer path, but real touch cancellation/gesture behavior should be included in Task 7 device testing.
- Full route navigation, accessible native controls, React async-effect cancellation, and reduced-motion UI belong to Task 5/7. This scene has no autonomous motion and thus adds no separate reduced-motion loop.
- Remount canvas count verified in browser; absence of an independent ticker is established by explicit initialization/stop configuration and no ticker listeners or time integration in source, rather than browser performance profiling.
- Scene labels are English monospaced technical annotations; the surrounding app currently uses Vietnamese. Localize these strings if Task 5 establishes a consistent locale requirement.

## Review fix — native pointer cancellation

The review identified that Pixi 8.22 does not forward native `pointercancel` through its event boundary. Retaining only federated Pixi cancellation callbacks could leave the active pointer lock set after OS touch/pen interruption. Added a native canvas `pointercancel` listener using the same matching-pointer cleanup callback and explicitly remove it before app destruction. Wrong-pointer cancellation leaves the active drag intact.

Added `tests/gravity/scene.test.ts`, a focused scene harness with a native EventTarget canvas and mocked renderer. It starts pointer 11, sends native cancellation for unrelated pointer 99, verifies pointer 11 still moves and keeps grabbing cursor, cancels pointer 11, verifies its subsequent move is ignored and grab cursor is restored, then starts pointer 22 and verifies height callbacks resume. It also verifies native listener removal and Pixi destruction arguments. This tests actual native event dispatch into the scene listener; it does not claim a real hardware OS cancellation.

Post-fix validation: `npm.cmd test -- tests/gravity` passes 3 files / 36 tests; `npm.cmd run build` passes. No Git or subagents used.
