"use client";

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Icon } from "../Icon";
import { Button } from "./Button";
import styles from "./Sheet.module.css";

const DISMISS_RATIO = 0.25;
const FLICK_VELOCITY_PX_MS = 0.11;
const DRAG_SLOP_PX = 4;
const FOCUSABLE = 'button, input, select, textarea, a[href], [tabindex]';

function focusableControls(panel: HTMLElement): HTMLElement[] {
  const controls = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => {
    if (el.tabIndex < 0 || el.matches(":disabled") || el.closest("[hidden], [inert]")) return false;
    for (let node: HTMLElement | null = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") return false;
    }
    return true;
  });
  return controls.filter((el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== "radio" || !el.name) return true;
    const group = controls.filter((other) => other instanceof HTMLInputElement && other.type === "radio" && other.name === el.name && other.form === el.form) as HTMLInputElement[];
    return el === (group.find((radio) => radio.checked) ?? group[0]);
  });
}

interface DragState {
  startX: number;
  startY: number;
  axis: "x" | "y";
  direction: 1 | -1;
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
  presentation = "edge",
  headerLeading,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  closeLabel?: string;
  presentation?: "edge" | "floating";
  headerLeading?: ReactNode;
}) {
  const [present, setPresent] = useState(open);
  const [previousOpen, setPreviousOpen] = useState(open);
  const view = { title, description, footer, children, headerLeading };
  const [retained, setRetained] = useState(view);
  // Keep the outgoing content while callers clear their selected item.
  if (open && (retained.title !== title || retained.description !== description || retained.footer !== footer ||
      retained.children !== children || retained.headerLeading !== headerLeading)) setRetained(view);
  if (previousOpen !== open) {
    setPreviousOpen(open);
    if (open) setPresent(true);
  }
  const displayed = open ? view : retained;
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFirst = () => (panel && focusableControls(panel)[0] || panel)?.focus();
    focusFirst();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusable = focusableControls(panel);
      if (!focusable.length) { e.preventDefault(); panel.focus(); return; }
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
    const onFocusIn = (e: FocusEvent) => {
      if (panel && e.target instanceof Node && !panel.contains(e.target)) focusFirst();
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
      dragRef.current = null;
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open || !present) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const duration = reduced ? 0 : getComputedStyle(panelRef.current!).transitionDuration
      .split(",").reduce((max, part) => Math.max(max, Number.parseFloat(part) * (part.trim().endsWith("ms") ? 1 : 1000) || 0), 0);
    const timer = window.setTimeout(() => setPresent(false), duration + (duration ? 32 : 0));
    return () => window.clearTimeout(timer);
  }, [open, present]);

  const onGrabPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, input, select, textarea, a, [role=button]")) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? true) return;
    const panel = panelRef.current;
    if (!panel) return;
    const vertical = window.matchMedia?.("(max-width: 720px)")?.matches ?? true;
    dragRef.current = { startX: e.clientX, startY: e.clientY, axis: vertical ? "y" : "x", direction: getComputedStyle(panel).direction === "rtl" ? -1 : 1, dragging: false, startedAt: performance.now() };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onGrabPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    const panel = panelRef.current;
    if (!state || !panel) return;
    const raw = state.axis === "y" ? e.clientY - state.startY : (e.clientX - state.startX) * state.direction;
    if (!state.dragging && Math.abs(raw) < DRAG_SLOP_PX) return;
    state.dragging = true;
    panel.classList.add(styles.dragging!);
    scrimRef.current?.classList.add(styles.dragging!);
    const size = state.axis === "y" ? panel.offsetHeight : panel.offsetWidth;
    // Rubber-band resistance past the origin — a swipe the "wrong" way
    // (back toward open) shouldn't move the panel 1:1.
    const resisted = raw >= 0 ? raw : -Math.sqrt(-raw) * 2.5;
    const clamped = Math.max(0, resisted);
    panel.style.transform = state.axis === "y" ? `translate3d(0, ${clamped}px, 0)` : `translate3d(${clamped * state.direction}px, 0, 0)`;
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
    if (!state.dragging || e.type !== "pointerup") return;
    const raw = state.axis === "y" ? e.clientY - state.startY : (e.clientX - state.startX) * state.direction;
    const distance = Math.max(0, raw);
    const size = state.axis === "y" ? panel.offsetHeight : panel.offsetWidth;
    const elapsed = Math.max(1, performance.now() - state.startedAt);
    const velocity = distance / elapsed;
    if (distance > 0 && (distance >= size * DISMISS_RATIO || velocity > FLICK_VELOCITY_PX_MS)) onClose();
  };

  if (!open && !present) return null;

  return (
    <div
      ref={scrimRef}
      className={styles.scrim}
      data-state={open ? "open" : "closed"}
      inert={!open}
      aria-hidden={!open || undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className={`${styles.sheet} ${presentation === "floating" ? styles.floating : ""}`} data-presentation={presentation} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div
          className={styles.header}
          onPointerDown={onGrabPointerDown}
          onPointerMove={onGrabPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        >
          <span className={styles.grab} aria-hidden="true" />
          {displayed.headerLeading ? <div className={styles.headerLeading}>{displayed.headerLeading}</div> : null}
          <div className={styles.titleBlock}>
            <h2 id={titleId} className={styles.title}>
              {displayed.title}
            </h2>
            {displayed.description ? <p className={styles.description}>{displayed.description}</p> : null}
          </div>
          <div className={styles.headerClose}>
            <Button icon size="sm" variant="ghost" aria-label={closeLabel} onClick={onClose}>
              <Icon name="x" size={16} />
            </Button>
          </div>
        </div>
        <div className={styles.body} tabIndex={0}>{displayed.children}</div>
        {displayed.footer ? <div className={styles.footer}>{displayed.footer}</div> : null}
      </div>
    </div>
  );
}
