// @vitest-environment jsdom
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the message and a live countdown that ticks down", () => {
    render(
      <Toast open message="Stock out recorded" durationMs={60_000} onDismiss={() => {}} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Stock out recorded");
    expect(screen.getByText("60s")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("59s")).toBeInTheDocument();
  });

  it("calls onDismiss exactly once when the countdown reaches zero, then stops", () => {
    const onDismiss = vi.fn();
    render(<Toast open message="m" durationMs={3000} onDismiss={onDismiss} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("clicking the action calls onAction then onDismiss, and cancels the countdown", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onDismiss = vi.fn();
    render(
      <Toast open message="m" durationMs={60_000} actionLabel="Undo" onAction={onAction} onDismiss={onDismiss} />,
    );

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("derives remaining time from a deadline after timer throttling", () => {
    vi.setSystemTime(new Date("2026-09-13T00:00:00.000Z"));
    const onDismiss = vi.fn();
    render(<Toast open message="m" durationMs={60_000} onDismiss={onDismiss} />);

    vi.setSystemTime(new Date("2026-09-13T00:00:59.000Z"));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("disables an asynchronous action, prevents repeats, and dismisses after confirmation", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const pending = deferred<boolean>();
    const onAction = vi.fn().mockReturnValue(pending.promise);
    const onDismiss = vi.fn();
    render(
      <Toast open message="m" durationMs={60_000} actionLabel="Undo" onAction={onAction} onDismiss={onDismiss} />,
    );

    const action = screen.getByRole("button", { name: "Undo" });
    await user.click(action);
    await user.click(action);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(action).toBeDisabled();
    expect(onDismiss).not.toHaveBeenCalled();

    pending.resolve(true);
    await act(async () => {});
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("stays open and re-enables the action when confirmation returns false", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Toast
        open
        message="m"
        durationMs={60_000}
        actionLabel="Undo"
        onAction={async () => false}
        onDismiss={onDismiss}
      />,
    );

    const action = screen.getByRole("button", { name: "Undo" });
    await user.click(action);
    await waitFor(() => expect(action).toBeEnabled());
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("renders nothing when closed", () => {
    render(<Toast open={false} message="m" durationMs={1000} onDismiss={() => {}} />);
    expect(screen.queryByText("m")).not.toBeInTheDocument();
  });
});
