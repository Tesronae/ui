import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";

const meta = {
  title: "Components/Charts/Bar Chart",
  component: BarChart,
  tags: ["maturity:stable"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact bar-chart primitive for a metric's trend, most often inside `Metric`'s `chart` slot. Purely decorative (`aria-hidden`) — always pair it with a real numeric value and label elsewhere; it must never be the only place a number is shown. No built-in axis, legend, or tooltip: a glance-level trend indicator, not an analytical chart. Renders from a plain `number[]` — convert decimal-string quantities before passing them in.",
      },
    },
  },
  args: { values: [3, 5, 4, 7, 6, 8, 7] },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

