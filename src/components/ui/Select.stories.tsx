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
  tags: ["maturity:stable"],
  decorators: [(Story) => <div className="ims-story-field"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "Custom listbox dropdown (deliberately not a native `<select>`) with a combobox-style keyboard model: focus stays on the trigger, arrow keys move a visual cursor, Enter commits it — see the `KeyboardSelection` story. Always pass `aria-label` when more than one `Select` sits on a screen without its own visible label, otherwise its accessible name degenerates to just the selected option's text. Options are a flat `{value, label}` list with no built-in search/filter or grouping; filter a long list in the consuming app before passing `options` in.",
      },
    },
  },
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

