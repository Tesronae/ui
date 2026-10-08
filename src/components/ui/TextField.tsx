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
  min,
  max,
  step,
  // A single row — label, input, unit — instead of the default label-above-
  // input stack. For a short bounded field read as one sentence (e.g. "Show
  // what expires within [90] days"), not a replacement for the stacked form.
  inline,
  // Trailing unit text after the input, only rendered with `inline`.
  suffix,
  // Fixed narrow width, centered text, no native spin-button arrows — for a
  // short numeric value sitting inline rather than filling the row.
  narrow,
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
  min?: number;
  max?: number;
  step?: number;
  inline?: boolean;
  suffix?: string;
  narrow?: boolean;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  const inputClassName = narrow ? `${styles.input} ${styles.narrow}` : styles.input;
  const help =
    invalid && errorMessage ? (
      <p id={helpId} className={styles.error}>
        {errorMessage}
      </p>
    ) : hint ? (
      <p id={helpId} className={styles.hint}>
        {hint}
      </p>
    ) : null;

  const input = (
    <input
      ref={inputRef}
      id={id}
      className={inputClassName}
      type={type}
      inputMode={inputMode}
      autoComplete={autoComplete}
      name={name}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      aria-invalid={invalid ? "true" : undefined}
      aria-describedby={invalid ? helpId : hint ? helpId : undefined}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );

  if (inline) {
    return (
      <div className={styles.field}>
        <div className={styles.fieldInline}>
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
          {input}
          {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
        </div>
        {help}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {input}
      {help}
    </div>
  );
}
