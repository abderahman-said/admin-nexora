import { UserRole } from '@/features/auth/types/auth.types';

/**
 * Super admin accounts are view-only for everyone, including the account owner.
 * An admin can manage observers only, and cannot change an admin or a super admin.
 */
export function canManageUser(actorRole: UserRole | undefined, targetRole: UserRole | undefined) {
  if (!actorRole || !targetRole) return false;
  if (targetRole === 'super_admin') return false;
  if (actorRole === 'super_admin') return true;
  if (actorRole === 'admin') return targetRole === 'observer';
  return false;
}
