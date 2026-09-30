import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccordionRow } from "./AccordionRow";

function List() {
  const [openId, setOpenId] = useState<string | null>("reorder");
  const rows = [
    { id: "reorder", title: "Reorder from supplier", summary: "12 units · AED 480" },
    { id: "transfer", title: "Transfer from another branch", summary: "Coming soon" },
  ];
  return (
    <div style={{ display: "grid", gap: 8, width: 360 }}>
      {rows.map((row) => (
        <AccordionRow
          key={row.id}
          title={row.title}
          summary={row.summary}
          open={openId === row.id}
          onToggle={() => setOpenId(openId === row.id ? null : row.id)}
        >
          <p>Row body content goes here — quantity steppers, a CTA, whatever the action needs.</p>
        </AccordionRow>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/AccordionRow",
  component: AccordionRow,
  tags: ["maturity:experimental"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "One collapsible row in an action list — fully controlled (`open`/`onToggle`), so \"one open at a time\" is the caller's own state, not behaviour this component enforces.",
      },
    },
  },
  args: { title: "Reorder", open: true, onToggle: () => {}, children: null },
} satisfies Meta<typeof AccordionRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <List /> };
