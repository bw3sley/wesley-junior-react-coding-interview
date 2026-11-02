import { useMemo } from "react";
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { agents } from "@/data/agents";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { CasePriority, SupportCase } from "@/types/supportCase";
import { MobileTableSort } from "./mobileTableSort";
import { TablePagination } from "./tablePagination";
import { TicketCard, PRIORITY_MAP, STATUS_MAP } from "./ticketCard";
import { Badge } from "./ui/badge";

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

const agentNames = new Map(
  agents.map((agent) => [agent.id, `${agent.firstName} ${agent.lastName}`]),
);

const priorityRank: Record<CasePriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

interface TicketsTableProps {
  tickets: SupportCase[];
  onSelectCase: (supportCase: SupportCase) => void;
}

export function TicketsTable({ tickets, onSelectCase }: TicketsTableProps) {
  const columns = useMemo<ColumnDef<typeof features, SupportCase>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "Ticket",
        sortFn: sortFn_text,
        cell: ({ row }) => (
          <div className="data-table__primary-cell">
            <span className="ticket-card__id">{row.original.id}</span>

            <button
              className="data-table__row-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelectCase(row.original);
              }}
            >
              {row.original.subject}
            </button>
          </div>
        ),
      },
      {
        accessorKey: "customer",
        header: "Customer",
        sortFn: sortFn_text,
      },
      {
        accessorKey: "status",
        header: "Status",
        sortFn: sortFn_text,
        cell: ({ row }) => {
          const status = STATUS_MAP[row.original.status];
          return <Badge variant={status.variant}>{status.label}</Badge>;
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        sortFn: (rowA, rowB) =>
          priorityRank[rowA.original.priority] -
          priorityRank[rowB.original.priority],
        cell: ({ row }) => {
          const priority = PRIORITY_MAP[row.original.priority];
          return <Badge variant={priority.variant}>{priority.label}</Badge>;
        },
      },
      {
        id: "agent",
        accessorFn: (ticket) =>
          ticket.agentId
            ? (agentNames.get(ticket.agentId) ?? ticket.agentId)
            : "Unassigned",
        header: "Agent",
        sortFn: sortFn_text,
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        sortFn: sortFn_datetime,
        cell: ({ row }) => formatRelativeTime(row.original.updatedAt),
      },
    ],
    [onSelectCase],
  );

  const table = useTable({
    key: "tickets",
    features,
    columns,
    data: tickets,
    getRowId: (ticket) => ticket.id,
    enableMultiSort: false,
    enableSortingRemoval: false,
    autoResetPageIndex: true,
    initialState: {
      sorting: [{ id: "updatedAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 20 },
    },
  });

  const pageRows = table.getRowModel().rows;
  const activeSort = table.state.sorting[0] ?? { id: "updatedAt", desc: true };

  return (
    <div className="data-list">
      <MobileTableSort
        options={[
          { id: "subject", label: "Ticket" },
          { id: "customer", label: "Customer" },
          { id: "status", label: "Status" },
          { id: "priority", label: "Priority" },
          { id: "agent", label: "Agent" },
          { id: "updatedAt", label: "Updated" },
        ]}
        columnId={activeSort.id}
        descending={activeSort.desc}
        onChange={(id, desc) => {
          table.setSorting([{ id, desc }]);
          table.setPageIndex(0);
        }}
      />
      <div className="data-table__scroll">
        <table className="data-table data-table--tickets">
          <caption className="sr-only">Tickets</caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    {!header.isPlaceholder && (
                      <button
                        className="data-table__sort"
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        <span
                          aria-hidden="true"
                          className="data-table__sort-icon"
                        >
                          {header.column.getIsSorted() === "asc"
                            ? "↑"
                            : header.column.getIsSorted() === "desc"
                              ? "↓"
                              : "↕"}
                        </span>
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} onClick={() => onSelectCase(row.original)}>
                {row.getAllCells().map((cell) => (
                  <td key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-list__cards">
        {pageRows.map((row) => (
          <TicketCard
            key={row.id}
            supportCase={row.original}
            onSelect={onSelectCase}
          />
        ))}
      </div>

      <TablePagination
        pageIndex={table.state.pagination.pageIndex}
        pageCount={table.getPageCount()}
        rowCount={table.getRowCount()}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
      />
    </div>
  );
}
