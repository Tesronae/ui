import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { DotField } from "./DotField";

function Surface({ children }: { children: ReactNode }) {
  return (
    <div
      className="ims-story-surface"
      style={{ position: "relative", height: 360, overflow: "hidden", background: "var(--sunken)" }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: "Components/Dot Field",
  component: DotField,
  tags: ["maturity:candidate"],
  decorators: [
    (Story) => (
      <Surface>
        <Story />
      </Surface>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A cursor-repelled dot-grid texture for pre-authentication surfaces (sign-in, sign-up, marketing) — ambient product character, not a state indicator (see `design/docs/motion.md`\'s pre-authentication carve-out; not for authenticated working surfaces). Import: `import { DotField } from "@tesronae/ui"`. Renders as an absolutely-positioned overlay sized to fill its nearest positioned ancestor — place it as the first child of that container. Fully decorative and `aria-hidden`; shows a static CSS dot grid instead of animating on touch devices, under `prefers-reduced-motion`, or when the `reduced` prop is set — move the cursor over the surface below to see the live effect. Preview reduced motion with the toolbar\'s "Motion: reduced" control: that control only forces CSS transition/animation durations to near-zero and cannot stop a requestAnimationFrame loop by itself, so this story wires it to the `reduced` prop directly.',
      },
    },
  },
  args: { gap: 24, radius: 118, push: 26, ease: 0.17 },
} satisfies Meta<typeof DotField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args, context) => <DotField {...args} reduced={context.globals.motion === "reduce"} />,
};

export const Tuning: Story = {
  args: { gap: 32, radius: 160, push: 40, ease: 0.12 },
  render: (args, context) => <DotField {...args} reduced={context.globals.motion === "reduce"} />,
};

export const ReducedMotion: Story = {
  args: { reduced: true },
  parameters: {
    docs: {
      description: {
        story: "The permanent state for touch devices and `prefers-reduced-motion` — a static CSS dot grid, no canvas, no listeners.",
      },
    },
  },
};
