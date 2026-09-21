// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("reflects the pressed prop via aria-pressed", () => {
    const { rerender } = render(
      <Chip pressed={false} onClick={() => {}}>
        In stock
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "In stock" })).toHaveAttribute("aria-pressed", "false");

    rerender(
      <Chip pressed onClick={() => {}}>
        In stock
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "In stock" })).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      <Chip pressed={false} onClick={onClick}>
        x
      </Chip>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
