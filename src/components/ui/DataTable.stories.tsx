import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type Column } from "./DataTable";

interface DemoRow {
  id: string;
  name: string;
  onHand: string;
  severity?: "warn" | "neg";
}

const ROWS: DemoRow[] = [
  {
    id: "p1",
    name: "Amaron Hi-Life N150 battery",
    onHand: "3 pc",
    severity: "neg",
  },
  {
    id: "p2",
    name: "Toyota genuine oil filter",
    onHand: "48 pc",
  },
  {
    id: "p3",
    name: "Bosch air filter S0128",
    onHand: "5 pc",
    severity: "warn",
  },
];

const COLUMNS: Column<DemoRow>[] = [
  { key: "name", label: "Part", render: (row) => row.name },
  {
    key: "onHand",
    label: "On hand",
    align: "end",
    sortable: true,
    render: (row) => row.onHand,
  },
];

function TablePreview({ rows = ROWS }: { rows?: DemoRow[] }) {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  return (
    <div className="ims-story-table">
      <DataTable
        columns={COLUMNS}
        rows={rows}
        rowKey={(row) => row.id}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        rowSeverity={(row) => row.severity}
        onSort={(key) => {
          if (sortColumn === key) {
            setSortDirection((current) => current === "asc" ? "desc" : "asc");
          } else {
            setSortColumn(key);
            setSortDirection("asc");
          }
        }}
      />
    </div>
  );
}

const meta = {
  title: "Components/Data Table",
  component: TablePreview,
  tags: ["maturity:stable"],
  parameters: {
    docs: {
      description: {
        component:
          "Sortable, controlled data table for tabular stock/catalog lists. Fully controlled: sort state, its comparator, and row clicks all live with the caller — this component only reflects `sortColumn`/`sortDirection` and reports intent via `onSort`/`onRowClick`; it never sorts data itself. `rowSeverity` drives `warn`/`neg` row styling for low-stock/out-of-stock states — use it instead of inline row styling so severity stays visually consistent across screens. Below a breakpoint it restacks to a card layout (see `MobileStacked`); a column's `label` becomes its stacked-row heading, so keep labels short.",
      },
    },
  },
} satisfies Meta<typeof TablePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { rows: [] },
};

export const MobileStacked: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
};

