# Task 3 scoped files (no Git diff available)

## src/experiments/gravity/clock.ts

   1: /** A single animation-frame clock that owns the experiment's elapsed time. */
   2: export type LabClock = {
   3:   play(): void;
   4:   pause(): void;
   5:   reset(): void;
   6:   dispose(): void;
   7:   getTime(): number;
   8: };
   9: 
  10: const MAX_FRAME_DELTA_S = 0.05;
  11: 
  12: export function createLabClock(onTime: (timeS: number) => void): LabClock {
  13:   let timeS = 0;
  14:   let frame = 0;
  15:   let running = false;
  16:   let lastMs: number | null = null;
  17: 
  18:   const tick = (nowMs: number) => {
  19:     if (!running) return;
  20: 
  21:     if (lastMs !== null) {
  22:       timeS += Math.min((nowMs - lastMs) / 1000, MAX_FRAME_DELTA_S);
  23:     }
  24:     lastMs = nowMs;
  25:     onTime(timeS);
  26: 
  27:     if (running) frame = requestAnimationFrame(tick);
  28:   };
  29: 
  30:   const pause = () => {
  31:     running = false;
  32:     cancelAnimationFrame(frame);
  33:     lastMs = null;
  34:   };
  35: 
  36:   return {
  37:     play: () => {
  38:       if (running) return;
  39:       running = true;
  40:       lastMs = null;
  41:       frame = requestAnimationFrame(tick);
  42:     },
  43:     pause,
  44:     reset: () => {
  45:       pause();
  46:       timeS = 0;
  47:       onTime(0);
  48:     },
  49:     dispose: pause,
  50:     getTime: () => timeS,
  51:   };
  52: }

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
  63:   it('resets to zero and reports the reset', () => {
  64:     const observed: number[] = [];
  65:     const clock = createLabClock(time => observed.push(time));
  66: 
  67:     clock.play();
  68:     fireFrame(0);
  69:     fireFrame(20);
  70:     clock.reset();
  71: 
  72:     expect(clock.getTime()).toBe(0);
  73:     expect(observed.at(-1)).toBe(0);
  74:     expect(callbacks.size).toBe(0);
  75:     clock.dispose();
  76:   });
  77: 
  78:   it('does not create parallel loops after repeated play calls', () => {
  79:     const clock = createLabClock(() => {});
  80: 
  81:     clock.play();
  82:     clock.play();
  83:     clock.play();
  84:     expect(callbacks.size).toBe(1);
  85: 
  86:     fireFrame(0);
  87:     expect(callbacks.size).toBe(1);
  88:     clock.dispose();
  89:   });
  90: 
  91:   it('cancels pending frames on pause and dispose', () => {
  92:     const clock = createLabClock(() => {});
  93: 
  94:     clock.play();
  95:     expect(callbacks.size).toBe(1);
  96:     clock.pause();
  97:     expect(callbacks.size).toBe(0);
  98: 
  99:     clock.play();
 100:     expect(callbacks.size).toBe(1);
 101:     clock.dispose();
 102:     expect(callbacks.size).toBe(0);
 103:   });
 104: });
