import { describe, expect, it } from "vitest";
import { traceMirrorRay, type MirrorMazeSetup } from "../../src/experiments/optics/model";

const bounds = { widthM: 9, heightM: 5.2 };
const source = { origin: { x: 1, y: 2.6 }, angleDeg: 0 };
const setup = (mirrors: MirrorMazeSetup["mirrors"]): MirrorMazeSetup => ({ source, mirrors });
const diagonal = { id: "A", start: { x: 2.8, y: 3.1 }, end: { x: 3.8, y: 2.1 } };

describe("traceMirrorRay", () => {
  it("tracesToScreenWithoutMirrors", () => {
    const result = traceMirrorRay(setup([]), bounds);
    expect(result.termination).toBe("screen");
    expect(result.bounces).toHaveLength(0);
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].end).toEqual({ x: 9, y: 2.6 });
    expect(result.segments[0].lengthM).toBeCloseTo(8, 8);
  });

  it("reflectsAtFortyFiveDegreeMirror", () => {
    const result = traceMirrorRay(setup([diagonal]), bounds);
    expect(result.termination).toBe("screen");
    expect(result.bounces).toHaveLength(1);
    expect(result.bounces[0].mirrorId).toBe("A");
    expect(result.bounces[0].incidenceAngleDeg).toBeCloseTo(45, 6);
    expect(result.bounces[0].reflectionAngleDeg).toBeCloseTo(45, 6);
    expect(result.segments[0].end.x).toBeCloseTo(3.3, 8);
    expect(result.segments[1].end.y).toBeCloseTo(0, 8);
  });

  it("choosesNearestForwardMirror", () => {
    const near = { id: "near", start: { x: 2, y: 2 }, end: { x: 2, y: 3 } };
    const far = { id: "far", start: { x: 4, y: 2 }, end: { x: 4, y: 3 } };
    const result = traceMirrorRay(setup([far, near]), bounds);
    expect(result.bounces[0].mirrorId).toBe("near");
    expect(result.segments[0].end.x).toBeCloseTo(2, 8);
  });

  it("acceptsFiniteSegmentEndpointHit", () => {
    const mirror = { id: "end", start: { x: 3, y: 2.6 }, end: { x: 4, y: 1.6 } };
    const result = traceMirrorRay(setup([mirror]), bounds);
    expect(result.bounces[0].mirrorId).toBe("end");
    expect(result.segments[0].end.x).toBeCloseTo(3, 8);
  });

  it("ignoresParallelMirror", () => {
    const mirror = { id: "parallel", start: { x: 2, y: 1.5 }, end: { x: 4, y: 1.5 } };
    expect(traceMirrorRay(setup([mirror]), bounds).bounces).toHaveLength(0);
  });

  it("ignoresCollinearMirrorOverlap", () => {
    const mirror = { id: "collinear", start: { x: 2, y: 2.6 }, end: { x: 4, y: 2.6 } };
    expect(traceMirrorRay(setup([mirror]), bounds).segments[0].end.x).toBeCloseTo(9, 8);
  });

  it("ignoresMirrorBehindSource", () => {
    const mirror = { id: "behind", start: { x: 0.5, y: 2 }, end: { x: 0.5, y: 3 } };
    expect(traceMirrorRay(setup([mirror]), bounds).bounces).toHaveLength(0);
  });

  it("doesNotImmediatelyRehitMirror", () => {
    const result = traceMirrorRay(setup([diagonal]), bounds);
    expect(result.bounces).toHaveLength(1);
    expect(result.segments).toHaveLength(2);
  });

  it("stopsAtReflectionLimit", () => {
    const result = traceMirrorRay(setup([diagonal]), bounds, 1);
    expect(result.termination).toBe("reflection-limit");
    expect(result.bounces).toHaveLength(1);
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].endMirrorId).toBe("A");
  });

  it("rejectsInvalidGeometry", () => {
    expect(() => traceMirrorRay(setup([{ id: "zero", start: { x: 2, y: 2 }, end: { x: 2, y: 2 } }]), bounds)).toThrow(RangeError);
    expect(() => traceMirrorRay({ source: { origin: { x: 0, y: 2 }, angleDeg: 0 }, mirrors: [] }, bounds)).toThrow(RangeError);
    expect(() => traceMirrorRay(setup([]), bounds, 0)).toThrow(RangeError);
  });
});
