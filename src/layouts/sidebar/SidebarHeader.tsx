import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

export function SidebarHeader({
  collapsed,
  onToggle,
  onCloseMobile,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'flex h-16 items-center border-b border-border px-4 shrink-0 bg-sidebar',
        collapsed ? 'lg:justify-center px-2' : 'justify-between'
      )}
    >
      <Link
        to="/dashboard"
        onClick={onCloseMobile}
        className={cn(
          'flex items-center gap-2.5 min-w-0 transition-opacity hover:opacity-90',
          collapsed && 'lg:hidden'
        )}
        title="Nexora Admin Platform"
      >
        {/* Logo in Light Mode */}
        <img
          src="/assets/logo.png"
          alt="Nexora"
          className="h-8.5 w-auto max-w-[150px] object-contain dark:hidden"
        />
        {/* Logo in Dark Mode */}
        <img
          src="/assets/logo_dark.png"
          alt="Nexora"
          className="h-8.5 w-auto max-w-[150px] object-contain hidden dark:block"
        />
      </Link>

      {/* Collapsed Icon Logo */}
      {collapsed && (
        <Link
          to="/dashboard"
          className="hidden lg:flex items-center justify-center p-1 hover:opacity-85 transition-opacity"
          title="Nexora Dashboard"
        >
          <img
            src="/assets/logo.png"
            alt="Nexora"
            className="h-7 w-auto max-w-[40px] object-contain dark:hidden"
          />
          <img
            src="/assets/logo_dark.png"
            alt="Nexora"
            className="h-7 w-auto max-w-[40px] object-contain hidden dark:block"
          />
        </Link>
      )}

      {/* Mobile close button */}
      <button
        onClick={onToggle}
        className="lg:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
        aria-label="إغلاق القائمة"
      >
        <X className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}

export default SidebarHeader;
