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


