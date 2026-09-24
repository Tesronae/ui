// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DotField } from "./DotField";

function mockMatchMedia(fine: boolean, reduceMotion: boolean) {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: query.includes("prefers-reduced-motion") ? reduceMotion : fine,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DotField — decorative, never content", () => {
  it("is aria-hidden regardless of eligibility", () => {
    mockMatchMedia(true, false);
    const { container } = render(<DotField />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the static fallback grid when `reduced` is passed, even on a fine pointer", () => {
    mockMatchMedia(true, false);
    const { container } = render(<DotField reduced />);
    expect(container.querySelector("canvas")).toHaveAttribute("hidden");
  });

  it("shows the static fallback grid when the device has no fine pointer", () => {
    mockMatchMedia(false, false);
    const { container } = render(<DotField />);
    expect(container.querySelector("canvas")).toHaveAttribute("hidden");
  });

  it("shows the static fallback grid under prefers-reduced-motion", () => {
    mockMatchMedia(true, true);
    const { container } = render(<DotField />);
    expect(container.querySelector("canvas")).toHaveAttribute("hidden");
  });

  it("unmounts without throwing (listener cleanup runs)", () => {
    mockMatchMedia(true, false);
    const { unmount } = render(<DotField />);
    expect(() => unmount()).not.toThrow();
  });
});
