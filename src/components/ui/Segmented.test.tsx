// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Segmented, type SegmentedOption } from "./Segmented";

const OPTIONS: SegmentedOption[] = [
  { id: "all", label: "To do", count: 12 },
  { id: "out", label: "Out of stock", count: 3 },
  { id: "ordered", label: "Ordered", count: 0, disabled: true },
];

describe("Segmented", () => {
  it("marks the active option pressed and the rest not", () => {
    render(<Segmented options={OPTIONS} value="all" onChange={() => {}} ariaLabel="Show parts" />);
    expect(screen.getByRole("button", { name: /To do/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Out of stock/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the clicked option's id", async () => {
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} value="all" onChange={onChange} ariaLabel="Show parts" />);
    await userEvent.click(screen.getByRole("button", { name: /Out of stock/ }));
    expect(onChange).toHaveBeenCalledWith("out");
  });

  it("disables an empty bucket instead of hiding it", () => {
    render(<Segmented options={OPTIONS} value="all" onChange={() => {}} ariaLabel="Show parts" />);
    const ordered = screen.getByRole("button", { name: /Ordered/ });
    expect(ordered).toBeVisible();
    expect(ordered).toBeDisabled();
  });

  it("renders the count for each option", () => {
    render(<Segmented options={OPTIONS} value="all" onChange={() => {}} ariaLabel="Show parts" />);
    expect(screen.getByRole("button", { name: /To do/ })).toHaveTextContent("12");
  });

  it("renders the group with the given aria-label and no count when omitted", () => {
    render(
      <Segmented
        options={[{ id: "day", label: "Day" }]}
        value="day"
        onChange={() => {}}
        ariaLabel="Range"
      />,
    );
    expect(screen.getByRole("group", { name: "Range" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Day" })).toHaveTextContent("Day");
  });
});
