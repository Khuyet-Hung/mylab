import type { MirrorSegment, Point2 } from "./model";

type Bounds = { widthM: number; heightM: number };

const angleFrom = (origin: Point2, point: Point2) => Math.atan2(point.y - origin.y, point.x - origin.x);
const wrapRadians = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

/** Rotate a grabbed mirror end around its center without changing its length. */
export function rotateMirrorWithinBounds(
  mirror: MirrorSegment,
  endpoint: "start" | "end",
  pointerStart: Point2,
  pointerNow: Point2,
  bounds: Bounds,
): MirrorSegment {
  const center = {
    x: (mirror.start.x + mirror.end.x) / 2,
    y: (mirror.start.y + mirror.end.y) / 2,
  };
  const radius = Math.hypot(mirror.end.x - mirror.start.x, mirror.end.y - mirror.start.y) / 2;
  if (Math.hypot(pointerStart.x - center.x, pointerStart.y - center.y) < 1e-8 ||
      Math.hypot(pointerNow.x - center.x, pointerNow.y - center.y) < 1e-8) return mirror;

  const initialAngle = angleFrom(center, mirror[endpoint]);
  const delta = wrapRadians(angleFrom(center, pointerNow) - angleFrom(center, pointerStart));
  const at = (fraction: number): MirrorSegment => {
    const angle = initialAngle + delta * fraction;
    const offset = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    const grabbed = { x: center.x + offset.x, y: center.y + offset.y };
    const other = { x: center.x - offset.x, y: center.y - offset.y };
    return endpoint === "start"
      ? { id: mirror.id, start: grabbed, end: other }
      : { id: mirror.id, start: other, end: grabbed };
  };
  const valid = (candidate: MirrorSegment) => [candidate.start, candidate.end].every((point) =>
    point.x >= -1e-9 && point.x <= bounds.widthM + 1e-9 &&
    point.y >= -1e-9 && point.y <= bounds.heightM + 1e-9);

  let lastValid = 0;
  for (let step = 1; step <= 48; step++) {
    const fraction = step / 48;
    if (!valid(at(fraction))) {
      let low = lastValid;
      let high = fraction;
      for (let iteration = 0; iteration < 30; iteration++) {
        const middle = (low + high) / 2;
        if (valid(at(middle))) low = middle;
        else high = middle;
      }
      return at(low);
    }
    lastValid = fraction;
  }
  return at(1);
}
