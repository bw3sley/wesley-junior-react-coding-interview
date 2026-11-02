import { Button } from "./ui/button";

interface TablePaginationProps {
  pageIndex: number;
  pageCount: number;
  rowCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function TablePagination({
  pageIndex,
  pageCount,
  rowCount,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
}: TablePaginationProps) {
  return (
    <nav className="table-pagination" aria-label="Table pages">
      <span className="table-pagination__summary">
        Page {pageIndex + 1} of {pageCount} · {rowCount} total
      </span>

      <div className="table-pagination__actions">
        <Button type="button" onClick={onPreviousPage} disabled={!canPreviousPage}>
          Previous
        </Button>

        <Button type="button" onClick={onNextPage} disabled={!canNextPage}>
          Next
        </Button>
      </div>
    </nav>
  );
}
