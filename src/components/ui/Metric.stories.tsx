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
  parameters: {
    docs: {
      description: {
        component:
          "A labeled number with an optional trend chart, for dashboard/report summary tiles. The `locked` branch is the sanctioned way to render \"this value is hidden by permission\" (e.g. cost/margin without `cost:read`) — it structurally cannot render `value`/`meta`/`chart` while locked, so a caller can't accidentally leak a permissioned number through it. Never pass `0` or an empty string as a stand-in for a locked value; use `locked` instead — see the `CostOmitted` story and `AGENTS.md`'s cost-omission invariant.",
      },
    },
  },
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
