// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RingGauge } from "./RingGauge";

describe("RingGauge", () => {
  it("renders one arc per non-zero segment plus the track, and the caption prop verbatim", () => {
    const { container } = render(
      <RingGauge
        segments={[
          { value: 75, color: "--ring-1" },
          { value: 25, color: "--ring-3" },
        ]}
        caption="healthy"
      />,
    );
    // 1 track circle + 2 arc circles
    expect(container.querySelectorAll("circle")).toHaveLength(3);
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("healthy")).toBeInTheDocument();
  });

  it("omits a zero-value segment's arc", () => {
    const { container } = render(
      <RingGauge segments={[{ value: 100, color: "--ring-1" }, { value: 0, color: "--ring-2" }]} caption="ok" />,
    );
    expect(container.querySelectorAll("circle")).toHaveLength(2); // track + 1 arc
  });
});
