// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "./Panel";

describe("Panel", () => {
  it("renders as a labelled section with the title as its accessible name", () => {
    render(
      <Panel title="Inventory actions">
        <p>Body</p>
      </Panel>,
    );
    expect(screen.getByRole("region", { name: "Inventory actions" })).toBeInTheDocument();
  });

  it("renders headerExtra beside the title and footer below the body", () => {
    render(
      <Panel title="Not selling" headerExtra={<span>12</span>} footer={<span>All parts</span>}>
        <p>Body</p>
      </Panel>,
    );
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("All parts")).toBeInTheDocument();
  });

  it("omits the footer element entirely when none is passed", () => {
    const { container } = render(<Panel title="No footer">Body</Panel>);
    expect(container.querySelector("footer")).not.toBeInTheDocument();
  });
});
