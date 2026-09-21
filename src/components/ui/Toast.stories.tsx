import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Toast } from "./Toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  tags: ["maturity:stable"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Transient, auto-dismissing confirmation/undo affordance — mount a fresh `Toast` (a new `key`) per occurrence rather than reopening the same instance, since its countdown does not reset on prop changes by design. `message` is announced via `role=\"status\"`/`aria-live=\"polite\"`, so keep it one complete sentence. `actionLabel`/`onAction` add one action (typically \"Undo\"); it disables re-clicks while `onAction` resolves. Give `durationMs` enough time to notice, read, and act before the toast disappears — longer for anything with an undo action.",
      },
    },
  },
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

