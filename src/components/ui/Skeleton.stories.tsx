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
} satisfies Meta<typeof SkeletonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextRows: Story = {};

