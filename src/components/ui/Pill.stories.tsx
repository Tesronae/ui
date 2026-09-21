import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pill } from "./Pill";

const meta = {
  title: "Components/Pill",
  component: Pill,
  tags: ["maturity:stable"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Non-interactive status label (a `<span>`, not a button) — for badges like stock status or category tags where nothing is clickable. If the label needs to be pressable, use `Chip` instead; a click handler on a `Pill` breaks its accessible semantics. `variant` is purely visual grouping (`pos`/`warn`/`neg`/`accent`/`outline`) with no `aria-live` or alert semantics — pair it with `Notice`, not `Pill` alone, when a status change needs to be announced.",
      },
    },
  },
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
