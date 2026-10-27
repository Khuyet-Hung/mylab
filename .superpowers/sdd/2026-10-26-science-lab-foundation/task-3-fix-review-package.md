# Task 3 scoped fix: suspension test and report

## tests/gravity/clock.test.ts

   1: import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
   2: import { createLabClock } from '../../src/experiments/gravity/clock';
   3: 
   4: const callbacks = new Map<number, FrameRequestCallback>();
   5: let nextId = 1;
   6: 
   7: beforeEach(() => {
   8:   callbacks.clear();
   9:   nextId = 1;
  10:   vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  11:     const id = nextId++;
  12:     callbacks.set(id, callback);
  13:     return id;
  14:   });
  15:   vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
  16: });
  17: 
  18: afterEach(() => vi.unstubAllGlobals());
  19: 
  20: function fireFrame(ms: number) {
  21:   const next = callbacks.entries().next().value as [number, FrameRequestCallback] | undefined;
  22:   if (!next) throw new Error('No animation frame is pending');
  23:   const [id, callback] = next;
  24:   callbacks.delete(id);
  25:   callback(ms);
  26: }
  27: 
  28: describe('lab clock', () => {
  29:   it('advances in seconds and reports each time', () => {
  30:     const observed: number[] = [];
  31:     const clock = createLabClock(time => observed.push(time));
  32: 
  33:     clock.play();
  34:     fireFrame(100);
  35:     fireFrame(116);
  36:     fireFrame(132);
  37: 
  38:     expect(clock.getTime()).toBeCloseTo(0.032);
  39:     expect(observed).toEqual([0, 0.016, 0.032]);
  40:     clock.dispose();
  41:   });
  42: 
  43:   it('caps a long frame and holds time while paused', () => {
  44:     const observed: number[] = [];
  45:     const clock = createLabClock(time => observed.push(time));
  46: 
  47:     clock.play();
  48:     fireFrame(0);
  49:     fireFrame(100);
  50:     expect(clock.getTime()).toBeCloseTo(0.05);
  51:     clock.pause();
  52:     expect(callbacks.size).toBe(0);
  53:     clock.play();
  54:     fireFrame(10_000);
  55:     expect(clock.getTime()).toBeCloseTo(0.05);
  56:     fireFrame(10_016);
  57:     expect(clock.getTime()).toBeCloseTo(0.066);
  58:     clock.pause();
  59:     expect(observed.at(-1)).toBeCloseTo(0.066);
  60:     clock.dispose();
  61:   });
  62: 
  63:   it('caps a long frame gap while running and then continues normally', () => {
  64:     const clock = createLabClock(() => {});
  65: 
  66:     clock.play();
  67:     fireFrame(0);
  68:     fireFrame(20_000);
  69:     expect(clock.getTime()).toBeCloseTo(0.05);
  70: 
  71:     fireFrame(20_016);
  72:     expect(clock.getTime()).toBeCloseTo(0.066);
  73:     clock.dispose();
  74:   });
  75: 
  76:   it('resets to zero and reports the reset', () => {
  77:     const observed: number[] = [];
  78:     const clock = createLabClock(time => observed.push(time));
  79: 
  80:     clock.play();
  81:     fireFrame(0);
  82:     fireFrame(20);
  83:     clock.reset();
  84: 
  85:     expect(clock.getTime()).toBe(0);
  86:     expect(observed.at(-1)).toBe(0);
  87:     expect(callbacks.size).toBe(0);
  88:     clock.dispose();
  89:   });
  90: 
  91:   it('does not create parallel loops after repeated play calls', () => {
  92:     const clock = createLabClock(() => {});
  93: 
  94:     clock.play();
  95:     clock.play();
  96:     clock.play();
  97:     expect(callbacks.size).toBe(1);
  98: 
  99:     fireFrame(0);
 100:     expect(callbacks.size).toBe(1);
 101:     clock.dispose();
 102:   });
 103: 
 104:   it('cancels pending frames on pause and dispose', () => {
 105:     const clock = createLabClock(() => {});
 106: 
 107:     clock.play();
 108:     expect(callbacks.size).toBe(1);
 109:     clock.pause();
 110:     expect(callbacks.size).toBe(0);
 111: 
 112:     clock.play();
 113:     expect(callbacks.size).toBe(1);
 114:     clock.dispose();
 115:     expect(callbacks.size).toBe(0);
 116:   });
 117: });

## .superpowers/sdd/2026-10-26-science-lab-foundation/task-3-report.md

   1: # Task 3: One controllable experiment clock
   2: 
   3: ## Status
   4: 
   5: Implemented `src/experiments/gravity/clock.ts` and its deterministic fake animation-frame tests in `tests/gravity/clock.test.ts`. The gravity model was not changed.
   6: 
   7: ## Behavior
   8: 
   9: - `createLabClock` is the sole owner of elapsed simulation seconds and reports each animation-frame time through `onTime`.
  10: - `play()` starts at most one request-animation-frame loop. An explicit pause/play clears its prior wall-clock baseline, so paused wall time is not added.
  11: - Each frame delta is converted from milliseconds to seconds and capped at 0.05 seconds. This bounds catch-up after a suspended/background tab.
  12: - `pause()` and `dispose()` stop the loop and cancel its pending frame. `reset()` pauses, sets time to zero, and reports zero.
  13: - `getTime()` returns the current elapsed time.
  14: 
  15: ## Verification evidence
  16: 
  17: The tests were written first. The initial `npm.cmd test -- tests/gravity/clock.test.ts` failed because `src/experiments/gravity/clock.ts` did not yet exist, confirming the intended red state.
  18: 
  19: After implementation:
  20: 
  21: - `npm.cmd test -- tests/gravity/clock.test.ts`: passed, 1 file and 5 tests.
  22: - `npm.cmd test`: passed, 2 files and 34 tests.
  23: - `npm.cmd run build`: passed TypeScript build and Vite production build.
  24: 
  25: An initial attempt to invoke `npm` was blocked by PowerShell's script execution policy before tests could start. Using `npm.cmd` resolved this environment issue.
  26: 
  27: ## Background-tab behavior
  28: 
  29: When a browser suspends animation frames while the clock remains running, its next frame includes the long elapsed gap, capped at 0.05 seconds; later frames continue from that timestamp. An explicit pause/play instead establishes a fresh baseline, excluding the paused interval. Deterministic tests cover both cases.
  30: 
  31: ## Self-review and concerns
  32: 
  33: - Repeated `play()` calls while running do not enqueue additional loops.
  34: - Pausing/resetting cancels the pending callback and clears the timestamp baseline; resuming does not include paused time.
  35: - `dispose()` follows the specified implementation contract and aliases `pause()`; callers should stop using the clock after disposal. It is not a separate permanent terminal state.
  36: - Browser `requestAnimationFrame` and `cancelAnimationFrame` are expected at call time; tests provide deterministic stubs. No browser integration or manual GUI check was run.
  37: - No Git repository was initialized and no commit was created; task instructions prohibited Git operations in this workspace.
  38: 
  39: ## Follow-up fix evidence
  40: 
  41: Added a fake RAF test that keeps the clock running across a 20-second timestamp gap, confirms the first delta is capped at 0.05 seconds, and confirms the following 16 ms frame advances normally to 0.066 seconds. This closes the uninterrupted-suspension coverage gap. Focused tests, full suite, and production build were rerun after the change; all passed (6 clock tests and 35 total tests).
