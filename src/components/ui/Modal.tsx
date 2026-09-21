"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "../Icon";
import { Button } from "./Button";
import styles from "./Modal.module.css";

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  // No i18n dependency in this package (the same reasoning that decided
  // this repo: a design-system package must not assume next-intl, or any
  // i18n library, since future consumers may use neither) — the consuming
  // app passes its own translated string, with a plain English default so
  // the component still works with zero configuration.
  closeLabel = "Close",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
  closeLabel?: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const firstField = bodyRef.current?.querySelector<HTMLElement>("input, textarea, select, button");
    firstField?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.scrim}
      data-testid="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className={styles.header}>
          <div>
            <h2 id="modal-title">{title}</h2>
            <p>{description}</p>
          </div>
          <div className={styles.headerClose}>
            <Button icon size="sm" variant="ghost" aria-label={closeLabel} onClick={onClose}>
              <Icon name="x" size={16} />
            </Button>
          </div>
        </header>
        <div className={styles.body} ref={bodyRef}>
          {children}
        </div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>
  );
}
