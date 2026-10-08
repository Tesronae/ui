import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../Icon";
import { Button } from "./Button";
import { Sheet } from "./Sheet";

function Demo({ floating = false, longContent = false }: { floating?: boolean; longContent?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet
        presentation={floating ? "floating" : "edge"}
        headerLeading={floating ? <Icon name="box" size={24} /> : undefined}
        open={open}
        onClose={() => setOpen(false)}
        title="Amaron N150"
        description="BAT-AMR-N150 · Main Store"
        footer={<Button variant="primary">Save</Button>}
      >
        <p>Sheet body content goes here — figures strip, scale visual, accordion action rows.</p>
        {longContent ? Array.from({ length: 30 }, (_, i) => <p key={i}>Long content row {i + 1}: the header and actions stay visible while this body scrolls.</p>) : null}
      </Sheet>
    </>
  );
}

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["maturity:candidate"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A generic scrim + edge-anchored panel: a right-side inset panel at ≥721px, a bottom sheet below it, with drag-to-dismiss on touch (skipped under reduced motion), Escape to close, and a focus trap. Domain content stays with the consumer — pair with `AccordionRow` for an action list in the body.",
      },
    },
  },
  args: { open: true, onClose: () => {}, title: "Title", children: null },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Demo /> };

export const Floating: Story = { render: () => <Demo floating /> };
export const FloatingLongContent: Story = { render: () => <Demo floating longContent /> };
