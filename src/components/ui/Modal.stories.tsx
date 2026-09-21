import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { TextField } from "./TextField";

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    onClose: fn(),
    title: "Add supplier",
    description: "Create a supplier for this organization.",
    children: <TextField label="Supplier name" value="" onChange={fn()} />,
    footer: (
      <div className="ims-story-row">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

