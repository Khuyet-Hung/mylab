/** The optical bench uses metres and a downward-positive y axis. */
export type Point2 = { x: number; y: number };
export type MirrorSegment = { id: string; start: Point2; end: Point2 };
export type MirrorMazeSetup = {
  source: { origin: Point2; angleDeg: number };
  mirrors: MirrorSegment[];
};
export type RayPathSegment = {
  start: Point2;
  end: Point2;
  lengthM: number;
  endMirrorId: string | null;
};
export type BounceMeasurement = {
  mirrorId: string;
  point: Point2;
  incidenceAngleDeg: number;
  reflectionAngleDeg: number;
};
export type RayTraceResult = {
  segments: RayPathSegment[];
  bounces: BounceMeasurement[];
  termination: "screen" | "reflection-limit";
};

const EPSILON_M = 1e-5;
type Vector = Point2;
type Hit = { distanceM: number; point: Point2; mirrorId: string | null; tangent?: Vector };

const cross = (a: Vector, b: Vector) => a.x * b.y - a.y * b.x;
const dot = (a: Vector, b: Vector) => a.x * b.x + a.y * b.y;
const finitePoint = (point: Point2) => Number.isFinite(point.x) && Number.isFinite(point.y);

function raySegmentHit(origin: Point2, direction: Vector, start: Point2, end: Point2): number | null {
  const segment = { x: end.x - start.x, y: end.y - start.y };
  const denominator = cross(direction, segment);
  if (Math.abs(denominator) < 1e-12) return null;
  const offset = { x: start.x - origin.x, y: start.y - origin.y };
  const distanceM = cross(offset, segment) / denominator;
  const along = cross(offset, direction) / denominator;
  if (distanceM <= EPSILON_M || along < -1e-10 || along > 1 + 1e-10) return null;
  return distanceM;
}

function validate(setup: MirrorMazeSetup, bounds: { widthM: number; heightM: number }, maxReflections: number) {
  if (
    !Number.isFinite(bounds.widthM) || bounds.widthM <= 0 ||
    !Number.isFinite(bounds.heightM) || bounds.heightM <= 0 ||
    !Number.isInteger(maxReflections) || maxReflections < 1 ||
    !finitePoint(setup.source.origin) || !Number.isFinite(setup.source.angleDeg)
  ) throw new RangeError("Invalid optical bench or source");
  const { x, y } = setup.source.origin;
  if (x <= 0 || x >= bounds.widthM || y <= 0 || y >= bounds.heightM) {
    throw new RangeError("Source must be inside the optical bench");
  }
  const ids = new Set<string>();
  for (const mirror of setup.mirrors) {
    if (
      !mirror.id || ids.has(mirror.id) ||
      !finitePoint(mirror.start) || !finitePoint(mirror.end) ||
      mirror.start.x < 0 || mirror.start.x > bounds.widthM ||
      mirror.end.x < 0 || mirror.end.x > bounds.widthM ||
      mirror.start.y < 0 || mirror.start.y > bounds.heightM ||
      mirror.end.y < 0 || mirror.end.y > bounds.heightM ||
      Math.hypot(mirror.end.x - mirror.start.x, mirror.end.y - mirror.start.y) <= EPSILON_M
    ) throw new RangeError("Invalid mirror segment");
    ids.add(mirror.id);
  }
}

/** Trace the nearest finite intersection; PixiJS never changes these results. */
export function traceMirrorRay(
  setup: MirrorMazeSetup,
  bounds: { widthM: number; heightM: number },
  maxReflections = 12,
): RayTraceResult {
  validate(setup, bounds, maxReflections);
  const screen = [
    [{ x: 0, y: 0 }, { x: bounds.widthM, y: 0 }],
    [{ x: bounds.widthM, y: 0 }, { x: bounds.widthM, y: bounds.heightM }],
    [{ x: bounds.widthM, y: bounds.heightM }, { x: 0, y: bounds.heightM }],
    [{ x: 0, y: bounds.heightM }, { x: 0, y: 0 }],
  ] as const;
  const angleRad = (setup.source.angleDeg * Math.PI) / 180;
  let origin = { ...setup.source.origin };
  let direction = { x: Math.cos(angleRad), y: Math.sin(angleRad) };
  const segments: RayPathSegment[] = [];
  const bounces: BounceMeasurement[] = [];

  for (;;) {
    let nearest: Hit | null = null;
    const consider = (start: Point2, end: Point2, mirrorId: string | null) => {
      const distanceM = raySegmentHit(origin, direction, start, end);
      if (distanceM === null || (nearest !== null && distanceM >= nearest.distanceM)) return;
      const length = Math.hypot(end.x - start.x, end.y - start.y);
      nearest = {
        distanceM,
        point: { x: origin.x + distanceM * direction.x, y: origin.y + distanceM * direction.y },
        mirrorId,
        tangent: mirrorId === null ? undefined : { x: (end.x - start.x) / length, y: (end.y - start.y) / length },
      };
    };
    screen.forEach(([start, end]) => consider(start, end, null));
    setup.mirrors.forEach((mirror) => consider(mirror.start, mirror.end, mirror.id));
    if (nearest === null) throw new RangeError("Ray did not intersect the screen");
    const hit: Hit = nearest;
    segments.push({ start: { ...origin }, end: hit.point, lengthM: hit.distanceM, endMirrorId: hit.mirrorId });
    if (hit.mirrorId === null) return { segments, bounces, termination: "screen" };

    const tangent = hit.tangent!;
    const normal = { x: -tangent.y, y: tangent.x };
    const incidenceAngleDeg = Math.acos(Math.min(1, Math.abs(dot(direction, normal)))) * 180 / Math.PI;
    direction = {
      x: 2 * dot(direction, tangent) * tangent.x - direction.x,
      y: 2 * dot(direction, tangent) * tangent.y - direction.y,
    };
    const reflectedAngleDeg = Math.acos(Math.min(1, Math.abs(dot(direction, normal)))) * 180 / Math.PI;
    bounces.push({
      mirrorId: hit.mirrorId,
      point: hit.point,
      incidenceAngleDeg,
      reflectionAngleDeg: reflectedAngleDeg,
    });
    if (bounces.length >= maxReflections) return { segments, bounces, termination: "reflection-limit" };
    origin = hit.point;
  }
}
