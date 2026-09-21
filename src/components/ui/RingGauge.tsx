import { buildRingArcs, type RingSegment } from "./chart-math";
import styles from "./RingGauge.module.css";

// Intl.NumberFormat, not a hardcoded "%" literal (this package's own
// string-externalization invariant, enforced by react/jsx-no-literals) —
// lets the runtime place the percent sign per-locale rather than assuming
// the English "75%" convention everywhere.
const formatPercent = (value: number) =>
  new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 0 }).format(value / 100);

export function RingGauge({
  segments,
  size = 104,
  caption,
}: {
  segments: RingSegment[];
  size?: number;
  caption: string;
}) {
  const { radius, percent, arcs } = buildRingArcs(segments, size);
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle className={styles.track} cx={center} cy={center} r={radius} fill="none" strokeWidth={10} />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          style={{ stroke: `var(${arc.color})` }}
          strokeWidth={10}
          strokeLinecap="butt"
          strokeDasharray={`${arc.dashArray[0]} ${arc.dashArray[1]}`}
          strokeDashoffset={arc.dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      ))}
      <text className={styles.percent} x={center} y={center - 1} textAnchor="middle" fontSize={20}>
        {formatPercent(percent)}
      </text>
      <text className={styles.caption} x={center} y={center + 14} textAnchor="middle" fontSize={9.5}>
        {caption}
      </text>
    </svg>
  );
}
