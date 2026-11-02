import { cn } from '@/lib/utils';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { TooltipProvider } from '@/components/ui/tooltip';
import useAuthStore from '@/store/useAuthStore';
import { UserRole } from '@/features/auth/types/auth.types';
import {
  mainNav,
  contentNav,
  adminNav,
  NavigationItem,
} from './sidebar/sidebar.config';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavItem } from './sidebar/SidebarNavItem';
import { SidebarFooter } from './sidebar/SidebarFooter';

interface AppSidebarProps {
  isOpen: boolean;
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({
  isOpen,
  collapsed,
  onToggle,
}: AppSidebarProps) {
  const closeOnMobile = () => isOpen && onToggle();

  const user = useAuthStore((s) => s.user);
  const userRole = (user?.role as UserRole) || 'observer';

  // Query unread messages for real-time notification badge
  const { data: messagesRes } = useMessages();
  const unreadMessagesCount =
    messagesRes?.data?.filter((m) => m.status === 'new').length ?? 0;

  const renderNavGroup = (title: string, items: NavigationItem[]) => {
    const visibleItems = items.filter(
      (item) => !item.roles || item.roles.includes(userRole)
    );

    if (visibleItems.length === 0) return null;

    return (
      <div className="mb-4">
        {!collapsed && (
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground/75 uppercase select-none">
              {title}
            </span>
          </div>
        )}
        <nav className="flex flex-col gap-0.5">
          {visibleItems.map((item) => (
            <SidebarNavItem
              key={item.name}
              item={item}
              collapsed={collapsed}
              badgeCount={
                item.href === '/dashboard/messages' && unreadMessagesCount > 0
                  ? unreadMessagesCount
                  : undefined
              }
              onNavigate={closeOnMobile}
            />
          ))}
        </nav>
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={100}>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      <aside
        dir="rtl"
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex flex-col transition-all duration-200 ease-in-out border-e border-border bg-sidebar text-sidebar-foreground shadow-xs select-none',
          'lg:static lg:z-auto shrink-0',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
          collapsed ? 'lg:w-[68px]' : 'lg:w-[252px]',
          'w-[252px]'
        )}
      >
        <SidebarHeader
          collapsed={collapsed}
          onToggle={onToggle}
          onCloseMobile={closeOnMobile}
        />

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-2">
          {renderNavGroup('الرئيسية والمحتوى', mainNav)}
          <div className="border-t border-border/50 my-2" />
          {renderNavGroup('عناصر الموقع', contentNav)}
          <div className="border-t border-border/50 my-2" />
          {renderNavGroup('النظام والإدارة', adminNav)}
        </div>

        <SidebarFooter collapsed={collapsed} />
      </aside>
    </TooltipProvider>
  );
}
