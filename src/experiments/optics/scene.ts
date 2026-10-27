import { Application, Container, Graphics, Text } from "pixi.js";
import { resizeExperimentScene } from "../shared/resizeScene";
import type { MirrorMazeSetup, Point2, RayTraceResult } from "./model";
import { rotateMirrorWithinBounds } from "./interaction";

export type MirrorMazeScene = {
  setSetup(setup: MirrorMazeSetup): void;
  setSelectedMirror(id: string | null): void;
  revealPath(path: RayTraceResult | null, distanceM: number): void;
  destroy(): void;
};

const WIDTH_M = 9;
const HEIGHT_M = 5.2;
const SCALE = 100;
const LOGICAL = { width: WIDTH_M * SCALE, height: HEIGHT_M * SCALE };
const INK = 0x1e1e1b;
const PAPER = 0xf4f2ec;
const BLUE = 0x4f78e8;
const CORAL = 0xff927a;
const YELLOW = 0xffd83d;
const SOURCE_HANDLE_M = 0.58;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const copySetup = (setup: MirrorMazeSetup): MirrorMazeSetup => ({
  source: { origin: { ...setup.source.origin }, angleDeg: setup.source.angleDeg },
  mirrors: setup.mirrors.map((mirror) => ({
    id: mirror.id, start: { ...mirror.start }, end: { ...mirror.end },
  })),
});
const px = (point: Point2) => ({ x: point.x * SCALE, y: point.y * SCALE });
const distanceToSegment = (point: Point2, start: Point2, end: Point2) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const fraction = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(point.x - (start.x + fraction * dx), point.y - (start.y + fraction * dy));
};

/** A display and pointer surface; ray calculations remain in model.ts. */
export async function createMirrorMazeScene(
  host: HTMLElement,
  setup: MirrorMazeSetup,
  onSetupChange: (setup: MirrorMazeSetup) => void,
  onSelectMirror: (id: string | null) => void,
): Promise<MirrorMazeScene> {
  const app = new Application();
  await app.init({
    width: LOGICAL.width,
    height: LOGICAL.height,
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
  canvas.style.touchAction = "none";
  canvas.style.cursor = "crosshair";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const world = new Container();
  app.stage.addChild(world);
  const backdrop = new Graphics();
  const beamUnderlay = new Graphics();
  const beam = new Graphics();
  const objects = new Graphics();
  world.addChild(backdrop, beamUnderlay, beam, objects);
  const title = new Text({
    text: "BÀN QUANG HỌC  •  KÉO GƯƠNG ĐỂ ĐỔI ĐƯỜNG TIA",
    style: { fontFamily: "monospace", fontSize: 15, fontWeight: "bold", fill: INK },
  });
  title.position.set(27, 20);
  world.addChild(title);
  const mirrorLabels = new Map<string, Text>();
  let currentSetup = copySetup(setup);
  let selectedMirror: string | null = null;
  let shownPath: RayTraceResult | null = null;
  let shownDistanceM = 0;
  let destroyed = false;
  let drag: {
    kind: "move-source" | "rotate-source" | "move-mirror" | "rotate-mirror";
    mirrorId?: string;
    endpoint?: "start" | "end";
    pointerId: number;
    startPointer: Point2;
    initial: MirrorMazeSetup;
  } | null = null;

  const render = () => { if (!destroyed) app.renderer.render(app.stage); };
  const drawBackdrop = () => {
    backdrop.clear();
    backdrop.rect(0, 0, LOGICAL.width, LOGICAL.height).fill(PAPER);
    for (let x = 50; x < LOGICAL.width; x += 50) {
      for (let y = 70; y < LOGICAL.height; y += 50) {
        backdrop.circle(x, y, 1.5).fill({ color: INK, alpha: 0.13 });
      }
    }
    backdrop.roundRect(8, 8, LOGICAL.width - 16, LOGICAL.height - 16, 15)
      .stroke({ color: INK, width: 5 });
    backdrop.roundRect(17, 17, LOGICAL.width - 34, LOGICAL.height - 34, 11)
      .stroke({ color: BLUE, width: 2, alpha: 0.7 });
  };

  const drawObjects = () => {
    objects.clear();
    const source = px(currentSetup.source.origin);
    const heading = currentSetup.source.angleDeg * Math.PI / 180;
    objects.circle(source.x + 4, source.y + 4, 21).fill(INK);
    objects.circle(source.x, source.y, 21).fill(CORAL).stroke({ color: INK, width: 3 });
    objects.moveTo(source.x, source.y)
      .lineTo(source.x + SOURCE_HANDLE_M * SCALE * Math.cos(heading), source.y + SOURCE_HANDLE_M * SCALE * Math.sin(heading))
      .stroke({ color: INK, width: 5 });
    objects.circle(source.x, source.y, 5).fill(INK);
    objects.circle(source.x + SOURCE_HANDLE_M * SCALE * Math.cos(heading), source.y + SOURCE_HANDLE_M * SCALE * Math.sin(heading), 10)
      .fill(YELLOW).stroke({ color: INK, width: 3 });
    for (const mirror of currentSetup.mirrors) {
      const start = px(mirror.start);
      const end = px(mirror.end);
      const selected = mirror.id === selectedMirror;
      objects.moveTo(start.x + 4, start.y + 4).lineTo(end.x + 4, end.y + 4)
        .stroke({ color: INK, width: selected ? 17 : 15, cap: "round" });
      objects.moveTo(start.x, start.y).lineTo(end.x, end.y)
        .stroke({ color: selected ? YELLOW : BLUE, width: selected ? 13 : 11, cap: "round" });
      objects.circle(start.x, start.y, 10).fill(PAPER).stroke({ color: INK, width: 3 });
      objects.circle(end.x, end.y, 10).fill(PAPER).stroke({ color: INK, width: 3 });
      const label = mirrorLabels.get(mirror.id);
      if (label) label.position.set((start.x + end.x) / 2 + 12, (start.y + end.y) / 2 - 32);
    }
  };

  const drawPath = () => {
    beamUnderlay.clear();
    beam.clear();
    if (!shownPath || shownDistanceM <= 0) return;
    let left = shownDistanceM;
    for (const segment of shownPath.segments) {
      if (left <= 0) break;
      const travelled = Math.min(left, segment.lengthM);
      const fraction = segment.lengthM === 0 ? 0 : travelled / segment.lengthM;
      const start = px(segment.start);
      const end = px({
        x: segment.start.x + (segment.end.x - segment.start.x) * fraction,
        y: segment.start.y + (segment.end.y - segment.start.y) * fraction,
      });
      beamUnderlay.moveTo(start.x, start.y).lineTo(end.x, end.y)
        .stroke({ color: INK, width: 12, cap: "round" });
      beam.moveTo(start.x, start.y).lineTo(end.x, end.y)
        .stroke({ color: YELLOW, width: 7, cap: "round" });
      left -= travelled;
    }
  };

  const syncLabels = () => {
    const ids = new Set(currentSetup.mirrors.map((mirror) => mirror.id));
    for (const [id, label] of mirrorLabels) {
      if (!ids.has(id)) { world.removeChild(label); label.destroy(); mirrorLabels.delete(id); }
    }
    let changed = false;
    for (const mirror of currentSetup.mirrors) {
      if (mirrorLabels.has(mirror.id)) continue;
      const label = new Text({
        text: mirror.id,
        style: { fontFamily: "monospace", fontSize: 16, fontWeight: "bold", fill: INK },
      });
      mirrorLabels.set(mirror.id, label);
      world.addChild(label);
      changed = true;
    }
    if (changed) resizeExperimentScene(app, world, host, LOGICAL);
  };
  const draw = () => { syncLabels(); drawObjects(); drawPath(); render(); };
  const pointerPoint = (event: PointerEvent): Point2 => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / rect.width * WIDTH_M, 0, WIDTH_M),
      y: clamp((event.clientY - rect.top) / rect.height * HEIGHT_M, 0, HEIGHT_M),
    };
  };

  const pointerDown = (event: PointerEvent) => {
    const point = pointerPoint(event);
    const metersPerCssPixel = WIDTH_M / canvas.getBoundingClientRect().width;
    const handleRadiusM = Math.max(0.16, 16 * metersPerCssPixel);
    const bodyRadiusM = Math.max(0.2, 16 * metersPerCssPixel);
    const heading = currentSetup.source.angleDeg * Math.PI / 180;
    const sourceHandle = {
      x: currentSetup.source.origin.x + SOURCE_HANDLE_M * Math.cos(heading),
      y: currentSetup.source.origin.y + SOURCE_HANDLE_M * Math.sin(heading),
    };
    if (Math.hypot(point.x - sourceHandle.x, point.y - sourceHandle.y) < handleRadiusM) {
      selectedMirror = null;
      onSelectMirror(null);
      drag = { kind: "rotate-source", pointerId: event.pointerId, startPointer: point, initial: copySetup(currentSetup) };
    } else {
      const endpointHit = [...currentSetup.mirrors].reverse().flatMap((mirror) =>
        (["start", "end"] as const).map((endpoint) => ({ mirror, endpoint }))).find(({ mirror, endpoint }) =>
        Math.hypot(point.x - mirror[endpoint].x, point.y - mirror[endpoint].y) < handleRadiusM);
      if (endpointHit) {
        selectedMirror = endpointHit.mirror.id;
        onSelectMirror(selectedMirror);
        drag = { kind: "rotate-mirror", mirrorId: selectedMirror, endpoint: endpointHit.endpoint,
          pointerId: event.pointerId, startPointer: point, initial: copySetup(currentSetup) };
      }
    }
    if (!drag && Math.hypot(point.x - currentSetup.source.origin.x, point.y - currentSetup.source.origin.y) < bodyRadiusM) {
      selectedMirror = null;
      onSelectMirror(null);
      drag = { kind: "move-source", pointerId: event.pointerId, startPointer: point, initial: copySetup(currentSetup) };
    } else if (!drag) {
      const mirror = [...currentSetup.mirrors].reverse().find((item) =>
        distanceToSegment(point, item.start, item.end) < bodyRadiusM);
      selectedMirror = mirror?.id ?? null;
      onSelectMirror(selectedMirror);
      if (mirror) drag = { kind: "move-mirror", mirrorId: mirror.id, pointerId: event.pointerId, startPointer: point, initial: copySetup(currentSetup) };
    }
    if (drag) canvas.setPointerCapture(event.pointerId);
    draw();
  };
  const pointerMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const point = pointerPoint(event);
    const dx = point.x - drag.startPointer.x;
    const dy = point.y - drag.startPointer.y;
    const next = copySetup(drag.initial);
    if (drag.kind === "rotate-source") {
      const origin = drag.initial.source.origin;
      const radius = Math.hypot(point.x - origin.x, point.y - origin.y);
      if (radius < 1e-8) return;
      next.source.angleDeg = Math.atan2(point.y - origin.y, point.x - origin.x) * 180 / Math.PI;
    } else if (drag.kind === "move-source") {
      next.source.origin = {
        x: clamp(drag.initial.source.origin.x + dx, 0.1, WIDTH_M - 0.1),
        y: clamp(drag.initial.source.origin.y + dy, 0.1, HEIGHT_M - 0.1),
      };
    } else if (drag.kind === "rotate-mirror") {
      const index = next.mirrors.findIndex((item) => item.id === drag?.mirrorId);
      next.mirrors[index] = rotateMirrorWithinBounds(
        drag.initial.mirrors[index], drag.endpoint!, drag.startPointer, point,
        { widthM: WIDTH_M, heightM: HEIGHT_M },
      );
    } else {
      const mirror = next.mirrors.find((item) => item.id === drag?.mirrorId)!;
      const shiftX = clamp(dx, Math.max(-mirror.start.x, -mirror.end.x), Math.min(WIDTH_M - mirror.start.x, WIDTH_M - mirror.end.x));
      const shiftY = clamp(dy, Math.max(-mirror.start.y, -mirror.end.y), Math.min(HEIGHT_M - mirror.start.y, HEIGHT_M - mirror.end.y));
      mirror.start = { x: mirror.start.x + shiftX, y: mirror.start.y + shiftY };
      mirror.end = { x: mirror.end.x + shiftX, y: mirror.end.y + shiftY };
    }
    currentSetup = next;
    shownPath = null;
    shownDistanceM = 0;
    onSetupChange(copySetup(next));
    draw();
  };
  const pointerUp = (event: PointerEvent) => {
    if (drag?.pointerId !== event.pointerId) return;
    drag = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerUp);

  const resize = () => { if (!destroyed) { resizeExperimentScene(app, world, host, LOGICAL); draw(); } };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  drawBackdrop();
  resize();

  return {
    setSetup(next) { currentSetup = copySetup(next); draw(); },
    setSelectedMirror(id) { selectedMirror = id; draw(); },
    revealPath(path, distanceM) { shownPath = path; shownDistanceM = distanceM; drawPath(); render(); },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      app.destroy(true, { children: true });
    },
  };
}
