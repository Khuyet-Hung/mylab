# Science Lab Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, responsive 2D science-lab website with a reusable experiment boundary and one scientifically validated free-fall experiment.

**Architecture:** React owns navigation, controls, measurements, and explanations. A pure TypeScript gravity model produces all scientific values; one experiment clock supplies model time; PixiJS draws the workbench from model snapshots; GSAP animates only presentation and UI. Experiment metadata drives the catalogue, and each later experiment supplies its own model, scene, references, and validation.

**Tech Stack:** Vite, React, TypeScript, React Router (declarative mode), PixiJS, GSAP, Vitest, Playwright, CSS.

**Spec:** `docs/superpowers/specs/2026-10-26-interactive-science-lab-design.md`

**Tóm tắt:** Kế hoạch gồm 7 phần có thể kiểm chứng riêng: dựng website và đường dẫn; đặc tả và kiểm thử mô hình rơi tự do; đồng hồ thí nghiệm; bàn thí nghiệm PixiJS; điều khiển, số đo và đồ thị; hệ hình ảnh và chuyển động GSAP; kiểm thử hành trình và tài liệu vận hành. Không thêm backend hay engine vật lý tổng quát trong bản đầu.

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

## File map

| Path | Responsibility |
| --- | --- |
| `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` | App tooling and scripts |
| `src/main.tsx`, `src/App.tsx` | React root and routes |
| `src/styles/tokens.css`, `src/styles/global.css` | Design tokens, layout, responsive and reduced-motion rules |
| `src/catalog/experiments.ts`, `src/catalog/CatalogPage.tsx` | Catalogue metadata and field/topic navigation |
| `src/experiments/gravity/model.ts` | Input validation, analytical free-fall results, measurements |
| `src/experiments/gravity/clock.ts` | Play, pause, reset, elapsed model time |
| `src/experiments/gravity/scene.ts` | PixiJS workbench, pointer manipulation, resource cleanup |
| `src/experiments/gravity/GravityPage.tsx` | Connect model, clock, scene, controls, and explanation |
| `src/experiments/gravity/HeightGraph.tsx` | Accessible visual graph from model samples |
| `src/components/SiteShell.tsx` | Navigation and shared page structure |
| `tests/gravity/model.test.ts`, `tests/gravity/clock.test.ts` | Meaningful science and clock tests |
| `e2e/lab.spec.ts` | End-to-end visitor journey on desktop and touch viewport |
| `docs/experiments/gravity-free-fall.md` | Scientific assumptions, equations, bounds, reference cases |
| `docs/architecture.md`, `docs/design-system.md`, `docs/validation.md` | Long-lived implementation and review guidance |

No generic experiment framework is built before the first experiment demonstrates which interfaces actually repeat. Define only metadata and lifecycle contracts needed now.

### Task 1: Working website shell and navigable catalogue

**Files:** Create `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `src/main.tsx`, `src/App.tsx`, `src/components/SiteShell.tsx`, `src/catalog/experiments.ts`, `src/catalog/CatalogPage.tsx`, `src/styles/global.css`.

**Interfaces:** Produces `ExperimentCard { id, field, topic, title, question, href, status }`, `experiments: ExperimentCard[]`, and routes `/`, `/physics`, `/physics/gravity`, `/physics/gravity/free-fall`, `/chemistry`.

- [ ] **Step 1: Set up the repository and app dependencies.** From the workspace root, run `git init` if no Git repository exists. Create the Vite app files directly in the existing directory so `docs/` and `.agents/` remain intact. Run `npm init -y`, `npm install react react-dom react-router`, and `npm install -D vite typescript @vitejs/plugin-react @types/react @types/react-dom vitest`. Use these `package.json` scripts: `"dev": "vite"`, `"build": "tsc -b && vite build"`, `"preview": "vite preview"`, `"test": "vitest run"`, `"test:e2e": "playwright test"`. Set `index.html` to contain `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>`; `vite.config.ts` exports `defineConfig({ plugins: [react()] })`. Set TypeScript `strict: true`, `jsx: "react-jsx"`, and `noEmit: true` in the app configuration. Use the [Vite React TypeScript template](https://vite.dev/guide/) as the source for remaining minimal config fields.
- [ ] **Step 2: Create the route map and catalogue data.** Use declarative React Router per [official routing guide](https://reactrouter.com/start/declarative/routing). The initial data includes the free-fall experiment and a Chemistry preview, for example:

```ts
export type ExperimentCard = {
  id: string;
  field: 'physics' | 'chemistry';
  topic: string;
  title: string;
  question: string;
  href: string;
  status: 'available' | 'preview';
};

export const experiments: ExperimentCard[] = [{
  id: 'free-fall', field: 'physics', topic: 'Trọng lực',
  title: 'Hai vật rơi tự do', question: 'Vật nặng có rơi nhanh hơn không?',
  href: '/physics/gravity/free-fall', status: 'available',
}];
```

- [ ] **Step 3: Implement the pages.** `SiteShell` includes skip link, header, main landmark, and footer. `/` offers Physics and Chemistry; `/physics` lists Gravity; `/physics/gravity` links to the free-fall page; `/chemistry` explains that experiments are forthcoming with example topics, without dead cards. The experiment route displays `Hai vật rơi tự do` until Task 5 replaces it. Unknown routes show a useful return link. Route declaration:

```tsx
<BrowserRouter>
  <SiteShell><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/physics" element={<CatalogPage field="physics" />} />
    <Route path="/physics/gravity" element={<CatalogPage field="physics" topic="Trọng lực" />} />
    <Route path="/physics/gravity/free-fall" element={<h1>Hai vật rơi tự do</h1>} />
    <Route path="/chemistry" element={<CatalogPage field="chemistry" />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></SiteShell>
</BrowserRouter>
```
- [ ] **Step 4: Run `npm run build`; check `/`, `/physics`, `/physics/gravity`, and `/chemistry` in a browser.** Confirm keyboard navigation and direct URL loading with the intended host's SPA fallback. Commit `feat: create science lab shell` when Git is available.

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

### Task 4: PixiJS gravity workbench

**Files:** Create `src/experiments/gravity/scene.ts`; install `pixi.js`.

**Interfaces:** Produces `createGravityScene(host: HTMLElement, options: { onHeightChange(heightM: number): void }): Promise<GravityScene>` and `GravityScene { update(left: GravitySnapshot, right: GravitySnapshot): void; setHeight(heightM: number): void; destroy(): void }`.

- [ ] **Step 1: Create a minimal PixiJS application with its canvas inside `host`.** Use async initialization with `autoStart: false`; the app's ticker must not run an independent simulation loop. Render on snapshot updates. Use a stable logical coordinate system and resize mapping. See the [PixiJS Application guide](https://pixijs.com/8.x/guides/components/application). Draw two parallel falling lanes, a clear ground line, ruler marks, and distinct object colors. Label the object masses in accessible DOM outside canvas (Task 5), rather than relying on canvas text alone.

```ts
const app = new Application();
await app.init({ width: 900, height: 520, background: '#f7f4ed',
  preference: 'webgl', autoStart: false, antialias: true });
host.appendChild(app.canvas);
const leftBall = new Graphics().circle(0, 0, 22).fill('#ff927a');
const rightBall = new Graphics().circle(0, 0, 22).fill('#4f78e8');
app.stage.addChild(leftBall, rightBall);
```
- [ ] **Step 2: Map model height to screen y.** Keep this conversion inside `scene.ts`; for usable vertical span `S`, use `y = groundY - (heightM / 20) * S`. The `update` method positions both objects solely from supplied snapshots; it performs no motion integration:

```ts
const toY = (heightM: number) => groundY - (heightM / 20) * usableHeight;
function update(left: GravitySnapshot, right: GravitySnapshot) {
  leftBall.position.set(leftLaneX, toY(left.heightM));
  rightBall.position.set(rightLaneX, toY(right.heightM));
  app.renderer.render(app.stage);
}
```
- [ ] **Step 3: Add direct height manipulation.** Use Pixi pointer events (`pointerdown`, `globalpointermove`, `pointerup`, `pointerupoutside`, `pointercancel`) as documented in the [interaction guide](https://pixijs.com/8.x/guides/components/events). Constrain drag to the allowed `2–20 m` height range, call `onHeightChange`, and use `touch-action: none` on the canvas only. Do not make drag the only way to change height; Task 5 provides a native slider.
- [ ] **Step 4: Destroy the Pixi app, event handlers, graphics, and canvas when leaving the page.** Remove the resize observer and pointer callbacks, then call `app.destroy(true, { children: true })`. Verify by navigating in and out repeatedly, checking that only one canvas and no independent Pixi ticker remain. Run `npm run build` and manually inspect mouse/touch dragging. Commit `feat: render interactive gravity workbench`.

### Task 5: Complete the experiment page and shared snapshot flow

**Files:** Create `src/experiments/gravity/GravityPage.tsx`, `src/experiments/gravity/HeightGraph.tsx`; modify `src/App.tsx` to render the page.

**Interfaces:** Consumes `sampleGravity`, `createLabClock`, and `createGravityScene`. Produces visitor controls and measurements; `HeightGraph` receives `{ input: GravityInput; currentTimeS: number }`.

- [ ] **Step 1: Define one input state and one snapshot function.** Default: height `12 m`, masses `1 kg` and `5 kg`, gravity `9.8 m/s²`. `snapshotAt(timeS)` evaluates `sampleGravity` for both masses, passes both snapshots to the scene, and publishes a display snapshot no more than every 100 ms (always publish at start and landing). Do not store model positions in React state every frame. The callback pauses the clock at landing. Keep mutable `inputsRef`, `sceneRef`, and `clockRef` so callbacks do not capture stale values.

```ts
const snapshotAt = (timeS: number) => {
  const { heightM, leftMassKg, rightMassKg } = inputsRef.current;
  const base = { heightM, gravityMps2: 9.8 };
  const left = sampleGravity({ ...base, massKg: leftMassKg }, timeS);
  const right = sampleGravity({ ...base, massKg: rightMassKg }, timeS);
  sceneRef.current?.update(left, right);
  if (timeS === 0 || left.landed || timeS - lastPublishedRef.current >= 0.1) {
    setDisplay({ left, right }); lastPublishedRef.current = timeS;
  }
  if (left.landed) clockRef.current?.pause();
};
```
- [ ] **Step 2: Build labeled native controls for height and both masses, plus play, pause, and reset buttons.** When inputs change, reset the clock and update the scene from time zero. Show units beside every numeric value. A keyboard user must be able to run the full experiment without dragging the canvas. Use native ranges such as:

```tsx
<label htmlFor="release-height">Độ cao thả: {heightM.toFixed(1)} m</label>
<input id="release-height" type="range" min="2" max="20" step="0.1"
  value={heightM} onChange={event => setHeightM(Number(event.target.value))} />
<button type="button" onClick={() => clockRef.current?.play()}>Bắt đầu</button>
<button type="button" onClick={() => clockRef.current?.pause()}>Tạm dừng</button>
<button type="button" onClick={() => clockRef.current?.reset()}>Đặt lại</button>
```
- [ ] **Step 3: Build `HeightGraph` as a small SVG chart.** Sample `sampleGravity(input, t)` at 40 equal time intervals from `0` to `fallTimeS(input)`; draw a height-versus-time curve and current-time marker. Provide a textual summary (`aria-describedby` or adjacent text) because a canvas or SVG graph alone is insufficient. Both masses share the same curve under the stated assumptions; state this plainly instead of hiding the overlap. Use a deterministic point generator:

```ts
const duration = fallTimeS(input);
const points = Array.from({ length: 41 }, (_, i) => {
  const t = (i / 40) * duration;
  const s = sampleGravity(input, t);
  return `${(i / 40) * 320},${160 - (s.heightM / input.heightM) * 160}`;
}).join(' ');
```
- [ ] **Step 4: Add plain-language explanation and assumptions.** Explain why mass does not change the fall time in this model, show `g = 9.8 m/s²`, and link the scientific reference. Keep formulas behind an expandable “Xem công thức” section.
- [ ] **Step 5: Verify the scene, numbers, and graph at `t = 0`, mid-flight, and landing all agree with `sampleGravity`.** Check play/pause/reset, slider and drag sync, repeated entry/exit, mobile viewport, and `npm run build`. Commit `feat: complete gravity experiment`.

### Task 6: Visual system and meaningful motion

**Files:** Create `src/styles/tokens.css`, `docs/design-system.md`; modify `src/styles/global.css`, page components; install `gsap`.

**Interfaces:** CSS tokens govern color, type, spacing, focus, and motion; GSAP timelines animate only route/section presentation, hints, and result feedback.

- [ ] **Step 1: Record the visual thesis.** Follow the screenshot's editorial data aesthetic with original lab composition: paper `#F4F2EC`, ink `#1E1E1B`, yellow `#FFD83D`, coral `#FF927A`, blue `#4F78E8` as initial values. Use 2–3 px borders, 4–6 px hard offset shadows, bold large sans-serif numbers, and compact monospaced supporting labels. Tune tokens for contrast and document their semantic roles in `docs/design-system.md`.
- [ ] **Step 2: Style catalogue cards, breadcrumb, pill controls, measurement tiles, workbench frame, graph, and explanation for desktop and mobile.** Ensure the workbench remains dominant and controls are large enough for touch. Make the graph line thick and high contrast, with measurement milestones. Use the same visual language in the Chemistry preview. Keep the screenshot's visual grammar while creating original lab-specific layouts and copy.
- [ ] **Step 3: Add a few authored GSAP sequences.** Animate landing-page introduction, transition into the experiment, and a short highlight on the equal landing times. Keep physical object positions entirely controlled by the model. Use `gsap.context()` with cleanup and `gsap.matchMedia()` for reduced motion. A page introduction can use:

```ts
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const ctx = gsap.context(() => {
    gsap.from('.intro-item', { y: 16, opacity: 0, stagger: 0.08,
      duration: 0.45, ease: 'power2.out' });
  }, rootRef);
  return () => ctx.revert();
});
return () => mm.revert();
```

Refer to [GSAP core](https://gsap.com/docs/v3/GSAP/) and the project GSAP skills.
- [ ] **Step 4: Verify keyboard focus, text contrast, reduced-motion mode, and pointer responsiveness in a browser.** Remove motion that delays controls or obscures scientific results. Commit `feat: apply science studio design system`.

### Task 7: Browser journey and scientific validation gate

**Files:** Create `e2e/lab.spec.ts`, `playwright.config.ts`, `docs/validation.md`, `docs/architecture.md`; add `@playwright/test` to development dependencies in `package.json`.

**Interfaces:** The validation guide becomes the release gate for later experiments. Architecture documentation records clock ownership, module boundaries, lifecycle cleanup, and a template for new experiment contracts.

- [ ] **Step 1: Install Playwright and its browser binaries.** Configure a Vite web server and desktop Chromium project plus a touch-sized viewport. Add one end-to-end test of the real user journey:

```ts
import { test, expect } from '@playwright/test';
test('visitor runs the free-fall experiment', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /vật lý/i }).click();
  await page.getByRole('link', { name: /trọng lực/i }).click();
  await page.getByRole('link', { name: /hai vật rơi tự do/i }).click();
  await expect(page.getByRole('heading', { name: /vật nặng có rơi nhanh hơn/i })).toBeVisible();
  await page.getByRole('button', { name: /bắt đầu/i }).click();
  await expect.poll(async () => Number(await page.getByTestId('elapsed-seconds').textContent()))
    .toBeGreaterThan(0);
});
```

- [ ] **Step 2: Add a responsive/touch check for slider operation and workbench layout.** Set a `390×844` touch viewport, focus `getByRole('slider', { name: /độ cao thả/i })`, press `End`, assert the visible height label becomes `20.0 m`, and assert `document.documentElement.scrollWidth <= window.innerWidth`. Test a touch drag on the workbench separately. Use accessible names rather than CSS classes.
- [ ] **Step 3: Write `docs/architecture.md`.** Include a data-flow diagram (`input → model → snapshot → scene + measurements + graph`), one clock owner, units, scene cleanup, and the metadata contract. Write `docs/validation.md` with the 19.6 m/2 s reference, mass-invariance, boundary and pause/reset checks, accessibility review, and representative device profiling method. See the design specification for scope.
- [ ] **Step 4: Run `npm test`, `npm run build`, and `npm run test:e2e`; inspect the final site on desktop and mobile.** Record observed frame pacing and input delay on a representative desktop and mid-range phone, then set concrete budgets based on those measurements. Fix failures before release. Commit `test: validate first lab journey and architecture`.

## Self-review checklist before execution

- Spec coverage: catalogue path, Chemistry preview, reusable boundaries, gravity model, Pixi scene, GSAP motion, visual language, mobile and keyboard use, documentation, and validation each have a task.
- Scientific correctness: mass-independent fall time under the stated assumptions is a model test and visible explanation; scene and graph consume model output.
- Avoid premature scope: no account system, backend, arbitrary chemical mixing, general physics engine, or second experiment.
- Important execution risk: `git init` and dependency download may require workspace or network approval; use the environment's normal escalation flow if blocked.
