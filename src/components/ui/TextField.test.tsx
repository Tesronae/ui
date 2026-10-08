// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("associates the label with the input and reports changes", async () => {
    const onChange = vi.fn();
    render(<TextField label="Email" value="" onChange={onChange} />);
    const input = screen.getByLabelText("Email");
    await userEvent.type(input, "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("shows the hint when valid, and the error instead when invalid", () => {
    const { rerender } = render(<TextField label="SKU" value="" onChange={() => {}} hint="e.g. BAT-AMR-N150" />);
    expect(screen.getByText("e.g. BAT-AMR-N150")).toBeInTheDocument();

    rerender(<TextField label="SKU" value="" onChange={() => {}} hint="e.g. BAT-AMR-N150" invalid errorMessage="SKU is required" />);
    expect(screen.getByText("SKU is required")).toBeInTheDocument();
    expect(screen.queryByText("e.g. BAT-AMR-N150")).not.toBeInTheDocument();
    expect(screen.getByLabelText("SKU")).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards the input ref and counter-specific native input behavior", () => {
    const inputRef = createRef<HTMLInputElement>();
    const onKeyDown = vi.fn();
    render(
      <TextField
        label="Quantity"
        value=""
        onChange={() => {}}
        inputRef={inputRef}
        inputMode="decimal"
        autoComplete="off"
        name="quantity"
        onKeyDown={onKeyDown}
      />,
    );

    expect(inputRef.current).toBe(screen.getByLabelText("Quantity"));
    expect(inputRef.current).toHaveAttribute("inputmode", "decimal");
    expect(inputRef.current).toHaveAttribute("autocomplete", "off");
    expect(inputRef.current).toHaveAttribute("name", "quantity");
    fireEvent.keyDown(inputRef.current!, { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("disables the input when disabled", () => {
    render(<TextField label="x" value="" onChange={() => {}} disabled />);
    expect(screen.getByLabelText("x")).toBeDisabled();
  });

  it("passes min/max/step to the native input", () => {
    render(<TextField label="Window" value="90" onChange={() => {}} type="number" min={1} max={730} step={1} />);
    const input = screen.getByLabelText("Window");
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "730");
    expect(input).toHaveAttribute("step", "1");
  });

  it("renders label, input and suffix on one row when inline, with a narrow centered input", () => {
    render(
      <TextField
        label="Show what expires within"
        value="90"
        onChange={() => {}}
        type="number"
        inline
        narrow
        suffix="days"
      />,
    );
    const input = screen.getByLabelText("Show what expires within");
    expect(screen.getByText("days")).toBeInTheDocument();
    expect(input.parentElement).toContainElement(screen.getByText("Show what expires within"));
    expect(input.parentElement).toContainElement(screen.getByText("days"));
  });

  it("omits the suffix when not given, even inline", () => {
    render(<TextField label="Window" value="90" onChange={() => {}} inline />);
    expect(screen.queryByText("days")).not.toBeInTheDocument();
  });
});
