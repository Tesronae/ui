// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Add part" description="d">
        <input />
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title, description and children when open", () => {
    render(
      <Modal open onClose={() => {}} title="Add part" description="One-line description">
        <p>body content</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add part")).toBeInTheDocument();
    expect(screen.getByText("One-line description")).toBeInTheDocument();
    expect(screen.getByText("body content")).toBeInTheDocument();
  });

  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="t" description="d">
        <p>x</p>
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on backdrop click, not on a click inside the modal", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="t" description="d">
        <p>inside</p>
      </Modal>,
    );
    await userEvent.click(screen.getByText("inside"));
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the first input on open", async () => {
    render(
      <Modal open onClose={() => {}} title="t" description="d">
        <input data-testid="first" />
      </Modal>,
    );
    await waitFor(() => expect(screen.getByTestId("first")).toHaveFocus());
  });
});
