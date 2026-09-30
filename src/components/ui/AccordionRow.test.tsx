// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AccordionRow } from "./AccordionRow";

describe("AccordionRow", () => {
  it("reflects open via aria-expanded and hides the body when closed", () => {
    const { rerender } = render(
      <AccordionRow title="Reorder" open={false} onToggle={() => {}}>
        <p>Body</p>
      </AccordionRow>,
    );
    const header = screen.getByRole("button", { name: "Reorder" });
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Body")).not.toBeInTheDocument();

    rerender(
      <AccordionRow title="Reorder" open onToggle={() => {}}>
        <p>Body</p>
      </AccordionRow>,
    );
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("calls onToggle when the header is clicked", async () => {
    const onToggle = vi.fn();
    render(
      <AccordionRow title="Reorder" open={false} onToggle={onToggle}>
        <p>Body</p>
      </AccordionRow>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Reorder" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders the summary beside the title", () => {
    render(
      <AccordionRow title="Reorder" summary="12 units" open={false} onToggle={() => {}}>
        <p>Body</p>
      </AccordionRow>,
    );
    expect(screen.getByText("12 units")).toBeInTheDocument();
  });
});
