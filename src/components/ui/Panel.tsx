"use client";

import { useId, type ReactNode } from "react";
import styles from "./Panel.module.css";

export function Panel({
  title,
  headerExtra,
  footer,
  children,
  className,
}: {
  title: ReactNode;
  /** Rendered after the title in the header row — a count, a segmented
   * filter, an action button. */
  headerExtra?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** Set by `PanelPair` when this panel is paired with another — not
   * meant to be passed directly by a normal caller. */
  className?: string;
}) {
  const titleId = useId();
  return (
    <section
      className={className ? `${styles.panel} ${className}` : styles.panel}
      aria-labelledby={titleId}
    >
      <header className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {headerExtra}
      </header>
      <div className={styles.body}>{children}</div>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </section>
  );
}
