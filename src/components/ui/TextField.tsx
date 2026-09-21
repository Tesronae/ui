"use client";

import {
  useId,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type Ref,
} from "react";
import styles from "./TextField.module.css";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  invalid,
  errorMessage,
  hint,
  type = "text",
  inputRef,
  inputMode,
  autoComplete,
  name,
  onKeyDown,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  hint?: string;
  type?: string;
  inputRef?: Ref<HTMLInputElement>;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  name?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        className={styles.input}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid ? "true" : undefined}
        aria-describedby={invalid ? helpId : hint ? helpId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {invalid && errorMessage ? (
        <p id={helpId} className={styles.error}>
          {errorMessage}
        </p>
      ) : hint ? (
        <p id={helpId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
