# Task 2 scoped files (no Git diff available)

## docs/experiments/gravity-free-fall.md

   1: # Two objects in free fall
   2: 
   3: Drop two objects together from the same height: in this model they stay side by side and reach the ground together, even when their masses differ. Air resistance is neglected, so mass does not change their motion. Real objects can behave differently in air.
   4: 
   5: ## Scientific assumptions
   6: 
   7: - Both objects start at the same release height, at the same time, with initial velocity **0 m/s**.
   8: - A uniform gravitational field supplies constant downward acceleration **g = 9.8 m/s²**.
   9: - Release height is **2–20 m**, inclusive. Each mass is **0.1–10 kg**, inclusive.
  10: - Motion is vertical and displayed in 2D. Horizontal placement only separates the objects visually.
  11: - No air resistance or friction is included.
  12: 
  13: The reference is [OpenStax College Physics 2e, 2.7 Falling Objects](https://openstax.org/books/college-physics-2e/pages/2-7-falling-objects). It explains constant, mass-independent acceleration when resistance is negligible, and the sign convention for gravity.
  14: 
  15: ## Equations and units
  16: 
  17: Measure displacement and velocity as positive downward from the release point. Height above the ground is a separate, nonnegative quantity. Use SI units throughout: metres, seconds, kilograms, and metres per second.
  18: 
  19: For elapsed fall time t and release height h:
  20: 
  21: - Downward velocity: **v = gt**.
  22: - Downward distance: **distance = ½gt²**.
  23: - Time to ground: **fallTime = sqrt(2h/g)**.
  24: - Remaining height: **height = h − distance**.
  25: 
  26: Mass does not appear in these equations. For example, from 19.6 m, either mass falls 4.9 m in the first second, with speed 9.8 m/s; both reach the ground at 2 s with impact speed 19.6 m/s.
  27: 
  28: ## Model contract
  29: 
  30: `GravityInput` contains `heightM`, `massKg`, and `gravityMps2`. Validation rejects non-finite values, heights or masses outside the inclusive ranges above, and any gravity other than 9.8. Invalid inputs or negative/non-finite sampling times throw `RangeError`.
  31: 
  32: `sampleGravity` is a deterministic analytical sample, independent of frame rate. Its `GravitySnapshot` contains `timeS`, remaining `heightM`, downward `distanceM`, downward `velocityMps`, and `landed`. Sampling at or after impact clamps time to `fallTime`, distance to the release height, and height to zero. Velocity then retains the impact speed; it does not describe motion after a collision. `landed` is true at impact and thereafter.
  33: 
  34: The two-object comparison calls the same model with a shared height and elapsed time and independently chosen masses. Both the numerical UI and PixiJS scene must consume these snapshots. Rendering defines a separate metres-to-pixels mapping; pixel scale never enters these equations. GSAP may animate presentation but must not change scientific state.
  35: 
  36: ## Excluded phenomena
  37: 
  38: This model does not simulate drag, buoyancy, wind, object shape or size, rotation, horizontal motion, collisions between objects, bouncing, deformation, ground-contact forces, changes in gravity with height or location, or relativistic effects. It ends at first ground contact and is not a general-purpose physics engine.

## src/experiments/gravity/model.ts

   1: /** SI inputs for a release from rest in a uniform field without air resistance. */
   2: export type GravityInput = {
   3:   heightM: number;
   4:   massKg: number;
   5:   gravityMps2: number;
   6: };
   7: 
   8: export type GravitySnapshot = {
   9:   timeS: number;
  10:   heightM: number;
  11:   distanceM: number;
  12:   /** Downward positive; retains impact speed at and after landing. */
  13:   velocityMps: number;
  14:   landed: boolean;
  15: };
  16: 
  17: export function validateGravityInput(input: GravityInput): GravityInput {
  18:   if (
  19:     !Number.isFinite(input.heightM) || input.heightM < 2 || input.heightM > 20 ||
  20:     !Number.isFinite(input.massKg) || input.massKg < 0.1 || input.massKg > 10 ||
  21:     !Number.isFinite(input.gravityMps2) || input.gravityMps2 !== 9.8
  22:   ) {
  23:     throw new RangeError('Invalid gravity input');
  24:   }
  25:   return input;
  26: }
  27: 
  28: export function fallTimeS(input: GravityInput): number {
  29:   validateGravityInput(input);
  30:   return Math.sqrt((2 * input.heightM) / input.gravityMps2);
  31: }
  32: 
  33: /** Samples the trajectory through first contact; subsequent samples freeze at impact. */
  34: export function sampleGravity(input: GravityInput, timeS: number): GravitySnapshot {
  35:   if (!Number.isFinite(timeS) || timeS < 0) {
  36:     throw new RangeError('Invalid time');
  37:   }
  38:   const duration = fallTimeS(input);
  39:   const t = Math.min(timeS, duration);
  40:   const landed = t >= duration;
  41:   // Exact contact avoids a floating-point sliver of height at the computed fall time.
  42:   const distanceM = landed ? input.heightM : Math.min(input.heightM, 0.5 * input.gravityMps2 * t * t);
  43:   return {
  44:     timeS: t,
  45:     heightM: Math.max(0, input.heightM - distanceM),
  46:     distanceM,
  47:     velocityMps: input.gravityMps2 * t,
  48:     landed,
  49:   };
  50: }

## tests/gravity/model.test.ts

   1: import { describe, expect, it } from 'vitest';
   2: import { fallTimeS, sampleGravity, validateGravityInput } from '../../src/experiments/gravity/model';
   3: 
   4: const input = { heightM: 19.6, massKg: 1, gravityMps2: 9.8 };
   5: 
   6: describe('free fall without air resistance', () => {
   7:   it('reaches the ground after two seconds from 19.6 m', () => {
   8:     expect(fallTimeS(input)).toBeCloseTo(2, 10);
   9:     expect(sampleGravity(input, 2)).toEqual({
  10:       timeS: 2, heightM: 0, distanceM: 19.6, velocityMps: 19.6, landed: true,
  11:     });
  12:   });
  13: 
  14:   it('starts at rest and matches the one-second reference', () => {
  15:     expect(sampleGravity(input, 0)).toEqual({
  16:       timeS: 0, heightM: 19.6, distanceM: 0, velocityMps: 0, landed: false,
  17:     });
  18:     expect(sampleGravity(input, 1).heightM).toBeCloseTo(14.7, 10);
  19:     expect(sampleGravity(input, 1)).toMatchObject({ distanceM: 4.9, velocityMps: 9.8, landed: false });
  20:   });
  21: 
  22:   it('has equal snapshots and fall times for different masses', () => {
  23:     const light = { ...input, massKg: 0.1 };
  24:     const heavy = { ...input, massKg: 10 };
  25:     expect(fallTimeS(light)).toBe(fallTimeS(heavy));
  26:     for (const time of [0, 0.5, 1, 2, 100]) {
  27:       expect(sampleGravity(light, time)).toEqual(sampleGravity(heavy, time));
  28:     }
  29:   });
  30: 
  31:   it('freezes the impact snapshot after landing', () => {
  32:     expect(sampleGravity(input, 100)).toEqual(sampleGravity(input, 2));
  33:   });
  34: 
  35:   it.each([2, 7, 20])('preserves distance and height bounds from %s m', (heightM) => {
  36:     const x = { ...input, heightM };
  37:     const duration = fallTimeS(x);
  38:     let previousDistance = 0;
  39:     for (const fraction of [0, 0.1, 0.5, 0.9, 1, 2]) {
  40:       const sample = sampleGravity(x, duration * fraction);
  41:       expect(sample.heightM + sample.distanceM).toBeCloseTo(heightM, 12);
  42:       expect(sample.heightM).toBeGreaterThanOrEqual(0);
  43:       expect(sample.distanceM).toBeLessThanOrEqual(heightM);
  44:       expect(sample.distanceM).toBeGreaterThanOrEqual(previousDistance);
  45:       expect(sample.landed).toBe(fraction >= 1);
  46:       previousDistance = sample.distanceM;
  47:     }
  48:   });
  49: });
  50: 
  51: describe('gravity input validation', () => {
  52:   it.each([[2, 0.1], [20, 10]])('accepts inclusive bounds %s m and %s kg', (heightM, massKg) => {
  53:     const x = { ...input, heightM, massKg };
  54:     expect(validateGravityInput(x)).toEqual(x);
  55:     expect(Number.isFinite(fallTimeS(x))).toBe(true);
  56:   });
  57: 
  58:   const invalidInputs = [
  59:     ...[1.999, 20.001, NaN, Infinity, -Infinity].map(heightM => ({ ...input, heightM })),
  60:     ...[0.099, 10.001, NaN, Infinity, -Infinity].map(massKg => ({ ...input, massKg })),
  61:     ...[0, 9.81, NaN, Infinity, -Infinity].map(gravityMps2 => ({ ...input, gravityMps2 })),
  62:   ];
  63:   it.each(invalidInputs)('rejects invalid parameters %# across all entry points', (x) => {
  64:     expect(() => validateGravityInput(x)).toThrow(RangeError);
  65:     expect(() => fallTimeS(x)).toThrow(RangeError);
  66:     expect(() => sampleGravity(x, 0)).toThrow(RangeError);
  67:   });
  68: 
  69:   it.each([-0.001, NaN, Infinity, -Infinity])('rejects invalid time %s', (time) => {
  70:     expect(() => sampleGravity(input, time)).toThrow(RangeError);
  71:   });
  72: 
  73:   it('does not mutate caller inputs', () => {
  74:     const frozen = Object.freeze({ ...input });
  75:     validateGravityInput(frozen);
  76:     fallTimeS(frozen);
  77:     sampleGravity(frozen, 1);
  78:     expect(frozen).toEqual(input);
  79:   });
  80: });

## vite.config.ts

   1: import { defineConfig } from 'vitest/config';
   2: import react from '@vitejs/plugin-react';
   3: 
   4: export default defineConfig({
   5:   plugins: [react()],
   6:   test: { environment: 'node', include: ['tests/**/*.test.ts'] },
   7: });
