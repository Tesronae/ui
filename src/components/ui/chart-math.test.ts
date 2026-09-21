import { describe, expect, it } from "vitest";
import { buildBars, buildRingArcs, buildSparkline } from "./chart-math";

describe("buildSparkline — ported from the prototype's spark()", () => {
  it("matches the prototype's exact path for a known input", () => {
    // Hand-computed from design/legacy/ims-ui-prototype.html's spark([1,2,3]):
    // mn = 1 - (3-1)*0.3 = 0.4, rng = 2.6
    // Y(1)=22.2, Y(2)=12.6, Y(3)=3 (each toFixed(1) then coerced back to number)
    const result = buildSparkline([1, 2, 3], { width: 96, height: 30 });
    expect(result.linePath).toBe("M0 22.2 L48 12.6 L96 3");
    expect(result.areaPath).toBe("M0 22.2 L48 12.6 L96 3 L96 30 L0 30Z");
    expect(result.lastPoint).toEqual({ x: 96, y: 3 });
  });

  it("includes 0 in the floor when zero:true, unlike the default", () => {
    // vals all positive, zero:true forces lo = min(vals, 0) = 0 instead of min(vals)
    const withZero = buildSparkline([10, 20], { width: 96, height: 30, zero: true });
    const withoutZero = buildSparkline([10, 20], { width: 96, height: 30 });
    expect(withZero.linePath).not.toBe(withoutZero.linePath);
  });

  it("builds a stepped path when step:true", () => {
    const stepped = buildSparkline([1, 2, 3], { width: 96, height: 30, step: true });
    // step inserts a horizontal-then-vertical elbow: L<x_i> <y_{i-1}> L<x_i> <y_i>
    expect(stepped.linePath).toBe("M0 22.2 L48 22.2 L48 12.6 L96 12.6 L96 3");
  });
});

describe("buildBars — ported from the prototype's bars()", () => {
  it("matches the prototype's exact geometry for a known input", () => {
    // Hand-computed from bars([1,1]): mx=1, bw=(96-2*1)/2=47, bh=max(2,1/1*28)=28
    const { bars, width, height } = buildBars([1, 1], { width: 96, height: 28 });
    expect(width).toBe(96);
    expect(height).toBe(28);
    expect(bars).toEqual([
      { x: 0, y: 0, width: 47, height: 28, isLast: false },
      { x: 49, y: 0, width: 47, height: 28, isLast: true },
    ]);
  });

  it("floors bar height at 2px even for a near-zero value", () => {
    const { bars } = buildBars([0, 100], { width: 96, height: 28 });
    expect(bars[0]?.height).toBe(2);
  });
});

describe("buildRingArcs — ported from the prototype's ring()", () => {
  it("matches the prototype's exact arc geometry and percentage for a known input", () => {
    // Hand-computed from ring([{v:75,c:'--ring-1'},{v:25,c:'--ring-3'}], 104):
    // r = 104/2 - 8 = 44, C = 2*PI*44 = 276.4601...
    // total=100, pct=round(75/100*100)=75
    // seg1: len = 75/100*C = 207.345..., offset 0
    // seg2: len = 25/100*C = 69.115..., offset -207.345...
    const { radius, circumference, percent, arcs } = buildRingArcs(
      [
        { value: 75, color: "--ring-1" },
        { value: 25, color: "--ring-3" },
      ],
      104,
    );
    expect(radius).toBe(44);
    expect(circumference).toBeCloseTo(276.4601, 3);
    expect(percent).toBe(75);
    expect(arcs).toHaveLength(2);
    expect(arcs[0]).toMatchObject({ color: "--ring-1", dashOffset: -0 });
    expect(arcs[0]?.dashArray[0]).toBeCloseTo(207.3451, 3);
    expect(arcs[1]).toMatchObject({ color: "--ring-3" });
    expect(arcs[1]?.dashOffset).toBeCloseTo(-207.3451, 3);
  });

  it("omits a zero-value segment entirely, matching the prototype's filter(x => x.v > 0)", () => {
    const { arcs } = buildRingArcs(
      [
        { value: 100, color: "--ring-1" },
        { value: 0, color: "--ring-2" },
      ],
      104,
    );
    expect(arcs).toHaveLength(1);
  });

  it("falls back total to 1 when every segment is 0, avoiding divide-by-zero", () => {
    expect(() => buildRingArcs([{ value: 0, color: "--ring-1" }], 104)).not.toThrow();
  });
});
