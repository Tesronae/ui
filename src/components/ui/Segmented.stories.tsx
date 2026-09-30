import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Segmented, type SegmentedOption } from "./Segmented";

const OPTIONS: SegmentedOption[] = [
  { id: "all", label: "To do", count: 12 },
  { id: "out", label: "Out of stock", count: 3 },
  { id: "low", label: "Low", count: 9 },
  { id: "ordered", label: "Ordered", count: 0, disabled: true },
];

function Controlled({ options }: { options: SegmentedOption[] }) {
  const [value, setValue] = useState(options[0]!.id);
  return <Segmented options={options} value={value} onChange={setValue} ariaLabel="Show parts" />;
}

const meta = {
  title: "Components/Segmented",
  component: Segmented,
  tags: ["maturity:experimental"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A single-select filter group with a sliding indicator that animates between the pressed button's measured position and width. Disable an option (never hide it) when its bucket is empty, so the control's shape stays stable as data changes. `prefers-reduced-motion` skips the tween; the very first render never animates (no prior position to tween from).",
      },
    },
  },
  args: { options: OPTIONS, value: OPTIONS[0]!.id, onChange: () => {}, ariaLabel: "Show parts" },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Controlled options={OPTIONS} />,
};

export const NoCounts: Story = {
  render: () => (
    <Controlled options={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }]} />
  ),
};
