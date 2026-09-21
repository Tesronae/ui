"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "../Icon";
import { Button } from "./Button";
import styles from "./Toast.module.css";

// Intl.NumberFormat's unit style, not a hardcoded "s" suffix (same reasoning
// as StockHealthRing's formatPercent) — locale-aware duration formatting
// instead of assuming the English "60s" convention.
const formatSeconds = (seconds: number) =>
  new Intl.NumberFormat(undefined, { style: "unit", unit: "second", unitDisplay: "narrow" }).format(seconds);

export function Toast({
  open,
  message,
  icon = "checkcircle",
  durationMs,
  actionLabel,
  onAction,
  onDismiss,
}: {
  open: boolean;
  message: string;
  icon?: IconName;
  durationMs: number;
  actionLabel?: string;
  onAction?: () => boolean | void | Promise<boolean | void>;
  onDismiss: () => void;
}) {
  // No effect resets this on `open`/`durationMs` change (react-hooks/set-
  // state-in-effect flags synchronous setState-in-effect as an anti-pattern)
  // — the caller must mount a fresh Toast (a distinct `key`) per occurrence,
  // which is the natural shape anyway: each stock movement's undo toast is a
  // new event, not the same instance being reopened.
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [deadline] = useState(() => Date.now() + durationMs);
  const [actionPending, setActionPending] = useState(false);
  const [countdownStopped, setCountdownStopped] = useState(false);

  useEffect(() => {
    if (!open || countdownStopped) return;

    const interval = setInterval(() => {
      const next = Math.max(0, deadline - Date.now());
      setRemainingMs(next);
      if (next === 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onDismiss identity churn must not restart the countdown
  }, [countdownStopped, deadline, open]);

  if (!open) return null;

  const handleAction = async () => {
    if (actionPending) return;
    setActionPending(true);
    setCountdownStopped(true);
    try {
      const shouldDismiss = await onAction?.();
      if (shouldDismiss !== false) onDismiss();
    } catch {
      // The action remains available. Its owner renders the operation error.
    } finally {
      setActionPending(false);
    }
  };

  return (
    <div className={styles.toast}>
      <div className={styles.icon}>
        <Icon name={icon} />
      </div>
      <div className={styles.body}>
        <span className={styles.message} role="status" aria-live="polite">
          {message}
        </span>
      </div>
      <span className={styles.countdown}>{formatSeconds(Math.ceil(remainingMs / 1000))}</span>
      {actionLabel ? (
        <Button variant="ghost" size="sm" disabled={actionPending} onClick={() => void handleAction()}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
