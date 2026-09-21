import { buildSparkline } from "./chart-math";
import styles from "./Sparkline.module.css";

export function Sparkline({
  values,
  width = 96,
  height = 30,
  step = false,
  zero = false,
}: {
  values: number[];
  width?: number;
  height?: number;
  step?: boolean;
  zero?: boolean;
}) {
  const { areaPath, linePath, lastPoint } = buildSparkline(values, { width, height, step, zero });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path className={styles.area} d={areaPath} />
      <path className={styles.line} d={linePath} />
      <circle className={styles.point} cx={lastPoint.x} cy={lastPoint.y} r={2} />
    </svg>
  );
}
