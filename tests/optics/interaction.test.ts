import { describe, expect, it } from "vitest";
import { rotateMirrorWithinBounds } from "../../src/experiments/optics/interaction";

const bounds = { widthM: 9, heightM: 5.2 };

describe("rotateMirrorWithinBounds", () => {
  it("rotates the grabbed endpoint around a fixed center", () => {
    const mirror = { id: "A", start: { x: 4, y: 2.6 }, end: { x: 6, y: 2.6 } };
    const rotated = rotateMirrorWithinBounds(mirror, "end", { x: 6, y: 2.6 }, { x: 5, y: 3.6 }, bounds);
    expect(rotated.start.x).toBeCloseTo(5);
    expect(rotated.start.y).toBeCloseTo(1.6);
    expect(rotated.end.x).toBeCloseTo(5);
    expect(rotated.end.y).toBeCloseTo(3.6);
    expect(Math.hypot(rotated.end.x - rotated.start.x, rotated.end.y - rotated.start.y)).toBeCloseTo(2);
  });

  it("uses the start handle direction without swapping endpoints", () => {
    const mirror = { id: "A", start: { x: 4, y: 2.6 }, end: { x: 6, y: 2.6 } };
    const rotated = rotateMirrorWithinBounds(mirror, "start", { x: 4, y: 2.6 }, { x: 5, y: 1.6 }, bounds);
    expect(rotated.start.y).toBeCloseTo(1.6);
    expect(rotated.end.y).toBeCloseTo(3.6);
  });

  it("stops at the boundary while preserving center and length", () => {
    const mirror = { id: "A", start: { x: 0, y: 0 }, end: { x: 2, y: 0 } };
    const rotated = rotateMirrorWithinBounds(mirror, "end", { x: 2, y: 0 }, { x: 2, y: 1 }, bounds);
    expect(rotated.start.x).toBeGreaterThanOrEqual(-1e-8);
    expect(rotated.end.x).toBeLessThanOrEqual(9 + 1e-8);
    expect(rotated.start.y).toBeGreaterThanOrEqual(-1e-8);
    expect(rotated.end.y).toBeGreaterThanOrEqual(-1e-8);
    expect((rotated.start.x + rotated.end.x) / 2).toBeCloseTo(1);
    expect(Math.hypot(rotated.end.x - rotated.start.x, rotated.end.y - rotated.start.y)).toBeCloseTo(2);
  });
});
