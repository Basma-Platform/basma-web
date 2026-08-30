import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

interface PrivateRouteProps {
  roles?: UserRole[];
}

const PrivateRoute = ({ roles }: PrivateRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-body)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div
          className="spinner-border"
          style={{
            color: 'var(--primary-orange)',
            width: '3rem',
            height: '3rem',
          }}
        />
      </div>
    );
  }

  // FIX: no more `token` in context — auth state now lives entirely in the
  // httpOnly session cookie, which JS can't see directly anyway. isAuthenticated
  // + user (both derived from asking the backend) is the whole story now.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.email_verified_at) {
    return (
      <Navigate
        to="/verify-email"
        state={{ email: user.email, showToast: true }}
        replace
      />
    );
  }

  if (!user.is_active) {
    return (
      <Navigate
        to="/login"
        state={{ message: 'حسابك معلق. يرجى التواصل مع الدعم' }}
        replace
      />
    );
  }

  if (roles && !roles.includes(user.role ?? 'user')) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
