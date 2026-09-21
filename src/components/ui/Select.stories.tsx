import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Select } from "./Select";

const OPTIONS = [
  { value: "battery", label: "Batteries" },
  { value: "filter", label: "Filters" },
  { value: "brake", label: "Brake System" },
];

const meta = {
  title: "Components/Select",
  component: Select,
  decorators: [(Story) => <div className="ims-story-field"><Story /></div>],
  args: {
    value: "",
    options: OPTIONS,
    placeholder: "All categories",
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { value: "filter" },
};

export const Disabled: Story = {
  args: { value: "filter", disabled: true },
};

export const KeyboardSelection: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("button");
    await userEvent.click(trigger);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(args.onChange).toHaveBeenCalledWith("filter");
  },
};

