import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu, ChevronDown, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import useThemeStore from '@/store/useThemeStore';
import { useLogout } from '@/features/auth/hooks/useAuthMutations';

interface TopNavbarProps {
  onMenuClick: () => void;
  onToggleCollapse?: () => void;
}

export default function TopNavbar({ onMenuClick, onToggleCollapse }: TopNavbarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useThemeStore();
  const { mutate: logout } = useLogout();

  return (
    <header className="topbar-glass flex h-16 shrink-0 items-center justify-between gap-3 px-4 md:px-6 sticky top-0 z-30 border-b border-border/40 bg-card/80 backdrop-blur-md">
      {/* Menu toggle buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-xl hover:bg-muted"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
            title="طي / توسيع القائمة"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          aria-label="تبديل المظهر"
          className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border/60 mx-1" />

        {/* User dropdown */}
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {user?.name || 'مدير النظام'}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {user?.role === 'super_admin'
                    ? 'مدير عام'
                    : user?.role === 'admin'
                    ? 'مشرف'
                    : 'مراقب'}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-2xl border shadow-lg mt-1 p-1.5">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground p-2">
              <p className="text-foreground font-semibold text-sm">{user?.name || 'مدير النظام'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email || 'admin@nexora.com'}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/dashboard/profile')}
              className="gap-2.5 cursor-pointer rounded-xl py-2 px-2.5 text-sm"
            >
              <User className="h-4 w-4 text-primary" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive gap-2.5 cursor-pointer rounded-xl py-2 px-2.5 text-sm focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
