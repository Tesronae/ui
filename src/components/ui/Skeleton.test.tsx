// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton — the only loading affordance", () => {
  it("is decorative (aria-hidden) and sizes itself from props", () => {
    const { container } = render(<Skeleton width={120} height={10} />);
    const el = container.firstElementChild;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveStyle({ width: "120px", height: "10px" });
  });

  it("accepts string dimensions (e.g. percentages) unchanged", () => {
    const { container } = render(<Skeleton width="100%" height={10} />);
    expect(container.firstElementChild).toHaveStyle({ width: "100%" });
  });

  it("disables its own sweep animation under prefers-reduced-motion, as a self-contained package component must (no consumer-global stylesheet to rely on)", () => {
    const css = readFileSync(
      join(import.meta.dirname, "Skeleton.module.css"),
      "utf8",
    );
    const reducedMotionBlock = css.match(
      /@media \(prefers-reduced-motion: reduce\)\s*{([^}]*}[^}]*)}/,
    );
    expect(reducedMotionBlock).not.toBeNull();
    expect(reducedMotionBlock![1]).toMatch(/animation:\s*none/);
  });
});
