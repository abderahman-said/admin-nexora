import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Cookies from "js-cookie";

import DashboardLayout from "../layouts/DashboardLayout";
import useAuthStore from "../store/useAuthStore";

// Lazy Pages
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Placeholder = lazy(() => import("../pages/Placeholder"));
const BlogList = lazy(() => import("../pages/blog/BlogList"));
const BlogForm = lazy(() => import("../pages/blog/BlogForm"));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cookieExists = !!Cookies.get('authToken');

  // Security: check BOTH store state AND actual cookie
  if (!isAuthenticated || !cookieExists) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Loading fallback
function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Blog Routes */}
            <Route path="dashboard/blog" element={<BlogList />} />
            <Route path="dashboard/blog/new" element={<BlogForm />} />
            
            <Route path="dashboard/projects" element={<Placeholder title="إدارة المشاريع" />} />
            <Route path="dashboard/services" element={<Placeholder title="إدارة الخدمات" />} />
            <Route path="dashboard/messages" element={<Placeholder title="الرسائل" />} />
            <Route path="dashboard/settings" element={<Placeholder title="إعدادات الموقع" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
