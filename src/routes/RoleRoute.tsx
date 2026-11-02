import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { UserRole } from '@/features/auth/types/auth.types';
import toast from 'react-hot-toast';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export default function RoleRoute({
  children,
  allowedRoles,
  redirectTo = '/dashboard',
}: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const userRole = (user?.role as UserRole) || 'observer';

  if (!allowedRoles.includes(userRole)) {
    toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة');
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
