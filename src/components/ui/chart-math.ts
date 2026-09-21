/*
 * Pure geometry for the sparkline/bar/ring charts — ported from
 * design/legacy/ims-ui-prototype.html's spark()/bars()/ring() functions
 * (search "CHARTS"). Same algorithm, same numbers; returns structured data
 * instead of a pre-built SVG markup string, so React components can map it
 * to JSX (<path>/<rect>/<circle>) rather than injecting a template string.
 */

export interface SparklineOptions {
  width?: number;
  height?: number;
  step?: boolean;
  zero?: boolean;
}

export interface SparklineResult {
  width: number;
  height: number;
  linePath: string;
  areaPath: string;
  lastPoint: { x: number; y: number };
}

export function buildSparkline(values: number[], options: SparklineOptions = {}): SparklineResult {
  const { width = 96, height = 30, step = false, zero = false } = options;
  const mx = Math.max(...values);
  const lo = zero ? Math.min(...values, 0) : Math.min(...values);
  const mn = lo - (mx - lo) * 0.3;
  const rng = mx - mn || 1;
  const x = (i: number) => Number((i / (values.length - 1)) * width).toFixed(1);
  const y = (v: number) => Number(height - 2 - ((v - mn) / rng) * (height - 5)).toFixed(1);

  let linePath = `M0 ${+y(values[0]!)}`;
  values.forEach((v, i) => {
    if (i === 0) return;
    linePath += step
      ? ` L${+x(i)} ${+y(values[i - 1]!)} L${+x(i)} ${+y(v)}`
      : ` L${+x(i)} ${+y(v)}`;
  });

  const lastIndex = values.length - 1;
  const lastPoint = { x: +x(lastIndex), y: +y(values[lastIndex]!) };
  const areaPath = `${linePath} L${width} ${height} L0 ${height}Z`;

  return { width, height, linePath, areaPath, lastPoint };
}

export interface BarsOptions {
  width?: number;
  height?: number;
  gap?: number;
}

export interface Bar {
  x: number;
  y: number;
  width: number;
  height: number;
  isLast: boolean;
}

export interface BarsResult {
  width: number;
  height: number;
  bars: Bar[];
}

export function buildBars(values: number[], options: BarsOptions = {}): BarsResult {
  const { width = 96, height = 28, gap = 2 } = options;
  const barWidth = (width - gap * (values.length - 1)) / values.length;
  const mx = Math.max(...values) || 1;

  const bars = values.map((v, i) => {
    const barHeight = Math.max(2, (v / mx) * height);
    return {
      x: (barWidth + gap) * i,
      y: height - barHeight,
      width: barWidth,
      height: barHeight,
      isLast: i === values.length - 1,
    };
  });

  return { width, height, bars };
}

export interface RingSegment {
  value: number;
  color: string;
}

export interface RingArc {
  color: string;
  dashArray: [number, number];
  dashOffset: number;
}

export interface RingArcsResult {
  size: number;
  radius: number;
  circumference: number;
  percent: number;
  arcs: RingArc[];
}

export function buildRingArcs(segments: RingSegment[], size = 104): RingArcsResult {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offset = 0;
  const arcs: RingArc[] = [];
  for (const segment of segments) {
    if (segment.value <= 0) continue;
    const len = (segment.value / total) * circumference;
    arcs.push({
      color: segment.color,
      dashArray: [len, circumference - len],
      dashOffset: -offset,
    });
    offset += len;
  }

  const percent = Math.round(((segments[0]?.value ?? 0) / total) * 100);

  return { size, radius, circumference, percent, arcs };
}
