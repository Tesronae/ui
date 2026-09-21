// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pill } from "./Pill";

describe("Pill", () => {
  it("renders its children", () => {
    render(<Pill>Active</Pill>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it.each(["pos", "warn", "neg", "accent", "outline"] as const)(
    "applies a distinct class for the %s variant",
    (variant) => {
      const { container: neutral } = render(<Pill>x</Pill>);
      const { container: variantEl } = render(<Pill variant={variant}>x</Pill>);
      expect(neutral.firstElementChild?.className).not.toEqual(variantEl.firstElementChild?.className);
    },
  );
});
