// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "./Panel";
import { PanelPair } from "./PanelPair";

describe("PanelPair", () => {
  it("renders both panels, each still reachable as its own labelled region", () => {
    render(
      <PanelPair>
        <Panel title="Not selling">Body A</Panel>
        <Panel title="Expiring soon">Body B</Panel>
      </PanelPair>,
    );
    expect(screen.getByRole("region", { name: "Not selling" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Expiring soon" })).toBeInTheDocument();
  });

  it("preserves a panel's own className alongside the pair-item class it injects", () => {
    render(
      <PanelPair>
        <Panel title="Not selling" className="custom">
          Body
        </Panel>
      </PanelPair>,
    );
    expect(screen.getByRole("region", { name: "Not selling" })).toHaveClass("custom");
  });
});
