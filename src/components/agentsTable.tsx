import { useMemo } from "react";
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { SupportAgent, SupportCase } from "@/types/supportCase";
import { AgentCard, SPECIALTY_MAP } from "./agentCard";
import { MobileTableSort } from "./mobileTableSort";
import { TablePagination } from "./tablePagination";
import { Badge } from "./ui/badge";

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

type AgentRow = SupportAgent & { ticketCount: number };

interface AgentsTableProps {
  agents: SupportAgent[];
  tickets: SupportCase[];
}

export function AgentsTable({ agents, tickets }: AgentsTableProps) {
  const rows = useMemo<AgentRow[]>(() => {
    const counts = new Map<string, number>();

    for (const ticket of tickets) {
      if (ticket.agentId) {
        counts.set(ticket.agentId, (counts.get(ticket.agentId) ?? 0) + 1);
      }
    }

    return agents.map((agent) => ({
      ...agent,
      ticketCount: counts.get(agent.id) ?? 0,
    }));
  }, [agents, tickets]);

  const columns = useMemo<ColumnDef<typeof features, AgentRow>[]>(
    () => [
      {
        id: "name",
        accessorFn: (agent) => `${agent.firstName} ${agent.lastName}`,
        header: "Agent",
        sortFn: sortFn_text,
        cell: ({ row }) => (
          <div className="data-table__primary-cell">
            <span className="data-table__primary-text">
              {row.original.firstName} {row.original.lastName}
            </span>
            <span className="data-table__secondary-text">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "specialty",
        header: "Area",
        sortFn: sortFn_text,
        cell: ({ row }) => {
          const specialty = SPECIALTY_MAP[row.original.specialty];
          return <Badge variant={specialty.variant}>{specialty.label}</Badge>;
        },
      },
      {
        accessorKey: "ticketCount",
        header: "Ticket count",
        sortFn: sortFn_basic,
      },
    ],
    [],
  );

  const table = useTable({
    key: "agents",
    features,
    columns,
    data: rows,
    getRowId: (agent) => agent.id,
    enableMultiSort: false,
    enableSortingRemoval: false,
    autoResetPageIndex: true,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      pagination: { pageIndex: 0, pageSize: 20 },
    },
  });

  const pageRows = table.getRowModel().rows;
  const activeSort = table.state.sorting[0] ?? { id: "name", desc: false };

  return (
    <div className="data-list">
      <MobileTableSort
        options={[
          { id: "name", label: "Agent" },
          { id: "specialty", label: "Area" },
          { id: "ticketCount", label: "Ticket count" },
        ]}
        columnId={activeSort.id}
        descending={activeSort.desc}
        onChange={(id, desc) => {
          table.setSorting([{ id, desc }]);
          table.setPageIndex(0);
        }}
      />
      <div className="data-table__scroll">
        <table className="data-table">
          <caption className="sr-only">Agents</caption>
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
                        <span aria-hidden="true" className="data-table__sort-icon">
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
              <tr key={row.id}>
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
          <AgentCard
            key={row.id}
            agent={row.original}
            ticketCount={row.original.ticketCount}
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
