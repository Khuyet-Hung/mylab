import { describe, expect, it } from "vitest";
import {
  createPendulumIntegrator,
  smallAnglePeriodS,
  type PendulumInput,
} from "../../src/experiments/pendulum/model";

const input = (lengthM: number, angleDeg: number): PendulumInput => ({
  lengthM,
  initialAngleRad: (angleDeg * Math.PI) / 180,
  gravityMps2: 9.8,
});

describe("ideal pendulum model", () => {
  it("computes the small-angle approximation in seconds", () => {
    expect(smallAnglePeriodS(1)).toBeCloseTo(2 * Math.PI / Math.sqrt(9.8), 10);
    expect(smallAnglePeriodS(2) / smallAnglePeriodS(1)).toBeCloseTo(Math.sqrt(2), 10);
  });

  it("rejects invalid physical inputs and elapsed times", () => {
    expect(() => createPendulumIntegrator(input(0, 20))).toThrow(RangeError);
    expect(() => createPendulumIntegrator(input(Number.NaN, 20))).toThrow(RangeError);
    expect(() => createPendulumIntegrator(input(1, 180))).toThrow(RangeError);
    expect(() => createPendulumIntegrator({ ...input(1, 20), gravityMps2: 9.81 })).toThrow(RangeError);
    const model = createPendulumIntegrator(input(1, 20));
    expect(() => model.advance(-1)).toThrow(RangeError);
    expect(() => model.advance(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => smallAnglePeriodS(0)).toThrow(RangeError);
  });

  it("does not invent a period for a stationary pendulum", () => {
    const model = createPendulumIntegrator(input(1, 0));
    model.advance(10);
    expect(model.getState().angleRad).toBe(0);
    expect(model.getMeasuredPeriodS()).toBeNull();
  });

  it("waits for a complete cycle, then measures the small-angle period", () => {
    const model = createPendulumIntegrator(input(1, 5));
    model.advance(1);
    expect(model.getMeasuredPeriodS()).toBeNull();
    model.advance(2);
    const measured = model.getMeasuredPeriodS();
    expect(measured).not.toBeNull();
    expect(Math.abs(measured! - smallAnglePeriodS(1)) / smallAnglePeriodS(1)).toBeLessThan(0.005);
  });

  it("produces the same state for different frame partitions", () => {
    const whole = createPendulumIntegrator(input(2, 35));
    const chunks = createPendulumIntegrator(input(2, 35));
    whole.advance(4);
    for (let index = 0; index < 240; index += 1) chunks.advance(1 / 60);
    expect(chunks.getState().angleRad).toBeCloseTo(whole.getState().angleRad, 8);
    expect(chunks.getState().angularVelocityRadS).toBeCloseTo(whole.getState().angularVelocityRadS, 8);
    expect(chunks.getMeasuredPeriodS()).toBeCloseTo(whole.getMeasuredPeriodS()!, 8);
  });

  it("shows a longer period at greater length and a nonlinear large-angle difference", () => {
    const short = createPendulumIntegrator(input(1, 80));
    const long = createPendulumIntegrator(input(2, 80));
    short.advance(10);
    long.advance(10);
    expect(short.getMeasuredPeriodS()!).toBeGreaterThan(smallAnglePeriodS(1) * 1.1);
    expect(long.getMeasuredPeriodS()!).toBeGreaterThan(short.getMeasuredPeriodS()!);
  });

  it("preserves mechanical energy over repeated cycles at the longest UI length", () => {
    const initial = input(3, 80);
    const model = createPendulumIntegrator(initial);
    const initialEnergy = initial.gravityMps2 * initial.lengthM * (1 - Math.cos(initial.initialAngleRad));
    model.advance(40);
    const state = model.getState();
    const energy = initial.gravityMps2 * initial.lengthM * (1 - Math.cos(state.angleRad)) +
      0.5 * (initial.lengthM * state.angularVelocityRadS) ** 2;
    expect(Math.abs(energy - initialEnergy) / initialEnergy).toBeLessThan(0.001);
  });

  it("clears measurements when resetting for a new comparison", () => {
    const model = createPendulumIntegrator(input(1, 20));
    model.advance(5);
    expect(model.getMeasuredPeriodS()).not.toBeNull();
    model.reset(input(2, 20));
    expect(model.getState()).toEqual({ timeS: 0, angleRad: (20 * Math.PI) / 180, angularVelocityRadS: 0 });
    expect(model.getMeasuredPeriodS()).toBeNull();
  });
});
