import { describe, expect, it } from 'vitest';
import { fallTimeS, sampleGravity, validateGravityInput } from '../../src/experiments/gravity/model';

const input = { heightM: 19.6, massKg: 1, gravityMps2: 9.8 };

describe('free fall without air resistance', () => {
  it('reaches the ground after two seconds from 19.6 m', () => {
    expect(fallTimeS(input)).toBeCloseTo(2, 10);
    expect(sampleGravity(input, 2)).toEqual({
      timeS: 2, heightM: 0, distanceM: 19.6, velocityMps: 19.6, landed: true,
    });
  });

  it('starts at rest and matches the one-second reference', () => {
    expect(sampleGravity(input, 0)).toEqual({
      timeS: 0, heightM: 19.6, distanceM: 0, velocityMps: 0, landed: false,
    });
    expect(sampleGravity(input, 1).heightM).toBeCloseTo(14.7, 10);
    expect(sampleGravity(input, 1)).toMatchObject({ distanceM: 4.9, velocityMps: 9.8, landed: false });
  });

  it('has equal snapshots and fall times for different masses', () => {
    const light = { ...input, massKg: 0.1 };
    const heavy = { ...input, massKg: 10 };
    expect(fallTimeS(light)).toBe(fallTimeS(heavy));
    for (const time of [0, 0.5, 1, 2, 100]) {
      expect(sampleGravity(light, time)).toEqual(sampleGravity(heavy, time));
    }
  });

  it('freezes the impact snapshot after landing', () => {
    expect(sampleGravity(input, 100)).toEqual(sampleGravity(input, 2));
  });

  it.each([2, 7, 20])('preserves distance and height bounds from %s m', (heightM) => {
    const x = { ...input, heightM };
    const duration = fallTimeS(x);
    let previousDistance = 0;
    for (const fraction of [0, 0.1, 0.5, 0.9, 1, 2]) {
      const sample = sampleGravity(x, duration * fraction);
      expect(sample.heightM + sample.distanceM).toBeCloseTo(heightM, 12);
      expect(sample.heightM).toBeGreaterThanOrEqual(0);
      expect(sample.distanceM).toBeLessThanOrEqual(heightM);
      expect(sample.distanceM).toBeGreaterThanOrEqual(previousDistance);
      expect(sample.landed).toBe(fraction >= 1);
      previousDistance = sample.distanceM;
    }
  });
});

describe('gravity input validation', () => {
  it.each([[2, 0.1], [20, 10]])('accepts inclusive bounds %s m and %s kg', (heightM, massKg) => {
    const x = { ...input, heightM, massKg };
    expect(validateGravityInput(x)).toEqual(x);
    expect(Number.isFinite(fallTimeS(x))).toBe(true);
  });

  const invalidInputs = [
    ...[1.999, 20.001, NaN, Infinity, -Infinity].map(heightM => ({ ...input, heightM })),
    ...[0.099, 10.001, NaN, Infinity, -Infinity].map(massKg => ({ ...input, massKg })),
    ...[0, 9.81, NaN, Infinity, -Infinity].map(gravityMps2 => ({ ...input, gravityMps2 })),
  ];
  it.each(invalidInputs)('rejects invalid parameters %# across all entry points', (x) => {
    expect(() => validateGravityInput(x)).toThrow(RangeError);
    expect(() => fallTimeS(x)).toThrow(RangeError);
    expect(() => sampleGravity(x, 0)).toThrow(RangeError);
  });

  it.each([-0.001, NaN, Infinity, -Infinity])('rejects invalid time %s', (time) => {
    expect(() => sampleGravity(input, time)).toThrow(RangeError);
  });

  it('does not mutate caller inputs', () => {
    const frozen = Object.freeze({ ...input });
    validateGravityInput(frozen);
    fallTimeS(frozen);
    sampleGravity(frozen, 1);
    expect(frozen).toEqual(input);
  });
});
