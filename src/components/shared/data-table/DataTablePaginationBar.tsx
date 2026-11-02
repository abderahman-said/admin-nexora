import Pagination from '../Pagination';

interface DataTablePaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataTablePaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: DataTablePaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="p-3 border-t border-border/60 bg-card/60 flex items-center justify-between flex-wrap gap-2">
      <span className="text-[11px] text-muted-foreground px-2">
        صفحة <span className="font-semibold text-foreground">{currentPage}</span> من{' '}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </span>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="pt-0"
      />
    </div>
  );
}

export default DataTablePaginationBar;
