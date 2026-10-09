"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Icon } from "../Icon";
import { buildSparkline } from "./chart-math";
import styles from "./TrendCard.module.css";

const WIDTH = 96;
const HEIGHT = 48;
const ANNOUNCE_DELAY_MS = 40;

export interface TrendCardDay {
  /** Plotted for the sparkline's curve shape only — never rendered as
   * exact text (mirrors Sparkline/BarChart's existing `number[]`
   * precedent: presentation-only, no decimal meaning). */
  value: number;
  /** Exact formatted text for this day, shown in place of `value` while
   * scrubbing — the caller formats this through its own decimal library. */
  formatted: string;
  /** Day label shown while scrubbing, e.g. "Today" or a weekday name. */
  label: string;
}

export function TrendCard({
  label,
  value,
  valueSuffix,
  delta,
  days,
  tone = "neutral",
  ownerOnly = false,
  ownerOnlyLabel = "Owner only",
  spokenUnit,
  spokenLabel,
}: {
  label: ReactNode;
  /** Plain-text version of `label`, for the sparkline's own accessible
   * name — kept separate because `label` may be JSX (e.g. wrapping a
   * lock badge) and can't safely be coerced to a string. */
  spokenLabel: string;
  /** The resting display value — shown until a day is scrubbed. */
  value: ReactNode;
  /** Persistent styled unit/suffix, outside the value swapped while scrubbing.
   * Supply its plain-text equivalent separately through spokenUnit. */
  valueSuffix?: ReactNode;
  /** A pill/indicator built by the caller (locale/plural copy lives there,
   * not in this package) — hidden while a day is being read. */
  delta?: ReactNode;
  /** 14 days is the usual case, but any length works. */
  days: TrendCardDay[];
  tone?: "good" | "bad" | "neutral";
  ownerOnly?: boolean;
  ownerOnlyLabel?: string;
  /** Appended to the per-day announcement and the accessible label, e.g.
   * "items sold" or "AED". */
  spokenUnit?: string;
}) {
  const [readingIndex, setReadingIndex] = useState<number | null>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const gradientId = useId();

  const { areaPath, linePath, points } = buildSparkline(
    days.map((d) => d.value),
    { width: WIDTH, height: HEIGHT },
  );

  const read = (i: number) => {
    setReadingIndex(i);
    const day = days[i];
    const live = liveRef.current;
    if (!day || !live) return;
    const text = spokenUnit ? `${day.label}, ${day.formatted} ${spokenUnit}` : `${day.label}, ${day.formatted}`;
    // Clear first so a repeated identical announcement still fires — an
    // aria-live region only announces on a text change.
    live.textContent = "";
    window.setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = text;
    }, ANNOUNCE_DELAY_MS);
  };
  const clear = () => setReadingIndex(null);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || days.length < 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.round(ratio * (days.length - 1));
    read(Math.min(days.length - 1, Math.max(0, i)));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const current = readingIndex ?? days.length - 1;
    if (e.key === "ArrowLeft") read(Math.max(0, current - 1));
    else if (e.key === "ArrowRight") read(Math.min(days.length - 1, current + 1));
    else if (e.key === "Home") read(0);
    else read(days.length - 1);
  };

  const reading = readingIndex !== null ? days[readingIndex] : null;
  const point = readingIndex !== null ? points[readingIndex] : points[points.length - 1];

  const first = days[0];
  const last = days[days.length - 1];
  const ariaLabel =
    first && last
      ? spokenUnit
        ? `${spokenLabel}, last ${days.length} days: from ${first.formatted} ${spokenUnit} on ${first.label} to ${last.formatted} ${spokenUnit} today. Use the arrow keys to read each day.`
        : `${spokenLabel}, last ${days.length} days: from ${first.formatted} on ${first.label} to ${last.formatted} today. Use the arrow keys to read each day.`
      : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>
          {label}
          {ownerOnly ? (
            <span className={styles.ownerLock} title={ownerOnlyLabel}>
              <Icon name="lock" size={12} />
              <span className={styles.sr}>{ownerOnlyLabel}</span>
            </span>
          ) : null}
        </span>
        {readingIndex === null ? (
          delta
        ) : reading ? (
          <span className={styles.dayLabel}>{reading.label}</span>
        ) : null}
      </div>
      <div className={styles.value} data-reading={readingIndex !== null}>
        {readingIndex === null ? value : reading?.formatted}
        {valueSuffix}
      </div>
      <div
        className={styles.spark}
        data-tone={tone}
        data-reading={readingIndex !== null}
        tabIndex={0}
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onPointerMove}
        onPointerLeave={clear}
        onFocus={() => read(days.length - 1)}
        onBlur={clear}
        onKeyDown={onKeyDown}
      >
        <svg
          className={styles.svg}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.area} d={areaPath} fill={`url(#${gradientId})`} />
          <path
            className={styles.line}
            d={linePath}
            fill="none"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className={styles.crosshair} aria-hidden="true" style={point ? { left: `${(point.x / WIDTH) * 100}%` } : undefined} />
        {point ? (
          <span
            className={styles.dot}
            aria-hidden="true"
            style={{ left: `${(point.x / WIDTH) * 100}%`, top: `${(point.y / HEIGHT) * 100}%` }}
          />
        ) : null}
      </div>
      <span className={styles.sr} aria-live="polite" ref={liveRef} />
    </div>
  );
}
