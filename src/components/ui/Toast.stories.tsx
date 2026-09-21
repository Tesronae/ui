import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Toast } from "./Toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: { layout: "centered" },
  args: {
    open: true,
    message: "Stock out recorded",
    durationMs: 60_000,
    onDismiss: fn(),
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithUndo: Story = {
  args: {
    actionLabel: "Undo",
    onAction: fn(),
  },
};

