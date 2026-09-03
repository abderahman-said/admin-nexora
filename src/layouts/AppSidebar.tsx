import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  MessageSquare,
  Settings,
  X,
  Zap,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface AppSidebarProps {
  isOpen: boolean;
  collapsed: boolean;
  onToggle: () => void;
}

const navigation: NavigationItem[] = [
  { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { name: "المقالات", href: "/dashboard/blog", icon: FileText, badge: 3 },
  { name: "المشاريع", href: "/dashboard/projects", icon: Briefcase },
  { name: "الخدمات", href: "/dashboard/services", icon: Layers },
  {
    name: "الرسائل",
    href: "/dashboard/messages",
    icon: MessageSquare,
    badge: 5,
  },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

export default function AppSidebar({
  isOpen,
  collapsed,
  onToggle,
}: AppSidebarProps) {
  const location = useLocation();
  const closeOnMobile = () => isOpen && onToggle();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        dir="rtl"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #080e1d 100%)",
        }}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
          "border-l border-white/[0.06]",
          isOpen ? "translate-x-0" : "translate-x-full",
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
          "w-[260px]",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/[0.06] px-4 shrink-0",
            collapsed ? "lg:justify-center" : "justify-between",
          )}
        >
          <Link
            to="/dashboard"
            onClick={closeOnMobile}
            className={cn(
              "flex items-center gap-3 min-w-0",
              collapsed && "lg:hidden",
            )}
          >
            <img
              src="/assets/logo_dark.png"
              alt="Nexora"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Collapsed icon only */}
          {collapsed && (
            <Link to="/dashboard" className="hidden lg:flex">
              <img
                src="/assets/logo_dark.png"
                alt="Nexora"
                className="h-7 w-auto object-contain"
              />
            </Link>
          )}

          {/* Close on mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-widest text-blue-400/50 uppercase">
              القوائم الرئيسية
            </p>
          )}

          <nav className="flex flex-col gap-0.5">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/dashboard" &&
                  location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeOnMobile}
                  title={item.name}
                  className={cn(
                    "group relative flex h-11 items-center rounded-xl px-3 transition-all duration-200",
                    isActive
                      ? "nav-item-active"
                      : "text-slate-400 nav-item-hover hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors",
                      isActive
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-slate-300",
                    )}
                  />

                  <span
                    className={cn(
                      "mr-3 text-sm font-medium transition-all duration-200",
                      collapsed && "lg:hidden",
                    )}
                  >
                    {item.name}
                  </span>

                  {item.badge && !collapsed && (
                    <span className="mr-auto text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded-full px-2 py-0.5 min-w-5 text-center">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && collapsed && (
                    <span className="absolute top-1 left-1 h-2 w-2 rounded-full bg-blue-500 lg:block hidden" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "border-t border-white/[0.06] p-4",
            collapsed && "lg:p-2",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/[0.06]",
              collapsed && "lg:justify-center lg:p-2",
            )}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">
              A
            </div>
            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
              <p className="text-xs font-semibold text-white truncate">
                مدير النظام
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                admin@nexora.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
