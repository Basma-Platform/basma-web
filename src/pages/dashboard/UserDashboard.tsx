import { Container } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <Container>
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid var(--border-color)',
        }}
      >
        <h2
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '0.5rem',
          }}
        >
          مرحباً {user?.name} 👋
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          مرحباً بك في لوحة التحكم. يمكنك من هنا إدارة إعلاناتك ومتابعة نشاطك.
        </p>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(139,90,43,0.03)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
          }}
        >
          <p
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem',
            }}
          >
            🚀 ستبدأ الميزات التفصيلية في Sprint القادم. استمتع بتجربة منصة بصمة!
          </p>
        </div>
      </div>
    </Container>
  );
};

export default UserDashboard;