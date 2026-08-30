import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';

const CTASection = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  // FIX: was a hardcoded to="/dashboard" on the authenticated Button below —
  // same class of bug as AboutCTA. getPostAuthPath() handles role + email
  // verification in one place.
  const authedLink = user ? getPostAuthPath(user) : '/dashboard';

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: isDark ? 'var(--bg-body)' : 'var(--primary-orange)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(232, 122, 32, 0.05)' : 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(232, 122, 32, 0.05)' : 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="text-center">
          <Col xs={12}>
            <h2
              style={{
                color: isDark ? 'var(--text-secondary)' : 'var(--text-light)',
                fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease',
              }}
            >
              {isAuthenticated ? 'مرحباً بعودتك إلى بصمة' : 'انضم إلى مجتمع بصمة اليوم'}
            </h2>

            <p
              style={{
                color: isDark ? 'var(--text-muted)' : 'var(--bg-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '2rem',
                opacity: 0.9,
                transition: 'color 0.3s ease',
              }}
            >
              {isAuthenticated
                ? 'استكشف لوحة التحكم وتابع إعلاناتك ونشاطاتك'
                : 'آلاف المستخدمين يثقون ببصمة - انضم إليهم الآن'}
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              {isAuthenticated ? (
                <Button
                  as={Link as any}
                  to={authedLink}
                  className="rounded-pill fw-bold"
                  style={{
                    backgroundColor: 'var(--text-light)',
                    borderColor: 'var(--text-light)',
                    color: 'var(--primary-orange)',
                    padding: 'clamp(12px, 1.5vw, 16px) clamp(32px, 4vw, 56px)',
                    fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--text-light)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                >
                  لوحة التحكم
                </Button>
              ) : (
                <Button
                  as={Link as any}
                  to="/register"
                  className="rounded-pill fw-bold"
                  style={{
                    backgroundColor: isDark ? 'var(--primary-orange)' : 'var(--text-light)',
                    borderColor: isDark ? 'var(--primary-orange)' : 'var(--text-light)',
                    color: isDark ? 'var(--text-light)' : 'var(--primary-orange)',
                    padding: 'clamp(12px, 1.5vw, 16px) clamp(32px, 4vw, 56px)',
                    fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                    transition: 'all 0.3s ease',
                    boxShadow: isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    if (isDark) {
                      e.currentTarget.style.backgroundColor = 'var(--primary-orange-dark)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    } else {
                      e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    }
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'var(--primary-orange)' : 'var(--text-light)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                >
                  سجل الآن
                </Button>
              )}

              <Button
                as={Link as any}
                to="/announcements"
                className="rounded-pill fw-bold"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: isDark ? 'var(--primary-orange)' : 'var(--text-light)',
                  color: isDark ? 'var(--primary-orange)' : 'var(--text-light)',
                  padding: 'clamp(12px, 1.5vw, 16px) clamp(32px, 4vw, 56px)',
                  fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                  borderWidth: '2px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(232, 122, 32, 0.15)' : 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                تصفح الإعلانات
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;
