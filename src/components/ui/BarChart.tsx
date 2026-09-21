import { buildBars } from "./chart-math";
import styles from "./BarChart.module.css";

export function BarChart({
  values,
  width = 96,
  height = 28,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  const result = buildBars(values, { width, height });

  return (
    <svg width={result.width} height={result.height} viewBox={`0 0 ${result.width} ${result.height}`} aria-hidden="true">
      {result.bars.map((bar, i) => (
        <rect
          key={i}
          className={bar.isLast ? `${styles.bar} ${styles.hi}` : styles.bar}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          rx={1}
        />
      ))}
    </svg>
  );
}
