// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const OPTIONS = [
  { value: "battery", label: "Batteries" },
  { value: "filter", label: "Filters" },
  { value: "brake", label: "Brake System" },
];

describe("Select", () => {
  it("shows the placeholder when unselected, and the selected label when a value is set", () => {
    const { rerender } = render(
      <Select value="" options={OPTIONS} placeholder="All categories" onChange={() => {}} />,
    );
    expect(screen.getByRole("button")).toHaveTextContent("All categories");

    rerender(<Select value="filter" options={OPTIONS} placeholder="All categories" onChange={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent("Filters");
  });

  it("opens the listbox on trigger click, closed by default", async () => {
    render(<Select value="" options={OPTIONS} placeholder="p" onChange={() => {}} />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("selecting an option calls onChange with its value and closes the popover", async () => {
    const onChange = vi.fn();
    render(<Select value="" options={OPTIONS} placeholder="p" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("option", { name: "Filters" }));

    expect(onChange).toHaveBeenCalledWith("filter");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the currently selected option aria-selected", async () => {
    render(<Select value="filter" options={OPTIONS} placeholder="p" onChange={() => {}} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("option", { name: "Filters" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Batteries" })).toHaveAttribute("aria-selected", "false");
  });

  it("keyboard: ArrowDown moves the cursor, Enter selects the cursor's option", async () => {
    const onChange = vi.fn();
    render(<Select value="" options={OPTIONS} placeholder="p" onChange={onChange} />);
    const trigger = screen.getByRole("button");
    trigger.focus();
    await userEvent.keyboard("{Enter}"); // opens
    await userEvent.keyboard("{ArrowDown}{ArrowDown}"); // battery -> filter -> brake
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("brake");
  });

  it("Escape closes without calling onChange", async () => {
    const onChange = vi.fn();
    render(<Select value="" options={OPTIONS} placeholder="p" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes when clicking outside", async () => {
    render(
      <div>
        <Select value="" options={OPTIONS} placeholder="p" onChange={() => {}} />
        <button>outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole("button", { name: "p" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<Select value="" options={OPTIONS} placeholder="p" onChange={() => {}} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
