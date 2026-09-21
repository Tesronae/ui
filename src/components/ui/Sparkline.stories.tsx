import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline";

const meta = {
  title: "Components/Charts/Sparkline",
  component: Sparkline,
  tags: ["maturity:stable"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Minimal trend line for a `Metric`'s `chart` slot or similar glance-level contexts. Decorative (`aria-hidden`) — never the sole place a trend or its direction is stated; say it in text nearby. `step` renders a step chart instead of a smooth line, for discrete/count data where interpolation between points would mislead. `zero` anchors the area fill to the zero baseline instead of the data's own min/max.",
      },
    },
  },
  args: { values: [3, 5, 4, 7, 6, 8, 7] },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

