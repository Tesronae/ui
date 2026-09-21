import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";

const meta = {
  title: "Components/Charts/Bar Chart",
  component: BarChart,
  tags: ["maturity:stable"],
  parameters: { layout: "centered" },
  args: { values: [3, 5, 4, 7, 6, 8, 7] },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

