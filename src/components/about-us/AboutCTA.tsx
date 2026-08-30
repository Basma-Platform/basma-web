import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';

const AboutCTA = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  // FIX: was `to={isAuthenticated ? '/dashboard' : '/register'}` — hardcoded
  // /dashboard, wrong for admins (and for unverified users, who'd bounce to
  // /verify-email anyway once PrivateRoute caught it). getPostAuthPath()
  // sends everyone to the right place in one step.
  const authedLink = user ? getPostAuthPath(user) : '/dashboard';

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: isDark ? 'var(--bg-body)' : 'var(--primary-orange)',
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <h2
              style={{
                color: isDark ? 'var(--text-secondary)' : 'var(--text-light)',
                fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease',
              }}
            >
              {isAuthenticated ? 'مرحباً بعودتك إلى بصمة' : 'انضم إلى مجتمع بصمة'}
            </h2>

            <p
              style={{
                color: isDark ? 'var(--text-muted)' : 'var(--bg-body)',
                fontSize: '1.1rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '2rem',
                opacity: 0.9,
                transition: 'color 0.3s ease',
              }}
            >
              {isAuthenticated
                ? 'استكشف لوحة التحكم واكتشف المزيد من المزايا'
                : 'كن جزءاً من التغيير وساهم في بناء مجتمع أقوى'}
            </p>

            <Button
              as={Link as any}
              to={isAuthenticated ? authedLink : '/register'}
              className="rounded-pill fw-bold"
              style={{
                backgroundColor: isDark ? 'var(--primary-orange)' : 'var(--text-light)',
                borderColor: isDark ? 'var(--primary-orange)' : 'var(--text-light)',
                color: isDark ? 'var(--text-light)' : 'var(--primary-orange)',
                padding: '14px 48px',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-orange-dark)';
                } else {
                  e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                }
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'var(--primary-orange)' : 'var(--text-light)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)';
              }}
            >
              {isAuthenticated ? 'لوحة التحكم' : 'انضم إلينا الآن'}
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutCTA;
