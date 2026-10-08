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
  it("supports floating presentation and a leading header slot without changing the default", () => {
    const { rerender } = render(<Sheet open onClose={() => {}} title="Title" presentation="floating" headerLeading={<span>Thumbnail</span>}>Body</Sheet>);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-presentation", "floating");
    expect(screen.getByText("Thumbnail")).toBeInTheDocument();
    rerender(<Sheet open onClose={() => {}} title="Title">Body</Sheet>);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-presentation", "edge");
  });

  it("restores trigger focus and does not reset focus when the close callback changes", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const { rerender, unmount } = render(<Sheet open onClose={() => {}} title="Title"><input aria-label="Quantity" /></Sheet>);
    const input = screen.getByRole("textbox", { name: "Quantity" });
    input.focus();
    rerender(<Sheet open onClose={() => {}} title="Title"><input aria-label="Quantity" /></Sheet>);
    expect(input).toHaveFocus();
    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it("traps focus around hidden, inert, negative-tabindex and disabled controls", async () => {
    render(<Sheet open onClose={() => {}} title="Title" footer={<>
      <button>Save</button><button hidden>Hidden</button><div style={{ display: "none" }}><button>Collapsed</button></div>
      <div inert><button>Inert</button></div><button tabIndex={-1}>Excluded</button><button disabled>Disabled</button>
    </>}><select aria-label="Choice"><option>One</option></select><textarea aria-label="Notes" /></Sheet>);
    screen.getByRole("button", { name: "Close" }).focus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("uses the checked radio, or first radio when none is checked, as the group tab stop", async () => {
    render(<Sheet open onClose={() => {}} title="Title"><input type="radio" name="action" aria-label="First" /><input type="radio" name="action" aria-label="Second" /></Sheet>);
    screen.getByRole("radio", { name: "First" }).focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("returns escaped programmatic focus to the dialog", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    const { unmount } = render(<Sheet open onClose={() => {}} title="Title">Body</Sheet>);
    outside.focus();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    unmount();
    outside.remove();
  });

  it("cancels an interrupted RTL drag without dismissing", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    const onClose = vi.fn();
    const { unmount } = render(<Sheet open presentation="floating" onClose={onClose} title="Title">Body</Sheet>);
    const dialog = screen.getByRole("dialog");
    dialog.style.direction = "rtl";
    const header = screen.getByRole("heading", { name: "Title" }).parentElement!.parentElement!;
    fireEvent.pointerDown(header, { clientX: 200, clientY: 0 });
    fireEvent.pointerMove(header, { clientX: 100, clientY: 0 });
    expect(dialog.style.transform).toBe("translate3d(-100px, 0, 0)");
    fireEvent.pointerCancel(header, { clientX: 100, clientY: 0 });
    expect(dialog.style.transform).toBe("");
    expect(onClose).not.toHaveBeenCalled();
    unmount();
    vi.unstubAllGlobals();
  });

  it("skips gesture motion under reduced motion", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const onClose = vi.fn();
    const { unmount } = render(<Sheet open presentation="floating" onClose={onClose} title="Title">Body</Sheet>);
    const dialog = screen.getByRole("dialog");
    const header = screen.getByRole("heading", { name: "Title" }).parentElement!.parentElement!;
    fireEvent.pointerDown(header, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(header, { clientX: 300, clientY: 300 });
    fireEvent.pointerUp(header, { clientX: 300, clientY: 300 });
    expect(dialog.style.transform).toBe("");
    expect(onClose).not.toHaveBeenCalled();
    unmount();
    vi.unstubAllGlobals();
  });

  it("captures pointer events on the header that owns the drag handlers", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    const { unmount } = render(<Sheet open onClose={() => {}} title="Title">Body</Sheet>);
    const dialog = screen.getByRole("dialog");
    const header = screen.getByRole("heading").parentElement!.parentElement!;
    const capture = vi.fn();
    header.setPointerCapture = capture;
    dialog.setPointerCapture = vi.fn();
    fireEvent.pointerDown(header, { clientX: 0, clientY: 0 });
    expect(capture).toHaveBeenCalledTimes(1);
    expect(dialog.setPointerCapture).not.toHaveBeenCalled();
    unmount();
    vi.unstubAllGlobals();
  });

});

it("allows keyboard users to focus a read-only scrolling body", async () => {
  render(<Sheet open presentation="floating" onClose={() => {}} title="Inventory"><p>Read-only stock facts</p></Sheet>);
  const body = screen.getByText("Read-only stock facts").parentElement!;
  expect(body).toHaveAttribute("tabindex", "0");
  await userEvent.tab();
  expect(body).toHaveFocus();
});
