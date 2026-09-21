// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  it("renders an svg sized to the given width/height", () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} width={96} height={30} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "96");
    expect(svg).toHaveAttribute("height", "30");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("changing values changes the rendered path", () => {
    const { container: a } = render(<Sparkline values={[1, 2, 3]} />);
    const { container: b } = render(<Sparkline values={[3, 2, 1]} />);
    const pathA = a.querySelector("path")?.getAttribute("d");
    const pathB = b.querySelector("path")?.getAttribute("d");
    expect(pathA).not.toEqual(pathB);
  });
});
