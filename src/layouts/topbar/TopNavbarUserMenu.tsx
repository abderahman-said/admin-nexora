import { User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '@/store/useAuthStore';
import { useLogout } from '@/features/auth/hooks/useAuthMutations';

export function TopNavbarUserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-muted transition-colors select-none">
          <div className="relative">
            <div className="h-8.5 w-8.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
          </div>

          <div className="text-start hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight">
              {user?.name || 'مدير النظام'}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
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

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl border border-border shadow-elevated mt-1 p-1"
      >
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground p-2">
          <p className="text-foreground font-semibold text-xs">
            {user?.name || 'مدير النظام'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
            {user?.email || 'admin@nexora.com'}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={() => navigate('/dashboard/profile')}
          className="gap-2.5 cursor-pointer rounded-lg py-2 px-2.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <User className="h-4 w-4 text-primary" />
          <span>الملف الشخصي</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="text-danger gap-2.5 cursor-pointer rounded-lg py-2 px-2.5 text-xs font-medium focus:text-danger focus:bg-danger/10"
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TopNavbarUserMenu;
