// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarChart } from "./BarChart";

describe("BarChart", () => {
  it("renders one rect per value, and marks only the last one highlighted", () => {
    const { container } = render(<BarChart values={[1, 2, 3]} />);
    const rects = container.querySelectorAll("rect");
    expect(rects).toHaveLength(3);
    expect(rects[0]?.getAttribute("class")).not.toMatch(/hi/);
    expect(rects[1]?.getAttribute("class")).not.toMatch(/hi/);
    expect(rects[2]?.getAttribute("class")).toMatch(/hi/);
  });
});
