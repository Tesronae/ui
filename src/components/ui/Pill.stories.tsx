import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pill } from "./Pill";

const meta = {
  title: "Components/Pill",
  component: Pill,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { children: "Neutral" },
  render: () => (
    <div className="ims-story-row">
      <Pill>Neutral</Pill>
      <Pill variant="pos">Positive</Pill>
      <Pill variant="warn">Warning</Pill>
      <Pill variant="neg">Negative</Pill>
      <Pill variant="accent">Accent</Pill>
      <Pill variant="outline">Outline</Pill>
    </div>
  ),
};
