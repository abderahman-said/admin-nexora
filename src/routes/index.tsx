import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Cookies from "js-cookie";

import DashboardLayout from "../layouts/DashboardLayout";
import useAuthStore from "../store/useAuthStore";
import { AUTH_COOKIE_NAME } from "@/api/client";

// Lazy Pages
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Auth & Profile
const ProfilePage = lazy(() => import("@/features/auth/pages/ProfilePage"));

// Services
const ServicesListPage = lazy(() => import("@/features/services/pages/ServicesListPage"));
const ServiceFormPage = lazy(() => import("@/features/services/pages/ServiceFormPage"));

// Projects
const ProjectsListPage = lazy(() => import("@/features/projects/pages/ProjectsListPage"));
const ProjectFormPage = lazy(() => import("@/features/projects/pages/ProjectFormPage"));

// Posts / Blog
const PostsListPage = lazy(() => import("@/features/posts/pages/PostsListPage"));
const PostFormPage = lazy(() => import("@/features/posts/pages/PostFormPage"));

// Messages
const MessagesListPage = lazy(() => import("@/features/messages/pages/MessagesListPage"));

// Content Management
const WorkStepsPage = lazy(() => import("@/features/content/pages/WorkStepsPage"));
const TeamMembersPage = lazy(() => import("@/features/content/pages/TeamMembersPage"));
const TestimonialsPage = lazy(() => import("@/features/content/pages/TestimonialsPage"));
const PageSectionsPage = lazy(() => import("@/features/content/pages/PageSectionsPage"));

// Users & Roles
const UsersListPage = lazy(() => import("@/features/users/pages/UsersListPage"));

// Media & Settings
const MediaPage = lazy(() => import("@/features/media/pages/MediaPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cookieExists = !!Cookies.get(AUTH_COOKIE_NAME);

  if (!isAuthenticated || !cookieExists) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background" dir="rtl">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">جاري التحميل...</p>
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
            <Route path="dashboard/profile" element={<ProfilePage />} />

            {/* Services */}
            <Route path="dashboard/services" element={<ServicesListPage />} />
            <Route path="dashboard/services/new" element={<ServiceFormPage />} />
            <Route path="dashboard/services/:id/edit" element={<ServiceFormPage />} />

            {/* Projects */}
            <Route path="dashboard/projects" element={<ProjectsListPage />} />
            <Route path="dashboard/projects/new" element={<ProjectFormPage />} />
            <Route path="dashboard/projects/:id/edit" element={<ProjectFormPage />} />

            {/* Blog / Posts */}
            <Route path="dashboard/blog" element={<PostsListPage />} />
            <Route path="dashboard/blog/new" element={<PostFormPage />} />
            <Route path="dashboard/blog/:id/edit" element={<PostFormPage />} />

            {/* Messages */}
            <Route path="dashboard/messages" element={<MessagesListPage />} />

            {/* Content Management */}
            <Route path="dashboard/work-steps" element={<WorkStepsPage />} />
            <Route path="dashboard/team" element={<TeamMembersPage />} />
            <Route path="dashboard/testimonials" element={<TestimonialsPage />} />
            <Route path="dashboard/page-sections" element={<PageSectionsPage />} />

            {/* Users */}
            <Route path="dashboard/users" element={<UsersListPage />} />

            {/* Media & Settings */}
            <Route path="dashboard/media" element={<MediaPage />} />
            <Route path="dashboard/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
