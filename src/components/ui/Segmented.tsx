"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./Segmented.module.css";

export interface SegmentedOption {
  id: string;
  label: string;
  /** Shown as a small trailing count, e.g. a bucket size. Omit for no count. */
  count?: number;
  /** Disabled when the bucket it represents is empty — never hidden, so the
   * control's shape doesn't shift as data changes. */
  disabled?: boolean;
}

export function Segmented({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const lastRect = useRef<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const group = groupRef.current;
    const indicator = indicatorRef.current;
    if (!group || !indicator) return;

    const place = (animate: boolean) => {
      const active = group.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!active) return;
      const next = { x: active.offsetLeft, w: active.offsetWidth };
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? true;
      if (animate && lastRect.current && !reduceMotion && indicator.animate) {
        indicator.animate(
          [
            { transform: `translateX(${lastRect.current.x}px)`, width: `${lastRect.current.w}px` },
            { transform: `translateX(${next.x}px)`, width: `${next.w}px` },
          ],
          { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
        );
      }
      indicator.style.width = `${next.w}px`;
      indicator.style.transform = `translateX(${next.x}px)`;
      lastRect.current = next;
    };

    place(true);

    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [value, options]);

  return (
    <div className={styles.group} role="group" aria-label={ariaLabel} ref={groupRef}>
      <span className={styles.indicator} aria-hidden="true" ref={indicatorRef} />
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={styles.segment}
          aria-pressed={value === option.id}
          disabled={option.disabled}
          onClick={() => onChange(option.id)}
        >
          {option.label}
          {option.count !== undefined ? <span className={styles.count}>{option.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
