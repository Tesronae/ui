import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline";

const meta = {
  title: "Components/Charts/Sparkline",
  component: Sparkline,
  parameters: { layout: "centered" },
  args: { values: [3, 5, 4, 7, 6, 8, 7] },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

