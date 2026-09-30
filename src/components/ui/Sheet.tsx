"use client";

import { useEffect, useId, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Icon } from "../Icon";
import { Button } from "./Button";
import styles from "./Sheet.module.css";

const DISMISS_RATIO = 0.25;
const FLICK_VELOCITY_PX_MS = 0.11;
const DRAG_SLOP_PX = 4;
const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

interface DragState {
  startX: number;
  startY: number;
  axis: "x" | "y";
  dragging: boolean;
  startedAt: number;
}

/**
 * A generic scrim + edge-anchored panel: a right-side inset panel at
 * ≥721px, a bottom sheet below it, with drag-to-dismiss on touch (skipped
 * entirely under reduced motion), Escape to close, and a Tab/Shift+Tab
 * focus trap. This is the shell only — domain content (which action a row
 * represents, what it posts, its own recommended-action logic) belongs to
 * the consumer, not this package (see this repo's AGENTS.md "no
 * consumer-specific behaviour"). Pair with `AccordionRow` for the body's
 * action list.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  closeLabel = "Close",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  closeLabel?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.getAttribute("type") !== "radio" || (el as HTMLInputElement).checked,
      );
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const onGrabPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, input, a")) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? true) return;
    const panel = panelRef.current;
    if (!panel) return;
    const vertical = window.matchMedia?.("(max-width: 720px)")?.matches ?? true;
    dragRef.current = { startX: e.clientX, startY: e.clientY, axis: vertical ? "y" : "x", dragging: false, startedAt: performance.now() };
    panel.setPointerCapture?.(e.pointerId);
  };

  const onGrabPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    const panel = panelRef.current;
    if (!state || !panel) return;
    const raw = state.axis === "y" ? e.clientY - state.startY : e.clientX - state.startX;
    if (!state.dragging && Math.abs(raw) < DRAG_SLOP_PX) return;
    state.dragging = true;
    panel.classList.add(styles.dragging!);
    scrimRef.current?.classList.add(styles.dragging!);
    const size = state.axis === "y" ? panel.offsetHeight : panel.offsetWidth;
    // Rubber-band resistance past the origin — a swipe the "wrong" way
    // (back toward open) shouldn't move the panel 1:1.
    const resisted = raw >= 0 ? raw : -Math.sqrt(-raw) * 2.5;
    const clamped = Math.max(0, resisted);
    panel.style.transform = state.axis === "y" ? `translate3d(0, ${clamped}px, 0)` : `translate3d(${clamped}px, 0, 0)`;
    scrimRef.current?.style.setProperty("--sheet-fade", String(Math.max(0, 1 - clamped / size)));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    const panel = panelRef.current;
    dragRef.current = null;
    if (!state || !panel) return;
    panel.classList.remove(styles.dragging!);
    scrimRef.current?.classList.remove(styles.dragging!);
    panel.style.transform = "";
    scrimRef.current?.style.removeProperty("--sheet-fade");
    if (!state.dragging) return;
    const raw = state.axis === "y" ? e.clientY - state.startY : e.clientX - state.startX;
    const distance = Math.max(0, raw);
    const size = state.axis === "y" ? panel.offsetHeight : panel.offsetWidth;
    const elapsed = Math.max(1, performance.now() - state.startedAt);
    const velocity = distance / elapsed;
    if (distance > 0 && (distance >= size * DISMISS_RATIO || velocity > FLICK_VELOCITY_PX_MS)) onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={scrimRef}
      className={styles.scrim}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div
          className={styles.header}
          onPointerDown={onGrabPointerDown}
          onPointerMove={onGrabPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className={styles.grab} aria-hidden="true" />
          <div className={styles.titleBlock}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          <div className={styles.headerClose}>
            <Button icon size="sm" variant="ghost" aria-label={closeLabel} onClick={onClose}>
              <Icon name="x" size={16} />
            </Button>
          </div>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
