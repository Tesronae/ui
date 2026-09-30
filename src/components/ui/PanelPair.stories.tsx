import type { Meta, StoryObj } from "@storybook/react-vite";
import { Panel } from "./Panel";
import { PanelPair } from "./PanelPair";

const meta = {
  title: "Components/PanelPair",
  component: PanelPair,
  tags: ["maturity:experimental"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Two-up layout for a pair of `Panel`s with row-synced titles/bodies/footers via CSS subgrid — resize the canvas below ~820px to see it degrade to two independently-sized stacked panels.",
      },
    },
  },
  args: { children: null },
} satisfies Meta<typeof PanelPair>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PanelPair>
      <Panel title="Not selling" footer={<span>12 items haven't sold in 60+ days</span>}>
        <p>Short body.</p>
      </Panel>
      <Panel title="Expiring soon" footer={<span>14 items have expiry dates</span>}>
        <p>A taller body with more content in it, to show the footers still align across both panels.</p>
      </Panel>
    </PanelPair>
  ),
};
