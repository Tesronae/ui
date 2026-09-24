// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("reflects the checked prop", () => {
    const { rerender } = render(<Checkbox label="Keep me signed in" checked={false} onChange={() => {}} />);
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).not.toBeChecked();

    rerender(<Checkbox label="Keep me signed in" checked onChange={() => {}} />);
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).toBeChecked();
  });

  it("calls onChange with the new checked state", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Keep me signed in" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders an error message and marks the input invalid", () => {
    render(
      <Checkbox
        label="I agree to the terms"
        checked={false}
        onChange={() => {}}
        invalid
        errorMessage="You must agree to continue."
      />,
    );
    const input = screen.getByRole("checkbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("You must agree to continue.")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-describedby", screen.getByText("You must agree to continue.").id);
  });

  it("does not respond to clicks when disabled", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Keep me signed in" checked={false} onChange={onChange} disabled />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
