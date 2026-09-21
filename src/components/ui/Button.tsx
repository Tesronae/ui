"use client";

import type { ReactNode } from "react";
import styles from "./Button.module.css";

type CommonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "default" | "sm";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
};

// icon:true structurally requires aria-label — "icon
// modifier: square, icon-only, aria-label required." Enforced at compile
// time (see Button.test.tsx's @ts-expect-error case), not a runtime check
// that can silently pass in production.
type ButtonProps =
  | (CommonProps & { icon?: false; children: ReactNode })
  | (CommonProps & { icon: true; "aria-label": string; children?: ReactNode });

export function Button(props: ButtonProps) {
  const { variant = "secondary", size = "default", disabled, onClick, type = "button", icon, children } = props;

  const classNames = [styles.btn];
  if (variant !== "secondary") classNames.push(styles[variant]);
  if (size === "sm") classNames.push(styles.sm);
  if (icon) classNames.push(styles.icon);

  return (
    <button
      type={type}
      className={classNames.join(" ")}
      disabled={disabled}
      onClick={onClick}
      aria-label={icon ? props["aria-label"] : undefined}
    >
      {children}
    </button>
  );
}
