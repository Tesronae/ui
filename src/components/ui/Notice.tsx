import type { ReactNode } from "react";
import { Icon, type IconName } from "../Icon";
import styles from "./Notice.module.css";

export function Notice({
  icon,
  title,
  variant,
  action,
  children,
}: {
  icon: IconName;
  title: string;
  variant?: "neg" | "warn" | "pos";
  action?: ReactNode;
  children: ReactNode;
}) {
  const className = variant ? `${styles.notice} ${styles[variant]}` : styles.notice;
  return (
    <div className={className}>
      <div className={styles.icon}>
        <Icon name={icon} />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <p>{children}</p>
      </div>
      {action ? <div className={styles.actions}>{action}</div> : null}
    </div>
  );
}
