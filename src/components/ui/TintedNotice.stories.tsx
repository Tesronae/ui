import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import { TintedNotice } from "./TintedNotice";

// Promoted from IMS-web's auth-only `AuthNotice` (`Patterns/Auth Notice`
// there) — this is the one place to see all four tones, both layouts, and
// their per-tone entrance/dismiss motion together. Also picked up by the
// package's own every-story axe/pageerror sweep.
const meta = {
  title: "Components/Tinted Notice",
  component: TintedNotice,
  tags: ["maturity:experimental"],
  decorators: [(Story) => <div className="ims-story-surface"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "A tinted-surface banner — background, border and icon all carry the tone color together — for a state that is itself the point (a completed action, a session/connectivity notice, a stock alert), not a supporting aside. Distinct from `Notice`, which keeps a neutral surface plus a 3px edge stripe. `layout=\"stacked\"` (default) is a bordered icon chip with the action below the body; `layout=\"inline\"` is a bare tone-colored icon with the action beside the body. Plays a one-shot mount animation per tone, honors `prefers-reduced-motion`, and can be dismissed via an optional `onDismiss`.",
      },
    },
  },
  args: {
    title: "Inventory update",
    children: "The stock information has been refreshed.",
  },
} satisfies Meta<typeof TintedNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Warning: Story = {
  args: {
    tone: "warn",
    title: "Low stock",
    children: "This part is below its reorder level.",
    action: <Button size="sm" onClick={fn()}>Review</Button>,
  },
};

export const Negative: Story = {
  args: {
    tone: "neg",
    title: "Out of stock",
    children: "Nothing remains available to sell.",
    action: <Button size="sm" onClick={fn()}>Reorder</Button>,
  },
};

export const Positive: Story = {
  args: {
    tone: "pos",
    title: "Signed out",
    children: "You have been signed out of your account.",
    onDismiss: fn(),
  },
};

export const Inline: Story = {
  args: {
    tone: "neg",
    layout: "inline",
    title: "3 items are showing negative stock",
    children: "Denso cabin filter DCF-TY01 is at −1 pc; Bosch air filter S0128 is at −2 pc.",
    action: <Button size="sm" onClick={fn()}>Review item</Button>,
  },
};

export const Compact: Story = { args: { tone: "neg", layout: "compact", title: "Stock discrepancy", children: "The recorded quantity disagrees with the shelf. Count the stock to correct it." } };
