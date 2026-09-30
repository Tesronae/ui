"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { buildRingArcs, type RingSegment } from "./chart-math";
import styles from "./RingGauge.module.css";

// Intl.NumberFormat, not a hardcoded "%" literal (this package's own
// string-externalization invariant, enforced by react/jsx-no-literals) —
// lets the runtime place the percent sign per-locale rather than assuming
// the English "75%" convention everywhere.
const formatPercent = (value: number) =>
  new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 0 }).format(value / 100);

const DRAW_IN_DURATION = 440;
const DRAW_IN_STAGGER = 60;
const DRAW_IN_EASING = "cubic-bezier(0.23, 1, 0.32, 1)";

export function RingGauge({
  segments,
  size = 104,
  strokeWidth = 10,
  caption,
  centerValue,
  centerCaption,
  activeSegmentId = null,
  onSegmentHover,
  onSegmentClick,
  animate = true,
}: {
  segments: RingSegment[];
  size?: number;
  strokeWidth?: number;
  caption: string;
  /** Overrides the default auto-computed "first segment's share" percent —
   * pass whatever value/caption should show at rest, e.g. a raw count
   * rather than a percentage. The caller also uses this to swap in a
   * peeked segment's own value while `activeSegmentId` highlights it. */
  centerValue?: ReactNode;
  centerCaption?: ReactNode;
  /** Segment id to visually emphasize — dims every other arc. The caller
   * owns what "active" means (hover, a paired legend, a click-to-filter
   * selection) and is responsible for updating `centerValue`/`centerCaption`
   * to match; this component only renders what it's given. */
  activeSegmentId?: string | null;
  onSegmentHover?: (id: string | null) => void;
  onSegmentClick?: (id: string) => void;
  animate?: boolean;
}) {
  const { radius, percent, arcs } = buildRingArcs(segments, size, strokeWidth);
  const center = size / 2;
  const interactive = Boolean(onSegmentHover || onSegmentClick);
  const arcRefs = useRef<(SVGCircleElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!animate) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? true;
    if (reduceMotion) return;
    arcRefs.current.forEach((el, i) => {
      if (!el?.animate) return;
      const arc = arcs[i];
      if (!arc) return;
      const full = `${arc.dashArray[0]} ${arc.dashArray[1]}`;
      el.animate([{ strokeDasharray: `0 ${arc.dashArray[0] + arc.dashArray[1]}` }, { strokeDasharray: full }], {
        duration: DRAW_IN_DURATION,
        delay: i * DRAW_IN_STAGGER,
        easing: DRAW_IN_EASING,
        fill: "backwards",
      });
    });
    // Draw-in plays once, on mount, against whichever segments were passed
    // first — a live value update afterward should not re-trigger it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle className={styles.track} cx={center} cy={center} r={radius} fill="none" strokeWidth={strokeWidth} />
      {arcs.map((arc, i) => (
        <circle
          key={arc.id}
          ref={(el) => {
            arcRefs.current[i] = el;
          }}
          className={activeSegmentId && activeSegmentId !== arc.id ? styles.arcDimmed : styles.arc}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          style={{ stroke: `var(${arc.color})` }}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={`${arc.dashArray[0]} ${arc.dashArray[1]}`}
          strokeDashoffset={arc.dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      ))}
      {interactive
        ? arcs.map((arc) => (
            <circle
              key={`hit-${arc.id}`}
              className={styles.hit}
              data-hit={arc.id}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth + 16}
              strokeDasharray={`${arc.dashArray[0]} ${arc.dashArray[1]}`}
              strokeDashoffset={arc.dashOffset}
              transform={`rotate(-90 ${center} ${center})`}
              onPointerEnter={(e) => e.pointerType !== "touch" && onSegmentHover?.(arc.id)}
              onPointerLeave={(e) => e.pointerType !== "touch" && onSegmentHover?.(null)}
              onClick={() => onSegmentClick?.(arc.id)}
            />
          ))
        : null}
      <text className={styles.percent} x={center} y={center - 1} textAnchor="middle" fontSize={20}>
        {centerValue ?? formatPercent(percent)}
      </text>
      <text className={styles.caption} x={center} y={center + 14} textAnchor="middle" fontSize={9.5}>
        {centerCaption ?? caption}
      </text>
    </svg>
  );
}
