import type { Meta, StoryObj } from "@storybook/react-vite";
import { Metric } from "./Metric";
import { Sparkline } from "./Sparkline";

function MetricPreview({ kind }: { kind: "default" | "chart" | "locked" }) {
  if (kind === "locked") {
    return (
      <Metric
        label="Stock value"
        locked
        lockedExplanation="Your role does not include cost prices."
      />
    );
  }

  return (
    <Metric
      label="Movements today"
      value="34"
      meta="20 in · 14 out"
      chart={kind === "chart" ? <Sparkline values={[3, 5, 4, 7, 6, 8, 7]} /> : undefined}
    />
  );
}

const meta = {
  title: "Components/Metric",
  component: MetricPreview,
  tags: ["maturity:stable"],
  decorators: [(Story) => <div className="ims-story-surface"><Story /></div>],
} satisfies Meta<typeof MetricPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { kind: "default" },
};

export const WithChart: Story = {
  args: { kind: "chart" },
};

export const CostOmitted: Story = {
  args: { kind: "locked" },
};
