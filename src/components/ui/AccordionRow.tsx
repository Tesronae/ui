"use client";

import { useId, type ReactNode } from "react";
import { Icon } from "../Icon";
import styles from "./AccordionRow.module.css";

/**
 * One collapsible row in an action list (a `Sheet`'s body, typically).
 * Fully controlled — `open`/`onToggle` are the caller's state, so "only one
 * row open at a time" is a data-flow choice the caller makes (one `openId`
 * variable), not behaviour this component enforces on its own.
 */
export function AccordionRow({
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  title: ReactNode;
  summary?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const bodyId = useId();
  return (
    <div className={styles.row} data-open={open}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={onToggle}
      >
        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          {summary ? <span className={styles.summary}>{summary}</span> : null}
        </span>
        <Icon name="down" size={14} />
      </button>
      <div id={bodyId} className={styles.body} hidden={!open}>
        {open ? children : null}
      </div>
    </div>
  );
}
