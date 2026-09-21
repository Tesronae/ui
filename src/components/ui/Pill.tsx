import type { ReactNode } from "react";
import styles from "./Pill.module.css";

export function Pill({
  variant,
  children,
}: {
  variant?: "pos" | "warn" | "neg" | "accent" | "outline";
  children: ReactNode;
}) {
  const className = variant ? `${styles.pill} ${styles[variant]}` : styles.pill;
  return <span className={className}>{children}</span>;
}
