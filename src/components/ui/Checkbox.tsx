"use client";

import { useId, type ReactNode } from "react";
import styles from "./Checkbox.module.css";

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  invalid,
  errorMessage,
  name,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  name?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label className={styles.chk}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          disabled={disabled}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{label}</span>
      </label>
      {invalid && errorMessage ? (
        <p id={errorId} className={styles.error}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
