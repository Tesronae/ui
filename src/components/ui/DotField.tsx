"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { buildDotGrid, stepDots, type DotPoint } from "./dot-field-math";
import styles from "./DotField.module.css";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const REST_COLOR = "#e4e7ec";
const HOT_COLOR = "#2b59f0";

export function DotField({
  gap = 24,
  radius = 118,
  push = 26,
  ease = 0.17,
  reduced = false,
  className,
}: {
  /** Spacing between dots on both axes, in px. */
  gap?: number;
  /** Cursor influence radius, in px. */
  radius?: number;
  /** Maximum displacement at the cursor's centre, in px. */
  push?: number;
  /** Per-frame lerp coefficient toward the target position (not a spring). */
  ease?: number;
  /**
   * Forces the static fallback grid regardless of the OS setting. Storybook's
   * "Motion: reduced" toolbar only forces CSS animation/transition durations
   * to near-zero — it cannot stop a requestAnimationFrame loop — so a review
   * story wires this prop to the toolbar's motion global instead.
   */
  reduced?: boolean;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setEligible(fine.matches && !reduceMotion.matches);
    update();
    fine.addEventListener("change", update);
    reduceMotion.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduceMotion.removeEventListener("change", update);
    };
  }, []);

  const active = eligible && !reduced;

  useEffect(() => {
    if (!active) return;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let points: DotPoint[] = [];
    let width = 0;
    let height = 0;
    let mx = -1e5;
    let my = -1e5;
    let raf = 0;
    let restColor = REST_COLOR;
    let hotColor = HOT_COLOR;

    const readColor = () => {
      const cs = getComputedStyle(document.documentElement);
      restColor = cs.getPropertyValue("--line").trim() || restColor;
      hotColor = cs.getPropertyValue("--accent").trim() || hotColor;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const { busy, near } = stepDots(points, mx, my, { radius, push, ease });
      const nearSet = new Set(near.map((n) => n.point));

      ctx.beginPath();
      for (const p of points) {
        if (nearSet.has(p)) continue;
        ctx.moveTo(p.cx + 1, p.cy);
        ctx.arc(p.cx, p.cy, 1, 0, Math.PI * 2);
      }
      ctx.fillStyle = restColor;
      ctx.fill();

      if (near.length) {
        ctx.beginPath();
        for (const { point: p, hot } of near) {
          const r = 1 + hot * 1.1;
          ctx.moveTo(p.cx + r, p.cy);
          ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = hotColor;
        ctx.fill();
      }

      raf = busy ? requestAnimationFrame(draw) : 0;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = buildDotGrid(rect.width, rect.height, gap);
      draw();
    };

    const wake = () => {
      if (!raf) {
        readColor();
        raf = requestAnimationFrame(draw);
      }
    };

    // Tracked at the window, not the host: this element is a decorative
    // overlay (pointer-events: none throughout) meant to sit beside real
    // content as a sibling, not wrap it. A host-scoped listener would miss
    // pointer activity over that content — bubbling only travels up the
    // ancestor chain, and a sibling isn't one.
    const handleMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      wake();
    };
    const handleLeave = () => {
      mx = -1e5;
      my = -1e5;
      wake();
    };

    readColor();
    build();
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave, { passive: true });

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(build);
      ro.observe(host);
    } else {
      build();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [active, gap, radius, push, ease]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-live={active || undefined}
      className={className ? `${styles.host} ${className}` : styles.host}
      style={{ "--dotfield-gap": `${gap}px` } as CSSProperties}
    >
      <canvas ref={canvasRef} className={styles.canvas} hidden={!active} />
    </div>
  );
}
