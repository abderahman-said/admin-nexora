import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  User, LogOut, Menu, ChevronDown,
  Bell, Search, Moon, Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { useState } from 'react';

interface TopNavbarProps {
  onMenuClick: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [dark, setDark] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="topbar-glass flex h-16 shrink-0 items-center gap-3 px-4 md:px-6 sticky top-0 z-30">
      
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 rounded-xl hover:bg-muted"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Bell className="h-[18px] w-[18px]" />
          </button>
          {/* Badge */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
                             <img src="/assets/logo.png" alt="Nexora" className="h-9 w-9 object-contain rounded-full border-1 bg-gray-100 p-1 border-gray-300  " />

              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground leading-tight">{user?.name || 'مدير النظام'}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">{user?.role || 'مدير'}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 rounded-xl border shadow-lg mt-1">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pb-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">{user?.name || 'مدير النظام'}</p>
                  <p className="text-[10px]">{user?.email || 'admin@nexora.com'}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive gap-2 cursor-pointer focus:text-destructive focus:bg-destructive/10"
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
