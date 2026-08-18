import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const CTASection = () => {
  const { isDark } = useTheme();

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: isDark ? '#1a1a2e' : '#E87A20',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Decorative Elements - Adjusted for dark mode */}
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
                color: isDark ? '#FDF5E6' : '#FFFFFF',
                fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease',
              }}
            >
              انضم إلى مجتمع بصمة اليوم
            </h2>

            <p
              style={{
                color: isDark ? '#C49A6C' : '#FDF5E6',
                fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '2rem',
                opacity: 0.9,
                transition: 'color 0.3s ease',
              }}
            >
              آلاف المستخدمين يثقون ببصمة - انضم إليهم الآن
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Button
                as={Link as any}
                to="/register"
                className="rounded-pill fw-bold"
                style={{
                  backgroundColor: isDark ? '#E87A20' : '#FFFFFF',
                  borderColor: isDark ? '#E87A20' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#E87A20',
                  padding: 'clamp(12px, 1.5vw, 16px) clamp(32px, 4vw, 56px)',
                  fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                  transition: 'all 0.3s ease',
                  boxShadow: isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={(e) => {
                  if (isDark) {
                    e.currentTarget.style.backgroundColor = '#D46A1A';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  } else {
                    e.currentTarget.style.backgroundColor = '#FDF5E6';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  }
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#E87A20' : '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)';
                }}
              >
                سجل الآن
              </Button>

              <Button
                as={Link as any}
                to="/announcements"
                className="rounded-pill fw-bold"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: isDark ? '#E87A20' : '#FFFFFF',
                  color: isDark ? '#E87A20' : '#FFFFFF',
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