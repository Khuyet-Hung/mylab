# Task 4 scoped files (no Git diff available)

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
 121:   const end = (event: FederatedPointerEvent) => {
 122:     if (pointerId !== event.pointerId) return;
 123:     pointerId = null;
 124:     leftBall.cursor = rightBall.cursor = 'grab';
 125:   };
 126:   world.eventMode = 'static';
 127:   world.hitArea = new Rectangle(0, 0, WIDTH, HEIGHT);
 128:   for (const ball of [leftBall, rightBall]) {
 129:     ball.on('pointerdown', down);
 130:     ball.on('pointerupoutside', end);
 131:     ball.on('pointercancel', end);
 132:   }
 133:   world.on('globalpointermove', move);
 134:   world.on('pointerup', end);
 135:   world.on('pointerupoutside', end);
 136:   world.on('pointercancel', end);
 137:   const resize = () => {
 138:     if (destroyed) return;
 139:     const width = Math.max(1, host.clientWidth || WIDTH);
 140:     const height = width * HEIGHT / WIDTH;
 141:     app.renderer.resize(width, height);
 142:     world.scale.set(width / WIDTH);
 143:     render();
 144:   };
 145:   const observer = new ResizeObserver(resize);
 146:   observer.observe(host);
 147:   setHeight(10);
 148:   resize();
 149:   return {
 150:     update(left, right) {
 151:       if (destroyed) return;
 152:       leftBall.position.set(298, toY(left.heightM));
 153:       rightBall.position.set(642, toY(right.heightM));
 154:       render();
 155:     },
 156:     setHeight,
 157:     destroy() {
 158:       if (destroyed) return;
 159:       destroyed = true;
 160:       pointerId = null;
 161:       observer.disconnect();
 162:       world.removeAllListeners();
 163:       leftBall.removeAllListeners();
 164:       rightBall.removeAllListeners();
 165:       app.destroy(true, { children: true });
 166:     },
 167:   };
 168: }

## package.json

   1: {
   2:     "name": "animationweb",
   3:     "version": "1.0.0",
   4:     "description": "",
   5:     "scripts": {
   6:         "test": "vitest run",
   7:         "dev": "vite",
   8:         "build": "tsc -b && vite build",
   9:         "preview": "vite preview",
  10:         "test:e2e": "playwright test"
  11:     },
  12:     "keywords": [],
  13:     "author": "",
  14:     "license": "ISC",
  15:     "type": "module",
  16:     "dependencies": {
  17:         "pixi.js": "^8.22.0",
  18:         "react": "^19.3.1",
  19:         "react-dom": "^19.3.1",
  20:         "react-router": "^8.5.0"
  21:     },
  22:     "devDependencies": {
  23:         "@types/react": "^19.3.0",
  24:         "@types/react-dom": "^19.3.0",
  25:         "@vitejs/plugin-react": "^6.1.2",
  26:         "typescript": "^7.0.2",
  27:         "vite": "^8.3.5",
  28:         "vitest": "^5.0.5"
  29:     },
  30:     "private": true
  31: }
