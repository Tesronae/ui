import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TextField } from "./TextField";

const meta = {
  title: "Components/Text Field",
  component: TextField,
  tags: ["maturity:stable"],
  decorators: [(Story) => <div className="ims-story-field"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "The base labeled text input — label, hint, and error message are all wired to the input via `aria-describedby`/`aria-invalid` automatically, so a consumer only needs to supply `label` and, when invalid, `errorMessage`. `hint` and `errorMessage` are mutually exclusive in the rendered output: an invalid field with both set shows only the error. Pass `inputRef` when the consumer needs to imperatively focus the field (e.g. after a validation failure) rather than reaching into the DOM.",
      },
    },
  },
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

