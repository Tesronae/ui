"use client";

import type { ReactNode } from "react";
import { Icon } from "../Icon";
import styles from "./DataTable.module.css";

export interface Column<Row> {
  key: string;
  label: string;
  align?: "start" | "end";
  sortable?: boolean;
  render: (row: Row) => ReactNode;
}

// Controlled: sort state and its comparator live with the caller (this
// keeps the table reusable and testable in isolation), this component only
// reflects sortColumn/sortDirection and reports clicks via onSort.
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  sortColumn,
  sortDirection,
  onSort,
  rowSeverity,
  onRowClick,
}: {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (columnKey: string) => void;
  rowSeverity?: (row: Row) => "warn" | "neg" | undefined;
  onRowClick?: (row: Row) => void;
}) {
  return (
    <table className={styles.tbl}>
      <thead>
        <tr>
          {columns.map((column) => {
            const isSorted = column.key === sortColumn;
            const ariaSort = isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : undefined;
            return (
              <th
                key={column.key}
                className={[column.sortable ? styles.sortable : "", column.align === "end" ? styles.num : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-sort={ariaSort}
                onClick={column.sortable && onSort ? () => onSort(column.key) : undefined}
              >
                {column.label}
                {column.sortable ? <Icon name="sort" size={12} /> : null}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const severity = rowSeverity?.(row);
          const rowClassName = [
            severity === "warn" ? styles.rowWarn : "",
            severity === "neg" ? styles.rowNeg : "",
            onRowClick ? styles.tap : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <tr
              key={rowKey(row)}
              className={rowClassName || undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} data-l={column.label} className={column.align === "end" ? styles.num : undefined}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
