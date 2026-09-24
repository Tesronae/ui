import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["maturity:stable"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A single boolean checkbox with a label — consent checkboxes, persistent-session toggles, one-off settings. Not a checkbox group or indeterminate/tri-state control; compose multiple instances for a group.",
      },
    },
  },
  args: { label: "Keep me signed in", checked: false, onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = { args: { checked: false } };
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { checked: false, disabled: true } };
export const Invalid: Story = {
  args: {
    label: "I agree to the terms of service",
    checked: false,
    invalid: true,
    errorMessage: "You must agree to continue.",
  },
};
