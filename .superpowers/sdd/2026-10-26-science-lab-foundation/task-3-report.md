# Task 3: One controllable experiment clock

## Status

Implemented `src/experiments/gravity/clock.ts` and its deterministic fake animation-frame tests in `tests/gravity/clock.test.ts`. The gravity model was not changed.

## Behavior

- `createLabClock` is the sole owner of elapsed simulation seconds and reports each animation-frame time through `onTime`.
- `play()` starts at most one request-animation-frame loop. An explicit pause/play clears its prior wall-clock baseline, so paused wall time is not added.
- Each frame delta is converted from milliseconds to seconds and capped at 0.05 seconds. This bounds catch-up after a suspended/background tab.
- `pause()` and `dispose()` stop the loop and cancel its pending frame. `reset()` pauses, sets time to zero, and reports zero.
- `getTime()` returns the current elapsed time.

## Verification evidence

The tests were written first. The initial `npm.cmd test -- tests/gravity/clock.test.ts` failed because `src/experiments/gravity/clock.ts` did not yet exist, confirming the intended red state.

After implementation:

- `npm.cmd test -- tests/gravity/clock.test.ts`: passed, 1 file and 5 tests.
- `npm.cmd test`: passed, 2 files and 34 tests.
- `npm.cmd run build`: passed TypeScript build and Vite production build.

An initial attempt to invoke `npm` was blocked by PowerShell's script execution policy before tests could start. Using `npm.cmd` resolved this environment issue.

## Background-tab behavior

When a browser suspends animation frames while the clock remains running, its next frame includes the long elapsed gap, capped at 0.05 seconds; later frames continue from that timestamp. An explicit pause/play instead establishes a fresh baseline, excluding the paused interval. Deterministic tests cover both cases.

## Self-review and concerns

- Repeated `play()` calls while running do not enqueue additional loops.
- Pausing/resetting cancels the pending callback and clears the timestamp baseline; resuming does not include paused time.
- `dispose()` follows the specified implementation contract and aliases `pause()`; callers should stop using the clock after disposal. It is not a separate permanent terminal state.
- Browser `requestAnimationFrame` and `cancelAnimationFrame` are expected at call time; tests provide deterministic stubs. No browser integration or manual GUI check was run.
- No Git repository was initialized and no commit was created; task instructions prohibited Git operations in this workspace.

## Follow-up fix evidence

Added a fake RAF test that keeps the clock running across a 20-second timestamp gap, confirms the first delta is capped at 0.05 seconds, and confirms the following 16 ms frame advances normally to 0.066 seconds. This closes the uninterrupted-suspension coverage gap. Focused tests, full suite, and production build were rerun after the change; all passed (6 clock tests and 35 total tests).
