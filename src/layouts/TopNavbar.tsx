import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, PanelLeftClose, PanelLeft } from 'lucide-react';
import useThemeStore from '@/store/useThemeStore';
import LanguageViewToggle from '@/components/shared/LanguageViewToggle';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { TopNavbarUserMenu } from './topbar/TopNavbarUserMenu';

interface TopNavbarProps {
  onMenuClick: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}

export default function TopNavbar({
  onMenuClick,
  onToggleCollapse,
  collapsed,
}: TopNavbarProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="topbar-glass flex h-16 shrink-0 items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-30">
      {/* Start: Menu toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
          onClick={onMenuClick}
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
            title={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            {collapsed ? (
              <PanelLeft className="h-4.5 w-4.5" />
            ) : (
              <PanelLeftClose className="h-4.5 w-4.5" />
            )}
          </Button>
        )}

        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs />
      </div>

      {/* End: Search trigger + Lang + Theme + User Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Bilingual data display mode toggle */}
        <LanguageViewToggle />
        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="تبديل المظهر"
          title={
            theme === 'dark' ? 'التحويل للمظهر الفاتح' : 'التحويل للمظهر الداكن'
          }
          className="h-9 w-9 rounded-xl flex items-center justify-center border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-amber-400" />
          ) : (
            <Moon className="h-4.5 w-4.5" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border mx-0.5" />

        {/* User profile dropdown */}
        <TopNavbarUserMenu />
      </div>
    </header>
  );
}
