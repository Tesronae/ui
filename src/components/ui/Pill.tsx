import type { ReactNode } from "react";
import styles from "./Pill.module.css";

export function Pill({
  variant,
  size = "default",
  children,
}: {
  variant?: "pos" | "warn" | "neg" | "accent" | "outline";
  /** "compact": a smaller, fully-rounded shape (3px 7px 3px 5px padding,
   * `--r-full`) for a figure read inline next to other text, e.g. a KPI
   * card's delta — distinct from "default"'s larger `--r-sm` shape, built
   * for a table/row status cell with more room around it. */
  size?: "default" | "compact";
  children: ReactNode;
}) {
  const className = [styles.pill, variant ? styles[variant] : undefined, size === "compact" ? styles.compact : undefined]
    .filter(Boolean)
    .join(" ");
  return <span className={className}>{children}</span>;
}
