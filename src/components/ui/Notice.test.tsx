// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Notice } from "./Notice";

describe("Notice", () => {
  it("renders title, body and an optional action", () => {
    render(
      <Notice icon="alert" title="Out of stock" variant="neg" action={<button>Reorder</button>}>
        Nothing left to sell.
      </Notice>,
    );
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    expect(screen.getByText("Nothing left to sell.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reorder" })).toBeInTheDocument();
  });

  it("applies a distinct class per variant, including the neutral default", () => {
    const { container: neutral } = render(
      <Notice icon="info" title="t">
        b
      </Notice>,
    );
    const { container: neg } = render(
      <Notice icon="alert" title="t" variant="neg">
        b
      </Notice>,
    );
    expect(neutral.firstElementChild?.className).not.toEqual(neg.firstElementChild?.className);
  });
});
