import React from 'react';
import { Search, Eye, Rows } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Column } from '../DataTable';

interface DataTableToolbarProps<T> {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  density: 'comfortable' | 'compact';
  onToggleDensity: () => void;
  columns: Column<T>[];
  hiddenColumnIndices: number[];
  onToggleColumnVisibility: (colIdx: number) => void;
  actions?: React.ReactNode;
}

export function DataTableToolbar<T>({
  search,
  density,
  onToggleDensity,
  columns,
  hiddenColumnIndices,
  onToggleColumnVisibility,
  actions,
}: DataTableToolbarProps<T>) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      <div className="flex items-center gap-2 flex-1">
        {search && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder || 'بحث في القائمة...'}
              className="h-9.5 ps-9 pe-3 text-xs"
            />
          </div>
        )}

        {/* Density Toggle Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleDensity}
          className="h-9.5 px-2.5 rounded-xl border-border text-muted-foreground hover:text-foreground hidden md:flex items-center gap-1.5"
          title={`تغيير الكثافة: حالياً ${
            density === 'comfortable' ? 'مريح' : 'مضغوط'
          }`}
        >
          <Rows className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">
            {density === 'comfortable' ? 'مريح' : 'مضغوط'}
          </span>
        </Button>

        {/* Column Visibility Menu */}
        {columns.length > 3 && (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9.5 px-2.5 rounded-xl border-border text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1.5"
                title="تخصيص الأعمدة"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">الأعمدة</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 rounded-xl p-1 shadow-elevated"
            >
              <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 text-foreground">
                إظهار وإخفاء الأعمدة
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {columns.map((col, idx) => (
                <DropdownMenuCheckboxItem
                  key={idx}
                  checked={!hiddenColumnIndices.includes(idx)}
                  onCheckedChange={() => onToggleColumnVisibility(idx)}
                  className="text-xs cursor-pointer rounded-lg py-1.5 px-2"
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export default DataTableToolbar;
