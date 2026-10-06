// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TintedNotice, type TintedNoticeTone } from "./TintedNotice";
import styles from "./TintedNotice.module.css";

describe("TintedNotice", () => {
  it("renders a title and body", () => {
    render(<TintedNotice title="Couldn't sign in">Something went wrong.</TintedNotice>);
    expect(screen.getByText("Couldn't sign in")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("uses role=alert for neg/warn tones and role=status otherwise", () => {
    const { unmount } = render(
      <TintedNotice tone="neg" title="x">
        y
      </TintedNotice>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    unmount();

    render(
      <TintedNotice tone="info" title="x">
        y
      </TintedNotice>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("carries the tone's own tinted class for every tone", () => {
    const expected: Record<TintedNoticeTone, string | undefined> = {
      neg: styles.neg,
      warn: styles.warn,
      pos: styles.pos,
      info: styles.info,
    };
    for (const tone of Object.keys(expected) as TintedNoticeTone[]) {
      const { unmount } = render(
        <TintedNotice tone={tone} title="x">
          y
        </TintedNotice>,
      );
      expect(screen.getByRole(tone === "neg" || tone === "warn" ? "alert" : "status"), `tone=${tone}`).toHaveClass(
        expected[tone]!,
      );
      unmount();
    }
  });

  it("renders an optional action inside the body for layout=stacked (default)", () => {
    render(
      <TintedNotice title="x" action={<button type="button">Retry</button>}>
        y
      </TintedNotice>,
    );
    const action = screen.getByRole("button", { name: "Retry" });
    expect(action).toBeInTheDocument();
    expect(action.closest(`.${styles.body}`)).not.toBeNull();
  });

  it("renders the action outside .body, as its own cell, for layout=inline", () => {
    render(
      <TintedNotice title="x" layout="inline" action={<button type="button">Review item</button>}>
        y
      </TintedNotice>,
    );
    const action = screen.getByRole("button", { name: "Review item" });
    expect(action.closest(`.${styles.body}`)).toBeNull();
    expect(action.closest(`.${styles.inlineAction}`)).not.toBeNull();
  });

  it("renders no dismiss button when onDismiss is omitted", () => {
    render(
      <TintedNotice title="x" tone="pos">
        y
      </TintedNotice>,
    );
    expect(screen.queryByRole("button", { name: "Dismiss notice" })).not.toBeInTheDocument();
  });

  it("calls onDismiss when its close button is clicked", async () => {
    const onDismiss = vi.fn();
    render(
      <TintedNotice title="x" tone="pos" onDismiss={onDismiss} animate={false}>
        y
      </TintedNotice>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Dismiss notice" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses a caller-supplied dismissLabel", () => {
    render(
      <TintedNotice title="x" onDismiss={() => {}} dismissLabel="Close alert">
        y
      </TintedNotice>,
    );
    expect(screen.getByRole("button", { name: "Close alert" })).toBeInTheDocument();
  });

  // jsdom has no Element.animate, so every case above already exercises the
  // `typeof el.animate !== "function"` guard; this only proves the explicit
  // animate=false opt-out renders cleanly on its own.
  it("renders with animate=false", () => {
    render(
      <TintedNotice title="x" animate={false}>
        y
      </TintedNotice>,
    );
    expect(screen.getByText("x")).toBeInTheDocument();
  });
});
