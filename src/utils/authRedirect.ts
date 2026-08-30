import type { User } from '../types';

/**
 * Where does this role's dashboard live. Doesn't consider verification —
 * use getPostAuthPath() for the full "where should this user land" logic.
 */
export const getDashboardPath = (role?: User['role'] | null): string => {
  return role === 'admin' ? '/admin/dashboard' : '/dashboard';
};

/**
 * The single source of truth for "where should an authenticated user go
 * right now" — factoring in BOTH email verification and role. Used by:
 *  - AuthContext, right after register/login/verifyEmail
 *  - the "already logged in, skip this page" guards on /login, /register,
 *    /forgot-password, /reset-password
 *  - the Navbar's "لوحة التحكم" link
 *  - any CTA button that offers "go to your dashboard" when authenticated
 *
 * Centralizing this is what prevents the bug where each of those places
 * hardcoded its own /dashboard and fought with the others.
 */
export const getPostAuthPath = (
  user: Pick<User, 'role' | 'email_verified_at'>
): string => {
  if (!user.email_verified_at) {
    return '/verify-email';
  }
  return getDashboardPath(user.role);
};
