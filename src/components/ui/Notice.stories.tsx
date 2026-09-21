import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import { Notice } from "./Notice";

const meta = {
  title: "Components/Notice",
  component: Notice,
  tags: ["maturity:stable"],
  decorators: [(Story) => <div className="ims-story-surface"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "Inline banner for a state that needs explanation, not just a color (stock alerts, sync results). `variant` sets the semantic color (`warn`/`neg`/`pos`; omit for neutral/info) — pick it by meaning, not by which color looks right in context. `action` is an optional single `Button` slot for a direct next step (e.g. \"Review\", \"Reorder\") — don't put more than one action in it. `title` and `children` are both required content: a Notice without a clear one-line title reads as noise.",
      },
    },
  },
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

