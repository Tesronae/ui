import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TextField } from "./TextField";

const meta = {
  title: "Components/Text Field",
  component: TextField,
  decorators: [(Story) => <div className="ims-story-field"><Story /></div>],
  args: {
    label: "Supplier name",
    value: "",
    onChange: fn(),
    placeholder: "e.g. Al Quoz Auto Spares",
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { value: "Al Quoz Auto Spares" },
};

export const WithHint: Story = {
  args: { hint: "Use the name shown on supplier invoices." },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    errorMessage: "Enter a supplier name.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: "Al Quoz Auto Spares" },
};

