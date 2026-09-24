/*
 * Pure geometry for DotField's cursor-repelled dot grid — ported from
 * design/legacy/ims-ui-prototype.html's DOTS state and draw() loop (search
 * "DOT FIELD"). Same algorithm, same numbers; returns structured data
 * instead of drawing directly, so DotField.tsx owns the canvas 2D calls and
 * this module stays framework-free and independently testable.
 */

export interface DotPoint {
  /** Rest position — immutable once the grid is built. */
  x: number;
  y: number;
  /** Current rendered position — mutated in place by stepDots(). */
  cx: number;
  cy: number;
}

/**
 * Lays out points on a `gap`-spaced grid, inset by half a gap on both axes so
 * the grid reads as centred rather than starting flush against the corner.
 */
export function buildDotGrid(width: number, height: number, gap: number): DotPoint[] {
  const points: DotPoint[] = [];
  for (let y = gap / 2; y < height; y += gap) {
    for (let x = gap / 2; x < width; x += gap) {
      points.push({ x, y, cx: x, cy: y });
    }
  }
  return points;
}

export interface StepDotsOptions {
  /** Cursor influence radius, in px. */
  radius: number;
  /** Maximum displacement at the cursor's centre, in px. */
  push: number;
  /** Per-frame lerp coefficient toward the target position (not a spring — no velocity term). */
  ease: number;
}

export interface NearDot {
  point: DotPoint;
  /** 0 at the radius edge, approaching 1 at the cursor centre. */
  hot: number;
}

export interface StepDotsResult {
  /** True while any point is still travelling toward its target — drives the caller's rAF loop. */
  busy: boolean;
  /** Points displaced enough to warrant the accent-coloured fill. */
  near: NearDot[];
}

const NEAR_THRESHOLD = 0.12;
const CONVERGED_THRESHOLD = 0.1;

/**
 * Advances every point one frame toward its cursor-repelled target and
 * mutates `points` in place. Direction is measured from each point's REST
 * position, not its current one — the target is a pure function of
 * (rest, cursor), so the field has no feedback loop and cannot oscillate.
 */
export function stepDots(points: DotPoint[], mx: number, my: number, { radius, push, ease }: StepDotsOptions): StepDotsResult {
  let busy = false;
  const near: NearDot[] = [];
  const r2 = radius * radius;

  for (const p of points) {
    let tx = p.x;
    let ty = p.y;
    let hot = 0;
    const dx = p.x - mx;
    const dy = p.y - my;
    const d2 = dx * dx + dy * dy;

    if (d2 < r2) {
      const d = Math.sqrt(d2) || 0.001;
      hot = 1 - d / radius;
      const k = hot * hot * push;
      tx += (dx / d) * k;
      ty += (dy / d) * k;
    }

    // Converged on the target, not the origin — lets the loop halt while a
    // still cursor sits over an already-displaced patch of dots.
    if (Math.abs(tx - p.cx) + Math.abs(ty - p.cy) > CONVERGED_THRESHOLD) busy = true;
    p.cx += (tx - p.cx) * ease;
    p.cy += (ty - p.cy) * ease;

    if (hot > NEAR_THRESHOLD) near.push({ point: p, hot });
  }

  return { busy, near };
}
