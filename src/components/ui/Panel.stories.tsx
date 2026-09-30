import type { Meta, StoryObj } from "@storybook/react-vite";
import { Panel } from "./Panel";

const meta = {
  title: "Components/Panel",
  component: Panel,
  tags: ["maturity:experimental"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A hairline-bordered section surface with a title/header-extra row, a body, and an optional footer — the base a dashboard-style panel sits in. Renders as plain block flow on its own; pair two of them in `PanelPair` for row-synced two-up layout.",
      },
    },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Inventory actions",
    children: <p>Panel body content goes here.</p>,
  },
};

export const WithHeaderExtraAndFooter: Story = {
  args: {
    title: "Not selling",
    headerExtra: <span>12</span>,
    footer: <span>12 items haven't sold in 60+ days</span>,
    children: <p>Panel body content goes here.</p>,
  },
};
