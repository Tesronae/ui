import type { ReactNode } from "react";
import { Icon } from "../Icon";
import styles from "./Metric.module.css";

type MetricProps =
  | {
      label: ReactNode;
      value: ReactNode;
      meta?: ReactNode;
      chart?: ReactNode;
      locked?: false;
    }
  | {
      label: ReactNode;
      // Accepted so a caller can't accidentally satisfy the type by omitting
      // `value` instead of setting `locked` — but see the render branch
      // below: whatever is passed here is never rendered while locked.
      value?: ReactNode;
      locked: true;
      lockedExplanation: string;
    };

// A general omission rule, not specific to any one metric: "never show a
// zero or blank in place of a hidden
// number; omit it entirely with an explanation." The locked branch below
// structurally cannot reach `value`/`meta`/`chart` — there is no code path
// from a locked MetricProps to rendering them, not just a runtime check.
export function Metric(props: MetricProps) {
  if (props.locked) {
    return (
      <div className={styles.metric}>
        <div className={styles.label}>{props.label}</div>
        <div className={styles.lockedValue}>
          <Icon name="lock" size={14} />
          {props.lockedExplanation}
        </div>
      </div>
    );
  }

  const { label, value, meta, chart } = props;
  return (
    <div className={styles.metric}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {meta ? <div className={styles.meta}>{meta}</div> : null}
      {chart ? <div className={styles.chart}>{chart}</div> : null}
    </div>
  );
}
