import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import TableSkeleton from './TableSkeleton';
import EmptyState from './EmptyState';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCanWrite } from '@/hooks/useCanWrite';
import { DataTableToolbar } from './data-table/DataTableToolbar';
import { DataTableBulkActions } from './data-table/DataTableBulkActions';
import { DataTablePaginationBar } from './data-table/DataTablePaginationBar';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
  align?: 'right' | 'center' | 'left';
  hideable?: boolean;
  /** Hidden for roles that cannot mutate data (observer). */
  writeOnly?: boolean;
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
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selected: (string | number)[]) => void;
  bulkActions?: React.ReactNode;
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
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  bulkActions,
}: DataTableProps<T>) {
  const canWrite = useCanWrite();

  // Density state: 'comfortable' (default) vs 'compact'
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Column visibility state (store index of visible columns)
  const [hiddenColumnIndices, setHiddenColumnIndices] = useState<number[]>([]);

  const toggleColumnVisibility = (colIdx: number) => {
    setHiddenColumnIndices((prev) =>
      prev.includes(colIdx) ? prev.filter((i) => i !== colIdx) : [...prev, colIdx]
    );
  };

  const visibleColumns = columns.filter(
    (col, idx) => !hiddenColumnIndices.includes(idx) && (canWrite || !col.writeOnly)
  );

  // Selection helpers
  const allSelected =
    Boolean(data && data.length > 0) &&
    data?.every((item, idx) => selectedIds.includes(keyExtractor(item, idx)));

  const handleSelectAll = () => {
    if (!data || !onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      const allIds = data.map((item, idx) => keyExtractor(item, idx));
      onSelectionChange(allIds);
    }
  };

  const handleToggleRow = (id: string | number) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Top Search, Controls, and Actions Bar */}
      <DataTableToolbar
        search={search}
        density={density}
        onToggleDensity={() =>
          setDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'))
        }
        columns={columns}
        hiddenColumnIndices={hiddenColumnIndices}
        onToggleColumnVisibility={toggleColumnVisibility}
        actions={actions}
      />

      {/* Bulk Select Floating Bar */}
      {selectable && (
        <DataTableBulkActions
          selectedCount={selectedIds.length}
          bulkActions={bulkActions}
        />
      )}

      {/* Main Table Content */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={columns.length} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-2xl bg-card shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-danger-subtle text-danger flex items-center justify-center mb-3">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <p className="text-foreground font-semibold text-sm mb-1">
            تعذر تحميل البيانات من الخادم
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            يرجى التحقق من اتصالك والمحاولة مرة أخرى
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
            >
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
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto relative">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-xs text-muted-foreground text-[11px] font-semibold border-b border-border select-none uppercase tracking-wider">
                <tr>
                  {selectable && (
                    <th className="w-10 px-4 py-3 text-start">
                      <input
                        type="checkbox"
                        checked={Boolean(allSelected)}
                        onChange={handleSelectAll}
                        className="rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
                        aria-label="تحديد الكل"
                      />
                    </th>
                  )}
                  {visibleColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className={cn(
                        'px-4 py-3 font-semibold text-start text-foreground/80',
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
                {data.map((item, index) => {
                  const itemId = keyExtractor(item, index);
                  const isRowSelected = selectedIds.includes(itemId);

                  return (
                    <tr
                      key={itemId}
                      className={cn(
                        'hover:bg-muted/40 transition-colors group',
                        isRowSelected && 'bg-primary-subtle/40'
                      )}
                    >
                      {selectable && (
                        <td className="w-10 px-4 py-3 text-start">
                          <input
                            type="checkbox"
                            checked={isRowSelected}
                            onChange={() => handleToggleRow(itemId)}
                            className="rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
                            aria-label="تحديد العنصر"
                          />
                        </td>
                      )}
                      {visibleColumns.map((col, cIdx) => (
                        <td
                          key={cIdx}
                          className={cn(
                            'align-middle text-foreground transition-all',
                            density === 'comfortable'
                              ? 'px-4 py-3.5'
                              : 'px-4 py-2.5',
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && (
            <DataTablePaginationBar
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
