import type { Meta, StoryObj } from "@storybook/react-vite";
import { RingGauge } from "./RingGauge";

const meta = {
  title: "Components/Charts/Stock Health Ring",
  component: RingGauge,
  parameters: { layout: "centered" },
  args: {
    segments: [
      { value: 75, color: "--ring-1" },
      { value: 15, color: "--ring-2" },
      { value: 10, color: "--ring-3" },
    ],
    caption: "healthy",
  },
} satisfies Meta<typeof RingGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

