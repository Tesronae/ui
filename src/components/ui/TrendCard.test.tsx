// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrendCard, type TrendCardDay } from "./TrendCard";

const DAYS: TrendCardDay[] = [
  { value: 10, formatted: "AED 10.00", label: "Mon" },
  { value: 20, formatted: "AED 20.00", label: "Tue" },
  { value: 15, formatted: "AED 15.00", label: "Today" },
];

describe("TrendCard", () => {
  it("shows the resting value and delta until a day is read", () => {
    render(
      <TrendCard label="Sales today" spokenLabel="Sales today" value="AED 15.00" delta="+8%" days={DAYS} />,
    );
    expect(screen.getByText("AED 15.00")).toBeInTheDocument();
    expect(screen.getByText("+8%")).toBeInTheDocument();
  });

  it("swaps the value for the scrubbed day and hides the delta while reading, restoring on blur", () => {
    render(
      <TrendCard label="Sales today" spokenLabel="Sales today" value="AED 15.00" delta="+8%" days={DAYS} />,
    );
    const spark = screen.getByRole("img", { name: /Sales today/ });

    fireEvent.focus(spark); // focus reads the last day by default
    expect(screen.getByText("AED 15.00")).toBeInTheDocument();
    expect(screen.queryByText("+8%")).not.toBeInTheDocument();

    fireEvent.keyDown(spark, { key: "ArrowLeft" });
    expect(screen.getByText("AED 20.00")).toBeInTheDocument();

    fireEvent.keyDown(spark, { key: "Home" });
    expect(screen.getByText("AED 10.00")).toBeInTheDocument();

    fireEvent.blur(spark);
    expect(screen.getByText("AED 15.00")).toBeInTheDocument();
    expect(screen.getByText("+8%")).toBeInTheDocument();
  });

  it("preserves a styled value suffix during pointer and keyboard reads", () => {
    const days = DAYS.map((day) => ({ ...day, formatted: day.formatted.replace("AED ", "") }));
    render(<TrendCard label="Sales" spokenLabel="Sales" value="15.00" valueSuffix={<small>AED</small>} days={days} spokenUnit="AED" />);
    const suffix = screen.getByText("AED");
    const spark = screen.getByRole("img", { name: /Sales, last/ });
    spark.getBoundingClientRect = () => ({ left: 0, width: 96 }) as DOMRect;
    fireEvent.pointerMove(spark, { clientX: 0 });
    expect(screen.getByText("10.00")).toBeInTheDocument();
    expect(screen.getByText("AED")).toBe(suffix);
    fireEvent.pointerLeave(spark);
    expect(screen.getByText("15.00")).toBeInTheDocument();
    fireEvent.focus(spark);
    fireEvent.keyDown(spark, { key: "ArrowLeft" });
    expect(screen.getByText("20.00")).toBeInTheDocument();
    expect(screen.getByText("AED")).toBe(suffix);
    fireEvent.blur(spark);
    expect(screen.getByText("15.00")).toBeInTheDocument();
    expect(screen.getByText("AED")).toBe(suffix);
  });

  it("builds the sparkline's accessible name from spokenLabel and the first/last days", () => {
    render(
      <TrendCard
        label="Sales today"
        spokenLabel="Sales today"
        value="AED 15.00"
        days={DAYS}
        spokenUnit="AED"
      />,
    );
    expect(
      screen.getByRole("img", {
        name: "Sales today, last 3 days: from AED 10.00 AED on Mon to AED 15.00 AED today. Use the arrow keys to read each day.",
      }),
    ).toBeInTheDocument();
  });

  it("renders an owner-only lock badge with an accessible label when ownerOnly is set", () => {
    render(
      <TrendCard label="Stock value" spokenLabel="Stock value" value="AED 5,000" days={DAYS} ownerOnly />,
    );
    expect(screen.getByText("Owner only")).toBeInTheDocument();
  });
});
