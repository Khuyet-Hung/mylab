import { Application, Container, Graphics, Text } from "pixi.js";
import type { PendulumState } from "./model";

export type PendulumScene = {
  update(
    left: PendulumState,
    right: PendulumState,
    inputs: { leftLengthM: number; rightLengthM: number },
  ): void;
  destroy(): void;
};

const INK = 0x1e1e1b;
const PAPER = 0xf4f2ec;
type Panel = { x: number; y: number; width: number; height: number; pivotX: number; pivotY: number; labelY: number };
type Layout = { width: number; height: number; lengthScale: number; panels: readonly [Panel, Panel]; footerY: number };

const DESKTOP: Layout = {
  width: 900,
  height: 520,
  lengthScale: 70,
  panels: [
    { x: 20, y: 22, width: 425, height: 445, pivotX: 232, pivotY: 105, labelY: 355 },
    { x: 455, y: 22, width: 425, height: 445, pivotX: 667, pivotY: 105, labelY: 355 },
  ],
  footerY: 480,
};

const MOBILE: Layout = {
  width: 440,
  height: 740,
  lengthScale: 55,
  panels: [
    { x: 10, y: 18, width: 420, height: 330, pivotX: 220, pivotY: 95, labelY: 305 },
    { x: 10, y: 364, width: 420, height: 330, pivotX: 220, pivotY: 441, labelY: 651 },
  ],
  footerY: 710,
};

/** Draws supplied model states without owning a clock or changing scientific values. */
export async function createPendulumScene(host: HTMLElement): Promise<PendulumScene> {
  const app = new Application();
  await app.init({
    width: DESKTOP.width,
    height: DESKTOP.height,
    background: PAPER,
    preference: "webgl",
    autoStart: false,
    sharedTicker: false,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });
  app.stop();
  const canvas = app.canvas;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const world = new Container();
  app.stage.addChild(world);
  const backdrop = new Graphics();
  world.addChild(backdrop);
  const inkText = (value: string, size = 15) => {
    const item = new Text({
      text: value,
      style: { fontFamily: "monospace", fontSize: size, fontWeight: "bold", fill: INK },
    });
    world.addChild(item);
    return item;
  };
  const titles = [inkText("CON LẮC A", 16), inkText("CON LẮC B", 16)] as const;
  const footer = inkText("CÙNG GÓC BAN ĐẦU  •  CHỈ ĐỔI ĐỘ DÀI DÂY", 13);
  const arms = [new Graphics(), new Graphics()] as const;
  for (const arm of arms) world.addChild(arm);
  const lengthLabels = [inkText("", 14), inkText("", 14)] as const;
  let layout = DESKTOP;
  let destroyed = false;
  let last: {
    left: PendulumState;
    right: PendulumState;
    inputs: { leftLengthM: number; rightLengthM: number };
  } | null = null;

  const render = () => {
    if (!destroyed) app.renderer.render(app.stage);
  };

  const drawBackdrop = () => {
    backdrop.clear();
    layout.panels.forEach((panel, index) => {
      backdrop.roundRect(panel.x + 5, panel.y + 5, panel.width, panel.height, 18).fill(INK);
      backdrop.roundRect(panel.x, panel.y, panel.width, panel.height, 18)
        .fill(index === 0 ? 0xffe4d9 : 0xe3ebff)
        .stroke({ color: INK, width: 3 });
      for (let y = panel.y + 45; y < panel.y + panel.height - 10; y += 35) {
        backdrop.moveTo(panel.x + 16, y).lineTo(panel.x + panel.width - 16, y)
          .stroke({ color: INK, alpha: 0.1, width: 1 });
      }
      titles[index].position.set(panel.x + 20, panel.y + 12);
      lengthLabels[index].position.set(panel.pivotX - 23, panel.labelY);
    });
    footer.position.set(layout.width === MOBILE.width ? 36 : 235, layout.footerY);
  };

  const drawPendulum = (index: 0 | 1, state: PendulumState, lengthM: number) => {
    const panel = layout.panels[index];
    const lengthPx = lengthM * layout.lengthScale;
    const bobX = panel.pivotX + Math.sin(state.angleRad) * lengthPx;
    const bobY = panel.pivotY + Math.cos(state.angleRad) * lengthPx;
    const drawing = arms[index];
    drawing.clear();
    drawing.moveTo(panel.pivotX - 56, panel.pivotY - 20)
      .lineTo(panel.pivotX + 56, panel.pivotY - 20)
      .stroke({ color: INK, width: 6 });
    drawing.circle(panel.pivotX, panel.pivotY, 9).fill(INK);
    drawing.moveTo(panel.pivotX, panel.pivotY).lineTo(bobX, bobY)
      .stroke({ color: INK, width: 3 });
    drawing.circle(bobX + 4, bobY + 4, 24).fill(INK);
    drawing.circle(bobX, bobY, 24)
      .fill(index === 0 ? 0xff927a : 0x4f78e8)
      .stroke({ color: INK, width: 3 });
    drawing.circle(bobX - 7, bobY - 8, 6).fill({ color: 0xffffff, alpha: 0.6 });
    lengthLabels[index].text = `${lengthM.toFixed(1)} m`;
  };

  const drawCurrent = () => {
    if (last) {
      drawPendulum(0, last.left, last.inputs.leftLengthM);
      drawPendulum(1, last.right, last.inputs.rightLengthM);
    }
    render();
  };

  const resize = () => {
    if (destroyed) return;
    const width = Math.max(1, host.clientWidth || DESKTOP.width);
    layout = width < 700 ? MOBILE : DESKTOP;
    app.renderer.resize(width, (width * layout.height) / layout.width);
    world.scale.set(width / layout.width);
    drawBackdrop();
    drawCurrent();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  return {
    update(left, right, inputs) {
      if (destroyed) return;
      last = { left, right, inputs };
      drawCurrent();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      app.destroy(true, { children: true });
    },
  };
}
