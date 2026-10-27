import { Application, Container, Graphics, Rectangle, Text } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import type { GravitySnapshot } from "./model";

export interface GravityScene {
  update(left: GravitySnapshot, right: GravitySnapshot): void;
  /** Moves the release-height guide; object positions always come from update(). */
  setHeight(heightM: number): void;
  destroy(): void;
}

const WIDTH = 900;
const HEIGHT = 520;
const GROUND_Y = 444;
const SPAN = 350;
const INK = 0x1e1e1b;
const PAPER = 0xf4f2ec;
const toY = (heightM: number) => GROUND_Y - (heightM / 20) * SPAN;
const clampHeight = (heightM: number) => Math.min(20, Math.max(2, heightM));

/** A view of the gravity model. No ticker, elapsed-time calculation, or integration. */
export async function createGravityScene(
  host: HTMLElement,
  options: { onHeightChange(heightM: number): void },
): Promise<GravityScene> {
  const app = new Application();
  await app.init({
    width: WIDTH,
    height: HEIGHT,
    background: PAPER,
    preference: "webgl",
    autoStart: false,
    sharedTicker: false,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });
  // Even rendering is explicit: the clock in clock.ts owns all simulation time.
  app.stop();
  const canvas = app.canvas;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.touchAction = "none";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const world = new Container();
  app.stage.addChild(world);
  const art = new Graphics();
  world.addChild(art);
  const labels: Text[] = [];
  const label = (text: string, x: number, y: number, size = 13) => {
    const item = new Text({
      text,
      style: {
        fontFamily: "monospace",
        fontSize: size,
        fontWeight: "bold",
        fill: INK,
      },
    });
    item.position.set(x, y);
    world.addChild(item);
    labels.push(item);
    return item;
  };
  // Offset silhouettes, solid ink outlines, and sparse paper-grid construction.
  for (const x of [158, 502]) {
    art.roundRect(x + 6, 53, 280, 411, 20).fill(INK);
    art
      .roundRect(x, 47, 280, 411, 20)
      .fill(x === 158 ? 0xffe9df : 0xe5ecff)
      .stroke({ color: INK, width: 3 });
    for (let y = 110; y < GROUND_Y; y += 35) {
      art
        .moveTo(x + 15, y)
        .lineTo(x + 265, y)
        .stroke({ color: INK, alpha: 0.1, width: 1 });
    }
  }
  label("VẬT A", 180, 61);
  label("VẬT B", 524, 61);
  label("ĐỘ CAO / m", 23, 28);
  for (let metres = 0; metres <= 20; metres += 2) {
    const y = toY(metres);
    art
      .moveTo(104, y)
      .lineTo(metres % 10 === 0 ? 141 : 127, y)
      .stroke({ color: INK, width: 2 });
    label(String(metres).padStart(2, "0"), 65, y - 8);
  }
  art
    .moveTo(104, toY(20))
    .lineTo(104, GROUND_Y)
    .stroke({ color: INK, width: 3 });
  art
    .roundRect(147, GROUND_Y, 649, 22, 5)
    .fill(0xffd83d)
    .stroke({ color: INK, width: 3 });
  for (let x = 158; x < 780; x += 26) {
    art
      .moveTo(x, GROUND_Y + 20)
      .lineTo(x + 14, GROUND_Y + 3)
      .stroke({ color: INK, width: 2 });
  }
  label("MẶT ĐẤT / 0 m", 625, 482);
  label("KÉO VẬT ĐỂ ĐỔI ĐỘ CAO", 160, 482, 12);

  const guide = new Graphics();
  world.addChild(guide);
  const guideLabel = label("", 797, 0, 12);
  const makeBall = (x: number, color: number, letter: string) => {
    const ball = new Container();
    ball.position.set(x, toY(10));
    ball.addChild(new Graphics().circle(5, 5, 23).fill(INK));
    ball.addChild(
      new Graphics()
        .circle(0, 0, 23)
        .fill(color)
        .stroke({ color: INK, width: 3 }),
    );
    ball.addChild(
      new Graphics().circle(-7, -8, 5).fill({ color: 0xffffff, alpha: 0.65 }),
    );
    const text = new Text({
      text: letter,
      style: {
        fontFamily: "monospace",
        fontSize: 19,
        fontWeight: "bold",
        fill: INK,
      },
    });
    text.anchor.set(0.5);
    ball.addChild(text);
    labels.push(text);
    ball.eventMode = "static";
    ball.cursor = "grab";
    ball.hitArea = new Rectangle(-34, -34, 68, 68);
    world.addChild(ball);
    return ball;
  };
  const leftBall = makeBall(298, 0xff927a, "A");
  const rightBall = makeBall(642, 0x6f96ff, "B");
  let destroyed = false;
  let pointerId: number | null = null;
  const render = () => {
    if (!destroyed) app.renderer.render(app.stage);
  };
  const setHeight = (heightM: number) => {
    if (destroyed || !Number.isFinite(heightM)) return;
    const height = clampHeight(heightM);
    const y = toY(height);
    guide.clear();
    for (let x = 150; x < 791; x += 18) {
      guide
        .moveTo(x, y)
        .lineTo(x + 9, y)
        .stroke({ color: INK, width: 2, alpha: 0.5 });
    }
    guideLabel.text = `${height.toFixed(1)} m`;
    guideLabel.position.y = y - 8;
    render();
  };
  const move = (event: FederatedPointerEvent) => {
    if (pointerId !== event.pointerId || destroyed) return;
    const y = world.toLocal(event.global).y;
    const height =
      Math.round(clampHeight(((GROUND_Y - y) / SPAN) * 20) * 10) / 10;
    options.onHeightChange(height);
  };
  const down = (event: FederatedPointerEvent) => {
    if (pointerId !== null || event.button !== 0) return;
    pointerId = event.pointerId;
    leftBall.cursor = rightBall.cursor = "grabbing";
  };
  const end = (event: Pick<PointerEvent, "pointerId">) => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    leftBall.cursor = rightBall.cursor = "grab";
  };
  // Pixi 8 does not forward native cancellation through its event boundary.
  // OS touch/pen interruption must release our drag lock as well.
  canvas.addEventListener("pointercancel", end);
  world.eventMode = "static";
  world.hitArea = new Rectangle(0, 0, WIDTH, HEIGHT);
  for (const ball of [leftBall, rightBall]) {
    ball.on("pointerdown", down);
    ball.on("pointerupoutside", end);
    ball.on("pointercancel", end);
  }
  world.on("globalpointermove", move);
  world.on("pointerup", end);
  world.on("pointerupoutside", end);
  world.on("pointercancel", end);
  const resize = () => {
    if (destroyed) return;
    const width = Math.max(1, host.clientWidth || WIDTH);
    const height = (width * HEIGHT) / WIDTH;
    app.renderer.resize(width, height);
    world.scale.set(width / WIDTH);
    const textResolution = Math.min(
      4,
      Math.max(1, (width / WIDTH) * app.renderer.resolution),
    );
    for (const item of labels) item.resolution = textResolution;
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  setHeight(10);
  resize();
  return {
    update(left, right) {
      if (destroyed) return;
      leftBall.position.set(298, toY(left.heightM));
      rightBall.position.set(642, toY(right.heightM));
      render();
    },
    setHeight,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      pointerId = null;
      observer.disconnect();
      canvas.removeEventListener("pointercancel", end);
      world.removeAllListeners();
      leftBall.removeAllListeners();
      rightBall.removeAllListeners();
      app.destroy(true, { children: true });
    },
  };
}
