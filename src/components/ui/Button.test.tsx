// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each(["primary", "secondary", "ghost", "danger"] as const)(
    "applies a distinct class for the %s variant",
    (variant) => {
      const { container: secondary } = render(<Button variant="secondary">x</Button>);
      const { container: variantEl } = render(<Button variant={variant}>x</Button>);
      if (variant === "secondary") return;
      expect(secondary.firstElementChild?.className).not.toEqual(variantEl.firstElementChild?.className);
    },
  );

  it("is disabled and non-interactive when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        x
      </Button>,
    );
    const button = screen.getByRole("button", { name: "x" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders an icon-only button with its required aria-label as the accessible name", () => {
    render(<Button icon aria-label="Close" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("TYPE-LEVEL: icon-only buttons require aria-label at compile time", () => {
    // @ts-expect-error -- icon:true without aria-label must fail typecheck;
    // an unused directive here (i.e. it compiling fine) fails `tsc --noEmit`,
    // so this stays a live gate, same pattern as decimal-brand-safety.ts.
    const jsx = <Button icon onClick={() => {}} />;
    expect(jsx).toBeTruthy();
  });
});
