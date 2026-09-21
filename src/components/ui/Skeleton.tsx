import styles from "./Skeleton.module.css";

export function Skeleton({
  width,
  height = 10,
  className,
}: {
  width: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <div
      className={className ? `${styles.skeleton} ${className}` : styles.skeleton}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
