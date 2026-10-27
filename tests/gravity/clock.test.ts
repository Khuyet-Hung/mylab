import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLabClock } from '../../src/experiments/gravity/clock';

const callbacks = new Map<number, FrameRequestCallback>();
let nextId = 1;

beforeEach(() => {
  callbacks.clear();
  nextId = 1;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextId++;
    callbacks.set(id, callback);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
});

afterEach(() => vi.unstubAllGlobals());

function fireFrame(ms: number) {
  const next = callbacks.entries().next().value as [number, FrameRequestCallback] | undefined;
  if (!next) throw new Error('No animation frame is pending');
  const [id, callback] = next;
  callbacks.delete(id);
  callback(ms);
}

describe('lab clock', () => {
  it('advances in seconds and reports each time', () => {
    const observed: number[] = [];
    const clock = createLabClock(time => observed.push(time));

    clock.play();
    fireFrame(100);
    fireFrame(116);
    fireFrame(132);

    expect(clock.getTime()).toBeCloseTo(0.032);
    expect(observed).toEqual([0, 0.016, 0.032]);
    clock.dispose();
  });

  it('caps a long frame and holds time while paused', () => {
    const observed: number[] = [];
    const clock = createLabClock(time => observed.push(time));

    clock.play();
    fireFrame(0);
    fireFrame(100);
    expect(clock.getTime()).toBeCloseTo(0.05);
    clock.pause();
    expect(callbacks.size).toBe(0);
    clock.play();
    fireFrame(10_000);
    expect(clock.getTime()).toBeCloseTo(0.05);
    fireFrame(10_016);
    expect(clock.getTime()).toBeCloseTo(0.066);
    clock.pause();
    expect(observed.at(-1)).toBeCloseTo(0.066);
    clock.dispose();
  });

  it('caps a long frame gap while running and then continues normally', () => {
    const clock = createLabClock(() => {});

    clock.play();
    fireFrame(0);
    fireFrame(20_000);
    expect(clock.getTime()).toBeCloseTo(0.05);

    fireFrame(20_016);
    expect(clock.getTime()).toBeCloseTo(0.066);
    clock.dispose();
  });

  it('resets to zero and reports the reset', () => {
    const observed: number[] = [];
    const clock = createLabClock(time => observed.push(time));

    clock.play();
    fireFrame(0);
    fireFrame(20);
    clock.reset();

    expect(clock.getTime()).toBe(0);
    expect(observed.at(-1)).toBe(0);
    expect(callbacks.size).toBe(0);
    clock.dispose();
  });

  it('does not create parallel loops after repeated play calls', () => {
    const clock = createLabClock(() => {});

    clock.play();
    clock.play();
    clock.play();
    expect(callbacks.size).toBe(1);

    fireFrame(0);
    expect(callbacks.size).toBe(1);
    clock.dispose();
  });

  it('cancels pending frames on pause and dispose', () => {
    const clock = createLabClock(() => {});

    clock.play();
    expect(callbacks.size).toBe(1);
    clock.pause();
    expect(callbacks.size).toBe(0);

    clock.play();
    expect(callbacks.size).toBe(1);
    clock.dispose();
    expect(callbacks.size).toBe(0);
  });
});
