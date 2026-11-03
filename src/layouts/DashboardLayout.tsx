import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/layouts/AppSidebar";
import TopNavbar from "@/layouts/TopNavbar";
import OfflineBanner from "@/components/shared/OfflineBanner";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <div className="flex h-dvh overflow-hidden bg-background_main" dir="rtl">
      <AppSidebar
        isOpen={mobileOpen}
        collapsed={collapsed}
        onToggle={toggleMobile}
      />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <OfflineBanner />
        <TopNavbar
          onMenuClick={toggleMobile}
          onToggleCollapse={toggleCollapse}
          collapsed={collapsed}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
