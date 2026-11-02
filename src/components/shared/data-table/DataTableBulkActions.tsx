import React from 'react';

interface DataTableBulkActionsProps {
  selectedCount: number;
  bulkActions?: React.ReactNode;
}

export function DataTableBulkActions({
  selectedCount,
  bulkActions,
}: DataTableBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-primary-subtle border border-primary/20 text-xs animate-fade-in shadow-xs">
      <div className="flex items-center gap-2 text-primary font-semibold">
        <span>تم تحديد {selectedCount} عنصر</span>
      </div>
      {bulkActions && (
        <div className="flex items-center gap-2">
          {bulkActions}
        </div>
      )}
    </div>
  );
}

export default DataTableBulkActions;
