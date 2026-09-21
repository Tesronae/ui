import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Chip } from "./Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["maturity:stable"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A pressable, boolean-toggle filter chip (`aria-pressed`) — for one-tap category/status filters, not for navigation or anything that isn't a toggle. Keep content to a short label (one or two words): there's no icon slot and no truncation handling, so long text wraps or overflows the pill shape.",
      },
    },
  },
  args: { children: "In stock", onClick: fn() },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = { args: { pressed: false } };
export const Selected: Story = { args: { pressed: true } };

