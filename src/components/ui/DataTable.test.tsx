// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type Column } from "./DataTable";

interface Row {
  id: string;
  name: string;
  onHand: number;
  severity?: "warn" | "neg";
}

const ROWS: Row[] = [
  { id: "p1", name: "Amaron battery", onHand: 3, severity: "neg" },
  { id: "p2", name: "Oil filter", onHand: 48 },
];

const COLUMNS: Column<Row>[] = [
  { key: "name", label: "Part", render: (r) => r.name },
  { key: "onHand", label: "On hand", align: "end", sortable: true, render: (r) => String(r.onHand) },
];

describe("DataTable", () => {
  it("renders a header cell per column and a row per record", () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} />);
    expect(screen.getByRole("columnheader", { name: "Part" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "On hand" })).toBeInTheDocument();
    expect(screen.getByText("Amaron battery")).toBeInTheDocument();
    expect(screen.getByText("Oil filter")).toBeInTheDocument();
  });

  it("stamps every cell with data-l for the prototype's pure-CSS stacked-card technique", () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} />);
    const cell = screen.getByText("Amaron battery").closest("td");
    expect(cell).toHaveAttribute("data-l", "Part");
  });

  it("reflects sort state via aria-sort and calls onSort when a sortable header is clicked", async () => {
    const onSort = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(r) => r.id}
        sortColumn="onHand"
        sortDirection="desc"
        onSort={onSort}
      />,
    );
    const sortableHeader = screen.getByRole("columnheader", { name: "On hand" });
    expect(sortableHeader).toHaveAttribute("aria-sort", "descending");
    expect(screen.getByRole("columnheader", { name: "Part" })).not.toHaveAttribute("aria-sort");

    await userEvent.click(sortableHeader);
    expect(onSort).toHaveBeenCalledWith("onHand");
  });

  it("marks a severity row so the CSS can apply the inset edge, without a full-row fill", () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} rowSeverity={(r) => r.severity} />);
    const negRow = screen.getByText("Amaron battery").closest("tr");
    const okRow = screen.getByText("Oil filter").closest("tr");
    expect(negRow?.className).toMatch(/neg/i);
    expect(okRow?.className ?? "").not.toMatch(/warn|neg/i);
  });

  it("calls onRowClick with the record when a row is clicked, if provided", async () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText("Oil filter"));
    expect(onRowClick).toHaveBeenCalledWith(ROWS[1]);
  });
});
