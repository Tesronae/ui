// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Sheet } from "./Sheet";

describe("Sheet", () => {
  it("renders nothing when closed, and the dialog with its title when open", () => {
    const { rerender } = render(
      <Sheet open={false} onClose={() => {}} title="Amaron N150">
        Body
      </Sheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Sheet open onClose={() => {}} title="Amaron N150">
        Body
      </Sheet>,
    );
    expect(screen.getByRole("dialog", { name: "Amaron N150" })).toBeInTheDocument();
  });

  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="Amaron N150">
        <button type="button">Focus me</button>
      </Sheet>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the scrim backdrop is clicked but not when the panel itself is", async () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="Amaron N150">
        <button type="button">Inside</button>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Inside" }));
    expect(onClose).not.toHaveBeenCalled();

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog.parentElement!); // the scrim itself, not the panel
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("traps Tab focus within the panel", async () => {
    render(
      <Sheet open onClose={() => {}} title="Amaron N150" footer={<button type="button">Save</button>}>
        <button type="button">Only field</button>
      </Sheet>,
    );
    const closeButton = screen.getByRole("button", { name: "Close" });
    const onlyField = screen.getByRole("button", { name: "Only field" });
    const save = screen.getByRole("button", { name: "Save" });

    expect(closeButton).toHaveFocus(); // first focusable on open
    save.focus();
    await userEvent.tab();
    expect(closeButton).toHaveFocus(); // wraps from last back to first

    closeButton.focus();
    await userEvent.tab({ shift: true });
    expect(save).toHaveFocus(); // wraps from first back to last
    void onlyField;
  });

  it("locks and restores body scroll while open", () => {
    const { unmount } = render(
      <Sheet open onClose={() => {}} title="Amaron N150">
        Body
      </Sheet>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
