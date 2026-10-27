## Global Constraints

- Audience: curious visitors of any age; explain results in plain language before formulas.
- 2D only. Chemistry appears as a clearly labeled preview in this release; no empty Chemistry experiment route.
- First experiment: compare two falling objects under uniform gravity, with air resistance neglected.
- Model values use SI units; rendering uses a separately defined metres-to-pixels mapping.
- PixiJS scene and numerical UI read the same model snapshot; GSAP does not mutate scientific state.
- Mouse, touch, and keyboard must operate essential controls; respect reduced-motion preferences.
- No backend, accounts, or general-purpose physics/chemistry engine in this release.
- Current workspace has no Git repository. Initialize Git at execution time if permitted; commit each completed task. If Git initialization is unavailable, preserve the working files and record the limitation.


---
### Task 2: Scientific specification and analytical gravity model

**Files:** Create `docs/experiments/gravity-free-fall.md`, `src/experiments/gravity/model.ts`, `tests/gravity/model.test.ts`; modify `vite.config.ts` to enable Vitest.

**Interfaces:** Produces `GravityInput`, `GravitySnapshot`, `validateGravityInput(input): GravityInput`, `fallTimeS(input): number`, and `sampleGravity(input, timeS): GravitySnapshot`.

- [ ] **Step 1: Write the experiment specification.** State `g = 9.8 m/s²`, initial velocity `0 m/s`, uniform gravitational field, no air resistance, height input `2–20 m`, mass inputs `0.1–10 kg`, and two equal release heights. Use `v = gt`, `distance = ½gt²`, `fallTime = sqrt(2h/g)` with downward-positive measurement. Cite [OpenStax falling objects](https://openstax.org/books/college-physics-2e/pages/2-7-falling-objects). Explain that mass has no effect under these assumptions and list excluded phenomena.
- [ ] **Step 2: Write failing model tests.** Include reference values and invariants rather than tests that mirror the implementation:

```ts
import { describe, expect, it } from 'vitest';
import { fallTimeS, sampleGravity } from '../../src/experiments/gravity/model';

const input = { heightM: 19.6, massKg: 1, gravityMps2: 9.8 };
describe('free fall without air resistance', () => {
  it('reaches the ground after two seconds from 19.6 m', () => {
    expect(fallTimeS(input)).toBeCloseTo(2, 10);
    expect(sampleGravity(input, 2).heightM).toBe(0);
  });
  it('has equal results for different masses', () => {
    expect(sampleGravity({ ...input, massKg: 10 }, 1))
      .toMatchObject({ heightM: sampleGravity(input, 1).heightM,
                       velocityMps: sampleGravity(input, 1).velocityMps });
  });
  it('clamps to the ground after landing', () => {
    expect(sampleGravity(input, 100)).toMatchObject({ heightM: 0, landed: true });
  });
});
```

- [ ] **Step 3: Run `npm test -- tests/gravity/model.test.ts` and confirm the new tests fail.** Then implement the functions using the formulas below, with explicit rejection of non-finite and out-of-range inputs:

```ts
export type GravityInput = { heightM: number; massKg: number; gravityMps2: number };
export type GravitySnapshot = {
  timeS: number; heightM: number; distanceM: number;
  velocityMps: number; landed: boolean;
};
export function validateGravityInput(x: GravityInput): GravityInput {
  if (!Number.isFinite(x.heightM) || x.heightM < 2 || x.heightM > 20 ||
      !Number.isFinite(x.massKg) || x.massKg < 0.1 || x.massKg > 10 ||
      x.gravityMps2 !== 9.8) throw new RangeError('Invalid gravity input');
  return x;
}
export function fallTimeS(x: GravityInput): number {
  validateGravityInput(x);
  return Math.sqrt((2 * x.heightM) / x.gravityMps2);
}
export function sampleGravity(x: GravityInput, timeS: number): GravitySnapshot {
  if (!Number.isFinite(timeS) || timeS < 0) throw new RangeError('Invalid time');
  const duration = fallTimeS(x);
  const t = Math.min(timeS, duration);
  const distanceM = 0.5 * x.gravityMps2 * t * t;
  return { timeS: t, heightM: Math.max(0, x.heightM - distanceM),
    distanceM: Math.min(x.heightM, distanceM),
    velocityMps: x.gravityMps2 * t, landed: t >= duration };
}
```

- [ ] **Step 4: Run model tests and TypeScript build.** Add boundary checks for input ranges and `timeS`, then confirm `npm test` and `npm run build` pass. Commit `feat: validate analytical gravity model`.


