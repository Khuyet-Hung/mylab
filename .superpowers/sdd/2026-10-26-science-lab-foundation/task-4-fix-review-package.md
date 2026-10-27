# Task 4 scoped pointercancel fix

## src/experiments/gravity/scene.ts

   1: import { Application, Container, Graphics, Rectangle, Text } from 'pixi.js';
   2: import type { FederatedPointerEvent } from 'pixi.js';
   3: import type { GravitySnapshot } from './model';
   4: 
   5: export interface GravityScene {
   6:   update(left: GravitySnapshot, right: GravitySnapshot): void;
   7:   /** Moves the release-height guide; object positions always come from update(). */
   8:   setHeight(heightM: number): void;
   9:   destroy(): void;
  10: }
  11: 
  12: const WIDTH = 900;
  13: const HEIGHT = 520;
  14: const GROUND_Y = 444;
  15: const SPAN = 350;
  16: const INK = 0x242529;
  17: const PAPER = 0xf7f4ed;
  18: const toY = (heightM: number) => GROUND_Y - (heightM / 20) * SPAN;
  19: const clampHeight = (heightM: number) => Math.min(20, Math.max(2, heightM));
  20: 
  21: /** A view of the gravity model. No ticker, elapsed-time calculation, or integration. */
  22: export async function createGravityScene(
  23:   host: HTMLElement,
  24:   options: { onHeightChange(heightM: number): void },
  25: ): Promise<GravityScene> {
  26:   const app = new Application();
  27:   await app.init({
  28:     width: WIDTH, height: HEIGHT, background: PAPER, preference: 'webgl',
  29:     autoStart: false, sharedTicker: false, antialias: true,
  30:     resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true,
  31:   });
  32:   // Even rendering is explicit: the clock in clock.ts owns all simulation time.
  33:   app.stop();
  34:   const canvas = app.canvas;
  35:   canvas.style.display = 'block';
  36:   canvas.style.width = '100%';
  37:   canvas.style.height = 'auto';
  38:   canvas.style.touchAction = 'none';
  39:   canvas.setAttribute('aria-hidden', 'true');
  40:   host.appendChild(canvas);
  41:   const world = new Container();
  42:   app.stage.addChild(world);
  43:   const art = new Graphics();
  44:   world.addChild(art);
  45:   const label = (text: string, x: number, y: number, size = 13) => {
  46:     const item = new Text({ text, style: { fontFamily: 'monospace', fontSize: size, fontWeight: 'bold', fill: INK } });
  47:     item.position.set(x, y);
  48:     world.addChild(item);
  49:     return item;
  50:   };
  51:   // Offset silhouettes, solid ink outlines, and sparse paper-grid construction.
  52:   for (const x of [158, 502]) {
  53:     art.roundRect(x + 6, 53, 280, 411, 20).fill(INK);
  54:     art.roundRect(x, 47, 280, 411, 20).fill(x === 158 ? 0xffe9df : 0xe5ecff).stroke({ color: INK, width: 3 });
  55:     for (let y = 110; y < GROUND_Y; y += 35) {
  56:       art.moveTo(x + 15, y).lineTo(x + 265, y).stroke({ color: INK, alpha: 0.1, width: 1 });
  57:     }
  58:   }
  59:   label('OBJECT A', 180, 61);
  60:   label('OBJECT B', 524, 61);
  61:   label('HEIGHT / m', 23, 28);
  62:   for (let metres = 0; metres <= 20; metres += 2) {
  63:     const y = toY(metres);
  64:     art.moveTo(104, y).lineTo(metres % 10 === 0 ? 141 : 127, y).stroke({ color: INK, width: 2 });
  65:     label(String(metres).padStart(2, '0'), 65, y - 8);
  66:   }
  67:   art.moveTo(104, toY(20)).lineTo(104, GROUND_Y).stroke({ color: INK, width: 3 });
  68:   art.roundRect(147, GROUND_Y, 649, 22, 5).fill(0xffd64d).stroke({ color: INK, width: 3 });
  69:   for (let x = 158; x < 780; x += 26) {
  70:     art.moveTo(x, GROUND_Y + 20).lineTo(x + 14, GROUND_Y + 3).stroke({ color: INK, width: 2 });
  71:   }
  72:   label('GROUND / 0 m', 625, 482);
  73:   label('DRAG AN OBJECT TO SET RELEASE HEIGHT', 160, 482, 12);
  74: 
  75:   const guide = new Graphics();
  76:   world.addChild(guide);
  77:   const guideLabel = label('', 797, 0, 12);
  78:   const makeBall = (x: number, color: number, letter: string) => {
  79:     const ball = new Container();
  80:     ball.position.set(x, toY(10));
  81:     ball.addChild(new Graphics().circle(5, 5, 23).fill(INK));
  82:     ball.addChild(new Graphics().circle(0, 0, 23).fill(color).stroke({ color: INK, width: 3 }));
  83:     ball.addChild(new Graphics().circle(-7, -8, 5).fill({ color: 0xffffff, alpha: 0.65 }));
  84:     const text = new Text({ text: letter, style: { fontFamily: 'monospace', fontSize: 19, fontWeight: 'bold', fill: INK } });
  85:     text.anchor.set(0.5);
  86:     ball.addChild(text);
  87:     ball.eventMode = 'static';
  88:     ball.cursor = 'grab';
  89:     ball.hitArea = new Rectangle(-34, -34, 68, 68);
  90:     world.addChild(ball);
  91:     return ball;
  92:   };
  93:   const leftBall = makeBall(298, 0xff927a, 'A');
  94:   const rightBall = makeBall(642, 0x6f96ff, 'B');
  95:   let destroyed = false;
  96:   let pointerId: number | null = null;
  97:   const render = () => { if (!destroyed) app.renderer.render(app.stage); };
  98:   const setHeight = (heightM: number) => {
  99:     if (destroyed || !Number.isFinite(heightM)) return;
 100:     const height = clampHeight(heightM);
 101:     const y = toY(height);
 102:     guide.clear();
 103:     for (let x = 150; x < 791; x += 18) {
 104:       guide.moveTo(x, y).lineTo(x + 9, y).stroke({ color: INK, width: 2, alpha: 0.5 });
 105:     }
 106:     guideLabel.text = `${height.toFixed(1)} m`;
 107:     guideLabel.position.y = y - 8;
 108:     render();
 109:   };
 110:   const move = (event: FederatedPointerEvent) => {
 111:     if (pointerId !== event.pointerId || destroyed) return;
 112:     const y = world.toLocal(event.global).y;
 113:     const height = Math.round(clampHeight((GROUND_Y - y) / SPAN * 20) * 10) / 10;
 114:     options.onHeightChange(height);
 115:   };
 116:   const down = (event: FederatedPointerEvent) => {
 117:     if (pointerId !== null || event.button !== 0) return;
 118:     pointerId = event.pointerId;
 119:     leftBall.cursor = rightBall.cursor = 'grabbing';
 120:   };
 121:   const end = (event: Pick<PointerEvent, 'pointerId'>) => {
 122:     if (pointerId !== event.pointerId) return;
 123:     pointerId = null;
 124:     leftBall.cursor = rightBall.cursor = 'grab';
 125:   };
 126:   // Pixi 8 does not forward native cancellation through its event boundary.
 127:   // OS touch/pen interruption must release our drag lock as well.
 128:   canvas.addEventListener('pointercancel', end);
 129:   world.eventMode = 'static';
 130:   world.hitArea = new Rectangle(0, 0, WIDTH, HEIGHT);
 131:   for (const ball of [leftBall, rightBall]) {
 132:     ball.on('pointerdown', down);
 133:     ball.on('pointerupoutside', end);
 134:     ball.on('pointercancel', end);
 135:   }
 136:   world.on('globalpointermove', move);
 137:   world.on('pointerup', end);
 138:   world.on('pointerupoutside', end);
 139:   world.on('pointercancel', end);
 140:   const resize = () => {
 141:     if (destroyed) return;
 142:     const width = Math.max(1, host.clientWidth || WIDTH);
 143:     const height = width * HEIGHT / WIDTH;
 144:     app.renderer.resize(width, height);
 145:     world.scale.set(width / WIDTH);
 146:     render();
 147:   };
 148:   const observer = new ResizeObserver(resize);
 149:   observer.observe(host);
 150:   setHeight(10);
 151:   resize();
 152:   return {
 153:     update(left, right) {
 154:       if (destroyed) return;
 155:       leftBall.position.set(298, toY(left.heightM));
 156:       rightBall.position.set(642, toY(right.heightM));
 157:       render();
 158:     },
 159:     setHeight,
 160:     destroy() {
 161:       if (destroyed) return;
 162:       destroyed = true;
 163:       pointerId = null;
 164:       observer.disconnect();
 165:       canvas.removeEventListener('pointercancel', end);
 166:       world.removeAllListeners();
 167:       leftBall.removeAllListeners();
 168:       rightBall.removeAllListeners();
 169:       app.destroy(true, { children: true });
 170:     },
 171:   };
 172: }

## .superpowers/sdd/2026-10-26-science-lab-foundation/task-4-report.md

   1: # Task 4 report — PixiJS gravity workbench
   2: 
   3: Status: complete. No Git commands or subagents used, as instructed.
   4: 
   5: ## Delivered
   6: 
   7: - Added `src/experiments/gravity/scene.ts`, exposing the requested async `createGravityScene(host, { onHeightChange })` and `GravityScene` interface.
   8: - Installed `pixi.js` 8.22.0; updated package manifest and lockfile. The first npm command encountered PowerShell script policy; `npm.cmd` then encountered sandbox network EACCES. The required escalated retry succeeded, reporting zero vulnerabilities.
   9: - Original paper-background workbench artwork: two coral/blue tinted outlined lanes, hard offset shadows, distinct lettered balls, ruler marks from 0–20 metres, dashed release guide, yellow striped ground, and monospaced scene labels.
  10: - A stable 900×520 coordinate system scales to host width with a ResizeObserver and explicit renderer resize. SI-to-screen conversion stays inside the scene (`groundY - heightM / 20 * span`). Device-pixel ratio is capped at two.
  11: - Private Pixi ticker configured with `autoStart: false`, `sharedTicker: false`, then explicitly stopped. There is no animation frame request, elapsed-time accumulation, tween, or integration in this module. Only update, guide changes, and resize trigger rendering.
  12: - Mouse/touch/pen pointer handlers use pointer identity, a larger hit area, global move, up, outside-up, and cancellation handling. Height callbacks clamp to 2–20m and round to 0.1m. Only the canvas disables browser touch gestures.
  13: - Idempotent cleanup disconnects the resize observer, clears callbacks, destroys app/stage children, and removes canvas. Calls after destruction do nothing.
  14: 
  15: ## Integration contract for Task 5
  16: 
  17: `update(left, right)` is the only public method that positions objects; it uses supplied snapshots directly. `setHeight(heightM)` updates only the release guide, preserving this single-source-of-truth contract. After awaited creation, call setHeight(currentHeight) and update(currentLeft, currentRight) immediately. Initial placeholder height is 10m. The drag callback should update UI/model configuration and send fresh snapshots back through update. Essential native slider, numerical data, masses, and accessible description belong in DOM in Task 5. Canvas is aria-hidden to avoid duplicate/incomplete accessible content.
  18: 
  19: ## Verification
  20: 
  21: - `npm.cmd run build`: passed (TypeScript and Vite).
  22: - `npm.cmd test -- tests/gravity`: passed, 2 files / 35 model and clock tests.
  23: - Browser check in Chrome at the existing localhost:5173 dev server using a temporary isolated harness (removed after checking): scene initialized successfully with real WebGL and original artwork visible.
  24: - At 900px and 450px host widths: same layout and mapping, no clipping within scene. At 450px, a measured ball drag from height 20m down to y=180 produced 8.1m, consistent with scaled logical coordinates. Dragging below ground clamped at 2m; dragging above the lane clamped at 20m.
  25: - Harness remounted four times through destroy/create; DOM status consistently showed exactly one canvas. Pointer interaction still worked after repeated remounts.
  26: - Supplying zero-height landed snapshots moved both balls to the common ground line. Release guide remained at configured height as intended.
  27: - Browser captured no warning or error logs during focused scene checks.
  28: 
  29: ## Limits / follow-up
  30: 
  31: - Actual touch hardware was unavailable; mouse interaction exercises the shared pointer path, but real touch cancellation/gesture behavior should be included in Task 7 device testing.
  32: - Full route navigation, accessible native controls, React async-effect cancellation, and reduced-motion UI belong to Task 5/7. This scene has no autonomous motion and thus adds no separate reduced-motion loop.
  33: - Remount canvas count verified in browser; absence of an independent ticker is established by explicit initialization/stop configuration and no ticker listeners or time integration in source, rather than browser performance profiling.
  34: - Scene labels are English monospaced technical annotations; the surrounding app currently uses Vietnamese. Localize these strings if Task 5 establishes a consistent locale requirement.
  35: 
  36: ## Review fix — native pointer cancellation
  37: 
  38: The review identified that Pixi 8.22 does not forward native `pointercancel` through its event boundary. Retaining only federated Pixi cancellation callbacks could leave the active pointer lock set after OS touch/pen interruption. Added a native canvas `pointercancel` listener using the same matching-pointer cleanup callback and explicitly remove it before app destruction. Wrong-pointer cancellation leaves the active drag intact.
  39: 
  40: Added `tests/gravity/scene.test.ts`, a focused scene harness with a native EventTarget canvas and mocked renderer. It starts pointer 11, sends native cancellation for unrelated pointer 99, verifies pointer 11 still moves and keeps grabbing cursor, cancels pointer 11, verifies its subsequent move is ignored and grab cursor is restored, then starts pointer 22 and verifies height callbacks resume. It also verifies native listener removal and Pixi destruction arguments. This tests actual native event dispatch into the scene listener; it does not claim a real hardware OS cancellation.
  41: 
  42: Post-fix validation: `npm.cmd test -- tests/gravity` passes 3 files / 36 tests; `npm.cmd run build` passes. No Git or subagents used.
