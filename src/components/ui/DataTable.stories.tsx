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

