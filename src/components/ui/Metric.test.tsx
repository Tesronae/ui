// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Metric } from "./Metric";

describe("Metric", () => {
  it("renders label, value and meta", () => {
    render(<Metric label="Stock value" value="4,977.45" meta="+3.2% this week" />);
    expect(screen.getByText("Stock value")).toBeInTheDocument();
    expect(screen.getByText("4,977.45")).toBeInTheDocument();
    expect(screen.getByText("+3.2% this week")).toBeInTheDocument();
  });

  it("renders an optional chart", () => {
    render(<Metric label="l" value="v" chart={<span data-testid="chart" />} />);
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  it("accepts a compound label, e.g. text plus a role badge", () => {
    render(
      <Metric
        label={<>Stock value <span data-testid="badge">Owner</span></>}
        value="4,977.45"
      />,
    );
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  describe("locked variant (cost-omission invariant)", () => {
    it("never renders the value, even if one is passed by mistake", () => {
      render(<Metric label="Stock value" value="4,977.45" locked lockedExplanation="Your role does not include cost prices" />);
      expect(screen.queryByText("4,977.45")).not.toBeInTheDocument();
    });

    it("never renders a zero or blank in place of the number — only the explanation", () => {
      render(<Metric label="Margin" value="0" locked lockedExplanation="Your role does not include cost prices" />);
      expect(screen.queryByText("0")).not.toBeInTheDocument();
      expect(screen.getByText("Your role does not include cost prices")).toBeInTheDocument();
    });

    it("still renders the label", () => {
      render(<Metric label="Stock value" value="x" locked lockedExplanation="explanation" />);
      expect(screen.getByText("Stock value")).toBeInTheDocument();
    });
  });
});
