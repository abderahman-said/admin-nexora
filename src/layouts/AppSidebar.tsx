import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  MessageSquare,
  Settings,
  Users,
  Image,
  Award,
  CheckCircle2,
  Users2,
  LayoutTemplate,
  X,
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

const mainNav: NavigationItem[] = [
  { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { name: "الخدمات", href: "/dashboard/services", icon: Layers },
  { name: "المشاريع", href: "/dashboard/projects", icon: Briefcase },
  { name: "المقالات", href: "/dashboard/blog", icon: FileText },
  { name: "الرسائل", href: "/dashboard/messages", icon: MessageSquare },
];

const contentNav: NavigationItem[] = [
  { name: "خطوات العمل", href: "/dashboard/work-steps", icon: CheckCircle2 },
  { name: "فريق العمل", href: "/dashboard/team", icon: Users2 },
  { name: "آراء العملاء", href: "/dashboard/testimonials", icon: Award },
  { name: "أقسام الصفحات", href: "/dashboard/page-sections", icon: LayoutTemplate },
];

const adminNav: NavigationItem[] = [
  { name: "المستخدمين", href: "/dashboard/users", icon: Users },
  { name: "مكتبة الوسائط", href: "/dashboard/media", icon: Image },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

export default function AppSidebar({
  isOpen,
  collapsed,
  onToggle,
}: AppSidebarProps) {
  const location = useLocation();
  const closeOnMobile = () => isOpen && onToggle();

  const renderNavGroup = (title: string, items: NavigationItem[]) => (
    <div className="mb-4">
      {!collapsed && (
        <p className="mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400/70 uppercase">
          {title}
        </p>
      )}
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeOnMobile}
              title={item.name}
              className={cn(
                "group relative flex h-10 items-center rounded-xl px-3 transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-white"
                )}
              />
              {!collapsed && (
                <span className="mr-3 truncate flex-1">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        dir="rtl"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #080e1d 100%)",
        }}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-l border-white/[0.08]",
          isOpen ? "translate-x-0" : "translate-x-full",
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
          "w-[260px]"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/[0.08] px-4 shrink-0",
            collapsed ? "lg:justify-center" : "justify-between"
          )}
        >
          <Link
            to="/dashboard"
            onClick={closeOnMobile}
            className={cn(
              "flex items-center gap-3 min-w-0 font-bold text-lg text-white",
              collapsed && "lg:hidden"
            )}
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-sm">
              N
            </div>
            <span className="tracking-wide">Nexora Admin</span>
          </Link>

          {collapsed && (
            <Link to="/dashboard" className="hidden lg:flex">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">
                N
              </div>
            </Link>
          )}

          <button
            onClick={onToggle}
            className="lg:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {renderNavGroup("الرئيسية والمحتوى", mainNav)}
          {renderNavGroup("عناصر الموقع", contentNav)}
          {renderNavGroup("النظام والإدارة", adminNav)}
        </div>
      </aside>
    </>
  );
}
