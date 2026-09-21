import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

function SkeletonGroup() {
  return (
    <div className="ims-story-column">
      <Skeleton width={240} height={12} />
      <Skeleton width={160} height={10} />
      <Skeleton width={80} height={10} />
    </div>
  );
}

const meta = {
  title: "Components/Skeleton",
  component: SkeletonGroup,
  tags: ["maturity:stable"],
  decorators: [(Story) => <div className="ims-story-field"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "Loading placeholder — the only loading affordance in this system; don't build a second spinner or shimmer pattern for the same purpose. Purely decorative (`aria-hidden`), so pair it with a real `aria-busy`/live-region announcement on the container it's loading into, not on the `Skeleton` itself. Disables its own sweep animation under `prefers-reduced-motion` (see `design/docs/motion.md`) — no extra work needed by the consumer for that case. Preview it with the toolbar's \"Motion: reduced\" control.",
      },
    },
  },
} satisfies Meta<typeof SkeletonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextRows: Story = {};

