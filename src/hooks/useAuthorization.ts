import { useAuth } from './useAuth';
import { getDashboardPath } from '../utils/authRedirect';
import type { UserRole } from '../types';

export type Permission =
  | 'access_admin_dashboard'
  | 'access_user_dashboard'
  | 'create_announcement'
  | 'create_unlimited_announcements'
  | 'comment_on_announcement'
  | 'rate_user'
  | 'upload_id_for_verification'
  | 'moderate_content';

const hasPermission = (
  role: UserRole,
  isIdVerified: boolean,
  permission: Permission
): boolean => {
  switch (permission) {
    case 'access_admin_dashboard':
    case 'moderate_content':
      return role === 'admin';

    case 'access_user_dashboard':
      return role === 'user';

    case 'create_announcement':
      return role === 'user';

    case 'create_unlimited_announcements':
      return role === 'user' && isIdVerified;

    case 'comment_on_announcement':
    case 'rate_user':
      return role === 'user' || role === 'admin';

    case 'upload_id_for_verification':
      return role === 'user' && !isIdVerified;

    default:
      return false;
  }
};

export const useAuthorization = () => {
  const { user } = useAuth();

  const role: UserRole = user?.role ?? 'user';
  const isIdVerified = !!user?.is_verified;
  const isEmailVerified = !!user?.email_verified_at;

  return {
    role,
    isAdmin: role === 'admin',
    isRegularUser: role === 'user',
    isIdVerified,
    isEmailVerified,
    // NEW: "where is my dashboard" — use this instead of hardcoding
    // /dashboard anywhere in the UI (nav links, CTA buttons, etc.).
    dashboardPath: getDashboardPath(role),
    can: (permission: Permission) => hasPermission(role, isIdVerified, permission),
  };
};

export default useAuthorization;
