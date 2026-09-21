// @vitest-environment jsdom
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
});
