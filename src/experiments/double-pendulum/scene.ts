import { Application, Container, Graphics, Text } from "pixi.js";
import type { DoublePendulumState } from "./model";
import { resizeExperimentScene } from "../shared/resizeScene";

type Point = { xM: number; yM: number };
type Panel = { x: number; y: number; width: number; height: number; pivotX: number; pivotY: number };
type Layout = { width: number; height: number; scale: number; panels: readonly [Panel, Panel] };

export type DoublePendulumScene = {
  update(stateA: DoublePendulumState, stateB: DoublePendulumState, inputs: { upperLengthM: number; lowerLengthM: number }): void;
  appendTrailPoint(pointA: Point, pointB: Point): void;
  restoreTrails(pointsA: Point[], pointsB: Point[]): void;
  clearTrails(): void;
  destroy(): void;
};

const INK = 0x1e1e1b;
const PAPER = 0xf4f2ec;
const COLORS = [0xff927a, 0x4f78e8] as const;
const DESKTOP: Layout = {
  width: 900, height: 510, scale: 65,
  panels: [
    { x: 14, y: 18, width: 428, height: 474, pivotX: 228, pivotY: 256 },
    { x: 458, y: 18, width: 428, height: 474, pivotX: 672, pivotY: 256 },
  ],
};
const MOBILE: Layout = {
  width: 440, height: 760, scale: 48,
  panels: [
    { x: 10, y: 10, width: 420, height: 365, pivotX: 220, pivotY: 197 },
    { x: 10, y: 385, width: 420, height: 365, pivotX: 220, pivotY: 572 },
  ],
};

export async function createDoublePendulumScene(host: HTMLElement): Promise<DoublePendulumScene> {
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
  const trails = [new Graphics(), new Graphics()] as const;
  const arms = [new Graphics(), new Graphics()] as const;
  for (const trail of trails) world.addChild(trail);
  for (const arm of arms) world.addChild(arm);
  const titles = ["A / GÓC BAN ĐẦU", "B / LỆCH MỘT CHÚT"].map((label) => {
    const item = new Text({
      text: label,
      style: { fontFamily: "monospace", fontSize: 16, fontWeight: "bold", fill: INK },
    });
    world.addChild(item);
    return item;
  });
  let layout = DESKTOP;
  let destroyed = false;
  let latest: { a: DoublePendulumState; b: DoublePendulumState; lengths: { upperLengthM: number; lowerLengthM: number } } | null = null;
  const trailPoints: [Point[], Point[]] = [[], []];

  const drawBackdrop = () => {
    backdrop.clear();
    layout.panels.forEach((panel, index) => {
      backdrop.roundRect(panel.x + 5, panel.y + 5, panel.width, panel.height, 18).fill(INK);
      backdrop.roundRect(panel.x, panel.y, panel.width, panel.height, 18)
        .fill(index === 0 ? 0xffe4d9 : 0xe3ebff)
        .stroke({ color: INK, width: 3 });
      backdrop.circle(panel.pivotX, panel.pivotY, layout.scale * 2.9)
        .stroke({ color: INK, alpha: 0.12, width: 1 });
      backdrop.moveTo(panel.pivotX, panel.y + 40).lineTo(panel.pivotX, panel.y + panel.height - 20)
        .stroke({ color: INK, alpha: 0.12, width: 1 });
      titles[index].position.set(panel.x + 18, panel.y + 12);
    });
  };

  const drawTrails = () => {
    trails.forEach((drawing, index) => {
      drawing.clear();
      const panel = layout.panels[index];
      trailPoints[index].forEach((point, pointIndex) => {
        const x = panel.pivotX + point.xM * layout.scale;
        const y = panel.pivotY + point.yM * layout.scale;
        if (index === 0) {
          drawing.circle(x, y, 2).fill({ color: COLORS[index], alpha: 0.62 });
        } else if (pointIndex % 3 === 0) {
          drawing.circle(x, y, 3).stroke({ color: COLORS[index], alpha: 0.8, width: 1.5 });
        }
      });
    });
  };

  const drawPendulum = (index: 0 | 1, state: DoublePendulumState, lengths: { upperLengthM: number; lowerLengthM: number }) => {
    const panel = layout.panels[index];
    const firstX = panel.pivotX + Math.sin(state.upperAngleRad) * lengths.upperLengthM * layout.scale;
    const firstY = panel.pivotY + Math.cos(state.upperAngleRad) * lengths.upperLengthM * layout.scale;
    const secondX = firstX + Math.sin(state.lowerAngleRad) * lengths.lowerLengthM * layout.scale;
    const secondY = firstY + Math.cos(state.lowerAngleRad) * lengths.lowerLengthM * layout.scale;
    const drawing = arms[index];
    drawing.clear();
    drawing.moveTo(panel.pivotX - 35, panel.pivotY - 12).lineTo(panel.pivotX + 35, panel.pivotY - 12)
      .stroke({ color: INK, width: 5 });
    drawing.moveTo(panel.pivotX, panel.pivotY).lineTo(firstX, firstY).lineTo(secondX, secondY)
      .stroke({ color: INK, width: 4 });
    drawing.circle(panel.pivotX, panel.pivotY, 7).fill(INK);
    drawing.circle(firstX, firstY, 14).fill(COLORS[index]).stroke({ color: INK, width: 3 });
    drawing.circle(secondX, secondY, 19).fill(COLORS[index]).stroke({ color: INK, width: 3 });
    drawing.circle(secondX - 5, secondY - 6, 4).fill({ color: 0xffffff, alpha: 0.6 });
  };

  const render = () => {
    drawTrails();
    if (latest) {
      drawPendulum(0, latest.a, latest.lengths);
      drawPendulum(1, latest.b, latest.lengths);
    }
    if (!destroyed) app.renderer.render(app.stage);
  };
  const resize = () => {
    if (destroyed) return;
    layout = window.matchMedia("(max-width: 700px)").matches ? MOBILE : DESKTOP;
    drawBackdrop();
    resizeExperimentScene(app, world, host, layout);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  return {
    update(stateA, stateB, lengths) {
      if (destroyed) return;
      latest = { a: stateA, b: stateB, lengths };
      render();
    },
    appendTrailPoint(pointA, pointB) {
      if (destroyed) return;
      for (const [index, point] of [pointA, pointB].entries()) {
        const points = trailPoints[index];
        points.push(point);
        if (points.length > 600) points.shift();
      }
    },
    restoreTrails(pointsA, pointsB) {
      trailPoints[0] = pointsA.slice(-600);
      trailPoints[1] = pointsB.slice(-600);
      render();
    },
    clearTrails() {
      trailPoints[0].length = 0;
      trailPoints[1].length = 0;
      render();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      app.destroy(true, { children: true });
    },
  };
}
