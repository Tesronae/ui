import { describe, expect, it } from "vitest";
import { buildDotGrid, stepDots, type DotPoint } from "./dot-field-math";

function first(points: DotPoint[]): DotPoint {
  const p = points[0];
  if (!p) throw new Error("expected at least one point");
  return p;
}

describe("buildDotGrid", () => {
  it("insets the first point by half a gap on both axes", () => {
    const points = buildDotGrid(100, 100, 24);
    expect(first(points)).toMatchObject({ x: 12, y: 12, cx: 12, cy: 12 });
  });

  it("produces floor(w/gap) * floor(h/gap) points", () => {
    const points = buildDotGrid(96, 48, 24);
    expect(points).toHaveLength(4 * 2);
  });
});

describe("stepDots", () => {
  it("leaves a dot outside the radius untouched and not busy", () => {
    const far: DotPoint = { x: 500, y: 500, cx: 500, cy: 500 };
    const result = stepDots([far], 0, 0, { radius: 118, push: 26, ease: 0.17 });
    expect(far.cx).toBe(far.x);
    expect(far.cy).toBe(far.y);
    expect(result.busy).toBe(false);
    expect(result.near).toHaveLength(0);
  });

  it("converges toward `push` displacement, directed away from the cursor", () => {
    const points = buildDotGrid(100, 100, 24);
    const target = first(points);
    let busy = true;
    for (let i = 0; i < 300; i++) {
      // Cursor offset by a hair so the direction vector isn't degenerate,
      // while still landing effectively at the dot's centre (hot ≈ 1).
      ({ busy } = stepDots(points, target.x + 0.0001, target.y, { radius: 118, push: 26, ease: 0.17 }));
    }
    expect(target.cx - target.x).toBeCloseTo(-26, 0);
    expect(target.cy - target.y).toBeCloseTo(0, 1);
    expect(busy).toBe(false);
  });

  it("produces a smaller displacement further from the cursor (quadratic falloff)", () => {
    const near = first(buildDotGrid(300, 300, 300)); // single point at (150, 150)
    const far: DotPoint = { x: 150, y: 150, cx: 150, cy: 150 };

    for (let i = 0; i < 300; i++) stepDots([near], 150 + 10, 150, { radius: 118, push: 26, ease: 0.17 });
    for (let i = 0; i < 300; i++) stepDots([far], 150 + 100, 150, { radius: 118, push: 26, ease: 0.17 });

    const nearDisplacement = Math.abs(near.cx - near.x);
    const farDisplacement = Math.abs(far.cx - far.x);
    expect(nearDisplacement).toBeGreaterThan(farDisplacement);
    // hot(10) ≈ 0.915, hot(100) ≈ 0.153 — squared, that's a ~36x force ratio.
    expect(nearDisplacement / farDisplacement).toBeGreaterThan(10);
  });

  it("does not produce NaN when the cursor sits exactly on a dot", () => {
    const points = buildDotGrid(100, 100, 24);
    const p = first(points);
    const result = stepDots(points, p.x, p.y, { radius: 118, push: 26, ease: 0.17 });
    expect(Number.isNaN(p.cx)).toBe(false);
    expect(Number.isNaN(p.cy)).toBe(false);
    expect(typeof result.busy).toBe("boolean");
  });

  it("reports near dots (hot > 0.12) for the accent-fill pass", () => {
    const points = buildDotGrid(100, 100, 24);
    const target = first(points);
    const result = stepDots(points, target.x, target.y, { radius: 118, push: 26, ease: 0.17 });
    const match = result.near.find((n) => n.point === target);
    expect(match).toBeDefined();
    expect(match!.hot).toBeGreaterThan(0.12);
  });
});
