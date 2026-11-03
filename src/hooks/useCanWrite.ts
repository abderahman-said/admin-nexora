import useAuthStore from '@/store/useAuthStore';
import { UserRole } from '@/features/auth/types/auth.types';

/**
 * Observers browse the platform but never create, edit, toggle or delete anything.
 * Keep every mutating control behind this so read-only mode is consistent app-wide.
 */
export function useCanWrite() {
  const role = useAuthStore((s) => s.user?.role) as UserRole | undefined;
  return role === 'super_admin' || role === 'admin';
}
