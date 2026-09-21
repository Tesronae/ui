import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { TextField } from "./TextField";

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["maturity:stable"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Centered dialog for a focused single task (create/edit forms, confirmations). Focuses the first interactive field on open and closes on `Escape` or a backdrop click; `role=\"dialog\"`/`aria-modal=\"true\"`/`aria-labelledby` are wired automatically from `title`. `footer` is the action-button slot — put `Button`s there, not inside `children`, so layout stays consistent across every modal. Ships no i18n: `closeLabel` defaults to plain English \"Close\" and expects the consuming app to pass its own translated string.",
      },
    },
  },
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

