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


