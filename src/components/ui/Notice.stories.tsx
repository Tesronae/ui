import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import { Notice } from "./Notice";

const meta = {
  title: "Components/Notice",
  component: Notice,
  decorators: [(Story) => <div className="ims-story-surface"><Story /></div>],
  args: {
    icon: "info",
    title: "Inventory update",
    children: "The stock information has been refreshed.",
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Warning: Story = {
  args: {
    icon: "alert",
    variant: "warn",
    title: "Low stock",
    children: "This part is below its reorder level.",
    action: <Button size="sm" onClick={fn()}>Review</Button>,
  },
};

export const Negative: Story = {
  args: {
    icon: "alert",
    variant: "neg",
    title: "Out of stock",
    children: "Nothing remains available to sell.",
    action: <Button size="sm" onClick={fn()}>Reorder</Button>,
  },
};

export const Positive: Story = {
  args: {
    icon: "checkcircle",
    variant: "pos",
    title: "Stock received",
    children: "The new balance has been recorded.",
  },
};

