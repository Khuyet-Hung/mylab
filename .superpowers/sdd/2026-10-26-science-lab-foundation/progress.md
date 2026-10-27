# SDD ledger — plan: docs/superpowers/plans/2026-10-26-science-lab-foundation.md

Workspace: D:/Projects/MyProjects/animationweb
Spec: docs/superpowers/specs/2026-10-26-interactive-science-lab-design.md
Git: unavailable in this sandbox after `git init` caused an ownership mismatch and blocked ordinary commands. The empty repository was removed. Use file snapshots and scoped reviews; do not retry Git initialization during this plan.

## Preflight scan

| Tasks/interface | What one produces and the other consumes | Result |
| --- | --- | --- |
| 1 ↔ 2, `vite.config.ts` | Task 1 establishes Vite; Task 2 adds Vitest configuration | Compatible; Vitest dependency is installed in Task 1. |
| 1 ↔ 5, `src/App.tsx` | Task 1 provides experiment route; Task 5 replaces interim heading | Compatible. |
| 1 ↔ 6, `src/styles/global.css` | Task 1 provides base styles; Task 6 applies visual system | Compatible. |
| 1 ↔ 7, `package.json` | Task 1 defines e2e script; Task 7 installs its dependency | Compatible; do not run e2e before Task 7. |
| 2 ↔ 4/5/7, `GravitySnapshot` | Model output feeds Pixi scene, measurements, graph, and science checks | Compatible; SI units remain in model. |
| 3 ↔ 5, `LabClock` | Clock publishes elapsed model time; Task 5 samples the model | Compatible; prevent RAF requeue after pause in callback. |
| 4 ↔ 5/6, `GravityScene` | Scene returns update/height/destroy and emits height changes | Compatible; Task 5 owns native slider, Task 6 styles it. |
| 5 ↔ 7, elapsed readout | Task 7 tests `data-testid="elapsed-seconds"`; Task 5 must produce it | Ruling: add the attribute to the numeric elapsed-time output so the browser test can observe real progression. |
| Task 1 internal | Shell, catalogue, and routes are one testable navigation deliverable | Compatible. Git initialization instruction is superseded by sandbox failure. |
| Task 2 internal | Tests, documented assumptions, and analytical equations align | Compatible. |
| Task 3 internal | Fake RAF checks the clock's play/pause/reset/dispose behavior | Compatible. |
| Task 4 internal | Pixi renderer reads snapshots; no independent simulation ticker | Compatible. |
| Task 5 internal | Scene, graph, and DOM measurements share `sampleGravity` output | Compatible. |
| Task 6 internal | GSAP affects only UI; model positions remain untouched | Compatible. |
| Task 7 internal | E2E and documentation verify the whole user journey | Compatible. |

Ruling: Work in the existing workspace without Git commits or a linked worktree — the workspace contains no previous application code, and the sandbox Git ownership mismatch blocks ordinary command execution. Cost if wrong: no commit-level rollback; preserve task snapshots and reports under this plan workspace.
Ruling: The user's supplied Model Pulse screenshot updates the visual direction for Tasks 4–7: paper background, dark borders and offset shadows, yellow/coral/blue accents, bold figures, monospaced labels, and high-contrast graphs. The scientific model remains unchanged. Cost if wrong: visual rework; no scientific behavior changes.

## Task status

Task 1: complete — production build and browser routes passed; task review spec PASS, quality PASS with one minor formatting note. Report: `task-1-report.md`; package: `task-1-review-package.md`.
Ruling: defer compressed JSX/CSS formatting to Tasks 5 and 6, which edit those files anyway. Cost if wrong: temporarily less readable source; no behavior risk identified by reviewer.
Task 2: complete — 29 model tests and build passed; task review spec PASS, quality PASS without findings. Report: `task-2-report.md`; package: `task-2-review-package.md`.
Task 3: complete — 6 clock tests, 35 full tests, and build passed. Initial review passed with minor gaps; fix round 1 added running-clock suspension coverage and corrected report; scoped re-review confirmed both addressed. Manual background-tab check deferred to final browser QA.
Task 4: complete — Pixi scene passed build and 36 tests plus browser resize/drag/lifecycle checks. Review found native pointercancel gap; fix round 1 added canvas listener and focused cancellation test; scoped re-review confirmed resolved. Physical touch hardware remains unverified for final QA.
Task 5: complete — experiment controls, shared snapshots, graph, explanation, and async cleanup passed build and 36 tests; browser play/pause/reset, drag, keyboard, landing, remount, and mobile layout checked. Task review spec PASS, quality PASS. Real touch remains a Task 7 validation item.
Task 6: complete — screenshot-inspired original visual system, responsive layout, Vietnamese annotations, GSAP motion, and reduced branch passed build and 36 tests; desktop/mobile screenshots inspected. Task review spec PASS, quality PASS. Live skip-link state, OS reduced-motion emulation, and touch-emulated drag remain Task 7 checks.
Task 7: pending
