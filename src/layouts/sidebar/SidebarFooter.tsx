import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="p-2.5 border-t border-border bg-sidebar shrink-0">
      {!collapsed ? (
        <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-foreground truncate">
                النظام متصل
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                v1.0 SaaS Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/dashboard/settings"
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="الإعدادات"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center p-2 rounded-xl bg-muted/40 border border-border/60 cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            <span>النظام متصل ونشط (v1.0)</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export default SidebarFooter;
