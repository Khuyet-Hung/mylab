## Global Constraints

- Audience: curious visitors of any age; explain results in plain language before formulas.
- 2D only. Chemistry appears as a clearly labeled preview in this release; no empty Chemistry experiment route.
- First experiment: compare two falling objects under uniform gravity, with air resistance neglected.
- Model values use SI units; rendering uses a separately defined metres-to-pixels mapping.
- PixiJS scene and numerical UI read the same model snapshot; GSAP does not mutate scientific state.
- Mouse, touch, and keyboard must operate essential controls; respect reduced-motion preferences.
- No backend, accounts, or general-purpose physics/chemistry engine in this release.
- Visual direction follows the user-supplied screenshot: warm paper background, dark outlined rounded panels and pill controls, short hard offset shadows, bold numeric typography, monospaced labels, yellow/coral/blue accents, and a high-contrast graph. Use original science-lab layout and copy.
- Current workspace has no Git repository. Initialize Git at execution time if permitted; commit each completed task. If Git initialization is unavailable, preserve the working files and record the limitation.


---
### Task 3: One controllable experiment clock

**Files:** Create `src/experiments/gravity/clock.ts`, `tests/gravity/clock.test.ts`.

**Interfaces:** Produces `createLabClock(onTime: (timeS: number) => void): { play(): void; pause(): void; reset(): void; dispose(): void; getTime(): number }`. The clock is the only owner of elapsed simulation time.

- [ ] **Step 1: Write failing tests using fake `requestAnimationFrame`.** Check that play advances time, pause holds time, reset returns to zero, repeated play does not create parallel loops, and dispose cancels pending frames. A representative test:

```ts
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createLabClock } from '../../src/experiments/gravity/clock';

const callbacks = new Map<number, FrameRequestCallback>();
let nextId = 1;
beforeEach(() => {
  callbacks.clear(); nextId = 1;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = nextId++; callbacks.set(id, cb); return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
});
afterEach(() => vi.unstubAllGlobals());
function fireFrame(ms: number) {
  const [id, cb] = callbacks.entries().next().value!;
  callbacks.delete(id); cb(ms);
}
it('does not advance while paused', () => {
  const observed: number[] = [];
  const clock = createLabClock(t => observed.push(t));
  clock.play();
  fireFrame(0); fireFrame(100);
  expect(clock.getTime()).toBeCloseTo(0.05); // capped long frame
  clock.pause(); fireFrame(200);
  expect(clock.getTime()).toBeCloseTo(0.05);
  clock.dispose();
});
```

The callback map makes the clock test deterministic without waiting for wall time.
- [ ] **Step 2: Run `npm test -- tests/gravity/clock.test.ts`; confirm failure.** Implement an animation-frame loop that converts elapsed milliseconds to seconds, caps anomalous single-frame deltas after tab suspension, calls `onTime`, and cancels its frame on pause/dispose. Start each resumed run with a fresh wall-clock timestamp.

```ts
export type LabClock = {
  play(): void; pause(): void; reset(): void;
  dispose(): void; getTime(): number;
};
export function createLabClock(onTime: (timeS: number) => void): LabClock {
  let timeS = 0, frame = 0, running = false, lastMs: number | null = null;
  const tick = (nowMs: number) => {
    if (!running) return;
    if (lastMs !== null) timeS += Math.min((nowMs - lastMs) / 1000, 0.05);
    lastMs = nowMs; onTime(timeS); if (running) frame = requestAnimationFrame(tick);
  };
  const pause = () => { running = false; cancelAnimationFrame(frame); lastMs = null; };
  return {
    play: () => { if (!running) { running = true; frame = requestAnimationFrame(tick); } },
    pause,
    reset: () => { pause(); timeS = 0; onTime(0); },
    dispose: pause,
    getTime: () => timeS,
  };
}
```

- [ ] **Step 3: Run clock tests and build.** Check background-tab behavior manually. Commit `feat: add single experiment clock`.


