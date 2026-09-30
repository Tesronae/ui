// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RingGauge } from "./RingGauge";

describe("RingGauge", () => {
  it("renders one arc per non-zero segment plus the track, and the caption prop verbatim", () => {
    const { container } = render(
      <RingGauge
        segments={[
          { id: "healthy", value: 75, color: "--ring-1" },
          { id: "out", value: 25, color: "--ring-3" },
        ]}
        caption="healthy"
      />,
    );
    // 1 track circle + 2 arc circles, no hit circles (no handlers passed)
    expect(container.querySelectorAll("circle")).toHaveLength(3);
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("healthy")).toBeInTheDocument();
  });

  it("omits a zero-value segment's arc", () => {
    const { container } = render(
      <RingGauge
        segments={[
          { id: "healthy", value: 100, color: "--ring-1" },
          { id: "low", value: 0, color: "--ring-2" },
        ]}
        caption="ok"
      />,
    );
    expect(container.querySelectorAll("circle")).toHaveLength(2); // track + 1 arc
  });

  it("renders centerValue/centerCaption overrides instead of the computed percent", () => {
    render(
      <RingGauge
        segments={[{ id: "healthy", value: 75, color: "--ring-1" }]}
        caption="healthy"
        centerValue="12"
        centerCaption="items"
      />,
    );
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("items")).toBeInTheDocument();
    expect(screen.queryByText("100%")).not.toBeInTheDocument();
  });

  it("adds a wider hit circle per arc only when a hover or click handler is passed", () => {
    const segments = [{ id: "healthy", value: 100, color: "--ring-1" }];
    const { container: bare } = render(<RingGauge segments={segments} caption="ok" />);
    expect(bare.querySelectorAll("circle")).toHaveLength(2); // track + 1 arc, no hit

    const { container: withHandler } = render(
      <RingGauge segments={segments} caption="ok" onSegmentClick={() => {}} />,
    );
    expect(withHandler.querySelectorAll("circle")).toHaveLength(3); // track + arc + hit
  });

  it("calls onSegmentClick with the clicked segment's id", async () => {
    const onSegmentClick = vi.fn();
    const { container } = render(
      <RingGauge
        segments={[{ id: "out", value: 100, color: "--ring-3" }]}
        caption="ok"
        onSegmentClick={onSegmentClick}
      />,
    );
    const hit = container.querySelector('circle[data-hit="out"]');
    expect(hit).toBeTruthy();
    await userEvent.click(hit!);
    expect(onSegmentClick).toHaveBeenCalledWith("out");
  });
});
