# Task 2 report: scientific specification and analytical gravity model

Status: complete. No Git commands or subagents were used, as required by the task handoff.

## Delivered files

- `docs/experiments/gravity-free-fall.md`: plain-language explanation, equal-height simultaneous release, fixed 9.8 m/s² gravity, rest initial condition, inclusive SI input limits, downward-positive equations, mass independence, sampling contract, rendering separation, and excluded phenomena. Cites OpenStax College Physics 2e section 2.7; the source was opened and checked during implementation.
- `src/experiments/gravity/model.ts`: exported `GravityInput`, `GravitySnapshot`, `validateGravityInput`, `fallTimeS`, and `sampleGravity`; deterministic analytical samples with no rendering or animation dependencies.
- `tests/gravity/model.test.ts`: 29 cases covering reference values, initial rest, mass independence, impact freezing, conservation of height plus fallen distance, monotonic distance, inclusive valid bounds, invalid bounds/non-finite inputs across entry points, invalid times, and input immutability.
- `vite.config.ts`: switches `defineConfig` to `vitest/config` and enables Node-environment discovery of `tests/**/*.test.ts` while retaining the React plugin.

## RED evidence

Specification and tests were written before creating the model module.

1. `npm test -- tests/gravity/model.test.ts` could not start because this PowerShell session blocks `npm.ps1` under its execution policy.
2. Retried with the equivalent Windows command shim: `npm.cmd test -- tests/gravity/model.test.ts`.
3. Expected failure, exit code 1: one failed suite, with `Cannot find module '../../src/experiments/gravity/model' imported from .../tests/gravity/model.test.ts`. No tests collected because the model did not yet exist. Vitest completed in 305 ms.

This established the missing implementation before the model file was created; the PowerShell policy failure is not counted as the RED result.

## GREEN evidence

After implementing the analytical model:

- `npm.cmd test -- tests/gravity/model.test.ts`: exit 0; 1 file passed, 29 tests passed; 272 ms.
- `npm.cmd test`: exit 0; 1 file passed, 29 tests passed; 220 ms.
- `npm.cmd run build`: exit 0; `tsc -b` and Vite production build passed; 95 modules transformed. Vite build completed in 385 ms.

No dependencies were installed or changed. The visual-reference interruption occurred after all three successful validation commands; the existing implementation was preserved and inspected on resume.

## Self-review

- Inputs validate heights 2–20 m and masses 0.1–10 kg inclusively, reject all non-finite values, and accept only gravity 9.8 m/s². Sampling rejects negative/non-finite time.
- Mass is validated but does not influence the formulas. The tests compare full snapshots for minimum and maximum masses at release, in flight, at impact, and after impact.
- Samples derive directly from elapsed time, so frame frequency and playback history do not affect the result. Caller input is never mutated.
- Ground samples clamp elapsed time to the analytical duration and retain impact speed as specified. Documentation explicitly distinguishes impact speed from post-collision motion.
- Small improvement over the supplied illustrative formula: when landed, distance is assigned the exact release height. This prevents floating-point residue at the analytically computed contact time for arbitrary valid heights; height is exactly zero.
- The scientific specification explains results before formulas, defines downward signs, and keeps metre-to-pixel conversion outside the model.
- The supplied brief fully specifies the implementation; no additional design choices or review agents were necessary.

## Concerns and limitations

- No unresolved scientific or implementation concerns within Task 2 scope.
- `npm.cmd` is required in this PowerShell environment unless its script execution policy is separately configured; no policy changes were made.
- No commit was created because the task handoff explicitly prohibits Git commands. Working files remain available to the parent workflow.
- This task defines a single-object primitive. The later UI must supply shared release height and time to both object samples and use each snapshot for both numerical and visual output.
- Drag, collision response, and post-impact dynamics are intentionally outside this analytical model and documented as exclusions.
