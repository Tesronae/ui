import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Icon } from "../Icon";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["maturity:stable"],
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Danger" },
};

export const Small: Story = {
  args: { size: "sm", children: "Compact" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

export const IconOnly: Story = {
  args: {
    icon: true,
    "aria-label": "Close",
    children: <Icon name="x" />,
  },
};

export const AllVariants: Story = {
  args: { children: "Primary" },
  render: () => (
    <div className="ims-story-row">
      <Button variant="primary">Primary</Button>
      <Button>Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button size="sm">Compact</Button>
      <Button disabled>Disabled</Button>
      <Button icon aria-label="Close">
        <Icon name="x" />
      </Button>
    </div>
  ),
};
