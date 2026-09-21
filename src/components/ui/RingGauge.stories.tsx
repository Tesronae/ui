import type { Meta, StoryObj } from "@storybook/react-vite";
import { RingGauge } from "./RingGauge";

const meta = {
  title: "Components/Charts/Stock Health Ring",
  component: RingGauge,
  tags: ["maturity:stable"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Segmented ring chart for a single percentage-composition value (e.g. healthy/low/out-of-stock share). Entirely decorative (`aria-hidden`) — `caption` is the only accessible text and must stand on its own without relying on the visual. Percent formatting goes through `Intl.NumberFormat`, so it already adapts to locale; don't pre-format the percentage yourself. A domain-specific wrapper (e.g. IMS-web's own stock-health ring) should compose this rather than this package guessing every consumer's vocabulary for what the ring represents.",
      },
    },
  },
  args: {
    segments: [
      { value: 75, color: "--ring-1" },
      { value: 15, color: "--ring-2" },
      { value: 10, color: "--ring-3" },
    ],
    caption: "healthy",
  },
} satisfies Meta<typeof RingGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

