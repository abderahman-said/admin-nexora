import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavigationItem } from './sidebar.config';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarNavItemProps {
  item: NavigationItem;
  collapsed: boolean;
  badgeCount?: number;
  onNavigate?: () => void;
}

export function SidebarNavItem({
  item,
  collapsed,
  badgeCount,
  onNavigate,
}: SidebarNavItemProps) {
  const location = useLocation();

  const isActive =
    item.href === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(item.href);

  const linkContent = (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={cn(
        'group relative flex h-9.5 items-center rounded-xl transition-all duration-150 text-xs font-medium outline-none select-none',
        collapsed ? 'justify-center px-0 w-10 mx-auto' : 'px-3',
        isActive
          ? 'bg-primary-subtle text-primary font-semibold shadow-2xs'
          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-[0.98]'
      )}
    >
      <item.icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition-colors',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground group-hover:text-foreground'
        )}
        strokeWidth={isActive ? 2 : 1.75}
      />

      {!collapsed && (
        <span className="ms-3 truncate flex-1 text-xs">{item.name}</span>
      )}

      {/* Numeric Badge when expanded */}
      {!collapsed && badgeCount !== undefined && (
        <span className="ms-auto px-1.5 py-0.5 rounded-full bg-warning-subtle text-warning-foreground border border-warning/20 text-[10px] font-bold tabular-nums">
          {badgeCount}
        </span>
      )}

      {/* Indicator dot when collapsed with badge */}
      {collapsed && badgeCount !== undefined && (
        <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-warning ring-2 ring-card" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent
          side="left"
          className="text-xs flex items-center gap-1.5 font-medium shadow-elevated"
        >
          <span>{item.name}</span>
          {badgeCount !== undefined && (
            <span className="px-1.5 py-0.2 rounded-md bg-warning text-white text-[10px] font-bold">
              {badgeCount}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return <div>{linkContent}</div>;
}

export default SidebarNavItem;
