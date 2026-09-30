"use client";

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import styles from "./PanelPair.module.css";

/**
 * Two-up layout for a pair of `Panel`s whose header/body/footer rows stay
 * aligned across both — both panels' titles sit on one baseline, both
 * footers sit on one baseline, regardless of which panel's body is taller.
 * Implemented with CSS subgrid: this component owns the shared row tracks,
 * each child `Panel` adopts them via `grid-template-rows: subgrid`. Below
 * its own measured width (not the page's), it degrades to two stacked,
 * independently-sized panels.
 */
export function PanelPair({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pair}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const element = child as ReactElement<{ className?: string }>;
        const existing = element.props.className;
        return cloneElement(element, {
          className: existing ? `${styles.pairItem} ${existing}` : styles.pairItem,
        });
      })}
    </div>
  );
}
