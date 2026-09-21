"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "../Icon";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

// Custom popover dropdown (deliberately not a native <select>). Focus
// stays on the trigger throughout — arrow keys move a visual cursor
// (.dd-l button.is-cursor in the prototype), Enter commits it, matching a
// combobox-style keyboard model rather than moving DOM focus into the list.
//
// `cursor` is null whenever there is no explicit arrow-key cursor yet (just
// opened, or just closed) — the effective cursor then falls back to the
// selected option. It is only ever set inside event handlers (open/close/
// arrow keys), never synced from an effect: an earlier version reset it to
// the selection inside a useEffect on `open`, which both
// react-hooks/set-state-in-effect and react-hooks/refs correctly flagged as
// the "sync derived state" anti-pattern.
export function Select({
  value,
  options,
  placeholder,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Needed whenever more than one Select sits on a screen with no
   * visible field label of its own (e.g. a filter row) — otherwise the
   * trigger's accessible name is just the selected option's text, which
   * can't distinguish "which dropdown is this" once something is picked. */
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const effectiveCursor = cursor ?? (selectedIndex >= 0 ? selectedIndex : 0);

  const close = () => {
    setOpen(false);
    setCursor(null);
  };

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(Math.min(effectiveCursor + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(Math.max(effectiveCursor - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(effectiveCursor);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={onKeyDown}
      >
        <span className={selectedOption ? styles.value : `${styles.value} ${styles.placeholder}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.chevron}>
          <Icon name="down" size={16} />
        </span>
      </button>
      {open ? (
        <div className={styles.list} role="listbox">
          {options.map((option, i) => {
            const isSelected = option.value === value;
            const className = [
              styles.option,
              i === effectiveCursor ? styles.cursor : "",
              isSelected ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                className={className}
                onMouseEnter={() => setCursor(i)}
                onClick={() => commit(i)}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <span className={styles.check}>
                    <Icon name="check" size={14} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
