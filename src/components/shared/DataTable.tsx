import React from 'react';
import { Search } from 'lucide-react';
import TableSkeleton from './TableSkeleton';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
  align?: 'right' | 'center' | 'left';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  actions?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  keyExtractor: (item: T, index: number) => string | number;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  isError = false,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  search,
  actions,
  pagination,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Search and Top Actions Bar */}
      {(search || actions) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {search && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder || 'بحث...'}
                className="w-full h-10 pr-10 pl-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          )}

          {actions && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Main Content State Handling */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={columns.length} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-card">
          <p className="text-destructive font-semibold mb-2">تعذر تحميل البيانات من الخادم</p>
          <p className="text-sm text-muted-foreground mb-4">يرجى التحقق من الاتصال والمحاولة مرة أخرى</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="rounded-xl">
              إعادة المحاولة
            </Button>
          )}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b border-border">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className={cn(
                        'px-5 py-3.5 font-semibold text-right',
                        col.align === 'center' && 'text-center',
                        col.align === 'left' && 'text-left',
                        col.className
                      )}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.map((item, index) => (
                  <tr
                    key={keyExtractor(item, index)}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((col, cIdx) => (
                      <td
                        key={cIdx}
                        className={cn(
                          'px-5 py-4 align-middle text-foreground',
                          col.align === 'center' && 'text-center',
                          col.align === 'left' && 'text-left',
                          col.className
                        )}
                      >
                        {col.cell
                          ? col.cell(item, index)
                          : col.accessor
                          ? (item[col.accessor] as any)
                          : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-border/60 bg-card/60">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
