"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Icon, type IconName } from "../Icon";
import styles from "./TintedNotice.module.css";

// Tinted-surface banner — background, border and icon all carry the tone
// color together, unlike Notice (src/components/ui/Notice.tsx), which keeps
// a neutral surface plus a 3px edge stripe for a supporting aside next to
// other content. Pick TintedNotice when the state itself is the point: a
// logged-out confirmation, a session/connectivity notice, a negative-stock
// alert on a dashboard.
//
// Promoted from IMS-web's `src/components/auth/AuthNotice.tsx` (its own
// AGENTS.md W1.5.3/W1.5.33) — ported near-verbatim, including its entrance
// motion, with three package-boundary changes: no next-intl dependency (a
// `dismissLabel` prop instead, same default-English-string shape as
// `Modal.tsx`'s `closeLabel`), reduced-motion read inline via `matchMedia`
// rather than a consuming app's own hook (this package's own convention —
// see RingGauge/Segmented/Sheet), and an `animate` opt-out (RingGauge's
// precedent) so stories/tests can disable the WAAPI sequences. `layout`
// is the one genuinely new capability: "stacked" is the auth treatment (a
// bordered icon chip, the action below the body); "inline" is the dashboard
// treatment (a bare tone-colored icon, the action beside the body).
//
// A first attempt at this generalization (the now-abandoned
// `phase1.5-tinted-notice` branch) shipped CSS-keyframe motion with no tone
// scheme and a hardcoded aria-label — AuthNotice.tsx's own WAAPI sequences
// superseded it before it was ever released; this is that second, matured
// version promoted back out.
export type TintedNoticeTone = "neg" | "warn" | "pos" | "info";

const DEFAULT_ICON: Record<TintedNoticeTone, IconName> = {
  neg: "alert",
  warn: "clock",
  pos: "checkcircle",
  info: "info",
};

// Duplicated from --ease-out: the Web Animations API can't read CSS custom
// properties from an `easing` option.
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

function prefersReducedMotion(): boolean {
  // Fails closed to "reduced" (no window, no matchMedia, SSR) rather than
  // open — the same convention RingGauge/Segmented/Sheet already use.
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? true;
}

export function TintedNotice({
  tone = "info",
  icon,
  title,
  children,
  action,
  onDismiss,
  dismissLabel = "Dismiss notice",
  layout = "stacked",
  animate = true,
}: {
  tone?: TintedNoticeTone;
  icon?: IconName;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  // Omit to render a non-dismissible notice. The caller owns what
  // "dismissed" means (unmount, hide, clear a flag) — this component plays
  // its own exit motion, then calls back once it's done.
  onDismiss?: () => void;
  // No i18n dependency in this package (Modal.tsx's own reasoning) — the
  // consuming app passes its own translated string.
  dismissLabel?: string;
  // "stacked": bordered icon chip, action inside the body, below the text.
  // "inline": bare tone-colored icon, action as a third row cell beside
  // the body — the dashboard negative-stock banner's shape.
  layout?: "stacked" | "inline";
  // Set false to skip the mount/dismiss WAAPI sequences entirely (tests,
  // a consumer that plays its own entrance instead).
  animate?: boolean;
}) {
  const role = tone === "neg" || tone === "warn" ? "alert" : "status";
  const wrapRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const dismissing = useRef(false);

  // Plays once per mount only — this component is always rendered
  // conditionally by its callers, so every appearance is a genuine fresh
  // mount, matching the design artifact's own "only animate a truly new
  // notice" guard.
  useLayoutEffect(() => {
    if (!animate) return;
    const wrap = wrapRef.current;
    const el = noticeRef.current;
    if (!wrap || !el || typeof el.animate !== "function") return;

    const reduceMotion = prefersReducedMotion();

    if (reduceMotion) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: EASE_OUT });
      return;
    }

    wrap.animate([{ gridTemplateRows: "0fr" }, { gridTemplateRows: "1fr" }], {
      duration: 300,
      easing: EASE_OUT,
    });

    if (tone === "pos") {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: EASE_OUT });
      chipRef.current?.querySelectorAll("svg > *").forEach((node, i) => {
        const shape = node as SVGGraphicsElement;
        if (typeof shape.animate !== "function") return;
        shape.setAttribute("pathLength", "1");
        shape.style.strokeDasharray = "1";
        shape.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
          duration: 420,
          delay: 90 + i * 130,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          fill: "backwards",
        });
      });
      [titleRef.current, bodyRef.current].forEach((line, i) => {
        line?.animate(
          [
            { opacity: 0, transform: "translateY(4px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 280, delay: 180 + i * 50, easing: EASE_OUT, fill: "backwards" },
        );
      });
      return;
    }

    if (tone === "info") {
      el.animate(
        [
          { opacity: 0, filter: "blur(8px)", transform: "scale(1.015)" },
          { opacity: 1, filter: "blur(0px)", transform: "none" },
        ],
        { duration: 360, easing: EASE_OUT },
      );
      return;
    }

    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: EASE_OUT });
    el.animate([{ transform: "translateY(-10px) scale(0.985)" }, { transform: "none" }], {
      duration: 380,
      easing: EASE_OUT,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- entrance plays once per mount; tone/animate are read at that instant, not tracked afterward
  }, []);

  const handleDismiss = () => {
    if (!onDismiss || dismissing.current) return;
    dismissing.current = true;
    const wrap = wrapRef.current;
    const el = noticeRef.current;
    if (!animate || !wrap || !el || typeof el.animate !== "function") {
      onDismiss();
      return;
    }
    const reduceMotion = prefersReducedMotion();
    el.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: reduceMotion ? "none" : "translateY(-4px)" },
      ],
      { duration: reduceMotion ? 120 : 150, easing: EASE_OUT, fill: "forwards" },
    )
      .finished.then(() =>
        reduceMotion
          ? undefined
          : wrap.animate([{ gridTemplateRows: "1fr" }, { gridTemplateRows: "0fr" }], {
              duration: 220,
              easing: EASE_OUT,
              fill: "forwards",
            }).finished,
      )
      .then(onDismiss)
      .catch(onDismiss);
  };

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.wrapIn}>
        <div ref={noticeRef} className={`${styles.notice} ${styles[tone]} ${styles[layout]}`} role={role}>
          <span ref={chipRef} className={styles.chip} aria-hidden="true">
            <Icon name={icon ?? DEFAULT_ICON[tone]} size={18} />
          </span>
          <div className={styles.body}>
            <div ref={titleRef} className={styles.title}>
              {title}
            </div>
            <p ref={bodyRef}>{children}</p>
            {layout === "stacked" && action ? <div className={styles.actions}>{action}</div> : null}
          </div>
          {layout === "inline" && action ? <div className={styles.inlineAction}>{action}</div> : null}
          {onDismiss ? (
            <button type="button" className={styles.dismiss} onClick={handleDismiss} aria-label={dismissLabel}>
              <Icon name="x" size={15} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
