import type { ReactNode } from "react";

import { EmptySection } from "@/components/PageShell";

export interface Column<Row> {
  header: string;
  render: (row: Row) => ReactNode;
}

interface DataTableProps<Row> {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  emptyTitle: string;
  emptyMessage?: string;
}

export function DataTable<Row>({ columns, rows, rowKey, emptyTitle, emptyMessage }: DataTableProps<Row>) {
  if (rows.length === 0) {
    return <EmptySection title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            {columns.map((column) => (
              <th
                key={column.header}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-900"
            >
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-2.5 align-top text-zinc-700 dark:text-zinc-300">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Plain monochrome text chips for status / visibility values.
export function ValueBadge({ value }: { value: string }) {
  return (
    <span className="inline-block rounded border border-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
      {value}
    </span>
  );
}
